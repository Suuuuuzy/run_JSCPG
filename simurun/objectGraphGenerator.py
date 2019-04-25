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

def handle_node(G, node_id):
    """
    for different node type, do different actions to handle this node
    """
    cur_node_attr = G.get_node_attr(node_id)
    cur_type = cur_node_attr['type']
    if cur_type == "AST_ASSIGN":
        # for assign operation, the right part is childnum 1, the left part is childnum 0
        ast_edges = G.get_out_edges(node_id, data = True, edge_type = "PARENT_OF")
        if G.get_node_attr(ast_edges[0][1])['childnum:int'] == '1':
            right = ast_edges[0][1]
            left = ast_edges[1][1]
        else:
            right = ast_edges[1][1]
            left = ast_edges[0][1]

        # for a CLOSURE, we treat it as a function defination. add a obj to obj graph
        right_attr = G.get_node_attr(right);
        left_attr = G.get_node_attr(left)
        right_name = G.get_name_from_child(right)
        # if we added new right_obj, we do not need to find it
        right_obj = None

        if right_attr['type'] == 'AST_CLOSURE':
            # for now, we assume the left is the name of ast
            left_name = G.get_name_from_child(left)
            G.add_scope(left_name, right)
            obj_node_id = G.add_obj_to_obj(right, "OBJ_DECL")
            G.set_obj_by_name(right_name, obj_node_id)
        elif right_attr['type'] == 'AST_NEW':
            right_obj = G.add_obj_to_scope(right, "TMPRIGHT", "OBJ")
            new_func_decl_id = G.get_func_declid_by_function_name(right_name)
            new_entry_id = G.get_entryid_by_function_name(right_name)
            backup_scope = G.cur_scope
            backup_obj = G.cur_obj
            G.cur_scope = G.get_scope_by_ast_decl(new_func_decl_id)
            G.cur_obj = right_obj
            simurun_function(G, new_entry_id)
            G.cur_scope = backup_scope
            G.cur_obj = backup_obj
        elif right_attr['type'] == 'integer':
            right_obj = G.add_obj_to_scope(right, "TMPRIGHT", "INTEGER")

        if right_obj == None:
            right_obj = G.get_obj_by_name(right_name)
        if right_obj == None:
            print "Right OBJ not found"
            return 

        if left_attr['type'] == 'AST_VAR':
            left_name = G.get_name_from_child(left)
            G.set_obj_by_name(left_name, right_obj)

        if 'VAR_TYPE' not in right_attr:
            print 'right var type not set'
        else:
            right_vartype = right_attr['VAR_TYPE']
            G.set_node_attr(left, ("VAR_TYPE", right_vartype))

        try:
            left_obj = G.get_obj_by_name(left_name)
        except:
            print left
        # delete if right node is temperate
        remove_list = G.get_node_by_attr("name", "TMPRIGHT")
        G.remove_nodes_from(remove_list)

def simurun_function(G, entry_nodeid):
    """
    bfs run a simurun from a entry id
    """
    bfs_queue = []
    visited = set()
    bfs_queue.append(entry_nodeid)
    while(len(bfs_queue)):
        print "cur_queue: ", bfs_queue
        cur_node = bfs_queue.pop(0)

        # if visited before, stop here
        if cur_node in visited:
            continue
        else:
            visited.add(cur_node)

        handle_node(G, cur_node)
        out_edges = G.get_out_edges(cur_node, data = True, keys = True, edge_type = 'FLOWS_TO')
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
    simurun_function(G, entry_nodeid)

G = Graph()
G.import_from_CSV("./nodes.csv", "./rels.csv")
add_edges_between_funcs(G)
scopeContorller = ScopeController(G)
generate_obj_graph(G, '2')
G.export_to_CSV("./testnodes.csv", "./testrels.csv")

