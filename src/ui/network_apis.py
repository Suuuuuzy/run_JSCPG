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

env_dir = os.path.join('./net_env_dir/', str(uuid.uuid4()))
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
    else:
        options.module = False

    if 'no_file_based' in form:
        options.no_file_based = True
    else:
        options.no_file_based = False
        
    if 'exit_when_found' in form:
        options.exit = True
    else:
        options.exit = False

    options.input_file = os.path.join(os.path.abspath(env_dir), 'index.js')

    # we need to clear the results tmp
    with open("./results_tmp.log", 'w') as fp:
        fp.write("")

    opg = OPGen()
    try:
        opg.run()
    except Exception as e:
        print(e)

    with open("./results_tmp.log", 'r') as fp:
        res = fp.read()

    # handle the result
    if 'FilePath' not in res:
        return "Not detected"
    first_path = res.split("|checker|")[1]
    print(first_path)

    # generate json for graph
    nodes = []
    edges = []
    file_map = {}
    node_blocks = []
    height = 0
    idx = 0
    blocks = first_path.split("$FilePath$")[1:]
    for block in blocks:
        lines = block.split('\n')
        lines[0] = os.path.relpath(lines[0], env_dir)
        max_len = max(len(line) for line in lines)

        title = lines[0]
        if title not in file_map:
            file_map[title] = idx
            nodes.append({"data": {"id": idx, "content": title}})
            idx += 1
        block = '\n'.join(block.split('\n')[1:])
        block_height = len(lines) * 15
        node_blocks.append(idx)
        nodes.append({
            "data": {
                "id": idx, 
                "parent": file_map[title], 
                "content": block,
                "width": max_len * 8,
                'height': block_height
                },
            'position': {
                "x": 0,
                "y": height 
                }})
        height += 100 + block_height
        idx += 1

    for idx in range(len(node_blocks) - 1):
        edges.append({
            "data":{
                "id": str(idx) + "-" + str(idx + 1),
                "source": node_blocks[idx],
                "target": node_blocks[idx + 1]
                }
            })

    nodes = json.dumps(nodes)
    edges = json.dumps(edges)
    render_res = flask.render_template("graph.js", NODES=nodes, EDGES=edges)

    return render_res


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
