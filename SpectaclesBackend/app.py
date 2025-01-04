from flask import Flask
from Controllers.SpotifyController import spotify_controller_bp
from Controllers.MediaController import media_controller_bp
import logging
import Config
from celery import Celery,Task
from utils import make_celery

# def make_celery(app):
#     celery = Celery(
#         app.import_name,
#         backend=app.config['CELERY_RESULT_BACKEND'],
#         broker=app.config['CELERY_BROKER_URL']
#     )
#     celery.conf.update(app.config)
#     TaskBase = celery.Task

#     class ContextTask(TaskBase):
#         def __call__(self, *args, **kwargs):
#             with app.app_context():
#                 return TaskBase.__call__(self, *args, **kwargs)

#     celery.Task = ContextTask
#     app.extensions["celery"] = celery

#     return celery

# def celery_init_app(app: Flask) -> Celery:
#     class FlaskTask(Task):
#         def __call__(self, *args: object, **kwargs: object) -> object:
#             with app.app_context():
#                 return self.run(*args, **kwargs)

#     celery_app = Celery(app.name, task_cls=FlaskTask)
#     celery_app.config_from_object(app.config["CELERY"])
#     celery_app.set_default()
#     app.extensions["celery"] = celery_app
#     return celery_app


def create_app():
    app = Flask(__name__)
    
    # Load configuration
    app.config.from_object(Config.Config)

    # app.config.from_mapping(
    #     CELERY=dict(
    #         broker_url="redis://localhost/6379/0",
    #         result_backend="redis://localhost/6739/0",
    #         task_ignore_result=True,
    #     ),
    # )

    app.config["CELERY_CONFIG"] = {
        'broker_url': 'redis://localhost:6379/0',
        'result_backend':  'redis://localhost:6379/0',
        'task_ignore_result': True,
        'redbeat_lock_key' :None,
        'redbeat_redis_url' : 'redis://localhost:6379/1'

    }


    celery = make_celery(app)
    celery.set_default()
    # Register blueprints or routes
    # app.register_blueprint(media_controller_bp, url_prefix='/api')
    app.register_blueprint(spotify_controller_bp, url_prefix='/spotify')
    app.register_blueprint(media_controller_bp)

  # Configure logging
    logging.basicConfig(level=logging.INFO)
    logger = logging.getLogger(__name__)
    
    return app,celery

app,celery= create_app()
app.app_context().push()

if __name__ == '__main__':
    app.run()