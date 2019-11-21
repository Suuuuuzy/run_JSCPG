from .graph import Graph
from .utilities import NodeHandleResult, BranchTag, BranchTagContainer, ExtraInfo
from . import objectGraphGenerator
from .helpers import to_values, to_obj_nodes, val_to_str, is_int
from .helpers import convert_prop_names_to_wildcard
from .helpers import copy_objs_for_branch, copy_objs_for_parameters
from .helpers import to_python_array, to_og_array, add_contributes_to
import sty
import re
from .logger import *
from itertools import chain, product


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
    G.add_blank_func_as_prop('replace', string_prototype, string_p_replace)
    G.add_blank_func_as_prop('search', string_prototype, string_p_match)
    G.add_blank_func_as_prop('split', string_prototype, string_p_split)
    G.add_blank_func_as_prop('substr', string_prototype, string_p_substr)
    G.add_blank_func_as_prop('substring', string_prototype, string_p_substring)
    G.add_blank_func_as_prop('reverse', string_prototype, string_p_reverse)
    G.add_blank_func_as_prop('toLowerCase', string_prototype, string_p_to_lower_case)
    G.add_blank_func_as_prop('toUpperCase', string_prototype, string_p_to_upper_case)
    G.add_blank_func_as_prop('trim', string_prototype, string_p_trim)
    G.add_blank_func_as_prop('trimEnd', string_prototype, string_p_trim_end)
    G.add_blank_func_as_prop('trimStart', string_prototype, string_p_trim_start)
    G.add_blank_func_as_prop('charAt', string_prototype, string_p_char_at)


def setup_number(G: Graph):
    number_cons = G.add_blank_func_to_scope('Number', scope=G.BASE_SCOPE, python_func=this_returning_func)
    number_prototype = G.get_prop_obj_nodes(prop_name='prototype', parent_obj=number_cons)[0]
    G.number_prototype = number_prototype
    # Number.prototype.__proto__ = Object.prototype
    G.add_obj_as_prop(prop_name='__proto__', parent_obj=number_prototype, tobe_added_obj=G.object_prototype)


def setup_array(G: Graph):
    array_cons = G.add_blank_func_to_scope('Array', scope=G.BASE_SCOPE) # TODO: implement this
    array_prototype = G.get_prop_obj_nodes(prop_name='prototype', parent_obj=array_cons)[0]
    G.array_prototype = array_prototype
    # Array.prototype.__proto__ = Object.prototype
    G.add_obj_as_prop(prop_name='__proto__', parent_obj=array_prototype, tobe_added_obj=G.object_prototype)
    # built-in functions
    G.add_blank_func_as_prop('push', array_prototype, array_p_push)
    G.add_blank_func_as_prop('pop', array_prototype, array_p_pop)
    G.add_blank_func_as_prop('unshift', array_prototype, array_p_push)
    G.add_blank_func_as_prop('shift', array_prototype, array_p_pop)
    G.add_blank_func_as_prop('join', array_prototype, array_p_join)
    G.add_blank_func_as_prop('forEach', array_prototype, array_p_for_each_value)
    G.add_blank_func_as_prop('keys', array_prototype, array_p_keys)
    G.add_blank_func_as_prop('values', array_prototype, array_p_values)
    G.add_blank_func_as_prop('entries', array_prototype, array_p_entries)
    G.add_blank_func_as_prop('splice', array_prototype, array_p_splice)
    G.add_blank_func_as_prop('slice', array_prototype, array_p_slice)
    G.add_blank_func_as_prop('filter', array_prototype, this_returning_func)


def setup_boolean(G: Graph):
    boolean_cons = G.add_blank_func_to_scope('Boolean', scope=G.BASE_SCOPE, python_func=this_returning_func)
    boolean_prototype = G.get_prop_obj_nodes(prop_name='prototype', parent_obj=boolean_cons)[0]
    G.boolean_prototype = boolean_prototype
    # Boolean.prototype.__proto__ = Object.prototype
    G.add_obj_as_prop(prop_name='__proto__', parent_obj=boolean_prototype, tobe_added_obj=G.object_prototype)


def setup_symbol(G: Graph):
    symbol_cons = G.add_blank_func_to_scope('Symbol', scope=G.BASE_SCOPE, python_func=this_returning_func)
    symbol_prototype = G.get_prop_obj_nodes(prop_name='prototype', parent_obj=symbol_cons)[0]
    # Symbol.prototype.__proto__ = Object.prototype
    G.add_obj_as_prop(prop_name='__proto__', parent_obj=symbol_prototype, tobe_added_obj=G.object_prototype)


def setup_errors(G: Graph):
    error_cons = G.add_blank_func_to_scope('Error', scope=G.BASE_SCOPE, python_func=this_returning_func)
    # Error.prototype.__proto__ = Object.prototype
    error_prototype = G.get_prop_obj_nodes(prop_name='prototype', parent_obj=error_cons)[0]
    G.add_obj_as_prop(prop_name='__proto__', parent_obj=error_prototype, tobe_added_obj=G.object_prototype)
    for i in ['EvalError', 'InternalError', 'RangeError', 'ReferenceError', 'SyntaxError', 'TypeError', 'URIError']:
        # EvalError.prototype.__proto__ = Error
        cons = G.add_blank_func_to_scope(i, scope=G.BASE_SCOPE)
        prototype = G.get_prop_obj_nodes(prop_name='prototype', parent_obj=cons)[0]
        G.add_obj_as_prop(prop_name='__proto__', parent_obj=prototype, tobe_added_obj=error_prototype)


def setup_object_and_function(G: Graph):
    # add Object (function)
    object_cons = G.add_blank_func_to_scope('Object', scope=G.BASE_SCOPE, python_func=this_returning_func)
    # get Object.prototype
    object_prototype = G.get_prop_obj_nodes(prop_name='prototype', parent_obj=object_cons)[0]
    G.set_node_attr(object_prototype, ('code', 'Object.prototype'))
    # add Object.prototype.__proto__
    G.add_obj_as_prop(prop_name='__proto__', parent_obj=object_prototype, tobe_added_obj=G.null_obj)
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
    G.add_obj_as_prop(prop_name='__proto__', parent_obj=object_cons, tobe_added_obj=function_prototype)
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


def array_p_for_each(G: Graph, caller_ast, extra, array=NodeHandleResult(), callback=NodeHandleResult(), this=None):
    for arr in array.obj_nodes:
        for name_node in G.get_prop_name_nodes(arr):
            name = G.get_node_attr(name_node).get('name')
            if not is_int(name):
                continue
            obj_nodes = G.get_obj_nodes(name_node, branches=extra.branches)
            if str(name).startswith('Obj#'):
                name_obj_node = name[4:]
            else:
                name_obj_node = G.add_obj_node(ast_node=caller_ast,
                    js_type='number', value=float(name))
            obj_nodes_log = ', '.join([f'{sty.fg.green}{obj}{sty.rs.all}: {G.get_node_attr(obj).get("code")}' for obj in obj_nodes])
            logger.debug(f'Array forEach callback arguments: index={name} ({sty.fg.green}{name_obj_node}{sty.rs.all}), obj_nodes={obj_nodes_log}, array={arr}')
            objectGraphGenerator.call_function(G, callback.obj_nodes,
                args=[NodeHandleResult(name_nodes=[name_node], name=name,
                        obj_nodes=obj_nodes),
                    NodeHandleResult(obj_nodes=[name_obj_node]),
                    NodeHandleResult(name=array.name, obj_nodes=[arr])],
                this=this, extra=extra, caller_ast=caller_ast)
    return NodeHandleResult(obj_nodes=[G.undefined_obj])


def array_p_for_each_value(G: Graph, caller_ast, extra, array=NodeHandleResult(), callback=NodeHandleResult(), this=None):
    for arr in array.obj_nodes:
        name_nodes=G.get_prop_name_nodes(arr)
        for name_node in G.get_prop_name_nodes(arr):
            name = G.get_node_attr(name_node).get('name')
            if not is_int(name):
                continue
            obj_nodes = G.get_obj_nodes(name_node, branches=extra.branches)
            if str(name).startswith('Obj#'):
                name_obj_node = name[4:]
                index_arg = NodeHandleResult(obj_nodes=[name_obj_node])
            else:
                index_arg = NodeHandleResult(values=[float(name)])
            obj_nodes_log = ', '.join([f'{sty.fg.green}{obj}{sty.rs.all}: {G.get_node_attr(obj).get("code")}' for obj in obj_nodes])
            logger.debug(f'Array forEach callback arguments: index={name}, obj_nodes={obj_nodes_log}, array={arr}')
            objectGraphGenerator.call_function(G, callback.obj_nodes,
                args=[NodeHandleResult(name_nodes=[name_node], name=name,
                    obj_nodes=obj_nodes), index_arg, 
                    NodeHandleResult(name=array.name, obj_nodes=[arr])],
                this=this, extra=extra, caller_ast=caller_ast)
    return NodeHandleResult(obj_nodes=[G.undefined_obj])


def array_p_for_each_static(G: Graph, caller_ast, extra, array: NodeHandleResult, callback=NodeHandleResult(), this=NodeHandleResult()):
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


def array_p_for_each_static_new(G: Graph, caller_ast, extra, array: NodeHandleResult, callback=NodeHandleResult(), this=NodeHandleResult()):
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


def array_p_push(G: Graph, caller_ast, extra, arrays: NodeHandleResult, *tobe_added_objs: NodeHandleResult):
    used_objs = set()
    if extra.branches.get_last_choice_tag():
        logger.debug('Copy arrays {} for branch {}, name nodes {}'.format(arrays.obj_nodes, extra.branches.get_last_choice_tag(), arrays.name_nodes))
        arrays = copy_objs_for_branch(G, arrays,
            branch=extra.branches.get_last_choice_tag(), ast_node=caller_ast)
    for arr in arrays.obj_nodes:
        length_objs = G.get_prop_obj_nodes(parent_obj=arr, prop_name='length', branches=extra.branches)
        if len(length_objs) == 0:
            logger.warning('Array {} has no length object nodes'.format(arr))
            length = None
        else:
            if len(length_objs) != 1:
                logger.warning('Array {} has {} length object nodes'.format(arr, len(length_objs)))
            length = G.get_node_attr(length_objs[0]).get('code')
        if length is not None:
            try:
                length = int(length)
                for i, objs in enumerate(tobe_added_objs):
                    obj_nodes = to_obj_nodes(G, objs, caller_ast)
                    used_objs.update(obj_nodes)
                    for obj in obj_nodes:
                        G.add_obj_as_prop(prop_name=str(length+i), parent_obj=arr, tobe_added_obj=obj)
                G.set_node_attr(length_objs[0], ('code', length + len(tobe_added_objs)))
            except ValueError:
                logger.error('Array {} length error'.format(arr))
        else:
            convert_prop_names_to_wildcard(G, arr, exclude_length=True) # convert indices to wildcard
            for i, objs in enumerate(tobe_added_objs):
                obj_nodes = to_obj_nodes(G, objs, caller_ast)
                used_objs.update(obj_nodes)
                for obj in obj_nodes:
                    G.add_obj_as_prop(prop_name='*', parent_obj=arr, tobe_added_obj=obj)
    return NodeHandleResult(used_objs=list(used_objs))


def array_p_pop(G: Graph, caller_ast, extra, arrays: NodeHandleResult):
    returned_objs = set()
    if extra.branches:
        logger.debug('Copy arrays {} for branch {}, name nodes {}'.format(arrays.obj_nodes, extra.branches.get_last_choice_tag(), arrays.name_nodes))
        arrays = copy_objs_for_branch(G, arrays,
            branch=extra.branches.get_last_choice_tag(), ast_node=caller_ast)
    for arr in arrays.obj_nodes:
        length_objs = G.get_prop_obj_nodes(parent_obj=arr, prop_name='length', branches=extra.branches)
        if len(length_objs) == 0:
            logger.warning('Array {} has no length object nodes'.format(arr))
            length = None
        else:
            if len(length_objs) != 1:
                logger.warning('Array {} has {} length object nodes'.format(arr, len(length_objs)))
            length = G.get_node_attr(length_objs[0]).get('code')
        if length is not None:
            try:
                length = int(length)
                returned_objs.update(G.get_prop_obj_nodes(parent_obj=arr, prop_name=str(length-1), branches=extra.branches))
                name_node = G.get_prop_name_node(prop_name=str(length-1), parent_obj=arr)
                G.remove_all_edges_between(arr, name_node)
                G.set_node_attr(length_objs[0], ('code', length - 1))
            except ValueError:
                logger.error('Array {} length error'.format(arr))
        else:
            returned_objs.update(G.get_prop_obj_nodes(parent_obj=arr, branches=extra.branches, numeric_only=True))
    return NodeHandleResult(obj_nodes=list(returned_objs))


def array_p_splice(G: Graph, caller_ast, extra, arrays: NodeHandleResult, starts: NodeHandleResult, delete_counts=NodeHandleResult(values=[None]), *items: NodeHandleResult):
    used_objs = set()
    start_values, start_sources, _ = to_values(G, starts)
    dc_values, dc_sources, _ = to_values(G, delete_counts)
    returned_arrays = []
    for arr in arrays.obj_nodes:
        copies = []
        delete = True
        for i, start in enumerate(start_values):
            for j, dc in enumerate(dc_values):
                if start is not None:
                    try:
                        start = int(start)
                        dc = int(dc) if dc is not None else None
                        elements, data = to_python_array(G, arr)
                        left_part_e = elements[:start]
                        left_part_d = data[:start]
                        if dc is not None:
                            returned_part_e = elements[start:start+dc]
                            returned_part_d = data[start:start+dc]
                            right_part_e = elements[start+dc:]
                            right_part_d = data[start+dc:]
                        else:
                            returned_part_e = elements[start:]
                            returned_part_d = data[start:]
                            right_part_e = []
                            right_part_d = []
                        inserted_part_e = []
                        inserted_part_d = []
                        for item in items:
                            item_obj_nodes = to_obj_nodes(G, item, caller_ast)
                            inserted_part_e.append(item_obj_nodes)
                            l = len(item_obj_nodes)
                            inserted_part_d.append([
                                {'branch': BranchTagContainer(extra.branches)
                                .get_last_choice_tag()}] * l)
                            used_objs.update(item_obj_nodes)
                        new_arr = to_og_array(G,
                            left_part_e + inserted_part_e + right_part_e,
                            left_part_d + inserted_part_d + right_part_d,
                            caller_ast)
                        returned_arr = to_og_array(G, returned_part_e,
                            returned_part_d, caller_ast)
                        for s in start_sources[i]:
                            add_contributes_to(G, [s], new_arr)
                            add_contributes_to(G, [s], returned_arr)
                        for s in dc_sources[j]:
                            add_contributes_to(G, [s], new_arr)
                            add_contributes_to(G, [s], returned_arr)
                        for item in items:
                            item_obj_nodes = to_obj_nodes(G, item, caller_ast)
                            # for obj in item_obj_nodes:
                            #     add_contributes_to(G, [obj], new_arr)
                            used_objs.update(item_obj_nodes)
                        add_contributes_to(G, [arr], new_arr)
                        add_contributes_to(G, [arr], returned_arr)
                        copies.append(new_arr)
                        returned_arrays.append(returned_arr)
                    except ValueError:
                        start = None
                        dc = None
                if start is None:
                    returned_arr = G.add_obj_node(ast_node=caller_ast, js_type='array')
                    add_contributes_to(G, [arr], returned_arr)
                    for obj in G.get_prop_obj_nodes(arr, numeric_only=True):
                        G.add_obj_as_prop(prop_name='*', parent_obj=returned_arr,
                            tobe_added_obj=obj)
                    if items:
                        new_arr = G.copy_obj(arr, caller_ast)
                        convert_prop_names_to_wildcard(G, new_arr, exclude_length=True)
                        add_contributes_to(G, [arr], new_arr)
                        for item in items:
                            for obj in item.obj_nodes:
                                G.add_obj_as_prop(prop_name='*',
                                    parent_obj=new_arr, tobe_added_obj=obj)
                        copies.append(new_arr)
                    else:
                        delete = False
        for e in G.get_in_edges(arr, edge_type='NAME_TO_OBJ'):
            name_node, _, k, data = e
            if name_node in arrays.name_nodes:
                if delete and copies:
                    G.graph.remove_edge(name_node, arr, k)
                for obj in copies:
                    G.add_edge(name_node, obj, data)
    used_objs.update(arrays.obj_nodes + list(filter(lambda x: x is not None,
        chain(*start_sources, *dc_sources))))
    return NodeHandleResult(obj_nodes=returned_arrays, used_objs=list(used_objs))


def array_p_slice(G: Graph, caller_ast, extra, arrays: NodeHandleResult, starts=NodeHandleResult(values=[None]), ends=NodeHandleResult(values=[None])):
    start_values, start_sources, _ = to_values(G, starts)
    end_values, end_sources, _ = to_values(G, ends)
    returned_arrays = []
    used_objs = set()
    for arr in arrays.obj_nodes:
        for i, start in enumerate(start_values):
            for j, end in enumerate(end_values):
                if start is not None:
                    try:
                        start = int(start)
                        end = int(end) if end is not None else None
                        a, d = to_python_array(G, arr)
                        a = a[start:end]
                        d = d[start:end]
                        return_arr = to_og_array(G, a, d, caller_ast)
                    except ValueError:
                        start = None
                if start is None:
                    return_arr = G.copy_obj(arr, caller_ast)
                for s in start_sources[i]:
                    add_contributes_to(G, [s], return_arr)
                for s in end_sources[j]:
                    add_contributes_to(G, [s], return_arr)
                add_contributes_to(G, [arr], return_arr)
                returned_arrays.append(return_arr)
    used_objs.update(chain(*start_sources, *end_sources, arrays.obj_nodes))
    return NodeHandleResult(obj_nodes=returned_arrays, used_objs=list(used_objs))


def array_p_join(G: Graph, caller_ast, extra, arrays: NodeHandleResult, seps=NodeHandleResult(values=[','])):
    returned_objs = []
    used_objs = set()
    sep_values, sep_sources, _ = to_values(G, seps)
    for arr in arrays.obj_nodes:
        for i, sep in enumerate(sep_values):
            if sep is None:
                sep = ','
            a = to_python_array(G, arr, value=True)[0]
            if None in chain(*a):
                # if any element's value in the array is unknown
                # the result is set to unknown
                # this is to prevent explosion of the number of different
                # values in the results
                s = None
            else:
                s = sep.join(['/'.join(elem) for elem in a])
            new_literal = G.add_obj_node(caller_ast, 'string', value=s)
            returned_objs.append(new_literal)
            elem_objs = G.get_prop_obj_nodes(arr, branches=extra.branches,
                numeric_only=True)
            for obj in elem_objs:
                add_contributes_to(G, [obj], new_literal)
            for s in sep_sources[i]:
                add_contributes_to(G, [s], new_literal)
            add_contributes_to(G, [arr], new_literal)
            used_objs.update(elem_objs)
            used_objs.update(sep_sources[i])
            used_objs.add(arr)
    return NodeHandleResult(obj_nodes=returned_objs, used_objs=list(used_objs))


def object_keys(G: Graph, caller_ast, extra, _, arg: NodeHandleResult, for_array=False):
    returned_objs = []
    for obj in arg.obj_nodes:
        arr = G.add_obj_node(None, 'array')
        for i, name_node in enumerate(G.get_prop_name_nodes(obj)):
            name = G.get_node_attr(name_node).get('name')
            if name is None or name == '__proto__':
                continue
            if for_array and not (name.isdigit() or name == '*'):
                continue # Array only returns numeric keys/corresponding values
            string = G.add_obj_node(None, 'string', str(name))
            G.add_obj_as_prop(str(i), parent_obj=arr, tobe_added_obj=string)
        returned_objs.append(arr)
    return NodeHandleResult(obj_nodes=returned_objs)


def object_values(G: Graph, caller_ast, extra, _, arg: NodeHandleResult, for_array=False):
    returned_objs = []
    for obj in arg.obj_nodes:
        arr = G.add_obj_node(None, 'array')
        for i, name_node in enumerate(G.get_prop_name_nodes(obj)):
            name = G.get_node_attr(name_node).get('name')
            if name is None or name == '__proto__':
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


def array_p_keys(G: Graph, caller_ast, extra, this: NodeHandleResult, for_array=False):
    return object_keys(G, caller_ast, extra, this, True)


def array_p_values(G: Graph, caller_ast, extra, this: NodeHandleResult, for_array=False):
    return object_values(G, caller_ast, extra, this, True)


def array_p_entries(G: Graph, caller_ast, extra, this: NodeHandleResult, for_array=False):
    return object_entries(G, caller_ast, extra, this, True)


def object_to_string(G: Graph, caller_ast, extra, this: NodeHandleResult, 
        *args):
    returned_objs = []
    for obj in this.obj_nodes:
        value = G.get_node_attr(obj).get('code')
        string = G.add_obj_node(caller_ast, 'string', value)
        add_contributes_to(G, [obj], string)
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
    returned_objs, _, used_objs = objectGraphGenerator.call_function(
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
        add_contributes_to(G, [obj], new_literal)
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
        # used_objs.update(arg.used_objs)
        for obj in arg.obj_nodes:
            add_contributes_to(G, [obj], returned_string)
    return NodeHandleResult(obj_nodes=[returned_string], used_objs=list(used_objs))


def boolean_returning_func(G: Graph, caller_ast, extra, _, *args):
    used_objs = set()
    for arg in args:
        used_objs.update(arg.obj_nodes)
        # used_objs.update(arg.used_objs)
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
        # used_objs.update(arg.used_objs)
        values = list(map(str, arg.values))
        for obj in arg.obj_nodes:
            if G.get_node_attr(obj).get('type') == 'array':
                value = to_python_array(G, obj, value=True)[0]
            else:
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
            obj = G.add_obj_node(ast_node=caller_ast, js_type=None, value='*')
        for s in sources[i]:
            add_contributes_to(G, [s], obj)
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


def string_p_replace(G: Graph, caller_ast, extra, strs=NodeHandleResult(),
    substrs=NodeHandleResult(), new_sub_strs=NodeHandleResult()):
    returned_objs = []
    unknown_return_obj = None
    for s in to_obj_nodes(G, strs, caller_ast):
        for substr in to_obj_nodes(G, substrs, caller_ast):
            for new_sub_str in to_obj_nodes(G, new_sub_strs, caller_ast):
                sv = G.get_node_attr(s).get('code')
                ssv = G.get_node_attr(substr).get('code')
                if G.get_node_attr(new_sub_str).get('type') == 'function':
                    callback = new_sub_str
                    if sv is None or ssv is None:
                        if unknown_return_obj is None:
                            unknown_return_obj = G.add_obj_node(ast_node=caller_ast, js_type='string')
                        added_obj = unknown_return_obj
                        add_contributes_to(G, [s], unknown_return_obj)
                        add_contributes_to(G, [substr], unknown_return_obj)
                        add_contributes_to(G, [new_sub_str], unknown_return_obj)
                    elif G.get_prop_obj_nodes(substr, prop_name='__proto__')[0] == G.regexp_prototype:
                        r, glob, sticky = convert_to_python_re(ssv)
                        none_flag = False
                        def python_cb(m):
                            nonlocal none_flag
                            cb_returned_objs, _, _ = \
                                objectGraphGenerator.call_function(G, [callback],
                                args=[NodeHandleResult(values=[m.group(0)])],
                                extra=extra, caller_ast=caller_ast)
                            cb_returned_values, _, _ = \
                                to_values(G, NodeHandleResult(obj_nodes=cb_returned_objs))
                            cb_returned_values = \
                                list(filter(lambda x: x is not None, cb_returned_values))
                            # multiple possibility is ignored here
                            if len(cb_returned_values) > 1:
                                logger.warning(f'Replace result has multiple possibilities: {cb_returned_values}')
                            elif len(cb_returned_values) == 0:
                                none_flag = True
                                return None
                            return cb_returned_values[0]
                        if glob:
                            output = r.sub(python_cb, sv)
                        else:
                            output, _ = r.subn(python_cb, sv, count=1)
                        if none_flag:
                            output = None
                        logger.debug('string replace {} in {} -> {}'.format(ssv, sv, output))
                        added_obj = G.add_obj_node(ast_node=caller_ast, js_type='string', value=output)
                        add_contributes_to(G, [s], added_obj)
                        add_contributes_to(G, [substr], added_obj)
                        add_contributes_to(G, [new_sub_str], added_obj)
                        returned_objs.append(added_obj)
                    else:
                        returned_values = []
                        start = sv.find(ssv)
                        if start == -1:
                            break
                        match_s = sv[start:start+len(ssv)]
                        left_s = sv[:start]
                        right_s = sv[start+len(ssv):]
                        cb_returned_objs, _, _ = \
                            objectGraphGenerator.call_function(G, [callback],
                            args=[NodeHandleResult(values=[match_s])],
                            extra=extra, caller_ast=caller_ast)
                        cb_returned_values, _, _ = \
                            to_values(G, NodeHandleResult(obj_nodes=cb_returned_objs))
                        for s1 in cb_returned_values:
                            returned_values.append(left_s + s1 + right_s)
                            # the part on the left of the match + substituted matched part + the part on the right of the match
                        for s2 in returned_values:
                            logger.debug('string replace {} in {} -> {}'.format(ssv, sv, s2))
                            added_obj = G.add_obj_node(ast_node=caller_ast, js_type='string', value=s2)
                            add_contributes_to(G, [s], added_obj)
                            add_contributes_to(G, [substr], added_obj)
                            add_contributes_to(G, [new_sub_str], added_obj)
                            returned_objs.append(added_obj)
                else:
                    nssv = G.get_node_attr(new_sub_str).get('code')
                    if sv is None or ssv is None or nssv is None:
                        if unknown_return_obj is None:
                            unknown_return_obj = G.add_obj_node(ast_node=caller_ast, js_type='string')
                        added_obj = unknown_return_obj
                        add_contributes_to(G, [s], unknown_return_obj)
                        add_contributes_to(G, [substr], unknown_return_obj)
                        add_contributes_to(G, [new_sub_str], unknown_return_obj)
                    else:
                        if G.get_prop_obj_nodes(substr, prop_name='__proto__')[0] == G.regexp_prototype:
                            r, glob, sticky = convert_to_python_re(ssv)
                            if glob:
                                output = r.sub(nssv, sv)
                            else:
                                output, _ = r.subn(nssv, sv, count=1)
                        else:
                            output = sv.replace(ssv, nssv)
                        logger.debug('string replace {} in {} -> {}'.format(ssv, sv, output))
                        added_obj = G.add_obj_node(ast_node=caller_ast, js_type='string', value=output)
                        add_contributes_to(G, [s], added_obj)
                        add_contributes_to(G, [substr], added_obj)
                        add_contributes_to(G, [new_sub_str], added_obj)
                    returned_objs.append(added_obj)
    return NodeHandleResult(obj_nodes=returned_objs,
        used_objs=list(set(strs.obj_nodes + substrs.obj_nodes + new_sub_strs.obj_nodes
        + strs.used_objs + substrs.used_objs + new_sub_strs.used_objs)))



def string_p_replace_value(G: Graph, caller_ast, extra, strs=NodeHandleResult(),
    substrs=NodeHandleResult(), new_sub_strs=NodeHandleResult()):
    returned_objs = []
    unknown_return_obj = None # we only add one unknown object
    for sv, str_sources, _ in zip(to_values(G, strs)):
        for substr in to_obj_nodes(G, substrs, caller_ast):
            for new_sub_str in to_obj_nodes(G, new_sub_strs, caller_ast):
                ssv = G.get_node_attr(substr).get('code')
                if G.get_node_attr(new_sub_str).get('type') == 'function':
                    callback = new_sub_str
                    if sv is None or ssv is None:
                        if unknown_return_obj is None:
                            unknown_return_obj = G.add_obj_node(ast_node=caller_ast, js_type='string')
                        added_obj = unknown_return_obj
                        add_contributes_to(G, str_sources, added_obj)
                        add_contributes_to(G, [substr], added_obj)
                        add_contributes_to(G, [new_sub_str], added_obj)
                    elif G.get_prop_obj_nodes(substr, prop_name='__proto__')[0] == G.regexp_prototype:
                        r, glob, sticky = convert_to_python_re(ssv)
                        none_flag = False
                        def python_cb(m):
                            nonlocal none_flag
                            cb_returned_objs, _, _ = \
                                objectGraphGenerator.call_function(G, [callback],
                                args=[NodeHandleResult(values=[m.group(0)])],
                                extra=extra, caller_ast=caller_ast)
                            cb_returned_values, _, _ = \
                                to_values(G, NodeHandleResult(obj_nodes=cb_returned_objs))
                            cb_returned_values = \
                                list(filter(lambda x: x is not None, cb_returned_values))
                            # multiple possibility is ignored here
                            if len(cb_returned_values) > 1:
                                logger.warning(f'Replace result has multiple possibilities: {cb_returned_values}')
                            elif len(cb_returned_values) == 0:
                                none_flag = True
                                return None
                            return cb_returned_values[0]
                        if glob:
                            output = r.sub(python_cb, sv)
                        else:
                            output, _ = r.subn(python_cb, sv, count=1)
                        if none_flag:
                            output = None
                        logger.debug('string replace {} in {} -> {}'.format(ssv, sv, output))
                        added_obj = G.add_obj_node(ast_node=caller_ast, js_type='string', value=output)
                        add_contributes_to(G, str_sources, added_obj)
                        add_contributes_to(G, [substr], added_obj)
                        add_contributes_to(G, [new_sub_str], added_obj)
                        returned_objs.append(added_obj)
                    else:
                        returned_values = []
                        start = sv.find(ssv)
                        if start == -1:
                            break
                        match_s = sv[start:start+len(ssv)]
                        left_s = sv[:start]
                        right_s = sv[start+len(ssv):]
                        cb_returned_objs, _, _ = \
                            objectGraphGenerator.call_function(G, [callback],
                            args=[NodeHandleResult(values=[match_s])],
                            extra=extra, caller_ast=caller_ast)
                        cb_returned_values, _, _ = \
                            to_values(G, NodeHandleResult(obj_nodes=cb_returned_objs))
                        for s1 in cb_returned_values:
                            returned_values.append(left_s + s1 + right_s)
                            # the part on the left of the match + substituted matched part + the part on the right of the match
                        for s2 in returned_values:
                            logger.debug('string replace {} in {} -> {}'.format(ssv, sv, s2))
                            added_obj = G.add_obj_node(ast_node=caller_ast, js_type='string', value=s2)
                            add_contributes_to(G, str_sources, added_obj)
                            add_contributes_to(G, [substr], added_obj)
                            add_contributes_to(G, [new_sub_str], added_obj)
                            returned_objs.append(added_obj)
                else:
                    nssv = G.get_node_attr(new_sub_str).get('code')
                    if sv is None or ssv is None or nssv is None:
                        if unknown_return_obj is None:
                            unknown_return_obj = G.add_obj_node(ast_node=caller_ast, js_type='string')
                        added_obj = unknown_return_obj
                        add_contributes_to(G, str_sources, added_obj)
                        add_contributes_to(G, [substr], added_obj)
                        add_contributes_to(G, [new_sub_str], added_obj)
                    else:
                        if G.get_prop_obj_nodes(substr, prop_name='__proto__')[0] == G.regexp_prototype:
                            r, glob, sticky = convert_to_python_re(ssv)
                            if glob:
                                output = r.sub(nssv, sv)
                            else:
                                output, _ = r.subn(nssv, sv, count=1)
                        else:
                            output = sv.replace(ssv, nssv)
                        logger.debug('string replace {} in {} -> {}'.format(ssv, sv, output))
                        added_obj = G.add_obj_node(ast_node=caller_ast, js_type='string', value=output)
                        add_contributes_to(G, str_sources, added_obj)
                        add_contributes_to(G, [substr], added_obj)
                        add_contributes_to(G, [new_sub_str], added_obj)
                    returned_objs.append(added_obj)
    return NodeHandleResult(obj_nodes=returned_objs,
        used_objs=list(set(strs.obj_nodes + substrs.obj_nodes + new_sub_strs.obj_nodes
        + strs.used_objs + substrs.used_objs + new_sub_strs.used_objs)))


def string_p_match(G: Graph, caller_ast, extra, strs=NodeHandleResult(), regexps=None):
    if regexps is None or not regexps.obj_nodes:
        added_array = G.add_obj_node(ast_node=caller_ast, js_type='array')
        G.add_obj_as_prop(ast_node=caller_ast, js_type='string', value='', parent_obj=added_array)
        return NodeHandleResult(obj_nodes=added_array)
    returned_objs = []
    for s in to_obj_nodes(G, strs, caller_ast):
        for regexp in to_obj_nodes(G, regexps, caller_ast):
            sv = G.get_node_attr(s).get('code')
            rv = G.get_node_attr(regexp).get('code')
            if sv is None or rv is None:
                added_array = G.add_obj_node(ast_node=caller_ast, js_type='array')
                added_obj = G.add_obj_as_prop(ast_node=caller_ast,
                    prop_name='0', js_type='string', parent_obj=added_array)
                add_contributes_to(G, [s], added_obj)
                add_contributes_to(G, [regexp], added_obj)
                add_contributes_to(G, [s], added_array)
                add_contributes_to(G, [regexp], added_array)
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
                            add_contributes_to(G, [s], added_obj)
                            add_contributes_to(G, [regexp], added_obj)
                        add_contributes_to(G, [s], added_array)
                        add_contributes_to(G, [regexp], added_array)
                else:
                    match = re.compile(r).search(sv)
                    if match:
                        added_array = G.add_obj_node(ast_node=caller_ast, js_type='array')
                        for i, u in [match[0]] + match.groups():
                            added_obj = G.add_obj_as_prop(ast_node=caller_ast, prop_name=i,
                                js_type='string', value=u, parent_obj=added_array)
                            add_contributes_to(G, [s], added_obj)
                            add_contributes_to(G, [regexp], added_obj)
                        G.add_obj_as_prop(ast_node=caller_ast, prop_name='index',
                            js_type='number', value=match.start(), parent_obj=added_array)
                        G.add_obj_as_prop(ast_node=caller_ast, prop_name='input',
                            js_type='string', value=sv, parent_obj=added_array)
                        # TODO: groups
                        G.add_obj_as_prop(ast_node=caller_ast, prop_name='groups',
                            parent_obj=added_array, tobe_added_obj=G.undefined_obj)
                        add_contributes_to(G, [s], added_array)
                        add_contributes_to(G, [regexp], added_array)
            returned_objs.append(added_array)
    return NodeHandleResult(obj_nodes=returned_objs,
        used_objs=list(set(strs.obj_nodes + strs.used_objs + regexps.obj_nodes + regexps.used_objs)))


def string_p_split(G: Graph, caller_ast, extra, strs, separators):
    values, s1, _ = to_values(G, strs, caller_ast)
    sep, s2, _ = to_values(G, separators, caller_ast)
    returned_objs = []
    used_objs = set()
    for i, s in enumerate(values):
        for j, p in enumerate(sep):
            arr = G.add_obj_node(ast_node=caller_ast, js_type='array')
            if s is None or p is None:
                v = G.add_obj_as_prop(prop_name='*', ast_node=caller_ast,
                    js_type='string', value=None, parent_obj=arr)
                for ss in s1[i]:
                    add_contributes_to(G, [ss], v)
                    add_contributes_to(G, [ss], arr)
                for ss in s2[j]:
                    add_contributes_to(G, [ss], v)
                    add_contributes_to(G, [ss], arr)
            else:
                logger.debug('string split {} -> {}'.format(s, s.split(p)))
                for k, d in enumerate(s.split(p)):
                    v = G.add_obj_as_prop(prop_name=str(k), value=d,
                        ast_node=caller_ast, js_type='string', parent_obj=arr)
                    for ss in s1[i]:
                        add_contributes_to(G, [ss], v)
                        add_contributes_to(G, [ss], arr)
                    for ss in s2[j]:
                        add_contributes_to(G, [ss], v)
                        add_contributes_to(G, [ss], arr)
            returned_objs.append(arr)
            used_objs.update(s1[i])
            used_objs.update(s2[j])
    return NodeHandleResult(obj_nodes=returned_objs, used_objs=list(used_objs))


def string_p_reverse(G: Graph, caller_ast, extra, strs):
    values, sources, _ = to_values(G, strs, caller_ast)
    returned_values = []
    for s in values:
        if values is not None:
            returned_values.append(str(s)[::-1])
        else:
            returned_values.append(None)
    used_objs = list(filter(lambda x: x is not None, chain(*sources)))
    return NodeHandleResult(values=returned_values, value_sources=sources,
        used_objs=used_objs)


def string_p_substring(G: Graph, caller_ast, extra, strs, indices_start, indices_end=NodeHandleResult(values=[None])):
    values, source1, _ = to_values(G, strs, caller_ast)
    i_starts, source2, _ = to_values(G, indices_start, caller_ast)
    i_ends, source3, _ = to_values(G, indices_end, caller_ast)
    returned_values = []
    returned_sources = []
    used_objs = set()
    for i, s in enumerate(values):
        for j, i_start in enumerate(i_starts):
            for k, i_end in enumerate(i_ends):
                flag = False
                if s is not None:
                    if i_start is not None:
                        try:
                            if i_end is not None:
                                returned_values.append(str(s)[int(i_start):int(i_end)])
                            else:
                                returned_values.append(str(s)[int(i_start):])
                            flag = True
                        except ValueError:
                            logger.warning('string.prototype.substring error, '
                                'values {} {} {}'.format(s, i_start, i_end))
                if not flag:
                    returned_values.append(None)
                returned_sources.append(source1[i] + source2[j] + source3[k])
    logger.debug('string substring RETURNED VALUES: {}'.format(returned_values))
    return NodeHandleResult(values=returned_values,
        value_sources=returned_sources, used_objs=list(used_objs))


def string_p_substr(G: Graph, caller_ast, extra, strs, indices_start, indices_end=NodeHandleResult(values=[None])):
    values, source1, _ = to_values(G, strs, caller_ast)
    i_starts, source2, _ = to_values(G, indices_start, caller_ast)
    lengths, source3, _ = to_values(G, indices_end, caller_ast)
    returned_values = []
    returned_sources = []
    used_objs = set()
    for i, s in enumerate(values):
        for j, i_start in enumerate(i_starts):
            for k, length in enumerate(lengths):
                flag = False
                if s is not None:
                    if i_start is not None:
                        try:
                            if length is not None:
                                returned_values.append(str(s)
                                    [int(i_start):int(i_start)+int(length)])
                            else:
                                returned_values.append(str(s)[int(i_start):])
                            flag = True
                        except ValueError:
                            logger.warning('string.prototype.substr error, '
                                'values {} {} {}'.format(s, i_start, length))
                if not flag:
                    returned_values.append(None)
                returned_sources.append(source1[i] + source2[j] + source3[k])
                used_objs.update(source1[i])
                used_objs.update(source2[j])
                used_objs.update(source3[k])
    logger.debug('string substr RETURNED VALUES: {}'.format(returned_values))
    return NodeHandleResult(values=returned_values,
        value_sources=returned_sources, used_objs=list(used_objs))


def string_p_to_lower_case(G: Graph, caller_ast, extra, strs):
    values, sources, _ = to_values(G, strs, caller_ast)
    returned_values = []
    for s in values:
        if s is not None:
            returned_values.append(str(s).lower())
        else:
            returned_values.append(None)
    used_objs = list(filter(lambda x: x is not None, chain(*sources)))
    logger.debug('string toLowerCase RETURNED VALUES: {}'.format(returned_values))
    return NodeHandleResult(values=returned_values, value_sources=sources,
        used_objs=used_objs)


def string_p_to_upper_case(G: Graph, caller_ast, extra, strs):
    values, sources, _ = to_values(G, strs, caller_ast)
    returned_values = []
    for s in values:
        if s is not None:
            returned_values.append(str(s).upper())
        else:
            returned_values.append(None)
    used_objs = list(filter(lambda x: x is not None, chain(*sources)))
    logger.debug('string toUpperCase RETURNED VALUES: {}'.format(returned_values))
    return NodeHandleResult(values=returned_values, value_sources=sources,
        used_objs=used_objs)


def string_p_trim(G: Graph, caller_ast, extra, strs, *args):
    values, sources, _ = to_values(G, strs, caller_ast)
    returned_values = []
    for s in values:
        if values is not None:
            returned_values.append(str(s).strip())
        else:
            returned_values.append(None)
    used_objs = list(filter(lambda x: x is not None, chain(*sources)))
    return NodeHandleResult(values=returned_values, value_sources=sources,
        used_objs=used_objs)


def string_p_trim_end(G: Graph, caller_ast, extra, strs, *args):
    values, sources, _ = to_values(G, strs, caller_ast)
    returned_values = []
    for s in values:
        if s is not None:
            returned_values.append(str(s).rstrip())
        else:
            returned_values.append(None)
    used_objs = list(filter(lambda x: x is not None, chain(*sources)))
    return NodeHandleResult(values=returned_values, value_sources=sources,
        used_objs=used_objs)


def string_p_trim_start(G: Graph, caller_ast, extra, strs, *args):
    values, sources, _ = to_values(G, strs, caller_ast)
    returned_values = []
    for s in values:
        if s is not None:
            returned_values.append(str(s).lstrip())
        else:
            returned_values.append(None)
    used_objs = list(filter(lambda x: x is not None, chain(*sources)))
    return NodeHandleResult(values=returned_values, value_sources=sources,
        used_objs=used_objs)


def string_p_char_at(G: Graph, caller_ast, extra, strs, indices):
    values, sources1, _ = to_values(G, strs, caller_ast)
    indexs, sources2, _ = to_values(G, indices, caller_ast)
    returned_values = []
    returned_sources = []
    used_objs = set()
    for i, s in enumerate(values):
        for j, index in enumerate(indexs):
            if s is not None and index is not None:
                try:
                    ii = int(index)
                    if ii >= 0 and ii < len(str(s)):
                        returned_values.append(str(s)[ii])
                    else:
                        returned_values.append('')
                except ValueError:
                    returned_values.append(None)
            else:
                returned_values.append(None)
            returned_sources.append(sources1[i] + sources2[j])
            used_objs.update(sources1[i])
            used_objs.update(sources2[j])
    return NodeHandleResult(values=returned_values,
        value_sources=returned_sources, used_objs=list(used_objs))


def split_regexp(code) -> (str, str):
    if code is None:
        return None, None
    match = re.match(r'^/(.*)/(\w*)$', code)
    if match:
        return match.groups()
    else:
        return None, None


def convert_to_python_re(code) -> (re.Pattern, bool, bool):
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
