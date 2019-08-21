import unittest
import sys
sys.path.append("../simurun/")
from objectGraphGenerator import *
from networkx import *

def run_unittest(file_path, standard_graph):
    """
    load from the testing JS file

    Args:
        file_path: the path to the file

    Return: 
        G: the graph 
    """
    G = unittest_main(file_path)
    print(G.graph)
    G.export_to_xml("vul_demo_graph.xml")
    diff = difference(G.graph, G.graph)
    # if diff is empty, the two graphs same to each other
    if not is_empty(diff):
        # if not, check if these two graphs are isomorphic
        diff = is_isomorphic(G.graph, G.graph)
        self.assertTrue(diff)

class TestStringMethods(unittest.TestCase):

    def test_vul_demo(self):
        run_unittest("../test/vul_demo.js", "./vul_demo_graph.json")

if __name__ == '__main__':
    suite = unittest.TestLoader().loadTestsFromTestCase(TestStringMethods)
    unittest.TextTestRunner(verbosity=2).run(suite)
