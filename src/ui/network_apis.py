# start a server and accept requests
import flask 
import uuid
import os
import json
from werkzeug.utils import secure_filename
from shutil import unpack_archive
from src.core.options import options
from src.core.opgen import OPGen

app = flask.Flask(__name__)

env_dir = os.path.join('./net_env_dir/')#, str(uuid.uuid4()))
if not os.path.exists(env_dir):
    os.makedirs(env_dir, exist_ok=True)

@app.route('/')
@app.route('/js/<path:jsname>')
@app.route('/css/<path:cssname>')
def index(jsname=None, cssname=None):
    print(app.static_folder)
    if not jsname and not cssname:
        return flask.send_from_directory(app.static_folder, 'index.html')
    elif jsname:
        return flask.send_from_directory(os.path.join(app.static_folder, 'js'), jsname)
    elif cssname:
        return flask.send_from_directory(os.path.join(app.static_folder, 'css'), cssname)

@app.route('/check', methods=['POST'])
def check():
    form = flask.request.form
    options.vul_type = form['vul_type']
    if 'module' in form:
        options.module = True
    if 'gc' in form:
        options.gc = True
    if 'exit_when_found' in form:
        options.exit = True

    options.input_file = os.path.join(os.path.abspath(env_dir), 'index.js')
    print(options.input_file)
    #options.babel = os.path.abspath(env_dir)

    opg = OPGen()
    try:
        opg.run()
    except Exception as e:
        print(e)

    with open("./results_tmp.log", 'r') as fp:
        res = fp.read()

    # handle the result
    first_path = res.split("|checker|")[1]
    first_path = first_path.replace("\n", "<br>")
    return first_path


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
                print(file_path)
                f.save(file_path)
                file_cnt += 1
    except Exception as e:
        print(e)
        return "File uploading failed"

    try:
        # unzip the file
        unpack_archive(file_path, env_dir)
    except Exception as e:
        return "File unzipping failed"

    return f"Successfully uploaded and unzipped {file_cnt} Files"
