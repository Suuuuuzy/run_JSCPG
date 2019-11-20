from .graph import Graph
from .utilities import NodeHandleResult, ExtraInfo, BranchTag
import math
from typing import Callable, List
from collections import defaultdict

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
                        G.add_edge(obj, added_obj,
                            {'type:TYPE': 'CONTRIBUTES_TO'})
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
            if attrs.get('type') == 'object':
                value = 'Obj#' + obj
            elif attrs.get('code') is not None:
                value = val_to_str(attrs.get('code'))
            else:
                value = None
        else:
            if attrs.get('type') == 'object':
                value = None
            else:
                value = attrs.get('code')
        values.append(value)
        sources.append([obj])
        tags.append(G.get_node_attr(obj).get('for_tags', []))
    #print(values, sources)
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
        handle_result = handling_func(G, ast_node, extra)
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

def val_to_str(value, default=None):
    if type(value) in [float, int]:
        return '%g' % value
    else:
        if value == None:
            return default
        return str(value)

def val_to_float(value):
    try:
        return float(value)
    except ValueError:
        return float('nan')

def cmp(a, b):
    return (a > b) - (a < b)

def js_cmp(v1, v2):
    if type(v1) == type(v2):
        return cmp(v1, v2)
    else:
        # s1 = val_to_str(v1)
        # s2 = val_to_str(v2)
        n1 = val_to_float(v1)
        n2 = val_to_float(v2)
        return cmp(n1, n2)

def check_condition(G: Graph, ast_node, extra: ExtraInfo,
    handling_func: Callable, printing_func=print):
    '''
    Check if a condition is true or false.
    
    Args:
        G (Graph): Graph.
        ast_node: AST node of the condition expression.
        extra (ExtraInfo): Extra info.
        handling_func (Callable): Node handling function. Normally you
            should use handle_node.

    Returns:
        float, bool: A number (range [0, 1]) indicates how possible the
            condition is true. If both left side and right side are
            single possibility, it returns 0 for false, and 1 for true.
            A boolean value if all results are not deterministic.
    '''

    node_type = G.get_node_attr(ast_node).get('type')
    op_type = G.get_node_attr(ast_node).get('flags:string[]')
    flag = True
    deter_flag = True
    if node_type == 'AST_EXPR_LIST':
        child = G.get_ordered_ast_child_nodes(ast_node)[0]
        return check_condition(G, child, extra, handling_func)
    elif node_type == 'AST_UNARY_OP' and op_type == 'UNARY_BOOL_NOT':
        child = G.get_ordered_ast_child_nodes(ast_node)[0]
        p, d = check_condition(G, child, extra, handling_func)
        if p is not None:
            return 1 - p, d
        else:
            return None, d
    if node_type == 'AST_BINARY_OP':
        left, right = G.get_ordered_ast_child_nodes(ast_node)[:2]
        if op_type == 'BINARY_BOOL_OR':
            lp, ld = check_condition(G, left, extra, handling_func)
            rp, rd = check_condition(G, right, extra, handling_func)
            if lp is not None and rp is not None:
                return lp + rp - lp * rp, ld and rd
            else:
                return None, False
        elif op_type == 'BINARY_BOOL_AND':
            lp, ld = check_condition(G, left, extra, handling_func)
            rp, rd = check_condition(G, right, extra, handling_func)
            if lp is not None and rp is not None:
                return lp * rp, ld and rd
            else:
                return None, False
        else:
            handled_left = handling_func(G, left, extra)
            handled_right = handling_func(G, right, extra)
            left_values = to_values(G, handled_left, ast_node)[0]
            right_values = to_values(G, handled_right, ast_node)[0]
            # print(f'Comparing {handled_left.name}: {left_values} and {handled_right.name}: {right_values}')

            true_num = 0
            total_num = len(left_values) * len(right_values)
            if total_num == 0:
                return None, False # Value is unknown, cannot check
            if op_type == 'BINARY_IS_EQUAL':
                for v1 in left_values:
                    for v2 in right_values:
                        if v1 is not None and v2 is not None:
                            if js_cmp(v1, v2) == 0:
                                true_num += 1
                            else:
                                pass
                        else:
                            true_num += 0.5
                            deter_flag = False
            elif op_type == 'BINARY_IS_IDENTICAL':
                for v1 in left_values:
                    for v2 in right_values:
                        if v1 is not None and v2 is not None:
                            if v1 == v2:
                                true_num += 1
                            else:
                                pass
                        else:
                            true_num += 0.5
                            deter_flag = False
            elif op_type == 'BINARY_IS_NOT_EQUAL':
                for v1 in left_values:
                    for v2 in right_values:
                        if v1 is not None and v2 is not None:
                            if js_cmp(v1, v2) != 0:
                                pass
                            else:
                                true_num += 1
                        else:
                            true_num += 0.5
                            deter_flag = False
            elif op_type == 'BINARY_IS_NOT_IDENTICAL':
                for v1 in left_values:
                    for v2 in right_values:
                        if v1 is not None and v2 is not None:
                            if v1 != v2:
                                true_num += 1
                            else:
                                pass
                        else:
                            true_num += 0.5
                            deter_flag = False
            elif op_type == 'BINARY_IS_SMALLER':
                for v1 in left_values:
                    for v2 in right_values:
                        if v1 is not None and v2 is not None:
                            if js_cmp(v1, v2) < 0:
                                true_num += 1
                        else:
                            true_num += 0.5
                            deter_flag = False
            elif op_type == 'BINARY_IS_GREATER':
                for v1 in left_values:
                    for v2 in right_values:
                        if v1 is not None and v2 is not None:
                            if js_cmp(v1, v2) > 0:
                                true_num += 1
                        else:
                            true_num += 0.5
                            deter_flag = False
            elif op_type == 'BINARY_IS_SMALLER_OR_EQUAL':
                for v1 in left_values:
                    for v2 in right_values:
                        if v1 is not None and v2 is not None:
                            if js_cmp(v1, v2) <= 0:
                                true_num += 1
                        else:
                            true_num += 0.5
                            deter_flag = False
            elif op_type == 'BINARY_IS_GREATER_OR_EQUAL':
                for v1 in left_values:
                    for v2 in right_values:
                        if v1 is not None and v2 is not None:
                            if js_cmp(v1, v2) >= 0:
                                true_num += 1
                        else:
                            true_num += 0.5
                            deter_flag = False
            else:
                flag = False
    else:
        flag = False
    if not flag:
        handled = handling_func(G, ast_node, extra)
        true_num = 0
        total_num = len(handled.obj_nodes) + len(handled.values)
        if total_num == 0:
            return None, False # Value is unknown, cannot check
        for value in handled.values:
            if value is None:
                true_num += 0.5
                deter_flag = False
            elif value == 0:
                pass
            else:
                true_num += 1
        for obj in handled.obj_nodes:
            if obj in [G.undefined_obj, G.null_obj, G.false_obj]:
                pass
            elif obj in [G.infinity_obj, G.negative_infinity_obj, G.nan_obj,
                G.true_obj]:
                true_num += 1
            else:
                value = G.get_node_attr(obj).get('code')
                typ = G.get_node_attr(obj).get('type')
                if typ == 'number':
                    if value is None:
                        true_num += 0.5
                        deter_flag = False
                    elif val_to_float(value) != 0:
                        true_num += 1
                elif typ == 'string':
                    if value is None:
                        true_num += 0.5
                        deter_flag = False
                    elif value:
                        true_num += 1
                else:
                    if value == '*':
                        true_num += 0.5
                        deter_flag = False
                    else:
                        true_num += 1
        for value in handled.values:
            if value:
                true_num += 1
    if 0 == total_num:
        return None, False
    return true_num / total_num, deter_flag

def is_int(x):
    try: # check if x is an integer
        _ = int(x)
    except ValueError:
        return False
    return True

def convert_prop_names_to_wildcard(G: Graph, obj, exclude_length=False, exclude_proto=True):
    wildcard_name_node = G.add_prop_name_node('*', obj)
    for e1 in G.get_out_edges(obj, edge_type='OBJ_TO_PROP'):
        name_node = e1[1]
        if exclude_length and G.get_node_attr(name_node).get('name') == 'length':
            continue
        if exclude_proto and G.get_node_attr(name_node).get('name') == '__proto__':
            continue
        for e2 in G.get_out_edges(name_node, edge_type='NAME_TO_OBJ'):
            _, obj, _, data = e2
            G.add_edge(wildcard_name_node, obj, data)
    for e1 in G.get_out_edges(obj, edge_type='OBJ_TO_PROP'):
        G.remove_all_edges_between(e1[0], e1[1])    

def copy_objs_for_branch(G: Graph, handle_result: NodeHandleResult, branch,
    ast_node=None) -> NodeHandleResult:
    returned_objs = list()
    for obj in handle_result.obj_nodes:
        copied_obj = None
        for e in G.get_in_edges(obj, edge_type='NAME_TO_OBJ'):
            name_node, _, _, data = e
            eb = data.get('branch')
            if name_node in handle_result.name_nodes and (eb is None or
                (eb.point == branch.point and eb.branch != branch.branch)):
                if copied_obj is None: # the object is copied only once
                    copied_obj = G.copy_obj(obj, ast_node)
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
        except ValueError:
            i = 0
        for e in G.get_out_edges(name_node, edge_type='NAME_TO_OBJ'):
            if value:
                elements[i].append(val_to_str(G.get_node_attr(e[1])
                    .get('code', '?')))
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
