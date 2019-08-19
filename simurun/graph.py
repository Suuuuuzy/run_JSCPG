import networkx as nx
import sys
import csv
import sty
import io
from utilities import BranchTag
from typing import List, Callable

class Graph:

    def __init__(self):
        self.graph = nx.MultiDiGraph()
        self.cur_obj = None 
        self.cur_scope = None
        self.cur_id = 0
        self.file_contents = {}

    # Basic graph operations

    # node

    def _get_new_nodeid(self):
        """
        return a nodeid
        """
        self.cur_id += 1
        return str(self.cur_id - 1)

    def add_node(self, node_for_adding, attr={}):
        self.graph.add_node(node_for_adding, **attr)
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
        assert node_id is not None
        return self.graph.nodes[node_id]

    def get_all_nodes(self):
        """
        return all nodes in the form of dict
        """
        return self.graph.nodes

    def get_nodes_by_type(self, node_type, data=True):
        """
        return a list of nodes with a specific node type
        as tuples of node id and attrs
        """
        return [node for node in self.graph.nodes(data=data) if node[1].get('type') == node_type]

    def get_nodes_by_type_and_flag(self, node_type, node_flag, data=True):
        """
        return a list of nodes with a specific node type and flag
        """
        return [node[0] for node in self.graph.nodes(data=data) if node[1].get('type') == node_type and node[1].get('flags:string[]') == node_flag]

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
    
    # edges

    def add_edge(self, from_ID, to_ID, attr):
        """
        insert an edge to graph
        attr is like {key: value, key: value}
        """
        assert from_ID != None, "Failed to add an edge, from_ID is None."
        assert to_ID != None, "Failed to add an edge, to_ID is None."
        # self.graph.add_edges_from([(from_ID, to_ID, attr)])
        self.graph.add_edge(from_ID, to_ID, None, **attr)
    
    def add_edge_if_not_exist(self, from_ID, to_ID, attr):
        """
        insert an edge to the graph if the graph does not already has the same edge
        """
        assert from_ID != None, "Failed to add an edge, from_ID is None."
        assert to_ID != None, "Failed to add an edge, to_ID is None."
        if not self.graph.has_edge(from_ID, to_ID):
            self.add_edge(from_ID, to_ID, attr)
        else:
            for key, edge_attr in self.graph[from_ID][to_ID].items():
                if edge_attr == attr:
                    print(sty.fg.red + "Edge {}->{} exists: {}, {}. Duplicate edge will not be created.".format(from_ID,to_ID,key,edge_attr) + sty.rs.all)
                    return
            self.add_edge(from_ID, to_ID, attr)

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

    def add_edges_from_list_if_not_exist(self, edge_list):
        for e in edge_list:
            if len(e) != 3:
                print("Length of the edge tuple {} is not 3".format(e))
                continue
            self.add_edge_if_not_exist(*e)

    def get_edges_by_type(self, edge_type):
        """
        return the edges with a specific type
        """
        subEdges = [edge for edge in self.graph.edges(data = True, keys=True) if edge[3]['type:TYPE'] == edge_type]
        return subEdges

    def get_edges_between(self, u, v, edge_type = None) -> dict:
        result = {}
        for key, edge_attr in self.graph[u][v].items():
            if not edge_type or edge_attr.get('type:TYPE') == edge_type:
                result[key] = edge_attr
        return result

    def remove_all_edges_between(self, u, v):
        while self.graph.has_edge(u, v):
            self.graph.remove_edge(u, v)

    def get_successors(self, node_id):
        return self.graph.successors(node_id)

    def get_out_edges(self, node_id, data = True, keys = True, edge_type = None):
        if edge_type is None:
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

    # traversal

    def dfs_edges(self, source, depth_limit = None):
        """
        Iterate over edges in a depth-first-search (DFS).
        """
        return nx.dfs_edges(self.graph, source, depth_limit)

    # import/export

    def import_from_string(self, string):
        nodes, rels = string.split('\n\n')[:2]

        with io.StringIO(nodes) as fp:
            reader = csv.DictReader(fp, delimiter='\t')
            for row in reader:
                cur_id = row['id:ID']
                self.add_node(cur_id)
                for attr, val in row.items():
                    if attr == 'id:ID': continue
                    self.set_node_attr(cur_id, (attr, val))

        with io.StringIO(rels) as fp:
            reader = csv.DictReader(fp, delimiter='\t')
            edge_list = []
            for row in reader:
                attrs = dict(row)
                del attrs['start:START_ID']
                del attrs['end:END_ID']
                edge_list.append((row['start:START_ID'], row['end:END_ID'], attrs))
            self.add_edges_from_list(edge_list)
        print(sty.ef.inverse + sty.fg.white + "Finished Importing" + sty.rs.all)

    def import_from_CSV(self, nodes_file_name, rels_file_name):
        with open(nodes_file_name) as fp:
            reader = csv.DictReader(fp, delimiter='\t')
            for row in reader:
                cur_id = row['id:ID']
                self.add_node(cur_id)
                for attr, val in row.items():
                    if attr == 'id:ID': continue
                    self.set_node_attr(cur_id, (attr, val))

        with open(rels_file_name) as fp:
            reader = csv.DictReader(fp, delimiter='\t')
            edge_list = []
            for row in reader:
                attrs = dict(row)
                del attrs['start:START_ID']
                del attrs['end:END_ID']
                edge_list.append((row['start:START_ID'], row['end:END_ID'], attrs))
            self.add_edges_from_list(edge_list)
        print(sty.ef.inverse + sty.fg.white + "Finished Importing" + sty.rs.all)

    def export_to_CSV(self, nodes_file_name, rels_file_name, light = False):
        """
        export to CSV to import to neo4j
        """
        with open(nodes_file_name, 'w') as fp:
            headers = ['id:ID','labels:label','type','flags:string[]','lineno:int','code','childnum:int','funcid:int','classname','namespace','endlineno:int','name','doccomment']
            writer = csv.DictWriter(fp, delimiter='\t', fieldnames=headers, extrasaction='ignore')
            writer.writeheader()
            nodes = list(self.graph.nodes(data = True))
            nodes.sort(key = lambda x: int(x[0]))
            for node in nodes:
                node_id, attr = node
                row = dict(attr)
                row['id:ID'] = node_id
                writer.writerow(row)

        with open(rels_file_name, 'w') as fp:
            headers = ['start:START_ID','end:END_ID','type:TYPE','var','taint_src','taint_dst']
            writer = csv.DictWriter(fp, delimiter='\t', fieldnames=headers, extrasaction='ignore')
            writer.writeheader()
            light_edge_type = ['FLOWS_TO', 'REACHES', 'OBJ_REACHES', 'ENTRY', 'EXIT']
            edges = []
            if light:
                for edge_type in light_edge_type:
                    edges += self.get_edges_by_type(edge_type)
            else:
                edges = list(self.graph.edges(data = True, keys = True))
            for edge in edges:
                edge_from, edge_to, _, attr = edge
                row = dict(attr)
                row['start:START_ID'] = edge_from
                row['end:END_ID'] = edge_to
                writer.writerow(row)

        print(sty.ef.inverse + sty.fg.white + "Finished Exporting to {} and {}".format(nodes_file_name, rels_file_name) + sty.rs.all)

    # AST & CPG

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

    def get_ordered_ast_child_nodes(self, node_id):
        """
        return AST children of a node in childnum order
        """
        children = sorted(self._get_childern_by_childnum(node_id).items(), key=lambda x: int(x[0]))
        if children:
            children = list(zip(*children))[1]
        return children

    def get_child_nodes(self, node_id, edge_type=None, child_name=None, child_type=None):
        """
        return the children of node (with a specific edge type, name, or node type)
        """
        if edge_type is None and child_name is None and child_type is None:
            return self.get_successors(node_id)
        res = set()
        edges = self.get_out_edges(node_id, edge_type=edge_type)
        for edge in edges:
            flag = True
            aim_node_attr = self.get_node_attr(edge[1])
            if child_type is not None and aim_node_attr.get('type') != child_type:
                flag = False
            if child_name is not None and aim_node_attr.get('name') != child_name:
                flag = False
            if flag:
                res.add(edge[1])
        return list(res)

    def get_name_from_child(self, nodeid, max_depth = None):
        """
        try to find the name of a nodeid
        we have to use bfs strategy
        """
        bfs_queue = []
        visited = set()
        bfs_queue.append((nodeid, 0))

        while(len(bfs_queue)):
            cur_node, cur_depth = bfs_queue.pop(0)
            if max_depth and cur_depth > max_depth: break

            # if visited before, stop here
            if cur_node in visited:
                continue
            else:
                visited.add(cur_node)

            cur_attr = self.get_node_attr(cur_node)

            if cur_attr['type'] == 'string':
                if cur_attr.get('name'):
                    return cur_attr['name']
                if cur_attr.get('code'):
                    return cur_attr['code']
            elif cur_attr['type'] == 'integer':
                return str(cur_attr['code'])

            out_edges = self.get_out_edges(cur_node, edge_type = 'PARENT_OF')
            out_nodes = [(edge[1], cur_depth + 1) for edge in out_edges]
            bfs_queue += out_nodes

        return None

    def find_nearest_upper_CPG_node(self, node_id):
        """
        Return the nearest upper CPG node of the input node.
        
        A CPG node is defined as a child of a block node
        (AST_STMT_LIST).
        """
        # follow the parent_of edge to research the stmt node
        while True:
            parent_edges = self.get_in_edges(node_id, edge_type = "PARENT_OF")
            if parent_edges is None or len(parent_edges) == 0:
                return None
            parent_node = parent_edges[0][0]
            parent_node_attr = self.get_node_attr(parent_node)
            if 'type' in parent_node_attr and parent_node_attr['type'] == "AST_STMT_LIST":
                return node_id 
            node_id = parent_node

    def handle_property(self, node_id):
        """deprecated"""
        return self.get_ordered_ast_child_nodes(node_id)

    def handle_method_call(self, node_id):
        """deprecated"""
        return self.get_ordered_ast_child_nodes(node_id)

    # Object graph

    # name nodes and object nodes

    def add_obj_node(self, ast_node=None, js_type='object', value=None):
        '''
        Add an object node (including literal).
        
        Args:
            ast_node (optional): The corresponding AST node.
                Defaults to None.
            js_type (str, optional): JavaScript type. Use None to avoid
                adding prototype (but type is still set to 'object').
                Defaults to 'object'.
            value (str, optional): Value of a literal, represented by
                JavaScript code. Defaults to None.
        
        Returns:
            Added object node's node id.
        '''
        obj_node = str(self._get_new_nodeid())
        self.add_node(obj_node)
        self.set_node_attr(obj_node, ('labels:label', 'Object'))
        self.set_node_attr(obj_node, ('type', js_type or 'object'))

        if ast_node is not None:
            self.add_edge(obj_node, ast_node, {"type:TYPE": "OBJ_TO_AST"})

        # Literals' constructors are immutable.
        # Even if you assigned another function to the constructors
        # (e.g. Object = function(){}), objects are still created with
        # original constructors (and prototypes).
        if js_type == "function":
            self.add_obj_as_prop(ast_node, "object", "prototype", 
                    parent_obj=obj_node)
            if self.function_prototype is not None:
                # prevent setting __proto__ before setup_object_and_function runs
                self.add_obj_as_prop(prop_name="__proto__", parent_obj=
                obj_node, tobe_added_obj=self.function_prototype)
        elif js_type == "object":
            if self.object_prototype is not None:
                # prevent setting __proto__ before setup_object_and_function runs
                self.add_obj_as_prop(prop_name="__proto__", parent_obj=
                obj_node, tobe_added_obj=self.object_prototype)
        elif js_type == "array":
            self.add_obj_as_prop(prop_name="__proto__", parent_obj=obj_node,
            tobe_added_obj=self.array_prototype)

        if value is not None:
            self.set_node_attr(obj_node, ('code', value))

        return obj_node

    def add_name_node(self, name, scope = None):
        """
        helper function
        add a namenode to scope
        """
        cur_scope = self.cur_scope
        if scope != None:
            cur_scope = scope 

        new_name_node = str(self._get_new_nodeid())
        self.add_edge(cur_scope, new_name_node, {"type:TYPE": "SCOPE_TO_VAR"})
        self.set_node_attr(new_name_node, ('labels:label', 'Name'))
        self.set_node_attr(new_name_node, ('name', name))
        return new_name_node

    def add_prop_name_node(self, name, parent_obj = None):
        """
        Add an empty name node (without a corresponding object) as a
        property of another object.

        obj -> name node

        For left side of an assignment (such that no dummy object node
        is created).
        """
        if parent_obj == None:
            assert self.cur_obj is not None
            parent_obj = self.cur_obj
        new_name_node = str(self._get_new_nodeid())
        self.add_node(new_name_node)
        self.set_node_attr(new_name_node, ('labels:label', 'Name'))
        self.set_node_attr(new_name_node, ('name', name))
        self.add_edge_if_not_exist(parent_obj, new_name_node,
            {"type:TYPE": "OBJ_TO_PROP"})
        return new_name_node

    def add_obj_as_prop(self, ast_node=None, js_type='object', prop_name=None,
        parent_obj=None, tobe_added_obj=None):
        """
        add (or put) an obj as a property of another obj
        parent_obj -> name node -> new obj / tobe_added_obj
        add edge from ast node to obj generation node
        """
        if parent_obj == None:
            assert self.cur_obj is not None
            parent_obj = self.cur_obj

        name_node = self.get_prop_name_node(prop_name, parent_obj)

        if name_node is None:
            name_node = self.add_prop_name_node(prop_name, parent_obj)

        if tobe_added_obj is None:
            tobe_added_obj = self.add_obj_node(ast_node, js_type)

        self.add_edge(name_node, tobe_added_obj, {"type:TYPE": "NAME_TO_OBJ"})

        return tobe_added_obj

    def add_obj_to_name(self, name, scope=None, ast_node=None,
        js_type='object', tobe_added_obj=None):
        name_node = self.add_name_node(name, scope)
        obj_node = self.add_obj_to_name_node(name_node, ast_node, js_type, tobe_added_obj)
        return obj_node

    def add_obj_to_name_node(self, name_node, ast_node=None, js_type='object',
        tobe_added_obj=None):
        """
        Add a new object (or put a existing object) under a name node.

        name node -> new obj / tobe_added_obj
        """
        if tobe_added_obj is None:
            tobe_added_obj = self.add_obj_node(ast_node, js_type)

        self.add_edge(name_node, tobe_added_obj, {"type:TYPE": "NAME_TO_OBJ"})

        return tobe_added_obj

    def get_name_node(self, var_name, scope = None, follow_scope_chain = True):
        """
        Get the name node of a name based on scope.
        """
        if scope == None:
            scope = self.cur_scope

        while(1):
            var_edges = self.get_out_edges(scope, data = True, keys = True, edge_type = "SCOPE_TO_VAR")
            for cur_edge in var_edges:
                cur_var_attr = self.get_node_attr(cur_edge[1])
                if cur_var_attr['name'] == var_name:
                    return cur_edge[1]
            if not follow_scope_chain:
                break
            scope_edges = self.get_in_edges(scope, data = True, keys = True, edge_type = "PARENT_SCOPE_OF")
            if len(scope_edges) == 0:
                break
            scope = list(scope_edges)[0][0]
        return None

    def get_objs_by_name_node(self, name_node, branches: List[BranchTag]=[]):
        '''
        Get corresponding object nodes of a name node.
        
        Args:
            name_node: the name node.
            branches (List[BranchTag], optional): branch information.
                Default to [].
        
        Returns:
            list: list of object nodes.
        '''
        out_edges = self.get_out_edges(name_node, edge_type='NAME_TO_OBJ')
        objs = set([edge[1] for edge in out_edges])
        if branches:
            # initiate a dictionary that records if the object exists in the current branch
            has_obj = {}
            for obj in objs:
                has_obj[obj] = False
            # check edges without branch tag
            for _, obj, _, attr in self.get_out_edges(name_node, edge_type='NAME_TO_OBJ'):
                tag = attr.get('branch')
                if tag == None:
                    has_obj[obj] = True
            # for each branch in branch history
            # we check from the oldest (shallowest) to the most recent (deepest)
            for branch in branches:
                # check which edge matches the current checking branch
                for _, obj, _, attr in self.get_out_edges(name_node, edge_type='NAME_TO_OBJ'):
                    tag = attr.get('branch')
                    if tag and tag.stmt == branch.stmt and tag.branch == branch.branch:
                        if tag.op == 'A': # if the object is added (assigned) in that branch
                            has_obj[obj] = True
                        elif tag.op == 'D': # if the object is removed in that branch
                            has_obj[obj] = False
            return list(filter(lambda x: has_obj[x], objs))
        else:
            return list(objs)

    get_obj_nodes = get_objs_by_name_node

    def get_objs_by_name(self, var_name, scope=None, branches=[]):
        '''
        Get object nodes by a variable name.
        
        Args:
            var_name (str): variable name.
            scope (optional): scope to find the variable in. Defaults to
                current scope.
            branches (list, optional): branch information.
        
        Returns:
            list: list of object nodes.
        '''
        # if var_name == 'this':    # "this" will be handled in handle_node
        #     return [self.cur_obj]
        name_node = self.get_name_node(var_name, scope)
        if name_node == None:
            return []
        return self.get_objs_by_name_node(name_node, branches)

    def get_prop_names(self, parent_obj=None):
        if parent_obj is None:
            assert self.cur_obj is not None
            parent_obj = self.cur_obj
        s = set()
        for name_node in self.get_prop_name_nodes(parent_obj):
            name = self.get_node_attr(name_node).get('name')
            if name is not None:
                s.add(name)
        return list(s)

    get_keys = get_prop_names

    def get_prop_name_nodes(self, parent_obj=None):
        return self.get_child_nodes(parent_obj, edge_type='OBJ_TO_PROP')

    def get_prop_name_node(self, prop_name, parent_obj=None):
        for name_node in self.get_prop_name_nodes(parent_obj):
            if self.get_node_attr(name_node).get('name') == prop_name:
                return name_node
        return None

    def get_prop_obj_nodes(self, parent_obj=None, prop_name=None, branches: List[BranchTag]=[], exclude_proto=True):
        '''
        Get object nodes of an object's property.
        
        Args:
            parent_obj (optional): Defaults to None (current object).
            prop_name (str, optional): Property name. Defaults to None,
                which means get all properties' object nodes.
            branches (List[BranchTag], optional): branch information.
                Defaults to [].
            exclude_proto (bool, optional): Whether exclude prototype
                and __proto__ when getting all properties.
                Defaults to True.
        
        Returns:
            list: object nodes.
        '''
        if parent_obj is None:
            assert self.cur_obj is not None
            parent_obj = self.cur_obj
        s = set()
        if prop_name is None: # this caused inconsistent run results
            name_nodes = self.get_prop_name_nodes(parent_obj)
            if exclude_proto:
                name_nodes = filter(
                    lambda x: self.get_node_attr(x).get('name') not in
                        ['prototype', '__proto__'],
                    name_nodes)
            for name_node in name_nodes:
                s.update(self.get_obj_nodes(name_node, branches))
        else:
            name_node = self.get_prop_name_node(prop_name, parent_obj)
            s.update(self.get_obj_nodes(name_node), branches)
        return list(s)

    def assign_obj_nodes_to_name_node(self, name_node, obj_nodes, multi=False,
        branches: List[BranchTag] = []):
        '''
        Assign (multiple) object nodes to a name node.
        
        Args:
            name_node: where to put the objects.
            obj_nodes: objects to be assigned.
            multi (bool, optional):
                True: do NOT delete edges.
                False: delete existing edges.
                Defaults to False.
            branches (List[BranchTag], optional):
                List of branch tags. Defaults to [].
        '''
        branch = branches[-1] if branches else None
        # remove previous objects
        pre_objs = self.get_objs_by_name_node(name_node, branches)
        print(f'Assigning {obj_nodes} to {name_node}, pre_objs={pre_objs}, ' \
            f'branches={branches}')
        if pre_objs and not multi:
            for obj in pre_objs:
                if branch:
                    # check if any addition (assignment) exists
                    # in current branch
                    flag = False
                    for key, edge_attr in self.get_edges_between(name_node, obj,
                        'NAME_TO_OBJ').items():
                        tag = edge_attr.get('branch', BranchTag())
                        if tag == BranchTag(branch, op='A'):
                            # if addition exists, delete the addition edge
                            self.graph.remove_edge(name_node, obj, key)
                            flag = True
                    if not flag:
                        # if no addition, add a deletion edge
                        self.add_edge(name_node, obj,{'type:TYPE':
                        'NAME_TO_OBJ', 'branch': BranchTag(branch, op='D')})
                else:
                    # do not use "remove_edge", which cannot remove all edges
                    self.remove_all_edges_between(name_node, obj)
                    print('  Remove ' + obj)
        # add new objects to name node
        for obj in obj_nodes:
            if branch:
                self.add_edge(name_node, obj, {"type:TYPE": "NAME_TO_OBJ",
                "branch": BranchTag(branch, op='A')})
            else:
                self.add_edge(name_node, obj, {"type:TYPE": "NAME_TO_OBJ"})

    def get_obj_def_ast_node(self, obj_node):
        """
        Find where in the AST an object (especially a function) is
        defined.
        
        The AST node is the successor of the object node via the
        OBJ_TO_AST edge.
        """
        tmp_edge = self.get_out_edges(obj_node, data = True, keys = True,
            edge_type = "OBJ_TO_AST")
        if not tmp_edge:
            return None
        else:
            return tmp_edge[0][1]

    # scopes

    def add_scope(self, scope_type, ast_node, scope_name=None):
        """
        Add a new scope under current scope.

        If the scope already exists, return it without adding a new one.
        """
        cur_scope = self.cur_scope
        if scope_name and scope_type == 'FUNCTION_SCOPE':
            existing_scope = self.get_scope_by_ast_node(ast_node)
            if existing_scope != None:
                return existing_scope
        new_scope_node = str(self._get_new_nodeid())
        self.add_node(new_scope_node, {'labels:label': 'Scope',
            'type': scope_type, 'name': scope_name})
        if ast_node is not None:
            self.add_edge(new_scope_node, ast_node,
                {'type:TYPE': 'SCOPE_TO_AST'})
        if cur_scope != None:
            self.add_edge(cur_scope, new_scope_node,
                {'type:TYPE': 'PARENT_SCOPE_OF'})
        else:
            self.cur_scope = new_scope_node
        return new_scope_node

    def add_obj_to_scope(self, ast_node=None, name=None, js_type='object',
        scope=None, tobe_added_obj=None):
        """
        add a obj to a scope, if scope is None, add to current scope
        return the added node id
        """
        if scope == None:
            scope = self.cur_scope 

        # check if the name node exists first
        name_node = self.get_name_node(name, scope=scope, follow_scope_chain=False)
        if name_node == None:
            print(f'name node for {name} does not exist')
            name_node = str(self._get_new_nodeid())
            self.add_edge(scope, name_node, {"type:TYPE": "SCOPE_TO_VAR"})
            self.set_node_attr(name_node, ('labels:label', 'Name'))
            self.set_node_attr(name_node, ('name', name))

        if tobe_added_obj == None:
            # here we do not add obj to current obj when add to scope
            # we just add a obj to scope
            tobe_added_obj = self.add_obj_node(ast_node, js_type)

        self.add_edge(name_node, tobe_added_obj, {"type:TYPE": "NAME_TO_OBJ"})
        return tobe_added_obj

    def scope_exists_by_ast_node(self, ast_node_id, parent_scope = None, max_depth = 1):
        if parent_scope == None:
            parent_scope = self.BASE_SCOPE
        if max_depth == None:
            max_depth = sys.maxsize
        for depth in range(max_depth):
            children = self.get_child_nodes(parent_scope, 'PARENT_SCOPE_OF')
            if not children:
                return False
            else:
                for child in self.get_child_nodes(parent_scope, 'PARENT_SCOPE_OF'):
                    out_edges = self.get_out_edges(child, data = True, keys = True, edge_type = 'SCOPE_TO_AST')
                    for edge in out_edges:
                        if edge[1] == ast_node_id:
                            return True
        return False

    def get_scope_by_ast_node(self, ast_node):
        """
        Get a scope by its corresponding AST node.
        """
        return self.get_in_edges(ast_node, data = True, keys = True, edge_type = "SCOPE_TO_AST")[0][0]

    def find_func_scope_from_cur_scope(self, cur_scope=None):
        '''
        Find function scope from the current (block) scope.
        '''
        if cur_scope is None:
            cur_scope = self.cur_scope
        while True:
            if self.get_node_attr(cur_scope).get('type') == 'FUNCTION_SCOPE':
                return cur_scope
            edges = self.get_in_edges(cur_scope, edge_type='PARENT_SCOPE_OF')
            if edges:
                cur_scope = edges[0][0]
            else:
                return None

    # functions and calls

    def get_func_decl_objs_by_ast_node(self, ast_node):
        objs = []
        edges = self.get_in_edges(ast_node, edge_type='OBJ_TO_AST')
        for edge in edges:
            # avoid function run objects
            if self.get_node_attr(edge[0]).get('type') == 'function':
                objs.append(edge[0])
        return objs

    def get_func_scope_by_obj_node(self, obj_node):
        if obj_node == None:
            return None
        scope_edge = self.get_out_edges(obj_node, edge_type = "OBJ_TO_SCOPE")[0]
        return scope_edge[1]

    def add_blank_func_to_scope(self, func_name, scope=None, python_func:Callable=None):
        '''
        Add a blank function with object graph nodes to a scope.
        
        Args:
            func_name (str): function's name.
            scope (optional): where to add the function. Defaults to
                None, referring to the current scope.
            python_func (optional): a special Python function in lieu of
                the blank JS AST function. Defaults to None.
        '''
        func_obj = self.add_blank_func_with_og_nodes(func_name)
        self.add_obj_to_name(func_name, scope, tobe_added_obj=func_obj)
        if python_func is not None:
            self.set_node_attr(func_obj, ('pythonfunc', python_func))
        return func_obj

    def add_blank_func_as_prop(self, func_name, parent_obj=None, python_func:Callable=None):
        '''
        Add a blank function with object graph nodes as a property of
        another object.
        
        Args:
            func_name (str): function's name.
            parent_obj (optional): function's parent object. Defaults to
                None, referring to the current object.
            python_func (optional): a special Python function in lieu of
                the blank JS AST function. Defaults to None.
        '''
        func_obj = self.add_blank_func_with_og_nodes(func_name)
        self.add_obj_as_prop(None, None, func_name, parent_obj, func_obj)
        if python_func is not None:
            self.set_node_attr(func_obj, ('pythonfunc', python_func))
        return func_obj

    def convert_obj_node_type_to_function(self, obj, func_ast=None):
        '''
        Convert an object node of any type to function.
        Function's prototype will also be added.

        Args:
            obj: The object node.
            func_ast (optional): Function's AST node. Default to None.
        '''
        assert obj != self.undefined_obj
        assert obj != self.null_obj
        self.set_node_attr(obj, ('type', 'function'))
        self.add_obj_as_prop(func_ast, "object", "prototype", 
                parent_obj=obj)
        if self.function_prototype is not None:
            # prevent setting __proto__ before setup_object_and_function runs
            self.add_obj_as_prop(prop_name="__proto__", parent_obj=obj,
            tobe_added_obj=self.function_prototype)
        if func_ast is not None:
            self.add_edge(obj, func_ast, {"type:TYPE": "OBJ_TO_AST"})

    def add_blank_func_with_og_nodes(self, func_name, func_obj=None):
        '''
        Add a blank function with object graph nodes (name node, function
        scope, and function declaration object node).
        
        Args:
            func_name (str): Function's name.
            func_obj (optional): Function's object node if known. Use it
                when you want to overwrite an existing object node.
                Default to None.
        '''
        ast_node = self.add_blank_func(func_name)
        func_scope = self.add_scope("FUNCTION_SCOPE", ast_node)
        if func_obj is None:
            func_obj = self.add_obj_node(ast_node, "function")
        else:
            self.convert_obj_node_type_to_function(func_obj, ast_node)
        self.add_edge(func_obj, func_scope, {"type:TYPE": "OBJ_TO_SCOPE"})
        return func_obj

    def add_blank_func(self, func_name):
        """
        add a blank func
        used for built-in functions
        we need to run the function after the define
        """
        print(sty.ef.inverse + sty.fg(179) + "add_blank_func" + sty.rs.all + " func_name: {}".format(func_name))

        # add a function decl node first
        func_ast = self._get_new_nodeid()
        self.add_node(func_ast)
        # self.set_node_attr(func_ast, ('funcid', func_ast))
        self.set_node_attr(func_ast, ('type', "AST_CLOSURE"))
        self.set_node_attr(func_ast, ('labels:label', 'Artificial_AST'))

        # add a node as the name of the function
        namenode_id = self._get_new_nodeid()
        self.add_node(namenode_id)
        self.set_node_attr(namenode_id, ('type', 'string'))
        self.set_node_attr(namenode_id, ('name', func_name))
        self.set_node_attr(namenode_id, ('labels:label', 'Artificial_AST'))
        self.set_node_attr(namenode_id, ('childnum:int', 0))

        entry_id = self._get_new_nodeid()
        self.add_node(entry_id)
        self.set_node_attr(entry_id, ('funcid', func_ast))
        self.set_node_attr(entry_id, ('type', 'CFG_FUNC_ENTRY'))
        self.set_node_attr(entry_id, ('labels:label', 'Artificial'))

        exit_id = self._get_new_nodeid()
        self.add_node(exit_id)
        self.set_node_attr(exit_id, ('funcid', func_ast))
        self.set_node_attr(exit_id, ('type', 'CFG_FUNC_EXIT'))
        self.set_node_attr(exit_id, ('labels:label', 'Artificial'))

        params_id = self._get_new_nodeid()
        self.add_node(params_id)
        self.set_node_attr(params_id, ('funcid', func_ast))
        self.set_node_attr(params_id, ('type', 'AST_PARAM_LIST'))
        self.set_node_attr(params_id, ('labels:label', 'Artificial_AST'))
        self.set_node_attr(params_id, ('childnum:int', 1))

        # add edges
        self.add_edge(func_ast, entry_id, {'type:TYPE': "ENTRY"})
        self.add_edge(func_ast, exit_id, {'type:TYPE': "EXIT"})
        self.add_edge(func_ast, namenode_id, {'type:TYPE': "PARENT_OF"})
        self.add_edge(func_ast, params_id, {'type:TYPE': "PARENT_OF"})
        self.add_edge(entry_id, exit_id, {'type:TYPE': "FLOWS_TO"})

        # we need to run the function 
        return func_ast

    def find_name_of_call(self, node_id):
        """
        input a ast call node, return the function name
        """
        edges = self.get_out_edges(node_id, edge_type = "PARENT_OF")
        for edge in edges:
            cur_attr = self.get_node_attr(edge[1])
            if cur_attr['type'] == 'AST_NAME':
                return self.get_name_from_child(edge[1])

    def get_self_invoke_node_by_caller(self, caller_id):
        """
        get the closure of self invoke function by the caller id
        
        Args:
            caller_id: the node id of the caller
        """
        return self._get_childern_by_childnum(caller_id)['0']


    # prototype

    def _get_upper_level_prototype(self, obj_node):
        """
        get the upper level of prototype
        used for a helper function to link __proto__ and prototype

        Args:
            obj_node: the child obj node
            relation: obj_node -OBJ_DECL-> AST_FUNC_DECL -OBJ_TO_AST-> 
            FUNC_DECL -OBJ_TO_PROP-> prototype -NAME_TO_OBJ-> PROTOTYPE
        """
        ast_upper_func_node = self.get_child_nodes(obj_node, 
                edge_type = "OBJ_DECL")[0]
        edges = self.get_in_edges(ast_upper_func_node,
                edge_type = "OBJ_TO_AST")
        for edge in edges:
            if self.get_node_attr(edge[0])['type'] == "function":
                func_decl_obj_node = edge[0]
                break
        prototype_obj_nodes = self.get_prop_obj_nodes(
            parent_obj=func_decl_obj_node, prop_name='prototype')
        print(f'prototype obj node is {prototype_obj_nodes}')
        return prototype_obj_nodes
    
    def build_proto(self, obj_node):
        """
        build the proto strcture of a object node

        Args:
            obj_node: the obj node need to be build
        """
        upper_level_prototype_objs = self._get_upper_level_prototype(obj_node)
        for obj in upper_level_prototype_objs:
            self.add_obj_as_prop(None, None, '__proto__', parent_obj=obj_node,
                                 tobe_added_obj=obj)

    # Misc

    def setup1(self):
        """
        the init function of setup a run
        """
        # init cur_id here!!
        self.cur_id = self.graph.number_of_nodes()

        # base scope is not related to any file
        self.BASE_SCOPE = self.add_scope("BASE_SCOPE", None)

        # what is base object?
        cur_nodeid = str(self._get_new_nodeid())
        self.add_node(cur_nodeid)
        self.set_node_attr(cur_nodeid, ('type', 'object'))
        self.set_node_attr(cur_nodeid, ('labels:label', 'Object'))
        self.set_node_attr(cur_nodeid, ('name', 'BASE_OBJ'))
        self.add_edge(cur_nodeid, self.BASE_SCOPE, {"type:TYPE": "OBJ_TO_SCOPE"})
        # self.cur_obj = cur_nodeid    # this is incorrect

        # reserved values
        self.function_prototype = None
        self.object_prototype = None
        self.array_prototype = None
        self.number_prototype = None
        self.boolean_prototype = None

        # setup JavaScript built-in values
        self.null_obj = self.add_obj_node(None, 'object', value='null')

    def setup2(self):
        # setup JavaScript built-in values
        self.undefined_obj = self.add_obj_node(None, 'undefined',
                                                value='undefined')
        self.add_obj_to_name('undefined', scope=self.BASE_SCOPE,
                             tobe_added_obj=self.undefined_obj)
        self.infinity_obj = self.add_obj_node(None, 'number', 'Infinity')
        self.add_obj_to_name('Infinity', scope=self.BASE_SCOPE,
                             tobe_added_obj=self.infinity_obj)
        self.negative_infinity_obj = self.add_obj_node(None, 'number',
                                                       '-Infinity')
        self.nan_obj = self.add_obj_node(None, 'number', 'NaN')
        self.add_obj_to_name('NaN', scope=self.BASE_SCOPE,
                             tobe_added_obj=self.nan_obj)
        self.true_obj = self.add_obj_node(None, 'boolean', 'true')
        self.add_obj_to_name('true', scope=self.BASE_SCOPE,
                             tobe_added_obj=self.true_obj)
        self.false_obj = self.add_obj_node(None, 'boolean', 'false')
        self.add_obj_to_name('false', scope=self.BASE_SCOPE,
                             tobe_added_obj=self.false_obj)
        print('Internal objects')
        print(f'undefined_obj: {self.undefined_obj}, infinity_obj: {self.infinity_obj}, '
        f'negative_infinity_obj: {self.negative_infinity_obj}, nan_obj:{self.nan_obj}, '
        f'true_obj: {self.true_obj}, false_obj: {self.false_obj}')

    # Analysis

    def _dfs_upper_by_edge_type(self, node_id, edge_types):
        """
        dfs a specific type of edge upper from a node id
        """
        upper_edges = []
        for t in edge_types:
            upper_edges.extend(self.get_in_edges(node_id, edge_type=t))
        parent_nodes = set([edge[0] for edge in upper_edges])
        ret = []

        # TODO: REMOVE! specific to july demo
        # node_attr = self.get_node_attr(node_id)
        # if 'lineno:int' in node_attr and node_attr['lineno:int'] == '17':
        #     parent_nodes.append(self.event_node)

        for parent_node in parent_nodes:
            cur_all_upper_pathes = self._dfs_upper_by_edge_type(parent_node, 
                    edge_types)
            if len(cur_all_upper_pathes) == 0:
                ret.append([parent_node])
            for cur_path in cur_all_upper_pathes:
                ret.append([parent_node] + cur_path)
        return ret

    def get_node_file_path(self, node_id):
        # it's a ast so a node only has one parent
        while True:
            node_attr = self.get_node_attr(node_id)
            if node_attr['type'] == "AST_TOPLEVEL":
                return node_attr['name']
            node_id = self.get_in_edges(node_id, 
                    edge_type = "PARENT_OF")[0][0]

    def get_node_file_content(self, node_id):
        """
        find the file of a node
        return the dict with numbers and contents
        """
        file_name = self.get_node_file_path(node_id)
        if file_name not in self.file_contents:
            content_dict = ['']
            with open(file_name, 'r') as fp:
                for file_line in fp:
                    content_dict.append(file_line)
            self.file_contents[file_name] = content_dict.copy()
        return self.file_contents[file_name]

    def traceback(self, export_type):
        res_path = ""
        if export_type == 'os-command':
            expoit_func_list = [
                    'exec'
                    ]
            func_run_obj_nodes = self.get_node_by_attr('type', 'FUNC_RUN_OBJ')
            pathes = {}
            for func_run_obj_node in func_run_obj_nodes:
                # we assume only one obj_decl edge
                func_ast_node = list(self.get_child_nodes(func_run_obj_node, 
                        edge_type = 'OBJ_DECL'))[0]
                func_name = self.get_name_from_child(func_ast_node)
                if func_name in expoit_func_list:
                    caller = list(self.get_child_nodes(func_run_obj_node, 
                        edge_type = 'OBJ_TO_AST'))[0]
                    pathes = self._dfs_upper_by_edge_type(caller, [
                        "OBJ_REACHES", "CONTRIBUTES_TO"
                    ])
                    print('Paths:')

                    # give the end node one more chance, find the parent obj of the ending point
                    for path in pathes:
                        last_node = path[-1]
                        upper_nodes = self._dfs_upper_by_edge_type(last_node, 
                                ["OBJ_TO_PROP"])

                    for path in pathes:
                        cur_path_str1 = ""
                        cur_path_str2 = ""
                        path.reverse()
                        path.append(caller)
                        for node in path:
                            cur_node_attr = self.get_node_attr(node)
                            cur_path_str1 += cur_node_attr['lineno:int'] + '->'
                            start_lineno = int(cur_node_attr['lineno:int'])
                            end_lineno = int(cur_node_attr['endlineno:int'])
                            content = self.get_node_file_content(node)
                            cur_path_str2 += "{}\t{}".format(start_lineno,
                                    ''.join(content[start_lineno:end_lineno + 1]))
                        cur_path_str1 += self.get_node_attr(caller)['lineno:int']
                        print(cur_path_str1)

                        res_path += "==========================\n"
                        res_path += cur_path_str2
        return pathes, res_path
