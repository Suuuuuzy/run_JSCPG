from src.plugins.handler import Handler
from src.core.utils import NodeHandleResult

class HandleFuncDecl(Handler):
    """
    handle the func decl and ast closure
    """
    def process(self):
        obj_nodes = self.G.get_func_decl_objs_by_ast_node(self.node_id,
                    scope=self.G.find_ancestor_scope())
        if not obj_nodes:
            obj_nodes = [decl_function(self.G, self.node_id)]
        return NodeHandleResult(obj_nodes=obj_nodes)
