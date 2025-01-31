from flask import Blueprint, request,current_app
from Services.MediaService import MediaService
from Services.PlatformBackendService import PlatformBackendService
from flask_socketio import SocketIO,emit, join_room, leave_room
from Controllers.socketio_instance import socketio
import requests
from flask_sockets import Sockets
import json
media_controller_bp = Blueprint('media_controller', __name__)
media_service = MediaService()
platformBackendService = PlatformBackendService()
active_connections = {}

@media_controller_bp.route('/trigger', methods=['POST'])
def trigger():
    
    data = request.json
    media_service.trigger(data['spectacles_device_id'], data['podcast_id'], data['start'])

    return 'Triggered', 200

@media_controller_bp.route('/sendMessage', methods=['POST'])
def sendMessage():
    data = request.json
    spectacles_device_id = data['spectacles_device_id']
    message = data['message']
    if spectacles_device_id in active_connections:
        ws = active_connections[spectacles_device_id]
        ws.send(json.dumps(message))
        return 'message sent', 200
    else:
         return 'user not connected',404
    

@media_controller_bp.route('/getPodcasts', methods=['GET'])
def get_podcasts():
    response = platformBackendService.get_podcasts_metadata()
    return response, 200

def send_message_to_user(spectacles_device_id, message):
    #make a post request to the sendMessage endpoint
    data = {
        'spectacles_device_id': spectacles_device_id,
        'message': message
    }
    response = requests.post(f"{current_app.config['SPECTACLES_BACKEND_URL']}/sendMessage", json=data)
    return 'Triggered', 200

@media_controller_bp.route('/capturemoment', methods=['POST'])
def capture_moment():
    data = request.json
    spectacles_device_id = data.get('spectacles_device_id')
    podcast_id = data.get('podcast_id')

    if not spectacles_device_id or not podcast_id:
        return 'Missing parameters', 400

    try:
        response = media_service.capture_moment(spectacles_device_id, podcast_id)
        if 200 <= response.status_code < 300:
            return 'Captured', 200
        else:
            return 'Not Captured', response.status_code
    except Exception as e:
        return str(e), 500


def init_sockets(sock):
    @sock.route('/ws')
    def handle_websocket(ws):
        while True:
            message = ws.receive()
            if message is None:
                break
            data = json.loads(message)
            username = data.get('spectacles_device_id')
            current_app.logger.info(f"User {username} connected")
            if username:
                active_connections[username] = ws
                ws.send(json.dumps({'data': 'Connected'}))
                # Handle other messages here
        # Remove the connection when it is closed
        if username in active_connections:
            del active_connections[username]
            current_app.logger.info(f"User {username} disconnected")


