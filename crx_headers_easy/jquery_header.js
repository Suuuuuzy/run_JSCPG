function eval(para1){
    sink_function(para1, 'eval_sink');
}

window.addEventListener = function(type, listener,  [options]){
    if (type=='message'){
        MarkAttackEntry('cs_window_eventListener', listener);
    }
    else if(type=='load'){
        listener();
    }
};