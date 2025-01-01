from Models.Media import Media
from Repositories.MediaRepository import MediaRepository

class MediaService:
    @staticmethod
    def create_media(media_instance):
        
        MediaRepository.add_media(media_instance)
        return media_instance

    @staticmethod
    def get_media():
        return MediaRepository.get_all_media()

    @staticmethod
    def get_media_by_id(media_id):
        return MediaRepository.get_media_by_id(media_id)

    @staticmethod
    def update_media(id,media_instance):
        media = MediaRepository.get_media_by_id(id)
        if media:
            media.name = media_instance.name
            media.podcast_id = media_instance.podcast_id
            media.start_timestamp = media_instance.start_timestamp
            media.end_timestamp = media_instance.end_timestamp
            media.storage_url = media_instance.storage_url
            MediaRepository.update_media(media)
            return media
        return None

    @staticmethod
    def delete_media(media_id):
        media = MediaRepository.get_media_by_id(media_id)
        if media:
            MediaRepository.delete_media(media)
            return True
        return False