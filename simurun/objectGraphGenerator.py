from graph import Graph
from scopeController import ScopeController

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

        for idx in range(len(callee_paras)):
            added_edge_list.append((CPG_caller_id, callee_paras[idx], {'type:TYPE': 'REACHES', 'var': caller_para_names[idx]}))

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
                return

        bfs_queue += out_nodes

def handle_node(G, node_id):
    """
    for different node type, do different actions to handle this node
    """
    cur_node_attr = G.get_node_attr(node_id)
    cur_type = cur_node_attr['type']
    print "HANDLE NODE: {} {}".format(node_id, cur_type)
    if cur_type == "AST_ASSIGN":
        # for assign operation, the right part is childnum 1, the left part is childnum 0
        ast_edges = G.get_out_edges(node_id, data = True, edge_type = "PARENT_OF")

        if len(ast_edges) == 1:
            # only have left
            handle_node(G, ast_edges[0][1])
            return [None, None]

        if G.get_node_attr(ast_edges[0][1])['childnum:int'] == '1':
            right = ast_edges[0][1]
            left = ast_edges[1][1]
        else:
            right = ast_edges[1][1]
            left = ast_edges[0][1]

        handled_right = handle_node(G, right)
        handled_left = handle_node(G, left)

        if handled_right == None:
            print "RIGHT OBJ NOT FOUND WITH NODE ID {} and right ID {}".format(node_id, right)
            return None

        right_obj = handled_right[0]
        right_scope = handled_right[1]

        left_obj = handled_left[0]
        left_scope = handled_left[1]

        left_attr = G.get_node_attr(left)
        right_attr = G.get_node_attr(right)
        right_name = G.get_name_from_child(right)
        left_name = G.get_name_from_child(left)

        if right_obj == None:
            print "Right OBJ not found"
            return 
        if right_attr['type'] == 'AST_PROP':
            [parent_ast_id, child_ast_id, parent_obj, child_obj] = handled_right
            child_name = G.get_name_from_child(child_ast_id)
            if child_obj == None:
                # should be a built in 
                child_obj = G.add_obj_to_obj(child_ast_id, 'BUILT_IN', child_name, parent_obj = parent_obj)
            right_obj = child_obj
        
        if left_attr['type'] == 'AST_PROP':
            # for property, find the scope, point the name
            [parent_ast_id, child_ast_id, parent_obj, child_obj] = handled_left
            parent_name = G.get_name_from_child(parent_ast_id)
            child_name = G.get_name_from_child(child_ast_id)
            if parent_name == 'this':
                G.set_obj_by_obj_name(child_name, right_obj, parent_obj = None)
        else:
            G.set_obj_by_scope_name(left_name, right_obj, scope = left_scope)

        if 'VAR_TYPE' not in right_attr:
            print 'right var type not set'
        else:
            right_vartype = right_attr['VAR_TYPE']
            G.set_node_attr(left, ("VAR_TYPE", right_vartype))
        try:
            left_obj = G.get_obj_by_name(left_name)
        except:
            print "ERROR: left obj {} not found".format(left)


    added_obj = None
    added_scope = None
    now_obj = None
    now_scope = None

    if cur_node_attr['type'] == 'AST_CLOSURE':
        # for a CLOSURE, we treat it as a function defination. add a obj to obj graph
        # for now, we do not assign the name of the scope node 
        # if visited, return
        if "VISITED" in G.get_node_attr(node_id):
            return None 

        added_scope = G.add_scope("CLOSURE_SCOPE", node_id)
        added_obj = G.add_obj_node(node_id, "OBJ_DECL")
        G.add_edge(added_obj, added_scope, {"type:TYPE": "OBJ_SCOPE"})

    elif cur_node_attr['type'] == 'AST_VAR':
        # for var variables, we return it's obj, scope
        var_name = G.get_name_from_child(node_id)

        # this is not added object, just get the object and return
        added_obj = G.get_obj_by_name(var_name)

        if added_obj != None:
            # if we already have the var defined
            return [added_obj, G.cur_scope]

        # for now, we think let is equals to var.
        # TODO: limit the scope of let and handle const
        if "flags:string[]" in cur_node_attr and (cur_node_attr['flags:string[]'] == "JS_DECL_VAR" or cur_node_attr['flags:string[]'] == 'JS_DECL_LET'):
            added_scope = G.cur_scope
        else:
            added_scope = G.BASE_SCOPE

    elif cur_node_attr['type'] == 'AST_TOPLEVEL':
        [added_obj, added_scope] = run_toplevel_file(G, node_id)

    elif cur_node_attr['type'] == 'AST_FUNC_DECL':
        [added_obj, added_scope] = decl_function(G, node_id)


    elif cur_node_attr['type'] == 'AST_BINARY_OP':
        added_obj = G.literal_obj_nodeid


    elif cur_node_attr['type'] == 'AST_NEW':
        added_obj = G.add_obj_to_scope(node_id, "TMPRIGHT", "OBJ")
        node_name = G.get_name_from_child(node_id)
        new_func_decl_id = G.get_func_declid_by_function_name(node_name)
        
        # add edge between obj and obj decl
        G.add_edge(added_obj, new_func_decl_id, {"type:TYPE": "OBJ_DECL"})

        new_entry_id = G.get_entryid_by_function_name(node_name)
        if new_entry_id == None:
            return "ERROR: Function {} not found".format(node_name)

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

    elif cur_node_attr['type'] == 'integer':
        added_obj = G.literal_obj_nodeid

    elif cur_node_attr['type'] == 'AST_PROP':
        # for now, we only support one level property
        # return parent ast node, child ast node
        [parent, child] = G.handle_property(node_id)


        parent_name = G.get_name_from_child(parent)
        child_name = G.get_name_from_child(child)

        if parent_name == "this":
            parent_obj = G.cur_obj
        else:
            parent_obj = G.get_obj_by_name(parent_name)

        if parent_obj == None:
            print "PARENT OBJ {} NOT DEFINED".format(parent_name)
            # we assume this happens when it's a built-in var name
            parent_obj = G.add_obj_to_scope(node_id, parent_name, "BUILT-IN", scope = G.BASE_SCOPE)

        child_obj = G.get_obj_by_obj_name(child_name, parent_obj)

        return [parent, child, parent_obj, child_obj]

    elif cur_node_attr['type'] == 'AST_METHOD_CALL':
        # get the method decl position
        [parent, child, var_list] = G.handle_method_call(node_id)
        parent_name = G.get_name_from_child(parent)
        child_name = G.get_name_from_child(child)

        func_scope_id = G.get_func_scope_by_name(parent_name)
        func_obj = G.get_obj_by_name(parent_name)
        method_scope_id = G.get_func_scope_by_obj_name(child_name, parent_obj = func_obj)

        func_decl_id = G.get_func_declid_by_function_obj_name(child_name, func_obj)
        if func_decl_id == None:
            return "ERROR: Function {} not found".format(child_name)

        # add a tmp name obj under parent obj 
        added_obj = G.add_obj_node(node_id, "FUNC_RUN_OBJ")

        backup_scope = G.cur_scope
        backup_obj = G.cur_obj

        # update current scope and object
        G.cur_scope = method_scope_id
        G.cur_obj = added_obj 
        simurun_function(G, func_decl_id)
        
        # add obj to scope edge
        G.add_edge(added_obj, G.cur_scope, {"type:TYPE": "OBJ_SCOPE"})
        
        G.cur_scope = backup_scope
        G.cur_obj = backup_obj

        # add calls edge
        G.add_edge(node_id, func_decl_id, {"type:TYPE": "CALLS"})

    elif cur_node_attr['type'] == 'AST_CALL':
        [added_obj, added_scope] = ast_call_function(G, node_id)

    # handle registered functions
    if "HAVE_FUNC" in cur_node_attr:
        func_decl_id = cur_node_attr['HAVE_FUNC']
        handle_node(G, func_decl_id)
    
    # delete if right node is temperate
    remove_list = G.get_node_by_attr("name", "TMPRIGHT")
    G.remove_nodes_from(remove_list)
    G.set_node_attr(node_id, ("VISITED", "1"))

    return [added_obj, added_scope, now_obj, now_scope]

def simurun_function(G, func_decl_id):
    """
    bfs run a simurun from a entry id
    """
    print "FUNCTION {} START, SCOPE ID {}, OBJ ID {}".format(func_decl_id, G.cur_scope, G.cur_obj)
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

        print "BFS NODE {}".format(cur_node)
        handle_node(G, cur_node)
        build_df(G, cur_node)

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
    print "RUN: ", entry_nodeid
    obj_nodes = G.get_nodes_by_type("AST_FUNC_DECL")
    for node in obj_nodes:
        register_func(G, node[0])
    handle_node(G, entry_nodeid)
    #simurun_function(G, entry_nodeid)

def decl_function(G, node_id, func_name = None):
    """
    decl a function based on the node_id on current SCOPE
    func_name is designed for top level nodes only
    """
    # for a function decl, if already visited, return
    if "VISITED" in G.get_node_attr(node_id):
        return [None, None]
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
    G.set_obj_by_scope_name(node_name, added_obj, scope = G.BASE_SCOPE)
    return [added_obj, added_scope]

def run_toplevel_file(G, node_id):
    """
    run a top level file 
    return a obj and scope
    """
    # add scope and obj first
    func_name = G.get_node_attr(node_id)['name']
    [added_obj, added_scope] = decl_function(G, node_id, func_name = func_name)
    # simurun the file
    func_scope_id = G.get_func_scope_by_name(func_name)
    backup_obj = G.cur_obj
    backup_scope = G.cur_scope

    added_obj = G.add_obj_node(node_id, "FUNC_RUN_OBJ")
    G.cur_scope = func_scope_id
    G.cur_obj = added_obj
    
    simurun_function(G, node_id)

    # add obj to scope edge
    G.add_edge(added_obj, G.cur_scope, {"type:TYPE": "OBJ_SCOPE"})

    G.cur_scope = backup_scope
    G.cur_obj = backup_obj

    return [added_obj, func_scope_id]

def ast_call_function(G, node_id):
    """
    run a function start from node id
    """
    func_name = G.find_name_of_call(node_id)
    func_decl_id = G.get_func_declid_by_function_name(func_name)

    if func_decl_id == None:
        func_decl_id = G.add_blank_func(func_name)

    # build the related function nodes 
    handle_node(G, func_decl_id)

    func_scope_id = G.get_func_scope_by_name(func_name)
    backup_obj = G.cur_obj
    backup_scope = G.cur_scope

    added_obj = G.add_obj_node(node_id, "FUNC_RUN_OBJ")
    G.cur_scope = func_scope_id
    G.cur_obj = added_obj
    
    simurun_function(G, func_decl_id)

    # add obj to scope edge
    G.add_edge(added_obj, G.cur_scope, {"type:TYPE": "OBJ_SCOPE"})

    G.cur_scope = backup_scope
    G.cur_obj = backup_obj

    # add call edge
    G.add_edge(node_id, func_decl_id, {"type:TYPE": "CALLS"})
    return [added_obj, None]

def build_df(G, node_id):
    """
    build the df of current node id
    """
    inputs = G.get_all_inputs(node_id)
    if len(inputs) > 0:
        print inputs

G = Graph()
G.import_from_CSV("./nodes.csv", "./rels.csv")
scopeContorller = ScopeController(G)
generate_obj_graph(G, '1')
add_edges_between_funcs(G)
G.export_to_CSV("./testnodes.csv", "./testrels.csv")

