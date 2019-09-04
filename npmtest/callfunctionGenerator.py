import os
import json 
import sys
import pygount
from tqdm import tqdm
sys.path.append("..")
from simurun.launcher import *
from simurun.logger import *

npm_test_logger = create_logger("npmtest", output_type = "file", file_name="npmtest.log")

def get_list_of_packages(path, limit=None):
    """
    return a list of package names, which is the name of the folders in the path
    Args:
        path: the path of packages folder
    return:
        a list of package names
    """
    if limit is None:
        return [name for name in os.listdir(path) if os.path.isdir(name)]
    else:
        res = []
        cnt = 0
        for name in os.listdir(path):
            cnt += 1
            res.append(name)
            if cnt == limit:
                return res

def get_main_file_of_package(package_path):
    """
    get the main file path of a package
    Args:
        package: the path of a package
    return:
        the main entrance file of the library
    """
    package_json_path = '{}/package.json'.format(package_path)
    if not os.path.exists(package_json_path):
        print("ERROR: {} do not exist".format(package_json_path)) 
        return None

    with open(package_json_path) as fp:
        try:
            package_json = json.load(fp)
        except:
            print("Skip special encoding {}".format(package_path))
            npm_test_logger.error("Special encoding {}".format(package_path))
            return None

        if 'main' not in package_json:
            main_file = 'index.js'
        else:
            main_file = package_json['main']

    main_file_path = "{}/{}".format(package_path, main_file)
    if os.path.exists(main_file_path):
        return main_file_path
    else:
        return None

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

def test_package(package, root_path):
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
    line_count = dir_line_count(root_path + package)
    size_count = dir_size_count(root_path + package)
    npm_test_logger.info("Running {}, size: {}, cloc: {}".format(package, size_count, line_count))
    if size_count > 409600 or line_count > 200000:
        npm_test_logger.warning("Skip {}".format(package))
        return -1

    package_main_file = get_main_file_of_package("{}{}".format(root_path, package))
    if package_main_file is None:
        npm_test_logger.error("{} not found".format(package))
        return -2
    js_call_templete = "var main_func=require('{}');\nmain_func('var');".format(package_main_file)
    with open("__test__.js", 'w') as jcp:
        jcp.write(js_call_templete)

    try:
        G = unittest_main('__test__.js')
    except Exception as e:
        npm_test_logger.error("ERROR when generate graph for {}.".format(package))
        npm_test_logger.error(e)
        return -3
    res_path = G.traceback("os-command")
    line_path = res_path[0]
    detailed_path = res_path[1]
    caller_list = res_path[2]
    if len(line_path) != 0 or len(caller_list) != 0:
        with open("found_path", 'a+') as fp:
            fp.write("{} called".format(caller_list))
            fp.write("Found path from {}: {}\n".format(package, line_path))

    os.remove("run_log.log")
    os.remove("out.dat")
    return 1

root_path = "/media/data/lsong18/data/npmpackages/"

def main():
    packages = get_list_of_packages(root_path, limit = 10000)
    tqdm_bar = tqdm(packages)

    success_list = []
    skip_list = []
    not_found = []
    generate_error = []
    total_cnt = len(packages)

    for package in tqdm_bar:
        tqdm_bar.set_description("{}".format(package))
        tqdm_bar.refresh()
        result = test_package(package, root_path)
        if result == 1:
            success_list.append(package)
        elif result == -1:
            skip_list.append(package)
            npm_test_logger.error("Skip {} for large file".format(package))
        elif result == -2:
            not_found.append(package)
            npm_test_logger.error("Skip {} for not found main".format(package))
        elif result == -3:
            generate_error.append(package)
            npm_test_logger.error("Generate {} error".format(package))

    npm_test_logger.info("Success rate: {}%, {} out of {}, {} skipped and {} failed".format(float(len(success_list)) / total_cnt,\
            len(success_list), total_cnt, len(skip_list), total_cnt - len(skip_list) - len(success_list)))
    npm_test_logger.info("{} fails caused by package error, {} fails caused by generate error".format(len(not_found), len(generate_error)))
    npm_test_logger.error("Generation error list: {}".format(generate_error))

    print("Success rate: {}%, {} out of {}, {} skipped and {} failed".format(float(len(success_list)) / total_cnt,\
            len(success_list), total_cnt, len(skip_list), total_cnt - len(skip_list) - len(success_list)))

    print("{} fails caused by package error, {} fails caused by generate error".format(len(not_found), len(generate_error)))
    

#test_package('qrcode-lite', root_path)
main()
