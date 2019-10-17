from .graph import Graph
from .utilities import NodeHandleResult, BranchTag, BranchTagContainer, ExtraInfo
from . import objectGraphGenerator
from .helpers import to_values, to_obj_nodes, val_to_str, is_int
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
    setup_global_objs(G)
    setup_json(G)
    setup_regexp(G)


def setup_string(G: Graph):
    string_cons = G.add_blank_func_to_scope('String', scope=G.BASE_SCOPE, python_func=this_returning_func)
    string_prototype = G.get_prop_obj_nodes(prop_name='prototype', parent_obj=string_cons)[0]
    G.string_prototype = string_prototype
    # built-in functions for regexp
    G.add_blank_func_as_prop('match', string_prototype, None)
    G.add_blank_func_as_prop('matchAll', string_prototype, None)
    G.add_blank_func_as_prop('replace', string_prototype, None)
    G.add_blank_func_as_prop('search', string_prototype, None)
    G.add_blank_func_as_prop('split', string_prototype, None)


def setup_number(G: Graph):
    number_cons = G.add_blank_func_to_scope('Number', scope=G.BASE_SCOPE, python_func=this_returning_func)
    number_prototype = G.get_prop_obj_nodes(prop_name='prototype', parent_obj=number_cons)[0]
    G.number_prototype = number_prototype
    # Number.prototype.__proto__ = Object.prototype
    G.add_obj_as_prop(None, None, '__proto__', parent_obj=number_prototype, tobe_added_obj=G.object_prototype)


def setup_array(G: Graph):
    array_cons = G.add_blank_func_to_scope('Array', scope=G.BASE_SCOPE) # TODO: implement this
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
    boolean_cons = G.add_blank_func_to_scope('Boolean', scope=G.BASE_SCOPE, python_func=this_returning_func)
    boolean_prototype = G.get_prop_obj_nodes(prop_name='prototype', parent_obj=boolean_cons)[0]
    G.boolean_prototype = boolean_prototype
    # Boolean.prototype.__proto__ = Object.prototype
    G.add_obj_as_prop(None, None, '__proto__', parent_obj=boolean_prototype, tobe_added_obj=G.object_prototype)


def setup_symbol(G: Graph):
    symbol_cons = G.add_blank_func_to_scope('Symbol', scope=G.BASE_SCOPE, python_func=this_returning_func)
    symbol_prototype = G.get_prop_obj_nodes(prop_name='prototype', parent_obj=symbol_cons)[0]
    # Symbol.prototype.__proto__ = Object.prototype
    G.add_obj_as_prop(None, None, '__proto__', parent_obj=symbol_prototype, tobe_added_obj=G.object_prototype)


def setup_errors(G: Graph):
    error_cons = G.add_blank_func_to_scope('Error', scope=G.BASE_SCOPE, python_func=this_returning_func)
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
    object_cons = G.add_blank_func_to_scope('Object', scope=G.BASE_SCOPE, python_func=this_returning_func)
    # get Object.prototype
    object_prototype = G.get_prop_obj_nodes(prop_name='prototype', parent_obj=object_cons)[0]
    G.set_node_attr(object_prototype, ('code', 'Object.prototype'))
    # add Object.prototype.__proto__
    G.add_obj_as_prop(None, None, '__proto__', parent_obj=object_prototype, tobe_added_obj=G.null_obj)
    # add Function (function)
    function_cons = G.add_blank_func_to_scope('Function', scope=G.BASE_SCOPE) # TODO: implement this
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

    # object built-in functions
    G.add_blank_func_as_prop('keys', object_cons, object_keys)
    G.add_blank_func_as_prop('values', object_cons, object_values)
    G.add_blank_func_as_prop('entries', object_cons, object_entries)

    G.add_blank_func_as_prop('toString', object_prototype, object_to_string)
    G.add_blank_func_as_prop('toLocaleString', object_prototype, object_to_string)
    G.add_blank_func_as_prop('valueOf', object_prototype, this_returning_func)

    # function built-in functions
    G.add_blank_func_as_prop('call', function_prototype, function_call)
    G.add_blank_func_as_prop('apply', function_prototype, function_apply)
    G.add_blank_func_as_prop('bind', function_prototype, function_bind)


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


def array_for_each(G: Graph, caller_ast, extra, array=NodeHandleResult(), callback=NodeHandleResult()):
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


def array_for_each_static(G: Graph, caller_ast, extra, array: NodeHandleResult, callback=NodeHandleResult()):
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


def array_for_each_static_new(G: Graph, caller_ast, extra, array: NodeHandleResult, callback=NodeHandleResult(), this=NodeHandleResult()):
    branches = extra.branches
    objs = []
    names = []
    name_tags = []
    counter = 0
    for arr in array.obj_nodes:
        name_nodes = G.get_prop_name_nodes(arr)
        parent_for_tags = BranchTagContainer(G.get_node_attr(arr)
            .get('for_tags', [])).get_matched_tags(branches, level=1) \
            .set_marks('P')
        for name_node in name_nodes:
            name = G.get_node_attr(name_node).get('name')
            if name != '*' and not is_int(name):
                continue # check if the index is an integer
            for obj in G.get_obj_nodes(name_node, branches=branches):
                objs.append(obj)
                names.append(name)
                new_tag = BranchTag(point=f'ForEach{caller_ast}',
                                    branch=counter, mark='L')
                obj_tags = G.get_node_attr(obj).get('for_tags', [])
                obj_tags.extend(parent_for_tags + [new_tag])
                G.set_node_attr(obj, ('for_tags', obj_tags))
                name_tags.append(parent_for_tags +  [new_tag])
                counter += 1
    args = [NodeHandleResult(obj_nodes=objs),
            NodeHandleResult(values=names, value_tags=name_tags),
            array]
    logger.debug(sty.fg.green + f'Calling callback functions {callback.obj_nodes} with elements {objs}.' + sty.rs.all)
    new_extra = ExtraInfo(extra, branches=extra.branches+[BranchTag(point=f'ForEach{caller_ast}')])
    objectGraphGenerator.call_function(G, callback.obj_nodes, args=args,
        extra=new_extra, caller_ast=caller_ast, func_name=callback.name)
    return NodeHandleResult()


def array_push(G: Graph, caller_ast, extra, array: NodeHandleResult, *tobe_added_objs: NodeHandleResult):
    obj_nodes = set()
    used_objs = set()
    for arr in array.obj_nodes:
        for obj in tobe_added_objs:
            used_objs = used_objs.union(set(obj.used_objs))
            obj_nodes = obj_nodes.union(set(obj.obj_nodes))
            for obj in obj.obj_nodes:
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


def array_join(G: Graph, caller_ast, extra, array: NodeHandleResult, sep=None):
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
            G.add_obj_as_prop(str(i), parent_obj=arr, tobe_added_obj=string)
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
                G.add_obj_as_prop(str(i), parent_obj=arr, tobe_added_obj=prop_obj)
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
            G.add_obj_as_prop('0', parent_obj=child_arr, tobe_added_obj=string)
            # value
            prop_objs = G.get_objs_by_name_node(name_node)
            for prop_obj in prop_objs:
                G.add_obj_as_prop('1', parent_obj=child_arr, tobe_added_obj=prop_obj)
            G.add_obj_as_prop(str(i), parent_obj=arr, tobe_added_obj=child_arr)
        returned_objs.append(arr)
    return NodeHandleResult(obj_nodes=returned_objs)


def array_keys(G: Graph, caller_ast, extra, this: NodeHandleResult, for_array=False):
    return object_keys(G, caller_ast, extra, this, True)


def array_values(G: Graph, caller_ast, extra, this: NodeHandleResult, for_array=False):
    return object_values(G, caller_ast, extra, this, True)


def array_entries(G: Graph, caller_ast, extra, this: NodeHandleResult, for_array=False):
    return object_entries(G, caller_ast, extra, this, True)


def object_to_string(G: Graph, caller_ast, extra, this: NodeHandleResult, 
        *args):
    returned_objs = []
    for obj in this.obj_nodes:
        value = G.get_node_attr(obj).get('code')
        string = G.add_obj_node(caller_ast, 'string', value)
        G.add_edge(obj, string, {'type:TYPE': 'CONTRIBUTES_TO'})
        returned_objs.append(string)
    return NodeHandleResult(obj_nodes=returned_objs, used_objs=this.obj_nodes)


def object_create(G: Graph, caller_ast, extra, _, proto=NodeHandleResult()):
    returned_objs = []
    for p in proto.obj_nodes:
        new_obj = G.add_obj_node(caller_ast, None)
        G.add_obj_as_prop(prop_name='__proto__', parent_obj=new_obj, tobe_added_obj=p)
        returned_objs.append(new_obj)
    return NodeHandleResult(obj_nodes=returned_objs)


def object_is(G: Graph, caller_ast, extra, _, value1: NodeHandleResult, value2: NodeHandleResult):
    if value1.obj_nodes == value2.obj_nodes:
        return NodeHandleResult(obj_nodes=G.true_obj)
    else:
        return NodeHandleResult(obj_nodes=G.false_obj)


def function_call(G: Graph, caller_ast, extra, func: NodeHandleResult, this=NodeHandleResult(), *args):
    returned_objs, used_objs = objectGraphGenerator.call_function(
        G, func.obj_nodes, list(args), this, extra, caller_ast,
        stmt_id=f'Call{caller_ast}')
    return NodeHandleResult(obj_nodes=returned_objs, used_objs=used_objs)

def function_apply(G: Graph, caller_ast, extra, func: NodeHandleResult, this=NodeHandleResult(), arg_array=None):
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
                i += 1
                if i > 32767:
                    break
    args = [NodeHandleResult(obj_nodes=i) for i in args]
    return function_call(G, caller_ast, extra, func, this, *args)


def function_bind(G: Graph, caller_ast, extra, func: NodeHandleResult, this=NodeHandleResult(), *args):
    returned_objs = []
    for f in func.obj_nodes:
        ast_node = G.get_obj_def_ast_node(f)
        new_func = G.add_obj_node(ast_node, 'function')
        G.set_node_attr(new_func, ('target_func', f))
        G.set_node_attr(new_func, ('bound_this', this))
        if args:
            G.set_node_attr(new_func, ('bound_args', args))
        returned_objs.append(new_func)
        logger.log(ATTENTION, 'Bind function {} to {}, this={}, AST node {}'.format(f, new_func, this.obj_nodes, ast_node))
    return NodeHandleResult(obj_nodes=returned_objs)


def parse_number(G: Graph, caller_ast, extra, _, s=NodeHandleResult(), rad=None):
    returned_objs = []
    for obj in s.obj_nodes:
        new_literal = G.add_obj_node(caller_ast, 'number')
        returned_objs.append(new_literal)
        G.add_edge(obj, new_literal, {'type:TYPE': 'CONTRIBUTES_TO'})
    used_objs = list(set(s.obj_nodes + s.used_objs))
    return NodeHandleResult(obj_nodes=returned_objs, used_objs=used_objs)


def blank_func(G: Graph, caller_ast, extra, _, *args):
    return NodeHandleResult()


def this_returning_func(G: Graph, caller_ast, extra, this=None, *args):
    if this is None:
        return NodeHandleResult()
    else:
        return this


def string_returning_func(G: Graph, caller_ast, extra, _, *args):
    returned_string = G.add_obj_node(caller_ast, 'string')
    used_objs = set()
    for arg in args:
        used_objs.update(arg.obj_nodes)
        used_objs.update(arg.used_objs)
        for obj in arg.obj_nodes:
            G.add_edge(obj, returned_string, {'type:TYPE': 'CONTRIBUTES_TO'})
    return NodeHandleResult(obj_nodes=[returned_string], used_objs=list(used_objs))


def boolean_returning_func(G: Graph, caller_ast, extra, _, *args):
    used_objs = set()
    for arg in args:
        used_objs.update(arg.obj_nodes)
        used_objs.update(arg.used_objs)
    return NodeHandleResult(obj_nodes=[G.true_obj, G.false_obj], used_objs=list(used_objs))


def setup_global_objs(G: Graph):
    console_obj = G.add_obj_to_scope(name='console', scope=G.BASE_SCOPE)
    G.add_blank_func_as_prop('log', console_obj, console_log)
    G.add_blank_func_as_prop('error', console_obj, console_log)

    process_obj = G.add_obj_to_scope(name='process', scope=G.BASE_SCOPE)
    G.add_obj_as_prop(prop_name='argv', parent_obj=process_obj)
    version_obj = G.add_obj_as_prop(prop_name='versions', parent_obj=process_obj)
    G.add_obj_as_prop(prop_name='modules', parent_obj=version_obj, js_type='string')
    G.add_obj_as_prop(prop_name='platform', parent_obj=process_obj)
    G.add_obj_as_prop(prop_name='arch', parent_obj=process_obj)


def console_log(G: Graph, caller_ast, extra, _, *args):
    used_objs = set()
    for i, arg in enumerate(args):
        used_objs.update(arg.obj_nodes)
        used_objs.update(arg.used_objs)
        values = list(map(str, arg.values))
        for obj in arg.obj_nodes:
            value = G.get_node_attr(obj).get('code')
            values.append(f'{sty.fg.li_black}{obj}{sty.rs.all}: {val_to_str(value)}')
        logger.debug(f'Argument {i} values: ' + ', '.join(values))
    return NodeHandleResult(obj_nodes=[G.undefined_obj], used_objs=list(used_objs))


def setup_json(G: Graph):
    console_obj = G.add_obj_to_scope(name='JSON', scope=G.BASE_SCOPE)
    G.add_blank_func_as_prop('parse', console_obj, json_parse)
    G.add_blank_func_as_prop('stringify', console_obj, string_returning_func)


def json_parse(G: Graph, caller_ast, extra, _, text=None, reviver=None):
    json_strings, sources, _ = to_values(G, text, caller_ast)
    returned_objs = []
    used_objs = set()
    for i, json_string in enumerate(json_strings):
        obj = objectGraphGenerator.analyze_json_python(G, json_string,
            extra=extra, caller_ast=caller_ast)
        if obj is None:
            obj = G.add_obj_node(ast_node=caller_ast)
        for s in sources[i]:
            G.add_edge(s, obj, {'type:TYPE': 'CONTRIBUTES_TO'})
            used_objs.add(s)
        returned_objs.append(obj)
    return NodeHandleResult(obj_nodes=returned_objs, used_objs=list(used_objs))


def setup_regexp(G: Graph):
    regexp_cons = G.add_blank_func_to_scope('RegExp', scope=G.BASE_SCOPE,
        python_func=regexp_constructor)
    regexp_prototype = G.get_prop_obj_nodes(prop_name='prototype', parent_obj=regexp_cons)[0]
    G.regexp_prototype = regexp_prototype
    # built-in functions
    G.add_blank_func_as_prop('exec', regexp_prototype, None)
    G.add_blank_func_as_prop('test', regexp_prototype, None)


def regexp_constructor(G: Graph, caller_ast, extra, _, pattern=None, flags=None):
    returned_objs = []
    used_objs = set(pattern.obj_nodes + pattern.used_objs)
    if flags:
        used_objs.update(flags.obj_nodes)
        used_objs.update(flags.used_objs)
    if pattern is not None:
        flag_objs = flags.obj_nodes if flags else []
        for p in pattern.obj_nodes:
            for f in flag_objs:
                pv = G.get_node_attr(p).get('code')
                fv = G.get_node_attr(f).get('code')
                if pv is None or fv is None:
                    code = None
                else:
                    code = f'/{pv}/{fv}'
                added_obj = G.add_obj_node(ast_node=caller_ast, js_type=None,
                    value=code)
                G.add_obj_as_prop(prop_name='__proto__', parent_obj=added_obj,
                    tobe_added_obj=G.regexp_prototype)
                returned_objs.append(added_obj)
    return NodeHandleResult(obj_nodes=returned_objs)


def string_replace(G: Graph, caller_ast, extra, strs=NodeHandleResult(),
    substrs=NodeHandleResult(), new_sub_strs=NodeHandleResult()):
    returned_objs = []
    for s in strs.obj_nodes:
        for substr in substrs.obj_nodes:
            for new_sub_str in new_sub_strs.obj_nodes:
                sv = G.get_node_attr(s).get('code')
                ssv = G.get_node_attr(substr).get('code')
                nssv = G.get_node_attr(new_sub_str).get('code')
                if sv is None or ssv is None or nssv is None:
                    added_obj = G.add_obj_node(ast_node=caller_ast, js_type='string')
                    G.add_edge(s, added_obj, {'type:TYPE': 'CONTRIBUTES_TO'})
                    G.add_edge(substr, added_obj, {'type:TYPE': 'CONTRIBUTES_TO'})
                    G.add_edge(new_sub_str, added_obj, {'type:TYPE': 'CONTRIBUTES_TO'})
                else:
                    if G.get_prop_obj_nodes(substr, prop_name='__proto__')[0] == G.regexp_prototype:
                        r, glob, sticky = convert_to_python_re(ssv)
                        if glob:
                            output = r.sub(nssv, sv)
                        else:
                            output = r.subn(nssv, sv, count=1)[0]
                    else:
                        output = sv.replace(ssv, nssv)
                    added_obj = G.add_obj_node(ast_node=caller_ast, js_type='string', value=output)
                    G.add_edge(s, added_obj, {'type:TYPE': 'CONTRIBUTES_TO'})
                    G.add_edge(substr, added_obj, {'type:TYPE': 'CONTRIBUTES_TO'})
                    G.add_edge(new_sub_str, added_obj, {'type:TYPE': 'CONTRIBUTES_TO'})
                returned_objs.append(added_obj)
    return NodeHandleResult(obj_nodes=returned_objs,
        used_objs=list(set(strs.obj_nodes + substrs.obj_nodes + new_sub_strs.obj_nodes
        + strs.used_objs + substrs.used_objs + new_sub_strs.used_objs)))


def string_match(G: Graph, caller_ast, extra, strs=NodeHandleResult(), regexps=None):
    if regexps is None or not regexps.obj_nodes:
        added_array = G.add_obj_node(ast_node=caller_ast, js_type='array')
        G.add_obj_as_prop(ast_node=caller_ast, js_type='string', value='', parent_obj=added_array)
        return NodeHandleResult(obj_nodes=added_array)
    returned_objs = []
    for s in strs.obj_nodes:
        for regexp in regexps.obj_nodes:
            sv = G.get_node_attr(s).get('code')
            rv = G.get_node_attr(regexp).get('code')
            if sv is None or rv is None:
                added_array = G.add_obj_node(ast_node=caller_ast, js_type='array')
                added_obj = G.add_obj_as_prop(ast_node=caller_ast,
                    prop_name='0', js_type='string', parent_obj=added_array)
                G.add_edge(s, added_obj, {'type:TYPE': 'CONTRIBUTES_TO'})
                G.add_edge(regexp, added_obj, {'type:TYPE': 'CONTRIBUTES_TO'})
                G.add_edge(s, added_array, {'type:TYPE': 'CONTRIBUTES_TO'})
                G.add_edge(regexp, added_array, {'type:TYPE': 'CONTRIBUTES_TO'})
            else:
                added_array = G.null_obj
                r, glob, sticky = convert_to_python_re(rv)
                if glob:
                    result = r.findall(sv)
                    if result:
                        added_array = G.add_obj_node(ast_node=caller_ast, js_type='array')
                        for i, u in result:
                            added_obj = G.add_obj_as_prop(ast_node=caller_ast, prop_name=i,
                                js_type='string', value=u, parent_obj=added_array)
                            G.add_edge(s, added_obj, {'type:TYPE': 'CONTRIBUTES_TO'})
                            G.add_edge(regexp, added_obj, {'type:TYPE': 'CONTRIBUTES_TO'})
                        G.add_edge(s, added_array, {'type:TYPE': 'CONTRIBUTES_TO'})
                        G.add_edge(regexp, added_array, {'type:TYPE': 'CONTRIBUTES_TO'})
                else:
                    match = re.compile('a').search(sv)
                    if match:
                        added_array = G.add_obj_node(ast_node=caller_ast, js_type='array')
                        for i, u in match[0] + match.groups():
                            added_obj = G.add_obj_as_prop(ast_node=caller_ast, prop_name=i,
                                js_type='string', value=u, parent_obj=added_array)
                            G.add_edge(s, added_obj, {'type:TYPE': 'CONTRIBUTES_TO'})
                            G.add_edge(regexp, added_obj, {'type:TYPE': 'CONTRIBUTES_TO'})
                        G.add_obj_as_prop(ast_node=caller_ast, prop_name='index',
                            js_type='number', value=match.start(), parent_obj=added_array)
                        G.add_obj_as_prop(ast_node=caller_ast, prop_name='input',
                            js_type='string', value=sv, parent_obj=added_array)
                        # TODO: groups
                        G.add_obj_as_prop(ast_node=caller_ast, prop_name='groups',
                            parent_obj=added_array, tobe_added_obj=G.undefined_obj)
                        G.add_edge(s, added_array, {'type:TYPE': 'CONTRIBUTES_TO'})
                        G.add_edge(regexp, added_array, {'type:TYPE': 'CONTRIBUTES_TO'})
            returned_objs.append(added_array)
    return NodeHandleResult(obj_nodes=returned_objs,
        used_objs=list(set(strs.obj_nodes + strs.used_objs + regexps.obj_nodes + regexps.used_objs)))


def string_split(G: Graph, caller_ast, extra, strs, separators):
    pass



def split_regexp(code) -> [str, str]:
    if code is None:
        return None, None
    match = re.match(r'^/(.*)/(\w*)$', code)
    if match:
        return match.groups()
    else:
        return None, None


def convert_to_python_re(code) -> [re.Pattern, bool, bool]:
    pattern, flags = split_regexp(code)
    glob, sticky = False, False
    if pattern is not None:
        f = 0
        if flags:
            # ignore these errors if your editor shows
            if 'g' in flags:
                glob = True
            if 'i' in flags:
                f |= re.IGNORECASE
            if 'm' in flags:
                f |= re.MULTILINE
            if 's' in flags:
                f |= re.DOTALL
            if 'u' in flags:
                f |= re.UNICODE
            if 'y' in flags:
                sticky = True
        return re.compile(pattern, f), glob, sticky
    else:
        return None, None, None
