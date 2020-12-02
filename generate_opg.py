from src.core.opgen import OPGen
from src.core.graph import Graph
from src.core.logger import *

import argparse

def parse_args():
    # Parse arguments
    parser = argparse.ArgumentParser(
        description='Object graph generator for JavaScript.')
    parser.add_argument('-p', '--print', action='store_true',
                        help='Print logs to console, instead of file.')
    parser.add_argument('-t', '--vul-type', default='os_command',
                        help="Set the vulnerability type to be checked.")
    parser.add_argument('-P', '--prototype-pollution', '--pp',
                        action='store_true',
                        help="Check prototype pollution.")
    parser.add_argument('-m', '--module', action='store_true',
                        help="Module mode. Regard the input file as a module "
                        "required by some other modules. This implies -a.")
    parser.add_argument('-q', '--exit', action='store_true', default=False,
                        help="Exit the program when vulnerability is found.")
    parser.add_argument('-s', '--single-branch', action='store_true',
                        help="Single branch. Do not create multiple "
                        "possibilities when meet a branching point.")
    parser.add_argument('-a', '--run-all', action='store_true', default=False,
                        help="Run all exported functions in module.exports. "
                        "By default, only main functions will be run.")
    parser.add_argument('-f', '--function-timeout', type=float,
                        help="Time limit when running all exported function, "
                        "in seconds. (Defaults to no limit.)")
    parser.add_argument('-c', '--call-limit', default=3, type=int,
                        help="Set the limit of a call statement. "
                        "(Defaults to 3.)")
    parser.add_argument('-e', '--entry-func')
    parser.add_argument('-l', '--list', action='store')
    parser.add_argument('--export', help="export the graph to csv files, can be light or all")
    parser.add_argument('--nodejs', action='store_true', default=False, help="run a nodejs package")
    parser.add_argument('input_file', action='store', nargs='?',
        help="Source code file (or directory) to generate object graph for. "
        "Use '-' to get source code from stdin. Ignore this argument to "
        "analyze ./nodes.csv and ./rels.csv.")
    args = parser.parse_args()
    if args.vul_type == 'prototype_pollution':
        args.vul_type = 'proto_pollution'

    return args

def setup_graph_env(G: Graph):
    #logger = create_logger("main_logger", output_type="file")

    if args.print:
        logger = create_logger("main_logger", output_type="console",
            level=logging.DEBUG)
        create_logger("graph_logger", output_type="console",
            level=logging.DEBUG)
        G.print = True

    G.run_all = args.run_all or args.module or args.nodejs or args.list
    G.function_time_limit = args.function_timeout
    G.exit_when_found = args.exit
    G.single_branch = args.single_branch
    G.vul_type = args.vul_type
    G.func_entry_point = args.entry_func
    G.check_proto_pollution = (args.prototype_pollution or 
                               args.vul_type == 'proto_pollution')
    G.call_limit = args.call_limit
    return G


if __name__ == '__main__':
    args = parse_args()
    opg = OPGen()
    G = opg.get_graph()
    setup_graph_env(G)
    opg.run(args)
    print(G.op_cnt)
