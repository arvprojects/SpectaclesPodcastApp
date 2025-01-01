from flask_marshmallow import Marshmallow
from Models.Media import Media
ma = Marshmallow()
class MediaSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Media
        load_instance = True
        include_fk = True  # Includes foreign key fields in the schema