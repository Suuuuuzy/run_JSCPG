from src.core.utils import NodeHandleResult
from src.plugins.internal.handlers.functions import call_function
from src.core.graph import Graph
from src.plugins.internal.utils import get_df_callback, get_off_spring


def event_loop(G: Graph):
    # TODO: see what happens after the first round of event registering
    print('####SEE eventRegisteredFuncs:')
    for i in G.eventRegisteredFuncs:
        print(i, G.eventRegisteredFuncs[i])
        print(G.get_obj_def_ast_node(G.eventRegisteredFuncs[i]))
    print('####SEE original event queue:')
    cnt = 0
    for i in G.eventQueue:
        print('event ', cnt)
        print('eventName:', i['eventName'])
        # print(G.get_obj_def_ast_node(i['eventName']))
        # print(G.get_node_attr(i['eventName']))
        print('info: ', i['info'])
        # print(G.get_obj_def_ast_node(i['info']))
        print(G.get_node_attr(i['info']))
        cnt += 1
    # TODO: if there is bg_chrome_tabs_onActivated, trigger it now
    if 'bg_chrome_tabs_onActivated' in G.eventRegisteredFuncs:
        print('bg_chrome_tabs_onActivated')
        func_objs = G.get_objs_by_name('ActiveInfo', scope=G.bg_scope, branches=[])
        # print('debug func_objs ', G.get_node_attr(G.get_obj_def_ast_node(func_objs[0])))
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
    # TODO: execute the attack entries, we assume there won't be more entries as the execution goes
    print('========SEE attackEntries:========')
    for i in G.attackEntries:
        print(i)
        print(G.get_node_attr(G.get_obj_def_ast_node(i))) # a list of attack entries (function declaration objs)
    while len(G.attackEntries) != 0:
        entry = G.attackEntries.pop()
        print('attack:', entry[0])
        func_objs =  [entry[1]]
        args = [] # no args
        returned_result, created_objs = call_function(G, func_objs, args=args, this=NodeHandleResult(), extra=None,
                    caller_ast=None, is_new=False, stmt_id='Unknown',
                    mark_fake_args=True)

    # TODO: add asynchronous functions
    while len(G.eventQueue) != 0:
        event = G.eventQueue.pop()
        print('processing eventName:', event['eventName'])
        # print('info: ', event['info'])
        # print(G.get_node_attr(event['info']))

        if event['eventName'] == 'cs_chrome_runtime_connect':
            if 'bg_chrome_runtime_onConnect' in G.eventRegisteredFuncs:
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
                # this obj should be a newed Port
                # print('this should be Port obj')
                # print(G.get_node_attr(returned_result.obj_nodes[0]))
                # call the callback function
                # myCallback(port);
                func_objs = G.eventRegisteredFuncs['bg_chrome_runtime_onConnect']
                args = [returned_result]
                returned_result, created_objs = call_function(G, func_objs, args=args, this=NodeHandleResult(),extra=None,
                                caller_ast=None, is_new=False, stmt_id='Unknown',
                                mark_fake_args=False)
                # callback = get_df_callback(G.get_obj_def_ast_node(func_objs[0]))

                # this should be the result of the callback function, not important
        elif event['eventName'] == 'cs_port_postMessage':
            if 'bg_port_onMessage' in G.eventRegisteredFuncs:
                message = G.get_child_nodes(event['info'], child_name='message')[0]
                message = G.get_child_nodes(message, edge_type='NAME_TO_OBJ')[0]
                message = G.copy_obj(message, ast_node=None, deep=True)
                # print('message obj node:', G.get_node_attr(message))
                args = [NodeHandleResult(obj_nodes=[message])]
                func_objs = G.eventRegisteredFuncs['bg_port_onMessage']
                returned_result, created_objs = call_function(G, func_objs, args=args, this=NodeHandleResult(),extra=None,
                            caller_ast=None, is_new=False, stmt_id='Unknown',
                            mark_fake_args=False)
        elif event['eventName'] == 'bg_port_postMessage':
            if 'cs_port_onMessage' in G.eventRegisteredFuncs:
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
        elif event['eventName'] == 'cs_chrome_runtime_sendMessage':
            if 'bg_chrome_runtime_onMessage' in G.eventRegisteredFuncs:
                # print('in runtime')
                extra = event['extra']
                message = G.get_prop_obj_nodes(event['info'], prop_name = 'message')[0]
                message = G.copy_obj(message, ast_node=None, deep=True)
                info_nodes = G.get_prop_name_nodes(event['info'])
                # for info_node in info_nodes:
                #     print(G.get_node_attr(info_node))
                # print(G.get_obj_def_ast_node(message))
                # print('message obj node:',message,  G.get_node_attr(message))
                # (message: any, sender: MessageSender, sendResponse: function)
                func_objs = G.get_objs_by_name('MessageSender', scope=G.bg_scope, branches=[])
                MessageSender, created_objs = call_function(G, func_objs, args=[], this=NodeHandleResult(),
                              extra=None,
                              caller_ast=None, is_new=True, stmt_id='Unknown',
                              func_name='MessageSender',
                              mark_fake_args=False)
                MessageSender.obj_nodes = created_objs
                # print('MessageSender obj', created_objs[0], G.get_node_attr(created_objs[0]))
                sendResponse = G.get_objs_by_name('sendResponse', scope=G.bg_scope, branches=[])
                # print('sendResponse obj', sendResponse[0], G.get_obj_def_ast_node(sendResponse[0]), G.get_node_attr(sendResponse[0]))
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
        elif event['eventName'] == 'bg_chrome_tabs_sendMessage':
            if 'cs_chrome_runtime_onMessage' in G.eventRegisteredFuncs:
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
        elif event['eventName'] == 'bg_chrome_runtime_onMessage_response':
            if 'cs_chrome_runtime_sendMessage_onResponse' in G.eventRegisteredFuncs:
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
        elif event['eventName'] == 'cs_chrome_tabs_onMessage_response':
            if 'bg_chrome_tabs_sendMessage_onResponse' in G.eventRegisteredFuncs:
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

    




