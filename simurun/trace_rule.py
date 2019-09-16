class TraceRule:
    """
    a rule container, which include a rule and a related checking function
    """

    def __init__(self, key, value, G):
        self.key = key
        self.value = value
        self.graph = G

    def exist_func(self, func_names, path):
        """
        check whether in the path, all functions within {func_names} exists

        Args:
            func_names: a list of function names that need to appear in the path
            path: the path need to be checked

        Returns:
            checking result
        """
        called_func_list = set()
        for node in path:
            childern = self.graph.get_all_child_nodes(node)
            for child in childern:
                cur_node = self.graph.get_node_attr(child)
                if 'type' in cur_node:
                    if cur_node['type'] == 'AST_CALL':
                        cur_func = self.graph.get_name_from_child(child)
                        called_func_list.add(cur_func)

        for func_name in func_names:
            if func_name not in called_func_list:
                return False

        return True
        print(func_list)

