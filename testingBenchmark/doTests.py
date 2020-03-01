import random
from func_timeout import func_timeout, FunctionTimedOut
import os
from tqdm import tqdm
import sys
import sklearn.metrics as SM
import json
import core.scanner as njsscan
sys.path.append("..")
from npmtest.multi_run_helper import *
sys.path.append("../../JStap/pdg_generation/")
from build_cpg_csv import DFG_generator

testing_benchmark_logger = create_logger("testing_benchmark", output_type = "file", 
        level=10, file_name="testing_benchmark.log")

class BenchMark():
    def __init__(self):
        self.command_injection_dir = "/media/data2/song/vulPackages/updated_databases/command_injection/"
        self.code_exec_dir = "/media/data2/song/vulPackages/updated_databases/code_exec/"
        self.path_traversal_dir = "/media/data2/song/vulPackages/updated_databases/path_traversal/"
        self.prototype_pollution_dir = "/media/data2/song/vulPackages/updated_databases/prototype_pollution/"
        self.all_package_dir = "/media/data2/song/npmpackages/"

        self.all_package_dir_num = 100
        self.location_number_map = {
                self.code_exec_dir: 300,
                self.command_injection_dir: 300,
                self.path_traversal_dir: 300
                }
        self.dir_vul_map = {
                self.command_injection_dir: "os_command",
                self.code_exec_dir: "code_exec",
                self.path_traversal_dir: "path_traversal"
                }
        self.tested_packages = {}
        try:
            self.load_tested("tested_packages.json")
        except:
            print("Load tested packages error")

    def load_tested(self, path):
        """
        load a json file
        """
        self.tested_packages = json.load(open(path, 'r'))
        print("Loaded tested: {}".format(self.tested_packages))
        return self.tested_packages

    def generateDatabase(self, location_number_map={}):
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
            if location_number_map[aim_dir] == 0:
                continue
            cur_full_list = get_list_of_packages(aim_dir)
            selected_lists[aim_dir] = random.choices(cur_full_list, 
                    k=location_number_map[aim_dir])

        return selected_lists

    def get_result_score(self, compare_lists):
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

    def jsopg_test(self, package, vul_type, timeout=120):
        """
        run the test for jsopg
        return: 
            1, success
            2, timeout
            3, other error
        """
        try:
            res = func_timeout(timeout, test_package, 
                    args=(package, vul_type))
        except FunctionTimedOut:
            res = 2
        except Exception as e:
            testing_benchmark_logger.error("error for {} as {}".format(test_package, e))
            res = 3

        return res

    def run_tests(self, package_list, vul_type="os_command"):
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
        testing_tools = ['nodejsscan', 'jsopg', 'jstap']

        for t in testing_tools:
            self.tested_packages[t] = {}

        timeout = 240
        res_list = {}
        success_cnt = {}
        timeout_cnt = {}

        for k in testing_tools:
            res_list[k] = {}
            success_cnt[k] = {}
            timeout_cnt[k] = {}

        for sub_package_list in package_list:
            # init
            for tool in testing_tools:
                res_list[tool][sub_package_list] = {}
                timeout_cnt[tool][sub_package_list] = 0
                success_cnt[tool][sub_package_list] = 0

            for package in package_list[sub_package_list]:
                package_tested = False
                for t in testing_tools:
                    if t in self.tested_packages and \
                        package in self.tested_packages[t] and \
                        vul_type in self.tested_packages[t][package]:
                        if self.tested_packages[t][package][vul_type]:
                            success_cnt[t][sub_package_list] += 1
                        package_tested = True
                    else:
                        self.tested_packages[t][package] = {}
                if package_tested:
                    print("{} tested".format(package))
                    continue

                # jsTap
                jstap_vul_sink_map = {
                        "os_command": ["exec", "execFile", "execSync", "spawn", "spawnSync"],
                        "code_exec": ["exec", "eval", "execFile"],
                        "path_traversal": ["end", "write"]
                        }
                dfg_generator = DFG_generator(package, 
                        sink_funcs=jstap_vul_sink_map[vul_type])
                try:
                    jstap_res = func_timeout(timeout, 
                        dfg_generator.check_all_files)
                except FunctionTimedOut:
                    jstap_res = None

                if jstap_res and sum([len(jstap_res[k]) for k in jstap_res]) != 0:
                    success_cnt['jstap'][sub_package_list] += 1
                    self.tested_packages['jstap'][package][vul_type] = True
                else:
                    self.tested_packages['jstap'][package][vul_type] = False

                # nodejsscan
                jsscan_res = {}
                jsscan_res = njsscan.scan_dirs([package])
                jsscan_cur_res = False

                security_issues= jsscan_res['sec_issues']
                res_list['nodejsscan'][sub_package_list][package] = security_issues
                for key in security_issues:
                    if vul_type == "os_command" and \
                        ("Code Injection" in key or "Command Execution" in key):
                        jsscan_cur_res = True
                        break
                    elif vul_type == "code_exec" and "Command Execution" in key:
                        jsscan_cur_res = True
                        break
                    elif vul_type == "path_traversal" and "Traversal" in key:
                        jsscan_cur_res = True
                        break

                if jsscan_cur_res:
                    success_cnt['nodejsscan'][sub_package_list] += 1
                    self.tested_packages['nodejsscan'][package][vul_type] = True
                else:
                    self.tested_packages['nodejsscan'][package][vul_type] = False

                # jsopg
                jsopg_res = self.jsopg_test(package, vul_type, timeout=timeout)
                if type(jsopg_res) == list and 1 in jsopg_res:
                    res_list['jsopg'][sub_package_list][package] = 1
                    success_cnt['jsopg'][sub_package_list] += 1
                    self.tested_packages['jsopg'][package][vul_type] = True
                elif jsopg_res == 2:
                    timeout_cnt['jsopg'][sub_package_list] += 1
                    res_list['jsopg'][sub_package_list][package] = 2
                elif jsopg_res == 3:
                    res_list['jsopg'][sub_package_list][package] = 3
                else:
                    res_list['jsopg'][sub_package_list][package] = 4
                if vul_type not in self.tested_packages['jsopg'][package]:
                    self.tested_packages['jsopg'][package][vul_type] = False

                with open("tested_packages.json", 'w') as json_file:
                    json.dump(self.tested_packages, json_file)

        return res_list, timeout_cnt, success_cnt

    def get_result_matrix(self, success_cnt, vul_dir):
        """
        input the success cnt and return the res matrix
        """
        res_matrix = {}
        for key in success_cnt:
            res_matrix[key] = {}
            self.all_package_dir_num = self.location_number_map[vul_dir]

            res_matrix[key]['tp'] = success_cnt[key][vul_dir]
            res_matrix[key]['fp'] = success_cnt[key][self.all_package_dir]
            res_matrix[key]['tn'] = self.all_package_dir_num - \
                success_cnt[key][self.all_package_dir]
            res_matrix[key]['fn'] = self.location_number_map[vul_dir] - \
                    success_cnt[key][vul_dir]

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

        return res_matrix

    def main(self):
        for sub_dir in self.location_number_map:
            tmp_map = {}

            cur_list = get_list_of_packages(sub_dir)
            cur_list_len = len(cur_list)

            tmp_map[self.all_package_dir] = min(self.all_package_dir_num, 
                    cur_list_len)
            tmp_map[sub_dir] = min(self.location_number_map[sub_dir], 
                    cur_list_len)

            # rebuild the number of sub dir
            self.location_number_map[sub_dir] = tmp_map[sub_dir]

            testing_database = self.generateDatabase(location_number_map=tmp_map)
            #testing_benchmark_logger.info("Seletected testing dataset: {}".format(
            #    testing_database))

            res_list, timeout_cnt, success_cnt = self.run_tests(testing_database, 
                    vul_type=self.dir_vul_map[sub_dir])
            testing_benchmark_logger.info("Vul Type: {}".format(self.dir_vul_map[sub_dir]))
            testing_benchmark_logger.info("results: {}".format(res_list))
            testing_benchmark_logger.info("timeout: {}".format(timeout_cnt))
            testing_benchmark_logger.info("success_cnt: {}".format(success_cnt))

            res_matrix = self.get_result_matrix(success_cnt, vul_dir=sub_dir)
            for key in res_matrix:
                testing_benchmark_logger.info("{}; {}".format(key, res_matrix[key]))

benchMark = BenchMark()
#benchMark.main()
generated = benchMark.generateDatabase(location_number_map = {"/media/data2/song/npmpackages/": 20})
for package in generated:
    for p in generated[package]:
        print("cp -r {} {};".format(p, "/media/data2/song/random/"))
