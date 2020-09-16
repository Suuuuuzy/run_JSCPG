from src.plugins.handler import Handler
from src.core.logger import *
from ..utils import peek_variables, val_to_str
from . import vars
from ..utils import check_condition
from . import blocks

class HandleFor(Handler):
    """
    handle the for loop
    """
    def process(self):
        node_id = self.node_id
        extra = self.extra
        G = self.G
        try:
            init, cond, inc, body = G.get_ordered_ast_child_nodes(node_id)[:4]
        except ValueError as e:
            for n in G.get_ordered_ast_child_nodes(node_id):
                logger.error(n, G.get_node_attr(n))
                return None
        cond = G.get_ordered_ast_child_nodes(cond)[0]
        # switch scopes
        parent_scope = G.cur_scope
        G.cur_scope = G.add_scope('BLOCK_SCOPE', decl_ast=body,
                      scope_name=G.scope_counter.gets(f'Block{body}'))
        result = self.internal_manager.dispatch_node(init, extra) # init loop variables
        d = peek_variables(G, ast_node=inc, handling_func=vars.handle_var,
            extra=extra) # check increment to determine loop variables
        counter = 0
        while True:
            loggers.main_logger.debug('For loop variables:')
            for name, obj_nodes in d.items():
                loggers.main_logger.debug(sty.ef.i + name + sty.rs.all + ': ' +
                    ', '.join([(sty.fg.green+'{}'+sty.rs.all+' {}').format(obj,
                    val_to_str(G.get_node_attr(obj).get('code'))) for obj in obj_nodes]))

            # check if the condition is met
            check_result, deterministic = check_condition(G, cond, extra)
            loggers.main_logger.debug('Check condition {} result: {} {}'.format(sty.ef.i +
                G.get_node_attr(cond).get('code') + sty.rs.all, check_result,
                deterministic))
            # avoid infinite loop
            if (not deterministic and counter > 3) or check_result == 0:
                loggers.main_logger.debug('For loop {} finished'.format(node_id))
                break
            blocks.simurun_block(G, body, branches=extra.branches) # run the body
            result = self.internal_manager.dispatch_node(inc, extra) # do the inc
            counter += 1
        # switch back the scope
        G.cur_scope = parent_scope

