from .handlers.file import HandleFile,HandleToplevel 
from .handlers.operators import HandleAssign
from ..manager import PluginManager

class InternalPlugins(PluginManager):
    """
    this is parent the class for all the internal plugins
    """

    def __init__(self, G):
        self.G = G
        self.handler_map = {
                'File': HandleFile,
                'Directory': HandleFile,
                'AST_TOPLEVEL': HandleToplevel,
                'AST_ASSIGN': HandleAssign
                }

