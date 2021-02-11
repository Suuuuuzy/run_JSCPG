from src.core.opgen import OPGen
from src.core.graph import Graph
from src.core.options import parse_args, setup_graph_env

if __name__ == '__main__':
    args = parse_args()
    opg = OPGen(args)
    opg.run(args)
    #print(G.op_cnt)

