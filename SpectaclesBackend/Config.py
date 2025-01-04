from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

class Config:
    PLATFORM_BACKEND_URL = os.getenv('PLATFORM_BACKEND_URL')
    SPOTIFY_CLIENT_ID = os.getenv('SPOTIFY_CLIENT_ID')
    SPOTIFY_CLIENT_SECRET = os.getenv('SPOTIFY_CLIENT_SECRET')

    CELERY_CONFIG = {
        'broker_url': os.getenv('CELERY_BROKER_URL', 'redis://localhost:6379/0'),
        'result_backend': os.getenv('CELERY_RESULT_BACKEND', 'redis://localhost:6379/0'),
        'task_ignore_result': True,
    }

    
