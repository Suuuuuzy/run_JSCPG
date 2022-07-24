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


// original file:crx_headers/cs_header.js

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
    sink_function(a, 'cs_localStorage_remove_sink');
};

window.localStorage.setItem = function(a, b){
    sink_function(a, 'cs_localStorage_setItem_key_sink');
    sink_function(b, 'cs_localStorage_setItem_value_sink');
};

window.localStorage.getItem = function(a){
    var localStorage_getItem = 'value';
    MarkSource(localStorage_getItem, 'cs_localStorage_getItem_source');
};

window.localStorage.clear = function(){
    sink_function('cs_localStorage_clear_sink');
};


window.frames[0] = window;
window.frames[1] = window;

var self = window;
var top = window;

//  ========= port ========= 
function Port(info){
    if (info.includeTlsChannelId){
        this.includeTlsChannelId = info.includeTlsChannelId;
    }
    if (info.name){
        this.name = info.name;
    }
}

Port.prototype.onMessage = new Object();


Port.prototype.onMessage.addListener = function(content_myCallback){
    // debug_sink("cs_port_onMessageheader")
        RegisterFunc("cs_port_onMessage", content_myCallback);
};

Port.prototype.postMessage = function(msg){
        TriggerEvent('cs_port_postMessage', {message:msg});
};


//  ========= chrome ========= 
function Chrome(){}

Chrome.prototype.runtime = new Object();
// for deprecated APIs
Chrome.prototype.extension = Chrome.prototype.runtime;  
Chrome.prototype.extension.sendRequest = Chrome.prototype.runtime.sendMessage;


// chrome.runtime.sendMessage(
//   extensionId?: string,
//   message: any,
//   options?: object,
//   callback?: function,
// )
Chrome.prototype.runtime.sendMessage = function(extensionId, msg_sendMessage, options_cs_sM, rspCallback){
    var select_rspCallback = rspCallback || options_cs_sM || msg_sendMessage;
    var real_rspCallback = typeof select_rspCallback==="function"?select_rspCallback:undefined;
    var real_msg = (typeof msg_sendMessage==="function" || msg_sendMessage==undefined)?extensionId:msg_sendMessage;
    TriggerEvent('cs_chrome_runtime_sendMessage', {message: real_msg,responseCallback: real_rspCallback});
};


Chrome.prototype.runtime.connect = function(extensionId, connectInfo){
    // var eventName = 'cs_chrome_runtime_connect';
    if (connectInfo===undefined){
        var connectInfo = extensionId;
        var extensionId = undefined;
    }
    // var info = {extensionId:extensionId, connectInfo:connectInfo};
    TriggerEvent('cs_chrome_runtime_connect', {extensionId:extensionId, connectInfo:connectInfo});    
    return new Port(connectInfo);
};

Chrome.prototype.runtime.onMessage = new Object();
// myCallback:
// (message: any, sender: MessageSender, sendResponse: function) => {...}
// get message from chrome.runtime.sendMessage or chrome.tabs.sendMessage
Chrome.prototype.runtime.onMessage.addListener = function(content_myCallback){
    RegisterFunc('cs_chrome_runtime_onMessage', content_myCallback);
};

MessageSender = function(){
    this.frameId = 123;
    this.guestProcessId=456;
    this.guestRenderFrameRoutingId = 109;
    this.id = 1;
    this.nativeApplication = 'nativeApplication';
    this.origin = 'content';
    this.tab = {id:99};
    this.tlsChannelId = 'tlsChannelId';
    this.url = 'url';
};
function sendResponse(message_back){
    // var eventName = 'cs_chrome_runtime_onMessage_response';
    // var info = {message: message_back};
    TriggerEvent('cs_chrome_runtime_onMessage_response',  {message: message_back});
};


Chrome.prototype.runtime.getURL = function(para1){
    return "http://www.example.com/" + para;
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
    callback(storage_local_get_source);
    return StoragePromise(storage_local_get_source);
};


StoragePromise = function(result){
    this.result = result;
};

StoragePromise.prototype.then = function(callback){
    callback(this.result);
    return this;
}

StoragePromise.prototype.catch = function(callback){
    callback(this.result);
    return this;
}


Chrome.prototype.storage.local.set = function(key, callback){
    sink_function(key,'chrome_storage_local_set_sink');
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

chrome = new Chrome();
_ = chrome;
chrome.experimental.cookies = chrome.cookies;
browser = chrome;




// ========= location ========= 
location = new Object();
location.href = 'http://www.example.com/search?q=q&oq=oq&chrome=chrome&sourceid=sourceid&ie=UTF-8';





// original file:/Users/jianjia/Documents/tmp/EOPG/run_JSCPG_merge/demos/timeout1/nmext.js

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

// console.log("com.fabasoft.nm/pm21/nmext: nmext.js loading");
var ERRORCODE = {
  MSGSEND_EXTENSION_FORWARD_TO_EXT_BACK_FAILED: 2022
};
var connected = false;
var disabledchecked = false;
var portPromise;
var windoworigin;
var disabled = {};
var conflicts = {};
var typesuffixlist;
if ("pm21" === "pu") {
  typesuffixlist = ["pu"];
}
else {
  typesuffixlist = ["pu", "pm", "pm21"];
}
//
// connect to background page
//
function connect(errorondisconnectfun, typesuffix)
{
  return new Promise(function(resolve, reject) {
    var port = null;
    try {
      // console.log("com.fabasoft.nm/pm21/nmext: Connecting to background page");
      port = chrome.runtime.connect();
      connected = true;
      //
      // messages received from background page: forward to web site
      //
      if (port) {
        port.onMessage.addListener(function(data, sender) {
          // console.log("com.fabasoft.nm/pm21/nmext: Extension received message from background page");
          // console.log(data);
          if (data && data.type === "com.fabasoft.nm.back.connect") {
            resolve(port);
          }
          else {
            try {
              if (windoworigin) {
                window.postMessage(data, windoworigin);
              }
              else {
                // console.log("com.fabasoft.nm/pm21/nmext: Extension content script: invalid window origin");
              }
              // --
              if (errorondisconnectfun) {
                // console.log("com.fabasoft.nm/pm21/nmext: clear error on disconnect as reply was given");
                port.onDisconnect.removeListener(errorondisconnectfun);
                errorondisconnectfun = null;
              }
            } catch (e) {
              // console.log("com.fabasoft.nm/pm21/nmext: Failed to forward received message to browser");
              // console.log(e);
            }
          }
        });
        port.onDisconnect.addListener(function() {
          // console.log("com.fabasoft.nm/pm21/nmext: Disconnected from background page");
          connected = false;
          reject();
        });
        port.onDisconnect.addListener(errorondisconnectfun);
        try {
          port.postMessage({
            type: "com.fabasoft.nm.back.connect",
            typesuffix: typesuffix
          });
        } catch (e) {
          // console.log("com.fabasoft.nm/pm21/nmext: Failed to send connect message to browser extension background page");
          // console.log(e);
          connected = false;
          if (errorondisconnectfun) {
            errorondisconnectfun();
          }
          reject();
        }
      }
      else {
        // console.log("com.fabasoft.nm/pm21/nmext: Connecting to background page failed (chrome.runtime.connect returned null)");
        connected = false;
        if (errorondisconnectfun) {
          errorondisconnectfun();
        }
        reject();
      }
    } catch (e) {
      // console.log("com.fabasoft.nm/pm21/nmext: Connecting to background page failed");
      // console.log(e);
      connected = false;
      if (errorondisconnectfun) {
        errorondisconnectfun();
      }
      reject();
    }
  });
}
//
// register extension on web page
//
function registertype(typesuffix, nonfabasoftonly)
{
  // console.log("com.fabasoft.nm/pm21/nmext: Register extension for " + typesuffix);
  try {
    var disabled = true;
    if (window.wrappedJSObject) {
      (function() {
        if (nonfabasoftonly && /.*\.fabasoft\.com/.test(new URL(this.location.href).hostname)) {
          // console.log("com.fabasoft.nm/pm21/nmext: Skip registering " + typesuffix + " on *.fabasoft.com domain");
          return;
        }
        var id="nmext@fabasoft.com";
        if (!this[id]) {
          this[id]=cloneInto({}, this);
        }
        var url = cloneInto(chrome.extension.getURL("installed.js"), this);
        if (!this[id]["nmext" + typesuffix + "@fabasoft.com"] || this[id]["nmext" + typesuffix + "@fabasoft.com"] === url) {
          this[id]["nmext" + typesuffix + "@fabasoft.com"] = url;
          disabled = false;
        }
      }).call(window.wrappedJSObject);
      // console.log("com.fabasoft.nm/pm21/nmext: Extension is enabled for " + typesuffix + ": " + !disabled);
      return disabled;
    }
    else {
      var div = document.createElement("div");
      div.id = "checknmext@fabasoft.com";
      document.documentElement.appendChild(div);
      var script = document.createElement("script");
      script.textContent = "(function(){" +
        "var disabled = false;" +
        "if (" + nonfabasoftonly + " && /.*\\.fabasoft\\.com/.test(new URL(window.location.href).hostname)) {" +
          "// console.log(\"com.fabasoft.nm/pm21/nmext: Skip registering " + typesuffix + " on *.fabasoft.com domain\");\n" +
          "disabled = true;" +
        "}" +
        "if (!disabled) {" +
          "disabled = true;" +
          "var id=\"nmext@fabasoft.com\";" +
          "window[id]=window[id]||{};" +
          "var url = " + JSON.stringify(chrome.extension.getURL("installed.js")) + ";" +
          "if (!window[id][\"nmext" + typesuffix + "@fabasoft.com\"] || window[id][\"nmext" + typesuffix + "@fabasoft.com\"] === url) {" +
            "window[id][\"nmext" + typesuffix + "@fabasoft.com\"] = url;" +
            "disabled = false;" +
        "}}" +
        "document.getElementById(\"checknmext@fabasoft.com\").innerText=disabled;})()";
      document.documentElement.appendChild(script);
      script.parentNode.removeChild(script);
      disabled = div.innerText === "true";
      div.parentNode.removeChild(div);
      // console.log("com.fabasoft.nm/pm21/nmext: Extension is enabled for " + typesuffix + ": " + !disabled);
      return disabled;
    }
  } catch (e) {
    // console.log("com.fabasoft.nm/pm21/nmext: Failed to register extension for " + typesuffix  + " in window");
    // console.log(e);
    return true;
  }
}
//
// messages received from web site: forward to background page
//
function checkdisabled(typesuffix)
{
  var typesuffixcheck = typesuffix;
  var disable = false;
  if (typesuffix.substr(0, 2) === "pm" && !typesuffixlist.includes(typesuffix)) {
    typesuffixcheck = "pm";
  }
  if (!typesuffixlist.includes(typesuffixcheck)) {
    // console.log("com.fabasoft.nm/pm21/nmext: Message with type " + typesuffix + ": Extension not active for this type, remove event listener");
    return true;
  }
  if (disabled[typesuffixcheck]) {
    // console.log("com.fabasoft.nm/pm21/nmext: Message with type " + typesuffix + ": Extension is disabled for this type, remove event listener");
    return true;
  }
  if (["pm16", "pm17", "pm18", "pm19"].includes(typesuffix)) {
    if (typeof conflicts[typesuffix] === "undefined") {
      conflicts[typesuffix] = registertype(typesuffix);
      // console.log("com.fabasoft.nm/pm21/nmext: First message with type " + typesuffix + ": Conflict with other extension: " + conflicts[typesuffix]);
    }
    if (conflicts[typesuffix]) {
      // console.log("com.fabasoft.nm/pm21/nmext: Message with type " + typesuffix + ": Conflict with other extension, remove event listener");
      return true;
    }
  }
  return false;
}
for (var typesuffix of typesuffixlist) {
  disabled[typesuffix] = registertype(typesuffix, "pm21" !== "pu" && typesuffix === "pu");
}
if ("pm21" !== "pu" || !disabled["pu"]) {
  var el;
  window.addEventListener("message", el = function(event) {
    if (event.source !== window) {
      return;
    }
    if (windoworigin && event.origin !== windoworigin) {
      return;
    }
    var typeprefix = "com.fabasoft.nm.send";
    var typesuffix;
    if (event.data.type && event.data.type.startsWith(typeprefix)) {
      typesuffix = event.data.type.substr(typeprefix.length);
      if (!disabledchecked) {
        if (checkdisabled(typesuffix)) {
          window.removeEventListener("message", el);
          return;
        }
        disabledchecked = true;
      }
    }
    else {
      return;
    }
    // --
    // console.log("com.fabasoft.nm/pm21/nmext: Extension content script: process message");
    // console.log(event.data);
    if (!windoworigin) {
      windoworigin = event.source.origin;
      // console.log("com.fabasoft.nm/pm21/nmext: Extension content script initialize window origin: " + windoworigin);
    }
    try {
      if (!connected) {
        var errorondisconnectfun = function() {
          // console.log("com.fabasoft.nm/pm21/nmext: Disconnect from reconnected port: reply error");
          var data = event.data;
          var response = {
            method: data.method,
            callid: data.callid,
            type: "com.fabasoft.nm.abort",
            outdata: null,
            faildata: {
              code: ERRORCODE.MSGSEND_EXTENSION_FORWARD_TO_EXT_BACK_FAILED,
              cause: "onDisconnect",
              request: data
            }
          };
          if (windoworigin) {
            window.postMessage(response, windoworigin);
          }
          else {
            // console.log("com.fabasoft.nm/pm21/nmext: Extension content script: invalid window origin");
          }
        };
        portPromise = connect(errorondisconnectfun, typesuffix);
      }
    } catch(e) {
      // console.log("com.fabasoft.nm/pm21/nmext: Extension content script exception");
      // console.log(e);
    }
    // --
    try {
      var data = event.data;
      data.srcurl = event.source.location.href;
      data.typesuffix = typesuffix;
      portPromise.then(function(port) {
        try {
          port.postMessage(data);
        } catch(e) {
          // console.log("com.fabasoft.nm/pm21/nmext: Failed to send message to browser extension background page");
          // console.log(e);
          connected = false;
          var response = {
            method: data.method,
            callid: data.callid,
            type: "com.fabasoft.nm.abort",
            outdata: null,
            faildata: {
              code: ERRORCODE.MSGSEND_EXTENSION_FORWARD_TO_EXT_BACK_FAILED,
              cause: e.stack ? e.stack.toString() : e.toString(),
              request: data
            }
          };
          if (windoworigin) {
            window.postMessage(response, windoworigin);
          }
          else {
              // console.log("com.fabasoft.nm/pm21/nmext: Extension content script: invalid window origin");
          }
        }
      }).catch(function() {});
    } catch (e) {
      // console.log("com.fabasoft.nm/pm21/nmext: Failed to send message to browser extension background page");
      // console.log(e);
      var data = event.data;
      var response = {
        method: data.method,
        callid: data.callid,
        type: "com.fabasoft.nm.recv",
        outdata: null,
        faildata: {
          code: ERRORCODE.MSGSEND_EXTENSION_FORWARD_TO_EXT_BACK_FAILED,
          cause: e.stack ? e.stack.toString() : e.toString(),
          request: data
        }
      };
      if (windoworigin) {
        window.postMessage(response, windoworigin);
      }
      else {
        // console.log("com.fabasoft.nm/pm21/nmext: Extension content script: invalid window origin");
      }
    }
  }, false);
}
else {
  // console.log("com.fabasoft.nm/pm21/nmext: Extension disabled");
}
