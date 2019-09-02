import os
import json 

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
        package_json = json.load(fp)

        if 'main' not in package_json:
            main_file = 'index.js'
        else:
            main_file = package_json['main']

    main_file_path = "{}/{}".format(package_path, main_file)
    if os.path.exists(main_file_path):
        return main_file_path
    else:
        return None

root_path = "/media/data/lsong18/data/npmpackages/"
packages = get_list_of_packages(root_path, limit = 10)
for package in packages:
    package_main_file = get_main_file_of_package("{}{}".format(root_path, package))
    if package_main_file is None:
        print(package)
        continue
    print(package_main_file)
