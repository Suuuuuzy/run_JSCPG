import os
import json
import sys
import argparse
import time
import subprocess

if __name__=='__main__':

    parser = argparse.ArgumentParser(description='the script to run doublex')
    parser.add_argument('-id', '--extension_id_file', type=str, help='path to the file')

    args = parser.parse_args()
    
    extension_id_file = args.extension_id_file
    with open(extension_id_file) as f:
        ids = json.load(f)
    cur_cmd_proc = ['./generate_opg.py', '-t', 'chrome_ext', '-crx', '-no_merge', '-pq', '--timeout', '60', '/media/data2/jianjia/extension_data/unzipped_extensions/']
    # cur_cmd_proc = ['./generate_opg.py', '-t', 'chrome_ext', '-s','-crx', '--timeout', '120', '/media/data2/jianjia/extension_data/unzipped_extensions/']
    # cur_cmd_proc = ['./generate_opg.py', '-t', 'chrome_ext', '-crx', '-no_merge', '-pq', '--timeout', '10', 'crx_lists/jianjia_timeout/extensions/']
    for i in ids:
        tmp = [i for i in cur_cmd_proc]
        tmp[-1] = tmp[-1]+i
        process = subprocess.Popen(tmp)
        try:
            print('Running in process', process.pid)
            process.wait(timeout=60)
        except subprocess.TimeoutExpired:
            print('Timed out - killing', process.pid)
            process.kill()
            timeout = True
            res_file = tmp[-1] + "/opgen_generated_files/res.txt"
            if os.path.exists(res_file):
                with open(res_file) as f:
                    c = f.read()
                    if "tainted detected"  in c:
                        timeout = False
            if timeout:
                with open(res_file, "w") as f:
                    f.write("timeout")
        print("Done")


    """
    cur_cmd = './generate_opg.py -t chrome_ext -crx -no_merge -pq --timeout 60 /media/data2/jianjia/extension_data/unzipped_extensions/'

    extension_id_file = args.extension_id_file
    with open(extension_id_file) as f:
        ids = json.load(f)


    for i in ids:
        tmp_cmd = cur_cmd + i
        # os_cmd = f"screen -S coco_{i} -dm {tmp_cmd}"
        print(tmp_cmd)
        os.system(tmp_cmd)
    """
