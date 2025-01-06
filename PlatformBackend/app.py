from flask import Flask
from flask_cors import CORS
from Models import db
from Controllers.UserController import user_bp
from Controllers.PodcastController import podcast_bp
from Controllers.MediaController import media_bp
from Controllers.CapturedMomentController import captured_moment_bp
import Config

import logging

logging.basicConfig(level=logging.DEBUG, format='%(asctime)s %(levelname)s: %(message)s')

app = Flask(__name__)
app.config.from_object(Config)
CORS(app)


db.init_app(app)

app.register_blueprint(user_bp)
app.register_blueprint(podcast_bp)
app.register_blueprint(media_bp)
app.register_blueprint(captured_moment_bp)

if __name__ == '__main__':
    with app.app_context():
        # No need to call db.create_all() since tables are already created test2 again
        app.run(debug=True)