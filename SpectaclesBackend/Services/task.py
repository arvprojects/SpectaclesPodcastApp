from celery import shared_task
import time
from flask import current_app
from Services.SpotifyService import SpotifyService
import json
from redbeat import RedBeatSchedulerEntry
from celery import current_app as celery_app
from Controllers.socketio_instance import socketio


@shared_task(ignore_result=True)
def poll_playback(user_metadata, podcast_metadata,schedule_name):


    current_app.logger.info(f"Polling playback for user ID: {user_metadata['id']} and podcast ID: {podcast_metadata['id']}")
    playback_progress,refreshed = SpotifyService.get_playback_progress_with_token(user_metadata['spotify_auth_code'],user_metadata['spotify_refresh_token'],user_metadata['id'],user_metadata['spectacles_device_id'])

    # Check if the playback timestamp matches any of the media timestamps
    from Services.MediaService import MediaService
    MediaService.check_media_timestamps(playback_progress, podcast_metadata['media'],user_metadata['spectacles_device_id'])
    current_app.logger.info(f"Playback progress: {playback_progress} for schedule_name: {schedule_name}")

    #if the auth token was refresehd, we need to reset the scheudle to use the new user metadata
    if refreshed:
        current_app.logger.info('Access token updated rescheduling schedule...')
        MediaService.reset_schedule(user_metadata['spectacles_device_id'],podcast_metadata)

        

    