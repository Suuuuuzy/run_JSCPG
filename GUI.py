# img_viewer.py

import PySimpleGUI as sg
import os.path
import subprocess
import threading
import sys
from src.core.options import options
from src.core.opgen import OPGen

# First the window layout in 2 columns
vul_type_list = [
        'os_command',
        'path_traversal',
        'proto_pollution'
        ]

file_list_column = [
    [
        sg.Text("Package Path"),
        sg.In(size=(25, 1), enable_events=True, key="-FOLDER-"),
        sg.FileBrowse(),
    ],
    [
        sg.Radio('os command', 'vul_type', key='os_command'),
        sg.Radio('path traversal', 'vul_type', key='path_traversal'),
        sg.Radio('prototype pollution', 'vul_type', key='proto_pollution'),
        sg.Button('start', key='-START-')
    ],
]

# For now will only show the name of the file that was chosen
image_viewer_column = [
    [
        sg.Output(size=(60, 40), key="result_box")
    ],
]

# ----- Full layout -----
layout = [
    [
        sg.Column(file_list_column),
        sg.VSeperator(),
        sg.Column(image_viewer_column),
    ]
]

window = sg.Window("OPGen", layout)
OPGen_command = "python generate_opg.py -m -t"
vul_type = None
output = []

def run_cmd(cmd, window):
    """
    p = subprocess.Popen(cmd, shell=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
    output = ''
    for line in p.stdout:
        line = line.decode(encoding=sys.stdout.encoding,
                                    errors='replace' if (sys.version_info) < (3, 5)
                                    else 'backslashreplace').rstrip()
        log.info(line)
        output += line

    """
    process = subprocess.run(cmd, stderr=sys.stderr, stdout=sys.stdout, shell=True)

# Run the Event Loop
while True:
    event, values = window.read()
    if event == "Exit" or event == sg.WIN_CLOSED:
        break
    # Folder name was filled in, make a list of files in the folder
    if event == "-FOLDER-":
        folder = values["-FOLDER-"]
        try:
            # Get list of files in folder
            file_list = os.listdir(folder)
        except:
            file_list = []

        fnames = [
            f
            for f in file_list
        ]
    elif event == '-START-':
        for vul in vul_type_list:
            if vul in values and values[vul]:
                options.vul_type = vul
        options.module = True
        options.input_file = folder
        opg = OPGen()
        opg.run()

        #cmd = "{} {} {}".format(OPGen_command, vul_type, folder)
        #print(cmd)
        #process = subprocess.run(cmd, stderr=sys.stderr, stdout=sys.stdout, shell=True)
        #threading.Thread(target=run_cmd, args=(cmd, window), daemon=True).start()


window.close()
