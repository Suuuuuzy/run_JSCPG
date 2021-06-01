from src.core.utils import NodeHandleResult
from src.plugins.internal.handlers.functions import call_function
from src.core.graph import Graph
from src.core.utils import wildcard
from src.plugins.internal.utils import get_df_callback, get_off_spring
import threading
from threading import Thread

# event_loop_threads = False
# emit_event_thread(G, other_attack, (G, entry), entry)
def emit_event_thread(G, function, args):
    global event_loop_threads
    if G.pq.empty():
        event_loop_threads = True
        from src.core.opgen import admin_threads
        admin_threads(G, function, args, 0)
    else:
        t = Thread(target=function, args=args)
        t.start()
        while G.pq_event.isSet():
            continue
        G.add_branch = True
        G.pq_event.set()
        print(t.ident)
        G.pq.put(((1, t.ident, t)))
        G.add_branch = False
        G.pq_event.clear()

def event_loop(G: Graph, event):
    # STEP1: see eventRegisteredFuncs right now
    print('========SEE eventRegisteredFuncs:========')
    for i in G.eventRegisteredFuncs:
        print(i, G.eventRegisteredFuncs[i])
        print(G.get_obj_def_ast_node(G.eventRegisteredFuncs[i]))

    # STEP2: trigger event
    if G.pq:
        print('processing eventName:', event['eventName'])
        if event['eventName'] == 'cs_chrome_runtime_connect':
            if 'bg_chrome_runtime_onConnect' in G.eventRegisteredFuncs:
                emit_event_thread(G, cs_chrome_runtime_connect, (G, event))
        elif event['eventName'] == 'cs_port_postMessage':
            if 'bg_port_onMessage' in G.eventRegisteredFuncs:
                emit_event_thread(G, cs_port_postMessage, (G, event))
        elif event['eventName'] == 'bg_port_postMessage':
            if 'cs_port_onMessage' in G.eventRegisteredFuncs:
                emit_event_thread(G, bg_port_postMessage, (G, event))
        elif event['eventName'] == 'cs_chrome_runtime_sendMessage':
            if 'bg_chrome_runtime_onMessage' in G.eventRegisteredFuncs:
                emit_event_thread(G, cs_chrome_runtime_sendMessage, (G, event))
        elif event['eventName'] == 'bg_chrome_tabs_sendMessage':
            if 'cs_chrome_runtime_onMessage' in G.eventRegisteredFuncs:
                emit_event_thread(G, bg_chrome_tabs_sendMessage, (G, event))
        elif event['eventName'] == 'bg_chrome_runtime_onMessage_response':
            if 'cs_chrome_runtime_sendMessage_onResponse' in G.eventRegisteredFuncs:
                emit_event_thread(G, bg_chrome_runtime_onMessage_response, (G, event))
        elif event['eventName'] == 'cs_chrome_tabs_onMessage_response':
            if 'bg_chrome_tabs_sendMessage_onResponse' in G.eventRegisteredFuncs:
                emit_event_thread(G, cs_chrome_tabs_onMessage_response, (G, event))
    else:
        print('processing eventName:', event['eventName'])
        if event['eventName'] == 'cs_chrome_runtime_connect':
            if 'bg_chrome_runtime_onConnect' in G.eventRegisteredFuncs:
                cs_chrome_runtime_connect(G, event)
        elif event['eventName'] == 'cs_port_postMessage':
            if 'bg_port_onMessage' in G.eventRegisteredFuncs:
                cs_port_postMessage(G, event)
        elif event['eventName'] == 'bg_port_postMessage':
            if 'cs_port_onMessage' in G.eventRegisteredFuncs:
                bg_port_postMessage(G, event)
        elif event['eventName'] == 'cs_chrome_runtime_sendMessage':
            if 'bg_chrome_runtime_onMessage' in G.eventRegisteredFuncs:
                cs_chrome_runtime_sendMessage(G, event)
        elif event['eventName'] == 'bg_chrome_tabs_sendMessage':
            if 'cs_chrome_runtime_onMessage' in G.eventRegisteredFuncs:
                bg_chrome_tabs_sendMessage(G, event)
        elif event['eventName'] == 'bg_chrome_runtime_onMessage_response':
            if 'cs_chrome_runtime_sendMessage_onResponse' in G.eventRegisteredFuncs:
                bg_chrome_runtime_onMessage_response(G, event)
        elif event['eventName'] == 'cs_chrome_tabs_onMessage_response':
            if 'bg_chrome_tabs_sendMessage_onResponse' in G.eventRegisteredFuncs:
                cs_chrome_tabs_onMessage_response(G, event)

    '''
    # see marked source
    print('SEE sensitiveSource:####')
    print(len(G.sensitiveSource))
    for i in G.sensitiveSource:
        print('OBJ: ', i)
        # if G.get_obj_def_ast_node(i)!=None:
        #     print('AST: ', G.get_node_attr(G.get_obj_def_ast_node(i)))
    # see marked sinks
    sinks = list(G.sinks)
    sinks = [x for x in sinks if G.get_obj_def_ast_node(x) != None]
    G.sinks = set(sinks)
    print('####SEE sinks:####')
    print(len(G.sinks))
    for i in G.sinks:
        print('OBJ: ', i)
        # if G.get_obj_def_ast_node(i) != None:
        #     print('AST: ', G.get_node_attr(G.get_obj_def_ast_node(i)))

    from src.core.checker import get_path_text
    ret_pathes = []
    res_path = ''
    all_res_path = ''
    all_paths = []
    sinks = set()
    for sink in G.sinks:
        sink = G.get_obj_def_ast_node(sink)
        sinks.add(sink)
    print('try to trace back from sinks to see')
    for sink in sinks:
        print(sink)
        print(G.get_node_attr(sink))
        sink = G.find_nearest_upper_CPG_node(sink)
        if sink == None:
            continue
        pathes = G._dfs_upper_by_edge_type(sink, "OBJ_REACHES")
        # if pathes==[]:

        for path in pathes:
            path.reverse()
            all_paths.append(path)
    print('===============all_paths===============\n', all_paths)
    for path in all_paths:
        print('===============check start objs for path: ', path, '=============')
        # check start point's obj
        start_objs = set()
        hit = False
        print(G.get_node_attr(path[0]))
        for item in G.get_edge_attr(path[0],  path[1]):
            start_obj = G.get_edge_attr(path[0],  path[1])[item].get('obj')
            if start_obj!=None:
                start_objs.add(start_obj)
            # start_objs.update(get_off_spring(G, start_obj))
        print('start_objs')
        for obj in start_objs:
            att = G.get_node_attr(G.get_obj_def_ast_node(obj))
            print('obj', obj, 'lineno:int:', att.get('lineno:int'), 'code', att.get('code'))
            # if obj in G.sensitiveSource or obj is the offspring of attacker input obj, mark it as hit
            if obj in G.sensitiveSource:
                print('hit', obj, G.get_node_attr(obj))
                res_path += get_path_text(G, path, sink)
                hit = True
                # break # comment this to see all the hits
            all_res_path += get_path_text(G, path, sink)
        if hit:
            continue

    print('===========ret_pathes==========\n', res_path)
    with open('path_out.txt', 'w') as path_out:
        path_out.write(res_path)
    with open('all_path_out.txt', 'w') as path_out:
        path_out.write(all_res_path)
    '''

    


def bg_chrome_runtime_MessageExternal_attack(G, entry):
    wildcard_msg_obj = G.add_obj_node(js_type='object' if G.check_proto_pollution
                                       else None, value=wildcard)
    G.set_node_attr(wildcard_msg_obj, ('tainted', True))
    G.set_node_attr(wildcard_msg_obj, ('fake_arg', True))
    # G.add_obj_to_name(name='bg_chrome_runtime_MessageExternal_src', tobe_added_obj=wildcard_msg_obj)
    func_objs = G.get_objs_by_name('MessageSenderExternal', scope=G.bg_scope, branches=[])
    MessageSenderExternal, created_objs = call_function(G, func_objs, args=[], this=NodeHandleResult(),
                                                extra=None,
                                                caller_ast=None, is_new=True, stmt_id='Unknown',
                                                func_name='MessageSenderExternal',
                                                mark_fake_args=False)
    MessageSenderExternal.obj_nodes = created_objs
    sendResponseExternal = G.get_objs_by_name('sendResponseExternal', scope=G.bg_scope, branches=[])
    args = [NodeHandleResult(obj_nodes=[wildcard_msg_obj]), MessageSenderExternal, NodeHandleResult(obj_nodes=sendResponseExternal)]
    func_objs = [entry[1]]
    returned_result, created_objs = call_function(G, func_objs, args=args, this=NodeHandleResult(), extra=None,
                                                          caller_ast=None, is_new=False, stmt_id='Unknown',
                                                          mark_fake_args=False)


def other_attack(G, entry):
    func_objs = [entry[1]]
    args = []  # no args
    returned_result, created_objs = call_function(G, func_objs, args=args, this=NodeHandleResult(), extra=None,
                                                          caller_ast=None, is_new=False, stmt_id='Unknown',
                                                          mark_fake_args=True)
def cs_chrome_runtime_connect(G, event):
    # handle the parameter of the callback function
    # var port = new Port(info['connectInfo']);
    connectInfo = G.get_child_nodes(event['info'], child_name='connectInfo')[0]
    connectInfo = G.get_child_nodes(connectInfo, edge_type='NAME_TO_OBJ')[0]
    args = [NodeHandleResult(obj_nodes=[connectInfo])]
    func_objs = G.get_objs_by_name('Port', scope=G.bg_scope, branches=[])
    returned_result, created_objs = call_function(G, func_objs, args=args, this=NodeHandleResult(), extra=None,
                  caller_ast=None, is_new=True, stmt_id='Unknown', func_name='Port',
                  mark_fake_args=False)
    returned_result.obj_nodes = created_objs
    func_objs = G.eventRegisteredFuncs['bg_chrome_runtime_onConnect']
    args = [returned_result]
    returned_result, created_objs = call_function(G, func_objs, args=args, this=NodeHandleResult(),extra=None,
                    caller_ast=None, is_new=False, stmt_id='Unknown',
                    mark_fake_args=False)

def cs_port_postMessage(G, event):
    message = G.get_child_nodes(event['info'], child_name='message')[0]
    message = G.get_child_nodes(message, edge_type='NAME_TO_OBJ')[0]
    message = G.copy_obj(message, ast_node=None, deep=True)
    # print('message obj node:', G.get_node_attr(message))
    args = [NodeHandleResult(obj_nodes=[message])]
    func_objs = G.eventRegisteredFuncs['bg_port_onMessage']
    returned_result, created_objs = call_function(G, func_objs, args=args, this=NodeHandleResult(),extra=None,
                caller_ast=None, is_new=False, stmt_id='Unknown',
                mark_fake_args=False)

def bg_port_postMessage(G, event):
    message = G.get_prop_obj_nodes(event['info'], prop_name='message')[0]
    message = G.copy_obj(message, ast_node=None, deep=True)
    # print('message obj node:', G.get_node_attr(message))
    args = [NodeHandleResult(obj_nodes=[message])]
    func_objs = G.eventRegisteredFuncs['cs_port_onMessage']
    # print('bg_port_onMessage callback')
    # print(func_objs[0])
    # print(G.get_obj_def_ast_node(func_objs[0]))
    returned_result, created_objs = call_function(G, func_objs, args=args, this=NodeHandleResult(),extra=None,
                caller_ast=None, is_new=False, stmt_id='Unknown',
                mark_fake_args=False)

def cs_chrome_runtime_sendMessage(G, event):
    # print('in runtime')
    extra = event['extra']
    message = G.get_prop_obj_nodes(event['info'], prop_name = 'message')[0]
    message = G.copy_obj(message, ast_node=None, deep=True)
    info_nodes = G.get_prop_name_nodes(event['info'])
    func_objs = G.get_objs_by_name('MessageSender', scope=G.bg_scope, branches=[])
    MessageSender, created_objs = call_function(G, func_objs, args=[], this=NodeHandleResult(),
                  extra=None,
                  caller_ast=None, is_new=True, stmt_id='Unknown',
                  func_name='MessageSender',
                  mark_fake_args=False)
    MessageSender.obj_nodes = created_objs
    sendResponse = G.get_objs_by_name('sendResponse', scope=G.bg_scope, branches=[])
    args = [NodeHandleResult(obj_nodes=[message]), MessageSender, NodeHandleResult(obj_nodes=sendResponse)]
    func_objs = G.eventRegisteredFuncs['bg_chrome_runtime_onMessage']
    returned_result, created_objs = call_function(G, func_objs, args=args, this=NodeHandleResult(),extra=None,
                  caller_ast=None, is_new=False, stmt_id='Unknown',
                  mark_fake_args=False)
    # register sender_responseCallback function to cs runtime.sendMessage's responseCallback
    sender_responseCallback = G.get_prop_obj_nodes(event['info'], prop_name = 'responseCallback')[0]
    event = 'cs_chrome_runtime_sendMessage_onResponse' # cs on getting the response from bg
    if event in G.eventRegisteredFuncs:
        G.eventRegisteredFuncs[event].append(sender_responseCallback)
    else:
        G.eventRegisteredFuncs[event] = [sender_responseCallback]

def bg_chrome_tabs_sendMessage(G, event):
    message = G.get_prop_obj_nodes(event['info'], prop_name='message')[0]
    message = G.copy_obj(message, ast_node=None, deep=True)
    # print('message obj node:', message, G.get_node_attr(message))
    func_objs = G.get_objs_by_name('MessageSender', scope=G.cs_scope['cs_0.js'], branches=[])
    MessageSender, created_objs = call_function(G, func_objs, args=[], this=NodeHandleResult(),
                                                extra=None,
                                                caller_ast=None, is_new=True, stmt_id='Unknown',
                                                func_name='MessageSender',
                                                mark_fake_args=False)
    MessageSender.obj_nodes = created_objs
    # print('MessageSender obj', created_objs[0], G.get_node_attr(created_objs[0]))
    sendResponse = G.get_objs_by_name('sendResponse', scope=G.cs_scope['cs_0.js'], branches=[])
    # print('sendResponse obj', sendResponse[0], G.get_obj_def_ast_node(sendResponse[0]),
    #       G.get_node_attr(sendResponse[0]))
    args = [NodeHandleResult(obj_nodes=[message]), MessageSender, NodeHandleResult(obj_nodes=sendResponse)]
    func_objs = G.eventRegisteredFuncs['cs_chrome_runtime_onMessage']
    returned_result, created_objs = call_function(G, func_objs, args=args, this=NodeHandleResult(),
                                                  extra=None,
                                                  caller_ast=None, is_new=False, stmt_id='Unknown',
                                                  mark_fake_args=False)
    # register sender_responseCallback function to cs runtime.sendMessage's responseCallback
    sender_responseCallback = G.get_prop_obj_nodes(event['info'], prop_name='responseCallback')[0]
    event = 'bg_chrome_tabs_sendMessage_onResponse' # bg on getting the response from cs
    if event in G.eventRegisteredFuncs:
        G.eventRegisteredFuncs[event].append(sender_responseCallback)
    else:
        G.eventRegisteredFuncs[event] = [sender_responseCallback]


def bg_chrome_runtime_onMessage_response(G, event):
    message = G.get_prop_obj_nodes(event['info'], prop_name='message')[0]
    message = G.copy_obj(message, ast_node=None, deep=True)
    args = [NodeHandleResult(obj_nodes=[message])]
    func_objs = G.eventRegisteredFuncs['cs_chrome_runtime_sendMessage_onResponse']
    returned_result, created_objs = call_function(G, func_objs, args=args, this=NodeHandleResult(),
                                                  extra=None,
                                                  caller_ast=None, is_new=False, stmt_id='Unknown',
                                                  mark_fake_args=False)
    # unregister this function
    event = 'cs_chrome_runtime_sendMessage_onResponse'
    if event in G.eventRegisteredFuncs:
        del G.eventRegisteredFuncs[event]
    else:
        pass

def cs_chrome_tabs_onMessage_response(G, event):
    message = G.get_prop_obj_nodes(event['info'], prop_name='message')[0]
    message = G.copy_obj(message, ast_node=None, deep=True)
    args = [NodeHandleResult(obj_nodes=[message])]
    func_objs = G.eventRegisteredFuncs['bg_chrome_tabs_sendMessage_onResponse']
    returned_result, created_objs = call_function(G, func_objs, args=args, this=NodeHandleResult(),
                                                  extra=None,
                                                  caller_ast=None, is_new=False, stmt_id='Unknown',
                                                  mark_fake_args=False)
    # unregister this function
    event = 'bg_chrome_tabs_sendMessage_onResponse'
    if event in G.eventRegisteredFuncs:
        del G.eventRegisteredFuncs[event]
    else:
        pass

def bg_chrome_tabs_onActivated(G):
    print('bg_chrome_tabs_onActivated')
    func_objs = G.get_objs_by_name('ActiveInfo', scope=G.bg_scope, branches=[])
    ActiveInfo, created_objs = call_function(G, func_objs, args=[], this=NodeHandleResult(),
                                                extra=None,
                                                caller_ast=None, is_new=True, stmt_id='Unknown',
                                                func_name='ActiveInfo',
                                                mark_fake_args=False)
    ActiveInfo.obj_nodes = created_objs
    print('ActiveInfo obj node:',created_objs[0],  G.get_node_attr(created_objs[0]))
    args = [ActiveInfo]
    func_objs = G.eventRegisteredFuncs['bg_chrome_tabs_onActivated']
    returned_result, created_objs = call_function(G, func_objs, args=args, this=NodeHandleResult(),
                                                  extra=None,
                                                  caller_ast=None, is_new=False, stmt_id='Unknown',
                                                  mark_fake_args=False)