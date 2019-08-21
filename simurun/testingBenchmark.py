import unittest
from objectGraphGenerator import *

def run_unittest(file_path):
    """
    load from the testing JS file

    Args:
        file_path: the path to the file

    Return: 
        G: the graph 
    """
    testing_run(file_path)

class TestStringMethods(unittest.TestCase):

    def test_vul_demo(self):
        G = run_unittest("./vul_demo.js")
        print(G)

    def test_split(self):
        s = 'hello world'
        self.assertEqual(s.split(), ['hello', 'world'])
        # check that s.split fails when the separator is not a string
        with self.assertRaises(TypeError):
            s.split(2)

if __name__ == '__main__':
    suite = unittest.TestLoader().loadTestsFromTestCase(TestStringMethods)
    unittest.TextTestRunner(verbosity=2).run(suite)
