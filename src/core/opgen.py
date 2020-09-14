from .graph import Graph
from .utils import * 
from .helpers import * 
from ..plugins.internal.internal import InternalPlugins 
from ..plugins.internal.helpers import setup_opg

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
        internal_plugins = InternalPlugins(self.graph)
        generate_obj_graph(self.graph, internal_plugins)
