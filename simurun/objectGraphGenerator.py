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
    cur_node = G.get_node_attr(node_id)
    cur_type = cur_node['type']
    if cur_type == "AST_ASSIGN":
        # for assign operation, the right part is childnum 1, the left part is childnum 0
        ast_edges = G.get_out_edges(node_id, data = True, edge_type = "PARENT_OF")
        if G.get_node_attr(ast_edges[0][1])['childnum:int'] == '1':
            right = ast_edges[0][1]
            left = ast_edges[1][1]
        else:
            right = ast_edges[1][1]
            left = ast_edges[0][1]

        # check if left part already exist in current scope

        # for a CLOSURE, we treat it as a function defination. add a obj to obj graph
        right_attr = G.get_node_attr(right);
        if right_attr['type'] == 'AST_CLOSURE':
            G.add_scope("FUNCTION", right)


        right_vartype = G.get_node_attr(right)['VAR_TYPE']
        G.set_node_attr(left, ("VAR_TYPE", right_vartype))

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

    bfs_queue = []
    visited = set()
    bfs_queue.append(entry_nodeid)
    G.add_scope('BASE_SCOPE', entry_nodeid)
    while(len(bfs_queue)):
        print bfs_queue 
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

G = Graph()
G.import_from_CSV("./nodes.csv", "./rels.csv")
add_edges_between_funcs(G)
scopeContorller = ScopeController(G)
generate_obj_graph(G, '2')
G.export_to_CSV("./testnodes.csv", "./testrels.csv")

