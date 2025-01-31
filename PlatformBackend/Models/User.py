import datetime
from flask_sqlalchemy import SQLAlchemy
import uuid
from Models import db
from datetime import datetime
class User(db.Model):
    __tablename__ = 'user_table'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    spectacles_device_id = db.Column(db.String(255))
    snapchat_username = db.Column(db.String(255))
    name = db.Column(db.String(255))
    spotify_auth_code = db.Column(db.String(255))
    spotify_refresh_token = db.Column(db.String(255))
    is_author = db.Column(db.Boolean, default=False)

    def __repr__(self):
        return f'<User {self.name}>'
    
    def __init__(self, spectacles_device_id, snapchat_username, name, spotify_auth_code, 
                 spotify_refresh_token, is_author=False):
        self.spectacles_device_id = spectacles_device_id
        self.snapchat_username = snapchat_username
        self.name = name
        self.spotify_auth_code = spotify_auth_code
        self.spotify_refresh_token = spotify_refresh_token
        self.is_author = is_author
        