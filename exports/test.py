def call_function(G, func_objs, args=[], this=NodeHandleResult(), extra=None,
                  caller_ast=None, is_new=False, stmt_id='Unknown', func_name=None,
                  mark_fake_args=False, python_callback=None, fake_arg_srcs=None):
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
            and used objects), and list of created objects.
    '''

    if G.finished:
        return NodeHandleResult(), []

    logger = loggers.main_logger
    func_return_handle_res = None

    # No function objects found, return immediately
    if not func_objs:
        logger.error(f'No definition found for function {func_name}')
        return NodeHandleResult(), []

    if extra is None:
        extra = ExtraInfo()

    # process arguments
    callback_functions = set()  # only for unmodeled built-in functions
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
    # print(G.call_stack)

    if stmt_id == 'Unknown' and caller_ast is not None:
        stmt_id = caller_ast

    # initiate return values
    returned_objs = set()
    used_objs = set()
    created_objs = []
    returned_values = []  # for python function only
    returned_value_sources = []  # for python function only
    exit_nodes = set()  # build control flows

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
        func_obj_attrs = G.get_node_attr(func_obj)
        if func_obj_attrs.get('target_func'):
            _this = func_obj_attrs.get('bound_this')
            logger.log(ATTENTION,
                       'Bound function found ({}->{}), this={}'.format(func_obj_attrs.get('target_func'), func_obj,
                                                                       _this.obj_nodes))
            if func_obj_attrs.get('bound_args') is not None:
                _args = func_obj_attrs.get('bound_args')
            func_obj = func_obj_attrs.get('target_func')
        if not _this and func_obj_attrs.get('parent_scope_this'):
            _this = NodeHandleResult(
                obj_nodes=func_obj_attrs.get('parent_scope_this'))

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
            next_branches = branches + [BranchTag(point=stmt_id, branch=i)]
        else:
            next_branches = branches

        branch_returned_objs = []
        branch_created_obj = None
        branch_used_objs = []
        func_ast = G.get_obj_def_ast_node(func_obj, aim_type='function')
        # check if python function exists
        python_func = G.get_node_attr(func_obj).get('pythonfunc')
        if python_func:  # special Python function
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
                logger.log(ATTENTION, f'Running Python function {func_obj} {python_func}...')
                try:
                    logger.info(_args)
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
                    logger.error(tb.format_exc())
        else:  # JS function in AST
            # if AST cannot be found, create AST
            if func_ast is None or G.get_node_attr(func_ast).get('type') \
                    not in ['AST_FUNC_DECL', 'AST_CLOSURE', 'AST_METHOD']:
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
                        logger.debug(f'add arg arguments[{j}] <- '
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
                            G.set_node_attr(elem, ('fake_arg', True))
                            G.set_node_attr(elem, ('taint_flow', [([elem], fake_arg_srcs[j])]))
                            logger.debug("{} marked as tainted [2]".format(elem))
                    else:
                        added_obj = G.add_obj_to_scope(name=param_name,
                                                       scope=func_scope, ast_node=caller_ast or param,
                                                       # give __proto__ when checking prototype pollution
                                                       js_type='object' if G.check_proto_pollution
                                                       else None, value=wildcard)
                    if mark_fake_args:
                        G.set_node_attr(added_obj, ('tainted', True))
                        G.set_node_attr(added_obj, ('fake_arg', True))
                        G.set_node_attr(added_obj, ('taint_flow', [([added_obj], fake_arg_srcs[j])]))
                        logger.debug("{} marked as tainted [3]".format(added_obj))
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
                        G.set_node_attr(added_obj, ('fake_arg', True))
                        if j<len(fake_arg_srcs):
                            G.set_node_attr(added_obj, ('taint_flow', [([added_obj], fake_arg_srcs[j])]))
                        logger.debug("{} marked as tainted [4]".format(added_obj))
                    G.add_obj_as_prop(prop_name=str(j),
                                      parent_obj=arguments_obj, tobe_added_obj=added_obj)
                    logger.debug(f'add arguments[{j}] <- new obj {added_obj}, '
                                 f'scope {func_scope}, ast node {caller_ast}')
                else:
                    break
                j += 1
            arguments_length_obj = G.add_obj_as_prop(prop_name='length',
                                                     parent_obj=arguments_obj, value=j, js_type='number')

            # if the function is defined in a for loop, restore the branches
            # this design is obsolete
            # for_tags = \
            #     BranchTagContainer(G.get_node_attr(func_obj).get('for_tags',
            #     BranchTagContainer())).get_creating_for_tags()
            # if for_tags:
            #     for_tags = [BranchTag(i, mark=None) for i in for_tags]
            #     next_branches.extend(for_tags)
            # logger.debug(f'next branch tags: {next_branches}')

            if G.thread_version:
                # switch scopes ("new" will swtich scopes and object by itself)
                backup_scope = G.mydata.cur_scope
                G.mydata.cur_scope = func_scope
                backup_stmt = G.mydata.cur_stmt
            else:
                # switch scopes ("new" will swtich scopes and object by itself)
                backup_scope = G.cur_scope
                G.cur_scope = func_scope
                backup_stmt = G.cur_stmt

            # call the Python callback function
            if python_callback is not None:
                python_callback(G)
            # run simulation -- create the object, or call the function
            if is_new:
                branch_created_obj, branch_returned_objs = instantiate_obj(G,
                                                                           caller_ast, func_ast, branches=next_branches)
            else:
                backup_objs = G.mydata.cur_objs if G.thread_version else G.cur_objs
                if G.thread_version:
                    if _this:
                        G.mydata.cur_objs = _this.obj_nodes
                    else:
                        G.mydata.cur_objs = [G.BASE_OBJ]
                else:
                    if _this:
                        G.cur_objs = _this.obj_nodes
                    else:
                        G.cur_objs = [G.BASE_OBJ]
                branch_returned_objs, branch_used_objs = simurun_function(
                    G, func_ast, branches=next_branches, caller_ast=caller_ast)
                if G.thread_version:
                    G.mydata.cur_objs = backup_objs
                else:
                    G.cur_objs = backup_objs
            func_return_handle_res = G.function_returns[G.find_ancestor_scope()][0]
            if G.thread_version:
                # switch back scopes
                G.mydata.cur_scope = backup_scope
                G.mydata.cur_stmt = backup_stmt
            else:
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
                if branch_used_objs is None:  # in case it's skipped
                    branch_used_objs = []
                if branch_returned_objs is None:  # in case it's skipped
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

                    if len(callback_functions) != 0:
                        # if the name is OPGen_markTaintCall, mark the args as tainted
                        if "OPGen_markTaintCall" == func_name:
                            mark_fake_args = True

                    call_function(G, callback_functions, caller_ast=caller_ast,
                                  extra=extra, stmt_id=stmt_id, mark_fake_args=mark_fake_args)

        if branch_returned_objs is None or branch_used_objs is None:  # workaround for skipping instantiating objects
            any_func_skipped = True
        else:
            assert type(branch_returned_objs) is list
            assert type(branch_used_objs) is list
            returned_objs.update(branch_returned_objs)
            used_objs.update(branch_used_objs)
        assert type(branch_created_obj) is not list
        if branch_created_obj is not None:
            created_objs.append(branch_created_obj)

        # add control flows
        if caller_ast is not None and func_ast is not None and \
                G.get_node_attr(func_ast).get('type') in [
            'AST_FUNC_DECL', 'AST_CLOSURE', 'AST_METHOD']:
            caller_cpg = G.find_nearest_upper_CPG_node(caller_ast)
            logger.info(sty.fg.li_magenta + sty.ef.inverse + "CALLS" +
                        sty.rs.all + " {} -> {} (Line {} -> Line {}) {}".format(
                caller_cpg, func_ast,
                G.get_node_attr(caller_cpg).get('lineno:int'),
                G.get_node_attr(func_ast).get('lineno:int') or '?',
                func_name))
            # add a call edge from the expression to the function definition
            # G.add_edge_if_not_exist(
            #     caller_ast, func_ast, {"type:TYPE": "CALLS"})
            # add a call edge from the calling function to the callee
            # (called function)
            G.add_edge_if_not_exist(
                find_function(G, caller_ast), func_ast, {"type:TYPE": "CALLS"})
            # then add a control flow edge from the statement to the
            # function's ENTRY node
            entry_node = G.get_successors(func_ast, edge_type='ENTRY')[0]
            G.add_edge_if_not_exist(
                caller_cpg, entry_node, {"type:TYPE": "FLOWS_TO"})
            # collect exit nodes
            exit_node = G.get_successors(func_ast, edge_type='EXIT')[0]
            exit_nodes.add(exit_node)

    if has_branches and not G.single_branch and any_func_run:
        merge(G, stmt_id, len(func_objs), parent_branch)

    if not any_func_run:
        logger.error('Error: No function was run during this function call')

    G.call_stack.pop()
    # print(len(G.call_stack), G.call_stack)

    # G.last_stmts = exit_nodes
    if caller_ast is not None:
        caller_cpg = G.find_nearest_upper_CPG_node(caller_ast)
        for exit_node in exit_nodes:
            G.add_edge(exit_node, caller_cpg, {'type:TYPE': 'FLOWS_TO'})
        G.last_stmts = [caller_cpg]
    else:
        G.last_stmts = []

    name_tainted = False
    parent_is_proto = False
    if func_return_handle_res is not None:
        for hr in func_return_handle_res:
            name_tainted = name_tainted or hr.name_tainted
            parent_is_proto = parent_is_proto or hr.parent_is_proto

    return NodeHandleResult(obj_nodes=list(returned_objs),
                            used_objs=list(used_objs),
                            values=returned_values, value_sources=returned_value_sources,
                            name_tainted=name_tainted, parent_is_proto=parent_is_proto,
                            terminated=any_func_skipped
                            ), created_objs
