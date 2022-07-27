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
import re

bg_valid_execution_sources = ["bg_external_port_onMessage", "bg_chrome_runtime_MessageExternal"]
cs_valid_execution_sources = ["document_on_event"]
cs_valid_execution_sources_starts = ["cs_window_", "document_"]

type1_src=["bg_external_port_onMessage", "bg_chrome_runtime_MessageExternal", "document_on_event"]
type1_src_head = ["cs_window_", "document_"]
type1_sink = ["eval_sink",
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
"chrome_storage_sync_set_sink",
"chrome_storage_local_set_sink",
"management_setEnabled_enabled"
]

type2_src = [
"management_getAll_source",
# "cookie_source",
"cookies_source",
# "CookieStores_source",
"BookmarkTreeNode_source",
"HistoryItem_source",
"VisitItem_source",
"topSites_source",
"storage_sync_get_source",
"storage_local_get_source"
]
type2_sink = [
    "window_postMessage_sink",
    "bg_external_port_postMessage_sink",
    "sendResponseExternal_sink"
    # "document_write_sink",
    # "JQ_obj_val_sink",
    # "JQ_obj_html_sink",
    # "localStorage_remove_sink",
    # "localStorage_setItem_key",
    # "localStorage_setItem_value",
    # "document_execCommand_sink"
]


def check_src_sink(content):
    global type2_sink
    global type2_src
    global type1_sink
    global type1_src
    global type1_src_head
    # "from fetch_source to chrome_storage_local_set_sink"
    pattern = "from {src} to {sink}"
    for src in type1_src:
        for sink in type1_sink:
            tmp_pattern = pattern.format(src=src, sink=sink)
            if tmp_pattern in content:
                return True
    for src in type1_src_head:
        for sink in type1_sink:
            first = "from {src}".format(src=src)
            second = " to {sink}".format(sink=sink)
            tmp_pattern = re.compile(first+".*"+second)
            matchobj = tmp_pattern.findall(content)[0]
            if matchobj:
                return True
    for src in type2_src:
        for sink in type2_sink:
            tmp_pattern = pattern.format(src=src, sink=sink)
            if tmp_pattern in content:
                return True
    return False

def ana_opgen(extension_path, id, res_name):
    res = -1
    gen_path = os.path.join(extension_path, id, "opgen_generated_files")
    for res_name in ["res_old.txt", "res.txt"]:
        filename = os.path.join(gen_path, res_name)
        if not os.path.exists(filename):
            return res
        if os.path.exists(gen_path) :
            with open(filename) as f:
                c = f.read()
                if "nothing detected" in c:
                    res = 0
                elif "timeout" in c:
                    res = -2
                elif "tainted detected" in c:
                    if check_src_sink(c):
                        res = 1
                    else:
                        res = 0
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

def sum_all_files(pathDir, prefix, idfile):
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
    with open(idfile) as f:
        filtered_ids = json.load(f)
        filtered_ids = set(filtered_ids)
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
            if "pq_not_done" in c:
                ids = c['pq_not_done']
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
    sum_all_files(resDir, prefix, idfile)

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

