import json

from .graph import Graph
from .utils import * 
from .helpers import *
from ..plugins.internal.handlers.event_loop import event_loop
from .timeout import timeout, TimeoutError
from ..plugins.manager import PluginManager 
from ..plugins.internal.setup_env import setup_opg
from .checker import traceback, traceback_crx, vul_checking
from .multi_run_helper import validate_package, get_entrance_files_of_package, validate_chrome_extension
from .logger import loggers
from .options import setup_graph_env

class OPGen:
    """
    This is the major class for the whole opgen
    """

    def __init__(self, args=None):
        self.graph = Graph()
        self.args = args
        setup_graph_env(self.graph, args)

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
        vul_pathes = None

        if vul_type == 'os_command' or vul_type == 'path_traversal':
            pathes = traceback(G, vul_type)
            vul_pathes = vul_checking(G, pathes[0], vul_type)
        # add chrome extension part
        elif vul_type == 'chrome_data_exfiltration' or vul_type == 'chrome_API_execution':
            # print('G.sensitiveSource', G.sensitiveSource)
            pathes = traceback_crx(G, vul_type)
            vul_pathes = vul_checking(G, pathes[0], vul_type)

        return vul_pathes

    def test_file(self, file_path, vul_type='os_command', G=None, timeout_s=None):
        """
        test a file as a js script
        Args:
            file_path (str): the path to the file
            vul_type (str) [os_command, prototype_pollution, xss]: the type of vul
            G (Graph): the graph we run top of
        Returns:
            list: the test result pathes of the module
        """
        if G is None:
            G = self.graph
        parse_file(G, file_path)
        test_res = self._test_graph(G, vul_type=vul_type)
        return test_res

    def test_chrome_extension(self, extension_path, vul_type, G=None,  timeout_s=None):
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
        print('process chrome extension')
        if not validate_chrome_extension(extension_path):
            print('not valid chrome extension')
            return -1
        if G is None:
            G = self.graph
        parse_chrome_extension(G, extension_path)
        # for entrance_file in entrance_files:
        #     if 'content' in entrance_file:
        #         parse_file(G, entrance_file)
        #         print('entrance_file', entrance_file)
        #         print(G.graph.number_of_nodes())
            # parse_file(G, entrance_file)
        test_res = self._test_graph(G, vul_type=vul_type)
        # test_res = None
        return test_res


    def _test_graph(self, G: Graph, vul_type='os_command'):
        """
        for a parsed AST graph, generate OPG and test vul
        Args:
            G (Graph): the Graph
            vul_type (str) [os_command, prototype_pollution, xss]: the type of vul
        Returns:
            list: the test result pathes of the module
        """
        # setup some reserved words
        setup_opg(G, vul_type)
        G.export_node = True 
        internal_plugins = PluginManager(G, init=True)
        entry_id = '0'

        generate_obj_graph(G, internal_plugins, entry_nodeid=entry_id)
        if vul_type in ['chrome_API_execution', 'chrome_data_exfiltration']:
            event_loop(G)

        if vul_type is not None:
            check_res = self.check_vuls(vul_type, G)

        return check_res

    def test_module(self, module_path, vul_type='os_command', G=None, 
            timeout_s=None):
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
            return -1

        if G is None:
            G = self.graph

        test_res = None
        # pretend another file is requiring this module
        js_call_templete = "var main_func=require('{}');".format(module_path)
        if timeout_s is not None:
            try:
                with timeout(seconds=timeout_s, 
                        error_message="{} timeout after {} seconds".\
                                format(module_path, timeout_s)):
                    parse_string(G, js_call_templete)
                    test_res = self._test_graph(G, vul_type=vul_type)
            except TimeoutError as err:
                loggers.error_logger.error(err)
                loggers.res_logger.error(err)
        else:
            parse_string(G, js_call_templete)
            test_res = self._test_graph(G, vul_type=vul_type)

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

        for entrance_file in entrance_files:
            self.test_module(entrance_file, vul_type, G, timeout_s=timeout_s)

    def run(self, args):
        timeout_s = args.timeout
        if args.list is not None:
            package_list = []
            with open(args.list, 'r') as fp:
                for line in fp.readlines():
                    package_path = line.strip()
                    package_list.append(package_path)

            for package_path in package_list:
                # init a new graph
                self.graph = Graph()
                setup_graph_env(self.graph, args)
                self.test_nodejs_package(package_path, args.vul_type, self.graph, timeout_s=timeout_s)

                if len(self.graph.detection_res[args.vul_type]) != 0:
                    loggers.res_logger.info("{} is detected in {}".format(
                        args.vul_type,
                        package_path))
        else:
            if args.module:
                self.test_module(args.input_file, args.vul_type, self.graph, timeout_s=timeout_s)
            elif args.nodejs:
                self.test_nodejs_package(args.input_file, 
                        args.vul_type, self.graph, timeout_s=timeout_s)
            elif args.chrome_extension:
                self.test_chrome_extension(args.input_file, args.vul_type, self.graph, timeout_s=timeout_s)
            else:
                # analyze from JS source code files
                self.test_file(args.input_file, args.vul_type, self.graph, timeout_s=timeout_s)

            if len(self.graph.detection_res[args.vul_type]) != 0:
                loggers.res_logger.info("{} is detected in {}".format(
                    args.vul_type,
                    args.input_file))


        #export to csv
        if args.export is not None:
            if args.export == 'light':
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
    if G.print:
        NodeHandleResult.print_callback = lambda x: print_handle_result_tainted(G, x)
    else:
        NodeHandleResult.print_callback = print_handle_result
    entry_nodeid = str(entry_nodeid)
    loggers.main_logger.info(sty.fg.green + "GENERATE OBJECT GRAPH" + sty.rs.all + ": " + entry_nodeid)
    # register every function declaration
    # DEPRECATED
    obj_nodes = G.get_nodes_by_type("AST_FUNC_DECL")
    for node in obj_nodes:
        register_func(G, node[0])
    internal_plugins.dispatch_node(entry_nodeid)
    #add_edges_between_funcs(G)
