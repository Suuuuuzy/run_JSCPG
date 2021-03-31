# start a server and accept requests
from flask import Flask
import uuid

app = Flask(__name__)

@app.route('/')
def index():
    return 'index'

@app.route('/check')
def check():

@app.route('upload')
def upload():
    if request.method == 'POST':
        f = request.files['clientapp.zip']
