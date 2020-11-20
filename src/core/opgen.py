from .graph import Graph
from .utils import * 
from .helpers import * 
from ..plugins.manager import PluginManager 
from ..plugins.internal.setup_env import setup_opg
from .checker import traceback, vul_checking

class OPGen:
    """
    This is the major class for the whole opgen
    """

    def __init__(self):
        self.graph = Graph()

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
        """
        if vul_type == 'os_command':
            pathes = traceback(G, vul_type)
            vul_pathes = vul_checking(G, pathes[0], vul_type)

    def run(self, args):
        print(args)
        if args.module:
            # pretend another file is requiring this module
            script = "var main_func=require('{}');".format(args.input_file)
            parse_string(self.graph, script)
        else:
            # analyze from JS source code files
            parse_file(self.graph, args.input_file)

        setup_opg(self.graph)
        self.graph.export_node = True 
        internal_plugins = PluginManager(self.graph)
        entry_id = '0'

        # TODO: add entry func to entry id
        if args.entry_func is not None:
            entry_id = args.entry_func
        generate_obj_graph(self.graph, internal_plugins, entry_nodeid=entry_id)

        #export to csv
        if args.export is not None:
            if args.export == 'light':
                self.graph.export_to_CSV("./exports/nodes.csv", "./exports/rels.csv", light=True)
            else:
                self.graph.export_to_CSV("./exports/nodes.csv", "./exports/rels.csv", light=False)

        if args.vul_type is not None:
            self.check_vuls(args.vul_type, self.graph)

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
    obj_nodes = G.get_nodes_by_type("AST_FUNC_DECL")
    for node in obj_nodes:
        register_func(G, node[0])
    internal_plugins.dispatch_node(entry_nodeid)
    add_edges_between_funcs(G)
