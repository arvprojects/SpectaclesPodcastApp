from flask import Blueprint, request,current_app
from Services.MediaService import MediaService
from flask_socketio import SocketIO,emit, join_room, leave_room
from Controllers.socketio_instance import socketio
import requests
media_controller_bp = Blueprint('media_controller', __name__)
media_service = MediaService()


@media_controller_bp.route('/trigger', methods=['POST'])
def trigger():
    
    data = request.json
    media_service.trigger(data['spectacles_device_id'], data['podcast_id'], data['start'])

    return 'Triggered', 200

@media_controller_bp.route('/sendMessage', methods=['POST'])
def sendMessage():
    
    data = request.json
    
    socketio.emit('message', {'data': data['message']}, room=data['spectacles_device_id'])

    return 'Triggered', 200

@socketio.on('connect')
def handle_connect():
        username = request.args.get('spectacles_device_id')
        current_app.logger.info(f"User {username} connected")
        if username:
            join_room(username)
            current_app.logger.info(f"User {username} connected")
            socketio.emit('message', {'data': 'Connected'}, room=username)

@socketio.on('disconnect')
def handle_disconnect():
        username = request.args.get('spectacles_device_id')
        leave_room(username)
        
        current_app.logger.info(f"User {username} disconnected")

def send_message_to_user(spectacles_device_id, message):
    #make a post request to the sendMessage endpoint
    data = {
        'spectacles_device_id': spectacles_device_id,
        'message': message
    }
    response = requests.post('http://localhost:5001/sendMessage', json=data)
    return 'Triggered', 200

#use socket io to send message to user
# def send_message_to_user(spectacles_device_id, message):
#     socketio.emit('message', {'data': message}, room=spectacles_device_id)
#     return 'Triggered', 200