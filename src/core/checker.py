from .trace_rule import TraceRule
from .vul_func_lists import *
from .logger import loggers

def get_path_text(G, path, caller):
    """
    get the code by ast number
    Args:
        G: the graph
        path: the path with ast nodes
    Return:
        str: a string with text path
    """
    res_path = ""
    cur_path_str1 = ""
    cur_path_str2 = ""
    for node in path:
        cur_node_attr = G.get_node_attr(node)
        if cur_node_attr.get('lineno:int') is None:
            continue
        cur_path_str1 += cur_node_attr['lineno:int'] + '->'
        start_lineno = int(cur_node_attr['lineno:int'])
        end_lineno = int(cur_node_attr['endlineno:int']
                        or start_lineno)

        content = None
        cur_path_str2 += "File Path: {}\n".format(G.get_node_file_path(node))
        try:
            content = G.get_node_file_content(node)
        except Exception as e:
            print(e)
        if content is not None:
            cur_path_str2 += "{}\t{}".format(start_lineno,
                    ''.join(content[start_lineno:end_lineno + 1]))
    cur_path_str1 += G.get_node_attr(caller)['lineno:int']
    G.logger.debug(cur_path_str1)

    res_path += "==========================\n"
    res_path += cur_path_str2
    return res_path

def traceback(G, vul_type, start_node=None):
    """
    traceback from the leak point, the edge is OBJ_REACHES
    Args:
        G: the graph
        vul_type: the type of vulernability, listed below

    Return:
        the paths include the objs,
        the string description of paths,
        the list of callers,
    """
    res_path = ""
    expoit_func_list = signature_lists[vul_type]

    func_nodes = G.get_node_by_attr('type', 'AST_METHOD_CALL')
    func_nodes += G.get_node_by_attr('type', 'AST_CALL')
    ret_pathes = []
    caller_list = []
    for func_node in func_nodes:
        # we assume only one obj_decl edge
        func_name = G.get_name_from_child(func_node)
        if func_name in expoit_func_list:
            caller = func_node
            caller = G.find_nearest_upper_CPG_node(caller)
            caller_list.append("{} called {}".format(caller, func_name))
            pathes = G._dfs_upper_by_edge_type(caller, "OBJ_REACHES")

            # here we treat the single calling as a possible path
            # pathes.append([caller])

            # give the end node one more chance, find the parent obj of the ending point
            """
            for path in pathes:
                last_node = path[-1]
                upper_nodes = G._dfs_upper_by_edge_type(last_node, 
                        "OBJ_TO_PROP")
                for uppernode in upper_nodes:
                    path.append(uppernode)
                #print('--', upper_nodes)
            """
            for path in pathes:
                ret_pathes.append(path)
                path.reverse()
                res_path += get_path_text(G, path, caller)
    return ret_pathes, res_path, caller_list

def do_vul_checking(G, rule_list, pathes):
    """
    checking the vuleralbilities in the pathes

    Args:
        G: the graph object
        rule_list: a list of paires, (rule_function, args of rule_functions)
        pathes: the possible pathes
    Returns:
        
    """
    trace_rules = []
    for rule in rule_list:
        trace_rules.append(TraceRule(rule[0], rule[1], G))

    success_pathes = []
    flag = True
    for path in pathes:
        flag = True
        for trace_rule in trace_rules:
            if not trace_rule.check(path):
                flag = False
                break
        if flag:
            success_pathes.append(path)
    return success_pathes

def vul_checking(G, pathes, vul_type):
    """
    picking the pathes which satisfy the xss
    Args:
        G: the Graph
        pathes: the possible pathes
    return:
        a list of xss pathes
    """
    xss_rule_lists = [
            [('has_user_input', None), ('not_start_with_func', ['sink_hqbpillvul_http_write']), ('not_exist_func', ['parseInt']), ('end_with_func', ['sink_hqbpillvul_http_write'])],
            [('has_user_input', None), ('not_start_with_func', ['sink_hqbpillvul_http_setHeader']), ('not_exist_func', ['parseInt']), ('end_with_func', ['sink_hqbpillvul_http_setHeader'])]
            ]
    os_command_rule_lists = [
            [('has_user_input', None), ('not_start_within_file', ['child_process.js']), ('not_exist_func', ['parseInt'])],
            [('start_with_var', ['source_hqbpillvul_url']), ('not_start_within_file', ['child_process.js']), ('not_exist_func', signature_lists['sanitation'])]
            ]

    code_exec_lists = [
            [('has_user_input', None), ('not_start_within_file', ['eval.js']), ('not_exist_func', ['parseInt'])],
            [('has_user_input', None), ('end_with_func', ['Function']), ('not_exist_func', ['parseInt'])],
            [('has_user_input', None), ('end_with_func', ['eval']), ('not_exist_func', ['parseInt'])],
            # include os command here
            [('has_user_input', None), ('not_start_within_file', ['child_process.js']), ('not_exist_func', ['parseInt'])]
            ]
    proto_pollution = [
            [('has_user_input', None), ('not_exist_func', signature_lists['sanitation'])]
            ]
    path_traversal = [
            [('start_with_var', ['source_hqbpillvul_url']),
                ('not_exist_func', signature_lists['sanitation']), 
                ('end_with_func', signature_lists['path_traversal']),
                ('exist_func', ['sink_hqbpillvul_fs_read'])
            ],
            [('start_with_var', ['source_hqbpillvul_url']),
                ('not_exist_func', signature_lists['sanitation']), 
                ('end_with_func', ['sink_hqbpillvul_http_sendFile'])
            ]
            ]

    depd = [
            [('has_user_input', None), ('not_exist_func', signature_lists['sanitation']), 
                ('end_with_func', signature_lists['depd']), ('not_start_within_file', ['undefsafe.js', 'thenify.js', 'codecov.js', 'class-transformer.js', 'dot-object.js', 'git-revision-webpack-plugin.js'])
            ]
            ]

    vul_type_map = {
            "xss": xss_rule_lists,
            "os_command": os_command_rule_lists,
            "code_exec": code_exec_lists,
            "proto_pollution": proto_pollution,
            "path_traversal": path_traversal,
            "depd": depd
            }


    rule_lists = vul_type_map[vul_type]
    success_pathes = []
    print('vul_checking', vul_type)
    """
    print(pathes)
    """
    for path in pathes:
        res_text_path = get_path_text(G, path, path[0])
        loggers.main_logger.info(res_text_path)

    for rule_list in rule_lists:
        success_pathes += do_vul_checking(G, rule_list, pathes)
    print("success: ", success_pathes)
    for path in success_pathes:
        res_text_path = get_path_text(G, path, path[0])
        print("Attack Path: ")
        print(res_text_path)
    return success_pathes

