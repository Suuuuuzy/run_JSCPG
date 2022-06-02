import os
import json
def main_func():
    path = "/media/data2/jianjia/extension_data/unzipped_extensions"
    with open("thread_measure/5_from_time.json") as f:
        ids = json.load(f)
    for id in ids:
        cmd = "mprof run generate_opg.py -t chrome_ext -crx {extenion_path} -pq --timeout 600 -measure_thread -auto -no_merge"
        abs_id = os.path.join(path, id)
        os.system(cmd.format(extenion_path = abs_id))


if __name__ == '__main__':
    main_func()



