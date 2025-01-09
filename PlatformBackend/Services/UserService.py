from Models.User import User
from Repositories.UserRepository import UserRepository
from flask import current_app as app
from Schemas.UserSchema import UserSchema

user_schema = UserSchema()
class UserService:

    
    @staticmethod
    def create_user(user_instance):
        user_data = user_schema.load(user_instance)
        UserRepository.add_user(user_data)
        return user_data

    @staticmethod
    def get_users():
        return UserRepository.get_all_users()

    @staticmethod
    def get_user(user_id):
        return UserRepository.get_user_by_id(user_id)
    
    @staticmethod
    def get_user_by_name(name):
        return UserRepository.get_user_by_name(name)
    
    @staticmethod
    def get_user_by_spectacles_id(spectacles_device_id):
        return UserRepository.get_user_by_spectacles_id(spectacles_device_id)
    



    @staticmethod
    def update_user(id, user_instance):
        user = UserRepository.get_user_by_id(id)
        if user:
            user.name = user_instance.name
            user.spectacles_device_id = user_instance.spectacles_device_id
            user.snapchat_username = user_instance.snapchat_username
            user.spotify_auth_code = user_instance.spotify_auth_code
            user.spotify_refresh_token = user_instance.spotify_refresh_token
            user.is_author = user_instance.is_author
            UserRepository.update_user(user)
            return user
        return None

    @staticmethod
    def delete_user(user_id):
        user = UserRepository.get_user_by_id(user_id)
        if user:
            UserRepository.delete_user(user)
            return True
        return False
    