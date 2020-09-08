from src.core.graph import Graph
from src.core.utils import *

def handle_require(G: Graph, caller_ast, extra, _, module_names):
    # handle module name
    module_names, src, _ = to_values(G, module_names, caller_ast)
    if not module_names: return NodeHandleResult(obj_nodes=[])

    returned_objs = set()
    for module_name in module_names:
        if module_name in modeled_builtin_modules.modeled_modules \
            and G.vul_type != "path_traversal":
            # Python-modeled built-in modules
            # for now mostly fs
            # if it's path_traversal, do not do this
            returned_objs.add(
                modeled_builtin_modules.get_module(G, module_name))
        else:
            # actual JS modules
            # static require (module name is a literal)
            # module's path is in 'name' field
            file_path = G.get_node_attr(caller_ast).get('name')
            module_exports_objs = []
            if module_name and file_path:
                module_exports_objs = \
                    get_module_exports(G, file_path)
            # dynamic require (module name is a variable)
            if module_name is None or module_name == wildcard:
                logger.error('{} trying to require unknown package.'
                    .format(caller_ast))
                continue
            if not module_exports_objs:
                # check if the file's AST is in the graph
                file_path, _ = \
                    esprima_search(module_name, G.get_cur_file_path(),
                        print_func=logger.info)
                if not file_path: # module not found
                    continue
                elif file_path == 'built-in': # unmodeled built-in module
                    continue
                else:
                    module_exports_objs = \
                        get_module_exports(G, file_path)
            if not module_exports_objs:
                # if the file's AST is not in the graph,
                # generate its AST and run it
                logger.log(ATTENTION, f'Generating AST on demand for module '
                    f'{module_name} at {file_path}...')

                # following code is copied from analyze_files,
                # consider combining in future.
                start_id = str(G.cur_id)
                result = esprima_parse(file_path, ['-n', start_id, '-o', '-'],
                    print_func=logger.info)
                G.import_from_string(result)
                # start from the AST_TOPLEVEL node instead of the File node
                module_exports_objs = \
                        run_toplevel_file(G, str(int(start_id) + 1))
                G.set_node_attr(start_id,
                    ('module_exports', module_exports_objs))
            if module_exports_objs:
                returned_objs.update(module_exports_objs)
            else:
                logger.error("Required module {} at {} not found!".format(
                    module_name, file_path))
        
    returned_objs = list(returned_objs)
    if returned_objs and G.run_all:
        run_exported_functions(G, returned_objs, extra)

    # for a require call, we need to run traceback immediately
    if G.exit_when_found:
        vul_type = G.vul_type
        res_path = traceback(G, vul_type)
        res_path = vul_checking(G, res_path[0], vul_type)
        if len(res_path) != 0 and G.vul_type != 'proto_pollution':
            G.finished = True
    return NodeHandleResult(obj_nodes=returned_objs,
                            used_objs=list(chain(*src)))
