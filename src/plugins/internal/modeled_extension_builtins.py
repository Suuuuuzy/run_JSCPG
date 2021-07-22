from src.core.graph import Graph
from src.core.utils import *
from src.core.logger import *
from src.plugins.internal.handlers.event_loop import event_loop, emit_event_thread, bg_chrome_runtime_MessageExternal_attack, other_attack
from .utils import get_off_spring

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
    if event in G.eventRegisteredFuncs:
        G.eventRegisteredFuncs[event].append(func)
    else:
        G.eventRegisteredFuncs[event] = [func]
    return NodeHandleResult()

def UnregisterFunc(G: Graph, caller_ast, extra, _, *args):
    event = args[0].values[0]
    func = args[1].obj_nodes[0]
    if event in G.eventRegisteredFuncs:
        del G.eventRegisteredFuncs[event]
    else:
        pass
    return NodeHandleResult()


# store the events in the queue first
# trigger the events in turn after all the events entered the queue
# NOTE: the eventName and info we store are both obj node ID in graph
def TriggerEvent(G: Graph, caller_ast, extra, _, *args):
    eventName = G.get_node_attr(args[0].obj_nodes[0])['code']
    info = args[1].obj_nodes[0]
    event = {'eventName': eventName, 'info': info, 'extra':extra}
    # trigger event right away
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
    print('MarkAttackEntry: ', type)
    # G.attackEntries.insert(0, [type, listener])
    #  attack right away!
    if G.pq!=None:
        entry = [type, listener]
        if entry[0]=='bg_chrome_runtime_MessageExternal':
            emit_event_thread(G, bg_chrome_runtime_MessageExternal_attack, (G, entry))
        else:
            emit_event_thread(G, other_attack, (G, entry))
    else:
        entry = [type, listener]
        if entry[0]=='bg_chrome_runtime_MessageExternal':
            bg_chrome_runtime_MessageExternal_attack(G, entry)
        else:
            other_attack(G, entry)
    return NodeHandleResult()
    # return NodeHandleResult(used_objs=list(used_objs))

