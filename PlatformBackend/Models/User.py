import datetime
from flask_sqlalchemy import SQLAlchemy
import uuid
from Models import db

class User(db.Model):
    __tablename__ = 'user_table'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    spectacles_device_id = db.Column(db.String(255))
    snapchat_username = db.Column(db.String(255))
    name = db.Column(db.String(255))
    spotify_auth_code = db.Column(db.String(255))
    spotify_refresh_token = db.Column(db.String(255))
    is_author = db.Column(db.Boolean, default=False)

    thing_name = db.Column(db.String(255))
    certificate_arn = db.Column(db.String(255))
    certificate_pem = db.Column(db.Text)
    private_key = db.Column(db.Text)
    iot_endpoint = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=datetime.datetime.now())
    updated_at = db.Column(db.DateTime, default=datetime.datetime.now())

    def __repr__(self):
        return f'<User {self.name}>'
    
    def __init__(self,
        spectacles_device_id,
        snapchat_username,
        name,
        spotify_auth_code,
        spotify_refresh_token,
        is_author=False,
        thing_name=None,
        certificate_arn=None,
        certificate_pem=None,
        private_key=None,
        iot_endpoint=None,
        created_at=None,
        updated_at=None):
            self.spectacles_device_id = spectacles_device_id
            self.snapchat_username = snapchat_username
            self.name = name
            self.spotify_auth_code = spotify_auth_code
            self.spotify_refresh_token = spotify_refresh_token
            self.is_author = is_author
            self.thing_name = thing_name
            self.certificate_arn = certificate_arn
            self.certificate_pem = certificate_pem
            self.private_key = private_key
            self.iot_endpoint = iot_endpoint
            self.created_at = created_at or datetime.datetime.now()
            self.updated_at = updated_at or datetime.datetime.now()