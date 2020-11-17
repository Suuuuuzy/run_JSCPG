from .graph import Graph
from .utils import * 
from .helpers import * 
from ..plugins.manager import PluginManager 
from ..plugins.internal.setup_env import setup_opg

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
        internal_plugins = PluginManager(self.graph)
        generate_obj_graph(self.graph, internal_plugins)

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
