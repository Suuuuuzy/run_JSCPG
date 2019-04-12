from py2neo import Graph

class JSDatabase():

    def __init__(self, password):
        self.graph = Graph(password = password)

    def run_query(self, query_str):
        """
        run a cypher query command and return the result
        """
        results = self.graph.run(query_str)
        nodes = []
        for node in results:
            nodes.append(node)
        return nodes
