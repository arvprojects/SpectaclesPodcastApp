import requests
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
                SpotifyService.start_playing(user_metadata['spectacles_device_id'],podcast_metadata['spotify_podcast_identifier'],podcast_metadata['start_at'])
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
    
    #when an auth token is updated, we need to stop the current schedule and resubmit it wiht the updated token
    def reset_schedule(spectacles_device_id,podcast_metadata):
        current_app.logger.info(f"Resetting schedule for device ID: {spectacles_device_id}")
        MediaService.stop_polling(spectacles_device_id)
        user_metadata = PlatformBackendService.get_user_metadata_by_spectacles(spectacles_device_id)
        MediaService.start_polling(user_metadata, podcast_metadata)

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
    def check_media_timestamps(playback_timestamp, media_list,spectacles_device_id):
        from Controllers.MediaController import send_message_to_user
    
        for media in media_list:
            if abs(media['start_timestamp'] - playback_timestamp) <= 2500:
                current_app.logger.info(f"Media start match found: {media['storage_url']}")
                message = {
                "id": media['id'],
                "storage_url": media['storage_url'],
                "start": True
            }
                send_message_to_user(spectacles_device_id, message)

            elif abs(media['end_timestamp'] - playback_timestamp) <= 2500:
                current_app.logger.info(f"Media end match found: {media['storage_url']}")
                message = {
                "id": media['id'],
                "storage_url": media['storage_url'],
                "start": False
            }
                send_message_to_user(spectacles_device_id, message)

    @staticmethod
    def capture_moment(spectacles_device_id, podcast_id):
        current_position_response = SpotifyService.get_playback(spectacles_device_id)
        current_position = current_position_response['progress_ms']
        start_timestamp = max(current_position - 15000, 0)
        end_timestamp = current_position + 15000
        metadata = PlatformBackendService.get_user_metadata_by_spectacles(spectacles_device_id)
        payload = {
            'user_id': metadata['id'],
            'podcast_id': podcast_id,
            'start_timestamp': start_timestamp,
            'end_timestamp': end_timestamp,
            'transcript' : "This is a test transcript",
        }
        url = f"{current_app.config['PLATFORM_BACKEND_URL']}/captured_moments"
        response = requests.post(url, json=payload)
        return response
    
