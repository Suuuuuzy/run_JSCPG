from src.core.graph import Graph
from src.core.utils import *
from src.core.logger import *
from src.plugins.internal.handlers.event_loop import event_loop_threading, other_attack
from .utils import emit_thread
import threading
from src.core.checker import obj_traceback
from src.plugins.internal.handlers.event_loop import attack_dic
from src.core.utils import wildcard

logger = loggers.main_logger

def setup_extension_builtins(G: Graph):
    setup_utils(G)

# setup three functions: RegisterFunc, TriggerEvent, MarkSource here for use
def setup_utils(G: Graph):
    G.add_blank_func_to_scope('RegisterFunc', scope=G.get_cur_window_scope(), python_func=RegisterFunc)
    G.add_blank_func_to_scope('TriggerEvent', scope=G.get_cur_window_scope(), python_func=TriggerEvent)
    G.add_blank_func_to_scope('MarkSource', scope=G.get_cur_window_scope(), python_func=MarkSource)
    G.add_blank_func_to_scope('MarkSink', scope=G.get_cur_window_scope(), python_func=MarkSink)
    G.add_blank_func_to_scope('MarkAttackEntry', scope=G.get_cur_window_scope(), python_func=MarkAttackEntry)
    G.add_blank_func_to_scope('debug_sink', scope=G.get_cur_window_scope(), python_func=debug_sink)
    G.add_blank_func_to_scope('sink_function', scope=G.get_cur_window_scope(), python_func=sink_function)

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
            for ev in G.event_loop[event]:
                emit_thread(G, event_loop_threading, (G, ev, G.mydata.pickle_up()))

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
    """for prop in G.get_prop_obj_nodes(event['info']):
        print(prop)
        for data in G.get_prop_obj_nodes(prop):
            print(G.get_prop_obj_nodes(data))"""
    # trigger event right away
    listener = G.event_listener_dic[eventName]
    if G.thread_version:
        with G.eventRegisteredFuncs_lock:
            listener_not_registered = True if listener not in G.eventRegisteredFuncs else False
        if listener_not_registered:
            print('listener not registered, store ' , event['eventName'], ' to loop')
            with G.event_loop_lock:
                if eventName in G.event_loop:
                    G.event_loop[eventName].append(event)
                else:
                    G.event_loop[eventName] = [event]
        else:
            emit_thread(G, event_loop_threading, (G, event, G.mydata.pickle_up()))
        # tmp = [i.thread_self for i in G.work_queue]
        # print('%%%%%%%%%work in trigger event: ', tmp)
    else:
        G.eventQueue.insert(0, {'eventName': eventName, 'info': info, 'extra': extra})
        # print('=========processing eventName:', event['eventName'])
        # from src.plugins.internal.handlers.event_loop import event_listener_dic
        # if event['eventName'] in event_listener_dic:
        #     listener = event_listener_dic[event['eventName']][0]
        #     listener_not_registered = True if listener not in G.eventRegisteredFuncs else False
        #     if listener_not_registered:
        #         print(event['eventName'], ': event listener not registered')
        #         G.eventQueue.insert(0, {'eventName': eventName, 'info': info, 'extra': extra})
        #     func = event_listener_dic[event['eventName']][1]
        #     func(G, event)
    return NodeHandleResult()


def MarkSourceInGraph(G, sourceObj, sourceName):
    sons = G.get_off_spring(sourceObj)
    sons.add(sourceObj)
    for son in sons:
        G.set_node_attr(son, ('tainted',True))
        # every path is a tuple with (path, source_name)
        G.set_node_attr(son, ('taint_flow', [([son],sourceName)]))
    return NodeHandleResult()

def MarkSource(G: Graph, caller_ast, extra, _, *args):
    sensitiveSource = args[0].obj_nodes[0]
    source_name = args[1].values[0]
    sons = G.get_off_spring(sensitiveSource)
    sons.add(sensitiveSource)
    for son in sons:
        G.set_node_attr(son, ('tainted',True))
        # every path is a tuple with (path, source_name)
        G.set_node_attr(son, ('taint_flow', [([son],source_name)]))
        G.set_node_attr(son,("code", wildcard))
        G.set_node_attr(son, ("value", wildcard))
    return NodeHandleResult()

def MarkSink(G: Graph, caller_ast, extra, _, *args):
    new_sink = args[0].obj_nodes[0]
    G.sinks.add(new_sink)
    return NodeHandleResult()

def MarkAttackEntry(G: Graph, caller_ast, extra, _, *args):
    type = args[0].values[0]
    listener = args[1].obj_nodes[0]
    if type=="bg_tabs_onupdated":
        thread_age = -1;
    else:
        thread_age = 1
    if listener!=G.undefined_obj:
        #  attack right away!
        entry = [type, listener]
        if G.thread_version:
            if entry[0] in attack_dic:
                attack_func = attack_dic[entry[0]]
                emit_thread(G, attack_func, (G, entry, G.mydata.pickle_up()), thread_age = thread_age)
            else:
                emit_thread(G, other_attack, (G, entry, G.mydata.pickle_up()), thread_age = thread_age)
        else:
            # if this attack should be called later
            if type=="bg_tabs_onupdated":
                G.attackEntries.insert(0, entry)
            else:
                if type in attack_dic:
                    attack_dic[type](G, entry)
                else:
                    other_attack(G, entry)
            # G.attackEntries.insert(0, entry)

    return NodeHandleResult()


def MarkAttackEntryOnProperty(G: Graph, type, listener):
    if listener!=G.undefined_obj:
        #  attack right away!
        entry = [type, listener]
        if G.thread_version:
            if entry[0] in attack_dic:
                attack_func = attack_dic[entry[0]]
                emit_thread(G, attack_func, (G, entry, G.mydata.pickle_up()))
            else:
                emit_thread(G, other_attack, (G, entry, G.mydata.pickle_up()))
        else:
            G.attackEntries.insert(0, entry)

def debug_sink(G: Graph, caller_ast, extra, _, *args):
    print('debug code reached')
    print(args)
    sus_objs = set()
    for arg in args:
        for obj in arg.obj_nodes:
            sus_objs.add(obj)
    tmp_objs = set()
    for obj in sus_objs:
        offsprings = G.get_off_spring(obj)
        tmp_objs.update(offsprings)
    sus_objs.update(tmp_objs)
    print("sus_objs", sus_objs)
    for obj in sus_objs:
        print(G.get_node_attr(obj))
    return NodeHandleResult()

# check the sink function
def sink_function(G: Graph, caller_ast, extra, _, *args):
    sink_name = args[-1].values[0]
    sus_objs = set()
    # print('sink function reached:', args[-1].values[0])
    # get sus_objs and sink_nam
    if len(args)>1:
        for i in range(len(args)-1):
            arg = args[i]
            sus_objs.update(arg.obj_nodes)
            if arg.value_sources:
                for objs in arg.value_sources:
                    sus_objs.update(set(objs))
    SpringObjs = set()
    for obj in sus_objs:
        SpringObjs.update(G.get_off_spring(obj))
    sus_objs.update(SpringObjs)

    # if no obj is required, control flow reaches
    if len(sus_objs)==0:
        print(sty.fg.li_green + sty.ef.inverse + f'~~~tainted detected!~~~in extension: ' \
              + G.package_name + ' with ' + sink_name + sty.rs.all)
        res = '~~~tainted detected!~~~in extension: ' + G.package_name + ' with ' + sink_name + '\n'
        res_dir = os.path.join(G.package_name, 'opgen_generated_files')
        with open(os.path.join(res_dir, 'res.txt'), 'a') as f:
            f.write(res)
        G.detected = True
    # check whether the taint flow is vulnerable
    for obj in sus_objs:
        if check_taint(G, obj, sink_name):
            G.detected = True
    return NodeHandleResult()


def sink_function_in_graph(G: Graph, args, sink_name):
    sus_objs = set()
    # print('sink function reached')
    # get sus_objs and sink_name
    for arg in args:
        sus_objs.update(arg.obj_nodes)
        if arg.value_sources:
            for objs in arg.value_sources:
                sus_objs.update(set(objs))
    SpringObjs = set()
    for obj in sus_objs:
        SpringObjs.update(G.get_off_spring(obj))
    sus_objs.update(SpringObjs)
    # if no obj is required, control flow reaches
    if len(sus_objs) == 0:
        print(sty.fg.li_green + sty.ef.inverse + f'~~~tainted detected!~~~in extension: ' \
              + G.package_name + ' with ' + sink_name + sty.rs.all)
        res = '~~~tainted detected!~~~in extension: ' + G.package_name + ' with ' + sink_name + '\n'
        res_dir = os.path.join(G.package_name, 'opgen_generated_files')
        with open(os.path.join(res_dir, 'res.txt'), 'a') as f:
            f.write(res)
        G.detected = True
    # check whether the taint flow is vulnerable
    for obj in sus_objs:
        if check_taint(G, obj, sink_name):
            G.detected = True
    return NodeHandleResult()


invalid_taint  = [("cs_window_eventListener_message","window_postMessage_sink"),
                  ("bg_chrome_runtime_MessageExternal", "window_postMessage_sink")
                  # ("cookies_source", "chrome_cookies_set_sink"),
                  # ("management_getAll_source", "management_setEnabled_id"),
                  # ("management_getAll_source", "management_setEnabled_enabled"),
                  # ("storage_local_get_source", "chrome_storage_local_set_sink"),
                  # ("storage_sync_get_source", "chrome_storage_sync_set_sink")
                    ]
def check_taint(G, obj, sink_name):
    res = ''
    attrs = G.get_node_attr(obj)
    if attrs.get('tainted') and 'taint_flow' in attrs:
        res += (str(attrs['taint_flow']) + '\n')
        for flow in attrs['taint_flow']:
            path = flow[0]
            source_name = flow[1]
            if (source_name, sink_name) in invalid_taint:
                return None
            ast_path = [G.get_obj_def_ast_node(node) for node in path]
            ast_path = [node for node in ast_path if node]
            from src.core.checker import get_path_text
            res += ('from ' + source_name + ' to ' + sink_name + '\n')
            res += (str(ast_path) + '\n')
            # print(ast_path)
            res += (get_path_text(G, ast_path) + '\n')
            print(sty.fg.li_green + sty.ef.inverse + f'~~~tainted detected!~~~in extension: ' \
                  + G.package_name + ' with ' + sink_name + sty.rs.all)
            # print(res)
            res  = '~~~tainted detected!~~~in extension: ' + G.package_name + ' with ' + sink_name + '\n' + res
            res_dir = os.path.join(G.package_name, 'opgen_generated_files')
            with open(os.path.join(res_dir, 'res.txt'), 'a') as f:
                f.write(res)
            return res
    return None



