from flask_sqlalchemy import SQLAlchemy
import uuid
from Models.User import User
from Models.Podcast import Podcast
from Models import db

class CapturedMoment(db.Model):
    __tablename__ = 'captured_moment'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String(36), db.ForeignKey('user_table.id'), nullable=False)
    podcast_id = db.Column(db.String(36), db.ForeignKey('podcast.id'), nullable=False)
    start_timestamp = db.Column(db.BigInteger)
    end_timestamp = db.Column(db.BigInteger)
    transcript = db.Column(db.Text)
    user = db.relationship('User', backref=db.backref('captured_moments', lazy=True))
    podcast = db.relationship('Podcast', backref=db.backref('captured_moments', lazy=True))

    def __repr__(self):
        return f'<CapturedMoment {self.id}>'