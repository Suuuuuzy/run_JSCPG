# start a server and accept requests
import flask 
import uuid
import os
from werkzeug.utils import secure_filename
from shutil import unpack_archive

app = flask.Flask(__name__)

env_dir = os.path.join('./net_env_dir/', str(uuid.uuid4()))
if not os.path.exists(env_dir):
    os.makedirs(env_dir, exist_ok=True)

@app.route('/')
def index():
    return flask.render_template("./index.html")

@app.route('/check')
def check():
    pass

@app.route('/upload', methods=['POST'])
def upload():
    file_cnt = 0
    file_path = None
    try:
        uploaded = flask.request.files
        for file_values in uploaded.listvalues():
            # we only have one key here
            for f in file_values:
                file_path = os.path.join(env_dir, secure_filename(f.filename))
                f.save(file_path)
                file_cnt += 1
    except:
        return "File uploading failed"

    try:
        # unzip the file
        unpack_archive(file_path, env_dir)
    except Exception as e:
        return "File unzipping failed"

    return f"Successfully uploaded {file_cnt} files"
