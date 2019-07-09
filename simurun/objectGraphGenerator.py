#!/usr/bin/env python3
from graph import Graph
from scopeController import ScopeController
from utilities import *
import sys
import sty
import re

registered_func = {}

def printcolor(string, color="red"):
    """
    just for testing
    """
    print(sty.ef.inverse + sty.fg.red + str(string) + sty.rs.all)
    

def get_argids_from_funcallee(node_id):
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

def get_argnames_from_funcaller(node_id):
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
        caller_para_names = get_argnames_from_funcaller(caller_id)
        callee_paras = get_argids_from_funcallee(callee_id)
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

def handle_prop(G, ast_node, extra = {}) -> NodeHandleResult:
    '''
    Handle property.
    '''
    parent, prop = G.get_ordered_ast_child_nodes(ast_node)
    handled_parent = handle_node(G, parent, extra)
    prop_name = G.get_name_from_child(prop) or 'undefined'
    
    parent_name = handled_parent.name
    parent_objs = handled_parent.obj_nodes
    if parent_name == "this":
        parent_objs = G.cur_obj
        # parent_scope = G.cur_scope
    elif not parent_objs:
        if not (extra and extra.get('side') == 'right'):
            print(sty.ef.b + sty.fg.green + "PARENT OBJ {} NOT DEFINED, creating object nodes".format(parent_name) + sty.rs.all)
            # we assume this happens when it's a built-in var name
            parent_objs = [G.add_obj_to_scope(ast_node, parent_name, "BUILT-IN", scope = G.BASE_SCOPE)]
        else:
            print(sty.ef.b + sty.fg.green + "PARENT OBJ {} NOT DEFINED, return undefined".format(parent_name) + sty.rs.all)
            return NodeHandleResult()

    prop_objs = set()
    prop_name_nodes = set()
    if parent_objs:
        for parent_obj in parent_objs:
            prop_name_node = G.get_name_node_of_obj(prop_name, parent_obj)
            if prop_name_node != None:
                prop_name_nodes.add(prop_name_node)
            prop_obj_node = G.get_obj_by_obj_name(prop_name, parent_obj = parent_obj)
            if prop_obj_node != None:
                prop_objs.add(prop_obj_node)
        # TODO: implement built-in modules (in a database, etc.)
        # this is just a workaround for required modules
        if not prop_objs:
            if extra and extra.get('side') == 'right':
                return NodeHandleResult()
            else:
                print('add prop name node {}.{}'.format(parent_name, prop_name))
                # only add a name node
                for parent_obj in parent_objs:
                    prop_name_nodes.add(G.add_namenode_under_obj(prop_name, parent_obj))

    return NodeHandleResult(obj_nodes=list(prop_objs), name=prop_name, name_nodes=list(prop_name_nodes))

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

    right_objs = handled_right.obj_nodes

    if not right_objs:
        print(sty.fg.red + "Right OBJ not found" + sty.rs.all, file=sys.stderr)
        # G.set_obj_by_scope_name(left_name, None)
        # return NodeHandleResult()

    # get branch tags
    branch = None
    if extra and extra.get('branches'):
        branch = extra.get('branches')[-1]
    
    # do the assignment
    for name_node in handled_left.name_nodes:
        G.assign_obj_nodes_to_name_node(name_node, right_objs, branch=branch)

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

    added_obj = None
    added_scope = None
    now_objs = []
    now_scope = None
    node_var_name = None
    var_name_node = None
    modified_objs = set()
    used_objs = set()

    # handle registered functions
    if "HAVE_FUNC" in cur_node_attr:
        for func_decl_id in registered_func[node_id]:
            print(sty.ef.inverse + sty.fg.red + "RUN register {}".format(func_decl_id) + sty.rs.all)
            handle_node(G, func_decl_id, extra)

    if cur_type == "AST_PARAM":
        node_name = G.get_name_from_child(node_id)
        # assume we only have on reaches edge to this node
        now_edge = G.get_in_edges(node_id, edge_type = "REACHES")
        if len(now_edge) != 0:
            from_node = now_edge[0][0]
            now_objs = G.get_multi_objs_by_name(from_node)
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
        added_obj = G.add_obj_node(node_id, "OBJ_DECL")
        # added_obj = G.add_obj_to_scope(node_id, "LITERAL", "OBJ_DECL")

        ast_edges = G.get_out_edges(node_id, data = True, edge_type = "PARENT_OF")
        for edge in ast_edges:
            child = edge[1]
            handle_node(G, child, dict(extra, parent_obj=added_obj))
        
        return NodeHandleResult(obj_nodes=[added_obj])

    elif cur_type == 'AST_ARRAY_ELEM':
        if not (extra and 'parent_obj' in extra):
            print(sty.ef.inverse + sty.fg.red + "AST_ARRAY_ELEM occurs outside AST_ARRAY" + sty.rs.all, file=sys.stderr)
        else:
            value_node, key_node = G.get_ordered_ast_child_nodes(node_id)
            key = G.get_name_from_child(key_node)
            if not key: key = '*' # add wildcard for future use
            child_handle_result = handle_node(G, value_node, extra)
            child_added_objs = child_handle_result.obj_nodes
            now_objs = []
            for obj in child_added_objs:
                now_objs.append(G.add_obj_to_obj(node_id, None, key, parent_obj = extra['parent_obj'], tobe_added_obj = obj))
        return NodeHandleResult(obj_nodes=now_objs)

    elif cur_type == 'AST_DIM':
        G.set_node_attr(node_id, ('type', 'AST_PROP'))
        return handle_node(G, node_id, extra)


    elif cur_type == 'AST_VAR':
        var_name = G.get_name_from_child(node_id)

        now_objs = G.get_multi_objs_by_name(var_name)

        name_node = G.get_scope_namenode_by_name(var_name)
        if not (extra and extra.get('side') == 'right'):
            if name_node == None:
                if now_objs or cur_node_attr.get('flags:string[]') in ["JS_DECL_VAR", 'JS_DECL_LET', 'JS_DECL_CONST']:
                    # if the variable is defined in current scope or parent scopes,
                    # or undefined but has 'var', 'let' or 'const',
                    # we use the current scope
                    name_node = G.add_namenode_to_scope(var_name, scope=G.cur_scope)
                else:
                    # only if the variable is not defined and doesn't have 'var', 'let' or 'const',
                    # we define it in the global scope
                    name_node = G.add_namenode_to_scope(var_name, scope=G.BASE_SCOPE)
        
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
        added_obj = G.add_obj_node(node_id, "OBJ_DECL")
        G.add_edge(added_obj, added_scope, {"type:TYPE": "OBJ_TO_SCOPE"})

        return NodeHandleResult(obj_nodes=[added_obj])


    elif cur_type == 'AST_TOPLEVEL':
        added_obj, added_scope, module_exports = run_toplevel_file(G, node_id)
        now_objs = [module_exports]

        return NodeHandleResult(obj_nodes=now_objs)

    elif cur_type == 'AST_FUNC_DECL':
        [added_obj, added_scope] = decl_function(G, node_id)
        return NodeHandleResult(obj_nodes=[added_obj])


    elif cur_type == 'AST_BINARY_OP':
        if cur_node_attr.get('flags:string[]') == 'BINARY_BOOL_OR':
            left_child, right_child = G.get_ordered_ast_child_nodes(node_id)
            left_objs = handle_node(G, left_child, extra).obj_nodes
            right_objs = handle_node(G, right_child, extra).obj_nodes
            now_objs = left_objs + right_objs # TODO: find cause of empty obj_nodes
            return NodeHandleResult(obj_nodes=now_objs)
        else:
            added_obj = G.add_literal_obj()
            return NodeHandleResult(obj_nodes=[added_obj])

    elif cur_type == 'AST_NEW':
        # for now, only support ast call not method call
        added_objs = [G.add_obj_to_scope(node_id, "TMPRIGHT", "OBJ")]
        node_name = G.get_name_from_child(node_id)
        new_func_decl_id = G.get_func_declid_by_function_name(node_name)
        
        new_entry_id = G.get_entryid_by_function_name(node_name)

        if new_entry_id == None:
            # we assume it's a built-in function
            print("Built-in: Function {} not found".format(node_name))
            name_node = G.get_scope_namenode_by_name(node_name)
            if name_node == None:
                G.set_obj_by_scope_name(node_name, None, scope=G.BASE_SCOPE)
                name_node = G.get_scope_namenode_by_name(node_name)
            cur_obj_node = G.get_obj_by_name(node_name)

            # point the current varnode to the blank function
            if new_func_decl_id != None:
                G.graph.remove_edge(name_node, cur_obj_node)

            new_func_decl_id = G.add_blank_func(node_name, scope = G.BASE_SCOPE)
            added_objs = handle_node(G, new_func_decl_id, extra).obj_nodes

            for obj in added_objs:
                G.add_edge(name_node, obj, {'type:TYPE': 'NAME_TO_OBJ'})
                G.add_edge(obj, new_func_decl_id, {'type:TYPE': 'OBJ_TO_AST'})

            new_entry_id = G.get_entryid_by_function_name(node_name)
        
        # add edge between obj and obj decl
        for obj in added_objs:
            G.add_edge(obj, new_func_decl_id, {"type:TYPE": "OBJ_DECL"})

        backup_scope = G.cur_scope
        backup_obj = G.cur_obj

        # update current scope and object
        for obj in added_objs:
            G.cur_scope = G.get_scope_by_ast_decl(new_func_decl_id)
            G.cur_obj = obj 
            simurun_function(G, new_func_decl_id)
        
        # add obj to scope edge
        for obj in added_objs:
            G.add_edge(obj, G.cur_scope, {"type:TYPE": "OBJ_TO_SCOPE"})
        
        G.cur_scope = backup_scope
        G.cur_obj = backup_obj

        # finally add call edge from caller to callee
        G.add_edge_if_not_exist(node_id, new_func_decl_id, {"type:TYPE": "CALLS"})
        
        return NodeHandleResult(obj_nodes=added_objs)

    elif cur_type == 'integer' or cur_type == 'string':
        added_obj = G.add_literal_obj(node_id)
        code = G.get_node_attr(node_id).get('code')
        G.set_node_attr(added_obj, ('code', code))
        # modified_objs.add(added_obj)
        return NodeHandleResult(obj_nodes=[added_obj], value=code)


    elif cur_type == 'AST_METHOD_CALL':
        # get the method decl position
        [parent, child, var_list] = G.handle_method_call(node_id)

        # parent contains many parent, child only has one
        # get the next level of parent
        handled_parent = handle_node(G, parent, extra)

        parent_obj = handled_parent.obj_nodes.pop() if handled_parent.obj_nodes else None # TODO: temporary workaround
        parent_name = handled_parent.name

        # for newly added obj
        if parent_obj == None:
            print(sty.ef.b + sty.fg.green + "PARENT OBJ {} NOT DEFINED".format(parent_name) + sty.rs.all)
            # we assume this happens when it's a built-in var name
            parent_obj = G.add_obj_to_scope(node_id, parent_name, "BUILT-IN", scope = G.BASE_SCOPE)
        if parent_name == "this":
            parent_obj = G.cur_obj

        child_name = G.get_name_from_child(child)

        """
        child_obj = G.get_obj_by_obj_name(child_name, parent_obj = parent_obj)
        if child_obj == None:
            # assume the ast node is the root node
            added_obj = G.add_obj_to_obj(node_id, "OBJ", child_name, parent_obj = parent_obj)
        """

        var_name_node = G.get_name_node_of_obj(child_name, parent_obj = parent_obj)
        node_var_name = child_name

        # assume the method call will modify the parent object
        # modified_objs.add(parent_obj)
        _, added_scope, returned_objs, func_modified_objs = ast_call_function(G, node_id, func_name = child_name, parent_obj = parent_obj)
        if returned_objs:
            now_objs = list(returned_objs)
            print(sty.fg.green + 'method call return value ' + sty.rs.all + ', '.join(['{}: {}'.format(obj, G.get_node_attr(obj)) for obj in returned_objs]))
        # if func_modified_objs:
        #     modified_objs.union(func_modified_objs)
        return NodeHandleResult(obj_nodes=returned_objs)


    elif cur_type == 'AST_CALL':
        _, added_scope, returned_objs, func_modified_objs = ast_call_function(G, node_id)
        if returned_objs:
            print(sty.fg.green + 'function call return value ' + sty.rs.all + ', '.join(['{}: {}'.format(obj, G.get_node_attr(obj)) for obj in returned_objs]))
            return NodeHandleResult(obj_nodes=returned_objs)
        else:
            return NodeHandleResult()

    elif cur_type == 'AST_RETURN':
        returned_var = G.get_ordered_ast_child_nodes(node_id)[0]
        var_name = G.get_name_from_child(returned_var)
        now_objs = G.get_multi_objs_by_name(var_name)
        now_scope = G.cur_scope
        node_var_name = var_name
        return NodeHandleResult(obj_nodes=now_objs, name=var_name)
    
    elif cur_type == 'AST_IF':
        # lineno = G.get_node_attr(node_id).get('lineno:int')
        stmt_id = "If" + G.get_node_attr(node_id).get('lineno:int')
        if_elems = G.get_ordered_ast_child_nodes(node_id)
        branches = extra.get('branches', [])
        parent_branch = branches[-1] if branches else None
        for i, if_elem in enumerate(if_elems):
            branch_tag = BranchTag(stmt=stmt_id, branch=i)
            handle_node(G, if_elem, dict(extra, branches=branches+[branch_tag]))
        merge_new(G, stmt_id, len(if_elems), parent_branch)
        return NodeHandleResult()

    elif cur_type == 'AST_IF_ELEM':
        condition, body = G.get_ordered_ast_child_nodes(node_id)
        handle_node(G, condition)
        branches = extra.get('branches', [])
        simurun_block(G, body, G.cur_scope, branches)
        return NodeHandleResult()


    # TODO: TMPRIGHT needs to be removed
    # delete if right node is temperate
    remove_list = G.get_node_by_attr("name", "TMPRIGHT")
    G.remove_nodes_from(remove_list)
    G.set_node_attr(node_id, ("VISITED", "1"))

    return NodeHandleResult()

def simurun_function(G, func_decl_id):
    """
=======
>>>>>>> removing Joern
    Simurun a function by running its body.
    """
    print(sty.ef.inverse + sty.fg.green + "FUNCTION {} STARTS, SCOPE ID {}, OBJ ID {}".format(func_decl_id, G.cur_scope, G.cur_obj) + sty.rs.all)
    for child in G.get_descendant_nodes_by_types(func_decl_id, node_types=[]):
        if G.get_node_attr(child).get('type') == 'AST_STMT_LIST':
            return simurun_block(G, child, parent_scope=G.cur_scope)
    return [], []

def simurun_block(G, ast_node, parent_scope, branches=[]):
    """
    Simurun a block by running its statements one by one.
    A block is a BlockStatement in JavaScript, or an AST_STMT_LIST in PHP.
    """
    returned_objs = set()
    used_objs = set()
    if parent_scope == None:
        parent_scope = G.cur_scope
    if not G.scope_exists_by_ast_node(ast_node, parent_scope, max_depth=1):
        G.add_scope('BLOCK_SCOPE', ast_node, f'Block{ast_node}')
    stmts = G.get_ordered_ast_child_nodes(ast_node)
    for stmt in stmts:
        handled_res = handle_node(G, stmt, {'branches': branches})

        if handled_res:
            stmt_used_objs = handled_res.used_objs
            build_df_by_def_use(G, stmt, stmt_used_objs)

        if G.get_node_attr(stmt)['type'] == 'AST_RETURN':
            stmt_returned_objs = handled_res.obj_nodes
            stmt_used_objs = handled_res.used_objs
            if stmt_returned_objs:
                returned_objs.union(stmt_returned_objs)
            if stmt_used_objs:
                used_objs.union(stmt_used_objs)
    
    return returned_objs, used_objs

def merge(G, if_id, num_of_elems):
    '''
    deprecated
    '''
    name_nodes = G.get_node_by_attr('labels:label', 'Name')
    for u in name_nodes:
        for v in G.get_child_nodes(u, 'NAME_TO_OBJ'):
            created = [False] * num_of_elems
            deleted = [False] * num_of_elems
            for key, edge_attr in G.graph[u][v].items():
                branch = edge_attr.get('branch', '')
                match_a = re.match(f'-If{if_id}#([^-]*)A$', branch)
                match_d = re.match(f'-If{if_id}#([^-]*)D$', branch)
                if match_a:
                    if_elem_id = int(match_a.group(1))
                    created[if_elem_id] = True
                if match_d:
                    if_elem_id = int(match_d.group(1))
                    deleted[if_elem_id] = True
            flag_a = True
            for i in created:
                if i == False:
                    flag_a = False
            flag_d = True
            for i in deleted:
                if i == False:
                    flag_d = False
            if flag_a:
                attr = dict(G.graph[u][v].items()[0][1])
                branch = attr['branch']
                del attr['branch']
                new_branch = branch.split('-')[:-1]
                for key, edge_attr in G.graph[u][v].items():
                    G.graph.remove_edge(u, v, key)
                G.add_edge(u, v, dict(attr, branch = new_branch))
            if flag_d:
                attr = dict(G.graph[u][v].items()[0][1])
                branch = attr['branch']
                del attr['branch']
                new_branch = branch.split('-')[:-1]
                for key, edge_attr in G.graph[u][v].items():
                    G.graph.remove_edge(u, v, key)
                if new_branch != '':
                    G.add_edge(u, v, dict(attr, branch = new_branch))

def merge_new(G, stmt, num_of_branches, parent_branch):
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
            flag_created = True
            for i in created:
                if i == False:
                    flag_created = False
            flag_deleted = True
            for i in deleted:
                if i == False:
                    flag_deleted = False
            if flag_created:
                for key, edge_attr in G.graph[u][v].items():
                    branch_tag = edge_attr.get('branch', [])
                    if branch_tag.stmt == stmt:
                        G.graph.remove_edge(u, v, key)
                if parent_branch:
                    # add one addition edge with parent if/switch's (upper level's) tags
                    G.add_edge(u, v, {'type:TYPE': 'NAME_TO_OBJ', 'branch': BranchTag(parent_branch, op='A')})
                else:
                    G.add_edge(u, v, {'type:TYPE': 'NAME_TO_OBJ'})
            if flag_deleted:
                for key, edge_attr in G.graph[u][v].items():
                    branch_tag = edge_attr.get('branch', [])
                    if branch_tag.stmt == stmt:
                        G.graph.remove_edge(u, v, key)
                if parent_branch:
                    # add one deletion edge with parent if/switch's (upper level's) tags
                    G.add_edge(u, v, {'type:TYPE': 'NAME_TO_OBJ', 'branch': BranchTag(parent_branch, op='D')})
                else:
                    # we don't do anything, because the edges have been deleted
                    pass

def generate_obj_graph(G, entry_nodeid):
    """
    generate the obj graph of a specific object
    """
    # set every function and closure to vartype object

    obj_nodes = G.get_nodes_and_attrs_by_type("AST_CLOSURE")
    obj_nodes += G.get_nodes_and_attrs_by_type("AST_FUNC_DECL")
    obj_nodes += G.get_nodes_and_attrs_by_type("AST_NEW")

    for node in obj_nodes:
        G.set_node_attr(node[0], ("VAR_TYPE", "OBJECT"))

    G.setup_run(entry_nodeid)
    print(sty.fg.green + "RUN" + sty.rs.all + ":", entry_nodeid)
    obj_nodes = G.get_nodes_and_attrs_by_type("AST_FUNC_DECL")
    for node in obj_nodes:
        register_func(G, node[0])
    handle_node(G, entry_nodeid)
    add_edges_between_funcs(G)

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
    added_obj = G.add_obj_node(node_id, "OBJ_DECL")
    G.add_edge(added_obj, added_scope, {"type:TYPE": "OBJ_TO_SCOPE"})

    # for a func decl, should not have local var name
    # should add the name to base scope
    G.set_obj_by_scope_name(node_name, added_obj, scope = parent_scope)
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
    G.add_obj_to_obj(node_id, "BUILT-IN", "exports", parent_obj = added_module_obj)
    
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

def ast_call_function(G, node_id, func_name = None, parent_obj = None):
    """
    run a function start from node id
    """
    if func_name == None:
        func_name = G.find_name_of_call(node_id)
    if func_name == 'require':
        added_obj, added_scope, module_exports = handle_require(G, node_id)
        if module_exports:
            returned_objs = [module_exports]
        else:
            returned_objs = None
        return added_obj, added_scope, returned_objs, set()
    if parent_obj == None:
        func_decl_id = G.get_func_declid_by_function_name(func_name)
    else:
        func_decl_id = G.get_func_declid_by_function_obj_name(func_name, parent_obj = parent_obj)

    if func_decl_id == None or len(G.get_out_edges(func_decl_id, edge_type = 'ENTRY')) == 0:
        func_decl_id = G.add_blank_func(func_name)

    # build the related function nodes 
    # TODO: temporary workaround for multi possibilities
    added_obj = handle_node(G, func_decl_id).obj_nodes[0]

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


    backup_obj = G.cur_obj
    backup_scope = G.cur_scope

    added_obj = G.add_obj_node(node_id, "FUNC_RUN_OBJ")
    # link run obj to func decl
    G.add_edge(added_obj, func_decl_id, {'type:TYPE': 'OBJ_DECL'})

    G.cur_scope = func_scope_id
    if parent_obj != None:
        G.cur_obj = parent_obj 


    returned_objs, modified_objs = simurun_function(G, func_decl_id)

    # add obj to scope edge
    if G.cur_scope == None:
        G.add_edge(added_obj, G.cur_scope, {"type:TYPE": "OBJ_TO_SCOPE"})

    G.cur_scope = backup_scope
    G.cur_obj = backup_obj

    # add call edge
    G.add_edge_if_not_exist(node_id, func_decl_id, {"type:TYPE": "CALLS"})

    return [added_obj, None, returned_objs, modified_objs]

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
            input_objs = input_objs.union(cur_obj)

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
        print(sty.fg.li_magenta + sty.ef.b + "OBJ REACHES" + sty.rs.all + " {} -> {}".format(def_cpg_node, cur_stmt))
        G.add_edge(def_cpg_node, cur_stmt, {'type:TYPE': 'OBJ_REACHES', 'obj': obj})
    

G = Graph()
G.import_from_CSV("./nodes.csv", "./rels.csv")
scopeContorller = ScopeController(G)
generate_obj_graph(G, '1')
# add_edges_between_funcs(G)
# G.export_to_CSV("./testnodes.csv", "./testrels.csv", light = True)
G.export_to_CSV("./testnodes.csv", "./testrels.csv", light = False)
