from src.core.graph import Graph
from src.core.utils import *
from src.core.helpers import to_values, to_obj_nodes, val_to_str, is_int
from src.core.helpers import convert_prop_names_to_wildcard
from src.core.helpers import copy_objs_for_branch, copy_objs_for_parameters
from src.core.helpers import to_python_array, to_og_array, add_contributes_to
from src.core.helpers import val_to_float
from .handlers.functions import handle_require
import sty
import re
from src.core.logger import *
from itertools import chain, product
from math import isnan
import math

from .utils import get_off_spring

logger = create_logger("main_logger", output_type="file")


# TODO: setup document, window, chrome, console object
def setup_extension_builtins(G: Graph):
    # setup_chrome(G)
    # setup_document(G)
    # setup_window(G)
    # setup_console(G)
    setup_utils(G)

# setup three functions: RegisterFunc, TriggerEvent, MarkSource here for use
#  TODO: implement those functions
def setup_utils(G: Graph):
    G.add_blank_func_to_scope('RegisterFunc', scope=G.BASE_SCOPE, python_func=RegisterFunc)
    G.add_blank_func_to_scope('TriggerEvent', scope=G.BASE_SCOPE, python_func=TriggerEvent)
    G.add_blank_func_to_scope('MarkSource', scope=G.BASE_SCOPE, python_func=MarkSource)
    G.add_blank_func_to_scope('MarkSink', scope=G.BASE_SCOPE, python_func=MarkSink)
    G.add_blank_func_to_scope('MarkAttackEntry', scope=G.BASE_SCOPE, python_func=MarkAttackEntry)

# event is a string
# func is the function's declaration node ID
def RegisterFunc(G: Graph, caller_ast, extra, _, *args):
    event = args[0].values[0]
    func = args[1].obj_nodes[0]
    # print('inside register', G.get_obj_def_ast_node(func))
    # func = args[1].obj_nodes[0]
    if event in G.eventRegisteredFuncs:
        G.eventRegisteredFuncs[event].append(func)
    else:
        G.eventRegisteredFuncs[event] = [func]
    return NodeHandleResult()

def UnregisterFunc(G: Graph, caller_ast, extra, _, *args):
    event = args[0].values[0]
    func = args[1].obj_nodes[0]
    # print('inside register', G.get_obj_def_ast_node(func))
    # func = args[1].obj_nodes[0]
    if event in G.eventRegisteredFuncs:
        del G.eventRegisteredFuncs[event]
    else:
        pass
    return NodeHandleResult()


# store the events in the queue first
# trigger the events in turn after all the events entered the queue
# NOTE: the eventName and info we store are both obj node ID in graph
def TriggerEvent(G: Graph, caller_ast, extra, _, *args):
    # used_objs = set()
    eventName = G.get_node_attr(args[0].obj_nodes[0])['code']
    # print('debug TriggerEvent extra', eventName, extra)
    # eventName = args[0].obj_nodes[0]
    info = args[1].obj_nodes[0]
    # used_objs.update(args[1].obj_nodes)
    G.eventQueue.insert(0, {'eventName': eventName, 'info': info, 'extra':extra})
    return NodeHandleResult()

def MarkSource(G: Graph, caller_ast, extra, _, *args):
    sensitiveSource = args[0].obj_nodes[0]
    sons = get_off_spring(G, sensitiveSource)
    # print('sensitiveSource', sensitiveSource)
    G.sensitiveSource.add(sensitiveSource)
    G.sensitiveSource.update(sons)
    # print('sources', sons)
    # print('sensitiveSource', sensitiveSource)
    # for son in sons:
    #     names = G.get_name_node_of_obj_node(son)
    #     for name in names:
    #         print(G.get_node_attr(name))
    return NodeHandleResult()

def MarkSink(G: Graph, caller_ast, extra, _, *args):
    # print('debug MarkSink', args[0])
    # for obj in args[0].obj_nodes:
    #     names = G.get_name_node_of_obj_node(obj)
    #     print('names of obj: ', obj)
    #     for name in names:
    #         print(G.get_node_attr(name))
    new_sink = args[0].obj_nodes[0]
    # print(G.get_node_attr(new_sink))
    # print('sensitiveSource', sensitiveSource)
    G.sinks.add(new_sink)
    # print('right after append', G.sinks)
    # print(G.get_obj_def_ast_node(G.sinks[0]))
    return NodeHandleResult()

def MarkAttackEntry(G: Graph, caller_ast, extra, _, *args):
    type = G.get_node_attr(args[0].obj_nodes[0]).get('code')
    listener = args[1].obj_nodes[0]
    # print('sensitiveSource', sensitiveSource)
    G.attackEntries.insert(0, [type, listener])
    return NodeHandleResult()
    # return NodeHandleResult(used_objs=list(used_objs))

def setup_chrome(G: Graph):
    # chrome
    G.chrome_obj = G.add_obj_to_name('chrome', scope=G.BASE_SCOPE)

    # chrome.topSites.get
    # G.chrome_topSites = G.add_obj_as_prop(prop_name='topSites', parent_obj=G.chrome_obj)
    # G.add_blank_func_as_prop('get', G.chrome_topSites, chrome_topSites_get)

    # chrome.runtime
    G.chrome_runtime = G.add_obj_as_prop(prop_name='runtime', parent_obj=G.chrome_obj)
    # chrome.runtime.sendMessage
    G.add_blank_func_as_prop('sendMessage', G.chrome_runtime, chrome_runtime_sendMessage)
    # TODO: 'chrome.runtime.connect+port.postMessage', 'chrome.tabs.connect+port.postMessage'
    # G.add_blank_func_as_prop('connect', G.chrome_runtime, chrome_runtime_connect)
    # chrome.runtime.onMessage
    G.chrome_runtime_onMessage = G.add_blank_func_as_prop('onMessage', G.chrome_runtime, chrome_runtime_connect)
    # chrome.runtime.onMessage.addListener
    G.add_blank_func_as_prop('addListener', G.chrome_runtime_onMessage, None)
    # chrome.runtime.onConnect
    G.chrome_runtime_onConnect = G.add_blank_func_as_prop('onConnect', G.chrome_runtime, chrome_runtime_connect)
    # chrome.runtime.onConnect.addListener
    # MODEL WITH JS
    # G.add_blank_func_as_prop('addListener', G.chrome_runtime_onConnect, chrome_runtime_onConnect_addListener)


    # chrome.tabs
    G.chrome_tabs = G.add_obj_as_prop(prop_name='tabs', parent_obj=G.chrome_obj)
    # chrome.tabs.sendMessage
    G.add_blank_func_as_prop('sendMessage', G.chrome_tabs, chrome_tabs_sendMessage)
    # chrome.tabs.executeScript
    G.add_blank_func_as_prop('executeScript', G.chrome_tabs, None)
    # chrome.tabs.connect
    G.add_blank_func_as_prop('connect', G.chrome_tabs, chrome_runtime_connect)
    # chrome.tabs.executeScript
    G.add_blank_func_as_prop('executeScript', G.chrome_tabs, None)


def setup_window(G: Graph):
    # window
    G.window_obj = G.add_obj_to_name('window', scope=G.BASE_SCOPE)
    # window.addEventListener
    G.add_blank_func_as_prop('addEventListener', G.window_obj, window_addEventListener)
    # window.postMessage
    G.add_blank_func_as_prop('postMessage', G.window_obj, window_postMessage)

def setup_port(G: Graph):
    port_cons = G.add_blank_func_to_scope('Port', scope=G.BASE_SCOPE, python_func=port_constructor)
    G.builtin_constructors.append(port_cons)
    G.port_cons = port_cons
    port_prototype = G.get_prop_obj_nodes(prop_name='prototype', parent_obj=port_cons)[0]
    G.port_prototype = port_prototype
    # built-in functions for Port
    G.add_blank_func_as_prop('onMessage', port_prototype, None)
    G.add_blank_func_as_prop('postMessage', port_prototype, None)


def port_constructor(G: Graph, caller_ast, extra, _, *args):
    returned_obj = G.add_obj_node(caller_ast, None)
    G.add_obj_as_prop('__proto__', parent_obj=returned_obj, tobe_added_obj=G.port_prototype)
    G.add_obj_as_prop('constructor', parent_obj=returned_obj, tobe_added_obj=G.port_cons)
    # used_objs = chain(*[arg.obj_nodes for arg in args])
    # add_contributes_to(G, used_objs, returned_obj)
    return NodeHandleResult(obj_nodes=[returned_obj])

# def setup_messageEvent(G: Graph):
#     messageEvent_cons = G.add_blank_func_to_scope('messageEvent', scope=G.BASE_SCOPE, python_func=this_returning_func)
#     G.builtin_constructors.append(messageEvent_cons)
#     G.port_cons = messageEvent_cons
#     messageEvent_prototype = G.get_prop_obj_nodes(prop_name='prototype', parent_obj=messageEvent_cons)[0]
#     G.messageEvent_prototype = messageEvent_prototype
#     # built-in properties for messageEvent
#     G.add_obj_as_prop(prop_name='data', parent_obj=G.chrome_obj)
#     G.('onMessage', messageEvent_prototype, None)
#     G.add_blank_func_as_prop('postMessage', messageEvent_prototype, None)


# TODO: need to implement
#  has callback function in it
def chrome_topSites_get(G: Graph, caller_ast, extra, _this, *_args):
    # call the callback function
    pass


# add to G.msg_queue, no need to manage msg data flow now
def chrome_tabs_sendMessage(G: Graph, caller_ast, extra, _this, *_args):
    # TODO: add to G.msg_queue, no need to manage msg data flow now
    # msg_queue EXAMPLE
    # G.msg_queue = [
    # ['cs2bg/bg2cs','single/longtime', args:[obj, message, options, responseCallback]
    # ]
    G.msg_queue.append(['bg2cs', 'single', extra])
    # pass

def chrome_runtime_sendMessage(G: Graph, caller_ast, extra, _this, *_args):
    G.msg_queue.append(['cs2bg', 'single', extra])


# TODO: create a port node, with functions like sendMessage, etc, and define parameters in the callback function
# return port, should have some prototypes
# python_func(G, caller_ast, ExtraInfo(extra, branches=next_branches), _this, *_args)
def chrome_runtime_connect(G: Graph, caller_ast, extra, _this, *_args):
    #     port_prototype = G.get_prop_obj_nodes(prop_name='prototype', parent_obj=string_cons)[0]
    #     setup_port(G)
    objs = []
    port1 = G.add_obj_node(ast_node=None, js_type='port', value=None)
    objs.append(port1)
    return NodeHandleResult(obj_nodes=objs)
    pass

def chrome_runtime_onConnect_addListener(G: Graph, caller_ast, extra, _this, *_args):
    pass


#  until now, we have to do nothing about the sink, just in case they are not defined
def window_addEventListener(G: Graph, caller_ast, extra, this, *args):
    # if second parameter is a function
    # if second parameter is an object
    return NodeHandleResult(obj_nodes=[])

def window_postMessage(G: Graph, caller_ast, extra, this, *args):
    return NodeHandleResult(obj_nodes=[])

# def setup_string(G: Graph):
#     string_cons = G.add_blank_func_to_scope('String', scope=G.BASE_SCOPE, python_func=this_returning_func)
#     G.builtin_constructors.append(string_cons)
#     G.string_cons = string_cons
#     string_prototype = G.get_prop_obj_nodes(prop_name='prototype', parent_obj=string_cons)[0]
#     G.string_prototype = string_prototype
#     # built-in functions for regexp
#     G.add_blank_func_as_prop('match', string_prototype, None)
#


