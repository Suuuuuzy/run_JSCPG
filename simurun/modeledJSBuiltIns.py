from graph import Graph
from utilities import NodeHandleResult


def setup_js_builtins(G: Graph):
    setup_string(G)
    setup_number(G)
    setup_array(G)
    setup_function(G)
    setup_object(G)


def setup_string(G: Graph):
    string_cons = G.add_blank_func_to_scope('String', scope=G.BASE_SCOPE)
    string_prototype = G.get_prop_obj_nodes(prop_name='prototype', parent_obj=string_cons)[0]


def setup_number(G: Graph):
    number_cons = G.add_blank_func_to_scope('Number', scope=G.BASE_SCOPE)
    number_prototype = G.get_prop_obj_nodes(prop_name='prototype', parent_obj=number_cons)[0]
    parse_int = G.add_blank_func_to_scope('parseInt', scope=G.BASE_SCOPE)
    parse_float = G.add_blank_func_to_scope('parseFloat', scope=G.BASE_SCOPE)


def setup_array(G: Graph):
    array_cons = G.add_blank_func_to_scope('Array', scope=G.BASE_SCOPE)
    array_prototype = G.get_prop_obj_nodes(prop_name='prototype', parent_obj=array_cons)[0]
    G.add_blank_func_as_prop('push', array_prototype, array_push)
    G.add_blank_func_as_prop('join', array_prototype, array_join)
    G.add_blank_func_as_prop('forEach', array_prototype, array_for_each)



def setup_function(G: Graph):
    function_cons = G.add_blank_func_to_scope('Function', scope=G.BASE_SCOPE)
    function_prototype = G.get_prop_obj_nodes(prop_name='prototype', parent_obj=function_cons)[0]


def setup_object(G: Graph):
    object_cons = G.add_blank_func_to_scope('Object', scope=G.BASE_SCOPE)
    object_prototype =  G.get_prop_obj_nodes(prop_name='prototype', parent_obj=object_cons)[0]


def array_for_each(G: Graph, caller_ast, array_obj_node: NodeHandleResult, func_obj_node: NodeHandleResult):
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


def array_push(G: Graph, caller_ast, array: NodeHandleResult, added_obj: NodeHandleResult):
    for arr in array.obj_nodes:
        for obj in added_obj.obj_nodes:
            G.add_obj_as_prop(None, None, var_name='*', parent_obj=arr, tobe_added_obj=obj)
    return NodeHandleResult(used_objs=added_obj.obj_nodes)


def array_join(G: Graph, caller_ast, array: NodeHandleResult, sep: NodeHandleResult):
    obj_nodes = []
    for arr in array.obj_nodes:
        new_literal = G.add_literal_obj(caller_ast)
        # we create CONTRIBUTES_TO edges in call_function
        obj_nodes.append(new_literal)
    return NodeHandleResult(obj_nodes=obj_nodes,
        used_objs=G.get_prop_obj_nodes(parent_obj=arr))