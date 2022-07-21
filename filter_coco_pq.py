# this is used to find the extensions we run are in one of the 8 catogaries:
# benign
# detected
# error
# timeout
# pq_benign
# pq_detected
# pq_error
# pq_timeout
# we use the same APIs in doublex+empoweb

import os
import sys
import json
from tqdm import tqdm
import threading

coco_api= [
"eval_sink",
"setTimeout",
"chrome_tabs_executeScript_sink",
"XMLHttpRequest_url_sink",
"fetch_resource_sink",
"jQuery_ajax_url_sink",
"jQuery_ajax_settings_url_sink",
"jQuery_get_url_sink",
"jQuery_post_url_sink",
# "XMLHttpRequest_post_sink",
"chrome_downloads_download_sink",
# "cookie_source",
"cookies_source",
# "CookieStores_source",
"BookmarkTreeNode_source",
"HistoryItem_source",
"VisitItem_source",
"topSites_source",
"storage_sync_get_source",
"storage_local_get_source",
"chrome_storage_sync_set_sink",
"chrome_storage_local_set_sink",
"management_setEnabled_enabled",
"management_setEnabled_enabled",
"management_getAll_source"
]

def check_pq(timefile, old=False):
    pq = False
    if not os.path.exists(timefile):
        return False
    with open(timefile) as f:
        c = f.read()
    blocks = c.split("\n\n")
    # find the corresponding block first
    blocks = [i for i in blocks if i != '']
    if old:
        if len(blocks)>1:
            lines = blocks[-2]
        else:
            return False
    else:
        lines = blocks[-1]
    lines = lines.split("\n")
    lines = [i for i in lines if i != '']
    for i in lines:
        if i.startswith("run_with_pq"):
            if i == "run_with_pq: True":
                pq = True
            else:
                pq = False
    return pq

def ana_opgen(extension_path, id, res_name):
    res = -1
    pq = False
    gen_path = os.path.join(extension_path, id, "opgen_generated_files")
    filename = os.path.join(gen_path, res_name)
    if not os.path.exists(filename):
        return res, pq
    # check the used_time_file to see whether the result id from pq or no_pq
    used_time_file = os.path.join(gen_path, "used_time.txt")
    if res_name == "res_old.txt":
        pq = check_pq(used_time_file, old=True)
    else:
        pq =  check_pq(used_time_file, old=False)
    if os.path.exists(gen_path) :
        with open(filename) as f:
            c = f.read()
            if "nothing detected" in c:
                res = 0
            elif "timeout"==c:
                res = -2
            elif "tainted detected" in c:
                suc = 0
                for i in coco_api:
                    if i in c:
                        res = 1
                        suc = 1
                        break
                if suc==0:
                    res = 0
            elif "Error:" in c:
                res = 2
    return res, pq

def analyze_results(flag, resDir, extension_path, ids, res_name):
    detected = []
    not_done = []
    timeout = []
    benign = []
    error = []
    pq_detected = []
    # pq_not_done = []
    pq_timeout = []
    pq_benign = []
    pq_error = []
    for id in tqdm(ids):
        res, pq = ana_opgen(extension_path, id, res_name)
        if res==1:
            if pq:
                pq_detected.append(id)
            else:
                detected.append(id)
        elif res==-1:
            not_done.append(id)
        elif res==-2:
            if pq:
                pq_timeout.append(id)
            else:
                timeout.append(id)
        elif res==0:
            if pq:
                pq_benign.append(id)
            else:
                benign.append(id)
        elif res==2:
            if pq:
                pq_error.append(id)
            else:
                error.append(id)
    dic = {"detected": detected, "not_done":not_done, "timeout":timeout, "benign":benign, "error":error, "pq_detected": pq_detected, "pq_timeout":pq_timeout, "pq_benign":pq_benign, "pq_error":pq_error}
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
        all_dic = {"detected": [], "not_done": [], "timeout": [], "benign": [], "error":[], "pq_detected": [], "pq_timeout":[], "pq_benign":[], "pq_error":[]}
    with open(old_results_file, 'w') as f:
        for i in range(0, thread_num):
            with open(os.path.join(pathDir, str(i) + prefix+'.txt')) as fr:
                c = json.load(fr)
                all_dic["detected"].extend(c["detected"])
                all_dic["not_done"].extend(c["not_done"])
                all_dic["timeout"].extend(c["timeout"])
                all_dic["benign"].extend(c["benign"])
                all_dic["error"].extend(c["error"])
                # for pq
                all_dic["pq_detected"].extend(c["pq_detected"])
                all_dic["pq_timeout"].extend(c["pq_timeout"])
                all_dic["pq_benign"].extend(c["pq_benign"])
                all_dic["pq_error"].extend(c["pq_error"])
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
    benign = all_dic['pq_benign']
    not_done = all_dic['not_done']
    benign.extend(not_done)
    with open(os.path.join(pathDir, 'not_done_benign.txt'), 'w') as f:
        json.dump(benign, f)
    benign.extend(all_dic['pq_error'])
    benign.extend(all_dic['pq_timeout'])
    with open(os.path.join(pathDir, 'not_detected.txt'), 'w') as f:
        json.dump(benign, f)
    for i in range(0, thread_num):
        os.remove(os.path.join(pathDir, str(i) + prefix+'.txt'))


def run_with_threads(resDir, extension_path, idfile, func, res_name, thread_num = 200, mode=None):
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

def main():
    res_dir = ''
    mode = sys.argv[1]
    thread_num = 200
    extension_path = "/media/data2/jianjia/extension_data/unzipped_extensions"
    idfile = ''
    res_name = ''
    if mode in ["new", "old"]:
        if mode=="old":
            res_name = "res_old.txt"
        else:
            res_name = "res.txt"
        extension_path = sys.argv[2]
        idfile = sys.argv[3]
        res_dir = sys.argv[4]
    run_with_threads(res_dir, extension_path, idfile, analyze_results, res_name = res_name, thread_num = thread_num, mode = mode)


if __name__=='__main__':
    main()

