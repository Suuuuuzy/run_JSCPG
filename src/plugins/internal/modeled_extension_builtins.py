from src.core.graph import Graph
from src.core.utils import *
from src.core.logger import *
from src.plugins.internal.handlers.event_loop import event_loop_no_threading, event_loop_threading, bg_chrome_runtime_MessageExternal_attack, other_attack
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
    G.add_blank_func_to_scope('debug_sink', scope=G.BASE_SCOPE, python_func=debug_sink)
    G.add_blank_func_to_scope('sink_function', scope=G.BASE_SCOPE, python_func=sink_function)

# event is a string
# func is the function's declaration node ID
def RegisterFunc(G: Graph, caller_ast, extra, _, *args):
    listener = args[0].values[0]
    func = args[1].obj_nodes[0]
    cur_thread = threading.current_thread()
    # print(args)
    print('=========Register listener: '+ listener + ' in ' + cur_thread.name)
    if G.thread_version:
        register_event_check(G, listener, func)
    else:
        if listener in G.eventRegisteredFuncs:
            G.eventRegisteredFuncs[listener].append(func)
        else:
            G.eventRegisteredFuncs[listener] = [func]
    return NodeHandleResult()

def register_event_check(G:Graph, listener, func):
    with G.eventRegisteredFuncs_lock:
        if listener in G.eventRegisteredFuncs:
            G.eventRegisteredFuncs[listener].append(func)
        else:
            G.eventRegisteredFuncs[listener] = [func]
    event = G.listener_event_dic[listener]
    with G.event_loop_lock:
        # names = [i['eventName'] for i in G.event_loop]
        if event in G.event_loop:
            emit_thread(G, event_loop_threading, (G, G.event_loop[event], G.mydata.pickle_up()))

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
    # print(args)
    # eventName = G.get_node_attr(args[0].obj_nodes[0])['code']
    eventName = args[0].values[0]
    info = args[1].obj_nodes[0]
    event = {'eventName': eventName, 'info': info, 'extra':extra}
    # trigger event right away
    print('trigger event: ', eventName)
    listener = G.event_listener_dic[eventName]
    if G.thread_version:
        with G.eventRegisteredFuncs_lock:
            listener_not_registered = True if listener not in G.eventRegisteredFuncs else False
        if listener_not_registered:
            print('listener not registered, store ' , event['eventName'], ' to loop')
            with G.event_loop_lock:
                G.event_loop[eventName] = (event)
        else:
            emit_thread(G, event_loop_threading, (G, event, G.mydata.pickle_up()))
        # tmp = [i.thread_self for i in G.work_queue]
        # print('%%%%%%%%%work in trigger event: ', tmp)
    else:
        event_loop_no_threading(G, event)
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
    type = args[0].values[0]
    listener = args[1].obj_nodes[0]
    # G.attackEntries.insert(0, [type, listener])
    #  attack right away!
    entry = [type, listener]
    if G.thread_version:
        if entry[0]=='bg_chrome_runtime_MessageExternal':
            emit_thread(G, bg_chrome_runtime_MessageExternal_attack, (G, entry, G.mydata.pickle_up()))
        else:
            emit_thread(G, other_attack, (G, entry, G.mydata.pickle_up()))
        # tmp = [i.thread_self for i in G.work_queue]
        # print('%%%%%%%%%work in MarkAttackEntry: ', tmp)
    else:
        if entry[0]=='bg_chrome_runtime_MessageExternal':
            bg_chrome_runtime_MessageExternal_attack(G, entry)
        else:
            other_attack(G, entry)
    return NodeHandleResult()

def debug_sink(G: Graph, caller_ast, extra, _, *args):
    print('code reached')
    print(args)
    return NodeHandleResult()

def sink_function(G: Graph, caller_ast, extra, _, *args):
    sink_objs= []
    print('sink function reached')
    for arg in args:
        # print(arg)
        sink_objs.append(arg.obj_nodes[0])
    for obj in sink_objs:
        offsprings = G.get_off_spring(obj)
        print(offsprings)
        for off in offsprings:
            if off in G.sensitiveSource:
                print('detected!')
    return NodeHandleResult()

# from src.core.vul_func_lists import crx_sink, user_sink, ctrl_sink
# defined_sinkd = crx_sink
# defined_sinkd.extend(user_sink)
# defined_sinkd.extend(ctrl_sink)
# for i in defined_sinkd:
#     i = sink_function
