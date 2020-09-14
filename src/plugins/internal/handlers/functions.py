from src.core.logger import loggers
from src.core.utils import BranchTagContainer 
# function is higher than block
from .blocks import simurun_block
import sty

def simurun_function(G, func_ast, branches=None, block_scope=True,
    caller_ast=None):
    """
    Simurun a function by running its body.
    """
    if branches is None or G.single_branch:
        # create an instance of BranchTagContainer every time,
        # don't use default argument
        branches = BranchTagContainer()

    if caller_ast is not None:
        if G.call_counter[caller_ast] >= G.call_limit:
            logger.warning(f'{caller_ast}: Function {func_ast} in call stack '
                    f'{G.call_counter[caller_ast]} times, skip simulating')
            return None, None # don't change this to [], []
                              # we need to distinguish skipped functions
        else:
            G.call_counter[caller_ast] += 1

    func_objs = G.get_func_decl_objs_by_ast_node(func_ast)
    func_obj = func_objs[0] if func_objs else '?'
    func_name = G.get_node_attr(func_obj).get('name') if func_objs else '?'
    loggers.main_logger.info(sty.ef.inverse + sty.fg.green +
        "FUNCTION {} {} STARTS, SCOPE {}, DECL OBJ {}, this OBJs {}, branches {}"
        .format(func_ast, func_name or '{anonymous}',
        G.cur_scope, func_obj, G.cur_objs,
        branches) + sty.rs.all)
    returned_objs, used_objs = [], []
    # update graph register for cur_func
    G.cur_func = G.get_cur_function_decl()

    for child in G.get_child_nodes(func_ast, child_type='AST_STMT_LIST'):
        returned_objs, used_objs = simurun_block(G, child,
            parent_scope=G.cur_scope, branches=branches,
            block_scope=block_scope, decl_var=True)
        break

    if caller_ast is not None:
        G.call_counter[caller_ast] -= 1
    return returned_objs, used_objs

