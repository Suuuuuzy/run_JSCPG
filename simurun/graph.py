import networkx as nx

class Graph:

    def __init__(self):
        self.graph = nx.MultiDiGraph()
        self.cur_obj = None 
        self.cur_scope = None
        self.cur_id = 0

    def _get_new_nodeid(self):
        """
        return a nodeid
        """
        self.cur_id += 1
        return str(self.cur_id - 1)

    def add_scope(self, scope_name, define_id):
        """
        add a new scope under current scope
        if the scope already exist, return the scope without add
        a new one
        """
        cur_scope = self.cur_scope
        scope_id = self.get_func_scope_by_name(scope_name)
        if scope_id != None:
            return scope_id
        cur_nodeid = str(self._get_new_nodeid())
        self.add_node(cur_nodeid)
        self.set_node_attr(cur_nodeid, ('type', 'SCOPE'))
        self.set_node_attr(cur_nodeid, ('label:label', 'SCOPE'))
        self.set_node_attr(cur_nodeid, ('name', scope_name))
        self.add_edge(cur_nodeid, define_id, {'type:TYPE': 'SCOPE_AST'})
        if cur_scope != None:
            self.add_edge(cur_scope, cur_nodeid, {'type:TYPE': 'SCOPE_PARENT'})
        else:
            self.cur_scope = cur_nodeid

        return cur_nodeid

    def add_literal_obj(self):
        """
        add a literal object
        """
        node_id = self._get_new_nodeid()
        self.add_node(node_id)
        self.set_node_attr(node_id, ('type', 'LITERAL'))
        return node_id

    def import_from_CSV(self, nodes_file_name, rels_file_name):
        with open(nodes_file_name) as fp:
            headers = fp.readline()
            headers = headers.split("\t")
            line = headers
            while line:
                line = fp.readline().strip()
                cur_vals = line.split("\t")
                if len(line) < 1:
                    continue
                cur_id = cur_vals[0]
                self.add_node(cur_id)
                for idx in range(1, len(cur_vals)):
                    if cur_vals[idx] != '':
                        self.set_node_attr(cur_id, (headers[idx], cur_vals[idx]))

        with open(rels_file_name) as fp:
            headers = fp.readline()
            headers = headers.split("\t")
            line = headers
            edge_list = []
            while line:
                attrs = {}
                line = fp.readline().strip()
                cur_vals = line.split("\t")
                if len(cur_vals) < 3:
                    continue
                cur_start_id = cur_vals[0]
                cur_end_id = cur_vals[1]
                for idx in range(2, len(cur_vals)):
                    if cur_vals[idx] != '':
                        attrs[headers[idx]] = cur_vals[idx]
                edge_list.append((cur_start_id, cur_end_id, attrs))
            self.add_edges_from_list(edge_list)
        print ("Finished Importing")

    def export_to_CSV(self, nodes_file_name, rels_file_name, light = False):
        """
        export to CSV to import to neo4j
        """
        headers = ['id:ID','labels:label','type','flags:string[]','lineno:int','code','childnum:int','funcid:int','classname','namespace','endlineno:int','name','doccomment']
        skip_headers = ['id:ID']
        fp = open(nodes_file_name, 'w')
        header_str = '\t'.join(headers)
        fp.write(header_str + '\n')
        nodes = list(self.graph.nodes(data = True))

        nodes.sort(key = lambda x: int(x[0]))
        for node in nodes:
            cur_line = [node[0]]
            for header in headers:
                if header in skip_headers:
                    continue
                if header in node[1]:
                    cur_line.append(node[1][header])
                else:
                    cur_line.append('')
            try:
                fp.write('\t'.join(cur_line) + '\n')
            except:
                print '==========================ERROR LINE: ', cur_line, '==================================='
        fp.close()

        headers = ['start:START_ID','end:END_ID','type:TYPE','var','taint_src','taint_dst']
        skip_headers = ['start:START_ID', 'end:END_ID']
        light_edge_type = ['FLOWS_TO', 'REACHES', 'OBJ_REACHES', 'ENTRY', 'EXIT']

        fp = open(rels_file_name, 'w')
        header_str = '\t'.join(headers)
        fp.write(header_str + '\n')

        edges = []
        if light:
            for edge_type in light_edge_type:
                edges += self.get_edges_by_type(edge_type)
        else:
            edges = list(self.graph.edges(data = True, keys = True))

        for edge in edges:
            cur_line = [edge[0], edge[1]]
            for header in headers:
                if header in skip_headers:
                    continue
                if header in edge[3]:
                    cur_line.append(edge[3][header])
                else:
                    cur_line.append('')
            fp.write('\t'.join(cur_line) + '\n')
        fp.close()

        

        print ("Finished Exporting to {} and {}".format(nodes_file_name, rels_file_name))

    def add_node(self, node_for_adding):
        self.graph.add_node(node_for_adding)
        return node_for_adding

    def set_node_attr(self, node_id, attr):
        """
        attr should be a tuple like (key, value)
        will be added to a node id
        """
        self.graph.nodes[node_id][attr[0]] = attr[1]

    def get_node_attr(self, node_id):
        """
        this function will return a dict with all the attrs and values
        """
        return self.graph.nodes[node_id]

    def get_all_nodes(self):
        """
        return all nodes in the form of dict
        """
        return self.graph.nodes

    def add_edge(self, from_ID, to_ID, attr):
        """
        insert an edge to graph
        attr is like {key: value, key: value}
        """
        self.graph.add_edges_from([(from_ID, to_ID, attr)])

    def set_edge_attr(self, from_ID, to_ID, edge_id, attr):
        self.graph[from_ID][to_ID][attr[0]][edge_id] = attr[1]

    def get_edge_attr(self, from_ID, to_ID, edge_id = None):
        if edge_id == None:
            return self.graph.get_edge_data(from_ID, to_ID)
        return self.graph[from_ID][to_ID][edge_id]

    def add_node_from_list(self, node_list):
        return self.graph.add_nodes_from(node_list)

    def add_edges_from_list(self, edge_list):
        return self.graph.add_edges_from(edge_list)

    def dfs_edges(self, source, depth_limit = None):
        """
        Iterate over edges in a depth-first-search (DFS).
        """
        return nx.dfs_edges(self.graph, source)

    def get_out_edges(self, node_id, data = True, keys = True, edge_type = None):
        if edge_type == None:
            return self.graph.out_edges(node_id, data = data, keys = keys)
        edges = self.graph.out_edges(node_id, data = data, keys = keys)
        idx = 1
        if keys == True:
            idx += 1
        if data == True:
            idx += 1
        return [edge for edge in edges if 'type:TYPE' in edge[idx] and edge[idx]['type:TYPE'] == edge_type]

    def get_in_edges(self, node_id, data = True, keys = True, edge_type = None):
        if edge_type == None:
            return self.graph.in_edges(node_id, data = data, keys = keys)
        edges = self.graph.in_edges(node_id, data = data, keys = keys)
        idx = 2
        if keys == True:
            idx = 3
        return [edge for edge in edges if 'type:TYPE' in edge[idx] and edge[idx]['type:TYPE'] == edge_type]

    def get_sub_graph_by_edge_type(self, edge_type):
        """
        only keep edges with specific type
        return a sub graph
        """
        subEdges = self.get_edges_by_type(edge_type)
        return nx.MultiDiGraph(subEdges)
    
    def get_edges_by_type(self, edge_type):
        """
        return the edges with a specific type
        """
        subEdges = [edge for edge in self.graph.edges(data = True, keys=True) if edge[3]['type:TYPE'] == edge_type]
        return subEdges

    def find_nearest_upper_CPG_node(self, node_id):
        """
        return the nearest upper CPG node of the input node_id
        we assume that the nearest will appear within 2 steps
        """
        edges = nx.bfs_edges(self.graph, node_id, reverse = True, depth_limit = 3)
        for edge in edges:
            # the nodes are reversed
            edges_data = self.get_edge_attr(edge[1], edge[0])
            for key in edges_data:
                edge_data = edges_data[key]
                if 'type:TYPE' in edge_data and edge_data['type:TYPE'] == 'FLOWS_TO':
                    return edge[0]
    
    def get_successors(self, node_id):
        return self.graph.successors(node_id)
    
    def get_nodes_by_type(self, node_type):
        """
        return a list of nodes with a specific node type
        """
        return [node for node in self.graph.nodes(data = True) if node[1]['type'] == node_type]

    def get_cur_scope(self):
        return self.cur_scope

    def get_name_from_child(self, nodeid):
        """
        try to find the name of a nodeid
        we have to use bfs strategy
        """
        bfs_queue = []
        visited = set()
        bfs_queue.append(nodeid)

        while(len(bfs_queue)):
            cur_node = bfs_queue.pop(0)

            # if visited before, stop here
            if cur_node in visited:
                continue
            else:
                visited.add(cur_node)

            cur_attr = self.get_node_attr(cur_node)

            if cur_attr['type'] == 'string':
                if 'name' in cur_attr:
                    return cur_attr['name']
                if 'code' in cur_attr:
                    return cur_attr['code']
            elif cur_attr['type'] == 'integer':
                return str(cur_attr['code'])

            out_edges = self.get_out_edges(cur_node, edge_type = 'PARENT_OF')
            out_nodes = [edge[1] for edge in out_edges]
            bfs_queue += out_nodes

        return None

    def get_scope_namenode_by_name(self, var_name, scope = None):
        """
        helper function, get the namenode of a name based on scope
        """
        cur_scope = self.cur_scope
        if scope != None:
            cur_scope = scope

        while(1):
            var_edges = self.get_out_edges(cur_scope, data = True, keys = True, edge_type = "SCOPE_VAR_EDGE")
            for cur_edge in var_edges:
                cur_var_attr = self.get_node_attr(cur_edge[1])
                if cur_var_attr['name'] == var_name:
                    return cur_edge[1]
            scope_edges = self.get_in_edges(cur_scope, data = True, keys = True, edge_type = "SCOPE_PARENT")
            if len(scope_edges) == 0:
                break
            cur_scope = list(scope_edges)[0][0]
        return None

    def get_obj_by_obj_name(self, var_name, parent_obj = None):
        """
        get the sub obj of a parent obj based on the name
        """
        namenode = self.get_name_node_of_obj(var_name, parent_obj = parent_obj)
        if namenode == None:
            return None
        out_edges = list(self.get_out_edges(namenode))
        if len(out_edges) == 0:
            return None
        return out_edges[0][1]

    def get_obj_by_name(self, var_name, scope = None):
        """
        get the obj of a name based on the scope
        if the scope is not specified, starts from the current scope
        we assume that one node only has one parent
        """
        namenode = self.get_scope_namenode_by_name(var_name, scope)
        if namenode == None:
            return None
        out_edges = list(self.get_out_edges(namenode))
        if len(out_edges) == 0:
            return None
        return out_edges[0][1]
    
    def add_namenode_to_scope(self, name, scope = None):
        """
        helper function
        add a namenode to scope
        """
        cur_scope = self.cur_scope
        if scope != None:
            cur_scope = scope 

        new_node_id = str(self._get_new_nodeid())
        self.add_edge(cur_scope, new_node_id, {"type:TYPE": "SCOPE_VAR_EDGE"})
        self.set_node_attr(new_node_id, ('name', name))

    def add_obj_to_obj(self, ast_node, var_type, var_name, parent_obj = None, tobe_added_obj = None):
        """
        add obj to current obj as a sub obj
        obj->name node->sub obj
        add edge from ast node to obj generation node
        """
        if parent_obj == None:
            parent_obj = self.cur_obj

        var_name_id = str(self._get_new_nodeid())
        self.add_node(var_name_id)
        self.set_node_attr(var_name_id, ('name', var_name))

        if tobe_added_obj == None:
            tobe_added_obj = str(self._get_new_nodeid())
            self.add_node(tobe_added_obj)
            self.set_node_attr(tobe_added_obj, ('type', var_type))

        self.add_edge(parent_obj, var_name_id, {"type:TYPE": "OBJ_VAR_EDGE"})
        self.add_edge(var_name_id, tobe_added_obj, {"type:TYPE": "NAME_OBJ"})
        self.add_edge(tobe_added_obj, ast_node, {"type:TYPE": "OBJ_AST"})

        return tobe_added_obj 

    def add_obj_node(self, ast_node, var_type):
        """
        add a obj node with var type
        return the added obj
        """
        obj_node_id = str(self._get_new_nodeid())
        self.add_node(obj_node_id)
        self.set_node_attr(obj_node_id, ('type', var_type))

        self.add_edge(obj_node_id, ast_node, {"type:TYPE": "OBJ_AST"})
        return obj_node_id

    def setup_run(self, entry_nodeid):
        """
        the init function of setup a run
        """
        # init cur_id here!!
        self.cur_id = self.graph.number_of_nodes()

        self.BASE_SCOPE = self.add_scope("BASE_SCOPE", entry_nodeid)
        cur_nodeid = str(self._get_new_nodeid())
        self.add_node(cur_nodeid)
        self.set_node_attr(cur_nodeid, ('type', 'OBJ'))
        self.set_node_attr(cur_nodeid, ('name', 'BASE_OBJ'))
        self.cur_obj = cur_nodeid

    def add_obj_to_scope(self, ast_node, name, var_type, scope = None):
        """
        add a obj to a scope, if scope is None, add to current scope
        return the added node id
        """
        cur_scope = self.cur_scope
        if scope != None:
            cur_scope = scope 

        new_node_id = str(self._get_new_nodeid())
        self.add_edge(cur_scope, new_node_id, {"type:TYPE": "SCOPE_VAR_EDGE"})
        self.set_node_attr(new_node_id, ('name', name))

        # here we do not add obj to current obj when add to scope
        # we just add a obj to scope
        obj_node_id = self.add_obj_node(ast_node, "OBJ")

        self.add_edge(new_node_id, obj_node_id, {"type:TYPE": "NAME_OBJ"})
        return obj_node_id

    def set_obj_by_scope_name(self, var_name, obj_id, scope = None):
        """
        set a var name point to a obj id in a scope
        if the var name never appeared, add to the current scope
        """
        obj_attr = self.get_node_attr(obj_id) 
        if obj_attr['type'] == 'LITERAL':
            obj_id = self.add_literal_obj()
        cur_namenode = self.get_scope_namenode_by_name(var_name, scope = scope)

        if cur_namenode == None:
            self.add_namenode_to_scope(var_name, scope = scope)

        cur_namenode = self.get_scope_namenode_by_name(var_name, scope = scope)
        pre_obj_id = self.get_obj_by_name(var_name, scope = scope)
        self.add_edge(cur_namenode, obj_id, {"type:TYPE": "NAME_OBJ"})
        if pre_obj_id != None:
            print "remove pre", var_name
            self.graph.remove_edge(cur_namenode, pre_obj_id)

    def get_node_by_attr(self, key, value):
        """
        get a list of node by key and value
        """
        return [node[0] for node in self.graph.nodes(data = True) if key in node[1] and node[1][key] == value]

    def remove_nodes_from(self, remove_list):
        """
        remove a list of nodes from the graph
        """
        self.graph.remove_nodes_from(remove_list)

    def get_func_declid_by_function_name(self, function_name, scope = None):
        """
        return the function decl ast nodeid of a funcion
        """
        if scope == None:
            scope = self.cur_scope

        func_obj = self.get_obj_by_name(function_name, scope = scope)
        if func_obj == None:
            print 'FUNCTION {} not find'.format(function_name)
            return func_obj 

        tmp_edge = self.get_out_edges(func_obj, data = True, keys = True, edge_type = "OBJ_AST")[0]
        func_decl_ast = tmp_edge[1]
        return func_decl_ast

    def get_entryid_by_function_name(self, function_name, scope = None):
        """
        return the entryid nodeid of a funcion
        """
        func_decl_ast = self.get_func_declid_by_function_name(function_name, scope)
        if func_decl_ast == None:
            return None
        tmp_edge = self.get_out_edges(func_decl_ast, data = True, keys = True, edge_type = "ENTRY")[0]
        return tmp_edge[1]

    def get_scope_by_ast_decl(self, func_id):
        """
        return the scope id by the ast node
        """
        return self.get_in_edges(func_id, data = True, keys = True, edge_type = "SCOPE_AST")[0][0]

    def _get_childern_by_childnum(self, node_id):
        """
        helper function, get the childern nodeid of the node_id
        return a dict, with {childnum: node_id}
        """
        edges = self.get_out_edges(node_id, edge_type = "PARENT_OF")
        res = {}
        for edge in edges:
            node_attr = self.get_node_attr(edge[1])
            res[node_attr['childnum:int']] = edge[1]
        return res

    def handle_property(self, node_id):
        """
        input the node_id, return the parent and child
        return [parent, child]
        currently we only support one level property
        """
        childnum_dict = self._get_childern_by_childnum(node_id)
        return [childnum_dict['0'], childnum_dict['1']]

    def handle_method_call(self, node_id):
        """
        input the node_id, return the parent and child
        return [parent, child, args]
        currently we only support one level property
        """
        childnum_dict = self._get_childern_by_childnum(node_id)
        return [childnum_dict['0'], childnum_dict['1'], childnum_dict['2']]

    def get_func_scope_by_name(self, func_name, scope = None):
        """
        get a func scope by name, get func obj first, return the obj_scope node
        """
        obj_node_id = self.get_obj_by_name(func_name, scope = scope)
        print obj_node_id, func_name
        if obj_node_id == None:
            return None
        scope_edge = self.get_out_edges(obj_node_id, edge_type = "OBJ_SCOPE")
        if len(scope_edge) == 0:
            return None
        return scope_edge[0][1]

    def get_name_node_of_obj(self, var_name, parent_obj = None):
        """
        get the name node of a child of obj 
        return the name node
        """
        if parent_obj == None:
            parent_obj = self.cur_obj
        
        edges = self.get_out_edges(parent_obj, edge_type = "OBJ_VAR_EDGE")
        for edge in edges:
            cur_attr = self.get_node_attr(edge[1])
            if "name" in cur_attr and cur_attr["name"] == var_name:
                return edge[1]
        return None

    def add_namenode_to_obj(self, name, obj = None):
        """
        helper function
        add a namenode to scope
        """
        if obj == None:
            obj = self.cur_obj

        new_node_id = str(self._get_new_nodeid())
        self.add_node(new_node_id)
        self.add_edge(obj, new_node_id, {"type:TYPE": "OBJ_VAR_EDGE"})
        self.set_node_attr(new_node_id, ('name', name))

    def set_obj_by_obj_name(self, var_name, obj_id, parent_obj = None):
        """
        set a var name point to a obj id in a obj 
        if the var name never appeared, add to the current obj 
        """
        if parent_obj == None:
            parent_obj = self.cur_obj

        obj_attr = self.get_node_attr(obj_id) 
        if obj_attr['type'] == 'LITERAL':
            obj_id = self.add_literal_obj()

        cur_namenode = self.get_name_node_of_obj(var_name, parent_obj = parent_obj)

        if cur_namenode == None:
            self.add_namenode_to_obj(var_name, obj = parent_obj)

        cur_namenode = self.get_name_node_of_obj(var_name, parent_obj = parent_obj)
        pre_obj_id = self.get_obj_by_obj_name(var_name, parent_obj = parent_obj)
        self.add_edge(cur_namenode, obj_id, {"type:TYPE": "NAME_OBJ"})
        if pre_obj_id != None:
            print "remove pre", var_name
            self.graph.remove_edge(cur_namenode, pre_obj_id)

    def get_func_scope_by_obj_name(self, func_name, parent_obj = None):
        """
        get a func scope by name, get func obj first, return the obj_scope node
        """
        obj_node_id = self.get_obj_by_obj_name(func_name, parent_obj = parent_obj)
        if obj_node_id == None:
            return None
        scope_edge = self.get_out_edges(obj_node_id, edge_type = "OBJ_SCOPE")[0]
        return scope_edge[1]

    def get_func_declid_by_function_obj_name(self, function_name, parent_obj = None):
        """
        return the function decl nodeid of a funcion
        """
        if parent_obj == None:
            parent_obj = self.cur_obj

        func_obj = self.get_obj_by_obj_name(function_name, parent_obj = parent_obj)
        if func_obj == None:
            print 'FUNCTION {} not find'.format(function_name)
            return func_obj 
        tmp_edge = self.get_out_edges(func_obj, data = True, keys = True, edge_type = "OBJ_AST")[0]
        func_decl_ast = tmp_edge[1]
        return func_decl_ast

    def add_blank_func(self, func_name, scope = None):
        """
        add a blank func
        used for built-in functions
        we need to run the function after the define
        """

        # add a function decl node first
        cur_id = self._get_new_nodeid()
        self.add_node(cur_id)
        self.set_node_attr(cur_id, ('funcid', cur_id))
        self.set_node_attr(cur_id, ('type', "AST_CLOSURE"))
        self.set_node_attr(cur_id, ('labels:label', 'Artificial_AST'))

        # add a node as the name of the function
        namenode_id = self._get_new_nodeid()
        self.add_node(namenode_id)
        self.set_node_attr(namenode_id, ('type', 'string'))
        self.set_node_attr(namenode_id, ('name', func_name))
        self.set_node_attr(namenode_id, ('labels:label', 'Artificial_AST'))

        entry_id = self._get_new_nodeid()
        self.add_node(entry_id)
        self.set_node_attr(entry_id, ('funcid', cur_id))
        self.set_node_attr(entry_id, ('type', 'CFG_FUNC_ENTRY'))
        self.set_node_attr(entry_id, ('labels:label', 'Artificial'))

        exit_id = self._get_new_nodeid()
        self.add_node(exit_id)
        self.set_node_attr(exit_id, ('funcid', cur_id))
        self.set_node_attr(exit_id, ('type', 'CFG_FUNC_EXIT'))
        self.set_node_attr(exit_id, ('labels:label', 'Artificial'))

        params_id = self._get_new_nodeid()
        self.add_node(params_id)
        self.set_node_attr(params_id, ('funcid', cur_id))
        self.set_node_attr(params_id, ('type', 'AST_PARAM_LIST'))
        self.set_node_attr(params_id, ('labels:label', 'Artificial_AST'))

        # add edges
        self.add_edge(cur_id, entry_id, {'type:TYPE': "ENTRY"})
        self.add_edge(cur_id, exit_id, {'type:TYPE': "EXIT"})
        self.add_edge(cur_id, namenode_id, {'type:TYPE': "PARENT_OF"})
        self.add_edge(cur_id, params_id, {'type:TYPE': "PARENT_OF"})
        self.add_edge(entry_id, exit_id, {'type:TYPE': "FLOWS_TO"})

        # we need to run the function 
        return cur_id

    def find_name_of_call(self, node_id):
        """
        input a ast call node, return the function name
        """
        edges = self.get_out_edges(node_id, edge_type = "PARENT_OF")
        for edge in edges:
            cur_attr = self.get_node_attr(edge[1])
            if cur_attr['type'] == 'AST_NAME':
                return self.get_name_from_child(edge[1])

    def get_child_nodes(self, node_id, edge_type = None):
        """
        return the childern of node (with a specific edge type)
        """
        edges = self.get_out_edges(node_id, edge_type = edge_type)
        return [e[1] for e in edges] 

    def get_all_inputs(self, node_id):
        """
        input a node
        return the input of this node and it's sub nodes
        """
        node_attr = self.get_node_attr(node_id)
        node_type = node_attr['type'] 
        res = []
        if node_type == "AST_ASSIGN":
            childern = self._get_childern_by_childnum(node_id)
            # only define no assign
            if len(childern) == 1:
                res = []
            else:
                right = childern['1']
                res += self.get_all_inputs(right)
        elif node_type == 'AST_ARRAY':
            elem_list_node = self._get_childern_by_childnum(node_id)
            if '0' in elem_list_node:
                elem_list_node = elem_list_node['0']
                elems = self.get_child_nodes(elem_list_node, edge_type = 'PARENT_OF')
                for elem in elems:
                    res += self.get_all_inputs(elem)

        elif node_type == 'AST_PROP':
            res = [node_id]

        elif node_type == 'AST_VAR':
            res = [node_id]

        elif node_type == 'AST_CALL':
            arg_list_node = self._get_childern_by_childnum(node_id)['1']
            args = self.get_child_nodes(arg_list_node, edge_type = 'PARENT_OF')
            for arg in args:
                res += self.get_all_inputs(arg)

        elif node_type == 'AST_BINARY_OP':
            args = self._get_childern_by_childnum(node_id)
            for arg in args:
                res += self.get_all_inputs(args[arg])
        elif node_type == 'AST_METHOD_CALL':
            edges = self.get_in_edges('322', edge_type = 'LAST_MODIFIED')

            args = self.get_child_nodes(node_id)
            for arg in args:
                cur_attr = self.get_node_attr(arg)
                if cur_attr['type'] == 'AST_ARG_LIST':
                    arg_list = arg
            res += self.get_child_nodes(arg_list, edge_type = 'PARENT_OF')
            func_name_id = self._get_childern_by_childnum(node_id)['0']
            res.append(func_name_id)

        return res
    
    def get_obj_by_node_id(self, node_id):
        """
        return the obj of a node id
        assume a node id only have one obj
        """
        node_attr = self.get_node_attr(node_id)
        node_type = node_attr['type'] 
        res = set() 
        if node_type == 'AST_VAR':
            var_name = self.get_name_from_child(node_id)
            res.add(self.get_obj_by_name(var_name))
        elif node_type == 'AST_PROP':
            [parent, child] = self.handle_property(node_id)
            parent_name = self.get_name_from_child(parent)
            child_name = self.get_name_from_child(child)

            parent_obj = self.get_obj_by_name(parent_name)
            child_obj = self.get_obj_by_obj_name(child_name, parent_obj = parent_obj)
            
            res.add(child_obj)
            res.add(parent_obj)

        return res

    def update_modified_edges(self, node_id, modified_objs):
        """
        update the modified objs and link with node id
        """
        
        for cur_obj in modified_objs:
            if cur_obj == None:
                continue
            edges = self.get_in_edges(modified_objs, edge_type = 'LAST_MODIFIED')
            for edge in edges:
                self.graph.remove_edge(*edge[:3])

            self.graph.add_edge(node_id, cur_obj, key = 'MODIFIED')
            nx.set_edge_attributes(self.graph, {(node_id, cur_obj, 'MODIFIED'): {'type:TYPE': 'LAST_MODIFIED'}})

