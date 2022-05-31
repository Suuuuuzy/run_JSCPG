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
//  ========= window ========= 

// targetWindow.postMessage(message, targetOrigin, [transfer]);
window.postMessage = function(message, targetOrigin, [transfer]){
    sink_function(message, 'window_postMessage_sink');
};

// target.addEventListener(type, listener [, options]);
// the 'e' parameter passed to listener can be ignored, otherwise, it is the event object
window.addEventListener = function(type, listener,  [options]){
    MarkAttackEntry('cs_window_eventListener_' + type, listener);
};


window.top = new Object();
window.top.addEventListener = window.addEventListener;

window.localStorage = new Object();
window.localStorage.removeItem = function(a){
    sink_function(a, 'localStorage_remove_sink');
};

window.localStorage.setItem = function(a, b){
    sink_function(a, 'localStorage_setItem_key');
    sink_function(b, 'localStorage_setItem_value');
};

window.localStorage.getItem = function(a){
    var localStorage_getItem = 'value';
    MarkSource(localStorage_getItem, 'localStorage_getItem_source');
};

window.localStorage.clear = function(){
    sink_function('localStorage_clear_sink');
};


window.frames[0] = window;
window.frames[1] = window;

var self = window;
var top = window;

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
MarkSource(Document_element.prototype.innerText, "document.body.innerText");

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


fetch_obj = function(){}

fetch = function(resource, options){
    sink_function(resource, "fetch_resource_sink");
    sink_function(options, "fetch_options_sink");
    return new fetch_obj();
}

fetch_obj.prototype.then = function(callback){
    var responseText = 'data_from_fetch';
    MarkSource(responseText, 'fetch_source');
    callback(responseText);
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
    return new externalPort(connectInfo);
};

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
// original file:/media/data2/jianjia/extension_data/unzipped_extensions/makmbhklgjochgddcfkebmjcnlkagjkh/background.js

!function(t){var e={};function r(n){if(e[n])return e[n].exports;var o=e[n]={i:n,l:!1,exports:{}};return t[n].call(o.exports,o,o.exports,r),o.l=!0,o.exports}r.m=t,r.c=e,r.d=function(t,e,n){r.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},r.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},r.t=function(t,e){if(1&e&&(t=r(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)r.d(n,o,function(e){return t[e]}.bind(null,o));return n},r.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return r.d(e,"a",e),e},r.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},r.p="",r(r.s=641)}({11:function(t,e){t.exports=function(t,e,r){return e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}},156:function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=r(52),o=r(65),i=r(91),a=r(92);e.default=function(t,e,r){void 0===r&&(r={});var s="function"==typeof t?function(e){return n([t(e)])}:function(e){return i.default(t,e.type)};return function(t){return function(n,i){var u=t(n,i),c=o.default(s(i),n,i,u);return a.default(c,e,r,n,i,u),u}}}},157:function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default=function(t){return"object"==typeof t&&"function"==typeof t.then}},158:function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=r(52),o=r(65),i=r(91),a=r(92);e.default=function(t,e,r){void 0===r&&(r={});var s="function"==typeof t?function(e){return n([t(e)])}:function(e){return i.default(t,e.type)};return function(t){return function(n){return function(i){var u=t.getState(),c=n(i),f=t.getState(),l=o.default(s(i),u,i,f);return a.default(l,e,r,u,i,f),c}}}}},16:function(t,e,r){"use strict";(function(t){r.d(e,"r",(function(){return d})),r.d(e,"p",(function(){return y})),r.d(e,"n",(function(){return b})),r.d(e,"m",(function(){return v})),r.d(e,"l",(function(){return w})),r.d(e,"a",(function(){return _})),r.d(e,"c",(function(){return O})),r.d(e,"i",(function(){return j})),r.d(e,"h",(function(){return P})),r.d(e,"g",(function(){return x})),r.d(e,"k",(function(){return S})),r.d(e,"s",(function(){return A})),r.d(e,"q",(function(){return E})),r.d(e,"e",(function(){return q})),r.d(e,"d",(function(){return B})),r.d(e,"b",(function(){return M})),r.d(e,"o",(function(){return D})),r.d(e,"j",(function(){return I}));var n=r(11),o=r.n(n),i=r(97),a=r(23),s=r(18);function u(t,e){var r=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),r.push.apply(r,n)}return r}function c(t){for(var e=1;e<arguments.length;e++){var r=null!=arguments[e]?arguments[e]:{};e%2?u(Object(r),!0).forEach((function(e){o()(t,e,r[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(r)):u(Object(r)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(r,e))}))}return t}var f,l="https://m.instantsearch.net/stats",d=function(t){f=t};localStorage.firstRun||(localStorage.firstRun=Date.now());var p=parseInt(localStorage.firstRun);localStorage.lastActivePing||(localStorage.lastActivePing="0");var h=parseInt(localStorage.lastActivePing),y=function(e,r){if(t.chrome&&chrome.runtime&&chrome.runtime.setUninstallURL){var n=Object(s.a)(l,c(c({},r),{},{t:"uninstall",rtag:e.rtag,jsv:a.d,rsrc:"e",te:Math.floor((Date.now()-p)/1e3),url:1}));if(n.length>255){var o=n.length;(n=Object(s.a)(l,{utm_source:r.utm_source,utm_medium:r.utm_medium,utm_campaign:r.utm_campaign,t:"uninstall",rtag:e.rtag,jsv:a.d,rsrc:"e",te:Math.floor((Date.now()-p)/1e3),url:1,zzz:o})).length>255&&(n=Object(s.a)(l,{t:"uninstall",rtag:e.rtag,jsv:a.d,rsrc:"e",te:Math.floor((Date.now()-p)/1e3),url:1,zzz:o}))}try{chrome.runtime.setUninstallURL(n)}catch(t){}}};function g(){return Math.floor(Date.now()/1e3/86400)}var b=function(){var t=[{type:"newtab"}];return g()>h&&t.push({type:"active",status:function(t){t&&(localStorage.lastActivePing=g())}}),localStorage.logInstall&&t.push({type:"install",status:function(t){t&&localStorage.removeItem("logInstall")}}),{event:t,type:"st/analytics/LOG"}};function m(t){return{event:{type:t,async:!0},type:"st/analytics/LOG"}}var v=function(){return m("news_click")},w=function(){return m("news_ad_click")},_=function(){return m("background_click")},O=function(){return m("bookmark_click")},j=function(){return m("history_click")},P=function(){return m("google_apps_click")},x=function(){return m("favorite_click")},S=function(){return m("most_visited_click")},A=function(){return m("suggestion_click")},E=function(t){return{event:{type:"search",value:t,async:!0},type:"st/analytics/LOG"}},T=function(t){return{event:{type:"background_rotation_type_change",value:t,async:!0,once_per_tab:!0},type:"st/analytics/LOG"}};function k(t){return{event:{type:t,once_per_tab:!0},type:"st/analytics/LOG"}}var q=function(){return k("customize_search")},B=function(){return k("customize_favorites")},M=function(){return k("background_video_play")},D=function(t){return"googleApps"===t&&(t="google_apps"),k(t)},I=function(){localStorage.logInstall=!0};function R(t,e){var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:function(){},n=Object(s.a)(t,e),o=document.createElement("img");o.className="pixel",o.onload=function(){o.parentNode.removeChild(o),r(!0)},o.onerror=function(){o.parentNode.removeChild(o),r(!1)},o.src=n,document.body.appendChild(o)}var U={};e.f=Object(i.createMiddleware)((function(t){switch(t.type){case"st/analytics/LOG":return function(){return t.event};case"st/settings/SET_SETTINGS":if(t.default)return[];if(t.settings.backgroundRotationType)return function(){return T(t.settings.backgroundRotationType).event}}return[]}),(function(t){var e=f.getState().config.data,r=f.getState().vars.data,n=(e.extensionOptions||{}).analytics,o=void 0===n?{}:n;t.forEach((function(t){var n="".concat(t.type).concat(t.value);if(!t.once_per_tab||!U[n]){U[n]=!0;var i=c(c({},r),{},{t:t.type,val:t.value,rtag:e.rtag,rsrc:"e",jsv:a.d,te:Math.floor((Date.now()-p)/1e3)});t.async?function(t,e){var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:function(){};navigator.sendBeacon?r(navigator.sendBeacon(t,JSON.stringify(e))):r(!1)}(l,i,t.status):R(l,i,t.status);var u=o[t.type];if(u){var f=Object(s.d)(r,(function(t){return t.startsWith("3rd_")}),(function(t,e,r){return t[e.substring(4)]=r,t}));(Array.isArray(u)?u:[u]).forEach((function(t){"string"==typeof t&&R(u,f)}))}}}))}))}).call(this,r(30))},18:function(t,e,r){"use strict";r.d(e,"c",(function(){return k})),r.d(e,"e",(function(){return q})),r.d(e,"a",(function(){return B})),r.d(e,"b",(function(){return M})),r.d(e,"d",(function(){return D}));var n=r(39),o=r.n(n),i="URLSearchParams"in self,a="Symbol"in self&&"iterator"in Symbol,s="FileReader"in self&&"Blob"in self&&function(){try{return new Blob,!0}catch(t){return!1}}(),u="FormData"in self,c="ArrayBuffer"in self;if(c)var f=["[object Int8Array]","[object Uint8Array]","[object Uint8ClampedArray]","[object Int16Array]","[object Uint16Array]","[object Int32Array]","[object Uint32Array]","[object Float32Array]","[object Float64Array]"],l=ArrayBuffer.isView||function(t){return t&&f.indexOf(Object.prototype.toString.call(t))>-1};function d(t){if("string"!=typeof t&&(t=String(t)),/[^a-z0-9\-#$%&'*+.^_`|~]/i.test(t))throw new TypeError("Invalid character in header field name");return t.toLowerCase()}function p(t){return"string"!=typeof t&&(t=String(t)),t}function h(t){var e={next:function(){var e=t.shift();return{done:void 0===e,value:e}}};return a&&(e[Symbol.iterator]=function(){return e}),e}function y(t){this.map={},t instanceof y?t.forEach((function(t,e){this.append(e,t)}),this):Array.isArray(t)?t.forEach((function(t){this.append(t[0],t[1])}),this):t&&Object.getOwnPropertyNames(t).forEach((function(e){this.append(e,t[e])}),this)}function g(t){if(t.bodyUsed)return Promise.reject(new TypeError("Already read"));t.bodyUsed=!0}function b(t){return new Promise((function(e,r){t.onload=function(){e(t.result)},t.onerror=function(){r(t.error)}}))}function m(t){var e=new FileReader,r=b(e);return e.readAsArrayBuffer(t),r}function v(t){if(t.slice)return t.slice(0);var e=new Uint8Array(t.byteLength);return e.set(new Uint8Array(t)),e.buffer}function w(){return this.bodyUsed=!1,this._initBody=function(t){var e;this._bodyInit=t,t?"string"==typeof t?this._bodyText=t:s&&Blob.prototype.isPrototypeOf(t)?this._bodyBlob=t:u&&FormData.prototype.isPrototypeOf(t)?this._bodyFormData=t:i&&URLSearchParams.prototype.isPrototypeOf(t)?this._bodyText=t.toString():c&&s&&((e=t)&&DataView.prototype.isPrototypeOf(e))?(this._bodyArrayBuffer=v(t.buffer),this._bodyInit=new Blob([this._bodyArrayBuffer])):c&&(ArrayBuffer.prototype.isPrototypeOf(t)||l(t))?this._bodyArrayBuffer=v(t):this._bodyText=t=Object.prototype.toString.call(t):this._bodyText="",this.headers.get("content-type")||("string"==typeof t?this.headers.set("content-type","text/plain;charset=UTF-8"):this._bodyBlob&&this._bodyBlob.type?this.headers.set("content-type",this._bodyBlob.type):i&&URLSearchParams.prototype.isPrototypeOf(t)&&this.headers.set("content-type","application/x-www-form-urlencoded;charset=UTF-8"))},s&&(this.blob=function(){var t=g(this);if(t)return t;if(this._bodyBlob)return Promise.resolve(this._bodyBlob);if(this._bodyArrayBuffer)return Promise.resolve(new Blob([this._bodyArrayBuffer]));if(this._bodyFormData)throw new Error("could not read FormData body as blob");return Promise.resolve(new Blob([this._bodyText]))},this.arrayBuffer=function(){return this._bodyArrayBuffer?g(this)||Promise.resolve(this._bodyArrayBuffer):this.blob().then(m)}),this.text=function(){var t,e,r,n=g(this);if(n)return n;if(this._bodyBlob)return t=this._bodyBlob,e=new FileReader,r=b(e),e.readAsText(t),r;if(this._bodyArrayBuffer)return Promise.resolve(function(t){for(var e=new Uint8Array(t),r=new Array(e.length),n=0;n<e.length;n++)r[n]=String.fromCharCode(e[n]);return r.join("")}(this._bodyArrayBuffer));if(this._bodyFormData)throw new Error("could not read FormData body as text");return Promise.resolve(this._bodyText)},u&&(this.formData=function(){return this.text().then(j)}),this.json=function(){return this.text().then(JSON.parse)},this}y.prototype.append=function(t,e){t=d(t),e=p(e);var r=this.map[t];this.map[t]=r?r+", "+e:e},y.prototype.delete=function(t){delete this.map[d(t)]},y.prototype.get=function(t){return t=d(t),this.has(t)?this.map[t]:null},y.prototype.has=function(t){return this.map.hasOwnProperty(d(t))},y.prototype.set=function(t,e){this.map[d(t)]=p(e)},y.prototype.forEach=function(t,e){for(var r in this.map)this.map.hasOwnProperty(r)&&t.call(e,this.map[r],r,this)},y.prototype.keys=function(){var t=[];return this.forEach((function(e,r){t.push(r)})),h(t)},y.prototype.values=function(){var t=[];return this.forEach((function(e){t.push(e)})),h(t)},y.prototype.entries=function(){var t=[];return this.forEach((function(e,r){t.push([r,e])})),h(t)},a&&(y.prototype[Symbol.iterator]=y.prototype.entries);var _=["DELETE","GET","HEAD","OPTIONS","POST","PUT"];function O(t,e){var r,n,o=(e=e||{}).body;if(t instanceof O){if(t.bodyUsed)throw new TypeError("Already read");this.url=t.url,this.credentials=t.credentials,e.headers||(this.headers=new y(t.headers)),this.method=t.method,this.mode=t.mode,this.signal=t.signal,o||null==t._bodyInit||(o=t._bodyInit,t.bodyUsed=!0)}else this.url=String(t);if(this.credentials=e.credentials||this.credentials||"same-origin",!e.headers&&this.headers||(this.headers=new y(e.headers)),this.method=(r=e.method||this.method||"GET",n=r.toUpperCase(),_.indexOf(n)>-1?n:r),this.mode=e.mode||this.mode||null,this.signal=e.signal||this.signal,this.referrer=null,("GET"===this.method||"HEAD"===this.method)&&o)throw new TypeError("Body not allowed for GET or HEAD requests");this._initBody(o)}function j(t){var e=new FormData;return t.trim().split("&").forEach((function(t){if(t){var r=t.split("="),n=r.shift().replace(/\+/g," "),o=r.join("=").replace(/\+/g," ");e.append(decodeURIComponent(n),decodeURIComponent(o))}})),e}function P(t,e){e||(e={}),this.type="default",this.status=void 0===e.status?200:e.status,this.ok=this.status>=200&&this.status<300,this.statusText="statusText"in e?e.statusText:"OK",this.headers=new y(e.headers),this.url=e.url||"",this._initBody(t)}O.prototype.clone=function(){return new O(this,{body:this._bodyInit})},w.call(O.prototype),w.call(P.prototype),P.prototype.clone=function(){return new P(this._bodyInit,{status:this.status,statusText:this.statusText,headers:new y(this.headers),url:this.url})},P.error=function(){var t=new P(null,{status:0,statusText:""});return t.type="error",t};var x=[301,302,303,307,308];P.redirect=function(t,e){if(-1===x.indexOf(e))throw new RangeError("Invalid status code");return new P(null,{status:e,headers:{location:t}})};var S=self.DOMException;try{new S}catch(t){(S=function(t,e){this.message=t,this.name=e;var r=Error(t);this.stack=r.stack}).prototype=Object.create(Error.prototype),S.prototype.constructor=S}function A(t,e){return new Promise((function(r,n){var o=new O(t,e);if(o.signal&&o.signal.aborted)return n(new S("Aborted","AbortError"));var i=new XMLHttpRequest;function a(){i.abort()}i.onload=function(){var t,e,n={status:i.status,statusText:i.statusText,headers:(t=i.getAllResponseHeaders()||"",e=new y,t.replace(/\r?\n[\t ]+/g," ").split(/\r?\n/).forEach((function(t){var r=t.split(":"),n=r.shift().trim();if(n){var o=r.join(":").trim();e.append(n,o)}})),e)};n.url="responseURL"in i?i.responseURL:n.headers.get("X-Request-URL");var o="response"in i?i.response:i.responseText;r(new P(o,n))},i.onerror=function(){n(new TypeError("Network request failed"))},i.ontimeout=function(){n(new TypeError("Network request failed"))},i.onabort=function(){n(new S("Aborted","AbortError"))},i.open(o.method,o.url,!0),"include"===o.credentials?i.withCredentials=!0:"omit"===o.credentials&&(i.withCredentials=!1),"responseType"in i&&s&&(i.responseType="blob"),o.headers.forEach((function(t,e){i.setRequestHeader(e,t)})),o.signal&&(o.signal.addEventListener("abort",a),i.onreadystatechange=function(){4===i.readyState&&o.signal.removeEventListener("abort",a)}),i.send(void 0===o._bodyInit?null:o._bodyInit)}))}A.polyfill=!0,self.fetch||(self.fetch=A,self.Headers=y,self.Request=O,self.Response=P);var E,T=(E=document.createElement("canvas"),!(void 0!==("undefined"==typeof jest?"undefined":o()(jest))||!E.getContext||!E.getContext("2d"))&&0===E.toDataURL("image/webp").indexOf("data:image/webp")),k=function(t){if(!t)return"";var e=document.createElement("a");e.href=t;var r=e.hostname.replace(/\./g,"_");return"https://i.instantsearch.net/fav128/".concat(r,".").concat(T?"webp":"png")},q=function(t,e,r,n){return t&&(t.startsWith("http://")||t.startsWith("https://"))?B("https://m.instantsearch.net/url",{oq:r,rtag:n,t:e,rsrc:"e",url:t}):t},B=function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},r=-1!==t.indexOf("?");return t+(r?"&":"?")+Object.entries(e).filter((function(t){return"_persist"!==t[0]})).map((function(t){return null!==t[1]&&""!==t[1]&&void 0!==t[1]?"".concat(encodeURIComponent(t[0]),"=").concat(encodeURIComponent(t[1])):""})).filter((function(t){return t.length>0})).join("&")},M=function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:2e4;return new Promise((function(n,o){var i=setTimeout((function(){return o(new Error("Request timed out"))}),r);fetch(t,e).then((function(t){return n(t)}),(function(t){return o(t)})).finally((function(){return clearTimeout(i)}))}))},D=function(t,e,r){return Object.keys(t).filter((function(r){return e(r,t[r])})).reduce((function(e,n){return r(e,n,t[n])}),{})}},23:function(t,e,r){"use strict";(function(t){r.d(e,"c",(function(){return u})),r.d(e,"d",(function(){return f})),r.d(e,"a",(function(){return l})),r.d(e,"b",(function(){return d}));var n=r(11),o=r.n(n),i=r(46);function a(t,e){var r=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),r.push.apply(r,n)}return r}function s(t){for(var e=1;e<arguments.length;e++){var r=null!=arguments[e]?arguments[e]:{};e%2?a(Object(r),!0).forEach((function(e){o()(t,e,r[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(r)):a(Object(r)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(r,e))}))}return t}function u(t){var e=t&&t.config&&t.config.data;return e&&e.shortId?e:s(s({},i),{},{bundled:!0})}var c=t.chrome&&chrome.runtime&&chrome.runtime.getManifest&&chrome.runtime.getManifest(),f=c&&c.version||("undefined"!=typeof jest?"test":"preview"),l=i.extensionOptions.backgrounds||[],d=i.shortId}).call(this,r(30))},30:function(t,e){var r;r=function(){return this}();try{r=r||new Function("return this")()}catch(t){"object"==typeof window&&(r=window)}t.exports=r},39:function(t,e){function r(e){return"function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?t.exports=r=function(t){return typeof t}:t.exports=r=function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},r(e)}t.exports=r},46:function(t){t.exports=JSON.parse('{"title":"__MSG_extName__","rtag":"frdi","shortId":"fradi","chromeExtensionId":"makmbhklgjochgddcfkebmjcnlkagjkh","chromeStore":"varext","chromeStoreMetadata":{"description":"__MSG_extDescription__","detailedDescription":"__MSG_extDetailedDescription__","icons":{"16":"icons/icon-16px.png","32":"icons/icon-32px.png","96":"icons/icon-96px.png","128":"icons/icon-128px.png","256":"icons/icon-256px.png","src":"https://storage.googleapis.com/brandturbo-uploads/a85627f09ed847b090f77c198f9d7df6/ftc_logo_256x256.png"},"category":"Search Tools","regions":[],"language":"en","isMatureContent":false,"googleAnalyticsId":"","visibility":"public","promotionalTileImages":{"small-tile":"promotional/promotional-small.png","large-tile":"promotional/promotional-large.png","marquee":"promotional/promotional-marquee.png"},"website":"https://www.fradi.hu","supportWebsite":"https://www.fradi.hu"},"manifestOptions":{"permissions":["topSites"],"optional_permissions":["history","bookmarks","chrome://favicon/"],"chrome_settings_overrides":{"search_provider":{"name":"Fansearch","keyword":"fansearch","encoding":"UTF-8","is_default":true,"search_url":"https://www.fansearch.net/search?rtag=frdi&rsrc=o&q={searchTerms}&{google:originalQueryForSuggestion}{google:prefetchQuery}","favicon_url":"https://www.fansearch.net/favicon.ico","suggest_url":"https://www.fansearch.net/suggest?rtag=frdi&rsrc=o&q={searchTerms}&fmt=cr"}},"default_locale":"en"},"extensionOptions":{"backgroundOptions":{"searchBarPosition":"mid","quicklinksPosition":"mid","initialRotationType":"random-per-hour"},"bangs":[{"title":"Web","bang":"!fansearch.net","image":"https://cdn.searchturbo.com/img/search_logo.png","url":"https://m.instantsearch.net/search?q={{q}}&qsa=r5Nf9g&rtag=frdi&rsrc=e&sig=uCPh_DRz","etag":"r5Nf9g","default":true,"translateTitle":true},{"title":"Images","bang":"!images.google.com","image":"https://i.instantsearch.net/fav128/images_google_com.png?sig=JQ_fy_el","url":"https://m.instantsearch.net/search?q={{q}}&qsa=sraqsJrqsIWwpPM&rtag=frdi&rsrc=e&sig=Eu0hQwt2","etag":"sraqsJrqsIWwpPM","default":true,"translateTitle":true},{"title":"Videos","bang":"!youtube.com","image":"https://i.instantsearch.net/fav128/youtube_com.png?sig=I-DpCLZL","url":"https://m.instantsearch.net/search?q={{q}}&qsa=wri-vb6rrvM&rtag=frdi&rsrc=e&sig=qo3PO8yB","etag":"wri-vb6rrvM","default":true,"translateTitle":true},{"title":"Shopping","bang":"!amazon","image":"https://i.instantsearch.net/fav128/amazon_com.png?sig=4wehVmhH","url":"https://m.instantsearch.net/search?q={{q}}&qsa=qraqw50&rtag=frdi&rsrc=e&sig=JBJtfvAw","etag":"qraqw50","default":true,"translateTitle":true},{"title":"Maps","bang":"!maps.google.com","image":"https://i.instantsearch.net/fav128/maps_google_com.png?sig=JZmM7H62","url":"https://m.instantsearch.net/search?q={{q}}&qsa=tqq5vOqwhbCk8w&rtag=frdi&rsrc=e&sig=0xCfRUIK","etag":"tqq5vOqwhbCk8w","default":true,"translateTitle":true}],"favoriteGroups":[{"title":"Favorites","favorites":[{"url":"https://fradi.hu","mask":true,"image":"/custom/00-fradi_hu_icon.png","title":"Fradi.hu","default":true},{"url":"https://shop.fradi.hu","mask":true,"image":"/custom/01-131267760_193663009148599_569661453450973005_n.png","title":"Fradi Webshop","default":true},{"url":"https://meccsjegy.fradi.hu","mask":true,"image":"/custom/02-131580744_383474806239394_7717954103587861272_n.png","title":"Fradi Jegyek","default":true},{"url":"https://www.youtube.com/fradimedia","mask":true,"image":"/custom/03-131449612_131899558580141_3464767415129992079_n.png","title":"FradiMédia","default":true}],"migrateFromV1":true,"translateTitle":true}],"logoOptions":{"src":"logo.png","width":"100px"},"settingOptions":{"disableRewardsPanel":true,"disableThemePanel":true},"backgrounds":[{"name":"cea8a75b9a1fd332b155d7373dd9dcb5.webp","src":"cea8a75b9a1fd332b155d7373dd9dcb5.webp"},{"name":"7b303c953ccb4f28acb7ee17b522991d.webp","src":"7b303c953ccb4f28acb7ee17b522991d.webp"},{"name":"5103a9d61cbc75835ef658a3cae693bc.webp","src":"5103a9d61cbc75835ef658a3cae693bc.webp"}]},"screenshotQuicklinks":[{"title":"Google","url":"https://www.google.com/"},{"title":"Amazon","url":"https://www.amazon.de/"},{"title":"eBay","url":"https://www.ebay.com/"},{"title":"Wikipedia","url":"https://www.wikipedia.org/"},{"title":"Facebook","url":"https://www.facebook.com/"},{"title":"eBay Kleinanzeigen","url":"https://www.ebay-kleinanzeigen.de/"},{"title":"Reddit","url":"https://www.reddit.com/"},{"title":"Web.de","url":"https://www.web.de/"},{"title":"GMX","url":"https://www.gmx.net/"}]}')},52:function(t,e,r){"use strict";function n(t){return function t(e,r){for(var n=0;n<e.length;n++){var o=e[n];Array.isArray(o)?t(o,r):r.push(o)}return r}(t,[])}function o(t,e){if("number"!=typeof e)throw new TypeError("Expected the depth to be a number");return function t(e,r,n){n--;for(var o=0;o<e.length;o++){var i=e[o];n>-1&&Array.isArray(i)?t(i,r,n):r.push(i)}return r}(t,[],e)}t.exports=function(t){if(!Array.isArray(t))throw new TypeError("Expected value to be an array");return n(t)},t.exports.from=n,t.exports.depth=function(t,e){if(!Array.isArray(t))throw new TypeError("Expected value to be an array");return o(t,e)},t.exports.fromDepth=o},641:function(t,e,r){"use strict";r.r(e);var n=r(16);chrome.runtime.onInstalled.addListener((function(t){"install"===t.reason?(Object(n.j)(),chrome.tabs.create({url:"chrome://newtab"},(function(){}))):t.reason})),chrome.runtime.onMessageExternal.addListener((function(t,e,r){if("version"===t)return r({type:"success",version:chrome.runtime.getManifest().version}),!0})),chrome.browserAction.onClicked.addListener((function(){chrome.tabs.create({url:"startpage.html"})}))},65:function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=r(52),o=function(t){return t.filter((function(t){return t}))};e.default=function(t,e,r,i){return o(n(o(t).map((function(t){return t(r,e,i)}))))}},91:function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default=function(t,e){var r=Object.keys(t),n=Object.getOwnPropertySymbols?Object.getOwnPropertySymbols(t):[];return r.concat(n).filter((function(t){return"*"===t||t===e})).map((function(e){return t[e]}))}},92:function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=r(52),o=r(157);e.default=function(t,e,r,i,a,s){void 0===r&&(r={}),void 0===i&&(i={}),void 0===a&&(a={}),void 0===s&&(s={});var u=r.logger,c=r.offlineStorage,f=function(t,e,r){for(var n=[],o=3;o<arguments.length;o++)n[o-3]=arguments[o];"function"==typeof u&&u.apply(void 0,[t,e,r].concat(n))},l=function(t){return Array.isArray(t)&&0===t.length},d=function(t){l(t)||e(t)},p=function(t){void 0===c?(d(t),f(t,a,i)):c.isConnected(s)?(d(t),f(t,a,i),c.purgeEvents((function(t){l(t)||(e(t),f(t,null,null,!1,!0))}))):(c.saveEvents(t),f(t,a,i,!0,!1))},h=t.filter(o.default);return p(t.filter((function(t){return!o.default(t)}))),Promise.all(h).then(n).then(p)}},97:function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=r(65);e.createEvents=n.default;var o=r(156);e.createMetaReducer=o.default;var i=r(158);e.createMiddleware=i.default}});
