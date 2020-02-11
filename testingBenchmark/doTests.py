import random
from func_timeout import func_timeout, FunctionTimedOut
import os
from tqdm import tqdm
import sys
import sklearn.metrics as SM
import core.scanner as njsscan
sys.path.append("..")
from npmtest.multi_run_helper import *

testing_benchmark_logger = create_logger("testing_benchmark", output_type = "file", 
        level=10, file_name="testing_benchmark.log")

command_injection_dir = "/media/data2/song/vulPackages/command_injection/"
all_package_dir = "/media/data2/song/npmpackages/"

def generateDatabase(
        location_number_map={all_package_dir: 2, command_injection_dir: 2}):
    """
    randomly pick lists of packages from the big database

    Args: 
        location_number_map: the map of the aim dir and the number we need to
            pick from this dir
    return:
        a map of aim_dir vs selected packages
    """
    selected_lists = {}
    for aim_dir in location_number_map:
        cur_full_list = get_list_of_packages(aim_dir)
        selected_lists[aim_dir] = random.choices(cur_full_list, 
                k=location_number_map[aim_dir])

    return selected_lists

def get_result_score(compare_lists):
    """
    get the matrics of the results
    args:
        compare_lists: a list of pairs, can be [[p1, p2], (p3, p4)]
    return:
        the f1_score, precision, recall, accuracy of each pair as a list
    """
    res = []
    for pair in compare_lists:
        l1 = pair[0]
        l2 = pair[1]
        res.append(SM.f1_score(l1, l2), SM.precision_score(l1, l2),
                SM.recall_score(l1, l2), SM.accuracy_score(l1, l2))
    return res

def jsopg_test(package, vul_type):
    """
    run the test for jsopg
    return: 
        1, success
        2, timeout
        3, other error
    """
    timeout = 120
    try:
        res = func_timeout(timeout, test_package, 
                args=(package, vul_type))
    except FunctionTimedOut:
        res = 2
    except e:
        res = 3

    return res

def run_tests(package_list, vul_type="os_command"):
    """
    run the test

    args:
        package_list: a list of packages
    return:
        res_list: the running result as 1 for vulnerable, -1 for timeout
            and 0 for not vulnerable
        timeout_cnt: a dict with number of timeouts in each dir
        success_cnt: a dict with number of successfully found vulnerabilities 
            in each dir
    """
    testing_tools = ['nodejsscan', 'jsopg']
    res_list = {'nodejsscan': {}, 'jsopg': {}}
    success_cnt = {'nodejsscan': {}, 'jsopg': {}}
    timeout_cnt = {'nodejsscan': {}, 'jsopg': {}}
    for sub_package_list in package_list:
        # init
        for tool in testing_tools:
            res_list[tool][sub_package_list] = {}
            timeout_cnt[tool][sub_package_list] = 0
            success_cnt[tool][sub_package_list] = 0

        for package in package_list[sub_package_list]:

            # nodejsscan
            jsscan_res = njsscan.scan_dirs([package])
            security_issues= jsscan_res['sec_issues']
            res_list['nodejsscan'][sub_package_list][package] = security_issues
            for key in security_issues:
                print(key)
                if "Code Injection" in key:
                    success_cnt['nodejsscan'][sub_package_list] += 1
                    break

            # jsopg
            jsopg_res = jsopg_test(package, vul_type)
            if type(jsopg_res) == list and 1 in jsopg_res:
                res_list['jsopg'][sub_package_list][package] = 1
                success_cnt['jsopg'][sub_package_list] += 1
            elif jsopg_res == 2:
                timeout_cntp['jsopg'][sub_package_list] += 1
                res_list['jsopg'][sub_package_list][package] = 2
            else:
                res_list['jsopg'][sub_package_list][package] = 3

    return res_list, timeout_cnt, success_cnt

location_number_map = {all_package_dir: 80,
            command_injection_dir: 20}

testing_database = generateDatabase(location_number_map=location_number_map)

testing_benchmark_logger.info("Seletected testing dataset: {}".format(testing_database))

res_list, timeout_cnt, success_cnt = run_tests(testing_database)
testing_benchmark_logger.info("results: {}".format(res_list))
testing_benchmark_logger.info("timeout: {}".format(timeout_cnt))
testing_benchmark_logger.info("success_cnt: {}".format(success_cnt))

res_matrix = {}
for key in success_cnt:
    res_matrix[key] = {}

    res_matrix[key]['tp'] = success_cnt[key][command_injection_dir]
    res_matrix[key]['fp'] = success_cnt[key][all_package_dir]
    res_matrix[key]['tn'] = location_number_map[all_package_dir] - \
        success_cnt[key][all_package_dir]
    res_matrix[key]['fn'] = location_number_map[command_injection_dir] - \
            success_cnt[key][command_injection_dir]

    if res_matrix[key]['tp'] == 0:
        res_matrix[key]['precision'] = 0
        res_matrix[key]['recall'] = 0
        res_matrix[key]['f1_score'] = 0
        continue

    res_matrix[key]['precision'] = res_matrix[key]['tp'] / \
            (res_matrix[key]['tp'] + res_matrix[key]['fp'])
    res_matrix[key]['recall'] = res_matrix[key]['tp'] / \
            (res_matrix[key]['tp'] + res_matrix[key]['fn'])
    res_matrix[key]['f1_score'] = 2 * res_matrix[key]['precision'] * \
            res_matrix[key]['recall'] / (res_matrix[key]['precision'] + \
                    res_matrix[key]['recall'])

for key in res_matrix:
    testing_benchmark_logger.info("{}; {}".format(key, res_matrix[key]))
