from flask import Blueprint, request, jsonify
from Services.CapturedMomentService import CapturedMomentService
from Schemas.CapturedMomentSchema import CapturedMomentSchema

captured_moment_bp = Blueprint('captured_moment_bp', __name__)
captured_moment_schema = CapturedMomentSchema()
captured_moments_schema = CapturedMomentSchema(many=True)

@captured_moment_bp.route('/captured_moments', methods=['POST'])
def add_captured_moment():
    data = request.get_json()
    captured_moment_data = captured_moment_schema.load(data)
    captured_moment = CapturedMomentService.create_captured_moment(captured_moment_data)
    return jsonify(captured_moment_schema.dump(captured_moment)), 201

@captured_moment_bp.route('/captured_moments', methods=['GET'])
def get_captured_moments():
    captured_moments = CapturedMomentService.get_captured_moments()
    return jsonify(captured_moments_schema.dump(captured_moments))

@captured_moment_bp.route('/captured_moments/<string:id>', methods=['GET'])
def get_captured_moment_by_id(id):
    captured_moment = CapturedMomentService.get_captured_moment_by_id(id)
    if captured_moment:
        return jsonify(captured_moment_schema.dump(captured_moment))
    return jsonify({'message': 'Captured moment not found'}), 404

@captured_moment_bp.route('/captured_moments/<string:id>', methods=['PUT'])
def update_captured_moment(id):
    data = request.get_json()
    captured_moment_data = captured_moment_schema.load(data)
    captured_moment = CapturedMomentService.update_captured_moment(id,captured_moment_data)
    if captured_moment:
        return jsonify(captured_moment_schema.dump(captured_moment))
    return jsonify({'message': 'Captured moment not found'}), 404

@captured_moment_bp.route('/captured_moments/<string:id>', methods=['DELETE'])
def delete_captured_moment(id):
    if CapturedMomentService.delete_captured_moment(id):
        return jsonify({'message': 'Captured moment deleted successfully'})
    return jsonify({'message': 'Captured moment not found'}), 404
