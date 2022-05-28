import os
import json
def main_func():
    path = "/Users/jianjia/Documents/tmp/EOPG/result_analyze/opgen_results/server/12_doublex_empoweb_api_result/detected/"
    with open("crx_lists/memory.txt") as f:
        ids = json.load(f)
    for id in ids:
        cmd = "mprof run generate_opg.py -t chrome_ext -crx {extenion_path} -pq"
        abs_id = os.path.join(path, id)
        os.system(cmd.format(extenion_path = abs_id))


if __name__ == '__main__':
    main_func()



