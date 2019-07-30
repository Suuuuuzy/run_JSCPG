#!/usr/bin/env python3
from graph import Graph
from scopeController import ScopeController
from utilities import NodeHandleResult, BranchTag
import sys
import sty
import re
import modeledJSBuiltIns

registered_func = {}

def printcolor(string, color="red"):
    """
    just for testing
    """
    print(sty.ef.inverse + sty.fg.red + str(string) + sty.rs.all)

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
        print(sty.ef.inverse + sty.fg.cyan + 'Add CFG edge' + sty.rs.all + ' {} -> {}'.format(CPG_caller_id, entry_edge[1]))
        # assert CPG_caller_id != None, "Failed to add CFG edge. CPG_caller_id is None."
        # assert entry_edge[1] != None, "Failed to add CFG edge. Callee ENTRY is None."
        added_edge_list.append((CPG_caller_id, entry_edge[1], {'type:TYPE': 'FLOWS_TO'}))

        # add DF edge to PARAM
        # the order of para in paras matters!
        caller_para_names = get_argnames_from_funcaller(G, caller_id)
        callee_paras = get_argids_from_funcallee(G, callee_id)
        for idx in range(min(len(callee_paras), len(caller_para_names))):
            print(sty.ef.inverse + sty.fg.li_magenta + 'Add INTER_FUNC_REACHES' + sty.rs.all + ' {} -> {}'.format(CPG_caller_id, callee_paras[idx]))
            assert CPG_caller_id != None, "Failed to add CFG edge. CPG_caller_id is None."
            assert callee_paras[idx] != None, f"Failed to add CFG edge. callee_paras[{idx}] is None."
            added_edge_list.append((CPG_caller_id, callee_paras[idx], {'type:TYPE': 'INTER_FUNC_REACHES', 'var': str(caller_para_names[idx])}))

        # add data flows for return values
        for child in G.get_child_nodes(callee_id, 'PARENT_OF'):
            if G.get_node_attr(child)['type'] == 'AST_STMT_LIST':
                for stmt in G.get_child_nodes(child, 'PARENT_OF'):
                    if G.get_node_attr(stmt)['type'] == 'AST_RETURN':
                        print(sty.ef.inverse + sty.fg.li_magenta + 'Add return value data flow' + sty.rs.all + ' {} -> {}'.format(stmt, CPG_caller_id))
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

    print(sty.ef.b + sty.fg.green + "REGISTER {} to {}".format(node_id, parent_func_nodeid) + sty.rs.all)

def handle_new_node(G, node_id, extra = {}) -> NodeHandleResult:
    """
    deprecated
    handle new object related operations
    """
    branches = extra.get('branches')
    branch = branches[-1] if branches else None

    callee = G.get_ordered_ast_child_nodes(node_id)[0]
    handled_callee = handle_node(G, callee, extra={'branches': extra.get('branches')})
    name_nodes = handled_callee.name_nodes
    name = handled_callee.name
    created_objs = []
    constructor_decl_counter = 0

    has_branches = True
    ast_node = extra['ast_node'] if 'ast_node' in extra else node_id

    for name_node in name_nodes:
        constructor_decls = G.get_func_decls_by_name_node(name_node, branches)
        if not constructor_decls:
            print("Built-in: Function {} not found".format(name))
            blank_func = G.add_blank_func(name)
            added_objs = handle_node(G, blank_func, extra).obj_nodes
            for obj in added_objs:
                G.add_edge(name_node, obj, {'type:TYPE': 'NAME_TO_OBJ'})
                G.add_edge(obj, blank_func, {'type:TYPE': 'OBJ_TO_AST'})
            constructor_decls.append(blank_func)

        stmt_id = 'New' + node_id

        for decl in constructor_decls:
            if len(name_nodes) * len(constructor_decls) == 1: # No any branches
                has_branches = False
                created_obj = instantiate_obj(G, ast_node, decl)
            else:
                created_obj = instantiate_obj(G, ast_node, decl, branches+[BranchTag(stmt=stmt_id, branch=constructor_decl_counter)])

            created_objs.append(created_obj)
            constructor_decl_counter += 1
        
    if has_branches:
        merge(G, stmt_id, constructor_decl_counter, branch)

    return NodeHandleResult(obj_nodes=created_objs)

def find_prop(G, parent_objs, prop_name, branches=None, side=None, parent_name='', in_proto=False):
    '''
    Recursively find a property under parent_objs and its __proto__.
    
    Args:
        G (Graph): graph.
        parent_objs (list): parent objects.
        prop_name (str): property name.
        branches (Iterable[BranchTag], optional): branch information. Defaults to None.
        side (str, optional): 'left' or 'right', denoting left side or right side of assignment. Defaults to None.
        parent_name (str, optional): parent object's name, only used to print log. Defaults to ''.
        in_proto (bool, optional): whether __proto__ is being searched. Defaults to False.
    
    Returns:
        prop_name_nodes, prop_obj_nodes: two sets containing possible name nodes and object nodes.
    '''
    if in_proto:
        print('Cannot find "direct" property, going into __proto__...')
    prop_name_nodes = set()
    prop_obj_nodes = set()
    for parent_obj in parent_objs:
        name_node_found = False # flag of whether any name node with prop_name under this parent object is found
        # search "direct" properties
        prop_name_node = G.get_name_node_of_obj(prop_name, parent_obj)
        if prop_name_node is not None:
            name_node_found = True
            prop_name_nodes.add(prop_name_node)
            prop_objs = G.get_objs_by_name_node(prop_name_node, branches=branches)
            if prop_objs:
                prop_obj_nodes.update(prop_objs)
        elif prop_name != '__proto__' and prop_name != '*':
            # if name node is not found, search the property under __proto__
            # note that we cannot search __proto__ under __proto__
            __proto__name_node = G.get_name_node_of_obj("__proto__", parent_obj = parent_obj)
            if __proto__name_node is not None:
                __proto__obj_nodes = G.get_objs_by_name_node(__proto__name_node, branches)
                if __proto__obj_nodes:
                    __name_nodes, __obj_nodes = find_prop(G, __proto__obj_nodes, prop_name, branches, in_proto=True)
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
                print(sty.fg.green + f'Add prop name node {parent_name}.{prop_name} ({parent_obj}->{added_name_node})' + sty.rs.all)
    return prop_name_nodes, prop_obj_nodes

def handle_prop(G, ast_node, extra = {}) -> NodeHandleResult:
    '''
    Handle property.
    
    Args:
        G (Graph): graph.
        ast_node ([type]): the MemberExpression (AST_PROP) AST node.
        extra (dict, optional): Extra information. Defaults to {}.
    
    Returns:
        NodeHandleResult
    '''
    parent, prop = G.get_ordered_ast_child_nodes(ast_node)[:2]
    handled_parent = handle_node(G, parent, extra)
    prop_name = G.get_name_from_child(prop) or 'undefined'
    
    parent_name = handled_parent.name
    parent_objs = handled_parent.obj_nodes
    parent_name_nodes = handled_parent.name_nodes
    if parent_name == "this":
        parent_objs = G.cur_obj
        # parent_scope = G.cur_scope
    elif not parent_objs:
        if not (extra and extra.get('side') == 'right'):
            print(sty.ef.b + sty.fg.green + "PARENT OBJ {} NOT DEFINED, creating object nodes".format(parent_name) + sty.rs.all)
            # we assume this happens when it's a built-in var name
            if parent_name_nodes:
                parent_objs = []
                for name_node in parent_name_nodes:
                    parent_objs.append(G.add_obj_to_name_node(name_node, ast_node, 'BUILT-IN'))
            else:
                parent_objs = [G.add_obj_to_scope(ast_node, parent_name, "BUILT-IN", scope = G.BASE_SCOPE)]
        else:
            print(sty.ef.b + sty.fg.green + "PARENT OBJ {} NOT DEFINED, return undefined".format(parent_name) + sty.rs.all)
            return NodeHandleResult()

    branches = extra.get('branches')
    side = extra.get('side')
    prop_name_nodes, prop_obj_nodes = find_prop(G, parent_objs, prop_name, branches, side, parent_name)

    if not prop_name_nodes and not prop_obj_nodes:
        # try wildcard (*)
        prop_name_nodes, prop_obj_nodes = find_prop(G, parent_objs, '*', branches, side, parent_name)

    print(f'{ast_node} handle result: obj_nodes={list(prop_obj_nodes)}, name={parent_name}.{prop_name}, name_nodes={list(prop_name_nodes)}')
    return NodeHandleResult(obj_nodes=list(prop_obj_nodes), name=f'{parent_name}.{prop_name}', name_nodes=list(prop_name_nodes))

def handle_assign(G, ast_node, extra = {}) -> NodeHandleResult:
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
    handled_right = handle_node(G, right, dict(extra, side='right'))
    handled_left = handle_node(G, left, dict(extra, side='left'))

    if not handled_left:
        print(sty.fg.red + "Left side handling error at statement {}, child {}".format(ast_node, right) + sty.rs.all, file=sys.stderr)
        return NodeHandleResult()

    if not handled_right:
        print(sty.fg.red + "Right side handling error at statement {}, child {}".format(ast_node, right) + sty.rs.all, file=sys.stderr)
        return NodeHandleResult()

    # TODO: REMOVE! specific to july demo
    if handled_left.name == "event":
        G.event_node = left

    right_objs = handled_right.obj_nodes

    if not right_objs:
        print(sty.fg.red + "Right OBJ not found" + sty.rs.all, file=sys.stderr)

    # get branch tags
    branches = []
    if extra and extra.get('branches'):
        branches = extra.get('branches')
    
    # do the assignment
    for name_node in handled_left.name_nodes:
        G.assign_obj_nodes_to_name_node(name_node, right_objs, branches=branches)

    used_objs = handled_right.used_objs
    print(f'assign used objs={used_objs}')
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
        G (Graph): graph.
        exp_ast_node: the New expression's AST node.
        constructor_decl: the constructor's function declaration AST
            node.
        branches (optional): branch information.. Defaults to [].
    
    Returns:
        obj_node: the created object.
    '''
    # create the instantiated object
    # js_type=None: avoid automatically adding prototype
    created_obj = G.add_obj_node(ast_node=exp_ast_node, js_type=None)
    # add edge between obj and obj decl
    G.add_edge(created_obj, constructor_decl, {"type:TYPE": "OBJ_DECL"})

    backup_scope = G.cur_scope
    backup_obj = G.cur_obj

    # update current scope and object
    G.cur_scope = G.get_scope_by_ast_node(constructor_decl)
    G.cur_obj = created_obj
    simurun_function(G, constructor_decl, branches=branches)

    # add obj to scope edge?
    # G.add_edge(obj, G.cur_scope, {"type:TYPE": "OBJ_TO_SCOPE"})
    
    G.cur_scope = backup_scope
    G.cur_obj = backup_obj

    # finally add call edge from caller to callee
    G.add_edge_if_not_exist(exp_ast_node, constructor_decl, {"type:TYPE": "CALLS"})

    # build the prototype chain
    G.build_proto(created_obj)

    return created_obj

def handle_node(G, node_id, extra = {}) -> NodeHandleResult:
    """
    for different node type, do different actions to handle this node
    return [added_obj, added_scope, cur_obj, cur_scope, modified_objs, var_name, var_name_node]
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
    print(f"{sty.ef.b}{sty.fg.cyan}HANDLE NODE{sty.rs.all} {node_id}: {node_color}{cur_type}{sty.rs.all}{' ' + node_name if node_name else ''}, lineno: {cur_node_attr['lineno:int']}")

    # remove side information
    # because assignment's side affects its direct children
    extra = dict(extra)
    extra.pop('side', None)

    if cur_type == "AST_PARAM":
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
            added_obj = G.add_obj_to_scope(node_id, node_name, "PARAM_OBJ")
            now_objs = [added_obj]

        return NodeHandleResult(obj_nodes=now_objs)

    elif cur_type == "AST_ASSIGN":
        return handle_assign(G, node_id, extra)
    
    elif cur_type == 'AST_ARRAY':
        if G.get_node_attr(node_id).get('flags:string[]') == 'JS_OBJECT':
            added_obj = G.add_obj_node(node_id, "object")
        else:
            added_obj = G.add_obj_node(node_id, "array")

        for child in G.get_ordered_ast_child_nodes(node_id):
            handle_node(G, child, dict(extra, parent_obj=added_obj))

        G.remove_nodes_from(G.get_node_by_attr('labels:label', 'VIRTUAL'))

        return NodeHandleResult(obj_nodes=[added_obj])

    elif cur_type == 'AST_ARRAY_ELEM':
        if not (extra and 'parent_obj' in extra):
            print(sty.ef.inverse + sty.fg.red + "AST_ARRAY_ELEM occurs outside AST_ARRAY" + sty.rs.all, file=sys.stderr)
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
            child_handle_result = handle_node(G, value_node, extra)
            child_added_objs = child_handle_result.obj_nodes
            now_objs = []
            for obj in child_added_objs:
                now_objs.append(G.add_obj_as_prop(node_id, None, key, parent_obj = extra['parent_obj'], tobe_added_obj = obj))
        return NodeHandleResult(obj_nodes=now_objs)

    elif cur_type == 'AST_DIM':
        G.set_node_attr(node_id, ('type', 'AST_PROP'))
        return handle_node(G, node_id, extra)


    elif cur_type == 'AST_VAR' or cur_type == 'AST_NAME':
        var_name = G.get_name_from_child(node_id)

        branches = extra.get('branches', []) if extra else []
        now_objs = list(set(G.get_objs_by_name(var_name, branches = branches)))

        name_node = G.get_name_node(var_name)
        if name_node is None and not (extra and extra.get('side') == 'right'):
            if cur_node_attr.get('flags:string[]') == 'JS_DECL_VAR':
                # we use the function scope
                name_node = G.add_name_node(var_name,
                                      scope=G.find_func_scope_from_cur_scope())
            elif cur_node_attr.get('flags:string[]') in ['JS_DECL_LET', 'JS_DECL_CONST']:
                # we use the block scope                
                name_node = G.add_name_node(var_name, scope=G.cur_scope)
            else:
                # only if the variable is not defined and doesn't have 'var', 'let' or 'const',
                # we define it in the global scope
                name_node = G.add_name_node(var_name, scope=G.BASE_SCOPE)
        
        print(f'{node_id} handle result: obj_nodes={now_objs}, name={var_name}, name_nodes={[name_node]}')

        return NodeHandleResult(obj_nodes=now_objs, name=var_name, name_nodes=[name_node])

    elif cur_type == 'AST_PROP':
        return handle_prop(G, node_id, extra)

    elif cur_type == 'AST_CLOSURE':
        # for a CLOSURE, we treat it as a function defination. add a obj to obj graph
        # for now, we do not assign the name of the scope node 
        # if visited, return
        if "VISITED" in G.get_node_attr(node_id):
            return NodeHandleResult()

        added_scope = G.add_scope("FUNCTION_SCOPE", node_id)
        added_obj = G.add_obj_node(node_id, "function")
        G.add_edge(added_obj, added_scope, {"type:TYPE": "OBJ_TO_SCOPE"})

        G.set_node_attr(node_id, ("VISITED", "1"))

        return NodeHandleResult(obj_nodes=[added_obj])


    elif cur_type == 'AST_TOPLEVEL':
        added_obj, added_scope, module_exports = run_toplevel_file(G, node_id)
        now_objs = [module_exports]

        return NodeHandleResult(obj_nodes=now_objs)

    elif cur_type == 'AST_FUNC_DECL':
        [added_obj, added_scope] = decl_function(G, node_id)
        if added_obj is not None:
            obj_nodes = [added_obj]
        else: # the function has been declared
            obj_nodes = G.get_func_decls_by_ast_node(node_id)
        return NodeHandleResult(obj_nodes=obj_nodes)


    elif cur_type == 'AST_BINARY_OP':
        left_child, right_child = G.get_ordered_ast_child_nodes(node_id)
        if cur_node_attr.get('flags:string[]') == 'BINARY_BOOL_OR':
            left_objs = handle_node(G, left_child, extra).obj_nodes
            right_objs = handle_node(G, right_child, extra).obj_nodes
            now_objs = left_objs + right_objs # TODO: find cause of empty obj_nodes
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
            print(f'used objs={used_objs}')
            return NodeHandleResult(obj_nodes=[added_obj], used_objs=used_objs)

    elif cur_type in ['integer', 'double', 'string']:
        js_type = 'string' if cur_type == 'string' else 'number'
        code = G.get_node_attr(node_id).get('code')
        added_obj = G.add_obj_node(node_id, js_type, code)
        # modified_objs.add(added_obj)
        print(f'{node_id} handle result: obj_nodes={[added_obj]}, value={code}')
        return NodeHandleResult(obj_nodes=[added_obj], value=code)

    elif cur_type in ['AST_CALL', 'AST_METHOD_CALL', 'AST_NEW']:
        returned_objs, used_objs = call_function(G, node_id, extra)
        print(f'returned_objs={returned_objs}, used_objs={used_objs}')
        return NodeHandleResult(obj_nodes=returned_objs, used_objs=used_objs)

    elif cur_type == 'AST_RETURN':
        returned_var = G.get_ordered_ast_child_nodes(node_id)[0]
        var_name = G.get_name_from_child(returned_var)
        now_objs = G.get_objs_by_name(var_name)
        now_scope = G.cur_scope
        node_var_name = var_name
        return NodeHandleResult(obj_nodes=now_objs, name=var_name)
    
    elif cur_type == 'AST_IF':
        # lineno = G.get_node_attr(node_id).get('lineno:int')
        stmt_id = "If" + node_id
        if_elems = G.get_ordered_ast_child_nodes(node_id)
        branches = extra.get('branches', [])
        parent_branch = branches[-1] if branches else None
        for i, if_elem in enumerate(if_elems):
            branch_tag = BranchTag(stmt=stmt_id, branch=str(i))
            handle_node(G, if_elem, dict(extra, branches=branches+[branch_tag]))
        num_of_branches = len(if_elems) # which is always 2 for javascript...
        if not has_else(G, node_id):
            num_of_branches += 1
        merge(G, stmt_id, num_of_branches, parent_branch) # We always flatten edges
        return NodeHandleResult()

    elif cur_type == 'AST_IF_ELEM':
        condition, body = G.get_ordered_ast_child_nodes(node_id)
        handle_node(G, condition)
        branches = extra.get('branches', [])
        simurun_block(G, body, G.cur_scope, branches)
        return NodeHandleResult()
    
    elif cur_type == 'AST_SWITCH':
        condition, switch_list = G.get_ordered_ast_child_nodes(node_id)
        handle_node(G, condition, extra)
        handle_node(G, switch_list, extra)

    elif cur_type == 'AST_SWITCH_LIST':
        stmt_id = "Switch" + node_id
        branches = extra.get('branches', [])
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
            print(sty.ef.inverse + sty.fg.red + "RUN register {}".format(func_decl_id) + sty.rs.all)
            handle_node(G, func_decl_id, extra)

    # TODO: TMPRIGHT needs to be removed
    # delete if right node is temperate
    remove_list = G.get_node_by_attr("name", "TMPRIGHT")
    G.remove_nodes_from(remove_list)

    return NodeHandleResult()

def simurun_function(G, func_decl_ast_node, branches=[]):
    """
    Simurun a function by running its body.
    """
    func_name = G.get_name_from_child(func_decl_ast_node)
    print(sty.ef.inverse + sty.fg.green + "FUNCTION {} {} STARTS, SCOPE ID {}, OBJ ID {}, branches {}".format(func_decl_ast_node, func_name, G.cur_scope, G.cur_obj, branches) + sty.rs.all)
    for child in G.get_child_nodes(func_decl_ast_node, child_type='AST_STMT_LIST'):
        return simurun_block(G, child, parent_scope=G.cur_scope)
    return [], []

def simurun_block(G, ast_node, parent_scope, branches=[], block_scope=True):
    """
    Simurun a block by running its statements one by one.
    A block is a BlockStatement in JavaScript,
    or an AST_STMT_LIST in PHP.
    """
    returned_objs = set()
    used_objs = set()
    if parent_scope == None:
        parent_scope = G.cur_scope
    if block_scope:
        if G.scope_exists_by_ast_node(ast_node, parent_scope, max_depth=1):
            G.cur_scope = G.get_scope_by_ast_node(ast_node)
        else:
            G.cur_scope = \
                G.add_scope('BLOCK_SCOPE', ast_node, f'Block{ast_node}')
    stmts = G.get_ordered_ast_child_nodes(ast_node)
    # pre-declare variables
    # TODO: multiple possibilities
    func_scope = G.find_func_scope_from_cur_scope()
    for stmt in stmts:
        if G.get_node_attr(stmt)['type'] == 'AST_VAR' and \
            G.get_node_attr(stmt)['flags:string[]'] == 'JS_DECL_VAR':
            name = G.get_name_from_child(stmt)
            G.add_obj_to_scope(name=name, scope=func_scope,
                               tobe_added_obj=G.undefined_obj)
        elif G.get_node_attr(stmt)['type'] == 'AST_ASSIGN':
            children = G.get_ordered_ast_child_nodes(stmt)
            if G.get_node_attr(children[0])['type'] == 'AST_VAR' and \
                G.get_node_attr(children[0])['flags:string[]'] == 'JS_DECL_VAR':
                name = G.get_name_from_child(children[0])
                G.add_obj_to_scope(var_name=name, scope=func_scope,
                                   tobe_added_obj=G.undefined_obj)
    # simulate statements
    for stmt in stmts:
        handled_res = handle_node(G, stmt, {'branches': branches})

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
        parent_branch (BranchTag): parent branch tag (if this branch is inside another branch statement).
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
            # print(f'{u}->{v}\ncreated: {created}\ndeleted: {deleted}')
            # flag_created = True
            # for i in created:
            #     if i == False:
            #         flag_created = False
            flag_deleted = True
            for i in deleted:
                if i == False:
                    flag_deleted = False
            if True: # We always flatten edges, because the possibilities will still exist in parent branches
                # print(f'add edge {u}->{v}, branch={stmt}')
                for key, edge_attr in list(G.graph[u][v].items()): # we'll delete edges, so we convert it to list
                    branch_tag = edge_attr.get('branch', BranchTag())
                    if branch_tag.stmt == stmt:
                        G.graph.remove_edge(u, v, key)
                if parent_branch:
                    # add one addition edge with parent if/switch's (upper level's) tags
                    # print(f"create edge {u}->{v}, branch={BranchTag(parent_branch, op='A')}")
                    G.add_edge(u, v, {'type:TYPE': 'NAME_TO_OBJ', 'branch': BranchTag(parent_branch, op='A')})
                else:
                    # print(f'create edge {u}->{v}')
                    G.add_edge(u, v, {'type:TYPE': 'NAME_TO_OBJ'})
            if flag_deleted:
                # print(f'delete edge {u}->{v}, branch={stmt}')
                for key, edge_attr in list(G.graph[u][v].items()): # we'll delete edges, so we convert it to list
                    branch_tag = edge_attr.get('branch', BranchTag())
                    if branch_tag.stmt == stmt:
                        G.graph.remove_edge(u, v, key)
                if parent_branch:
                    # find if there is an addition in parent if/switch (upper level)
                    flag = True
                    for key, edge_attr in list(G.graph[u][v].items()):
                        branch_tag = edge_attr.get('branch', BranchTag())
                        if branch_tag == BranchTag(parent_branch, op='A'):
                            # print(f'delete edge {u}->{v}')
                            G.graph.remove_edge(u, v, key)
                            flag = False
                    # if there is not
                    if flag:
                        # add one deletion edge with parent if/switch's (upper level's) tags
                        # print(f"create edge {u}->{v}, branch={BranchTag(parent_branch, op='D')}")
                        G.add_edge(u, v, {'type:TYPE': 'NAME_TO_OBJ', 'branch': BranchTag(parent_branch, op='D')})
                else:
                    # find if there is an addition in upper level
                    for key, edge_attr in list(G.graph[u][v].items()):
                        if 'branch' not in edge_attr:
                            # print(f'delete edge {u}->{v}')
                            G.graph.remove_edge(u, v, key)

def generate_obj_graph(G, entry_nodeid):
    """
    generate the obj graph of a specific object
    """
    # set every function and closure to vartype object

    obj_nodes = G.get_nodes_by_type("AST_CLOSURE")
    obj_nodes += G.get_nodes_by_type("AST_FUNC_DECL")
    obj_nodes += G.get_nodes_by_type("AST_NEW")

    for node in obj_nodes:
        G.set_node_attr(node[0], ("VAR_TYPE", "OBJECT"))

    G.setup1()
    modeledJSBuiltIns.setup_js_builtins(G)
    G.setup2()
    print(sty.fg.green + "RUN" + sty.rs.all + ":", entry_nodeid)
    obj_nodes = G.get_nodes_by_type("AST_FUNC_DECL")
    for node in obj_nodes:
        register_func(G, node[0])
    handle_node(G, entry_nodeid)
    add_edges_between_funcs(G)

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
                G.add_obj_to_scope(None, param_name, None, scope=func_scope)
            else:
                if i >= len(args):
                    break
                for obj in args[i].obj_nodes:
                    G.add_obj_to_scope(None, param_name, None,
                        scope=func_scope, tobe_added_obj=obj)
    
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

def decl_function(G, node_id, func_name = None, parent_scope = None):
    """
    decl a function based on the node_id on current SCOPE
    func_name is designed for top level nodes only
    """
    # for a function decl, if already visited, return
    if "VISITED" in G.get_node_attr(node_id):
        return [None, None]
    if parent_scope == None:
        parent_scope = G.BASE_SCOPE
    # for a function decl, we add an obj and scope
    if func_name == None:
        node_name = G.get_name_from_child(node_id)
    else:
        node_name = func_name

    # do a normal add closure
    added_scope = G.add_scope("FUNCTION_SCOPE", node_id)
    added_obj = G.add_obj_node(node_id, "function")
    G.add_edge(added_obj, added_scope, {"type:TYPE": "OBJ_TO_SCOPE"})

    # for a func decl, should not have local var name
    # should add the name to base scope
    G.set_obj_by_scope_name(node_name, added_obj, scope = parent_scope)

    G.set_node_attr(node_id, ("VISITED", "1"))

    return [added_obj, added_scope]

def run_toplevel_file(G, node_id):
    """
    run a top level file 
    return a obj and scope
    """
    # add scope and obj first
    func_name = G.get_node_attr(node_id)['name']
    print(sty.fg(173) + sty.ef.inverse + 'FILE {} BEGINS'.format(func_name) + sty.rs.all)
    [func_decl_id, func_scope_id] = decl_function(G, node_id, func_name = func_name, parent_scope=G.BASE_SCOPE)
    # simurun the file
    func_scope_id = G.get_func_scope_by_name(func_name)
    backup_obj = G.cur_obj
    backup_scope = G.cur_scope

    added_obj = G.add_obj_node(node_id, "FUNC_RUN_OBJ")
    G.add_edge(added_obj, func_decl_id, {'type:TYPE': 'OBJ_DECL'})

    G.cur_scope = func_scope_id
    G.cur_obj = added_obj

    # add module object to the current file's scope
    added_module_obj = G.add_obj_to_scope(node_id, "module", "BUILT-IN")
    # add module.exports
    G.add_obj_as_prop(node_id, "BUILT-IN", "exports", parent_obj = added_module_obj)
    
    simurun_function(G, node_id)

    module_obj = G.get_obj_by_name('module')
    module_exports = G.get_obj_by_obj_name('exports', parent_obj=module_obj)

    # add obj to scope edge
    G.add_edge(added_obj, G.cur_scope, {"type:TYPE": "OBJ_TO_SCOPE"})

    G.cur_scope = backup_scope
    G.cur_obj = backup_obj

    return [added_obj, func_scope_id, module_exports]

def handle_require(G, node_id):
    arg_list = G.get_ordered_ast_child_nodes(node_id)[1]
    module_name = (G.get_name_from_child(arg_list) or '').strip("'\"")
    file_name = G.get_node_attr(node_id).get('name')
    toplevel_nodes = G.get_nodes_by_type_and_flag('AST_TOPLEVEL', 'TOPLEVEL_FILE')
    added_obj = None
    added_scope = None
    module_exports = None
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
                added_obj, added_scope, module_exports = run_toplevel_file(G, node)
                break
    if not found:
        print(sty.fg.red + sty.ef.bold + "Required module {} at {} not found!".format(module_name, file_name) + sty.rs.all, file=sys.stderr)
    return added_obj, added_scope, module_exports

def call_function(G, ast_node, extra):
    '''
    Call a function (AST_CALL/AST_METHOD_CALL/AST_NEW).
    
    Args:
        G (Graph): graph
        ast_node: the Call/New expression's AST node.
        extra (dict): extra information.
    '''
    # handle the callee
    if G.get_node_attr(ast_node).get('type') == 'AST_METHOD_CALL':
        handled_callee = handle_prop(G, ast_node, extra)
    else:
        handled_callee = handle_node(G, ast_node, extra)

    # find function declaration objects
    func_decl_objs = handled_callee.obj_nodes
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
            print(sty.fg.red + sty.ef.inverse + f'Function call error: Name node not found for {func_name}!')

    branches = extra.get('branches')
    parent_branch = branches[-1] if branches else None

    # if the function declaration has multiple possibilities,
    # and need to merge afterwards
    has_branches = (len(func_decl_objs) > 1)
    # if the function call is creating a new object
    is_new = False

    handled_args = []
    args_used_objs = set() # only for unmodeled built-in functions
    callback_functions = set() # only for unmodeled built-in functions
    if G.get_node_attr(ast_node).get('type') == 'AST_CALL':
        stmt_id = 'Call' + ast_node
    elif G.get_node_attr(ast_node).get('type') == 'AST_METHOD_CALL':
        stmt_id = 'Call' + ast_node
        # add parent object as an argument
        parent = G.get_ordered_ast_child_nodes(ast_node)[0]
        handled_args.append(handle_node(G, parent, extra))
    elif G.get_node_attr(ast_node).get('type') == 'AST_NEW':
        stmt_id = 'New' + ast_node
        is_new = True

    # handle arguments
    arg_list_node = G.get_ordered_ast_child_nodes(ast_node)[-1]
    arg_list = G.get_ordered_ast_child_nodes(arg_list_node)
    for arg in arg_list:
        handled_arg = handle_node(G, arg)
        handled_args.append(handled_arg)
        args_used_objs.update(handled_arg.obj_nodes)
        # add callback functions
        for obj in handled_arg.obj_nodes:
            if G.get_node_attr(obj).get('type') == 'function':
                callback_functions.add(obj)

    returned_objs = set()
    used_objs = set()

    # for each possible function declaration
    for i, func_obj in enumerate(func_decl_objs):
        branch_returned_objs = []
        branch_used_objs = []
        func_ast = G.get_obj_def_ast_node(func_obj)
        # switch scopes (New will swtich scopes and object by itself)
        if not is_new:
            backup_scope = G.cur_scope
            G.cur_scope = G.get_func_scope_by_obj_node(func_obj)
        # check if python function exists
        python_func = G.get_node_attr(func_obj).get('pythonfunc')
        if python_func: # special Python function
            if is_new:
                print(sty.fg.red + sty.ef.bold + f'Error: try to new Python function {python_func}...' + sty.rs.all, file=sys.stderr)
                continue
            else:
                print(sty.fg.green + sty.ef.bold + f'Running Python function {python_func}...' + sty.rs.all)
                # TODO: add branches info
                h = python_func(G, ast_node, *handled_args)
                branch_returned_objs = h.obj_nodes
                branch_used_objs = h.used_objs
        else: # JS function in AST
            # if has branches, add a new branch tag to the list
            if has_branches:
                next_branches = branches+[BranchTag(stmt=stmt_id, branch=i)]
            else:
                next_branches = branches
            # creating an object, or calling a function
            if is_new:
                branch_returned_objs = instantiate_obj(G, ast_node, func_ast,
                    branches=next_branches)
            else:
                branch_returned_objs, branch_used_objs = simurun_function(
                    G, func_ast, branches=next_branches)
            if G.get_node_attr(func_ast).get('labels:label') \
                == 'Artificial_AST':
                # if it's an unmodeled built-in function
                # add arguments as used objects
                for h in handled_args:
                    branch_used_objs.extend(h.obj_nodes)
                    branch_used_objs.extend(h.used_objs)
                # add a blank object as return objects
                returned_obj = G.add_obj_node(ast_node, "VIRTUAL_RETURNED_OBJ")
                for obj in branch_used_objs:
                    G.add_edge(obj, returned_obj,
                        {'type:TYPE': 'CONTRIBUTES_TO'})
                # call all callback functions
                if callback_functions:
                    print(sty.fg.green + sty.ef.inverse + 'callback functions =', callback_functions, sty.rs.all)
                    for obj in callback_functions:
                        func_ast = G.get_obj_def_ast_node(obj)
                        func_scope = G.get_func_scope_by_obj_node(obj)
                        call_callback_function(G, ast_node, func_ast, func_scope)
        returned_objs.update(branch_returned_objs)
        used_objs.update(branch_used_objs)
        # add call edge
        G.add_edge_if_not_exist(ast_node, func_ast, {"type:TYPE": "CALLS"})
        # switch back scope
        if not is_new:
            G.cur_scope = backup_scope

    if has_branches:
        merge(G, stmt_id, len(func_decl_objs), parent_branch)

    return list(returned_objs), list(used_objs)

def ast_call_function(G, node_id, func_name = None, parent_obj = None):
    """
    deprecated
    run a function start from node id
    """
    is_builtin = True

    if func_name == None:
        func_name = G.find_name_of_call(node_id)
    # if func_name is still none, this is a self-invoke call
    # the childnum should always be 0
    func_decl_id = None
    if func_name is None:
        func_decl_id = G.get_self_invoke_node_by_caller(node_id)

    if func_name == 'require':
        added_obj, added_scope, module_exports = handle_require(G, node_id)
        if module_exports:
            returned_objs = [module_exports]
        else:
            returned_objs = None
        return added_obj, added_scope, returned_objs, set(), True

    # handle arguments in the call statement
    arg_objs = [] # note every element in this array is also an array of object nodes

    # TOREMOVE
    used_arg_objs = set()

    callback_functions = set()

    arg_list_node = G.get_ordered_ast_child_nodes(node_id)[-1]
    arg_list = G.get_ordered_ast_child_nodes(arg_list_node)
    for arg in arg_list:
        handled_arg = handle_node(G, arg)
        arg_objs.append(handled_arg.obj_nodes)

        # TOREMOVE
        used_arg_objs.update(handled_arg.used_objs)
        used_arg_objs.update(handled_arg.obj_nodes)

        for obj in handled_arg.obj_nodes:
            if G.get_node_attr(obj).get('type') == 'function':
                callback_functions.add(obj)

    func_decl_obj_node = G.get_obj_by_obj_name(func_name, parent_obj)
    if func_decl_obj_node:
        python_func = G.get_node_attr(func_decl_obj_node).get('pythonfunc')
        if python_func:
            # TODO: multiple possibilities
            possible_arg_objs = [objs[0] for objs in arg_objs]
            if parent_obj:
                handled = python_func(parent_obj, *possible_arg_objs)
            else:
                handled = python_func(*possible_arg_objs)
            return None, None, handled.obj_nodes, handled.used_args, True

    if func_decl_id is None:
        if parent_obj == None:
            func_decl_id = G.get_func_declid_by_function_name(func_name)
        else:
            func_decl_id = G.get_func_declid_by_function_obj_name(func_name, parent_obj = parent_obj)

    if func_decl_id == None or len(G.get_out_edges(func_decl_id, edge_type = 'ENTRY')) == 0:
        func_decl_id = G.add_blank_func(func_name)

    # build the related function nodes 
    # TODO: temporary workaround for multi possibilities
    handled_decl = handle_node(G, func_decl_id)
    added_obj = handled_decl.obj_nodes[0] if handled_decl else None

    if added_obj != None:
        # add cur obj to parent obj
        if parent_obj == None:
            # set function call
            G.set_obj_by_scope_name(func_name, added_obj)
        else:
            # set method call
            G.set_obj_by_obj_name(func_name, added_obj, parent_obj = parent_obj)

    if parent_obj == None:
        # normal function call
        func_scope_id = G.get_func_scope_by_name(func_name)
    else:
        # method call
        func_scope_id = G.get_func_scope_by_obj_name(func_name, parent_obj = parent_obj)

    # handle parameters in the function definition
    param_list_node = None
    for child in G.get_ordered_ast_child_nodes(func_decl_id):
        if G.get_node_attr(child).get('type') == 'AST_PARAM_LIST':
            param_list_node = child
            break
    if param_list_node is not None:
        for i, child in enumerate(G.get_ordered_ast_child_nodes(param_list_node)):
            if i >= len(arg_objs): break
            # handled_param = handle_node(G, child)
            param_name = G.get_name_from_child(child)
            for obj in arg_objs[i]:
                print(sty.fg.green + f'add {obj}->{param_name} scope={func_scope_id}' + sty.rs.all)
                G.add_obj_to_scope(None, param_name, None, scope=func_scope_id, tobe_added_obj=obj)
 
    backup_obj = G.cur_obj
    backup_scope = G.cur_scope

    added_obj = G.add_obj_node(node_id, "FUNC_RUN_OBJ")
    # link run obj to func decl
    G.add_edge(added_obj, func_decl_id, {'type:TYPE': 'OBJ_DECL'})

    G.cur_scope = func_scope_id
    if parent_obj != None:
        G.cur_obj = parent_obj 


    returned_objs, _ = simurun_function(G, func_decl_id)

    # add obj to scope edge?
    if G.cur_scope == None:
        G.add_edge(added_obj, G.cur_scope, {"type:TYPE": "OBJ_TO_SCOPE"})

    G.cur_scope = backup_scope
    G.cur_obj = backup_obj

    # add call edge
    G.add_edge_if_not_exist(node_id, func_decl_id, {"type:TYPE": "CALLS"})

    print(sty.fg.green + sty.ef.inverse + 'callback functions=', callback_functions, sty.rs.all)
    if callback_functions:
        for obj in callback_functions:
            func_decl = G.get_obj_def_ast_node(obj)
            func_scope = G.get_func_scope_by_obj_node(obj)
            call_callback_function(G, node_id, func_decl, func_scope)

    if G.get_node_attr(func_decl_id).get('labels:label') == 'Artificial_AST':
        used_objs = list(used_arg_objs)
    else:
        used_objs = []
        is_builtin = False

    return [added_obj, None, returned_objs, used_objs, is_builtin]

def build_df(G, node_id, modified_objs):
    """
    build the df of current node id, deprecated
    """
    input_objs = set()
    inputs = G.get_all_inputs(node_id)

    for cur_input in inputs:
        cur_obj = G.get_obj_by_node_id(cur_input)
        var_name = G.get_name_from_child(cur_input)
        if cur_obj != None:
            input_objs = input_objs.add(cur_obj)

    for cur_obj in input_objs:
        if cur_obj == None:
            continue
        edges = G.get_in_edges(cur_obj, edge_type = 'LAST_MODIFIED')
        # TODO: name error, should be parent or child name
        for edge in edges:
            print(sty.fg.li_magenta + sty.ef.b + "OBJ REACHES" + sty.rs.all + " {} -> {}".format(edge[0], node_id))
            G.add_edge(edge[0], node_id, {'type:TYPE': 'OBJ_REACHES', 'var': cur_obj})

    if modified_objs != None:
        G.update_modified_edges(node_id, modified_objs)

def build_df_by_def_use(G, cur_stmt, used_objs):
    """
    Build data flows for objects used in current statement.
    The flow will be from the object's definition to current statement (current node).
    """
    if not used_objs or cur_stmt == None:
        return
    for obj in used_objs:
        def_ast_node = G.get_obj_def_ast_node(obj)
        def_cpg_node = G.find_nearest_upper_CPG_node(def_ast_node)
        if def_cpg_node == None: continue
        if def_cpg_node == cur_stmt: continue
        print(sty.fg.li_magenta + sty.ef.b + "OBJ REACHES" + sty.rs.all + " {} -> {}".format(def_cpg_node, cur_stmt))
        G.add_edge(def_cpg_node, cur_stmt, {'type:TYPE': 'OBJ_REACHES', 'obj': obj})

def main():
    G = Graph()
    G.import_from_CSV("./nodes.csv", "./rels.csv")
    generate_obj_graph(G, '1')
    # add_edges_between_funcs(G)
    # G.export_to_CSV("./testnodes.csv", "./testrels.csv", light = True)
    G.export_to_CSV("./testnodes.csv", "./testrels.csv", light = False)
    res_path = G.traceback("os-command")
    return res_path

if __name__ == "__main__":
    main()