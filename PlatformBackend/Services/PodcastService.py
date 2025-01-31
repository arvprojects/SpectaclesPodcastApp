from Models.Podcast import Podcast
from Repositories.PodcastRepository import PodcastRepository

class PodcastService:
    @staticmethod
    def create_podcast(podcast_instance):
        PodcastRepository.add_podcast(podcast_instance)
        return podcast_instance

    @staticmethod
    def get_podcasts():
        return PodcastRepository.get_all_podcasts()

    @staticmethod
    def get_podcast(podcast_id):
        return PodcastRepository.get_podcast_by_id(podcast_id)

    @staticmethod
    def update_podcast(id, podcast_instance):
        podcast = PodcastRepository.get_podcast_by_id(id)
        if podcast:
            podcast.name = podcast_instance.name
            podcast.podcast_author_id = podcast_instance.podcast_author_id
            podcast.spotify_podcast_identifier = podcast_instance.spotify_podcast_identifier
            podcast.start_at = podcast_instance.start_at
            PodcastRepository.update_podcast(podcast)
            return podcast
        return None

    @staticmethod
    def delete_podcast(podcast_id):
        podcast = PodcastRepository.get_podcast_by_id(podcast_id)
        if podcast:
            PodcastRepository.delete_podcast(podcast)
            return True
        return False