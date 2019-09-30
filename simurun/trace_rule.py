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
                    if cur_node['type'] == 'AST_CALL' or cur_node['type'] == 'AST_METHOD_CALL':
                        cur_func = self.graph.get_name_from_child(child)
                        called_func_list.add(cur_func)

        for called_func_name in called_func_list:
            if called_func_name in func_names:
                return True

        return False 

    def not_exist_func(self, func_names, path):
        """
        check if there exist a function named func_names in the path
        """
        return not self.exist_func(func_names, path)

    def start_with_func(self, func_names, path):
        """
        check whether a path starts with a function

        Args:
            func_names: the possible function names
            path: the path needed to be checked
        Return:
            True or False
        """
        start_node = path[0]

        childern = self.graph.get_all_child_nodes(start_node)
        for child in childern:
            cur_node = self.graph.get_node_attr(child)
            if 'type' in cur_node:
                if cur_node['type'] == 'AST_CALL' or cur_node['type'] == 'AST_METHOD_CALL':
                    cur_func = self.graph.get_name_from_child(child)
                    if cur_func not in func_names:
                        # if not current, maybe inside the call there is another call
                        continue
                    return cur_func in func_names 
        return False

    def end_with_func(self, func_names, path):
        """
        check whether a path ends with a function

        Args:
            func_names: the possible function names
            path: the path needed to be checked
        Return:
            True or False
        """
        end_node = path[-1]

        childern = self.graph.get_all_child_nodes(end_node)
        print(func_names, path)
        for child in childern:
            cur_node = self.graph.get_node_attr(child)
            if 'type' in cur_node:
                if cur_node['type'] == 'AST_CALL' or cur_node['type'] == 'AST_METHOD_CALL':
                    cur_func = self.graph.get_name_from_child(child)
                    print(cur_func)
                    if cur_func not in func_names:
                        # if not current, maybe inside the call there is another call
                        continue
                    return cur_func in func_names 

    def start_within_file(self, file_names, path):
        """
        check whether a path starts within a file
        Args:
            file_names: the possible file names
            path: the path to be checked
        Return:
            True or False
        """
        start_node = path[0]

        file_name = self.graph.get_node_file_path(start_node)
        cur_node = self.graph.get_node_attr(start_node)
        if file_name is None:
            return False
        file_name = file_name if '/' not in file_name else file_name.split('/')[-1]
        return file_name in file_names

    def check(self, path):
        """
        select the checking function and run it based on the key value
        Return:
            the running result of the obj
        """
        key_map = {
                "exist_func": self.exist_func,
                "not_exist_func": self.not_exist_func,
                "start_with_func": self.start_with_func,
                "start_within_file": self.start_within_file,
                "end_with_func": self.end_with_func
                }

        if self.key in key_map:
            check_function = key_map[self.key]
        else:
            return False

        return check_function(self.value, path)

