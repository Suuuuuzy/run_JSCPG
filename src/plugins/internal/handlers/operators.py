from src.core.graph import Graph
from src.core.utils import *
from ..utils import to_obj_nodes, get_df_callback
from src.core.logger import loggers
from . import vars
from src.plugins.handler import Handler

class HandleAssign(Handler):

    def process(self, right_override=None):
        '''
        Handle assignment statement.
        '''
        extra = self.extra
        ast_node = self.node_id
        G = self.G

        if extra is None:
            extra = ExtraInfo()
        # get AST children (left and right sides)
        ast_children = G.get_ordered_ast_child_nodes(ast_node)
        try:
            left, right = ast_children
        except ValueError:
            # if only have left side
            return handle_node(G, ast_children[0], extra)

        # get branch tags
        branches = extra.branches if extra else BranchTagContainer()

        # recursively handle both sides
        # handle right first
        if right_override is None:
            handled_right = \
                self.internal_manager.dispatch_node(right, ExtraInfo(extra, side='right'))
        else:
            handled_right = right_override
        # handle left
        if G.get_node_attr(left).get('type') == 'AST_ARRAY':
            # destructuring assignment
            # handle left item by item
            children = G.get_ordered_ast_child_nodes(left)
            if G.get_node_attr(left).get('flags:string[]') == 'JS_OBJECT':
                # ObjectPattern assignments
                added_obj = G.add_obj_node(ast_node=ast_node, js_type='object')
                for child in children:
                    value, key = G.get_ordered_ast_child_nodes(child)
                    handled_left = \
                        handle_var(G, value, side='left', extra=extra)
                    _key = G.get_name_from_child(key)
                    for obj in handled_right.obj_nodes:
                        prop_obj_nodes= G.get_prop_obj_nodes(parent_obj=obj,
                            prop_name=_key, branches=branches)
                        for o in prop_obj_nodes:
                            G.add_obj_as_prop(parent_obj=added_obj,
                                prop_name=_key, tobe_added_obj=o)
                        do_assign(G, handled_left, NodeHandleResult(
                            obj_nodes=prop_obj_nodes), branches, ast_node)
                return NodeHandleResult(obj_nodes=[added_obj])
            else:
                # ArrayPattern assignments
                added_obj = G.add_obj_node(ast_node=ast_node, js_type='array')
                for i, child in enumerate(children):
                    handled_left = \
                        handle_var(G, child, side='left', extra=extra)
                    for obj in handled_right.obj_nodes:
                        prop_obj_nodes= G.get_prop_obj_nodes(parent_obj=obj,
                            prop_name=str(i), branches=branches)
                        for o in prop_obj_nodes:
                            G.add_obj_as_prop(parent_obj=added_obj,
                                prop_name=str(i), tobe_added_obj=o)
                        do_assign(G, handled_left, NodeHandleResult(
                            obj_nodes=prop_obj_nodes), branches, ast_node)
                G.add_obj_as_prop(parent_obj=added_obj, prop_name='length',
                    js_type='number', value=len(children), ast_node=ast_node)
                return NodeHandleResult(obj_nodes=[added_obj])
        else:
            # normal assignment
            handled_left = self.internal_manager.dispatch_node(left, ExtraInfo(extra, side='left'))
            # it happends that the handled
            # set function name
            name = handled_left.name
            if name and G.get_node_attr(right).get('type') in \
                ['AST_FUNC_DECL', 'AST_CLOSURE']:
                for func_obj in handled_right.obj_nodes:
                    old_name = G.get_node_attr(func_obj).get('name')
                    if not old_name or old_name == '{closure}':
                        G.set_node_attr(func_obj, ('name', name))
            assert type(handled_right) == NodeHandleResult
            return do_assign(G, handled_left, handled_right, branches, ast_node)

def do_assign(G, handled_left, handled_right, branches=None, ast_node=None):
    if branches is None:
        branches = BranchTagContainer()

    if not handled_left:
        loggers.main_logger.warning("Left side handling error at statement {}".format(ast_node))
        return NodeHandleResult()

    if not handled_right:
        loggers.main_logger.warning("Right side handling error at statement {}".format(ast_node))
        return NodeHandleResult()

    right_objs = to_obj_nodes(G, handled_right, ast_node)

    if not right_objs:
        logger.debug("Right OBJ not found")
        right_objs = [G.undefined_obj]

    # returned objects for serial assignment (e.g. a = b = c)
    returned_objs = []

    if G.check_proto_pollution and (handled_left.name_tainted and handled_left.parent_is_proto):
        flag1 = False
        flag2 = False

        for obj in right_objs:
            if G.get_node_attr(obj).get('tainted'):
                flag2 = True
                break
        if flag2:
            name_node_log = [('{}: {}'.format(x, repr(G.get_node_attr(x)
                .get('name')))) for x in handled_left.name_nodes]
            logger.warning(sty.fg.li_red + sty.ef.inverse +
                'Possible prototype pollution at node {} (Line {}), '
                'trying to assign {} to name node {}'
                .format(ast_node, G.get_node_attr(ast_node).get('lineno:int'),
                right_objs, ', '.join(name_node_log)) + sty.rs.all)
            logger.debug(f'Pollutable objs: {G.pollutable_objs}')
            logger.debug(f'Pollutable NN: {G.pollutable_name_nodes}')
            G.proto_pollution.add(ast_node)
            if G.exit_when_found:
                G.finished = True
            # skip doing the assignment
            return NodeHandleResult()

    if not handled_right.obj_nodes and handled_right.terminated:
        # skip doing the assignment
        return NodeHandleResult()

    # do the assignment
    for name_node in handled_left.name_nodes:
        # nn_for_tags = G.get_node_attr(name_node).get('for_tags')
        # if not nn_for_tags: # empty array or None
        G.assign_obj_nodes_to_name_node(name_node, right_objs,
            branches=branches)
        returned_objs.extend(right_objs)

    return NodeHandleResult(obj_nodes=handled_right.obj_nodes,
        name_nodes=handled_left.name_nodes, # used_objs=used_objs,
        callback=get_df_callback(G))
