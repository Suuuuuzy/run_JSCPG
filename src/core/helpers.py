from .graph import Graph
from .utils import NodeHandleResult, ExtraInfo, BranchTag
from .utils import wildcard, undefined
import math
from typing import Callable, List, Iterable
from collections import defaultdict
from src.core.esprima import esprima_parse
from src.core.logger import loggers
from src.plugins.internal.utils import register_func
from .logger import loggers, sty
import sty

def get_argnames_from_funcaller(G, node_id):
    """
    given a func node id, return a list of para ids
    """
    paras = []
    nodes = G.get_successors(node_id)
    for node in nodes:
        if node == None:
            continue
        if G.get_node_attr(node)['type'] == 'AST_ARG_LIST':
            params_id = list(G.get_successors(node))
            for i in range(len(params_id)):
                paras.append(0)
            for param_id in params_id:
                # only on child node
                try:
                    para_num = int(G.get_node_attr(param_id)['childnum:int'])
                    sub_param_id = list(G.get_successors(param_id))[0]
                    paras[para_num] = G.get_node_attr(sub_param_id)['code']
                except:
                    pass
    return paras

def get_argids_from_funcallee(G, node_id):
    """
    given a func node id, return a list of para ids
    """
    paras = []
    nodes = G.get_successors(node_id)
    for node in nodes:
        if G.get_node_attr(node)['type'] == 'AST_PARAM_LIST':
            params_id = list(G.get_successors(node))
            for i in range(len(params_id)):
                paras.append(0)
            for param_id in params_id:
                # only on child node
                para_num = int(G.get_node_attr(param_id)['childnum:int'])
                paras[para_num] = param_id 

    return paras

def add_edges_between_funcs(G):
    """
    we need to add CFG and DF edges between funcs
    find callers, if no flow to this node, go upper to find 
    a flow to. add CFG edges to callee CFG_ENTRY an DF edges
    to PARAS
    """
    call_edges = G.get_edges_by_type('CALLS')
    added_edge_list = []
    for call_edge in call_edges:
        caller_id = call_edge[0]
        callee_id = call_edge[1]

        # incase caller is not a CPG node, find the nearest
        # CPG node
        CPG_caller_id = G.find_nearest_upper_CPG_node(caller_id)
        entry_edge = G.get_out_edges(callee_id, data = True, edge_type = 'ENTRY')[0]
        # add CFG edge to ENTRY
        ln1 = G.get_node_attr(CPG_caller_id).get('lineno:int')
        ln2 = G.get_node_attr(list(G.get_in_edges(entry_edge[1]))[0][0]).get('lineno:int')
        ln2 = 'Line ' + ln2 if ln2 else 'Built-in'
        loggers.main_logger.info(sty.ef.inverse + sty.fg.cyan + 'Add CFG edge' + sty.rs.all + ' {} -> {} (Line {} -> {})'.format(CPG_caller_id, entry_edge[1], ln1, ln2))
        added_edge_list.append((CPG_caller_id, entry_edge[1], {'type:TYPE': 'FLOWS_TO'}))

        # add DF edge to PARAM
        # the order of para in paras matters!
        caller_para_names = get_argnames_from_funcaller(G, caller_id)
        callee_paras = get_argids_from_funcallee(G, callee_id)
        for idx in range(min(len(callee_paras), len(caller_para_names))):
            ln2 = G.get_node_attr(callee_paras[idx]).get('lineno:int')
            loggers.main_logger.info(sty.ef.inverse + sty.fg.li_magenta + 'Add INTER_FUNC_REACHES' + sty.rs.all + ' {} -> {} (Line {} -> Line {})'.format(CPG_caller_id, callee_paras[idx], ln1, ln2))
            assert CPG_caller_id != None, "Failed to add CFG edge. CPG_caller_id is None."
            assert callee_paras[idx] != None, f"Failed to add CFG edge. callee_paras[{idx}] is None."
            added_edge_list.append((CPG_caller_id, callee_paras[idx], {'type:TYPE': 'INTER_FUNC_REACHES', 'var': str(caller_para_names[idx])}))

        # add data flows for return values
        for child in G.get_child_nodes(callee_id, 'PARENT_OF'):
            if G.get_node_attr(child)['type'] == 'AST_STMT_LIST':
                for stmt in G.get_child_nodes(child, 'PARENT_OF'):
                    if G.get_node_attr(stmt)['type'] == 'AST_RETURN':
                        ln1 = G.get_node_attr(stmt).get('lineno:int')
                        ln2 = G.get_node_attr(CPG_caller_id).get('lineno:int')
                        loggers.main_logger.info(sty.ef.inverse + sty.fg.li_magenta + 'Add return value data flow' + sty.rs.all + ' {} -> {} (Line {} -> Line {})'.format(stmt, CPG_caller_id, ln1, ln2))
                        assert stmt != None, "Failed to add CFG edge. Statement ID is None."
                        assert CPG_caller_id != None, "Failed to add CFG edge. CPG_caller_id is None."
                        added_edge_list.append((stmt, CPG_caller_id, {'type:TYPE': 'FLOWS_TO'}))

    G.add_edges_from_list_if_not_exist(added_edge_list)

def parse_file(G, path, start_node_id=0):
    """
    parse a file, from a path to a AST by esprima
    Args:
        G (Graph): the graph to put the AST
        path (str): the path to the file
        start_node_id (int) 0: the start node id
    """
    result = esprima_parse(path, ['-n', str(start_node_id), '-o', '-'],
        print_func=loggers.main_logger.info)
    G.import_from_string(result)

def parse_string(G, source, start_node_id=0):
    """
    parse a string of source code to AST by esprima
    Args:
        G (Graph): the graph to put the AST
        source (str): the source code to parse
        start_node_id (int) 0: the start node id
    """
    result = esprima_parse('-', ['-n', str(start_node_id), '-o', '-'],
        input=source, print_func=loggers.main_logger.info)
    G.import_from_string(result)

def print_handle_result(handle_result: NodeHandleResult):
    output = f'{sty.ef.b}{sty.fg.cyan}{handle_result.ast_node}{sty.rs.all} ' \
        f'handle result: obj_nodes={handle_result.obj_nodes}, ' \
        f'name={handle_result.name}, name_nodes={handle_result.name_nodes}'
    if handle_result.values:
        output += f', values={handle_result.values}'
    if handle_result.used_objs:
        output += f', used_objs={handle_result.used_objs}'
    if handle_result.name_tainted:
        output += f', name_tainted={handle_result.name_tainted}'
    loggers.main_logger.debug(output)

def eval_value(G: Graph, s: str, return_obj_node=False, ast_node=None):
    '''
    Experimental. Extract Python values, JavaScript types from literal
    values (presented by JavaScript code) and create object nodes.
    
    Args:
        G (Graph): Graph.
        s (str): The literal value (as JavaScript code).
        return_obj_node (bool, optional): Create/return an object node
            for the value. Defaults to False.
        ast_node (optional): The value's AST node. Defaults to None.
    
    Returns:
        evaluated, js_type, result: the Python value, JavaScript type
            (in string), and object node (optional).
    '''
    js_type = None
    result = None
    if s == 'true':
        evaluated = True
        js_type = 'boolean'
        result = NodeHandleResult(name='true', obj_nodes=[G.true_obj])
    elif s == 'false':
        evaluated = False
        js_type = 'boolean'
        result = NodeHandleResult(name='false', obj_nodes=[G.false_obj])
    elif s == 'NaN':
        evaluated = math.nan
        js_type = 'number'
        result = NodeHandleResult(name='NaN', obj_nodes=[G.false_obj])
    elif s == 'Infinity':
        evaluated = math.inf
        js_type = 'number'
        result = NodeHandleResult(name='Infinity', obj_nodes=[G.infinity_obj])
    elif s == '-Infinity':
        evaluated = -math.inf
        js_type = 'number'
        result = NodeHandleResult(name='-Infinity', obj_nodes=[
            G.negative_infinity_obj])
    else:
        evaluated = eval(s)
        if type(evaluated) is float or type(evaluated) is int:
            js_type = 'number'
        elif type(evaluated) is str:
            js_type = 'string'
        if return_obj_node:
            added_obj = G.add_obj_node(ast_node, js_type, s)
            result = NodeHandleResult(obj_nodes=[added_obj])
    if return_obj_node:
        return evaluated, js_type, result
    else:
        return evaluated, js_type

def to_obj_nodes(G: Graph, handle_result: NodeHandleResult, ast_node=None,
    incl_existing_obj_nodes=True):
    '''
    Experimental. Converts 'values' field into object nodes.
    Returns converted object nodes as a list.
    '''
    returned_objs = []
    if handle_result.values:
        for i, value in enumerate(handle_result.values):
            if type(value) in [int, float]:
                added_obj = G.add_obj_node(ast_node, 'number', value)
            else:
                added_obj = G.add_obj_node(ast_node, 'string', value)
            if handle_result.value_tags:
                G.set_node_attr(added_obj, 
                    ('for_tags', handle_result.value_tags[i]))
            returned_objs.append(added_obj)
            # add CONTRIBUTES_TO edges from sources to the added object
            if i < len(handle_result.value_sources):
                for obj in handle_result.value_sources[i]:
                    if obj is not None:
                        add_contributes_to(G, [obj], added_obj)
    if incl_existing_obj_nodes:
        returned_objs.extend(handle_result.obj_nodes)
    return returned_objs

def to_values(G: Graph, handle_result: NodeHandleResult,
    incl_existing_values=True, for_prop=False):
    '''
    Experimental. Get values ('code' fields) in object nodes.
    Returns values, sources and tags in lists.
    '''
    values = []
    sources = []
    tags = []
    if incl_existing_values:
        values = list(handle_result.values)
        if for_prop:
            values = list(map(val_to_str, values))
        if handle_result.value_sources:
            sources = handle_result.value_sources
        else:
            sources = [[]] * len(handle_result.values)
        if handle_result.value_tags:
            tags = handle_result.value_tags
        else:
            tags = [[] for i in range(len(handle_result.values))]
    for obj in handle_result.obj_nodes:
        attrs = G.get_node_attr(obj)
        if for_prop:
            if attrs.get('code') == wildcard:
                value = wildcard
            elif obj == G.undefined_obj:
                value = undefined
            elif attrs.get('code') is not None:
                value = val_to_str(attrs.get('code'))
            else:
                value = 'Obj#' + obj
        else:
            if attrs.get('code') is not None:
                value = attrs.get('code')
            else:
                value = wildcard
        values.append(value)
        sources.append([obj])
        tags.append(G.get_node_attr(obj).get('for_tags', []))
    # print(values, sources)
    values, sources = combine_values(values, sources)
    return values, sources, tags

def combine_values(values, sources, *arg):
    d = defaultdict(lambda: [])
    for i, v in enumerate(values):
        d[v].extend(sources[i])
    return (list(d.keys()), list(d.values()), *arg)

def peek_variables(G: Graph, ast_node, handling_func: Callable,
    extra: ExtraInfo):
    '''
    Experimental. Peek what variable is used in the statement and get
    their object nodes. Currently, you must ensure the statement you
    want tho peek is in the same scope as your current scope.
    
    Args:
        G (Graph): Graph.
        ast_node: AST node of the statement.
        handling_func (Callable): Function to handle the variable node.
            Normally you should use handle_var.
        extra (ExtraInfo): Extra info.
    '''
    returned_dict = {}
    if G.get_node_attr(ast_node).get('type') == 'AST_VAR' or \
        G.get_node_attr(ast_node).get('type') == 'AST_NAME':
        handle_result = handling_func(G, ast_node, extra=extra)
        if handle_result.name:
            returned_dict[handle_result.name] = handle_result.obj_nodes
    else:
        for child in G.get_ordered_ast_child_nodes(ast_node):
            d = peek_variables(G, child, handling_func, extra)
            for name, nodes in d.items():
                if name in returned_dict:
                    returned_dict[name].extend(d[name])
                else:
                    returned_dict[name] = d[name]
        for name, nodes in returned_dict.items():
            returned_dict[name] = list(set(nodes))
    return returned_dict

def val_to_str(value, default=wildcard):
    if type(value) in [float, int]:
        return '%g' % value
    else:
        if value is None or value == wildcard:
            return default
        return str(value)

def val_to_float(value, default=wildcard):
    if value is None or value == wildcard or value == undefined:
        return default
    try:
        return float(value)
    except ValueError:
        return float('nan')

def cmp(a, b):
    return (a > b) - (a < b)

def js_cmp(v1, v2):
    if type(v1) == type(v2):
        if v1 == undefined and v2 == undefined:
            return 0
        else:
            return cmp(v1, v2)
    else:
        # s1 = val_to_str(v1)
        # s2 = val_to_str(v2)
        n1 = val_to_float(v1)
        n2 = val_to_float(v2)
        return cmp(n1, n2)

def is_int(x):
    try: # check if x is an integer
        _ = int(x)
    except (ValueError, TypeError):
        return False
    return True

def convert_prop_names_to_wildcard(G: Graph, obj, exclude_length=False,
    exclude_proto=True):
    wildcard_name_node = G.add_prop_name_node(wildcard, obj)
    for e1 in G.get_out_edges(obj, edge_type='OBJ_TO_PROP'):
        name_node = e1[1]
        if G.get_node_attr(name_node).get('name') == wildcard:
            continue
        if exclude_length and \
            G.get_node_attr(name_node).get('name') == 'length':
            continue
        if exclude_proto and \
            G.get_node_attr(name_node).get('name') == '__proto__':
            continue
        for e2 in G.get_out_edges(name_node, edge_type='NAME_TO_OBJ'):
            _, obj, _, data = e2
            G.add_edge(wildcard_name_node, obj, data)
        G.remove_all_edges_between(e1[0], e1[1])    

def copy_objs_for_branch(G: Graph, handle_result: NodeHandleResult, branch,
    ast_node=None, deep=True) -> NodeHandleResult:
    returned_objs = list()
    for obj in handle_result.obj_nodes:
        copied_obj = None
        for e in G.get_in_edges(obj, edge_type='NAME_TO_OBJ'):
            name_node, _, _, data = e
            eb = data.get('branch')
            if name_node in handle_result.name_nodes and (eb is None or
                (eb.point == branch.point and eb.branch != branch.branch)):
                if copied_obj is None: # the object should be copied only once
                    copied_obj = G.copy_obj(obj, ast_node, deep=deep)
                    returned_objs.append(copied_obj)
                # assign the name node to the copied object and mark the
                # previous edge as deleted (D)
                edge_attr_a = dict(data)
                edge_attr_a['branch'] = BranchTag(branch, mark='A')
                edge_attr_d = dict(data)
                edge_attr_d['branch'] = BranchTag(branch, mark='D')
                G.add_edge(name_node, copied_obj, edge_attr_a)
                G.add_edge(name_node, obj, edge_attr_d)
        if copied_obj is None: # if the object is not copied, return it
            returned_objs.append(obj)

    return NodeHandleResult(obj_nodes=returned_objs, name=handle_result.name,
        name_node=handle_result.name_nodes)

def copy_objs_for_parameters(G: Graph, handle_result: NodeHandleResult,
    ast_node=None, number_of_copies=1, delete_original=True) -> List[List]:
    # deprecated
    returned_objs = list()
    for obj in handle_result.obj_nodes:
        copied_objs = []
        for i in range(number_of_copies):
            copied_objs.append(G.copy_obj(obj, ast_node))
        for e in G.get_in_edges(obj, edge_type='NAME_TO_OBJ'):
            name_node, obj_node, k, data = e
            if name_node in handle_result.name_nodes:
                if delete_original:
                    G.graph.remove_edge(name_node, obj_node, k)
                for copied_obj in copied_objs:
                    G.add_edge(name_node, copied_obj, data)
        returned_objs.append(copied_objs)

    return returned_objs

def to_python_array(G: Graph, array_obj, value=False):
    elements = [[]]
    data = [[]]
    for name_node in G.get_prop_name_nodes(array_obj):
        name = G.get_node_attr(name_node).get('name')
        if name == 'length' or name == '__proto__':
            continue
        try:
            i = int(name)
            while i >= len(elements):
                elements.append([])
                data.append([])
        except (ValueError, TypeError):
            continue
        for e in G.get_out_edges(name_node, edge_type='NAME_TO_OBJ'):
            if value:
                elements[i].append(val_to_str(G.get_node_attr(e[1])
                    .get('code')))
            else:
                elements[i].append(e[1])
            data[i].append(e[3])
    return elements, data

def to_og_array(G: Graph, array, data, ast_node=None):
    added_array = G.add_obj_node(ast_node=ast_node, js_type='array')
    for i, elem in enumerate(array):
        name_node = G.add_prop_name_node(name=str(i), parent_obj=added_array)
        for j, obj in enumerate(elem):
            G.add_edge(name_node, obj,
                {'type:TYPE': 'NAME_TO_OBJ', **data[i][j]})
    G.add_obj_as_prop(prop_name='length', ast_node=ast_node, js_type='number',
        value=len(array), parent_obj=added_array)
    return added_array

def add_contributes_to(G: Graph, sources: Iterable, target,
    chain_tainted=True):
    assert not isinstance(sources, (str, bytes))
    tainted = False
    for s in sources:
        # source_id = str(s)
        # if G.get_node_attr(s).get('tainted'):
        #     source_id += ' tainted'
        # print(f'{source_id} CONTRIBUTES TO {target}')
        G.add_edge(s, target, {'type:TYPE': 'CONTRIBUTES_TO'})
        tainted = tainted or G.get_node_attr(s).get('tainted', False)
    if chain_tainted and tainted:
        G.set_node_attr(target, ('tainted', True))

