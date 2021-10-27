from src.core.graph import Graph
from src.core.utils import *
from src.core.logger import *
from src.plugins.internal.handlers.event_loop import event_loop_no_threading, event_loop_threading, bg_chrome_runtime_MessageExternal_attack, other_attack, window_eventListener_attack
from .utils import emit_thread
import threading
from src.core.checker import obj_traceback

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
    G.add_blank_func_to_scope('data_out_function', scope=G.get_cur_window_scope(), python_func=data_out_function)
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
    print('trigger event: ', eventName)
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
        event_loop_no_threading(G, event)
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
    return NodeHandleResult()

def MarkSink(G: Graph, caller_ast, extra, _, *args):
    new_sink = args[0].obj_nodes[0]
    G.sinks.add(new_sink)
    return NodeHandleResult()

def MarkAttackEntry(G: Graph, caller_ast, extra, _, *args):
    type = args[0].values[0]
    listener = args[1].obj_nodes[0]
    if listener!=G.undefined_obj:
        # G.attackEntries.insert(0, [type, listener])
        #  attack right away!
        entry = [type, listener]
        if G.thread_version:
            if entry[0]=='bg_chrome_runtime_MessageExternal':
                emit_thread(G, bg_chrome_runtime_MessageExternal_attack, (G, entry, G.mydata.pickle_up()))
            elif entry[0]=='cs_window_eventListener':
                emit_thread(G, window_eventListener_attack, (G, entry, G.mydata.pickle_up()))
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

def data_out_function(G: Graph, caller_ast, extra, _, *args):
    sus_objs= set()
    print('data out function reached')
    for arg in args:
        sus_objs.add(arg.obj_nodes[0])
    tmp_objs = sus_objs.copy()
    for obj in tmp_objs:
        offsprings = G.get_off_spring(obj)
        sus_objs.update(offsprings)
    tmp_objs = sus_objs.copy()
    for obj in tmp_objs:
        pathes = obj_traceback(G, obj)
        for path in pathes:
            for obj in path:
                sus_objs.add(obj)
    # print(sus_objs)
    # print(G.sensitiveSource)
    for off in sus_objs:
        if off in G.sensitiveSource:
            print('detected!')
    return NodeHandleResult()


# check whether the parameters are tainted
def sink_function(G: Graph, caller_ast, extra, _, *args):
    sus_objs = set()
    # print('sink function reached')
    if len(args)>1:
        for i in range(len(args)-1):
            obj = args[i].obj_nodes[0]
            sus_objs.add(obj)
            sus_objs.update(G.get_off_spring(obj))
    sink_name = args[-1].values[0]
    if len(sus_objs)==0:
        print(sink_name + ' detected')
    for obj in sus_objs:
        attrs = G.get_node_attr(obj)
        if 'tainted' in attrs and attrs['tainted']:
            G.detected = True
            print(sty.fg.li_green + sty.ef.inverse +f'~~~tainted detected!~~~in extension: '\
                  + G.package_name +' with '+ sink_name + sty.rs.all)
            res = '~~~tainted detected!~~~in extension: '+ G.package_name +' with '+ sink_name + '\n'
            # loggers.res_logger.info("~~~tainted detected!~~~in extension: {} with {}".format(
                # G.package_name , sink_name))
            res += print_taint_flow(G, attrs, sink_name)
            res_dir = os.path.join(G.package_name, 'opgen_generated_files')
            # os.makedirs(res_dir, exist_ok=True)
            with open(os.path.join(res_dir, 'res.txt'), 'a') as f:
                f.write(res)
            # obj_pathes, ast_pathes, text_path = obj_traceback(G, obj)
            # print(sty.fg.li_green + sty.ef.inverse +f'{text_path}' + sty.rs.all)
    return NodeHandleResult()


def print_taint_flow(G, attrs, sink_name):
    res = ''
    if 'taint_flow' in attrs:
        print(attrs['taint_flow'])
        res += (str(attrs['taint_flow']) + '\n')
        for flow in attrs['taint_flow']:
            path = flow[0]
            ast_path = [G.get_obj_def_ast_node(node) for node in path]
            ast_path = [node for node in ast_path if node]
            from src.core.checker import get_path_text
            print('from ' + flow[1] + ' to ' + sink_name)
            res += ('from ' + flow[1] + ' to ' + sink_name +'\n')
            print(ast_path)
            res += (str(ast_path)+'\n')
            print(get_path_text(G, ast_path))
            res += (get_path_text(G, ast_path)+'\n')
    return res


