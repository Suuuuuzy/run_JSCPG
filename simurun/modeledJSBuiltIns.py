from .graph import Graph
from .utilities import NodeHandleResult, BranchTag
from . import objectGraphGenerator
import sty
import re
from .logger import *


logger = create_logger("main_logger", output_type="file")


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
    G.add_blank_func_as_prop('forEach', array_prototype, array_for_each_static_new)
    G.add_blank_func_as_prop('keys', array_prototype, array_keys)
    G.add_blank_func_as_prop('values', array_prototype, array_values)
    G.add_blank_func_as_prop('entries', array_prototype, array_entries)
    G.add_blank_func_as_prop('slice', array_prototype, this_returning_func)
    G.add_blank_func_as_prop('filter', array_prototype, this_returning_func)



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
    object_prototype = G.get_prop_obj_nodes(prop_name='prototype', parent_obj=object_cons)[0]
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
    G.add_blank_func_as_prop('valueOf', object_prototype, this_returning_func)


def setup_global_functions(G: Graph):
    parse_int = G.add_blank_func_to_scope('parseInt', G.BASE_SCOPE, parse_number)
    parse_float = G.add_blank_func_to_scope('parseFloat', G.BASE_SCOPE, parse_number)
    decode_uri = G.add_blank_func_to_scope('decodeURI', G.BASE_SCOPE, string_returning_func)
    decode_uri_component = G.add_blank_func_to_scope('decodeURIComponent', G.BASE_SCOPE, string_returning_func)
    encode_uri = G.add_blank_func_to_scope('encodeURI', G.BASE_SCOPE, string_returning_func)
    encode_uri_component = G.add_blank_func_to_scope('encodeURIComponent', G.BASE_SCOPE, string_returning_func)
    escape = G.add_blank_func_to_scope('escape', G.BASE_SCOPE, string_returning_func)
    unescape = G.add_blank_func_to_scope('unescape', G.BASE_SCOPE, string_returning_func)
    set_timeout = G.add_blank_func_to_scope('setTimeout', G.BASE_SCOPE, blank_func)
    clear_timeout = G.add_blank_func_to_scope('clearTimeout', G.BASE_SCOPE, blank_func)
    set_interval = G.add_blank_func_to_scope('setInterval', G.BASE_SCOPE, blank_func)
    clear_interval = G.add_blank_func_to_scope('clearInterval', G.BASE_SCOPE, blank_func)


def array_for_each(G: Graph, caller_ast, extra, array: NodeHandleResult, callback: NodeHandleResult):
    branches = extra.branches
    for arr in array.obj_nodes:
        elements = G.get_prop_obj_nodes(arr, branches=branches)
        logger.debug(sty.fg.green + f'Calling callback functions {callback.obj_nodes} with elements {elements}.' + sty.rs.all)
        for elem in elements:
            for func in callback.obj_nodes:
                func_decl = G.get_obj_def_ast_node(func)
                func_name = G.get_name_from_child(func_decl)
                func_scope = G.add_scope('FUNC_SCOPE', func, f'Function{func_decl}:{caller_ast}', func, caller_ast, func_name)
                objectGraphGenerator.call_callback_function(G, caller_ast,
                    func_decl, func_scope,
                    args=[NodeHandleResult(obj_nodes=[elem])],
                    branches=extra.branches)
    return NodeHandleResult()


def array_for_each_static(G: Graph, caller_ast, extra, array: NodeHandleResult, callback: NodeHandleResult):
    branches = extra.branches
    objs = set()
    for arr in array.obj_nodes:
        elements = G.get_prop_obj_nodes(arr, branches=branches)
        for elem in elements:
            objs.add(elem)
    logger.debug(sty.fg.green + f'Calling callback functions {callback.obj_nodes} with elements {objs}.' + sty.rs.all)
    for func in callback.obj_nodes:
        func_decl = G.get_obj_def_ast_node(func)
        func_name = G.get_name_from_child(func_decl)
        func_scope = G.add_scope('FUNC_SCOPE', func, f'Function{func_decl}:{caller_ast}', func, caller_ast, func_name)
        objectGraphGenerator.call_callback_function(G, caller_ast, func_decl,
            func_scope, args=[NodeHandleResult(obj_nodes=objs)],
            branches=extra.branches)
    return NodeHandleResult()


def array_for_each_static_new(G: Graph, caller_ast, extra, array: NodeHandleResult, callback: NodeHandleResult, this: NodeHandleResult=None):
    branches = extra.branches
    objs = []
    names = []
    counter = 0
    for arr in array.obj_nodes:
        name_nodes = G.get_prop_name_nodes(arr)
        for name_node in name_nodes:
            name = G.get_node_attr(name_node).get('name')
            try: # check if the index is an integer
                _ = int(name)
            except ValueError:
                continue
            for obj in G.get_obj_nodes(name_node, branches=branches):
                objs.append(obj)
                names.append(name)
                tags = G.get_node_attr(obj).get('for_tags', [])
                tags.append(BranchTag(point=f'ForEach{caller_ast}',
                                      branch=counter, mark='P'))
                G.set_node_attr(obj, ('for_tags', tags))
                counter += 1
    args = [NodeHandleResult(obj_nodes=objs),
            NodeHandleResult(values=names),
            array]
    logger.debug(sty.fg.green + f'Calling callback functions {callback.obj_nodes} with elements {objs}.' + sty.rs.all)
    for func in callback.obj_nodes:
        func_decl = G.get_obj_def_ast_node(func)
        func_name = G.get_name_from_child(func_decl)
        func_scope = G.add_scope('FUNC_SCOPE', func, f'Function{func_decl}:{caller_ast}', func, caller_ast, func_name)
        objectGraphGenerator.call_callback_function(
            G, caller_ast, func_decl, func_scope, args=args,
            branches=extra.branches + [BranchTag(point=f'ForEach{caller_ast}')])
    return NodeHandleResult()


def array_push(G: Graph, caller_ast, extra, array: NodeHandleResult, *added_objs: NodeHandleResult):
    obj_nodes = set()
    used_objs = set()
    for arr in array.obj_nodes:
        for added_obj in added_objs:
            used_objs = used_objs.union(set(added_obj.used_objs))
            obj_nodes = obj_nodes.union(set(added_obj.obj_nodes))
            for obj in added_obj.obj_nodes:
                G.add_obj_as_prop(prop_name='*', parent_obj=arr, tobe_added_obj=obj)
    used_objs = list(obj_nodes.union(used_objs))
    return NodeHandleResult(used_objs=used_objs)


def array_pop(G: Graph, caller_ast, extra, array: NodeHandleResult):
    branches = extra.branches
    returned_objs = set()
    for arr in array.obj_nodes:
        elements = G.get_prop_obj_nodes(arr, branches=branches)
        returned_objs.update(elements)
    return NodeHandleResult(obj_nodes=list(returned_objs))


def array_join(G: Graph, caller_ast, extra, array: NodeHandleResult, sep: NodeHandleResult = ''):
    # the sep can be none
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
            if name is None:
                continue
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
            if name is None:
                continue
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
            if name is None:
                continue
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


def object_to_string(G: Graph, caller_ast, extra, this: NodeHandleResult, 
        encoding: NodeHandleResult = None, start = None, end = None):
    returned_objs = []
    for obj in this.obj_nodes:
        string = G.add_obj_node(None, 'string')
        G.add_edge(obj, string, {'type:TYPE': 'CONTRIBUTES_TO'})
        returned_objs.append(string)
    return NodeHandleResult(obj_nodes=returned_objs)


def object_create(G: Graph, caller_ast, extra, proto: NodeHandleResult):
    returned_objs = []
    for p in proto:
        new_obj = G.add_obj_node(caller_ast, None)
        G.add_obj_as_prop(name='__proto__', parent_obj=new_obj, tobe_added_obj=p)
        returned_objs.append(new_obj)
    return NodeHandleResult(obj_nodes=returned_objs)


def object_is(G: Graph, caller_ast, extra, value1: NodeHandleResult, value2: NodeHandleResult):
    if value1.obj_nodes == value2.obj_nodes:
        return NodeHandleResult(obj_nodes=G.true_obj)
    else:
        return NodeHandleResult(obj_nodes=G.false_obj)


def function_call(G: Graph, caller_ast, extra, func: NodeHandleResult, this: NodeHandleResult, *args):
    objectGraphGenerator.call_function(func.obj_nodes, args, this, extra,
        caller_ast, False, stmt_id=f'Call{caller_ast}')


def function_apply(G: Graph, caller_ast, extra, func: NodeHandleResult, this: NodeHandleResult, arg_array=None):
    args = []
    if arg_array is not None:
        for array in arg_array.obj_nodes: # for every possible argument array
            i = 0 # argument counter
            while True:
                objs = G.get_prop_obj_nodes(parent_obj=array, prop_name=str(i),
                    branches=extra.branches)
                if objs:
                    # if the counter exceeds the length of the args array,
                    # expand it
                    if i >= len(args):
                        args.append([])
                    # extend possible objects with objects in the array
                    args[i].extend(objs)
                else: # the array is finished (index is larger than its length)
                    break
    args = [NodeHandleResult(obj_nodes=i) for i in args]
    return function_call(G, caller_ast, extra, func, this, *args)


def function_bind(G: Graph, caller_ast, extra, func: NodeHandleResult, this: NodeHandleResult, *args):
    returned_objs = []
    for f in func.obj_nodes:
        for t in this.obj_nodes:
            new_func = G.add_obj_node(caller_ast, 'function')
            G.set_node_attr(new_func, ('target_func', f))
            G.set_node_attr(new_func, ('bound_this', t))
            if args:
                G.set_node_attr(new_func, ('bound_args', args))
            returned_objs.append(new_func)
    return NodeHandleResult(obj_nodes=returned_objs)


def parse_number(G: Graph, caller_ast, extra, s: NodeHandleResult, rad=None):
    returned_objs = []
    for obj in s.obj_nodes:
        new_literal = G.add_obj_node(caller_ast, 'number')
        returned_objs.append(new_literal)
        G.add_edge(obj, new_literal, {'type:TYPE': 'CONTRIBUTES_TO'})
    used_objs = list(set(s.obj_nodes + s.used_objs))
    return NodeHandleResult(obj_nodes=returned_objs, used_objs=used_objs)


def blank_func(G: Graph, caller_ast, extra, *args):
    return NodeHandleResult()


def this_returning_func(G: Graph, caller_ast, extra, this: NodeHandleResult, *args):
    return this


def string_returning_func(G: Graph, caller_ast, extra, *args):
    returned_string = G.add_obj_node(caller_ast, 'string')
    used_objs = set()
    for arg in args:
        used_objs.update(arg.obj_nodes)
        used_objs.update(arg.used_objs)
        for obj in arg.obj_nodes:
            G.add_edge(obj, returned_string, {'type:TYPE': 'CONTRIBUTES_TO'})
    return NodeHandleResult(obj_nodes=[returned_string], used_objs=list(used_objs))


def boolean_returning_func(G: Graph, caller_ast, extra, *args):
    return NodeHandleResult(obj_nodes=[G.true_obj, G.false_obj])
