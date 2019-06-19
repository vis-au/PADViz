from flask import Flask
app = Flask(__name__,
 	static_folder = './public',
 	template_folder="./static/templates")

from app.controller.views import views_blueprint
from app.controller.dataProcessor import data_blueprint
from app.controller.api import json_blueprint
from app.controller.json import data_blueprint

# register the blueprints
app.register_blueprint(views_blueprint)
app.register_blueprint(data_blueprint)
app.register_blueprint(json_blueprint)
app.register_blueprint(data_blueprint)

# force refresh in browser
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0
