from flask import Flask, jsonify, request
from flask_cors import CORS
from activity_logger import activity_logger, Activity
from typing import List
import os

app = Flask(__name__)
CORS(app)

# Activity logging endpoints
@app.route('/api/activity-logs', methods=['GET'])
def get_activities():
    activities = activity_logger.get_activities()
    return jsonify([activity.dict() for activity in activities])

@app.route('/api/activity-logs/<int:activity_id>/read', methods=['PUT'])
def mark_activity_read(activity_id: int):
    success = activity_logger.mark_as_read(activity_id)
    return jsonify({'success': success})

@app.route('/api/activity-logs/mark-all-read', methods=['PUT'])
def mark_all_read():
    success = activity_logger.mark_all_as_read()
    return jsonify({'success': success})

@app.route('/api/activity-logs/<int:activity_id>', methods=['DELETE'])
def delete_activity(activity_id: int):
    success = activity_logger.delete_activity(activity_id)
    return jsonify({'success': success})

# Folder operations with activity logging
@app.route('/api/folders', methods=['POST'])
def create_folder():
    data = request.json
    folder_name = data.get('name')
    parent_id = data.get('parent_id')
    
    # Your existing folder creation logic here
    # ...
    
    # Log the activity
    activity_logger.log_activity(
        action='CREATE',
        message=f'Created new folder "{folder_name}"',
        entity_type='folder',
        entity_id=str(folder_id)  # folder_id from your creation logic
    )
    
    return jsonify({'success': True})

@app.route('/api/folders/<folder_id>', methods=['PUT'])
def update_folder(folder_id):
    data = request.json
    new_name = data.get('name')
    
    # Your existing folder update logic here
    # ...
    
    # Log the activity
    activity_logger.log_activity(
        action='UPDATE',
        message=f'Updated folder "{new_name}"',
        entity_type='folder',
        entity_id=str(folder_id)
    )
    
    return jsonify({'success': True})

@app.route('/api/folders/<folder_id>', methods=['DELETE'])
def delete_folder(folder_id):
    # Your existing folder deletion logic here
    # ...
    
    # Log the activity
    activity_logger.log_activity(
        action='DELETE',
        message=f'Deleted folder',  # You might want to include the folder name if available
        entity_type='folder',
        entity_id=str(folder_id)
    )
    
    return jsonify({'success': True})

@app.route('/api/folders/<folder_id>/move', methods=['POST'])
def move_folder(folder_id):
    data = request.json
    new_parent_id = data.get('new_parent_id')
    
    # Your existing folder move logic here
    # ...
    
    # Log the activity
    activity_logger.log_activity(
        action='MOVE',
        message=f'Moved folder to new location',  # You might want to include folder names
        entity_type='folder',
        entity_id=str(folder_id)
    )
    
    return jsonify({'success': True})

if __name__ == '__main__':
    app.run(debug=True, port=5000) 