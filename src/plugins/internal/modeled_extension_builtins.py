from src.core.graph import Graph
from src.core.utils import *
from src.core.logger import *
from src.plugins.internal.handlers.event_loop import event_loop, event_loop_threading, bg_chrome_runtime_MessageExternal_attack, other_attack
from .utils import get_off_spring, emit_thread
import threading

logger = create_logger("main_logger", output_type="file")


# TODO: setup document, window, chrome, console object
def setup_extension_builtins(G: Graph):
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
    cur_thread = threading.current_thread()
    print('=========Register listener: '+ event + ' in ' + cur_thread.name)
    if G.thread_version:
        with G.eventRegisteredFuncs_lock:
            if event in G.eventRegisteredFuncs:
                G.eventRegisteredFuncs[event].append(func)
            else:
                G.eventRegisteredFuncs[event] = [func]
        with G.event_condition_dic_lock:
            if event in G.event_condition_dic:
                cv = G.event_condition_dic[event]
                with cv:
                    cv.notify()
                    print('notify event')
                del G.event_condition_dic[event]
    else:
        if event in G.eventRegisteredFuncs:
            G.eventRegisteredFuncs[event].append(func)
        else:
            G.eventRegisteredFuncs[event] = [func]
    return NodeHandleResult()

def UnregisterFunc(G: Graph, caller_ast, extra, _, *args):
    event = args[0].values[0]
    func = args[1].obj_nodes[0]
    if G.thread_version:
        with G.eventRegisteredFuncs_lock:
            if event in G.eventRegisteredFuncs:
                del G.eventRegisteredFuncs[event]
    else:
        if event in G.eventRegisteredFuncs:
            del G.eventRegisteredFuncs[event]
    return NodeHandleResult()


# store the events in the queue first
# trigger the events in turn after all the events entered the queue
# NOTE: the eventName and info we store are both obj node ID in graph
def TriggerEvent(G: Graph, caller_ast, extra, _, *args):
    print(args)
    # eventName = G.get_node_attr(args[0].obj_nodes[0])['code']
    eventName = args[0].values[0]
    info = args[1].obj_nodes[0]
    event = {'eventName': eventName, 'info': info, 'extra':extra}
    # trigger event right away
    print('trigger event: ', eventName)
    if G.thread_version:
        emit_thread(G, event_loop_threading, (G, event))
        # tmp = [i.thread_self for i in G.work_queue]
        # print('%%%%%%%%%work in trigger event: ', tmp)
    else:
        event_loop(G, event)
    return NodeHandleResult()

def MarkSource(G: Graph, caller_ast, extra, _, *args):
    sensitiveSource = args[0].obj_nodes[0]
    sons = get_off_spring(G, sensitiveSource)
    G.sensitiveSource.add(sensitiveSource)
    G.sensitiveSource.update(sons)
    return NodeHandleResult()

def MarkSink(G: Graph, caller_ast, extra, _, *args):
    new_sink = args[0].obj_nodes[0]
    G.sinks.add(new_sink)
    return NodeHandleResult()

def MarkAttackEntry(G: Graph, caller_ast, extra, _, *args):
    type = G.get_node_attr(args[0].obj_nodes[0]).get('code')
    listener = args[1].obj_nodes[0]
    # print('Perform Attack: ', type)
    # G.attackEntries.insert(0, [type, listener])
    #  attack right away!
    if G.thread_version:
        entry = [type, listener]
        if entry[0]=='bg_chrome_runtime_MessageExternal':
            emit_thread(G, bg_chrome_runtime_MessageExternal_attack, (G, entry))
        else:
            emit_thread(G, other_attack, (G, entry))
        # tmp = [i.thread_self for i in G.work_queue]
        # print('%%%%%%%%%work in MarkAttackEntry: ', tmp)
    else:
        entry = [type, listener]
        if entry[0]=='bg_chrome_runtime_MessageExternal':
            bg_chrome_runtime_MessageExternal_attack(G, entry)
        else:
            other_attack(G, entry)
    return NodeHandleResult()

