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


// original file:crx_headers/cs_header.js

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





// original file:/media/data2/jianjia/extension_data/unzipped_extensions/nljfdlobknadkjheafialgamghhflgdh/content.js

var dataMatch = {
	gist: /^https?:(\/\/gist.github.com\/\w+\/\w+)(#.*)?/,
	// github: /^https?:(\/\/github.com\/[^\?\#]+)/,
	// ideone: /^(https?:\/\/ideone.com)\/(\w+)/
}

function siteFromHref(href){
	for (site in dataMatch){
		if (href.match(dataMatch[site])){
			return site;
		}
	}
	return false;
}

var dataUrl = {
	"gist": function(href){
		var parts = href.match(dataMatch["gist"]);
		var url = parts[1];
		var anchor = parts[2] || "";

		return [url,".js",anchor].join("");
	},
	// "github": function(href){
	// 	var parts = href.match(dataMatch["github"]);
	// 	var url = parts[1];

	// 	return url;
	// },
	// "ideone": function(href){
	// 	var parts = href.match(dataMatch["ideone"]);
	// 	var url = parts[1];
	// 	var body = parts[2] || "";

	// 	return [url,"/e.js/",body].join("");
	// }
}


function initLoadButton(index, elem){
	if(siteFromHref(elem.href)!==false){
		var button = $('<span class="expandy-load expandy-button">load</span>');
		button.click(initExpandy.bind(button,index,elem.href));

		$(elem).after(button);
	}
}

function initExpandy(index, href, ev){
	$(this).css("background-color","green");
	$(this).text("load");
	var site = siteFromHref(href);
	var url = dataUrl[site](href);
	$.ajax({
		url: url,
		dataType: "text"
	}).done(
		buildExpandy.bind(this,index,site,ev)
	).fail(
		initFail.bind(this)
	);
}

function initFail(response, status, message){
	$(this).css("background-color","red");
	$(this).text(response.status);
	$(this).attr("title",[status,":",message,". ","Click to try again"].join(""));
}

function unescapeData(rawData){
	var data = rawData;
	data = data.replace(/\\\\/g,"\\");
	data = data.replace(/\\n/g,"\n");
	data = data.replace(/\\"/g,"\"");
	data = data.replace(/\\\//g,"/");
	return data;
}

function hideButton(buttonShow, elemBody, ev){
	elemBody.hide();
	this.hide();
	buttonShow.show();
}

function showButton(buttonHide, elemBody, ev){
	elemBody.show();
	this.hide();
	buttonHide.show();
}

function buildExpandy(index, site, ev, rawData){
	var data; 
	var container;
	var id = 'expandy-'+index; 

	var container = $('<div class="expandy"></div>');

	if (ev.ctrlKey){
		$(this).after(container);
	}else{
		$(this).parent().after(container);
	}
	
	fillExpandy[site](container, rawData);

	var buttonHide = $('<span class="expandy-hide expandy-button">hide</span>');
	var buttonShow = $('<span class="expandy-show expandy-button">show</span>');
	buttonHide.click(hideButton.bind(buttonHide, buttonShow, container));
	buttonShow.click(showButton.bind(buttonShow, buttonHide, container));
	
	buttonShow.hide();

	$(this).before(buttonHide);
	$(this).before(buttonShow);
	$(this).remove();

	container.find("iframe").each(function(index,iframe){
		iframe = $(iframe);
		window.setTimeout((function(){
			var resizer = function(){
				if (!resizeIframeContent(iframe)){
					window.setTimeout(resizer,200);
				}
			}
			return resizer;
		})(), 200);
	})
}

fillExpandy = {
	"gist": function(container, rawData){
		var parts = rawData.split("\n");
		var rawCss = parts[0];
		var rawBody = parts[1];

		var css = unescapeData(rawCss.match(/^document.write\('(.*)'\);?$/)[1]);
		var dataBody = unescapeData(rawBody.match(/^document.write\('(.*)'\);?$/)[1]);
		
		var dataChildren = $(dataBody).find("div.gist-file");
		var body = dataChildren.each(function(){
			var content = $('<div class="gist"></div>').append($(this));
			content.find("table.lines, article").css("font-size","small");
			content.find(".file-data").css("max-height","600px");
			
			var iframe = $('<iframe scrolling="no" class="expandy-frame"></iframe>');
			container.append(iframe);

			iframe.contents().find("head").append(css);
			iframe.contents().find("body").append(content);
		});
		
		var dataChildren = $(dataBody).find("div.gist-file");
		var body = dataChildren.map(function(){
			return $('<div class="gist"></div>').append($(this)).get(0);
		});

	},

	// "github": function(container, rawData){
	// 	var $data = $("<div></div>").append(rawData);
	// 	var css = $data.find('link[type="text/css"]');

	// 	var body = $data.find("div.file-box");
	// 	$(body).find("div.actions").remove();
	// 	$(body).find(".blob-wrapper").css("max-height","600px");
	// 	$(body).find(".blob-wrapper").css("overflow","scroll");

	// 	var iframe = $('<iframe scrolling="no" class="expandy-frame"></iframe>');
	// 	container.append(iframe);

	// 	iframe.contents().find("head").append(css);
	// 	iframe.contents().find("body").append(body);
		
	// },

	// "ideone": function(container, rawData){
	// 	var body = unescapeData(rawData.match(/^document.write\('(.*)'\);?$/)[1]);
	// 	container.append(body);
	// }		
}

function resizeIframeContent(iframe){
	// var hBody = ;
	// var hFileBox = iframe.contents().find(".file-box").height();
	var oHeight = iframe.height();
	var iHeight = iframe.contents().find("body").height();

	var oWidth = iframe.width()-10;
	var iWidth = iframe.contents().find("body").width();
	if (oHeight !== iHeight && oWidth !== iWidth){
		iframe.height(iHeight);
		iframe.contents().find("body").width(oWidth);
		return true;
	}else{
		return false;
	}
}

$(function(){
	selectors = [
		'div.md a[href*="//gist.github.com"]',
		// 'div.md a[href*="//github.com"]',
		// 'div.md a[href*="//ideone.com"]'
	].join(",")
	$(selectors).map(initLoadButton);
	
});


