import argparse
import sys
import sty
from .graph import Graph
from .logger import *
from .objectGraphGenerator import register_func, handle_node, \
    add_edges_between_funcs, analyze_files, analyze_string, generate_obj_graph
from .trace_rule import TraceRule
from .vulChecking import *
from datetime import datetime
import time

def unittest_main(file_path, check_signatures=[]):
    """
    main function for uniitest 
    """
    parser = argparse.ArgumentParser()
    parser.add_argument('-p', '--print', action='store_true')
    parser.add_argument('-c', nargs=2)
    args = parser.parse_args()
    if args.print:
        create_logger("main_logger", output_type="console")
        create_logger("graph_logger", output_type="console")
        create_logger("npmtest", output_type="console")

    G = Graph()
    result = analyze_files(G, file_path, check_signatures=check_signatures)
    if result == False:
        return None 
    return G

def main():
    parser = argparse.ArgumentParser(description=
        'The object graph generator for JavaScript.')
    parser.add_argument('-p', '--print', action='store_true',
                        help='Print logs to console, instead of file.')
    parser.add_argument('-a', '--dont-run-all', action='store_true',
                        help="Don't run all exported functions. "
                        "All functions in module.exports are run by default.")
    parser.add_argument('-c', '--call-limit', default=3, type=int,
                        help="Set the limit of a call statement. "
                        "(Defaults to 3.)")
    parser.add_argument('-t', '--vul-type',
                        help="Set the vulnerability type to be checked.")
    parser.add_argument('--prototype-pollution', '--pp', action='store_true',
                        help="Check prototype pollution.")
    parser.add_argument('input_file', action='store', nargs='?',
        help="Source code file (or directory) to generate object graph for. "
        "Use '-' to get source code from stdin. Ignore this argument to "
        "analyze ./nodes.csv and ./rels.csv.")
    args = parser.parse_args()
    
    logger = create_logger("main_logger", output_type="file")
    start_time = time.time()
    G = Graph()

    if args.print:
        logger = create_logger("main_logger", output_type="console",
            level=logging.DEBUG)
        create_logger("graph_logger", output_type="console",
            level=logging.DEBUG)
    G.run_all = not args.dont_run_all
    G.check_proto_pollution = args.prototype_pollution
    G.call_limit = args.call_limit
    logger.info('Analysis starts at ' +
        datetime.fromtimestamp(start_time).strftime('%Y-%m-%d %H:%M:%S'))
    if args.input_file:
        if args.input_file == '-':
            # analyze from stdin
            source = sys.stdin.read()
            analyze_string(G, source, generate_graph=True)
        else:
            # analyze from JS source code files
            analyze_files(G, args.input_file)
    else:
        # analyze from CSVs
        G.import_from_CSV("./nodes.csv", "./rels.csv")
        generate_obj_graph(G, '0')
    # G.relabel_nodes()
    G.export_to_CSV("./testnodes.csv", "./testrels.csv", light = False)
    logger.log(ATTENTION, 'Analysis finished at ' +
        datetime.today().strftime('%Y-%m-%d %H:%M:%S') +
        ', Time spent: %.3fs' % (time.time() - start_time))

    vul_type = 'os_command'
    if G.proto_pollution:
        logger.debug(sty.ef.inverse + 'prototype pollution' + sty.rs.all)
        for ast_node in G.proto_pollution:
            logger.debug('{} {}\n{}'
                .format(sty.fg.li_cyan + ast_node + sty.rs.all,
                    G.get_node_file_path(ast_node),
                    G.get_node_line_code(ast_node)))

    if args.vul_type:
        vul_type = args.vul_type
    
    logger.debug(sty.ef.inverse + vul_type + sty.rs.all)
    res_path = traceback(G, vul_type)

    logger.debug('ResPath0:')
    logger.debug(res_path[0])
    logger.debug('ResPath1:')
    logger.debug(res_path[1])

    res_pathes = vul_checking(G, res_path[0], vul_type)
    print(res_pathes)
    return res_path 
