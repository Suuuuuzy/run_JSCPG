import argparse
import sys
import sty
from .graph import Graph
from .logger import *
from .objectGraphGenerator import register_func, handle_node, \
    add_edges_between_funcs, analyze_files, analyze_string, generate_obj_graph
from .trace_rule import TraceRule
from .vulChecking import *

def unittest_main(file_path, check_signatures=[]):
    """
    main function for uniitest 
    """
    G = Graph()
    result = analyze_files(G, file_path, check_signatures=check_signatures)
    if result == False:
        return None 
    return G

def main():
    parser = argparse.ArgumentParser(description=
        'The object graph generator for JavaScript.')
    parser.add_argument('-p', '--print', action='store_true',
                        help='Print logs to console.')
    parser.add_argument('input_file', action='store', nargs='?',
        help="Source code file (or directory) to generate object graph for. "
        "Use '-' to get source code from stdin. Ignore this argument to "
        "analyze ./nodes.csv and ./rels.csv.")
    args = parser.parse_args()
    
    logger = create_logger("main_logger", output_type="file")
    G = Graph()

    if args.print:
        logger = create_logger("main_logger", output_type="console",
            level=logging.DEBUG)
        logger = create_logger("graph_logger", output_type="console",
            level=logging.DEBUG)
    if args.input_file:
        if args.input_file == '-':
            # analyze from stdin
            source = sys.stdin.read()
            analyze_string(G, source, toplevel=True)
        else:
            # analyze from JS source code files
            analyze_files(G, args.input_file)
    else:
        # analyze from CSVs
        G.import_from_CSV("./nodes.csv", "./rels.csv")
        generate_obj_graph(G, '1')
    # G.export_to_CSV("./testnodes.csv", "./testrels.csv", light = True)
    G.export_to_CSV("./testnodes.csv", "./testrels.csv", light = False)
    res_path = traceback(G, "os_command")
    logger.debug('ResPath0:')
    logger.debug(res_path[0])
    logger.debug('ResPath1:')
    logger.debug(res_path[1])

    res_pathes = vul_checking(G, res_path[0], 'os_command')
    print(res_pathes)
    return res_path

if __name__ == "__main__":
    main()
