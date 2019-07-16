from graph import Graph
from utilities import NodeHandleResult


def setup_js_builtins(G: Graph):
    setup_string(G)
    setup_number(G)
    setup_array(G)
    setup_function(G)
    setup_object(G)


def setup_string(G: Graph):
    string_cons = G.add_blank_func_with_og_nodes('String', scope=G.BASE_SCOPE)
    string_prototype = G.add_obj_as_prop(ast_node=None, var_type='BUILT-IN', var_name='prototype', parent_obj=string_cons)


def setup_number(G: Graph):
    number_cons = G.add_blank_func_with_og_nodes('Number', scope=G.BASE_SCOPE)
    number_prototype = G.add_obj_as_prop(ast_node=None, var_type='BUILT-IN', var_name='prototype', parent_obj=number_cons)
    parse_int = G.add_blank_func_with_og_nodes('parseInt', scope=G.BASE_SCOPE)
    parse_float = G.add_blank_func_with_og_nodes('parseFloat', scope=G.BASE_SCOPE)


def setup_array(G: Graph):
    array_cons = G.add_blank_func_with_og_nodes('Array', scope=G.BASE_SCOPE)
    array_prototype = G.add_obj_as_prop(ast_node=None, var_type='BUILT-IN', var_name='prototype', parent_obj=array_cons)
    array_for_each_obj = G.add_obj_as_prop(ast_node=None, var_type='FUNC_DECL', var_name='forEach', parent_obj=array_prototype)
    G.set_node_attr(array_for_each_obj, ('pythonfunc', array_for_each))
    array_push_obj = G.add_obj_as_prop(ast_node=None, var_type='FUNC_DECL', var_name='push', parent_obj=array_prototype)
    G.set_node_attr(array_push_obj, ('pythonfunc', array_for_each))
    array_join_obj = G.add_obj_as_prop(ast_node=None, var_type='FUNC_DECL', var_name='push', parent_obj=array_prototype)
    G.set_node_attr(array_join_obj, ('pythonfunc', array_join))



def setup_function(G: Graph):
    function_cons = G.add_blank_func_with_og_nodes('Function', scope=G.BASE_SCOPE)
    function_prototype = G.add_obj_as_prop(ast_node=None, var_type='BUILT-IN', var_name='prototype', parent_obj=function_cons)


def setup_object(G: Graph):
    object_cons = G.add_blank_func_with_og_nodes('Object', scope=G.BASE_SCOPE)
    object_prototype = G.add_obj_as_prop(ast_node=None, var_type='BUILT-IN', var_name='prototype', parent_obj=object_cons)


def array_for_each(G: Graph, array_obj_node, func_obj_node):
    pass
#     # TODO: need to call the callback function
#     obj_nodes = []
#     edges1 = G.get_out_edges(array_obj_node, edge_type='OBJ_TO_PROP')
#     for edge in edges1:
#         name_node = edge[1]
#         if G.get_node_attr(name_node).get('name') in ['prototype', '__proto__']:
#             continue
#         edges2 = G.get_out_edges(name_node, edge_type='NAME_TO_OBJ')
#         for e in edges2:
#             obj_nodes.append(e[1])
#     return NodeHandleResult(obj_nodes=obj_nodes)


def array_push(G: Graph, array: NodeHandleResult, added_obj: NodeHandleResult):
    for arr in array.obj_nodes:
        for obj in added_obj.obj_nodes:
            G.add_obj_as_prop(None, None, var_name='*', parent_obj=arr, tobe_added_obj=obj)
    return NodeHandleResult(used_objs=added_obj.obj_nodes)


def array_join(G: Graph, array: NodeHandleResult):
    obj_nodes = []
    for arr in array.obj_nodes:
        new_literal = G.add_literal_obj()
        for obj in G.get_prop_name_nodes(parent_obj=arr):
            G.add_edge(obj, new_literal, {'type:TYPE': 'CONTRIBUTES_TO'})
    return NodeHandleResult(obj_nodes=obj_nodes)