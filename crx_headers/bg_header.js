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
    var eventName = 'bg_port_postMessage';
    var info =  {message:msg};
    TriggerEvent(eventName, info);
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
Chrome.prototype.runtime.onInstalled = new Object();
// this function be called righrt after all the 
Chrome.prototype.runtime.onInstalled.addListener = function(myCallback) {
  RegisterFunc("bg_chrome_runtime_onInstalled", myCallback);
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
    var eventName = 'bg_chrome_runtime_onMessage_response';
    var info = {message: message_back};
    TriggerEvent(eventName, info);
};


// chrome.runtime.onMessage.removeListener
Chrome.prototype.runtime.onMessage.removeListener = function(myCallback) {
    UnregisterFunc('bg_chrome_runtime_onMessage', myCallback);
};

// chrome.runtime.onMessageExternal.addListener
Chrome.prototype.runtime.onMessageExternal = new Object();
// myCallback parameters: (message: any, sender: MessageSender, sendResponse: function) => {...}
Chrome.prototype.runtime.onMessageExternal.addListener = function(myCallback){
    // ("bg_chrome_runtime_onMessageExternal", myCallback);
    var type = 'bg_chrome_runtime_MessageExternal';
    MarkAttackEntry(type, myCallback);
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
    sendResponseExternal_sink(message_out);
};



Chrome.prototype.topSites = new Object();
Chrome.prototype.topSites.get = function(myCallback){
    var mostVisitedUrls_source = {title:'title', url:'url'};
    // mostVisitedUrls is sensitive data!
    // chrome_topSites_get_source(mostVisitedUrls);
    MarkSource(mostVisitedUrls_source);
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
    var eventName = 'bg_chrome_tabs_sendMessage';
    var info =  {tabId:tabId, message:message, responseCallback:responseCallback};
    TriggerEvent(eventName, info);
};

// chrome.tabs.query(queryInfo: object, callback: function)
Chrome.prototype.tabs.query = function(queryInfo, callback){
    // queryInfo is to find corresponding tabs, ingore it now
    var tab = new Tab();
    var alltabs = [tab];
    callback(alltabs);
}

Chrome.prototype.tabs.onActivated = new Object();
// the callback is called once a new tab is activated, we run the callback after all the others are set
Chrome.prototype.tabs.onActivated.addListener = function(myCallback){
    // var activeInfo = {tabId:99, windowId:80};
    // myCallback(activeInfo);
    RegisterFunc("bg_chrome_tabs_onActivated", myCallback);
}

// chrome.tabs.executeScript
Chrome.prototype.tabs.executeScript = function(tabid, details, callback){
    chrome_tabs_executeScript_sink(details);
    callback();
}


function ActiveInfo(){
    this.tabId = 3;
    this.windowId = 1;
};



Chrome.prototype.cookies = new Object();
// chrome.cookies.get(details: CookieDetails, callback: function)
Chrome.prototype.cookies.get = function(details, callback){
    // details does not matter for now
    var cookie_source = {domain:'cookie_domain', expirationDate:2070, hostOnly:true, httpOnly: false, name:'cookie_name', path:'cookie_path',sameSite:'no_restriction', secure:true, session: true, storeId:'cookie_storeId', value: 'cookie_value' };
    // chrome_cookies_get_source(cookie_source);
    MarkSource(cookie_source)
    callback(cookie_source);
};

// chrome.cookies.getAll(details: object, callback: function)
Chrome.prototype.cookies.getAll = function(details, callback){
    // details does not matter for now
    var cookie_source = {domain:'cookie_domain', expirationDate:2070, hostOnly:true, httpOnly: false, name:'cookie_name', path:'cookie_path',sameSite:'no_restriction', secure:true, session: true, storeId:'cookie_storeId', value: 'cookie_value' };
    // assume there is only one cookie
    var cookies_source = [cookie_source];
    // chrome_cookies_getAll_source(cookies_source);
    MarkSource(cookies_source)
    callback(cookies_source);
};


// chrome.cookies.getAllCookieStores(callback: function)
Chrome.prototype.cookies.getAllCookieStores = function(callback){
    var CookieStore_source = {id:'cookiestore_id', tabIds:[0,1,2,3]};
    var CookieStores_source = [CookieStore_source];
    MarkSource(CookieStores_source)
    callback(CookieStores_source);
};


Chrome.prototype.storage = new Object();
Chrome.prototype.storage.sync = new Object();
Chrome.prototype.storage.sync.get = function(key, callback){
    var storage_sync_get_source = {'key':'value'};
    MarkSource(storage_sync_get_source);
    callback(storage_sync_get_source);
};

Chrome.prototype.storage.sync.set = function(key, callback){
    chrome_storage_sync_set_sink(key);
    callback();
};

Chrome.prototype.storage.sync.remove = function(key, callback){
    chrome_storage_sync_remove_sink(key);
    callback();
};

Chrome.prototype.storage.sync.clear = function(callback){
    chrome_storage_sync_clear_sink();
    callback();
};


Chrome.prototype.storage.local = new Object();
Chrome.prototype.storage.local.get = function(key, callback){
    var storage_local_get_source = {'key':'value'};
    MarkSource(storage_local_get_source);
    callback(storage_local_get_source);
};

Chrome.prototype.storage.local.set = function(key, callback){
    chrome_storage_local_set_sink(key);
    callback();
};

Chrome.prototype.storage.local.remove = function(key, callback){
    chrome_storage_local_remove_sink(key);
    callback();
};

Chrome.prototype.storage.local.clear = function(callback){
    chrome_storage_local_clear_sink();
    callback();
};



Chrome.prototype.history = new Object();
Chrome.prototype.history.search = function(query, callback){
    var HistoryItem = {id:'id for history item' ,lastVisitTime:1000 ,title:'title of history page' , typedCount:3, url:'https://example.com' , visitCount:2   };
    var results_source = [HistoryItem];
    MarkSource(results_source);
    callback(results_source);
};


Chrome.prototype.history.getVisits = function(details, callback){
    var VisitItem = {id:'id for the item' ,referringVisitId: 'referringVisitIdvfdsv', transition:'auto_bookmark' ,visitId:'visitIdvfsv', visitTime:1001};
    var results_source = [VisitItem];
    MarkSource(results_source);
    callback(results_source);
};

Chrome.prototype.downloads = new Object();
Chrome.prototype.downloads.search = function(query, callback){
    var DownloadItem = {byExtensionId:'id for the extension', byExtensionName:'name for the extension'};
    var results_source = [DownloadItem];
    MarkSource(results_source);
    callback(results_source);
};


Chrome.prototype.downloads.download = function(options, callback){
    chrome_downloads_download_sink(options);
    // chrome_downloads_download_sink(options.url);
    // chrome_downloads_download_sink(options.body);
    // chrome_downloads_download_sink(options.filename);
}

Chrome.prototype.downloads.getFileIcon = function(downloadId, callback){
    var iconURL = 'https://example.com/image.png';
    var results_source = iconURL;
    MarkSource(results_source);
    callback(results_source);
};

// Remove the downloaded file if it exists and the DownloadItem is complete
Chrome.prototype.downloads.removeFile = function(downloadId, callback) {
    chrome_downloads_removeFile_sink(downloadId);
    // body...
}

// Erase matching DownloadItem from history without deleting the downloaded file.
Chrome.prototype.downloads.erase = function(query, callback) {
    chrome_downloads_erase_sink(query);
    // body...
}


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
    var results_source = [node];
    MarkSource(results_source);
    callback(results_source);
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
    // var request_Headers = [{Content-Length: 348}, {Content-Length: 456}];
    // var details = {frameId = 123, initiator = 'onBeforeSendHeaders_initiator', 
    // method = 'Standard_HTTP_method', parentFrameId = -1, requestHeaders = request_Headers,
    // requestId = 'ID_of_the_request', tabId = 99, timeStamp = 321, type = 'main_frame', url = 'url'
    // };
    // myCallback(details);
    // RegisterFunc();
}



// chrome.browsingData.remove

Chrome.prototype.browsingData = new Object();
Chrome.prototype.browsingData.remove = function(para1, prara2, para3){
    chrome_browsingData_remove_sink(para1, prara2, para3);
}


chrome = new Chrome();



/////////