from .graph import Graph
from .utils import * 
from .helpers import * 
from .timeout import timeout, TimeoutError
from ..plugins.manager import PluginManager 
from ..plugins.internal.setup_env import setup_opg
from .checker import traceback, vul_checking, traceback_crx, obj_traceback, obj_traceback_crx
from .multi_run_helper import validate_package, get_entrance_files_of_package, validate_chrome_extension
from .logger import loggers
from .options import options
import os
import shutil
import sys
from tqdm import tqdm
from ..plugins.internal.handlers.event_loop import event_loop
import time
from threading import Thread, Event
import threading
from src.core.thread_design import thread_info


class OPGen:
    """
    This is the major class for the whole opgen
    """

    def __init__(self):
        self.graph = Graph()
        self.options = options
        self.graph.package_name = options.input_file
        setup_graph_env(self.graph)

    def get_graph(self):
        """
        get the current graph
        Returns:
            Graph: the current OPG
        """
        return self.graph

    def check_vuls(self, vul_type, G):
        """
        check different type of vulnerabilities
        Args:
            vul_type: the type of vuls
            G: the graph 
        Returns:
            the test result pathes of the module
        """
        vul_pathes = []

        if vul_type == 'os_command' or vul_type == 'path_traversal':
            if options.obj_traceback:
                pathes = obj_traceback(G, vul_type)
                vul_pathes = vul_checking(G, pathes[0], vul_type)
            else:
                pathes = traceback(G, vul_type)
                vul_pathes = vul_checking(G, pathes[0], vul_type)
        # add chrome extension part
        elif vul_type == 'chrome_data_exfiltration' or vul_type == 'chrome_API_execution':
            if options.obj_traceback:
                pathes = obj_traceback_crx(G, vul_type)
                vul_pathes = vul_checking(G, pathes[0], vul_type)
            else:
                pathes = traceback_crx(G, vul_type)
                vul_pathes = vul_checking(G, pathes[0], vul_type)

        return vul_pathes

    def test_file(self, file_path, vul_type='os_command', G=None, timeout_s=None, pq=False):
        """
        test a file as a js script
        Args:
            file_path (str): the path to the file
            vul_type (str) [os_command, prototype_pollution, xss]: the type of vul
            G (Graph): the graph we run top of
        Returns:
            list: the test result pathes of the module
        """
        # TODO: add timeout for testing file
        if G is None:
            G = self.graph
        parse_file(G, file_path)
        if pq:
            G.thread_version = True
        test_res = self._test_graph(G, vul_type=vul_type)
        return test_res

    def test_chrome_extension(self, extension_path, vul_type, G=None,  timeout_s=None, pq=False):
        """
        test a dir of files as an chrome extension
        Args:
            file_path (str): the path to the extension
            vul_type (str) [os_command, prototype_pollution, xss]: the type of vul
            G (Graph): the graph we run top of
        Returns:
            list: the test result pathes of the chrome extension
        """
        # preprocess of the files in chrome extension
        if pq:
            G.thread_version=True
        print('process chrome extension: ', extension_path)
        if not validate_chrome_extension(extension_path):
            print('not valid chrome extension')
            return -1
        if G is None:
            G = self.graph
        test_res = None
        # loggers.crx_logger.info(sty.ef.inverse + sty.fg.li_magenta + 'run extension' + extension_path)
        if timeout_s is not None:
            try:
                with timeout(seconds=timeout_s,
                             error_message="{} timeout after {} seconds". \
                                     format(extension_path, timeout_s)):
                    start_time = time.time()
                    parse_chrome_extension(G, extension_path)
                    test_res = self._test_graph(G, vul_type=vul_type)
                    end_time = time.time()
                    loggers.res_logger.info("{} finish with {} seconds spent####". \
                            format(extension_path, end_time-start_time))
            except TimeoutError as err:
                if self.graph.get_total_num_statements()!=0:
                    covered_stat_rate = 100*len(self.graph.covered_stat) / (self.graph.get_total_num_statements()- self.graph.get_header_num_statements())
                else:
                    covered_stat_rate = 0
                loggers.res_logger.info(str(err) + " with {}% stmt covered####".format(covered_stat_rate))
        else:
            parse_chrome_extension(G, extension_path)
            test_res = self._test_graph(G, vul_type=vul_type)
        # test_res = None
        return test_res


    def _test_graph(self, G: Graph, vul_type='os_command'):
        """
        for a parsed AST graph, generate OPG and test vul
        Args:
            G (Graph): the Graph

            vul_type (str) [os_command, prototype_pollution, xss, ipt]: the type of vul
        Returns:
            list: the test result pathes of the module
        """
        check_res = None
        setup_opg(G)
        G.export_node = True
        internal_plugins = PluginManager(G, init=True)
        entry_id = '0'
        # jianjia: generate branch graph before we fully run
        # (mark on the AST node, each node should search ancestors until branch is found)
        # generate_branch_graph(G, entry_nodeid=entry_id)
        generate_obj_graph(G, internal_plugins, entry_nodeid=entry_id)
        if vul_type is not None:
            check_res = self.check_vuls(vul_type, G)
            # print('check_res debug: ', check_res)
            if len(check_res) != 0:
                self.graph.detection_res[vul_type].add(G.package_name)
        return check_res

    def test_module(self, module_path, vul_type='os_command', G=None, 
            timeout_s=None, pq=False):
        """
        test a file as a module
        Args:
            module_path: the path to the module
            vul_type (str) [os_command, prototype_pollution, xss]: the type of vul
            G (Graph): the graph we run top of
        Returns:
            list: the test result pathes of the module
        """
        print("Testing {} {}".format(vul_type, module_path))
        if module_path is None:
            loggers.error_logger.error("[ERROR] {} not found".format(module_path))
            return []

        if G is None:
            G = self.graph

        test_res = []
        # pretend another file is requiring this module
        js_call_templete = "var main_func=require('{}');".format(module_path)
        if timeout_s is not None:
            try:
                with timeout(seconds=timeout_s, 
                        error_message="{} timeout after {} seconds".\
                                format(module_path, timeout_s)):
                    parse_string(G, js_call_templete)
                    test_res = self._test_graph(G, vul_type=vul_type, pq=pq)
            except TimeoutError as err:
                loggers.res_logger.error(err)
        else:
            parse_string(G, js_call_templete)
            test_res = self._test_graph(G, vul_type=vul_type, pq=pq)

        return test_res

    def test_nodejs_package(self, package_path, vul_type='os_command', G=None, 
            timeout_s=None):
        """
        test a nodejs package
        Args:
            package_path (str): the path to the package
        Returns:
            the result state: 1 for found, 0 for not found, -1 for error
        """
        if not validate_package(package_path):
            return -1
        if G is None:
            G = self.graph

        entrance_files = get_entrance_files_of_package(package_path)

        loggers.detail_logger.info(f"{G.package_name} started")
        for entrance_file in entrance_files:
            G = self.get_new_graph(package_name=package_path)
            test_res = self.test_module(entrance_file, vul_type, G, timeout_s=timeout_s)
            if len(test_res) != 0:
                break
    
    def get_new_graph(self, package_name=None):
        """
        set up a new graph
        """
        self.graph = Graph()
        if not package_name:
            self.graph.package_name = options.input_file
        else:
            self.graph.package_name = package_name
        setup_graph_env(self.graph)
        return self.graph

    def output_args(self):
        loggers.main_logger.info("All args:")
        keys = [i for i in options.instance.__dict__.keys() if i[:1] != '_']
        for key in keys:
            loggers.main_logger.info("{}: {}".format(key, 
                options.instance.__dict__[key]))
    
    def run(self):
        self.output_args()
        if not os.path.exists(options.run_env):
            os.mkdir(options.run_env)

        timeout_s = options.timeout
        if options.install:
            # we have to provide the list if we want to install
            package_list = []
            with open(options.list, 'r') as fp:
                for line in fp.readlines():
                    package_path = line.strip()
                    package_list.append(package_path)
            install_list_of_packages(package_list)

        if options.parallel is not None:
            prepare_split_list()
            num_thread = int(options.parallel)
            tmp_args = sys.argv[:]
            parallel_idx = tmp_args.index("--parallel")
            tmp_args[parallel_idx] = tmp_args[parallel_idx + 1] = ''
            list_idx = tmp_args.index("-l")
            for i in range(num_thread):
                cur_list_path = os.path.join(options.run_env, "tmp_split_list", str(i))
                tmp_args[list_idx + 1] = cur_list_path
                cur_cmd = ' '.join(tmp_args)
                # print(f"screen -S runscreen_{i} -dm {cur_cmd}")
                os.system(f"screen -S runscreen_{i} -dm {cur_cmd}")
            return 

        if options.babel:
            babel_convert()
        if options.list is not None:
            package_list = []
            with open(options.list, 'r') as fp:
                for line in fp.readlines():
                    package_path = line.strip()
                    package_list.append(package_path)

            for package_path in package_list:
                # init a new graph
                self.get_new_graph(package_name=package_path)
                if options.chrome_extension:
                    self.test_chrome_extension(package_path, options.vul_type, self.graph, timeout_s=timeout_s,
                        pq=options.run_with_pq)
                else:
                    self.test_nodejs_package(package_path,
                        options.vul_type, self.graph, timeout_s=timeout_s)
                if len(self.graph.detection_res[options.vul_type]) != 0:
                    loggers.res_logger.info("{} is detected in {}".format(
                        options.vul_type,
                        package_path))
                else:
                    loggers.res_logger.info("No vuls found in {}".format(
                        package_path))

        else:
            if options.module:
                self.test_module(options.input_file, options.vul_type, self.graph, timeout_s=timeout_s, pq=options.run_with_pq)
            elif options.nodejs:
                self.test_nodejs_package(options.input_file, 
                        options.vul_type, G=self.graph, timeout_s=timeout_s)
            elif options.chrome_extension:
                self.test_chrome_extension(options.input_file, options.vul_type, self.graph, timeout_s=timeout_s, pq=options.run_with_pq)
            else:
                # analyze from JS source code files
                self.test_file(options.input_file, options.vul_type, self.graph, timeout_s=timeout_s, pq=options.run_with_pq)

            if len(self.graph.detection_res[options.vul_type]) != 0:
                print(sty.fg.li_green + sty.ef.inverse +
                    f'{options.vul_type} detected at {options.input_file}'
                    + sty.rs.all)
                loggers.res_logger.info("{} is detected in {}".format(
                    options.vul_type,
                    options.input_file))

        print("Graph size: {}, GC removed {} nodes".format(self.graph.get_graph_size(), self.graph.num_removed))
        print("Cleaning up tmp dirs")
        #shutil.rmtree(options.run_env)
        #export to csv
        if options.export is not None:
            if options.export == 'light':
                self.graph.export_to_CSV("./exports/nodes.csv", "./exports/rels.csv", light=True)
            else:
                self.graph.export_to_CSV("./exports/nodes.csv", "./exports/rels.csv", light=False)


def generate_obj_graph(G, internal_plugins, entry_nodeid='0'):
    """
    generate the object graph of a program
    Args:
        G (Graph): the graph to generate
        internal_plugins（PluginManager): the plugin obj
        entry_nodeid (str) 0: the entry node id,
            by default 0
    """
    NodeHandleResult.print_callback = print_handle_result

    entry_nodeid = str(entry_nodeid)
    loggers.main_logger.info(sty.fg.green + "GENERATE OBJECT GRAPH" + sty.rs.all + ": " + entry_nodeid)
    obj_nodes = G.get_nodes_by_type("AST_FUNC_DECL")
    # for node in obj_nodes:
    #     register_func(G, node[0])
    if G.thread_version:
        # print('jianjia pq')
        admin_threads(G, internal_plugins.dispatch_node, (entry_nodeid))
    else:
        internal_plugins.dispatch_node(entry_nodeid)
    #add_edges_between_funcs(G)

def fetch_new_thread(G):
    with G.pq_lock:
        result = G.pq[0]
        del G.pq[0]
        while result in G.work_queue and len(G.pq)>0:
            result = G.pq[0]
            del G.pq[0]
    if result not in G.work_queue:
        print('fetch new thread: ', result.thread_self.name)
        result.last_start_time = time.time_ns()
        with G.work_queue_lock:
            G.work_queue.add(result)
        result.resume()

# the function to admin the threads, to use this, you have to pass G and the initial running thread
def admin_threads(G, function, args):
    print('admin threads')
    t = Thread(target=function, args=args)
    info = thread_info(thread=t, last_start_time=time.time_ns(), thread_age=1)
    with G.thread_info_lock:
        G.thread_infos[t.name] = info
    t.start()
    with G.work_queue_lock:
        G.work_queue.add(info)
    old_queue = []
    old_len = 0
    while True:
        with G.work_queue_lock:
            for t in G.work_queue:
                if not t.thread_self.is_alive():
                    t.handled = True
            dead = [i for i in G.work_queue if i.handled]
            G.work_queue = set([i for i in G.work_queue if not i.handled])
            tmp = [i.thread_self for i in G.work_queue]
            # print('%%%%%%%%%work in admin: ', tmp)
        for t in dead:
            # if this thread is dead
            print(t.thread_self.name + ' is dead')
            print('%%%%%%%%%all: ', threading.enumerate())
            tmp = [i.thread_self for i in G.wait_queue]
            print('%%%%%%%%%wait: ', tmp)
            tmp = [i.thread_self for i in G.work_queue]
            print('%%%%%%%%%work: ', tmp)
            tmp = [i.thread_self for i in G.pq]
            print('%%%%%%%%%pq: ', tmp)

            # if this thread has a father thread
            if t.thread_self.name in G.branch_son_dad:
                with G.branch_son_dad_lock:
                    dad_thread = G.branch_son_dad[t.thread_self.name][0]
                    sons = []
                    for son in G.branch_son_dad:
                        if G.branch_son_dad[son][0]==dad_thread:
                            sons.append(son)
                    cv = G.branch_son_dad[sons[0]][1]
                    for son in sons:
                        del G.branch_son_dad[son]
                    with cv:
                        # print('notify father ' + dad_thread.name)
                        cv.notify()
        # with G.wait_queue_lock:
        #     for t in G.wait_queue:
        #         if not t.thread_self.is_alive():
        #             t.handled = True
        #     G.wait_queue = set([i for i in G.wait_queue if not i.handled])
        # with G.pq_lock:
        #     for t in G.pq:
        #         if not t.thread_self.is_alive():
        #             t.handled = True
        #     G.pq = [i for i in G.pq if not i.handled]
        #     G.pq.sort(key=lambda x: x.thread_age, reverse=False)
        while len(G.work_queue)<1 and len(G.pq)>0:
            fetch_new_thread(G)
            # tmp = [i.thread_self for i in G.work_queue]
            # print('%%%%%%%%%work in admin: ', tmp)
        # if len(threading.enumerate()) != len(G.wait_queue) + len(G.work_queue) + len(G.pq) + 1:
        #     print('%%%%%%%%%all: ', threading.enumerate())
        #     tmp = [i.thread_self for i in G.wait_queue]
        #     print('%%%%%%%%%wait: ', tmp)
        #     tmp = [i.thread_self for i in G.work_queue]
        #     print('%%%%%%%%%work: ', tmp)
        #     tmp = [i.thread_self for i in G.pq]
        #     print('%%%%%%%%%pq: ', tmp)
        if len(threading.enumerate())==1 and len(G.work_queue)==0 and len(G.pq)==0 and len(G.wait_queue)==0:
            print('finish')
            return 1





def install_list_of_packages(package_list):
    """
    install a list of packages into environment/packages/
    """
    from tools.package_downloader import download_package
    package_root_path = os.path.join(options.run_env, "packages")
    package_root_path = os.path.abspath(package_root_path)
    if not os.path.exists(package_root_path):
        os.mkdir(package_root_path)
    print("Installing packages")
    version_number = None
    for package in tqdm(package_list):
        if '@' in package and package[0] != '@':
            version_number = package.split('@')[1]
            package = package.split('@')[0]

        download_package(package, version_number, target_path=package_root_path)


def setup_graph_env(G: Graph):
    """
    setup the graph environment based on the user input

    Args:
        G (Graph): the Graph to setup
        options (options): the user input options
    """
    if options.print:
        G.print = True
    G.run_all = options.run_all or options.list 
    if G.run_all is None:
        G.run_all = False
    #options.module or options.nodejs or options.list
    G.function_time_limit = options.function_timeout
    G.exit_when_found = options.exit
    G.single_branch = options.single_branch
    G.vul_type = options.vul_type
    G.func_entry_point = options.entry_func
    G.no_file_based = options.no_file_based
    G.check_proto_pollution = (options.prototype_pollution or 
                               options.vul_type == 'proto_pollution')
    G.check_ipt = (options.vul_type == 'ipt')
    G.call_limit = options.call_limit
    G.detection_res[options.vul_type] = set()

def babel_convert():
    """
    use babel to convert the input files to ES5
    for now, we use system commands
    """
    try:
        shutil.rmtree(options.run_env)
    except:
        # sames the run_env does not exsit
        pass
    babel_location = "./node_modules/@babel/cli/bin/babel.js" 
    babel_cp_dir = os.path.join(options.run_env, 'babel_cp')
    babel_env_dir = os.path.join(options.run_env, 'babel_env')

    relative_path = os.path.relpath(options.input_file, options.babel)
    options.input_file = os.path.join(babel_env_dir, relative_path)
    os.system(f"mkdir {options.run_env} {babel_cp_dir} {babel_env_dir}")
    os.system(f"cp -rf {options.babel}/* ./{babel_cp_dir}/")
    os.system("{} {} --out-dir {}".format(babel_location, babel_cp_dir, babel_env_dir))
    print("New entray point {}".format(options.input_file))

def prepare_split_list():
    """
    split the list into multiple sub lists
    """
    # if the parallel is true, we will start a list of screens
    # each of the screen will include another run
    num_thread = int(options.parallel)
    # make a tmp dir to store the 
    tmp_list_dir = "tmp_split_list"
    os.system("mkdir {}".format(os.path.join(options.run_env, tmp_list_dir)))
    package_list = None
    with open(options.list, 'r') as fp:
        package_list = fp.readlines()

    num_packages = len(package_list) 
    chunk_size = math.floor(num_packages / num_thread)
    sub_package_lists = [[] for i in range(num_thread)]
    file_pointer = 0
    for package in package_list:
        sub_package_lists[file_pointer % num_thread].append(package)
        file_pointer += 1

    cnt = 0
    for sub_packages in sub_package_lists:
        with open(os.path.join(options.run_env, tmp_list_dir, str(cnt)), 'w') as fp:
            fp.writelines(sub_packages)
        cnt += 1



def generate_branch_graph(G, entry_nodeid='0'):
    """
    generate the object graph of a program
    Args:
        G (Graph): the graph to generate
        internal_plugins（PluginManager): the plugin obj
        entry_nodeid (str) 0: the entry node id,
            by default 0
    """
    entry_nodeid = str(entry_nodeid)
    loggers.main_logger.info(sty.fg.green + "GENERATE BRANCH GRAPH" + sty.rs.all + ": " + entry_nodeid)
    # start from node 0, go!
    visited = set()
    depth = 0
    DFS(G, entry_nodeid, visited, depth)
    print('jianjia see branch graph')
    for node in G.graph.nodes:
        if 'branch' in G.get_node_attr(node):
            print(node, G.get_node_attr(node)['branch'])


def DFS(G, nodeid, visited, depth):
    visited.add(nodeid)
    if 'type' in G.get_node_attr(nodeid):
        node_type = G.get_node_attr(nodeid)['type']
    else:
        loggers.res_logger.info("type error")
        # loggers.res_logger.info(str(G.get_node_attr(nodeid)))
        return 1
    if node_type in ['AST_IF_ELEM', 'AST_SWITCH_CASE']:
        G.set_node_attr(nodeid, ('branch', depth))
    for child in G.get_child_nodes(nodeid):
        if child not in visited:
            DFS(G, child, visited, depth+1)

