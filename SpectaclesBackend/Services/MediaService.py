import tempfile
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
import ssl
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

        # Write certificates to temporary files
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pem") as cert_file, \
            tempfile.NamedTemporaryFile(delete=False, suffix=".key") as key_file, \
            tempfile.NamedTemporaryFile(delete=False, suffix=".pem") as ca_file:
            
            cert_file.write(user_metadata['certificate_pem'].encode('utf-8'))
            key_file.write(user_metadata['private_key'].encode('utf-8'))
            ca_file.write(open("AmazonRootCA1.pem", "rb").read())  # Assuming AmazonRootCA1.pem exists locally

        cert_file_path = cert_file.name
        key_file_path = key_file.name
        ca_file_path = ca_file.name

        # Configure the MQTT client with paths to the temporary files
        def on_connect(client, userdata, flags, rc):
            current_app.logger.info(f"Connected to broker with result code {rc}")

        def on_publish(client, userdata, mid):
            current_app.logger.info(f"Message {mid} published successfully")

        client = mqtt.Client()
        client.on_connect = on_connect
        client.on_publish = on_publish
        client = mqtt.Client()
        client.tls_set(
            ca_certs=ca_file_path,
            certfile=cert_file_path,
            keyfile=key_file_path,
            cert_reqs=ssl.CERT_REQUIRED,
            tls_version=ssl.PROTOCOL_TLSv1_2
        )
        current_app.logger.info("Publish to broker is being called")
        # Optional: Add authentication or TLS if required
        # client.username_pw_set(username="your-username", password="your-password")
        # client.tls_set("path_to_ca_cert.pem")

        current_app.logger.info(f"this is the payload{payload}")
        current_app.logger.info(f"this is the topic{topic}")
        client.connect(broker_url, 8883, 60)  # Port 1883 for unencrypted MQTT
        
        client.publish(topic, json.dumps(payload))
        current_app.logger.info(f"Published to topic {topic}: {payload}")
        
            # current_app.logger.error(f"Failed to publish to broker: {e}")
        
        client.disconnect()
