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
    if status_code==400:
        return ('Error pausing', 400)
    return ('', status_code)

@spotify_controller_bp.route('/seek/forward', methods=['PUT'])
def seek_forward():
    spectacles_user_id = request.args.get('spectacles_device_id')
    milliseconds = int(request.args.get('milliseconds', 10000))  # Default to 10 seconds
    status_code = SpotifyService.seek_forward(spectacles_user_id, milliseconds)
    if status_code==400:
        return ('Error seeking forward', 400)
    return ('', status_code)

@spotify_controller_bp.route('/seek/backward', methods=['PUT'])
def seek_backward():
    spectacles_user_id = request.args.get('spectacles_device_id')
    milliseconds = int(request.args.get('milliseconds', 10000))  # Default to 10 seconds
    status_code = SpotifyService.seek_backward(spectacles_user_id, milliseconds)
    if status_code==400:
        return ('Error seeking backward', 400)
    return ('', status_code)

@spotify_controller_bp.route('/login', methods=['GET'])
def login():
    spectacles_user_id = request.args.get('state')
    authorization_code = request.args.get('code')
    current_app.logger.info(f"Logging in user with state: {spectacles_user_id} and code: {authorization_code}")
    status_code = SpotifyService.login(spectacles_user_id, authorization_code)
    return ('', status_code)