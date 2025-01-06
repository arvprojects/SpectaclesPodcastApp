from Models.User import User
from Repositories.UserRepository import UserRepository
from flask import current_app as app
import boto3
from Schemas.UserSchema import UserSchema
user_schema = UserSchema()
class UserService:
    
    
    @staticmethod
    def create_user(user_instance):
        app.logger.info(f"This is user_instance{user_instance}")
        user_instance = UserService.fill_credentials(user_instance)
        app.logger.info(f"This is user_instance{user_instance}")
        user_instance=user_schema.load(user_instance)
        UserRepository.add_user(user_instance)
        return user_instance

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
    
    @staticmethod
    def fill_credentials(user_instance):
        app.logger.info(f"This is user_instance after fill_credentials{user_instance}")
        # Ensure spectacles_device_id exists
        if not user_instance['spectacles_device_id']:
            raise ValueError("Spectacles device ID is required for provisioning.")

        # AWS IoT Setup
        iot_client = boto3.client("iot", region_name="us-east-2")  # Replace with your AWS region
        app.logger.info('Its getting here')
        iot_endpoint = "a1smxj2i6r5ldy-ats.iot.us-east-2.amazonaws.com"  # Replace with your IoT endpoint

        # Provision IoT Thing
        thing_name = f"Spectacle-{user_instance['spectacles_device_id']}"
        cert_response = iot_client.create_keys_and_certificate(setAsActive=True)
        app.logger.info(f'this is cert response{cert_response}')
        certificate_arn = cert_response["certificateArn"]
        app.logger.info(f'this is cert arn{certificate_arn}')
        certificate_pem = cert_response["certificatePem"]
        app.logger.info(f'this is cert pem{certificate_pem}')
        private_key = cert_response["keyPair"]["PrivateKey"]
        app.logger.info('Its getting after this')

        # Attach Policy
        iot_client.attach_policy(
            policyName="SpectaclesPolicy", target=certificate_arn
        )

        # Attach Certificate to Thing
        iot_client.create_thing(thingName=thing_name)
        iot_client.attach_thing_principal(
            thingName=thing_name, principal=certificate_arn
        )

        # Populate the user_instance with IoT credentials
        user_instance['thing_name'] = thing_name
        user_instance['certificate_arn'] = certificate_arn
        user_instance['certificate_pem'] = certificate_pem
        user_instance['private_key'] = private_key
        user_instance['iot_endpoint'] = iot_endpoint

        return user_instance