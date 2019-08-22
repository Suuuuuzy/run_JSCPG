from graph import Graph
from modeledJSBuiltins import setup_js_builtins

def setup(G: Graph):
    G.setup1()
    setup_js_builtins(G)
    G.setup2()