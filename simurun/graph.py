import networkx as nx

class Graph:

    def __init__(self):
        self.graph = nx.MultiDiGraph()
        self.cur_obj = None 
        self.cur_scope = None

    def add_scope(self, scope_name, define_id):
        """
        add a new scope under current scope
        """
        cur_scope = self.cur_scope
        cur_nodeid = str(self.graph.number_of_nodes())
        self.add_node(cur_nodeid)
        self.set_node_attr(cur_nodeid, ('type', 'SCOPE'))
        self.set_node_attr(cur_nodeid, ('label:label', 'SCOPE'))
        self.set_node_attr(cur_nodeid, ('name', scope_name))
        self.add_edge(cur_nodeid, define_id, {'type:TYPE': 'SCOPE_AST'})
        if cur_scope != None:
            self.add_edge(cur_scope, cur_nodeid, {'type:TYPE': 'SCOPE_PARENT'})
        else:
            self.cur_scope = cur_nodeid

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

    def export_to_CSV(self, nodes_file_name, rels_file_name):
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
            fp.write('\t'.join(cur_line) + '\n')
        fp.close()

        headers = ['start:START_ID','end:END_ID','type:TYPE','var','taint_src','taint_dst']
        skip_headers = ['start:START_ID', 'end:END_ID']
        fp = open(rels_file_name, 'w')
        header_str = '\t'.join(headers)
        fp.write(header_str + '\n')
        edges = list(self.graph.edges(data = True))
        for edge in edges:
            cur_line = [edge[0], edge[1]]
            for header in headers:
                if header in skip_headers:
                    continue
                if header in edge[2]:
                    cur_line.append(edge[2][header])
                else:
                    cur_line.append('')
            
            fp.write('\t'.join(cur_line) + '\n')
        fp.close()
        print ("Finished Exporting to {} and {}".format(nodes_file_name, rels_file_name))

    def add_node(self, node_for_adding):
        self.graph.add_node(node_for_adding)

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

    def get_out_edges(self, node_id, data = False, keys = False, edge_type = None):
        if edge_type == None:
            return self.graph.out_edges(node_id, data = data, keys = keys)
        edges = self.graph.out_edges(node_id, data = data, keys = keys)
        idx = 1
        if keys == True:
            idx += 1
        if data == True:
            idx += 1
        return [edge for edge in edges if 'type:TYPE' in edge[idx] and edge[idx]['type:TYPE'] == edge_type]

    def get_in_edges(self, node_id, data = False, keys = False, edge_type = None):
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
    
    def dfs_with_callbacks(self, edge_type, node_callback, edge_callback):
        """
        dfs the graph by of a specific edge type. 
        Once find a edge or node, call the callback functions 
        """
        subG = self.get_sub_graph_by_edge_type(edge_type)
        
    def get_nodes_by_type(self, node_type):
        """
        return a list of nodes with a specific node type
        """
        return [node for node in self.graph.nodes(data = True) if node[1]['type'] == node_type]

    def get_cur_scope(self):
        return self.cur_scope
