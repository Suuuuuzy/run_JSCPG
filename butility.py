import os
import json
import sys
import argparse
import time

if __name__=='__main__':

    parser = argparse.ArgumentParser(description='the script to run doublex')
    parser.add_argument('-id', '--extension_id_file', type=str, help='path to the file')

    args = parser.parse_args()
    # cmd_add = ""
    cur_cmd = './generate_opg.py -t chrome_ext -crx -no_merge -pq --timeout 60 /media/data2/jianjia/extension_data/unzipped_extensions'

    # thread_num =  20
    extension_id_file = args.extension_id_file
    with open(extension_id_file) as f:
        ids = json.load(f)


    for i in ids:
        tmp_cmd = cur_cmd + i
        # os_cmd = f"screen -S coco_{i} -dm {tmp_cmd}"
        print(tmp_cmd)
        os.system(tmp_cmd)

        # time.sleep(5)
    # step = len(ids) // thread_num
    # flag = 0
    # os.makedirs('tmp_split_list', exist_ok=True)
    # files = os.listdir('tmp_split_list')
    # for file in files:
    #     os.remove(os.path.join('tmp_split_list', file))
    # for i in range(thread_num-1):
    #     with open('tmp_split_list/ids_' + str(i) + '.txt', 'w') as f:
    #         json.dump(ids[flag:flag+step], f)
    #     flag+=step
    # with open('tmp_split_list/ids_' + str(thread_num-1) + '.txt', 'w') as f:
    #     json.dump(ids[flag:], f)

    # for i in range(thread_num):
    #     # tmp_cmd = cur_cmd + ' -f '+ str(i) + ' -p ' + extension_path + ' -id ' + 'tmp_split_list/ids_' + str(i) + '.txt' 
    #     tmp_cmd = cur_cmd + ' -id ' + 'tmp_split_list/ids_' + str(i) + '.txt' 
    #     # tmp_cmd += cmd_add
    #     os_cmd = f"screen -S coco_{i} -dm {tmp_cmd}"
    #     print(os_cmd)
        # os.system(os_cmd)
