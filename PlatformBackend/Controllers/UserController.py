from flask import Blueprint, request, jsonify, current_app as app
from Services.UserService import UserService
from Schemas.UserSchema import UserSchema

user_bp = Blueprint('user_bp', __name__)
user_schema = UserSchema()
users_schema = UserSchema(many=True)

@user_bp.route('/users', methods=['POST'])
def add_user():
    data = request.get_json()
    
    user = UserService.create_user(data)
    
    return user_schema.jsonify(user), 201

@user_bp.route('/users', methods=['GET'])
def get_users():
    users = UserService.get_users()
    return users_schema.jsonify(users)

@user_bp.route('/users/<string:id>', methods=['GET'])
def get_user(id):
    user = UserService.get_user(id)
    app.logger.info(user.podcasts)
    if user:
        return user_schema.jsonify(user)
    return jsonify({'message': 'User not found'}), 404

@user_bp.route('/users/name/<string:name>', methods=['GET'])
def get_user_by_name(name):
    user = UserService.get_user_by_name(name)
    
    if user:
        return user_schema.jsonify(user)
    return jsonify({'message': 'User not found'}), 404

@user_bp.route('/users/device/<string:spectacles_device_id>', methods=['GET'])
def get_user_by_device_id(spectacles_device_id):
    user = UserService.get_user_by_spectacles_id(spectacles_device_id)
    if user:
        return user_schema.jsonify(user)
    return jsonify({'message': 'User not found'}), 404

@user_bp.route('/users/<string:id>', methods=['PUT'])
def update_user(id):
    data = request.get_json()
    user_data = user_schema.load(data, partial=True)
    user = UserService.update_user(id,user_data)
    if user:
        return user_schema.jsonify(user)
    return jsonify({'message': 'User not found'}), 404

@user_bp.route('/users/<string:id>', methods=['DELETE'])
def delete_user(id):
    if UserService.delete_user(id):
        return jsonify({'message': 'User deleted successfully'})
    return jsonify({'message': 'User not found'}), 404
