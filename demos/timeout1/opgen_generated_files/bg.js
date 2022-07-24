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
// original file:/Users/jianjia/Documents/tmp/EOPG/run_JSCPG_merge/demos/timeout1/nmextback.js

//==========================================================================
// Copyright (c) Fabasoft R&D GmbH, A-4020 Linz, 1988-2021.
//
// Alle Rechte vorbehalten. Alle verwendeten Hard- und Softwarenamen sind
// Handelsnamen und/oder Marken der jeweiligen Hersteller.
//
// Der Nutzer des Computerprogramms anerkennt, dass der oben stehende
// Copyright-Vermerk im Sinn des Welturheberrechtsabkommens an der vom
// Urheber festgelegten Stelle in der Funktion des Computerprogramms
// angebracht bleibt, um den Vorbehalt des Urheberrechtes genuegend zum
// Ausdruck zu bringen. Dieser Urheberrechtsvermerk darf weder vom Kunden,
// Nutzer und/oder von Dritten entfernt, veraendert oder disloziert werden.
//==========================================================================
var ERRORCODE = {
  COMMON_FAILED: 1010,
  COMMON_TIMEOUT: 1011,
  MSGSEND_EXTENSION_NMHOST_DISCONNECTED: 2020,
  MSGSEND_EXTENSION_FORWARD_TO_NMHOST_FAILED: 2021
};
//
// browser action communication
//
var extensionAction = {
  extensionActionSerial: 0,
  msgBoard: {},
  getExtensionActionMsgID: function()
  {
    return "ea.pm21-" + (this.extensionActionSerial++);
  },
  extensionActionOnPortDisconnect: function()
  {
    for (var callid in this.msgBoard) {
      this.msgBoard[callid].rejected({
        faildata: {
          code: ERRORCODE.MSGSEND_EXTENSION_NMHOST_DISCONNECTED
        }
      });
    }
    this.msgBoard = {};
  },
  perform: function(method, indata) {
    var typesuffix = window.localStorage.getItem("lasttypesuffix");
    if (!typesuffix) {
      typesuffix = "pm21";
    }
    if (!nativeports[typesuffix]) {
      nativeports[typesuffix] = {};
    }
    var nativeport = nativeports[typesuffix];
    if (!nativeport.connected) {
      nativeports[typesuffix].port = connect(typesuffix);
    }
    if (nativeport.connected) {
      return new Promise(function(resolve, rejected) {
        var callid = this.getExtensionActionMsgID();
        var msg = {
          resolve: resolve,
          rejected: rejected
        };
        this.msgBoard[callid] = msg;
        var data = {
          method: method,
          callid: callid,
          type: "com.fabasoft.nm.ea",
          srcurl: "about://nmext",
          indata: indata
        }
        try {
          nativeport.port.postMessage(data);
        } catch(e) {
          var result = {
            faildata: {
              code: ERRORCODE.MSGSEND_EXTENSION_FORWARD_TO_NMHOST_FAILED,
              cause: e.stack ? e.stack.toString() : e.toString(),
            }
          };
          rejected(result);
        }
      }.bind(this));
    }
    else {
      var result = {
        faildata: {
          code: ERRORCODE.MSGSEND_EXTENSION_FORWARD_TO_NMHOST_FAILED
        }
      };
      return Promise.reject(result);
    }
  },
  performWithTimeout(method, indata, timeout) {
    return new Promise(function(resolve, reject) {
      this.perform(method, indata).then(function(data) {
        resolve(data);
      }).catch(function(error) {
        reject(error);
      });
      var timeoutid = window.setTimeout(function() {
        reject({
          faildata: {
            code: ERRORCODE.COMMON_TIMEOUT
          }
        });
      }, timeout);
    }.bind(this));
  }
};
//
// browser action button
//
chrome.browserAction.onClicked.addListener(function(activeTab)
{
  extensionAction.performWithTimeout("GetCurrentDomainHref", null, 3000).then(function(data) {
    return data.outdata.href;
  }).catch(function(error) {
    return "https://fabasoft.com/support";
  }).then(function(href) {
    chrome.tabs.create({url: href});
  });
});
//
// connect to native host
//
function connect(typesuffix)
{
  // console.log("com.fabasoft.nm/pm21/nmextback: CONNECT NATIVE: com.fabasoft.nmhost" + typesuffix);
  try {
    var port = chrome.runtime.connectNative("com.fabasoft.nmhost" + typesuffix);
    nativeports[typesuffix].connected = true;
    if (port) {
      //
      // messages received from native messaging host: forward to content script
      //
      port.onMessage.addListener(function(message) {
        try {
          if (!message.srcid && message.type && message.type == "com.fabasoft.nm.broadcast") {
            // console.log("com.fabasoft.nm/pm21/nmextback: Broadcast message from from native (forward as callback message)");
            // console.log(message);
            message.type = "com.fabasoft.nm.callback";
            for (var id in contentports) {
              if (message.srcids && message.srcids.indexOf(String(id)) != -1) {
                try {
                  if (contentports[id].typesuffix === typesuffix) {
                    // console.log("com.fabasoft.nm/pm21/nmextback: Broadcast message from from native: Execute on tab " + id);
                    contentports[id].port.postMessage(message);
                  }
                  else {
                    // console.log("com.fabasoft.nm/pm21/nmextback: Broadcast message from from native: Other typesuffix: Skip executing on tab " + id);
                  }
                } catch(e) {
                  // console.log("com.fabasoft.nm/pm21/nmextback: Broadcast message from from native: Failed to execute on tab " + id);
                  // console.log(e);
                }
              }
              else {
                // console.log("com.fabasoft.nm/pm21/nmextback: Broadcast message from from native: Skip execution on tab " + id);
              }
            }
          }
          else if (message.srcid && message.type && message.type == "com.fabasoft.nm.callback") {
            // console.log("com.fabasoft.nm/pm21/nmextback: Callback message from from native (src id: " + message.srcid + ")");
            // console.log(message);
            if (message.method == "Login") {
              fork(message, false);
            }
            else {
              contentports[message.srcid].port.postMessage(message);
            }
          }
          else if (message.fork && message.outdata) {
            fork(message, true);
          }
          else if (message.callid && message.callid.startsWith("ea")) {
            var msg = extensionAction.msgBoard[message.callid];
            if (msg) {
              if (message.faildata) {
                msg.rejected(message);
              }
              else {
                msg.resolve(message);
              }
              delete extensionAction.msgBoard[message.callid];
            }
          }
          else {
            // console.log("com.fabasoft.nm/pm21/nmextback: Message from native (src id: " + message.srcid + ")");
            // console.log(message);
            nativeports[typesuffix].replied = true;
            message.type = "com.fabasoft.nm.recv";
            contentports[message.srcid].port.postMessage(message);
          }
        } catch (e) {
          // console.log("com.fabasoft.nm/pm21/nmextback: Failed to forward received message to browser extension"
          //   + (message && message.srcid?" (src id: " + message.srcid + ")" : ""));
          // console.log(e);
        }
      });
      port.onDisconnect.addListener(function() {
        // if (chrome.runtime.lastError && chrome.runtime.lastError.message) {
        //   console.log("com.fabasoft.nm/pm21/nmextback: Native host disconnect: " + chrome.runtime.lastError.message);
        // }
        // else {
        //   console.log("com.fabasoft.nm/pm21/nmextback: Native host disconnect");
        // }
        nativeports[typesuffix].connected = false;
        extensionAction.extensionActionOnPortDisconnect();
        if (nativeports[typesuffix].errorondisconnectfun) {
          nativeports[typesuffix].errorondisconnectfun();
        }
      });
      return port;
    }
    else {
      // console.log("com.fabasoft.nm/pm21/nmextback: Connecting to native host failed (chrome.runtime.connectNative returned null)");
      nativeports[typesuffix].connected = false;
      throw new Error("chrome.runtime.connectNative did not return port object");
    }
  } catch (e) {
    // console.log("com.fabasoft.nm/pm21/nmextback: Connecting to native host failed");
    // console.log(e);
    nativeports[typesuffix].connected = false;
    throw e;
  }
}
var nativeports = {};
var contentports = {};
var nextcontentportid = 0;
//
// messages received from content script: forward to native messaging host
//
chrome.runtime.onConnect.addListener(function(contentport) {
  var contentportid = contentport.sender.tab.id + "#" + nextcontentportid++;
  var released = false;
  // console.log("com.fabasoft.nm/pm21/nmextback: Content script connected: " + contentportid);
  // if (contentports[contentportid]) {
  //   console.log("com.fabasoft.nm/pm21/nmextback: Content script already connected: " + contentportid);
  // }
  if (!contentports[contentportid]) {
    contentports[contentportid] = {};
  }
  contentports[contentportid].port = contentport;
  contentport.onMessage.addListener(function(data, sender) {
    // console.log("com.fabasoft.nm/pm21/nmextback: Received request; Content script: " + contentportid);
    // console.log(data);
    if (data && data.type === "com.fabasoft.nm.back.connect") {
      try {  
        contentports[contentportid].typesuffix = data.typesuffix;
        contentport.postMessage({
          type: "com.fabasoft.nm.back.connect"
        });
      } catch(e) {
        // console.log("com.fabasoft.nm/pm21/nmextback: Failed to forward connect signal to content script (src id: " + contentportid + ")");
        // console.log(e);
        if (!released) {
          delete contentports[contentportid];
          released = true;
        }
      }
      return;
    }
    var typesuffix = data.typesuffix;
    try {
      var newport = false;
      if (!nativeports[typesuffix]) {
        nativeports[typesuffix] = {};
      }
      var nativeport = nativeports[typesuffix];
      if (!nativeport.connected) {
        if (data.method == "Init") {
          nativeport.replied = false;
        }
        nativeport.port = connect(typesuffix);
        nativeport.aborted = false;
        newport = true;
      }
      if (!nativeport.replied || newport) {
        nativeport.errorondisconnectfun = function() {
          if (nativeport.replied) {
            if (!nativeport.aborted) {
              nativeport.aborted = true;
              // console.log("com.fabasoft.nm/pm21/nmextback: Native host " + typesuffix + " disconnect from connected port with already having successful replies: reply abort error");
              var response = {
                type: "com.fabasoft.nm.abort",
                outdata: null,
                faildata: {
                  code: ERRORCODE.MSGSEND_EXTENSION_NMHOST_DISCONNECTED,
                  detail: {
                    aborted: true
                  }
                },
              };
              for (var cpid in contentports) {
                try {
                  if (contentports[cpid].typesuffix === typesuffix) {
                    contentports[cpid].port.postMessage(response);
                  }
                } catch(e) {
                  // console.log("com.fabasoft.nm/pm21/nmextback: Failed to forward abort message to browser extension (src id: " + cpid + ")");
                  // console.log(e);
                }
              }
            }
            else {
              // console.log("com.fabasoft.nm/pm21/nmextback: Native host disconnect from reconnected port: ignore additional abort disconnect");
            }
          }
          else {
            // console.log("com.fabasoft.nm/pm21/nmextback: Native host disconnect from reconnected port: reply error");
            var response = {
              method: data.method,
              callid: data.callid,
              type: "com.fabasoft.nm.recv",
              outdata: null,
              faildata: {
                code: ERRORCODE.MSGSEND_EXTENSION_NMHOST_DISCONNECTED,
                request: data
              }
            };
            try {
              contentport.postMessage(response);
            } catch(e) {
              // console.log("com.fabasoft.nm/pm21/nmextback: Failed to forward message to browser extension (src id: " + contentportid + ")");
              // console.log(e);
            }
          }
        };
      }
      data.srcid = contentportid.toString();
      if (data.method == "Init") {
        data.alltabids = [];
        for (var id in contentports) {
          if (contentports[id].typesuffix === typesuffix) {
            data.alltabids.push(id.toString());
          }
        }
        window.localStorage.setItem("lasttypesuffix", typesuffix);
        postMessageWithCookies(data, contentport, contentportid, typesuffix);
      }
      else if (data.method == "UpdateLoginToken") {
        postMessageWithCookies(data, contentport, contentportid, typesuffix);
      }
      else {
        nativeports[typesuffix].port.postMessage(data);
      }
    } catch (e) {
      // console.log("com.fabasoft.nm/pm21/nmextback: Failed to send message to native host");
      // console.log(e);
      nativeports[typesuffix].connected = false;
      var response = {
        method: data.method,
        callid: data.callid,
        type: "com.fabasoft.nm.recv",
        outdata: null,
        faildata: {
          code: ERRORCODE.MSGSEND_EXTENSION_FORWARD_TO_NMHOST_FAILED,
          cause: e.stack ? e.stack.toString() : e.toString(),
          request: data
        }
      };
      try {
        contentport.postMessage(response);
      } catch(e) {
        // console.log("com.fabasoft.nm/pm21/nmextback: Failed to forward message to browser extension (src id: " + contentportid + ")");
        // console.log(e);
      }
    }
  });
  contentport.onDisconnect.addListener(function() {
    // console.log("com.fabasoft.nm/pm21/nmextback: Content script disconnected: " + contentportid);
    if (!released) {
      delete contentports[contentportid];
      released = true;
    }
  });
  try {  
    contentport.postMessage({
      type: "com.fabasoft.nm.back.connect"
    });
  } catch(e) {
    // console.log("com.fabasoft.nm/pm21/nmextback: Failed to forward connect signal to content script (src id: " + contentportid + ")");
    // console.log(e);
    if (!released) {
      delete contentports[contentportid];
      released = true;
    }
  }
});
//
// post message with cookies
//
function postMessageWithCookies(data, contentport, contentportid, typesuffix)
{
  function handleError(e, connection)
  {
    // console.log("com.fabasoft.nm/pm21/nmextback: Failed to send message to native host (with cookies)");
    // console.log(e);
    if (connection) {
      nativeports[typesuffix].connected = false;
    }
    if (data.indata && data.indata.cookies) {
      delete data.indata.cookies;
    }
    var response = {
      method: data.method,
      callid: data.callid,
      type: "com.fabasoft.nm.recv",
      outdata: null,
      faildata: {
        code: connection ? ERRORCODE.MSGSEND_EXTENSION_FORWARD_TO_NMHOST_FAILED : ERRORCODE.COMMON_FAILED,
        cause: e.stack ? e.stack.toString() : e.toString(),
        request: data
      }
    };
    try {
      contentport.postMessage(response);
    } catch(e) {
      // console.log("com.fabasoft.nm/pm21/nmextback: Failed to forward message to browser extension (src id: " + contentportid + ")");
      // console.log(e);
    }
  }
  try {
    chrome.cookies.getAllCookieStores(function(stores) {
      var tabid = Number(contentportid.split("#")[0]);
      try {
        var storeid = null;
        for (var i = 0;i < stores.length; i++) {
          for (var j = 0;j < stores[i].tabIds.length; j++) {
            if (stores[i].tabIds[j] === tabid) {
              storeid = stores[i].id;
              break;
            }
          }
          if (storeid) {
            break;
          }
        }
        chrome.cookies.getAll({url:data.srcurl, storeId:storeid}, function(cookies) {
          try {
            var cookievalues = {};
            if (cookies) {
              for (var i = 0;i < cookies.length; i++) {
                var cookie = cookies[i];
                cookievalues[cookie.name] = cookie.value;
              }
            }
            if (data.indata.cookies) {
              for (var c of data.indata.cookies.split(";")) {
                var cv = c.split("=");
                cookievalues[cv[0]] = cv[1];
              }
            }
            var cookiestr = "";
            for (var c in cookievalues) {
              if (cookiestr) {
                cookiestr += ";";
              }
              cookiestr += c + "=" + cookievalues[c];
            }
            data.indata.cookies = cookiestr;
            // console.log("Cookies from url [" + data.srcurl + "] and store [" + storeid + "] for message: " + cookiestr);
          } catch(e) {
            handleError(e);
          }
          try {
            nativeports[typesuffix].port.postMessage(data);
          } catch(e) {
            handleError(e, true);
          }
        });
      } catch(e) {
        handleError(e);
      }
    });
  } catch(e) {
    handleError(e);
  }
}
//
// fork received login token
//
function fork(message, replyerror)
{
  if (message.outdata) {
    var url = message.outdata.domainhref;
    if (url) {
      var directSetCookie = false;
      var setCookiePromise;
      if (false) {
        setCookiePromise = browser.tabs.get(Number(message.srcid.split("#")[0])).then(function(tab) {
          directSetCookie = tab.incognito;
          if (directSetCookie) {
            return browser.cookies.set({
              url: url,
              name: "FSC",
              value: message.outdata.token,
              storeId: tab.cookieStoreId,
              secure: true,
              httpOnly: true
            });
          }
        }).then(function() {
          if (directSetCookie) {
            message.outdata = null;
            try {
              if (!message.type) {
                message.type = "com.fabasoft.nm.recv";
              }
              contentports[message.srcid].port.postMessage(message);
            } catch(e) {
              // console.log("com.fabasoft.nm/pm21/nmextback: Failed to forward received message to browser extension"
              //   + (message && message.srcid?" (src id: " + message.srcid + ")" : ""));
              // console.log(e);
            }
          }
        }).catch(function(e) {
          if (replyerror) {
            var response = {
              method: message.method,
              callid: message.callid,
              type: "com.fabasoft.nm.recv",
              outdata: null,
              faildata: {
                code: ERRORCODE.COMMON_FAILED
              }
            };
            try {
              contentports[message.srcid].port.postMessage(response);
            } catch(e) {
              // console.log("com.fabasoft.nm/pm21/nmextback: Failed to forward error message to browser extension (src id: " + message.srcid + ")");
              // console.log(e);
            }
          }
        });
      }
      else {
        setCookiePromise = Promise.resolve();
      }
      setCookiePromise.then(function() {
        // console.log("com.fabasoft.nm/pm21/nmextback: SKIP FORK REQUEST: " + directSetCookie);
        if (directSetCookie) {
          return;
        }
        if (!url.endsWith("/")) {
          url += "/";
        }
        url += "login/fork";
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("POST", url, true);
        xmlhttp.onload = function msgsend_xmlhttp_fork_onload() {
          if (xmlhttp.readyState == 4 &&
            xmlhttp.status >= 200 && xmlhttp.status < 300) {
            message.outdata = null;
            try {
              if (!message.type) {
                message.type = "com.fabasoft.nm.recv";
              }
              contentports[message.srcid].port.postMessage(message);
            } catch(e) {
              // console.log("com.fabasoft.nm/pm21/nmextback: Failed to forward received message to browser extension"
              //   + (message && message.srcid?" (src id: " + message.srcid + ")" : ""));
              // console.log(e);
            }
          }
          else {
            xmlhttp.onerror();
          }
        };
        xmlhttp.onerror = function msgsend_xmlhttp_fork_onerror() {
          if (replyerror) {
            var response = {
              method: message.method,
              callid: message.callid,
              type: "com.fabasoft.nm.recv",
              outdata: null,
              faildata: {
                code: ERRORCODE.COMMON_FAILED
              }
            };
            try {
              contentports[message.srcid].port.postMessage(response);
            } catch(e) {
              // console.log("com.fabasoft.nm/pm21/nmextback: Failed to forward error message to browser extension (src id: " + message.srcid + ")");
              // console.log(e);
            }
          }
        };
        xmlhttp.send(message.outdata.token);
      });
    }
  }
}
