from Models.User import User
from Models import db

class UserRepository:
    @staticmethod
    def add_user(user):
        db.session.add(user)
        db.session.commit()

    @staticmethod
    def get_all_users():
        return User.query.all()

    @staticmethod
    def get_user_by_id(user_id):
        return User.query.get(user_id)

    @staticmethod
    def update_user(user):
        db.session.commit()

    @staticmethod
    def delete_user(user):
        db.session.delete(user)
        db.session.commit()

    @staticmethod
    def get_user_by_name(name):
        return User.query.filter_by(name=name).first()
    
    @staticmethod
    def get_user_by_spectacles_id(spectacles_device_id):
        return User.query.filter_by(spectacles_device_id=spectacles_device_id).first()