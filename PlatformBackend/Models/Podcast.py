from flask_sqlalchemy import SQLAlchemy
import uuid
from Models.User import User
from Models import db

class Podcast(db.Model):
    __tablename__ = 'podcast'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = db.Column(db.String(255), nullable=False)
    podcast_author_id = db.Column(db.String(36), db.ForeignKey('user_table.id'), nullable=False)
    author = db.relationship('User', backref=db.backref('podcasts', lazy=True))
    spotify_podcast_identifier = db.Column(db.String(36),nullable=False)
    start_at = db.Column(db.BigInteger)

    def __repr__(self):
        return f'<podcast {self.name}>'
    
    def __init__(self, name, podcast_author_id):
        self.name = name
        self.podcast_author_id = podcast_author_id