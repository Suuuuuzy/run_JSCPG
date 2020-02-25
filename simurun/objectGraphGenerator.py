from .graph import Graph
from .utilities import NodeHandleResult, ExtraInfo
from .utilities import BranchTag, BranchTagContainer, get_random_hex
import os
import sty
import json
import re
import traceback as tb
from .logger import *
from . import modeled_js_builtins, modeled_builtin_modules
from .helpers import to_values, to_obj_nodes, peek_variables, combine_values
from .helpers import check_condition, val_to_str, val_to_float, is_int
from .helpers import add_contributes_to, wildcard, undefined
from .helpers import js_cmp
from .esprima import esprima_parse, esprima_search
from itertools import chain
from collections import defaultdict
from .trace_rule import TraceRule
from .vulChecking import *
from func_timeout import func_timeout, FunctionTimedOut
import time

registered_func = {}

logger = create_logger("main_logger", output_type="file")

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
        logger.info(sty.ef.inverse + sty.fg.cyan + 'Add CFG edge' + sty.rs.all + ' {} -> {} (Line {} -> {})'.format(CPG_caller_id, entry_edge[1], ln1, ln2))
        # assert CPG_caller_id != None, "Failed to add CFG edge. CPG_caller_id is None."
        # assert entry_edge[1] != None, "Failed to add CFG edge. Callee ENTRY is None."
        added_edge_list.append((CPG_caller_id, entry_edge[1], {'type:TYPE': 'FLOWS_TO'}))

        # add DF edge to PARAM
        # the order of para in paras matters!
        caller_para_names = get_argnames_from_funcaller(G, caller_id)
        callee_paras = get_argids_from_funcallee(G, callee_id)
        for idx in range(min(len(callee_paras), len(caller_para_names))):
            ln2 = G.get_node_attr(callee_paras[idx]).get('lineno:int')
            logger.info(sty.ef.inverse + sty.fg.li_magenta + 'Add INTER_FUNC_REACHES' + sty.rs.all + ' {} -> {} (Line {} -> Line {})'.format(CPG_caller_id, callee_paras[idx], ln1, ln2))
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
                        logger.info(sty.ef.inverse + sty.fg.li_magenta + 'Add return value data flow' + sty.rs.all + ' {} -> {} (Line {} -> Line {})'.format(stmt, CPG_caller_id, ln1, ln2))
                        assert stmt != None, "Failed to add CFG edge. Statement ID is None."
                        assert CPG_caller_id != None, "Failed to add CFG edge. CPG_caller_id is None."
                        added_edge_list.append((stmt, CPG_caller_id, {'type:TYPE': 'FLOWS_TO'}))

    G.add_edges_from_list_if_not_exist(added_edge_list)

def register_func(G, node_id):
    """
    deprecated

    register the function to the nearest parent function like node
    we assume the 1-level parent node is the stmt of parent function

    Args:
        G: the graph object
        node_id: the node that needed to be registered
    """
    # we assume this node only have one parent node
    # sometimes this could be the root node and do not have any parent nodes
    if len(G.get_in_edges(node_id, edge_type="PARENT_OF")) == 0:
        return None
    parent_stmt_nodeid = G.get_in_edges(node_id, edge_type = "PARENT_OF")[0][0]
    parent_func_nodeid = G.get_in_edges(parent_stmt_nodeid, edge_type = "PARENT_OF")[0][0]
    G.set_node_attr(parent_func_nodeid, ("HAVE_FUNC", node_id))
    if parent_func_nodeid not in registered_func:
        registered_func[parent_func_nodeid] = set()
    registered_func[parent_func_nodeid].add(node_id)

    logger.info(sty.ef.b + sty.fg.green + "REGISTER {} to {}".format(node_id, parent_func_nodeid) + sty.rs.all)

def find_prop(G, parent_objs, prop_name, branches=None,
    side=None, parent_name='Unknown', in_proto=False, depth=0,
    prop_name_for_tags=None, ast_node=None, prop_name_sources=[]):
    '''
    Recursively find a property under parent_objs and its __proto__.
    
    Args:
        G (Graph): graph.
        parent_objs (list): parent objects.
        prop_name (str): property name.
        branches (BranchTagContainer, optional): branch information.
            Defaults to None.
        side (str, optional): 'left' or 'right', denoting left side or
            right side of assignment. Defaults to None.
        parent_name (str, optional): parent object's name, only used to
            print log. Defaults to ''.
        in_proto (bool, optional): whether __proto__ is being searched.
            Defaults to False.
        prop_name_for_tags (list, optional): Experimental. For-tags
            related to the property name. Defaults to None.
    
    Returns:
        prop_name_nodes, prop_obj_nodes: two sets containing possible
            name nodes and object nodes.
    '''
    if depth == 5:
        return [], []

    if in_proto:
        logger.debug('Cannot find "direct" property, going into __proto__ ' \
                f'{parent_objs}...')
        logger.debug(f'  {parent_name}.{prop_name}')
    prop_name_nodes = set()
    prop_obj_nodes = set()
    for parent_obj in parent_objs:
        if prop_name == wildcard and not is_wildcard_obj(G, parent_obj) and \
            not G.check_proto_pollution:
            continue

        # filter out unrelated possibilities
        # skip = False
        # parent_matched_tags = BranchTagContainer(G.get_node_attr(parent_obj)
        #     .get('for_tags', [])).get_matched_tags(branches, level=1)
        # # print(f'{sty.fg.yellow}Parent obj {parent_obj},'
        # #     f' parent name {parent_name}, prop name {prop_name},'
        # #     f' current tags: {branches},'
        # #     f' parent tags: {G.get_node_attr(parent_obj).get("for_tags", [])},'
        # #     f' parent matched tags: {parent_matched_tags},'
        # #     f' prop name for tags: {prop_name_for_tags}'
        # #     + sty.rs.all)
        # if prop_name_for_tags:
        #     for t1 in parent_matched_tags:
        #         for t2 in prop_name_for_tags:
        #             if t1.point == t2.point and t1.branch != t2.branch:
        #                 skip = True
        #                 # print(f'{sty.fg.red}Skip parent obj {parent_obj} and '
        #                 #     f'prop name {prop_name} because of {t1}, {t2}'
        #                 #     + sty.rs.all)
        #                 break
        #         if skip:
        #             break
        # if skip:
        #     continue

        # flag of whether any name node with prop_name under this parent
        # object is found
        name_node_found = False
        # search "direct" properties
        prop_name_node = G.get_prop_name_node(prop_name, parent_obj)
        if prop_name_node is not None:
            name_node_found = True
            prop_name_nodes.add(prop_name_node)
            prop_objs = G.get_objs_by_name_node(prop_name_node,
                branches=branches)
            if prop_objs:
                prop_obj_nodes.update(prop_objs)
        elif prop_name != '__proto__' and prop_name != wildcard:
            # if name node is not found, search the property under __proto__
            # note that we cannot search "__proto__" under __proto__
            __proto__name_node = G.get_prop_name_node("__proto__",
                parent_obj=parent_obj)
            if __proto__name_node is not None:
                __proto__obj_nodes = G.get_objs_by_name_node(__proto__name_node,
                    branches)
                # if set(__proto__obj_nodes) & set(parent_objs):
                #     logger.error('__proto__ ' \
                #         f'{__proto__obj_nodes} and parent {parent_objs} ' \
                #         'object nodes have intersection')
                #     __proto__obj_nodes = list(set(__proto__obj_nodes) -
                #         set(parent_objs))
                if parent_obj in __proto__obj_nodes:
                    logger.error('__proto__ ' \
                        f'{__proto__obj_nodes} and parent {parent_obj} ' \
                        'have intersection')
                    __proto__obj_nodes = __proto__obj_nodes.remove(parent_obj)
                if __proto__obj_nodes:
                    __name_nodes, __obj_nodes = find_prop(G,
                        __proto__obj_nodes, prop_name, branches,
                        parent_name=parent_name + '.__proto__',
                        in_proto=True, depth=depth+1)
                    if __name_nodes:
                        name_node_found = True
                        prop_name_nodes.update(__name_nodes)
                        prop_obj_nodes.update(__obj_nodes)
        if not name_node_found and not in_proto and prop_name != wildcard:
            # try wildcard (*)
            r1, r2 = find_prop(G, [parent_obj], wildcard, branches, side,
                parent_name, in_proto, depth, prop_name_for_tags)
            if r2:
                name_node_found = True
                prop_name_nodes.update(r1)
                prop_obj_nodes.update(r2)
                if is_wildcard_obj(G, parent_obj):
                    for o in r2:
                        for s in prop_name_sources:
                            add_contributes_to(G, [s], o)
        if not name_node_found and not in_proto:
            # we cannot create name node under __proto__
            # name nodes are only created under the original parent objects
            if is_wildcard_obj(G, parent_obj):
                # if this is an wildcard (unknown) object, add another
                # wildcard object as its property
                added_name_node = G.add_prop_name_node(prop_name, parent_obj)
                prop_name_nodes.add(added_name_node)
                added_obj = G.add_obj_to_name_node(added_name_node,
                    js_type='object' if G.check_proto_pollution else None,
                    value=wildcard, ast_node=ast_node)                    
                prop_obj_nodes.add(added_obj)
                logger.debug('{} is a wildcard object, creating a wildcard'
                    ' object {} for its properties'.format(parent_obj,
                    added_obj))
                if G.get_node_attr(parent_obj).get('tainted'):
                    G.set_node_attr(added_obj, ('tainted', True))
                    logger.debug("{} marked as tainted 1".format(added_obj))
                for s in prop_name_sources:
                    add_contributes_to(G, [s], added_obj)
                # if prop_name_for_tags:
                #     G.set_node_attr(added_name_node,
                #         ('for_tags', prop_name_for_tags))
            elif prop_name != wildcard: # normal (known) object
                if side == 'right':
                    continue
                elif parent_obj in [G.object_prototype, G.string_prototype,
                    G.function_prototype]: # more to be added
                    continue
                else:
                    # only add a name node
                    added_name_node = \
                        G.add_prop_name_node(prop_name, parent_obj)
                    prop_name_nodes.add(added_name_node)
                    # if prop_name_for_tags:
                    #     G.set_node_attr(added_name_node,
                    #                     ('for_tags', prop_name_for_tags))
                    logger.debug(f'{sty.ef.b}Add prop name node{sty.rs.all} '
                    f'{parent_name}.{prop_name} '
                    f'({parent_obj}->{added_name_node})')
    return prop_name_nodes, prop_obj_nodes

def handle_prop(G, ast_node, extra=ExtraInfo) \
    -> (NodeHandleResult, NodeHandleResult):
    '''
    Handle property.
    
    Args:
        G (Graph): graph.
        ast_node ([type]): the MemberExpression (AST_PROP) AST node.
        extra (ExtraInfo, optional): Extra information. Defaults to {}.
    
    Returns:
        handled property, handled parent
    '''
    # recursively handle both parts
    parent, prop = G.get_ordered_ast_child_nodes(ast_node)[:2]
    handled_parent = handle_node(G, parent, extra)
    handled_prop = handle_node(G, prop, extra)
    if G.finished:
        return NodeHandleResult(), handled_parent
    
    parent_code = G.get_node_attr(parent).get('code')
    parent_name = handled_parent.name or parent_code or 'Unknown'
    parent_objs = handled_parent.obj_nodes
    parent_name_nodes = handled_parent.name_nodes

    branches = extra.branches
    side = extra.side
    prop_name_nodes, prop_obj_nodes = set(), set()

    # prepare property names
    prop_names, prop_name_sources, prop_name_tags = \
                            to_values(G, handled_prop, for_prop=True)
    name_tainted = False
    if G.check_proto_pollution:
        for source in chain(*prop_name_sources):
            if G.get_node_attr(source).get('tainted'):
                name_tainted = True
                break

    parent_is_proto = False
    if G.check_proto_pollution:
        for obj in handled_parent.obj_nodes:
            if obj in G.builtin_prototypes:
                parent_is_proto = True
                break

    # if G.check_proto_pollution and prop_names == [wildcard] * len(prop_names):
        # conservative: only if all property names are unknown,
        # we fetch all properties
        # (including __proto__ for prototype pollution detection)
    if G.check_proto_pollution and wildcard in prop_names:
        # agressive: if any property name is unknown, we fetch all properties
        logger.debug('All property names are unknown, fetching all properties')
        for parent_obj in parent_objs:
            prop_name_nodes.update(G.get_prop_name_nodes(parent_obj))
            objs = G.get_prop_obj_nodes(parent_obj, branches=branches,
                exclude_proto=False)
            objs = filter(lambda obj: G.get_node_attr(obj).get('type')
                                                        != 'function', objs)
            prop_obj_nodes.update(objs)
            if is_wildcard_obj(G, parent_obj) and not G.get_prop_obj_nodes(
                    parent_obj, wildcard, extra.branches):
                added_obj = \
                    G.add_obj_as_prop(wildcard, ast_node,
                            parent_obj=parent_obj, value=wildcard)
                add_contributes_to(G, [parent_obj], added_obj)
                prop_obj_nodes.add(added_obj)
        name = f'{parent_name}.*'

    else:
        # create parent object if it doesn't exist
        parent_objs = list(filter(lambda x: x != G.undefined_obj, parent_objs))
        if not parent_objs:
            logger.debug(
                "PARENT OBJ {} NOT DEFINED, creating object nodes".
                format(parent_name))
            # we assume this happens when it's a built-in var name
            if parent_name_nodes:
                parent_objs = []
                for name_node in parent_name_nodes:
                    obj = G.add_obj_to_name_node(name_node, ast_node,
                        js_type='object' if G.check_proto_pollution else None,
                        value=wildcard)
                    parent_objs.append(obj)
            else:
                obj = G.add_obj_to_scope(parent_name, ast_node,
                    js_type='object' if G.check_proto_pollution else None,
                    scope=G.BASE_SCOPE, value=wildcard)
                parent_objs = [obj]
            # else:
            #     logger.debug("PARENT OBJ {} NOT DEFINED, return undefined".
            #         format(parent_name))
            #     return NodeHandleResult()

        # find property name nodes and object nodes
        # (filtering is moved to find_prop)
        for i, prop_name in enumerate(prop_names):
            # if prop_name == wildcard:
            #     continue
            assert prop_name is not None
            name_nodes, obj_nodes = find_prop(G, parent_objs, 
                prop_name, branches, side, parent_name,
                prop_name_for_tags=prop_name_tags[i],
                ast_node=ast_node, prop_name_sources=prop_name_sources[i])
            prop_name_nodes.update(name_nodes)
            prop_obj_nodes.update(obj_nodes)

        # wildcard is now implemented in find_prop

        if len(prop_names) == 1:
            name = f'{parent_name}.{prop_names[0]}'
        else:
            name = f'{parent_name}.{"/".join(map(str, prop_names))}'

        # tricky fix, we don't really link name nodes to the undefined object
        if not prop_obj_nodes:
            prop_obj_nodes = set([G.undefined_obj])

    return NodeHandleResult(obj_nodes=list(prop_obj_nodes),
            name=f'{name}', name_nodes=list(prop_name_nodes),
            ast_node=ast_node, callback=get_df_callback(G),
            name_tainted=name_tainted, parent_is_proto=parent_is_proto
        ), handled_parent

def handle_assign(G, ast_node, extra=None, right_override=None):
    '''
    Handle assignment statement.
    '''
    if extra is None:
        extra = ExtraInfo()
    # get AST children (left and right sides)
    ast_children = G.get_ordered_ast_child_nodes(ast_node)
    try:
        left, right = ast_children
    except ValueError:
        # if only have left side
        return handle_node(G, ast_children[0], extra)

    # get branch tags
    branches = extra.branches if extra else BranchTagContainer()

    # recursively handle both sides
    # handle right first
    if right_override is None:
        handled_right = \
            handle_node(G, right, ExtraInfo(extra, side='right'))
    else:
        handled_right = right_override
    # handle left
    if G.get_node_attr(left).get('type') == 'AST_ARRAY':
        # destructuring assignment
        # handle left item by item
        children = G.get_ordered_ast_child_nodes(left)
        if G.get_node_attr(left).get('flags:string[]') == 'JS_OBJECT':
            # ObjectPattern assignments
            added_obj = G.add_obj_node(ast_node=ast_node, js_type='object')
            for child in children:
                value, key = G.get_ordered_ast_child_nodes(child)
                handled_left = \
                    handle_var(G, value, ExtraInfo(extra, side='left'))
                _key = G.get_name_from_child(key)
                for obj in handled_right.obj_nodes:
                    prop_obj_nodes= G.get_prop_obj_nodes(parent_obj=obj,
                        prop_name=_key, branches=branches)
                    for o in prop_obj_nodes:
                        G.add_obj_as_prop(parent_obj=added_obj,
                            prop_name=_key, tobe_added_obj=o)
                    do_assign(G, handled_left, NodeHandleResult(
                        obj_nodes=prop_obj_nodes), branches, ast_node)
            return NodeHandleResult(obj_nodes=[added_obj])
        else:
            # ArrayPattern assignments
            added_obj = G.add_obj_node(ast_node=ast_node, js_type='array')
            for i, child in enumerate(children):
                handled_left = \
                    handle_var(G, child, ExtraInfo(extra, side='left'))
                for obj in handled_right.obj_nodes:
                    prop_obj_nodes= G.get_prop_obj_nodes(parent_obj=obj,
                        prop_name=str(i), branches=branches)
                    for o in prop_obj_nodes:
                        G.add_obj_as_prop(parent_obj=added_obj,
                            prop_name=str(i), tobe_added_obj=o)
                    do_assign(G, handled_left, NodeHandleResult(
                        obj_nodes=prop_obj_nodes), branches, ast_node)
            G.add_obj_as_prop(parent_obj=added_obj, prop_name='length',
                js_type='number', value=len(children), ast_node=ast_node)
            return NodeHandleResult(obj_nodes=[added_obj])
    else:
        # normal assignment
        handled_left = handle_node(G, left, ExtraInfo(extra, side='left'))
        return do_assign(G, handled_left, handled_right, branches, ast_node)

def do_assign(G, handled_left, handled_right, branches=None, ast_node=None):
    if branches is None:
        branches = BranchTagContainer()

    if not handled_left:
        logger.warning("Left side handling error at statement {}".format(ast_node))
        return NodeHandleResult()

    if not handled_right:
        logger.warning("Right side handling error at statement {}".format(ast_node))
        return NodeHandleResult()

    right_objs = to_obj_nodes(G, handled_right, ast_node)

    if not right_objs:
        logger.debug("Right OBJ not found")
        right_objs = [G.undefined_obj]

    # returned objects for serial assignment (e.g. a = b = c)
    returned_objs = []

    # print('parent is proto =', handled_left.parent_is_proto, 'name tainted =', handled_left.name_tainted)

    if G.check_proto_pollution and (handled_left.name_tainted and handled_left.parent_is_proto):
        flag1 = False
        flag2 = False
        # for name_node in handled_left.name_nodes:
        #     if name_node in G.pollutable_name_nodes:
        #         flag1 = True
        #         break
        # for obj_node in handled_left.obj_nodes:
        #     if obj_node in G.pollutable_objs:
        #         flag1 = True
        #         break
        for obj in right_objs:
            if G.get_node_attr(obj).get('tainted'):
                flag2 = True
                break
        # print('right object is tainted =', flag2)
        if flag2:
            name_node_log = [('{}: {}'.format(x, repr(G.get_node_attr(x)
                .get('name')))) for x in handled_left.name_nodes]
            logger.warning(sty.fg.li_red + sty.ef.inverse +
                'Possible prototype pollution at node {} (Line {}), '
                'trying to assign {} to name node {}'
                .format(ast_node, G.get_node_attr(ast_node).get('lineno:int'),
                right_objs, ', '.join(name_node_log)) + sty.rs.all)
            logger.debug(f'Pollutable objs: {G.pollutable_objs}')
            logger.debug(f'Pollutable NN: {G.pollutable_name_nodes}')
            G.proto_pollution.add(ast_node)
            if G.exit_when_found:
                G.finished = True
            # skip doing the assignment
            return NodeHandleResult()

    if not handled_right.obj_nodes and handled_right.terminated:
        # skip doing the assignment
        return NodeHandleResult()

    # do the assignment
    for name_node in handled_left.name_nodes:
        # nn_for_tags = G.get_node_attr(name_node).get('for_tags')
        # if not nn_for_tags: # empty array or None
        G.assign_obj_nodes_to_name_node(name_node, right_objs,
            branches=branches)
        returned_objs.extend(right_objs)
        # else:
        #     logger.debug(f"  name node's for tags {nn_for_tags}")
        #     for obj in right_objs:
        #         obj_for_tags = G.get_node_attr(obj).get('for_tags', [])
        #         flag = 2 # 0: ignore, 1: assign, 2: copy
        #         for tag1 in nn_for_tags:
        #             for tag2 in obj_for_tags:
        #                 if tag1 == tag2: # if tags are completely matched
        #                     flag = 1
        #                     break
        #                 elif (tag1.point == tag2.point
        #                     and tag1.branch == tag2.branch):
        #                     # if tags are partially matched,
        #                     # the object will be ignored
        #                     flag = 0
        #                     break
        #             # if no matched tags, the object will be copied
        #             if flag != 2:
        #                 break
        #         if flag == 1: # assign
        #             G.assign_obj_nodes_to_name_node(name_node, [obj],
        #                 branches=branches)
        #             returned_objs.append(obj)
        #             logger.debug(f'  found matching obj {obj} with tags {obj_for_tags}')
        #         elif flag == 2: # copy
        #             copied_obj = G.copy_obj(obj)
        #             for_tags = G.get_node_attr(obj).get('for_tags',
        #                                                 BranchTagContainer())
        #             new_for_tags = [BranchTag(i, mark='C')
        #                 for i in BranchTagContainer(nn_for_tags)
        #                 .get_matched_tags(branches, level=1)]
        #             for_tags.extend(new_for_tags)
        #             G.set_node_attr(copied_obj, ('for_tags', for_tags))
        #             G.assign_obj_nodes_to_name_node(name_node, [copied_obj],
        #                 branches=branches)
        #             returned_objs.append(copied_obj)
        #             logger.debug(f'  copied from obj {obj} with tags {for_tags}')

    # used_objs = handled_right.used_objs
    # logger.debug(f'  assign used objs={used_objs}')
    return NodeHandleResult(obj_nodes=handled_right.obj_nodes,
        name_nodes=handled_left.name_nodes, # used_objs=used_objs,
        callback=get_df_callback(G))

def has_else(G, if_ast_node):
    '''
    Check if an if statement has 'else'.
    '''
    # Check by finding if the last if element's condition is NULL
    elems = G.get_ordered_ast_child_nodes(if_ast_node)
    if elems:
        last_elem = elems[-1]
        cond = G.get_ordered_ast_child_nodes(last_elem)[0]
        if G.get_node_attr(cond).get('type') == 'NULL':
            return True
    return False

def instantiate_obj(G, exp_ast_node, constructor_decl, branches=None):
    '''
    Instantiate an object (create a new object).
    
    Args:
        G (Graph): Graph.
        exp_ast_node: The New expression's AST node.
        constructor_decl: The constructor's function declaration AST
            node.
        branches (optional): Branch information.. Defaults to [].
    
    Returns:
        obj_node: The created object. Note that this function returns a
            single object (not an array of objects).
        returned_obj: list, The return object of the function
    '''
    # create the instantiated object
    # js_type=None: avoid automatically adding prototype
    created_obj = G.add_obj_node(ast_node=exp_ast_node, js_type=None)
    # add edge between obj and obj decl
    G.add_edge(created_obj, constructor_decl, {"type:TYPE": "OBJ_DECL"})
    # build the prototype chain
    G.build_proto(created_obj)

    # update current object (this)
    backup_objs = G.cur_objs
    G.cur_objs = [created_obj]

    returned_objs, _ = simurun_function(G, constructor_decl, branches=branches,
        caller_ast=exp_ast_node)

    G.cur_objs = backup_objs

    # finally add call edge from caller to callee
    # added in call_function, no need to add here
    # if exp_ast_node is not None:
    #     G.add_edge_if_not_exist(exp_ast_node, constructor_decl,
    #                             {"type:TYPE": "CALLS"})

    return created_obj, returned_objs

def handle_var(G: Graph, ast_node, extra=None):
    cur_node_attr = G.get_node_attr(ast_node)
    var_name = G.get_name_from_child(ast_node)

    if var_name == 'this' and G.cur_objs:
        now_objs = G.cur_objs
        name_node = None
    elif var_name == '__filename':
        return NodeHandleResult(name=var_name, values=[
            G.get_cur_file_path()], ast_node=ast_node)
    elif var_name == '__dirname':
        return NodeHandleResult(name=var_name, values=[os.path.join(
            G.get_cur_file_path(), '..')], ast_node=ast_node)
    else:
        now_objs = []
        branches = extra.branches if extra else BranchTagContainer()

        name_node = G.get_name_node(var_name)
        if name_node is not None:
            now_objs = list(
                set(G.get_objs_by_name_node(name_node, branches=branches)))
        elif not (extra and extra.side == 'right'):
            logger.log(ATTENTION, f'Name node {var_name} not found, create name node')
            if cur_node_attr.get('flags:string[]') == 'JS_DECL_VAR':
                # we use the function scope
                name_node = G.add_name_node(var_name,
                                scope=G.find_ancestor_scope())
            elif cur_node_attr.get('flags:string[]') in [
                'JS_DECL_LET', 'JS_DECL_CONST']:
                # we use the block scope                
                name_node = G.add_name_node(var_name, scope=G.cur_scope)
            else:
                # only if the variable is not defined and doesn't have
                # 'var', 'let' or 'const', we define it in the global scope
                name_node = G.add_name_node(var_name, scope=G.BASE_SCOPE)
        # else:
        #     now_objs = [G.undefined_obj]

    name_nodes = [name_node] if name_node is not None else []

    assert None not in now_objs

    # add from_branches information
    # from_branches = []
    # cur_branches = extra.branches if extra else BranchTagContainer()
    # for obj in now_objs:
    #     from_branches.append(cur_branches.get_matched_tags(
    #         G.get_node_attr(obj).get('for_tags') or []))

    # tricky fix, we don't really link name nodes to the undefined object
    if not now_objs:
        now_objs = [G.undefined_obj]

    return NodeHandleResult(obj_nodes=now_objs, name=var_name,
        name_nodes=name_nodes, # from_branches=[from_branches],
        ast_node=ast_node)

def handle_node(G: Graph, node_id, extra=None) -> NodeHandleResult:
    """
    for different node type, do different actions to handle this node
    """

    if G.finished:
        return NodeHandleResult()

    cur_node_attr = G.get_node_attr(node_id)
    cur_type = cur_node_attr['type']
    cur_lineno = cur_node_attr['lineno:int']
    node_name = cur_node_attr.get('name') or G.get_name_from_child(node_id, 2)
    node_color = sty.fg.li_white + sty.bg.li_black
    if G.get_node_attr(node_id).get('labels:label') == 'Artificial':
        node_color = sty.fg.li_white + sty.bg.red
    elif G.get_node_attr(node_id).get('labels:label') == 'Artificial_AST':
        node_color = sty.fg.black + sty.bg(179)
    node_code = G.get_node_attr(node_id).get('code')

    try:
        if len(node_code) > 100: node_code = ''
    except:
        # print(G.get_node_attr(node_id))
        node_code = ''
        #if len(node_code) > 100: node_code = ''
        

    logger.info(f"{sty.ef.b}{sty.fg.cyan}HANDLE NODE {node_id}{sty.rs.all}" +
        (f" (Line {cur_lineno})" if cur_lineno else "") +
        f": {node_color}{cur_type}{sty.rs.all}"
        f" {node_name or ''}{sty.rs.all}, {node_code or ''}")

    # remove side information
    # because assignment's side affects its direct children
    extra = ExtraInfo(extra, side=None)

    if cur_type == 'File' or cur_type == 'Directory':
        for child in G.get_child_nodes(node_id):
            handle_node(G, child, extra)

    elif cur_type == "AST_ASSIGN":
        return handle_assign(G, node_id, extra)
    
    elif cur_type == "AST_TRY":
        children = G.get_ordered_ast_child_nodes(node_id)
        simurun_block(G, children[0], branches=extra.branches)
        for child in children[1:]:
            handle_node(G, child, extra)

    elif cur_type == "AST_YIELD":
        # for a await, we run it immediately
        return handle_node(G, G.get_ordered_ast_child_nodes(node_id)[0])

    elif cur_type == 'AST_ARRAY':
        if G.get_node_attr(node_id).get('flags:string[]') == 'JS_OBJECT':
            added_obj = G.add_obj_node(node_id, "object")
        else:
            added_obj = G.add_obj_node(node_id, "array")

        used_objs = set()
        children = G.get_ordered_ast_child_nodes(node_id)

        for child in children:
            result = handle_node(G, child, ExtraInfo(extra,
                parent_obj=added_obj))
            # used_objs.update(result.obj_nodes)

        G.add_obj_as_prop(prop_name='length', js_type='number',
            value=len(children), ast_node=node_id, parent_obj=added_obj)

        return NodeHandleResult(obj_nodes=[added_obj],
                                used_objs=list(used_objs),
                                callback=get_df_callback(G))

    elif cur_type == 'AST_ARRAY_ELEM':
        if not (extra and extra.parent_obj is not None):
            logger.error("AST_ARRAY_ELEM occurs outside AST_ARRAY")
            return None
        else:
            # should only have two childern
            try:
                value_node, key_node = G.get_ordered_ast_child_nodes(node_id)
            except:
                # TODO: Check what happend here for colorider
                return NodeHandleResult()
                
            key = G.get_name_from_child(key_node)
            if key is not None:
                key = key.strip("'\"")
            else:
                # shouldn't convert it to int
                key = G.get_node_attr(node_id).get('childnum:int')
            if key is None:
                key = wildcard
            handled_value = handle_node(G, value_node, extra)
            value_objs = to_obj_nodes(G, handled_value, node_id)
            # used_objs = list(set(handled_value.used_objs))
            for obj in value_objs:
                G.add_obj_as_prop(key, node_id,
                    parent_obj=extra.parent_obj, tobe_added_obj=obj)
        return NodeHandleResult(obj_nodes=value_objs, # used_objs=used_objs,
            callback=get_df_callback(G))

    elif cur_type == "AST_ENCAPS_LIST":
        children = G.get_ordered_ast_child_nodes(node_id)
        used_objs = set()
        added_obj = G.add_obj_node(ast_node=node_id, js_type='string')
        for child in children:
            handle_res = handle_node(G, child)
            used_objs.update(handle_res.obj_nodes)
            # used_objs.update(handle_res.used_objs)
            for obj in handle_res.obj_nodes:
                add_contributes_to(G, [obj], added_obj)
        return NodeHandleResult(obj_nodes=[added_obj], used_objs=used_objs,
            callback=get_df_callback(G))

    elif cur_type == 'AST_VAR' or cur_type == 'AST_NAME' or cur_type == 'AST_CONST':
        return handle_var(G, node_id, extra)

    elif cur_type == 'AST_DIM':
        # G.set_node_attr(node_id, ('type', 'AST_PROP'))
        return handle_prop(G, node_id, extra)[0]

    elif cur_type == 'AST_PROP':
        return handle_prop(G, node_id, extra)[0]

    elif cur_type == 'AST_TOPLEVEL':
        module_exports_objs = run_toplevel_file(G, node_id)
        return NodeHandleResult(obj_nodes=module_exports_objs)

    elif cur_type in ['AST_FUNC_DECL', 'AST_CLOSURE']:
        obj_nodes = G.get_func_decl_objs_by_ast_node(node_id,
                    scope=G.find_ancestor_scope())
        if not obj_nodes:
            obj_nodes = [decl_function(G, node_id)]
        return NodeHandleResult(obj_nodes=obj_nodes)

    elif cur_type == 'AST_BINARY_OP':
        left_child, right_child = G.get_ordered_ast_child_nodes(node_id)
        flag = cur_node_attr.get('flags:string[]')
        if flag == 'BINARY_BOOL_OR':
            # TODO: add value check to filter out false values
            handled_left = handle_node(G, left_child, extra)
            handled_right = handle_node(G, right_child, extra)
            now_objs = list(set(to_obj_nodes(G, handled_left, node_id)
                + to_obj_nodes(G, handled_right, node_id)))
            return NodeHandleResult(obj_nodes=now_objs)
        elif flag == 'BINARY_ADD':
            handled_left = handle_node(G, left_child, extra)
            handled_right = handle_node(G, right_child, extra)
            used_objs = []
            used_objs.extend(handled_left.obj_nodes)
            used_objs.extend(handled_right.obj_nodes)
            used_objs = list(set(used_objs))
            # calculate values
            values1, sources1, tags1 = to_values(G, handled_left, node_id)
            values2, sources2, tags2 = to_values(G, handled_right, node_id)
            results = []
            result_sources = []
            result_tags = []
            for i, v1 in enumerate(values1):
                for j, v2 in enumerate(values2):
                    if v1 != wildcard and v2 != wildcard:
                        if (type(v1) == int or type(v1) == float) and \
                            (type(v2) == int or type(v2) == float):
                            results.append(v1 + v2)
                        else:
                            results.append(str(v1) + str(v2))
                    else:
                        results.append(wildcard)
                    result_tags.append(tags1 + tags2)
                    result_sources.append(sources1[i] or [] + sources2[j] or [])
            if len(values1) * len(values2) == 0:
                # always returns at least one value
                results.append(wildcard)
                sources = set()
                for s in sources1 + sources2:
                    sources.update(s)
                result_sources.append(list(sources))
            return NodeHandleResult(values=results, used_objs=used_objs,
                value_sources=result_sources, callback=get_df_callback(G))
        elif flag == 'BINARY_SUB':
            handled_left = handle_node(G, left_child, extra)
            handled_right = handle_node(G, right_child, extra)
            used_objs = []
            used_objs.extend(handled_left.obj_nodes)
            used_objs.extend(handled_right.obj_nodes)
            used_objs = list(set(used_objs))
            # calculate values
            values1, sources1, tags1 = to_values(G, handled_left, node_id)
            values2, sources2, tags2 = to_values(G, handled_right, node_id)
            results = []
            result_sources = []
            result_tags = []
            for i, v1 in enumerate(values1):
                for j, v2 in enumerate(values2):
                    if v1 != wildcard and v2 != wildcard:
                        try:
                            results.append(float(v1) - float(v2))
                        except ValueError:
                            results.append(float('nan'))
                    else:
                        results.append(wildcard)
                    result_tags.append(tags1 + tags2)
                    result_sources.append(sources1[i] or [] + sources2[j] or [])
            if len(values1) * len(values2) == 0:
                results.append(wildcard)
                sources = set()
                for s in sources1 + sources2:
                    sources.update(s)
                result_sources.append(list(sources))
            return NodeHandleResult(values=results, used_objs=used_objs,
                value_sources=result_sources, callback=get_df_callback(G))
        elif flag in ['BINARY_BOOL_OR', 'BINARY_BOOL_AND', 'BINARY_IS_EQUAL',
            'BINARY_IS_IDENTICAL', 'BINARY_IS_NOT_EQUAL',
            'BINARY_IS_NOT_IDENTICAL', 'BINARY_IS_SMALLER',
            'BINARY_IS_GREATER', 'BINARY_IS_SMALLER_OR_EQUAL',
            'BINARY_IS_GREATER_OR_EQUAL']:
            p, d = check_condition(G, node_id, extra, handling_func=handle_node)
            if not d:
                return NodeHandleResult(values=[wildcard], 
                                        obj_nodes=[G.true_obj, G.false_obj])
            elif p == 1:
                return NodeHandleResult(obj_nodes=[G.true_obj])
            elif p == 0:
                return NodeHandleResult(obj_nodes=[G.false_obj])
            else:
                return NodeHandleResult(obj_nodes=[G.true_obj, G.false_obj])

    elif cur_type == 'AST_ASSIGN_OP':
        left_child, right_child = G.get_ordered_ast_child_nodes(node_id)
        handled_left = handle_node(G, left_child, extra)
        handled_right = handle_node(G, right_child, extra)
        used_objs = []
        used_objs.extend(handled_left.obj_nodes)
        used_objs.extend(handled_right.obj_nodes)
        added_obj = G.add_obj_node(node_id, value=wildcard)
        used_objs = list(set(used_objs))
        for obj in used_objs:
            add_contributes_to(G, [obj], added_obj)
        right_override = NodeHandleResult(obj_nodes=[added_obj],
            used_objs=used_objs, callback=get_df_callback(G))
        return handle_assign(G, node_id, extra, right_override)

    elif cur_type in ['integer', 'double', 'string']:
        js_type = 'string' if cur_type == 'string' else 'number'
        code = G.get_node_attr(node_id).get('code')
        if cur_type == 'integer' and \
            code.startswith("0x") or code.startswith("0X"):
                value = int(code, 16)
        elif cur_type == 'integer' and \
            code.startswith("0b") or code.startswith("0B"):
                value = int(code, 2)
        elif cur_type == 'string':
            if G.get_node_attr(node_id).get('flags:string[]') == 'JS_REGEXP':
                added_obj = G.add_obj_node(ast_node=node_id,
                                           js_type=None, value=code)
                G.add_obj_as_prop('__proto__',
                    parent_obj=added_obj, tobe_added_obj=G.regexp_prototype)
                return NodeHandleResult(obj_nodes=[added_obj])
            else:
                value = code
        else:
            value = float(code)
        assert value is not None
        # added_obj = G.add_obj_node(node_id, js_type, code)
        return NodeHandleResult(values=[value])

    elif cur_type in ['AST_CALL', 'AST_METHOD_CALL', 'AST_NEW']:
        r = ast_call_function(G, node_id, extra)
        return NodeHandleResult(obj_nodes=r.obj_nodes, used_objs=r.used_objs,
            values=r.values, value_sources=r.value_sources,
            ast_node=node_id, callback=get_df_callback(G))

    elif cur_type == 'AST_RETURN':
        returned_exp = G.get_ordered_ast_child_nodes(node_id)[0]
        return handle_node(G, returned_exp, extra)
    
    elif cur_type == 'AST_IF':
        # lineno = G.get_node_attr(node_id).get('lineno:int')
        stmt_id = "If" + node_id + "-" + get_random_hex()
        if_elems = G.get_ordered_ast_child_nodes(node_id)
        branches = extra.branches
        parent_branch = branches.get_last_choice_tag()
        branch_num_counter = 0
        # if it is sure (deterministic) that "else" needs to run 
        else_is_deterministic = True
        for if_elem in if_elems:
            condition, body = G.get_ordered_ast_child_nodes(if_elem)
            if G.get_node_attr(condition).get('type') == 'NULL': # else
                if else_is_deterministic or G.single_branch:
                    simurun_block(G, body, G.cur_scope, branches)
                else:
                    # not deterministic, create branch
                    branch_tag = BranchTag(
                        point=stmt_id, branch=str(branch_num_counter))
                    branch_num_counter += 1
                    simurun_block(G, body, G.cur_scope, branches+[branch_tag])
                break
            # check condition
            possibility, deterministic = check_condition(G, condition, extra,
                handling_func=handle_node, printing_func=logger.debug)
            logger.debug('Check condition {} result: {} {}'.format(sty.ef.i +
                G.get_node_attr(condition).get('code') + sty.rs.all,
                possibility, deterministic))
            if deterministic and possibility == 1:
                # if the condition is surely true
                simurun_block(G, body, G.cur_scope, branches)
                break
            elif G.single_branch:
                simurun_block(G, body, G.cur_scope)
            elif not deterministic or possibility is None or 0 < possibility < 1:
                # if the condition is unsure
                else_is_deterministic = False
                branch_tag = \
                    BranchTag(point=stmt_id, branch=str(branch_num_counter))
                branch_num_counter += 1
                simurun_block(G, body, G.cur_scope, branches+[branch_tag])
        # When there is no "else", we still need to add a hidden else
        if not has_else(G, node_id):
            branch_num_counter += 1
        # We always flatten edges
        if not G.single_branch:
            merge(G, stmt_id, branch_num_counter, parent_branch)
        return NodeHandleResult()
    
    elif cur_type == 'AST_SWITCH':
        condition, switch_list = G.get_ordered_ast_child_nodes(node_id)
        result = handle_node(G, condition, extra)
        handle_node(G, switch_list, ExtraInfo(extra, switch_var=result))
        return result

    elif cur_type == 'AST_SWITCH_LIST':
        stmt_id = "Switch" + node_id
        branches = extra.branches
        parent_branch = branches.get_last_choice_tag()
        cases = G.get_ordered_ast_child_nodes(node_id)
        for i, case in enumerate(cases):
            branch_tag = BranchTag(point=stmt_id, branch=str(i))
            test, body = G.get_ordered_ast_child_nodes(case)
            # handle_node(G, test, extra)
            p, d = check_switch_var(G, test, extra)
            # print('check result =', p, d)
            if d and p == 1:
                simurun_block(G, body, G.cur_scope, branches,
                            block_scope=False)
            elif not d or 0 < p < 1:
                simurun_block(G, body, G.cur_scope, branches+[branch_tag],
                            block_scope=False)
            else:
                continue
        if not G.single_branch:
            merge(G, stmt_id, len(cases), parent_branch)

    elif cur_type == 'AST_CONDITIONAL':
        test, consequent, alternate = G.get_ordered_ast_child_nodes(node_id)
        logger.debug(f'Ternary operator: {test} ? {consequent} : {alternate}')
        possibility, deterministic = check_condition(G, test, extra,
            handling_func=handle_node)
        if deterministic and possibility == 1:
            return handle_node(G, consequent, extra)
        elif deterministic and possibility == 0:
            return handle_node(G, alternate, extra)
        else:
            h1 = handle_node(G, consequent, extra)
            h2 = handle_node(G, alternate, extra)
            return NodeHandleResult(obj_nodes=h1.obj_nodes+h2.obj_nodes,
                name_nodes=h1.name_nodes+h2.name_nodes, ast_node=node_id,
                values=h1.values+h2.values,
                value_sources=h1.value_sources+h2.value_sources,
                callback=get_df_callback(G))

    elif cur_type == 'AST_EXPR_LIST':
        for child in G.get_ordered_ast_child_nodes(node_id):
            result = handle_node(G, child, extra)
        return result

    elif cur_type == 'AST_FOR':
        try:
            init, cond, inc, body = G.get_ordered_ast_child_nodes(node_id)[:4]
        except ValueError as e:
            for n in G.get_ordered_ast_child_nodes(node_id):
                logger.error(n, G.get_node_attr(n))
                return None
        cond = G.get_ordered_ast_child_nodes(cond)[0]
        # switch scopes
        parent_scope = G.cur_scope
        G.cur_scope = G.add_scope('BLOCK_SCOPE', decl_ast=body,
                      scope_name=G.scope_counter.gets(f'Block{body}'))
        result = handle_node(G, init, extra) # init loop variables
        d = peek_variables(G, ast_node=inc, handling_func=handle_var,
            extra=extra) # check increment to determine loop variables
        counter = 0
        while True:
            logger.debug('For loop variables:')
            for name, obj_nodes in d.items():
                logger.debug(sty.ef.i + name + sty.rs.all + ': ' +
                    ', '.join([(sty.fg.green+'{}'+sty.rs.all+' {}').format(obj,
                    val_to_str(G.get_node_attr(obj).get('code'))) for obj in obj_nodes]))

            check_result, deterministic = check_condition(G, cond, extra,
                handling_func=handle_node) # check if the condition is met
            logger.debug('Check condition {} result: {} {}'.format(sty.ef.i +
                G.get_node_attr(cond).get('code') + sty.rs.all, check_result,
                deterministic))
            # avoid infinite loop
            if (not deterministic and counter > 3) or check_result == 0:
                logger.debug('For loop {} finished'.format(node_id))
                break
            simurun_block(G, body, branches=extra.branches) # run the body
            result = handle_node(G, inc, extra) # do the inc
            counter += 1
        # switch back the scope
        G.cur_scope = parent_scope

    elif cur_type == 'AST_FOREACH':
        obj, value, key, body = G.get_ordered_ast_child_nodes(node_id)
        handled_obj = handle_node(G, obj, extra)
        # switch scopes
        parent_scope = G.cur_scope
        G.cur_scope = \
            G.add_scope('BLOCK_SCOPE', decl_ast=body,
                        scope_name=G.scope_counter.gets(f'Block{body}'))
        has_branches = (len(handled_obj.obj_nodes) > 1)
        # print(sty.fg.li_green, handled_obj.obj_nodes, sty.rs.all)
        for obj in handled_obj.obj_nodes:
            if G.get_node_attr(node_id).get('flags:string[]') == 'JS_FOR_IN':
                # handle and declare the loop variable
                handled_key = handle_node(G, key, extra)
                if G.finished:
                    break
                # loop through object's property names
                # if it's a wildcard object, include "__proto__"
                prop_names = list(filter(lambda k: k != wildcard,
                    G.get_prop_names(obj,
                        exclude_proto=not is_wildcard_obj(G, obj)
                    )))
                if is_wildcard_obj(G, obj):
                    if G.check_proto_pollution:
                        # wildcard property for wildcard object
                        prop_names = [wildcard]
                        logger.debug(f'{obj} is a wildcard object.')
                    else:
                        # wildcard property for wildcard object
                        prop_names.insert(0, wildcard)
                        logger.debug(f'{obj} is a wildcard object.')
                for k in prop_names:
                    if G.get_node_attr(obj).get('type') == 'array' and \
                        not is_int(k):
                        continue
                    if str(k).startswith('Obj#'): # object-based keys
                        key_obj = k[4:]
                    else:
                        # assign the name to the loop variable as a new 
                        # literal object
                        key_obj = G.add_obj_node(ast_node=node_id,
                            js_type='string', value=k)
                        add_contributes_to(G, [obj], key_obj)
                    logger.debug(f'For-in loop variables: {sty.ef.i}{handled_key.name}{sty.rs.all}: {sty.fg.green}{key_obj}{sty.rs.all}: {k}'
                        f' from obj {obj}')
                    G.for_stack.append('for-in {} {} {} in {}'.format(node_id, handled_key.name, k, obj))
                    # print(G.for_stack)
                    G.assign_obj_nodes_to_name_node(handled_key.name_nodes[0],
                        [key_obj], branches=extra.branches)
                    # run the body
                    simurun_block(G, body, branches=extra.branches)
                    G.for_stack.pop()
                logger.debug('For-in loop {} finished'.format(node_id))
            elif G.get_node_attr(node_id).get('flags:string[]') == 'JS_FOR_OF':
                # handle and declare the loop variable
                handled_value = handle_node(G, value, extra)
                if G.finished:
                    break
                # if the object is an array, only use numeric indices
                numeric_only = (G.get_node_attr(obj).get('type') == 'array')
                # loop through object's property object nodes
                # if it's a wildcard object, include its prototype
                prop_obj_nodes = G.get_prop_obj_nodes(obj,
                    branches=extra.branches, numeric_only=numeric_only,
                    exclude_proto=not is_wildcard_obj(G, obj))
                if is_wildcard_obj(G, obj):
                    # wildcard property for wildcard object
                    wildcard_prop_obj_nodes = G.get_prop_obj_nodes(obj,
                        prop_name=wildcard, branches=extra.branches)
                    if not wildcard_prop_obj_nodes:
                        wildcard_prop_obj_nodes = [G.add_obj_as_prop(wildcard,
                            node_id, value=wildcard, parent_obj=obj)]
                    prop_obj_nodes.extend(wildcard_prop_obj_nodes)
                    prop_obj_nodes = list(set(prop_obj_nodes))
                    logger.debug(f'{obj} is a wildcard object.')
                # for v in prop_obj_nodes:
                #     G.for_stack.append('for-of {} {} {}'.format(node_id, v, G.get_node_attr(v).get("code")))
                #     print(G.for_stack)
                #     # assign the object node to the loop variable
                #     logger.debug(f'For-of loop variables: {sty.ef.i}{handled_value.name}{sty.rs.all}: {sty.fg.green}{v}{sty.rs.all}: {G.get_node_attr(v).get("code")}'
                #         f' from obj {obj}')
                #     G.assign_obj_nodes_to_name_node(handled_value.name_nodes[0],
                #         [v], branches=extra.branches)
                #     # run the body
                #     simurun_block(G, body, branches=extra.branches)
                #     G.for_stack.pop()

                G.for_stack.append('for-of {} {} {}'.format(node_id, prop_obj_nodes, [G.get_node_attr(v).get("code") for v in prop_obj_nodes]))
                # print(G.for_stack)
                # assign the object node to the loop variable
                G.assign_obj_nodes_to_name_node(handled_value.name_nodes[0],
                    prop_obj_nodes, branches=extra.branches)
                # run the body
                simurun_block(G, body, branches=extra.branches)
                G.for_stack.pop()
                logger.debug('For-of loop {} finished'.format(node_id))
        # switch back the scope
        G.cur_scope = parent_scope

    elif cur_type == 'AST_WHILE':
        try:
            test, body = G.get_ordered_ast_child_nodes(node_id)[:2]
        except ValueError as e:
            for n in G.get_ordered_ast_child_nodes(node_id):
                logger.error(n, G.get_node_attr(n))
        # test = G.get_ordered_ast_child_nodes(test)[0] # wrongly influenced by for?
        # switch scopes
        parent_scope = G.cur_scope
        G.cur_scope = G.add_scope('BLOCK_SCOPE', decl_ast=body,
                      scope_name=G.scope_counter.gets(f'Block{body}'))
        counter = 0
        while True:
            check_result, deterministic = check_condition(G, test, extra,
                handling_func=handle_node) # check if the condition is met
            logger.debug('While loop condition {} result: {} {}'.format(
                sty.ef.i + G.get_node_attr(test).get('code') + sty.rs.all,
                check_result, deterministic))
            # avoid infinite loop
            if (not deterministic and counter > 3) or check_result == 0 or \
                counter > 10:
                logger.debug('For loop {} finished'.format(node_id))
                break
            simurun_block(G, body, branches=extra.branches) # run the body
            counter += 1
        # switch back the scope
        G.cur_scope = parent_scope

    elif cur_type in ['AST_PRE_INC', 'AST_POST_INC', 'AST_PRE_DEC', 'AST_POST_DEC']:
        child = G.get_ordered_ast_child_nodes(node_id)[0]
        handled_child = handle_node(G, child, extra)
        returned_values = []
        sources = []
        for name_node in handled_child.name_nodes:
            updated_objs = []
            for obj in G.get_objs_by_name_node(name_node, extra.branches):
                v = G.get_node_attr(obj).get('code')
                if v == wildcard or v is None:
                    continue
                n = val_to_float(v)
                if 'POST' in cur_type:
                    returned_values.append(n)
                else:
                    if 'INC' in cur_type:
                        returned_values.append(n + 1)
                    else:
                        returned_values.append(n - 1)
                sources.append([obj])
                if 'INC' in cur_type:
                    new_value = n + 1
                else:
                    new_value = n - 1
                updated_objs.append(G.add_obj_node(
                        G.get_obj_def_ast_node(obj), 'number', new_value))
            G.assign_obj_nodes_to_name_node(name_node, updated_objs,
                branches=extra.branches)
        returned_values, sources = combine_values(returned_values, sources)
        return NodeHandleResult(values=returned_values, value_sources=sources)

    elif cur_type == 'AST_UNARY_OP':
        child = G.get_ordered_ast_child_nodes(node_id)[0]
        handled = handle_node(G, child, extra)
        values, sources, _ = to_values(G, handled)
        new_values = []
        for v in values:
            if v == wildcard or v is None:
                new_values.append(v)
                continue
            v = val_to_float(v)
            if v != float('nan') and G.get_node_attr(node_id).get(
                    'flags:string[]') == 'UNARY_MINUS':
                new_values.append(-v)
            else:
                new_values.append(v)
        logger.debug(f'New values: {new_values}')
        return NodeHandleResult(values=new_values, value_sources=sources)

    # handle registered functions      # deprecated
    # if "HAVE_FUNC" in cur_node_attr:
    #     for func_decl_id in registered_func[node_id]:
    #         logger.info(sty.ef.inverse + sty.fg.red + "RUN register {}".format(func_decl_id) + sty.rs.all)
    #         handle_node(G, func_decl_id, extra)

    return NodeHandleResult()

def decl_vars_and_funcs(G, ast_node, var=True, func=True):
    # pre-declare variables and functions
    func_scope = G.find_ancestor_scope()
    children = G.get_ordered_ast_child_nodes(ast_node)
    for child in children:
        node_type = G.get_node_attr(child)['type']
        if var and node_type == 'AST_VAR' and \
            G.get_node_attr(child)['flags:string[]'] == 'JS_DECL_VAR':
            # var a;
            name = G.get_name_from_child(child)
            if G.get_name_node(name, scope=func_scope,
                               follow_scope_chain=False) is None:
                G.add_obj_to_scope(name=name, scope=func_scope,
                                   tobe_added_obj=G.undefined_obj)
        elif var and node_type == 'AST_ASSIGN':
            # var a = ...;
            children = G.get_ordered_ast_child_nodes(child)
            if G.get_node_attr(children[0])['type'] == 'AST_VAR' and \
                G.get_node_attr(children[0])['flags:string[]'] == 'JS_DECL_VAR':
                name = G.get_name_from_child(children[0])
                # if name node does not exist, add a name node in the scope
                # and assign it to the undefined object
                if G.get_name_node(name, scope=func_scope,
                                   follow_scope_chain=False) is None:
                    G.add_obj_to_scope(name=name, scope=func_scope,
                                       tobe_added_obj=G.undefined_obj)
                else:
                    pass
        elif func and node_type == 'AST_FUNC_DECL':
            func_name = G.get_name_from_child(child)
            func_obj = decl_function(G, child, obj_parent_scope=func_scope)
        # elif node_type == 'AST_STMT_LIST':
        #     decl_vars_and_funcs(G, child, var=var, func=func)
        elif node_type in ['AST_IF', 'AST_IF_ELEM', 'AST_FOR', 'AST_FOREACH',
            'AST_WHILE', 'AST_SWITCH', 'AST_SWITCH_CASE', 'AST_EXPR_LIST']:
            decl_vars_and_funcs(G, child, var=var, func=False)

def simurun_function(G, func_ast, branches=None, block_scope=True,
    caller_ast=None):
    """
    Simurun a function by running its body.
    """
    if branches is None or G.single_branch:
        # create an instance of BranchTagContainer every time,
        # don't use default argument
        branches = BranchTagContainer()

    if caller_ast is not None:
        if G.call_counter[caller_ast] >= G.call_limit:
            logger.warning(f'{caller_ast}: Function {func_ast} in call stack '
                    f'{G.call_counter[caller_ast]} times, skip simulating')            
            return None, None # don't change this to [], []
                              # we need to distinguish skipped functions
        else:
            G.call_counter[caller_ast] += 1

    func_objs = G.get_func_decl_objs_by_ast_node(func_ast)
    func_obj = func_objs[0] if func_objs else '?'
    func_name = G.get_node_attr(func_obj).get('name') if func_objs else '?'
    logger.info(sty.ef.inverse + sty.fg.green +
        "FUNCTION {} {} STARTS, SCOPE {}, DECL OBJ {}, this OBJs {}, branches {}"
        .format(func_ast, func_name or '{anonymous}',
        G.cur_scope, func_obj, G.cur_objs,
        branches) + sty.rs.all)
    returned_objs, used_objs = [], []
    for child in G.get_child_nodes(func_ast, child_type='AST_STMT_LIST'):
        returned_objs, used_objs = simurun_block(G, child,
            parent_scope=G.cur_scope, branches=branches,
            block_scope=block_scope, decl_var=True)
        break

    if caller_ast is not None:
        G.call_counter[caller_ast] -= 1
    return returned_objs, used_objs

def simurun_block(G, ast_node, parent_scope=None, branches=None,
    block_scope=True, decl_var=False):
    """
    Simurun a block by running its statements one by one.
    A block is a BlockStatement in JavaScript,
    or an AST_STMT_LIST in PHP.
    """
    if branches is None:
        branches = BranchTagContainer()
    returned_objs = set()
    used_objs = set()
    if parent_scope == None:
        parent_scope = G.cur_scope
    if block_scope:
        G.cur_scope = \
            G.add_scope('BLOCK_SCOPE', decl_ast=ast_node,
                        scope_name=G.scope_counter.gets(f'Block{ast_node}'))
    logger.log(ATTENTION, 'BLOCK {} STARTS, SCOPE {}'.format(ast_node, G.cur_scope))
    decl_vars_and_funcs(G, ast_node, var=decl_var)
    stmts = G.get_ordered_ast_child_nodes(ast_node)
    # simulate statements
    for stmt in stmts:
        G.cur_stmt = stmt
        handled_res = handle_node(G, stmt, ExtraInfo(branches=branches))
        if G.finished:
            return [], []

        # if handled_res:
        #     stmt_used_objs = handled_res.used_objs
        #     build_df_by_def_use(G, stmt, stmt_used_objs)

        if G.get_node_attr(stmt)['type'] == 'AST_RETURN':
            stmt_returned_objs = to_obj_nodes(G, handled_res, ast_node=stmt)
            stmt_used_objs = handled_res.used_objs
            if stmt_returned_objs:
                returned_objs.update(stmt_returned_objs)
            if stmt_used_objs:
                used_objs.update(stmt_used_objs)
    if block_scope:
        G.cur_scope = parent_scope
    
    return list(returned_objs), list(used_objs)

def merge(G, stmt, num_of_branches, parent_branch):
    '''
    Merge two or more branches.
    
    Args:
        G: graph
        stmt: AST node ID of the if/switch statement.
        num_of_branches (int): number of branches.
        parent_branch (BranchTag): parent branch tag (if this branch is
            inside another branch statement).
     '''
    logger.debug(f'Merging branches in {stmt}')
    name_nodes = G.get_node_by_attr('labels:label', 'Name')
    for u in name_nodes:
        for v in G.get_child_nodes(u, 'NAME_TO_OBJ'):
            created = [False] * num_of_branches
            deleted = [False] * num_of_branches
            for key, edge_attr in G.graph[u][v].items():
                branch_tag = edge_attr.get('branch')
                if branch_tag and branch_tag.point == stmt:
                    if branch_tag.mark == 'A':
                        created[int(branch_tag.branch)] = True
                    if branch_tag.mark == 'D':
                        deleted[int(branch_tag.branch)] = True
            # logger.debug(f'{u}->{v}\ncreated: {created}\ndeleted: {deleted}')

            # We flatten Addition edges if they exist in any branch, because
            # the possibilities will continue to exist in parent branches.
            # We ignore those edges without tags related to current
            # statement.
            flag_created = any(created)
            # We always delete Deletion edges because they are useless in
            # parent branches.
            # If they exist in all current branches, the Addition edge in the
            # parent branch will be deleted (or maked by a Deletion edge).
            flag_deleted = deleted and all(deleted)

            # if flag_created or flag_deleted:
            #     logger.debug(f'{u}->{v}\ncreated: {created}\ndeleted: {deleted}')

            # we'll delete edges, so we save them in a list
            # otherwise the graph is changed and Python will raise an error
            edges = list(G.graph[u][v].items())

            # deleted all branch edges (both Addition and Deletion)
            for key, edge_attr in edges:
                branch_tag = edge_attr.get('branch', BranchTag())
                if branch_tag.point == stmt:
                    G.graph.remove_edge(u, v, key)

            # flatten Addition edges
            if flag_created:
                # logger.debug(f'add edge {u}->{v}, branch={stmt}')
                if parent_branch:
                    # add one addition edge with parent if/switch's (upper level's) tags
                    # logger.debug(f"create edge {u}->{v}, branch={BranchTag(parent_branch, mark='A')}")
                    G.add_edge(u, v, {'type:TYPE': 'NAME_TO_OBJ', 'branch': BranchTag(parent_branch, mark='A')})
                else:
                    # logger.debug(f'create edge {u}->{v}')
                    G.add_edge(u, v, {'type:TYPE': 'NAME_TO_OBJ'})

            # cancel out Deletion edges
            if flag_deleted:
                if parent_branch:
                    # find if there is any addition in parent if/switch (upper level)
                    flag = False
                    for key, edge_attr in list(G.graph[u][v].items()):
                        branch_tag = edge_attr.get('branch', BranchTag())
                        if branch_tag == BranchTag(parent_branch, mark='A'):
                            # logger.debug(f'delete edge {u}->{v}')
                            G.graph.remove_edge(u, v, key)
                            flag = True
                    # if there is not
                    if not flag:
                        # add one deletion edge with parent if/switch's (upper level's) tags
                        # logger.debug(f"create edge {u}->{v}, branch={BranchTag(parent_branch, mark='D')}")
                        G.add_edge(u, v, {'type:TYPE': 'NAME_TO_OBJ', 'branch': BranchTag(parent_branch, mark='D')})
                else:
                    # find if there is an addition in upper level
                    for key, edge_attr in list(G.graph[u][v].items()):
                        if 'branch' not in edge_attr:
                            # logger.debug(f'delete edge {u}->{v}')
                            G.graph.remove_edge(u, v, key)

def decl_function(G, node_id, func_name=None, obj_parent_scope=None,
    scope_parent_scope=None):
    '''
    Declare a function as an object node.
    
    Args:
        G (Graph): Graph.
        node_id: The function's AST node (AST_FUNC_DECL).
        func_name (str, optional): The function's name. Defaults to
            None, which means getting name from its AST children.
        obj_parent_scope (optional): Which scope the function object
            should be placed to. Defaults to current scope.
        scope_parent_scope (optional): Where the function's scopes
            should be put. See comments below. Defaults to current
            scope.
    
    Returns:
        added_obj: The function's object node.
    '''
    # for a function decl, if already visited, return
    # if "VISITED" in G.get_node_attr(node_id):
    #     return None

    if obj_parent_scope is None:
        obj_parent_scope = G.cur_scope
    if scope_parent_scope is None:
        scope_parent_scope = G.cur_scope
    if func_name is None:
        func_name = G.get_name_from_child(node_id)

    # add function declaration object
    added_obj = G.add_obj_node(node_id, "function")
    G.set_node_attr(added_obj, ('name', func_name))
    # memorize its parent scope
    # Function scopes are not created when the function is declared.
    # Instead, they are created before each time the function is
    # executed. Because the function can be called in any scope but its
    # scope should be put under where it is defined, we need to memorize
    # its original parent scope.
    G.set_node_attr(added_obj, ('parent_scope', scope_parent_scope))

    if func_name is not None and func_name != '{closure}':
        G.add_obj_to_scope(name=func_name, scope=obj_parent_scope,
            tobe_added_obj=added_obj)
        G.add_obj_as_prop('name', node_id, 'string', func_name, added_obj)

    param_list = G.get_child_nodes(node_id, edge_type='PARENT_OF',
        child_type='AST_PARAM_LIST')
    params = G.get_ordered_ast_child_nodes(param_list)
    length = len(params)
    if length > 0:
        if G.get_node_attr(params[-1]).get('flags:string[]') \
            == 'PARAM_VARIADIC':
            length -= 1
    G.add_obj_as_prop('length', node_id, 'number', length, added_obj)

    # G.set_node_attr(node_id, ("VISITED", "1"))
    logger.debug(f'{sty.ef.b}Declare function{sty.rs.all} {func_name} as {added_obj}')

    return added_obj

def run_toplevel_file(G: Graph, node_id):
    """
    run a top level file 
    return a obj and scope
    """
    # switch current file path
    file_path = G.get_node_attr(node_id)['name']

    # loop call
    if file_path in G.file_stack:
        return None
    G.file_stack.append(file_path)
    print(G.file_stack)
    previous_file_path = G.cur_file_path
    G.cur_file_path = file_path
    if G.entry_file_path is None:
        G.entry_file_path = file_path
    logger.info(sty.fg(173) + sty.ef.inverse + 'FILE {} BEGINS'.format(file_path) + sty.rs.all)

    # add function object and scope
    func_decl_obj = decl_function(G, node_id, func_name=file_path,
        obj_parent_scope=G.BASE_SCOPE, scope_parent_scope=G.BASE_SCOPE)
    func_scope = G.add_scope(scope_type='FILE_SCOPE', decl_ast=node_id,
        scope_name=G.scope_counter.gets(f'File{node_id}'),
        decl_obj=func_decl_obj, func_name=file_path, parent_scope=G.BASE_SCOPE)

    backup_scope = G.cur_scope
    G.cur_scope = func_scope
    backup_stmt = G.cur_stmt

    # add module object to the current file's scope
    added_module_obj = G.add_obj_to_scope("module", node_id)
    # add module.exports
    added_module_exports = G.add_obj_as_prop("exports", node_id,
        parent_obj=added_module_obj)
    # add module.exports as exports
    G.add_obj_to_scope(name="exports", tobe_added_obj=added_module_exports)
    # "this" is set to module.exports by default
    # backup_objs = G.cur_objs
    # G.cur_objs = added_module_exports
    # TODO: this is risky
    G.add_obj_to_scope(name="this", tobe_added_obj=added_module_exports)

    # simurun the file
    simurun_function(G, node_id, block_scope=True)

    # get current module.exports
    # because module.exports may be assigned to another object
    # TODO: test if module is assignable
    module_obj = G.get_objs_by_name('module')[0]
    module_exports_objs = G.get_prop_obj_nodes(parent_obj=module_obj,
        prop_name='exports')
    #final_exported_objs = []
    #for obj in module_exports_objs:
    #    final_exported_objs = final_exported_objs + G.get_prop_obj_nodes_recur(parent_obj=obj)


    # switch back scope, object, path and statement AST node id
    G.cur_scope = backup_scope
    # G.cur_objs = backup_objs
    G.cur_file_path = previous_file_path
    G.cur_stmt = backup_stmt

    G.file_stack.pop(-1)

    return module_exports_objs

def handle_require_legacy(G, node_id, extra=None):
    '''
    Returns:
        List: returned module.exports objects. we need to list the exported functions recursively
    '''
    # handle module name
    arg_list = G.get_ordered_ast_child_nodes(
        G.get_ordered_ast_child_nodes(node_id)[-1] )
    handled_module_name = handle_node(G, arg_list[0], extra)
    module_names = to_values(G, handled_module_name, node_id)[0]
    if not module_names: return []

    returned_objs = set()
    for module_name in module_names:
        if module_name in modeled_builtin_modules.modeled_modules \
            and G.vul_type != "path_traversal":
            # Python-modeled built-in modules
            # for now mostly fs
            # if it's path_traversal, do not do this
            returned_objs.add(
                modeled_builtin_modules.get_module(G, module_name))
        else:
            # actual JS modules
            # static require (module name is a literal)
            # module's path is in 'name' field
            file_path = G.get_node_attr(node_id).get('name')
            module_exports_objs = []
            if module_name and file_path:
                module_exports_objs = \
                    get_module_exports(G, file_path)
            # dynamic require (module name is a variable)
            if module_name is None or module_name == wildcard:
                logger.error('{} trying to require unknown package.'
                    .format(node_id))
                continue
            if not module_exports_objs:
                # check if the file's AST is in the graph
                file_path, _ = \
                    esprima_search(module_name, G.get_cur_file_path(),
                        print_func=logger.info)
                if not file_path: # module not found
                    continue
                elif file_path == 'built-in': # unmodeled built-in module
                    continue
                else:
                    module_exports_objs = \
                        get_module_exports(G, file_path)
            if not module_exports_objs:
                # if the file's AST is not in the graph,
                # generate its AST and run it
                logger.log(ATTENTION, f'Generating AST on demand for module '
                    f'{module_name} at {file_path}...')

                # following code is copied from analyze_files,
                # consider combining in future.
                start_id = str(G.cur_id)
                result = esprima_parse(file_path, ['-n', start_id, '-o', '-'],
                    print_func=logger.info)
                G.import_from_string(result)
                # start from the AST_TOPLEVEL node instead of the File node
                module_exports_objs = \
                        run_toplevel_file(G, str(int(start_id) + 1))
                G.set_node_attr(start_id,
                    ('module_exports', module_exports_objs))
            if module_exports_objs:
                returned_objs.update(module_exports_objs)
            else:
                logger.error("Required module {} at {} not found!".format(
                    module_name, file_path))
    return list(returned_objs)

def handle_require(G: Graph, caller_ast, extra, _, module_names):
    # handle module name
    module_names, src, _ = to_values(G, module_names, caller_ast)
    if not module_names: return NodeHandleResult(obj_nodes=[])

    returned_objs = set()
    for module_name in module_names:
        if module_name in modeled_builtin_modules.modeled_modules \
            and G.vul_type != "path_traversal":
            # Python-modeled built-in modules
            # for now mostly fs
            # if it's path_traversal, do not do this
            returned_objs.add(
                modeled_builtin_modules.get_module(G, module_name))
        else:
            # actual JS modules
            # static require (module name is a literal)
            # module's path is in 'name' field
            file_path = G.get_node_attr(caller_ast).get('name')
            module_exports_objs = []
            if module_name and file_path:
                module_exports_objs = \
                    get_module_exports(G, file_path)
            # dynamic require (module name is a variable)
            if module_name is None or module_name == wildcard:
                logger.error('{} trying to require unknown package.'
                    .format(caller_ast))
                continue
            if not module_exports_objs:
                # check if the file's AST is in the graph
                file_path, _ = \
                    esprima_search(module_name, G.get_cur_file_path(),
                        print_func=logger.info)
                if not file_path: # module not found
                    continue
                elif file_path == 'built-in': # unmodeled built-in module
                    continue
                else:
                    module_exports_objs = \
                        get_module_exports(G, file_path)
            if not module_exports_objs:
                # if the file's AST is not in the graph,
                # generate its AST and run it
                logger.log(ATTENTION, f'Generating AST on demand for module '
                    f'{module_name} at {file_path}...')

                # following code is copied from analyze_files,
                # consider combining in future.
                start_id = str(G.cur_id)
                result = esprima_parse(file_path, ['-n', start_id, '-o', '-'],
                    print_func=logger.info)
                G.import_from_string(result)
                # start from the AST_TOPLEVEL node instead of the File node
                module_exports_objs = \
                        run_toplevel_file(G, str(int(start_id) + 1))
                G.set_node_attr(start_id,
                    ('module_exports', module_exports_objs))
            if module_exports_objs:
                returned_objs.update(module_exports_objs)
            else:
                logger.error("Required module {} at {} not found!".format(
                    module_name, file_path))
        
    returned_objs = list(returned_objs)
    if returned_objs and G.run_all:
        run_exported_functions(G, returned_objs, extra)

    # for a require call, we need to run traceback immediately
    if G.exit_when_found:
        vul_type = G.vul_type
        res_path = traceback(G, vul_type)
        res_path = vul_checking(G, res_path[0], vul_type)
        if len(res_path) != 0:
            G.finished = True
    return NodeHandleResult(obj_nodes=returned_objs,
                            used_objs=list(chain(*src)))

def get_module_exports(G, file_path):
    toplevel_nodes = G.get_nodes_by_type_and_flag(
        'AST_TOPLEVEL', 'TOPLEVEL_FILE')
    found = False
    for node in toplevel_nodes:
        if G.get_node_attr(node).get('name') == file_path:
            found = True
            # if a file has been required, skip the run and return
            # the saved module.exports
            saved_module_exports = G.get_node_attr(node).get('module_exports')
            if saved_module_exports != None:
                module_exports_objs = saved_module_exports
                logger.log(ATTENTION, 'File has been required, '
                    'return saved module.exports {} for {}'
                    .format(module_exports_objs, file_path))
                break
            else:
                module_exports_objs = run_toplevel_file(G, node)
                G.set_node_attr(node,
                    ('module_exports', module_exports_objs))
                break
    if found:
        return module_exports_objs
    else:
        return []

def run_exported_functions(G, module_exports_objs, extra):
    exported_objs = G.get_prop_obj_nodes(module_exports_objs[0])
    exported_objs += module_exports_objs

    #print("======================", module_exports_objs, exported_objs)
    # if len(exported_objs) == 0:
        # we only have one exported funcs
    #    exported_objs = module_exports_objs

    # print(exported_objs, '===========')
    # some times the returned obj only has one obj
    # exported_objs.append(module_exports_objs[0])

    while(len(exported_objs) != 0):
        obj = exported_objs.pop()
        parent_obj = None
        if type(obj) == type((1,2)):
            parent_obj = obj[0]
            obj = obj[1]
        if not parent_obj:
            parent_obj = obj

        if 'pythonfunc' in G.get_node_attr(obj):
            continue

        if obj in G.require_obj_stack:
            continue
        G.require_obj_stack.append(obj)
        newed_objs = None
        returned_objs = None
        if G.get_node_attr(obj).get("init_run") is not None:
            continue
        if G.get_node_attr(obj).get('type') != 'function':
            continue
        # some times they write exports= new foo() eg. libnmap
        logger.log(ATTENTION, 'Run exported function {}'.format(obj))
        # if G.function_time_limit:
        if False:
            try:
                returned_result, newed_objs = func_timeout(
                    G.function_time_limit, call_function,
                    args=(G, [obj]),
                    kwargs={
                        'this':
                            NodeHandleResult(obj_nodes=[parent_obj]),
                        'extra': extra, 'is_new': True,
                        'mark_fake_args': True
                    })
            except FunctionTimedOut:
                continue
        else:
            # func_timeout may cause threading problems
            returned_result, newed_objs = call_function(G, [obj],
                this=NodeHandleResult(obj_nodes=[parent_obj]),
                extra=extra, is_new=True, mark_fake_args=True
            )

        if newed_objs is None:
            newed_objs = [obj] 

        G.set_node_attr(obj, ('init_run', "True"))
        # include newed objects and return objects
        if returned_result is not None:
            newed_objs.extend(returned_result.obj_nodes)
        # we may have prototype functions:
        for newed_obj in newed_objs:
            proto_obj = G.get_prop_obj_nodes(parent_obj=newed_obj, 
                    prop_name='__proto__')
            generated_objs = \
                G.get_prop_obj_nodes(parent_obj=newed_obj)
            generated_objs += \
                G.get_prop_obj_nodes(parent_obj=proto_obj)
            # newed obj haven't been run
            generated_objs.append(newed_obj)
            for obj in generated_objs:
                if G.get_node_attr(obj).get('type') == 'function':
                    #print(obj, G.get_node_attr(obj))
                    exported_objs.append((newed_obj, obj))

def ast_call_function(G, ast_node, extra):
    '''
    Call a function (AST_CALL/AST_METHOD_CALL/AST_NEW).
    
    Args:
        G (Graph): graph
        ast_node: the Call/New expression's AST node.
        extra (ExtraInfo): extra information.

    Returns:
        NodeHandleResult: Returned objects and used objects.
    '''
    if G.finished:
        return NodeHandleResult()

    # handle the callee and parent object (for method calls)
    handled_parent = None
    if G.get_node_attr(ast_node).get('type') == 'AST_METHOD_CALL':
        handled_callee, handled_parent = handle_prop(G, ast_node, extra)
    else:
        callee = G.get_ordered_ast_child_nodes(ast_node)[0]
        handled_callee = handle_node(G, callee, extra)

    # require is now handled as a built-in function
    # if handled_callee.name == 'require':
    #     module_exports_objs = handle_require_legacy(G, ast_node)
    #     # print(G.get_name_from_child(ast_node), module_exports_objs, G.get_node_file_path(ast_node))
    #     # run the exported objs immediately
    #     if module_exports_objs and G.run_all:
    #         run_exported_functions(G, module_exports_objs, extra)

    #     # for a require call, we need to run traceback immediately
    #     if G.exit_when_found:
    #         vul_type = G.vul_type
    #         res_path = traceback(G, vul_type)
    #         res_path = vul_checking(G, res_path[0], vul_type)
    #         if len(res_path) != 0:
    #             G.finished = True
    #     return NodeHandleResult(obj_nodes=module_exports_objs,
    #                             used_objs=handled_callee.obj_nodes)

    # handle arguments
    handled_args = []
    arg_list_node = G.get_ordered_ast_child_nodes(ast_node)[-1]
    arg_list = G.get_ordered_ast_child_nodes(arg_list_node)
    for arg in arg_list:
        handled_arg = handle_node(G, arg, extra)
        handled_args.append(handled_arg)

    # typeof and detele
    if G.get_node_attr(ast_node).get('flags:string[]') == 'JS_TYPEOF':
        types = defaultdict(lambda: [])
        if handled_args:
            for obj in handled_args[0].obj_nodes:
                if G.get_node_attr(obj).get('type') == 'array':
                    types['object'].append(obj)
                # should we consider wildcard objects' type as 
                # wildcard or fixed "object"?
                elif (G.get_node_attr(obj).get('type') == 'object' and
                    G.get_node_attr(obj).get('code') == wildcard):
                    types[wildcard].append(obj)
                else:
                    types[G.get_node_attr(obj).get('type')].append(obj)
            for i, val in enumerate(handled_args[0].values):
                if type(val) in ['int', 'float']:
                    types['number'].extend(handled_args[0].value_sources[i])
                elif type(val) == 'str':
                    types['string'].extend(handled_args[0].value_sources[i])
                else:
                    types['object'].extend(handled_args[0].value_sources[i])
        # returned_objs = []
        # used_objs = []
        returned_values = []
        returned_value_sources = []
        for t, sources in types.items():
            # added_obj = G.add_obj_node(ast_node, 'string', t)
            # for s in sources:
            #     add_contributes_to(G, [s], added_obj)
            # returned_objs.append(added_obj)
            # used_objs.extend(sources)
            returned_values.append(t)
            returned_value_sources.append(sources)
        return NodeHandleResult(values=returned_values, 
                                value_sources=returned_value_sources)
    elif G.get_node_attr(ast_node).get('flags:string[]') == 'JS_DELETE':
        if handled_args:
            for name_node in handled_args[0].name_nodes:
                for obj in handled_args[0].obj_nodes:
                    G.remove_all_edges_between(name_node, obj)
        return NodeHandleResult()

    # find function declaration objects
    func_decl_objs = list(filter(lambda x: x != G.undefined_obj and
        x != G.null_obj, handled_callee.obj_nodes))
    func_name = handled_callee.name
    # add blank functions
    if not func_decl_objs:
        if handled_callee.name_nodes:
            for name_node in handled_callee.name_nodes:
                func_decl_obj = G.add_blank_func_with_og_nodes(
                    func_name or '{anonymous}')
                G.add_obj_to_name_node(name_node, tobe_added_obj=func_decl_obj)
                func_decl_objs.append(func_decl_obj)
        else:
            logger.error(f'Function call error: Name node not found for {func_name}!')

    
    is_new = False # if the function call is creating a new object
    if G.get_node_attr(ast_node).get('type') == 'AST_CALL':
        stmt_id = 'Call' + ast_node + '-' + get_random_hex()
    elif G.get_node_attr(ast_node).get('type') == 'AST_METHOD_CALL':
        stmt_id = 'Call' + ast_node + '-' + get_random_hex()
        parent = G.get_ordered_ast_child_nodes(ast_node)[0]
    elif G.get_node_attr(ast_node).get('type') == 'AST_NEW':
        stmt_id = 'New' + ast_node + '-' + get_random_hex()
        is_new = True
    returned_result, created_objs = \
        call_function(G, func_decl_objs, handled_args,
        handled_parent, extra, caller_ast=ast_node, is_new=is_new,
        stmt_id=stmt_id, func_name=func_name)
    if is_new:
        returned_result.obj_nodes = created_objs
    return returned_result

def call_function(G, func_objs, args=[], this=NodeHandleResult(), extra=None,
    caller_ast=None, is_new=False, stmt_id='Unknown', func_name='{anonymous}',
    mark_fake_args=False):
    '''
    Directly call a function.
    
    Args:
        G (Graph): Graph.
        func_objs: List of function declaration objects.
        args (List[NodeHandleResult]): List of handled arguments.
        this (NodeHandleResult): Handled override "this" object.
        extra (ExtraInfo, optional): Extra information. Defaults to
            empty ExtraInfo.
        caller_ast (optional): The caller's AST node. Defaults to None.
        is_new (bool, optional): If the caller is a "new" statement.
            Defaults to False.
        stmt_id (str, optional): Caller's statement ID, for branching
            use only. Defaults to 'Unknown'.
        func_name (str, optional): The function's name, for adding blank
            functions only. Defaults to '{anonymous}'.
    
    Returns:
        NodeHandleResult, List: Call result (including returned objects
            and used objects), and list of used objects.
    '''
    if G.finished:
        return NodeHandleResult(), []

    # No function objects found, return immediately
    if not func_objs:
        logger.error(f'No definition found for function {func_name}')
        return NodeHandleResult(), []

    if extra is None:
        extra = ExtraInfo()

    # process arguments
    callback_functions = set() # only for unmodeled built-in functions
    for arg in args:
        # add callback functions
        for obj in arg.obj_nodes:
            if G.get_node_attr(obj).get('type') == 'function':
                callback_functions.add(obj)

    # if the function declaration has multiple possibilities,
    # and need to merge afterwards
    has_branches = (len(func_objs) > 1 and not G.single_branch)

    G.call_stack.append('{} {} {}'.format(caller_ast, func_name, len(func_objs)))
    # print(G.call_stack)

    if stmt_id == 'Unknown' and caller_ast is not None:
        stmt_id = caller_ast

    # initiate return values
    returned_objs = set()
    used_objs = set()
    created_objs = []
    returned_values = [] # for python function only
    returned_value_sources = [] # for python function only

    # initiate fake return objects (only create once)
    fake_returned_obj = None
    fake_created_obj = None

    # if any function is run in this call
    any_func_run = False
    # if any function is skipped in this call
    any_func_skipped = False

    # for each possible function declaration
    for i, func_obj in enumerate(func_objs):
        # copy "this" and "args" references
        # because we may edit them later
        # and we want to keep original "this" and "args"
        _this = this
        _args = list(args) if args is not None else None
        # bound functions
        func_obj_attrs = G.get_node_attr(func_obj)
        if func_obj_attrs.get('target_func'):
            _this = func_obj_attrs.get('bound_this')
            logger.log(ATTENTION, 'Bound function found ({}->{}), this={}'.format(func_obj_attrs.get('target_func'), func_obj, _this.obj_nodes))
            if func_obj_attrs.get('bound_args') is not None:
                _args = func_obj_attrs.get('bound_args')
            func_obj = func_obj_attrs.get('target_func')
        
        # pass arguments' used objects to the function call
        # for arg in _args:
        #     used_objs.update(arg.used_objs)

        if func_obj in G.internal_objs.values():
            logger.warning('Error: Trying to run an internal obj {} {}'
                ', skipped'.format(func_obj, G.inv_internal_objs[func_obj]))
            continue
        any_func_run = True

        # manage branches
        branches = extra.branches
        parent_branch = branches.get_last_choice_tag()
        # if branches exist, add a new branch tag to the list
        if has_branches and not G.single_branch:
            next_branches = branches+[BranchTag(point=stmt_id, branch=i)]
        else:
            next_branches = branches

        branch_returned_objs = []
        branch_created_obj = None
        branch_used_objs = []
        func_ast = G.get_obj_def_ast_node(func_obj, aim_type='function')
        # check if python function exists
        python_func = G.get_node_attr(func_obj).get('pythonfunc')
        if python_func: # special Python function
            if is_new:
                if func_obj in []:
                    logger.log(ATTENTION, f'Running Python function {func_obj} {python_func}...')
                    try:
                        h = python_func(G, caller_ast, ExtraInfo(extra,
                            branches=next_branches), _this, *_args)
                        created_objs.extend(h.obj_nodes)
                        branch_used_objs = h.used_objs
                    except TypeError as e:
                        logger.error(tb.format_exc())
                else:
                    logger.error(f'Error: try to new Python function {func_obj} {python_func}...')
                    continue
            else:
                logger.log(ATTENTION, f'Running Python function {func_obj} {python_func}...')
                try:
                    h = python_func(G, caller_ast,
                        ExtraInfo(extra, branches=next_branches), _this, *_args)
                    branch_returned_objs = h.obj_nodes
                    # the obj_nodes may be node list
                    if type(branch_returned_objs) != list:
                        branch_returned_objs = [branch_returned_objs]
                    branch_used_objs = h.used_objs
                    returned_values.extend(h.values)
                    returned_value_sources.extend(h.value_sources)
                except TypeError as e:
                    logger.error(tb.format_exc())
        else: # JS function in AST
            # if AST cannot be found, create AST
            if func_ast is None or G.get_node_attr(func_ast).get('type') \
            not in ['AST_FUNC_DECL', 'AST_CLOSURE']:
                G.add_blank_func_with_og_nodes(func_name, func_obj)
                func_ast = G.get_obj_def_ast_node(func_obj, aim_type='function')
            # add function scope (see comments in decl_function)
            parent_scope = G.get_node_attr(func_obj).get('parent_scope')
            func_scope = G.add_scope('FUNC_SCOPE', func_ast,
                f'Function{func_ast}:{caller_ast}', func_obj,
                caller_ast, func_name, parent_scope=parent_scope)
            # make arguments available in the function
            param_list = G.get_child_nodes(func_ast, edge_type='PARENT_OF',
                child_type='AST_PARAM_LIST')
            params = G.get_ordered_ast_child_nodes(param_list)
            # add "arguments" array
            arguments_obj = G.add_obj_to_scope(name='arguments',
                    js_type='array', scope=func_scope, ast_node=func_ast)
            j = 0
            while j < len(params) or j < len(_args) or j < 3:
                if j < len(_args):
                    arg_obj_nodes = to_obj_nodes(G, _args[j], caller_ast)
                    # add argument to "arguments"
                    for obj in arg_obj_nodes:
                        G.add_obj_as_prop(prop_name=str(j),
                            parent_obj=arguments_obj, tobe_added_obj=obj)
                    # add argument to the parameter
                    if j < len(params):
                        param = params[j]
                        param_name = G.get_name_from_child(param)
                        if G.get_node_attr(param).get('flags:string[]') \
                            == 'PARAM_VARIADIC':
                            arr = G.add_obj_to_scope(param_name,
                                caller_ast or param, 'array', scope=func_scope)
                            length = 0
                            while j < len(_args):
                                logger.debug(f'add arg {param_name}[{length}]'
                                    f' <- {arg_obj_nodes}, scope {func_scope}')
                                for obj in arg_obj_nodes:
                                    G.add_obj_as_prop(str(length),
                                        parent_obj=arr, tobe_added_obj=obj)
                                j += 1
                                length += 1
                            G.add_obj_as_prop('length', js_type='number',
                                value=length, parent_obj=arr)
                        else:
                            logger.debug(f'add arg {param_name} <- '
                                f'{arg_obj_nodes}, scope {func_scope}')
                            for obj in arg_obj_nodes:
                                G.add_obj_to_scope(name=param_name,
                                    scope=func_scope, tobe_added_obj=obj)
                    else:
                        # this is used to print logs only
                        logger.debug(f'add arg arguments[{j}] <- '
                            f'{arg_obj_nodes}, scope {func_scope}')
                elif j < len(params) and mark_fake_args:
                    param = params[j]
                    param_name = G.get_name_from_child(param)
                    # add dummy arguments
                    param_name = G.get_name_from_child(param)
                    if G.get_node_attr(param).get('flags:string[]') \
                        == 'PARAM_VARIADIC':
                        # rest parameter (variable length arguments)
                        added_obj = G.add_obj_to_scope(name=param_name,
                            scope=func_scope, ast_node=caller_ast or param,
                            js_type='array')
                        elem = G.add_obj_as_prop(wildcard, caller_ast or param,
                            value=wildcard, parent_obj=added_obj)
                        if mark_fake_args:
                            G.set_node_attr(elem, ('tainted', True))
                            logger.debug("{} marked as tainted 2".format(elem))
                    else:
                        added_obj = G.add_obj_to_scope(name=param_name,
                            scope=func_scope, ast_node=caller_ast or param,
                            # give __proto__ when checking prototype pollution
                            js_type='object' if G.check_proto_pollution
                            else None, value=wildcard)
                    if mark_fake_args:
                        G.set_node_attr(added_obj, ('tainted', True))
                        logger.debug("{} marked as tainted 3".format(added_obj))
                    G.add_obj_as_prop(prop_name=str(j),
                        parent_obj=arguments_obj, tobe_added_obj=added_obj)

                    logger.debug(f'add arg {param_name} <- new obj {added_obj}, '
                            f'scope {func_scope}, ast node {param}')
                elif j < 3:
                    # in case the function only use "arguments"
                    # but no parameters in its declaration
                    added_obj = G.add_obj_node(ast_node=caller_ast,
                        # give __proto__ when checking prototype pollution
                        js_type='object' if G.check_proto_pollution
                        else None, value=wildcard)
                    if mark_fake_args:
                        G.set_node_attr(added_obj, ('tainted', True))
                        logger.debug("{} marked as tainted 4".format(added_obj))
                    G.add_obj_as_prop(prop_name=str(j),
                        parent_obj=arguments_obj, tobe_added_obj=added_obj)
                    logger.debug(f'add arguments[{j}] <- new obj {added_obj}, '
                                f'scope {func_scope}, ast node {caller_ast}')
                else:
                    break
                j += 1
            arguments_length_obj = G.add_obj_as_prop(prop_name='length',
                 parent_obj=arguments_obj, value=j, js_type='number')

            # if the function is defined in a for loop, restore the branches
            # this design is obsolete
            # for_tags = \
            #     BranchTagContainer(G.get_node_attr(func_obj).get('for_tags',
            #     BranchTagContainer())).get_creating_for_tags()
            # if for_tags:
            #     for_tags = [BranchTag(i, mark=None) for i in for_tags]
            #     next_branches.extend(for_tags)
            # logger.debug(f'next branch tags: {next_branches}')

            # switch scopes ("new" will swtich scopes and object by itself)
            backup_scope = G.cur_scope
            G.cur_scope = func_scope
            backup_stmt = G.cur_stmt
            # run simulation -- create the object, or call the function
            if is_new:
                branch_created_obj, branch_returned_objs = instantiate_obj(G,
                    caller_ast, func_ast, branches=next_branches)
                # tmp fix TODO
                if branch_returned_objs is None:
                    branch_returned_objs = []
            else:
                backup_objs = G.cur_objs
                if _this:
                    G.cur_objs = _this.obj_nodes
                else:
                    G.cur_objs = [G.BASE_OBJ]
                branch_returned_objs, branch_used_objs = simurun_function(
                    G, func_ast, branches=next_branches, caller_ast=caller_ast)
                G.cur_objs = backup_objs
            # switch back scopes
            G.cur_scope = backup_scope
            G.cur_stmt = backup_stmt

            # if it's an unmodeled built-in function
            if G.get_node_attr(func_ast).get('labels:label') \
                == 'Artificial_AST':
                # logger.info(sty.fg.green + sty.ef.inverse + func_ast + ' is unmodeled built-in function.' + sty.rs.all)
                if branch_used_objs is None: # in case it's skipped
                    branch_used_objs = []
                if branch_returned_objs is None: # in case it's skipped
                    branch_returned_objs = []
                # add arguments as used objects
                for h in _args:
                    branch_used_objs.extend(h.obj_nodes)
                if this is not None:
                    # performance is too low
                    # for o in G.get_ancestors_in(func_obj, edge_types=[
                    #     'NAME_TO_OBJ', 'OBJ_TO_PROP'],
                    #     candidates=this.obj_nodes, step=2):
                    #     branch_used_objs.append(o)
                    branch_used_objs.extend(this.obj_nodes)
                # add a blank object as return object
                if fake_returned_obj is None:
                    fake_returned_obj = \
                        G.add_obj_node(caller_ast, "object", wildcard)
                branch_returned_objs.append(fake_returned_obj)
                for obj in branch_used_objs:
                    add_contributes_to(G, [obj], fake_returned_obj)
                # add a blank object as created object
                if is_new and branch_created_obj is None:
                    if fake_created_obj is None:
                        fake_created_obj = \
                            G.add_obj_node(caller_ast, "object", wildcard)
                    branch_created_obj = fake_created_obj
                    for obj in branch_used_objs:
                        add_contributes_to(G, [obj], fake_created_obj)
                # call all callback functions
                if callback_functions:
                    logger.debug(sty.fg.green + sty.ef.inverse +
                        'callback functions = {}'.format(callback_functions)
                        + sty.rs.all)
                    
                    if _this is not None:
                        obj_attrs = [G.get_node_attr(obj) for obj in _this.obj_nodes]
                        mark_fake_args = any(['tainted' in attr for attr in obj_attrs])
                    else:
                        mark_fake_args = False

                    call_function(G, callback_functions, caller_ast=caller_ast,
                        extra=extra, stmt_id=stmt_id, mark_fake_args=mark_fake_args)
        
        if branch_returned_objs is None and branch_used_objs is None:
            any_func_skipped = True
        else:
            assert type(branch_returned_objs) is list
            assert type(branch_used_objs) is list
            returned_objs.update(branch_returned_objs)
            used_objs.update(branch_used_objs)
        assert type(branch_created_obj) is not list
        if branch_created_obj is not None:
            created_objs.append(branch_created_obj)
        # add call edge
        if caller_ast is not None and G.get_node_attr(func_ast).get('type')\
            in ['AST_FUNC_DECL', 'AST_CLOSURE']:
            G.add_edge_if_not_exist(caller_ast, func_ast, {"type:TYPE": "CALLS"})

    if has_branches and not G.single_branch:
        merge(G, stmt_id, len(func_objs), parent_branch)

    if not any_func_run:
        logger.error('Error: No function was run during this function call')

    G.call_stack.pop()

    return NodeHandleResult(obj_nodes=list(returned_objs),
            used_objs=list(used_objs),
            values=returned_values, value_sources=returned_value_sources,
            terminated=any_func_skipped
        ), created_objs

def get_df_callback(G, ast_node=None):
    if ast_node is None:
        cpg_node = G.cur_stmt
    else:
        cpg_node = G.find_nearest_upper_CPG_node(ast_node)
    return lambda result: build_df_by_def_use(G, cpg_node, result.used_objs)

def build_df_by_def_use(G, cur_stmt, used_objs):
    """
    Build data flows for objects used in current statement.
    The flow will be from the object's definition to current statement (current node).
    """
    if not used_objs or cur_stmt is None:
        return
    start_time = time.time()
    cur_lineno = G.get_node_attr(cur_stmt).get('lineno:int')
    # If an used object is a wildcard object, add its parent object as
    # used object too, until it is not a wildcard object.
    used_objs = list(used_objs)
    used_obj_set = set(used_objs)
    for obj in used_objs:
        node_attrs = G.get_node_attr(obj)
        if node_attrs.get('type') == 'object' and node_attrs.get('code') == wildcard:
            for e1 in G.get_in_edges(obj, edge_type='NAME_TO_OBJ'):
                for e2 in G.get_in_edges(e1[0], edge_type='OBJ_TO_PROP'):
                    # logger.debug("{}-----{}".format(cur_stmt, used_objs))
                    if e2[0] not in used_obj_set:
                        used_objs.append(e2[0])
                        used_obj_set.add(e2[0])
    for obj in used_objs:
        def_ast_node = G.get_obj_def_ast_node(obj)
        # print("?", cur_stmt, used_objs, def_ast_node)
        if def_ast_node is None: continue
        def_cpg_node = G.find_nearest_upper_CPG_node(def_ast_node)
        if def_cpg_node is None: continue
        if def_cpg_node == cur_stmt: continue
        def_lineno = G.get_node_attr(def_cpg_node).get('lineno:int')
        logger.info(sty.fg.li_magenta + sty.ef.inverse + "OBJ REACHES" + sty.rs.all +
        " {} -> {} (Line {} -> Line {}), by OBJ {}".format(def_cpg_node,
        cur_stmt, def_lineno, cur_lineno, obj))
        G.add_edge(def_cpg_node, cur_stmt, {'type:TYPE': 'OBJ_REACHES', 'obj': obj})
    # if time.time() - start_time > 0.1:
    #     print('df time = %.3f, %d' % (time.time() - start_time, len(used_objs)))

def print_handle_result_tainted(G: Graph, handle_result: NodeHandleResult):
    def color_node(n):
        if G.get_node_attr(n).get('tainted'):
            return sty.fg.li_red + n + sty.rs.all
        elif n in G.inv_internal_objs:
            return sty.ef.inverse + n + sty.rs.all
        elif n in G.builtin_prototypes:
            return sty.fg.li_yellow + n + sty.rs.all
        else:
            return n
    show_tainted = lambda l: '[' + ', '.join([color_node(n) for n in l]) + ']'
    output = f'{sty.ef.b}{sty.fg.cyan}{handle_result.ast_node}{sty.rs.all} ' \
        f'handle result: obj_nodes={show_tainted(handle_result.obj_nodes)}'
    if handle_result.name_tainted:
        output += f', {sty.fg.li_red}name={handle_result.name}{sty.rs.all}'
    else:
        output += f', name={handle_result.name}'
    output += f', name_nodes={handle_result.name_nodes}'
    if handle_result.values:
        output += f', values={handle_result.values}'
    if handle_result.used_objs:
        output += f', used_objs={show_tainted(handle_result.used_objs)}'
    if handle_result.parent_is_proto:
        output += f', parent_is_proto={handle_result.parent_is_proto}'
    # if handle_result.from_branches:
    #     output += f'{sty.fg.li_black}, from_branches=' \
    #         f'{handle_result.from_branches}{sty.rs.all}'
    logger.debug(output)
    # for o in handle_result.obj_nodes:
    #     print(o, G.get_node_attr(o))

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
    # if handle_result.from_branches:
    #     output += f'{sty.fg.li_black}, from_branches=' \
    #         f'{handle_result.from_branches}{sty.rs.all}'
    logger.debug(output)

def generate_obj_graph(G, entry_nodeid):
    """
    generate the object graph of a program
    """
    G.setup1()
    modeled_js_builtins.setup_js_builtins(G)
    G.setup2()
    if G.print:
        NodeHandleResult.print_callback = lambda x: print_handle_result_tainted(G, x)
    else:
        NodeHandleResult.print_callback = print_handle_result
    logger.info(sty.fg.green + "GENERATE OBJECT GRAPH" + sty.rs.all + ": " + entry_nodeid)
    obj_nodes = G.get_nodes_by_type("AST_FUNC_DECL")
    for node in obj_nodes:
        register_func(G, node[0])
    handle_node(G, entry_nodeid)
    add_edges_between_funcs(G)

def analyze_files(G, path, start_node_id=0, check_signatures=[]):
    """
        return we generate the obj graph or not
    """
    result = esprima_parse(path, ['-n', str(start_node_id), '-o', '-'],
        print_func=logger.info)
    G.import_from_string(result)
    if not G.check_signature_functions(check_signatures):
        return False 

    generate_obj_graph(G, str(start_node_id))
    return True

def analyze_string(G, source_code, start_node_id=0, generate_graph=False):
    result = esprima_parse('-', ['-n', str(start_node_id), '-o', '-'],
        input=source_code, print_func=logger.info)
    G.import_from_string(result)
    if generate_graph:
        generate_obj_graph(G, str(start_node_id))

def analyze_json(G, json_str, start_node_id=0, extra=None):
    # This function is almost the same as analyze_string,
    # but it is too dirty. I don't want to put them in one function.

    # because esprima cannot directly parse JSON, we add a previx
    # the real JSON object starts at 8 if the File node is at node 0
    # so we pass a "start_node_id - 8" to make the JSON object starts
    # at "start_node_id"
    json_str = 'var a = ' + json_str.strip()
    result = esprima_parse('-', ['-n', str(start_node_id - 8), '-o', '-'],
        input=json_str, print_func=logger.info)
    G.import_from_string(result)
    # remove all nodes and edges before the JSON object
    def filter_func(line):
        try:
            if int(line.split('\t')[0]) < start_node_id:
                return False
            return True
        except ValueError:
            pass
        return True
    result = '\n'.join(filter(filter_func, result.split('\n')))
    G.import_from_string(result)
    return handle_node(G, str(start_node_id), extra)

def analyze_json_python(G, json_str, extra=None, caller_ast=None):
    if json_str is None:
        return None
    try:
        py_obj = json.loads(json_str)
        logger.debug('Python JSON parse result: ' + str(py_obj))
    except json.decoder.JSONDecodeError:
        return None
    return G.generate_obj_graph_for_python_obj(py_obj, ast_node=caller_ast)

def check_prototype_pollution(G, obj_nodes):
    '''
    outdated
    '''
    for obj in obj_nodes:
        if G.get_node_attr(obj).get('user_input'):
            return True
        elif is_wildcard_obj(G, obj):
            sources = [e[0]
                for e in G.get_in_edges(obj, edge_type='CONTRIBUTES_TO')]
            sources += [e2[0]
                for e1 in G.get_in_edges(obj, edge_type='NAME_TO_OBJ')
                for e2 in G.get_in_edges(e1[0], edge_type='OBJ_TO_PROP')
            ]
            if check_prototype_pollution(G, sources):
                return True
    return False

def is_wildcard_obj(G, obj):
    attrs = G.get_node_attr(obj)
    return (attrs.get('type') in ['object', 'array'] and
            attrs.get('code') == wildcard) \
        or (attrs.get('type') in ['number', 'string'] and
            attrs.get('code')== wildcard)

def check_switch_var(G: Graph, ast_node, extra: ExtraInfo):
    left_values = to_values(G, extra.switch_var, ast_node)[0]
    right_values = to_values(G, handle_node(G, ast_node, extra), ast_node)[0]
    logger.debug(f'Switch variable values: {left_values}')
    logger.debug(f'Case values: {right_values}')

    true_num = 0
    total_num = len(left_values) * len(right_values)
    deter_flag = True
    for v1 in left_values:
        for v2 in right_values:
            if v1 != wildcard and v2 != wildcard:
                if js_cmp(v1, v2) == 0:
                    true_num += 1
            elif (v1 != undefined) != (v2 != undefined):
                true_num += 0.5
                deter_flag = False
            else:
                true_num += 0.5
                deter_flag = False
    return total_num if total_num == 0 else true_num / total_num, deter_flag
<<<<<<< HEAD
=======

>>>>>>> 3593361... fxiing
