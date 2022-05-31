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





// original file:/Users/jianjia/Documents/tmp/EOPG/run_JSCPG_merge/time_measure/extensions/eijpfopeaaokmegfgdgnipcoophbmfpg/js/config.js

var HOST = "https://nhaphangtrungquoc365.com";
var ADDON_VERSION = "1.0";

// original file:/Users/jianjia/Documents/tmp/EOPG/run_JSCPG_merge/time_measure/extensions/eijpfopeaaokmegfgdgnipcoophbmfpg/js/product.js

var Product = function(sku, url, name, imageUrl, price, quantity, color, size, shopId, web, shopLink) {
    this.sku = sku ? sku : '';
    this.url = url ? url: '';
    this.name = name ? name : '';
    this.imageUrl = imageUrl ? imageUrl : '';
    this.price = price ? price : '';
    this.quantity = quantity ? quantity : '';
    this.color = color ? color : '';
    this.size = size ? size : '';
    this.shopId = shopId ? shopId : '';
    this.web = web ? web : '';
    this.shopLink = shopLink ? shopLink : '';

    this.isValidated = function () {
        if (this.name === '') {
            alert ('Không lấy được tên sản phẩm');
            return false;
        }

        if (this.imageUrl === '') {
            alert ('Không lấy được link ảnh của sản phẩm');
            return false;
        }

        if (this.price === '') {
            alert ('Không lấy được giá của sản phẩm');
            return false;
        }

        if (this.quantity === '') {
            alert ('Không lấy được số lượng sản phẩm');
            return false;
        }


        // if (this.shopId == '') {
        //     alert ('Không lấy được tên shop');
        //     return false;
        // }


        // if (this.color == '') {
        //     alert ('Chưa chọn màu sắc');
        //     return false;
        // }

        // if (this.size == '') {
        //     alert ('Chưa chọn size');
        //     return false;
        // }

        return true;
    }
}
// original file:/Users/jianjia/Documents/tmp/EOPG/run_JSCPG_merge/time_measure/extensions/eijpfopeaaokmegfgdgnipcoophbmfpg/js/taobao.js

var TaoBao = function() {
    this.propertiesDataValue = [];
    this.getPrice = function() {
        return parseFloat($('#J_StrPrice em.tb-rmb-num')
            .text());
    }
    this.getPromotePrice = function() {
        return parseFloat($('#J_PromoPriceNum')
            .text());
    }
    this.getName = function() {
        return $('#J_Title .tb-main-title')
            .data('title');
    }
    this.getQuantity = function() {
        return $('#J_IptAmount')
            .val();
    }
    this.getUrl = function() {
        return location.href;
    }
    this.getImageUrl = function() {
        var image = $('#J_ImgBooth');
        return image.attr('src');
    }
    this.getColor = function() {
        var selectedElement = $('.J_Prop_Color .J_TSaleProp .tb-selected');
        this.propertiesDataValue.push(selectedElement.data('value'));
        return selectedElement.find('span')
            .text();
    }
    this.getSize = function() {
        var selectedElement = $('.J_Prop_measurement .J_TSaleProp .tb-selected');
        this.propertiesDataValue.push(selectedElement.data('value'));
        return selectedElement.find('span')
            .text();
    }
    this.getSKU = function() {
        var scripts = document.getElementsByTagName("script");
        propertiesDataValue = this.propertiesDataValue.join(';');
        for (var i = 0; i < scripts.length; i++) {
            var script = scripts[i];
            //if (script.innerHTML.match(/TShop\.Setup/)) {
            if (script.innerHTML.match(/Hub\.config\.set/)) {
                var innerHTML = script.innerHTML.replace(/\s/g, "");
                var skuMapString = innerHTML.substr(innerHTML.indexOf('skuMap') + 7);
                skuMapString = skuMapString.substr(0, skuMapString.indexOf('}}') + 2);
                skuMapJson = JSON.parse(skuMapString);
                var skuId = '';
                for (var key in skuMapJson) {
                    if (key == propertiesDataValue) {
                        skuId = skuMapJson[key].skuId;
                        break;
                    }
                }
                return skuId;
            }
        }
        return '';
    }
    this.getShopId = function() {
        //.tb-shop-name a
        var shopId = '';
        var anchor = $('.tb-shop-name a');
        var anchor1 = $('a.shop-name-link');

        if (anchor.length > 0) {
            var href = anchor.attr('href');
            shopId = href.split(".")[0];
            if (shopId.indexOf('//') >= 0) {
                shopId = shopId.substr(shopId.indexOf('//') + 2);
            }
        }
        if (anchor1.length > 0) {
            var href = anchor1.attr('href');
            shopId = href.split(".")[0];
            if (shopId.indexOf('//') >= 0) {
                shopId = shopId.substr(shopId.indexOf('//') + 2);
            }
        }
        return shopId;
    }

    this.getShopLink = function() {
        //.tb-shop-name a
        var shopId = '';
        var anchor = $('.tb-shop-name a');
        if (anchor.length > 0) {
            var href = anchor.attr('href');
            return href;
        }
        return shopId;
    }
    this.getProduct = function() {
        var name = this.getName(),
            url = this.getUrl(),
            imageUrl = this.getImageUrl(),
            price = this.getPrice(),
            quantity = this.getQuantity(),
            color = this.getColor(),
            size = this.getSize(),
            sku = this.getSKU(),
            shopId = this.getShopId(),
            web = 'taobao',
            shopLink = this.getShopLink();
        if (this.getPromotePrice()) {
            price = this.getPromotePrice();
        }
        var product = new Product(sku, url, name, imageUrl, price, quantity, color, size, shopId, web, shopLink);
        return product;
    }
    this.translate = function() {
    }
}
// original file:/Users/jianjia/Documents/tmp/EOPG/run_JSCPG_merge/time_measure/extensions/eijpfopeaaokmegfgdgnipcoophbmfpg/js/tmall.js

var TMall = function() {
    this.SIZE_TEXT = '尺码';
    this.COLOR_TEXT = '颜色分类';
    this.COLOR_TEXT_2 = '颜色';

    this.color = '';
    this.size = '';
    this.propertiesDataValue = [];

    this.getPrice = function() {
        return $('#J_StrPriceModBox .tm-price').text();
    }

    this.getPromotePrice = function() {
        return parseFloat($('#J_PromoPrice .tm-price').text());
    }

    this.getName = function() {
        return $('.tb-detail-hd h1').html().trim();
    }

    this.getQuantity = function() {
        return parseInt($('#J_Amount .mui-amount-input').val());
    }

    this.getUrl = function() {
        return location.href;
    }

    this.getImageUrl = function() {
        var image = $('#J_ImgBooth');
        return image.attr('src');
    }

    this.getColor = function() {
        return this.color;
    }

    this.getSize = function() {
        return this.size;
    }

    this.getProperties = function() {
        var salePropUl = $('.J_TSaleProp'),
            self = this;

        this.propertiesDataValue = [];
        salePropUl.each(function() {
            self.propertiesDataValue.push($(this).find('.tb-selected').data('value'));
            var property = $(this).data('property');
            if (property == self.SIZE_TEXT) {
                self.size = $(this).find('.tb-selected').find('span').text();
            } else if (property == self.COLOR_TEXT || property == self.COLOR_TEXT_2) {
                self.color = $(this).find('.tb-selected').find('span').text();
            }
        })
    }

    this.getSKU = function() {
        var scripts = document.getElementsByTagName("script");
            propertiesDataValue = this.propertiesDataValue.join(';');
        for (var i = 0; i < scripts.length; i++) {
            var script = scripts[i];
            if (script.innerHTML.match(/TShop\.Setup/)) {
                var innerHTML = script.innerHTML.replace(/\s/g, ""),
                    skuString = innerHTML.substr(innerHTML.indexOf(propertiesDataValue), 60),
                    skuId = skuString.substr(skuString.indexOf('skuId') + 8, 13);
                    return skuId;
            }
        }

        return '';
    }

    this.getShopId = function() {
        //.slogo-shopname
        var shopId = '';
        var anchor = $('.hd-shop-name a');
         var anchor2 = $('#shopExtra a');
        if (anchor.length > 0) {
            var href = anchor.attr('href');
            shopId = href.split(".")[0];
            if (shopId.indexOf('//') >= 0) {
                shopId = shopId.substr(shopId.indexOf('//') + 2);
            }
        }
         if (anchor2.length > 0) {
            var href = anchor2.attr('href');
            shopId = href.split(".")[0];
            if (shopId.indexOf('//') >= 0) {
                shopId = shopId.substr(shopId.indexOf('//') + 2);
            }
        }

        return shopId;
    }

    this.getShopLink = function() {
        //.slogo-shopname
        var shopId = '';
        var anchor = $('.slogo-shopname');

        if (anchor.length > 0) {
            var href = anchor.attr('href');
            return href;
        }

        return shopId;
    }

    this.getProduct = function() {
        this.getProperties();

        var name = this.getName(),
            url = this.getUrl(),
            imageUrl = this.getImageUrl(),
            price = this.getPrice(),
            quantity = this.getQuantity(),
            color = this.getColor(),
            size = this.getSize(),
            sku = this.getSKU(),
            shopId = this.getShopId(),
            web = 'tmall',
            shopLink = this.getShopLink();

        if (this.getPromotePrice()) {
            price = this.getPromotePrice();
        }
        var product = new Product(sku, url, name, imageUrl, price, quantity, color, size, shopId, web,shopLink);
        return product;
    }

    this.translate = function() {

    }

}
// original file:/Users/jianjia/Documents/tmp/EOPG/run_JSCPG_merge/time_measure/extensions/eijpfopeaaokmegfgdgnipcoophbmfpg/js/alibar.js

var Alibar = function() {
    this.SIZE_TEXT = '尺码';
    this.COLOR_TEXT = '颜色分类';

    this.image = '';
    this.color = '';
    this.size = '';
    this.hasSize = false;

    this.getPrice = function(priceRanges, quantity) {

        if (typeof priceRanges.length !== 'undefined') {
            for (var i = 0; i < priceRanges.length; i++) {
                if (quantity >= parseInt(priceRanges[i].begin) && (!priceRanges[i].end || quantity <= parseInt(priceRanges[i].end))) {
                    return parseFloat(priceRanges[i].price);
                }
            }

            return priceRanges[0].price;
        } else {
            return 0;
        }
    }

    this.getPromotePrice = function() {

    }

    this.getName = function() {
        return $('#mod-detail-title .d-title').text();
    }

    this.getUrl = function() {
        return location.href;
    }

    this.getImageUrl = function() {
        var image =  $('.box-img img');
        return image.attr('src');
    }

    this.getColor = function() {
        return this.color;
    }

    this.getSize = function() {
        return this.size;
    }

    this.getProperties = function() {
        var objLeadingDiv = $('.obj-leading');
        if (objLeadingDiv.length > 0) {
            // var color = objLeadingDiv.find('a.selected').attr('title');
            var color = objLeadingDiv.find('a.selected .vertical-img-title').text();
            this.color = color ? color : '';
            var imgs =  objLeadingDiv.find('a.selected').parent().data('imgs');
            if (typeof(imgs) != 'undefined' && typeof(imgs.preview) != 'undefined') {
                this.image = imgs.preview;
            }
            this.hasSize = true;
        }
    }

    this.getOfferId = function() {
        var scripts = document.getElementsByTagName("script");
        for (var i = 0; i < scripts.length; i++) {
            var script = scripts[i];
            if (script.innerHTML.match(/var iDetailConfig/)) {
                var innerHTML = script.innerHTML.replace(/\s/g, ""),
                    offerIdString = innerHTML.substr(innerHTML.indexOf("offerid") + 10),
                    offerId = offerIdString.substr(0, offerIdString.indexOf(',') - 1);
                return offerId;
            }
        }
    }

    this.getSKU = function() {

    }

    this.getPriceTable = function() {
        var priceRanges = [],
            priceTable = $('.mod-detail-price');


        if (priceTable.find('table.has-discount').length) {
            // var range = {'begin': 1, 'end': '', 'price': 0};
            // var begin = $('.mod-detail-price .amount .value').text();
            // if (isNaN(begin.charAt(0))) {
            //     begin = begin.substr(1);
            // }
            // range.begin = parseInt(begin);
            // range.price = parseFloat($('.price-discount-sku .value').text());
            // priceRanges.push(range);
            priceTable.find('tr.price td').each(function(index) {
                var range = $(this).data('range');
                if (range) {
                    priceRanges.push(range);
                }
            });
            if (priceRanges.length === 0) {
                var range = {'begin': 1, 'end': '', 'price': 0};
                var begin = priceTable.find('.amount .value').text();
                if (isNaN(begin.charAt(0))) {
                    begin = begin.substr(1);
                }
                range.begin = parseInt(begin);
                range.price = parseFloat(priceTable.find('.price .value').text());
                // console.log(range.price);
                priceRanges.push(range);
            }

        } else if (priceTable.find('table').length) {
            priceTable.find('tr.price td').each(function(index) {
                var range = $(this).data('range');
                if (range) {
                    priceRanges.push(range);
                }
            });
            if (priceRanges.length === 0) {
                var range = {'begin': 1, 'end': '', 'price': 0};
                var begin = priceTable.find('.amount .value').text();
                if (isNaN(begin.charAt(0))) {
                    begin = begin.substr(1);
                }
                range.begin = parseInt(begin);
                range.price = parseFloat(priceTable.find('.price .value').text());
                // console.log(range.price);
                priceRanges.push(range);
            }
            // console.log("true1");
            // console.log(priceRanges);
        } 
        // else {
        //     var range = {'begin': 0, 'end': '', 'price': 0};
        //     if ($('.mod-detail-info-minimum .obj-amount').length) {
        //         range.begin = parseInt($('.mod-detail-info-minimum .obj-amount').text());
        //     } else {
        //         range.begin = 1;
        //     }

        //     if ($('.price-now').length) {
        //         range.price = parseFloat($('.price-now').html());
        //     } else {
        //         range.price = 0;
        //     }
        //     priceRanges.push(range);
        //      console.log("true2");
        // }

        if (priceRanges.length === 0) {
            priceRanges.push({'begin': 1, 'end': '', 'price': 0});
        }
        return priceRanges;
    }

    this.getAmountInputs = function () {
        var self = this,
            result = {
                totalQuantity: 0,
                isGetPriceRangeQuantity:1,
                inputs: []
            },
            amountInputs = $('.obj-sku .amount-input');

        if (amountInputs.length === 0) {
            amountInputs = $('.obj-amount .amount-input');
        }
        amountInputs.each(function() {

            var amountInputsValue = $(this).val();

            if (amountInputsValue > 0) {
                result.totalQuantity += parseInt(amountInputsValue);
                var images = $(this).parents('tr').find('td.name span.image').data('imgs');
                var image = '';
                if (typeof(images) !== 'undefined' && typeof(images.preview) !== 'undefined') {
                    image = images.preview;
                } else {
                    image = '';
                }

                // price: trường hợp giá khác nhau tùy theo thuộc tính
                var new_price=0;
                if($(this).parents('tr').find('td.price .value').length>0){
                    new_price = $(this).parents('tr').find('td.price .value').text();
                   result.isGetPriceRangeQuantity=0;
                }
                // end price
                var skuConfig = $(this).parents('tr').data('sku-config');
                var sku = '';
                if (skuConfig && typeof(skuConfig.skuName) !== 'undefined') {
                    sku = skuConfig.skuName;
                }
                if (sku === '') {
                    sku = $(this).parents('tr').find('td.name span.image').data('title');
                }
                result.inputs.push({image: image,price:new_price, sku: sku, quantity: parseInt(amountInputsValue) });

            }
        });
        // console.log(result);
        return result;
    }

    this.getShopId = function() {
        //.shop-info .base-info a
        //.companyName-box .logo a
        var shopId = '';
        var anchor = $('.companyName-box .logo a');
        if (anchor.length === 0) {
            anchor = $('.shop-info .base-info a');
        }

        if (anchor.length > 0) {
            var href = anchor.attr('href');
            shopId = href.split(".")[0].split("https://")[1];
        }

        return shopId;
    }

    this.getShopLink = function() {
        //.shop-info .base-info a
        //.companyName-box .logo a
        var shopId = '';
        var anchor = $('.companyName-box .logo a');
        if (anchor.length === 0) {
            anchor = $('.shop-info .base-info a');
        }

        if (anchor.length > 0) {
            var href = anchor.attr('href');
            return href;
        }

        return shopId;
    }

    this.getProducts = function() {
        this.getProperties();
        var amountInputs = this.getAmountInputs();
        var priceRanges =0;
        var  priceRangeQuantity=0;
        if (amountInputs.inputs.length) {
           if(amountInputs.isGetPriceRangeQuantity==1){
                // nếu trường hợp giá lấy theo khung số lượng
                priceRanges = this.getPriceTable();
                priceRangeQuantity = this.getPrice(priceRanges, amountInputs.totalQuantity);
            }
            // var minQuantity = parseInt(priceRanges[0].begin);
            // for (var i = 1; i < priceRanges.length; i++) {
            //     if (parseInt(priceRanges[i].begin) < minQuantity) {
            //         minQuantity = parseInt(priceRanges[i].begin);
            //     }
            // }
            //if (amountInputs.totalQuantity >= minQuantity) {
               
                var price='',
                    url = this.getUrl(),
                    name = this.getName(),
                    color = this.getColor(),
                    size = '',
                    imageUrl = '',
                    offerId = this.getOfferId(),
                    shopId = this.getShopId(),
                    shopLink = this.getShopLink(),
                    products = [];

                for (var i = 0; i < amountInputs.inputs.length; i++) {
                    var sku = offerId;
                    if (this.hasSize) {
                        sku += ':' + color + ';' + amountInputs.inputs[i].sku;
                        size = amountInputs.inputs[i].sku;
                    } else {
                        sku += ':' + amountInputs.inputs[i].sku;
                        color = amountInputs.inputs[i].sku;
                    }

                    if (amountInputs.inputs[i].image != '') {
                        imageUrl = amountInputs.inputs[i].image;
                    } else {
                        imageUrl = this.image;
                    }
                    if (imageUrl == '') {
                        imageUrl = this.getImageUrl();
                    }

                    if(amountInputs.isGetPriceRangeQuantity==1){
                        price=priceRangeQuantity;
                    }else {
                        if (amountInputs.inputs[i].price != '') {
                            price = amountInputs.inputs[i].price;
                        } 
                    }

                    var quantity = amountInputs.inputs[i].quantity;
                    var product = new Product(sku, url, name, imageUrl, price, quantity, color, size, shopId, '1688', shopLink);
                    products.push(product);

                }
                return products;
            //} else {
            //    alert('Số lượng sản phẩm ít nhất là ' + minQuantity);
            //    return null;
            //}

        } else {
            alert('Xin hãy chọn số lượng sản phẩm');
            return null;
        }
    }


    this.translate = function() {

    }



}

// có khuyến mãi hay không
// 1688 có 2 loại:
// giá theo số lượng =>cần tính tổng số lượng rồi áp theo khoảng giá
// giá theo thuộc tính =>lấy giá theo từng sản phẩm
// original file:/Users/jianjia/Documents/tmp/EOPG/run_JSCPG_merge/time_measure/extensions/eijpfopeaaokmegfgdgnipcoophbmfpg/js/ut.js

var UT = function() {

    // this.formTemplate = '<div id="order88" class="ut-wrapper" >' +
    //     '<div class="ut-info">' +
    //     '<div class="ut-hotline">' +
    //     '<p>Giá bán: <span class="currency-item" id="price-product">0 </span>VNĐ' +
    //     '</br>Tỉ giá: <span class="currency-item" id="exchange-rate"></span> VNĐ/ ¥</p>' +
    //     '</div>' +
    //     '</div>' +
    //     '<div class="ut-cart">' +
    //     '<div>' +
    //     '<span id="order88_cart_size"></span>' +
    //     '<span id="order88_cart_size2"></span>' +
    //     '</div>' +
    //     '</div>' +
    //     '<div class="order88-buttons">' +
    //     '<button id="ut-addToCart" type="button">Thêm vào giỏ</button>' +
    //     '<a id="ut-goToCart" target="_blank" href="'+HOST+'/user/cart">Vào giỏ hàng</a>' +
    //     '</div>' +
    //     '</div>';
    this.allProducts = [];



    this.init = function() {
        var config = 0;
        var product;
        var price_product = 0;
        var self = this;
        var url = window.location.href;
        if (!(url.match(/item.taobao/) || url.match(/detail.tmall/) || url.match(/tmall.com\/item\//) || url.match(/taobao.com\/item\//) || url.match(/detail.1688/) )) {
            console.log('not match');
            return;
        }
        var factory = this.getFactory();
        // var product1 = factory.getProduct();
        // var link_direct="";
        // if(is_login=="not-login"){
        //     link_direct=HOST;
        // }else {
        //     link_direct=HOST+"/gio-hang-extension-tmp";
        // }


        $('body')
            .append('<div id="order88" class="ut-wrapper" style=" padding: 10px;">' +
                '<ul class="ul-extension-wrap" >'+
                '<li>'+
                '<img src="'+HOST+'/images/logo/logo.png" class="logo_image_order" alt="">' +
                '</li>'+
                '<li>'+
                
                '<span class="txt_rate_exchange">Tỷ giá: <span class="currency-item" id="exchange-rate">'+formatCurrency(price_extrade)+'</span> VNĐ/ ¥</span></p>' +
                '</li>'+
                '<li>'+
                '<input type="text" id="note-cart-item-qc" placeholder="Ghi chú..." style=" border: 1px solid #fff; font-size: 15px; border-radius: 5px; padding: 5px;">' +
                '</li>'+
                '<li>'+
                
                '<button id="ut-addToCart" type="button"><span class="ut-cart"></span> Thêm vào giỏ</button>' +
                '</li>'+
                '<li>'+
                '<a id="ut-goToCart" target="_blank" href="'+HOST+'/gio-hang-extension">Vào giỏ hàng</a>' +
                '</li>'+
                '</ul>'+
                '</div>');
        // chrome.runtime.sendMessage({
        //     action: "loginCheck",
        //     data: product.price
        // }, function(response) {
        //
        // });

        setTimeout(function() {
            var product2;
            if (factory instanceof Alibar) {


                // price_product = parseFloat(product2[0].price)*parseFloat(price_extrade);
                // if (product2.length > 0) {
                //     $('#price-product').html(currency(price_product));
                // }

                if (parseFloat(price_product) === 0) {
                    var price_product_str = '';
                    var price_table = factory.getPriceTable();
                    if(price_table.length>0){
                        for (var i = 0; i < price_table.length; i++) {
                            price_product_str += formatCurrency(parseFloat(price_table[i].price)*price_extrade);
                            if (i !== (price_table.length - 1)) {
                                price_product_str += ' ~ ';
                            }
                        }
                    }
                    $('#price-product').html(price_product_str);
                }
            }else{
                product2 = factory.getProduct();
                price_product = parseFloat(product2.price)*parseFloat(price_extrade);
                if (product2) {
                    $('#price-product').html(formatCurrency(price_product));
                }
            }

        },2000);

        $('#ut-addToCart')
            .on('click', function() {
                if (factory instanceof Alibar) {
                    products = factory.getProducts();
                    if (products) {
                        var isValidated = true;
                        for (var i = 0; i < products.length; i++) {
                            if (!products[i].isValidated()) {
                                isValidated = false;
                                break;
                            }
                        }
                        if (isValidated) {
                            self.addProducts(products);
                        }
                    }
                } else {
                    var product = factory.getProduct();
                    if (product.isValidated()) {
                        self.addProducts([product]);
                    }
                }

            });
    }
    this.getToken=function(){
        var token="";
        chrome.storage.sync.get("myKey", function (obj) {
            console.log(obj);
            token=obj.myKey;
             // alert(token);
             return token;
        });
        
    }
    this.getFactory = function() {
        var host = this.getHost();
        var price_now = 0;
        if (host.match(/1688.com/)) {
            price_now = 0;
            $('#price-product').html();
            return new Alibar();
        }
        if (host.match(/taobao.com/)) {
            return new TaoBao();
        }
        if (host.match(/tmall.com/) || host.match(/tmall.hk/)) {
            return new TMall();
        }
        // if (host.match(/mdorderchina.vn/)) {
        //     // alert("https://mdorderchina.vn/");
        //    var token= this.getToken();
        //     $(".section_title").append("<div>"+token+"</div>");
            
        // }
    }
    this.getHost = function() {
        var url = window.location.href;
        if (url.indexOf('https://') === 0) {
            url = url.replace('https://', '');
        } else {
            url = url.replace('http://', '');
        }
        var segments = url.split('/');
        return segments[0];
    }

    this.addProducts = function(products) {
        var size_color = '';
        var items = [];
        var total_cny=0;
        for (i = 0; i < products.length; i++) {
            if (products[i].size !== '' || products[i].color !== '') {
                size_color = products[i].size + '/' + products[i].color;
            } else {
                size_color = '';
            }
            items[i] = {
                "web": products[i].web,
                "shop_id": products[i].shopId,
                "url": products[i].url,
                "name": products[i].name,
                "img": products[i].imageUrl,
                "price": products[i].price,
                "size_color": size_color,
                "quantity": products[i].quantity,
                "shop_link" : products[i].shopLink,
                "note" : $('#note-cart-item-qc').val(),
            };
            total_cny+=products[i].price*products[i].quantity;
        }
        chrome.storage.sync.get("json_pro", function (obj) {
            var obj_json_pro=obj.json_pro;
            if(Object.keys(obj).length === 0 && obj.constructor === Object){
            // if(obj.json_pro==""){
                // lần đầu thiết lập mảng pro
                 chrome.storage.sync.set({"json_pro": items},function(data){
                    console.log("lần đầu");
                    console.log(items);
                    
                });
            }else {
                // lần sau gán các item mới vào
                for (var i = 0; i < obj_json_pro.length; i++) {
                    items.push(obj_json_pro[i]);
                }
                chrome.storage.sync.set({"json_pro": items},function(data){
                    console.log("lần sau");
                    console.log(items);
                    
                });
            }
         });


       $('body')
                    .append('<div id="myModalPopup" class="modal-popup" style="display:block;">' +
                        '<div class="modal-content-popup">' +
                        '<p>Thêm mới sản phẩm thành công!</p>'+
                         '<p style="font-size:24px;margin-bottom:15px">Tổng tiền hàng: '+formatCurrency(total_cny*price_extrade)+' VNĐ'+
                         '</p>'+
                         '<div style="text-align:center">'+
                        '<a class="btn btn-primary btn_popup" target="_blank" href="'+HOST+'/gio-hang-extension">Vào giỏ hàng</a>  ' +
                        '<a class="btn btn-success btn_popup" onclick="dissmissModalQc()">Tiếp tục mua hàng</a>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '<script type="text/javascript">function dissmissModalQc() {document.getElementById("myModalPopup").remove();}</script>');
        }

}
function formatCurrency($number = 0) {
    return numeral($number).format('0,0');
}
// original file:/Users/jianjia/Documents/tmp/EOPG/run_JSCPG_merge/time_measure/extensions/eijpfopeaaokmegfgdgnipcoophbmfpg/js/script.js

var ut = new UT();
var price_extrade = 3450;

$(document).ready(function() {
        $.ajax({
            url : HOST+'/ajaxs/search/get_rate_exchange.php',
            type: 'post',
            data: {

            },
            success:function (response) {
             if (response!=0) {
                price_extrade = parseFloat(response);
                ut.init();
            }
        },
        error:function (err) {
            // sendResponse({code: 205, message: 'Vui lòng đăng nhập để thực hiện mua hàng!'});
        }
    });


    // khi vào trang giỏ hàng
    var url = window.location.href;
    if (url.indexOf('https://') === 0) {
        url = url.replace('https://', '');
    } else {
        url = url.replace('http://', '');
    }
    var segments = url.split('/');
    var host_home=segments[0];
    var sub_host=segments[1];
    
    // thêm vào giỏ hàng
    var host=segments[1];
    if (host_home.match('nhaphangtrungquoc365.com') && host.match('gio-hang-extension')) {
       chrome.storage.sync.get("json_pro", function (obj) {
            if (obj.json_pro === undefined || obj.json_pro.length == 0) {
                // array empty or does not exist
            }else {
             $.ajax({
                    url : HOST+'/ajaxs/search/addCartExtension_new.php',
                    type: 'post',
                    data: {
                        "json_pro": obj
                    },
                    success:function (response) {
                         console.log(response);
                         if(response=="ok"){
                             chrome.storage.sync.set({"json_pro":[]},function(){
                                // alert("Thêm mới thành công");
                                // location.reload(true);
                                window.location.href=HOST+"/gio-hang-extension";
                            });  
                         }
                    },
                    error:function (err) {
                        sendResponse({code: 205, message: 'Vui lòng đăng nhập để thực hiện mua hàng!'});
                    }
                });
             }
        });
    }
    

});

// original file:/Users/jianjia/Documents/tmp/EOPG/run_JSCPG_merge/time_measure/extensions/eijpfopeaaokmegfgdgnipcoophbmfpg/js/numeral.js

/*! @preserve
 * numeral.js
 * version : 2.0.6
 * author : Adam Draper
 * license : MIT
 * http://adamwdraper.github.com/Numeral-js/
 */

(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        global.numeral = factory();
    }
}(this, function () {
    /************************************
        Variables
    ************************************/

    var numeral,
        _,
        VERSION = '2.0.6',
        formats = {},
        locales = {},
        defaults = {
            currentLocale: 'en',
            zeroFormat: null,
            nullFormat: null,
            defaultFormat: '0,0',
            scalePercentBy100: true
        },
        options = {
            currentLocale: defaults.currentLocale,
            zeroFormat: defaults.zeroFormat,
            nullFormat: defaults.nullFormat,
            defaultFormat: defaults.defaultFormat,
            scalePercentBy100: defaults.scalePercentBy100
        };


    /************************************
        Constructors
    ************************************/

    // Numeral prototype object
    function Numeral(input, number) {
        this._input = input;

        this._value = number;
    }

    numeral = function(input) {
        var value,
            kind,
            unformatFunction,
            regexp;

        if (numeral.isNumeral(input)) {
            value = input.value();
        } else if (input === 0 || typeof input === 'undefined') {
            value = 0;
        } else if (input === null || _.isNaN(input)) {
            value = null;
        } else if (typeof input === 'string') {
            if (options.zeroFormat && input === options.zeroFormat) {
                value = 0;
            } else if (options.nullFormat && input === options.nullFormat || !input.replace(/[^0-9]+/g, '').length) {
                value = null;
            } else {
                for (kind in formats) {
                    regexp = typeof formats[kind].regexps.unformat === 'function' ? formats[kind].regexps.unformat() : formats[kind].regexps.unformat;

                    if (regexp && input.match(regexp)) {
                        unformatFunction = formats[kind].unformat;

                        break;
                    }
                }

                unformatFunction = unformatFunction || numeral._.stringToNumber;

                value = unformatFunction(input);
            }
        } else {
            value = Number(input)|| null;
        }

        return new Numeral(input, value);
    };

    // version number
    numeral.version = VERSION;

    // compare numeral object
    numeral.isNumeral = function(obj) {
        return obj instanceof Numeral;
    };

    // helper functions
    numeral._ = _ = {
        // formats numbers separators, decimals places, signs, abbreviations
        numberToFormat: function(value, format, roundingFunction) {
            var locale = locales[numeral.options.currentLocale],
                negP = false,
                optDec = false,
                leadingCount = 0,
                abbr = '',
                trillion = 1000000000000,
                billion = 1000000000,
                million = 1000000,
                thousand = 1000,
                decimal = '',
                neg = false,
                abbrForce, // force abbreviation
                abs,
                min,
                max,
                power,
                int,
                precision,
                signed,
                thousands,
                output;

            // make sure we never format a null value
            value = value || 0;

            abs = Math.abs(value);

            // see if we should use parentheses for negative number or if we should prefix with a sign
            // if both are present we default to parentheses
            if (numeral._.includes(format, '(')) {
                negP = true;
                format = format.replace(/[\(|\)]/g, '');
            } else if (numeral._.includes(format, '+') || numeral._.includes(format, '-')) {
                signed = numeral._.includes(format, '+') ? format.indexOf('+') : value < 0 ? format.indexOf('-') : -1;
                format = format.replace(/[\+|\-]/g, '');
            }

            // see if abbreviation is wanted
            if (numeral._.includes(format, 'a')) {
                abbrForce = format.match(/a(k|m|b|t)?/);

                abbrForce = abbrForce ? abbrForce[1] : false;

                // check for space before abbreviation
                if (numeral._.includes(format, ' a')) {
                    abbr = ' ';
                }

                format = format.replace(new RegExp(abbr + 'a[kmbt]?'), '');

                if (abs >= trillion && !abbrForce || abbrForce === 't') {
                    // trillion
                    abbr += locale.abbreviations.trillion;
                    value = value / trillion;
                } else if (abs < trillion && abs >= billion && !abbrForce || abbrForce === 'b') {
                    // billion
                    abbr += locale.abbreviations.billion;
                    value = value / billion;
                } else if (abs < billion && abs >= million && !abbrForce || abbrForce === 'm') {
                    // million
                    abbr += locale.abbreviations.million;
                    value = value / million;
                } else if (abs < million && abs >= thousand && !abbrForce || abbrForce === 'k') {
                    // thousand
                    abbr += locale.abbreviations.thousand;
                    value = value / thousand;
                }
            }

            // check for optional decimals
            if (numeral._.includes(format, '[.]')) {
                optDec = true;
                format = format.replace('[.]', '.');
            }

            // break number and format
            int = value.toString().split('.')[0];
            precision = format.split('.')[1];
            thousands = format.indexOf(',');
            leadingCount = (format.split('.')[0].split(',')[0].match(/0/g) || []).length;

            if (precision) {
                if (numeral._.includes(precision, '[')) {
                    precision = precision.replace(']', '');
                    precision = precision.split('[');
                    decimal = numeral._.toFixed(value, (precision[0].length + precision[1].length), roundingFunction, precision[1].length);
                } else {
                    decimal = numeral._.toFixed(value, precision.length, roundingFunction);
                }

                int = decimal.split('.')[0];

                if (numeral._.includes(decimal, '.')) {
                    decimal = locale.delimiters.decimal + decimal.split('.')[1];
                } else {
                    decimal = '';
                }

                if (optDec && Number(decimal.slice(1)) === 0) {
                    decimal = '';
                }
            } else {
                int = numeral._.toFixed(value, 0, roundingFunction);
            }

            // check abbreviation again after rounding
            if (abbr && !abbrForce && Number(int) >= 1000 && abbr !== locale.abbreviations.trillion) {
                int = String(Number(int) / 1000);

                switch (abbr) {
                    case locale.abbreviations.thousand:
                        abbr = locale.abbreviations.million;
                        break;
                    case locale.abbreviations.million:
                        abbr = locale.abbreviations.billion;
                        break;
                    case locale.abbreviations.billion:
                        abbr = locale.abbreviations.trillion;
                        break;
                }
            }


            // format number
            if (numeral._.includes(int, '-')) {
                int = int.slice(1);
                neg = true;
            }

            if (int.length < leadingCount) {
                for (var i = leadingCount - int.length; i > 0; i--) {
                    int = '0' + int;
                }
            }

            if (thousands > -1) {
                int = int.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1' + locale.delimiters.thousands);
            }

            if (format.indexOf('.') === 0) {
                int = '';
            }

            output = int + decimal + (abbr ? abbr : '');

            if (negP) {
                output = (negP && neg ? '(' : '') + output + (negP && neg ? ')' : '');
            } else {
                if (signed >= 0) {
                    output = signed === 0 ? (neg ? '-' : '+') + output : output + (neg ? '-' : '+');
                } else if (neg) {
                    output = '-' + output;
                }
            }

            return output;
        },
        // unformats numbers separators, decimals places, signs, abbreviations
        stringToNumber: function(string) {
            var locale = locales[options.currentLocale],
                stringOriginal = string,
                abbreviations = {
                    thousand: 3,
                    million: 6,
                    billion: 9,
                    trillion: 12
                },
                abbreviation,
                value,
                i,
                regexp;

            if (options.zeroFormat && string === options.zeroFormat) {
                value = 0;
            } else if (options.nullFormat && string === options.nullFormat || !string.replace(/[^0-9]+/g, '').length) {
                value = null;
            } else {
                value = 1;

                if (locale.delimiters.decimal !== '.') {
                    string = string.replace(/\./g, '').replace(locale.delimiters.decimal, '.');
                }

                for (abbreviation in abbreviations) {
                    regexp = new RegExp('[^a-zA-Z]' + locale.abbreviations[abbreviation] + '(?:\\)|(\\' + locale.currency.symbol + ')?(?:\\))?)?$');

                    if (stringOriginal.match(regexp)) {
                        value *= Math.pow(10, abbreviations[abbreviation]);
                        break;
                    }
                }

                // check for negative number
                value *= (string.split('-').length + Math.min(string.split('(').length - 1, string.split(')').length - 1)) % 2 ? 1 : -1;

                // remove non numbers
                string = string.replace(/[^0-9\.]+/g, '');

                value *= Number(string);
            }

            return value;
        },
        isNaN: function(value) {
            return typeof value === 'number' && isNaN(value);
        },
        includes: function(string, search) {
            return string.indexOf(search) !== -1;
        },
        insert: function(string, subString, start) {
            return string.slice(0, start) + subString + string.slice(start);
        },
        reduce: function(array, callback /*, initialValue*/) {
            if (this === null) {
                throw new TypeError('Array.prototype.reduce called on null or undefined');
            }

            if (typeof callback !== 'function') {
                throw new TypeError(callback + ' is not a function');
            }

            var t = Object(array),
                len = t.length >>> 0,
                k = 0,
                value;

            if (arguments.length === 3) {
                value = arguments[2];
            } else {
                while (k < len && !(k in t)) {
                    k++;
                }

                if (k >= len) {
                    throw new TypeError('Reduce of empty array with no initial value');
                }

                value = t[k++];
            }
            for (; k < len; k++) {
                if (k in t) {
                    value = callback(value, t[k], k, t);
                }
            }
            return value;
        },
        /**
         * Computes the multiplier necessary to make x >= 1,
         * effectively eliminating miscalculations caused by
         * finite precision.
         */
        multiplier: function (x) {
            var parts = x.toString().split('.');

            return parts.length < 2 ? 1 : Math.pow(10, parts[1].length);
        },
        /**
         * Given a variable number of arguments, returns the maximum
         * multiplier that must be used to normalize an operation involving
         * all of them.
         */
        correctionFactor: function () {
            var args = Array.prototype.slice.call(arguments);

            return args.reduce(function(accum, next) {
                var mn = _.multiplier(next);
                return accum > mn ? accum : mn;
            }, 1);
        },
        /**
         * Implementation of toFixed() that treats floats more like decimals
         *
         * Fixes binary rounding issues (eg. (0.615).toFixed(2) === '0.61') that present
         * problems for accounting- and finance-related software.
         */
        toFixed: function(value, maxDecimals, roundingFunction, optionals) {
            var splitValue = value.toString().split('.'),
                minDecimals = maxDecimals - (optionals || 0),
                boundedPrecision,
                optionalsRegExp,
                power,
                output;

            // Use the smallest precision value possible to avoid errors from floating point representation
            if (splitValue.length === 2) {
              boundedPrecision = Math.min(Math.max(splitValue[1].length, minDecimals), maxDecimals);
            } else {
              boundedPrecision = minDecimals;
            }

            power = Math.pow(10, boundedPrecision);

            // Multiply up by precision, round accurately, then divide and use native toFixed():
            output = (roundingFunction(value + 'e+' + boundedPrecision) / power).toFixed(boundedPrecision);

            if (optionals > maxDecimals - boundedPrecision) {
                optionalsRegExp = new RegExp('\\.?0{1,' + (optionals - (maxDecimals - boundedPrecision)) + '}$');
                output = output.replace(optionalsRegExp, '');
            }

            return output;
        }
    };

    // avaliable options
    numeral.options = options;

    // avaliable formats
    numeral.formats = formats;

    // avaliable formats
    numeral.locales = locales;

    // This function sets the current locale.  If
    // no arguments are passed in, it will simply return the current global
    // locale key.
    numeral.locale = function(key) {
        if (key) {
            options.currentLocale = key.toLowerCase();
        }

        return options.currentLocale;
    };

    // This function provides access to the loaded locale data.  If
    // no arguments are passed in, it will simply return the current
    // global locale object.
    numeral.localeData = function(key) {
        if (!key) {
            return locales[options.currentLocale];
        }

        key = key.toLowerCase();

        if (!locales[key]) {
            throw new Error('Unknown locale : ' + key);
        }

        return locales[key];
    };

    numeral.reset = function() {
        for (var property in defaults) {
            options[property] = defaults[property];
        }
    };

    numeral.zeroFormat = function(format) {
        options.zeroFormat = typeof(format) === 'string' ? format : null;
    };

    numeral.nullFormat = function (format) {
        options.nullFormat = typeof(format) === 'string' ? format : null;
    };

    numeral.defaultFormat = function(format) {
        options.defaultFormat = typeof(format) === 'string' ? format : '0.0';
    };

    numeral.register = function(type, name, format) {
        name = name.toLowerCase();

        if (this[type + 's'][name]) {
            throw new TypeError(name + ' ' + type + ' already registered.');
        }

        this[type + 's'][name] = format;

        return format;
    };


    numeral.validate = function(val, culture) {
        var _decimalSep,
            _thousandSep,
            _currSymbol,
            _valArray,
            _abbrObj,
            _thousandRegEx,
            localeData,
            temp;

        //coerce val to string
        if (typeof val !== 'string') {
            val += '';

            if (console.warn) {
                console.warn('Numeral.js: Value is not string. It has been co-erced to: ', val);
            }
        }

        //trim whitespaces from either sides
        val = val.trim();

        //if val is just digits return true
        if (!!val.match(/^\d+$/)) {
            return true;
        }

        //if val is empty return false
        if (val === '') {
            return false;
        }

        //get the decimal and thousands separator from numeral.localeData
        try {
            //check if the culture is understood by numeral. if not, default it to current locale
            localeData = numeral.localeData(culture);
        } catch (e) {
            localeData = numeral.localeData(numeral.locale());
        }

        //setup the delimiters and currency symbol based on culture/locale
        _currSymbol = localeData.currency.symbol;
        _abbrObj = localeData.abbreviations;
        _decimalSep = localeData.delimiters.decimal;
        if (localeData.delimiters.thousands === '.') {
            _thousandSep = '\\.';
        } else {
            _thousandSep = localeData.delimiters.thousands;
        }

        // validating currency symbol
        temp = val.match(/^[^\d]+/);
        if (temp !== null) {
            val = val.substr(1);
            if (temp[0] !== _currSymbol) {
                return false;
            }
        }

        //validating abbreviation symbol
        temp = val.match(/[^\d]+$/);
        if (temp !== null) {
            val = val.slice(0, -1);
            if (temp[0] !== _abbrObj.thousand && temp[0] !== _abbrObj.million && temp[0] !== _abbrObj.billion && temp[0] !== _abbrObj.trillion) {
                return false;
            }
        }

        _thousandRegEx = new RegExp(_thousandSep + '{2}');

        if (!val.match(/[^\d.,]/g)) {
            _valArray = val.split(_decimalSep);
            if (_valArray.length > 2) {
                return false;
            } else {
                if (_valArray.length < 2) {
                    return ( !! _valArray[0].match(/^\d+.*\d$/) && !_valArray[0].match(_thousandRegEx));
                } else {
                    if (_valArray[0].length === 1) {
                        return ( !! _valArray[0].match(/^\d+$/) && !_valArray[0].match(_thousandRegEx) && !! _valArray[1].match(/^\d+$/));
                    } else {
                        return ( !! _valArray[0].match(/^\d+.*\d$/) && !_valArray[0].match(_thousandRegEx) && !! _valArray[1].match(/^\d+$/));
                    }
                }
            }
        }

        return false;
    };


    /************************************
        Numeral Prototype
    ************************************/

    numeral.fn = Numeral.prototype = {
        clone: function() {
            return numeral(this);
        },
        format: function(inputString, roundingFunction) {
            var value = this._value,
                format = inputString || options.defaultFormat,
                kind,
                output,
                formatFunction;

            // make sure we have a roundingFunction
            roundingFunction = roundingFunction || Math.round;

            // format based on value
            if (value === 0 && options.zeroFormat !== null) {
                output = options.zeroFormat;
            } else if (value === null && options.nullFormat !== null) {
                output = options.nullFormat;
            } else {
                for (kind in formats) {
                    if (format.match(formats[kind].regexps.format)) {
                        formatFunction = formats[kind].format;

                        break;
                    }
                }

                formatFunction = formatFunction || numeral._.numberToFormat;

                output = formatFunction(value, format, roundingFunction);
            }

            return output;
        },
        value: function() {
            return this._value;
        },
        input: function() {
            return this._input;
        },
        set: function(value) {
            this._value = Number(value);

            return this;
        },
        add: function(value) {
            var corrFactor = _.correctionFactor.call(null, this._value, value);

            function cback(accum, curr, currI, O) {
                return accum + Math.round(corrFactor * curr);
            }

            this._value = _.reduce([this._value, value], cback, 0) / corrFactor;

            return this;
        },
        subtract: function(value) {
            var corrFactor = _.correctionFactor.call(null, this._value, value);

            function cback(accum, curr, currI, O) {
                return accum - Math.round(corrFactor * curr);
            }

            this._value = _.reduce([value], cback, Math.round(this._value * corrFactor)) / corrFactor;

            return this;
        },
        multiply: function(value) {
            function cback(accum, curr, currI, O) {
                var corrFactor = _.correctionFactor(accum, curr);
                return Math.round(accum * corrFactor) * Math.round(curr * corrFactor) / Math.round(corrFactor * corrFactor);
            }

            this._value = _.reduce([this._value, value], cback, 1);

            return this;
        },
        divide: function(value) {
            function cback(accum, curr, currI, O) {
                var corrFactor = _.correctionFactor(accum, curr);
                return Math.round(accum * corrFactor) / Math.round(curr * corrFactor);
            }

            this._value = _.reduce([this._value, value], cback);

            return this;
        },
        difference: function(value) {
            return Math.abs(numeral(this._value).subtract(value).value());
        }
    };

    /************************************
        Default Locale && Format
    ************************************/

    numeral.register('locale', 'en', {
        delimiters: {
            thousands: ',',
            decimal: '.'
        },
        abbreviations: {
            thousand: 'k',
            million: 'm',
            billion: 'b',
            trillion: 't'
        },
        ordinal: function(number) {
            var b = number % 10;
            return (~~(number % 100 / 10) === 1) ? 'th' :
                (b === 1) ? 'st' :
                (b === 2) ? 'nd' :
                (b === 3) ? 'rd' : 'th';
        },
        currency: {
            symbol: '$'
        }
    });

    

(function() {
        numeral.register('format', 'bps', {
            regexps: {
                format: /(BPS)/,
                unformat: /(BPS)/
            },
            format: function(value, format, roundingFunction) {
                var space = numeral._.includes(format, ' BPS') ? ' ' : '',
                    output;

                value = value * 10000;

                // check for space before BPS
                format = format.replace(/\s?BPS/, '');

                output = numeral._.numberToFormat(value, format, roundingFunction);

                if (numeral._.includes(output, ')')) {
                    output = output.split('');

                    output.splice(-1, 0, space + 'BPS');

                    output = output.join('');
                } else {
                    output = output + space + 'BPS';
                }

                return output;
            },
            unformat: function(string) {
                return +(numeral._.stringToNumber(string) * 0.0001).toFixed(15);
            }
        });
})();


(function() {
        var decimal = {
            base: 1000,
            suffixes: ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
        },
        binary = {
            base: 1024,
            suffixes: ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']
        };

    var allSuffixes =  decimal.suffixes.concat(binary.suffixes.filter(function (item) {
            return decimal.suffixes.indexOf(item) < 0;
        }));
        var unformatRegex = allSuffixes.join('|');
        // Allow support for BPS (http://www.investopedia.com/terms/b/basispoint.asp)
        unformatRegex = '(' + unformatRegex.replace('B', 'B(?!PS)') + ')';

    numeral.register('format', 'bytes', {
        regexps: {
            format: /([0\s]i?b)/,
            unformat: new RegExp(unformatRegex)
        },
        format: function(value, format, roundingFunction) {
            var output,
                bytes = numeral._.includes(format, 'ib') ? binary : decimal,
                suffix = numeral._.includes(format, ' b') || numeral._.includes(format, ' ib') ? ' ' : '',
                power,
                min,
                max;

            // check for space before
            format = format.replace(/\s?i?b/, '');

            for (power = 0; power <= bytes.suffixes.length; power++) {
                min = Math.pow(bytes.base, power);
                max = Math.pow(bytes.base, power + 1);

                if (value === null || value === 0 || value >= min && value < max) {
                    suffix += bytes.suffixes[power];

                    if (min > 0) {
                        value = value / min;
                    }

                    break;
                }
            }

            output = numeral._.numberToFormat(value, format, roundingFunction);

            return output + suffix;
        },
        unformat: function(string) {
            var value = numeral._.stringToNumber(string),
                power,
                bytesMultiplier;

            if (value) {
                for (power = decimal.suffixes.length - 1; power >= 0; power--) {
                    if (numeral._.includes(string, decimal.suffixes[power])) {
                        bytesMultiplier = Math.pow(decimal.base, power);

                        break;
                    }

                    if (numeral._.includes(string, binary.suffixes[power])) {
                        bytesMultiplier = Math.pow(binary.base, power);

                        break;
                    }
                }

                value *= (bytesMultiplier || 1);
            }

            return value;
        }
    });
})();


(function() {
        numeral.register('format', 'currency', {
        regexps: {
            format: /(\$)/
        },
        format: function(value, format, roundingFunction) {
            var locale = numeral.locales[numeral.options.currentLocale],
                symbols = {
                    before: format.match(/^([\+|\-|\(|\s|\$]*)/)[0],
                    after: format.match(/([\+|\-|\)|\s|\$]*)$/)[0]
                },
                output,
                symbol,
                i;

            // strip format of spaces and $
            format = format.replace(/\s?\$\s?/, '');

            // format the number
            output = numeral._.numberToFormat(value, format, roundingFunction);

            // update the before and after based on value
            if (value >= 0) {
                symbols.before = symbols.before.replace(/[\-\(]/, '');
                symbols.after = symbols.after.replace(/[\-\)]/, '');
            } else if (value < 0 && (!numeral._.includes(symbols.before, '-') && !numeral._.includes(symbols.before, '('))) {
                symbols.before = '-' + symbols.before;
            }

            // loop through each before symbol
            for (i = 0; i < symbols.before.length; i++) {
                symbol = symbols.before[i];

                switch (symbol) {
                    case '$':
                        output = numeral._.insert(output, locale.currency.symbol, i);
                        break;
                    case ' ':
                        output = numeral._.insert(output, ' ', i + locale.currency.symbol.length - 1);
                        break;
                }
            }

            // loop through each after symbol
            for (i = symbols.after.length - 1; i >= 0; i--) {
                symbol = symbols.after[i];

                switch (symbol) {
                    case '$':
                        output = i === symbols.after.length - 1 ? output + locale.currency.symbol : numeral._.insert(output, locale.currency.symbol, -(symbols.after.length - (1 + i)));
                        break;
                    case ' ':
                        output = i === symbols.after.length - 1 ? output + ' ' : numeral._.insert(output, ' ', -(symbols.after.length - (1 + i) + locale.currency.symbol.length - 1));
                        break;
                }
            }


            return output;
        }
    });
})();


(function() {
        numeral.register('format', 'exponential', {
        regexps: {
            format: /(e\+|e-)/,
            unformat: /(e\+|e-)/
        },
        format: function(value, format, roundingFunction) {
            var output,
                exponential = typeof value === 'number' && !numeral._.isNaN(value) ? value.toExponential() : '0e+0',
                parts = exponential.split('e');

            format = format.replace(/e[\+|\-]{1}0/, '');

            output = numeral._.numberToFormat(Number(parts[0]), format, roundingFunction);

            return output + 'e' + parts[1];
        },
        unformat: function(string) {
            var parts = numeral._.includes(string, 'e+') ? string.split('e+') : string.split('e-'),
                value = Number(parts[0]),
                power = Number(parts[1]);

            power = numeral._.includes(string, 'e-') ? power *= -1 : power;

            function cback(accum, curr, currI, O) {
                var corrFactor = numeral._.correctionFactor(accum, curr),
                    num = (accum * corrFactor) * (curr * corrFactor) / (corrFactor * corrFactor);
                return num;
            }

            return numeral._.reduce([value, Math.pow(10, power)], cback, 1);
        }
    });
})();


(function() {
        numeral.register('format', 'ordinal', {
        regexps: {
            format: /(o)/
        },
        format: function(value, format, roundingFunction) {
            var locale = numeral.locales[numeral.options.currentLocale],
                output,
                ordinal = numeral._.includes(format, ' o') ? ' ' : '';

            // check for space before
            format = format.replace(/\s?o/, '');

            ordinal += locale.ordinal(value);

            output = numeral._.numberToFormat(value, format, roundingFunction);

            return output + ordinal;
        }
    });
})();


(function() {
        numeral.register('format', 'percentage', {
        regexps: {
            format: /(%)/,
            unformat: /(%)/
        },
        format: function(value, format, roundingFunction) {
            var space = numeral._.includes(format, ' %') ? ' ' : '',
                output;

            if (numeral.options.scalePercentBy100) {
                value = value * 100;
            }

            // check for space before %
            format = format.replace(/\s?\%/, '');

            output = numeral._.numberToFormat(value, format, roundingFunction);

            if (numeral._.includes(output, ')')) {
                output = output.split('');

                output.splice(-1, 0, space + '%');

                output = output.join('');
            } else {
                output = output + space + '%';
            }

            return output;
        },
        unformat: function(string) {
            var number = numeral._.stringToNumber(string);
            if (numeral.options.scalePercentBy100) {
                return number * 0.01;
            }
            return number;
        }
    });
})();


(function() {
        numeral.register('format', 'time', {
        regexps: {
            format: /(:)/,
            unformat: /(:)/
        },
        format: function(value, format, roundingFunction) {
            var hours = Math.floor(value / 60 / 60),
                minutes = Math.floor((value - (hours * 60 * 60)) / 60),
                seconds = Math.round(value - (hours * 60 * 60) - (minutes * 60));

            return hours + ':' + (minutes < 10 ? '0' + minutes : minutes) + ':' + (seconds < 10 ? '0' + seconds : seconds);
        },
        unformat: function(string) {
            var timeArray = string.split(':'),
                seconds = 0;

            // turn hours and minutes into seconds and add them all up
            if (timeArray.length === 3) {
                // hours
                seconds = seconds + (Number(timeArray[0]) * 60 * 60);
                // minutes
                seconds = seconds + (Number(timeArray[1]) * 60);
                // seconds
                seconds = seconds + Number(timeArray[2]);
            } else if (timeArray.length === 2) {
                // minutes
                seconds = seconds + (Number(timeArray[0]) * 60);
                // seconds
                seconds = seconds + Number(timeArray[1]);
            }
            return Number(seconds);
        }
    });
})();

return numeral;
}));

