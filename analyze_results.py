import os
import sys
import json
dirname = ''
mode = sys.argv[1]
if mode=='local_gr':
    dirname = '/Users/jia/Desktop/tmp/EOPG/result_analyze/opgen_results/paper_ground_truth'
elif mode=='local_de':
    dirname = '/Users/jia/Desktop/tmp/EOPG/result_analyze/opgen_results/paper_detected'
elif mode=='server_de':
    dirname = '/media/data2/jianjia/extension_data/opgen_results/detected_by_doublex'
    doublex_de = '/media/data2/jianjia/extension_data/doublex_result/detected.txt'
elif mode=='server_sus':
    dirname = '/media/data2/jianjia/extension_data/opgen_results/suspect_by_doublex'
    doublex_sus = '/media/data2/jianjia/extension_data/doublex_result/suspect.txt'
elif mode=="cve":
    dirname = '/Users/jia/Desktop/tmp/data_process/CVE'

# old_filename = os.path.join(dirname, 'results.log')
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

if mode.startswith('local'):
    old_results_file = os.path.join(dirname, 'opgen_results.txt')
    old_dic['novul_ids'] = [i for i in old_dic['novul_ids'] if i not in old_dic["detectd_ids"]]
    for i in old_dic:
        print(i)
        print(len(old_dic[i]))
    with open(old_results_file, 'w') as f:
        json.dump(old_dic, f)
    should_do = []
    old_dic["detectd_ids"].sort()
    old_dic["processed_ids"].sort()
    for i in old_dic["processed_ids"]:
        if i in old_dic["detectd_ids"]:
            print(1)
            pass
        else:
            should_do.append(i)
            print(0)
    with open(os.path.join(dirname, 'should_do.txt'), 'w') as f:
        json.dump(should_do, f)
elif mode.startswith('server'):
    old_results_file = os.path.join(dirname, 'opgen_results.txt')
    with open(old_results_file, 'w') as f:
        json.dump(old_dic, f)
    for i in old_dic:
        print(i)
        print(len(old_dic[i]))
    if mode=='server_de':
        with open(doublex_de) as f:
            c = json.load(f)
        doublex_1_opgen_0 = os.path.join(dirname, 'doublex_1_opgen_0.txt')
        with open(doublex_1_opgen_0, 'w') as f:
            json.dump([i for i in processed_ids if i not in detectd_ids], f)
    elif mode=='server_sus':
        with open(doublex_sus) as f:
            c = json.load(f)
        doublex_0_opgen_1 = os.path.join(dirname, 'doublex_0_opgen_1.txt')
        with open(doublex_0_opgen_1, 'w') as f:
            json.dump(detectd_ids, f)
    should_do = [i for i in c if i not in processed_ids]
    print('should_do')
    print(len(should_do))
    with open(os.path.join(dirname, 'new_to_do.txt'), 'w') as f:
        json.dump(should_do, f)

elif mode=="cve":
    dirname = '/Users/jia/Desktop/tmp/data_process/CVE'
    files = os.listdir(dirname)
    files  = [i for i in files if not i.startswith(".")]
    detected = []
    not_detected = []
    for file in files:
        with open(os.path.join(dirname,file, "opgen_generated_files","res.txt")) as f:
            content = f.read()
        if "nothing detected" not in content:
            detected.append(file)
        else:
            not_detected.append(file)
    print("detected")
    print(detected)
    print("not_detected")
    print(not_detected)
