from flask import Blueprint, request, jsonify,current_app
from Services.SpotifyService import SpotifyService
spotify_controller_bp = Blueprint('spotify_controller', __name__)

@spotify_controller_bp.route('/playback', methods=['GET'])
def get_playback():
    spectacles_device_id = request.args.get('spectacles_device_id')
    current_app.logger.info(f"Getting playback for device ID: {spectacles_device_id}")

    playback = SpotifyService.get_playback(spectacles_device_id)
    return jsonify(playback)

@spotify_controller_bp.route('/play', methods=['PUT'])
def play():
    spectacles_user_id = request.args.get('spectacles_device_id')
    status_code = SpotifyService.play(spectacles_user_id)
    return ('', status_code)

@spotify_controller_bp.route('/pause', methods=['PUT'])
def pause():
    spectacles_user_id = request.args.get('spectacles_device_id')
    status_code = SpotifyService.pause(spectacles_user_id)
    return ('', status_code)

@spotify_controller_bp.route('/seek/forward', methods=['PUT'])
def seek_forward():
    spectacles_user_id = request.args.get('spectacles_device_id')
    milliseconds = int(request.args.get('milliseconds', 10000))  # Default to 10 seconds
    status_code = SpotifyService.seek_forward(spectacles_user_id, milliseconds)
    return ('', status_code)

@spotify_controller_bp.route('/seek/backward', methods=['PUT'])
def seek_backward():
    spectacles_user_id = request.args.get('spectacles_device_id')
    milliseconds = int(request.args.get('milliseconds', 10000))  # Default to 10 seconds
    status_code = SpotifyService.seek_backward(spectacles_user_id, milliseconds)
    return ('', status_code)