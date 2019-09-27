from .graph import Graph
from .utilities import NodeHandleResult, BranchTag, BranchTagContainer
from . import objectGraphGenerator
import sty
import re
from .logger import *


logger = create_logger("main_logger", output_type="file")

modeled_modules = {
    'fs': setup_fs
}

setup_module = {}


def get_module(name):
    if name in modeled_modules:
        if name in setup_module:
            return setup_module[name]
        else:
            module_exports = modeled_modules[name]
            setup_module[name] = module_exports
            return module_exports
    else:
        return None


def setup_fs(G: Graph):
    module_exports = G.add_obj_node()
    G.add_blank_func_as_prop('readFile', module_exports, read_file)
    G.add_blank_func_as_prop('readFileSync', module_exports, read_file_sync)
    return module_exports


def read_file(G: Graph, caller_ast, extra, path, options=None, callback=None):
    data = read_file_sync(G, caller_ast, extra, path, options)
    for func in callback.obj_nodes:
        func_decl = G.get_obj_def_ast_node(func)
        func_name = G.get_name_from_child(func_decl)
        func_scope = G.add_scope('FUNC_SCOPE', func,
            f'Function{func_decl}:{caller_ast}', func, caller_ast, func_name)
        objectGraphGenerator.call_callback_function(G, caller_ast, func_decl,
            func_scope, args=[NodeHandleResult(obj_nodes=[G.null_obj]), data],
            branches=extra.branches)
    return NodeHandleResult()


def read_file_sync(G: Graph, caller_ast, extra, path, options=None):
    paths = list(path.values)
    for obj in path.obj_nodes:
        value = G.get_node_attr(obj).get('code')
        if value is not None:
            paths.append(value)
    returned_values = []
    for path in paths:
        f = open(path, 'r')
        content = f.read()
        f.close()
        returned_values.append(content)
    return NodeHandleResult(values=returned_values)
