from src.plugins.handler import Handler
from src.core.utils import ExtraInfo
from src.core.logger import loggers
from ..utils import to_obj_nodes, NodeHandleResult, get_df_callback

class HandleArray(Handler):
    """
    the array handler
    """
    def process(self):
        G = self.G
        node_id = self.node_id
        if G.get_node_attr(node_id).get('flags:string[]') == 'JS_OBJECT':
            added_obj = G.add_obj_node(node_id, "object")
        else:
            added_obj = G.add_obj_node(node_id, "array")

        used_objs = set()
        children = G.get_ordered_ast_child_nodes(node_id)

        for child in children:
            result = self.internal_manager.dispatch_node(child, ExtraInfo(self.extra,
                parent_obj=added_obj))
            # used_objs.update(result.obj_nodes)

        G.add_obj_as_prop(prop_name='length', js_type='number',
            value=len(children), ast_node=node_id, parent_obj=added_obj)

        return NodeHandleResult(obj_nodes=[added_obj],
                                used_objs=list(used_objs),
                                callback=get_df_callback(G))

class HandleArrayElem(Handler):
    """
    the array element handler
    """
    def process(self):
        if not (self.extra and self.extra.parent_obj is not None):
            logger.error("AST_ARRAY_ELEM occurs outside AST_ARRAY")
            return None
        else:
            # should only have two childern
            try:
                value_node, key_node = G.get_ordered_ast_child_nodes(node_id)
            except:
                # TODO: Check what happend here for colorider
                return NodeHandleResult()
                
            key = G.get_name_from_child(key_node)
            if key is not None:
                key = key.strip("'\"")
            else:
                # shouldn't convert it to int
                key = G.get_node_attr(node_id).get('childnum:int')
            if key is None:
                key = wildcard
            handled_value = self.internal_manager.dispatch_node(G, value_node, self.extra)
            value_objs = to_obj_nodes(G, handled_value, node_id)
            # used_objs = list(set(handled_value.used_objs))
            for obj in value_objs:
                G.add_obj_as_prop(key, node_id,
                    parent_obj=self.extra.parent_obj, tobe_added_obj=obj)
        return NodeHandleResult(obj_nodes=value_objs, # used_objs=used_objs,
            callback=get_df_callback(G))
