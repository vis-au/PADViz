from flask import render_template, Blueprint
views_blueprint = Blueprint('views',__name__)

@views_blueprint.route('/')
@views_blueprint.route('/index')
def index():
	return render_template("index.html")

@views_blueprint.route('/santinized')
def santinized():
	return render_template("santinized.html")
