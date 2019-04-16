from graph import Graph
class ScopeController:
    """
    the class used for control the name scope of the program
    This class should only have one instance
    """

    def __init__(self, Graph):
        """
        build the object tree based on the funcid
        """
        root_id = '0'
        func_decl_list = Graph.get_nodes_by_type("AST_FUNC_DECL")
        scopeEdges = []
        for func in func_decl_list:
            scopeEdges.append((func[1]['funcid:int'], func[0], {'type:TYPE': 'DEFINES'}))
        Graph.add_edges_from_list(scopeEdges)

