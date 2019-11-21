No 1
Running /media/data/lsong18/data/vulPackages/command_injection/growl@1.9.2, size: 1712, cloc: 543
No 2
Running /media/data/lsong18/data/vulPackages/command_injection/ps@0.0.2, size: 65, cloc: 159
Finished /media/data/lsong18/data/vulPackages/command_injection/ps@0.0.2, size: 65, cloc: 159
No 3
Running /media/data/lsong18/data/vulPackages/command_injection/pullit@1.3.0, size: 97, cloc: 2838
Finished /media/data/lsong18/data/vulPackages/command_injection/pullit@1.3.0, size: 97, cloc: 2838
No 4
Running /media/data/lsong18/data/vulPackages/command_injection/buttle@0.3.1, size: 4229, cloc: 772
Finished /media/data/lsong18/data/vulPackages/command_injection/buttle@0.3.1, size: 4229, cloc: 772
No 5
Running /media/data/lsong18/data/vulPackages/command_injection/printer@0.0.1, size: 361, cloc: 375
Finished /media/data/lsong18/data/vulPackages/command_injection/printer@0.0.1, size: 361, cloc: 375
No 6
Running /media/data/lsong18/data/vulPackages/command_injection/pidusage@1.1.4, size: 1543, cloc: 752
Skip /media/data/lsong18/data/vulPackages/command_injection/pidusage@1.1.4/test/bench.js for no signature functions
Finished /media/data/lsong18/data/vulPackages/command_injection/pidusage@1.1.4, size: 1543, cloc: 752
No 7
Running /media/data/lsong18/data/vulPackages/command_injection/fs-git@1.0.1, size: 196, cloc: 434
Finished /media/data/lsong18/data/vulPackages/command_injection/fs-git@1.0.1, size: 196, cloc: 434
No 8
Running /media/data/lsong18/data/vulPackages/command_injection/wxchangba@1.0.3, size: 23084, cloc: 21008
Skip /media/data/lsong18/data/vulPackages/command_injection/wxchangba@1.0.3/config-demo/dev.js for no signature functions
Skip /media/data/lsong18/data/vulPackages/command_injection/wxchangba@1.0.3/config-demo/index.js for no signature functions
Skip /media/data/lsong18/data/vulPackages/command_injection/wxchangba@1.0.3/gulpfile.js for no signature functions
No 9
Running /media/data/lsong18/data/vulPackages/command_injection/wiki-plugin-datalog@0.1.5, size: 1742, cloc: 1803
Skip /media/data/lsong18/data/vulPackages/command_injection/wiki-plugin-datalog@0.1.5/client/datalog.js for no signature functions
Finished /media/data/lsong18/data/vulPackages/command_injection/wiki-plugin-datalog@0.1.5, size: 1742, cloc: 1803
No 10
Running /media/data/lsong18/data/vulPackages/command_injection/opencv@6.0.0, size: 740226, cloc: 741400
ERROR when generate graph for /media/data/lsong18/data/vulPackages/command_injection/opencv@6.0.0/examples/addweighted.js.
not enough values to unpack (expected 4, got 3)
Traceback (most recent call last):
  File "callfunctionGenerator.py", line 223, in test_file
    G = unittest_main('__test__.js', check_signatures=get_all_sign_list())
  File "../simurun/launcher.py", line 30, in unittest_main
    result = analyze_files(G, file_path, check_signatures=check_signatures)
  File "../simurun/objectGraphGenerator.py", line 1875, in analyze_files
    generate_obj_graph(G, str(start_node_id))
  File "../simurun/objectGraphGenerator.py", line 1862, in generate_obj_graph
    handle_node(G, entry_nodeid)
  File "../simurun/objectGraphGenerator.py", line 646, in handle_node
    handle_node(G, child, extra)
  File "../simurun/objectGraphGenerator.py", line 735, in handle_node
    module_exports_objs = run_toplevel_file(G, node_id)
  File "../simurun/objectGraphGenerator.py", line 1339, in run_toplevel_file
    simurun_function(G, node_id, block_scope=True)
  File "../simurun/objectGraphGenerator.py", line 1113, in simurun_function
    block_scope=block_scope, decl_var=True)
  File "../simurun/objectGraphGenerator.py", line 1141, in simurun_block
    handled_res = handle_node(G, stmt, ExtraInfo(branches=branches))
  File "../simurun/objectGraphGenerator.py", line 649, in handle_node
    return handle_assign(G, node_id, extra)
  File "../simurun/objectGraphGenerator.py", line 387, in handle_assign
    handle_node(G, right, ExtraInfo(extra, side='right'))
  File "../simurun/objectGraphGenerator.py", line 860, in handle_node
    returned_objs, used_objs = ast_call_function(G, node_id, extra)
  File "../simurun/objectGraphGenerator.py", line 1477, in ast_call_function
    module_exports_objs = handle_require(G, ast_node)
  File "../simurun/objectGraphGenerator.py", line 1388, in handle_require
    get_module_exports(G, file_path)
  File "../simurun/objectGraphGenerator.py", line 1447, in get_module_exports
    module_exports_objs = run_toplevel_file(G, node)
  File "../simurun/objectGraphGenerator.py", line 1339, in run_toplevel_file
    simurun_function(G, node_id, block_scope=True)
  File "../simurun/objectGraphGenerator.py", line 1113, in simurun_function
    block_scope=block_scope, decl_var=True)
  File "../simurun/objectGraphGenerator.py", line 1141, in simurun_block
    handled_res = handle_node(G, stmt, ExtraInfo(branches=branches))
  File "../simurun/objectGraphGenerator.py", line 649, in handle_node
    return handle_assign(G, node_id, extra)
  File "../simurun/objectGraphGenerator.py", line 387, in handle_assign
    handle_node(G, right, ExtraInfo(extra, side='right'))
  File "../simurun/objectGraphGenerator.py", line 860, in handle_node
    returned_objs, used_objs = ast_call_function(G, node_id, extra)
  File "../simurun/objectGraphGenerator.py", line 1477, in ast_call_function
    module_exports_objs = handle_require(G, ast_node)
  File "../simurun/objectGraphGenerator.py", line 1388, in handle_require
    get_module_exports(G, file_path)
  File "../simurun/objectGraphGenerator.py", line 1447, in get_module_exports
    module_exports_objs = run_toplevel_file(G, node)
  File "../simurun/objectGraphGenerator.py", line 1339, in run_toplevel_file
    simurun_function(G, node_id, block_scope=True)
  File "../simurun/objectGraphGenerator.py", line 1113, in simurun_function
    block_scope=block_scope, decl_var=True)
  File "../simurun/objectGraphGenerator.py", line 1141, in simurun_block
    handled_res = handle_node(G, stmt, ExtraInfo(branches=branches))
  File "../simurun/objectGraphGenerator.py", line 649, in handle_node
    return handle_assign(G, node_id, extra)
  File "../simurun/objectGraphGenerator.py", line 387, in handle_assign
    handle_node(G, right, ExtraInfo(extra, side='right'))
  File "../simurun/objectGraphGenerator.py", line 649, in handle_node
    return handle_assign(G, node_id, extra)
  File "../simurun/objectGraphGenerator.py", line 387, in handle_assign
    handle_node(G, right, ExtraInfo(extra, side='right'))
  File "../simurun/objectGraphGenerator.py", line 860, in handle_node
    returned_objs, used_objs = ast_call_function(G, node_id, extra)
  File "../simurun/objectGraphGenerator.py", line 1477, in ast_call_function
    module_exports_objs = handle_require(G, ast_node)
  File "../simurun/objectGraphGenerator.py", line 1388, in handle_require
    get_module_exports(G, file_path)
  File "../simurun/objectGraphGenerator.py", line 1447, in get_module_exports
    module_exports_objs = run_toplevel_file(G, node)
  File "../simurun/objectGraphGenerator.py", line 1339, in run_toplevel_file
    simurun_function(G, node_id, block_scope=True)
  File "../simurun/objectGraphGenerator.py", line 1113, in simurun_function
    block_scope=block_scope, decl_var=True)
  File "../simurun/objectGraphGenerator.py", line 1141, in simurun_block
    handled_res = handle_node(G, stmt, ExtraInfo(branches=branches))
  File "../simurun/objectGraphGenerator.py", line 649, in handle_node
    return handle_assign(G, node_id, extra)
  File "../simurun/objectGraphGenerator.py", line 387, in handle_assign
    handle_node(G, right, ExtraInfo(extra, side='right'))
  File "../simurun/objectGraphGenerator.py", line 860, in handle_node
    returned_objs, used_objs = ast_call_function(G, node_id, extra)
  File "../simurun/objectGraphGenerator.py", line 1477, in ast_call_function
    module_exports_objs = handle_require(G, ast_node)
  File "../simurun/objectGraphGenerator.py", line 1388, in handle_require
    get_module_exports(G, file_path)
  File "../simurun/objectGraphGenerator.py", line 1447, in get_module_exports
    module_exports_objs = run_toplevel_file(G, node)
  File "../simurun/objectGraphGenerator.py", line 1339, in run_toplevel_file
    simurun_function(G, node_id, block_scope=True)
  File "../simurun/objectGraphGenerator.py", line 1113, in simurun_function
    block_scope=block_scope, decl_var=True)
  File "../simurun/objectGraphGenerator.py", line 1141, in simurun_block
    handled_res = handle_node(G, stmt, ExtraInfo(branches=branches))
  File "../simurun/objectGraphGenerator.py", line 649, in handle_node
    return handle_assign(G, node_id, extra)
  File "../simurun/objectGraphGenerator.py", line 387, in handle_assign
    handle_node(G, right, ExtraInfo(extra, side='right'))
  File "../simurun/objectGraphGenerator.py", line 860, in handle_node
    returned_objs, used_objs = ast_call_function(G, node_id, extra)
  File "../simurun/objectGraphGenerator.py", line 1477, in ast_call_function
    module_exports_objs = handle_require(G, ast_node)
  File "../simurun/objectGraphGenerator.py", line 1388, in handle_require
    get_module_exports(G, file_path)
  File "../simurun/objectGraphGenerator.py", line 1447, in get_module_exports
    module_exports_objs = run_toplevel_file(G, node)
  File "../simurun/objectGraphGenerator.py", line 1339, in run_toplevel_file
    simurun_function(G, node_id, block_scope=True)
  File "../simurun/objectGraphGenerator.py", line 1113, in simurun_function
    block_scope=block_scope, decl_var=True)
  File "../simurun/objectGraphGenerator.py", line 1141, in simurun_block
    handled_res = handle_node(G, stmt, ExtraInfo(branches=branches))
  File "../simurun/objectGraphGenerator.py", line 649, in handle_node
    return handle_assign(G, node_id, extra)
  File "../simurun/objectGraphGenerator.py", line 387, in handle_assign
    handle_node(G, right, ExtraInfo(extra, side='right'))
  File "../simurun/objectGraphGenerator.py", line 860, in handle_node
    returned_objs, used_objs = ast_call_function(G, node_id, extra)
  File "../simurun/objectGraphGenerator.py", line 1477, in ast_call_function
    module_exports_objs = handle_require(G, ast_node)
  File "../simurun/objectGraphGenerator.py", line 1388, in handle_require
    get_module_exports(G, file_path)
  File "../simurun/objectGraphGenerator.py", line 1447, in get_module_exports
    module_exports_objs = run_toplevel_file(G, node)
  File "../simurun/objectGraphGenerator.py", line 1339, in run_toplevel_file
    simurun_function(G, node_id, block_scope=True)
  File "../simurun/objectGraphGenerator.py", line 1113, in simurun_function
    block_scope=block_scope, decl_var=True)
  File "../simurun/objectGraphGenerator.py", line 1141, in simurun_block
    handled_res = handle_node(G, stmt, ExtraInfo(branches=branches))
  File "../simurun/objectGraphGenerator.py", line 649, in handle_node
    return handle_assign(G, node_id, extra)
  File "../simurun/objectGraphGenerator.py", line 387, in handle_assign
    handle_node(G, right, ExtraInfo(extra, side='right'))
  File "../simurun/objectGraphGenerator.py", line 860, in handle_node
    returned_objs, used_objs = ast_call_function(G, node_id, extra)
  File "../simurun/objectGraphGenerator.py", line 1477, in ast_call_function
    module_exports_objs = handle_require(G, ast_node)
  File "../simurun/objectGraphGenerator.py", line 1388, in handle_require
    get_module_exports(G, file_path)
  File "../simurun/objectGraphGenerator.py", line 1447, in get_module_exports
    module_exports_objs = run_toplevel_file(G, node)
  File "../simurun/objectGraphGenerator.py", line 1339, in run_toplevel_file
    simurun_function(G, node_id, block_scope=True)
  File "../simurun/objectGraphGenerator.py", line 1113, in simurun_function
    block_scope=block_scope, decl_var=True)
  File "../simurun/objectGraphGenerator.py", line 1141, in simurun_block
    handled_res = handle_node(G, stmt, ExtraInfo(branches=branches))
  File "../simurun/objectGraphGenerator.py", line 649, in handle_node
    return handle_assign(G, node_id, extra)
  File "../simurun/objectGraphGenerator.py", line 387, in handle_assign
    handle_node(G, right, ExtraInfo(extra, side='right'))
  File "../simurun/objectGraphGenerator.py", line 649, in handle_node
    return handle_assign(G, node_id, extra)
  File "../simurun/objectGraphGenerator.py", line 387, in handle_assign
    handle_node(G, right, ExtraInfo(extra, side='right'))
  File "../simurun/objectGraphGenerator.py", line 860, in handle_node
    returned_objs, used_objs = ast_call_function(G, node_id, extra)
  File "../simurun/objectGraphGenerator.py", line 1477, in ast_call_function
    module_exports_objs = handle_require(G, ast_node)
  File "../simurun/objectGraphGenerator.py", line 1388, in handle_require
    get_module_exports(G, file_path)
  File "../simurun/objectGraphGenerator.py", line 1447, in get_module_exports
    module_exports_objs = run_toplevel_file(G, node)
  File "../simurun/objectGraphGenerator.py", line 1339, in run_toplevel_file
    simurun_function(G, node_id, block_scope=True)
  File "../simurun/objectGraphGenerator.py", line 1113, in simurun_function
    block_scope=block_scope, decl_var=True)
  File "../simurun/objectGraphGenerator.py", line 1141, in simurun_block
    handled_res = handle_node(G, stmt, ExtraInfo(branches=branches))
  File "../simurun/objectGraphGenerator.py", line 860, in handle_node
    returned_objs, used_objs = ast_call_function(G, node_id, extra)
  File "../simurun/objectGraphGenerator.py", line 1575, in ast_call_function
    stmt_id=stmt_id, func_name=func_name)
  File "../simurun/objectGraphGenerator.py", line 1779, in call_function
    extra=extra, stmt_id=stmt_id)
  File "../simurun/objectGraphGenerator.py", line 1745, in call_function
    G, func_ast, branches=next_branches, caller_ast=caller_ast)
  File "../simurun/objectGraphGenerator.py", line 1113, in simurun_function
    block_scope=block_scope, decl_var=True)
  File "../simurun/objectGraphGenerator.py", line 1141, in simurun_block
    handled_res = handle_node(G, stmt, ExtraInfo(branches=branches))
  File "../simurun/objectGraphGenerator.py", line 876, in handle_node
    handle_node(G, if_elem, ExtraInfo(extra, branches=branches+[branch_tag]))
  File "../simurun/objectGraphGenerator.py", line 891, in handle_node
    simurun_block(G, body, G.cur_scope, extra.branches)
  File "../simurun/objectGraphGenerator.py", line 1141, in simurun_block
    handled_res = handle_node(G, stmt, ExtraInfo(branches=branches))
  File "../simurun/objectGraphGenerator.py", line 866, in handle_node
    return handle_node(G, returned_exp, extra)
  File "../simurun/objectGraphGenerator.py", line 860, in handle_node
    returned_objs, used_objs = ast_call_function(G, node_id, extra)
  File "../simurun/objectGraphGenerator.py", line 1575, in ast_call_function
    stmt_id=stmt_id, func_name=func_name)
  File "../simurun/objectGraphGenerator.py", line 1737, in call_function
    caller_ast, func_ast, branches=next_branches)
  File "../simurun/objectGraphGenerator.py", line 548, in instantiate_obj
    caller_ast=exp_ast_node)
  File "../simurun/objectGraphGenerator.py", line 1113, in simurun_function
    block_scope=block_scope, decl_var=True)
  File "../simurun/objectGraphGenerator.py", line 1141, in simurun_block
    handled_res = handle_node(G, stmt, ExtraInfo(branches=branches))
  File "../simurun/objectGraphGenerator.py", line 876, in handle_node
    handle_node(G, if_elem, ExtraInfo(extra, branches=branches+[branch_tag]))
  File "../simurun/objectGraphGenerator.py", line 891, in handle_node
    simurun_block(G, body, G.cur_scope, extra.branches)
  File "../simurun/objectGraphGenerator.py", line 1141, in simurun_block
    handled_res = handle_node(G, stmt, ExtraInfo(branches=branches))
  File "../simurun/objectGraphGenerator.py", line 866, in handle_node
    return handle_node(G, returned_exp, extra)
  File "../simurun/objectGraphGenerator.py", line 860, in handle_node
    returned_objs, used_objs = ast_call_function(G, node_id, extra)
  File "../simurun/objectGraphGenerator.py", line 1575, in ast_call_function
    stmt_id=stmt_id, func_name=func_name)
  File "../simurun/objectGraphGenerator.py", line 1737, in call_function
    caller_ast, func_ast, branches=next_branches)
  File "../simurun/objectGraphGenerator.py", line 548, in instantiate_obj
    caller_ast=exp_ast_node)
  File "../simurun/objectGraphGenerator.py", line 1113, in simurun_function
    block_scope=block_scope, decl_var=True)
  File "../simurun/objectGraphGenerator.py", line 1141, in simurun_block
    handled_res = handle_node(G, stmt, ExtraInfo(branches=branches))
  File "../simurun/objectGraphGenerator.py", line 876, in handle_node
    handle_node(G, if_elem, ExtraInfo(extra, branches=branches+[branch_tag]))
  File "../simurun/objectGraphGenerator.py", line 891, in handle_node
    simurun_block(G, body, G.cur_scope, extra.branches)
  File "../simurun/objectGraphGenerator.py", line 1141, in simurun_block
    handled_res = handle_node(G, stmt, ExtraInfo(branches=branches))
  File "../simurun/objectGraphGenerator.py", line 866, in handle_node
    return handle_node(G, returned_exp, extra)
  File "../simurun/objectGraphGenerator.py", line 860, in handle_node
    returned_objs, used_objs = ast_call_function(G, node_id, extra)
  File "../simurun/objectGraphGenerator.py", line 1575, in ast_call_function
    stmt_id=stmt_id, func_name=func_name)
  File "../simurun/objectGraphGenerator.py", line 1737, in call_function
    caller_ast, func_ast, branches=next_branches)
  File "../simurun/objectGraphGenerator.py", line 548, in instantiate_obj
    caller_ast=exp_ast_node)
  File "../simurun/objectGraphGenerator.py", line 1113, in simurun_function
    block_scope=block_scope, decl_var=True)
  File "../simurun/objectGraphGenerator.py", line 1141, in simurun_block
    handled_res = handle_node(G, stmt, ExtraInfo(branches=branches))
  File "../simurun/objectGraphGenerator.py", line 649, in handle_node
    return handle_assign(G, node_id, extra)
  File "../simurun/objectGraphGenerator.py", line 387, in handle_assign
    handle_node(G, right, ExtraInfo(extra, side='right'))
  File "../simurun/objectGraphGenerator.py", line 860, in handle_node
    returned_objs, used_objs = ast_call_function(G, node_id, extra)
  File "../simurun/objectGraphGenerator.py", line 1575, in ast_call_function
    stmt_id=stmt_id, func_name=func_name)
  File "../simurun/objectGraphGenerator.py", line 1737, in call_function
    caller_ast, func_ast, branches=next_branches)
  File "../simurun/objectGraphGenerator.py", line 548, in instantiate_obj
    caller_ast=exp_ast_node)
  File "../simurun/objectGraphGenerator.py", line 1113, in simurun_function
    block_scope=block_scope, decl_var=True)
  File "../simurun/objectGraphGenerator.py", line 1141, in simurun_block
    handled_res = handle_node(G, stmt, ExtraInfo(branches=branches))
  File "../simurun/objectGraphGenerator.py", line 876, in handle_node
    handle_node(G, if_elem, ExtraInfo(extra, branches=branches+[branch_tag]))
  File "../simurun/objectGraphGenerator.py", line 891, in handle_node
    simurun_block(G, body, G.cur_scope, extra.branches)
  File "../simurun/objectGraphGenerator.py", line 1141, in simurun_block
    handled_res = handle_node(G, stmt, ExtraInfo(branches=branches))
  File "../simurun/objectGraphGenerator.py", line 876, in handle_node
    handle_node(G, if_elem, ExtraInfo(extra, branches=branches+[branch_tag]))
  File "../simurun/objectGraphGenerator.py", line 891, in handle_node
    simurun_block(G, body, G.cur_scope, extra.branches)
  File "../simurun/objectGraphGenerator.py", line 1141, in simurun_block
    handled_res = handle_node(G, stmt, ExtraInfo(branches=branches))
  File "../simurun/objectGraphGenerator.py", line 649, in handle_node
    return handle_assign(G, node_id, extra)
  File "../simurun/objectGraphGenerator.py", line 387, in handle_assign
    handle_node(G, right, ExtraInfo(extra, side='right'))
  File "../simurun/objectGraphGenerator.py", line 732, in handle_node
    return handle_prop(G, node_id, extra)[0]
  File "../simurun/objectGraphGenerator.py", line 294, in handle_prop
    handled_parent = handle_node(G, parent, extra)
  File "../simurun/objectGraphGenerator.py", line 860, in handle_node
    returned_objs, used_objs = ast_call_function(G, node_id, extra)
  File "../simurun/objectGraphGenerator.py", line 1510, in ast_call_function
    extra=extra, is_new=True, mark_fake_args=True)
  File "../simurun/objectGraphGenerator.py", line 1737, in call_function
    caller_ast, func_ast, branches=next_branches)
  File "../simurun/objectGraphGenerator.py", line 548, in instantiate_obj
    caller_ast=exp_ast_node)
  File "../simurun/objectGraphGenerator.py", line 1113, in simurun_function
    block_scope=block_scope, decl_var=True)
  File "../simurun/objectGraphGenerator.py", line 1141, in simurun_block
    handled_res = handle_node(G, stmt, ExtraInfo(branches=branches))
  File "../simurun/objectGraphGenerator.py", line 937, in handle_node
    init, cond, inc, body = G.get_ordered_ast_child_nodes(node_id)[:4]
ValueError: not enough values to unpack (expected 4, got 3)

No 11
Running /media/data/lsong18/data/vulPackages/command_injection/gitlabhook@0.0.17, size: 7595, cloc: 486
Finished /media/data/lsong18/data/vulPackages/command_injection/gitlabhook@0.0.17, size: 7595, cloc: 486
No 12
Running /media/data/lsong18/data/vulPackages/command_injection/macaddress@0.2.8, size: 4335, cloc: 406
Skip /media/data/lsong18/data/vulPackages/command_injection/macaddress@0.2.8/gulpfile.js for no signature functions
Finished /media/data/lsong18/data/vulPackages/command_injection/macaddress@0.2.8, size: 4335, cloc: 406
No 13
Running /media/data/lsong18/data/vulPackages/command_injection/node-wifi@2.0.11, size: 1246, cloc: 1695
Finished /media/data/lsong18/data/vulPackages/command_injection/node-wifi@2.0.11, size: 1246, cloc: 1695
No 14
Running /media/data/lsong18/data/vulPackages/command_injection/open@0.0.5, size: 830, cloc: 946
Finished /media/data/lsong18/data/vulPackages/command_injection/open@0.0.5, size: 830, cloc: 946
No 15
Running /media/data/lsong18/data/vulPackages/command_injection/windows-cpu@0.1.4, size: 9867, cloc: 771
Finished /media/data/lsong18/data/vulPackages/command_injection/windows-cpu@0.1.4, size: 9867, cloc: 771
No 16
Running /media/data/lsong18/data/vulPackages/command_injection/gm@1.20.0, size: 5541, cloc: 3837
Finished /media/data/lsong18/data/vulPackages/command_injection/gm@1.20.0, size: 5541, cloc: 3837
No 17
Running /media/data/lsong18/data/vulPackages/command_injection/codem-transcode@0.4.4, size: 1115, cloc: 1357
No 18
Running /media/data/lsong18/data/vulPackages/command_injection/libnotify@1.0.3, size: 382, cloc: 146
Finished /media/data/lsong18/data/vulPackages/command_injection/libnotify@1.0.3, size: 382, cloc: 146
No 19
Running /media/data/lsong18/data/vulPackages/command_injection/soletta-dev-app@0.0.7, size: 74130, cloc: 74426
Skip /media/data/lsong18/data/vulPackages/command_injection/soletta-dev-app@0.0.7/client/js/ace/mode-fbp.js for no signature functions
Skip /media/data/lsong18/data/vulPackages/command_injection/soletta-dev-app@0.0.7/client/js/app.js for no signature functions
Skip /media/data/lsong18/data/vulPackages/command_injection/soletta-dev-app@0.0.7/client/js/collapse/ui-bootstrap-custom-0.13.1.min.js for no signature functions
Skip /media/data/lsong18/data/vulPackages/command_injection/soletta-dev-app@0.0.7/client/js/combobox/jquery-ui-custom-combobox.js for no signature functions
Skip /media/data/lsong18/data/vulPackages/command_injection/soletta-dev-app@0.0.7/client/js/controllers.js for no signature functions
Skip /media/data/lsong18/data/vulPackages/command_injection/soletta-dev-app@0.0.7/client/js/controllers/cheat_sheet.js for no signature functions
Skip /media/data/lsong18/data/vulPackages/command_injection/soletta-dev-app@0.0.7/client/js/controllers/editor.js for no signature functions
Skip /media/data/lsong18/data/vulPackages/command_injection/soletta-dev-app@0.0.7/client/js/controllers/journal.js for no signature functions
Skip /media/data/lsong18/data/vulPackages/command_injection/soletta-dev-app@0.0.7/client/js/controllers/menu.js for no signature functions
Skip /media/data/lsong18/data/vulPackages/command_injection/soletta-dev-app@0.0.7/client/js/factory.js for no signature functions
Skip /media/data/lsong18/data/vulPackages/command_injection/soletta-dev-app@0.0.7/client/jstree/jstree.min.js for no signature functions
Skip /media/data/lsong18/data/vulPackages/command_injection/soletta-dev-app@0.0.7/protractor.config.js for no signature functions
Skip /media/data/lsong18/data/vulPackages/command_injection/soletta-dev-app@0.0.7/server/nodetypes/nodetypes.js for no signature functions
ERROR when generate graph for /media/data/lsong18/data/vulPackages/command_injection/soletta-dev-app@0.0.7/test_case/00_run_server.js.
float() argument must be a string or a number, not 'NoneType'
Traceback (most recent call last):
  File "callfunctionGenerator.py", line 223, in test_file
    G = unittest_main('__test__.js', check_signatures=get_all_sign_list())
  File "../simurun/launcher.py", line 30, in unittest_main
    result = analyze_files(G, file_path, check_signatures=check_signatures)
  File "../simurun/objectGraphGenerator.py", line 1875, in analyze_files
    generate_obj_graph(G, str(start_node_id))
  File "../simurun/objectGraphGenerator.py", line 1862, in generate_obj_graph
    handle_node(G, entry_nodeid)
  File "../simurun/objectGraphGenerator.py", line 646, in handle_node
    handle_node(G, child, extra)
  File "../simurun/objectGraphGenerator.py", line 735, in handle_node
    module_exports_objs = run_toplevel_file(G, node_id)
  File "../simurun/objectGraphGenerator.py", line 1339, in run_toplevel_file
    simurun_function(G, node_id, block_scope=True)
  File "../simurun/objectGraphGenerator.py", line 1113, in simurun_function
    block_scope=block_scope, decl_var=True)
  File "../simurun/objectGraphGenerator.py", line 1141, in simurun_block
    handled_res = handle_node(G, stmt, ExtraInfo(branches=branches))
  File "../simurun/objectGraphGenerator.py", line 649, in handle_node
    return handle_assign(G, node_id, extra)
  File "../simurun/objectGraphGenerator.py", line 387, in handle_assign
    handle_node(G, right, ExtraInfo(extra, side='right'))
  File "../simurun/objectGraphGenerator.py", line 860, in handle_node
    returned_objs, used_objs = ast_call_function(G, node_id, extra)
  File "../simurun/objectGraphGenerator.py", line 1477, in ast_call_function
    module_exports_objs = handle_require(G, ast_node)
  File "../simurun/objectGraphGenerator.py", line 1388, in handle_require
    get_module_exports(G, file_path)
  File "../simurun/objectGraphGenerator.py", line 1447, in get_module_exports
    module_exports_objs = run_toplevel_file(G, node)
  File "../simurun/objectGraphGenerator.py", line 1339, in run_toplevel_file
    simurun_function(G, node_id, block_scope=True)
  File "../simurun/objectGraphGenerator.py", line 1113, in simurun_function
    block_scope=block_scope, decl_var=True)
  File "../simurun/objectGraphGenerator.py", line 1141, in simurun_block
    handled_res = handle_node(G, stmt, ExtraInfo(branches=branches))
  File "../simurun/objectGraphGenerator.py", line 860, in handle_node
    returned_objs, used_objs = ast_call_function(G, node_id, extra)
  File "../simurun/objectGraphGenerator.py", line 1575, in ast_call_function
    stmt_id=stmt_id, func_name=func_name)
  File "../simurun/objectGraphGenerator.py", line 1779, in call_function
    extra=extra, stmt_id=stmt_id)
  File "../simurun/objectGraphGenerator.py", line 1745, in call_function
    G, func_ast, branches=next_branches, caller_ast=caller_ast)
  File "../simurun/objectGraphGenerator.py", line 1113, in simurun_function
    block_scope=block_scope, decl_var=True)
  File "../simurun/objectGraphGenerator.py", line 1141, in simurun_block
    handled_res = handle_node(G, stmt, ExtraInfo(branches=branches))
  File "../simurun/objectGraphGenerator.py", line 649, in handle_node
    return handle_assign(G, node_id, extra)
  File "../simurun/objectGraphGenerator.py", line 387, in handle_assign
    handle_node(G, right, ExtraInfo(extra, side='right'))
  File "../simurun/objectGraphGenerator.py", line 860, in handle_node
    returned_objs, used_objs = ast_call_function(G, node_id, extra)
  File "../simurun/objectGraphGenerator.py", line 1569, in ast_call_function
    handled_arg = handle_node(G, arg, extra)
  File "../simurun/objectGraphGenerator.py", line 860, in handle_node
    returned_objs, used_objs = ast_call_function(G, node_id, extra)
  File "../simurun/objectGraphGenerator.py", line 1477, in ast_call_function
    module_exports_objs = handle_require(G, ast_node)
  File "../simurun/objectGraphGenerator.py", line 1388, in handle_require
    get_module_exports(G, file_path)
  File "../simurun/objectGraphGenerator.py", line 1447, in get_module_exports
    module_exports_objs = run_toplevel_file(G, node)
  File "../simurun/objectGraphGenerator.py", line 1339, in run_toplevel_file
    simurun_function(G, node_id, block_scope=True)
  File "../simurun/objectGraphGenerator.py", line 1113, in simurun_function
    block_scope=block_scope, decl_var=True)
  File "../simurun/objectGraphGenerator.py", line 1141, in simurun_block
    handled_res = handle_node(G, stmt, ExtraInfo(branches=branches))
  File "../simurun/objectGraphGenerator.py", line 860, in handle_node
    returned_objs, used_objs = ast_call_function(G, node_id, extra)
  File "../simurun/objectGraphGenerator.py", line 1575, in ast_call_function
    stmt_id=stmt_id, func_name=func_name)
  File "../simurun/objectGraphGenerator.py", line 1745, in call_function
    G, func_ast, branches=next_branches, caller_ast=caller_ast)
  File "../simurun/objectGraphGenerator.py", line 1113, in simurun_function
    block_scope=block_scope, decl_var=True)
  File "../simurun/objectGraphGenerator.py", line 1141, in simurun_block
    handled_res = handle_node(G, stmt, ExtraInfo(branches=branches))
  File "../simurun/objectGraphGenerator.py", line 649, in handle_node
    return handle_assign(G, node_id, extra)
  File "../simurun/objectGraphGenerator.py", line 387, in handle_assign
    handle_node(G, right, ExtraInfo(extra, side='right'))
  File "../simurun/objectGraphGenerator.py", line 860, in handle_node
    returned_objs, used_objs = ast_call_function(G, node_id, extra)
  File "../simurun/objectGraphGenerator.py", line 1477, in ast_call_function
    module_exports_objs = handle_require(G, ast_node)
  File "../simurun/objectGraphGenerator.py", line 1388, in handle_require
    get_module_exports(G, file_path)
  File "../simurun/objectGraphGenerator.py", line 1447, in get_module_exports
    module_exports_objs = run_toplevel_file(G, node)
  File "../simurun/objectGraphGenerator.py", line 1339, in run_toplevel_file
    simurun_function(G, node_id, block_scope=True)
  File "../simurun/objectGraphGenerator.py", line 1113, in simurun_function
    block_scope=block_scope, decl_var=True)
  File "../simurun/objectGraphGenerator.py", line 1141, in simurun_block
    handled_res = handle_node(G, stmt, ExtraInfo(branches=branches))
  File "../simurun/objectGraphGenerator.py", line 860, in handle_node
    returned_objs, used_objs = ast_call_function(G, node_id, extra)
  File "../simurun/objectGraphGenerator.py", line 1575, in ast_call_function
    stmt_id=stmt_id, func_name=func_name)
  File "../simurun/objectGraphGenerator.py", line 1745, in call_function
    G, func_ast, branches=next_branches, caller_ast=caller_ast)
  File "../simurun/objectGraphGenerator.py", line 1113, in simurun_function
    block_scope=block_scope, decl_var=True)
  File "../simurun/objectGraphGenerator.py", line 1141, in simurun_block
    handled_res = handle_node(G, stmt, ExtraInfo(branches=branches))
  File "../simurun/objectGraphGenerator.py", line 860, in handle_node
    returned_objs, used_objs = ast_call_function(G, node_id, extra)
  File "../simurun/objectGraphGenerator.py", line 1474, in ast_call_function
    handled_callee = handle_node(G, callee, extra)
  File "../simurun/objectGraphGenerator.py", line 860, in handle_node
    returned_objs, used_objs = ast_call_function(G, node_id, extra)
  File "../simurun/objectGraphGenerator.py", line 1510, in ast_call_function
    extra=extra, is_new=True, mark_fake_args=True)
  File "../simurun/objectGraphGenerator.py", line 1737, in call_function
    caller_ast, func_ast, branches=next_branches)
  File "../simurun/objectGraphGenerator.py", line 548, in instantiate_obj
    caller_ast=exp_ast_node)
  File "../simurun/objectGraphGenerator.py", line 1113, in simurun_function
    block_scope=block_scope, decl_var=True)
  File "../simurun/objectGraphGenerator.py", line 1141, in simurun_block
    handled_res = handle_node(G, stmt, ExtraInfo(branches=branches))
  File "../simurun/objectGraphGenerator.py", line 860, in handle_node
    returned_objs, used_objs = ast_call_function(G, node_id, extra)
  File "../simurun/objectGraphGenerator.py", line 1575, in ast_call_function
    stmt_id=stmt_id, func_name=func_name)
  File "../simurun/objectGraphGenerator.py", line 1779, in call_function
    extra=extra, stmt_id=stmt_id)
  File "../simurun/objectGraphGenerator.py", line 1745, in call_function
    G, func_ast, branches=next_branches, caller_ast=caller_ast)
  File "../simurun/objectGraphGenerator.py", line 1113, in simurun_function
    block_scope=block_scope, decl_var=True)
  File "../simurun/objectGraphGenerator.py", line 1141, in simurun_block
    handled_res = handle_node(G, stmt, ExtraInfo(branches=branches))
  File "../simurun/objectGraphGenerator.py", line 876, in handle_node
    handle_node(G, if_elem, ExtraInfo(extra, branches=branches+[branch_tag]))
  File "../simurun/objectGraphGenerator.py", line 891, in handle_node
    simurun_block(G, body, G.cur_scope, extra.branches)
  File "../simurun/objectGraphGenerator.py", line 1141, in simurun_block
    handled_res = handle_node(G, stmt, ExtraInfo(branches=branches))
  File "../simurun/objectGraphGenerator.py", line 956, in handle_node
    result = handle_node(G, inc, extra) # do the inc
  File "../simurun/objectGraphGenerator.py", line 933, in handle_node
    result = handle_node(G, child, extra)
  File "../simurun/objectGraphGenerator.py", line 1026, in handle_node
    n = val_to_float(v)
  File "../simurun/helpers.py", line 177, in val_to_float
    return float(value)
TypeError: float() argument must be a string or a number, not 'NoneType'

No 20
Running /media/data/lsong18/data/vulPackages/command_injection/entitlements@1.2.0, size: 1027, cloc: 171
Finished /media/data/lsong18/data/vulPackages/command_injection/entitlements@1.2.0, size: 1027, cloc: 171
No 21
Running /media/data/lsong18/data/vulPackages/command_injection/pdfinfojs@0.4.0, size: 991, cloc: 1000
Finished /media/data/lsong18/data/vulPackages/command_injection/pdfinfojs@0.4.0, size: 991, cloc: 1000
No 22
Running /media/data/lsong18/data/vulPackages/command_injection/ungit@0.8.4, size: 53319, cloc: 53973
Skip /media/data/lsong18/data/vulPackages/command_injection/ungit@0.8.4/components/app/app.bundle.js for no signature functions
Skip /media/data/lsong18/data/vulPackages/command_injection/ungit@0.8.4/components/app/app.js for no signature functions
Skip /media/data/lsong18/data/vulPackages/command_injection/ungit@0.8.4/components/commitdiff/commitdiff.bundle.js for no signature functions
Skip /media/data/lsong18/data/vulPackages/command_injection/ungit@0.8.4/components/commitdiff/commitdiff.js for no signature functions
Skip /media/data/lsong18/data/vulPackages/command_injection/ungit@0.8.4/components/dialogs/dialogs.bundle.js for no signature functions
Skip /media/data/lsong18/data/vulPackages/command_injection/ungit@0.8.4/components/dialogs/dialogs.js for no signature functions
Skip /media/data/lsong18/data/vulPackages/command_injection/ungit@0.8.4/components/gitErrors/gitErrors.bundle.js for no signature functions
Skip /media/data/lsong18/data/vulPackages/command_injection/ungit@0.8.4/components/gitErrors/gitErrors.js for no signature functions
Skip /media/data/lsong18/data/vulPackages/command_injection/ungit@0.8.4/components/graph/graph.bundle.js for no signature functions
Skip /media/data/lsong18/data/vulPackages/command_injection/ungit@0.8.4/components/graph/graph.js for no signature functions
Skip /media/data/lsong18/data/vulPackages/command_injection/ungit@0.8.4/components/header/header.bundle.js for no signature functions
Skip /media/data/lsong18/data/vulPackages/command_injection/ungit@0.8.4/components/header/header.js for no signature functions
Skip /media/data/lsong18/data/vulPackages/command_injection/ungit@0.8.4/components/home/home.bundle.js for no signature functions
Skip /media/data/lsong18/data/vulPackages/command_injection/ungit@0.8.4/components/home/home.js for no signature functions
Skip /media/data/lsong18/data/vulPackages/command_injection/ungit@0.8.4/components/imagediff/imagediff.bundle.js for no signature functions
Skip /media/data/lsong18/data/vulPackages/command_injection/ungit@0.8.4/components/imagediff/imagediff.js for no signature functions
Skip /media/data/lsong18/data/vulPackages/command_injection/ungit@0.8.4/components/login/login.bundle.js for no signature functions
Skip /media/data/lsong18/data/vulPackages/command_injection/ungit@0.8.4/components/login/login.js for no signature functions
Skip /media/data/lsong18/data/vulPackages/command_injection/ungit@0.8.4/components/path/path.bundle.js for no signature functions
Skip /media/data/lsong18/data/vulPackages/command_injection/ungit@0.8.4/components/path/path.js for no signature functions
Skip /media/data/lsong18/data/vulPackages/command_injection/ungit@0.8.4/components/progressBar/progressBar.bundle.js for no signature functions
Skip /media/data/lsong18/data/vulPackages/command_injection/ungit@0.8.4/components/progressBar/progressBar.js for no signature functions
Skip /media/data/lsong18/data/vulPackages/command_injection/ungit@0.8.4/components/remotes/remotes.bundle.js for no signature functions
Skip /media/data/lsong18/data/vulPackages/command_injection/ungit@0.8.4/components/remotes/remotes.js for no signature functions
Skip /media/data/lsong18/data/vulPackages/command_injection/ungit@0.8.4/components/repository/repository.bundle.js for no signature functions
Skip /media/data/lsong18/data/vulPackages/command_injection/ungit@0.8.4/components/repository/repository.js for no signature functions
Skip /media/data/lsong18/data/vulPackages/command_injection/ungit@0.8.4/components/staging/staging.bundle.js for no signature functions
Skip /media/data/lsong18/data/vulPackages/command_injection/ungit@0.8.4/components/staging/staging.js for no signature functions
Skip /media/data/lsong18/data/vulPackages/command_injection/ungit@0.8.4/components/stash/stash.bundle.js for no signature functions
Skip /media/data/lsong18/data/vulPackages/command_injection/ungit@0.8.4/components/stash/stash.js for no signature functions
Skip /media/data/lsong18/data/vulPackages/command_injection/ungit@0.8.4/components/submodules/submodules.bundle.js for no signature functions
Skip /media/data/lsong18/data/vulPackages/command_injection/ungit@0.8.4/components/textdiff/textdiff.bundle.js for no signature functions
Skip /media/data/lsong18/data/vulPackages/command_injection/ungit@0.8.4/components/textdiff/textdiff.js for no signature functions
Skip /media/data/lsong18/data/vulPackages/command_injection/ungit@0.8.4/public/devStyling/devStyling.js for no signature functions
Skip /media/data/lsong18/data/vulPackages/command_injection/ungit@0.8.4/public/js/raven.min.js for no signature functions
Skip /media/data/lsong18/data/vulPackages/command_injection/ungit@0.8.4/public/js/tracker.js for no signature functions
Skip /media/data/lsong18/data/vulPackages/command_injection/ungit@0.8.4/public/js/ungit.js for no signature functions
Skip /media/data/lsong18/data/vulPackages/command_injection/ungit@0.8.4/source/utils/blockable.js for no signature functions
Finished /media/data/lsong18/data/vulPackages/command_injection/ungit@0.8.4, size: 53319, cloc: 53973
No 23
Running /media/data/lsong18/data/vulPackages/command_injection/command-exists@1.2.3, size: 280, cloc: 398
Skip /media/data/lsong18/data/vulPackages/command_injection/command-exists@1.2.3/test/executable-script.js for no signature functions
Skip /media/data/lsong18/data/vulPackages/command_injection/command-exists@1.2.3/test/non-executable-script.js for no signature functions
Finished /media/data/lsong18/data/vulPackages/command_injection/command-exists@1.2.3, size: 280, cloc: 398
No 24
Running /media/data/lsong18/data/vulPackages/command_injection/kill-port@1.3.1, size: 8260, cloc: 7181
No 25
Running /media/data/lsong18/data/vulPackages/command_injection/fs-path@0.0.24, size: 264, cloc: 465
Finished /media/data/lsong18/data/vulPackages/command_injection/fs-path@0.0.24, size: 264, cloc: 465
No 26
Running /media/data/lsong18/data/vulPackages/command_injection/dot@1.1.2, size: 17363, cloc: 2347
Skip /media/data/lsong18/data/vulPackages/command_injection/dot@1.1.2/benchmarks/compileBench.js for no signature functions
Skip /media/data/lsong18/data/vulPackages/command_injection/dot@1.1.2/benchmarks/templatesBench.js for no signature functions
Skip /media/data/lsong18/data/vulPackages/command_injection/dot@1.1.2/doT.min.js for no signature functions
Skip /media/data/lsong18/data/vulPackages/command_injection/dot@1.1.2/doU.js for no signature functions
Skip /media/data/lsong18/data/vulPackages/command_injection/dot@1.1.2/examples/customdoT.js for no signature functions
Skip /media/data/lsong18/data/vulPackages/command_injection/dot@1.1.2/examples/withdoT.js for no signature functions
Skip /media/data/lsong18/data/vulPackages/command_injection/dot@1.1.2/index.js for no signature functions
Skip /media/data/lsong18/data/vulPackages/command_injection/dot@1.1.2/test/conditionals.test.js for no signature functions
Skip /media/data/lsong18/data/vulPackages/command_injection/dot@1.1.2/test/defines.test.js for no signature functions
Skip /media/data/lsong18/data/vulPackages/command_injection/dot@1.1.2/test/dot.test.js for no signature functions
Skip /media/data/lsong18/data/vulPackages/command_injection/dot@1.1.2/test/iteration.test.js for no signature functions
Finished /media/data/lsong18/data/vulPackages/command_injection/dot@1.1.2, size: 17363, cloc: 2347
No 27
Running /media/data/lsong18/data/vulPackages/command_injection/expressfs@0.2.10, size: 15079, cloc: 4010
Finished /media/data/lsong18/data/vulPackages/command_injection/expressfs@0.2.10, size: 15079, cloc: 4010
No 28
Running /media/data/lsong18/data/vulPackages/command_injection/libnmap@0.4.5, size: 1414, cloc: 4424
Skip /media/data/lsong18/data/vulPackages/command_injection/libnmap@0.4.5/.c9/metadata/workspace/examples/accuracy.js for no signature functions
Skip /media/data/lsong18/data/vulPackages/command_injection/libnmap@0.4.5/.c9/metadata/workspace/examples/blocksize.js for no signature functions
Skip /media/data/lsong18/data/vulPackages/command_injection/libnmap@0.4.5/.c9/metadata/workspace/examples/default.js for no signature functions
Skip /media/data/lsong18/data/vulPackages/command_injection/libnmap@0.4.5/.c9/metadata/workspace/examples/default2io.js for no signature functions
Skip /media/data/lsong18/data/vulPackages/command_injection/libnmap@0.4.5/.c9/metadata/workspace/examples/discover.js for no signature functions
Skip /media/data/lsong18/data/vulPackages/command_injection/libnmap@0.4.5/.c9/metadata/workspace/examples/ipv6.js for no signature functions
Skip /media/data/lsong18/data/vulPackages/command_injection/libnmap@0.4.5/.c9/metadata/workspace/examples/ports.js for no signature functions
Skip /media/data/lsong18/data/vulPackages/command_injection/libnmap@0.4.5/.c9/metadata/workspace/examples/scan.js for no signature functions
Skip /media/data/lsong18/data/vulPackages/command_injection/libnmap@0.4.5/.c9/metadata/workspace/examples/test.js for no signature functions
Skip /media/data/lsong18/data/vulPackages/command_injection/libnmap@0.4.5/.c9/metadata/workspace/examples/threshold.js for no signature functions
Skip /media/data/lsong18/data/vulPackages/command_injection/libnmap@0.4.5/.c9/metadata/workspace/examples/timeout.js for no signature functions
Skip /media/data/lsong18/data/vulPackages/command_injection/libnmap@0.4.5/.c9/metadata/workspace/examples/udp.js for no signature functions
Skip /media/data/lsong18/data/vulPackages/command_injection/libnmap@0.4.5/.c9/metadata/workspace/examples/xml.js for no signature functions
Skip /media/data/lsong18/data/vulPackages/command_injection/libnmap@0.4.5/.c9/metadata/workspace/index.js for no signature functions
Skip /media/data/lsong18/data/vulPackages/command_injection/libnmap@0.4.5/.c9/metadata/workspace/lib/libnmap.js for no signature functions
Skip /media/data/lsong18/data/vulPackages/command_injection/libnmap@0.4.5/.c9/metadata/workspace/test/cp-mocks.js for no signature functions
Skip /media/data/lsong18/data/vulPackages/command_injection/libnmap@0.4.5/.c9/metadata/workspace/test/discover.js for no signature functions
Skip /media/data/lsong18/data/vulPackages/command_injection/libnmap@0.4.5/.c9/metadata/workspace/test/errors.js for no signature functions
Skip /media/data/lsong18/data/vulPackages/command_injection/libnmap@0.4.5/.c9/metadata/workspace/test/init.js for no signature functions
Skip /media/data/lsong18/data/vulPackages/command_injection/libnmap@0.4.5/.c9/metadata/workspace/test/ranges.js for no signature functions
Skip /media/data/lsong18/data/vulPackages/command_injection/libnmap@0.4.5/.c9/metadata/workspace/~/.c9/init.js for no signature functions
ERROR when generate graph for /media/data/lsong18/data/vulPackages/command_injection/libnmap@0.4.5/examples/accuracy.js.
sequence item 0: expected str instance, NoneType found
Traceback (most recent call last):
  File "callfunctionGenerator.py", line 223, in test_file
    G = unittest_main('__test__.js', check_signatures=get_all_sign_list())
  File "../simurun/launcher.py", line 30, in unittest_main
    result = analyze_files(G, file_path, check_signatures=check_signatures)
  File "../simurun/objectGraphGenerator.py", line 1875, in analyze_files
    generate_obj_graph(G, str(start_node_id))
  File "../simurun/objectGraphGenerator.py", line 1862, in generate_obj_graph
    handle_node(G, entry_nodeid)
  File "../simurun/objectGraphGenerator.py", line 646, in handle_node
    handle_node(G, child, extra)
  File "../simurun/objectGraphGenerator.py", line 735, in handle_node
    module_exports_objs = run_toplevel_file(G, node_id)
  File "../simurun/objectGraphGenerator.py", line 1339, in run_toplevel_file
    simurun_function(G, node_id, block_scope=True)
  File "../simurun/objectGraphGenerator.py", line 1113, in simurun_function
    block_scope=block_scope, decl_var=True)
  File "../simurun/objectGraphGenerator.py", line 1141, in simurun_block
    handled_res = handle_node(G, stmt, ExtraInfo(branches=branches))
  File "../simurun/objectGraphGenerator.py", line 649, in handle_node
    return handle_assign(G, node_id, extra)
  File "../simurun/objectGraphGenerator.py", line 387, in handle_assign
    handle_node(G, right, ExtraInfo(extra, side='right'))
  File "../simurun/objectGraphGenerator.py", line 860, in handle_node
    returned_objs, used_objs = ast_call_function(G, node_id, extra)
  File "../simurun/objectGraphGenerator.py", line 1477, in ast_call_function
    module_exports_objs = handle_require(G, ast_node)
  File "../simurun/objectGraphGenerator.py", line 1388, in handle_require
    get_module_exports(G, file_path)
  File "../simurun/objectGraphGenerator.py", line 1447, in get_module_exports
    module_exports_objs = run_toplevel_file(G, node)
  File "../simurun/objectGraphGenerator.py", line 1339, in run_toplevel_file
    simurun_function(G, node_id, block_scope=True)
  File "../simurun/objectGraphGenerator.py", line 1113, in simurun_function
    block_scope=block_scope, decl_var=True)
  File "../simurun/objectGraphGenerator.py", line 1141, in simurun_block
    handled_res = handle_node(G, stmt, ExtraInfo(branches=branches))
  File "../simurun/objectGraphGenerator.py", line 649, in handle_node
    return handle_assign(G, node_id, extra)
  File "../simurun/objectGraphGenerator.py", line 387, in handle_assign
    handle_node(G, right, ExtraInfo(extra, side='right'))
  File "../simurun/objectGraphGenerator.py", line 860, in handle_node
    returned_objs, used_objs = ast_call_function(G, node_id, extra)
  File "../simurun/objectGraphGenerator.py", line 1477, in ast_call_function
    module_exports_objs = handle_require(G, ast_node)
  File "../simurun/objectGraphGenerator.py", line 1388, in handle_require
    get_module_exports(G, file_path)
  File "../simurun/objectGraphGenerator.py", line 1447, in get_module_exports
    module_exports_objs = run_toplevel_file(G, node)
  File "../simurun/objectGraphGenerator.py", line 1339, in run_toplevel_file
    simurun_function(G, node_id, block_scope=True)
  File "../simurun/objectGraphGenerator.py", line 1113, in simurun_function
    block_scope=block_scope, decl_var=True)
  File "../simurun/objectGraphGenerator.py", line 1141, in simurun_block
    handled_res = handle_node(G, stmt, ExtraInfo(branches=branches))
  File "../simurun/objectGraphGenerator.py", line 649, in handle_node
    return handle_assign(G, node_id, extra)
  File "../simurun/objectGraphGenerator.py", line 387, in handle_assign
    handle_node(G, right, ExtraInfo(extra, side='right'))
  File "../simurun/objectGraphGenerator.py", line 860, in handle_node
    returned_objs, used_objs = ast_call_function(G, node_id, extra)
  File "../simurun/objectGraphGenerator.py", line 1510, in ast_call_function
    extra=extra, is_new=True, mark_fake_args=True)
  File "../simurun/objectGraphGenerator.py", line 1737, in call_function
    caller_ast, func_ast, branches=next_branches)
  File "../simurun/objectGraphGenerator.py", line 548, in instantiate_obj
    caller_ast=exp_ast_node)
  File "../simurun/objectGraphGenerator.py", line 1113, in simurun_function
    block_scope=block_scope, decl_var=True)
  File "../simurun/objectGraphGenerator.py", line 1141, in simurun_block
    handled_res = handle_node(G, stmt, ExtraInfo(branches=branches))
  File "../simurun/objectGraphGenerator.py", line 860, in handle_node
    returned_objs, used_objs = ast_call_function(G, node_id, extra)
  File "../simurun/objectGraphGenerator.py", line 1575, in ast_call_function
    stmt_id=stmt_id, func_name=func_name)
  File "../simurun/objectGraphGenerator.py", line 1745, in call_function
    G, func_ast, branches=next_branches, caller_ast=caller_ast)
  File "../simurun/objectGraphGenerator.py", line 1113, in simurun_function
    block_scope=block_scope, decl_var=True)
  File "../simurun/objectGraphGenerator.py", line 1141, in simurun_block
    handled_res = handle_node(G, stmt, ExtraInfo(branches=branches))
  File "../simurun/objectGraphGenerator.py", line 860, in handle_node
    returned_objs, used_objs = ast_call_function(G, node_id, extra)
  File "../simurun/objectGraphGenerator.py", line 1575, in ast_call_function
    stmt_id=stmt_id, func_name=func_name)
  File "../simurun/objectGraphGenerator.py", line 1745, in call_function
    G, func_ast, branches=next_branches, caller_ast=caller_ast)
  File "../simurun/objectGraphGenerator.py", line 1113, in simurun_function
    block_scope=block_scope, decl_var=True)
  File "../simurun/objectGraphGenerator.py", line 1141, in simurun_block
    handled_res = handle_node(G, stmt, ExtraInfo(branches=branches))
  File "../simurun/objectGraphGenerator.py", line 866, in handle_node
    return handle_node(G, returned_exp, extra)
  File "../simurun/objectGraphGenerator.py", line 923, in handle_node
    h1 = handle_node(G, consequent, extra)
  File "../simurun/objectGraphGenerator.py", line 860, in handle_node
    returned_objs, used_objs = ast_call_function(G, node_id, extra)
  File "../simurun/objectGraphGenerator.py", line 1575, in ast_call_function
    stmt_id=stmt_id, func_name=func_name)
  File "../simurun/objectGraphGenerator.py", line 1745, in call_function
    G, func_ast, branches=next_branches, caller_ast=caller_ast)
  File "../simurun/objectGraphGenerator.py", line 1113, in simurun_function
    block_scope=block_scope, decl_var=True)
  File "../simurun/objectGraphGenerator.py", line 1141, in simurun_block
    handled_res = handle_node(G, stmt, ExtraInfo(branches=branches))
  File "../simurun/objectGraphGenerator.py", line 649, in handle_node
    return handle_assign(G, node_id, extra)
  File "../simurun/objectGraphGenerator.py", line 387, in handle_assign
    handle_node(G, right, ExtraInfo(extra, side='right'))
  File "../simurun/objectGraphGenerator.py", line 860, in handle_node
    returned_objs, used_objs = ast_call_function(G, node_id, extra)
  File "../simurun/objectGraphGenerator.py", line 1575, in ast_call_function
    stmt_id=stmt_id, func_name=func_name)
  File "../simurun/objectGraphGenerator.py", line 1745, in call_function
    G, func_ast, branches=next_branches, caller_ast=caller_ast)
  File "../simurun/objectGraphGenerator.py", line 1113, in simurun_function
    block_scope=block_scope, decl_var=True)
  File "../simurun/objectGraphGenerator.py", line 1141, in simurun_block
    handled_res = handle_node(G, stmt, ExtraInfo(branches=branches))
  File "../simurun/objectGraphGenerator.py", line 860, in handle_node
    returned_objs, used_objs = ast_call_function(G, node_id, extra)
  File "../simurun/objectGraphGenerator.py", line 1575, in ast_call_function
    stmt_id=stmt_id, func_name=func_name)
  File "../simurun/objectGraphGenerator.py", line 1671, in call_function
    h = python_func(G, caller_ast, extra, _this, *_args)
  File "../simurun/modeled_js_builtins.py", line 203, in array_p_for_each_value
    this=this, extra=extra, caller_ast=caller_ast)
  File "../simurun/objectGraphGenerator.py", line 1745, in call_function
    G, func_ast, branches=next_branches, caller_ast=caller_ast)
  File "../simurun/objectGraphGenerator.py", line 1113, in simurun_function
    block_scope=block_scope, decl_var=True)
  File "../simurun/objectGraphGenerator.py", line 1141, in simurun_block
    handled_res = handle_node(G, stmt, ExtraInfo(branches=branches))
  File "../simurun/objectGraphGenerator.py", line 649, in handle_node
    return handle_assign(G, node_id, extra)
  File "../simurun/objectGraphGenerator.py", line 431, in handle_assign
    handled_left = handle_node(G, left, ExtraInfo(extra, side='left'))
  File "../simurun/objectGraphGenerator.py", line 729, in handle_node
    return handle_prop(G, node_id, extra)[0]
  File "../simurun/objectGraphGenerator.py", line 359, in handle_prop
    name = f'{parent_name}.{"/".join(prop_names)}'
TypeError: sequence item 0: expected str instance, NoneType found

No 29
Running /media/data/lsong18/data/vulPackages/command_injection/egg-scripts@2.8.0, size: 2759, cloc: 2592
Finished /media/data/lsong18/data/vulPackages/command_injection/egg-scripts@2.8.0, size: 2759, cloc: 2592
No 30
Running /media/data/lsong18/data/vulPackages/command_injection/apex-publish-static-files@2.0.0, size: 4715, cloc: 1752
Skip /media/data/lsong18/data/vulPackages/command_injection/apex-publish-static-files@2.0.0/lib/distUpload.js for no signature functions
Skip /media/data/lsong18/data/vulPackages/command_injection/apex-publish-static-files@2.0.0/lib/util.js for no signature functions
Skip /media/data/lsong18/data/vulPackages/command_injection/apex-publish-static-files@2.0.0/test.js for no signature functions
Finished /media/data/lsong18/data/vulPackages/command_injection/apex-publish-static-files@2.0.0, size: 4715, cloc: 1752
No 31
Running /media/data/lsong18/data/vulPackages/command_injection/hubot-scripts@2.4.3, size: 26263, cloc: 26532
Skip /media/data/lsong18/data/vulPackages/command_injection/hubot-scripts@2.4.3/src/scripts/ethperpadlite-ideas.js for no signature functions
Skip /media/data/lsong18/data/vulPackages/command_injection/hubot-scripts@2.4.3/src/scripts/redis-notify.js for no signature functions
Skip /media/data/lsong18/data/vulPackages/command_injection/hubot-scripts@2.4.3/src/scripts/xmas.js for no signature functions
Finished /media/data/lsong18/data/vulPackages/command_injection/hubot-scripts@2.4.3, size: 26263, cloc: 26532
No 32
Running /media/data/lsong18/data/vulPackages/command_injection/tomato@0.0.7, size: 4152, cloc: 1768
Finished /media/data/lsong18/data/vulPackages/command_injection/tomato@0.0.7, size: 4152, cloc: 1768
No 33
Running /media/data/lsong18/data/vulPackages/command_injection/dns-sync@0.1.0, size: 3075, cloc: 3292
Skip /media/data/lsong18/data/vulPackages/command_injection/dns-sync@0.1.0/scripts/dns-lookup-script.js for no signature functions
ERROR when generate graph for /media/data/lsong18/data/vulPackages/command_injection/dns-sync@0.1.0/test/test.js.
bad escape (end of pattern) at position 2
Traceback (most recent call last):
  File "callfunctionGenerator.py", line 223, in test_file
    G = unittest_main('__test__.js', check_signatures=get_all_sign_list())
  File "../simurun/launcher.py", line 30, in unittest_main
    result = analyze_files(G, file_path, check_signatures=check_signatures)
  File "../simurun/objectGraphGenerator.py", line 1875, in analyze_files
    generate_obj_graph(G, str(start_node_id))
  File "../simurun/objectGraphGenerator.py", line 1862, in generate_obj_graph
    handle_node(G, entry_nodeid)
  File "../simurun/objectGraphGenerator.py", line 646, in handle_node
    handle_node(G, child, extra)
  File "../simurun/objectGraphGenerator.py", line 735, in handle_node
    module_exports_objs = run_toplevel_file(G, node_id)
  File "../simurun/objectGraphGenerator.py", line 1339, in run_toplevel_file
    simurun_function(G, node_id, block_scope=True)
  File "../simurun/objectGraphGenerator.py", line 1113, in simurun_function
    block_scope=block_scope, decl_var=True)
  File "../simurun/objectGraphGenerator.py", line 1141, in simurun_block
    handled_res = handle_node(G, stmt, ExtraInfo(branches=branches))
  File "../simurun/objectGraphGenerator.py", line 649, in handle_node
    return handle_assign(G, node_id, extra)
  File "../simurun/objectGraphGenerator.py", line 387, in handle_assign
    handle_node(G, right, ExtraInfo(extra, side='right'))
  File "../simurun/objectGraphGenerator.py", line 860, in handle_node
    returned_objs, used_objs = ast_call_function(G, node_id, extra)
  File "../simurun/objectGraphGenerator.py", line 1477, in ast_call_function
    module_exports_objs = handle_require(G, ast_node)
  File "../simurun/objectGraphGenerator.py", line 1388, in handle_require
    get_module_exports(G, file_path)
  File "../simurun/objectGraphGenerator.py", line 1447, in get_module_exports
    module_exports_objs = run_toplevel_file(G, node)
  File "../simurun/objectGraphGenerator.py", line 1339, in run_toplevel_file
    simurun_function(G, node_id, block_scope=True)
  File "../simurun/objectGraphGenerator.py", line 1113, in simurun_function
    block_scope=block_scope, decl_var=True)
  File "../simurun/objectGraphGenerator.py", line 1141, in simurun_block
    handled_res = handle_node(G, stmt, ExtraInfo(branches=branches))
  File "../simurun/objectGraphGenerator.py", line 649, in handle_node
    return handle_assign(G, node_id, extra)
  File "../simurun/objectGraphGenerator.py", line 387, in handle_assign
    handle_node(G, right, ExtraInfo(extra, side='right'))
  File "../simurun/objectGraphGenerator.py", line 860, in handle_node
    returned_objs, used_objs = ast_call_function(G, node_id, extra)
  File "../simurun/objectGraphGenerator.py", line 1477, in ast_call_function
    module_exports_objs = handle_require(G, ast_node)
  File "../simurun/objectGraphGenerator.py", line 1388, in handle_require
    get_module_exports(G, file_path)
  File "../simurun/objectGraphGenerator.py", line 1447, in get_module_exports
    module_exports_objs = run_toplevel_file(G, node)
  File "../simurun/objectGraphGenerator.py", line 1339, in run_toplevel_file
    simurun_function(G, node_id, block_scope=True)
  File "../simurun/objectGraphGenerator.py", line 1113, in simurun_function
    block_scope=block_scope, decl_var=True)
  File "../simurun/objectGraphGenerator.py", line 1141, in simurun_block
    handled_res = handle_node(G, stmt, ExtraInfo(branches=branches))
  File "../simurun/objectGraphGenerator.py", line 649, in handle_node
    return handle_assign(G, node_id, extra)
  File "../simurun/objectGraphGenerator.py", line 387, in handle_assign
    handle_node(G, right, ExtraInfo(extra, side='right'))
  File "../simurun/objectGraphGenerator.py", line 649, in handle_node
    return handle_assign(G, node_id, extra)
  File "../simurun/objectGraphGenerator.py", line 387, in handle_assign
    handle_node(G, right, ExtraInfo(extra, side='right'))
  File "../simurun/objectGraphGenerator.py", line 860, in handle_node
    returned_objs, used_objs = ast_call_function(G, node_id, extra)
  File "../simurun/objectGraphGenerator.py", line 1477, in ast_call_function
    module_exports_objs = handle_require(G, ast_node)
  File "../simurun/objectGraphGenerator.py", line 1388, in handle_require
    get_module_exports(G, file_path)
  File "../simurun/objectGraphGenerator.py", line 1447, in get_module_exports
    module_exports_objs = run_toplevel_file(G, node)
  File "../simurun/objectGraphGenerator.py", line 1339, in run_toplevel_file
    simurun_function(G, node_id, block_scope=True)
  File "../simurun/objectGraphGenerator.py", line 1113, in simurun_function
    block_scope=block_scope, decl_var=True)
  File "../simurun/objectGraphGenerator.py", line 1141, in simurun_block
    handled_res = handle_node(G, stmt, ExtraInfo(branches=branches))
  File "../simurun/objectGraphGenerator.py", line 649, in handle_node
    return handle_assign(G, node_id, extra)
  File "../simurun/objectGraphGenerator.py", line 387, in handle_assign
    handle_node(G, right, ExtraInfo(extra, side='right'))
  File "../simurun/objectGraphGenerator.py", line 860, in handle_node
    returned_objs, used_objs = ast_call_function(G, node_id, extra)
  File "../simurun/objectGraphGenerator.py", line 1477, in ast_call_function
    module_exports_objs = handle_require(G, ast_node)
  File "../simurun/objectGraphGenerator.py", line 1388, in handle_require
    get_module_exports(G, file_path)
  File "../simurun/objectGraphGenerator.py", line 1447, in get_module_exports
    module_exports_objs = run_toplevel_file(G, node)
  File "../simurun/objectGraphGenerator.py", line 1339, in run_toplevel_file
    simurun_function(G, node_id, block_scope=True)
  File "../simurun/objectGraphGenerator.py", line 1113, in simurun_function
    block_scope=block_scope, decl_var=True)
  File "../simurun/objectGraphGenerator.py", line 1141, in simurun_block
    handled_res = handle_node(G, stmt, ExtraInfo(branches=branches))
  File "../simurun/objectGraphGenerator.py", line 649, in handle_node
    return handle_assign(G, node_id, extra)
  File "../simurun/objectGraphGenerator.py", line 387, in handle_assign
    handle_node(G, right, ExtraInfo(extra, side='right'))
  File "../simurun/objectGraphGenerator.py", line 860, in handle_node
    returned_objs, used_objs = ast_call_function(G, node_id, extra)
  File "../simurun/objectGraphGenerator.py", line 1477, in ast_call_function
    module_exports_objs = handle_require(G, ast_node)
  File "../simurun/objectGraphGenerator.py", line 1388, in handle_require
    get_module_exports(G, file_path)
  File "../simurun/objectGraphGenerator.py", line 1447, in get_module_exports
    module_exports_objs = run_toplevel_file(G, node)
  File "../simurun/objectGraphGenerator.py", line 1339, in run_toplevel_file
    simurun_function(G, node_id, block_scope=True)
  File "../simurun/objectGraphGenerator.py", line 1113, in simurun_function
    block_scope=block_scope, decl_var=True)
  File "../simurun/objectGraphGenerator.py", line 1141, in simurun_block
    handled_res = handle_node(G, stmt, ExtraInfo(branches=branches))
  File "../simurun/objectGraphGenerator.py", line 649, in handle_node
    return handle_assign(G, node_id, extra)
  File "../simurun/objectGraphGenerator.py", line 387, in handle_assign
    handle_node(G, right, ExtraInfo(extra, side='right'))
  File "../simurun/objectGraphGenerator.py", line 860, in handle_node
    returned_objs, used_objs = ast_call_function(G, node_id, extra)
  File "../simurun/objectGraphGenerator.py", line 1510, in ast_call_function
    extra=extra, is_new=True, mark_fake_args=True)
  File "../simurun/objectGraphGenerator.py", line 1737, in call_function
    caller_ast, func_ast, branches=next_branches)
  File "../simurun/objectGraphGenerator.py", line 548, in instantiate_obj
    caller_ast=exp_ast_node)
  File "../simurun/objectGraphGenerator.py", line 1113, in simurun_function
    block_scope=block_scope, decl_var=True)
  File "../simurun/objectGraphGenerator.py", line 1141, in simurun_block
    handled_res = handle_node(G, stmt, ExtraInfo(branches=branches))
  File "../simurun/objectGraphGenerator.py", line 860, in handle_node
    returned_objs, used_objs = ast_call_function(G, node_id, extra)
  File "../simurun/objectGraphGenerator.py", line 1575, in ast_call_function
    stmt_id=stmt_id, func_name=func_name)
  File "../simurun/objectGraphGenerator.py", line 1671, in call_function
    h = python_func(G, caller_ast, extra, _this, *_args)
  File "../simurun/modeled_js_builtins.py", line 203, in array_p_for_each_value
    this=this, extra=extra, caller_ast=caller_ast)
  File "../simurun/objectGraphGenerator.py", line 1745, in call_function
    G, func_ast, branches=next_branches, caller_ast=caller_ast)
  File "../simurun/objectGraphGenerator.py", line 1113, in simurun_function
    block_scope=block_scope, decl_var=True)
  File "../simurun/objectGraphGenerator.py", line 1141, in simurun_block
    handled_res = handle_node(G, stmt, ExtraInfo(branches=branches))
  File "../simurun/objectGraphGenerator.py", line 876, in handle_node
    handle_node(G, if_elem, ExtraInfo(extra, branches=branches+[branch_tag]))
  File "../simurun/objectGraphGenerator.py", line 891, in handle_node
    simurun_block(G, body, G.cur_scope, extra.branches)
  File "../simurun/objectGraphGenerator.py", line 1141, in simurun_block
    handled_res = handle_node(G, stmt, ExtraInfo(branches=branches))
  File "../simurun/objectGraphGenerator.py", line 876, in handle_node
    handle_node(G, if_elem, ExtraInfo(extra, branches=branches+[branch_tag]))
  File "../simurun/objectGraphGenerator.py", line 891, in handle_node
    simurun_block(G, body, G.cur_scope, extra.branches)
  File "../simurun/objectGraphGenerator.py", line 1141, in simurun_block
    handled_res = handle_node(G, stmt, ExtraInfo(branches=branches))
  File "../simurun/objectGraphGenerator.py", line 860, in handle_node
    returned_objs, used_objs = ast_call_function(G, node_id, extra)
  File "../simurun/objectGraphGenerator.py", line 1575, in ast_call_function
    stmt_id=stmt_id, func_name=func_name)
  File "../simurun/objectGraphGenerator.py", line 1745, in call_function
    G, func_ast, branches=next_branches, caller_ast=caller_ast)
  File "../simurun/objectGraphGenerator.py", line 1113, in simurun_function
    block_scope=block_scope, decl_var=True)
  File "../simurun/objectGraphGenerator.py", line 1141, in simurun_block
    handled_res = handle_node(G, stmt, ExtraInfo(branches=branches))
  File "../simurun/objectGraphGenerator.py", line 876, in handle_node
    handle_node(G, if_elem, ExtraInfo(extra, branches=branches+[branch_tag]))
  File "../simurun/objectGraphGenerator.py", line 891, in handle_node
    simurun_block(G, body, G.cur_scope, extra.branches)
  File "../simurun/objectGraphGenerator.py", line 1141, in simurun_block
    handled_res = handle_node(G, stmt, ExtraInfo(branches=branches))
  File "../simurun/objectGraphGenerator.py", line 649, in handle_node
    return handle_assign(G, node_id, extra)
  File "../simurun/objectGraphGenerator.py", line 387, in handle_assign
    handle_node(G, right, ExtraInfo(extra, side='right'))
  File "../simurun/objectGraphGenerator.py", line 860, in handle_node
    returned_objs, used_objs = ast_call_function(G, node_id, extra)
  File "../simurun/objectGraphGenerator.py", line 1575, in ast_call_function
    stmt_id=stmt_id, func_name=func_name)
  File "../simurun/objectGraphGenerator.py", line 1671, in call_function
    h = python_func(G, caller_ast, extra, _this, *_args)
  File "../simurun/modeled_js_builtins.py", line 819, in string_p_replace
    r, glob, sticky = convert_to_python_re(ssv)
  File "../simurun/modeled_js_builtins.py", line 1125, in convert_to_python_re
    return re.compile(pattern, f), glob, sticky
  File "/usr/lib/python3.7/re.py", line 234, in compile
    return _compile(pattern, flags)
  File "/usr/lib/python3.7/re.py", line 286, in _compile
    p = sre_compile.compile(pattern, flags)
  File "/usr/lib/python3.7/sre_compile.py", line 764, in compile
    p = sre_parse.parse(p, flags)
  File "/usr/lib/python3.7/sre_parse.py", line 930, in parse
    p = _parse_sub(source, pattern, flags & SRE_FLAG_VERBOSE, 0)
  File "/usr/lib/python3.7/sre_parse.py", line 426, in _parse_sub
    not nested and not items))
  File "/usr/lib/python3.7/sre_parse.py", line 493, in _parse
    sourceget()
  File "/usr/lib/python3.7/sre_parse.py", line 256, in get
    self.__next()
  File "/usr/lib/python3.7/sre_parse.py", line 246, in __next
    self.string, len(self.string) - 1) from None
re.error: bad escape (end of pattern) at position 2

No 34
Running /media/data/lsong18/data/vulPackages/command_injection/addax@1.0.6, size: 6215, cloc: 716
Skip /media/data/lsong18/data/vulPackages/command_injection/addax@1.0.6/.eslintrc.js for no signature functions
Finished /media/data/lsong18/data/vulPackages/command_injection/addax@1.0.6, size: 6215, cloc: 716
No 35
Running /media/data/lsong18/data/vulPackages/command_injection/wizard-syncronizer@0.0.1, size: 10137, cloc: 969
Skip /media/data/lsong18/data/vulPackages/command_injection/wizard-syncronizer@0.0.1/bin/wizard-commit.js for no signature functions
Skip /media/data/lsong18/data/vulPackages/command_injection/wizard-syncronizer@0.0.1/bin/wizard-config.js for no signature functions
Skip /media/data/lsong18/data/vulPackages/command_injection/wizard-syncronizer@0.0.1/bin/wizard-init.js for no signature functions
Skip /media/data/lsong18/data/vulPackages/command_injection/wizard-syncronizer@0.0.1/bin/wizard-login.js for no signature functions
Skip /media/data/lsong18/data/vulPackages/command_injection/wizard-syncronizer@0.0.1/index.js for no signature functions
ERROR when generate graph for /media/data/lsong18/data/vulPackages/command_injection/wizard-syncronizer@0.0.1/package.js.
float() argument must be a string or a number, not 'NoneType'
Traceback (most recent call last):
  File "callfunctionGenerator.py", line 223, in test_file
    G = unittest_main('__test__.js', check_signatures=get_all_sign_list())
  File "../simurun/launcher.py", line 30, in unittest_main
    result = analyze_files(G, file_path, check_signatures=check_signatures)
  File "../simurun/objectGraphGenerator.py", line 1875, in analyze_files
    generate_obj_graph(G, str(start_node_id))
  File "../simurun/objectGraphGenerator.py", line 1862, in generate_obj_graph
    handle_node(G, entry_nodeid)
  File "../simurun/objectGraphGenerator.py", line 646, in handle_node
    handle_node(G, child, extra)
  File "../simurun/objectGraphGenerator.py", line 735, in handle_node
    module_exports_objs = run_toplevel_file(G, node_id)
  File "../simurun/objectGraphGenerator.py", line 1339, in run_toplevel_file
    simurun_function(G, node_id, block_scope=True)
  File "../simurun/objectGraphGenerator.py", line 1113, in simurun_function
    block_scope=block_scope, decl_var=True)
  File "../simurun/objectGraphGenerator.py", line 1141, in simurun_block
    handled_res = handle_node(G, stmt, ExtraInfo(branches=branches))
  File "../simurun/objectGraphGenerator.py", line 649, in handle_node
    return handle_assign(G, node_id, extra)
  File "../simurun/objectGraphGenerator.py", line 387, in handle_assign
    handle_node(G, right, ExtraInfo(extra, side='right'))
  File "../simurun/objectGraphGenerator.py", line 860, in handle_node
    returned_objs, used_objs = ast_call_function(G, node_id, extra)
  File "../simurun/objectGraphGenerator.py", line 1510, in ast_call_function
    extra=extra, is_new=True, mark_fake_args=True)
  File "../simurun/objectGraphGenerator.py", line 1737, in call_function
    caller_ast, func_ast, branches=next_branches)
  File "../simurun/objectGraphGenerator.py", line 548, in instantiate_obj
    caller_ast=exp_ast_node)
  File "../simurun/objectGraphGenerator.py", line 1113, in simurun_function
    block_scope=block_scope, decl_var=True)
  File "../simurun/objectGraphGenerator.py", line 1141, in simurun_block
    handled_res = handle_node(G, stmt, ExtraInfo(branches=branches))
  File "../simurun/objectGraphGenerator.py", line 860, in handle_node
    returned_objs, used_objs = ast_call_function(G, node_id, extra)
  File "../simurun/objectGraphGenerator.py", line 1575, in ast_call_function
    stmt_id=stmt_id, func_name=func_name)
  File "../simurun/objectGraphGenerator.py", line 1779, in call_function
    extra=extra, stmt_id=stmt_id)
  File "../simurun/objectGraphGenerator.py", line 1745, in call_function
    G, func_ast, branches=next_branches, caller_ast=caller_ast)
  File "../simurun/objectGraphGenerator.py", line 1113, in simurun_function
    block_scope=block_scope, decl_var=True)
  File "../simurun/objectGraphGenerator.py", line 1141, in simurun_block
    handled_res = handle_node(G, stmt, ExtraInfo(branches=branches))
  File "../simurun/objectGraphGenerator.py", line 956, in handle_node
    result = handle_node(G, inc, extra) # do the inc
  File "../simurun/objectGraphGenerator.py", line 933, in handle_node
    result = handle_node(G, child, extra)
  File "../simurun/objectGraphGenerator.py", line 1026, in handle_node
    n = val_to_float(v)
  File "../simurun/helpers.py", line 177, in val_to_float
    return float(value)
TypeError: float() argument must be a string or a number, not 'NoneType'

No 36
Running /media/data/lsong18/data/vulPackages/command_injection/samsung-remote@1.2.5, size: 355, cloc: 467
Finished /media/data/lsong18/data/vulPackages/command_injection/samsung-remote@1.2.5, size: 355, cloc: 467
No 37
Running /media/data/lsong18/data/vulPackages/command_injection/pdf-image@1.0.5, size: 4730, cloc: 332
Finished /media/data/lsong18/data/vulPackages/command_injection/pdf-image@1.0.5, size: 4730, cloc: 332
No 38
Running /media/data/lsong18/data/vulPackages/command_injection/local-devices@2.0.0, size: 2089, cloc: 2346
Finished /media/data/lsong18/data/vulPackages/command_injection/local-devices@2.0.0, size: 2089, cloc: 2346
No 39
Running /media/data/lsong18/data/vulPackages/command_injection/shell-quote@1.6.0, size: 6762, cloc: 655
Skip /media/data/lsong18/data/vulPackages/command_injection/shell-quote@1.6.0/example/env.js for no signature functions
Skip /media/data/lsong18/data/vulPackages/command_injection/shell-quote@1.6.0/example/op.js for no signature functions
Skip /media/data/lsong18/data/vulPackages/command_injection/shell-quote@1.6.0/example/parse.js for no signature functions
Skip /media/data/lsong18/data/vulPackages/command_injection/shell-quote@1.6.0/example/quote.js for no signature functions
Skip /media/data/lsong18/data/vulPackages/command_injection/shell-quote@1.6.0/test/comment.js for no signature functions
Skip /media/data/lsong18/data/vulPackages/command_injection/shell-quote@1.6.0/test/env.js for no signature functions
Skip /media/data/lsong18/data/vulPackages/command_injection/shell-quote@1.6.0/test/env_fn.js for no signature functions
Skip /media/data/lsong18/data/vulPackages/command_injection/shell-quote@1.6.0/test/op.js for no signature functions
Skip /media/data/lsong18/data/vulPackages/command_injection/shell-quote@1.6.0/test/parse.js for no signature functions
Skip /media/data/lsong18/data/vulPackages/command_injection/shell-quote@1.6.0/test/quote.js for no signature functions
Skip /media/data/lsong18/data/vulPackages/command_injection/shell-quote@1.6.0/test/set.js for no signature functions
Skip /media/data/lsong18/data/vulPackages/command_injection/shell-quote@1.6.0/index.js for no signature functions
Finished /media/data/lsong18/data/vulPackages/command_injection/shell-quote@1.6.0, size: 6762, cloc: 655
No 40
Running /media/data/lsong18/data/vulPackages/command_injection/whereis@0.4.0, size: 2535, cloc: 145
Finished /media/data/lsong18/data/vulPackages/command_injection/whereis@0.4.0, size: 2535, cloc: 145
No 41
Running /media/data/lsong18/data/vulPackages/command_injection/cocos-utils@1.0.0, size: 35478, cloc: 35372
No 42
Running /media/data/lsong18/data/vulPackages/command_injection/ascii-art@1.4.2, size: 123959, cloc: 15587
Success rate: 0.5476190476190477%, 23 out of 42, 11 skipped and 8 failed
4 fails caused by package error, 0 fails caused by generate error
Generation error list: []
No 1
Running /media/data/lsong18/data/vulPackages/command_injection/wizard-syncronizer@0.0.1, size: 10137, cloc: 969
Skip /media/data/lsong18/data/vulPackages/command_injection/wizard-syncronizer@0.0.1/bin/wizard-commit.js for no signature functions
Skip /media/data/lsong18/data/vulPackages/command_injection/wizard-syncronizer@0.0.1/bin/wizard-config.js for no signature functions
Skip /media/data/lsong18/data/vulPackages/command_injection/wizard-syncronizer@0.0.1/bin/wizard-init.js for no signature functions
Skip /media/data/lsong18/data/vulPackages/command_injection/wizard-syncronizer@0.0.1/bin/wizard-login.js for no signature functions
Skip /media/data/lsong18/data/vulPackages/command_injection/wizard-syncronizer@0.0.1/index.js for no signature functions
Finished /media/data/lsong18/data/vulPackages/command_injection/wizard-syncronizer@0.0.1, size: 10137, cloc: 969
Success rate: 1.0%, 1 out of 1, 0 skipped and 0 failed
0 fails caused by package error, 0 fails caused by generate error
Generation error list: []
No 1
Running /media/data/lsong18/data/vulPackages/command_injection/gitlabhook@0.0.17, size: 7595, cloc: 486
Finished /media/data/lsong18/data/vulPackages/command_injection/gitlabhook@0.0.17, size: 7595, cloc: 486
Success rate: 0.0%, 0 out of 1, 0 skipped and 1 failed
0 fails caused by package error, 0 fails caused by generate error
Generation error list: []
No 1
Running /media/data/lsong18/data/vulPackages/command_injection/gitlabhook@0.0.17, size: 7595, cloc: 486
Finished /media/data/lsong18/data/vulPackages/command_injection/gitlabhook@0.0.17, size: 7595, cloc: 486
Success rate: 0.0%, 0 out of 1, 0 skipped and 1 failed
0 fails caused by package error, 0 fails caused by generate error
Generation error list: []
No 1
Running /media/data/lsong18/data/vulPackages/command_injection/gitlabhook@0.0.17, size: 7595, cloc: 486
Finished /media/data/lsong18/data/vulPackages/command_injection/gitlabhook@0.0.17, size: 7595, cloc: 486
Success rate: 0.0%, 0 out of 1, 0 skipped and 1 failed
0 fails caused by package error, 0 fails caused by generate error
Generation error list: []
No 1
Running /media/data/lsong18/data/vulPackages/command_injection/printer@0.0.1, size: 372, cloc: 386
Finished /media/data/lsong18/data/vulPackages/command_injection/printer@0.0.1, size: 372, cloc: 386
Success rate: 1.0%, 1 out of 1, 0 skipped and 0 failed
0 fails caused by package error, 0 fails caused by generate error
Generation error list: []
