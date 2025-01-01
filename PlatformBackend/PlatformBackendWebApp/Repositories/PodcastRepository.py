from Models.Podcast import Podcast
from Models import db

class PodcastRepository:
    @staticmethod
    def add_podcast(podcast):
        db.session.add(podcast)
        db.session.commit()

    @staticmethod
    def get_all_podcasts():
        return Podcast.query.all()

    @staticmethod
    def get_podcast_by_id(podcast_id):
        return Podcast.query.get(podcast_id)

    @staticmethod
    def update_podcast(podcast):
        db.session.commit()

    @staticmethod
    def delete_podcast(podcast):
        db.session.delete(podcast)
        db.session.commit()