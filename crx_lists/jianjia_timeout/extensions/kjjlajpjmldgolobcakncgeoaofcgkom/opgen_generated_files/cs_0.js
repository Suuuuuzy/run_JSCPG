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





// original file:/Users/jianjia/Documents/tmp/EOPG/run_JSCPG_merge/crx_lists/jianjia_timeout/extensions/kjjlajpjmldgolobcakncgeoaofcgkom/replacer.js

var extensionSettings;
var emoteListCache;
var host;
var nodeTestRegEx;
var blacklistedTags;
var emoteList;
var lastTitle;
var addedLinks;
var mutationObserver;
var twitchChannel;
var waiting = 0;
var channelIDs;

function initialize(changes = null, areaName = "sync") {
	if (areaName == "sync") {
		if (mutationObserver) {
			mutationObserver.disconnect();
		}
		chrome.storage.local.get({
			emoteListCache: {}
		}, function(settings) {
			emoteListCache = settings.emoteListCache;
		});
		chrome.storage.sync.get({
			enableTwitchEmotes: true,
			subscriberEmotesChannels: [],
			enableOnTwitch: false,
			enableBTTVEmotes: true,
			BTTVChannels: [],
			enableFFZEmotes: true,
			FFZChannels: [],
			enableEmoteBlacklist: false,
			removeBlacklistedEmotes: false,
			emoteBlacklist: [],
			hostnameListType: "blacklist",
			hostnameList: []
		}, function(settings) {
			extensionSettings = settings;
			start();
		});
	}
}
$(document).ready(initialize);
chrome.storage.onChanged.addListener(initialize);

function start() {
	host = window.location.hostname;
	lastTitle = document.title;
	addedLinks = [];
	emoteList = {};
	urlList = [];
	channelIDs = {};
	if (extensionSettings.hostnameList.indexOf(host) == -1 && extensionSettings.hostnameList.indexOf(host.replace("www.", "")) == -1) {
		if (extensionSettings.hostnameListType == "whitelist") {
			return;
		}
	} else {
		if (extensionSettings.hostnameListType == "blacklist") {
			return;
		}
	}
	nodeTestRegEx = /\w+?/gi;
	blacklistedTags = ["TITLE", "STYLE", "SCRIPT", "NOSCRIPT", "LINK", "TEMPLATE", "INPUT", "IFRAME"];
	if (extensionSettings.enableTwitchEmotes) {
		if (((host == "www.twitch.tv" || host == "clips.twitch.tv") && extensionSettings.enableOnTwitch) || (host != "www.twitch.tv" && host != "clips.twitch.tv")) {
			urlList.push(["https://api.twitchemotes.com/api/v4/channels/0", 1, "Twitch Global Emote"]);
			$.each(extensionSettings.subscriberEmotesChannels, function(index, value) {
				urlList.push([value, 5, "Subscriber Emote - " + value]);
			});
		}
	}
	if (extensionSettings.enableBTTVEmotes) {
		urlList.push(["https://api.betterttv.net/3/cached/emotes/global", 3, "BetterTTV Global Emote"]);
		$.each(extensionSettings.BTTVChannels, function(index, value) {
			urlList.push([value, 6, "BetterTTV Emote - " + value]);
		});
	}
	if (extensionSettings.enableFFZEmotes) {
		urlList.push(["https://api.frankerfacez.com/v1/set/global", 4, "FrankerFaceZ Global Emote"]);
		$.each(extensionSettings.FFZChannels, function(index, value) {
			urlList.push(["https://api.frankerfacez.com/v1/room/" + value, 4, "FrankerFaceZ Emote - " + value]);
		});
	}
	twitchChannel = getCurrentTwitchChannel();
	if (twitchChannel) {
		urlList = urlList.concat(addChannelEmotes(twitchChannel, true));
	}
	if (host == "www.twitch.tv") {
		var titleChangeObserver = new MutationObserver(function(mutations) {
			if (lastTitle != mutations[0].target.innerHTML) {
				lastTitle = mutations[0].target.innerHTML;
				twitchChannel = getCurrentTwitchChannel();
				if (twitchChannel) {
					addChannelEmotes(twitchChannel);
				}
			}
		});
		titleChangeObserver.observe(document.querySelector("title"), {attributes: false, childList: true, characterData: true, subtree: true});
	}
	var currentTimestamp = Math.floor(Date.now() / 1000);
	var deletedFromCache = 0;
	for (var url in emoteListCache) {
		if (emoteListCache[url]["expiry"] - currentTimestamp <= 0) {
			delete emoteListCache[url];
			deletedFromCache++;
		}
	}
	if (deletedFromCache > 0) {
		chrome.storage.local.set({
			emoteListCache: emoteListCache
		});
	}
	waiting += urlList.length;
	$.each(urlList, function(index, value) {
		addEmotes(value[0], value[1], value[2]);
	});
	mutationObserver = new MutationObserver(function(mutations) {
		mutations.forEach(function(mutation) {
			for (var i = 0; i < mutation.addedNodes.length; i++) {
				var currentNode = $(mutation.addedNodes[i]);
				if (host == "clips.twitch.tv") {
					try {
						twitchChannel = getCurrentTwitchChannel();
						if (twitchChannel) {
							addChannelEmotes(twitchChannel);
						}
					} catch { }
				}
				if (extensionSettings.enableEmoteBlacklist && extensionSettings.removeBlacklistedEmotes) {
					if (currentNode.hasClass("chat-line__message") && extensionSettings.emoteBlacklist.length > 0) {
						var emoteBlacklist = [];
						$.each(extensionSettings.emoteBlacklist, function(index, value) {
							var escapedValue = escapeRegEx(value);
							if (escapedValue) {
								emoteBlacklist.push(escapedValue);
							}
						});
						var blacklistRegEx = new RegExp(emoteBlacklist.join("|"), "g");
						currentNode.find(".chat-line__message--emote").each(function() {
							if ($(this).attr("alt").match(blacklistRegEx)) {
								currentNode.hide();
								return;
							}
						});
						currentNode.find("span[data-a-target='chat-message-text']").each(function() {
							if ($(this).html().match(blacklistRegEx)) {
								currentNode.hide();
								return;
							}
						});
					}
				}
				currentNode.find("*").contents().filter(function() {
					return (this.nodeType == 3 && this.textContent.match(nodeTestRegEx));
				}).each(function() {
					replacePhrasesWithEmotes(this);
				});
			}
		});
	});
	mutationObserver.observe(document.body, {attributes: false, childList: true, characterData: true, subtree: true});
}

function escapeRegEx(string) {
	return string.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

function addSubscriberEmotesForChannel(channelName, extra, direct, tries) {
	if (!(channelName in channelIDs)) {
		channelIDs[channelName] = 0;
		$.ajax({
			url: "https://cors-anywhere.herokuapp.com/https://twitchemotes.com/search/channel?query=" + channelName,
			type: "GET",
			timeout: 15000,
			headers: {"X-Requested-With": "null"},
			success: function(response, textStatus, request) {
				channelIDs[channelName] = request.getResponseHeader("x-final-url").split("/")[4];
				addEmotes("https://api.twitchemotes.com/api/v4/channels/" + channelIDs[channelName], 1, extra, direct, tries);
			}
		});
	} else {
	addEmotes("https://api.twitchemotes.com/api/v4/channels/" + channelIDs[channelName], 1, extra, direct, tries);
	}
}

function addBTTVEmotesForChannel(channelName, extra, direct, tries) {
	if (!(channelName in channelIDs)) {
		channelIDs[channelName] = 0;
		$.ajax({
			url: "https://cors-anywhere.herokuapp.com/https://twitchemotes.com/search/channel?query=" + channelName,
			type: "GET",
			timeout: 15000,
			headers: {"X-Requested-With": "null"},
			success: function(response, textStatus, request) {
				channelIDs[channelName] = request.getResponseHeader("x-final-url").split("/")[4];
				addEmotes("https://api.betterttv.net/3/cached/users/twitch/" + channelIDs[channelName], 2, extra, direct, tries);
			}
		});
	} else {
		addEmotes("https://api.betterttv.net/3/cached/users/twitch/" + channelIDs[channelName], 2, extra, direct, tries);
	}
}

function addEmotes(url, parseMode, extra, direct = false, tries = 3, ignoreAdded = true) {
	if (parseMode == 6) {
		addBTTVEmotesForChannel(url, extra, direct, tries);
		return;
	}
	if (parseMode == 5) {
		addSubscriberEmotesForChannel(url, extra, direct, tries);
		return;
	}
	if (ignoreAdded) {
		if (addedLinks.indexOf(url) == -1) {
			addedLinks.push(url);
		} else {
			waiting--;
			return;
		}
	}
	var headers = {};
	var newURL = url;
	if (parseMode == 1 || parseMode == 2 || parseMode == 3) {
		headers = {"X-Requested-With": "null"};
		newURL = "https://cors-anywhere.herokuapp.com/" + url;
	}
	var currentTimestamp = Math.floor(Date.now() / 1000);
	if (url in emoteListCache) {
		if (emoteListCache[url]["expiry"] - currentTimestamp > 0) {
			processEmotes(emoteListCache[url]["emoteList"], direct);
			return;
		}
	}
	$.ajax({
		url: newURL,
		type: "GET",
		timeout: 15000,
		headers: headers,
		success: function(response) {
			var emoteList = {};
			switch (parseMode) {
				case 1:
					$.each(response["emotes"], function(index, data) {
						emoteList[data["code"]] = ["https://static-cdn.jtvnw.net/emoticons/v1/" + data["id"] + "/1.0", extra];
					});
					break;
				case 2:
					$.each(response["sharedEmotes"], function(index, data) {
						emoteList[data["code"]] = ["https://cdn.betterttv.net/emote/" + data["id"] + "/1x", extra];
					});
					break;
				case 3:
					$.each(response, function(index, data) {
						emoteList[data["code"]] = ["https://cdn.betterttv.net/emote/" + data["id"] + "/1x", extra];
					});
					break;
				case 4:
					$.each(response["sets"], function(setID, setData) {
						$.each(setData["emoticons"], function(index, data) {
							emoteList[data["name"]] = ["https://cdn.frankerfacez.com/emoticon/" + data["id"] + "/1", extra];
						});
					});
					break;
				default:
					break;
			}
			emoteListCache[url] = {expiry: currentTimestamp + 3600, emoteList: emoteList};
			chrome.storage.local.set({
				emoteListCache: emoteListCache
			});
			processEmotes(emoteList, direct);
		},
		error: function() {
			if (--tries > 0) {
				addEmotes(url, parseMode, extra, direct, tries, false);
			} else {
				if (--waiting == 0) {
					startReplaceLoop();
				}
			}
		}
	});
}

function processEmotes(emotes, direct) {
	for (var emoteName in emotes) {
		if (extensionSettings.enableEmoteBlacklist) {
			var index = extensionSettings.emoteBlacklist.indexOf(emoteName);
			if (index > -1) {
				continue;
			}
		}
		var emoteRegex = "(?<=\\s|^)" + escapeRegEx(emoteName) + "(?=\\s|$)";
		if (emoteName in emoteList) {
			emoteList[emoteName][0] = emoteList[emoteName][0].replace("\" alt=", "&#10;" + emotes[emoteName][1] + "\" alt=")
		} else {
			emoteList[emoteName] = ["<img style=\"max-height: 32px;\" title=\"" + emoteName + "&#10;" + emotes[emoteName][1] + "\" alt=\"" + emoteName + "\" src=\"" + emotes[emoteName][0] + "\"\\>", new RegExp(emoteRegex, "g")];
		}
	}
	if (direct) {
		startReplaceLoop();
	} else if (--waiting == 0) {
		startReplaceLoop();
	}
}

function getCurrentTwitchChannel() {
	var twitchChannel = "";
	if (host == "www.twitch.tv") {
		var urlSplit = window.location.href.split("/")
		if (urlSplit.length > 4 && (urlSplit[4].startsWith("videos") || urlSplit[4].startsWith("clip") || urlSplit[4].startsWith("events") || urlSplit[4].startsWith("followers") || urlSplit[4].startsWith("following"))) {
			twitchChannel = urlSplit[3];
		} else if (urlSplit.length > 3) {
			if (urlSplit[3] == "popout") {
				twitchChannel = urlSplit[4];
			} else if (urlSplit[3] == "videos") {
				if (document.documentElement.innerHTML.indexOf("<title>Twitch</title>") == -1) {
					try {
						twitchChannel = new RegExp("<title>(.*?) - ", "g").exec(document.documentElement.innerHTML)[1].toLowerCase();
					} catch { }
				}
			} else {
				if (document.documentElement.innerHTML.indexOf("<title>Twitch</title>") == -1) {
					twitchChannel = urlSplit[3];
				}
			}
		}
	} else if (host == "clips.twitch.tv") {
		try {
			twitchChannel = new RegExp(escapeRegEx("<span class=\"tw-font-size-4\">") + "(.*?)" + escapeRegEx("</span>"), "g").exec(document.documentElement.innerHTML)[1].toLowerCase();
		} catch { }
	}
	twitchChannel = twitchChannel.trim();
	if (twitchChannel && twitchChannel.indexOf(" ") == -1) {
		return twitchChannel;
	}
}

function addChannelEmotes(channel, returns = false) {
	urlList = [];
	if (extensionSettings.enableTwitchEmotes) {
		if (((host == "www.twitch.tv" || host == "clips.twitch.tv") && extensionSettings.enableOnTwitch) || (host != "www.twitch.tv" && host != "clips.twitch.tv")) {
			if (extensionSettings.subscriberEmotesChannels.indexOf(channel) == -1) {
				urlList.push([channel, 5, "Subscriber Emote - " + channel]);
			}
		}
	}
	if (extensionSettings.enableBTTVEmotes) {
		if (extensionSettings.BTTVChannels.indexOf(channel) == -1) {
			urlList.push([channel, 6, "BetterTTV Emote - " + channel]);
		}
	}
	if (extensionSettings.enableFFZEmotes) {
		if (extensionSettings.FFZChannels.indexOf(channel) == -1) {
			urlList.push(["https://api.frankerfacez.com/v1/room/" + channel, 4, "FrankerFaceZ Emote - " + channel]);
		}
	}
	if (returns) {
		return urlList;
	} else {
		waiting += urlList.length;
		$.each(urlList, function(index, value) {
			addEmotes(value[0], value[1], value[2]);
		});
	}
}

function startReplaceLoop() {
	$("body *").filter(function() {
		return (blacklistedTags.indexOf($(this).prop("tagName")) == -1);
	}).each(function() {
		$(this).contents().filter(function() {
			return (this.nodeType == 3 && this.textContent.match(nodeTestRegEx));
		}).each(function() {
			replacePhrasesWithEmotes(this);
		});
	});
}

function replacePhrasesWithEmotes(element) {
	var elementContent = element.textContent;
	for (var emoteName in emoteList) {
		elementContent = elementContent.replace(emoteList[emoteName][1], emoteList[emoteName][0]);
	}
	if (element.textContent != elementContent) {
		$(element).replaceWith(elementContent);
		var scrollElements = [];
		if (host == "www.twitch.tv") {
			if (!$(".chat-scroll-footer__placeholder").find(".tw-overflow-hidden").is(":visible")) {
				scrollElements.push($(".chat-list").find(".simplebar-scroll-content"));
			}
			if (!$(".video-chat__sync-button").is(":visible")) {
				scrollElements.push($(".video-chat__message-list-wrapper"));
			}
		} else if (host == "clips.twitch.tv") {
			if (!$(".tw-core-button--small").is(":visible")) {
				scrollElements.push($(".clips-chat").find(".simplebar-scroll-content"));
			}
		}
		for (var i = 0; i < scrollElements.length; i++) {
			if (scrollElements[i].length > 0) {
				$(scrollElements[i]).scrollTop(scrollElements[i][0].scrollHeight + 100);
			}
		}
	}
}
