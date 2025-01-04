from Services.PlatformBackendService import PlatformBackendService
from Services.SpotifyService import SpotifyService
from celery import current_app as celery_app
from flask import current_app
from celery.schedules import schedule
from Services.task import poll_playback
from redbeat import RedBeatSchedulerEntry
from redbeat.schedules import rrule
from datetime import datetime
import json
class MediaService:
    @staticmethod
    def trigger(spectacles_device_id, podcast_id, start):
        current_app.logger.info(f"Triggering media for device ID: {spectacles_device_id} and podcast ID: {podcast_id}")
        if start:
            user_metadata = PlatformBackendService.get_user_metadata_by_spectacles(spectacles_device_id)
            podcast_metadata = PlatformBackendService.get_podcast_metadata(podcast_id)
           
            if user_metadata and podcast_metadata:
                MediaService.start_polling(user_metadata, podcast_metadata)
        else:
            MediaService.stop_polling(spectacles_device_id)

    
    def start_polling(user_metadata, podcast_metadata):
        schedule_name = user_metadata['spectacles_device_id']
        dt = datetime.now()
        interval = schedule(run_every=5)  # seconds
        current_app.logger.info(f"Starting polling for user ID: {user_metadata['id']} and podcast ID: {podcast_metadata['id']}")
        entry = RedBeatSchedulerEntry(schedule_name,"Services.task.poll_playback",
                                      interval, args=[user_metadata, podcast_metadata],
                                      kwargs={"schedule_name": schedule_name},
                                      app=celery_app)
        entry.save()
    

    @staticmethod
    def stop_polling(spectacles_device_id):

        try:
            entry = RedBeatSchedulerEntry.from_key("redbeat:"+spectacles_device_id,app=celery_app)
        except:
            current_app.logger.info(f"Entry not found")
    
        if entry:
            entry.delete()

        current_app.logger.info(f"Stopping polling for device ID: {spectacles_device_id}")
    

    @staticmethod
    def check_media_timestamps(playback_timestamp, media_list):
        for media in media_list:
            if abs(media['start_timestamp'] - playback_timestamp) <= 2500:
                current_app.logger.info(f"Media start match found: {media['storage_url']}")
            elif abs(media['end_timestamp'] - playback_timestamp) <= 2500:
                current_app.logger.info(f"Media end match found: {media['storage_url']}")
