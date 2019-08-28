import unittest
import sys
import networkx as nx
import json
sys.path.append("..")
from simurun.launcher import *
from simurun.logger import *

testing_logger = create_logger("testing", output_type="console")

def graph_diff(g1, g2):
    """
    input two graphs, compare a list of features and return the difference
    
    Args:
        g1: graph 1
        g2: graph 2
    Return:
        the different edges and nodes
    """
    res = ""
    g1_nodes_data = list(g1.nodes.data())
    g2_nodes_data = list(g2.nodes.data())
    if len(g1_nodes_data) != len(g2_nodes_data):
        res += "\nNodes number diff: G1 has {} nodes and G2 has {} nodes".format(len(g1_nodes_data), len(g2_nodes_data))
    else:
        for i in range(len(g1_nodes_data)):
            if str(g1_nodes_data[i]) != str(g2_nodes_data[i]):
                res += "\nNode detail diff: \n\t{}\n\t{}".format(g1_nodes_data[i], g2_nodes_data[i])

    g1_edges_data = list(g1.edges.data())
    g2_edges_data = list(g2.edges.data())

    # sort the edges before compare
    # we assume the order of first key is already satisfied
    # sort by the second key of the edges
    g1_edges_data.sort(key = lambda val: val[1])
    g2_edges_data.sort(key = lambda val: val[1])

    if len(g1_edges_data) != len(g2_edges_data):
        res += "\nEdges number diff: G1 has {} edges and G2 has {} edges".format(len(g1_edges_data), len(g2_edges_data))
    else:
        for i in range(len(g1_edges_data)):
            if str(g1_edges_data[i]) != str(g2_edges_data[i]):
                res += "\nEdge detail diff: \n\t{}\n\t{}".format(g1_edges_data[i], g2_edges_data[i])

    return res

def node_match_equal(n1, n2):
    """
    this is a node match function, return true if n1 == n2
    """
    key = 'labels:label'
    return n1[key] == n2[key]

def edge_match_equal(e1, e2):
    e1_vals = set([str(v) for v in e1.values()])
    e2_vals = set([str(v) for v in e2.values()])
    return e1_vals == e2_vals

def run_unittest(file_path, standard_graph_path):
    """
    load from the testing JS file

    Args:
        file_path: the path to the file

    Return: 
        G: the graph 
    """
    G = unittest_main(file_path)

    standard_dict_graph = nx.readwrite.read_gpickle(standard_graph_path)
    standard_graph = nx.Graph(standard_dict_graph)

    """
    diff = nx.difference(G.graph, standard_dict_graph)
    # if diff is empty, the two graphs same to each other
    res = nx.is_empty(diff)

    """
    # self defined compare
    diff = graph_diff(G.graph, standard_dict_graph)
    res = len(diff) == 0

    if not res:
        # if not, check if these two graphs are isomorphic
        testing_logger.info("\nGRAPH DIFF: \n\t{}\n".format(diff))
        # checking isomorphic will take a very long time
        # for now, disable this function
        # res = nx.is_isomorphic(G.graph, standard_dict_graph, node_match = node_match_equal, edge_match=edge_match_equal)

    return res 

def add_unittest(test_name, file_path):
    """
    generate a standard graph under ./stardards folder named {test_name}
    based on the file path

    Args:
        test_name: the name of the generated pickle
        file_path: the JS file path
    """
    G = unittest_main(file_path)
    G.export_graph("./stardards/{}.pickle".format(test_name))

class TestObjectGraphGeneration(unittest.TestCase):

    def test_vul_demo(self):
        res = run_unittest("./tests/vul_demo.js", "./stardards/vul_demo.pickle")
        self.assertTrue(res)

    def test_growl(self):
        res = run_unittest("./tests/growl.js", "./stardards/growl.pickle")
        self.assertTrue(res)

    def test_grammer(self):
        res = run_unittest("./tests/grammer.js", "./stardards/grammer.pickle")
        self.assertTrue(res)

    def test_for(self):
        res = run_unittest("./tests/forTest.js", "./stardards/for.pickle")
        self.assertTrue(res)

if __name__ == '__main__':
    # add_unittest("growl", "./tests/growl.js")
    # add_unittest("vul_demo", "./tests/vul_demo.js")
    # add_unittest("grammer", "./tests/grammer.js")
    # add_unittest("for", "./tests/forTest.js")
    suite = unittest.TestLoader().loadTestsFromTestCase(TestObjectGraphGeneration)
    unittest.TextTestRunner(verbosity=2).run(suite)
