from graph import Graph
from utilities import NodeHandleResult
import objectGraphGenerator


def setup_js_builtins(G: Graph):
    setup_object_and_function(G)
    setup_string(G)
    setup_number(G)
    setup_array(G)
    setup_global_functions(G)


def setup_string(G: Graph):
    string_cons = G.add_blank_func_to_scope('String', scope=G.BASE_SCOPE)
    string_prototype = G.get_prop_obj_nodes(prop_name='prototype', parent_obj=string_cons)[0]


def setup_number(G: Graph):
    number_cons = G.add_blank_func_to_scope('Number', scope=G.BASE_SCOPE)
    number_prototype = G.get_prop_obj_nodes(prop_name='prototype', parent_obj=number_cons)[0]


def setup_array(G: Graph):
    array_cons = G.add_blank_func_to_scope('Array', scope=G.BASE_SCOPE)
    array_prototype = G.get_prop_obj_nodes(prop_name='prototype', parent_obj=array_cons)[0]
    G.add_blank_func_as_prop('push', array_prototype, array_push)
    G.add_blank_func_as_prop('join', array_prototype, array_join)
    G.add_blank_func_as_prop('forEach', array_prototype, array_for_each)


def setup_object_and_function(G: Graph):
    # add Object (function)
    object_cons = G.add_blank_func_to_scope('Object', scope=G.BASE_SCOPE)
    # get Object.prototype
    object_prototype =  G.get_prop_obj_nodes(prop_name='prototype', parent_obj=object_cons)[0]
    G.set_node_attr(object_prototype, ('code', 'Object.prototype'))
    # add Object.prototype.__proto__
    G.add_obj_as_prop(None, None, '__proto__', parent_obj=object_prototype, tobe_added_obj=G.null_obj)
    # add Function (function)
    function_cons = G.add_blank_func_to_scope('Function', scope=G.BASE_SCOPE)
    # get Function.prototype
    function_prototype = G.get_prop_obj_nodes(prop_name='prototype', parent_obj=function_cons)[0]
    G.set_node_attr(function_prototype, ('code', 'Function.prototype'))
    # Function.__proto__ = Function.prototype (beacuse Function is a function)
    function__proto__ = G.add_obj_as_prop(None, None, '__proto__', parent_obj=function_cons, tobe_added_obj=function_prototype)
    # Function.__proto__.__proto__ = Object.prototype (because Function.prototype is an object)
    function__proto____proto__ = G.add_obj_as_prop(None, None, '__proto__', parent_obj=function__proto__, tobe_added_obj=object_prototype)
    # Object.__proto__ = Function.prototype (beacuse Object is a function)
    G.add_obj_as_prop(None, None, '__proto__', parent_obj=object_cons, tobe_added_obj=function_prototype)
    # set reserved values
    G.function_prototype = function_prototype
    G.object_prototype = object_prototype


def setup_global_functions(G: Graph):
    parse_int = G.add_blank_func_to_scope('parseInt', G.BASE_SCOPE, parse_number)
    parse_float = G.add_blank_func_to_scope('parseFloat', G.BASE_SCOPE, parse_number)
    decode_uri = G.add_blank_func_to_scope('decodeURI', G.BASE_SCOPE, string_returning_func)
    decode_uri_component = G.add_blank_func_to_scope('decodeURIComponent', G.BASE_SCOPE, string_returning_func)
    encode_uri = G.add_blank_func_to_scope('encodeURI', G.BASE_SCOPE, string_returning_func)
    encode_uri_component = G.add_blank_func_to_scope('encodeURIComponent', G.BASE_SCOPE, string_returning_func)
    escape = G.add_blank_func_to_scope('escape', G.BASE_SCOPE, string_returning_func)
    unescape = G.add_blank_func_to_scope('unescape', G.BASE_SCOPE, string_returning_func)


def array_for_each(G: Graph, caller_ast, array: NodeHandleResult, callback: NodeHandleResult):
    # TODO: add multiple possibilities
    for arr in array.obj_nodes:
        elements = G.get_prop_obj_nodes(arr)
        for elem in elements:
            for func in callback.obj_nodes:
                func_decl = G.get_obj_def_ast_node(func)
                func_scope = G.get_func_scope_by_obj_node(func)
                objectGraphGenerator.call_callback_function(G, caller_ast,
                    func_decl, func_scope, NodeHandleResult(obj_nodes=[elem]))

def array_push(G: Graph, caller_ast, array: NodeHandleResult, added_obj: NodeHandleResult):
    for arr in array.obj_nodes:
        for obj in added_obj.obj_nodes:
            G.add_obj_as_prop(None, None, var_name='*', parent_obj=arr, tobe_added_obj=obj)
    return NodeHandleResult(used_objs=added_obj.obj_nodes)


def array_join(G: Graph, caller_ast, array: NodeHandleResult, sep: NodeHandleResult):
    returned_objs = []
    used_objs = set()
    for arr in array.obj_nodes:
        new_literal = G.add_obj_node(caller_ast, 'string')
        returned_objs.append(new_literal)
        members = G.get_prop_obj_nodes(parent_obj=arr)
        used_objs.update(members)
        for obj in members:
            G.add_edge(obj, new_literal, {'type:TYPE': 'CONTRIBUTES_TO'})
    return NodeHandleResult(obj_nodes=returned_objs, used_objs=list(used_objs))


def parse_number(G: Graph, caller_ast, s: NodeHandleResult, rad=None):
    returned_objs = []
    for obj in s.obj_nodes:
        new_literal = G.add_obj_node(caller_ast, 'number')
        returned_objs.append(new_literal)
        G.add_edge(obj, new_literal, {'type:TYPE': 'CONTRIBUTES_TO'})
    return NodeHandleResult(obj_nodes=returned_objs, used_objs=s.obj_nodes)

def string_returning_func(G: Graph, caller_ast, *args):
    returned_string = G.add_obj_node(caller_ast, 'string')
    used_objs = set()
    for arg in args:
        used_objs.update(arg.obj_nodes)
        for obj in arg.obj_nodes:
            G.add_edge(obj, returned_string, {'type:TYPE': 'CONTRIBUTES_TO'})
    return NodeHandleResult(obj_nodes=[returned_string], used_objs=list(used_objs))

def boolean_returning_func(G: Graph, caller_ast, *args):
    return NodeHandleResult(obj_nodes=[G.true_obj, G.false_obj])