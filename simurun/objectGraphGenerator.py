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
                para_num = int(G.get_node_attr(param_id)['childnum:int'])
                sub_param_id = list(G.get_successors(param_id))[0]
                paras[para_num] = G.get_node_attr(sub_param_id)['code']
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

        for idx in range(len(caller_para_names)):
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

        added_right = handle_node(G, right)
        added_left = handle_node(G, left)

        if added_right == None:
            print "RIGHT OBJ NOT FOUND WITH NODE ID {} and right ID {}".format(node_id, right)
            return None

        right_obj = added_right[0]
        right_scope = added_right[1]
        left_attr = G.get_node_attr(left)
        right_attr = G.get_node_attr(right)
        right_name = G.get_name_from_child(right)

        if right_obj == None:
            right_obj = G.get_obj_by_name(right_name)
        # if we added new right_obj, we do not need to find it
        if right_obj == None:
            print "Right OBJ not found"
            return 

        if left_attr['type'] == 'AST_VAR':
            left_name = G.get_name_from_child(left)
            G.set_obj_by_name(left_name, right_obj)
        elif left_attr['type'] == 'AST_PROP':
            # for property, find the scope, point the name
            [parent, child] = added_left
            parent_name = G.get_name_from_child(parent)
            child_name = G.get_name_from_child(child)
            if parent_name == 'this':
                G.set_obj_by_name(child_name, right_obj)


        if 'VAR_TYPE' not in right_attr:
            print 'right var type not set'
        else:
            right_vartype = right_attr['VAR_TYPE']
            G.set_node_attr(left, ("VAR_TYPE", right_vartype))

        try:
            left_obj = G.get_obj_by_name(left_name)
        except:
            print "left obj {} not found".format(left)

    added_obj = None
    added_scope = None

    if cur_node_attr['type'] == 'AST_CLOSURE':
        # for a CLOSURE, we treat it as a function defination. add a obj to obj graph
        # for now, we do not assign the name of the scope node 
        # if visited, return
        if "VISITED" in G.get_node_attr(node_id):
            return None 

        added_scope = G.add_scope("CLOSURE_SCOPE", node_id)
        added_obj = G.add_obj_to_obj(node_id, "OBJ_DECL", parent_obj = "DoNotSet")
        G.add_edge(added_obj, added_scope, {"type:TYPE": "OBJ_SCOPE"})

    elif cur_node_attr['type'] == 'AST_VAR':
        # for var variables, we return it's obj and scope
        # for local variables, "any" should be the type
        return 
        var_name = G.get_name_from_child(node_id)
        added_obj = G.get_obj_by_name(var_name)

        if "code" in cur_node_attr and cur_node_attr['code'] == "any":
            added_scope = G.cur_scope
        else:
            added_scope = G.BASE_SCOPE


    elif cur_node_attr['type'] == 'AST_FUNC_DECL':
        # for a function decl, if already visited, return
        if "VISITED" in G.get_node_attr(node_id):
            return 
        # for a function decl, we add an obj and scope
        node_name = G.get_name_from_child(node_id)

        # do a normal add closure
        added_scope = G.add_scope("CLOSURE_SCOPE", node_id)
        added_obj = G.add_obj_to_obj(node_id, "OBJ_DECL", parent_obj = "DoNotSet")
        G.add_edge(added_obj, added_scope, {"type:TYPE": "OBJ_SCOPE"})

        # for a func decl, should not have local var name
        # should add the name to base scope
        G.set_obj_by_name(node_name, added_obj, scope = G.BASE_SCOPE)


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
        added_obj = G.add_obj_to_scope(node_id, "TMPRIGHT", "INTEGER")

    elif cur_node_attr['type'] == 'AST_PROP':
        # for now, we only support one level property
        print G.handle_property(node_id)
        return G.handle_property(node_id)

    elif cur_node_attr['type'] == 'AST_METHOD_CALL':
        # get the method decl position
        [parent, child, var_list] = G.handle_method_call(node_id)
        parent_name = G.get_name_from_child(parent)
        child_name = G.get_name_from_child(child)

        func_scope_id = G.get_func_scope_by_name(parent_name)
        method_scope_id = G.get_func_scope_by_name(child_name, scope = func_scope_id)

        func_decl_id = G.get_func_declid_by_function_name(child_name, func_scope_id)
        if func_decl_id == None:
            return "ERROR: Function {} not found".format(child_name)

        # add a tmp name obj under parent obj 
        added_obj = G.add_obj_to_obj(node_id, "FUNC_RUN_OBJ", parent_obj = "DoNotSet")

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
        func_name = G.get_name_from_child(node_id)
        func_scope_id = G.get_func_scope_by_name(func_name)
        backup_obj = G.cur_obj
        backup_scope = G.cur_scope

        added_obj = G.add_obj_to_obj(node_id, "FUNC_RUN_OBJ", parent_obj = "DoNotSet")
        func_decl_id = G.get_func_declid_by_function_name(func_name)
        G.cur_scope = func_scope_id
        G.cur_obj = added_obj
        
        simurun_function(G, func_decl_id)

        # add obj to scope edge
        G.add_edge(added_obj, G.cur_scope, {"type:TYPE": "OBJ_SCOPE"})

        G.cur_scope = backup_scope
        G.cur_obj = backup_obj

        # add call edge
        G.add_edge(node_id, func_decl_id, {"type:TYPE": "CALLS"})



    # handle registered functions
    if "HAVE_FUNC" in cur_node_attr:
        func_decl_id = cur_node_attr['HAVE_FUNC']
        handle_node(G, func_decl_id)
    
    # delete if right node is temperate
    remove_list = G.get_node_by_attr("name", "TMPRIGHT")
    G.remove_nodes_from(remove_list)
    G.set_node_attr(node_id, ("VISITED", "1"))

    return [added_obj, added_scope]

def simurun_function(G, func_decl_id):
    """
    bfs run a simurun from a entry id
    """
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

        
        handle_node(G, cur_node)

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
    simurun_function(G, entry_nodeid)

G = Graph()
G.import_from_CSV("./nodes.csv", "./rels.csv")
scopeContorller = ScopeController(G)
generate_obj_graph(G, '1')
add_edges_between_funcs(G)
G.export_to_CSV("./testnodes.csv", "./testrels.csv")

