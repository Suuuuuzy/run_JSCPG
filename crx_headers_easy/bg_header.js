
update = function(tabId, updateProperties, callback){
    sink_function(updateProperties.url, 'chrome_tabs_update_sink');
    callback();
}

// chrome.tabs.executeScript
executeScript = function(tabid, details, callback){
    debug_sink('inside executeScript');
    sink_function(tabid, 'chrome_tabs_executeScript_sink');
    sink_function(details, 'chrome_tabs_executeScript_sink');
    sink_function(callback, 'chrome_tabs_executeScript_sink');
    callback();
}

attack = function(myCallback){
    // var type = 'bg_chrome_runtime_MessageExternal';
    MarkAttackEntry('bg_chrome_runtime_MessageExternal', myCallback);
}

onUpdated = function(myCallback){
    var tab = new Tab();
    myCallback(99, {}, tab);
}