from flask import Flask
from Controllers.SpotifyController import spotify_controller_bp
from Controllers.MediaController import media_controller_bp
import logging
import Config
from celery import Celery,Task
from utils import make_celery
from Controllers.socketio_instance import socketio
from flask_sock import Sock
from Controllers.MediaController import media_controller_bp, init_sockets

def create_app():
    app = Flask(__name__)

    # Load configuration
    app.config.from_object(Config.Config)

    # socketio.init_app(app)
    sock = Sock(app)

    celery = make_celery(app)
    celery.set_default()
    # Register blueprints or routes
    # app.register_blueprint(media_controller_bp, url_prefix='/api')
    app.register_blueprint(spotify_controller_bp, url_prefix='/spotify')
    app.register_blueprint(media_controller_bp)

  # Configure logging
    logging.basicConfig(level=logging.INFO)
    logger = logging.getLogger(__name__)
    
    init_sockets(sock)


    return app,celery,sock

app,celery,sock= create_app()
# app.app_context().push())

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
    # socketio.run(app,ssl_context=('path/to/cert.pem', 'path/to/key.pem'))



