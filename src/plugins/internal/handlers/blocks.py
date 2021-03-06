# This module is used to handle all the block level nodes
from src.core.utils import ExtraInfo, BranchTagContainer
from ..utils import decl_vars_and_funcs, to_obj_nodes

def simurun_block(G, ast_node, parent_scope=None, branches=None,
    block_scope=True, decl_var=False):
    """
    Simurun a block by running its statements one by one.
    A block is a BlockStatement in JavaScript,
    or an AST_STMT_LIST in PHP.
    """
    from src.plugins.manager_instance import internal_manager
    if branches is None:
        branches = BranchTagContainer()
    returned_objs = set()
    used_objs = set()
    if parent_scope == None:
        parent_scope = G.cur_scope if not G.thread_version else G.mydata.cur_scope
    if block_scope:
        if G.thread_version:
            G.mydata.cur_scope = \
                G.add_scope('BLOCK_SCOPE', decl_ast=ast_node,
                            scope_name=G.scope_counter.gets(f'Block{ast_node}'))
        else:
            G.cur_scope = \
                G.add_scope('BLOCK_SCOPE', decl_ast=ast_node,
                            scope_name=G.scope_counter.gets(f'Block{ast_node}'))
    # loggers.main_logger.log(ATTENTION, 'BLOCK {} STARTS, SCOPE {}'.format(ast_node, G.cur_scope))
    decl_vars_and_funcs(G, ast_node, var=decl_var)
    stmts = G.get_ordered_ast_child_nodes(ast_node)
    # simulate statements
    break_signal = False
    for stmt in stmts:
        node_attr = G.get_node_attr(stmt)
        # print(node_id)
        node_type = node_attr['type']
        if node_type=="AST_BREAK":
            break_signal = True
            break
        if G.cfg_stmt is not None:
            G.add_edge_if_not_exist(G.cfg_stmt, stmt, {"type:TYPE": "FLOWS_TO"})
        if G.thread_version:
            G.mydata.cur_stmt = stmt
        else:
            G.cur_stmt = stmt
        G.cfg_stmt = stmt
        # add control flow edges here
        handled_res = internal_manager.dispatch_node(stmt, ExtraInfo(branches=branches))


    returned_objs = G.function_returns[G.find_ancestor_scope()][1]
    
    if block_scope:
        if G.thread_version:
            G.mydata.cur_scope = parent_scope
        else:
            G.cur_scope = parent_scope


    return list(returned_objs), list(used_objs), break_signal
