from Models.Media import Media
from Models import db

class MediaRepository:
    @staticmethod
    def add_media(media):
        db.session.add(media)
        db.session.commit()

    @staticmethod
    def get_all_media():
        return Media.query.all()

    @staticmethod
    def get_media_by_id(media_id):
        return Media.query.get(media_id)

    @staticmethod
    def update_media(media):
        db.session.commit()

    @staticmethod
    def delete_media(media):
        db.session.delete(media)
        db.session.commit()