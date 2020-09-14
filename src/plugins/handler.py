from src.core.graph import Graph
from src.core.utils import *

class Handler(object):
    """
    this is the parent class for all the handlers, including a 
    pre_successors method, a post_successors method.
    """

    def __init__(self, G: Graph, node_id: str, extra=None):
        self.G = G
        self.node_id = node_id
        self.extra = extra
        self.pipeline = []

    def pre_processing(self):
        """
        for each handler, we should have a pre processing 
        method, which will actually run the node handle process.
        If the handling process can be finished in one function,
        we do not need further functions
        """
        pass

