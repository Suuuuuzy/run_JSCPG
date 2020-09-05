from .graph import Graph
from .utils import * 
from .helpers import *
from ..plugins.internal.internal import Internal_plugins
from ..plugins.internal.helpers import *

class OPGen:
    """
    This is the major class for the whole opgen
    """

    def __init__(self):
        self.graph = Graph()

    def run(self):
        setup_opg(self.graph)
