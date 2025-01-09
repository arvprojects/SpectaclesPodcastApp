from flask_marshmallow import Marshmallow
from marshmallow import fields, post_dump
from Models.Podcast import Podcast
from Schemas.MediaSchema import MediaSchema

ma = Marshmallow()
class PodcastSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Podcast
        load_instance = True
        include_fk = True  # Includes foreign key fields in the schema

    media = fields.Method("get_media")

#add podcasts for authors 
    def get_media(self, obj):
        return MediaSchema(many=True).dump(obj.media) #returns the media of the podcast as a json