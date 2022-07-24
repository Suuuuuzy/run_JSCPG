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





// original file:/Users/jianjia/Documents/tmp/EOPG/run_JSCPG_merge/crx_lists/jianjia_timeout/extensions/kbminfpmaobgfjopamkdhflmjfiecpcn/js/config.js

var site_using_https = false;
var site_name = "customer.ordertaobao.net/api/Fast";

// append css to page
var NewStyles = document.createElement("link");
    NewStyles.rel = "stylesheet";
    NewStyles.type = "text/css";
    NewStyles.href = chrome.extension.getURL('css/main.css');
document.head.appendChild(NewStyles);

var service_host = "https://" + site_name + "/";
var add_to_cart_url = service_host+'cart/adds';
var cart_url = service_host+'checkout.html';
var link_detail_cart = "https://customer.ordertaobao.net/Cart";
var add_to_favorite_url = service_host + "i/favoriteLink/saveLink";
var button_add_to_cart_url = service_host + "assets/images/add_on/icon-bkv1-small.png";

var translate_url = 'https://' + site_name + '/i/goodies_util/translate';
var isUsingSetting = false;
var translate_keyword_url = "";
var version_tool = "1.3";
var exchange_rate;
var link_store_review_guidelines = "#";
var exchange_rate_url = 'https://' + site_name + '/api/exchange';
var catalog_scalar_url = null;

// original file:/Users/jianjia/Documents/tmp/EOPG/run_JSCPG_merge/crx_lists/jianjia_timeout/extensions/kbminfpmaobgfjopamkdhflmjfiecpcn/js/script.js

var translate_value_bg;

/* START xử lý template */
var elem = document.createElement("div");
elem.className = '_addon-template';
document.body.insertBefore(elem, document.body.childNodes[0]);
document.querySelectorAll("._addon-template")[0].style.display = 'none';
var arrdata_send = [];
function load_template() {
    var con = document.querySelectorAll("._addon-template")[0];
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function (e) {
        if (xhr.readyState == 4 && xhr.status == 200) {
            con.innerHTML = xhr.responseText;

            chrome.runtime.sendMessage({
                action: "getExchangeRate",
                url: exchange_rate_url,
                callback: 'afterGetExchangeRate'
            });

            document.querySelectorAll("._addon-version")[0].textContent = "v" + version_tool;
            if (link_detail_cart) {
                document.querySelectorAll("._link-detail-cart")[0].setAttribute("href", link_detail_cart);
            }
        }
    };
    xhr.open("GET", chrome.extension.getURL("../template/index.html"), true);
    xhr.setRequestHeader('Content-type', 'text/html');
    xhr.send();
}
load_template();
/* END xử lý template */

var CommonTool = function () {
    this.reRenderPricePreview = function () {
        var self = this;
        var homeLand = this.getHomeLand();
        if (homeLand == 'TAOBAO' || homeLand == 'TMALL') {
            var object = new factory(cart_url, add_to_cart_url);

            setInterval(function () {
                try {
                    var priceOrigin = object.getOriginPrice();
                    var pricePromotion = object.getPromotionPrice();

                    if ($.isArray(priceOrigin)) {
                        priceOrigin = priceOrigin[0];
                    }

                    if ($.isArray(pricePromotion)) {
                        pricePromotion = pricePromotion[0];
                    }

                    if (isNaN(priceOrigin)) {
                        priceOrigin = 0;
                    }

                    if (isNaN(pricePromotion)) {
                        pricePromotion = 0;
                    }

                    var price = [priceOrigin, pricePromotion].min();
                    self.processPrice(price, homeLand);

                } catch (e) {

                }

            }, 1000);
        }
    };

    /**
     * add disabled to button add cart AddToCart
     */
    this.addDisabledButtonCart = function () {
        $('._addToCart').attr("disabled", "disabled");
    };

    /**
     * remove disabled to button add cart AddToCart
     */
    this.removeDisabledButtonCart = function () {
        $('._addToCart').removeAttr("disabled");
    };

    this.loadOptionCategory = function () {
        if (catalog_scalar_url) {
            //if(site_using_https){
            //    Action.request({
            //        url: catalog_scalar_url
            //    }).done(function (response) {
            //        Action.afterGetCategory({ response : response });
            //    });
            //}else{
            //    chrome.runtime.sendMessage({ action: "getCategory", url: catalog_scalar_url, callback: 'afterGetCategory' });
            //}

            //Link lấy danh mục mặc định là lấy qua background
            //chrome.runtime.sendMessage({ action: "getCategory", url: catalog_scalar_url, callback: 'afterGetCategory' });
        }
    };

    /**
     * get origin site
     * @returns {*}
     */
    this.getOriginSite = function () {
        return window.location.hostname;
    };

    this.getHomeLand = function () {
        var url = window.location.href;
        if (url.match(/taobao.com/)) {
            return "TAOBAO";
        }
        if (url.match(/tmall.com|tmall.hk|yao.95095.com/)) {
            return "TMALL";
        }
        if (url.match(/1688.com|alibaba/)) {
            return "1688";
        }
        return null;
    };

    this.currency_format = function (num, rounding) {
        if (!$.isNumeric(num)) {
            return num;
        }
        if (rounding === null || typeof rounding === 'undefined' || rounding == false) {
            var roundingConfig = 10;
            num = Math.ceil(num / roundingConfig) * roundingConfig;
        }
        num = num.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");

        return (num);
    };

    this.getExchangeRate = function () {
        return exchange_rate;
    };

    this.trackError = function (link, error, TrackUrl) {
        var param = "link=" + link + "&error=" + error + "&tool=bookmarklet";

        $.ajax({
            url: TrackUrl,
            type: "POST",
            data: param,
            success: function (data) {

            }
        });
    };

    this.hasClass = function (element, $class) {
        return (element.className).indexOf($class) > -1;
    };

    this.resizeImage = function (image) {
        return image.replace(/[0-9]{2,3}[x][0-9]{2,3}/g, '150x150');
    };

    this.getParamsUrl = function (name, link) {
        var l = '';
        if (link) {
            l = link;
        } else {
            l = window.location.href;
        }
        if (l == '') return null;

        var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(l);
        if (results === null) return null;

        return results[1] || 0;
    };

    this.processPrice = function (price, site) {

        if (document.getElementsByClassName('previewPrice').length) {
            for (var k = 0; k < document.getElementsByClassName('previewPrice').length; k++) {
                document.getElementsByClassName('previewPrice')[k].remove();
            }
        }

        if (price == null || parseFloat(price) == 0)
            return 0;
        var p = 0;
        if (price.constructor === Array) {
            p = String(price[0]).replace(',', '.').match(/[0-9]*[\.]?[0-9]+/g);
        } else {
            p = String(price).replace(',', '.').match(/[0-9]*[\.]?[0-9]+/g);
        }

        if (isNaN(p) || parseFloat(price) == 0) {
            return 0;
        }

        var price_show = "";
        var pri = 0;
        if (price.constructor === Array && price.length > 1) {
            var pri_start = this.currency_format(parseFloat(price[0]) * this.getExchangeRate());
            var key_end = price.length - 1;
            var pri_end = this.currency_format(parseFloat(price[key_end]) * this.getExchangeRate());

            if (parseFloat(price[key_end]) > 0) {
                price_show = pri_start + " ~ " + pri_end;
            } else {
                price_show = pri_start;
            }

        } else {
            pri = parseFloat(price);
            price_show = this.currency_format(pri * this.getExchangeRate());
        }
        var li = document.createElement('li');
        var li_price = null;
        var J_PromoPrice = null;
        var J_StrPriceModBox = null;

        if (site == 'TMALL' || site == 'TAOBAO') {
            J_PromoPrice = document.getElementById('J_StrPrice');

            if (J_PromoPrice == null || J_PromoPrice.length == 0) {
                J_PromoPrice = document.getElementById('J_priceStd');
            }

            if (J_PromoPrice == null || J_PromoPrice.length == 0) {
                J_PromoPrice = document.getElementById('J_StrPriceModBox');
            }

            if (J_PromoPrice == null || J_PromoPrice.length == 0) {
                J_PromoPrice = document.getElementById('J_PromoPrice');
            }

            if (site == "TAOBAO") {

                li.setAttribute("style", 'color: blue ! important; padding: 30px 0px; font-family: arial;');
                li.setAttribute('class', 'previewPrice');
                li_price = '<span class="tb-property-type" style="color: blue; font-weight: bold; font-size: 25px;">Giá</span>     ' +
                    '<strong id="price_vnd" class="" style="font-size: 25px;">' +
                    '<em class=""> ' + price_show + ' </em><em class=""> VNĐ</em></strong>';
                li.innerHTML = li_price;
            } else {
                li.setAttribute("style", 'font-weight: bold; padding: 10px 0px;');
                li.setAttribute("class", 'previewPrice tm-promo-price tm-promo-cur');

                li_price = '<strong id="price_vnd" class="" style="font-size: 30px;">' +
                    '<span class="">Giá</span>' +
                    '<em class="" style="font-size: 30px; margin-left: 10px;"> ' + price_show + '  VNĐ </em></strong>';
                li.innerHTML = li_price;
            }

            if (J_PromoPrice != null || J_PromoPrice.length != 0) {
                J_PromoPrice.parentNode.insertBefore(li, J_PromoPrice.nextSibling);
            }

        }

        return parseFloat(p);
    };

    this.timeOut = 0;

    this.sendAjaxToCart = function (add_cart_url, data) {

        chrome.runtime.sendMessage({ action: "addToCart", url: add_cart_url, data: data, method: 'POST', callback: 'afterAddToCart' });

        // setTimeout(function(){
        //
        //     console.info(data);
        //
        //     //if(site_using_https){
        //     //    Action.request({
        //     //        url: add_cart_url,
        //     //        type: "POST",
        //     //        data: data
        //     //    }).done(function (response) {
        //     //        Action.afterAddToCart({ response : response });
        //     //    });
        //     //}else{
        //     //    chrome.runtime.sendMessage({ action: "addToCart", url: add_cart_url, data: data, method: 'POST', callback: 'afterAddToCart' });
        //     //}
        //
        //     //Luon gui qua background
        //     chrome.runtime.sendMessage({ action: "addToCart", url: add_cart_url, data: data, method: 'GET', callback: 'afterAddToCart' });
        //
        // }, this.timeOut * 1000);
        // this.timeOut++;

    };
    this.loadJsFile = function (jsUrl) {
        var file_ali = document.createElement('script');
        file_ali.setAttribute('src', jsUrl + '?t=' + Math.random());
        document.body.appendChild(file_ali);
        return true;
    };
    this.key_translate_lib = function (key) {
        var translate = [];
        translate['颜色'] = 'Màu';
        translate['尺码'] = 'Kích cỡ';
        translate['尺寸'] = 'Kích cỡ';

        translate['价格'] = 'Giá';
        translate['促销'] = 'Khuyến mại';
        translate['配送'] = 'Vận Chuyển';
        translate['数量'] = 'Số Lượng';
        translate['销量'] = 'Chính sách';
        translate['评价'] = 'Đánh Giá';
        translate['颜色分类'] = 'Màu sắc';
        translate['促销价'] = 'Giá';

        translate['套餐类型'] = 'Loại';
        translate['单价（元）'] = 'Giá (NDT)';
        translate['库存量'] = 'Tồn kho';
        translate['采购量'] = 'SL mua';

        translate['材质保障'] = "Chất lượng";
        translate['15天包换'] = "15 đổi trả";
        translate['48小时发货'] = "48 giờ giao hàng";

        var detect = key;
        if (translate[key]) {
            detect = translate[key];
        }
        return detect;
    };
    this.stripTags = function (object) {
        if (typeof object == 'object') {
            return object.replaceWith(object.html().replace(/<\/?[^>]+>/gi, ''));
        }
        return false;
    };

    this.setCategorySelected = function (category_id) {
        this.setCookie("category_selected", category_id, 100);
        return true;
    };

    this.getCategorySelected = function () {
        return this.getCookie("category_selected");
    };

    this.translate_guarantee_type = function () {
        var process = false;

        if (isUsingSetting) {//Nếu sử dụng setting thì lấy giá trị ở setting

            if (isTranslate) {
                process = true;
            }

        } else {//Nếu ko sử dụng setting thì lấy giá trị ở cookie

            if (translate_value_bg == 1) {
                process = true;
            }

        }

        try {
            if (process) {
                var list = document.querySelectorAll("ul.guarantee-type > li");
                for (var i = 0; i < list.length; i++) {
                    if (i < 3) {
                        var text = list[i].getElementsByTagName("div")[0].getElementsByTagName("a")[0].textContent.trim();
                        if (text) {
                            var text_translate = this.key_translate_lib(text);
                            if (text_translate) {
                                list[i].getElementsByTagName("div")[0].getElementsByTagName("a")[0].textContent = text_translate;
                            }
                        }

                    }
                }
            }
        } catch (e) {
            //console.info("Có lỗi xảy ra khi dịch guarantee_type");
            //console.warn(e.message);
        }

    };

    this.translate_title = function (title, type, object) {
        if (isUsingSetting) {//Nếu sử dụng setting thì lấy giá trị ở setting

            if (isTranslate) {

                //if(site_using_https){
                //    Action.request({
                //        url: translate_url,
                //        type: 'POST',
                //        data: { text:title, type:type }
                //    }).done(function (response) {
                //        Action.afterTranslate({ response : response });
                //    });
                //}else{
                //    chrome.runtime.sendMessage({ action: "translate", url: translate_url, method: 'POST', data: { text:title, type:type }, callback: 'afterTranslate'
                //
                //    });
                //}

                //Luôn gửi qua background
                chrome.runtime.sendMessage({
                    action: "translate", url: translate_url, method: 'POST', data: { text: title, type: type }, callback: 'afterTranslate'

                });

                return true;
            }

        } else {
            if (translate_value_bg == 1) {

                //if(site_using_https){
                //    Action.request({
                //        url: translate_url,
                //        type: 'POST',
                //        data: { text:title, type:type }
                //    }).done(function (response) {
                //        Action.afterTranslate({ response : response });
                //    });
                //}else{
                //    chrome.runtime.sendMessage({ action: "translate", url: translate_url, method: 'POST', data: { text:title, type:type }, callback: 'afterTranslate'
                //
                //    });
                //}

                //Luôn gửi qua background
                chrome.runtime.sendMessage({
                    action: "translate", url: translate_url, method: 'POST', data: { text: title, type: type }, callback: 'afterTranslate'

                });

                return true;
            }

        }

        return false;
    };

    this.translate = function (dom, type) {
        if (isUsingSetting) {//Nếu sử dụng setting thì lấy giá trị ở setting

            if (isTranslate && type == "properties") {
                this.translateStorage(dom);
            }

        } else {//Nếu ko sử dụng setting thì lấy giá trị ở cookie

            if (translate_value_bg == 1) {
                if (type == "properties") {
                    this.translateStorage(dom);
                }
            }

        }

    };

    this.translateStorage = function (dom) {
        //write by vanhs | edit_time: 13/06/2015
        try {
            var content;
            try {//for jquery
                content = dom.text();
            } catch (m) {//for javascript
                content = dom.textContent;
            }

            var content_origin = content;
            var resource = keyword;
            if (resource != null) {
                var data = resource.resource;

                for (var i = 0; i < data.length; i++) {
                    var obj = data[i];
                    try {
                        if (content.match(obj.k_c, 'g')) {
                            content = content.replace(obj.k_c, obj.k_v + ' ');
                        }
                    } catch (ex) {
                        try {
                            if (content.match(obj.keyword_china, 'g')) {
                                content = content.replace(obj.keyword_china, obj.keyword_vi + ' ');
                            }
                        } catch (ex) {

                        }

                    }
                }
                try {//for jquery
                    dom.text(content);
                    dom.attr('data-text', content_origin);
                } catch (k) {
                    dom.innerHTML = content;
                    dom.setAttribute("data-text", content_origin);
                }

            }
        } catch (e) {
            console.log("error: " + e.message);
        }
    };

    this.ajaxTranslate = function (dom, type) {
        var context = dom.text();

        $.ajax({
            url: translate_url,
            type: "POST",
            contentType: 'application/x-www-form-urlencoded',
            xhrFields: {
                withCredentials: true
            },
            data: {
                text: context,
                type: type
            },
            success: function (data) {
                var result = $.parseJSON(data);
                if (result['data_translate'] && result['data_translate'] != null) {
                    dom.attr("data-text", dom.text());
                    dom.text(result['data_translate']);
                }
            }
        });
    };

    this.getKeywordSearch = function () {
        $.ajax({
            url: translate_keyword_url,
            type: "POST",
            contentType: 'application/x-www-form-urlencoded',
            xhrFields: {
                withCredentials: true
            },
            data: {
                text: "text",
                type: "type"
            },

            success: function (data) {
                var resource = JSON.stringify(data);
                localStorage.setItem("keyword_search", resource);
            }
        });
        return true;
    };

    /* Hien thi input khi xảy ra lỗi lấy dữ liệu*/
    this.showInputEx = function (site) {
        $('.frm-tool').hide();
        $('li#li_sd_price').fadeIn();
        var box_input_exception = $('#_box_input_exception');
        box_input_exception.show();
        box_input_exception.attr("data-is-show", 1);

        var price_dom = $('#_price');

        var object = new factory(cart_url, add_to_cart_url);
        var price_origin = object.getPriceInput();
        var properties_origin = object.getPropertiesInput();
        var quantity = object.getQuantityInput();
        if (quantity == "" && properties_origin == "" && price_origin == "") {
            alert("Chúng tôi không thể lấy được thông tin của sản phẩm." +
                "Bạn vui lòng điền thông tin để chúng tôi mua hàng cho bạn");
            price_dom.focus();
            $("._close_tool").click();

            try {
                if (site != 'alibaba') {
                    if (parseFloat(object.getPromotionPrice()) > 0) {
                        price_dom.val(object.getPromotionPrice());
                    } else {
                        price_dom.attr("placeholder", "Nhập tiền tệ - Trung Quốc");
                    }
                    $('#_properties').val(object.getPropertiesOrigin());
                    $('#_quantity').val(object.getQuantity());
                }
            } catch (ex) {
                console.log(ex);
            }
        }
        return true;
    };

    this.setCookie = function (cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toGMTString();
        document.cookie = cname + "=" + cvalue + "; " + expires;
        return true;
    };

    this.getCookie = function (cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1);
            if (c.indexOf(name) != -1) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    };
};

var factory = function (cart_url, add_cart_url) {
    var _class;

    var url = window.location.href;
    if (url.match(/taobao.com/)) {
        _class = new taobao(cart_url);
    }
    if (url.match(/tmall.com|tmall.hk|yao.95095.com/)) {
        _class = new tmall(cart_url);
    }
    if (url.match(/1688.com|alibaba/)) {
        _class = new alibaba(cart_url, add_cart_url);
    }
    return _class;
};

/**
 * Created by Admin on 9/19/14.
 */
var AddonTool = function () {
    /**
     * item_data: Array
     * keys: amount, color, size
     */
    this.common_tool = new CommonTool();

    /* Cho vao gio hang doi voi Tmall va taobao */
    this.AddToCart = function () {
        var error = 0;

        var object = new factory(cart_url, add_to_cart_url);
        var is_show = $('#_box_input_exception').attr("data-is-show");

        var price_origin = '',
            price_promotion = '',
            price_table = '',
            properties_translated = '',
            properties_origin = '',
            quantity = '',
            shop_id = '',
            seller_id = '',
            shop_name = '',
            shop_wangwang = '',
            title_origin = '',
            title_translate = '',
            comment = '',
            link_origin = '',
            item_id = '',
            image_origin = '';

        var select_category = $('._select_category');
        var loaded_category = select_category.attr('data-loaded');

        var category_id = select_category.val();

        var category_name = $('._select_category option:selected').text();

        var brand = $('._brand_item').val();

        while (category_name.match(/-/i)) {
            category_name = category_name.replace(/-/i, "");
        }

        if (category_id === "-1") {
            category_name = $('._input_category').val();
        }

        if ((category_id === "0" || category_name == "") && loaded_category === "1") {
            alert("Yêu cầu chọn danh mục cho sản phẩm");
            this.common_tool.removeDisabledButtonCart();
            return false;
        }

        var check_select = object.checkSelectFull();

        if (!check_select) {
            alert("Yêu cầu chọn đầy đủ thuộc tính của SP");
            this.common_tool.removeDisabledButtonCart();
            return false;
        }
        price_table = "";
        //price_table = object.getPriceTable();
        image_origin = object.getImgLink();

        shop_id = object.getShopId();

        shop_name = object.getShopName();

        seller_id = object.getSellerId();
        linkshop = object.getShopLink();
        // shop_wangwang =object.getShopLink(); //object.getWangwang();
        shop_wangwang = object.getWangwang();
        if (shop_wangwang == '') {
            shop_wangwang = shop_name;
        }

        title_origin = object.getTitleOrigin();
        title_translate = object.getTitleTranslate();

        comment = object.getCommentInput();

        link_origin = window.location.href;
        item_id = object.getItemID();

        var data_value = object.getDataValue();
        var outer_id = object.getOuterId(data_value);

        if ($.isArray(outer_id)) {
            outer_id = outer_id[0];
        }

        var site = this.common_tool.getHomeLand();

        var stock = object.getStock();

        if (!$.isNumeric(stock) || parseInt(stock) <= 0) {
            stock = 99;
        }

        try {
            price_origin = object.getOriginPrice();
            price_promotion = object.getPromotionPrice();

            if ($.isArray(price_origin)) {
                price_origin = price_origin[0];
            }

            if ($.isArray(price_promotion)) {
                price_promotion = price_promotion[0];
            }
            properties_translated = object.getProperties();
            properties_origin = object.getPropertiesOrigin();
            quantity = object.getQuantity();
        } catch (ex) {
            error = 1;
            price_origin = price_promotion = object.getPriceInput();
            properties_origin = properties_translated = object.getPropertiesInput();
            quantity = object.getQuantityInput();
        }

        if (!((parseFloat(price_origin) > 0 || parseFloat(price_promotion) > 0) && parseFloat(quantity) > 0)) {
            error = 1;
            price_origin = price_promotion = object.getPriceInput();
            properties_origin = properties_translated = object.getPropertiesInput();
            quantity = object.getQuantityInput();
        }

        /**
         * Trong trường hợp xảy ra lỗi đối với Gia, So luong,properties sẽ show form để khách hàng tự động nhập
         */


        if ((error && parseFloat(is_show) != 1) || !(parseFloat(is_show) == 1
            || parseInt(price_promotion) > 0 || parseInt(price_origin) > 0)) {
            this.common_tool.showInputEx();
            this.common_tool.removeDisabledButtonCart();
            return false;
        }

        if (!((parseFloat(price_origin) > 0 || parseFloat(price_promotion) > 0) && parseFloat(quantity) > 0) && parseFloat(is_show) == 1) {
            alert("Yêu cầu bổ sung thông tin.");
            $('#_price').focus();
            this.common_tool.removeDisabledButtonCart();
            return false;
        }

        if (!$.isNumeric(price_promotion) && parseFloat(is_show) == 1) {
            alert("Yêu cầu nhập giá của sản phẩm");
            $('#_price').focus();
            this.common_tool.removeDisabledButtonCart();
            return false;
        }

        var location_sale = object.getLocationSale();

        var data = {
            title_origin: $.trim(title_origin),
            title_translated: $.trim(title_translate),
            price_origin: price_origin,
            price_promotion: price_promotion,
            property_translated: properties_translated,
            property: properties_origin,
            data_value: data_value,
            image_model: image_origin,
            image_origin: image_origin,
            shop_id: shop_id,
            shop_name: shop_name,
            seller_id: seller_id,
            wangwang: shop_wangwang,
            quantity: quantity,
            stock: stock,
            location_sale: location_sale,
            price_table: price_table,
            site: site,
            comment: comment,
            item_id: item_id,
            link_origin: link_origin,
            outer_id: outer_id,
            error: error,
            weight: 0,
            step: 1,
            brand: brand,
            category_name: category_name,
            category_id: category_id,
            tool: "Addon",
            version: version_tool,
            linkshop: linkshop,///tuannn them ngay 7/6/2020 link cua shop
            is_translate: object.isTranslatePage() ? 1 : 0
        };
        arrdata_send.push(data);
        this.common_tool.sendAjaxToCart(add_to_cart_url, JSON.stringify(arrdata_send));
    };
};

var buttonAddCartQuickText = '';

var taobao = function (cart_url) {
    this.source = 'taobao';
    this.common_tool = new CommonTool();
    this.init = function () {
        buttonAddCartQuickText = this.getButtonAddCartQuickText();

        var detail = $('#detail');
        detail.css('border', '1px solid red');
        detail.css('font-size', '11px');
        $('.tb-rmb').remove();
        this.alert();
        this.warning();
        this.parse();
    };


    /**
     * SITE: TAOBAO
     */
    this.warning = function () {
        try {

            //Nếu đã tồn tại cảnh báo rồi thì thôi ko hiển thị nữa
            var len = document.querySelectorAll("._warning-on-page").length;
            if (len) return;

            var $anchor = document.querySelectorAll("#J_SKU");
            if ($anchor.length) {
                var elem = document.createElement("div");
                elem.className = 'block-warning-on-page-addon _warning-on-page';
                elem.textContent = 'Vui lòng chọn đầy đủ thuộc tính của sản phẩm (màu sắc, kích thước,..), tiếp đó click vào nút "Đặt hàng"';
                $anchor[0].insertBefore(elem, null);
            }

        } catch (e) {
            console.warn(e.message);
        }
    };

    //TAOBAO | Hàm hiển thị cảnh báo trên addon
    this.alert = function () {
        //console.info("alert");
        //Cảnh báo về độ tin cậy của shop
        var text = "";

        try {

            var creditLevel = -1;
            var scripts = document.querySelectorAll("script");
            for (var i = 0; i < scripts.length; i++) {
                var html = scripts[i].textContent.replace(/\s/g, '');
                var res = html.search("KISSY.merge");
                if (res != -1) {
                    var n = html.match(/creditLevel:"([\s\S]*?)"/i);
                    creditLevel = n[1].trim();
                    break;
                }
            }

            //Nếu ng bán có 2 kim cương trở xuống thì hiển thị cảnh báo uy tín thấp
            if (creditLevel >= 1 && creditLevel <= 7) {

                text += 'Người bán này có uy tín bán hàng thấp. Quý khách nên cân nhắc trước khi đặt hàng. Vui lòng tham khảo <a href="' + link_store_review_guidelines + '" target="_blank">đánh giá điểm uy tín tại đây.</a>';

            }

        } catch (e) {
            //console.warn(e.message);
        }

        if (text) {
            $("._addon-message").removeClass("hidden").find("span:eq(0)").html(text);
        }

    };

    /**
     * site: taobao
     * @returns {boolean}
     */
    this.parse = function () {

        var common = this.common_tool;
        $('.tb-property-type').each(function (index, value) {
            var text = $(this).text();
            $(this).text(common_tool.key_translate_lib(text));
        });

        this.common_tool.loadOptionCategory();

        var price = this.getPromotionPrice("TAOBAO");
        var price_html = '<p style="font-size: 16px;margin-top: 15px;">' +
            'Tỉ giá: ' + common.currency_format(common.getExchangeRate(), true) + ' VNĐ / 1 CNY</p>';
        var j_str_price = $('#J_StrPriceModBox');
        if (j_str_price == null || j_str_price == "" || (typeof j_str_price === 'object' && j_str_price.length == 0)) {
            j_str_price = $('.tm-promo-price');
        }

        if (j_str_price == null || j_str_price == "" || (typeof j_str_price === 'object' && j_str_price.length == 0)) {
            j_str_price = $('.tb-detail-hd');
        }
        if (j_str_price == null || j_str_price == "" || (typeof j_str_price === 'object' && j_str_price.length == 0)) {
            j_str_price = $('#J_PromoPrice');
        }
        if (j_str_price != null && j_str_price != "") {
            j_str_price.append(price_html);
        }

        var title_content = this.getTitleOrigin();

        //common.setIsTranslateToCookie();

        common.translate_title(title_content, 'title', this);

        this.translateProperties();

        this.common_tool.reRenderPricePreview();

        return false;
    };

    this.translateProperties = function () {
        var common = this.common_tool;
        var span_pro = $('.J_TSaleProp li span');
        if (span_pro == null || span_pro.length == 0) {
            span_pro = $('.J_SKU a span');
        }
        span_pro.each(function () {
            common.translate($(this), "properties");
        });
    };

    this.getLocationSale = function () {
        var location_sale = "";
        try {
            location_sale = document.querySelectorAll("#J-From")[0].textContent;
        } catch (e) {
            //console.info("TAOBAO | Không lấy được địa điểm đăng bán của sản phẩm");
            //console.warn(e.message);
        }
        return location_sale;
    };

    this.getPriceInput = function () {
        return $('#_price').val();
    };

    this.getPropertiesInput = function () {
        return $('#_properties').val();
    };

    this.getQuantityInput = function () {
        return $('#_quantity').val();
    };

    this.getCommentInput = function () {
        return $('._comment_item').val();
    };

    this.set_translate = function (data) {
        var _title = this.getDomTitle();

        if (_title != null && data.title != "") {
            _title.setAttribute("data-text", _title.textContent);
            _title.textContent = data.title;
        }
    };

    this.getPromotionPrice = function (site) {
        try {
            var span_price = null;
            var normal_price = document.getElementById('J_StrPrice');
            if (normal_price == null) {
                normal_price = document.getElementById("J_priceStd");
            }

            if (normal_price == null) {
                normal_price = document.getElementById('J_StrPriceModBox');
            }

            if (normal_price == null) {
                normal_price = document.getElementById('J_PromoPrice');
            }

            var promotion_price = document.getElementById('J_PromoPrice');

            var price = 0;
            if (promotion_price == null) {
                promotion_price = normal_price;
            }

            if (promotion_price != null) {
                try {

                    if (promotion_price.getElementsByClassName('tm-price').length > 0) {
                        span_price = promotion_price.getElementsByClassName('tm-price');
                        if (span_price != null && span_price != "" && span_price != "undefined") {
                            price = span_price[0].textContent.match(/[0-9]*[\.,]?[0-9]+/g);
                        }
                    } else if (promotion_price.getElementsByClassName('tb-rmb-num').length > 0) {
                        span_price = promotion_price.getElementsByClassName('tb-rmb-num');
                        if (span_price != null && span_price != "" && span_price != "undefined") {
                            price = span_price[0].textContent.match(/[0-9]*[\.,]?[0-9]+/g);
                        }
                    }

                    /*
                     * fix công cụ: Link sản phẩm không hiện giá VND
                     * http://world.taobao.com/item/523372039199.htm?spm=a312a.7700714.0.0.IJ566v#detail
                     *
                     * */
                    if (!price) {
                        promotion_price = normal_price;
                    }
                    if (promotion_price.getElementsByClassName('tm-price').length > 0) {
                        span_price = promotion_price.getElementsByClassName('tm-price');
                        if (span_price != null && span_price != "" && span_price != "undefined") {
                            price = span_price[0].textContent.match(/[0-9]*[\.,]?[0-9]+/g);
                        }
                    } else if (promotion_price.getElementsByClassName('tb-rmb-num').length > 0) {
                        span_price = promotion_price.getElementsByClassName('tb-rmb-num');
                        if (span_price != null && span_price != "" && span_price != "undefined") {
                            price = span_price[0].textContent.match(/[0-9]*[\.,]?[0-9]+/g);
                        }
                    }

                } catch (e) {
                    price = 0;
                }
            }

            return this.common_tool.processPrice(price, site);
        } catch (ex) {
            throw Error(ex.message + " Line:" + ex.lineNumber + " function getPromotionPrice");
        }
    };

    this.getStock = function () {
        try {
            var stock_id = document.getElementById('J_EmStock');
            var stock = 99;
            if (stock_id == null || stock_id == 'undefined') {
                stock_id = document.getElementById("J_SpanStock");
            }

            if (stock_id != null && stock_id != 'undefined') {
                stock = stock_id.textContent;
                stock = parseInt(stock.replace(/[^\d.]/g, ''));
            }
        } catch (ex) {
            stock = 99;
        }


        return stock;
    };

    this.getOriginPrice = function () {
        try {
            var str_price = $('#J_StrPrice');
            var origin_price = str_price.find('.tm-price');

            if (origin_price == null || origin_price.length == 0) {
                origin_price = str_price.find('.tb-rmb-num');
            }

            if (origin_price == null || origin_price.length == 0) {
                origin_price = $('#J_priceStd').find('.tb-rmb-num');
            }

            if (origin_price == null || origin_price.length == 0) {
                origin_price = $('#J_priceStd').find('.tm-price');
            }

            if (origin_price == null || origin_price.length == 0) {
                origin_price = $('#J_StrPriceModBox').find('.tm-price');
            }

            if (origin_price == null || origin_price.length == 0) {
                origin_price = $('#J_StrPriceModBox').find('.tb-rmb-num');
            }

            if (origin_price == null || origin_price.length == 0) {
                origin_price = $('#J_PromoPrice').find('.tm-price');
            }

            if (origin_price == null || origin_price.length == 0) {
                origin_price = $('#J_PromoPrice').find('.tb-rmb-num');
            }

            var price = origin_price.text();
            price = price.match(/[0-9]*[\.,]?[0-9]+/g);

            return this.common_tool.processPrice(price);
        } catch (ex) {
            throw Error(ex.message + " Can't get origin price function getOriginPrice");
        }
    };

    this.getOuterId = function (data_value) {
        try {
            var scripts = document.getElementsByTagName('script');
            var skuId = "";
            var skuMap = null;
            if (scripts.length > 0) {
                for (var script = 0; script < scripts.length; script++) {
                    if (scripts[script].innerHTML.match(/Hub\.config\.set/)) {
                        try {
                            detailJsStart();
                            skuId = Hub.config.get('sku').valItemInfo.skuMap[";" + data_value + ";"].skuId;
                        } catch (e) {
                            skuMap = scripts[script].innerHTML.replace(/\s/g, '').substr(scripts[script].innerHTML.replace(/\s/g, '').indexOf(data_value), 60);
                            skuId = skuMap.substr(skuMap.indexOf('skuId') + 8, 15).match(/[0-9]+/);
                        }
                    } else if (scripts[script].innerHTML.match(/TShop\.Setup/)) {
                        skuMap = scripts[script].innerHTML.replace(/\s/g, '').substr(scripts[script].innerHTML.replace(/\s/g, '').indexOf(data_value), 60);
                        skuId = skuMap.substr(skuMap.indexOf('skuId') + 8, 15).match(/[0-9]+/);
                    }
                }
            }

            return skuId;
        } catch (ex) {
            return "";
        }
    };

    this.getTitleTranslate = function () {
        try {
            var _title = this.getDomTitle();
            var title_translate = _title.textContent;
            if (title_translate == "") {
                title_translate = _title.getAttribute("data-text");
            }
            return title_translate;
        } catch (ex) {
            return "";
        }

    };

    this.getTitleOrigin = function () {

        try {
            var _title = this.getDomTitle();
            var title_origin = _title.getAttribute("data-text");
            if (title_origin == "" || typeof title_origin == "undefined" || title_origin == null) {
                title_origin = _title.textContent;
            }
            return title_origin;
        } catch (ex) {
            return "";
        }

    };

    this.getDomTitle = function () {
        try {
            var _title = null;
            if (document.getElementsByClassName("tb-main-title").length > 0) {
                _title = document.getElementsByClassName("tb-main-title")[0];
            }

            if (_title == null && document.getElementsByClassName("tb-detail-hd").length > 0) {
                var h = document.getElementsByClassName("tb-detail-hd")[0];
                if (h.getElementsByTagName('h3').length > 0 && h != null) {
                    _title = h.getElementsByTagName('h3')[0];
                } else {
                    _title = h.getElementsByTagName("h1")[0];
                }
            }

            if (_title.textContent == "" && document.getElementsByClassName("tb-tit").length > 0) {
                _title = document.getElementsByClassName("tb-tit")[0];
            }
            if (_title.textContent == "") {
                _title = document.querySelectorAll('h3.tb-item-title');
                if (_title != null) {
                    _title = _title[0];
                } else {
                    _title = document.getElementsByClassName('tb-item-title');
                    if (_title.length > 0) {
                        _title = _title[0];
                    }
                }
            }
            return _title;
        } catch (ex) {
            return null;
        }
    };

    this.getShopLink = function () {
        var shop_link = '';
        var selected_props = document.getElementsByClassName('tb-shop-name');
        if (selected_props.length > 0) {
            shop_link = selected_props[0].getElementsByTagName("a")[0].getAttribute('href');
        }
        return shop_link;
    }
    this.getShopName = function () {
        try {
            var shop_name = '';
            if (document.getElementsByClassName('tb-seller-name').length > 0) {
                shop_name = document.getElementsByClassName('tb-seller-name')[0].textContent;

                if (shop_name == '' || shop_name == null) {

                    var shop_card = document.getElementsByClassName('shop-card');
                    var data_nick = shop_card.length > 0 ? shop_card[0].getElementsByClassName('ww-light') : '';
                    shop_name = (data_nick.length > 0 ? data_nick[0].getAttribute('data-nick') : '');
                    if (shop_name == '') {
                        /* Find base info*/
                        if (document.getElementsByClassName('base-info').length > 0) {
                            for (var i = 0; i < document.getElementsByClassName('base-info').length; i++) {
                                if (document.getElementsByClassName('base-info')[i].getElementsByClassName('seller').length > 0) {
                                    if (document.getElementsByClassName('base-info')[i].getElementsByClassName('seller')[0].getElementsByClassName('J_WangWang').length > 0) {
                                        shop_name = document.getElementsByClassName('base-info')[i].getElementsByClassName('seller')[0].getElementsByClassName('J_WangWang')[0].getAttribute('data-nick');
                                        break;
                                    }
                                    if (document.getElementsByClassName('base-info')[i].getElementsByClassName('seller')[0].getElementsByClassName('ww-light').length > 0) {
                                        shop_name = document.getElementsByClassName('base-info')[i].getElementsByClassName('seller')[0].getElementsByClassName('ww-light')[0].getAttribute('data-nick');
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
            } else if ($('#J_tab_shopDetail').length > 0) {
                shop_name = $('#J_tab_shopDetail').find('span').first().data('nick');
            }
            shop_name = shop_name.trim();

            if (!shop_name) {
                shop_name = document.querySelectorAll(".tb-shop-name")[0].getElementsByTagName("h3")[0].getElementsByTagName("a")[0].getAttribute("title");
            }

            return shop_name;
        } catch (ex) {
            return "";
        }

    };

    /**
     * taobao
     * @returns {string}
     */
    this.getShopId = function () {
        var shop_id = '';
        var flag = document.querySelector('meta[name="microscope-data"]');
        if (flag) {
            try {
                var string = document.querySelector('meta[name="microscope-data"]').getAttribute("content");
                if (string) {
                    var array = string.split(';');
                    if (array.length > 0) {
                        for (var i = 0; i < array.length; i++) {
                            var str = array[i];
                            str = str.trim();
                            var params = str.split('=');
                            var key = params[0];
                            var value = params[1];
                            if (key == 'shopId') {
                                shop_id = value;
                                break;
                            }
                        }
                    }
                }
            } catch (ex) {
                //console.info("Không lấy được shop_id." + ex.message);
            }
        } else {
            try {
                var shop_tilte_text;
                if (document.querySelector('.shop-title-text')) {
                    shop_tilte_text = document.querySelector('.shop-title-text').getAttribute("href");
                } else {
                    shop_tilte_text = document.querySelectorAll(".tb-shop-name")[0].getElementsByTagName("h3")[0].getElementsByTagName("a")[0].getAttribute("href")
                }
                shop_tilte_text = shop_tilte_text.replace("//shop", "");
                var tmp = shop_tilte_text.split('.');
                shop_id = tmp[0];
            } catch (ex) {
                //console.info("Không lấy được shop_id." + ex.message);
            }
        }

        shop_id = 'taobao_' + shop_id;

        return shop_id;
    };

    this.getSellerId = function () {
        var sellerId = "";
        try {
            var dataApi = document.querySelectorAll("#J_listBuyerOnView")[0].getAttribute("data-api");
            var a = dataApi.split("?");
            var b = a[1];
            var c = b.split("&");
            if (c.length) {
                for (var i = 0; i < c.length; i++) {
                    if (c[i]) {
                        var tmp = c[i].split("=");
                        if (tmp[0].trim() == "seller_num_id") {
                            sellerId = tmp[1];
                            break;
                        }
                    }
                }
            }

        } catch (e) {
            //console.info("TAOBAO | không lấy được thông tin sellerId");
            //console.warn(e.message);
        }

        if (!sellerId) {
            try {
                sellerId = document.querySelectorAll("#J_Pine")[0].getAttribute("data-sellerid");
            } catch (e) {

            }
        }

        if (!sellerId) {
            try {
                var content = document.querySelectorAll("[name='microscope-data']")[0].getAttribute("content");
                var arr = content.split(";");
                for (var k = 0; k < arr.length; k++) {
                    if (arr[k]) {
                        var temp = arr[k].split("=");
                        if (temp[0].trim() == "userid") {
                            sellerId = temp[1].trim();
                            break;
                        }
                    }
                }
            } catch (e) {

            }
        }

        //console.info("sellerId: " + sellerId);

        return sellerId;
    };

    this.getProperties = function () {
        //console.log("TAOBAO | getProperties");
        //write by vanhs | edit_time: 13/06/2015
        var color_size = '';
        try {
            var selected_props = document.getElementsByClassName('J_TSaleProp');
            if (!selected_props.length) {
                selected_props = document.querySelectorAll("ul.tb-cleafix");
            }
            if (selected_props.length > 0) {
                for (var i = 0; i < selected_props.length; i++) {
                    var li_origin = selected_props[i].getElementsByClassName('tb-selected')[0];
                    if (li_origin) {
                        var c_s = li_origin.getElementsByTagName('span')[0].textContent;
                        if (c_s) { color_size += c_s.trim() + ';'; }
                    }
                }
            }
        } catch (e) {
            console.warn("TAOBAO | getProperties: " + e.message);
        }
        return color_size;
    };

    this.getPropertiesOrigin = function () {
        try {
            var selected_props = document.getElementsByClassName('J_TSaleProp');
            var color_size = '';

            if (!((typeof selected_props !== 'object' && selected_props != "" && selected_props != null)
                || (typeof selected_props === 'object' && selected_props.length > 0))) {
                selected_props = document.querySelectorAll("ul.tb-cleafix");
            }
            if (selected_props.length > 0) {
                for (var i = 0; i < selected_props.length; i++) {
                    var li_origin = selected_props[i].getElementsByClassName('tb-selected')[0];
                    if (li_origin != null) {
                        var c_s = li_origin.getElementsByTagName('span')[0].getAttribute("data-text");
                        if (c_s == "" || c_s == null || typeof c_s == "undefined") {
                            c_s = li_origin.getElementsByTagName('span')[0].textContent;
                        }
                        color_size += c_s + ';';
                    }
                }
            }
            return color_size;
        } catch (ex) {
            throw Error(ex.message + " Can't get origin price function getPropertiesOrigin");
        }

    };

    this.getDataValue = function () {
        try {

            var data_value = '';
            var tb_selected = document.getElementsByClassName('tb-selected');
            for (var i = 0; i < tb_selected.length; i++) {
                var v = '';
                if (tb_selected[i].className.indexOf('J_SKU') > -1) {
                    v = tb_selected[i].getAttribute('data-pv');
                } else {
                    v = tb_selected[i].getAttribute('data-value');
                }
                if (v) {
                    data_value += v + ';';
                }
            }

            return data_value;

        } catch (ex) {
            return "";
        }

    };

    this.getWangwang = function () {
        try {
            var wangwang = "";

            var span_wangwang = $('.tb-shop-ww .ww-light');

            if (span_wangwang != null && span_wangwang != '' && span_wangwang.length > 0) {
                wangwang = span_wangwang.attr('data-nick');
            }

            if (wangwang == '') {
                span_wangwang = document.querySelectorAll("span.seller");

                if (span_wangwang == null || span_wangwang == "" || span_wangwang == "undefined" || span_wangwang.length == 0) {
                    var div_wangwang = document.getElementsByClassName('slogo-extraicon');
                    if (div_wangwang != null && div_wangwang != "" && div_wangwang != "undefined" && div_wangwang.length > 0) {
                        span_wangwang = div_wangwang[0].getElementsByClassName("ww-light");
                    }
                }

                if (span_wangwang == null || span_wangwang == '' || span_wangwang.length == 0) {
                    span_wangwang = document.querySelectorAll("div.hd-shop-desc span.ww-light");
                }


                if (span_wangwang.length > 0) {
                    var sp_wangwang = span_wangwang[0].getElementsByTagName("span");
                    if (sp_wangwang != null && sp_wangwang != '' && sp_wangwang.length == 0) {
                        wangwang = decodeURIComponent(sp_wangwang[0].getAttribute('data-nick'));
                    } else {
                        wangwang = decodeURIComponent(span_wangwang[0].getAttribute('data-nick'));
                    }
                }
            }
        } catch (ex) {
            wangwang = "";
        }
        return wangwang;
    };

    this.checkSelectFull = function () {
        var props = document.getElementsByClassName('J_TSaleProp');
        if (!((typeof props != 'object' && props != "" && props != null)
            || (typeof props === 'object' && props.length > 0))) {

            props = document.querySelectorAll("ul.tb-cleafix");
        }
        var full = true;
        if (props.length > 0) {
            /*            kiem tra so Thuộc tính da chon cua sp*/
            var count_selected = 0;
            for (var i = 0; i < props.length; i++) {
                var selected_props = props[i].getElementsByClassName('tb-selected');
                if (selected_props != null && selected_props != 'undefined')
                    count_selected += selected_props.length;
            }
            if (count_selected < props.length) {
                full = false;
            }

        }
        return full;
    };

    this.getQuantity = function () {
        try {
            var quantity = '';
            var element = document.getElementById("J_IptAmount");
            if (element) {
                quantity = element.value;
            } else quantity = '';

            if (quantity == '') {
                try {
                    quantity = document.getElementsByClassName('mui-amount-input')[0].value;
                } catch (e) {
                    console.log(e);
                }
            }

            return quantity;
        } catch (ex) {
            throw Error(ex.message + " Can't get origin price function getQuantity");
        }

    };

    /**
     * SITE: TAOBAO
     * @returns {*}
     */
    this.getImgLink = function () {
        try {
            var img_src = "";
            try {
                var img_obj = document.getElementById('J_ImgBooth');
                if (img_obj != null) {
                    img_src = img_obj.getAttribute("src");
                    img_src = this.common_tool.resizeImage(img_src);
                    return img_src;//tuannn
                    // return encodeURIComponent(img_src);
                }

                img_obj = document.getElementById('J_ThumbView');

                if (img_obj != null && img_obj != "") {
                    img_src = img_obj.getAttribute("src");
                    img_src = this.common_tool.resizeImage(img_src);
                    return img_src;//tuannn
                    //return encodeURIComponent(img_src);
                }

                if (document.getElementById('J_ImgBooth').tagName == "IMG") {

                    var thumbs_img_tag = document.getElementById('J_UlThumb');
                    try {
                        if (thumbs_img_tag != null) {
                            img_src = thumbs_img_tag.getElementsByTagName("img")[0].src;
                        } else {
                            img_src = document.getElementById('J_ImgBooth').src;
                        }
                    } catch (e) {
                        console.log(e);
                    }
                } else {
                    /*                   Find thumb image*/
                    var thumbs_a_tag = document.getElementById('J_UlThumb');
                    if (thumbs_a_tag != null) {
                        img_src = thumbs_a_tag.getElementsByTagName("li")[0].style.backgroundImage.replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
                    } else {
                        img_src = document.getElementById('J_ImgBooth').style.backgroundImage.replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
                    }
                }

            } catch (e) {
                console.log("Image not found!" + e);
            }

            img_src = this.common_tool.resizeImage(img_src);
            return encodeURIComponent(img_src);
        } catch (ex) {
            return "";
        }

    };

    this.getItemID = function () {

        var item_id = 0;
        var home = window.location.href;
        var dom;
        //1. Lấy trên dom
        if (!item_id) {
            try {

                dom = document.getElementsByName("item_id");
                if (dom.length) {
                    item_id = dom[0].value;
                } else {
                    item_id = document.getElementsByName("item_id_num")[0].value;
                }

            } catch (e) {

            }
        }
        //2. Lấy trên link dạng http://world.taobao.com/item/521828428176.htm?*
        if (!item_id) {
            try {
                var temp = home.split('.htm')[0];
                item_id = temp.split('item/')[1];
            } catch (e) {

            }
        }

        //3. Lấy params trên url dạng ?spm=a312a.7728556.2015080705.14.fbm100&amp;id=521985720964&amp;scm=1007.12006.12548.i522577577280&amp;pvid=34d586a7-1587-44bb-8b07-1fb66252488c
        if (!item_id) {
            try {
                item_id = this.common_tool.getParamsUrl('id', home);
            } catch (e) {

            }
        }

        //console.info("item_id: " + item_id);
        return item_id;

    };

    /**
     * @desc TAOBAO, Hàm lấy giá trị text của ô đặt hàng nhanh, phục vụ cho mục đích kiểm tra dịch trên trang
     * @returns {*}
     */
    this.getButtonAddCartQuickText = function () {
        try {
            return document.getElementById('J_btn_submitBuy').innerText;
        } catch (e) {
            console.warn(e.message);
        }
        return '';
    };

    /**
     * @desc TAOBAO, kiểm tra xem người dùng có dùng công cụ dịch cả trang hay không?
     * @returns {boolean}
     */
    this.isTranslatePage = function () {
        try {

            if (document.getElementsByTagName("html")[0].classList.contains("translated-ltr") == true) {
                return true;
            }

        } catch (e) {

        }
        return false;
    };
};

var tmall = function (cart_url) {
    this.source = 'tmall';
    this.common_tool = new CommonTool();
    this.init = function () {
        buttonAddCartQuickText = this.getButtonAddCartQuickText();

        $('#detail').css(
            'border', '2px solid orange');
        this.parse();
        this.warning();
        this.checkShopCredible();
    };

    /**
     * SITE: TMALL
     */
    this.warning = function () {
        try {

            //Nếu đã tồn tại cảnh báo rồi thì thôi ko hiển thị nữa
            var len = document.querySelectorAll("._warning-on-page").length;
            if (len) return;

            var $anchor = document.querySelectorAll(".tb-amount");
            if ($anchor.length) {
                var elem = document.createElement("div");
                elem.className = 'block-warning-on-page-addon _warning-on-page';
                elem.textContent = 'Vui lòng chọn đầy đủ thuộc tính của sản phẩm (màu sắc, kích thước,..), tiếp đó click vào nút "Đặt hàng"';
                $anchor[0].insertBefore(elem, null);
            }

        } catch (e) {
            console.warn(e.message);
        }
    };

    //TMALL | Hàm kiểm tra độ tin cậy của shop
    this.checkShopCredible = function () {

        try {

            /*
             * Chưa tìm được cách để lấy độ tin cậy của shop
             * */

            //console.info("TMALL | checkShopCredible");
            //$("._alert-shop-credible").removeClass("hidden");
            //var $link = $("._alert-shop-credible").find("._link-detail-credible");
            //$link.attr("href", $link.data('tmall'));

        } catch (e) {

            //console.info("TMALL | Không kiểm tra được độ uy tín của shop");
            //console.warn(e.message);

        }

    };

    this.getLocationSale = function () {
        var location_sale = "";
        try {
            location_sale = document.querySelectorAll("#J-From")[0].textContent;
        } catch (e) {
            //console.info("TMALL | Không lấy được địa điểm đăng bán của sản phẩm");
            //console.warn(e.message);
        }
        return location_sale;
    };

    /**
     * site tmall
     * @returns {boolean}
     */
    this.parse = function () {

        var common = this.common_tool;
        $('.tb-metatit').each(function () {
            var text = $(this).text();
            $(this).text(common.key_translate_lib(text));
            $(this).attr("data-title", text);
        });

        this.common_tool.loadOptionCategory();

        $('#J_ButtonWaitWrap').hide();

        var price_html = '<p style="font-size: 16px;margin-top: 15px;">Tỉ giá: ' +
            common.currency_format(common.getExchangeRate(), true) + ' VNĐ / 1 CNY</p>';
        this.getPromotionPrice("TMALL");
        var tb_detail_hd = $('.tb-detail-hd');
        if (tb_detail_hd != null && tb_detail_hd != "") {
            tb_detail_hd.append(price_html);
        } else {
            $('.tb-btn-buy').html(price_html);
        }
        var title_content = this.getTitleOrigin();

        //common.setIsTranslateToCookie();

        common.translate_title(title_content, 'title', this);

        this.translateProperties();

        this.common_tool.reRenderPricePreview();

        return false;
    };

    this.set_translate = function (data) {
        var _title = this.getDomTitle();

        if (_title != null && data.title != "") {
            _title.setAttribute("data-text", _title.textContent);
            _title.textContent = data.title;
        }
    };

    this.translateProperties = function () {
        var common = this.common_tool;

        $('.J_TSaleProp li span').each(function () {
            common.translate($(this), "properties");
        });
    };

    this.getPriceInput = function () {
        return $('#_price').val();
    };

    this.getPropertiesInput = function () {
        return $('#_properties').val();
    };

    this.getQuantityInput = function () {
        return $('#_quantity').val();
    };

    this.getCommentInput = function () {
        return $('._comment_item').val();
    };

    this.checkSelectFull = function () {
        var props = document.getElementsByClassName('J_TSaleProp');
        if (!((typeof props != 'object' && props != "" && props != null)
            || (typeof props === 'object' && props.length > 0))) {

            props = document.querySelectorAll("ul.tb-cleafix");
        }
        var full = true;
        if (props.length > 0) {
            var count_selected = 0;
            for (var i = 0; i < props.length; i++) {
                var selected_props = props[i].getElementsByClassName('tb-selected');
                if (selected_props != null && selected_props != 'undefined')
                    count_selected += selected_props.length;
            }
            if (count_selected < props.length) {
                full = false;
            }
        }
        return full;
    };

    /**
     * SITE TMALL
     * @param site
     */
    this.getPromotionPrice = function (site) {
        try {
            var span_price = null;
            var normal_price = document.getElementById('J_StrPrice');

            if (normal_price == null) {
                normal_price = document.getElementById("J_priceStd");
            }

            if (normal_price == null) {
                normal_price = document.getElementById('J_StrPriceModBox');
            }

            if (normal_price == null) {
                normal_price = document.getElementById('J_PromoPrice');
            }

            var promotion_price = document.getElementById('J_PromoPrice');

            var price = 0;
            if (promotion_price == null) {
                promotion_price = normal_price;
            }

            if (promotion_price != null) {
                try {
                    if (promotion_price.getElementsByClassName('tm-price').length > 0) {
                        span_price = promotion_price.getElementsByClassName('tm-price');
                        if (span_price != null && span_price != "" && span_price != "undefined") {
                            price = span_price[0].textContent.match(/[0-9]*[\.,]?[0-9]+/g);
                        }
                    } else if (promotion_price.getElementsByClassName('tb-rmb-num').length > 0) {
                        span_price = promotion_price.getElementsByClassName('tb-rmb-num');
                        if (span_price != null && span_price != "" && span_price != "undefined") {
                            price = span_price[0].textContent.match(/[0-9]*[\.,]?[0-9]+/g);
                        }
                    } else if (promotion_price.getElementsByClassName('tb-wrTuan-num').length > 0) {
                        price = document.getElementById('J_PromoPrice').getElementsByClassName('tb-wrTuan-num')[0].childNodes[1].textContent.match(/[0-9]*[\.,]?[0-9]+/g);
                    }
                } catch (e) {
                    price = 0;
                }

            }
            return this.common_tool.processPrice(price, site);
        } catch (ex) {
            throw Error(ex.message + " Line:" + ex.lineNumber + " function getPromotionPrice");
        }
    };

    /**
     * tmall
     * getOriginPrice
     */
    this.getOriginPrice = function () {
        try {
            var str_price = $('#J_StrPrice');
            var origin_price = str_price.find('.tm-price');

            if (origin_price == null || origin_price.length == 0) {
                origin_price = str_price.find('.tb-rmb-num');
            }

            if (origin_price == null || origin_price.length == 0) {
                origin_price = $('#J_priceStd').find('.tb-rmb-num');
            }

            if (origin_price == null || origin_price.length == 0) {
                origin_price = $('#J_priceStd').find('.tm-price');
            }

            if (origin_price == null || origin_price.length == 0) {
                origin_price = $('#J_StrPriceModBox').find('.tm-price');
            }

            if (origin_price == null || origin_price.length == 0) {
                origin_price = $('#J_StrPriceModBox').find('.tb-rmb-num');
            }

            if (origin_price == null || origin_price.length == 0) {
                origin_price = $('#J_PromoPrice').find('.tm-price');
            }

            if (origin_price == null || origin_price.length == 0) {
                origin_price = $('#J_PromoPrice').find('.tb-rmb-num');
            }

            var price = origin_price.text();
            price = price.match(/[0-9]*[\.,]?[0-9]+/g);

            return this.common_tool.processPrice(price);
        } catch (ex) {
            throw Error(ex.message + " Can't get origin price function getOriginPrice");
        }
    };

    this.getQuantity = function () {
        try {
            var quantity = '';
            var element = document.getElementById("J_IptAmount");
            if (element) {
                quantity = element.value;
            } else quantity = '';
            if (quantity == '') {
                quantity = document.getElementsByClassName('mui-amount-input')[0].value;
            }

            return quantity;
        } catch (ex) {
            throw Error(ex.message + " Can't get origin price function getQuantity");
        }

    };

    this.getOuterId = function (data_value) {
        try {
            var scripts = document.getElementsByTagName('script');
            var skuId = "";
            var skuMap = null;
            if (scripts.length > 0) {
                for (var script = 0; script < scripts.length; script++) {
                    if (scripts[script].innerHTML.match(/Hub\.config\.set/)) {
                        try {
                            detailJsStart();
                            skuId = Hub.config.get('sku').valItemInfo.skuMap[";" + data_value + ";"].skuId;
                        } catch (e) {
                            skuMap = scripts[script].innerHTML.replace(/\s/g, '').substr(scripts[script].innerHTML.replace(/\s/g, '').indexOf(data_value), 60);
                            skuId = skuMap.substr(skuMap.indexOf('skuId') + 8, 15).match(/[0-9]+/);
                        }
                    } else if (scripts[script].innerHTML.match(/TShop\.Setup/)) {
                        skuMap = scripts[script].innerHTML.replace(/\s/g, '').substr(scripts[script].innerHTML.replace(/\s/g, '').indexOf(data_value), 60);
                        skuId = skuMap.substr(skuMap.indexOf('skuId') + 8, 15).match(/[0-9]+/);
                    }
                }
            }

            return skuId;
        } catch (ex) {
            return "";
        }

    };

    this.getTitleTranslate = function () {
        try {
            var _title = this.getDomTitle();
            var title_translate = _title.textContent;
            if (title_translate == "") {
                title_translate = _title.getAttribute("data-text");
            }
            return title_translate;
        } catch (ex) {
            return "";
        }

    };

    this.getTitleOrigin = function () {
        try {
            var _title = this.getDomTitle();
            var title_origin = _title.getAttribute("data-text");
            if (title_origin == "" || typeof title_origin == "undefined" || title_origin == null) {
                title_origin = _title.textContent;
            }
            return title_origin;
        } catch (ex) {
            return "";
        }

    };

    this.getDomTitle = function () {
        var _title = null;
        if (document.getElementsByClassName("tb-main-title").length > 0) {
            _title = document.getElementsByClassName("tb-main-title")[0];
        }

        if (_title == null && document.getElementsByClassName("tb-detail-hd").length > 0) {
            var h = document.getElementsByClassName("tb-detail-hd")[0];
            if (h.getElementsByTagName('h3').length > 0 && h != null) {
                _title = h.getElementsByTagName('h3')[0];
            } else {
                _title = h.getElementsByTagName("h1")[0];
            }
        }

        if (_title.textContent == "" && document.getElementsByClassName("tb-tit").length > 0) {
            _title = document.getElementsByClassName("tb-tit")[0];
        }

        if (_title.textContent == "") {
            _title = document.querySelectorAll('h3.tb-item-title');
            if (_title != null) {
                _title = _title[0];
            } else {
                _title = document.getElementsByClassName('tb-item-title');
                if (_title.length > 0) {
                    _title = _title[0];
                }
            }
        }
        return _title;
    };

    this.getStock = function () {
        try {
            var stock_id = document.getElementById('J_EmStock');
            var stock = 99;
            if (stock_id == null || stock_id == 'undefined') {
                stock_id = document.getElementById("J_SpanStock");
            }

            if (stock_id != null && stock_id != 'undefined') {
                stock = stock_id.textContent;
                stock = parseInt(stock.replace(/[^\d.]/g, ''));
            }
        } catch (ex) {
            stock = 99;
        }

        return stock;
    };

    this.getSellerId = function () {
        var sellerId = "";
        try {
            var content = document.querySelectorAll("meta[name='microscope-data']")[0].getAttribute("content");
            var a = content.split(";");
            for (var i = 0; i < a.length; i++) {
                if (a[i]) {
                    var tmp = a[i].split("=");
                    if (tmp[0].trim() == "userid") {
                        sellerId = tmp[1];
                        break;
                    }
                }
            }
            //console.info("sellerId: " + sellerId);
        } catch (e) {
            //console.info("TMALL | không lấy được thông tin sellerId");
            //console.warn(e.message);
        }
        return sellerId;
    };

    this.getShopName = function () {
        var shop_name = '';
        try {
            shop_name = document.getElementsByClassName('hd-shop-name')[0].getElementsByTagName('a')[0].innerText;
            if (shop_name == '' || shop_name == undefined) {
                shop_name = document.getElementsByClassName('shop-intro')[0].getElementsByTagName('a')[0].innerText;
            }
        } catch (ex) {

        }

        if (!shop_name) {
            try {
                shop_name = document.getElementsByClassName('slogo-shopname')[0].getElementsByTagName('strong')[0].innerText;
            } catch (ex) {

            }
        }

        if (!shop_name) {
            try {
                shop_name = document.querySelectorAll('[type="hidden"][name="seller_nickname"]')[0].value;
            } catch (ex) {

            }
        }

        return shop_name;
    };

    this.getShopLink = function () {
        var shop_link = "";
        if (!shop_link) {
            try {
                shop_link = document.getElementsByClassName('slogo-shopname')[0].getAttribute('href');;
            } catch (ex) {

            }
        }
        return shop_link;
    };

    /**
     * tmall
     * @returns {string}
     */
    this.getShopId = function () {
        var shop_id = '';
        try {
            var string = document.querySelector('meta[name="microscope-data"]').getAttribute("content");
            if (string) {
                var array = string.split(';');
                if (array.length > 0) {
                    for (var i = 0; i < array.length; i++) {
                        var str = array[i];
                        str = str.trim();
                        var params = str.split('=');
                        var key = params[0];
                        var value = params[1];
                        if (key == 'shopId') {
                            shop_id = value;
                            break;
                        }
                    }
                }
            }
        } catch (ex) {

        }

        if (!shop_id) {
            try {
                var href = document.querySelectorAll(".tb-booth")[0].getElementsByTagName("a")[0].getAttribute('href');
                var a = href.split('?');
                var b = a[1].split('&');
                for (var j = 0; j < b.length; j++) {
                    var c = b[j].split('=');
                    if (c[0] == 'shopId') {
                        shop_id = c[1];
                        break;
                    }
                }
            } catch (ex) {

            }
        }
        shop_id = 'tmall_' + shop_id;
        return shop_id;
    };

    this.getProperties = function () {
        //write by vanhs | edit_time: 13/06/2015
        var color_size = '';
        try {
            var selected_props = document.getElementsByClassName('J_TSaleProp');
            if (!selected_props.length) {
                selected_props = document.querySelectorAll("ul.tb-cleafix");
            }
            if (selected_props.length > 0) {
                for (var i = 0; i < selected_props.length; i++) {
                    var li_origin = selected_props[i].getElementsByClassName('tb-selected')[0];
                    if (li_origin) {
                        var c_s = li_origin.getElementsByTagName('span')[0].textContent;
                        if (c_s) { color_size += c_s.trim() + ';'; }
                    }
                }
            }
        } catch (e) {
            console.warn("TAMLL | getProperties: " + e.message);
        }
        return color_size;
    };

    this.getPropertiesOrigin = function () {
        //màu s?c
        var selected_props = document.getElementsByClassName('J_TSaleProp');
        var color_size = '';

        if (!((typeof selected_props !== 'object' && selected_props != "" && selected_props != null)
            || (typeof selected_props === 'object' && selected_props.length > 0))) {
            selected_props = document.querySelectorAll("ul.tb-cleafix");
        }
        if (selected_props.length > 0) {
            for (var i = 0; i < selected_props.length; i++) {
                var li_origin = selected_props[i].getElementsByClassName('tb-selected')[0];
                if (li_origin != null) {
                    var c_s = li_origin.getElementsByTagName('span')[0].getAttribute("data-text");
                    if (c_s == "" || c_s == null || typeof c_s == "undefined") {
                        c_s = li_origin.getElementsByTagName('span')[0].textContent;
                    }
                    color_size += c_s + ';';
                }
            }
        }
        return color_size;
    };

    this.getDataValue = function () {
        try {
            var selected_props = document.getElementsByClassName('J_TSaleProp');
            var data_value = '';
            if (selected_props.length > 0) {
                for (var i = 0; i < selected_props.length; i++) {
                    var li_origin = selected_props[i].getElementsByClassName('tb-selected')[0];

                    data_value += ";" + li_origin.getAttribute('data-value');
                }
            }
            if (data_value.charAt(0) == ';') {
                data_value = data_value.substring(1, data_value.length);
            }
            return data_value;
        } catch (ex) {
            return "";
        }

    };

    this.getWangwang = function () {
        try {

            var wangwang = "";

            var seller_nickname = $('input[name=seller_nickname]');

            if (seller_nickname != null && seller_nickname.length > 0) {
                wangwang = seller_nickname.val();
            }

            if (wangwang == '') {
                var span_wangwang = document.querySelectorAll("span.seller");

                if (span_wangwang != null && span_wangwang != "" && span_wangwang != "undefined" && span_wangwang.length > 0) {
                    var div_wangwang = document.getElementsByClassName('slogo-extraicon');
                    if (div_wangwang != null && div_wangwang != "" && div_wangwang != "undefined" && div_wangwang.length > 0) {
                        span_wangwang = div_wangwang[0].getElementsByClassName("ww-light");
                    }
                }

                if (span_wangwang == null || span_wangwang == '' || span_wangwang.length == 0) {
                    span_wangwang = document.querySelectorAll("div.hd-shop-desc span.ww-light");
                }

                if (span_wangwang.length > 0) {
                    var sp_wangwang = span_wangwang[0].getElementsByTagName("span");
                    if (sp_wangwang != null && sp_wangwang != '' && sp_wangwang.length == 0) {
                        wangwang = decodeURIComponent(sp_wangwang[0].getAttribute('data-nick'));
                    } else {
                        wangwang = decodeURIComponent(span_wangwang[0].getAttribute('data-nick'));
                    }
                }
            }

        } catch (ex) {
            console.log(ex);
            wangwang = "";
        }
        return wangwang;

    };

    /**
     * SITE: TMALL
     * @returns {string}
     */
    this.getImgLink = function () {
        var img_src = "";
        try {
            var img_obj = document.getElementById('J_ImgBooth');
            if (img_obj != null) { // Image taobao and t
                img_src = img_obj.getAttribute("src");
                img_src = this.common_tool.resizeImage(img_src);
                //return encodeURIComponent(img_src);
                //TUANNN EDIT 17/2/2020
                return img_src;
            }

            img_obj = document.getElementById('J_ThumbView');

            if (img_obj != null && img_obj != "") {
                img_src = img_obj.getAttribute("src");
                img_src = this.common_tool.resizeImage(img_src);
                //return encodeURIComponent(img_src);
                //TUANNN EDIT 17/2/2020
                return img_src;
            }

            if (document.getElementById('J_ImgBooth').tagName == "IMG") {
                // Find thumb image
                var thumbs_img_tag = document.getElementById('J_UlThumb');
                try {
                    if (thumbs_img_tag != null) {
                        img_src = thumbs_img_tag.getElementsByTagName("img")[0].src;
                    } else {
                        img_src = document.getElementById('J_ImgBooth').src;
                    }
                } catch (e) {
                    console.log(e);
                }
            } else {
                // Find thumb image
                var thumbs_a_tag = document.getElementById('J_UlThumb');
                if (thumbs_a_tag != null) {
                    img_src = thumbs_a_tag.getElementsByTagName("li")[0].style.backgroundImage.replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
                } else {
                    img_src = document.getElementById('J_ImgBooth').style.backgroundImage.replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
                }
            }

        } catch (e) {
            img_src = "";
        }

        img_src = this.common_tool.resizeImage(img_src);
        //return encodeURIComponent(img_src);
        //TUANNN EDIT 17/2/2020
        return img_src;
    };

    this.getItemID = function () {
        try {
            var home = window.location.href;
            var item_id = this.common_tool.getParamsUrl('id', home);
            var dom_id = document.getElementsByName("item_id");
            if (item_id <= 0 || !$.isNumeric(item_id)) {
                if (dom_id.length > 0) {
                    dom_id = dom_id[0];
                    item_id = dom_id.value;
                } else item_id = 0;

                if (item_id == 0 || item_id == null || item_id == '') {
                    dom_id = document.getElementsByName("item_id_num");
                    if (dom_id.length > 0) {
                        dom_id = dom_id[0];
                        item_id = dom_id.value;
                    } else item_id = 0;
                }
            }

            if (parseInt(item_id) <= 0 || !$.isNumeric(item_id)) {
                item_id = home.split('.htm')[0];
                item_id = item_id.split('item/')[1];
            }

            return item_id;
        } catch (ex) {
            return "";
        }

    };

    /**
     * @desc TMALL, Hàm lấy giá trị text của ô đặt hàng nhanh, phục vụ cho mục đích kiểm tra dịch trên trang
     * @returns {*}
     */
    this.getButtonAddCartQuickText = function () {
        try {
            return document.getElementById('J_LinkBuy').innerText;
        } catch (e) {
            console.warn(e.message);
        }
        return '';
    };

    /**
     * @desc TMALL, kiểm tra xem người dùng có dùng công cụ dịch cả trang hay không?
     * @returns {boolean}
     */
    this.isTranslatePage = function () {
        try {

            if (document.getElementsByTagName("html")[0].classList.contains("translated-ltr") == true) {
                return true;
            }

        } catch (e) {

        }
        return false;
    };
};

var alibaba = function (cart_url, add_cart_url) {
    this.params_on_page = false;

    this.source = 'alibaba';
    this.common_tool = new CommonTool();
    this.init = function () {
        buttonAddCartQuickText = this.getButtonAddCartQuickText();

        $('#J_DetailInside').css('border', 'solid 1px blue;');

        this.alert();
        this.warning();
        this.parse();

        this.getParamsOnPage();
    };

    /**
     * @desc 1688, Hàm lấy giá trị text của ô đặt hàng nhanh, phục vụ cho mục đích kiểm tra dịch trên trang
     * @returns {*}
     */
    this.getButtonAddCartQuickText = function () {
        try {
            return document.querySelectorAll('[trace="addtoorder1"]')[0].innerText;
        } catch (e) {
            console.warn(e.message);
        }
        return '';
    };

    /**
     * @desc 1688, kiểm tra xem người dùng có dùng công cụ dịch cả trang hay không?
     * @returns {boolean}
     */
    this.isTranslatePage = function () {
        try {

            if (document.getElementsByTagName("html")[0].classList.contains("translated-ltr") == true) {
                return true;
            }

        } catch (e) {

        }
        return false;
    };

    /**
     * @author vanhs
     * @time 10:11 16/03/2016
     * @description Hàm lấy ra dữ liệu trên site gốc khi bắt đầu vào trang
     * @returns {boolean}
     */
    this.getParamsOnPage = function () {
        if (this.params_on_page) {
            return this.params_on_page;
        }
        // console.log('1 getParamsOnPage');
        // console.log(this.params_on_page);
        var self = this;
        try {
            var scripts = document.querySelectorAll("script");
            for (var i = 0; i < scripts.length; i++) {
                var html = scripts[i].textContent;
                var res = html.search("iDetailConfig");
                if (res != -1) {
                    eval(html);
                    self.params_on_page = {
                        iDetailConfig: iDetailConfig,
                        iDetailData: iDetailData
                    };

                    break;
                }
            }
        } catch (e) {
            console.info("Can not get params on page");
            console.warn(e.message);
        }

        // console.log('2 getParamsOnPage');
        // console.log(this.params_on_page);
        return this.params_on_page;
    };

    /**
     * SITE: ALIBABA
     */
    this.warning = function () {
        try {
            //Nếu đã tồn tại cảnh báo rồi thì thôi ko hiển thị nữa
            var len = document.querySelectorAll("._warning-on-page").length;
            if (len) return;

            var $anchorSku = document.querySelectorAll(".obj-sku");
            var $anchorLeading = document.querySelectorAll(".obj-leading");
            var $anchorInputAmount = document.querySelectorAll(".obj-amount");

            var a = false;
            if ($anchorSku.length) {
                a = $anchorSku;
            } else if ($anchorLeading.length) {
                a = $anchorLeading;
            } else if ($anchorInputAmount.length) {
                a = $anchorInputAmount;
            }

            if (a) {
                var elem = document.createElement("div");
                elem.className = 'block-warning-on-page-addon _warning-on-page';
                elem.textContent = 'Vui lòng chọn đầy đủ thuộc tính của sản phẩm (màu sắc, kích thước,..), tiếp đó click vào nút "Đặt hàng"';
                a[0].insertBefore(elem, null);
            }

        } catch (e) {
            console.warn(e.message);
        }
    };

    //1688 | Hàm hiển thị cảnh báo trên addon
    this.alert = function () {
        var text_info = "";
        /*
         * Cảnh báo về độ tin cậy của shop
         *
         * */

        //Nếu người bán có uy tín dưới 2 kim cương trở xuống thì hiển thị cảnh báo úy tín thấp.
        try {
            var star = true;//mặc định là shop có uy tín cao
            var img1 = "//cbu01.alicdn.com/cms/upload/2015/298/124/2421892_1490276829.png";//huy chương
            var img2 = "//cbu01.alicdn.com/cms/upload/2015/449/224/2422944_1490276829.png";//kim cương
            var img3 = "//cbu01.alicdn.com/cms/upload/2015/778/324/2423877_1490276829.png";//vương miện

            var len = document.querySelectorAll(".item.supply-grade > .disc > a > img[src='" + img1 + "']").length;
            if (len > 0) {
                star = false;
            } else {
                var len1 = document.querySelectorAll(".item.supply-grade > .disc > a > img[src='" + img2 + "']").length;
                if (len1 > 0 && len1 <= 2) {
                    star = false;
                }
            }

            if (!star) {
                text_info = 'Người bán này có uy tín bán hàng thấp. Quý khách nên cân nhắc trước khi đặt hàng. Vui lòng tham khảo cách <a href="' + link_store_review_guidelines + '" target="_blank">đánh giá điểm uy tín tại đây.</a>';
            }

        } catch (e) {

        }

        //Chú ý: Người bán có hình con trâu cạnh tên người bán thì đây được hiểu là các shop có uy tín rất tốt trên 1688, ko hiển thị thứ hạng. Với các shop này hiển thị dòng thông báo: "Người bán có uy tín cao, đã được 1688 xác thực."
        try {
            if (document.querySelectorAll(".smt-info").length) {
                text_info = 'Người bán có uy tín cao, đã được 1688 xác thực.';
            }
        } catch (e) {

        }

        if (text_info) {
            $("._addon-message").removeClass("hidden").find("span:eq(0)").html(text_info);
        }

        var text_warn = "";
        /*
         * Cảnh báo về khoảng giá
         *
         * */
        try {

            var scripts = document.querySelectorAll("script");
            for (var i = 0; i < scripts.length; i++) {
                var html = scripts[i].textContent;
                var res = html.search("iDetailConfig");
                if (res != -1) {
                    eval(html);
                    var d = { iDetailConfig: iDetailConfig, iDetailData: iDetailData };

                    //text += "<h4>Khoảng giá: </h4>";

                    var priceRange = iDetailData.sku.priceRange == undefined ? iDetailData.sku.priceRangeOriginal : iDetailData.sku.priceRange;


                    for (var ii = 0; ii < priceRange.length; ii++) {

                        var qRange = priceRange[ii][0];
                        var pRange = priceRange[ii][1];
                        var priceVND = parseFloat(pRange) * parseFloat(exchange_rate);
                        priceVND = this.common_tool.currency_format(priceVND.toFixed(2));

                        var text_first = ii == 0 ? "Mua" : "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";

                        if (ii < priceRange.length - 1) {
                            text_warn += text_first + " từ <strong>" + qRange + "-" + (priceRange[ii + 1][0] - 1) + "</strong> sản phẩm giá là: <strong>" + pRange + "¥ (" + priceVND + "đ)</strong><br />";
                        } else {
                            text_warn += text_first + " từ <strong>" + qRange + "</strong> sản phẩm trở lên giá là: <strong>" + pRange + "¥ (" + priceVND + "đ)</strong><br />";
                        }

                    }

                    break;
                }
            }

        } catch (e) {
            //console.warn(e.message);
        }


        /*
         * Cảnh báo step
         * */
        var step = this.getStep();
        if (step) {
            var textStep = "";
            var maxStep = 5;
            for (var o = 1; o <= maxStep; o++) {
                if (o == 1) {
                    continue;
                }

                textStep += parseInt(step) * o + ", ";
                if (o == maxStep) {
                    textStep += "...";
                }
            }
            //tuannn command ngay 2/7/20
            //text_warn += "Số lượng mua phải là bội số của <strong>" + step + "( VD: " + textStep + " )</strong>";

        }


        /*
         * Cảnh báo require_min
         * */
        var require_min = this.getRequireMin();
        text_warn += "Số lượng mua ít nhất <strong>" + require_min + "</strong> sản phẩm";


        /*
         * Cảnh báo số lượng hàng còn lại
         * */
        var stock = this.getStock();
        text_warn += "<br />Hiện còn <strong>" + stock + "</strong> sản phẩm trong kho</br />";


        if (text_warn) {
            text_warn = "<h5 style='font-size: 18px;border-bottom: 1px solid #ccc;'>Chính sách bán của người bán</h5>" + text_warn;
            var obj_leading = $('.obj-leading');
            if (obj_leading != null && obj_leading.length > 0) {
                obj_leading.before(text_warn);
            } else {
                $('.obj-sku').before(text_warn);
            }
        }

    };

    this.parse = function () {

        //parse label description
        var common = this.common_tool;
        $('.content-wrapper table thead th').each(function () {
            var text = $.trim($(this).text());
            $(this).text(common.key_translate_lib(text));
        });
        var prop_single = $('.prop-single');
        var text_single = $.trim(prop_single.text());
        prop_single.text(common.key_translate_lib(text_single));

        var content_wrapper = $('div.content-wrapper-spec');

        content_wrapper.css("height", "300px");

        var summary = content_wrapper.find(".summary");
        var content = content_wrapper.find(".content");
        var unit_detail = content_wrapper.find(".unit-detail-order-action");

        summary.css("height", "100% !important");
        content.css("height", "100%");
        unit_detail.css("width", "230px");

        //parse price
        var item_price = this.getPrice(1);
        var table_wrap = $('.table-wrap');

        this.common_tool.loadOptionCategory();

        var detail_bd = $('#mod-detail-bd');

        if (detail_bd != null) {
            detail_bd.css("border", "2px solid red")
        }

        var price_html = '<div style="font-size: 24px;color: #c00;height: 100px;padding: 20px">' +
            '<p>Tỉ giá : ' + this.common_tool.getExchangeRate() + ' VNĐ / 1 CNY</p>' +
            '<span style="font-weight:normal">Giá tạm tính: ' + common.currency_format(item_price * this.common_tool.getExchangeRate()) + ' VNĐ</span></div>';
        if (table_wrap != null && (typeof table_wrap === 'object' && table_wrap.length > 0)) {
            table_wrap.append(price_html);
        } else {
            try {
                var obj_leading = $('.obj-leading');
                if (obj_leading != null && obj_leading.length > 0) {
                    obj_leading.before(price_html);
                } else {
                    $('.obj-sku').before(price_html);
                }
            } catch (ex) {

            }
        }

        //translate
        var title_content = $('.mod-detail-hd h1');
        title_content.attr('data-origin-title', title_content.text());

        this.common_tool.translate_title(title_content.text(), 'title', this);

        this.common_tool.translate_guarantee_type();

        //common.setIsTranslateToCookie();

        //this.translateProperties();//write by vanhs | edit_time: 13/06/2015

        return false;

    };

    this.translateProperties = function () {
        //write by vanhs | edit_time: 13/06/2015
        try {
            var common = this.common_tool;
            //Dịch kích thước
            var rows = document.querySelectorAll(".table-sku > tbody > tr");
            if (rows.length > 0) {
                for (var i = 0; i < rows.length; i++) {
                    var $this = rows[i];
                    var $dom = $this.getElementsByClassName("name")[0].getElementsByTagName("span");
                    if ($dom.length > 0) {
                        common.translate($dom[0], "properties");
                    }
                }
            }

            //Dịch màu sắc
        } catch (e) {
            //console.warn("1688 | Can not translate properties. " + e.message);
        }
    };

    this.set_translate = function (data) {
        var title_content = $('.mod-detail-hd h1');
        title_content.html(data['title']);
        return true;
    };

    this.getPriceInput = function () {
        return $('#_price').val();
    };

    this.getLocationSale = function () {
        var location_sale = "";
        try {
            location_sale = document.querySelectorAll(".delivery-addr")[0].textContent;
        } catch (e) {
            //console.info("1688 | Không lấy được địa điểm đăng bán của sản phẩm");
            //console.warn(e.message);
        }
        return location_sale;
    };

    this.getPropertiesInput = function () {
        return $('#_properties').val();
    };

    this.getQuantityInput = function () {
        return $('#_quantity').val();
    };

    this.getCommentInput = function () {
        return $('._comment_item').val();
    };

    /**
     * SP không có thuộc tính
     */
    this.addToCartCase1 = function () {
        var data_send = this.getDataSend([]);

        if (data_send != null) {
            arrdata_send.push(data_send);
            this.common_tool.sendAjaxToCart(add_cart_url, JSON.stringify(arrdata_send));
        }
    };

    /**
     * SP có thuộc tính
     */
    this.addToCartCase2 = function () {
        var data_send = null;
        try {
            var data = this.get_item_data();
            if (!data.length) {
                data = this.get_item_data('re-render');
            }

            // Find color required and checked
            var tbl_wrap = document.getElementsByClassName('content-wrapper');
            var content = null;
            var color_selected = true;
            if (tbl_wrap.length > 0) {
                content = tbl_wrap[0].getElementsByClassName('content');
                if (content.length > 0) {
                    var color_dom = content[0].getElementsByClassName('leading');
                    if (!(color_dom != null && (typeof color_dom === 'object' && color_dom.length > 0))) {
                        color_selected = false;
                    }
                }
            } else {
                var tag_ul_color = document.getElementsByClassName('list-leading');
                if (tag_ul_color.length > 0) {
                    var tag_a_color = tag_ul_color[0].getElementsByClassName('selected');
                    if (tag_a_color.length > 0) {
                        color_selected = true;
                    }
                }
            }

            //Nếu có màu sắc thì mới kiểm tra xem chọn màu sắc hay chưa
            var hasOptionColor = document.querySelectorAll(".list-leading").length;

            if (hasOptionColor && color_selected == false) {
                alert("Bạn chưa chọn màu sắc");
                this.common_tool.removeDisabledButtonCart();
                return;
            }

            if (data.length == 0) {
                alert("Bạn chưa chọn số lượng sản phẩm");
                this.common_tool.removeDisabledButtonCart();
                return;
            }

            //console.info(data);
            for (var o in data) {
                if (!$.isNumeric(o)) {
                    continue;
                }
                //console.info(o);
                //console.info(data[o]);
                if (data[o]['amount'] == 0) {
                    alert("Bạn chưa chọn số lượng sản phẩm");
                    this.common_tool.removeDisabledButtonCart();
                    return;
                }

                data_send = this.getDataSend(data[o]);

                if (data_send != null && typeof data_send != "undefined" && data_send != "") {

                    //tiến hành lấy ảnh thumb cho từng thuộc tính của sản phẩm nếu có
                    try {
                        var $dom1 = document.querySelectorAll(".table-sku .image[title='" + data[o][3] + "']");
                        var $dom2 = document.querySelectorAll(".table-sku img[alt='" + data[o][3] + "']");

                        if ($dom1.length) {
                            var string = $dom1[0].getAttribute("data-imgs");
                            if (string) {
                                var json = JSON.parse(string);
                                if (json) {
                                    data_send.image_model = json.original;
                                }
                            }
                        } else {
                            if ($dom2.length) {
                                var src = $dom2[0].getAttribute("src");
                                if (src) {
                                    data_send.image_model = src.replace(".32x32", "");
                                }
                            }
                        }


                    } catch (exGetImageVariant) {

                    }

                    //console.info(data_send);
                    arrdata_send.push(data_send);
                }

            }
            this.common_tool.sendAjaxToCart(add_cart_url, JSON.stringify(arrdata_send));
            return true;
        } catch (e) {
            // console.warn(e.message);
            data_send = this.getDataSend([]);

            if (data_send != null) {

                arrdata_send.push(data_send);
                this.common_tool.sendAjaxToCart(add_cart_url, JSON.stringify(arrdata_send));
            }

            return false;
        }
    };

    this.add_to_cart = function () {

        /**
         * Phân chia ra làm 2 trường hợp rõ ràng
         * TH1: Sản phẩm có thuộc tính
         * TH2: Sản phẩm không có thuộc tính
         */

        //SP không có thuộc tính
        if (this.checkHasOneProperty()) {
            //this.addToCartCase1();
            this.addToCartCase2();//tuannn edit 9/7/2020
        } else {//SP có thuộc tính
            this.addToCartCase2();
        }

    };

    this.getDataValueNew = function (self, color) {
        var iDetailConfigObj = {};
        var iDetailDataObj = {};
        var skuMap = [];

        var params = this.getParamsOnPage();

        if (this.params_on_page) {
            iDetailConfigObj = params.iDetailConfig;
            iDetailDataObj = params.iDetailData;
            skuMap = iDetailDataObj.sku.skuMap;
        }

        var arrayDataValue = [];
        var ssName = '';
        try {
            ssName = JSON.parse(self.getAttribute("data-sku-config")).skuName.trim();
        } catch (ex) {
            console.warn(ex.message);
        }



        //Lấy loại sản phẩm với từng SL khác nhau
        try {
            var amounts = document.querySelectorAll('.table-sku .amount-input');
            for (var m = 0; m < amounts.length; m++) {
                var value = amounts[m].value;
                var parent = amounts[m].parentNode.parentNode.parentNode.parentNode;
                var data_sku_config = JSON.parse(parent.getAttribute("data-sku-config"));
                var skuName = data_sku_config.skuName;

                if (value > 0 && skuName == ssName) {
                    var p = '';
                    try {
                        p = skuMap[skuName].specId;
                    } catch (ex) {
                        p = skuMap[color + '&gt;' + skuName].specId;
                    }
                    if (p) {
                        arrayDataValue.push(p);
                    }
                }
            }
        } catch (ex) {
            console.info(ex.message);
        }

        return arrayDataValue.join(';');
    };
    this.getDataValue = function (self) {
        //console.info("data value 1688");
        //Lấy data_value
        var iDetailConfigObj = {};
        var iDetailDataObj = {};
        var skuMap = [];

        var params = this.getParamsOnPage();

        if (this.params_on_page) {
            iDetailConfigObj = params.iDetailConfig;
            iDetailDataObj = params.iDetailData;
            skuMap = iDetailDataObj.sku.skuMap;
        }

        var arrayDataValue = [];
        var ssName = '';
        try {
            ssName = JSON.parse(self.getAttribute("data-sku-config")).skuName.trim();
        } catch (ex) {
            console.warn(ex.message);
        }

        //Lấy màu sắc
        var color = '';
        try {
            var images = document.querySelectorAll('.list-leading > li > div > a');
            for (var j = 0; j < images.length; j++) {
                var check = images[j].className.indexOf("selected");
                if (check > -1) {
                    color = images[j].getAttribute("title");
                }
            }
        } catch (ex) {

        }

        //Lấy loại sản phẩm với từng SL khác nhau
        try {
            var amounts = document.querySelectorAll('.table-sku .amount-input');
            for (var m = 0; m < amounts.length; m++) {
                var value = amounts[m].value;
                var parent = amounts[m].parentNode.parentNode.parentNode.parentNode;
                var data_sku_config = JSON.parse(parent.getAttribute("data-sku-config"));
                var skuName = data_sku_config.skuName;

                if (value > 0 && skuName == ssName) {
                    var p = '';
                    try {
                        p = skuMap[skuName].specId;
                    } catch (ex) {
                        p = skuMap[color + '&gt;' + skuName].specId;
                    }
                    if (p) {
                        arrayDataValue.push(p);
                    }
                }
            }
        } catch (ex) {
            console.info(ex.message);
        }

        return arrayDataValue.join(';');
    };

    /**
     * site 1688
     * @author vanhs
     * @time 14:49 17/03/2016
     * @description Hàm kiểm tra xem sản phẩm có một thuộc tính duy nhất hay không?
     * @returns {boolean}
     */
    this.checkHasOneProperty = function () {

        var params = this.getParamsOnPage();

        var totalSkuProps = 0;
        try {
            totalSkuProps = params.iDetailData.sku.skuProps.length;
        } catch (eSkuProps) {

        }

        if (totalSkuProps == 1) {
            return true;
        }
        return false;
    };

    /**
     * site 1688
     * @description Lấy ra giá sản phẩm dự trên khoảng giá và số lượng đặt mua
     * @returns {number}
     * @private
     */
    this._getPriceByPriceTable = function (price_table, quantity) {
        var p = 0;
        try {
            for (var i = 0; i < price_table.length; i++) {
                var begin = price_table[i].begin;
                var end = price_table[i].end;
                var price = price_table[i].price;
                if (end == "") {
                    if (quantity >= begin) {
                        p = price;
                    }
                } else {
                    if (quantity >= begin && quantity <= end) {
                        p = price;
                    }
                }
            }
        } catch (e) {
            console.error(e.message);
        }
        return p;
    };

    /**
     * site 1688
     * @description Hàm lấy priceTable từ dữ liệu trên trang, nếu ko lấy được thì tiến hành lấy trên dom HTML
     * @returns {Array}
     * @private
     */
    this._getPriceTable = function () {
        var price_table = [];

        //Lay du lieu tren trang
        var params = this.getParamsOnPage();
        try {
            var priceRange = params.iDetailData.sku.priceRange;
            if (priceRange != undefined) {
                for (var k = 0; k < priceRange.length; k++) {
                    var item = {};
                    item.begin = priceRange[k][0];
                    item.end = k + 1 == priceRange.length ? "" : parseInt(priceRange[k + 1][0]) - 1;
                    item.price = priceRange[k][1];
                    price_table.push(item);
                }
            }

        } catch (e) {
            console.error(e.message);
        }

        if (price_table.length) {
            return price_table;
        }

        //Lay du lieu tren dom HTML
        try {
            var $dom = document.querySelectorAll('tr.price > td');
            for (var i = 0; i < $dom.length; i++) {
                var range = $dom[i].getAttribute('data-range');
                if (range) {
                    price_table.push(JSON.parse(range));
                }
            }
        } catch (e) {
            console.error(e.message);
        }

        return price_table;
    };

    /**
     * site 1688
     * @description Lấy dữ liệu trên trang trước khi gửi lên server
     * @param item_data
     * @returns {*}
     */
    this.getDataSend = function (item_data) {

        try {
            var i = 0;


            var select_category = $('._select_category');
            var loaded_category = select_category.attr('data-loaded');

            var category_id = select_category.val();

            var category_name = $('._select_category option:selected').text();

            var brand = $('._brand_item').val();

            while (category_name.match(/-/i)) {
                category_name = category_name.replace(/-/i, "");
            }

            if (category_id === "-1") {
                category_name = $('._input_category').val();
            }

            if ((category_id === "0" || category_name == "") && loaded_category === "1") {
                alert("Yêu cầu chọn danh mục cho sản phẩm");
                this.common_tool.removeDisabledButtonCart();
                return false;
            }

            var error = 0;
            var item_id = this.getItemId();
            var item_title = this.getItemTitle();
            //  var item_image = this.getItemImage();
            var item_image = item_data[6] ? item_data[6] : this.getItemImage();
            var item_link = this.getItemLink();
            var shop_id = this.getShopId();
            var shop_name = this.getShopName();
            var linkshop = this.getShopLink();
            var seller_id = this.sellerId();

            //lay comment
            var price_table = this.getPriceTable();

            var step = this.getStep();

            var require_min = this.getRequireMin();

            var stock = this.getStock();
            try {
                if (stock <= 0) {
                    stock = item_data[1];
                }
            } catch (ex) {
                stock = 999999;
            }

            var wangwang = this.getWangwang();

            if (wangwang == '') {
                wangwang = shop_name;
            }

            var weight = this.getWeight();

            //GET ITEM_PRICE
            // if (!this.checkHasOneProperty()) {
            if (item_data != null && item_data.length > 0) {//tuann edit 10/7/2020
                try {
                    var item_price = item_data[4] ? item_data[4] : this.getPrice(item_data[0]);//edit by vanhs 02/07/2015

                    if (!$.isNumeric(item_price) || parseFloat(item_price) <= 0) {
                        error = 1;
                        item_price = this.getPriceInput();
                    }
                } catch (ex) {
                    console.warn(ex.message);
                    error = 1;
                    item_price = this.getPriceInput();
                }
            }

            var color_size_name = "";
            //  if (!this.checkHasOneProperty()) {
            if (item_data != null && item_data.length > 0) //tuann edit 10/7/2020
            {
                try {
                    color_size_name = item_data[3] + ";" + item_data[2];

                    if (color_size_name === 'undefined;undefined' || color_size_name === 'undefined') {
                        error = 1;
                        color_size_name = this.getPropertiesInput();
                    }
                } catch (ex) {
                    error = 1;
                    color_size_name = this.getPropertiesInput();
                }
            }


            try {

                var quantity = 0;
                //logic: Kiểm tra xem sản phẩm này có 1 thuộc tính hay có nhiều thuộc tính, nếu có 1 thuộc tính thì lấy số lượng trong ô input
                //if (this.checkHasOneProperty()) {
                //    var value = document.querySelectorAll(".amount-input")[0].value;
                //    if (value) {
                //        quantity = parseInt(value);
                //    }
                //} else {
                //    quantity = item_data[0];
                //}
                ///
                //Tuannn edit 9/7/2020
                if (item_data != null && item_data.length > 0) {
                    quantity = item_data[0];

                } else {
                    var value = document.querySelectorAll(".amount-input")[0].value;
                    if (value) {
                        quantity = parseInt(value);
                    }
                }

                if (!$.isNumeric(quantity) || parseInt(quantity) <= 0) {
                    error = 1;
                    quantity = this.getQuantityInput();
                }
            } catch (ex) {

                error = 1;
                quantity = this.getQuantityInput();
            }


            var comment = $('.unit-detail-order-action textarea').val();

            //begin tuann edit 10/7/2020
            //neu sp chi co 1 thuoc tinh
            //if (this.checkHasOneProperty()) {
            //    // console.log(this._getPriceTable());
            //    // console.log(quantity);
            //    item_price = this._getPriceByPriceTable(this._getPriceTable(), quantity);
            //    // console.log(item_price);
            //}
            
            if (item_data != null && item_data.length > 0) {
                item_price = item_data[4];
            }
            //end edit

            if (!$.isNumeric(quantity) || parseInt(quantity) <= 0 || !$.isNumeric(item_price) || parseFloat(item_price) <= 0) {
                var is_show = $('#_box_input_exception').attr("data-is-show");
                if (parseFloat(is_show) != 1) {
                    try {
                        alert("Chúng tôi không thể lấy được thông tin của sản phẩm, " +
                            "Bạn vui lòng điền thông tin để chúng tôi mua hàng cho bạn");

                        $("._close_tool").click();

                        var price = $('#_price');
                        price.focus();
                        if (parseFloat(item_price) > 0) {
                            price.val(item_price);
                        } else {
                            price.attr("placeholder", "Nhập tiền nhân dân tệ");
                        }
                        $('#_properties').val(color_size_name);

                        $('#_quantity').val(1);

                    } catch (ex) {

                    }
                    this.common_tool.showInputEx('alibaba');
                }
                this.common_tool.removeDisabledButtonCart();
                return null;
            }

            var location_sale = this.getLocationSale();

            var data_value = "";
            //if (!this.checkHasOneProperty()) {
            //    try {
            //        data_value = item_data[5];
            //    } catch (e) {

            //    }
            //}

            //tuannn edit 9/7/2020
            if (item_data != null && item_data.length > 0) {
                try {
                    data_value = item_data[5];
                } catch (e) {

                }
            }
            else {

            }

            var obj = {
                title_origin: $.trim(item_title),
                title_translated: $.trim(item_title),
                price_origin: item_price,
                price_promotion: item_price,
                price_table: price_table,
                data_value: data_value,

                property: color_size_name,
                property_translated: color_size_name,

                image_model: item_image,
                image_origin: item_image,
                seller_id: seller_id,
                shop_id: shop_id,
                shop_name: shop_name,
                wangwang: wangwang,
                quantity: error == 1 ? this.getQuantityInput() : quantity,
                require_min: require_min,
                stock: stock ? parseInt(stock) : 0,
                location_sale: location_sale,

                site: "1688",
                comment: comment,
                item_id: item_id,
                link_origin: item_link,
                outer_id: '',
                weight: weight,
                error: error,
                step: step,
                brand: brand,
                category_name: category_name,
                category_id: category_id,
                tool: "Addon",
                version: version_tool,
                linkshop: linkshop,///tuannn them ngay 7/6/2020 link cua shop
                is_translate: this.isTranslatePage() ? 1 : 0
            };
            return obj;

        } catch (e) {
            throw Error(e.message + "Error function getDataSend()");
        }
    };


    /**
     * Lay du lieu send
     * return Array 2 chi?u
     *  result[i]['amount'] = 0;
     result[i]['min_amount'] = 0;
     result[i]['size'] = 0;
     result[i]['color'] = 0;
     result[i]['price'] = 0;
     * data gom amount, color, size, min_amount
     **/
    this.get_item_data = function (exception) {

        var result = [];
        var input_data = [];
        var i = 0;
        var parent_obj = null;

        try {
            // Multi buy
            var tbl_wrap = document.getElementsByClassName('content-wrapper');
            var content = null;
            var color = null, hascolor = null;
            if (tbl_wrap.length > 0) {
                content = tbl_wrap[0].getElementsByClassName('content');
            }

            /**
             * Chú thích m?ng Result:
             * [0] => Quantity
             * [1] => Stock
             * [2] => Size
             * [3] => Màu s?c
             * [4] => price
             * [5] => data_value
             */
            //1 item la 1 size
            if (content != null && content.length>0 && exception == undefined) { // New 22/5/2013
                content = content[0];
                input_data = content.getElementsByClassName('amount-input'); // Get Số lượng đ?t
                if (input_data.length > 0) {

                    i = 0;
                    /**
                     * Có class 'leading': màu s?c n?m trong class leading
                     * danh sách phía dư?i là kích thước
                     * N?u không có class 'leading', không có kích thước, ch? có màu s?c
                     */
                    color = tbl_wrap[0].getElementsByClassName('leading');
                    if (color.length > 0) { // Has color, and size
                        color = color[0].getElementsByClassName('selected')[0].getAttribute('title').replace(/\n+/, '').replace(/\s+/, '');
                        for (var inc in input_data) {
                            if (isNaN(input_data[inc].value) || input_data[inc].value == 0) {
                                continue;
                            }
                            parent_obj = input_data[inc].parentNode.parentNode.parentNode.parentNode; // Find tr node
                            result[i] = new Array();
                            // Add data to arrayn
                            result[i][0] = input_data[inc].value;
                            result[i][1] = parent_obj.getElementsByClassName('count')[0].getElementsByTagName('span')[0].textContent.replace(/\s+/, "");
                            result[i][2] = color == "" ? "" : parent_obj.getElementsByClassName('name')[0].getElementsByTagName('span')[0].textContent.replace(/\s+/, '').replace(/\n+/, '');
                            result[i][3] = color == "" ? parent_obj.getElementsByClassName('name')[0].getElementsByTagName('span')[0].textContent.replace(/\s+/, '').replace(/\n+/, '') : color;
                            result[i][4] = parent_obj.getElementsByClassName('price')[0].getElementsByTagName('em')[0].textContent.replace(/\s+/, "");
                            result[i][5] = this.getDataValue(parent_obj);
                            i++;
                        }
                    } else { // Có màu s?c, ko có size

                        for (var inc in input_data) {
                            if (isNaN(input_data[inc].value) || input_data[inc].value == 0) {
                                continue;
                            }
                            parent_obj = input_data[inc].parentNode.parentNode.parentNode.parentNode; // Find tr node
                            result[i] = new Array();
                            // Add data to arrayn
                            result[i][0] = input_data[inc].value;
                            result[i][1] = parent_obj.getElementsByClassName('count')[0].getElementsByTagName('span')[0].textContent.replace(/\s+/, "");
                            result[i][2] = "";

                            var span_color = parent_obj.getElementsByClassName('name')[0].getElementsByTagName('span');
                            var img_color = parent_obj.getElementsByClassName('name')[0].getElementsByClassName('image');
                            result[i][3] = img_color.length > 0 ?
                                (img_color[0].getAttribute('title'))
                                :
                                span_color[0].textContent.replace(/\s+/, '').replace(/\n+/, '');
                            result[i][4] = parent_obj.getElementsByClassName('price')[0].getElementsByTagName('em')[0].textContent.replace(/\s+/, "");
                            result[i][5] = this.getDataValue(parent_obj);
                            i++;
                        }
                    }
                }
            } 
            else {
                //begin tuannn
                var tablesku = document.getElementsByClassName('table-sku');
                if (tablesku != null && tablesku.length > 0) {
                    var trsku = tablesku[0].getElementsByTagName("tr");
                    var divinfo = document.getElementsByClassName('list-info');
                    hascolor = document.getElementsByClassName('obj-leading');
                    var arrImg = [];
                    if (hascolor.length > 0) {
                        var divImg = hascolor[0].getElementsByClassName('unit-detail-spec-operator active');

                        for (var h = 0 ; h < divImg.length; h++) {
                            var namecolor = JSON.parse(divImg[h].getAttribute("data-unit-config"));
                            var imgs = JSON.parse(divImg[h].getAttribute("data-imgs"));
                            var objimg = null;
                            if (imgs != null) {
                                objimg = { color: namecolor.name, preview: imgs.preview, original: imgs.original };
                            }
                            else {
                                objimg = { color: namecolor.name, preview: "", original: "" };
                            }

                            arrImg[h] = objimg;
                        }

                    }
                    else {
                        var tds = tablesku[0].getElementsByClassName("name");
                        for (var h = 0 ; h < tds.length; h++) {
                            var span = tds[h].getElementsByTagName("span");
                            var namecolor = span[0].getAttribute("title");
                            var objimg = null;
                            if (namecolor != null) {
                                var imgs = JSON.parse(span[0].getAttribute("data-imgs"));
                                if (imgs != null) {
                                    objimg = { color: namecolor, preview: imgs.preview, original: imgs.original };
                                }
                                else {

                                    objimg = { color: namecolor.name, preview: "", original: "" };
                                }

                                arrImg[h] = objimg;
                            }
                            else {
                                namecolor = span[0].innerHTML;
                                objimg = { color: namecolor, preview: "", original: "" };
                                arrImg[h] = objimg;
                            }

                        }
                    }
                    if (divinfo.length > 0) {
                        var tableInfo = divinfo[0].getElementsByTagName("table");
                        if (tableInfo.length > 0) {
                            var tr = tableInfo[0].getElementsByTagName("tr");
                            var uls = tableInfo[0].getElementsByTagName('ul');
                            var d = 0;
                            if (uls.length > 0) {
                                for (var i = 0; i < uls.length; i++) {
                                    var lis = uls[i].getElementsByTagName('li');
                                    var color1;
                                    color1 = tr[i].getAttribute("data-name");

                                    for (var j = 0; j < lis.length; j++) {

                                        var item = [];
                                        var quantity, stock;
                                        var size = "", datavalue, imgOrigin;
                                        var price = 0;
                                        var data_sku = JSON.parse(lis[j].getAttribute("data-sku-config"));
                                        quantity = data_sku.amount;
                                        stock = data_sku.max;
                                        if (hascolor.length > 0||data_sku.skuName.length>0) {
                                            size = data_sku.skuName;
                                        }
                                        var price_span = null;
                                        //duyet tr in table-sku
                                        for (var t=0;t<trsku.length;t++) {
                                            var trskuconfig = JSON.parse(trsku[t].getAttribute("data-sku-config"));
                                            if (size.length > 0 && trskuconfig.skuName === size || color1 === trskuconfig.skuName) {
                                                price_span = trsku[t].getElementsByClassName('price');

                                                if (price_span != null && (typeof price_span === 'object' && price_span.length > 0)) {
                                                    price = price_span[0].getElementsByTagName('em')[0].textContent.replace(/\s+/, "");
                                                } else {
                                                    price = 0;
                                                }
                                                datavalue = this.getDataValueNew(trsku[t], color1);
                                                break;

                                            }
                                        }
                                        item[0] = quantity;
                                        item[1] = stock;
                                        item[2] = size;
                                        item[3] = color1;
                                        item[4] = price;
                                        item[5] = datavalue;
                                        item[6] = "";
                                        for (var c = 0; c < arrImg.length; c++) {
                                            if (color1 == arrImg[c].color) {
                                                item[6] = arrImg[c].original;
                                                break;
                                            }
                                        }
                                        result[d] = item;
                                        d++;
                                    }

                                    
                                }

                            }
                        }
                    }
                }
                else
                {
        
                    var divAnh = document.getElementsByClassName('tab-content-container');
                    var arrImg = [];
                    if (divAnh != null && divAnh.length > 0) {
                        var liActive = divAnh[0].getElementsByClassName('tab-trigger active');
                        if(liActive.length>0)
                        {
                            var imgs = JSON.parse(liActive[0].getAttribute("data-imgs"));
                            var namecolor = JSON.parse(liActive[0].getAttribute("data-unit-config"));
                            var colorname = "";
                            if (namecolor != null)
                            {
                                colorname = namecolor.name;
                            }

                            var objimg = null;
                            if (imgs != null) {
                                objimg = { color: colorname, preview: imgs.preview, original: imgs.original };
                            }
                            else {
                                objimg = { color: colorname, preview: "", original: "" };
                            }

                            arrImg[h] = objimg;
                        }
                    }
                    //d-tab-purchasing class div số lượng
                    var divSL =  document.getElementsByClassName('d-tab-purchasing');
                    var quantity, stock="";
                    var size = "", color1="", datavalue="", imgOrigin;
                    var price = 0,totalsPrice=0;
                    if(divSL.length>0)
                    {
                        var tagp = divSL[0].getElementsByClassName('ms-yh');//tag p
                        if(tagp.length>0)
                        {
                            var tagSpan = tagp[0].getElementsByClassName('amount');
                            var tabprice = tagp[0].getElementsByClassName('price');
                            if (tabprice.length > 0)
                            {
                                totalsPrice = tabprice[0].innerHTML;
                            }
                            if(tagSpan.length>0)
                            {
                                quantity = tagSpan[0].innerHTML;
                                price = parseFloat(totalsPrice) / parseFloat(quantity);
                                stock = quantity;
                                var item = [];
                                if (quantity > 0)
                                {
                                    if (quantity > 0) {
                                        price = this.getPrice(quantity);
                                    }
                                    item[0] = quantity;
                                    item[1] = stock;
                                    item[2] = size;
                                    item[3] = color1
                                    item[4] = price;
                                    item[5] = datavalue;
                                    item[6] = "";
                                    for (var c = 0; c < arrImg.length; c++) {

                                        item[6] = arrImg[c].original;
                                  
                                        break;
                                    }
                                }
                                else {
                                    item = this.LayThongTinNhapTay();
                                    for (var c = 0; c < arrImg.length; c++) {

                                        item[6] = arrImg[c].original;

                                        break;
                                    }
                                }

                                result[0] = item;
                            }
                        }
                    }
                    else {
                        quantity = document.getElementById('_quantity').value;
                        price = document.getElementById('_price').value;
                        var _properties = document.getElementById('_properties').value;
                        if (_properties.length > 0 && _properties.indexOf(';') > 0)
                        {
                            var arr=_properties.split(';');
                            color1 = arr[0];
                            size = arr[1];
                        }
                        else if (_properties.length > 0) {
                            color1 = _properties;
                        }
                        var item = [];
                        item[0] = quantity;
                        item[1] = stock;
                        item[2] = size;
                        item[3] = color1
                        item[4] = price;
                        item[5] = datavalue;
                        item[6] = "";
                        for (var c = 0; c < arrImg.length; c++) {

                            item[6] = arrImg[c].original;

                            break;
                        }

                        result[0] = item;
                    }
                }
            }
       
    
                //end tuannn
                /**
                     * Có class 'leading': màu s?c n?m trong class leading
                     * danh sách phía duoi là kích thước
                     * Neu không có class 'leading', không có kích thước, chi có màu sac
                     */
                /**
                 var obj_sku = document.getElementsByClassName('obj-sku');
                 var obj_amount = document.getElementsByClassName('obj-amount');
                 if (obj_sku != null && (typeof obj_sku === 'object' && obj_sku.length > 0)) {
                     input_data = obj_sku[0].getElementsByClassName("amount-input");
                 } else if (obj_amount != null && (typeof obj_amount === 'object' && obj_amount.length > 0)) {
                     input_data = obj_amount[0].getElementsByClassName("amount-input");
                 }
 
                 if (input_data.length > 0) {
 
                     i = 0;
                     
                     color = document.getElementsByClassName('obj-leading');
                     if (color.length > 0) { // Has color, and size
                         color = color[0].querySelectorAll('a.selected'); //
                         if (color != null) {
                             color = color[0].getAttribute('title').replace(/\n+/, '').replace(/\s+/, '');
                         }
                         for (var inc in input_data) {
                             if (isNaN(input_data[inc].value) || input_data[inc].value == 0) {
                                 continue;
                             }
                             parent_obj = input_data[inc].parentNode.parentNode.parentNode.parentNode; // Find tr node
                             result[i] = this.getProperties(parent_obj, input_data[inc], color);
 
                             i++;
                         }
                     } else { // Có màu sac, ko có size
                         for (var inc in input_data) {
                             if (isNaN(input_data[inc].value) || input_data[inc].value == 0) {
                                 continue;
                             }
                             parent_obj = input_data[inc].parentNode.parentNode.parentNode.parentNode; // Find tr node
                             result[i] = this.getProperties(parent_obj, input_data[inc], "");
                             i++;
                         }
                     }
                 }
                 **/
             return result;
            }
         catch (e) {
            throw Error(e + "Error function get_item_data()");
        }
    };

    this.LayThongTinNhapTay =function()
    {
        var color1 = "", datavalue="";
        var size = "";
        var stock = "";
       var  quantity = document.getElementById('_quantity').value;
       var price = document.getElementById('_price').value;      
        var _properties = document.getElementById('_properties').value;
        if (_properties.length > 0 && _properties.indexOf(';') > 0) {
            var arr = _properties.split(';');
            color1 = arr[0];
            size = arr[1];
        }
        else if (_properties.length > 0) {
            color1 = _properties;
        }
        stock = quantity;
        var item = [];
        item[0] = quantity;
        item[1] = stock;
        item[2] = size;
        item[3] = color1
        item[4] = price;
        item[5] = datavalue;
        item[6] = "";
        return item;
    }

    this.getProperties = function (tr_prop, input_data, color) {
        try {
            var content = null;
            var count_span = null;
            var size_span = null;
            var price_span = null;
            var result = [];
            var span = null;
            result[0] = input_data.value;
            count_span = tr_prop.getElementsByClassName('count');
            if (count_span != null && (typeof count_span === 'object' && count_span.length > 0)) {
                result[1] = count_span[0].getElementsByTagName('span')[0].textContent.replace(/\s+/, "");
            } else {
                result[1] = 999999;//stock
            }
            size_span = tr_prop.getElementsByClassName('name');
            if (size_span != null && (typeof size_span === 'object' && size_span.length > 0 && color != "")) {
                span = size_span[0].getElementsByTagName('span')[0];
                if (this.common_tool.hasClass(span, "image")) {
                    result[2] = span.getAttribute("title").
                    replace(/\s+/, '').replace(/\n+/, '');
                } else {
                    result[2] = span.textContent.replace(/\s+/, '').replace(/\n+/, '');
                }
            } else {
                result[2] = "";
            }

            if (size_span != null && (typeof size_span === 'object' && size_span.length > 0) && color == "") {
                span = size_span[0].getElementsByTagName('span')[0];
                if (this.common_tool.hasClass(span, "image")) {
                    result[3] = span.getAttribute("title").
                    replace(/\s+/, '').replace(/\n+/, '');
                } else {
                    result[3] = span.textContent.replace(/\s+/, '').replace(/\n+/, '');
                }
            } else {
                result[3] = color;
            }

            price_span = tr_prop.getElementsByClassName('price');

            if (price_span != null && (typeof price_span === 'object' && price_span.length > 0)) {
                result[4] = price_span[0].getElementsByTagName('em')[0].textContent.replace(/\s+/, "");
            } else {
                result[4] = 0;
            }

            result[5] = this.getDataValue(tr_prop);

            return result;
        } catch (ex) {
            throw Error(ex + "Error function getProperties()");
        }

    };

    // Hàm l?y b?ng Giá
    this.getPriceTable = function () {
        //-- get price amount
        var price_table = [];

        var price_range = null;

        var pri = [];

        var detail_price = null;

        var tr_price = null;

        var i = 0;

        try {
            detail_price = document.getElementById("mod-detail-price");
            if (detail_price != null) { //price by amount

                // var price_container = detail_price.getElementsByClassName("d-content");//tuannn edit
                var price_container = detail_price.getElementsByClassName("unit-detail-price-amount");

                if (price_container != null && price_container.length > 0) {
                    tr_price = price_container[0].getElementsByTagName("tr");
                    if (tr_price.length > 0) {
                        for (i = 0; i < tr_price.length; i++) {
                            pri = tr_price[i];
                            price_range = JSON.parse(pri.getAttribute("data-range"));
                            if (price_range != null) {
                                price_table.push(price_range);
                            }

                        }
                    }
                } else {
                    tr_price = detail_price.querySelectorAll("tr.price td");
                    if (tr_price != null && tr_price.length > 0) {
                        for (var j = 0; j < tr_price.length; j++) {
                            try {
                                pri = tr_price[j];
                                var range = pri.getAttribute("data-range");
                                if (range !== "" && range != null) {
                                    price_range = JSON.parse(range);
                                    price_table.push(price_range);
                                }
                            } catch (e) {

                            }

                        }
                    }
                }
            }
            else {
                var price = {};
                var price_common = document.getElementsByClassName("offerdetail_common_beginAmount");

                // One price
                if (price_common.length > 0) {
                    price.begin = price_common[0].getElementsByTagName('p')[0].textContent;

                    price.begin = price.begin.match(/[0-9]+/)[0];
                    // get prices
                    detail_price = document.getElementsByClassName("unit-detail-price-display")[0].textContent.split('-');
                    var price_display = {};
                    for (i = 0; i < detail_price.length; i++) {
                        price_display[i] = detail_price[i].match(/[0-9]*[\.]?[0-9]+/g).join('');
                    }
                    price.price = price_display;
                    price.end = "";
                    price_table.push(price);
                }
                else {
                    var params = this.getParamsOnPage();
                    var iDetailData = params.iDetailData;
                    var priceRange = iDetailData.sku.priceRange == undefined ? iDetailData.sku.priceRangeOriginal : iDetailData.sku.priceRange;

                    if (typeof priceRange != "undefined") {
                        for (var ii = 0; ii < priceRange.length; ii++) {

                            var qRange = priceRange[ii][0];
                            var pRange = priceRange[ii][1];


                            if (ii < priceRange.length - 1) {
                                var obj = {
                                    begin: qRange,
                                    end: (priceRange[ii + 1][0] - 1),
                                    price: pRange
                                }
                                price_table.push(obj);
                            } else {
                                var obj = {
                                    begin: qRange,
                                    end: "",
                                    price: pRange
                                }
                                price_table.push(obj);
                            }

                        }
                    }
                }
                
            }
        } catch (ex) {
            throw Error(e + "Error function getPriceTable()");
        }
        return JSON.stringify(price_table);
    };

    this.getRequireMin = function () {
        var require_min = 1;
        try {
            var params = this.getParamsOnPage();
            require_min = params.iDetailConfig.beginAmount;
        } catch (e) {
            try {
                var div_unit = document.getElementsByClassName("unit-detail-freight-cost");
                if (div_unit.length > 0) {
                    var data_config = div_unit[0].attr('data-unit-config');
                    data_config = $.parseJSON(data_config);
                    require_min = data_config.beginAmount;
                }
            } catch (ex) {
                require_min = 1;
            }

        }
        return require_min;
    };

    /**
     * get Step item
     * @returns {number}
     */
    this.getStep = function () {
        try {
            var step = 1;
            var purchasing_multiple = document.getElementsByClassName('mod-detail-purchasing-multiple');
            var purchasing_single = document.getElementsByClassName('mod-detail-purchasing-single');
            var purchasing_quotation = document.getElementsByClassName('mod-detail-purchasing-quotation');

            var purchasing = null;

            if (purchasing_multiple.length > 0 && purchasing_multiple != null) {
                purchasing = JSON.parse(purchasing_multiple[0].getAttribute("data-mod-config"));
                step = purchasing.min;
            } else if (purchasing_single.length > 0 && purchasing_single != null) { //SINGLE MODE
                purchasing = JSON.parse(purchasing_single[0].getAttribute("data-mod-config"));
                step = purchasing.wsRuleNum;
            } else if (purchasing_quotation.length > 0 && purchasing_quotation != null) {
                step = 0;
            } else {
                step = 1;
            }
            if (step == '' || step == null) {
                step = 1;
            }

            return step;
        } catch (ex) {
            throw Error(ex + "Error function getStep()");
        }

    };

    // Get price by item amout
    this.getPrice = function (quantity) {
        try {
            var price = 0;
            quantity = parseInt(quantity);

            var price_table = this.getPriceTable();

            price = this.getPriceByPriceTable(price_table, quantity);

            if (parseFloat(price) > 0) {
                return this.common_tool.processPrice(price);
            }

            /* n?u l?y theo mod-detail-price-sku*/
            var span_price = document.getElementsByClassName('mod-detail-price-sku');
            if (span_price != null && span_price != "" && span_price != "undefined") {
                span_price = span_price[0];
            }

            if (span_price != null && span_price != "" && span_price != "undefined") {
                var e_num = span_price.getElementsByTagName('span')[2].textContent;
                var p_num = span_price.getElementsByTagName('span')[3].textContent;
                price = e_num + p_num;
                return this.common_tool.processPrice(price);
            }
            if (parseFloat(price) == 0 || typeof price === 'undefined') {
                var span_priceNow = document.getElementsByClassName('price-now');
                if (span_priceNow.length > 0) {
                    var temp = span_priceNow[0].innerText;
                    if (temp.indexOf('-') > 0) {
                        var arrtp = temp.split('-');
                        if (arrtp.length > 0) {
                            price = arrtp[0];
                        }

                    }
                    else {
                        price = temp;
                    }

                }

            }

            var div_price_content = document.getElementsByClassName("price-content");
            if (div_price_content.length > 0) {
                var span_price_num = div_price_content[0].getElementsByClassName("price-num");
                price = span_price_num[0].innerText;
            }

            /* n?u l?y theo mod-detail-price*/
            var div_prices = document.getElementById('mod-detail-price');

            //if (div_prices == null) {
            //    return this.common_tool.processPrice(price);
            //}
            // lay theo table, kieu moi
            var price_content = $('#mod-detail-price table');

            if (price_content != null && price_content != "" && price_content != "undefined") {
                var td = price_content.find('tr[class="price"] td');

                /* kieu khoang Giá 2-2000*/
                if (parseFloat(price) == 0 || typeof price === 'undefined') {
                    $('.table-sku tr .amount-input').each(function () {
                        var value = $(this).val();
                        if (value > 0) {
                            var doc = $(this).parent().parent().parent().parent();

                            var prop_to_compare = $.trim(doc.find('td.name').text());
                            price = doc.find('td.price .value').text();
                        }
                    });
                }


                /* ket thuc kieu cu chuoi*/

                if (parseFloat(price) == 0 || typeof price === 'undefined') {
                    var price_about = $('.price-original-sku').find('span:nth-child(2)');
                    var check = price_about.html();
                    if (check && check != null && check != 'undefined') {
                        price = price_about.text();
                    } else {
                        price = $('.price-original-sku').find('span:nth-child(5)').text();
                    }
                }
                if (parseFloat(price) == 0 || typeof price === 'undefined') {
                    var tr = $('.unit-detail-price-amount').find('tr');
                    var d = $('.amount-input').first();
                    var quantity = d.val();

                    for (var j = 0; j < tr.length; j++) {
                        var price_sku = $(tr[j]).attr('data-range');
                        price_sku = $.parseJSON(price_sku);
                        if (quantity < price_sku.begin) {
                            price_sku.begin = 1;
                        }
                        if (price_sku.end == 0 || price_sku.end == '') {
                            price_sku.end = 5000;
                        }
                        if (quantity >= price_sku.begin
                            && quantity <= price_sku.end) {

                            price = price_sku.price;
                            break;
                        }
                    }
                }

                return this.common_tool.processPrice(price);
            }

            var span_prices = div_prices.getElementsByTagName("span");
            if (span_prices == null || span_prices == '') {
                return this.common_tool.processPrice(price);
            } else {


                var quan_compare = '';
                for (var i = 0; i < span_prices.length; i++) {
                    var str = span_prices[i].textContent;
                    if ((str.indexOf('-') != -1) || (str.indexOf('?') != -1)) {
                        if (str.indexOf('-') != -1) {
                            quan_compare = str.split('-');
                            price = span_prices[i + 1].textContent + '' + span_prices[i + 2].textContent;
                            if (quantity >= quan_compare[0] && quantity <= quan_compare[1]) {
                                break;
                            }
                        }
                        if (str.indexOf('?') != -1) {
                            price = span_prices[i + 1].textContent + '' + span_prices[i + 2].textContent;
                        }
                    }
                }
            }
            return this.common_tool.processPrice(price);
        }
        catch (e) {
            throw Error(e + "Error function getPrice()");
        }
    };


    this.getPriceByPriceTable = function (price_table, quantity) {
        var price = 0;
        try {
            price_table = JSON.parse(price_table);
            if (typeof price_table === 'object') {
                for (var o in price_table) {
                    if (price_table[o] != null) {
                        var begin = price_table[o].begin;
                        var end = price_table[o].end;

                        if ((begin <= quantity && quantity <= end) ||
                            (begin <= quantity && (parseInt(end) == 0 || end == null || end == "")) || quantity <= begin) {
                            price = price_table[o].price;
                            break;
                        } else {
                            price = price_table[o].price;
                        }
                    }
                }
            }
        } catch (e) {
            price = 0;
        }

        return price;
    };

    /**
     * @author vanhs
     * @description 1688 | Lấy thông tin sellerId
     * @time 15:05 07/11/2015
     * @returns {string}
     */
    this.sellerId = function () {
        var sellerId = "";
        try {
            var unitConfig = document.querySelectorAll(".apply-account")[0].getElementsByTagName("a")[0].getAttribute("data-unit-config");
            unitConfig = JSON.parse(unitConfig);
            sellerId = unitConfig.sellerId;
            //console.info("sellerId: " + sellerId);
        } catch (e) {
            //console.info("1688 | không lấy được thông tin sellerId");
            //console.warn(e.message);
        }
        return sellerId;
    };
    /**
    1688
    **/
    this.getShopLink = function () {
        var shop_link = "";
        var diblogosub = document.getElementsByClassName('logo');
        if (diblogosub.length) {
			var tagA=diblogosub[0].getElementsByTagName('a');
			if(tagA.length>0)
			{
				shop_link =tagA[0].getAttribute('href');
			}
            //shop_link = diblogosub[0].getElementsByTagName('a')[0].getAttribute('href');
        }
        return shop_link;
    };
    /**
     * SITE 1688
     * Lấy thông tin shop_name
     * @returns {string}
     */
    this.getShopName = function () {
        var shop_name = '';
        try {
            var dom = document.getElementsByName("sellerId");
            if (dom.length) {
                shop_name = dom[0].value;
            }

            if (!shop_name) {
                dom = document.getElementsByClassName('contact-div');
                if (dom.length) {
                    shop_name = dom[0].getElementsByTagName('a')[0].innerHTML;
                }
            }

            if (!shop_name) {
                dom = document.querySelectorAll("meta[property='og:product:nick']")[0].getAttribute("content");
                dom = dom.split(';');
                dom = dom[0];
                dom = dom.split('=');
                shop_name = dom[1];
            }
        } catch (e) {

        }
        //console.info('shop_name: ' + shop_name);
        return shop_name;
    };

    /**
     * SITE 1688
     * Lấy thông tin shop_id
     * @returns {string}
     */
    this.getShopId = function () {
        /**
         * Dùng sellerId để làm key
         */

        //==== step 1: Lấy thông tin trên dom
        try {
            var $dom = document.querySelectorAll('.apply-btn');
            var dataUnitConfigString = $dom[0].getAttribute('data-unit-config');
            var dataUnitConfigJSON = JSON.parse(dataUnitConfigString);
            return dataUnitConfigJSON.sellerId;
        } catch (e) {

        }
        //==== step 2: Lấy thông tin dữ liệu trả về trên trang
        try {
            var params = this.getParamsOnPage();
            return params.iDetailConfig.userId;
        } catch (e) {

        }

        return '';
    };

    /**
     * SITE 1688
     * Lấy biến itemId
     * @returns {number}
     */
    this.getItemId = function () {
        var offerid = 0;
        try {
            try {
                offerid = iDetailConfig.offerid;
            } catch (e) {
                var link = window.location.href;
                var item_id = link.split('.html')[0];
                offerid = item_id.split('offer/')[1];
            }
        } catch (ex) {

        }
        return offerid;
    };

    /**
     * Get stock item
     * @returns {number}
     */
    this.getStock = function () {
        var stock = 0;

        if (this.checkHasOneProperty()) {
            try {
                var json = document.querySelectorAll(".mod-detail-purchasing")[0].getAttribute("data-mod-config");
                stock = JSON.parse(json).max;
            } catch (ex) {

            }
        } else {
            try {
                var params = this.getParamsOnPage();
                stock = params.iDetailData.sku.canBookCount;
            } catch (ex) {

            }
        }

        return stock;
    };

    /**
     * SITE 1688
     * Lấy tiêu đề sản phẩm
     * @returns {string}
     */
    this.getItemTitle = function () {
        var item_title = '';
        try {
            var dom = document.getElementsByName("offerTitle");
            if (dom.length) {
                item_title = dom[0].value;
            }

            if (!item_title) {
                dom = document.getElementById('mod-detail-hd');
                if (dom) {
                    item_title = dom.getElementsByTagName('h1')[0].innerHTML;
                }
            }
        } catch (ex) {

        }
        //console.info('item_title: ' + item_title);
        return item_title;
    };

    /**
     * SITE 1688
     * Lấy hình ảnh
     * @returns {string}
     */
    this.getItemImage = function () {
        var item_image = "";

        //Lấy ảnh thuộc tính khi người dùng tiến hành chọn ảnh
        try {
            var $dom = document.querySelectorAll(".list-leading a.image.selected img");
            var $dom2 = document.querySelectorAll("li.tab-trigger.active img");
            if ($dom.length) {
                item_image = $dom[0].getAttribute("src");
            } else if ($dom2.length) {
                item_image = $dom2[0].getAttribute("src");
            }
        } catch (exGetImageChoose) {

        }
        //Lấy ảnh mặc định khi người dùng không chọn gì cả
        try {
            if (!item_image) {
                var $dom3 = document.querySelectorAll(".list-leading a.image img");
                var $dom4 = document.querySelectorAll("li.tab-trigger img");
                if ($dom3.length) {
                    item_image = $dom3[0].getAttribute("src");
                } else if ($dom4.length) {
                    item_image = $dom4[0].getAttribute("src");
                }
            }
        } catch (exGetImageDefault) {

        }

        if (item_image) {
            item_image = this.common_tool.resizeImage(item_image);
        }

        //console.info('item_image: ' + item_image);
        return item_image;
    };

    this.getItemLink = function () {
        return window.location.href;
    };

    this.getWangwang = function () {
        try {

            var wangwang = "";

            try {
                var a_contact = $('.contact-div .alitalk');

                if (a_contact != null && a_contact.length > 0) {
                    var data_alitalk = a_contact.attr('data-alitalk');

                    if (typeof data_alitalk != 'object') {
                        data_alitalk = $.parseJSON(data_alitalk);
                    }

                    wangwang = data_alitalk.id;
                } else {
                    wangwang = eService.contactList[0].name;
                }

            } catch (e) {
                wangwang = "";
            }

            return wangwang;
        } catch (e) {
            return "";
        }
    };

    this.getWeight = function () {

        var weight = 0;
        try {
            var unit_detail = document.getElementsByClassName("unit-detail-freight-cost");
            if (unit_detail.length > 0) {
                var carriage = JSON.parse(unit_detail[0].getAttribute("data-unit-config"));
                weight = !isNaN(carriage.unitWeight) ? carriage.unitWeight : 0;
            }
        } catch (e) {
            weight = 0;
        }
        return parseFloat(weight);
    };
    this.taobaoSkuId = function (size, color) {
        var skuid;
        var unskuid;

        if (size && color) {
            skuid = ';' + size + ';' + color + ';';
            unskuid = ';' + color + ';' + size + ';';
        } else if (color) {
            skuid = ';' + color + ';';
            unskuid = ';' + color + ';';
        } else if (size) {
            skuid = ';' + size + ';';
            unskuid = ';' + size + ';';
        }

        var tmp_pro = retrieveWindowVariablesTaobaoSku();

        if (typeof tmp_pro === 'object') {
            if (typeof tmp_pro.valItemInfo !== 'undefined' && typeof tmp_pro.valItemInfo.skuMap
                !== 'undefined') {
                tmp_pro = tmp_pro.valItemInfo.skuMap;

                if (typeof tmp_pro === 'object') {
                    $.each(tmp_pro, function (key, value) {
                        console("key skuid:" + key);
                        if (key == skuid) {
                            skuid = value.skuId;
                        } else if (key == unskuid) {
                            skuid = value.skuId;

                        }
                    });
                } else {
                    skuid = null;
                }
            } else {
                skuid = null;
            }
        }

        return skuid;
    }

    return true;
};

var common_tool = new CommonTool();

var origin_site = common_tool.getOriginSite();
var addon_tool = new AddonTool();

var SessionStorage = {
    set: function (key, value) {
        window.sessionStorage.setItem(key, JSON.stringify(value));
    },
    get: function (key) {
        var saved = window.sessionStorage.getItem(key);
        saved = JSON.parse(saved);
        return saved;
    },
    destroy: function (key) {
        window.sessionStorage.removeItem(key);
    }
};

var Action = {
    afterGetExchangeRate: function (request) {
        console.info("afterGetExchangeRate");
        if (request.response) {
            exchange_rate = parseFloat(request.response).toFixed(0);
            SessionStorage.set("exchange_rate", exchange_rate);
        } else {
            exchange_rate = "3560";
        }
        if (exchange_rate) {
            $("._addon-exchange-text").text(exchange_rate + "đ");
        }
        start();
    },

    afterAddToFavorite: function (request) {
        console.info("afterAddToFavorite");
        alert("Lưu sản phẩm thành công!");
    },

    afterTranslate: function (request) {
        console.info("afterTranslate");
        try {
            var object = new factory(cart_url, add_to_cart_url);
            var result = $.parseJSON(request.response);
            object.set_translate({ title: result['data_translate'] });
        } catch (ex) {
            console.warn(ex.message);
        }
    },

    afterGetCategory: function (request) {
        var data = request.response;
        var option = '<option value="0">Chọn danh mục</option>';

        var ct = new CommonTool();
        var category_id = ct.getCategorySelected();

        for (var i = 0; i < data.length; i++) {
            var catalog = data[i];
            option += '<option value="' + catalog.id + '"';
            if (parseInt(category_id) === parseInt(catalog.id)) {
                option += ' selected="selected"';
            }
            option += '>';
            for (var j = 0; j < catalog.level; j++) {
                if (parseInt(catalog.level) > 1) {
                    option += "&#8212;";
                }
            }
            option += catalog.name + "</option>";
        }
        option += '<option value="-1">Khác</option>';

        $('._select_category').html(option);
        $('._select_category').attr('data-loaded', 1);//loaded
    },

    afterAddToCart: function (request) {
        if (request.response) {
            console.log(request.response);

            var common_tool = new CommonTool();
            common_tool.removeDisabledButtonCart();
            if (request.response.html) {
                $('body').append(request.response.html);
            } else {
                $('body').append(request.response);
            }

            // if(request.response.success){
            //
            //     alert('Them san pham vao gio hang thanh cong.');
            // }
        } else {
            alert("Không kết nối được tới máy chủ, xin quý khách thử lại sau");
            return;
        }
    },

    request: function (params) {
        return $.ajax({

            contentType: 'application/x-www-form-urlencoded',
            xhrFields: {
                withCredentials: true
            },
            headers: { 'X-Requested-With': 'XMLHttpRequest' },

            url: params.url,
            type: params.type == undefined ? 'GET' : params.type,
            data: params.data == undefined ? {} : params.data
        });
    }
};

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        switch (request.action) {
            case "afterGetExchangeRate":
                Action.afterGetExchangeRate(request);
                break;

            case "afterAddToCart":
                Action.afterAddToCart(request);
                break;

            case "afterGetCategory":
                Action.afterGetCategory(request);
                break;

            case "afterTranslate":
                Action.afterTranslate(request);
                break;

            case "afterAddToFavorite":
                Action.afterAddToFavorite(request);
                break;
            case "afterSetTranslateValue":
                window.location.reload();
                break;
            case "afterGetTranslateValue":
                translate_value_bg = request.value;
                load_template();
                break;

            default:
                break;

        }
    }
);

function start() {
    var str = window.location.href;
    if (!(str.match(/item.taobao/) || str.match(/detail.ju.taobao.com/) || str.match(/detail.tmall/) || str.match(/detail.1688/)
        || str.match(/.1688.com\/offer/)
        || str.match(/.tmall.hk/)
        || str.match(/.yao.95095.com/)
        || str.match(/tmall.com\/item\//) || str.match(/taobao.com\/item\//))) {
        return false;
    }

    document.querySelectorAll("._addon-template")[0].style.display = 'block';

    var object = new factory(cart_url, add_to_cart_url);
    object.init();

    var common = new CommonTool();

    $(document).on('change', '._select_category', function () {
        var catalog_id = $(this).val();
        $('._select_category').val(catalog_id);
        common_tool.setCategorySelected(catalog_id);
        var input_cate = $('._input_category');
        var $panel_category_other = $("._category-other");
        if (catalog_id === "-1") {
            $panel_category_other.removeClass("hidden");
            input_cate.show();
            input_cate.focus();
        } else {
            $panel_category_other.addClass("hidden");
            input_cate.hide();
        }
    });

    $(document).on('keyup', '._brand_item', function () {
        var brand = $(this).val();
        $('._brand_item').val(brand);
    });


    $(document).on('keyup', '._comment_item', function () {
        var comment = $(this).val();
        $('._comment_item').val(comment);
    });

    $(document).on('keyup', '._input_category', function () {
        var category = $(this).val();
        $('._input_category').val(category);
    });

    $(document).on('click', '._addToCart', function () {
        var catID = $("#tbe-down-categories").val();
        if (catID === 0 || catID === "0") {
            alert("Yêu cầu chọn danh mục cho sản phẩm");
        }
        else {
            var object = new factory(cart_url, add_to_cart_url);
            common_tool.addDisabledButtonCart();
            // if(document.getElementsByTagName("html")[0].classList.contains("translated-ltr") == true){
            //     alert("Yêu cầu tắt google translate để tiếp tục đặt hàng");
            //     this.common_tool.removeDisabledButtonCart();
            //     return false;
            // }
            if (origin_site.match(/1688.com/)) {
                object.add_to_cart();
            } else {
                addon_tool.AddToCart();
            }
            //tuannn set arrdata_send  empty
            arrdata_send = [];
        }


    });

    $(document).on('click', '#load_exchange_rate', function () {
        SessionStorage.destroy('exchange_rate');
        window.location.reload();
    });

    $(document).on('click', '._is_translate', function () {
        var value = $(this).is(":checked") ? 1 : 0;
        chrome.runtime.sendMessage({
            action: "setTranslateValue",
            value: value,
            callback: 'afterSetTranslateValue'
        });
    });

    $(document).on('click', '._close-warning-ao', function () {
        $("._alert-shop-credible").remove();
    });

    $('._close_tool').click(function () {
        $('._addon-wrapper').hide();
        $("._div-block-price-book").fadeIn();
    });

    $('._minimize_tool').click(function () {
        $('._addon-wrapper').fadeIn();
        $("._div-block-price-book").hide();
    });

    $('#txt-category').change(function () {
        var value = $(this).val();
        if (parseInt(value) == -1) {
            $('.category-other').show();
            $('.category-other input').focus();
        } else {
            $('.category-other').hide();
        }
    });

    $(document).on("click", "#_add-to-favorite", function () {
        var site = common.getHomeLand();
        var title = site == "1688" ? object.getItemTitle() : object.getTitleOrigin();
        var avatar = site == "1688" ? object.getItemImage() : object.getImgLink();
        var item_id = site == "1688" ? object.getItemId() : object.getItemID();
        var price_promotion = 0;
        var price_origin = 0;

        if (site == "1688") {

            try {

                var scripts = document.querySelectorAll("script");
                for (var i = 0; i < scripts.length; i++) {
                    var html = scripts[i].textContent;
                    var res = html.search("iDetailConfig");
                    if (res != -1) {
                        eval(html);

                        price_promotion = iDetailConfig.refPrice;
                        price_origin = iDetailConfig.refPrice;

                        break;
                    }
                }
            } catch (e) {

                console.warn(e.message);
            }

        } else {
            price_origin = object.getOriginPrice();
            price_promotion = object.getPromotionPrice();
        }

        var data = {
            avatar: avatar ? decodeURIComponent(avatar) : "",
            item_id: item_id,
            link: window.location.href,
            site: site,
            title: title,
            price: price_promotion > 0 ? price_promotion : price_origin
        };

        //data = JSON.stringify(data);

        if (site_using_https) {
            Action.request({
                url: add_to_favorite_url,
                type: "POST",
                data: { send_data: data }
            }).done(function (response) {
                Action.afterAddToFavorite({ response: response });
            });
        } else {
            chrome.runtime.sendMessage({
                action: "addToFavorite",
                url: add_to_favorite_url,
                //url: "http://localhost/seudo/www_html/customer/favoriteLink/saveLink",
                data: { send_data: data },
                method: 'POST',
                callback: 'afterAddToFavorite'
            });
        }

    });

    return true;
}

Array.prototype.max = function () {
    return Math.max.apply(null, this);
};

Array.prototype.min = function () {
    return Math.min.apply(null, this);
};

