from .graph import Graph
from .scopeController import ScopeController
from .utilities import NodeHandleResult, BranchTag, ExtraInfo
import sys
import os
import sty
import re
import math
import subprocess
from .logger import *
from . import modeledJSBuiltIns

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
        logger.info(sty.ef.inverse + sty.fg.cyan + 'Add CFG edge' + sty.rs.all + ' {} -> {}'.format(CPG_caller_id, entry_edge[1]))
        # assert CPG_caller_id != None, "Failed to add CFG edge. CPG_caller_id is None."
        # assert entry_edge[1] != None, "Failed to add CFG edge. Callee ENTRY is None."
        added_edge_list.append((CPG_caller_id, entry_edge[1], {'type:TYPE': 'FLOWS_TO'}))

        # add DF edge to PARAM
        # the order of para in paras matters!
        caller_para_names = get_argnames_from_funcaller(G, caller_id)
        callee_paras = get_argids_from_funcallee(G, callee_id)
        for idx in range(min(len(callee_paras), len(caller_para_names))):
            logger.info(sty.ef.inverse + sty.fg.li_magenta + 'Add INTER_FUNC_REACHES' + sty.rs.all + ' {} -> {}'.format(CPG_caller_id, callee_paras[idx]))
            assert CPG_caller_id != None, "Failed to add CFG edge. CPG_caller_id is None."
            assert callee_paras[idx] != None, f"Failed to add CFG edge. callee_paras[{idx}] is None."
            added_edge_list.append((CPG_caller_id, callee_paras[idx], {'type:TYPE': 'INTER_FUNC_REACHES', 'var': str(caller_para_names[idx])}))

        # add data flows for return values
        for child in G.get_child_nodes(callee_id, 'PARENT_OF'):
            if G.get_node_attr(child)['type'] == 'AST_STMT_LIST':
                for stmt in G.get_child_nodes(child, 'PARENT_OF'):
                    if G.get_node_attr(stmt)['type'] == 'AST_RETURN':
                        logger.info(sty.ef.inverse + sty.fg.li_magenta + 'Add return value data flow' + sty.rs.all + ' {} -> {}'.format(stmt, CPG_caller_id))
                        assert stmt != None, "Failed to add CFG edge. Statement ID is None."
                        assert CPG_caller_id != None, "Failed to add CFG edge. CPG_caller_id is None."
                        added_edge_list.append((stmt, CPG_caller_id, {'type:TYPE': 'FLOWS_TO'}))

    G.add_edges_from_list_if_not_exist(added_edge_list)

def register_func(G, node_id):
    """
    register the function to the nearest parent function like node
    we assume the 1-level parent node is the stmt of parent function

    Args:
        G: the graph object
        node_id: the node that needed to be registered
    """
    # we assume this node only have one parent node
    parent_stmt_nodeid = G.get_in_edges(node_id, edge_type = "PARENT_OF")[0][0]
    parent_func_nodeid = G.get_in_edges(parent_stmt_nodeid, edge_type = "PARENT_OF")[0][0]
    G.set_node_attr(parent_func_nodeid, ("HAVE_FUNC", node_id))
    if parent_func_nodeid not in registered_func:
        registered_func[parent_func_nodeid] = set()
    registered_func[parent_func_nodeid].add(node_id)

    logger.info(sty.ef.b + sty.fg.green + "REGISTER {} to {}".format(node_id, parent_func_nodeid) + sty.rs.all)

def find_prop(G, parent_objs, prop_name, branches=None, side=None, parent_name=
    'Unknown', in_proto=False):
    '''
    Recursively find a property under parent_objs and its __proto__.
    
    Args:
        G (Graph): graph.
        parent_objs (list): parent objects.
        prop_name (str): property name.
        branches (Iterable[BranchTag], optional): branch information.
            Defaults to None.
        side (str, optional): 'left' or 'right', denoting left side or
            right side of assignment. Defaults to None.
        parent_name (str, optional): parent object's name, only used to
            print log. Defaults to ''.
        in_proto (bool, optional): whether __proto__ is being searched.
            Defaults to False.
    
    Returns:
        prop_name_nodes, prop_obj_nodes: two sets containing possible
            name nodes and object nodes.
    '''
    if in_proto:
        logger.debug('Cannot find "direct" property, going into __proto__ ' \
            f'{parent_objs}...')
        logger.debug(f'  {parent_name}.{prop_name}')
    prop_name_nodes = set()
    prop_obj_nodes = set()
    for parent_obj in parent_objs:
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
        elif prop_name != '__proto__' and prop_name != '*':
            # if name node is not found, search the property under __proto__
            # note that we cannot search __proto__ under __proto__
            __proto__name_node = G.get_prop_name_node("__proto__",
                parent_obj=parent_obj)
            if __proto__name_node is not None:
                __proto__obj_nodes = G.get_objs_by_name_node(__proto__name_node,
                    branches)
                if set(__proto__obj_nodes) & set(parent_objs):
                    logger.error('__proto__ ' \
                        f'{__proto__obj_nodes} and parent {parent_objs} ' \
                        'object nodes have intersection')
                    __proto__obj_nodes = list(set(__proto__obj_nodes) -
                        set(parent_objs))
                if __proto__obj_nodes:
                    __name_nodes, __obj_nodes = find_prop(G, __proto__obj_nodes,
                        prop_name, branches, parent_name=parent_name+
                        '.__proto__', in_proto=True)
                    if __name_nodes:
                        name_node_found = True
                        prop_name_nodes.update(__name_nodes)
                        prop_obj_nodes.update(__obj_nodes)
        if not name_node_found and not in_proto and prop_name != '*':
            # we cannot create name node under __proto__
            # name nodes are only created under the original parent objects
            if side == 'right':
                return [], []
            else:
                # only add a name node
                added_name_node = G.add_prop_name_node(prop_name, parent_obj)
                prop_name_nodes.add(added_name_node)
                logger.log(ATTENTION, f'Add prop name node ' \
                f'{parent_name}.{prop_name} ({parent_obj}->{added_name_node})')
    return prop_name_nodes, prop_obj_nodes

def handle_prop(G, ast_node, extra=ExtraInfo) -> NodeHandleResult:
    '''
    Handle property.
    
    Args:
        G (Graph): graph.
        ast_node ([type]): the MemberExpression (AST_PROP) AST node.
        extra (ExtraInfo, optional): Extra information. Defaults to {}.
    
    Returns:
        NodeHandleResult
    '''
    parent, prop = G.get_ordered_ast_child_nodes(ast_node)[:2]
    handled_parent = handle_node(G, parent, extra)
    prop_name = G.get_name_from_child(prop) or 'undefined'
    
    parent_code = G.get_node_attr(parent).get('code')
    parent_name = handled_parent.name or parent_code or 'Unknown'
    parent_objs = handled_parent.obj_nodes
    parent_name_nodes = handled_parent.name_nodes
    if not parent_objs:
        if not (extra and extra.side == 'right'):
            logger.debug("PARENT OBJ {} NOT DEFINED, creating object nodes".
                format(parent_name))
            # we assume this happens when it's a built-in var name
            if parent_name_nodes:
                parent_objs = []
                for name_node in parent_name_nodes:
                    parent_objs.append(G.add_obj_to_name_node(name_node,
                        ast_node, 'BUILT-IN'))
            else:
                parent_objs = [G.add_obj_to_scope(parent_name, ast_node,
                    "BUILT-IN", scope=G.BASE_SCOPE)]
        else:
            logger.debug("PARENT OBJ {} NOT DEFINED, return undefined".
                format(parent_name))
            return NodeHandleResult()

    branches = extra.branches
    side = extra.side
    prop_name_nodes, prop_obj_nodes = find_prop(G, parent_objs, prop_name, branches, side, parent_name)

    if not prop_name_nodes and not prop_obj_nodes:
        # try wildcard (*)
        prop_name_nodes, prop_obj_nodes = find_prop(G, parent_objs, '*', branches, side, parent_name)

    logger.debug(f'{ast_node} handle result: obj_nodes={list(prop_obj_nodes)}, name={parent_name}.{prop_name}, name_nodes={list(prop_name_nodes)}')
    return NodeHandleResult(obj_nodes=list(prop_obj_nodes), name=f'{parent_name}.{prop_name}', name_nodes=list(prop_name_nodes))

def handle_assign(G, ast_node, extra=ExtraInfo(), right_override=None):
    '''
    Handle assignment statement.
    '''
    # get AST children (left and right sides)
    ast_children = G.get_ordered_ast_child_nodes(ast_node)
    try:
        left, right = ast_children
    except ValueError:
        # if only have left side
        return handle_node(G, ast_children[0], extra)

    # recursively handle both sides
    if right_override is None:
        handled_right = handle_node(G, right, ExtraInfo(extra, side='right'))
    else:
        handled_right = right_override
    handled_left = handle_node(G, left, ExtraInfo(extra, side='left'))

    if not handled_left:
        logger.warning("Left side handling error at statement {}, child {}".format(ast_node, right))
        return NodeHandleResult()

    if not handled_right:
        logger.warning("Right side handling error at statement {}, child {}".format(ast_node, right))
        return NodeHandleResult()

    # TODO: REMOVE! specific to july demo
    if handled_left.name == "elements":
        G.event_node = left

    right_objs = list(handled_right.obj_nodes)

    # experimental
    # if handled_right.values:
    #     for value in handled_right.values:
    #         right_objs.append(eval_value(G, value, return_result=True,
    #             ast_node=ast_node))

    if not right_objs:
        logger.debug("Right OBJ not found")
        right_objs = [G.undefined_obj]

    # get branch tags
    branches = extra.branches if extra else []
    
    # do the assignment
    for name_node in handled_left.name_nodes:
        G.assign_obj_nodes_to_name_node(name_node, right_objs, branches=branches)

    used_objs = handled_right.used_objs
    logger.debug(f'  assign used objs={used_objs}')
    return NodeHandleResult(obj_nodes=handled_right.obj_nodes, name_nodes=handled_left.name_nodes, used_objs=used_objs)

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

def instantiate_obj(G, exp_ast_node, constructor_decl, branches=[]):
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
    '''
    # create the instantiated object
    # js_type=None: avoid automatically adding prototype
    created_obj = G.add_obj_node(ast_node=exp_ast_node, js_type=None)
    # add edge between obj and obj decl
    G.add_edge(created_obj, constructor_decl, {"type:TYPE": "OBJ_DECL"})

    backup_obj = G.cur_obj

    # update current object (this)
    G.cur_obj = created_obj

    simurun_function(G, constructor_decl, branches=branches)

    G.cur_obj = backup_obj

    # finally add call edge from caller to callee
    G.add_edge_if_not_exist(exp_ast_node, constructor_decl, {"type:TYPE": "CALLS"})

    # build the prototype chain
    G.build_proto(created_obj)

    return created_obj

def handle_node(G, node_id, extra=ExtraInfo()) -> NodeHandleResult:
    """
    for different node type, do different actions to handle this node
    """
    cur_node_attr = G.get_node_attr(node_id)
    cur_type = cur_node_attr['type']
    if 'lineno:int' not in cur_node_attr:
        cur_node_attr['lineno:int'] = ''
    node_name = G.get_name_from_child(node_id, 2)
    node_color = sty.fg.li_white + sty.bg.li_black
    if G.get_node_attr(node_id).get('labels:label') == 'Artificial':
        node_color = sty.fg.li_white + sty.bg.red
    elif G.get_node_attr(node_id).get('labels:label') == 'Artificial_AST':
        node_color = sty.fg.black + sty.bg(179)
    node_code = G.get_node_attr(node_id).get('code')
    if len(node_code) > 100: node_code = ''
    logger.info(f"{sty.ef.b}{sty.fg.cyan}HANDLE NODE{sty.rs.all} {node_id} "
    f"(Line {cur_node_attr['lineno:int']}): {node_color}{cur_type}{sty.rs.all}"
    f"{' ' + node_name if node_name else ''}, {node_code}")

    # remove side information
    # because assignment's side affects its direct children
    extra = ExtraInfo(extra, side=None)

    if cur_type == "AST_PARAM":
        '''
        node_name = G.get_name_from_child(node_id)
        # assume we only have on reaches edge to this node
        now_edge = G.get_in_edges(node_id, edge_type = "REACHES")
        now_objs = None
        if len(now_edge) != 0:
            from_node = now_edge[0][0]
            now_objs = G.get_objs_by_name(from_node)
            for obj in now_objs:
                G.set_obj_by_scope_name(node_name, now_objs)
        
        if not now_objs:
            # for now, just add a new obj.
            added_obj = G.add_obj_to_scope(node_name, node_id, "PARAM_OBJ")
            now_objs = [added_obj]

        return NodeHandleResult(obj_nodes=now_objs)
        '''

    elif cur_type == "AST_ASSIGN":
        return handle_assign(G, node_id, extra)
    
    elif cur_type == 'AST_ARRAY':
        if G.get_node_attr(node_id).get('flags:string[]') == 'JS_OBJECT':
            added_obj = G.add_obj_node(node_id, "object")
        else:
            added_obj = G.add_obj_node(node_id, "array")

        used_objs = set()

        for child in G.get_ordered_ast_child_nodes(node_id):
            result = handle_node(G, child, ExtraInfo(extra,
                parent_obj=added_obj))
            used_objs.update(result.used_objs)

        G.remove_nodes_from(G.get_node_by_attr('labels:label', 'VIRTUAL'))

        return NodeHandleResult(obj_nodes=[added_obj],
                                used_objs=list(used_objs))

    elif cur_type == 'AST_ARRAY_ELEM':
        if not (extra and extra.parent_obj is not None):
            logger.error("AST_ARRAY_ELEM occurs outside AST_ARRAY")
        else:
            value_node, key_node = G.get_ordered_ast_child_nodes(node_id)
            key = G.get_name_from_child(key_node)
            if key:
                key = key.strip("'\"")
            else:
                try:
                    key = int(G.get_node_attr(node_id).get('childnum:int'))
                except ValueError:
                    pass
            if not key:
                key = '*'
            handled_value = handle_node(G, value_node, extra)
            value_objs = handled_value.obj_nodes
            now_objs = []
            used_objs = list(set(handled_value.used_objs))
            for obj in value_objs:
                now_objs.append(G.add_obj_as_prop(key, node_id,
                parent_obj=extra.parent_obj, tobe_added_obj=obj))
        return NodeHandleResult(obj_nodes=now_objs, used_objs=used_objs)

    elif cur_type == 'AST_DIM':
        G.set_node_attr(node_id, ('type', 'AST_PROP'))
        return handle_node(G, node_id, extra)


    elif cur_type == 'AST_VAR' or cur_type == 'AST_NAME':
        var_name = G.get_name_from_child(node_id)

        if var_name == 'this' and G.cur_obj is not None:
            now_objs = [G.cur_obj]
            name_node = None
        else:
            now_objs = []
            branches = extra.branches if extra else []

            name_node = G.get_name_node(var_name)
            if name_node is not None:
                now_objs = list(
                    set(G.get_objs_by_name(var_name, branches=branches)))
            elif not (extra and extra.side == 'right'):
                logger.log(ATTENTION, f'Name node {var_name} not found, create name node')
                if cur_node_attr.get('flags:string[]') == 'JS_DECL_VAR':
                    # we use the function scope
                    name_node = G.add_name_node(var_name,
                                    scope=G.find_func_scope_from_cur_scope())
                elif cur_node_attr.get('flags:string[]') in [
                    'JS_DECL_LET', 'JS_DECL_CONST']:
                    # we use the block scope                
                    name_node = G.add_name_node(var_name, scope=G.cur_scope)
                else:
                    # only if the variable is not defined and doesn't have
                    # 'var', 'let' or 'const', we define it in the global scope
                    name_node = G.add_name_node(var_name, scope=G.BASE_SCOPE)

        name_nodes = [name_node] if name_node is not None else []

        logger.debug(f'{node_id} handle result: obj_nodes={now_objs}, name={var_name}, name_nodes={name_nodes}')

        assert None not in now_objs

        return NodeHandleResult(obj_nodes=now_objs, name=var_name,
            name_nodes=name_nodes)

    elif cur_type == 'AST_PROP':
        return handle_prop(G, node_id, extra)


    elif cur_type == 'AST_TOPLEVEL':
        added_scope, module_exports_objs = \
            run_toplevel_file(G, node_id)

        return NodeHandleResult(obj_nodes=module_exports_objs)

    elif cur_type in ['AST_FUNC_DECL', 'AST_CLOSURE']:
        func_obj = decl_function(G, node_id)
        if func_obj is not None:
            obj_nodes = [func_obj]
        else: # the function has been declared
            obj_nodes = G.get_func_decl_objs_by_ast_node(node_id)
        logger.debug(f'Declared function obj nodes: {obj_nodes}')
        return NodeHandleResult(obj_nodes=obj_nodes)


    elif cur_type == 'AST_BINARY_OP':
        left_child, right_child = G.get_ordered_ast_child_nodes(node_id)
        if cur_node_attr.get('flags:string[]') == 'BINARY_BOOL_OR':
            left_objs = handle_node(G, left_child, extra).obj_nodes
            right_objs = handle_node(G, right_child, extra).obj_nodes
            now_objs = list(set(left_objs + right_objs)) # TODO: find cause of empty obj_nodes
            return NodeHandleResult(obj_nodes=now_objs)
        else:
            handled_left = handle_node(G, left_child, extra)
            handled_right = handle_node(G, right_child, extra)
            used_objs = []
            used_objs.extend(handled_left.used_objs)
            used_objs.extend(handled_left.obj_nodes)
            used_objs.extend(handled_right.used_objs)
            used_objs.extend(handled_right.obj_nodes)
            added_obj = G.add_obj_node(node_id)
            used_objs = list(set(used_objs))
            for obj in used_objs:
                G.add_edge(obj, added_obj, {'type:TYPE': 'CONTRIBUTES_TO'})
            return NodeHandleResult(obj_nodes=[added_obj], used_objs=used_objs)

    elif cur_type == 'AST_ASSIGN_OP':
        left_child, right_child = G.get_ordered_ast_child_nodes(node_id)
        handled_left = handle_node(G, left_child, extra)
        handled_right = handle_node(G, right_child, extra)
        used_objs = []
        used_objs.extend(handled_left.used_objs)
        used_objs.extend(handled_left.obj_nodes)
        used_objs.extend(handled_right.used_objs)
        used_objs.extend(handled_right.obj_nodes)
        added_obj = G.add_obj_node(node_id)
        used_objs = list(set(used_objs))
        for obj in used_objs:
            G.add_edge(obj, added_obj, {'type:TYPE': 'CONTRIBUTES_TO'})
        right_override = NodeHandleResult(obj_nodes=[added_obj], used_objs=used_objs)
        return handle_assign(G, node_id, extra, right_override)

    elif cur_type in ['integer', 'double', 'string']:
        js_type = 'string' if cur_type == 'string' else 'number'
        code = G.get_node_attr(node_id).get('code')
        added_obj = G.add_obj_node(node_id, js_type, code)
        # modified_objs.add(added_obj)
        logger.debug(f'{node_id} handle result: obj_nodes={[added_obj]}, value={code}')
        return NodeHandleResult(obj_nodes=[added_obj], value=code)

    elif cur_type in ['AST_CALL', 'AST_METHOD_CALL', 'AST_NEW']:
        returned_objs, used_objs = ast_call_function(G, node_id, extra)
        logger.debug(f'{node_id}: function returned_objs={returned_objs}, used_objs={used_objs}')
        return NodeHandleResult(obj_nodes=returned_objs, used_objs=used_objs)

    elif cur_type == 'AST_RETURN':
        returned_exp = G.get_ordered_ast_child_nodes(node_id)[0]
        return handle_node(G, returned_exp, extra)
    
    elif cur_type == 'AST_IF':
        # lineno = G.get_node_attr(node_id).get('lineno:int')
        stmt_id = "If" + node_id
        if_elems = G.get_ordered_ast_child_nodes(node_id)
        branches = extra.branches
        parent_branch = branches[-1] if branches else None
        for i, if_elem in enumerate(if_elems):
            branch_tag = BranchTag(stmt=stmt_id, branch=str(i))
            handle_node(G, if_elem, ExtraInfo(extra, branches=branches+[branch_tag]))
        num_of_branches = len(if_elems) # which is always 2 for javascript...
        if not has_else(G, node_id):
            num_of_branches += 1
        merge(G, stmt_id, num_of_branches, parent_branch) # We always flatten edges
        return NodeHandleResult()

    elif cur_type == 'AST_IF_ELEM':
        condition, body = G.get_ordered_ast_child_nodes(node_id)
        handle_node(G, condition)
        branches = extra.branches
        simurun_block(G, body, G.cur_scope, branches)
        return NodeHandleResult()
    
    elif cur_type == 'AST_SWITCH':
        condition, switch_list = G.get_ordered_ast_child_nodes(node_id)
        handle_node(G, condition, extra)
        handle_node(G, switch_list, extra)

    elif cur_type == 'AST_SWITCH_LIST':
        stmt_id = "Switch" + node_id
        branches = extra.branches
        parent_branch = branches[-1] if branches else None
        cases = G.get_ordered_ast_child_nodes(node_id)
        for i, case in enumerate(cases):
            branch_tag = BranchTag(stmt=stmt_id, branch=str(i))
            test, body = G.get_ordered_ast_child_nodes(case)
            handle_node(G, test, extra)
            simurun_block(G, body, G.cur_scope, branches+[branch_tag],
                          block_scope=False)
        merge(G, stmt_id, len(cases), parent_branch)

    # handle registered functions
    if "HAVE_FUNC" in cur_node_attr:
        for func_decl_id in registered_func[node_id]:
            logger.info(sty.ef.inverse + sty.fg.red + "RUN register {}".format(func_decl_id) + sty.rs.all)
            handle_node(G, func_decl_id, extra)

    return NodeHandleResult()

def decl_vars_and_funcs(G, ast_node):
    # pre-declare variables and functions
    # TODO: multiple possibilities?
    func_scope = G.find_func_scope_from_cur_scope()
    stmts = G.get_ordered_ast_child_nodes(ast_node)
    for stmt in stmts:
        node_type = G.get_node_attr(stmt)['type']
        if node_type == 'AST_VAR' and \
            G.get_node_attr(stmt)['flags:string[]'] == 'JS_DECL_VAR':
            name = G.get_name_from_child(stmt)
            if G.get_name_node(name, scope=func_scope,
                follow_scope_chain=False) is None:
                G.add_obj_to_scope(name=name, scope=func_scope,
                                   tobe_added_obj=G.undefined_obj)
        elif node_type == 'AST_ASSIGN':
            children = G.get_ordered_ast_child_nodes(stmt)
            if G.get_node_attr(children[0])['type'] == 'AST_VAR' and \
                G.get_node_attr(children[0])['flags:string[]'] == 'JS_DECL_VAR':
                name = G.get_name_from_child(children[0])
                if G.get_name_node(name, scope=func_scope,
                    follow_scope_chain=False) is None:
                    G.add_obj_to_scope(name=name, scope=func_scope,
                                       tobe_added_obj=G.undefined_obj)
        elif node_type == 'AST_FUNC_DECL':
            handle_node(G, stmt)
        elif node_type == 'AST_STMT_LIST':
            decl_vars_and_funcs(G, stmt)
        elif node_type in ['AST_IF_ELEM', 'AST_FOR', 'AST_FOR_EACH',
            'AST_WHILE', 'AST_SWITCH_CASE']:
            decl_vars_and_funcs(G, stmt)

def simurun_function(G, func_decl_ast_node, branches=[]):
    """
    Simurun a function by running its body.
    """
    func_name = G.get_name_from_child(func_decl_ast_node)
    decl_vars_and_funcs(G, func_decl_ast_node)
    logger.info(sty.ef.inverse + sty.fg.green +
        "FUNCTION {} {} STARTS, SCOPE {}, DECL OBJ {}, this OBJ {}, branches {}"
        .format(func_decl_ast_node, func_name, G.cur_scope,
        G.get_func_decl_objs_by_ast_node(func_decl_ast_node)[0], G.cur_obj,
        branches) + sty.rs.all)
    for child in G.get_child_nodes(func_decl_ast_node, child_type='AST_STMT_LIST'):
        return simurun_block(G, child, parent_scope=G.cur_scope)
    return [], []

def simurun_block(G, ast_node, parent_scope, branches=[], block_scope=True):
    """
    Simurun a block by running its statements one by one.
    A block is a BlockStatement in JavaScript,
    or an AST_STMT_LIST in PHP.
    """
    logger.debug('BLOCK {} STARTS'.format(ast_node))
    returned_objs = set()
    used_objs = set()
    if parent_scope == None:
        parent_scope = G.cur_scope
    if block_scope:
        G.cur_scope = \
            G.add_scope('BLOCK_SCOPE', ast_node,
                        G.call_counter.gets(f'Block{ast_node}'))
    stmts = G.get_ordered_ast_child_nodes(ast_node)
    # simulate statements
    for stmt in stmts:
        handled_res = handle_node(G, stmt, ExtraInfo(branches=branches))

        if handled_res:
            stmt_used_objs = handled_res.used_objs
            build_df_by_def_use(G, stmt, stmt_used_objs)

        if G.get_node_attr(stmt)['type'] == 'AST_RETURN':
            stmt_returned_objs = handled_res.obj_nodes
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
    name_nodes = G.get_node_by_attr('labels:label', 'Name')
    for u in name_nodes:
        for v in G.get_child_nodes(u, 'NAME_TO_OBJ'):
            created = [False] * num_of_branches
            deleted = [False] * num_of_branches
            for key, edge_attr in G.graph[u][v].items():
                branch_tag = edge_attr.get('branch')
                if branch_tag and branch_tag.stmt == stmt:
                    if branch_tag.op == 'A':
                        created[int(branch_tag.branch)] = True
                    if branch_tag.op == 'D':
                        deleted[int(branch_tag.branch)] = True
            # logger.debug(f'{u}->{v}\ncreated: {created}\ndeleted: {deleted}')

            # We flatten Addition edges if they exist in any branch, because
            # the possibilities will continue to exist in parent branches.
            # We ignore those edges without tags related to current
            # statement.
            flag_created = False
            for i in created:
                if i == True:
                    flag_created = True
            # We always delete Deletion edges because they are useless in
            # parent branches.
            # If they exist in all current branches, the Addition edge in the
            # parent branch will be deleted (or maked by a Deletion edge).
            flag_deleted = True
            for i in deleted:
                if i == False:
                    flag_deleted = False

            # flatten Addition edges
            if flag_created:
                # logger.debug(f'add edge {u}->{v}, branch={stmt}')
                # we'll delete edges, so we save them in a list
                # otherwise the graph is changed and Python will raise an error
                edges = list(G.graph[u][v].items())
                for key, edge_attr in edges:
                    branch_tag = edge_attr.get('branch', BranchTag())
                    if branch_tag.stmt == stmt:
                        G.graph.remove_edge(u, v, key)
                if parent_branch:
                    # add one addition edge with parent if/switch's (upper level's) tags
                    # logger.debug(f"create edge {u}->{v}, branch={BranchTag(parent_branch, op='A')}")
                    G.add_edge(u, v, {'type:TYPE': 'NAME_TO_OBJ', 'branch': BranchTag(parent_branch, op='A')})
                else:
                    # logger.debug(f'create edge {u}->{v}')
                    G.add_edge(u, v, {'type:TYPE': 'NAME_TO_OBJ'})

            # delete Addition edges
            # logger.debug(f'delete edge {u}->{v}, branch={stmt}')
            # we'll delete edges, so we save them in a list
            # otherwise the graph is changed and Python will raise an error
            edges = list(G.graph[u][v].items())
            for key, edge_attr in edges:
                branch_tag = edge_attr.get('branch', BranchTag())
                if branch_tag.stmt == stmt:
                    G.graph.remove_edge(u, v, key)
            if flag_deleted:
                if parent_branch:
                    # find if there is an addition in parent if/switch (upper level)
                    flag = True
                    for key, edge_attr in list(G.graph[u][v].items()):
                        branch_tag = edge_attr.get('branch', BranchTag())
                        if branch_tag == BranchTag(parent_branch, op='A'):
                            # logger.debug(f'delete edge {u}->{v}')
                            G.graph.remove_edge(u, v, key)
                            flag = False
                    # if there is not
                    if flag:
                        # add one deletion edge with parent if/switch's (upper level's) tags
                        # logger.debug(f"create edge {u}->{v}, branch={BranchTag(parent_branch, op='D')}")
                        G.add_edge(u, v, {'type:TYPE': 'NAME_TO_OBJ', 'branch': BranchTag(parent_branch, op='D')})
                else:
                    # find if there is an addition in upper level
                    for key, edge_attr in list(G.graph[u][v].items()):
                        if 'branch' not in edge_attr:
                            # logger.debug(f'delete edge {u}->{v}')
                            G.graph.remove_edge(u, v, key)



def call_callback_function(G, caller, func_decl, func_scope, args=None,
    branches=[]):
    # generate empty object for parameters of the callback function
    param_list_node = None
    for child in G.get_ordered_ast_child_nodes(func_decl):
        if G.get_node_attr(child).get('type') == 'AST_PARAM_LIST':
            param_list_node = child
            break
    if param_list_node is not None:
        for i, child in enumerate(
            G.get_ordered_ast_child_nodes(param_list_node)):
            # handled_param = handle_node(G, child)
            param_name = G.get_name_from_child(child)
            if not args:
                G.add_obj_to_scope(param_name, scope=func_scope)
            else:
                if i >= len(args):
                    break
                for obj in args[i].obj_nodes:
                    G.add_obj_to_scope(param_name, scope=func_scope,
                        tobe_added_obj=obj)
    
    backup_obj = G.cur_obj
    backup_scope = G.cur_scope

    # added_obj = G.add_obj_node(caller, "FUNC_RUN_OBJ")
    # link run obj to func decl
    # G.add_edge(added_obj, func_decl, {'type:TYPE': 'OBJ_DECL'})

    G.cur_scope = func_scope

    simurun_function(G, func_decl)

    G.cur_scope = backup_scope
    G.cur_obj = backup_obj

    # add call edge
    G.add_edge_if_not_exist(caller, func_decl, {"type:TYPE": "CALLS"})

def decl_function(G, node_id, func_name=None, parent_scope=None):
    '''
    Declare a function as an object node.
    
    Args:
        G (Graph): Graph.
        node_id: The function's AST node (AST_FUNC_DECL).
        func_name (str, optional): The function's name. Defaults to
            None, which means getting name from its AST children.
        parent_scope (optional): The parent scope of the function's
            prospective scope(s). Defaults to current scope.
    
    Returns:
        added_obj: The function's object node.
    '''
    # for a function decl, if already visited, return
    if "VISITED" in G.get_node_attr(node_id):
        return None

    if parent_scope is None:
        parent_scope = G.cur_scope
    if func_name is None:
        func_name = G.get_name_from_child(node_id)

    # add function declaration object
    added_obj = G.add_obj_node(node_id, "function")
    # record its parent scope
    # when the function is called, we add scopes under this "parent scope",
    # instead of current scope (which is where the function is called)
    G.set_node_attr(added_obj, ('parent_scope', parent_scope))

    if func_name is not None and func_name != '{closure}':
        G.add_obj_to_scope(name=func_name, scope=parent_scope,
            tobe_added_obj=added_obj)

    G.set_node_attr(node_id, ("VISITED", "1"))

    return added_obj

def run_toplevel_file(G, node_id):
    """
    run a top level file 
    return a obj and scope
    """
    # add scope and obj first
    func_name = G.get_node_attr(node_id)['name']
    logger.info(sty.fg(173) + sty.ef.inverse + 'FILE {} BEGINS'.format(func_name) + sty.rs.all)
    func_decl_obj = decl_function(G, node_id, func_name = func_name, parent_scope=G.BASE_SCOPE)
    # simurun the file
    backup_obj = G.cur_obj
    backup_scope = G.cur_scope

    func_scope = G.add_scope('FUNC_SCOPE', node_id,
        G.call_counter.gets(f'File{node_id}'),
        func_decl_obj, None, func_name, parent_scope=G.BASE_SCOPE)

    G.cur_scope = func_scope

    # add module object to the current file's scope
    added_module_obj = G.add_obj_to_scope("module", node_id)
    # add module.exports
    added_module_exports = G.add_obj_as_prop("exports", node_id,
        parent_obj=added_module_obj)
    # add module.exports as exports
    G.add_obj_to_scope(name="exports", tobe_added_obj=added_module_exports)
    # "this" is set to module.exports by default
    # G.cur_obj = added_module_exports
    G.add_obj_to_scope(name="this", tobe_added_obj=added_module_exports)
    
    simurun_function(G, node_id)

    # get current module.exports
    # because module.exports may be assigned to another object
    # TODO: test if module is assignable
    module_obj = G.get_objs_by_name('module')[0]
    module_exports_objs = G.get_prop_obj_nodes(parent_obj=module_obj,
        prop_name='exports')

    G.cur_scope = backup_scope

    return func_scope, module_exports_objs

def handle_require(G, node_id):
    arg_list = G.get_ordered_ast_child_nodes(node_id)[1]
    module_name = (G.get_name_from_child(arg_list) or '').strip("'\"")
    file_name = G.get_node_attr(node_id).get('name')
    toplevel_nodes = G.get_nodes_by_type_and_flag('AST_TOPLEVEL', 'TOPLEVEL_FILE')
    module_exports_objs = []
    found = False
    if module_name and file_name:
        for node in toplevel_nodes:
            # file_name = G.get_node_attr(node).get('name')
            # module_name = re.search(r'([^/\\]*)$', file_name)[1]
            # if module_name in file_name:
            #     added_obj, added_scope, module_exports = run_toplevel_file(G, node)
            #     break
            if G.get_node_attr(node).get('name') == file_name:
                found = True
                _, module_exports_objs = run_toplevel_file(G, node)
                break
    if not found:
        logger.error("Required module {} at {} not found!".format(module_name, file_name))
    # returned_objs = [module_exports] if module_exports is not None else []
    return module_exports_objs, []

def ast_call_function(G, ast_node, extra):
    '''
    Call a function (AST_CALL/AST_METHOD_CALL/AST_NEW).
    
    Args:
        G (Graph): graph
        ast_node: the Call/New expression's AST node.
        extra (ExtraInfo): extra information.
    '''
    # handle the callee
    if G.get_node_attr(ast_node).get('type') == 'AST_METHOD_CALL':
        handled_callee = handle_prop(G, ast_node, extra)
    else:
        callee = G.get_ordered_ast_child_nodes(ast_node)[0]
        handled_callee = handle_node(G, callee, extra)
    
    if handled_callee.name == 'require':
        return handle_require(G, ast_node)

    # find function declaration objects
    func_decl_objs = list(filter(lambda x: x != G.undefined_obj,
        handled_callee.obj_nodes))
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

    # if the function call is creating a new object
    is_new = False
    # parent object (for method call only)
    handled_parent = None

    handled_args = []
    if G.get_node_attr(ast_node).get('type') == 'AST_CALL':
        stmt_id = 'Call' + ast_node
    elif G.get_node_attr(ast_node).get('type') == 'AST_METHOD_CALL':
        stmt_id = 'Call' + ast_node
        parent = G.get_ordered_ast_child_nodes(ast_node)[0]
        handled_parent = handle_node(G, parent, extra)
    elif G.get_node_attr(ast_node).get('type') == 'AST_NEW':
        stmt_id = 'New' + ast_node
        is_new = True

    # handle arguments
    arg_list_node = G.get_ordered_ast_child_nodes(ast_node)[-1]
    arg_list = G.get_ordered_ast_child_nodes(arg_list_node)
    for arg in arg_list:
        handled_arg = handle_node(G, arg, extra)
        handled_args.append(handled_arg)

    return call_function(G, func_decl_objs, handled_args, handled_parent,
        extra, caller_ast=ast_node, is_new=is_new, stmt_id=stmt_id,
        func_name=func_name)

def call_function(G, func_objs, args, this, extra=ExtraInfo(), caller_ast=None,
    is_new=False, stmt_id='Unknown', func_name='{anonymous}'):
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
        List, List: Lists of returned objects and used objects.
    '''
    if stmt_id == 'Unknown' and caller_ast is not None:
        stmt_id = caller_ast

    args_used_objs = set() # only for unmodeled built-in functions
    callback_functions = set() # only for unmodeled built-in functions
    for arg in args:
        args_used_objs.update(arg.obj_nodes)
        # add callback functions
        for obj in arg.obj_nodes:
            if G.get_node_attr(obj).get('type') == 'function':
                callback_functions.add(obj)

    returned_objs = set()
    used_objs = set()

    # if the function declaration has multiple possibilities,
    # and need to merge afterwards
    has_branches = (len(func_objs) > 1)

    # for each possible function declaration
    for i, func_obj in enumerate(func_objs):
        branch_returned_objs = []
        branch_used_objs = []
        func_ast = G.get_obj_def_ast_node(func_obj)
        # check if python function exists
        python_func = G.get_node_attr(func_obj).get('pythonfunc')
        if python_func: # special Python function
            if this:
                # add parent object (this) as an argument
                args.insert(0, this)
            if is_new:
                logger.error(f'Error: try to new Python function {python_func}...')
                continue
            else:
                logger.log(ATTENTION, f'Running Python function {python_func}...')
                # TODO: add branches info
                h = python_func(G, caller_ast, extra, *args)
                branch_returned_objs = h.obj_nodes
                branch_used_objs = h.used_objs
        else: # JS function in AST
            # if AST cannot be found, create AST
            if func_ast is None or G.get_node_attr(func_ast).get('type') \
            not in ['AST_FUNC_DECL', 'AST_CLOSURE']:
                G.add_blank_func_with_og_nodes(func_name, func_obj)
                func_ast = G.get_obj_def_ast_node(func_obj)
            # add function scope
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
                                               scope=func_scope)
            for i, param in enumerate(params):
                if i >= len(args): break
                param_name = G.get_name_from_child(param)
                logger.debug(f'add arg {param_name} <- {args[i]}, scope {func_scope}')
                for obj in args[i].obj_nodes:
                    G.add_obj_to_scope(name=param_name, scope=func_scope,
                        tobe_added_obj=obj)
                    G.add_obj_as_prop(prop_name=str(i), parent_obj=arguments_obj,
                        tobe_added_obj=obj)
            # manage branches
            branches = extra.branches
            parent_branch = branches[-1] if branches else None
            # if branches exist, add a new branch tag to the list
            if has_branches:
                next_branches = branches+[BranchTag(stmt=stmt_id, branch=i)]
            else:
                next_branches = branches
            # switch scopes ("new" will swtich scopes and object by itself)
            backup_scope = G.cur_scope
            G.cur_scope = func_scope
            # run simulation -- create the object, or call the function
            if is_new:
                branch_returned_objs = [instantiate_obj(G, caller_ast,
                    func_ast, branches=next_branches)]
            else:
                branch_returned_objs, branch_used_objs = simurun_function(
                    G, func_ast, branches=next_branches)
            # switch back scopes
            G.cur_scope = backup_scope
            # if it's an unmodeled built-in function
            if G.get_node_attr(func_ast).get('labels:label') \
                == 'Artificial_AST':
                # logger.info(sty.fg.green + sty.ef.inverse + func_ast + ' is unmodeled built-in function.' + sty.rs.all)
                # add arguments as used objects
                for h in args:
                    branch_used_objs.extend(h.obj_nodes)
                    branch_used_objs.extend(h.used_objs)
                # add a blank object as return objects
                returned_obj = G.add_obj_node(caller_ast, "object")
                for obj in branch_used_objs:
                    G.add_edge(obj, returned_obj,
                        {'type:TYPE': 'CONTRIBUTES_TO'})
                # call all callback functions
                logger.debug(sty.fg.green + sty.ef.inverse + 'callback functions = {}'.format(callback_functions) + sty.rs.all)
                if callback_functions:
                    for obj in callback_functions:
                        func_ast = G.get_obj_def_ast_node(obj)
                        func_name = G.get_name_from_child(func_ast)
                        parent_scope = G.get_node_attr(func_obj) \
                                        .get('parent_scope')
                        func_scope = G.add_scope('FUNC_SCOPE', func_ast,
                            f'Function{func_ast}:{caller_ast}', obj,
                            caller_ast, func_name, parent_scope=parent_scope)
                        call_callback_function(G, caller_ast, func_ast,
                            func_scope)
        assert type(branch_returned_objs) is list
        assert type(branch_used_objs) is list
        returned_objs.update(branch_returned_objs)
        used_objs.update(branch_used_objs)
        # add call edge
        G.add_edge_if_not_exist(caller_ast, func_ast, {"type:TYPE": "CALLS"})

    if has_branches:
        merge(G, stmt_id, len(func_objs), parent_branch)

    return list(returned_objs), list(used_objs)

def build_df_by_def_use(G, cur_stmt, used_objs):
    """
    Build data flows for objects used in current statement.
    The flow will be from the object's definition to current statement (current node).
    """
    if not used_objs or cur_stmt == None:
        return
    cur_lineno = G.get_node_attr(cur_stmt).get('lineno:int')
    for obj in used_objs:
        def_ast_node = G.get_obj_def_ast_node(obj)
        def_cpg_node = G.find_nearest_upper_CPG_node(def_ast_node)
        if def_cpg_node == None: continue
        if def_cpg_node == cur_stmt: continue
        def_lineno = G.get_node_attr(def_cpg_node).get('lineno:int')
        logger.info(sty.fg.li_magenta + sty.ef.b + "OBJ REACHES" + sty.rs.all +
        " {} (Line {}) -> {} (Line {})".format(def_cpg_node, def_lineno,
        cur_stmt, cur_lineno))
        G.add_edge(def_cpg_node, cur_stmt, {'type:TYPE': 'OBJ_REACHES', 'obj': obj})

def eval_value(G, s, return_result=False, ast_node=None):
    '''
    Extract Python values, JavaScript types from literal values
    (presented by JavaScript code) and create object nodes.
    
    Args:
        G (Graph): Graph.
        s (str): The literal value (as JavaScript code).
        return_result (bool, optional): Create/return an object node for
            the value. Defaults to False.
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
        if return_result:
            added_obj = G.add_obj_node(ast_node, js_type, s)
    if return_result:
        return evaluated, js_type, result
    else:
        return evaluated, js_type


def generate_obj_graph(G, entry_nodeid):
    """
    generate the object graph of a program
    """
    G.setup1()
    modeledJSBuiltIns.setup_js_builtins(G)
    G.setup2()
    logger.info(sty.fg.green + "GENERATE OBJECT GRAPH" + sty.rs.all + ": " + entry_nodeid)
    obj_nodes = G.get_nodes_by_type("AST_FUNC_DECL")
    for node in obj_nodes:
        register_func(G, node[0])
    handle_node(G, entry_nodeid)
    add_edges_between_funcs(G)


esprima_path = os.path.realpath(os.path.join(__file__,
                                '../../esprima-joern/main.js'))


def analyze_files(G, path, start_node_id=0):
    # use "universal_newlines" instead of "text" if you're using Python <3.7
    #        ↓ ignore this error if your editor shows
    proc = subprocess.Popen([esprima_path, path,
        str(start_node_id), '-'], text=True,
        stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    stdout, stderr = proc.communicate()
    logger.info(stderr)
    G.import_from_string(stdout)
    generate_obj_graph(G, str(start_node_id + 1))


def analyze_string(G, source_code, start_node_id=0, toplevel=False):
    # use "universal_newlines" instead of "text" if you're using Python <3.7
    #        ↓ ignore this error if your editor shows
    proc = subprocess.Popen([esprima_path, '-',
        str(start_node_id)], text=True, stdin=subprocess.PIPE,
        stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    stdout, stderr = proc.communicate(source_code)
    logger.info(stderr)
    G.import_from_string(stdout)
    if toplevel:
        generate_obj_graph(G, str(start_node_id + 1))


def analyze_json(G, json_str, start_node_id=0, extra=None):
    # This function is almost the same as analyze_string,
    # but it is too dirty. I don't want to put them in one function.

    # because esprima cannot directly parse JSON, we add a previx
    # the real JSON object starts at 8 if the File node is at node 0
    # so we pass a "start_node_id - 8" to make the JSON object starts
    # at "start_node_id"
    json_str = 'var a = ' + json_str.strip()
    #        ↓ ignore this error if your editor shows
    proc = subprocess.Popen([esprima_path, '-',
        str(start_node_id - 8)], text=True, stdin=subprocess.PIPE,
        stdout=subprocess.PIPE)
    stdout, _ = proc.communicate(json_str)
    # remove all nodes and edges before the JSON object
    def filter_func(line):
        try:
            if int(line.split('\t')[0]) < start_node_id:
                return False
            return True
        except ValueError:
            pass
        return True
    stdout = '\n'.join(filter(filter_func, stdout.split('\n')))
    G.import_from_string(stdout)
    return handle_node(G, str(start_node_id), extra)
