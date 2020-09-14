class PluginManager(object):
    """
    this is the parent class for all the internal plugins
    """

    def __init__(self):
        self.registered_plugins = []
        self.G = G

    def dispatch_node(self, node_id, extra=None):
        """
        this method will dispatch nodes to different modules based
        on the type of the node
        the handling process for each node include multiple stages
        once a stage is finished, the return value of this stage 
        include three parts (action type, action content, callback function)
        the action types include:
            'handle': handle a node
            'run': run a function in another plugin
            'finish': finished the node handling
        
        Args:
            G (Graph): the graph
            node_id (str): the id of the node
        Returns:
            NodeHandleResult: the handle result of the node
        """
        node_attr = self.G.get_node_attr(node_id)
        print(node_attr)
        node_type = node_attr['type']

        handle_obj = self.handler_map[node_type](self.G, node_id, extra=extra)
        pipeline = handle_obj.pipeline

        while handle_res is not None:
            print(handle_res[0])
            action = handle_res[0]
            content = handle_res[1]
            if action == 'finish':
                return content
            cb = handle_res[2]
            
            sub_res = []
            if action == 'handle':
                for sub_node, sub_extra in content:
                    sub_res.append(self.dispatch_node(sub_node, sub_extra))
            handle_res = cb(sub_res)


