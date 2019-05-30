#!/usr/bin/env python3
from graph import Graph
from scopeController import ScopeController

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
        added_edge_list.append((CPG_caller_id, entry_edge[1], {'type:TYPE': 'FLOWS_TO'}))

        # add DF edge to PARAM
        # the order of para in paras matters!
        caller_para_names = get_argnames_from_funcaller(caller_id)
        callee_paras = get_argids_from_funcallee(callee_id)
        for idx in range(min(len(callee_paras), len(caller_para_names))):
            added_edge_list.append((CPG_caller_id, callee_paras[idx], {'type:TYPE': 'INTER_FUNC_REACHES', 'var': str(caller_para_names[idx])}))

    G.add_edges_from_list(added_edge_list)

def register_func(G, node_id):
    """
    input a func_decl id, register it to the nearest parent who has CFG
    """
    # we assume that function decl should have a CF parent
    cur_id = node_id
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
            if len(G.get_out_edges(node[0], edge_type = "FLOWS_TO")) != 0 or len(G.get_out_edges(node[0], edge_type = "ENTRY")) != 0:
                entry_id = G.get_out_edges(node[0], edge_type = "ENTRY")[0][1]
                G.set_node_attr(entry_id, ("HAVE_FUNC", node_id))
                if entry_id not in registered_func:
                    registered_func[entry_id] = set()
                registered_func[entry_id].add(node_id)
                return

        bfs_queue += out_nodes

def handle_node(G, node_id):
    """
    for different node type, do different actions to handle this node
    return [added_obj, added_scope, cur_obj, cur_scope, modified_objs, var_name, var_name_node]
    """
    cur_node_attr = G.get_node_attr(node_id)
    cur_type = cur_node_attr['type']
    if 'lineno:int' not in cur_node_attr:
        cur_node_attr['lineno:int'] = '-1'
    print("HANDLE NODE: {} {} {}, lineno: {}".format(node_id, cur_type, G.get_name_from_child(node_id), cur_node_attr['lineno:int']))

    added_obj = None
    added_scope = None
    now_obj = None
    now_scope = None
    node_var_name = None
    var_name_node = None
    modified_objs = set()

    if cur_type == "AST_PARAM":
        node_name = G.get_name_from_child(node_id)
        # assume we only have on reaches edge to this node
        now_edge = G.get_in_edges(node_id, edge_type = "REACHES")
        if len(now_edge) != 0:
            from_node = now_edge[0][0]
            now_obj = G.get_obj_by_node_id(from_node)
            G.set_obj_by_scope_name(node_name, now_obj)
        
        if now_obj == None:
            # for now, just add a new obj.
            added_obj = G.add_obj_to_scope(node_id, node_name, "PARAM_OBJ")
            now_obj = added_obj

        modified_objs.add(now_obj)

    elif cur_type == "AST_ASSIGN":
        # for assign operation, the right part is childnum 1, the left part is childnum 0
        ast_edges = G.get_out_edges(node_id, data = True, edge_type = "PARENT_OF")

        if len(ast_edges) == 1:
            # only have left
            handle_node(G, ast_edges[0][1])
            return [None]

        if G.get_node_attr(ast_edges[0][1])['childnum:int'] == '1':
            right = ast_edges[0][1]
            left = ast_edges[1][1]
        else:
            right = ast_edges[1][1]
            left = ast_edges[0][1]

        handled_right = handle_node(G, right)
        handled_left = handle_node(G, left)

        if handled_right == None:
            print("RIGHT OBJ NOT FOUND WITH NODE ID {} and right ID {}".format(node_id, right))
            return None

        # print(handled_right)
        [right_added_obj, right_added_scope, right_obj, right_scope, modified_objs, right_name, right_name_node] = handled_right
        [left_added_obj, left_added_scope, left_obj, left_scope, modified_objs, right_name, right_name_node] = handled_left


        left_attr = G.get_node_attr(left)
        right_attr = G.get_node_attr(right)
        right_name = G.get_name_from_child(right)
        left_name = G.get_name_from_child(left)

        if right_added_obj != None:
            # added new right obj, left should be assigned to the new one
            right_obj = right_added_obj

        if right_obj == None:
            print("Right OBJ not found")
            return None

        if right_attr['type'] == 'AST_PROP':
            [child_added_obj, child_added_scope, child_obj, child_scope, _, child_name, child_name_node] = handled_right
            # child_name = G.get_name_from_child(child_ast_id)
            if child_added_obj != None:
                child_obj = child_added_obj
            right_obj = child_obj


        if left_attr['type'] == 'AST_PROP':
            # for property, find the scope, point the name
            [child_added_obj, child_added_scope, child_obj, child_scope, _, child_name, child_name_node] = handled_left
            # get the current obj of this name node
            cur_child_edge = G.get_out_edges(child_name_node, edge_type = "NAME_OBJ")
            if cur_child_edge != None:
                G.graph.remove_edge(child_name_node, cur_child_edge[0][1])
            G.add_edge(child_name_node, right_obj, {"type:TYPE": "NAME_OBJ"})
        else:
            G.set_obj_by_scope_name(left_name, right_obj, scope = left_scope)

        if 'VAR_TYPE' not in right_attr:
            print('right var type not set')
        else:
            right_vartype = right_attr['VAR_TYPE']
            G.set_node_attr(left, ("VAR_TYPE", right_vartype))
        try:
            left_obj = G.get_obj_by_name(left_name)
        except:
            print("ERROR: left obj {} not found".format(left))

        if left_obj == None:
            # may be tricky, for left property
            left_obj = right_obj
        
        print("ASSIGNED {} to {}".format(left_obj, left_name) )
        modified_objs.add(left_obj)
    
    
    elif cur_node_attr['type'] == 'AST_ARRAY':
        added_obj = G.add_obj_node(node_id, "OBJ_DECL")

    elif cur_node_attr['type'] == 'AST_DIM':
        G.set_node_attr(node_id, ('type', 'AST_PROP'))
        return handle_node(G, node_id)


    elif cur_node_attr['type'] == 'AST_VAR':
        # return [added obj, added scope, var name]
        # for var variables, we return it's obj, scope
        var_name = G.get_name_from_child(node_id)

        now_obj = G.get_obj_by_name(var_name)

        # this is not added before, add an object and return
        # for now, we think let is equals to var.
        # TODO: limit the scope of let and handle const
        if now_obj == None and "flags:string[]" in cur_node_attr and (cur_node_attr['flags:string[]'] == "JS_DECL_VAR" or cur_node_attr['flags:string[]'] == 'JS_DECL_LET'):
            now_scope = G.cur_scope
        else:
            now_scope = G.BASE_SCOPE
        node_var_name = var_name


    elif cur_node_attr['type'] == 'AST_PROP':
        # return the related values of youngest child
        [parent, child] = G.handle_property(node_id)
        child_name = G.get_name_from_child(child)
        # parent contains many parent, child only has one
        # get the next level of parent
        handled_parent = handle_node(G, parent)

        [parent_added_obj, parent_added_scope, parent_obj, parent_scope, modified_objs, parent_name, _] = handled_parent
        if child_name == None:
            child_name = 'undifined'

        # for newly added obj
        if parent_added_obj != None:
            parent_obj = parent_added_obj
        if parent_obj == None:
            print("PARENT OBJ {} NOT DEFINED".format(parent_name))
            # we assume this happens when it's a built-in var name
            parent_obj = G.add_obj_to_scope(node_id, parent_name, "BUILT-IN", scope = G.BASE_SCOPE)
            modified_objs.add(parent_obj)
        if parent_name == "this":
            parent_obj = G.cur_obj
            parent_scope = G.cur_scope

        child_obj = G.get_obj_by_obj_name(child_name, parent_obj = parent_obj)
        if child_obj == None:
            # assume the ast node is the root node
            # added_obj = G.add_obj_to_obj(node_id, "OBJ", child_name, parent_obj = parent_obj)
            # TODO: get the type by running a testing nodejs
            # we assume the var is a method name
            added_obj = G.add_blank_func(child_name, scope = G.BASE_SCOPE)
            added_obj = G.add_obj_to_obj(node_id, 'BUILT_IN', child_name, parent_obj = parent_obj, tobe_added_obj = child_obj)
            child_obj = added_obj

#        print(parent_name, parent_obj, child_name, child_obj, cur_node_attr['lineno:int'], '=====================================')
        now_obj = child_obj
        var_name_node = G.get_name_node_of_obj(child_name, parent_obj = parent_obj)
        node_var_name = child_name

    elif cur_node_attr['type'] == 'AST_CLOSURE':
        # for a CLOSURE, we treat it as a function defination. add a obj to obj graph
        # for now, we do not assign the name of the scope node 
        # if visited, return
        if "VISITED" in G.get_node_attr(node_id):
            return [None, None, None, None, None, None, None] 

        added_scope = G.add_scope("CLOSURE_SCOPE", node_id)
        added_obj = G.add_obj_node(node_id, "OBJ_DECL")
        G.add_edge(added_obj, added_scope, {"type:TYPE": "OBJ_SCOPE"})

        modified_objs.add(added_obj)


    elif cur_node_attr['type'] == 'AST_TOPLEVEL':
        [added_obj, added_scope] = run_toplevel_file(G, node_id)

    elif cur_node_attr['type'] == 'AST_FUNC_DECL':
        [added_obj, added_scope] = decl_function(G, node_id)
        modified_objs.add(added_obj)


    elif cur_node_attr['type'] == 'AST_BINARY_OP':
        if 'flags:string[]' in cur_node_attr and cur_node_attr['flags:string[]'] == 'BINARY_BOOL_OR':
            handled_left_or = handle_node(G, G.get_child_nodes(node_id)[0])
            [or_added_obj, or_added_scope, or_obj, or_scope, _, or_name, or_name_node] = handled_left_or 
            if or_added_obj != None:
                or_obj = or_added_obj
            if or_obj == None:
                added_obj = G.add_literal_obj()
            else:
                now_obj = or_obj
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
            cur_obj_node = G.get_obj_by_name(node_name)

            # point the current varnode to the blank function
            if new_func_decl_id != None:
                G.graph.remove_edge(name_node, cur_obj_node)

            new_func_decl_id = G.add_blank_func(node_name, scope = G.BASE_SCOPE)
            [added_obj, _, _, _, _, _, _] = handle_node(G, new_func_decl_id)

            G.add_edge(name_node, added_obj, {'type:TYPE': 'NAME_OBJ'})
            G.add_edge(added_obj, new_func_decl_id, {'type:TYPE': 'OBJ_AST'})

            new_entry_id = G.get_entryid_by_function_name(node_name)
        

        # add edge between obj and obj decl
        G.add_edge(added_obj, new_func_decl_id, {"type:TYPE": "OBJ_DECL"})

        backup_scope = G.cur_scope
        backup_obj = G.cur_obj

        # update current scope and object
        G.cur_scope = G.get_scope_by_ast_decl(new_func_decl_id)
        G.cur_obj = added_obj 
        simurun_function(G, new_func_decl_id)
        
        # add obj to scope edge
        G.add_edge(added_obj, G.cur_scope, {"type:TYPE": "OBJ_SCOPE"})
        
        G.cur_scope = backup_scope
        G.cur_obj = backup_obj

        # finally add call edge from caller to callee
        G.add_edge(node_id, new_func_decl_id, {"type:TYPE": "CALLS"})
        modified_objs.add(added_obj)

    elif cur_node_attr['type'] == 'integer' or cur_node_attr['type'] == 'string':
        added_obj = G.add_literal_obj()
        modified_objs.add(added_obj)


    elif cur_node_attr['type'] == 'AST_METHOD_CALL':
        # get the method decl position
        [parent, child, var_list] = G.handle_method_call(node_id)

        # parent contains many parent, child only has one
        # get the next level of parent
        handled_parent = handle_node(G, parent)

        [parent_added_obj, parent_added_scope, parent_obj, parent_scope, modified_objs, parent_name, _] = handled_parent
        # for newly added obj
        if parent_added_obj != None:
            parent_obj = parent_added_obj
        if parent_obj == None:
            print("PARENT OBJ {} NOT DEFINED".format(parent_name))
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
        [added_obj, added_scope] = ast_call_function(G, node_id, func_name = child_name, parent_obj = parent_obj)


    elif cur_node_attr['type'] == 'AST_CALL':
        [added_obj, added_scope] = ast_call_function(G, node_id)
        modified_objs.add(added_obj)

    # handle registered functions
    if "HAVE_FUNC" in cur_node_attr:
        # func_decl_id = cur_node_attr['HAVE_FUNC']
        for func_decl_id in registered_func[node_id]:
            handle_node(G, func_decl_id)
    
    # delete if right node is temperate
    remove_list = G.get_node_by_attr("name", "TMPRIGHT")
    G.remove_nodes_from(remove_list)
    G.set_node_attr(node_id, ("VISITED", "1"))

    return [added_obj, added_scope, now_obj, now_scope, modified_objs, node_var_name, var_name_node]

def simurun_function(G, func_decl_id):
    """
    bfs run a simurun from a entry id
    """
    print("FUNCTION {} START, SCOPE ID {}, OBJ ID {}".format(func_decl_id, G.cur_scope, G.cur_obj))
    bfs_queue = []
    visited = set()
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
        if handled_res != None and len(handled_res) == 7:
            modified_objs = handled_res[4]
            # print("BUILDING NODE {} {}".format(cur_node, modified_objs))
            build_df(G, cur_node, modified_objs)

        out_edges = G.get_out_edges(cur_node, data = True, keys = True, edge_type = 'FLOWS_TO')
        if len(out_edges) == 0:
            out_edges = G.get_out_edges(cur_node, data = True, keys = True, edge_type = 'ENTRY')
        out_nodes = [edge[1] for edge in out_edges]
        bfs_queue += out_nodes

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

    G.setup_run(entry_nodeid)
    print("RUN: ", entry_nodeid)
    obj_nodes = G.get_nodes_by_type("AST_FUNC_DECL")
    for node in obj_nodes:
        register_func(G, node[0])
    handle_node(G, entry_nodeid)
    # simurun_function(G, entry_nodeid)

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
    added_scope = G.add_scope("CLOSURE_SCOPE", node_id)
    added_obj = G.add_obj_node(node_id, "OBJ_DECL")
    G.add_edge(added_obj, added_scope, {"type:TYPE": "OBJ_SCOPE"})

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
    [func_decl_id, func_scope_id] = decl_function(G, node_id, func_name = func_name)
    # simurun the file
    func_scope_id = G.get_func_scope_by_name(func_name)
    backup_obj = G.cur_obj
    backup_scope = G.cur_scope

    added_obj = G.add_obj_node(node_id, "FUNC_RUN_OBJ")
    G.add_edge(added_obj, func_decl_id, {'type:TYPE': 'OBJ_DECL'})

    G.cur_scope = func_scope_id
    G.cur_obj = added_obj
    
    simurun_function(G, node_id)

    # add obj to scope edge
    G.add_edge(added_obj, G.cur_scope, {"type:TYPE": "OBJ_SCOPE"})

    G.cur_scope = backup_scope
    G.cur_obj = backup_obj

    return [added_obj, func_scope_id]

def ast_call_function(G, node_id, func_name = None, parent_obj = None):
    """
    run a function start from node id
    """

    if func_name == None:
        func_name = G.find_name_of_call(node_id)
    if parent_obj == None:
        func_decl_id = G.get_func_declid_by_function_name(func_name)
    else:
        func_decl_id = G.get_func_declid_by_function_obj_name(func_name, parent_obj = parent_obj)

    if func_decl_id == None or len(G.get_out_edges(func_decl_id, edge_type = 'ENTRY')) == 0:
        func_decl_id = G.add_blank_func(func_name)

    # build the related function nodes 
    [added_obj, added_scope, _, _, _, _, _] = handle_node(G, func_decl_id)

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

    
    simurun_function(G, func_decl_id)

    # add obj to scope edge
    if G.cur_scope == None:
        G.add_edge(added_obj, G.cur_scope, {"type:TYPE": "OBJ_SCOPE"})

    G.cur_scope = backup_scope
    G.cur_obj = backup_obj

    # add call edge
    G.add_edge(node_id, func_decl_id, {"type:TYPE": "CALLS"})

    return [added_obj, None]

def build_df(G, node_id, modified_objs):
    """
    build the df of current node id
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
            print("OBJ REACHES {} {}".format(edge[0], node_id))
            G.add_edge(edge[0], node_id, {'type:TYPE': 'OBJ_REACHES', 'var': cur_obj})

    if modified_objs != None:
        G.update_modified_edges(node_id, modified_objs)

G = Graph()
G.import_from_CSV("./nodes.csv", "./rels.csv")
scopeContorller = ScopeController(G)
generate_obj_graph(G, '1')
add_edges_between_funcs(G)
# G.export_to_CSV("./testnodes.csv", "./testrels.csv", light = True)
G.export_to_CSV("./testnodes.csv", "./testrels.csv", light = False)
