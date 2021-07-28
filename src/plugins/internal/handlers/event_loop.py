from src.core.utils import NodeHandleResult
from src.plugins.internal.handlers.functions import call_function
from src.core.graph import Graph
from src.core.utils import wildcard
from src.plugins.internal.utils import get_df_callback, get_off_spring
import threading
from threading import Thread
from src.core.thread_design import thread_info
import time

# emit_event_thread(G, other_attack, (G, entry), entry)
def emit_event_thread(G, function, args):
    if len(threading.enumerate())==1:
        from src.core.opgen import admin_threads
        admin_threads(G, function, args)
    else:
        t = Thread(target=function, args=args)
        current_thread = threading.current_thread()
        with G.thread_info_lock:
            cur_info = G.thread_infos[current_thread.name]
        info = thread_info(thread=t, last_start_time=time.time_ns(), thread_age=cur_info.thread_age)
        info.pause()
        with G.thread_info_lock:
            G.thread_infos[t.name] = info
        with G.pq_lock:
            G.pq.append(info)
        t.start()

def event_loop(G: Graph, event):
    # STEP1: see eventRegisteredFuncs right now
    print('========SEE eventRegisteredFuncs:========')
    for i in G.eventRegisteredFuncs:
        print(i, G.eventRegisteredFuncs[i])
        print(G.get_obj_def_ast_node(G.eventRegisteredFuncs[i]))

    # STEP2: trigger event
    if G.thread_version:
        print('processing eventName:', event['eventName'])
        if event['eventName'] in event_listener_dic:
            if event_listener_dic[event['eventName']][0] in G.eventRegisteredFuncs:
                func = event_listener_dic[event['eventName']][1]
                emit_event_thread(G, func, (G, event))
            # else:

    else:
        print('processing eventName:', event['eventName'])
        if event['eventName'] in event_listener_dic:
            if event_listener_dic[event['eventName']][0] in G.eventRegisteredFuncs:
                func = event_listener_dic[event['eventName']][1]
                func(G, event)


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

event_listener_dic = {
    "cs_chrome_runtime_connect": ("bg_chrome_runtime_onConnect", cs_chrome_runtime_connect),
    "cs_port_postMessage":("bg_port_onMessage", cs_port_postMessage),
    "bg_port_postMessage":("cs_port_onMessage", bg_port_postMessage),
    "cs_chrome_runtime_sendMessage":("bg_chrome_runtime_onMessage", cs_chrome_runtime_sendMessage),
    "bg_chrome_tabs_sendMessage":("cs_chrome_runtime_onMessage", bg_chrome_tabs_sendMessage),
    "bg_chrome_runtime_onMessage_response":("cs_chrome_runtime_sendMessage_onResponse", bg_chrome_runtime_onMessage_response),
    "cs_chrome_tabs_onMessage_response":("bg_chrome_tabs_sendMessage_onResponse", cs_chrome_tabs_onMessage_response)
}
