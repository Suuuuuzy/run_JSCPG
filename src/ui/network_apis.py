# start a server and accept requests
import flask 
import uuid
import os

app = flask.Flask(__name__)

env_dir = './net_env_dir/'
if not os.path.exists(env_dir):
    os.mkdir(env_dir)

@app.route('/')
def index():
    return flask.render_template("./index.html")

@app.route('/check')
def check():
    pass

@app.route('/upload', methods=['POST'])
def upload():
    if flask.request.method == 'POST':
        print(flask.request.files)
        files = flask.request.files
        f = files[1]
        f.save(os.path.join(env_dir, str(uuid())))
