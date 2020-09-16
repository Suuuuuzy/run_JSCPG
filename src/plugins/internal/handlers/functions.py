from src.core.logger import *
from src.core.graph import Graph
from src.core.utils import BranchTagContainer 
from src.core.utils import NodeHandleResult, ExtraInfo
# function is higher than block
from .blocks import simurun_block
# a little bit risky to use handle prop
# should be fine
from . import vars
from src.core.utils import get_random_hex, wildcard, undefined
from src.core.helpers import to_values
from src.plugins.handler import Handler
from itertools import chain
from . import modeled_builtin_modules
from . import file
from ..utils import get_df_callback, to_obj_nodes, add_contributes_to
import sty
import traceback as tb

class HandleASTCall(Handler):

    def __init__(self, G, node_id, extra=None):
        self.G = G
        self.node_id = node_id
        self.extra = extra

    def process(self):
        """
        the pre processing function
        """
        r = ast_call_function(self.G, self.node_id, self.extra)
        return NodeHandleResult(obj_nodes=r.obj_nodes, used_objs=r.used_objs,
            values=r.values, value_sources=r.value_sources,
            ast_node=self.node_id, callback=get_df_callback(self.G))

def ast_call_function(G, ast_node, extra):
    '''
    Call a function (AST_CALL/AST_METHOD_CALL/AST_NEW).
    
    Args:
        G (Graph): graph
        ast_node: the Call/New expression's AST node.
        extra (ExtraInfo): extra information.

    Returns:
        NodeHandleResult: Returned objects and used objects.
    '''
    from ..manager_instance import internal_manager
    if G.finished:
        return NodeHandleResult()

    # handle the callee and parent object (for method calls)
    handled_parent = None
    if G.get_node_attr(ast_node).get('type') == 'AST_METHOD_CALL':
        handled_callee, handled_parent = handle_prop(G, ast_node, extra)
    else:
        callee = G.get_ordered_ast_child_nodes(ast_node)[0]
        handled_callee = internal_manager.dispatch_node(callee, extra)

    # handle arguments
    handled_args = []
    arg_list_node = G.get_ordered_ast_child_nodes(ast_node)[-1]
    arg_list = G.get_ordered_ast_child_nodes(arg_list_node)
    for arg in arg_list:
        handled_arg = internal_manager.dispatch_node(arg, extra)
        handled_args.append(handled_arg)

    # typeof and detele
    if G.get_node_attr(ast_node).get('flags:string[]') == 'JS_TYPEOF':
        types = defaultdict(lambda: [])
        if handled_args:
            for obj in handled_args[0].obj_nodes:
                if G.get_node_attr(obj).get('type') == 'array':
                    types['object'].append(obj)
                # should we consider wildcard objects' type as 
                # wildcard or fixed "object"?
                elif (G.get_node_attr(obj).get('type') == 'object' and
                    G.get_node_attr(obj).get('code') == wildcard):
                    # types[wildcard].append(obj)
                    types['object'].append(obj)
                    types['string'].append(obj)
                    types['number'].append(obj)
                    types['boolean'].append(obj)
                else:
                    types[G.get_node_attr(obj).get('type')].append(obj)
            for i, val in enumerate(handled_args[0].values):
                if type(val) in ['int', 'float']:
                    types['number'].extend(handled_args[0].value_sources[i])
                elif type(val) == 'str':
                    types['string'].extend(handled_args[0].value_sources[i])
                else:
                    types['object'].extend(handled_args[0].value_sources[i])
        # returned_objs = []
        # used_objs = []
        returned_values = []
        returned_value_sources = []
        for t, sources in types.items():
            # added_obj = G.add_obj_node(ast_node, 'string', t)
            # for s in sources:
            #     add_contributes_to(G, [s], added_obj)
            # returned_objs.append(added_obj)
            # used_objs.extend(sources)
            returned_values.append(t)
            returned_value_sources.append(sources)
        return NodeHandleResult(values=returned_values, 
                                value_sources=returned_value_sources)
    elif G.get_node_attr(ast_node).get('flags:string[]') == 'JS_DELETE':
        if handled_args:
            for name_node in handled_args[0].name_nodes:
                for obj in handled_args[0].obj_nodes:
                    G.remove_all_edges_between(name_node, obj)
        return NodeHandleResult()

    # find function declaration objects
    func_decl_objs = list(filter(lambda x: x != G.undefined_obj and
        x != G.null_obj, handled_callee.obj_nodes))
    func_name = handled_callee.name
    # add blank functions
    if not func_decl_objs:
        if handled_callee.name_nodes:
            for name_node in handled_callee.name_nodes:
                func_decl_obj = G.add_blank_func_with_og_nodes(
                    func_name or '{anonymous}')
                G.add_obj_to_name_node(name_node, tobe_added_obj=func_decl_obj)
                func_decl_objs.append(func_decl_obj)
        else:
            logger.error(f'Function call error: Name node not found for {func_name}!')

    
    is_new = False # if the function call is creating a new object
    if G.get_node_attr(ast_node).get('type') == 'AST_CALL':
        stmt_id = 'Call' + ast_node + '-' + get_random_hex()
    elif G.get_node_attr(ast_node).get('type') == 'AST_METHOD_CALL':
        stmt_id = 'Call' + ast_node + '-' + get_random_hex()
        parent = G.get_ordered_ast_child_nodes(ast_node)[0]
    elif G.get_node_attr(ast_node).get('type') == 'AST_NEW':
        stmt_id = 'New' + ast_node + '-' + get_random_hex()
        is_new = True
    returned_result, created_objs = \
        call_function(G, func_decl_objs, handled_args,
        handled_parent, extra, caller_ast=ast_node, is_new=is_new,
        stmt_id=stmt_id, func_name=func_name)
    if is_new:
        returned_result.obj_nodes = created_objs
    return returned_result

def call_function(G, func_objs, args=[], this=NodeHandleResult(), extra=None,
    caller_ast=None, is_new=False, stmt_id='Unknown', func_name=None,
    mark_fake_args=False):
    '''
    Directly call a function.
    
    Args:
        G (Graph): Graph.
        func_objs: List of function declaration objects.
        args (List[NodeHandleResult]): List of handled arguments.
        this (NodeHandleResult): Handled override "this" object.
        extra (ExtraInfo, optional): Extra information. Defaults to
            empty ExtraInfo.
        caller_ast (optional): The caller's AST node. Defaults to None.
        is_new (bool, optional): If the caller is a "new" statement.
            Defaults to False.
        stmt_id (str, optional): Caller's statement ID, for branching
            use only. Defaults to 'Unknown'.
        func_name (str, optional): The function's name, for adding blank
            functions only. Defaults to '{anonymous}'.
    
    Returns:
        NodeHandleResult, List: Call result (including returned objects
            and used objects), and list of used objects.
    '''
    if G.finished:
        return NodeHandleResult(), []

    # No function objects found, return immediately
    if not func_objs:
        logger.error(f'No definition found for function {func_name}')
        return NodeHandleResult(), []

    if extra is None:
        extra = ExtraInfo()

    # process arguments
    callback_functions = set() # only for unmodeled built-in functions
    for arg in args:
        # add callback functions
        for obj in arg.obj_nodes:
            if G.get_node_attr(obj).get('type') == 'function':
                callback_functions.add(obj)
    callback_functions = list(callback_functions)

    # if the function declaration has multiple possibilities,
    # and need to merge afterwards
    has_branches = (len(func_objs) > 1 and not G.single_branch)

    # process function name
    if not func_name:
        if func_objs:
            func_name = G.get_node_attr(func_objs[0]).get('name')
    if not func_name:
        func_name = '{anonymous}'

    call_stack_item = '{}'.format(func_name)
    if G.call_stack.count(call_stack_item) > 20:
        return NodeHandleResult(), []

    G.call_stack.append(call_stack_item)
    #print(G.call_stack)

    if stmt_id == 'Unknown' and caller_ast is not None:
        stmt_id = caller_ast

    # initiate return values
    returned_objs = set()
    used_objs = set()
    created_objs = []
    returned_values = [] # for python function only
    returned_value_sources = [] # for python function only

    # initiate fake return objects (only create once)
    fake_returned_obj = None
    fake_created_obj = None

    # if any function is run in this call
    any_func_run = False
    # if any function is skipped in this call
    any_func_skipped = False
    
    # manage branches
    branches = extra.branches
    parent_branch = branches.get_last_choice_tag()

    # for each possible function declaration
    for i, func_obj in enumerate(func_objs):
        # copy "this" and "args" references
        # because we may edit them later
        # and we want to keep original "this" and "args"
        _this = this
        _args = list(args) if args is not None else None
        # bound functions
        func_obj_attrs = G.get_node_attr(func_obj)
        if func_obj_attrs.get('target_func'):
            _this = func_obj_attrs.get('bound_this')
            logger.log(ATTENTION, 'Bound function found ({}->{}), this={}'.format(func_obj_attrs.get('target_func'), func_obj, _this.obj_nodes))
            if func_obj_attrs.get('bound_args') is not None:
                _args = func_obj_attrs.get('bound_args')
            func_obj = func_obj_attrs.get('target_func')
        
        # pass arguments' used objects to the function call
        # for arg in _args:
        #     used_objs.update(arg.used_objs)

        if func_obj in G.internal_objs.values():
            logger.warning('Error: Trying to run an internal obj {} {}'
                ', skipped'.format(func_obj, G.inv_internal_objs[func_obj]))
            continue
        any_func_run = True

        # if branches exist, add a new branch tag to the list
        if has_branches and not G.single_branch:
            next_branches = branches+[BranchTag(point=stmt_id, branch=i)]
        else:
            next_branches = branches

        branch_returned_objs = []
        branch_created_obj = None
        branch_used_objs = []
        func_ast = G.get_obj_def_ast_node(func_obj, aim_type='function')
        # check if python function exists
        python_func = G.get_node_attr(func_obj).get('pythonfunc')
        if python_func: # special Python function
            if is_new:
                if func_obj in G.builtin_constructors:
                    logger.log(ATTENTION, f'Running Python function {func_obj} {python_func}...')
                    try:
                        h = python_func(G, caller_ast, ExtraInfo(extra,
                            branches=next_branches), _this, *_args)
                        created_objs.extend(h.obj_nodes)
                        branch_used_objs = h.used_objs
                    except TypeError as e:
                        logger.error(tb.format_exc())
                else:
                    logger.error(f'Error: try to new Python function {func_obj} {python_func}...')
                    continue
            else:
                loggers.main_logger.log(ATTENTION, f'Running Python function {func_obj} {python_func}...')
                try:
                    h = python_func(G, caller_ast,
                        ExtraInfo(extra, branches=next_branches), _this, *_args)
                    branch_returned_objs = h.obj_nodes
                    # the obj_nodes may be node list
                    if type(branch_returned_objs) != list:
                        branch_returned_objs = [branch_returned_objs]
                    branch_used_objs = h.used_objs
                    returned_values.extend(h.values)
                    returned_value_sources.extend(h.value_sources)
                except TypeError as e:
                    loggers.main_logger.error(tb.format_exc())
        else: # JS function in AST
            # if AST cannot be found, create AST
            if func_ast is None or G.get_node_attr(func_ast).get('type') \
            not in ['AST_FUNC_DECL', 'AST_CLOSURE']:
                G.add_blank_func_with_og_nodes(func_name, func_obj)
                func_ast = G.get_obj_def_ast_node(func_obj, aim_type='function')
            # add to coverage
            func_ast_attr = G.get_node_attr(func_ast)
            if 'labels:label' in func_ast_attr and \
                    func_ast_attr['labels:label'] == 'Artificial_AST':
                pass
            else:
                G.covered_func.add(func_ast)

            # add function scope (see comments in decl_function)
            parent_scope = G.get_node_attr(func_obj).get('parent_scope')
            func_scope = G.add_scope('FUNC_SCOPE', func_ast,
                f'Function{func_ast}:{caller_ast}', func_obj,
                caller_ast, func_name, parent_scope=parent_scope)
            # make arguments available in the function
            param_list = G.get_child_nodes(func_ast, edge_type='PARENT_OF',
                child_type='AST_PARAM_LIST')
            params = G.get_ordered_ast_child_nodes(param_list)
            # add "arguments" array
            arguments_obj = G.add_obj_to_scope(name='arguments',
                    js_type='array', scope=func_scope, ast_node=func_ast)
            j = 0
            while j < len(params) or j < len(_args) or j < 3:
                if j < len(_args):
                    arg_obj_nodes = to_obj_nodes(G, _args[j], caller_ast)
                    # add argument to "arguments"
                    for obj in arg_obj_nodes:
                        G.add_obj_as_prop(prop_name=str(j),
                            parent_obj=arguments_obj, tobe_added_obj=obj)
                    # add argument to the parameter
                    if j < len(params):
                        param = params[j]
                        param_name = G.get_name_from_child(param)
                        if G.get_node_attr(param).get('flags:string[]') \
                            == 'PARAM_VARIADIC':
                            arr = G.add_obj_to_scope(param_name,
                                caller_ast or param, 'array', scope=func_scope)
                            length = 0
                            while j < len(_args):
                                logger.debug(f'add arg {param_name}[{length}]'
                                    f' <- {arg_obj_nodes}, scope {func_scope}')
                                for obj in arg_obj_nodes:
                                    G.add_obj_as_prop(str(length),
                                        parent_obj=arr, tobe_added_obj=obj)
                                j += 1
                                length += 1
                            G.add_obj_as_prop('length', js_type='number',
                                value=length, parent_obj=arr)
                        else:
                            logger.debug(f'add arg {param_name} <- '
                                f'{arg_obj_nodes}, scope {func_scope}')
                            for obj in arg_obj_nodes:
                                G.add_obj_to_scope(name=param_name,
                                    scope=func_scope, tobe_added_obj=obj)
                    else:
                        # this is used to print logs only
                        loggers.main_logger.debug(f'add arg arguments[{j}] <- '
                            f'{arg_obj_nodes}, scope {func_scope}')
                elif j < len(params) and mark_fake_args:
                    param = params[j]
                    param_name = G.get_name_from_child(param)
                    # add dummy arguments
                    param_name = G.get_name_from_child(param)
                    if G.get_node_attr(param).get('flags:string[]') \
                        == 'PARAM_VARIADIC':
                        # rest parameter (variable length arguments)
                        added_obj = G.add_obj_to_scope(name=param_name,
                            scope=func_scope, ast_node=caller_ast or param,
                            js_type='array')
                        elem = G.add_obj_as_prop(wildcard, caller_ast or param,
                            value=wildcard, parent_obj=added_obj)
                        if mark_fake_args:
                            G.set_node_attr(elem, ('tainted', True))
                            logger.debug("{} marked as tainted 2".format(elem))
                    else:
                        added_obj = G.add_obj_to_scope(name=param_name,
                            scope=func_scope, ast_node=caller_ast or param,
                            # give __proto__ when checking prototype pollution
                            js_type='object' if G.check_proto_pollution
                            else None, value=wildcard)
                    if mark_fake_args:
                        G.set_node_attr(added_obj, ('tainted', True))
                        logger.debug("{} marked as tainted 3".format(added_obj))
                    G.add_obj_as_prop(prop_name=str(j),
                        parent_obj=arguments_obj, tobe_added_obj=added_obj)

                    logger.debug(f'add arg {param_name} <- new obj {added_obj}, '
                            f'scope {func_scope}, ast node {param}')
                elif j < 3:
                    # in case the function only use "arguments"
                    # but no parameters in its declaration
                    added_obj = G.add_obj_node(ast_node=caller_ast,
                        # give __proto__ when checking prototype pollution
                        js_type='object' if G.check_proto_pollution
                        else None, value=wildcard)
                    if mark_fake_args:
                        G.set_node_attr(added_obj, ('tainted', True))
                        logger.debug("{} marked as tainted 4".format(added_obj))
                    G.add_obj_as_prop(prop_name=str(j),
                        parent_obj=arguments_obj, tobe_added_obj=added_obj)
                    loggers.main_logger.debug(f'add arguments[{j}] <- new obj {added_obj}, '
                                f'scope {func_scope}, ast node {caller_ast}')
                else:
                    break
                j += 1
            arguments_length_obj = G.add_obj_as_prop(prop_name='length',
                 parent_obj=arguments_obj, value=j, js_type='number')

            # switch scopes ("new" will swtich scopes and object by itself)
            backup_scope = G.cur_scope
            G.cur_scope = func_scope
            backup_stmt = G.cur_stmt
            # run simulation -- create the object, or call the function
            if is_new:
                branch_created_obj, branch_returned_objs = instantiate_obj(G,
                    caller_ast, func_ast, branches=next_branches)
                # tmp fix TODO
                if branch_returned_objs is None:
                    branch_returned_objs = []
            else:
                backup_objs = G.cur_objs
                if _this:
                    G.cur_objs = _this.obj_nodes
                else:
                    G.cur_objs = [G.BASE_OBJ]
                branch_returned_objs, branch_used_objs = simurun_function(
                    G, func_ast, branches=next_branches, caller_ast=caller_ast)
                G.cur_objs = backup_objs
            # switch back scopes
            G.cur_scope = backup_scope
            G.cur_stmt = backup_stmt

            # delete "arguments" (avoid parent explosion)
            for name_node in G.get_prop_name_nodes(arguments_obj):
                for obj_node in G.get_child_nodes(name_node, edge_type='NAME_TO_OBJ'):
                    G.remove_all_edges_between(name_node, obj_node)
                G.remove_all_edges_between(arguments_obj, name_node)

            # if it's an unmodeled built-in function
            if G.get_node_attr(func_ast).get('labels:label') \
                == 'Artificial_AST':
                # logger.info(sty.fg.green + sty.ef.inverse + func_ast + ' is unmodeled built-in function.' + sty.rs.all)
                if branch_used_objs is None: # in case it's skipped
                    branch_used_objs = []
                if branch_returned_objs is None: # in case it's skipped
                    branch_returned_objs = []
                # add arguments as used objects
                for h in _args:
                    branch_used_objs.extend(h.obj_nodes)
                if this is not None:
                    # performance is too low
                    # for o in G.get_ancestors_in(func_obj, edge_types=[
                    #     'NAME_TO_OBJ', 'OBJ_TO_PROP'],
                    #     candidates=this.obj_nodes, step=2):
                    #     branch_used_objs.append(o)
                    branch_used_objs.extend(this.obj_nodes)
                # add a blank object as return object
                if fake_returned_obj is None:
                    fake_returned_obj = \
                        G.add_obj_node(caller_ast, "object", wildcard)
                branch_returned_objs.append(fake_returned_obj)
                for obj in branch_used_objs:
                    add_contributes_to(G, [obj], fake_returned_obj)
                # add a blank object as created object
                if is_new and branch_created_obj is None:
                    if fake_created_obj is None:
                        fake_created_obj = \
                            G.add_obj_node(caller_ast, "object", wildcard)
                    branch_created_obj = fake_created_obj
                    for obj in branch_used_objs:
                        add_contributes_to(G, [obj], fake_created_obj)
                # call all callback functions
                if callback_functions:
                    logger.debug(sty.fg.green + sty.ef.inverse +
                        'callback functions = {}'.format(callback_functions)
                        + sty.rs.all)
                    
                    if _this is not None:
                        obj_attrs = [G.get_node_attr(obj) for obj in _this.obj_nodes]
                        mark_fake_args = any(['tainted' in attr for attr in obj_attrs])
                    else:
                        mark_fake_args = False

                    call_function(G, callback_functions, caller_ast=caller_ast,
                        extra=extra, stmt_id=stmt_id, mark_fake_args=mark_fake_args)
        
        if branch_returned_objs is None and branch_used_objs is None:
            any_func_skipped = True
        else:
            assert type(branch_returned_objs) is list
            assert type(branch_used_objs) is list
            returned_objs.update(branch_returned_objs)
            used_objs.update(branch_used_objs)
        assert type(branch_created_obj) is not list
        if branch_created_obj is not None:
            created_objs.append(branch_created_obj)
        # add call edge
        if caller_ast is not None and G.get_node_attr(func_ast).get('type')\
            in ['AST_FUNC_DECL', 'AST_CLOSURE']:
            G.add_edge_if_not_exist(caller_ast, func_ast, {"type:TYPE": "CALLS"})

    if has_branches and not G.single_branch and any_func_run:
        merge(G, stmt_id, len(func_objs), parent_branch)

    if not any_func_run:
        logger.error('Error: No function was run during this function call')

    G.call_stack.pop()
    # print(len(G.call_stack), G.call_stack)

    return NodeHandleResult(obj_nodes=list(returned_objs),
            used_objs=list(used_objs),
            values=returned_values, value_sources=returned_value_sources,
            terminated=any_func_skipped
        ), created_objs

def simurun_function(G, func_ast, branches=None, block_scope=True,
    caller_ast=None):
    """
    Simurun a function by running its body.
    """
    if branches is None or G.single_branch:
        # create an instance of BranchTagContainer every time,
        # don't use default argument
        branches = BranchTagContainer()

    if caller_ast is not None:
        if G.call_counter[caller_ast] >= G.call_limit:
            logger.warning(f'{caller_ast}: Function {func_ast} in call stack '
                    f'{G.call_counter[caller_ast]} times, skip simulating')
            return None, None # don't change this to [], []
                              # we need to distinguish skipped functions
        else:
            G.call_counter[caller_ast] += 1

    func_objs = G.get_func_decl_objs_by_ast_node(func_ast)
    func_obj = func_objs[0] if func_objs else '?'
    func_name = G.get_node_attr(func_obj).get('name') if func_objs else '?'
    loggers.main_logger.info(sty.ef.inverse + sty.fg.green +
        "FUNCTION {} {} STARTS, SCOPE {}, DECL OBJ {}, this OBJs {}, branches {}"
        .format(func_ast, func_name or '{anonymous}',
        G.cur_scope, func_obj, G.cur_objs,
        branches) + sty.rs.all)
    returned_objs, used_objs = [], []
    # update graph register for cur_func
    G.cur_func = G.get_cur_function_decl()

    for child in G.get_child_nodes(func_ast, child_type='AST_STMT_LIST'):
        returned_objs, used_objs = simurun_block(G, child,
            parent_scope=G.cur_scope, branches=branches,
            block_scope=block_scope, decl_var=True)
        break

    if caller_ast is not None:
        G.call_counter[caller_ast] -= 1
    return returned_objs, used_objs

def get_module_exports(G, file_path):
    toplevel_nodes = G.get_nodes_by_type_and_flag(
        'AST_TOPLEVEL', 'TOPLEVEL_FILE')
    found = False
    for node in toplevel_nodes:
        if G.get_node_attr(node).get('name') == file_path:
            found = True
            # if a file has been required, skip the run and return
            # the saved module.exports
            saved_module_exports = G.get_node_attr(node).get('module_exports')
            if saved_module_exports != None:
                module_exports_objs = saved_module_exports
                logger.log(ATTENTION, 'File has been required, '
                    'return saved module.exports {} for {}'
                    .format(module_exports_objs, file_path))
                break
            else:
                module_exports_objs = file.run_toplevel_file(G, node)
                G.set_node_attr(node,
                    ('module_exports', module_exports_objs))
                break
    if found:
        return module_exports_objs
    else:
        return []

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

def run_exported_functions(G, module_exports_objs, extra):
    exported_objs = G.get_prop_obj_nodes(module_exports_objs[0])
    exported_objs += module_exports_objs

    while(len(exported_objs) != 0):
        obj = exported_objs.pop()
        parent_obj = None
        if type(obj) == type((1,2)):
            parent_obj = obj[0]
            obj = obj[1]
        if not parent_obj:
            parent_obj = obj

        if 'pythonfunc' in G.get_node_attr(obj):
            continue
        if G.func_entry_point is not None and not (
            G.get_node_attr(obj).get('type') == 'function' and
            G.get_node_attr(obj).get('name') == G.func_entry_point):
            continue

        if obj in G.require_obj_stack:
            continue
        G.require_obj_stack.append(obj)
        newed_objs = None
        returned_objs = None
        if G.get_node_attr(obj).get("init_run") is not None:
            continue
        if G.get_node_attr(obj).get('type') != 'function':
            continue
        # some times they write exports= new foo() eg. libnmap
        logger.log(ATTENTION, 'Run exported function {}'.format(obj))
        # if G.function_time_limit:
        if False:
            try:
                returned_result, newed_objs = func_timeout(
                    G.function_time_limit, call_function,
                    args=(G, [obj]),
                    kwargs={
                        'this':
                            NodeHandleResult(obj_nodes=[parent_obj]),
                        'extra': extra, 'is_new': True,
                        'mark_fake_args': True
                    })
            except FunctionTimedOut:
                continue
        else:
            # func_timeout may cause threading problems
            returned_result, newed_objs = call_function(G, [obj],
                this=NodeHandleResult(obj_nodes=[parent_obj]),
                extra=extra, is_new=True, mark_fake_args=True
            )

        if newed_objs is None:
            newed_objs = [obj] 

        G.set_node_attr(obj, ('init_run', "True"))
        # include newed objects and return objects
        if returned_result is not None:
            newed_objs.extend(returned_result.obj_nodes)
        # we may have prototype functions:
        for newed_obj in newed_objs:
            proto_obj = G.get_prop_obj_nodes(parent_obj=newed_obj, 
                    prop_name='__proto__')
            generated_objs = \
                G.get_prop_obj_nodes(parent_obj=newed_obj)
            generated_objs += \
                G.get_prop_obj_nodes(parent_obj=proto_obj)
            # newed obj haven't been run
            generated_objs.append(newed_obj)
            for obj in generated_objs:
                if G.get_node_attr(obj).get('type') == 'function':
                    #print(obj, G.get_node_attr(obj))
                    exported_objs.append((newed_obj, obj))
