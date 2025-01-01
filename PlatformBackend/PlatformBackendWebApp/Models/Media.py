from flask_sqlalchemy import SQLAlchemy
import uuid
from Models.Podcast import Podcast
from Models import db

class Media(db.Model):
    __tablename__ = 'media'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = db.Column(db.String(255), nullable=False)
    podcast_id = db.Column(db.String(36), db.ForeignKey('podcast.id'), nullable=False)
    start_timestamp = db.Column(db.BigInteger)
    end_timestamp = db.Column(db.BigInteger)
    storage_url = db.Column(db.String(255))
    podcast = db.relationship('Podcast', backref=db.backref('media', lazy=True))

    def __repr__(self):
        return f'<media {self.name}>'
    
    def __init__(self, name, podcast_id, start_timestamp=None, end_timestamp=None, storage_url=None):
        self.id = str(uuid.uuid4())
        self.name = name
        self.podcast_id = podcast_id
        self.start_timestamp = start_timestamp
        self.end_timestamp = end_timestamp
        self.storage_url = storage_url