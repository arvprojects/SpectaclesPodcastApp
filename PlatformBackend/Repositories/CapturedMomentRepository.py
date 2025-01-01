from Models.CapturedMoment import CapturedMoment
from Models import db

class CapturedMomentRepository:
    @staticmethod
    def add_captured_moment(captured_moment):
        db.session.add(captured_moment)
        db.session.commit()

    @staticmethod
    def get_all_captured_moments():
        return CapturedMoment.query.all()

    @staticmethod
    def get_captured_moment_by_id(captured_moment_id):
        return CapturedMoment.query.get(captured_moment_id)

    @staticmethod
    def update_captured_moment(captured_moment):
        db.session.commit()

    @staticmethod
    def delete_captured_moment(captured_moment):
        db.session.delete(captured_moment)
        db.session.commit()