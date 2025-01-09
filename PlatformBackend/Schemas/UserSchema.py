from flask_marshmallow import Marshmallow
from marshmallow import fields, post_dump
from Models.User import User
from Schemas.PodcastSchema import PodcastSchema
from Schemas.CapturedMomentSchema import CapturedMomentSchema
ma = Marshmallow()

class UserSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = User
        load_instance = True

    podcasts = fields.Method("get_podcasts")
    captured_moments = fields.Method("get_captured_moments")


#add podcasts for authors 
    def get_podcasts(self, obj):
            if obj.is_author:
                return PodcastSchema(many=True).dump(obj.podcasts) #returns the podcasts of the author as a json
            return []
    
    def get_captured_moments(self, obj):
        return CapturedMomentSchema(many=True).dump(obj.captured_moments) #returns the captured moments of the user as a json