from flask_marshmallow import Marshmallow
from Models.CapturedMoment import CapturedMoment
ma=Marshmallow()
class CapturedMomentSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = CapturedMoment
        load_instance = True
        include_fk = True  # Includes foreign key fields in the schema