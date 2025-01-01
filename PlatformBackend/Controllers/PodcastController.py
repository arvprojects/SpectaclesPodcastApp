from flask import Blueprint, request, jsonify, current_app as app
from Services.PodcastService import PodcastService
from Schemas.PodcastSchema import PodcastSchema

podcast_bp = Blueprint('podcast_bp', __name__)
podcast_schema = PodcastSchema()
podcasts_schema = PodcastSchema(many=True)

@podcast_bp.route('/podcasts', methods=['POST'])
def add_podcast():
    data = request.get_json()
    podcast_data = podcast_schema.load(data)
    podcast = PodcastService.create_podcast(podcast_data)
    return podcast_schema.jsonify(podcast), 201

@podcast_bp.route('/podcasts', methods=['GET'])
def get_podcasts():
    podcasts = PodcastService.get_podcasts()
    return podcasts_schema.jsonify(podcasts)

@podcast_bp.route('/podcasts/<string:id>', methods=['GET'])
def get_podcast(id):
    podcast = PodcastService.get_podcast(id)
    if podcast:
        return podcast_schema.jsonify(podcast)
    return jsonify({'message': 'Podcast not found'}), 404

@podcast_bp.route('/podcasts/<string:id>', methods=['PUT'])
def update_podcast(id):
    data = request.get_json()
    podcast_data = podcast_schema.load(data)
    podcast = PodcastService.update_podcast(id,podcast_data)
    if podcast:
        return podcast_schema.jsonify(podcast)
    return jsonify({'message': 'Podcast not found'}), 404

@podcast_bp.route('/podcasts/<string:id>', methods=['DELETE'])
def delete_podcast(id):
    if PodcastService.delete_podcast(id):
        return jsonify({'message': 'Podcast deleted successfully'})
    return jsonify({'message': 'Podcast not found'}), 404