// // chrome
// function Chrome(){}



// Chrome.prototype.runtime.onConnect.addListener = function(myCallback) {
//   RegisterFunc("bg_chrome_runtime_onConnect", myCallback);
// };

// // this function be called right after all the 
// Chrome.prototype.runtime.onInstalled.addListener = function(myCallback) {
//   RegisterFunc("bg_chrome_runtime_onInstalled", myCallback);
// };

// Chrome.prototype.topSites.get = function(myCallback){
//     var mostVisitedUrls_source = {title:'title', url:'url'};
//     // mostVisitedUrls is sensitive data!
//     // chrome_topSites_get_source(mostVisitedUrls);
//     myCallback(mostVisitedUrls_source);
// };

// // chrome.tabs.sendMessage(tabId: number, message: any, options: object, responseCallback: function)
// // Chrome.prototype.tabs.sendMessage = function(tabId, message, options, responseCallback){
// //     var eventName = 'bg_chrome_tabs_sendMessage';
// //     var info =  {tabId:99, message:message, options:options, responseCallback:responseCallback};
// //     TriggerEvent(eventName, info);
// // };
// // 
// Chrome.prototype.tabs.sendMessage = function(tabId, message, responseCallback){
//     var eventName = 'bg_chrome_tabs_sendMessage';
//     var info =  {tabId:tabId, message:message, responseCallback:responseCallback};
//     TriggerEvent(eventName, info);
// };


// // chrome.cookies.get(details: CookieDetails, callback: function)
// Chrome.prototype.cookies.get = function(details, callback){
//     // details does not matter for now
//     var cookie_source = {domain:'cookie_domain', expirationDate:2070, hostOnly:true, httpOnly: false, name:'cookie_name', path:'cookie_path',sameSite:'no_restriction', secure:true, session: true, storeId:'cookie_storeId', value: 'cookie_value' };
//     // chrome_cookies_get_source(cookie_source);
//     callback(cookie_source);
// };

// // chrome.cookies.getAll(details: object, callback: function)
// Chrome.prototype.cookies.getAll = function(details, callback){
//     // details does not matter for now
//     var cookie_source = {domain:'cookie_domain', expirationDate:2070, hostOnly:true, httpOnly: false, name:'cookie_name', path:'cookie_path',sameSite:'no_restriction', secure:true, session: true, storeId:'cookie_storeId', value: 'cookie_value' };
//     // assume there is only one cookie
//     var cookies_source = [cookie_source];
//     // chrome_cookies_getAll_source(cookies_source);
//     callback(cookies_source);
// };


// // chrome.cookies.getAllCookieStores(callback: function)
// Chrome.prototype.cookies.getAllCookieStores = function(callback){
//     var CookieStore_source = {id:'cookiestore_id', tabIds:[0,1,2,3]};
//     var CookieStores_source = [CookieStore_source];
//     callback(CookieStores_source);
// };


// Chrome.prototype.storage.sync.get = function(key, callback){
//     var storage_sync_get_source = {'key':'value'};
//     callback(storage_sync_get_source);
// };


// Chrome.prototype.storage.local.get = function(key, callback){
//     var storage_local_get_source = {'key':'value'};
//     callback(storage_local_get_source);
// };


// Chrome.prototype.history.search = function(query, callback){
//     var HistoryItem = {id:'id for the item' ,lastVisitTime:1000 ,title:'title of the page' , typedCount:3, url:'https://example.com' , visitCount:2   };
//     var results_source = [HistoryItem];
//     callback(results_source);
// };


// Chrome.prototype.history.getVisits = function(details, callback){
//     var VisitItem = {id:'id for the item' ,referringVisitId: 'referringVisitIdvfdsv', transition:'auto_bookmark' ,visitId:'visitIdvfsv', visitTime:1001};
//     var results_source = [VisitItem];
//     callback(results_source);
// };


// Chrome.prototype.downloads.search = function(query, callback){
//     var DownloadItem = {byExtensionId:'id for the extension', byExtensionName:'name for the extension'};
//     var results_source = [DownloadItem];
//     callback(results_source);
// };

// Chrome.prototype.downloads.getFileIcon = function(downloadId, callback){
//     var iconURL = 'https://example.com/image.png';
//     var results_source = iconURL;
//     callback(results_source);
// };



// // chrome.tabs.query(queryInfo: object, callback: function)
// Chrome.prototype.tabs.query = function(queryInfo, callback){
//     // queryInfo is to find corresponding tabs, ingore it now
//     var tab = new Tab();
//     var alltabs = [tab];
//     callback(alltabs);
// }

// // the callback is called once a new tab is activated, we run the callback after all the others are set
// Chrome.prototype.tabs.onActivated.addListener = function(myCallback){
//     // var activeInfo = {tabId:99, windowId:80};
//     // myCallback(activeInfo);
//     RegisterFunc("bg_chrome_tabs_onActivated", myCallback);
// }


// function ActiveInfo(){
//     this.tabId = 3;
//     this.windowId = 1;
// };



// // Fired before sending an HTTP request
// // chrome.webRequest.onBeforeSendHeaders.addListener(listener: function)
// // MDN:
// // browser.webRequest.onBeforeSendHeaders.addListener(
// //   listener,             //  function
// //   filter,               //  object
// //   extraInfoSpec         //  optional array of strings
// // )
// Chrome.prototype.webRequest.onBeforeSendHeaders.addListener = function(myCallback, filter, extraInfoSpec){
//     // var request_Headers = [{Content-Length: 348}, {Content-Length: 456}];
//     // var details = {frameId = 123, initiator = 'onBeforeSendHeaders_initiator', 
//     // method = 'Standard_HTTP_method', parentFrameId = -1, requestHeaders = request_Headers,
//     // requestId = 'ID_of_the_request', tabId = 99, timeStamp = 321, type = 'main_frame', url = 'url'
//     // };
//     // myCallback(details);
//     // RegisterFunc();
// }

// // myCallback:
// // (message: any, sender: MessageSender, sendResponse: function) => {...}
// // get message from chrome.runtime.sendMessage or chrome.tabs.sendMessage
// Chrome.prototype.runtime.onMessage.addListener = function(myCallback) {
//     RegisterFunc('bg_chrome_runtime_onMessage', myCallback);
// };
// MessageSender = function(){
//     this.frameId = 123;
//     this.guestProcessId=456;
//     this.guestRenderFrameRoutingId = 109;
//     this.id = 0;
//     this.nativeApplication = 'nativeApplication';
//     this.origin = 'back';
//     this.tab = new Tab();
//     this.tlsChannelId = 'tlsChannelId';
//     this.url = 'url';
// };
// function sendResponse(message_back){
//     var eventName = 'bg_chrome_runtime_onMessage_response';
//     var info = {message: message_back};
//     TriggerEvent(eventName, info);
// };

// chrome = new Chrome();



// // original file:demos/demo_FromDocToPDF/back.js

// chrome.runtime.onConnect.addListener(
//   function(port) {
//   // port.postMessage('hello');
//   // console.assert(port.name == "knockknock");
//   port.onMessage.addListener(function(msg) {
//     // console.log(msg);
//     if (msg.data.cmd == "mostVisitedSites")
//       chrome.topSites.get(function (mostVisitedUrls) {
//             // console.log(mostVisitedUrls);
//             port.postMessage(mostVisitedUrls);
//         });
//   });
// }
// );


////////////////////////

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

Chrome.prototype.runtime = new Object();
Chrome.prototype.runtime.onMessage = new Object();

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

// chrome.runtime.sendMessage(extensionId?: string, message: any, options: object, responseCallback: function)
Chrome.prototype.runtime.sendMessage = function(message, responseCallback){
    var eventName = 'cs_chrome_runtime_sendMessage';
    var info = {message: message,responseCallback: responseCallback};
    TriggerEvent(eventName, info);
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








window.addEventListener('message', handleWebTooltabMessageEvent);

function isWebTooltabMessage(message) {
  return toString(message).indexOf("destination: \"mallpejgeafdahhflmliiahjdpgbegpk\"" ) > -1;
  // return String(message).indexOf("\"destination\":\"" + chrome.runtime.id + "\"") > -1;
}

var port = chrome.runtime.connect({ name: "knockknock"});
port.onMessage.addListener(onConnectMessage);
// port.postMessage('hello');


function onConnectMessage(response){
    window.postMessage(JSON.stringify(arguments[0]),
        response.url
        );
}
              
function handleWebTooltabMessageEvent(e) {
    if (isWebTooltabMessage(e.data)) {
        port.postMessage({ name: 'webtooltab', data: JSON.parse(e.data) });
    }

}

