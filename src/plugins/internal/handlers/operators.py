from src.core.graph import Graph
from src.core.utils import *

class HandleAssign:
    def __init__(self, G: Graph, node_id: str, extra=None):
        self.G = G
        self.node_id = node_id
        self.extra = extra

    def pre_processing(self):
        """
        this method will generate the successors 
        basically for assign operations, we need to handle the left
        and right of the assignment and handle them in the post successor method
        """
        if self.extra is None:
            self.extra = ExtraInfo()
        ast_children = self.G.get_ordered_ast_child_nodes(self.node_id) 
        successors = []
        try:
            self.left, self.right = ast_children
        except ValueError:
            # if only have left side
            return ('handle', (ast_children[0], self.extra), 
                    self.final)

        # recursively handle both sides
        # handle right first
        branches = self.extra.branches if self.extra else BranchTagContainer()

        if right_override is None:
            return ('handle', (right, ExtraInfo(extra, side='right')), self.handle_left)
        else:
            self.handle_assign(right_override)

    def final(self, content):
        """
        this is the final function, the content is a nodehandleresult,
        just return it
        Args:
            content (NodeHandleResult): the handle result
        """
        return content
    
    def handle_array_js_object(self):
        """
        handle the js object array method
        """
        children = G.get_ordered_ast_child_nodes(left)
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

    def handle_array_pattern(self, handled_right):
        """
        handle the array pattern
        """
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

    def handle_normal_assign(self):
        """
        handle the normal assign condition
        """
        self.handle_normal_assign(handled_right)
        # normal assignment
        handled_left = handle_node(G, left, ExtraInfo(extra, side='left'))
        # set function name
        name = handled_left.name
        if name and G.get_node_attr(right).get('type') in \
            ['AST_FUNC_DECL', 'AST_CLOSURE']:
            for func_obj in handled_right.obj_nodes:
                old_name = G.get_node_attr(func_obj).get('name')
                if not old_name or old_name == '{closure}':
                    G.set_node_attr(func_obj, ('name', name))
        return do_assign(G, handled_left, handled_right, branches, ast_node)

    def handle_assign(self, handled_right):
        """
        handle left method should happend after handler right
        Args:
            handled_right (NodeHandleResult): the handle result for handle right
        """
        if G.get_node_attr(left).get('type') == 'AST_ARRAY':
            # destructuring assignment
            # handle left item by item
            if G.get_node_attr(left).get('flags:string[]') == 'JS_OBJECT':
                self.handle_array_js_object(handled_right)
            else:
                self.handle_array_pattern(handled_right)
        else:
            self.handle_normal_assign(handled_right)

    def do_assign(self, G, handled_left, handled_right, branches=None, ast_node=None):
        if branches is None:
            branches = BranchTagContainer()

        if not handled_left:
            logger.warning("Left side handling error at statement {}".format(ast_node))
            return NodeHandleResult()

        if not handled_right:
            logger.warning("Right side handling error at statement {}".format(ast_node))
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
