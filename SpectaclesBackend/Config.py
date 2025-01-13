from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

class Config:
    PLATFORM_BACKEND_URL = os.getenv('PLATFORM_BACKEND_URL')
    SPOTIFY_CLIENT_ID = os.getenv('SPOTIFY_CLIENT_ID')
    SPOTIFY_CLIENT_SECRET = os.getenv('SPOTIFY_CLIENT_SECRET')
    SPECTACLES_BACKEND_URL = os.getenv('SPECTACLES_BACKEND_URL')

    CELERY_CONFIG = {
        'broker_url': os.getenv('CELERY_BROKER_URL', ''),
        'result_backend': os.getenv('CELERY_RESULT_BACKEND', ''),
        'task_ignore_result': True,
        'redbeat_lock_key': None,
        'redbeat_redis_url': os.getenv('REDBEAT_REDIS_URL', '')
    }
    
