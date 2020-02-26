import random
from func_timeout import func_timeout, FunctionTimedOut
import os
from tqdm import tqdm
import sys
import sklearn.metrics as SM
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
        self.code_exec_dir = "/media/data2/song/vulPackages/code_exec/"
        self.path_traversal_dir = "/media/data2/song/vulPackages/updated_databases/path_traversal/"
        #self.prototype_pollution_dir = "/media/data2/song/vulPackages/prototype_pollution/"
        self.all_package_dir = "/media/data2/song/npmpackages/"

        self.all_package_dir_num = 70
        self.location_number_map = {
                self.command_injection_dir: 30,
                self.code_exec_dir: 30,
                self.path_traversal_dir: 30
                }
        self.dir_vul_map = {
                self.command_injection_dir: "os_command",
                self.code_exec_dir: "code_exec",
                self.path_traversal_dir: "path_traversal"
                }

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
        timeout = 120
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

                # jsTap
                jstap_vul_sink_map = {
                        "os_command": ["exec", "execFile"],
                        "code_exec": ["exec", "eval", "execFile"],
                        "path_traversal": ["end", "write"]
                        }
                dfg_generator = DFG_generator(package, 
                        sink_funcs=jstap_vul_sink_map[vul_type])
                try:
                    jstap_res = dfg_generator.check_all_files()
                except FunctionTimedOut:
                    jstap_res = None

                if jstap_res and sum([len(jstap_res[k]) for k in jstap_res]) != 0:
                    success_cnt['jstap'][sub_package_list] += 1

                # nodejsscan
                jsscan_res = {}
                jsscan_res = njsscan.scan_dirs([package])

                security_issues= jsscan_res['sec_issues']
                res_list['nodejsscan'][sub_package_list][package] = security_issues
                for key in security_issues:
                    if vul_type == "os_command" and \
                        ("Code Injection" in key or "Command Execution" in key):
                        success_cnt['nodejsscan'][sub_package_list] += 1
                        break
                    elif vul_type == "code_exec" and "Command Execution" in key:
                        success_cnt['nodejsscan'][sub_package_list] += 1
                        break
                    elif vul_type == "path_traversal" and "Traversal" in key:
                        success_cnt['nodejsscan'][sub_package_list] += 1
                        break

                # jsopg
                jsopg_res = self.jsopg_test(package, vul_type, timeout=timeout)
                if type(jsopg_res) == list and 1 in jsopg_res:
                    res_list['jsopg'][sub_package_list][package] = 1
                    success_cnt['jsopg'][sub_package_list] += 1
                elif jsopg_res == 2:
                    timeout_cnt['jsopg'][sub_package_list] += 1
                    res_list['jsopg'][sub_package_list][package] = 2
                elif jsopg_res == 3:
                    res_list['jsopg'][sub_package_list][package] = 3
                else:
                    res_list['jsopg'][sub_package_list][package] = 4

        return res_list, timeout_cnt, success_cnt

    def get_result_matrix(self, success_cnt, vul_dir):
        """
        input the success cnt and return the res matrix
        """
        res_matrix = {}
        for key in success_cnt:
            res_matrix[key] = {}

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
            tmp_map[self.all_package_dir] = self.all_package_dir_num
            tmp_map[sub_dir] = self.location_number_map[sub_dir]

            testing_database = self.generateDatabase(location_number_map=tmp_map)

            testing_benchmark_logger.info("Seletected testing dataset: {}".format(
                testing_database))

            res_list, timeout_cnt, success_cnt = self.run_tests(testing_database, 
                    vul_type=self.dir_vul_map[sub_dir])
            testing_benchmark_logger.info("results: {}".format(res_list))
            testing_benchmark_logger.info("timeout: {}".format(timeout_cnt))
            testing_benchmark_logger.info("success_cnt: {}".format(success_cnt))

            res_matrix = self.get_result_matrix(success_cnt, vul_dir=sub_dir)
            for key in res_matrix:
                testing_benchmark_logger.info("{}; {}".format(key, res_matrix[key]))

benchMark = BenchMark()
benchMark.main()
