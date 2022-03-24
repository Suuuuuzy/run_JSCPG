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


# old_filename = os.path.join(res_dir, 'results.log')
# with open(old_filename) as f:
#     old_log = f.read()
# new_filename = 'results.log'
# if os.path.exists(new_filename):
#     with open(new_filename) as f:
#         c = f.read()
#     if c not in old_log:
#         old_log = old_log+c
#         with open(old_filename, 'w') as f:
#             f.write(old_log)
#
# lines=(old_log.split('\n'))
#
# processed_ids = []
# timeout_ids = []
# detectd_ids = []
# novul_ids = []
#
# for line in lines:
#     if line.startswith('processing extension:'):
#         processed_ids.append(line[-32:])
#     if 'timeout' in line:
#         id = line.split(' timeout')[0][-32:]
#         timeout_ids.append(id)
#     if 'vulnerability detected' in line:
#         detectd_ids.append(line[-32:])
#     if 'nothing detected' in line:
#         novul_ids.append(line[-32:])
#
# old_dic = {"processed_ids":processed_ids, "timeout_ids":timeout_ids, "detectd_ids":detectd_ids, "novul_ids":novul_ids}
# for i in old_dic:
#     old_dic[i] = list(set(old_dic[i]))


def ana_opgen(extension_path, id):
    res = -1
    gen_path = os.path.join(extension_path, id, "opgen_generated_files")
    filename = os.path.join(gen_path, "res.txt")
    if os.path.exists(gen_path) and os.path.exists(filename):
        with open(filename) as f:
            c = f.read()
            if "nothing detected" in c:
                res = 0
            elif "timeout" in c:
                res = -2
            elif "tainted detected" in c:
                res = 1
    return res

# def get_old_res(res_dir):
#     all_dic = {}
#     old_results_file = os.path.join(res_dir, 'opgen_results.txt')
#     if os.path.exists(old_results_file):
#         with open(old_results_file) as f:
#             all_dic = json.load(f)
#             all_dic["not_done"] = []
#     return all_dic

# processed_ids = []
# timeout_ids = []
# detectd_ids = []
# novul_ids = []

def analyze_results(flag, resDir, extension_path, ids):
    detected = []
    not_done = []
    timeout = []
    benign = []
    for id in tqdm(ids):
        res = ana_opgen(extension_path, id)
        if res==1:
            detected.append(id)
        elif res==-1:
            not_done.append(id)
        elif res==-2:
            timeout.append(id)
        elif res==0:
            benign.append(id)
    dic = {"detected": detected, "not_done":not_done, "timeout":timeout, "benign":benign}
    os.makedirs(resDir, exist_ok=True)
    with open(os.path.join(resDir, str(flag) + 'opgen_results.txt'), 'w') as f:
        json.dump(dic, f)
    print('Thread No.' + str(flag) + ' end.')

def sum_all_files(pathDir, prefix):
    # all_dic = {"suspect": [], "detected": [], "not_done":[], "timeout":[], "benign":[]}
    thread_num = 200
    old_results_file = os.path.join(pathDir, prefix + '.txt')
    if os.path.exists(old_results_file):
        with open(old_results_file) as f:
            all_dic = json.load(f)
            all_dic['not_done'] = []
            all_dic['benign'] = []
    else:
        all_dic = {"detected": [], "not_done": [], "timeout": [], "benign": []}
    with open(old_results_file, 'w') as f:
        for i in range(0, thread_num):
            with open(os.path.join(pathDir, str(i) + prefix+'.txt')) as fr:
                c = json.load(fr)
                all_dic["detected"].extend(c["detected"])
                all_dic["not_done"].extend(c["not_done"])
                all_dic["timeout"].extend(c["timeout"])
                all_dic["benign"].extend(c["benign"])
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
    tmp = all_dic['benign'].extend(all_dic['not_done'])
    with open(os.path.join(pathDir, 'not_done_benign.txt'), 'w') as f:
        json.dump(tmp, f)
    for i in range(0, thread_num):
        os.remove(os.path.join(pathDir, str(i) + prefix+'.txt'))


def run_with_threads(resDir, extension_path, idfile, func, thread_num = 200):
    threads = []
    flag = 0
    prefix = 'opgen_results'
    with open(idfile) as f:
        ids = json.load(f)
    step = len(ids) // thread_num
    print('Task started with %d threads.'%thread_num)
    for i in range(thread_num - 1):
        t = threading.Thread(target=func, args=(i, resDir, extension_path, ids[flag:flag+step]))
        t.start()
        threads.append(t)
        flag += step
    t = threading.Thread(target=func, args=(thread_num - 1, resDir, extension_path, ids[flag:]))
    t.start()
    threads.append(t)
    for t in threads:
        t.join()
    sum_all_files(resDir, prefix)

    # input: extension_path, extension_id_list
    # output: not_solved.txt
"""    
    if mode in ["empoweb", "doublex"]:
        output_file = ''
        extension_path = ''
        if mode == 'empoweb':
            output_file = 'crx_lists/doublex_ground_not_solved.txt'
            extension_path = "/Users/jia/Desktop/tmp/data_process/DoubleX_new/ground-truth/extension-set"
            # idfile = "crx_lists/doublex_ground.txt"
        elif mode == 'doublex':
            output_file = 'crx_lists/doublex_vul_not_solved.txt'
            extension_path = "/Users/jia/Desktop/tmp/data_process/DoubleX_new/vulnerable-extensions/extension-set"
            # idfile = "crx_lists/doublex_vul.txt"
        f = open(output_file)
        ids = json.load(f)
        new_ids = []
        for id in ids:
            if ana_opgen_dir(extension_path, id) and ana_res_file(extension_path, id):
                continue
            else:
                new_ids.append(id)
        with open("")
"""
def main():
    res_dir = ''
    mode = sys.argv[1]
    thread_num = 200
    extension_path = "/media/data2/jianjia/extension_data/unzipped_extensions"
    # idfile = "/media/data2/jianjia/extension_data/filtered_file.txt"
    idfile = ''
    if mode == 'doublex_de':
        res_dir = '/media/data2/jianjia/extension_data/opgen_results/detected_by_doublex'
        idfile = '/media/data2/jianjia/extension_data/doublex_result/detected.txt'
    elif mode == 'doublex_sus':
        res_dir = '/media/data2/jianjia/extension_data/opgen_results/suspect_by_doublex'
        idfile = '/media/data2/jianjia/extension_data/doublex_result/suspect.txt'
    # elif mode == "cve":
    #         extension_path = '/Users/jia/Desktop/tmp/data_process/CVE'
    run_with_threads(res_dir, extension_path, idfile, analyze_results, thread_num = thread_num)


if __name__=='__main__':
    main()



# if mode.startswith('local'):
#     old_results_file = os.path.join(res_dir, 'opgen_results.txt')
#     old_dic['novul_ids'] = [i for i in old_dic['novul_ids'] if i not in old_dic["detectd_ids"]]
#     for i in old_dic:
#         print(i)
#         print(len(old_dic[i]))
#     with open(old_results_file, 'w') as f:
#         json.dump(old_dic, f)
#     should_do = []
#     old_dic["detectd_ids"].sort()
#     old_dic["processed_ids"].sort()
#     for i in old_dic["processed_ids"]:
#         if i in old_dic["detectd_ids"]:
#             print(1)
#             pass
#         else:
#             should_do.append(i)
#             print(0)
#     with open(os.path.join(res_dir, 'should_do.txt'), 'w') as f:
#         json.dump(should_do, f)
# elif mode.startswith('server'):
#     old_results_file = os.path.join(res_dir, 'opgen_results.txt')
#     with open(old_results_file, 'w') as f:
#         json.dump(old_dic, f)
#     for i in old_dic:
#         print(i)
#         print(len(old_dic[i]))
#     if mode=='server_de':
#         with open(doublex_de) as f:
#             c = json.load(f)
#         doublex_1_opgen_0 = os.path.join(res_dir, 'doublex_1_opgen_0.txt')
#         with open(doublex_1_opgen_0, 'w') as f:
#             json.dump([i for i in processed_ids if i not in detectd_ids], f)
#     elif mode=='server_sus':
#         with open(doublex_sus) as f:
#             c = json.load(f)
#         doublex_0_opgen_1 = os.path.join(res_dir, 'doublex_0_opgen_1.txt')
#         with open(doublex_0_opgen_1, 'w') as f:
#             json.dump(detectd_ids, f)
#     should_do = [i for i in c if i not in processed_ids]
#     print('should_do')
#     print(len(should_do))
#     with open(os.path.join(res_dir, 'new_to_do.txt'), 'w') as f:
#         json.dump(should_do, f)
#
# elif mode=="cve":
#     res_dir = '/Users/jia/Desktop/tmp/data_process/CVE'
#     files = os.listdir(res_dir)
#     files  = [i for i in files if not i.startswith(".")]
#     detected = []
#     not_detected = []
#     for file in files:
#         with open(os.path.join(res_dir, file, "opgen_generated_files","res.txt")) as f:
#             content = f.read()
#         if "nothing detected" not in content:
#             detected.append(file)
#         else:
#             not_detected.append(file)
#     print("detected")
#     print(detected)
#     print("not_detected")
#     print(not_detected)
