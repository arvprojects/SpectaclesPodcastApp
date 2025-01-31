import requests
from flask import current_app

class PlatformBackendService:
    @staticmethod
    def get_user_metadata(user_id):
        platform_url = current_app.config['PLATFORM_BACKEND_URL']
        response = requests.get(f'{platform_url}/users/{user_id}')
        if response.status_code == 200:
            return response.json()
        else:
            current_app.logger.error(f"Failed to fetch user metadata: {response.status_code} {response.text}")
            return None
        
    @staticmethod
    def get_user_metadata_by_spectacles(spectacles_device_id):
        platform_url = current_app.config['PLATFORM_BACKEND_URL']
        response = requests.get(f'{platform_url}/users/device/{spectacles_device_id}')
        if response.status_code == 200:
            return response.json()
        else:
            current_app.logger.error(f"Failed to fetch user metadata: {response.status_code} {response.text}")
            return None

    @staticmethod
    def get_podcast_metadata(podcast_id):
        platform_url = current_app.config['PLATFORM_BACKEND_URL']
        response = requests.get(f'{platform_url}/podcasts/{podcast_id}')
        if response.status_code == 200:
            return response.json()
        else:
            current_app.logger.error(f"Failed to fetch podcast metadata: {response.status_code} {response.text}")
            return None
        
    @staticmethod
    def get_podcasts_metadata():
        platform_url = current_app.config['PLATFORM_BACKEND_URL']
        response = requests.get(f'{platform_url}/podcasts')
        if response.status_code == 200:
            return response.json()
        else:
            current_app.logger.error(f"Failed to fetch podcasts metadata: {response.status_code} {response.text}")
            return None