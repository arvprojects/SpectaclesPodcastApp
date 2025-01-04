from flask import Blueprint, request
from Services.MediaService import MediaService

media_controller_bp = Blueprint('media_controller', __name__)
media_service = MediaService()

@media_controller_bp.route('/trigger', methods=['POST'])
def trigger():
    data = request.json
    media_service.trigger(data['spectacles_device_id'], data['podcast_id'], data['start'])
    return 'Triggered', 200