#!/usr/bin/env python3
import os
import json
import sys
import argparse

if __name__=='__main__':

    parser = argparse.ArgumentParser(description='the script to run doublex')
    # parser.add_argument('-s', '--single', type=str, help='run a single extension')
    # parser.add_argument('-m', '--mode', type=str, help='running mode for batch')
    # parser.add_argument('-empoweb', '--empoweb', action='store_true',help='empoweb or not')
    # parser.add_argument('-war', '--war', action='store_true',help='WAR or not')
    # parser.add_argument('-firefox', '--firefox', action='store_true',help='firefox or not')
    parser.add_argument('-id', '--extension_id_file', type=str, help='path to the file')

    args = parser.parse_args()
    # cmd_add = ""
    cur_cmd = 'python3 butility.py'

    thread_num =  20
    extension_id_file = args.extension_id_file
    with open(extension_id_file) as f:
        ids = json.load(f)
    step = len(ids) // thread_num
    flag = 0
    os.makedirs('tmp_split_list', exist_ok=True)
    files = os.listdir('tmp_split_list')
    for file in files:
        os.remove(os.path.join('tmp_split_list', file))
    for i in range(thread_num-1):
        with open('tmp_split_list/ids_' + str(i) + '.txt', 'w') as f:
            json.dump(ids[flag:flag+step], f)
        flag+=step
    with open('tmp_split_list/ids_' + str(thread_num-1) + '.txt', 'w') as f:
        json.dump(ids[flag:], f)

    for i in range(thread_num):
        # tmp_cmd = cur_cmd + ' -f '+ str(i) + ' -p ' + extension_path + ' -id ' + 'tmp_split_list/ids_' + str(i) + '.txt' 
        tmp_cmd = cur_cmd + ' -id ' + 'tmp_split_list/ids_' + str(i) + '.txt' 
        # tmp_cmd += cmd_add
        os_cmd = f"screen -S coco_{i} -dm {tmp_cmd}"
        print(os_cmd)
        os.system(os_cmd)
