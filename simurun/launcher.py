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

def unittest_main(file_path, check_signatures=[], check_proto_pollution=False):
    """
    main function for uniitest 
    """
    G = Graph()
    G.exit_when_found = True
    G.check_proto_pollution = check_proto_pollution
    result = analyze_files(G, file_path, check_signatures=check_signatures)
    if result == False:
        return None 
    return G

def main():
    parser = argparse.ArgumentParser(description=
        'The object graph generator for JavaScript.')
    parser.add_argument('-p', '--print', action='store_true',
                        help='Print logs to console, instead of file.')
    parser.add_argument('-a', '--run-all', action='store_true', default=False,
                        help="Run all exported functions in module.exports. "
                        "By default, only main functions will be run.")
    parser.add_argument('-c', '--call-limit', default=3, type=int,
                        help="Set the limit of a call statement. "
                        "(Defaults to 3.)")
    parser.add_argument('-t', '--vul-type', default='os_command',
                        help="Set the vulnerability type to be checked.")
    parser.add_argument('--pp', '--prototype-pollution', action='store_true',
                        dest='prototype_pollution',
                        help="Check prototype pollution.")
    parser.add_argument('-m', '--module', action='store_true',
                        help="Module mode. Regard the input file as a module "
                        "required by some other modules. This implies -a.")
    parser.add_argument('-q', '--exit', action='store_true',
                        help="Exit the program when vulnerability is found.")
    parser.add_argument('-s', '--single-branch', action='store_true',
                        help="Single branch. Do not create multiple "
                        "possibilities when meet a branching point.")
    parser.add_argument('input_file', action='store', nargs='?',
        help="Source code file (or directory) to generate object graph for. "
        "Use '-' to get source code from stdin. Ignore this argument to "
        "analyze ./nodes.csv and ./rels.csv.")
    args = parser.parse_args()
    if args.vul_type == 'prototype_pollution':
        args.vul_type = 'proto_pollution'
    
    logger = create_logger("main_logger", output_type="file")
    start_time = time.time()
    G = Graph()

    if args.print:
        logger = create_logger("main_logger", output_type="console",
            level=logging.DEBUG)
        create_logger("graph_logger", output_type="console",
            level=logging.DEBUG)
    G.run_all = args.run_all or args.module
    G.exit_when_found = args.exit
    G.single_branch = args.single_branch
    G.check_proto_pollution = (args.prototype_pollution or 
                               args.vul_type == 'proto_pollution')
    G.call_limit = args.call_limit
    logger.info('Analysis starts at ' +
        datetime.fromtimestamp(start_time).strftime('%Y-%m-%d %H:%M:%S'))
    if args.input_file:
        if args.input_file == '-':
            if args.module:
                raise argparse.ArgumentTypeError(
                    'stdin cannot be used with module mode')
            else:
                # analyze from stdin
                source = sys.stdin.read()
                analyze_string(G, source, generate_graph=True)
        else:
            if args.module:
                # pretend another file is requiring this module
                script = "var main_func=require('{}');".format(args.input_file)
                analyze_string(G, script, generate_graph=True)
            else:
                # analyze from JS source code files
                analyze_files(G, args.input_file)
    else:
        if args.module:
            raise argparse.ArgumentTypeError(
                'CSV cannot be used with module mode')
        else:
            # analyze from CSVs
            G.import_from_CSV("./nodes.csv", "./rels.csv")
            generate_obj_graph(G, '0')
    # G.relabel_nodes()
    G.export_to_CSV("./testnodes.csv", "./testrels.csv")
    logger.log(ATTENTION, 'Analysis finished at ' +
        datetime.today().strftime('%Y-%m-%d %H:%M:%S') +
        ', Time spent: %.3fs' % (time.time() - start_time))

    vul_type = args.vul_type
    if G.proto_pollution:
        logger.debug(sty.ef.inverse + 'prototype pollution' + sty.rs.all)
        for ast_node in G.proto_pollution:
            logger.debug('{} {}\n{}'
                .format(sty.fg.li_cyan + ast_node + sty.rs.all,
                    G.get_node_file_path(ast_node),
                    G.get_node_line_code(ast_node)))

    if vul_type != 'proto_pollution':
        logger.debug(sty.ef.inverse + vul_type + sty.rs.all)
        res_path = traceback(G, vul_type)

        logger.debug('ResPath0:')
        logger.debug(res_path[0])
        logger.debug('ResPath1:')
        logger.debug(res_path[1])

        res_pathes = vul_checking(G, res_path[0], vul_type)
        print(res_pathes)
        return res_path 
