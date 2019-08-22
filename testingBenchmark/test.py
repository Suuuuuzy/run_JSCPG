import unittest
import sys
import networkx as nx
import json
sys.path.append("../simurun/")
from objectGraphGenerator import *
from networkx import *

def run_unittest(file_path, standard_graph_path):
    """
    load from the testing JS file

    Args:
        file_path: the path to the file

    Return: 
        G: the graph 
    """
    G = unittest_main(file_path)
    # G.export_graph("vul_demo_graph.pickle")

    standard_dict_graph = nx.readwrite.read_gpickle(standard_graph_path)
    standard_graph = nx.Graph(standard_dict_graph)

    diff = difference(G.graph, standard_dict_graph)
    # if diff is empty, the two graphs same to each other
    res = is_empty(diff)
    if not res:
        # if not, check if these two graphs are isomorphic
        print(diff)
        res = is_isomorphic(G.graph, standard_dict_graph)
    return res 

class TestStringMethods(unittest.TestCase):

    def test_vul_demo(self):
        run_unittest("./tests/vul_demo.js", "./vul_demo_graph.pickle")

if __name__ == '__main__':
    suite = unittest.TestLoader().loadTestsFromTestCase(TestStringMethods)
    unittest.TextTestRunner(verbosity=2).run(suite)
