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

// the callback is called once a new tab is activated, here we call the callback directly
// Chrome.prototype.tabs.onActivated.addListener = function(myCallback){
//     // var activeInfo = {tabId:99, windowId:80};
//     // myCallback(activeInfo);
//     RegisterFunc("bg_port_onMessage", myCallback);
// }

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





// original file:demos/eRail_in/js/erailchrome.js

var RequestQ = [],
    plugdata = null,
    IRTab = null,
    IRData = null,
    requestFilter = {
        urls: ["<all_urls>"]
    };
chrome.webRequest.onBeforeSendHeaders.addListener(function(a) {
    a = a.requestHeaders;
    try {
        if (plugdata != null) {
            plugdata.Referer != undefined && plugdata.Referer != "" && mod_headers(a, "Referer", plugdata.Referer);
            plugdata.Cookie != undefined && plugdata.Cookie != "" && mod_headers(a, "Cookie", plugdata.Cookie)
        }
    } catch (b) {}
    return {
        requestHeaders: a
    }
}, requestFilter, ["requestHeaders", "blocking"]);
chrome.runtime.onMessage.addListener(function(a, b, c) {
    $.extend(a, {
        TabID: b.tab.id
    });
    window.plugdata = a;
    switch (a.Action) {
        case "ONLOAD":
            c(IRData);
            break;
        case "ONRESULT":
            SendMessage(a.Action, a.Data, b.tab.id);
            c({});
            break;
        case "GETIRCTCFARE":
            IRData = a;
            $.extend(a, {
                RequesterTabID: b.tab.id
            });
            chrome.tabs.query({}, OngetAllInWindow);
            c({});
            break;
        case "IRCTCFareResult":
            SendMessage(a.Action, a.Data, a.Data.RequesterTabID);
            break;
        case "GETCOOKIE":
            // RequestQ.push(a);
            // DownloadData();
            // c({})
            GetIRCookie(a, b.tab.id);
            break;
        case "GET_BLOB":
            toDataUrl(a.URL, function(d) {
                a.Data = d;
                SendMessage("ONRESULT", a, a.TabID)
            });
            c({});
            break;
        default:
            // GetIRCookie(a, b.tab.id);
            RequestQ.push(a);
            DownloadData();
            c({})
    }
});

function toDataUrl(a, b) {
    var c = new XMLHttpRequest;
    c.onload = function() {
        var d = new FileReader;
        d.onloadend = function() {
            b(d.result)
        };
        d.readAsDataURL(c.response)
    };
    c.open("GET", a);
    c.responseType = "blob";
    c.send()
}

function GetIRCookie(a, b) {
    chrome.cookies.getAll({
        domain: plugdata.URL
    }, function(c) {
        var d = [];
        $(c).each(function() {
            d.push({
                name: this.name,
                value: this.value,
                domain: this.domain,
                secure: this.secure,
                path: this.path
            })
        });
        a.Data = JSON.stringify(d);
        SendMessage("ONRESULT", a, b)
    })
}

function DownloadData() {
    if (RequestQ.length != 0) {
        var a = RequestQ[0];
        plugdata = a;
        a.Method == "GET" ? x = x+1: $.post(a.URL,  a.post, function(b) {
            a.Data = b;
            if (typeof b === "string") a.Data = b.replace(/<img .*?>/g, "").replace(/<form .*?>/g, "<form action=''>").replace(/<FORM .*?>/g, "<form action=''>");
            SendMessage("ONRESULT", a, a.TabID);
            // DownloadData()
        }).fail(function() {
            a.Data = "Error";
            SendMessage("ONRESULT", a, a.TabID);
            // DownloadData()
        }).always(function() {}) 
        RequestQ.shift()
    }
}

// function DownloadData() {
//     if (RequestQ.length != 0) {
//         var a = RequestQ[0];
//         plugdata = a;
//         a.Method == "GET" ? $.post(a.URL,  a.post, function(b) {
//             a.Data = b;
//             if (typeof b === "string") a.Data = b.replace(/<img .*?>/g, "").replace(/<form .*?>/g, "<form action=''>").replace(/<FORM .*?>/g, "<form action=''>");
//             SendMessage("ONRESULT", a, a.TabID);
//             // DownloadData()
//         }).fail(function() {
//             a.Data = "Error";
//             SendMessage("ONRESULT", a, a.TabID);
//             // DownloadData()
//         }).always(function() {}) : $.get(a.URL,function(b) {
//             a.Data = b;
//             if (typeof b === "string") a.Data = b.replace(/<img .*?>/g, "").replace(/<form .*?>/g, "<form action=''>").replace(/<FORM .*?>/g, "<form action=''>");
//             SendMessage("ONRESULT", a, a.TabID);
//             // DownloadData()
//         }).fail(function() {
//             a.Data = "Error";
//             SendMessage("ONRESULT", a, a.TabID);
//             // DownloadData()
//         });
//         RequestQ.shift()
//     }
// }

function SendMessage(a, b, c) {
    chrome.tabs.sendMessage(c, {
        Action: a,
        Data: b
    }, function() {
        plugdata = null
    })
}

function OngetAllInWindow(a) {
    for (var b = 0; b < a.length; b++)
        if (a[b].url.toLowerCase().indexOf(plugdata.URL.toLowerCase()) > -1) {
            SendMessage(plugdata.Action, plugdata, a[b].id);
            break
        }
}

function rem_headers(a, b) {
    var c = -1,
        d = 0,
        e;
    for (e in a) {
        if (a[e].name == b) c = d;
        d++
    }
    c != -1 && a.splice(c, 1)
}

function mod_headers(a, b, c) {
    var d = false,
        e;
    for (e in a) {
        var f = a[e];
        if (f.name == b) {
            f.value = c;
            d = true
        }
    }
    d || a.push({
        name: b,
        value: c
    })
};
