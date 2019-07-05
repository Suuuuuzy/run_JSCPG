#!/usr/bin/env python3
from graph import Graph
from scopeController import ScopeController
from utilities import *
import sys
import sty
import re

registered_func = {}

# TODO:
# treat or as multiple options, for now, only assign the first one
# for undefined property, eg. a = g.f, a(), currently a point to blank function but not g.f. Fix later by changing ast_func_call
# param to inner obj reaches

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
        assert CPG_caller_id != None, "Failed to add CFG edge. CPG_caller_id is None."
        assert entry_edge[1] != None, "Failed to add CFG edge. Callee ENTRY is None."
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
    input a func_decl id, register it to the nearest parent who has CFG
    """
    # we assume that function decl should have a CF parent
    bfs_queue = []
    visited = set()
    bfs_queue.append(node_id)
    while(len(bfs_queue)):
        cur_node = bfs_queue.pop(0)

        # if visited before, stop here
        if cur_node in visited:
            continue
        else:
            visited.add(cur_node)

        out_edges = G.get_in_edges(cur_node, edge_type = 'PARENT_OF')
        out_nodes = [edge[0] for edge in out_edges]
        for node in out_nodes:
            if len(G.get_out_edges(node[0], edge_type = "FLOWS_TO")) != 0 and len(G.get_out_edges(node[0], edge_type = "ENTRY")) != 0: # and? or?
                entry_id = G.get_out_edges(node[0], edge_type = "ENTRY")[0][1]
                G.set_node_attr(entry_id, ("HAVE_FUNC", node_id))
                if entry_id not in registered_func:
                    registered_func[entry_id] = set()
                registered_func[entry_id].add(node_id)
                return

        bfs_queue += out_nodes

def handle_prop(G, ast_node, extra = {}) -> NodeHandleResult:
    '''
    Handle property.
    '''
    parent, prop = G.get_ordered_ast_child_nodes(ast_node)
    handled_parent = handle_node(G, parent, extra)
    prop_name = handle_node(G, prop, extra).get('name', 'undefined')
    
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
            prop_name_nodes.add(G.get_name_node_of_obj(prop_name, parent_obj))
            prop_objs.add(G.get_obj_by_obj_name(prop_name, parent_obj = parent_obj))
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

    return NodeHandleResult(obj_nodes=prop_objs, name=prop_name, name_nodes=prop_name_nodes)

def handle_assign(G, node_id, extra = {}) -> NodeHandleResult:
    '''
    Handle assignment statement.
    '''
    # get AST children (left and right sides)
    ast_children = G.get_ordered_ast_child_nodes(node_id)
    try:
        left, right = ast_children
    except ValueError:
        # if only have left side
        return handle_node(G, ast_children[0], extra)
    
    # recursively handle both sides
    handled_right = handle_node(G, right, dict(extra, side='right'))
    handled_left = handle_node(G, left, dict(extra, side='left'))

    if not handled_right:
        print(sty.fg.red + "RIGHT OBJ NOT FOUND WITH NODE ID {} and right ID {}".format(node_id, right) + sty.rs.all, file=sys.stderr)
        return NodeHandleResult()

    right_objs = handled_right.obj_nodes

    # if not right_objs:
    #     print(sty.fg.red + "Right OBJ not found" + sty.rs.all, file=sys.stderr)
    #     G.set_obj_by_scope_name(left_name, None)
    #     return NodeHandleResult()

    branch = None
    if extra.get('branches'):
        branch = extra.get('branches')[-1]
    
    for name_node in handled_left.name_nodes:
        G.assign_obj_nodes_to_name_node(name_node, right_objs, BranchTag=branch)

def handle_node(G, node_id, extra = {}):
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

        modified_objs.union(now_objs)

    elif cur_type == "AST_ASSIGN":
        # for assign operation, the right part is childnum 1, the left part is childnum 0
        ast_edges = G.get_out_edges(node_id, data = True, edge_type = "PARENT_OF")

        if len(ast_edges) == 1:
            # only have left
            handle_node(G, ast_edges[0][1], extra)
            return [None]

        left, right = G.get_ordered_ast_child_nodes(node_id)

        handled_right = handle_node(G, right, dict(extra, side='right'))
        handled_left = handle_node(G, left, dict(extra, side='left'))

        if not handled_right:
            print(sty.fg.red + "RIGHT OBJ NOT FOUND WITH NODE ID {} and right ID {}".format(node_id, right) + sty.rs.all, file=sys.stderr)
            return None

        # print(handled_right)
        [right_added_obj, right_added_scope, right_objs, right_scope, modified_objs, used_objs, right_name, right_name_node] = handled_right
        [left_added_obj, left_added_scope, left_objs, left_scope, modified_objs, used_objs, right_name, right_name_node] = handled_left

        left_attr = G.get_node_attr(left)
        right_attr = G.get_node_attr(right)
        right_name = G.get_name_from_child(right)
        left_name = G.get_name_from_child(left)

        if right_added_obj != None:
            # added new right obj, left should be assigned to the new one
            right_objs = [right_added_obj]

        if not right_objs:
            print(sty.fg.red + "Right OBJ not found" + sty.rs.all, file=sys.stderr)
            G.set_obj_by_scope_name(left_name, None)
            return [None] * 8

        if right_attr['type'] == 'AST_PROP':
            [child_added_obj, child_added_scope, child_objs, child_scope, _, _, child_name, child_name_node] = handled_right
            # child_name = G.get_name_from_child(child_ast_id)
            if child_added_obj != None:
                child_objs = child_added_obj
            right_objs = child_objs

        if left_attr['type'] == 'AST_PROP':
            # for property, find the scope, point the name
            [child_added_obj, child_added_scope, child_objs, child_scope, _, _, child_name, child_name_node] = handled_left
            # get the current obj of this name node
            cur_child_edge = G.get_out_edges(child_name_node, edge_type = "NAME_TO_OBJ")
            if cur_child_edge: # if it's not an empty list (when the name node has no corresponding obj)
                if extra.get('branch'):
                    G.set_edge_attr(child_name_node, cur_child_edge[0][1], 0, {"branch": extra.get('branch')+"D"})
                else:
                    G.graph.remove_edge(child_name_node, cur_child_edge[0][1])
            for obj in right_objs:
                if extra.get('branch'):
                    G.add_edge(child_name_node, obj, {"type:TYPE": "NAME_TO_OBJ", "branch": extra.get('branch')+"A"})
                else:
                    G.add_edge(child_name_node, obj, {"type:TYPE": "NAME_TO_OBJ"})
        else:
            flag = False
            for obj in right_objs:
                G.set_obj_by_scope_name(left_name, obj, scope = left_scope, multi = flag, branch = extra.get('branch'))
                if flag == False:
                    flag = True

        if 'VAR_TYPE' not in right_attr:
            print('right var type not set')
        else:
            right_vartype = right_attr['VAR_TYPE']
            G.set_node_attr(left, ("VAR_TYPE", right_vartype))
        try:
            left_objs = G.get_multi_objs_by_name(left_name)
        except:
            print(sty.fg.red + "ERROR: left obj {} not found".format(left) + sty.rs.all, file=sys.stderr)

        if not left_objs:
            # may be tricky, for left property
            left_objs = right_objs
        
        print(sty.ef.b + sty.fg.green + "ASSIGNED" + sty.rs.all + " {}: {} -> {}".format(right_name, [(int(obj), G.get_node_attr(obj)) for obj in right_objs], left_name))
        modified_objs.union(left_objs)
    
    elif cur_node_attr['type'] == 'AST_ARRAY':
        added_obj = G.add_obj_node(node_id, "OBJ_DECL")
        # added_obj = G.add_obj_to_scope(node_id, "LITERAL", "OBJ_DECL")

        ast_edges = G.get_out_edges(node_id, data = True, edge_type = "PARENT_OF")
        for edge in ast_edges:
            child = edge[1]
            handle_node(G, child, dict(extra, parent_obj=added_obj))


    elif cur_node_attr['type'] == 'AST_ARRAY_ELEM':
        if not (extra and 'parent_obj' in extra):
            print(sty.ef.inverse + sty.fg.red + "AST_ARRAY_ELEM occurs outside AST_ARRAY" + sty.rs.all, file=sys.stderr)
        else:
            value_node, key_node = G.get_ordered_ast_child_nodes(node_id)
            key = G.get_name_from_child(key_node)
            if not key: key = '*' # add wildcard for future use
            child_added_obj, _, _, _, _, _, _, _ = handle_node(G, value_node, extra)
            added_obj = G.add_obj_to_obj(node_id, None, key, parent_obj = extra['parent_obj'], tobe_added_obj = child_added_obj)


    elif cur_node_attr['type'] == 'AST_DIM':
        G.set_node_attr(node_id, ('type', 'AST_PROP'))
        return handle_node(G, node_id, extra)


    elif cur_node_attr['type'] == 'AST_VAR':
        # return [added obj, added scope, var name]
        # for var variables, we return it's obj, scope
        var_name = G.get_name_from_child(node_id)

        now_objs = G.get_multi_objs_by_name(var_name)

        # this is not added before, add an object and return
        # for now, we think let is equals to var.
        # TODO: limit the scope of let and handle const
        # like 'let', 'const' is also block-scoped.
        # TODO: add block scopes
        if now_objs or cur_node_attr.get('flags:string[]') in ["JS_DECL_VAR", 'JS_DECL_LET', 'JS_DECL_CONST']:
            # if the variable is defined in current scope or parent scopes,
            # or undefined but has 'var', 'let' or 'const',
            # we use the current scope
            now_scope = G.cur_scope
        else:
            # only if the variable is not defined and doesn't have 'var', 'let' or 'const',
            # we define it in the global scope
            now_scope = G.BASE_SCOPE
        node_var_name = var_name


    elif cur_node_attr['type'] == 'AST_PROP':
        # return the related values of youngest child
        [parent, child] = G.handle_property(node_id)
        child_name = G.get_name_from_child(child)
        # parent contains many parent, child only has one
        # get the next level of parent
        handled_parent = handle_node(G, parent, extra)

        [parent_added_obj, parent_added_scope, parent_objs, parent_scope, modified_objs, used_objs, parent_name, _] = handled_parent
        parent_obj = parent_objs.pop() if parent_objs else None # TODO: temporary workaround
        if child_name == None:
            child_name = 'undefined'

        # for newly added obj
        if parent_added_obj != None:
            parent_obj = parent_added_obj
        if parent_obj == None:
            if not (extra and extra.get('side') == 'right'):
                print(sty.ef.b + sty.fg.green + "PARENT OBJ {} NOT DEFINED, creating object nodes".format(parent_name) + sty.rs.all)
                # we assume this happens when it's a built-in var name
                parent_obj = G.add_obj_to_scope(node_id, parent_name, "BUILT-IN", scope = G.BASE_SCOPE)
                modified_objs.add(parent_obj)
            else:
                print(sty.ef.b + sty.fg.green + "PARENT OBJ {} NOT DEFINED, return undefined".format(parent_name) + sty.rs.all)
        if parent_name == "this":
            parent_obj = G.cur_obj
            parent_scope = G.cur_scope

        if parent_obj != None:
            child_obj = G.get_obj_by_obj_name(child_name, parent_obj = parent_obj)
            # TODO: implement built-in modules (in a database, etc.)
            # this is just a workaround for required modules
            if child_obj == None:
                if not (extra and extra.get('side') == 'right'):
                    G.add_namenode_under_obj(child_name, parent_obj)
                elif G.get_node_attr(parent)['type'] == 'AST_CALL':
                    '''
                    # assume the ast node is the root node
                    # added_obj = G.add_obj_to_obj(node_id, "OBJ", child_name, parent_obj = parent_obj)
                    added_func = G.add_blank_func(child_name, scope = G.BASE_SCOPE)
                    # should the object node of the blank function point to the artificial AST node?
                    added_obj = G.add_obj_to_obj(node_id, 'BUILT_IN', child_name, parent_obj = parent_obj, tobe_added_obj = added_func)
                    child_obj = added_obj
                    '''
                    print('add child obj {}.{}'.format(parent_name, child_name))
                    added_obj = G.add_obj_to_obj(node_id, 'BUILT_IN', child_name, parent_obj, None)
                    child_obj = added_obj

            # print(parent_name, parent_obj, child_name, child_obj, cur_node_attr['lineno:int'], '=====================================')
            if child_obj != None:
                now_objs = [child_obj]
            var_name_node = G.get_name_node_of_obj(child_name, parent_obj = parent_obj)
            node_var_name = child_name

    elif cur_node_attr['type'] == 'AST_CLOSURE':
        # for a CLOSURE, we treat it as a function defination. add a obj to obj graph
        # for now, we do not assign the name of the scope node 
        # if visited, return
        if "VISITED" in G.get_node_attr(node_id):
            return [None, None, None, None, None, None, None, None] 

        added_scope = G.add_scope("FUNCTION_SCOPE", node_id)
        added_obj = G.add_obj_node(node_id, "OBJ_DECL")
        G.add_edge(added_obj, added_scope, {"type:TYPE": "OBJ_TO_SCOPE"})

        modified_objs.add(added_obj)


    elif cur_node_attr['type'] == 'AST_TOPLEVEL':
        added_obj, added_scope, module_exports = run_toplevel_file(G, node_id)
        now_objs = [module_exports]

    elif cur_node_attr['type'] == 'AST_FUNC_DECL':
        [added_obj, added_scope] = decl_function(G, node_id)
        modified_objs.add(added_obj)


    elif cur_node_attr['type'] == 'AST_BINARY_OP':
        if cur_node_attr.get('flags:string[]') == 'BINARY_BOOL_OR':
            # handled_left_or = handle_node(G, G.get_child_nodes(node_id)[0])
            # [or_added_obj, or_added_scope, or_obj, or_scope, _, or_name, or_name_node] = handled_left_or 
            # if or_added_obj != None:
            #     or_obj = or_added_obj
            # if or_obj == None:
            #     added_obj = G.add_literal_obj()
            # else:
            #     now_objs = [or_obj]
            left_child, right_child = G.get_ordered_ast_child_nodes(node_id)
            _, _, left_objs, _, _, _, _, _ = handle_node(G, left_child, extra)
            _, _, right_objs, _, _, _, _, _ = handle_node(G, right_child, extra)
            now_objs.extend(left_objs)
            now_objs.extend(right_objs)
        else:
            added_obj = G.add_literal_obj()
        modified_objs.add(added_obj)

    elif cur_node_attr['type'] == 'AST_NEW':
        # for now, only support ast call not method call
        added_obj = G.add_obj_to_scope(node_id, "TMPRIGHT", "OBJ")
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
            [added_obj, _, _, _, _, _, _, _] = handle_node(G, new_func_decl_id, extra)

            G.add_edge(name_node, added_obj, {'type:TYPE': 'NAME_TO_OBJ'})
            G.add_edge(added_obj, new_func_decl_id, {'type:TYPE': 'OBJ_TO_AST'})

            new_entry_id = G.get_entryid_by_function_name(node_name)
        
        # add edge between obj and obj decl
        G.add_edge(added_obj, new_func_decl_id, {"type:TYPE": "OBJ_DECL"})

        backup_scope = G.cur_scope
        backup_obj = G.cur_obj

        # update current scope and object
        G.cur_scope = G.get_scope_by_ast_decl(new_func_decl_id)
        G.cur_obj = added_obj 
        simurun_function_new(G, new_func_decl_id)
        
        # add obj to scope edge
        G.add_edge(added_obj, G.cur_scope, {"type:TYPE": "OBJ_TO_SCOPE"})
        
        G.cur_scope = backup_scope
        G.cur_obj = backup_obj

        # finally add call edge from caller to callee
        G.add_edge_if_not_exist(node_id, new_func_decl_id, {"type:TYPE": "CALLS"})
        modified_objs.add(added_obj)

    elif cur_node_attr['type'] == 'integer' or cur_node_attr['type'] == 'string':
        added_obj = G.add_literal_obj(node_id)
        G.set_node_attr(added_obj, ('code', G.get_name_from_child(node_id)))
        modified_objs.add(added_obj)


    elif cur_node_attr['type'] == 'AST_METHOD_CALL':
        # get the method decl position
        [parent, child, var_list] = G.handle_method_call(node_id)

        # parent contains many parent, child only has one
        # get the next level of parent
        handled_parent = handle_node(G, parent, extra)

        [parent_added_obj, parent_added_scope, parent_objs, parent_scope, modified_objs, used_objs, parent_name, _] = handled_parent
        parent_obj = parent_objs.pop() if parent_objs else None # TODO: temporary workaround

        # for newly added obj
        if parent_added_obj != None:
            parent_obj = parent_added_obj
        if parent_obj == None:
            print(sty.ef.b + sty.fg.green + "PARENT OBJ {} NOT DEFINED".format(parent_name) + sty.rs.all)
            # we assume this happens when it's a built-in var name
            parent_obj = G.add_obj_to_scope(node_id, parent_name, "BUILT-IN", scope = G.BASE_SCOPE)
            modified_objs.add(parent_obj)
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

        func_obj = parent_obj
        # assume the method call will modify the parent object
        modified_objs.add(parent_obj)
        _, added_scope, returned_objs, func_modified_objs = ast_call_function(G, node_id, func_name = child_name, parent_obj = parent_obj)
        if returned_objs:
            now_objs = list(returned_objs)
            print(sty.fg.green + 'method call return value ' + sty.rs.all + ', '.join(['{}: {}'.format(obj, G.get_node_attr(obj)) for obj in returned_objs]))
        if func_modified_objs:
            modified_objs.union(func_modified_objs)


    elif cur_node_attr['type'] == 'AST_CALL':
        _, added_scope, returned_objs, func_modified_objs = ast_call_function(G, node_id)
        if returned_objs:
            now_objs = returned_objs
            print(sty.fg.green + 'function call return value ' + sty.rs.all + ', '.join(['{}: {}'.format(obj, G.get_node_attr(obj)) for obj in returned_objs]))
        modified_objs.add(added_obj)
        if func_modified_objs:
            modified_objs.union(func_modified_objs)

    elif cur_node_attr['type'] == 'AST_RETURN':
        ast_edges = G.get_out_edges(node_id, data = True, edge_type = "PARENT_OF")
        returned_var = ast_edges[0][1]
        var_name = G.get_name_from_child(returned_var)
        now_objs = G.get_multi_objs_by_name(var_name)
        now_scope = G.cur_scope
        node_var_name = var_name
    
    elif cur_node_attr['type'] == 'AST_IF':
        lineno = G.get_node_attr(node_id).get('lineno:int')
        if_elems = G.get_ordered_ast_child_nodes(node_id)
        for if_elem in if_elems:
            handle_node(G, if_elem, dict(extra, if_id=lineno))
        merge(G, lineno, len(if_elems))

    elif cur_node_attr['type'] == 'AST_IF_ELEM':
        condition, body = G.get_ordered_ast_child_nodes(node_id)
        handle_node(G, condition)
        cur_branch = extra.get('branch', '')
        if_id = extra.get('if_id', None)
        if_elem_id = G.get_node_attr(node_id).get('childnum:int', None)
        simurun_block(G, body, G.cur_scope, branch=f'{cur_branch}-If{if_id}#{if_elem_id}')

    # handle registered functions
    if "HAVE_FUNC" in cur_node_attr:
        # func_decl_id = cur_node_attr['HAVE_FUNC']
        for func_decl_id in registered_func[node_id]:
            handle_node(G, func_decl_id, extra)
    
    # delete if right node is temperate
    remove_list = G.get_node_by_attr("name", "TMPRIGHT")
    G.remove_nodes_from(remove_list)
    G.set_node_attr(node_id, ("VISITED", "1"))

    return [added_obj, added_scope, now_objs, now_scope, modified_objs, used_objs, node_var_name, var_name_node]

def simurun_function(G, func_decl_id):
    """
    bfs run a simurun from a entry id
    """
    print(sty.ef.inverse + sty.fg.green + "FUNCTION {} STARTS, SCOPE ID {}, OBJ ID {}".format(func_decl_id, G.cur_scope, G.cur_obj) + sty.rs.all)
    bfs_queue = []
    visited = set()
    returned_objs = set()
    modified_objs = set()
    # we start from the entry id
    entry_id = G.get_out_edges(func_decl_id, edge_type = "ENTRY")[0][1]
    bfs_queue.append(entry_id)
    while(len(bfs_queue)):
        cur_node = bfs_queue.pop(0)

        # if visited before, stop here
        if cur_node in visited:
            continue
        else:
            visited.add(cur_node)

        # print("BFS NODE {}".format(cur_node))
        handled_res = handle_node(G, cur_node)
        if handled_res != None and len(handled_res) == 8:
            # modified_objs = handled_res[4]
            used_objs = handled_res[5]
            build_df_by_def_use(G, cur_node, used_objs)

        if G.get_node_attr(cur_node)['type'] == 'AST_RETURN':
            _, _, stmt_returned_objs, _, stmt_modified_objs, stmt_used_objs, _, _ = handled_res
            returned_objs.union(stmt_returned_objs)
            modified_objs.union(stmt_modified_objs)

        out_edges = G.get_out_edges(cur_node, data = True, keys = True, edge_type = 'FLOWS_TO')
        if len(out_edges) == 0:
            out_edges = G.get_out_edges(cur_node, data = True, keys = True, edge_type = 'ENTRY')
        out_nodes = [edge[1] for edge in out_edges]
        bfs_queue += out_nodes

    return returned_objs, modified_objs

def simurun_function_new(G, func_decl_id):
    """
    Simurun a function by running its body.
    """
    print(sty.ef.inverse + sty.fg.green + "FUNCTION {} STARTS, SCOPE ID {}, OBJ ID {}".format(func_decl_id, G.cur_scope, G.cur_obj) + sty.rs.all)
    for child in G.get_descendant_nodes_by_types(func_decl_id, node_types=[]):
        if G.get_node_attr(child).get('type') == 'AST_STMT_LIST':
            return simurun_block(G, child, parent_scope=G.cur_scope)
    return None, None

def simurun_block(G, ast_node, parent_scope, branch=None):
    """
    Simurun a block by running its statements one by one.
    A block is a BlockStatement in JavaScript, or an AST_STMT_LIST in PHP.
    """
    returned_objs = set()
    modified_objs = set()
    if parent_scope == None:
        parent_scope = G.cur_scope
    if not G.scope_exists_by_ast_node(ast_node, parent_scope, max_depth=1):
        G.add_scope('BLOCK_SCOPE', ast_node, f'Block{ast_node}')
    stmts = G.get_ordered_ast_child_nodes(ast_node)
    for stmt in stmts:
        handled_res = handle_node(G, stmt, {'branch': branch})
        if handled_res != None and len(handled_res) == 8:
            used_objs = handled_res[5]
            build_df_by_def_use(G, stmt, used_objs)

        if G.get_node_attr(stmt)['type'] == 'AST_RETURN':
            _, _, stmt_returned_objs, _, stmt_modified_objs, stmt_used_objs, _, _ = handled_res
            returned_objs.union(stmt_returned_objs)
            modified_objs.union(stmt_modified_objs)
    
    return returned_objs, modified_objs

def merge(G, if_id, num_of_elems):
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
    
    simurun_function_new(G, node_id)

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
    [added_obj, added_scope, _, _, _, _, _, _] = handle_node(G, func_decl_id)

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


    returned_objs, modified_objs = simurun_function_new(G, func_decl_id)

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
        # we assume we only have one last modified edge
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
