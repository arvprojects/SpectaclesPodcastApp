from Services.PlatformBackendService import PlatformBackendService
from Services.SpotifyService import SpotifyService
from celery import current_app as celery_app
from flask import current_app
from celery.schedules import schedule
from Services.task import poll_playback
from redbeat import RedBeatSchedulerEntry
from redbeat.schedules import rrule
from datetime import datetime
import paho.mqtt.client as mqtt
import json
import boto3
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
        interval = schedule(run_every=15)  # seconds
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
    def check_media_timestamps(playback_timestamp, media_list, user_metadata):
        for media in media_list:
            if abs(media['start_timestamp'] - playback_timestamp) <= 2500:
                current_app.logger.info(f"Media start match found: {media['storage_url']}")
                # Publish start message to the message broker
                MediaService.publish_to_broker(
                    user_metadata['spectacles_device_id'],  
                    {
                        
                        "MediaId": media['id'],  # Unique identifier for the media
                        "mediaUrl": media['storage_url'],  # URL to media storage or webview
                        "activate": True
                    },
                    user_metadata
                )
            elif abs(media['end_timestamp'] - playback_timestamp) <= 2500:
                current_app.logger.info(f"Media end match found: {media['storage_url']}")
                # Publish stop message to the message broker
                MediaService.publish_to_broker(
                    user_metadata['spectacles_device_id'],  # Assuming this is available in `media`
                    {
                        "MediaId": media['id'],  # Unique identifier for the media
                        "activate": False
                    },
                    user_metadata
                )
    @staticmethod
    def publish_to_broker(spectacles_device_id, payload, user_metadata):
        broker_url = "a1smxj2i6r5ldy-ats.iot.us-east-2.amazonaws.com"  # Replace with your MQTT broker URL
        topic = f"spectacles/{spectacles_device_id}/media"


        client = boto3.client('iot-data', 'us-east-2')
        current_app.logger.info("Publish to broker is being called")

        # Publish the message
        try:
            response = client.publish(
                topic=topic,
                qos=1,  # Quality of Service level
                payload=json.dumps(payload)
            )
            print(f"Message published to {topic}: {payload}")
            print("AWS IoT Response:", response)
        except Exception as e:
            print(f"Failed to publish message: {e}")
       

        current_app.logger.info(f"this is the payload{payload}")
        current_app.logger.info(f"this is the topic{topic}")
