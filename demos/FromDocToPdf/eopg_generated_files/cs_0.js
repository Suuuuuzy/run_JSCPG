// original file:demos/jquery_header.js

// the document and its elements are all objects
var document = new Array();

function Document_element(id, class_name, tag){
    this.id = id;
    this.class_name = class_name;
    this.tag = tag;
}

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
// jQuery.get( url [, data ] [, success ] [, dataType ] )
// data: Type: PlainObject or String
// success: Type: Function( PlainObject data, String textStatus, jqXHR jqXHR )
// dataType: Type: String
$.get = function(url , success){
    var responseText = 'data_from_url_by_get';
    jQuery_get_source(responseText);
    jQuery_get_url_sink(url);
    success(responseText);
    return new jqXHR();
}
// jQuery.post( url [, data ] [, success ] [, dataType ] )
$.post = function( url , data, success){
    var responseText = 'data_from_url_by_post';
    jQuery_post_source(responseText);
    jQuery_post_data_sink(data);
    jQuery_post_url_sink(url);
    success(responseText);
    return new jqXHR();
}
jqXHR = function(){

}
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

JQ_obj.prototype.val = function(first_argument) {
    if (arguments.length>0){
        JQ_obj_val_sink(first_argument);
        this[0].value = first_argument;
    }
    else{
        // return value of x
    }
};

JQ_obj.prototype.html = function(first_argument) {
    if (arguments.length >0){
        JQ_obj_html_sink(first_argument);
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


// jQuery.extend( target, object1 [, objectN ] )
$.extend = function(obj1, obj2){
    for (var key in obj2){
        obj1[key] = obj2[key];
    }
}

// jQuery.extend( [deep ], target, object1 [, objectN ] ) deep copy

function Event(type){
    this.type = type;
}





// original file:demos/cs_header.js

// port
function Port(info){
    if (info.includeTlsChannelId){
        this.includeTlsChannelId = info.includeTlsChannelId;
    }
    if (info.name){
        this.name = info.name;
    }
}

Port.prototype.onMessage.addListener = function(myCallback){
        RegisterFunc("cs_port_onMessage", myCallback);
};

Port.prototype.postMessage = function(msg){
        var eventName = 'cs_port_postMessage';
        var info =  {message:msg};
        TriggerEvent(eventName, info);
};


// chrome
function Chrome(){}

Chrome.prototype.runtime.connect = function(extensionId, connectInfo){
    var eventName = 'cs_chrome_runtime_connect';
    if (connectInfo===undefined){
        var connectInfo = extensionId;
        var extensionId = undefined;
    }
    var info = {extensionId:extensionId, connectInfo:connectInfo};
    TriggerEvent(eventName, info);    
    return new Port(connectInfo);
};


// myCallback:
// (message: any, sender: MessageSender, sendResponse: function) => {...}
// get message from chrome.runtime.sendMessage or chrome.tabs.sendMessage
Chrome.prototype.runtime.onMessage.addListener = function(myCallback){
    RegisterFunc('cs_chrome_runtime_onMessage', myCallback);
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
    var eventName = 'cs_chrome_runtime_onMessage_response';
    var info = {message: message_back};
    TriggerEvent(eventName, info);
};


// // chrome.runtime.sendMessage(extensionId?: string, message: any, options: object, responseCallback: function)
// Chrome.prototype.runtime.sendMessage = function(extensionId, message, options, responseCallback){
//     var eventName = 'cs_chrome_runtime_sendMessage';
//     if(arguments.length == 2){
//         var info = {message: arguments[0],responseCallback: arguments[1]};
//     }
//     else if (arguments.length == 4){
//         var info = {extensionId: extensionId, message: message, options: options, responseCallback: responseCallback};
//     }
//     else if(arguments.length == 3){
//         if (arguments[1].includeTlsChannelId!=undefined){
//             var info = {message: arguments[0], options: arguments[1], responseCallback: arguments[2]};
//         }
//         else if (arguments[0]==String(arguments[0])){
//             var info = {extensionId: arguments[0], message: arguments[1], responseCallback: arguments[2]};
//         }
//     }
//     TriggerEvent(eventName, info);
// };


// chrome.runtime.sendMessage(extensionId?: string, message: any, options: object, responseCallback: function)
Chrome.prototype.runtime.sendMessage = function(message, responseCallback){
    var eventName = 'cs_chrome_runtime_sendMessage';
    var info = {message: message,responseCallback: responseCallback};
    TriggerEvent(eventName, info);
};

chrome = new Chrome();


// window
function Window(){}

// targetWindow.postMessage(message, targetOrigin, [transfer]);
Window.prototype.postMessage = function(message, targetOrigin, [transfer]){
    window_postMessage_sink(message);
};

// target.addEventListener(type, listener [, options]);
// the 'e' parameter passed to listener can be ignored, otherwise, it is the event object
Window.prototype.addEventListener = function(type, listener,  [ options]){
    MarkAttackEntry(type, listener);
};

Window.prototype.top.addEventListener = Window.prototype.addEventListener;

Window.prototype.localStorage.removeItem = function(a){

};

Window.prototype.localStorage.setItem = function(a, b){

};

Window.prototype.localStorage.getItem = function(a, b){

};



window = new Window();


//
location = new Object();
location.href = 'http://www.example.com/search?q=q&oq=oq&chrome=chrome&sourceid=sourceid&ie=UTF-8';





// original file:demos/FromDocToPdf/js/logger.js

var Logger;
(function (Logger) {
    function log(message) {
        var rest = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            rest[_i - 1] = arguments[_i];
        }
        var args = ['[' + (new Date()).toISOString() + '] '];
        if (typeof message === 'string') {
            args.unshift('%s' + message);
        }
        else if (message != void 0) {
            args.push(message);
        }
        console.log.apply(console, args.concat(rest));
    }
    Logger.log = log;
})(Logger || (Logger = {}));
//# sourceMappingURL=logger.js.map
// original file:demos/FromDocToPdf/js/chrome.js

if (typeof msBrowser !== 'undefined') {
    window.chrome = msBrowser;
}
else if (typeof browser != 'undefined') {
    window.chrome = browser;
}
//# sourceMappingURL=chrome.js.map
// original file:demos/FromDocToPdf/js/util.js

'use strict';
var Util;
(function (Util) {
    function mergeObjects() {
        var params = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            params[_i] = arguments[_i];
        }
        if (params.some(function (param) { return Array.isArray(param); })) {
            throw "This method DOES NOT support array inputs.";
        }
        return params.reduce(function (prev, current) {
            return mergeTwoObjects(prev, current);
        }, {});
    }
    Util.mergeObjects = mergeObjects;
    function mergeTwoObjects(left, right) {
        if (typeOf(left) === typeOf(right) && typeOf(right) === "object") {
            return Object.keys(right).reduce(function (result, rightKey) {
                result[rightKey] = mergeTwoObjects(result[rightKey], right[rightKey]);
                return result;
            }, left);
        }
        else {
            if (typeOf(right) === "null") {
                return (typeOf(left) === "undefined") ? right : left;
            }
            else {
                return right;
            }
        }
    }
    function typeOf(value) {
        return (value === null) ? "null" : typeof value;
    }
    function guid(prefix, length) {
        return (prefix || '') + Array.prototype.reduce.call((crypto).getRandomValues(new Uint32Array(length || 4)), function (p, i) {
            return (p.push(i.toString(36)), p);
        }, []).join('-');
    }
    Util.guid = guid;
    function getObjectAPI(obj, prefix) {
        function ns(obj, px) {
            var keys = Object.keys(obj);
            if (keys.length == 0) {
                if (px.length) {
                    return [px.join('.')];
                }
                return [];
            }
            return keys.reduce(function (p, key) {
                return p.concat(ns(obj[key], px.concat([key])));
            }, []);
        }
        return ns(obj, prefix ? [prefix] : []);
    }
    Util.getObjectAPI = getObjectAPI;
    function resolveName(name, obj) {
        return name.split('.').reduce(function (p, n) {
            return p && p[n];
        }, obj);
    }
    Util.resolveName = resolveName;
    var ConnectionManager = (function () {
        function ConnectionManager() {
            var _this = this;
            this.connections = new Map();
            chrome.runtime.onConnect.addListener(function (port) {
                var conn = { id: (+new Date).toString(36), port: port, callbacks: new Map() };
                _this.add(conn);
            });
        }
        ConnectionManager.prototype.add = function (conn) {
            var _this = this;
            this.connections.set(conn.id, conn);
            conn.port.onDisconnect.addListener(function () {
                _this.remove(conn.id);
            });
        };
        ConnectionManager.prototype.remove = function (id) {
            return this.connections.delete(id);
        };
        ConnectionManager.prototype.all = function () {
            var r = [];
            this.connections.forEach(function (conn) {
                r.push(conn);
            });
            return r;
        };
        return ConnectionManager;
    }());
})(Util || (Util = {}));
//# sourceMappingURL=util.js.map
// original file:demos/FromDocToPdf/js/content_script.js

var ask;
(function (ask) {
    var apps;
    (function (apps) {
        var WebTooltabAPIProxy;
        (function (WebTooltabAPIProxy) {
            var channel;
            var contents = new Map();
            var commands = {
                backgroundReady: function (data) {
                    sendMessage(channel, { name: 'getState' }, function (state) {
                        return Promise.resolve(void 1);
                    });
                    return Promise.resolve(void 1);
                },
                loadContent: function (data) {
                    return loadContent(data.url, data.timeout);
                },
                removeContent: function (data) {
                    var content = contents.get(data.id);
                    if (content) {
                        content.close();
                        return Promise.resolve({ success: true });
                    }
                    return Promise.reject(new Error("\"" + data.id + "\" not found"));
                },
                getLocalStorage: function (data) {
                    var storage = window.localStorage;
                    var keys = data && data.keys && data.keys.length ? data.keys : Object.keys(storage);
                    return Promise.resolve(keys.reduce(function (p, key) {
                        p[key] = storage.getItem(key);
                        return p;
                    }, {}));
                },
                webtooltab: function (response) {
                    if (response) {
                        response.url = window.location.href;
                        postMessage(JSON.stringify(response), response.url);
                    }
                    return Promise.resolve(void 1);
                }
            };
            window.addEventListener('message', handleWebTooltabMessageEvent);
            function loadContent(url, timeout) {
                return new Promise(function (resolve, reject) {
                    if (window.location.href.indexOf(url) >= 0) {
                        reject(new Error("Cannot load \"" + url + "\" inside \"" + window.location.href + "\""));
                    }
                    else {
                        var iframe_1 = document.createElement('iframe');
                        if (timeout) {
                            timeout = setTimeout(function () {
                                if (iframe_1) {
                                    iframe_1.parentNode.removeChild(iframe_1);
                                }
                                reject(new Error("Load content timeout: \"" + url + "\""));
                            }, timeout);
                        }
                        iframe_1.addEventListener('load', function (e) {
                            !timeout || clearTimeout(timeout);
                            resolve({
                                url: url,
                                id: url,
                                parentUrl: window.location.href,
                                timedout: false,
                                close: function () {
                                    iframe_1.parentNode.removeChild(iframe_1);
                                }
                            });
                        }, true);
                        iframe_1.setAttribute('src', url);
                        document.body.appendChild(iframe_1);
                    }
                });
            }
            function init() {
                var port = chrome.runtime.connect({ name: Util.guid("contentScript-" + chrome.runtime.id + "-") });
                channel = {
                    id: port.name,
                    port: port,
                    callbacks: new Map()
                };
                port.onMessage.addListener(onConnectMessage);
            }
            WebTooltabAPIProxy.init = init;
            function onConnectMessage(message) {
                var command = commands[message.name] || channel.callbacks.get(message.name);
                if (command) {
                    command(message.data || message.error).then(function (response) {
                        if (message.reply) {
                            channel.port.postMessage({ name: message.reply, data: response });
                        }
                    }).catch(function (err) {
                        if (message.reply) {
                            channel.port.postMessage({ name: message.reply, error: err });
                        }
                    });
                }
            }
            function isWebTooltabMessage(message) {
                return String(message).indexOf("\"destination\":\"" + chrome.runtime.id + "\"") > -1;
            }
            function handleWebTooltabMessageEvent(e) {
                if (isWebTooltabMessage(e.data)) {
                    sendMessage(channel, { name: 'webtooltab', data: JSON.parse(e.data) }, commands.webtooltab);
                }
            }
            function sendMessage(conn, message, callback, persistent) {
                var reply;
                if (callback) {
                    reply = Util.guid(message.name + "-");
                    conn.callbacks.set(reply, function (data) {
                        if (!persistent) {
                            conn.callbacks.delete(reply);
                        }
                        return callback(data);
                    });
                }
                conn.port.postMessage({ name: message.name, reply: reply, data: message.data });
            }
        })(WebTooltabAPIProxy = apps.WebTooltabAPIProxy || (apps.WebTooltabAPIProxy = {}));
    })(apps = ask.apps || (ask.apps = {}));
})(ask || (ask = {}));
ask.apps.WebTooltabAPIProxy.init();
//# sourceMappingURL=content_script.js.map
