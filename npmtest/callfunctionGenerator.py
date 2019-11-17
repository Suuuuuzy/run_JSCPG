import os
import json 
import sys
import pygount
import traceback as tb
from tqdm import tqdm
import subprocess
from func_timeout import func_timeout, FunctionTimedOut

sys.path.append("..")
from simurun.launcher import unittest_main
from simurun.logger import *
from simurun.trace_rule import TraceRule
from simurun.vulChecking import *
from simurun.vulFuncLists import *

npm_test_logger = create_logger("npmtest", output_type = "file", file_name="npmtest.log")
npm_res_logger = create_logger("npmres", output_type = "file", file_name="npmres.log")

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
        if not os.path.isdir(package):
            continue
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
        package_json = {}
        try:
            package_json = json.load(fp)
        except:
            npm_test_logger.error("Special {}".format(package_path))

        if 'main' not in package_json:
            main_file = 'index.js'
        else:
            main_file = package_json['main']


    if main_file[-3:] != ".js":
        main_file += "/index.js"

    analysis_path = './require_analysis.js'
    proc = subprocess.Popen(['node', analysis_path,
        package_path], text=True,
        stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    stdout, stderr = proc.communicate()
    #here we assume that there are no ' in the file names
    #print(stdout)
    stdout = stdout.replace('\'', '"')
    package_structure = json.loads(stdout)

    for root_file in package_structure:
        entrance_files.append(root_file)

    if main_file not in entrance_files and os.path.exists("{}/{}".format(package_path, main_file)):
        entrance_files.append(main_file)

    main_file_pathes = ["{}/{}".format(package_path, main_file) for main_file in entrance_files]
    print("Entrance Files ", main_file_pathes)

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
        with open("found_path_{}.log".format(vul_type), 'a+') as fp:
            fp.write("{} called".format(caller_list))
            fp.write("Found path from {}: {}\n".format(package, checking_res))
        return 1
    else:
        with open("not_found_path_{}.log".format(vul_type), 'a+') as fp:
            fp.write("{} called".format(caller_list))
            fp.write("Not Found path from {}: {}\n".format(package, checking_res))
        return 0

def test_package(package_path, vul_type='xss'):
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
    # print(package_main_files)
    res = []

    if package_main_files is None:
        return []
    for package_file in package_main_files:
        res.append(test_file(package_file, vul_type))
    npm_test_logger.info("Finished {}, size: {}, cloc: {}".format(package_path, size_count, line_count))
    return res

def test_file(file_path, vul_type='xss'):
    """
    test a specific file 
    Args:
        file_path: the path of the file 
    return:
        the result:
            1, success
            -1, -4, skipped
            -2, not found. package parse error
            -3, graph generation error
    """
    print("Testing", file_path)
    if file_path is None:
        npm_test_logger.error("{} not found".format(file_path))
        return -2


    js_call_templete = "var main_func=require('{}');".format(file_path)
    with open("__test__.js", 'w') as jcp:
        jcp.write(js_call_templete)

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

    xss_res = unit_check_log(G, 'xss', file_path)
    os_command_res = unit_check_log(G, 'os_command', file_path)

    try:
        os.remove("run_log.log")
        os.remove("out.dat")
    except:
        pass

    # not necessary but just in case
    del G
    if vul_type == 'xss':
        final_res = xss_res
    elif vul_type == 'os_command':
        final_res = os_command_res
    return final_res

#root_path = "/media/data/lsong18/data/npmpackages/"
#root_path = "/home/lsong18/projs/JSCPG/package_downloader/packages/"
root_path = "/media/data/lsong18/data/vulPackages/command_injection/"
#root_path = "/media/data/lsong18/data/vulPackages/packages/"
#testing_packages = [root_path + 'forms@1.2.0']
testing_packages = ['gitlabhook@0.0.17', 'gm@1.20.0', 'kill-port@1.3.1', 'fs-git@1.0.1']
testing_packages = [root_path + t for t in testing_packages]
skip_packages = []

def main():
    if len(testing_packages) == 0:
        packages = get_list_of_packages(root_path, limit = 50000)
    else:
        packages = testing_packages

    if len(skip_packages) != 0:
        packages = [package for package in packages if package not in skip_packages]

    tqdm_bar = tqdm(packages)
    vul_type = 'os_command'
    timeout = 600

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
        try:
            result = func_timeout(timeout, test_package, args=(package, vul_type))
            # result = test_package(package, vul_type)
        except FunctionTimedOut:
            npm_res_logger.error("{} takes more than {} seconds".format(package, timeout))
            skip_list.append(package)
            continue
        except Exception as e:
            print(e)

        print(result)
        if 1 in result:
            success_list.append(package)
            npm_res_logger.info("{} successfully found in {}".format(vul_type, package))
        elif -1 in result:
            skip_list.append(package)
            npm_res_logger.error("Skip {} for other reasons".format(package))
        elif -2 in result or -4 in result:
            not_found.append(package)
            npm_res_logger.error("Skip {} for not found main or not found signature functions".format(package))
        elif -3 in result:
            generate_error.append(package)
            npm_res_logger.error("Generate {} error".format(package))

    npm_test_logger.info("Success rate: {}%, {} out of {}, {} skipped and {} failed".format(float(len(success_list)) / total_cnt,\
            len(success_list), total_cnt, len(skip_list), total_cnt - len(skip_list) - len(success_list)))
    npm_test_logger.info("{} fails caused by package error, {} fails caused by generate error".format(len(not_found), len(generate_error)))
    npm_test_logger.error("Generation error list: {}".format(generate_error))

    print("Success rate: {}%, {} out of {}, {} skipped and {} failed".format(float(len(success_list)) / total_cnt,\
            len(success_list), total_cnt, len(skip_list), total_cnt - len(skip_list) - len(success_list)))

    print("{} fails caused by package error, {} fails caused by generate error".format(len(not_found), len(generate_error)))
    

#test_package(os.path.join(root_path, 'apex-publish-static-files@2.0.0'))
#test_package(os.path.join(root_path, 'bootstrap@4.3.0'))
main()
