import os
import json 
import sys
import pygount
import traceback as tb
from tqdm import tqdm
import subprocess

sys.path.append("..")
from simurun.launcher import unittest_main
from simurun.logger import *
from simurun.trace_rule import TraceRule
from simurun.vulChecking import *
from simurun.vulFuncLists import *

npm_test_logger = create_logger("npmtest", output_type = "file", file_name="npmtest.log")

def validate_package(package_path):
    """
    check whether a package is valid by whether it include package.json
    Args:
        package_path: the path to the package
    Returns:
        True or False
    """
    package_json_path = '{}/package.json'.format(package_path)
    return os.path.exists(package_json_path)
    
def get_list_of_packages(path, limit=None):
    """
    return a list of package names, which is the name of the folders in the path
    Args:
        path: the path of packages folder
    return:
        a list of package names
    """
    possible_packages = [os.path.join(path, name) for name in os.listdir(path)]

    if limit is not None:
        possible_packages = possible_packages[:limit]
    
    all_packages = []
    for package in possible_packages:
        if package.split('/')[-1][0] == '@' and (not validate_package(package)):
            #should have sub dir
            sub_packages = [os.path.join(package, name) for name in os.listdir(package)]
            all_packages += sub_packages
        else:
            all_packages.append(package)
    
    if limit is not None:
        all_packages = all_packages[:limit]
    
    return all_packages 

def get_entrance_files_of_package(package_path):
    """
    get the entrance file pathes of a package
    we use madge to get all the entrance functions, which are the files that no one require
    at the same time if the main file of the package json is not included
    include the main file into the list
    Args:
        package: the path of a package
    return:
        the main entrance files of the library
    """

    entrance_files = []
    package_json_path = os.path.join(package_path, 'package.json')
    if not validate_package(package_path):
        print("ERROR: {} do not exist".format(package_json_path)) 
        return None

    with open(package_json_path) as fp:
        try:
            package_json = json.load(fp)
        except:
            print("Skip special encoding {}".format(package_path))
            npm_test_logger.error("Special encoding {}".format(package_path))
            return [] 

        if 'main' not in package_json:
            main_file = 'index.js'
        else:
            main_file = package_json['main']


    analysis_path = './require_analysis.js'
    proc = subprocess.Popen(['node', analysis_path,
        package_path], text=True,
        stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    stdout, stderr = proc.communicate()
    #here we assume that there are no ' in the file names
    stdout = stdout.replace('\'', '"')
    package_structure = json.loads(stdout)

    for root_file in package_structure:
        entrance_files.append(root_file)

    if main_file not in entrance_files:
        entrance_files.append(main_file)

    main_file_pathes = ["{}/{}".format(package_path, main_file) for main_file in entrance_files]

    return main_file_pathes

def item_line_count(path):
    if os.path.isdir(path):
        return dir_line_count(path)
    elif os.path.isfile(path):
        return len(open(path, 'rb').readlines())
    else:
        return 0

def item_size_count(path):
    if os.path.isdir(path):
        return dir_line_count(path)
    elif os.path.isfile(path):
        if path.split('.')[-1] != 'js':
            return 0
        return os.path.getsize(path)
    else:
        return 0

def dir_line_count(dir):
    return sum(map(lambda item: item_line_count(os.path.join(dir, item)), os.listdir(dir)))

def dir_size_count(dir):
    return sum(map(lambda item: item_size_count(os.path.join(dir, item)), os.listdir(dir)))

def unit_check_log(G, vul_type, package=None):
    """
    run the check and log the result
    """
    res_path = traceback(G, vul_type)
    line_path = res_path[0]
    detailed_path = res_path[1]
    caller_list = res_path[2]
    checking_res = vul_checking(G, line_path, vul_type)
    if (len(line_path) != 0 or len(caller_list) != 0) and len(checking_res) != 0:
        print("Found path from {}: {}\n".format(package, checking_res))
        with open("found_path_{}".format(vul_type), 'a+') as fp:
            fp.write("{} called".format(caller_list))
            fp.write("Found path from {}: {}\n".format(package, checking_res))

def test_package(package_path):
    # TODO: change the return value
    """
    test a specific package
    Args:
        package_name: the name of the package
    return:
        the result:
            1, success
            -1, skipped
            -2, not found. package parse error
            -3, graph generation error
    """
    # pre-filtering the signature functions by grep


    line_count = dir_line_count(package_path)
    size_count = dir_size_count(package_path)
    npm_test_logger.info("Running {}, size: {}, cloc: {}".format(package_path, size_count, line_count))

    package_main_files = get_entrance_files_of_package(package_path)
    print(package_main_files)
    res = []

    if package_main_files is None:
        return []
    for package_file in package_main_files:
        res.append(test_file(package_file))
    npm_test_logger.info("Finished {}, size: {}, cloc: {}".format(package_path, size_count, line_count))
    return res

def test_file(file_path):
    """
    test a specific file 
    Args:
        file_path: the path of the file 
    return:
        the result:
            1, success
            -1, skipped
            -2, not found. package parse error
            -3, graph generation error
    """
    print("testing {}".format(file_path))

    if file_path is None:
        npm_test_logger.error("{} not found".format(file_path))
        return -2


    js_call_templete = "var main_func=require('{}');\nmain_func('var');".format(file_path)
    with open("__test__.js", 'w') as jcp:
        jcp.write(js_call_templete)

    """
    G = unittest_main('__test__.js', check_signatures=get_all_sign_list())
    """

    try:
        G = unittest_main('__test__.js', check_signatures=get_all_sign_list())
        #G = unittest_main('__test__.js', check_signatures=[])
    except Exception as e:
        npm_test_logger.error("ERROR when generate graph for {}.".format(file_path))
        npm_test_logger.error(e)
        npm_test_logger.debug(tb.format_exc())
        return -3

    if G is None:
        npm_test_logger.error("Skip {} for no signature functions".format(file_path))
        return -4

    unit_check_log(G, 'xss', file_path)
    unit_check_log(G, 'os_command', file_path)

    try:
        os.remove("run_log.log")
        os.remove("out.dat")
    except:
        pass

    # not necessary but just in case
    del G
    return 1

root_path = "/media/data/lsong18/data/npmpackages/"
#root_path = "/home/lsong18/projs/node_modules/"

def main():
    packages = get_list_of_packages(root_path, limit = 50000)
    tqdm_bar = tqdm(packages)

    success_list = []
    skip_list = []
    not_found = []
    generate_error = []
    total_cnt = len(packages)
    cur_cnt = 0

    for package in tqdm_bar:
        cur_cnt += 1
        if cur_cnt < 0:
            continue
        npm_test_logger.info("No {}".format(cur_cnt))
        tqdm_bar.set_description("No {}, {}".format(cur_cnt, package.split('/')[-1]))
        tqdm_bar.refresh()
        result = test_package(package)
        if 1 in result:
            success_list.append(package)
        elif -1 in result:
            skip_list.append(package)
            npm_test_logger.error("Skip {} for large file".format(package))
        elif -2 in result:
            not_found.append(package)
            npm_test_logger.error("Skip {} for not found main".format(package))
        elif -3 in result:
            generate_error.append(package)
            npm_test_logger.error("Generate {} error".format(package))

    npm_test_logger.info("Success rate: {}%, {} out of {}, {} skipped and {} failed".format(float(len(success_list)) / total_cnt,\
            len(success_list), total_cnt, len(skip_list), total_cnt - len(skip_list) - len(success_list)))
    npm_test_logger.info("{} fails caused by package error, {} fails caused by generate error".format(len(not_found), len(generate_error)))
    npm_test_logger.error("Generation error list: {}".format(generate_error))

    print("Success rate: {}%, {} out of {}, {} skipped and {} failed".format(float(len(success_list)) / total_cnt,\
            len(success_list), total_cnt, len(skip_list), total_cnt - len(skip_list) - len(success_list)))

    print("{} fails caused by package error, {} fails caused by generate error".format(len(not_found), len(generate_error)))
    

test_package(os.path.join(root_path, 'thaumaturgy'))
#test_package(os.path.join(root_path, 'are-we-there-yet'))
#main()
