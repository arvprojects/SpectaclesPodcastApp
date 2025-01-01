from Models.CapturedMoment import CapturedMoment
from Repositories.CapturedMomentRepository import CapturedMomentRepository

class CapturedMomentService:
    @staticmethod
    def create_captured_moment(captured_moment_instance):
        
        CapturedMomentRepository.add_captured_moment(captured_moment_instance)
        return captured_moment_instance

    @staticmethod
    def get_captured_moments():
        return CapturedMomentRepository.get_all_captured_moments()

    @staticmethod
    def get_captured_moment_by_id(captured_moment_id):
        return CapturedMomentRepository.get_captured_moment_by_id(captured_moment_id)

    @staticmethod
    def update_captured_moment(id,captured_moment_instance):
        captured_moment = CapturedMomentRepository.get_captured_moment_by_id(id)
        if captured_moment:
            captured_moment.user_id = captured_moment_instance.user_id
            captured_moment.podcast_id = captured_moment_instance.podcast_id
            captured_moment.timestamp = captured_moment_instance.timestamp
            captured_moment.transcript = captured_moment_instance.transcript
            CapturedMomentRepository.update_captured_moment(captured_moment)
            return captured_moment
        return None

    @staticmethod
    def delete_captured_moment(captured_moment_id):
        captured_moment = CapturedMomentRepository.get_captured_moment_by_id(captured_moment_id)
        if captured_moment:
            CapturedMomentRepository.delete_captured_moment(captured_moment)
            return True
        return False