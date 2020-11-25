from src.plugins.handler import Handler
from src.core.utils import NodeHandleResult, ExtraInfo
from src.core.helpers import to_values
from src.plugins.internal.utils import wildcard, undefined
from ..utils import is_wildcard_obj
from src.core.logger import loggers, sty
from ..utils import get_df_callback,add_contributes_to
from itertools import chain

class HandleProp(Handler):
    """
    handle property
    """
    def process(self):
        side = self.extra.side if self.extra else None
        return handle_prop(self.G, 
                self.node_id, side, self.extra)[0]

def find_prop(G, parent_objs, prop_name, branches=None,
    side=None, parent_name='Unknown', in_proto=False, depth=0,
    prop_name_for_tags=None, ast_node=None, prop_name_sources=[]):
    '''
    Recursively find a property under parent_objs and its __proto__.
    
    Args:
        G (Graph): graph.
        parent_objs (list): parent objects.
        prop_name (str): property name.
        branches (BranchTagContainer, optional): branch information.
            Defaults to None.
        side (str, optional): 'left' or 'right', denoting left side or
            right side of assignment. Defaults to None.
        parent_name (str, optional): parent object's name, only used to
            print log. Defaults to ''.
        in_proto (bool, optional): whether __proto__ is being searched.
            Defaults to False.
        prop_name_for_tags (list, optional): Experimental. For-tags
            related to the property name. Defaults to None.
    
    Returns:
        prop_name_nodes, prop_obj_nodes: two sets containing possible
            name nodes and object nodes.
    '''
    if depth == 5:
        return [], []

    if in_proto:
        loggers.main_logger.debug('Cannot find "direct" property, going into __proto__ ' \
                f'{parent_objs}...')
        loggers.main_logger.debug(f'  {parent_name}.{prop_name}')
    prop_name_nodes = set()
    prop_obj_nodes = set()
    for parent_obj in parent_objs:
        if prop_name == wildcard and not is_wildcard_obj(G, parent_obj) and \
            not G.check_proto_pollution:
            continue

        # flag of whether any name node with prop_name under this parent
        # object is found
        name_node_found = False
        # search "direct" properties
        prop_name_node = G.get_prop_name_node(prop_name, parent_obj)
        if prop_name_node is not None:
            name_node_found = True
            prop_name_nodes.add(prop_name_node)
            prop_objs = G.get_objs_by_name_node(prop_name_node,
                branches=branches)
            if prop_objs:
                prop_obj_nodes.update(prop_objs)
        elif prop_name != '__proto__' and prop_name != wildcard:
            # if name node is not found, search the property under __proto__
            # note that we cannot search "__proto__" under __proto__
            __proto__name_node = G.get_prop_name_node("__proto__",
                parent_obj=parent_obj)
            if __proto__name_node is not None:
                __proto__obj_nodes = G.get_objs_by_name_node(__proto__name_node,
                    branches)
                # if set(__proto__obj_nodes) & set(parent_objs):
                #     logger.error('__proto__ ' \
                #         f'{__proto__obj_nodes} and parent {parent_objs} ' \
                #         'object nodes have intersection')
                #     __proto__obj_nodes = list(set(__proto__obj_nodes) -
                #         set(parent_objs))
                if parent_obj in __proto__obj_nodes:
                    logger.error('__proto__ ' \
                        f'{__proto__obj_nodes} and parent {parent_obj} ' \
                        'have intersection')
                    __proto__obj_nodes = __proto__obj_nodes.remove(parent_obj)
                if __proto__obj_nodes:
                    __name_nodes, __obj_nodes = find_prop(G,
                        __proto__obj_nodes, prop_name, branches,
                        parent_name=parent_name + '.__proto__',
                        in_proto=True, depth=depth+1)
                    if __name_nodes:
                        name_node_found = True
                        prop_name_nodes.update(__name_nodes)
                        prop_obj_nodes.update(__obj_nodes)
        if not name_node_found and not in_proto and prop_name != wildcard and \
            side != 'left':
            # try wildcard (*)
            r1, r2 = find_prop(G, [parent_obj], wildcard, branches, side,
                parent_name, in_proto, depth, prop_name_for_tags)
            if r2:
                name_node_found = True
                prop_name_nodes.update(r1)
                prop_obj_nodes.update(r2)
                if is_wildcard_obj(G, parent_obj):
                    for o in r2:
                        for s in prop_name_sources:
                            add_contributes_to(G, [s], o)
        if not name_node_found and not in_proto:
            # we cannot create name node under __proto__
            # name nodes are only created under the original parent objects
            if is_wildcard_obj(G, parent_obj) and side != 'left':
                # if this is an wildcard (unknown) object, add another
                # wildcard object as its property
                added_name_node = G.add_prop_name_node(prop_name, parent_obj)
                prop_name_nodes.add(added_name_node)
                added_obj = G.add_obj_to_name_node(added_name_node,
                    js_type='object' if G.check_proto_pollution else None,
                    value=wildcard, ast_node=ast_node)                    
                prop_obj_nodes.add(added_obj)
                loggers.main_logger.debug('{} is a wildcard object, creating a wildcard'
                    ' object {} for its properties'.format(parent_obj,
                    added_obj))
                if G.get_node_attr(parent_obj).get('tainted'):
                    G.set_node_attr(added_obj, ('tainted', True))
                    loggers.main_logger.debug("{} marked as tainted 1".format(added_obj))
                for s in prop_name_sources:
                    add_contributes_to(G, [s], added_obj)
                # if prop_name_for_tags:
                #     G.set_node_attr(added_name_node,
                #         ('for_tags', prop_name_for_tags))
            elif prop_name != wildcard: # normal (known) object
                if side == 'right':
                    continue
                elif parent_obj in [G.object_prototype, G.string_prototype,
                    G.function_prototype]: # more to be added
                    continue
                else:
                    # only add a name node
                    added_name_node = \
                        G.add_prop_name_node(prop_name, parent_obj)
                    prop_name_nodes.add(added_name_node)
                    # if prop_name_for_tags:
                    #     G.set_node_attr(added_name_node,
                    #                     ('for_tags', prop_name_for_tags))
                    loggers.main_logger.debug(f'{sty.ef.b}Add prop name node{sty.rs.all} '
                    f'{parent_name}.{prop_name} '
                    f'({parent_obj}->{added_name_node})')
    return prop_name_nodes, prop_obj_nodes

def handle_prop(G, ast_node, side=None, extra=ExtraInfo()) \
    -> (NodeHandleResult, NodeHandleResult):
    '''
    Handle property.
    
    Args:
        G (Graph): graph.
        ast_node ([type]): the MemberExpression (AST_PROP) AST node.
        extra (ExtraInfo, optional): Extra information. Defaults to {}.
    
    Returns:
        handled property, handled parent
    '''
    # recursively handle both parts
    from src.plugins.manager_instance import internal_manager
    logger = loggers.main_logger

    if extra is None:
        extra = ExtraInfo()
    parent, prop = G.get_ordered_ast_child_nodes(ast_node)[:2]
    handled_parent = internal_manager.dispatch_node(parent, extra)
    handled_prop = internal_manager.dispatch_node(prop, extra)
    if G.finished:
        return NodeHandleResult(), handled_parent
    
    parent_code = G.get_node_attr(parent).get('code')
    parent_name = handled_parent.name or parent_code or 'Unknown'
    parent_objs = handled_parent.obj_nodes
    parent_name_nodes = handled_parent.name_nodes

    branches = extra.branches
    # side = extra.side # Do not use extra.side, may have been removed
    prop_name_nodes, prop_obj_nodes = set(), set()

    # prepare property names
    prop_names, prop_name_sources, prop_name_tags = \
                            to_values(G, handled_prop, for_prop=True)
    name_tainted = False
    if G.check_proto_pollution:
        for source in chain(*prop_name_sources):
            if G.get_node_attr(source).get('tainted'):
                name_tainted = True
                break

    parent_is_proto = False
    if G.check_proto_pollution:
        for obj in handled_parent.obj_nodes:
            if obj in G.builtin_prototypes:
                parent_is_proto = True
                break

    # if G.check_proto_pollution and prop_names == [wildcard] * len(prop_names):
        # conservative: only if all property names are unknown,
        # we fetch all properties
        # (including __proto__ for prototype pollution detection)
        # logger.debug('All property names are unknown, fetching all properties')
    if G.check_proto_pollution and wildcard in prop_names:
        # agressive: if any property name is unknown, we fetch all properties
        logger.debug('One of property names is unknown, fetching all properties')
        for parent_obj in parent_objs:
            prop_name_nodes.update(G.get_prop_name_nodes(parent_obj))
            objs = G.get_prop_obj_nodes(parent_obj, branches=branches,
                exclude_proto=False)
            objs = filter(lambda obj: obj in G.builtin_constructors or
                          G.get_node_attr(obj).get('type') != 'function', objs)
            prop_obj_nodes.update(objs)
            if is_wildcard_obj(G, parent_obj) and not G.get_prop_obj_nodes(
                    parent_obj, wildcard, extra.branches):
                added_obj = \
                    G.add_obj_as_prop(wildcard, ast_node,
                            parent_obj=parent_obj, value=wildcard)
                add_contributes_to(G, [parent_obj], added_obj)
                prop_obj_nodes.add(added_obj)
        name = f'{parent_name}.*'

    else:
        # create parent object if it doesn't exist
        parent_objs = list(filter(lambda x: x != G.undefined_obj, parent_objs))
        if not parent_objs:
            loggers.main_logger.debug(
                "PARENT OBJ {} NOT DEFINED, creating object nodes".
                format(parent_name))
            # we assume this happens when it's a built-in var name
            if parent_name_nodes:
                parent_objs = []
                for name_node in parent_name_nodes:
                    obj = G.add_obj_to_name_node(name_node, ast_node,
                        js_type='object' if G.check_proto_pollution else None,
                        value=wildcard)
                    parent_objs.append(obj)
            else:
                obj = G.add_obj_to_scope(parent_name, ast_node,
                    js_type='object' if G.check_proto_pollution else None,
                    scope=G.BASE_SCOPE, value=wildcard)
                parent_objs = [obj]
            # else:
            #     logger.debug("PARENT OBJ {} NOT DEFINED, return undefined".
            #         format(parent_name))
            #     return NodeHandleResult()

        # find property name nodes and object nodes
        # (filtering is moved to find_prop)
        for i, prop_name in enumerate(prop_names):
            # if prop_name == wildcard:
            #     continue
            assert prop_name is not None
            name_nodes, obj_nodes = find_prop(G, parent_objs, 
                prop_name, branches, side, parent_name,
                prop_name_for_tags=prop_name_tags[i],
                ast_node=ast_node, prop_name_sources=prop_name_sources[i])
            prop_name_nodes.update(name_nodes)
            prop_obj_nodes.update(obj_nodes)

        # wildcard is now implemented in find_prop

        if len(prop_names) == 1:
            name = f'{parent_name}.{prop_names[0]}'
        else:
            name = f'{parent_name}.{"/".join(map(str, prop_names))}'

        # tricky fix, we don't really link name nodes to the undefined object
        if not prop_obj_nodes:
            prop_obj_nodes = set([G.undefined_obj])

    return NodeHandleResult(obj_nodes=list(prop_obj_nodes),
            name=f'{name}', name_nodes=list(prop_name_nodes),
            ast_node=ast_node, callback=get_df_callback(G),
            name_tainted=name_tainted, parent_is_proto=parent_is_proto
        ), handled_parent
