import random
import os
from tqdm import tqdm
import sys
import sklearn.metrics as SM
sys.path.append("..")
from npmtest.callfunctionGenerator import get_list_of_packages

def generateDatabase(total_size=100, command_injection_size=10):
    """
    randomly pick two lists of packages from the big database and 
    command injection database

    Args: 
        total_size: the size of the total returned list
        command_injection_size: the size of the selected command_injection list
    return:
        selected command injection list, selected other packages
    """
    command_injection_dir = "/media/data/lsong18/data/vulPackages/command_injection/"
    all_package_dir = "/media/data/lsong18/data/npmpackages/"

    command_injection_packages = get_list_of_packages(command_injection_dir)
    all_package_dir = get_list_of_packages(all_package_dir)

    sample_ci_list = random.choices(command_injection_packages, 
            k=command_injection_size)
    sample_other_list = random.choices(all_package_dir, 
            k=total_size - command_injection_size)

    return sample_ci_list, sample_other_list

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

testing_database = generateDatabase()
print(testing_database)
