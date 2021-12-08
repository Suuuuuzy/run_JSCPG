addListener = function(myCallback){
    MarkAttackEntry('bg_chrome_runtime_MessageExternal', myCallback);
}


executeScript = function(tabid, details, callback){
    sink_function(tabid, 'chrome_tabs_executeScript_sink');
    sink_function(details, 'chrome_tabs_executeScript_sink');
    sink_function(callback, 'chrome_tabs_executeScript_sink');
    callback();
}