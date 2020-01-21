import os
import json 
import pygount
import traceback as tb
from tqdm import tqdm
import subprocess
from func_timeout import func_timeout, FunctionTimedOut
import threading
import argparse
import uuid
import gc
import sys
sys.path.append("..")
from simurun.launcher import unittest_main
from simurun.logger import *
from simurun.trace_rule import TraceRule
from simurun.vulChecking import *
from simurun.vulFuncLists import *

root_path = "/media/data2/lsong18/data/pre_npmpackages/"
#root_path = "/home/lsong18/projs/JSCPG/package_downloader/packages/"
#root_path = "/home/lsong18/projs/JSCPG/test/"
#root_path = "/media/data/lsong18/data/vulPackages/command_injection/"
#root_path = "/media/data/lsong18/data/vulPackages/packages/"
#testing_packages = [root_path + 'forms@1.2.0']
skip_packages = []

args = None

npm_test_logger = create_logger("npmtest", output_type = "file", level=10, file_name="npmtest.log")
npm_res_logger = create_logger("npmres", output_type = "file", level=10, file_name="npmres.log")
npm_success_logger = create_logger("npmsuccess", output_type = "file", level=10, file_name="npmsuccess.log")
npm_run_logger = create_logger("npmrun", output_type = "file", level=10, file_name="npmrun.log")

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
    
def get_list_of_packages(path, start_id=None, size=None):
    """
    return a list of package names, which is the name of the folders in the path
    Args:
        path: the path of packages folder
    return:
        a list of package names
    """
    possible_packages = [os.path.join(path, name) for name in os.listdir(path)]

    if start_id is not None:
        possible_packages = possible_packages[start_id:]
    if size is not None:
        possible_packages = possible_packages[:size]
    
    all_packages = []
    print("Preparing")
    for package in tqdm(possible_packages):
        if not os.path.isdir(package):
            continue
        # print(package)
        if package.split('/')[-1][0] == '@' and (not validate_package(package)):
            #should have sub dir
            sub_packages = [os.path.join(package, name) for name in os.listdir(package)]
            all_packages += sub_packages
        else:
            all_packages.append(package)
    
    print('Prepared')
    
    return all_packages 

def get_entrance_files_of_package(package_path, get_all=False):
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
    main_files = []
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

    # entrance file maybe two different formats
    # ./index = ./index.js or ./index = ./index/index.js
    if main_file[-3:] != ".js":
        main_files.append(main_file + "/index.js")
        main_file += '.js'

    main_files.append(main_file)

    if get_all:
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

    for main_file in main_files:
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
        """
        print("Found path from {}: {}\n".format(package, checking_res))
        with open("found_path_{}.log".format(vul_type), 'a+') as fp:
            fp.write("{} called".format(caller_list))
            fp.write("Found path from {}: {}\n".format(package, checking_res))
        """
        return 1
    else:
        """
        with open("not_found_path_{}.log".format(vul_type), 'a+') as fp:
            fp.write("{} called".format(caller_list))
            fp.write("Not Found path from {}: {}\n".format(package, checking_res))
        """
        return 0

def test_package(package_path, vul_type='os_command', single_branch=False):
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

    # the main generating program can solve the main file
    # but we also get the entrance files
    package_main_files = get_entrance_files_of_package(package_path, get_all=False)
    # print(package_main_files)
    res = []

    if package_main_files is None:
        return []

    for package_file in package_main_files:
        test_res = test_file(package_file, vul_type)
        res.append(test_res)
        if test_res == 1:
            # successfully found
            npm_test_logger.info("Finished {}, size: {}, cloc: {}".format(package_path, size_count, line_count))
            return res

    npm_test_logger.info("Finished {}, size: {}, cloc: {}".format(package_path, size_count, line_count))
    return res

def test_file(file_path, vul_type='xss', single_branch=False):
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
    print("Testing {} {}".format(vul_type, file_path))
    if file_path is None:
        npm_test_logger.error("{} not found".format(file_path))
        return -2

    if not os.path.exists('./run_tmp'):
        os.mkdir('./run_tmp')

    test_file_name = "./run_tmp/{}_{}.js".format(file_path.split('/')[-1], str(uuid.uuid4()))
    js_call_templete = "var main_func=require('{}');".format(file_path)
    with open(test_file_name, 'w') as jcp:
        jcp.write(js_call_templete)

    G = None
    try:
        if vul_type == 'proto_pollution':
            G = unittest_main(test_file_name, check_proto_pollution=True,
                single_branch=single_branch)
        else:
            G = unittest_main(test_file_name, check_signatures=get_all_sign_list(),
                single_branch=single_branch, vul_type=vul_type)
    except Exception as e:
        os.remove(test_file_name)
        del G
        npm_test_logger.error("ERROR when generate graph for {}.".format(file_path))
        npm_test_logger.error(e)
        npm_test_logger.debug(tb.format_exc())
        return -3

    try:
        os.remove(test_file_name)
 #       os.remove("run_log.log")
        os.remove("out.dat")
    except:
        pass

    if G is None:
        npm_test_logger.error("Skip {} for no signature functions".format(file_path))
        return -4

    if vul_type == 'proto_pollution':
        final_res = 1 if G.proto_pollution else 0
    else:
        final_res = unit_check_log(G, vul_type, file_path)


    # final_res = None
    # not necessary but just in case
    del G
    return final_res

def pre_filter_by_grep(package_list, vul_type='os_command'):
    """
    pre filter the packages by grep the sink functions
    this may introduce some true negatives but I think it's fine
    """

def main(cur_no, num_split):
    global root_path, skip_packages, args
    argparser = argparse.ArgumentParser()
    argparser.add_argument('-c', nargs=2)
    argparser.add_argument('-p', '--print', action='store_true')
    argparser.add_argument('-t', '--vul-type')
    argparser.add_argument('-l', '--timeout', type=int)
    argparser.add_argument('-s', '--single-branch', action='store_true')
    argparser.add_argument('root_path', action='store', nargs='?')
    args = argparser.parse_args()

    chunk_detail = args.c

    if args.print:
        create_logger("main_logger", output_type="console",
            level=logging.DEBUG)
        create_logger("graph_logger", output_type="console",
            level=logging.DEBUG)
        create_logger("npmtest", output_type="console",
            level=logging.DEBUG)
    if args.root_path is not None:
        root_path = args.root_path

    testing_packages = []
    # testing_packages = ['growl@1.9.2']
    if len(testing_packages) == 0:
        packages = get_list_of_packages(root_path, start_id=0, size=300000)
    else:
        testing_packages = [root_path + t for t in testing_packages]
        packages = testing_packages

    if len(skip_packages) != 0:
        packages = [package for package in packages if package not in skip_packages]
    
    block_size = int(len(packages) / num_split) + 1
    packages = packages[block_size * cur_no: block_size * (cur_no+ 1)]

    #vul_type = 'os_command'
    vul_type = 'code_exec'
    timeout = 120

    if args.vul_type is not None:
        vul_type = args.vul_type
    if args.timeout is not None:
        timeout = args.timeout

    success_list = []
    skip_list = []
    not_found = []
    generate_error = []
    total_cnt = len(packages)
    cur_cnt = 0
    thread_pool = {}

    if total_cnt == 0:
        return

    start_id = 0 
    end_id = 2147483647

    if chunk_detail is not None:
        worker_id = int(chunk_detail[0]) - 1
        num_workers = int(chunk_detail[1])
        start_id = int(worker_id * total_cnt / num_workers)
        end_id = int((worker_id + 1) * total_cnt / num_workers)
        if worker_id == num_workers - 1:
            end_id = total_cnt 

    # print(total_cnt, worker_id, num_workers, start_id, end_id)
    packages = packages[start_id: end_id]
    tqdm_bar = tqdm(packages)
    for package in tqdm_bar:
        cur_cnt += 1
        if cur_cnt % 5 == 0:
            gc.collect()

        npm_test_logger.info("No {}".format(cur_cnt))
        npm_run_logger.info("No {} start {}".format(cur_cnt, package))
        tqdm_bar.set_description("No {}, {}".format(cur_cnt, package.split('/')[-1]))
        tqdm_bar.refresh()
        ret_value = 100
        result = [-1]
        try:
            result = func_timeout(timeout, test_package, args=(package, vul_type, args.single_branch))
        except FunctionTimedOut:
            npm_res_logger.error("{} takes more than {} seconds".format(package, timeout))
            skip_list.append(package)
            continue
        except Exception as e:
            npm_res_logger.error("{} ERROR generating".format(package))
            print(e)
            # tb.print_exc()

        print(result)
        if 1 in result:
            success_list.append(package)
            npm_success_logger.info("{} successfully found in {}".format(vul_type, package))
        elif -1 in result:
            skip_list.append(package)
            npm_res_logger.error("Skip {} for other reasons".format(package))
        elif -2 in result or -4 in result:
            not_found.append(package)
            npm_res_logger.error("Skip {} for not found main or not found signature functions".format(package))
        elif -3 in result:
            generate_error.append(package)
            npm_res_logger.error("Generate {} error".format(package))
        elif 0 in result:
            npm_res_logger.error("Not found path in {}".format(package))
        else:
            npm_res_logger.error("Other problems {} return {}".format(package, result))


    npm_test_logger.info("Success rate: {}%, {} out of {}, {} skipped and {} failed".format(float(len(success_list)) / total_cnt * 100,
            len(success_list), total_cnt, len(skip_list), total_cnt - len(skip_list) - len(success_list)))
    npm_test_logger.info("{} fails caused by package error, {} fails caused by generate error".format(len(not_found), len(generate_error)))
    npm_test_logger.error("Generation error list: {}".format(generate_error))

    print("Success rate: {}%, {} out of {}, {} skipped and {} failed".format(float(len(success_list)) / total_cnt * 100,
            len(success_list), total_cnt, len(skip_list), total_cnt - len(skip_list) - len(success_list)))

    print("{} fails caused by package error, {} fails caused by generate error".format(len(not_found), len(generate_error)))
