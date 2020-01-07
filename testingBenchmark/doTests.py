import random
from func_timeout import func_timeout, FunctionTimedOut
import os
from tqdm import tqdm
import sys
import sklearn.metrics as SM
sys.path.append("..")
from npmtest.multi_run_helper import *

command_injection_dir = "/media/data/lsong18/data/vulPackages/command_injection/"
all_package_dir = "/media/data/lsong18/data/npmpackages/"

def generateDatabase(total_size=100, 
        location_number_map={all_package_dir: 90, command_injection_dir: 10}):
    """
    randomly pick lists of packages from the big database

    Args: 
        total_size: the size of the total returned list
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

def run_tests(package_list, vul_type="os_command"):
    """
    args:
        package_list: a list of packages
    return:
        the running result as 1 for vulnerable and 0 for not vulnerable
    """
    timeout = 120
    success_list = {}
    success_cnt = {}
    for sub_package_list in package_list:
        success_list[sub_package_list] = {}
        success_cnt[sub_package_list] = 0
        for package in package_list[sub_package_list]:
            res = func_timeout(timeout, test_package, 
                    args=(package, vul_type))
            success_list[sub_package_list][package] = res
            if res == 1:
                success_cnt[sub_package_list] += 1
    print(success_list)
    print(success_cnt)

testing_database = generateDatabase()
run_tests(testing_database)
print(testing_database)
