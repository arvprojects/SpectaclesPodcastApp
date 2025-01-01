from flask import Blueprint, request, jsonify
from Services.MediaService import MediaService
from Schemas.MediaSchema import MediaSchema

media_bp = Blueprint('media_bp', __name__)
media_schema = MediaSchema()
medias_schema = MediaSchema(many=True)

@media_bp.route('/media', methods=['POST'])
def add_media():
    data = request.get_json()
    media_data = media_schema.load(data)
    media = MediaService.create_media(media_data)
    return jsonify(media_schema.dump(media)), 201

@media_bp.route('/media', methods=['GET'])
def get_media():
    media_list = MediaService.get_media()
    return jsonify(medias_schema.dump(media_list))

@media_bp.route('/media/<string:id>', methods=['GET'])
def get_media_by_id(id):
    media = MediaService.get_media_by_id(id)
    if media:
        return jsonify(media_schema.dump(media))
    return jsonify({'message': 'Media not found'}), 404

@media_bp.route('/media/<string:id>', methods=['PUT'])
def update_media(id):
    data = request.get_json()
    media_data = media_schema.load(data)
    media = MediaService.update_media(id,media_data)
    if media:
        return jsonify(media_schema.dump(media))
    return jsonify({'message': 'Media not found'}), 404

@media_bp.route('/media/<string:id>', methods=['DELETE'])
def delete_media(id):
    if MediaService.delete_media(id):
        return jsonify({'message': 'Media deleted successfully'})
    return jsonify({'message': 'Media not found'}), 404
