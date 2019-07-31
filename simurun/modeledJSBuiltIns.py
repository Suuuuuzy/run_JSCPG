from graph import Graph
from utilities import NodeHandleResult
import objectGraphGenerator
import sty
import re


def setup_js_builtins(G: Graph):
    setup_object_and_function(G)
    setup_string(G)
    setup_number(G)
    setup_array(G)
    setup_boolean(G)
    setup_symbol(G)
    setup_errors(G)
    setup_global_functions(G)


def setup_string(G: Graph):
    string_cons = G.add_blank_func_to_scope('String', scope=G.BASE_SCOPE)
    string_prototype = G.get_prop_obj_nodes(prop_name='prototype', parent_obj=string_cons)[0]
    G.string_prototype = string_prototype


def setup_number(G: Graph):
    number_cons = G.add_blank_func_to_scope('Number', scope=G.BASE_SCOPE)
    number_prototype = G.get_prop_obj_nodes(prop_name='prototype', parent_obj=number_cons)[0]
    G.number_prototype = number_prototype
    # Number.prototype.__proto__ = Object.prototype
    G.add_obj_as_prop(None, None, '__proto__', parent_obj=number_prototype, tobe_added_obj=G.object_prototype)


def setup_array(G: Graph):
    array_cons = G.add_blank_func_to_scope('Array', scope=G.BASE_SCOPE)
    array_prototype = G.get_prop_obj_nodes(prop_name='prototype', parent_obj=array_cons)[0]
    G.array_prototype = array_prototype
    # Array.prototype.__proto__ = Object.prototype
    G.add_obj_as_prop(None, None, '__proto__', parent_obj=array_prototype, tobe_added_obj=G.object_prototype)
    # built-in functions
    G.add_blank_func_as_prop('push', array_prototype, array_push)
    G.add_blank_func_as_prop('pop', array_prototype, array_pop)
    G.add_blank_func_as_prop('unshift', array_prototype, array_push)
    G.add_blank_func_as_prop('shift', array_prototype, array_pop)
    G.add_blank_func_as_prop('join', array_prototype, array_join)
    G.add_blank_func_as_prop('forEach', array_prototype, array_for_each)
    G.add_blank_func_as_prop('keys', array_prototype, array_keys)
    G.add_blank_func_as_prop('values', array_prototype, array_values)
    G.add_blank_func_as_prop('entries', array_prototype, array_entries)


def setup_boolean(G: Graph):
    boolean_cons = G.add_blank_func_to_scope('Boolean', scope=G.BASE_SCOPE)
    boolean_prototype = G.get_prop_obj_nodes(prop_name='prototype', parent_obj=boolean_cons)[0]
    G.boolean_prototype = boolean_prototype
    # Boolean.prototype.__proto__ = Object.prototype
    G.add_obj_as_prop(None, None, '__proto__', parent_obj=boolean_prototype, tobe_added_obj=G.object_prototype)


def setup_symbol(G: Graph):
    symbol_cons = G.add_blank_func_to_scope('Symbol', scope=G.BASE_SCOPE)
    symbol_prototype = G.get_prop_obj_nodes(prop_name='prototype', parent_obj=symbol_cons)[0]
    # Symbol.prototype.__proto__ = Object.prototype
    G.add_obj_as_prop(None, None, '__proto__', parent_obj=symbol_prototype, tobe_added_obj=G.object_prototype)


def setup_errors(G: Graph):
    error_cons = G.add_blank_func_to_scope('Error', scope=G.BASE_SCOPE)
    # Error.prototype.__proto__ = Object.prototype
    error_prototype = G.get_prop_obj_nodes(prop_name='prototype', parent_obj=error_cons)[0]
    G.add_obj_as_prop(None, None, '__proto__', parent_obj=error_prototype, tobe_added_obj=G.object_prototype)
    for i in ['EvalError', 'InternalError', 'RangeError', 'ReferenceError', 'SyntaxError', 'TypeError', 'URIError']:
        # EvalError.prototype.__proto__ = Error
        cons = G.add_blank_func_to_scope(i, scope=G.BASE_SCOPE)
        prototype = G.get_prop_obj_nodes(prop_name='prototype', parent_obj=cons)[0]
        G.add_obj_as_prop(None, None, '__proto__', parent_obj=prototype, tobe_added_obj=error_prototype)


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
    # Function.prototype.__proto__ = Object.prototype (because Function.prototype is an object)
    function__proto____proto__ = G.add_obj_as_prop(None, None, '__proto__', parent_obj=function_prototype, tobe_added_obj=object_prototype)
    # Object.__proto__ = Function.prototype (beacuse Object is a function)
    G.add_obj_as_prop(None, None, '__proto__', parent_obj=object_cons, tobe_added_obj=function_prototype)
    # set reserved values
    G.function_prototype = function_prototype
    G.object_prototype = object_prototype

    # built-in functions
    G.add_blank_func_as_prop('keys', object_cons, object_keys)
    G.add_blank_func_as_prop('values', object_cons, object_values)
    G.add_blank_func_as_prop('entries', object_cons, object_entries)

    G.add_blank_func_as_prop('toString', object_prototype, object_to_string)
    G.add_blank_func_as_prop('toLocaleString', object_prototype, object_to_string)
    G.add_blank_func_as_prop('valueOf', object_prototype, object_value_of)


def setup_global_functions(G: Graph):
    parse_int = G.add_blank_func_to_scope('parseInt', G.BASE_SCOPE, parse_number)
    parse_float = G.add_blank_func_to_scope('parseFloat', G.BASE_SCOPE, parse_number)
    decode_uri = G.add_blank_func_to_scope('decodeURI', G.BASE_SCOPE, string_returning_func)
    decode_uri_component = G.add_blank_func_to_scope('decodeURIComponent', G.BASE_SCOPE, string_returning_func)
    encode_uri = G.add_blank_func_to_scope('encodeURI', G.BASE_SCOPE, string_returning_func)
    encode_uri_component = G.add_blank_func_to_scope('encodeURIComponent', G.BASE_SCOPE, string_returning_func)
    escape = G.add_blank_func_to_scope('escape', G.BASE_SCOPE, string_returning_func)
    unescape = G.add_blank_func_to_scope('unescape', G.BASE_SCOPE, string_returning_func)


def array_for_each(G: Graph, caller_ast, extra, array: NodeHandleResult, callback: NodeHandleResult):
    branches = extra.branches
    for arr in array.obj_nodes:
        elements = G.get_prop_obj_nodes(arr, branches=branches)
        print(sty.fg.green + f'Calling callback functions {callback.obj_nodes} with elements {elements}.' + sty.rs.all)
        for elem in elements:
            for func in callback.obj_nodes:
                func_decl = G.get_obj_def_ast_node(func)
                func_scope = G.get_func_scope_by_obj_node(func)
                objectGraphGenerator.call_callback_function(G, caller_ast,
                    func_decl, func_scope,
                    args=[NodeHandleResult(obj_nodes=[elem])],
                    branches=extra.branches)
    return NodeHandleResult()


def array_push(G: Graph, caller_ast, extra, array: NodeHandleResult, added_obj: NodeHandleResult):
    for arr in array.obj_nodes:
        for obj in added_obj.obj_nodes:
            G.add_obj_as_prop(None, None, name='*', parent_obj=arr, tobe_added_obj=obj)
    return NodeHandleResult(used_objs=added_obj.obj_nodes)


def array_pop(G: Graph, caller_ast, extra, array: NodeHandleResult):
    branches = extra.branches
    returned_objs = set()
    for arr in array.obj_nodes:
        elements = G.get_prop_obj_nodes(arr, branches=branches)
        returned_objs.update(elements)
    return NodeHandleResult(obj_nodes=list(returned_objs))


def array_join(G: Graph, caller_ast, extra, array: NodeHandleResult, sep: NodeHandleResult):
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


def object_keys(G: Graph, caller_ast, extra, arg: NodeHandleResult, for_array=False):
    returned_objs = []
    for obj in arg.obj_nodes:
        arr = G.add_obj_node(None, 'array')
        for i, name_node in enumerate(G.get_prop_name_nodes(obj)):
            name = G.get_node_attr(name_node).get('code')
            if for_array and not (name.isdigit() or name == '*'):
                continue # Array only returns numeric keys/corresponding values
            string = G.add_obj_node(None, 'string', name)
            G.add_obj_as_prop(name=str(i), parent_obj=arr, tobe_added_obj=string)
        returned_objs.append(arr)
    return NodeHandleResult(obj_nodes=returned_objs)


def object_values(G: Graph, caller_ast, extra, arg: NodeHandleResult, for_array=False):
    returned_objs = []
    for obj in arg.obj_nodes:
        arr = G.add_obj_node(None, 'array')
        for i, name_node in enumerate(G.get_prop_name_nodes(obj)):
            name = G.get_node_attr(name_node).get('code')
            if for_array and not (name.isdigit() or name == '*'):
                continue # Array only returns numeric keys/corresponding values
            prop_objs = G.get_objs_by_name_node(name_node)
            for prop_obj in prop_objs:
                G.add_obj_as_prop(name=str(i), parent_obj=arr, tobe_added_obj=prop_obj)
        returned_objs.append(arr)
    return NodeHandleResult(obj_nodes=returned_objs)


def object_entries(G: Graph, caller_ast, extra, arg: NodeHandleResult, for_array=False):
    returned_objs = []
    for obj in arg.obj_nodes:
        arr = G.add_obj_node(None, 'array')
        for i, name_node in enumerate(G.get_prop_name_nodes(obj)):
            child_arr = G.add_obj_node(None, 'array')
            # key
            name = G.get_node_attr(name_node).get('code')
            if for_array and not (name.isdigit() or name == '*'):
                continue # Array only returns numeric keys/corresponding values
            string = G.add_obj_node(None, 'string', name)
            G.add_obj_as_prop(name='0', parent_obj=child_arr, tobe_added_obj=string)
            # value
            prop_objs = G.get_objs_by_name_node(name_node)
            for prop_obj in prop_objs:
                G.add_obj_as_prop(name='1', parent_obj=child_arr, tobe_added_obj=prop_obj)
            G.add_obj_as_prop(name=str(i), parent_obj=arr, tobe_added_obj=child_arr)
        returned_objs.append(arr)
    return NodeHandleResult(obj_nodes=returned_objs)


def array_keys(G: Graph, caller_ast, extra, this: NodeHandleResult, for_array=False):
    return object_keys(G, caller_ast, extra, this, True)


def array_values(G: Graph, caller_ast, extra, this: NodeHandleResult, for_array=False):
    return object_values(G, caller_ast, extra, this, True)


def array_entries(G: Graph, caller_ast, extra, this: NodeHandleResult, for_array=False):
    return object_entries(G, caller_ast, extra, this, True)


def object_to_string(G: Graph, caller_ast, extra, this: NodeHandleResult):
    returned_objs = []
    for obj in this.obj_nodes:
        string = G.add_obj_node(None, 'string')
        G.add_edge(obj, string, {'type:TYPE': 'CONTRIBUTES_TO'})
        returned_objs.append(string)
    return NodeHandleResult(obj_nodes=returned_objs)


def object_value_of(G: Graph, caller_ast, extra, this: NodeHandleResult):
    return this


def parse_number(G: Graph, caller_ast, extra, s: NodeHandleResult, rad=None):
    returned_objs = []
    for obj in s.obj_nodes:
        new_literal = G.add_obj_node(caller_ast, 'number')
        returned_objs.append(new_literal)
        G.add_edge(obj, new_literal, {'type:TYPE': 'CONTRIBUTES_TO'})
    return NodeHandleResult(obj_nodes=returned_objs, used_objs=s.obj_nodes)


def string_returning_func(G: Graph, caller_ast, extra, *args):
    returned_string = G.add_obj_node(caller_ast, 'string')
    used_objs = set()
    for arg in args:
        used_objs.update(arg.obj_nodes)
        for obj in arg.obj_nodes:
            G.add_edge(obj, returned_string, {'type:TYPE': 'CONTRIBUTES_TO'})
    return NodeHandleResult(obj_nodes=[returned_string], used_objs=list(used_objs))


def boolean_returning_func(G: Graph, caller_ast, extra, *args):
    return NodeHandleResult(obj_nodes=[G.true_obj, G.false_obj])