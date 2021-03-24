from .trace_rule import TraceRule
from .vul_func_lists import *
from src.core.logger import loggers, sty


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
    file = ""
    for node in path:
        cur_node_attr = G.get_node_attr(node)
        if cur_node_attr.get('lineno:int') is None:
            continue
        cur_path_str1 += cur_node_attr['lineno:int'] + '->'
        start_lineno = int(cur_node_attr['lineno:int'])
        end_lineno = int(cur_node_attr['endlineno:int']
                        or start_lineno)
        content = None
        try:
            content = G.get_node_file_content(node)
        except:
            pass
        if content is not None:
            # if switch to a new file, add the file name
            if file != "{}\n".format(G.get_node_file_path(node)):
                file = "{}\n".format(G.get_node_file_path(node))
                cur_path_str2 += file
            # cur_path_str2 += 'code: ' + G.get_node_attr(node).get('code') + '\n'
            cur_path_str2 += "{}\t{}".format(start_lineno,
                    ''.join(content[start_lineno:end_lineno + 1]))
    cur_path_str1 += G.get_node_attr(caller)['lineno:int']
    G.logger.debug(cur_path_str1)

    res_path += "==========================\n"
    # res_path += "{}\n".format(G.get_node_file_path(path[0]))
    res_path += cur_path_str2
    return res_path

def traceback_crx(G, vul_type, start_node=None):
    """
    traceback from the leak point, the edge is OBJ_REACHES
    Args:
        G: the graph
        vul_type: the type of vulnerability, listed below
    Return:
        the paths include the objs,
        the string description of paths,
        the list of callers,
    """
    res_path_text = ""
    sink = []
    sink.extend(crx_sink)
    sink.extend(user_sink)
    # func_nodes: the entries of traceback, which are all the CALLs of functions
    func_nodes = G.get_node_by_attr('type', 'AST_METHOD_CALL')
    func_nodes += G.get_node_by_attr('type', 'AST_CALL')
    func_nodes = [i for i in func_nodes if G.get_name_from_child(i) in sink]

    ret_paths = []
    caller_list = []
    for func_node in func_nodes:
        # we assume only one obj_decl edge
        func_name = G.get_name_from_child(func_node)
        # print('func_name debug##', func_name)
        caller = func_node
        # FROM AST NODE TO OPG NODE
        caller = G.find_nearest_upper_CPG_node(caller)
        caller_list.append("{} called {}".format(caller, func_name))
        # caller_name = G.get_name_from_child(caller)
        # print("{} called {}".format(caller_name, func_name))
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
        # NOTE: reverse the path here!
        ret_paths.extend(pathes)
        for path in pathes:
            # ret_paths.append(path)
            path.reverse()
            res_path_text += get_path_text(G, path, caller)
    print('=========ret_pathes debug=========\n', ret_paths)
    # ret_paths: source 2 sink lists
    # res_path_text: source 2 sink texts
    return ret_paths, res_path_text, caller_list



def traceback(G, vul_type, start_node=None):
    """
    traceback from the leak point, the edge is OBJ_REACHES
    Args:
        G: the graph
        vul_type: the type of vulnerability, listed below
    Return:
        the paths include the objs,
        the string description of paths,
        the list of callers,
    """
    res_path = ""
    # in chrome extension this should be the corresponding sink functions
    expoit_func_list = signature_lists[vul_type]

    # func_nodes: the entries of traceback, which are all the CALLs of functions
    func_nodes = G.get_node_by_attr('type', 'AST_METHOD_CALL')
    func_nodes += G.get_node_by_attr('type', 'AST_CALL')
    ret_pathes = []
    caller_list = []
    for func_node in func_nodes:
        # we assume only one obj_decl edge
        func_name = G.get_name_from_child(func_node)
        # print('func_name debug##', func_name)
        if func_name in expoit_func_list:
            caller = func_node
            # FROM AST NODE TO OPG NODE
            caller = G.find_nearest_upper_CPG_node(caller)
            caller_list.append("{} called {}".format(caller, func_name))
            # caller_name = G.get_name_from_child(caller)
            # print("{} called {}".format(caller, func_name))
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
            # NOTE: reverse the path here!
            for path in pathes:
                ret_pathes.append(path)
                path.reverse()
                res_path += get_path_text(G, path, caller)
                # print('get_path_text\n', get_path_text(G, path, caller))
    # print('ret_pathes debug\n', ret_pathes)
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
            [('has_user_input', None), ('not_start_within_file', ['child_process.js']), ('not_exist_func', ['parseInt'])]
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

    chrome_data_exfiltration_APIs = [
        "chrome.cookies.get",
        "chrome.cookies.getAll",
        "chrome.cookies.getAllCookieStores",
        "chrome.cookies.onChanged.addListener"
        "chrome.topSites.get",
        "chrome.storage.sync.get",
        "chrome.storage.local.get"
        "chrome.history.search",
        "chrome.history.getVisits",
        "chrome.downloads.search",
        "chrome.downloads.getFileIcon"
    ]

    dispatchable_events = [
        "window.postMessage",
        "chrome.runtime.sendMessage",
        "window.dispathEvent",
        "document.dispathEvent",
        "element.dispathEvent"
    ]

    chrome_API_execution_APIs = [
        "chrome.tabs.executeScript",
        "chrome.cookies.set",
        "chrome.cookies.remove",
        "chrome.storage.sync.set",
        "chrome.storage.local.set",
        "chrome.history.addUrl",
        "chrome.history.deleteUrl",
        "chrome.history.deleteRange",
        "chrome.history.deleteAll",
        "chrome.downloads.download",
        "chrome.downloads.pause",
        "chrome.downloads.resume",
        "chrome.downloads.cancel",
        "chrome.downloads.open",
        "chrome.downloads.show",
        "chrome.downloads.showDefaultFolder",
        "chrome.downloads.erase",
        "chrome.downloads.removeFile",
        "chrome.downloads.setShelfEnabled",
        "chrome.downloads.acceptDanger",
        "chrome.downloads.setShelfEnabled",
        "XMLHttpRequest"
    ]

    chrome_data_exfiltration = [
        [
            # ('start_with_func', dispatchable_events),
         ('start_with_var', crx_source_var_name),('end_with_func', user_sink)]
    ]

    chrome_API_execution = [
        [
            # ('start_with_func', dispatchable_events),
          ('end_with_func', crx_sink)]
    ]

    vul_type_map = {
            "xss": xss_rule_lists,
            "os_command": os_command_rule_lists,
            "code_exec": code_exec_lists,
            "proto_pollution": proto_pollution,
            "path_traversal": path_traversal,
            "depd": depd,
            "chrome_data_exfiltration": chrome_data_exfiltration,
            "chrome_API_execution": chrome_API_execution
            }

    rule_lists = vul_type_map[vul_type]
    success_pathes = []
    print('vul_checking', vul_type)
    """
    print(pathes)
    for path in pathes:
        for node in path:
            print(G.get_node_attr(node))
    """
    for rule_list in rule_lists:
        success_pathes += do_vul_checking(G, rule_list, pathes)
    print("success: ", success_pathes)
    if success_pathes!=[]:
        content = "success: " +  str(success_pathes) + '\n'
    else:
        content = ''
    for path in success_pathes:
        res_text_path = get_path_text(G, path, path[0])
        print("Attack Path: ")
        print(res_text_path)
        content += "Attack Path: " + '\n'
        content += res_text_path + '\n'
    loggers.crx_logger.info(
        sty.ef.inverse + sty.fg.li_magenta + content)
    with open('crx_run_results.txt', 'a') as f:
        f.write(content)
    return success_pathes

