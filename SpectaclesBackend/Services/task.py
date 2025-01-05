from celery import shared_task
import time
from flask import current_app
from Services.SpotifyService import SpotifyService
import json
from redbeat import RedBeatSchedulerEntry
from celery import current_app as celery_app

@shared_task(ignore_result=True)
def poll_playback(user_metadata, podcast_metadata,schedule_name):
    current_app.logger.info(f"Polling playback for user ID: {user_metadata['id']} and podcast ID: {podcast_metadata['id']}")
    playback = SpotifyService.get_playback(user_metadata['spectacles_device_id'])
    playback_progress = playback['progress_ms']

    # Check if the playback timestamp matches any of the media timestamps
    from Services.MediaService import MediaService
    MediaService.check_media_timestamps(playback_progress, podcast_metadata['media'], user_metadata)

    current_app.logger.info(f"Playback progress: {playback_progress}for schedule_name: {schedule_name}")

    