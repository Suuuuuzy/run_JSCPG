from src.core.utils import NodeHandleResult
from src.plugins.internal.handlers.functions import call_function
from src.core.graph import Graph
from src.core.utils import wildcard
import threading

def event_loop_threading(G: Graph, event, mydata):
    G.mydata.unpickle_up(mydata)
    # STEP1: see eventRegisteredFuncs right now
    print('========SEE eventRegisteredFuncs:========')
    with G.eventRegisteredFuncs_lock:
        for i in G.eventRegisteredFuncs:
            print(i, G.eventRegisteredFuncs[i])
            print(G.get_obj_def_ast_node(G.eventRegisteredFuncs[i]))
    # STEP2: trigger event
    cur_thread = threading.current_thread()
    print('=========processing eventName: ' + event['eventName'] + ' in ' + cur_thread.name)
    if event['eventName'] in event_listener_dic:
        listener = event_listener_dic[event['eventName']][0]
        with G.eventRegisteredFuncs_lock:
            listener_not_registered = True if listener not in G.eventRegisteredFuncs else False
        if listener_not_registered:
            print(event['eventName'] , ': event listener not rregistered')
            return
        func = event_listener_dic[event['eventName']][1]
        func(G, event)


def event_loop_no_threading(G: Graph, event):
    print('========SEE eventRegisteredFuncs:========')
    for i in G.eventRegisteredFuncs:
        print(i, G.eventRegisteredFuncs[i])
        print(G.get_obj_def_ast_node(G.eventRegisteredFuncs[i]))
    if event['eventName'] in event_listener_dic:
        if event_listener_dic[event['eventName']][0] in G.eventRegisteredFuncs:
            func = event_listener_dic[event['eventName']][1]
            func(G, event)


def bg_chrome_runtime_MessageExternal_attack(G, entry, mydata=None):
    cur_thread = threading.current_thread()
    print('=========Perform attack: ' + str(entry) + ' in ' + cur_thread.name)
    G.mydata.unpickle_up(mydata)
    wildcard_msg_obj = G.add_obj_node(js_type='object' if G.check_proto_pollution
                                       else None, value=wildcard)
    G.set_node_attr(wildcard_msg_obj, ('tainted', True))
    G.set_node_attr(wildcard_msg_obj, ('fake_arg', True))
    G.set_node_attr(wildcard_msg_obj, ('taint_flow', [([wildcard_msg_obj], str(entry))]))
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

def window_eventListener_attack(G, entry, mydata=None):
    G.mydata.unpickle_up(mydata)
    cur_thread = threading.current_thread()
    print('in window attack=========Perform attack: ' + str(entry) + ' in ' + cur_thread.name)
    func_objs = [entry[1]]
    # wildcard_event_obj = G.add_obj_node(js_type='object' if G.check_proto_pollution
    #                                     else None, value=wildcard)
    # G.set_node_attr(wildcard_event_obj, ('tainted', True))
    # # G.set_node_attr(wildcard_event_obj, ('fake_arg', True))
    # G.set_node_attr(wildcard_event_obj, ('taint_flow', [([wildcard_event_obj], entry[0])]))
    # args = [NodeHandleResult(obj_nodes=[wildcard_event_obj])]  # no args
    returned_result, created_objs = call_function(G, func_objs, args=[], this=NodeHandleResult(), extra=None,
                                                          caller_ast=None, is_new=False, stmt_id='Unknown',
                                                          mark_fake_args=True, fake_arg_srcs=[entry[0]])


def other_attack(G, entry, mydata=None):
    G.mydata.unpickle_up(mydata)
    cur_thread = threading.current_thread()
    print('=========Perform attack: ' + str(entry) + ' in ' + cur_thread.name)
    func_objs = [entry[1]]
    args = []  # no args
    returned_result, created_objs = call_function(G, func_objs, args=args, this=NodeHandleResult(), extra=None,
                                                          caller_ast=None, is_new=False, stmt_id='Unknown',
                                                          mark_fake_args=True)
def cs_chrome_runtime_connect(G, event):
    # handle the parameter of the callback function
    connectInfo = G.get_child_nodes(event['info'], child_name='connectInfo')[0]
    connectInfo = G.get_child_nodes(connectInfo, edge_type='NAME_TO_OBJ')[0]
    args = [NodeHandleResult(obj_nodes=[connectInfo])]
    func_objs = G.get_objs_by_name('Port', scope=G.bg_scope, branches=[])
    returned_result, created_objs = call_function(G, func_objs, args=args, this=NodeHandleResult(), extra=None,
                  caller_ast=None, is_new=True, stmt_id='Unknown', func_name='Port',
                  mark_fake_args=False)
    returned_result.obj_nodes = created_objs
    with G.eventRegisteredFuncs_lock:
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
    with G.eventRegisteredFuncs_lock:
        func_objs = G.eventRegisteredFuncs['bg_port_onMessage']
    returned_result, created_objs = call_function(G, func_objs, args=args, this=NodeHandleResult(),extra=None,
                caller_ast=None, is_new=False, stmt_id='Unknown',
                mark_fake_args=False)

def bg_port_postMessage(G, event):
    message = G.get_prop_obj_nodes(event['info'], prop_name='message')[0]
    message = G.copy_obj(message, ast_node=None, deep=True)
    # print('message obj node:', G.get_node_attr(message))
    args = [NodeHandleResult(obj_nodes=[message])]
    with G.eventRegisteredFuncs_lock:
        func_objs = G.eventRegisteredFuncs['cs_port_onMessage']
    returned_result, created_objs = call_function(G, func_objs, args=args, this=NodeHandleResult(),extra=None,
                caller_ast=None, is_new=False, stmt_id='Unknown',
                mark_fake_args=False)

def cs_chrome_runtime_sendMessage(G, event):
    # register sender_responseCallback function to cs runtime.sendMessage's responseCallback
    print('event: ', event)
    print(G.get_node_attr(event['info']))
    sender_responseCallback = G.get_prop_obj_nodes(event['info'], prop_name='responseCallback')[0]
    new_event = 'cs_chrome_runtime_sendMessage_onResponse'  # cs on getting the response from bg
    if G.thread_version:
        from src.plugins.internal.modeled_extension_builtins import register_event_check
        register_event_check(G, new_event, sender_responseCallback)
    else:
        if new_event in G.eventRegisteredFuncs:
            G.eventRegisteredFuncs[new_event].append(sender_responseCallback)
        else:
            G.eventRegisteredFuncs[new_event] = [sender_responseCallback]
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
    with G.eventRegisteredFuncs_lock:
        func_objs = G.eventRegisteredFuncs['bg_chrome_runtime_onMessage']
    returned_result, created_objs = call_function(G, func_objs, args=args, this=NodeHandleResult(),extra=None,
                  caller_ast=None, is_new=False, stmt_id='Unknown',
                  mark_fake_args=False)


def bg_chrome_tabs_sendMessage(G, event):
    # register sender_responseCallback function to cs runtime.sendMessage's responseCallback
    sender_responseCallback = G.get_prop_obj_nodes(event['info'], prop_name='responseCallback')[0]
    new_event = 'bg_chrome_tabs_sendMessage_onResponse'  # bg on getting the response from cs
    if G.thread_version:
        from src.plugins.internal.modeled_extension_builtins import register_event_check
        register_event_check(G, new_event, sender_responseCallback)
    else:
        if new_event in G.eventRegisteredFuncs:
            G.eventRegisteredFuncs[new_event].append(sender_responseCallback)
        else:
            G.eventRegisteredFuncs[new_event] = [sender_responseCallback]
    message = G.get_prop_obj_nodes(event['info'], prop_name='message')[0]
    print('copy object: ' + str(message))
    props = G.get_prop_obj_nodes(message)
    for prop in props:
        print(prop)
        print(G.get_node_attr(prop))
    message = G.copy_obj(message, ast_node=None, deep=True)
    print('new object: ' + str(message))
    props = G.get_prop_obj_nodes(message)
    for prop in props:
        print(prop)
        print(G.get_node_attr(prop))
    # from src.core.logger import loggers
    # loggers.main_logger.info(sty.fg.green + "COPY OBJECT" + sty.rs.all + ": " + entry_nodeid)
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
    with G.eventRegisteredFuncs_lock:
        func_objs = G.eventRegisteredFuncs['cs_chrome_runtime_onMessage']
    returned_result, created_objs = call_function(G, func_objs, args=args, this=NodeHandleResult(),
                                                  extra=None,
                                                  caller_ast=None, is_new=False, stmt_id='Unknown',
                                                  mark_fake_args=False)


def bg_chrome_runtime_onMessage_response(G, event):
    message = G.get_prop_obj_nodes(event['info'], prop_name='message')[0]
    message = G.copy_obj(message, ast_node=None, deep=True)
    args = [NodeHandleResult(obj_nodes=[message])]
    with G.eventRegisteredFuncs_lock:
        func_objs = G.eventRegisteredFuncs['cs_chrome_runtime_sendMessage_onResponse']
    returned_result, created_objs = call_function(G, func_objs, args=args, this=NodeHandleResult(),
                                                  extra=None,
                                                  caller_ast=None, is_new=False, stmt_id='Unknown',
                                                  mark_fake_args=False)
    # unregister this function
    event = 'cs_chrome_runtime_sendMessage_onResponse'
    with G.eventRegisteredFuncs_lock:
        if event in G.eventRegisteredFuncs:
            del G.eventRegisteredFuncs[event]

def cs_chrome_tabs_onMessage_response(G, event):
    message = G.get_prop_obj_nodes(event['info'], prop_name='message')[0]
    message = G.copy_obj(message, ast_node=None, deep=True)
    args = [NodeHandleResult(obj_nodes=[message])]
    with G.eventRegisteredFuncs_lock:
        func_objs = G.eventRegisteredFuncs['bg_chrome_tabs_sendMessage_onResponse']
    returned_result, created_objs = call_function(G, func_objs, args=args, this=NodeHandleResult(),
                                                  extra=None,
                                                  caller_ast=None, is_new=False, stmt_id='Unknown',
                                                  mark_fake_args=False)
    # unregister this function
    event = 'bg_chrome_tabs_sendMessage_onResponse'
    with G.eventRegisteredFuncs_lock:
        if event in G.eventRegisteredFuncs:
            del G.eventRegisteredFuncs[event]

event_listener_dic = {
    "cs_chrome_runtime_connect": ["bg_chrome_runtime_onConnect", cs_chrome_runtime_connect],
    "cs_port_postMessage":["bg_port_onMessage", cs_port_postMessage],
    "bg_port_postMessage":["cs_port_onMessage", bg_port_postMessage],
    "cs_chrome_runtime_sendMessage":["bg_chrome_runtime_onMessage", cs_chrome_runtime_sendMessage],
    "bg_chrome_tabs_sendMessage":["cs_chrome_runtime_onMessage", bg_chrome_tabs_sendMessage],
    "bg_chrome_runtime_onMessage_response":["cs_chrome_runtime_sendMessage_onResponse", bg_chrome_runtime_onMessage_response],
    "cs_chrome_runtime_onMessage_response":["bg_chrome_tabs_sendMessage_onResponse", cs_chrome_tabs_onMessage_response]
}
