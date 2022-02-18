from src.core.graph import Graph
from src.plugins.handler import Handler
from src.plugins.internal.utils import emit_thread
from src.core.utils import NodeHandleResult

class HandleExprList(Handler):
    """
    handle the expr list ast
    """
    def process(self):
        result = NodeHandleResult()
        # jianjia add thread_stmt here
        if self.G.thread_stmt:
            for child in self.G.get_ordered_ast_child_nodes(self.node_id):
                print(child)
                emit_thread(self.G, self.internal_manager.dispatch_node, (child, self.extra, self.G.mydata.pickle_up()))
        else:
            for child in self.G.get_ordered_ast_child_nodes(self.node_id):
                result = self.internal_manager.dispatch_node(child, self.extra)
        return result

