"""
what's this used for:
for local dataset:
1. empoweb
2. doublex
see how many can not be solved by us
input: extension_path, extension_id_list
output: not_solved.txt
for server data
3. doublex detect
from its detect list,
see how many can not be solved by us, generate the not_solved.txt
the doublex detect list can change, we have to generate the new_to_do list in opgen_res
input: extension_path, doublex_detect_id_list
output: new_to_do list (include the one can not be solved and the new ones)
4. doublex suspect
see how many can be solved by us
the doublex suspect list can change, we have to generate the new_to_do list in opgen_res
input: extension_path, doublex_suspect_id_list
output: new_to_do list (the new ones)
"""
import os
import sys
import json
from tqdm import tqdm
import threading

def ana_opgen(extension_path, id, res_name):
    res = -1
    gen_path = os.path.join(extension_path, id, "opgen_generated_files")
    filename = os.path.join(gen_path, res_name)
    if os.path.exists(gen_path) and os.path.exists(filename):
        with open(filename) as f:
            c = f.read()
            if "nothing detected" in c:
                res = 0
            elif "timeout" == c:
                res = -2
            elif "tainted detected" in c:
                res = 1
            elif "Error:" in c:
                res = 2
    return res

def analyze_results(flag, resDir, extension_path, ids, res_name):
    detected = []
    not_done = []
    timeout = []
    benign = []
    error = []
    for id in tqdm(ids):
        res = ana_opgen(extension_path, id, res_name)
        if res==1:
            detected.append(id)
        elif res==-1:
            not_done.append(id)
        elif res==-2:
            timeout.append(id)
        elif res==0:
            benign.append(id)
        elif res==2:
            error.append(id)
    dic = {"detected": detected, "not_done":not_done, "timeout":timeout, "benign":benign, "error":error}
    os.makedirs(resDir, exist_ok=True)
    with open(os.path.join(resDir, str(flag) + 'opgen_results.txt'), 'w') as f:
        json.dump(dic, f)
    print('Thread No.' + str(flag) + ' end.')

def sum_all_files(pathDir, prefix):
    # all_dic = {"detected": [], "not_done":[], "timeout":[], "benign":[]}
    thread_num = 200
    old_results_file = os.path.join(pathDir, prefix + '.txt')
    if os.path.exists(old_results_file):
        with open(old_results_file) as f:
            all_dic = json.load(f)
            all_dic['not_done'] = []
            if "detected_by_doublex" in pathDir:
                all_dic['benign'] = []
    else:
        all_dic = {"detected": [], "not_done": [], "timeout": [], "benign": [], "error":[]}
    with open(old_results_file, 'w') as f:
        for i in range(0, thread_num):
            with open(os.path.join(pathDir, str(i) + prefix+'.txt')) as fr:
                c = json.load(fr)
                all_dic["detected"].extend(c["detected"])
                all_dic["not_done"].extend(c["not_done"])
                all_dic["timeout"].extend(c["timeout"])
                all_dic["benign"].extend(c["benign"])
                all_dic["error"].extend(c["error"])
        json.dump(all_dic, f)
    cnt = 0
    for i in all_dic:
        print(i)
        cnt += len(all_dic[i])
        print(len(all_dic[i]))
    print(cnt)
    with open(os.path.join(pathDir, 'not_done.txt'), 'w') as f:
        json.dump(all_dic['not_done'], f)
    with open(os.path.join(pathDir, 'benign.txt'), 'w') as f:
        json.dump(all_dic['benign'], f)
    with open(os.path.join(pathDir, 'detected.txt'), 'w') as f:
        json.dump(all_dic['detected'], f)
    benign = all_dic['benign']
    not_done = all_dic['not_done']
    benign.extend(not_done)
    with open(os.path.join(pathDir, 'not_done_benign.txt'), 'w') as f:
        json.dump(benign, f)
    for i in range(0, thread_num):
        os.remove(os.path.join(pathDir, str(i) + prefix+'.txt'))


def run_with_threads(resDir, extension_path, idfile, func, res_name, thread_num = 200, mode=None):
    if mode!="cuslog":
        threads = []
        flag = 0
        prefix = 'opgen_results'
        with open(idfile) as f:
            ids = json.load(f)
        old_results_file = os.path.join(resDir, prefix + '.txt')
        if os.path.exists(old_results_file):
            with open(old_results_file) as f:
                c = json.load(f)
                ids = c['not_done']
                if "detected_by_doublex" in resDir:
                    ids.extend(c['benign'])
        step = len(ids) // thread_num
        print('Task started with %d threads.'%thread_num)
        for i in range(thread_num - 1):
            t = threading.Thread(target=func, args=(i, resDir, extension_path, ids[flag:flag+step], res_name))
            t.start()
            threads.append(t)
            flag += step
        t = threading.Thread(target=func, args=(thread_num - 1, resDir, extension_path, ids[flag:], res_name))
        t.start()
        threads.append(t)
        for t in threads:
            t.join()
        sum_all_files(resDir, prefix)
    else:
        with open(idfile) as f:
            ids = json.load(f)
        try:
            with open("crx_record.log") as f:
                logContent = f.read()
            ids = [i for i in ids if i not in logContent]
        except:
            pass
        print("not_done")
        print(len(ids))
        with open(os.path.join(resDir, 'not_done.txt'), 'w') as f:
            json.dump(ids, f)

def main():
    res_dir = ''
    mode = sys.argv[1]
    thread_num = 200
    extension_path = "/media/data2/jianjia/extension_data/unzipped_extensions"
    idfile = ''
    res_name = "res.txt"
    if mode == 'doublex_de':
        res_dir = '/media/data2/jianjia/extension_data/opgen_results/detected_by_doublex'
        idfile = '/media/data2/jianjia/extension_data/doublex_result/detected.txt'
    elif mode == 'empoweb_de':
        res_dir = '/media/data2/jianjia/extension_data/opgen_results/detected_by_empoweb'
        idfile = '/media/data2/jianjia/extension_data/doublex_empoweb_api_result/detected.txt'
    elif mode == 'doublex_sus':
        res_dir = '/media/data2/jianjia/extension_data/opgen_results/suspect_by_doublex'
        idfile = '/media/data2/jianjia/extension_data/doublex_result/suspect.txt'
    elif mode == 'all':
        res_dir = '/media/data2/jianjia/extension_data/opgen_results/all'
        idfile = '/media/data2/jianjia/extension_data/filtered_file.txt'
    elif mode == 'allwar':
        res_dir = '/media/data2/jianjia/extension_data/opgen_results/allwar'
        idfile = '/media/data2/jianjia/extension_data/filtered_file.txt'
        res_name = "res_war.txt"
    elif mode== "doublex_de_empoweb_local":
        extension_path = "/Users/jianjia/Documents/tmp/EOPG/result_analyze/opgen_results/server/doublex_empoweb_api_result/detected"
        res_dir = '/Users/jianjia/Documents/tmp/EOPG/result_analyze/opgen_results/server/doublex_empoweb_api_result/opgen_results'
        idfile = '/Users/jianjia/Documents/tmp/EOPG/result_analyze/opgen_results/server/doublex_empoweb_api_result/detected.txt'
    elif mode== "doublex_de_local":
        extension_path = "/Users/jianjia/Documents/tmp/EOPG/result_analyze/opgen_results/server/doublex_result/detected"
        res_dir = "/Users/jianjia/Documents/tmp/EOPG/result_analyze/opgen_results/server/doublex_result/opgen_results"
        idfile = "/Users/jianjia/Documents/tmp/EOPG/result_analyze/opgen_results/server/doublex_result/detected.txt"
    elif mode in ["cus", "cuslog"]:
        extension_path = sys.argv[2]
        idfile = sys.argv[3]
        res_dir = sys.argv[4]
    run_with_threads(res_dir, extension_path, idfile, analyze_results, res_name = res_name, thread_num = thread_num, mode = mode)


if __name__=='__main__':
    main()

