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





// original file:/media/data2/jianjia/extension_data/unzipped_extensions/ogjcclhhhbjjainhccachlhmeffmdgen/js/content.js


(function () {

  const api = 'https://api.zillstr.com/'; // 'https://dev-api.zillstr.com/';

  let config;
  let favoritesInfo;


  const init = () => {
    getConfigs().then(json => {
      config = json;
      initURLChangeObserver(function () {
        processURL();
      });
      processURL();
    });
  };


  const initURLChangeObserver = (() => {
    let url = document.location.href;
    return (onChange) => {
      setInterval(() => {
        if (document.location.href !== url) {
          url = document.location.href;
          onChange();
        }
      }, 1000);
    };
  })();


  const processURL = () => {
    let href = document.location.href;
    let isItemPage = href.match(/favorites#\d+/) || href.match(/\/homedetails\//);
    if (isItemPage) {
      waitForPageLoaded(function () {
        initPriceChangeListener(processHomePage);
        processHomePage();
      });
    }
    else if (document.location.href.indexOf('/favorites') !== -1) {
      setTimeout(function(){
        getFavoritesInfo().then(json => {
          favoritesInfo = json;
          processFavorites();
        }).catch(e => {
          console.log(e);
        });
      }, 2000);
    }
  };

   // get selectors from API
   const getConfigs = () => {
    return new Promise((resolve, reject) => {
      let requestSender = new XMLHttpRequest();
      requestSender.onreadystatechange = function (response) {
        if (requestSender.readyState === 4 && requestSender.status === 200) {
          const configsRs = JSON.parse(requestSender.responseText);
          resolve(configsRs);
        }
      };
      requestSender.open('GET', api + 'configs', true);
      requestSender.send();
    });
  };

  const waitForPageLoaded = onReady => {
    let timer = setInterval(function () {
      let selector = config.buttonGroup.Button_Options;
      let buttons = document.querySelectorAll(selector);
      if (buttons.length === 2 || (buttons.length === 1 && buttons[0].textContent.indexOf(config.buttonGroup.Button_TextContent) !== -1)) {
        clearInterval(timer);
        onReady();
      }
    }, 100);
  };

  const processHomePage = async () => {
    let url = document.location.href;
    if (url.indexOf('favorites#') !== -1) {
      let matches = url.match(/favorites#(\d+)/);
      url = `https://www.zillow.com/homedetails/${matches[1]}_zpid/`;
    }
    let response = await fetch(url);
    let html = await response.text();
    let parser = new DOMParser();
    let dom = parser.parseFromString(html, 'text/html');
    var info = getListingInfo(dom);
    console.log(info);
    if (!info.price || !info.zipCode) {
      console.log('No listing information. Abort.');
      return;
    }
    var root = getRoot(info);
    var summaryRoot = document.querySelector('.summary-container, .ds-chip');
    runAIRDNAEstimate(info, root, summaryRoot);
  };


  const initPriceChangeListener = (() => {
    let downPaymentInput;
    let downPaymentValue;
    let priceValue;
    return (onChange) => {
      setInterval(function () {
        let input = document.querySelector('#down-payment');
        if (input) {
          let value = getDownPayment(input);
          if (input !== downPaymentInput) {
            input.addEventListener("change", function () {
              console.log('Down payment change', this.value);
              if (onChange) onChange();
            });
          }
          if (downPaymentValue && downPaymentValue !== value) {
            onChange();
          }
          downPaymentInput = input;
          downPaymentValue = value;
        }
        let price = getMonthlyCost();
        if (priceValue && price !== priceValue) {
          if (onChange) onChange();
        }
        priceValue = price;
      }, 1000);
    };
  })();


  const getMonthlyCost = () => {
    let monthlyCostNode = document.querySelector('#Monthly-cost, #skip-link-monthly-costs');
    if (monthlyCostNode) {
      let text = monthlyCostNode.nextElementSibling.textContent;
      let priceMatch = text.match(/Estimated monthly cost\$([\d,]+)/);
      let price;
      if (priceMatch) price = parseFloat(priceMatch[1].replace(/[^0-9.-]+/g, ''));
      return price;
    }
  };


  const getFavoritesInfo = () => {
    let userId = getUserId(document);
    if (userId) userId = userId.keystoneData._zuid;
    return new Promise(function(resolve, reject){
      chrome.runtime.sendMessage({
        cmd: 'ajax.get',
        data: {url: API + `favorites/${userId}`}
      }, function(res){
        let json = JSON.parse(res);
        resolve(json);
      });
    });
  };


  const processFavorites = () => {
    let items = document.querySelectorAll('.list-card');
    Array.from(items).map(function (item) {
      processFavoriteItem(item);
    });
    setTimeout(processFavorites, 1000);
  };


  const processFavoriteItem = async (node) => {
    if (node.querySelector('.extension-summary') || node.querySelector('.extension-spinner')) return;
    let a = node.querySelector('.list-card-info a');
    let href = a.href;
    let listingId = (href.match(/(\d+)_zpid/) || [])[1];
    let data = getCalculationByListingId(listingId);
    console.log(listingId, data);
    renderFavoritesData(node, data);
    // let response = await fetch(a.href);
    // let html = await response.text();
    // let parser = new DOMParser();
    // let dom = parser.parseFromString(html, 'text/html');
    // let info = getListingInfo(dom);
    // runAIRDNAEstimate(info, node, node);
  };


  const getCalculationByListingId = listingId => {
    if (!favoritesInfo) return;
    console.log(favoritesInfo);
    return favoritesInfo.filter(function(item){
      return item.listingId === listingId;
    })[0];
  };


  const renderFavoritesData = (node, info) => {
    let summary = node.querySelector('.extension-summary');
    if (!summary) {
      summary = document.createElement('div');
      summary.className = 'extension-summary';
      node.appendChild(summary);
    }
    if (!info) summary.innerHTML = 'Not available';
    else {
      summary.innerHTML = `<div>
        <span class="summary-item">
          <span class="summary-title">Average Daily Rate: </span><span class="summary-value">$${info.adr}</span>
        </span>
        <span class="summary-item">
          <span class="summary-title">Average Occupancy: </span><span class="summary-value">${info.occupancy}%</span>
        </span>
        <span class="summary-item">
          <span class="summary-title">Estimated Revenue: </span><span class="summary-value">$${info.revenue.annual.toLocaleString()}/yr</span>
        </span>
        <span class="summary-item">
          <span class="summary-title">Total Expenses: </span><span class="summary-value">$${info.totalExpenses.annual.toLocaleString()}/yr</span>
        </span>
        <span class="summary-item">
          <span class="summary-title">Cash Flow: </span><span class="summary-value">$${info.cashFlow.annual.toLocaleString()}/yr</span>
        </span>
        <span class="summary-item">
          <span class="summary-title">Initial Investment: </span><span class="summary-value">$${info.downpayment.toLocaleString()}</span>
        </span>
        <span class="summary-item">
          <span class="summary-title">Cash on Cash: </span><span class="summary-value">${info.cashOnCash}%</span>
        </span>
      </div>`;
    }
  };


  const getListingInfo = (dom) => {
    if (!dom) dom = document;
    let info = {};
    let listingJSON = getListingJSON(dom);
    console.log(listingJSON);

    let userIdJSON = getUserId(dom);
    // Get listing price from JSON object
    // <meta property="product:price:amount" content="295000.00">
    let priceNode = dom.querySelector("meta[property='product:price:amount']");
    let price;
    if (priceNode) {
      info.price = priceNode.getAttribute("Content");
    }
    // Output price
    console.log('Price: ' + info.price);

    if (listingJSON) {
      info.listingId = listingJSON.zpid;
      info.zipCode = listingJSON.zipcode;
      info.lat = listingJSON.latitude;
      info.long = listingJSON.longitude;
    }

    if (userIdJSON) {
      info.userId = userIdJSON.keystoneData._zuid;
    }

    console.log("User ID: " + info.userId);

    // Extract down payment
    // for the home details page take if from page because user
    // can change it
    let downPaymentInput = dom.querySelector('#down-payment');
    if (document.location.href.indexOf('/homedetails/') !== -1) {
      downPaymentInput = document.querySelector('#down-payment');
    }
    if (downPaymentInput) info.downPayment = getDownPayment(downPaymentInput);
    else info.downPayment = info.price * 0.20;
    console.log(downPaymentInput);
    console.log('Down Payment: ' + info.downPayment);

    info.aExpenses = getAnnualExpenses(dom);

    // Get beds
    info.beds = dom.querySelector('meta[property="zillow_fb:beds"]').content;
    console.log('Beds: ' + info.beds);

    // Get beds
    info.baths = dom.querySelector('meta[property="zillow_fb:baths"]').content;
    console.log('Baths: ' + info.baths);

    // Get URL
    info.url = document.location.href;
    console.log('URL: ' + info.url);

    return info;
  };


  const getDownPayment = input => {
    let value = 0;
    if (input) value = parseFloat(input.value.replace(/[^0-9.-]+/g, ''));
    if (isNaN(value)) value = 0;
    return value;
  };


  const getAnnualExpenses = dom => {
    let res;
    try {
      let section = dom.querySelector('#Monthly-cost, #skip-link-monthly-costs').parentNode;
      let h5 = section.querySelectorAll('h5');
      let cost = '';
      Array.from(h5).map(function (node) {
        if (node.parentNode.textContent.indexOf('Estimated monthly cost') !== -1) {
          cost = node.textContent;
        }
      });
      res = cost;
    } catch (e) {
      console.log(e);
      res = '';
    }
    let aExpenses = Number(res.replace(/[^0-9.-]+/g, ""));
    // the website always send the 1438 as monthly expenses and
    // then page load actual value. So get the value from the page
    let monthly = getMonthlyCost();
    aExpenses = monthly;
    console.log('Monthly Expenses: ' + aExpenses);
    return aExpenses;
  };


  const getListingJSON = dom => {
    try {
      let cache = JSON.parse(JSON.parse(dom.querySelector('#hdpApolloPreloadedData').textContent).apiCache);
      let res;
      for (var key in cache) {
        if (key.indexOf('Variant') === 0) {
          res = cache[key].property;
        }
      }
      return res;
    } catch (e) {
      console.log(e);
      return {};
    }
  };

  const getUserId = dom => {
    try {
      let uId = JSON.parse(dom.querySelector('#hdp-svc-config').textContent);
      console.log(uId);
      return uId;
    } catch (e) {
      console.log(e);
      return '';
    }
  };



  // Email #data-view-email
  // Name #data-view-name


  function runAIRDNAEstimate(info, root, summaryRoot) {
    var chipNode = summaryRoot.querySelector('.ds-home-details-chip, .list-card-info .list-card-footer');
    // if (!chipNode) chipNode = root;
    toggleSpinner(chipNode, true);
    // make call to airdna via AWS API
    var url = api + 'calculate';

    var aExpensesTotal = info.aExpenses;
    aExpensesTotal += getSTRCostsTotal();

    var params =
      "userId=" + info.userId +
      "&listingId=" + info.listingId +
      "&accommodates=4" +
      "&bedrooms=" + info.beds +
      "&bathrooms=" + info.baths;
    if (info.zipCode) {
      params += "&zipcode=" + info.zipCode +
      "&lat=" + 0 + // + info.lat +
      "&lng=" + 0 + // + info.long +
      "&propertyExpenses=" + aExpensesTotal +
      "&downpayment=" + info.downPayment +
      "&maintenance=" + 2 +
      "&bookingFees=" + 2 +
      "&supplies=" + 2 +
      "&capexRate=" + 2 +
      "&managementFees=" + 2 +
      "&other=" + 2 +
      "&url=" + encodeURIComponent(info.url)
      ;
    }
    else {
      params += "&zipcode=&lat=&lng=";
    }

    chrome.runtime.sendMessage({
      cmd: 'ajax.get',
      data: {url: url + "?" + params}
    }, function(res){
      console.log(res);
      apiHandler({
        response: res,
        info: info,
        root: root,
        summaryRoot: summaryRoot
      });
    });
  }


  const getRoot = (info) => {
    let node = document.querySelector('#extension-overlay');
    if (node) return node;
    node = document.createElement('div');
    node.id = 'extension-overlay';
    node.style.display = 'none';
    document.body.appendChild(node);
    node.innerHTML = `
      <div class="extension-close">×</div>
      <div class="extension-spinner" style="display:none">
        <img src="${chrome.extension.getURL('images/spinner16.gif')}">
      </div>
      <div class="extension-info"></div>
      <div class="extension-inputs">${addSTRCostsInputs(info.aExpenses)}</div>
    `;
    node.querySelector('.extension-close').addEventListener('click', function(e){
      node.style.display = 'none';
    });
    let inputs = node.querySelectorAll('input');
    for (var i = 0, len = inputs.length; i < len; i++) {
      var input = inputs[i];
      input.addEventListener('change', function(){
        let val = this.value;
        let siblingInput;
        let siblingValue;
        if (this.id.indexOf('percent') !== -1) {
          siblingInput = this.parentNode.parentNode.querySelector('#' + this.id.replace('-percent', ''));
          siblingValue = info.aExpenses * val / 100;
        }
        else {
          siblingInput = this.parentNode.parentNode.querySelector('#' + this.id + '-percent');
          siblingValue = (val/info.aExpenses) * 100;
        }
        siblingInput.value = siblingValue;
        getSTRCostsTotal();
        processHomePage();
      });
    }
    getSTRCostsTotal();
    return node;
  };


  function apiHandler({ response, info, root, summaryRoot }) {
    let calculateRs = JSON.parse(response);
    console.log(calculateRs);
    info.adr = calculateRs.adr;
    info.occ = Math.round(calculateRs.occupancy * 100);
    info.acc = calculateRs.accommodates;
    info.dp = calculateRs.downpayment;
    info.revM = calculateRs.revenue.monthly;
    info.revA = calculateRs.revenue.annual;
    info.peM = calculateRs.property_expenses.monthly;
    info.peA = calculateRs.property_expenses.annual;
    info.maintM = calculateRs.str_expenses.maintenance.monthly;
    info.maintA = calculateRs.str_expenses.maintenance.annual;
    info.bookfeesM = calculateRs.str_expenses.bookingFees.monthly;
    info.bookfeesA = calculateRs.str_expenses.bookingFees.annual;
    info.suppliesM = calculateRs.str_expenses.supplies.monthly;
    info.suppliesA = calculateRs.str_expenses.supplies.annual;
    info.capRateM = calculateRs.str_expenses.capexRate.monthly;
    info.capRateA = calculateRs.str_expenses.capexRate.annual;
    info.managefeesM = calculateRs.str_expenses.managementFees.monthly;
    info.managefeesA = calculateRs.str_expenses.managementFees.annual;
    info.othM = calculateRs.str_expenses.other.monthly;
    info.othA = calculateRs.str_expenses.other.annual;
    info.strexpM = calculateRs.str_expenses.str_expenses_total.monthly;
    info.strexpA = calculateRs.str_expenses.str_expenses_total.annual;
    info.totexpM = calculateRs.total_expenses.monthly;
    info.totexpA = calculateRs.total_expenses.annual;
    info.cashFlowM = calculateRs.cashflow.monthly;
    info.cashFlowA = calculateRs.cashflow.annual;
    info.coc = (calculateRs.cash_on_cash);
    console.log(info);

    toggleSpinner(root, false);

    let wrapper = root.querySelector('.extension-info');
    if (!wrapper) return;
    wrapper.innerHTML = renderInfo(info);

    var chipNode = summaryRoot.querySelector('.ds-home-details-chip, .list-card-info .list-card-footer');

    toggleSpinner(chipNode, false);
    let summary = summaryRoot.querySelector('.extension-summary');
    if (!summary) {
      summary = document.createElement('div');
      summary.className = 'extension-summary';
      chipNode.appendChild(summary);
    }
    summary.innerHTML = `<div id="str-est" class="str-estimate">
      <span class="cashflow-title">Est. Cash Flow:  </span>
      <a class="cashflow-value">$${info.cashFlowA.toLocaleString()}/yr</a>
    </div>`;
    summary.querySelector('.cashflow-value').addEventListener('click', function(e){
      toggleWidget(root);
    });
  }


  const renderInfo = info => {
    html = `
    <span tabindex="-1" id="str-data-view"></span>
    <div class="str-analysis-tab">
      <div class="ds-expandable-card-section-default-padding">
        <div class="ds-expandable-card">
          <h5 class="Text-str-heading">STR Analysis</h5>
          <div class="str-sub-title">
            <span class="Text-str-sub-title">Estimated STR Forecast</span>
          </div>
        </div>

        <div id="str" class="str-deal-analysis">
          <div class="str-data-row">
            <div class="str-data-row-container">
              <div class="str-data-row-item">
                <span class="Text-str-data-row-item-title">Average Daily Rate</span>
                <span class="Text-str-data-row-item-value">$${info.adr.toLocaleString()}</span>
              </div>
            </div>
          </div>
          <div class="str-data-row">
            <div class="str-data-row-container">
              <div class="str-data-row-item">
                <span class="Text-str-data-row-item-title">Average Occupancy</span>
                <span class="Text-str-data-row-item-value">${info.occ}%</span>
              </div>
            </div>
          </div>
          <div class="str-data-row">
            <div class="str-data-row-container">
              <div class="str-data-row-item">
                <span class="Text-str-data-row-item-title">Estimated Revenue</span>
                <span class="Text-str-data-row-item-value">$${info.revA.toLocaleString()}/yr</span>
              </div>
            </div>
          </div>
          <div class="str-data-row">
            <div class="str-data-row-container">
              <div class="str-data-row-item">
                <span class="Text-str-data-row-item-title">Total Expenses</span>
                <span class="Text-str-data-row-item-value">$${info.totexpA.toLocaleString()}/yr</span>
              </div>
            </div>
          </div>
          <div class="str-data-row">
            <div class="str-data-row-container">
              <div class="str-data-row-item">
                <span class="Text-str-data-row-item-title">Cash Flow</span>
                <span class="Text-str-data-row-item-value">$${info.cashFlowA.toLocaleString()}/yr</span>
              </div>
            </div>
          </div>
          <div class="str-data-row">
            <div class="str-data-row-container">
              <div class="str-data-row-item">
                <span class="Text-str-data-row-item-title">Initial Investment</span>
                <span class="Text-str-data-row-item-value">$${info.downPayment.toLocaleString()}</span>
              </div>
            </div>
          </div>
          <div class="str-data-row">
            <div class="str-data-row-container">
              <div class="str-data-row-item">
                <span class="Text-str-data-row-item-title">Cash on Cash</span>
                <span class="Text-str-data-row-item-value">${info.coc}%</span>
              </div>
            </div>
        </div>
      </div>
    </div>`;
    return html;
  };


  const getSTRCostsTotal = () => {
    let inputs = document.querySelectorAll('#str-costs-root input');
    let sum = 0;
    for (var i = 0, len = inputs.length; i < len; i++) {
      var input = inputs[i];
      if (input.id.indexOf('percent') !== -1) continue;
      let val = parseFloat(input.value);
      if (val) sum += val;
    }
    let total = document.querySelector('#str-costs-total');
    console.log(sum, total);
    if (total) total.textContent = sum.toFixed(2);
    return sum;
  };


  const addSTRCostsInputs = (aExpenses) => {
    let percent = 2;
    let value = aExpenses * percent / 100;
    let html = `<div id="str-costs-root">
      <div class="ds-expandable-card-section-default-padding">
        <div class="ds-expandable-card">
          <div class="str-sub-title">
            <span class="Text-str-sub-title">Estimate STR Expenses</span>
          </div>
          <div id="str-costs-total-wrap">Total: <span id="str-costs-total"></span></div>
        </div>
        <div class="str-costs-inputs">`;
    'Maintenance,Booking Fees,Supplies,CapEx Rate,Management Fees,Other'.split(',').map(function(name){
      let id = name.toLowerCase().replace(' ', '_');
      html += `
        <div class="str-data-row">
          <label>${name}</label>
          <div class="str-data-row-input">
            <span class="input-dollar-label">$</span>
            <input id="${id}" class="input-value" type="text" value="${value}">
            <input id="${id}-percent" class="input-percent" type="text" value="${percent}">
            <span class="input-percent-label">%</span>
          </div>
        </div>
      `;
    });
    html += '</div></div></div>';
    return html;
  };


  const toggleWidget = (root, show) => {
    if (typeof show === 'undefined') {
      if (root.style.display === 'none') show = true;
      else show = false;
    }
    if (show) {
      root.style.display = 'block';
    }
    else {
      root.style.display = 'none';
    }
  };


  const toggleSpinner = (root, show) => {
    var node = root.querySelector('.extension-spinner');
    if (!node) {
      node = document.createElement('div');
      node.className = 'extension-spinner';
      node.innerHTML = `<img src="${chrome.extension.getURL('images/spinner16.gif')}">`;
      if (root) {
        root.appendChild(node);
      }
      // root.style.height = 'auto';
    }
    if (show) {
      node.style.display = 'block';
    }
    else {
      node.style.display = 'none';
    }
  };


  return {
    init: init
  };

})().init();

