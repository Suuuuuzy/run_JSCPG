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





// original file:demos/FromDocToPdf/js/PartnerId.js

var INVALID_SUB_ID = 'XXXXXXXXXX';
function PartnerIdFactory() {
    var _parse = function (s, subId, defaultCobrand) {
        if (typeof (s) === 'undefined')
            s = null;
        if (typeof (subId) === 'undefined')
            subId = null;
        if (typeof (defaultCobrand) === 'undefined')
            defaultCobrand = null;
        s = trim(s);
        if (isEmpty(s)) {
            if (defaultCobrand === null)
                return new PartnerId(null, null, null, null, null, null, "", null, false);
            return getDefaultPartnerId(defaultCobrand, subId, s, defaultCobrand.length === 2);
        }
        if (s.charAt(0) == DELIMITER)
            return parseNew(s, subId, defaultCobrand);
        return parseOld(s, null, subId, defaultCobrand);
    };
    this.parse = _parse;
    this.makePartnerId = function (cobrand, campaign, track, country, subId, parent, useOldFormat) {
        if (typeof (cobrand) === 'undefined')
            cobrand = null;
        if (typeof (campaign) === 'undefined')
            campaign = null;
        if (typeof (track) === 'undefined')
            track = null;
        if (typeof (country) === 'undefined')
            country = null;
        if (typeof (subId) === 'undefined')
            subId = null;
        if (typeof (parent) === 'undefined')
            parent = null;
        if (typeof (useOldFormat) === 'undefined')
            useOldFormat = false;
        return new PartnerId(cobrand, campaign, track, country, _validateSubId(subId), parent, null, null, useOldFormat);
    };
    var _makeViralPartnerId = function (child, parent, subId) {
        if (typeof (subId) === 'undefined')
            subId = null;
        var childId = _parse(child, subId);
        if (typeof (parent) === 'undefined' || parent === null) {
            return childId;
        }
        var parentId = _parse(parent);
        var useOldFormat = childId.isOldFormat() && (!parentId.hasParent() && parentId.isOldFormat() || parentId.hasParent() && parentId.getParent().isOldFormat());
        return new PartnerId(childId.getCobrand(), childId.getCampaign(), childId.getTrack(), childId.getCountry(), _validateSubId(subId), parentId, null, null, useOldFormat);
    };
    this.makeViralPartnerId = _makeViralPartnerId;
    this.validateField = _validateField;
    this.isFieldValid = _isFieldValid;
    this.validateCountry = _validateCountry;
    this.validateSubId = _validateSubId;
    this.urlEncodePartnerId = _urlEncodePartnerId;
    var DELIMITER = '^';
    var PARENT_DELIMITER = '_';
    var NEW_PARTNER_PARAM = 'p2';
    var MAX_ID_LEN = 23;
    var VALID_FIELD = /^[a-zA-Z0-9]{1,6}$/;
    var VALID_SUB_ID = /^[a-zA-Z0-9_-]{2,100}$/;
    var TRIM_LEFT = /^\s+/;
    var TRIM_RIGHT = /\s+$/;
    function PartnerId(_cobrand, _campaign, _track, _country, _subId, _parent, _serializedForm, _reportingTrack, useOldFormat) {
        var cobrand = toUpperCase(_validateField(_cobrand));
        var campaign = null;
        var track = null;
        var country = null;
        var parent = null;
        var subId = null;
        var reportingTrack = null;
        var serializedForm = "";
        if (cobrand != null) {
            campaign = toLowerCase(_validateField(_campaign));
            track = toUpperCase(_validateField(_track));
            country = _validateCountry(_country);
            if (_parent != null) {
                if (_parent.hasParent())
                    _parent = _parent.getParent();
                if (!_parent.isValid())
                    _parent = null;
                if (_parent != null && _parent.hasSubId()) {
                    _parent = new PartnerId(_parent.getCobrand(), _parent.getCampaign(), _parent.getTrack(), _parent.getCountry(), null, null, _parent.toString(), _parent.getReportingTrack(), _parent.isOldFormat());
                }
            }
            parent = _parent;
            if (!isEmpty(_subId))
                subId = trim(_subId);
            serializedForm = trim(_serializedForm);
            if (serializedForm == null) {
                var pair = [];
                if (useOldFormat)
                    pair = serializeOld(cobrand, campaign, track, country, parent);
                else
                    pair = serializeNew(cobrand, campaign, track, country, parent);
                serializedForm = pair[0];
                reportingTrack = pair[1];
            }
            else
                reportingTrack = trim(toLowerCase(_reportingTrack));
        }
        this.toString = function () {
            return serializedForm;
        };
        this.getCobrand = function () {
            return cobrand;
        };
        this.getCampaign = function () {
            return campaign;
        };
        this.getTrack = function () {
            return track;
        };
        this.getCountry = function () {
            return country;
        };
        this.getSubId = function () {
            return subId;
        };
        this.getReportingTrack = function () {
            return reportingTrack;
        };
        this.getParent = function () {
            return parent;
        };
        this.getChild = function () {
            if (parent == null)
                return this;
            return new PartnerId(cobrand, campaign, track, country, subId, null, null, null, useOldFormat);
        };
        this.hasCobrand = function () {
            return cobrand != null;
        };
        this.hasCampaign = function () {
            return campaign != null;
        };
        this.hasTrack = function () {
            return track != null;
        };
        this.hasCountry = function () {
            return country != null;
        };
        this.hasSubId = function () {
            return subId != null;
        };
        this.hasParent = function () {
            return parent != null;
        };
        this.addToUrl = function (baseUrl, oldParamName, oldParamName2) {
            var s = '';
            if (baseUrl != null)
                s = trim(baseUrl);
            if (_isValid()) {
                var lastChar = '\0';
                if (s.length > 0)
                    lastChar = s.charAt(s.length - 1);
                if (lastChar != '?' && lastChar != '&') {
                    if (s.indexOf('?') >= 0 || s.indexOf('&') >= 0)
                        s += '&';
                    else
                        s += '?';
                }
                s += _appendQueryParameters(oldParamName, oldParamName2);
            }
            return s;
        };
        this.makeViralPartnerId = function (child, childSubId) {
            if (typeof (childSubId) === 'undefined')
                childSubId = null;
            return _makeViralPartnerId(child, serializedForm, childSubId);
        };
        this.isValid = _isValid;
        this.isNewFormat = _isNewFormat;
        this.isOldFormat = _isOldFormat;
        this.appendQueryParameters = _appendQueryParameters;
        function _isValid() {
            return cobrand != null;
        }
        function _isNewFormat() {
            return serializedForm.length > 0 && serializedForm.charAt(0) == DELIMITER;
        }
        function _isOldFormat() {
            return serializedForm.length > 0 && serializedForm.charAt(0) != DELIMITER;
        }
        function _appendQueryParameters(oldParamName, oldParamName2) {
            var s = '';
            if (!_isValid())
                return s;
            var encoded = _urlEncodePartnerId(serializedForm);
            if (_isNewFormat())
                s += 'p2=';
            else {
                if (!isEmpty(oldParamName2))
                    s += oldParamName2 + '=' + encoded + '&';
                s += oldParamName + '=';
            }
            s += encoded;
            if (subId != null) {
                s += '&si=' + urlEncode(subId);
            }
            return s;
        }
    }
    function parseNew(s, subId, defaultCobrand) {
        if (s.charAt(0) != DELIMITER)
            return getDefaultPartnerId(defaultCobrand, subId, s, false);
        var leadingDelimiterStripped = s.substring(1);
        var st = new StringTokenizer(leadingDelimiterStripped);
        var cobrand = st.nextToken(DELIMITER);
        if (!_isFieldValid(cobrand))
            return getDefaultPartnerId(defaultCobrand, subId, s, false);
        if (st.hasMoreTokens() && st.remainder().indexOf('|') > 0)
            return getDefaultPartnerId(cobrand, subId, s, false);
        var childPart = st.nextToken(PARENT_DELIMITER);
        var parent = null;
        if (st.hasMoreTokens()) {
            parent = _parse(normalizeParent(st.remainder()), null, null);
        }
        var stChild = new StringTokenizer(childPart);
        var campaign = stChild.nextToken(DELIMITER);
        var track = stChild.nextToken(DELIMITER);
        var country = stChild.nextToken(DELIMITER);
        var reportingTrack = null;
        var pos = leadingDelimiterStripped.indexOf(DELIMITER);
        if (pos > 0)
            reportingTrack = leadingDelimiterStripped.substring(pos);
        return new PartnerId(cobrand, campaign, track, country, subId, parent, s, reportingTrack, false);
    }
    function normalizeParent(parent) {
        var parentIsOldFormat = parent.indexOf(DELIMITER) < 0 && (parent.length === 2 || parent.length > 6);
        if (!parentIsOldFormat && parent.charAt(0) !== DELIMITER)
            parent = DELIMITER + parent;
        return parent;
    }
    function parseOld(partnerParam, idCookie, subId, defaultCobrand) {
        var serializedPartnerString = null;
        var cobrand = null;
        var reportingTrack = null;
        var campaign = null;
        var track = null;
        var country = null;
        var parent = null;
        if (partnerParam != null) {
            serializedPartnerString = partnerParam;
            partnerParam = partnerParam.toUpperCase();
            if (partnerParam.length > 2) {
                reportingTrack = partnerParam.substring(2);
                cobrand = partnerParam.substring(0, 2);
            }
            else {
                cobrand = partnerParam;
            }
            if (reportingTrack == null && idCookie != null && idCookie.length <= MAX_ID_LEN) {
                reportingTrack = idCookie;
                if (serializedPartnerString.length == 2)
                    serializedPartnerString += idCookie;
            }
            if (!_isFieldValid(cobrand) || cobrand.length != 2) {
                cobrand = defaultCobrand;
            }
        }
        else {
            cobrand = defaultCobrand;
        }
        if (cobrand == null)
            return new PartnerId(null, null, null, null, null, null, "", null);
        if (reportingTrack != null && reportingTrack.indexOf('|') >= 0)
            reportingTrack = null;
        var origTid = reportingTrack;
        if (reportingTrack != null) {
            var pos = serializedPartnerString.indexOf(PARENT_DELIMITER);
            if (pos >= 0) {
                parent = _parse(normalizeParent(serializedPartnerString.substring(pos + 1)), null, null);
                pos = reportingTrack.indexOf(PARENT_DELIMITER);
                if (pos >= 0)
                    reportingTrack = reportingTrack.substring(0, pos);
            }
            var len = reportingTrack.length;
            if (len <= 6)
                campaign = reportingTrack;
            else
                campaign = reportingTrack.substring(0, 6);
            if (len >= 8) {
                track = reportingTrack.substring(6, 8);
                if (len >= 10)
                    country = reportingTrack.substring(8, 10);
            }
        }
        return new PartnerId(cobrand, campaign, track, country, subId, parent, serializedPartnerString, origTid, true);
    }
    function serializeNew(cobrand, campaign, track, country, parent) {
        var s = DELIMITER;
        if (cobrand != null)
            s += cobrand;
        var reportingTrackStart = s.length;
        s += DELIMITER;
        if (campaign != null)
            s += campaign;
        s += DELIMITER;
        if (track != null)
            s += track;
        s += DELIMITER;
        if (country != null)
            s += country;
        if (parent != null) {
            s += PARENT_DELIMITER;
            s += serializeNew(parent.getCobrand(), parent.getCampaign(), parent.getTrack(), parent.getCountry(), null)[0].substring(1);
        }
        var reportingTrack = s.substring(reportingTrackStart).toLowerCase();
        return [s, reportingTrack];
    }
    function serializeOld(cobrand, campaign, track, country, parent) {
        if (cobrand == null)
            return ["", ""];
        if (cobrand.length != 2)
            return ["", ""];
        var s = cobrand;
        var reportingTrackStart = s.length;
        if (length(campaign) == 6) {
            s += campaign;
            if (length(track) == 2) {
                s += track;
                if (length(country) == 2)
                    s += country;
            }
        }
        if (parent != null) {
            var serializedParent = serializeOld(parent.getCobrand(), parent.getCampaign(), parent.getTrack(), parent.getCountry(), null)[0];
            if (serializedParent.length > 0) {
                s += '_' + serializedParent;
            }
        }
        var reportingTrack = s.substring(reportingTrackStart).toLowerCase();
        return [s, reportingTrack];
    }
    function length(s) {
        if (s == null)
            return 0;
        return s.length;
    }
    function _validateField(field) {
        field = trim(field);
        if (isEmpty(field)) {
            return null;
        }
        if (!VALID_FIELD.test(field)) {
            return null;
        }
        return field;
    }
    function _validateCountry(country) {
        country = _validateField(country);
        if (country == null)
            return null;
        if (country.length != 2)
            return null;
        return country.toLowerCase();
    }
    function _validateSubId(subId) {
        subId = trim(subId);
        if (isEmpty(subId)) {
            return null;
        }
        if (!VALID_SUB_ID.test(subId)) {
            return INVALID_SUB_ID;
        }
        return subId;
    }
    function _isFieldValid(field) {
        return _validateField(field) != null;
    }
    function getDefaultPartnerId(cobrand, subId, origValue, useOldFormat) {
        return new PartnerId(cobrand, null, null, null, subId, null, origValue, null, useOldFormat);
    }
    function isEmpty(s) {
        return s == null || s.length == 0;
    }
    function toUpperCase(s) {
        if (s == null)
            return null;
        return s.toUpperCase();
    }
    function toLowerCase(s) {
        if (s == null)
            return null;
        return s.toLowerCase();
    }
    var trim = String.prototype.trim ?
        function (text) {
            return text == null ?
                null :
                String.prototype.trim.call(text);
        } :
        function (text) {
            return text == null ?
                null :
                text.toString().replace(TRIM_LEFT, "").replace(TRIM_RIGHT, "");
        };
    function _urlEncodePartnerId(partnerId) {
        return encodeURIComponent(partnerId).replace(/%5[eE]/g, '^');
    }
    function urlEncode(s) {
        return encodeURIComponent(s);
    }
    function StringTokenizer(text) {
        var s = text;
        var start = 0;
        var len = 0;
        if (text != null)
            len = text.length;
        this.hasMoreTokens = function () {
            return start < len;
        };
        this.nextToken = function (delim) {
            if (!this.hasMoreTokens())
                return null;
            var pos;
            for (pos = start; pos < len; pos++) {
                if (s.charAt(pos) == delim) {
                    var result = s.substring(start, pos);
                    start = pos + 1;
                    return result;
                }
            }
            var result = s.substring(start);
            start = len;
            return result;
        };
        this.remainder = function () {
            if (!this.hasMoreTokens())
                return null;
            return s.substring(start);
        };
    }
}
var GlobalPartnerIdFactory = new PartnerIdFactory();
//# sourceMappingURL=PartnerId.js.map
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
// original file:demos/FromDocToPdf/js/TemplateParser.js

var TextTemplate;
(function (TextTemplate) {
    var Type;
    (function (Type) {
        Type[Type["Any"] = 0] = "Any";
        Type[Type["Null"] = 1] = "Null";
        Type[Type["Undefined"] = 2] = "Undefined";
        Type[Type["Function"] = 3] = "Function";
        Type[Type["RegExp"] = 4] = "RegExp";
    })(Type || (Type = {}));
    function kind(obj) {
        return Type[String(Object.prototype.toString.call(obj).slice(8, -1))] || Type.Any;
    }
    function findParent(data, namespace) {
        var tokens = String(namespace).split('.');
        if (data && tokens.length > 1) {
            return tokens.slice(0, tokens.length - 1).reduce(function (p, c) {
                if (p) {
                    return p[c];
                }
                return p;
            }, data) || null;
        }
        return data || null;
    }
    if (!Array.prototype.find) {
        Object.defineProperty(Array.prototype, 'find', {
            value: function (predicate) {
                if (this == null) {
                    throw new TypeError('"this" is null or not defined');
                }
                var o = Object(this);
                var len = o.length >>> 0;
                if (typeof predicate !== 'function') {
                    throw new TypeError('predicate must be a function');
                }
                var thisArg = arguments[1];
                var k = 0;
                while (k < len) {
                    var kValue = o[k];
                    if (predicate.call(thisArg, kValue, k, o)) {
                        return kValue;
                    }
                    k++;
                }
                return undefined;
            }
        });
    }
    function parse(input, data, regexp) {
        if (kind(regexp) !== Type.RegExp) {
            regexp = [
                /\${\s*([a-zA-Z0-9\-_\.]+)\s*}/g,
                /{{2}\s*([a-zA-Z0-9\-_\.]+)\s*}{2}/g,
                /<!--\s*([a-zA-Z0-9\-_\.]+)\s*-->/g
            ].find(function (r) { return r.test(input); });
        }
        if (!regexp) {
            return input;
        }
        return String(input).replace(regexp, function (m, token) {
            var result = token.split('.').reduce(function (p, c) {
                switch (kind(p)) {
                    case Type.Undefined:
                    case Type.Null:
                        return '';
                    default:
                        return p[c];
                }
            }, data);
            switch (kind(result)) {
                case Type.Null:
                case Type.Undefined:
                    result = '';
                case Type.Function:
                    try {
                        result = result.call(findParent(data, token)) || '';
                    }
                    catch (ex) {
                        result = '';
                    }
            }
            return encodeURIComponent(result);
        });
    }
    TextTemplate.parse = parse;
})(TextTemplate || (TextTemplate = {}));
//# sourceMappingURL=TemplateParser.js.map
// original file:demos/FromDocToPdf/js/ajax.js

var AJAX;
(function (AJAX) {
    function open(req) {
        return new Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.open(req.method, req.url, true);
            xhr.onreadystatechange = function (e) {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    resolve(xhr);
                }
            };
            xhr.onerror = function (err) {
                reject(err);
            };
            xhr.onabort = function (e) {
                reject(e);
            };
            if (req.timeout) {
                xhr.timeout = req.timeout;
            }
            if (req.type) {
                xhr.overrideMimeType(req.type);
            }
            xhr.send(req.data);
        });
    }
    function readJSON(url) {
        return get({ url: url, responseType: 'text/plain' }).then(function (xhr) {
            if (xhr.status == 200) {
                return Promise.resolve(JSON.parse(xhr.responseText));
            }
            return Promise.reject(new Error("Unable to load JSON: status:\"" + xhr.status + "\" URL:\"" + url + "\""));
        });
    }
    AJAX.readJSON = readJSON;
    function get(req) {
        var params = Object.keys(req.data || {}).reduce(function (values, key) {
            var value = req.data[key];
            if (value !== undefined && value !== null && String(value).length) {
                value = key + "=" + encodeURIComponent(value);
            }
            else {
                value = key;
            }
            values.push(value);
            return values;
        }, []).join('&');
        var url = req.url;
        if (params.length) {
            url = [url, url.indexOf('?') < 0 ? '?' : '&', params].join('');
        }
        return open({ method: 'GET', url: url, type: req.responseType });
    }
    AJAX.get = get;
    function post(req) {
        var form = Object.keys(req.data || {}).reduce(function (form, key) {
            form.append(key, req.data[key]);
            return form;
        }, new FormData());
        return open({ method: 'POST', url: req.url, data: form, type: req.responseType });
    }
    AJAX.post = post;
})(AJAX || (AJAX = {}));
//# sourceMappingURL=ajax.js.map
// original file:demos/FromDocToPdf/js/ul.js

var ask;
(function (ask) {
    var apps;
    (function (apps) {
        var ul;
        (function (ul) {
            function createStandardData(eventName, config) {
                return {
                    anxa: 'CAPNative',
                    anxv: config.buildVars.version,
                    anxe: eventName,
                    anxt: config.state.toolbarData.toolbarId,
                    anxtv: config.buildVars.version,
                    anxp: config.state.toolbarData.partnerId,
                    anxsi: config.state.toolbarData.partnerSubId,
                    anxd: config.buildVars.buildDate,
                    f: '00400000',
                    anxr: +new Date(),
                    coid: config.state.toolbarData.coId || config.buildVars.coId,
                    userSegment: config.state.toolbarData.userSegment
                };
            }
            function fireToolbarActiveEvent(url, eventSpecificData, config) {
                return fireEvent('ToolbarActive', url, eventSpecificData, config);
            }
            ul.fireToolbarActiveEvent = fireToolbarActiveEvent;
            function fireCEDisableEvent(url, eventSpecificData, config) {
                return fireEvent('CEDisable', url, eventSpecificData, config);
            }
            ul.fireCEDisableEvent = fireCEDisableEvent;
            function fireCEUninstallEvent(url, eventSpecificData, config) {
                return fireEvent('CEUninstall', url, eventSpecificData, config);
            }
            ul.fireCEUninstallEvent = fireCEUninstallEvent;
            function fireEvent(eventName, url, eventSpecificData, config) {
                var standardData = createStandardData(eventName, config);
                var combinedData = Util.mergeObjects(standardData, eventSpecificData);
                return AJAX.get({ url: url, data: combinedData, responseType: 'text/plain' });
            }
            ul.fireEvent = fireEvent;
            function firePixel(request) {
                return loadContent(request).then(function (respose) {
                    respose.close();
                    return Promise.resolve({ success: true });
                });
            }
            ul.firePixel = firePixel;
            function loadContent(request) {
                var url = request.url, timeout = request.timeout;
                if (window.location.href.indexOf(request.url) >= 0) {
                    Promise.reject(new Error("Cannot load \"" + url + "\" inside \"" + window.location.href + "\""));
                }
                return new Promise(function (resolve, reject) {
                    var iframe = document.createElement('iframe');
                    if (timeout) {
                        timeout = setTimeout(function () {
                            if (iframe) {
                                iframe.parentNode.removeChild(iframe);
                            }
                            reject(new Error("Load content timeout: \"" + url + "\""));
                        }, timeout);
                    }
                    iframe.addEventListener('load', function (e) {
                        !timeout || clearTimeout(timeout);
                        resolve({
                            url: url,
                            parentUrl: window.location.href,
                            timedout: false,
                            close: function () {
                                iframe.parentNode.removeChild(iframe);
                            }
                        });
                    }, true);
                    iframe.setAttribute('src', url);
                    document.body.appendChild(iframe);
                });
            }
        })(ul = apps.ul || (apps.ul = {}));
    })(apps = ask.apps || (ask.apps = {}));
})(ask || (ask = {}));
//# sourceMappingURL=ul.js.map
// original file:demos/FromDocToPdf/js/dlpHelper.js

'use strict';
var DlpHelper;
(function (DlpHelper) {
    function openDLPDomain(url, getLocalStorage, parseLocalStorage, resolve, reject) {
        var bgifr = document.createElement("iframe");
        bgifr.setAttribute("id", "bgifr");
        bgifr.setAttribute("src", url);
        document.body.appendChild(bgifr);
        var _this = this;
        _this.defer(function () {
            var bgifr = document.getElementById("bgifr");
            document.body.removeChild(bgifr);
        });
        var onConnect = function (port) {
            if (!port.sender.hasOwnProperty("tab")) {
                chrome.runtime.onConnect.removeListener(onConnect);
                _this.defer(function () { port.disconnect(); });
                getLocalStorage(port, _this.keys).then(function (response) {
                    _this.cleanUp();
                    if (response && response.toolbarData) {
                        Logger.log("dlpHelper: openDLPDomain: SUCCESS: response looked like: " + JSON.stringify(response));
                        resolve(parseLocalStorage(response));
                    }
                    else {
                        Logger.log("dlpHelper: openDLPDomain: FAIL: response looked like: " + JSON.stringify(response));
                        reject(new Error("dlpHelper: openDLPDomain: FAILED to find DLP data in local storage"));
                    }
                }).catch(function (err) {
                    _this.cleanUp();
                    reject(err);
                });
            }
        };
        _this.defer(function () {
            chrome.runtime.onConnect.removeListener(onConnect);
        });
        chrome.runtime.onConnect.addListener(onConnect);
    }
    DlpHelper.openDLPDomain = openDLPDomain;
})(DlpHelper || (DlpHelper = {}));
//# sourceMappingURL=dlpHelper.js.map
// original file:demos/FromDocToPdf/js/dlp.js

'use strict';
var Dlp;
(function (Dlp) {
    Dlp.dataSourceLocalStorage = "DLP local storage";
    Dlp.dataSourceCookies = "DLP cookies";
    function getDataFromLocalStorage(request) {
        var _this = this;
        var url = request.url, timeout = request.timeout, keys = request.keys;
        this.deferred = [];
        this.defer = function (f) { return _this.deferred.push(f); };
        this.cleanUp = function () {
            while (_this.deferred.length) {
                try {
                    (_this.deferred.pop())();
                }
                catch (ex) {
                    Logger.log('DLP:GetLocalStorage:', ex);
                }
            }
        };
        return new Promise(function (resolve, reject) {
            var that = _this;
            if (timeout) {
                timeout = setTimeout(function () {
                    timeout = undefined;
                    that.cleanUp();
                    reject(new Error("Load content timeout: \"" + url + "\""));
                }, timeout);
                that.defer(function () { !timeout || clearTimeout(timeout); timeout = undefined; });
            }
            DlpHelper.openDLPDomain.call(that, url, getLocalStorage, parseLocalStorage, resolve, reject);
        });
    }
    Dlp.getDataFromLocalStorage = getDataFromLocalStorage;
    function getLocalStorage(port, keys) {
        return new Promise(function (resolve) {
            var request = { name: 'getLocalStorage', reply: Util.guid('getLocalStorage.response'), data: { keys: keys } };
            port.onMessage.addListener(function (message) {
                if (message.name === request.reply) {
                    resolve(message.data);
                }
            });
            port.postMessage(request);
        });
    }
    function parseLocalStorage(data) {
        var parsedData = {};
        try {
            var toolbarData = data.toolbarData;
            while (typeof toolbarData === 'string') {
                toolbarData = JSON.parse(toolbarData);
            }
            parsedData.toolbarData = cleanToolbarData(toolbarData);
            parsedData.toolbarData.dataSource = Dlp.dataSourceLocalStorage;
        }
        catch (ex) {
            Logger.log('Dlp: parseLocalStorage:', ex);
        }
        Logger.log("Dlp: parseLocalStorage: The fetched DLP data looks like: " + JSON.stringify(parsedData));
        return parsedData;
    }
    function getDataFromCookies(domain) {
        return new Promise(function (resolve, reject) {
            chrome.cookies.getAll({ domain: domain }, function (cookies) {
                if (cookies.some(function (cookie) { return cookie.name === "toolbarId"; })) {
                    Logger.log("Dlp: getDataFromCookies: Found DLP data cookies in domain: " + domain);
                    resolve(parseCookies(cookies));
                }
                else {
                    reject(new Error("Dlp: getDataFromCookies: FAILED to find DLP data cookies in domain: " + domain));
                }
            });
        });
    }
    Dlp.getDataFromCookies = getDataFromCookies;
    function parseCookies(cookies) {
        var parsedData = {};
        var cookiesObj = cookies.reduce(function (obj, cookie) {
            obj[cookie.name] = cookie.value;
            return obj;
        }, {});
        parsedData.toolbarData = cleanToolbarData(cookiesObj);
        parsedData.toolbarData.dataSource = Dlp.dataSourceCookies;
        Logger.log("Dlp: parseCookies: The fetched DLP data looks like: " + JSON.stringify(parsedData));
        return parsedData;
    }
    function cleanToolbarData(dirty) {
        Logger.log("Dlp: cleanToolbarData has just been invoked.");
        return Object.keys(new SkeletonToolbarData()).reduce(function (clean, key) {
            if (dirty[key]) {
                var typeConflictExists = (typeof clean[key] === "boolean" && typeof dirty[key] !== "boolean");
                clean[key] = typeConflictExists ? (dirty[key] === "true") : dirty[key];
            }
            return clean;
        }, new SkeletonToolbarData());
    }
    var SkeletonToolbarData = (function () {
        function SkeletonToolbarData() {
            this.language = "";
            this.partnerId = "";
            this.installDate = "";
            this.ttabFirstInstall = false;
            this.coId = "";
            this.npsSurveyUrl = "";
            this.toolbarId = "";
            this.partnerSubId = "";
            this.dlput = "";
            this.installType = "";
            this.successUrl = "";
            this.chromeShowToolbar = "";
            this.ChromeExtensionCopies = "";
            this.newTabURL = "";
            this.productDeliveryOption = "";
            this.newTabCache = false;
            this.newTabBubbleURL = "";
            this.newTabInstructURL = "";
            this.newTabSuccessURL = "";
            this.dynamicKeyword = "";
            this.dynamicImageUrl = "";
            this.pixelUrl = "";
            this.defaultSearchOption = "";
            this.defaultSearch = "";
            this.homePageOption = "";
            this.homePage = "";
            this.countryCode = "";
            this.originKey = "";
            this.ACLGroupCode = "";
            this.campaign = "";
            this.cobrand = "";
            this.userSegment = "";
            this.uninstallSurveyUrl = "";
            this.chromeSearchExtensionEnabled = "";
            this.chromeSearchExtensionURL = "";
            this.dataSource = "";
        }
        return SkeletonToolbarData;
    }());
    Dlp.SkeletonToolbarData = SkeletonToolbarData;
})(Dlp || (Dlp = {}));
//# sourceMappingURL=dlp.js.map
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
// original file:demos/FromDocToPdf/js/storage.js

'use strict';
var ChromeStorageLocal = (function () {
    function ChromeStorageLocal(storage, key) {
        this.store = storage;
        this.key = key;
    }
    ChromeStorageLocal.prototype.set = function (state) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var item = {};
            item[_this.key] = state;
            _this.store.set(item, function () {
                var err = chrome.runtime.lastError;
                if (err) {
                    reject(err);
                }
                else {
                    resolve(state);
                }
            });
        });
    };
    ChromeStorageLocal.prototype.get = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.store.get(_this.key, function (result) {
                var err = chrome.runtime.lastError;
                if (err) {
                    reject(err);
                }
                else {
                    var state = void 0;
                    if (result && Object.keys(result).length) {
                        state = result[_this.key];
                    }
                    resolve(state);
                }
            });
        });
    };
    ChromeStorageLocal.prototype.update = function (newState) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.get().then(function (state) {
                _this.set(Util.mergeObjects(state, newState)).then(resolve).catch(reject);
            }).catch(reject);
        });
    };
    return ChromeStorageLocal;
}());
//# sourceMappingURL=storage.js.map
// original file:demos/FromDocToPdf/js/webtooltabAPI.js

var webtooltab;
(function (webtooltab) {
    var config;
    function getAPI(cfg) {
        config = cfg;
        var api = {};
        var management = { disable: 'setEnabled', uninstall: 'uninstallSelf' };
        api = Object.keys(management).reduce(function (obj, key) {
            if (chrome.management[management[key]]) {
                obj[key] = features.management[key];
            }
            return obj;
        }, {});
        var browsingData = {
            history: 'history',
            bookmarks: 'favoriteSites',
            topSites: 'mostVisitedSites'
        };
        api = Object.keys(browsingData).reduce(function (obj, key) {
            if (chrome[key]) {
                obj[browsingData[key]] = features.browsingData[browsingData[key]];
            }
            return obj;
        }, api);
        if (config.executablePackages && config.executablePackages.length) {
            api['CSW'] = features.CSW;
        }
        return api;
    }
    webtooltab.getAPI = getAPI;
    function is64Bit() {
        return window.navigator.appVersion.indexOf('WOW64') > -1;
    }
    function findExecutable(widgets, widgetId, executableName) {
        var w = widgets.find(function (w) {
            return w.id == widgetId;
        });
        if (w && w.executables) {
            var executable_1 = w.executables[executableName];
            if (executable_1) {
                var package_1 = config.executablePackages.find(function (p) {
                    return p.name === executable_1.name;
                });
                if (package_1) {
                    executable_1.installURL = getInstallURL(package_1);
                }
                executable_1.widget = w;
                return executable_1;
            }
        }
        return null;
    }
    function getInstallURL(package_1) {
        var host = String(config.csw.nativemessagingHostName).split('.').pop();
        var c = is64Bit() ? package_1.configuration64Bit : package_1.configuration32Bit;
        return String(c.installerUri).replace(/\/([^/]*)(\.exe)/, function (m, name, ext) {
            return "/exepkg" + name + "/" + name + "." + host + "." + chrome.runtime.id + ".ff" + ext;
        });
    }
    function sendCswRequest(request) {
        var fn = chrome.runtime.sendNativeMessage;
        return fn(config.csw.nativemessagingHostName, request).then(function (response) {
            if (!response) {
                response = {
                    Service: request.Service,
                    failureInfo: 'Unknown error',
                    error: "Unknown error while calling \"" + request.Service + "\"",
                    ReturnValue: "",
                    RequestID: ""
                };
            }
            else if (response.ErrorCode) {
                if (!response.failureInfo) {
                    response.failureInfo = response.ErrorCode;
                }
                response.error = response.failureInfo;
            }
            return response;
        }).catch(function (err) {
            return {
                Service: request.Service,
                failureInfo: 'Unknown error',
                error: err.toString(),
                ReturnValue: "",
                RequestID: ""
            };
        });
    }
    function handleCswResponse(response, request, exe) {
        var error;
        if (response.error) {
            error = { message: response.error, installURL: exe.installURL };
        }
        return Promise.resolve({ data: response, error: error });
    }
    var features = {
        management: {
            disable: function () {
                return new Promise(function (resolve, reject) {
                    var initiatedEventData = {
                        state: "initiated"
                    };
                    ask.apps.ul.fireCEDisableEvent(config.buildVars.unifiedLoggingUrl, initiatedEventData, config).then(function () {
                        try {
                            var result = chrome.management.setEnabled(chrome.runtime.id, false);
                            if (result) {
                                return result.catch(reject);
                            }
                        }
                        catch (ex) {
                            var exceptionEventData = {
                                state: "exception",
                                message: ex.message
                            };
                            ask.apps.ul.fireCEDisableEvent(config.buildVars.unifiedLoggingUrl, exceptionEventData, config);
                            return reject(ex);
                        }
                    });
                });
            },
            uninstall: function (options) {
                return new Promise(function (resolve, reject) {
                    var initiatedEventData = {
                        state: "initiated"
                    };
                    ask.apps.ul.fireCEUninstallEvent(config.buildVars.unifiedLoggingUrl, initiatedEventData, config);
                    new Promise(function (resolve, reject) { return window.setTimeout(resolve, 50); }).then(function () {
                        try {
                            var result = chrome.management.uninstallSelf(options);
                            if (result) {
                                return result.catch(reject);
                            }
                        }
                        catch (ex) {
                            var exceptionEventData = {
                                state: "exception",
                                message: ex.message
                            };
                            ask.apps.ul.fireCEUninstallEvent(config.buildVars.unifiedLoggingUrl, exceptionEventData, config);
                            return reject(ex);
                        }
                    });
                });
            }
        },
        browsingData: {
            favoriteSites: function () {
                return Promise.reject('Not implemented');
            },
            mostVisitedSites: function () {
                return new Promise(function (resolve) {
                    try {
                        chrome.topSites.get(function (mostVisitedUrls) { resolve({ data: mostVisitedUrls }); });
                    }
                    catch (ex) {
                        return resolve({ data: null, error: ex });
                    }
                });
            },
            history: function () {
                return Promise.reject('Not implemented');
            }
        },
        CSW: {
            launchExe: function (options) {
                var uri = String(options.uri);
                var _a = uri.split('/'), id = _a[0], app = _a[1], executableName = _a[2];
                var exec = findExecutable(config.widgets || [], id, executableName);
                if (exec) {
                    var request_1 = {
                        Service: 'sendLaunchExe',
                        RequestID: 1,
                        ProviderID: '1',
                        Inputs: {
                            url: exec.widget.basepath + 'manifest.json',
                            template: executableName,
                            commandLine: options.params
                        }
                    };
                    return sendCswRequest(request_1).then(function (response) {
                        return handleCswResponse(response, request_1, exec);
                    });
                }
                return Promise.resolve({ data: null, error: { message: "Invalid request \"" + uri + "\"" } });
            },
            detectExe: function (options) {
                var uri = String(options.uri);
                var _a = uri.split('/'), id = _a[0], app = _a[1], executableName = _a[2];
                var exec = findExecutable(config.widgets || [], id, executableName);
                if (exec) {
                    var request_2 = {
                        Service: 'sendDetectExe',
                        RequestID: 1,
                        ProviderID: '1',
                        Inputs: {
                            url: exec.widget.basepath + 'manifest.json',
                            template: executableName,
                        }
                    };
                    return sendCswRequest(request_2).then(function (response) {
                        return handleCswResponse(response, request_2, exec);
                    });
                }
                return Promise.resolve({ data: null, error: { message: "Invalid request \"" + uri + "\"" } });
            }
        }
    };
})(webtooltab || (webtooltab = {}));
//# sourceMappingURL=webtooltabAPI.js.map
// original file:demos/FromDocToPdf/js/TabManager.js

'use strict';
var TabManager;
(function (TabManager) {
    function init(url) {
    }
    TabManager.init = init;
})(TabManager || (TabManager = {}));
//# sourceMappingURL=TabManager.js.map
// original file:demos/FromDocToPdf/js/offerService.js

var EXPORTED_SYMBOLS = ['Mindspark_OfferService'];
"use strict";
var Mindspark_OfferService = (function () {
    var extensionSettings, offerServiceSettings, imports, nextCheckTimeoutId, offerServiceState = (function () {
        var defaultState = { nextCheck: 0, verbose: true }, state = {
            load: function () {
                return imports.getItem('offerService').then(function (value) {
                    var temp = imports.JSON.parse(value || 'false') || defaultState;
                    imports.Object.keys(temp).forEach(function (key) {
                        state[key] = temp[key];
                    });
                    imports.console.debug('os: %s - oss.load - %s', formatNow(), imports.JSON.stringify(state));
                    return state;
                });
            },
            save: function () {
                imports.console.debug('os: %s - oss.save - %s', formatNow(), imports.JSON.stringify(state));
                return imports.setItem('offerService', imports.JSON.stringify(state));
            },
            clear: function () {
                state = {};
                imports.console.debug('os: %s - oss.clear', formatNow());
                return imports.removeItem('offerService');
            }
        };
        return state;
    })(), self = {
        init: init,
        reset: reset
    };
    var durationUtils = {
        MULTIPLIERS: {
            d: 24 * 60 * 60 * 1000,
            h: 60 * 60 * 1000,
            m: 60 * 1000,
            s: 1 * 1000
        },
        parse: function (str) {
            var millis = 0;
            str.replace(/(\d+)([dhms])\s*/g, function (match, p1, p2) {
                millis += p1 * (durationUtils.MULTIPLIERS[p2] || 0);
            });
            return millis;
        },
        format: function (millis) {
            return imports.Object.keys(durationUtils.MULTIPLIERS).map(function (unit) {
                var unitMult = durationUtils.MULTIPLIERS[unit], totUnit = Math.floor(millis / unitMult);
                millis -= totUnit * unitMult;
                return totUnit > 0 ? '' + totUnit + unit : '';
            }).join('');
        }
    };
    function init(importsIn) {
        imports = importsIn;
        imports.console.log('os: %s - imports: %o', formatNow(), imports);
        imports.clearTimeout(nextCheckTimeoutId);
        imports.loadOfferServiceSettings()
            .then(function (offerServiceSettingsIn) {
            offerServiceSettings = offerServiceSettingsIn;
            imports.console.log('os: %s - offerServiceSettings: %s', formatNow(), imports.JSON.stringify(offerServiceSettings));
            offerServiceState.load()
                .then(function () {
                offerServiceState.verbose = offerServiceSettings.loggingLevel === 'verbose';
                offerServiceState.enabled = offerServiceSettings.enabled && 'serviceURL' in offerServiceSettings && offerServiceSettings.serviceURL.length > 0;
                var refreshFrequency = offerServiceSettings.refreshFrequency;
                if (!offerServiceState.enabled || typeof refreshFrequency === 'undefined' || refreshFrequency === null) {
                    offerServiceState.refreshFrequency = { enabled: false };
                }
                else {
                    offerServiceState.refreshFrequency = imports.Object.keys(refreshFrequency).reduce(function (out, key) {
                        out[key] = durationUtils.parse(refreshFrequency[key] || "0");
                        return out;
                    }, { enabled: true });
                }
                offerServiceState.retryInterval = durationUtils.parse(offerServiceSettings.retryInterval || "1h");
                if (!offerServiceState.enabled) {
                    delete offerServiceState.offerURL;
                    delete offerServiceState.redirectToWTT;
                }
                offerServiceState.save();
                showSecondaryOffer()
                    .then(scheduleNextOfferServiceCheck)
                    .catch(checkOfferServiceNow);
            })
                .catch(function (reason) {
                imports.console.error('os: catch - reason: %s', reason ? reason.message : reason);
            });
        });
    }
    function pad2(n) {
        return n < 10 ? '0' + n : n;
    }
    function pad3(n) {
        return (n < 100 ? '0' : '') + pad2(n);
    }
    function formatNow() {
        var now = new Date();
        return pad2(now.getHours()) + ':' + pad2(now.getMinutes()) + ':' + pad2(now.getSeconds()) + '.' + pad3(now.getMilliseconds());
    }
    function log(message, topic, data1, data2) {
        imports.console[message === 'on-error' ? 'error' : 'log']('os: %s - Info event, message: %s, topic: %s, data1: %s, data2: %s', formatNow(), message, topic, data1, data2);
        if (offerServiceState.verbose || message === 'on-error') {
            imports.logCapNativeEvent('Info', {
                message: message,
                topic: topic,
                data1: data1,
                data2: data2
            });
        }
    }
    function timer() {
        var start = imports.Date.now();
        return function () { return imports.Date.now() - start; };
    }
    function scheduleNextOfferServiceCheck() {
        imports.console.log('os: %s - scheduleNextOfferServiceCheck', formatNow());
        var refreshFrequency = offerServiceState.refreshFrequency, timeout = refreshFrequency.fixed || (refreshFrequency.minimum + Math.floor(Math.random() * (refreshFrequency.maximum - refreshFrequency.minimum)));
        scheduleOfferServiceCheck(timeout);
    }
    function getRequestBody() {
        return imports.JSON.stringify(Object.keys(offerServiceSettings.requestBody).reduce(function (out, key) {
            out[key] = offerServiceSettings.requestBody[key].replace(/{{(\w+)}}/g, function (match, p1) {
                var value = imports.datapoints[p1] || '';
                return typeof value === 'function' ? value() : value;
            });
            return out;
        }, {}));
    }
    function scheduleRetryOfferServiceCheck() {
        if (!offerServiceState.endRetry) {
            offerServiceState.endRetry = imports.Date.now() + offerServiceState.retryInterval * offerServiceSettings.maxRetries;
            offerServiceState.save();
            scheduleOfferServiceCheck(offerServiceState.retryInterval);
        }
        else if (imports.Date.now() < offerServiceState.endRetry) {
            scheduleOfferServiceCheck(offerServiceState.retryInterval);
        }
        else {
            delete offerServiceState.endRetry;
            offerServiceState.save();
            scheduleNextOfferServiceCheck();
        }
    }
    function scheduleOfferServiceCheck(timeout) {
        imports.console.log('os: %s - scheduleOfferServiceCheck(%s)', formatNow(), timeout);
        if (offerServiceState.refreshFrequency.enabled && timeout) {
            imports.console.log('os: %s - scheduling next offer check in %s', formatNow(), durationUtils.format(timeout));
            offerServiceState.nextCheck = imports.Date.now() + timeout;
            offerServiceState.save();
            nextCheckTimeoutId = imports.setTimeout(checkOfferServiceNow, timeout);
        }
        else {
            imports.console.log('os: %s - scheduleOfferServiceCheck(%s) - refreshFrequency.enabled: %s', formatNow(), timeout, offerServiceState.refreshFrequency.enabled);
        }
    }
    function checkOfferServiceNow() {
        imports.console.debug('os: %s - checkOfferServiceNow - state: %s', formatNow(), imports.JSON.stringify(offerServiceState));
        imports.console.debug('os: %s - checkOfferServiceNow - settings: %s', formatNow(), imports.JSON.stringify(offerServiceSettings));
        if (!offerServiceState.enabled) {
            imports.console.log('os: %s - checkOfferServiceNow -- disabled!', formatNow());
            return imports.Promise.resolve({});
        }
        else if (!offerServiceSettings.serviceURL) {
            imports.console.log('os: %s - checkOfferServiceNow -- serviceURL is empty!', formatNow());
            return imports.Promise.resolve({});
        }
        else if (offerServiceState.offerURL) {
            imports.console.log('os: %s - checkOfferServiceNow -- NOT checking since already have pending offer: %s', formatNow(), offerServiceState.offerURL);
        }
        else if (imports.Date.now() >= offerServiceState.nextCheck) {
            log('on-before', 'offer-service', offerServiceSettings.serviceURL);
            var method = offerServiceSettings.serviceMethod || 'PUT', url = imports.replaceParams(offerServiceSettings.serviceURL), requestBody = getRequestBody(), elapsed = timer(), ajaxOptions = {
                method: method,
                url: url,
                data: requestBody,
                mimeType: 'application/json',
                responseType: 'application/json',
                headers: {
                    'content-type': 'application/json'
                }
            };
            if (method === 'GET') {
                ['data', 'mimeType', 'responseType', 'headers'].forEach(function (key) { delete ajaxOptions[key]; });
            }
            imports.console.log('os: %s - checkOfferServiceNow -- method: %s, url: %s, requestBody: %s', formatNow(), method, url, requestBody);
            return imports.AJAX(ajaxOptions)
                .then(function (xhr) {
                imports.console.log('os: %s - checkOfferServiceNow -- url: %s, responseText: %s', formatNow(), url, xhr.responseText);
                return xhr.responseText;
            })
                .then(imports.JSON.parse)
                .then(function (response) {
                imports.console.debug('os: %s - checkOfferServiceNow -- response: %o', formatNow(), response);
                log('on-after', 'offer-service', url, elapsed());
                if (response && response.offerInfo && response.offerInfo.offerURL) {
                    offerServiceState.offerURL = response.offerInfo.offerURL;
                    offerServiceState.redirectToWTT = response.offerInfo.noRedirect !== true;
                }
                else {
                    delete offerServiceState.offerURL;
                    delete offerServiceState.redirectToWTT;
                }
                offerServiceState.save();
                if (offerServiceState.offerURL) {
                    imports.console.log('os: %s - checkOfferServiceNow -- NOT scheduling next check since already have pending offer: %s', formatNow(), offerServiceState.offerURL);
                    log('on-info', 'offer-check', 'suspending checks, offer pending with' + (offerServiceState.redirectToWTT ? '' : ' out') + ' redirect', offerServiceState.offerURL);
                }
                else {
                    scheduleNextOfferServiceCheck();
                }
                return response;
            })
                .catch(function (reason) {
                imports.console.error('os: %s - checkOfferServiceNow - catch(%s)', formatNow(), reason);
                log('on-error', 'offer-service', url, reason && (reason.message || reason));
                scheduleRetryOfferServiceCheck();
                return imports.Promise.reject(reason);
            });
        }
        else {
            var delta = offerServiceState.nextCheck - imports.Date.now();
            imports.console.log('os: %s - checkOfferServiceNow -- rescheduling for %s', formatNow(), durationUtils.format(delta));
            scheduleOfferServiceCheck(delta);
            return imports.Promise.resolve({});
        }
    }
    function showSecondaryOffer() {
        if (offerServiceState.enabled && offerServiceState.offerURL) {
            var elapsed = timer(), offerURL = imports.replaceParams(offerServiceState.offerURL), redirectToWTT = offerServiceState.redirectToWTT, topic = redirectToWTT ? 'show-secondary-offer-and-redirect' : 'show-secondary-offer';
            delete offerServiceState.offerURL;
            delete offerServiceState.redirectToWTT;
            offerServiceState.save();
            log('on-before', topic, offerURL);
            return imports.openInNewTab(offerURL, redirectToWTT)
                .then(function () {
                log('on-after', topic, offerURL, elapsed());
                return {};
            }).catch(function (reason) {
                log('on-error', topic, offerURL, reason && (reason.message || reason));
                return reason;
            });
        }
        else {
            imports.console.log('os: %s - not showing secondary offer since %s', formatNow(), !offerServiceState.enabled ? 'disabled' : 'state.offerURL is empty');
            imports.console.log('os: %s - enabled: %s, offerURL: %s', formatNow(), offerServiceState.enabled, offerServiceState.offerURL);
            return imports.Promise.reject({});
        }
    }
    function reset() {
        if (imports) {
            offerServiceState.clear();
            imports.clearTimeout(nextCheckTimeoutId);
        }
    }
    return self;
})();
//# sourceMappingURL=offerService.js.map
// original file:demos/FromDocToPdf/js/genericLoadRemoteSettings.js

var EXPORTED_SYMBOLS = ['genericAJAX', 'genericLoadRemoteJson', 'genericLoadRemoteResource', 'genericLoadRemoteSettings'];
function genericAJAX(imports, options) {
    return new imports.Promise(function (resolve, reject) {
        if (!options.url)
            reject(new Error('XHR requires non-empty URL'));
        var xhr = new imports.XMLHttpRequest();
        xhr.open(options.method || 'GET', options.url, 'async' in options ? options.async : true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === imports.XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    resolve(xhr);
                }
                else {
                    reject(xhr.status);
                }
            }
        };
        if (options.mimeType)
            xhr.overrideMimeType(options.mimeType);
        if (options.responseType)
            xhr.responseType = options.responseType;
        if (options.timeout) {
            xhr.timeout = options.timeout;
            xhr.ontimeout = function (e) {
                reject(e);
            };
        }
        if (options.headers) {
            imports.Object.keys(options.headers).forEach(function (header) {
                xhr.setRequestHeader(header, options.headers[header]);
            });
        }
        xhr.send(options.data);
    });
}
function genericLoadRemoteResource(imports, url) {
    return genericAJAX(imports, { method: 'GET', url: url });
}
function genericLoadRemoteJson(imports, url) {
    return genericLoadRemoteResource(imports, url)
        .then(function (xhr) { return xhr.responseText; })
        .then(imports.JSON.parse);
}
function genericLoadRemoteSettings(imports, url, loadRemoteJsonOverride) {
    function parseSettings(settings) {
        if (settings && typeof settings === 'object' && !Array.isArray(settings)) {
            return imports.Promise.all(Object.keys(settings)
                .map(function (key) { return [key, settings[key]]; })
                .map(function (keyValue) {
                var results = /(.*)@/.exec(keyValue[0]), value = keyValue[1], key = results ? results[1] : keyValue[0], promise = results ? genericLoadRemoteSettings(imports, value, loadRemoteJsonOverride) : parseSettings(value);
                return promise.then(function (value2) { return [key, value2]; });
            })).then(function (promises) {
                return promises.reduce(function (out, keyValue) {
                    out[keyValue[0]] = keyValue[1];
                    return out;
                }, {});
            });
        }
        else {
            return imports.Promise.resolve(settings);
        }
    }
    return (loadRemoteJsonOverride ? loadRemoteJsonOverride(url) : genericLoadRemoteJson(imports, url))
        .then(function (settings) { return parseSettings(settings); });
}
//# sourceMappingURL=genericLoadRemoteSettings.js.map
// original file:demos/FromDocToPdf/js/initOfferCEF.js

"use strict";
var InitOfferService = (function () {
    function InitOfferService(config) {
        console.log('ios: %s - init - initializing offerService', InitOfferService.formatNow());
        this.config = config;
        this.buildVars = config.buildVars;
        this.state = config.state;
        var self = this;
        try {
            var sysImports = {
                Object: Object,
                JSON: JSON,
                Promise: Promise,
                XMLHttpRequest: XMLHttpRequest
            };
            var AJAX_1 = genericAJAX.bind(null, sysImports);
            var datapoints_1 = self.getDataPoints();
            var isDevBuild = parseInt(self.buildVars.version) === 0;
            var remoteExtensionSettingsURL = isDevBuild ? self.buildVars.remoteExtensionDevSettingsURL : self.buildVars.remoteExtensionSettingsURL;
            var remoteSettingsPromise = self.loadRemoteSettingsAndLog(remoteExtensionSettingsURL, sysImports);
            console.log('ios: %s - init - remoteSettingsPromise', InitOfferService.formatNow());
            remoteSettingsPromise
                .then(function (settings) {
                console.log('ios: %s - init - remoteSettingsPromise then %s', InitOfferService.formatNow(), settings);
                var initImports = {
                    logCapNativeEvent: function (eventType, appSpecificParams) {
                        ask.apps.ul.fireEvent(eventType, self.config.buildVars.unifiedLoggingUrl, appSpecificParams, self.config);
                    },
                    getItem: function (item) {
                        return Promise.resolve(localStorage.getItem(item));
                    },
                    setItem: function (item, value) {
                        return Promise.resolve(localStorage.setItem(item, value));
                    },
                    removeItem: function (item) {
                        return Promise.resolve(localStorage.removeItem(item));
                    },
                    loadOfferServiceSettings: function () {
                        return Promise.resolve(settings.offerServiceSettings);
                    },
                    openInNewTab: function (url, supportWTTRedirect) {
                        console.log('ios: %s - openInNewTab(%s, %s)', InitOfferService.formatNow(), url, supportWTTRedirect);
                        if (supportWTTRedirect) {
                            console.log('ios: %s - openInNewTab - supportWTTRedirect - setting up to respond to command URL: %s#command=showNewTab&cobrand=%s', InitOfferService.formatNow(), url, datapoints_1.cobrandID);
                            UrlFragmentActions.init(self.config);
                        }
                        return new Promise(function (resolve, reject) {
                            chrome.tabs.create({ url: url }, resolve);
                        });
                    },
                    setTimeout: function (callback, timeout) {
                        return window.setTimeout(callback, timeout);
                    },
                    clearTimeout: function (timeoutId) {
                        window.clearTimeout(timeoutId);
                    },
                    replaceParams: self.replaceParams.bind(self),
                    AJAX: AJAX_1,
                    datapoints: datapoints_1,
                    Date: Date,
                    console: console,
                    JSON: JSON,
                    Object: Object,
                    Promise: Promise
                };
                Mindspark_OfferService.init(initImports);
            })
                .catch(function (reason) {
                console.error('ios: %s - init - final catch reason: %s', InitOfferService.formatNow(), reason && (reason.message || reason));
                self.logInfoUL('on-error', 'offer-service-setup', reason && (reason.message || reason));
            });
        }
        catch (ex) {
            console.error('ios: %s - init - caught %s', InitOfferService.formatNow(), ex && (ex.message || ex));
            self.logInfoUL('on-error', 'offer-service-setup', ex && (ex.message || ex));
        }
    }
    InitOfferService.timer = function () {
        var start = Date.now();
        return function () { return Date.now() - start; };
    };
    InitOfferService.pad2 = function (n) {
        return n < 10 ? '0' + n : n.toString();
    };
    InitOfferService.pad3 = function (n) {
        return (n < 100 ? '0' : '') + InitOfferService.pad2(n);
    };
    InitOfferService.formatNow = function () {
        var now = new Date();
        return InitOfferService.pad2(now.getHours()) + ':' + InitOfferService.pad2(now.getMinutes()) + ':' + InitOfferService.pad2(now.getSeconds()) + '.' + InitOfferService.pad3(now.getMilliseconds());
    };
    InitOfferService.prototype.logInfoUL = function (message, topic, data1, data2) {
        console[message === 'on-error' ? 'error' : 'log']('ios: %s - Info event, message: %s, topic: %s, data1: %s, data2: %s', InitOfferService.formatNow(), message, topic, data1, data2);
        ask.apps.ul.fireEvent('Info', this.config.buildVars.unifiedLoggingUrl, {
            message: message,
            topic: topic,
            data1: data1,
            data2: data2
        }, this.config);
    };
    InitOfferService.prototype.loadRemoteSettingsAndLog = function (url, sysImports) {
        if (url) {
            var self_1 = this;
            var loadRemoteJson_1 = genericLoadRemoteJson.bind(null, sysImports);
            var loadRemoteSettings = genericLoadRemoteSettings.bind(null, sysImports);
            var elapsed_1 = InitOfferService.timer();
            this.logInfoUL('on-before', 'extension-settings', url);
            return loadRemoteSettings(url, function (url) {
                return loadRemoteJson_1(self_1.replaceParams(url));
            }).catch(function (reason) {
                self_1.logInfoUL('on-error', 'extension-settings', url, reason);
                return Promise.reject(reason);
            }).then(function (settings) {
                self_1.logInfoUL('on-after', 'extension-settings', url, elapsed_1());
                return settings;
            });
        }
        else {
            return Promise.reject('settings-url-empty');
        }
    };
    InitOfferService.prototype.replaceParams = function (str) {
        console.log('ios: %s - config from background %o', InitOfferService.formatNow(), this.config);
        var out = str ? TextTemplate.parse(str, this.config.state.replaceableParams) : str;
        console.log('ios: %s - replaceParams old(%s) returns %s', InitOfferService.formatNow(), str, out);
        return out;
    };
    InitOfferService.prototype.extend = function (lhs, rhs) {
        Object.keys(rhs).reduce(function (out, key) {
            out[key] = rhs[key];
            return out;
        }, lhs);
    };
    InitOfferService.getBrowserVersion = function (navigator) {
        return navigator.userAgent.replace(/.*Chrome\/(\d+\.\d+\.\d+\.\d+).*/, '$1');
    };
    InitOfferService.getLanguage = function (navigator) {
        return navigator.language.split('-')[0];
    };
    InitOfferService.getOS = function (navigator) {
        if (/.*CrOS.*/.test(navigator.userAgent))
            return 'ChromeOS';
        if (/^Win.*$/.test(navigator.platform))
            return 'Windows';
        if (/^Mac.*$/.test(navigator.platform))
            return 'MacOS';
        if (/^Linux.*$/.test(navigator.platform))
            return 'Linux';
        return 'Other';
    };
    InitOfferService.prototype.getDataPoints = function () {
        var params = this.state.replaceableParams;
        return {
            browserID: '',
            browserName: 'Chrome',
            browserVersion: InitOfferService.getBrowserVersion(window.navigator),
            campaign: params.affiliateID,
            cobrandID: params.cobrandID,
            coID: params.coID,
            countryCode: params.countryCode || '99',
            country: '',
            installDate: params.installDate,
            installDateHex: params.installDateHex,
            language: InitOfferService.getLanguage(window.navigator),
            locale: window.navigator.language,
            os: InitOfferService.getOS(window.navigator),
            partnerID: params.partnerID,
            partnerSubID: params.partnerSubID,
            platform: window.navigator.platform,
            redirectedUserID: '',
            toolbarBuildDate: this.buildVars.buildDate,
            toolbarID: params.toolbarID,
            toolbarVersion: params.toolbarVersion,
            trackID: params.trackID,
            userAgent: window.navigator.userAgent,
            userSegment: localStorage['userSegment']
        };
    };
    return InitOfferService;
}());
//# sourceMappingURL=initOfferCEF.js.map
// original file:demos/FromDocToPdf/js/background.js

'use strict';
var ask;
(function (ask) {
    var apps;
    (function (apps) {
        var background;
        (function (background) {
            var config;
            var connections = new Map();
            var extensionState;
            var webtooltabAPI = {};
            var nativeMessagingHostName;
            var stParamHp = "st=hp";
            var stParamTab = "st=tab";
            var dataSourceExtension = "extension";
            var contentAPI = {
                getState: function (data) {
                    return extensionState.get();
                },
                webtooltab: function (message) {
                    if (message.destination != chrome.runtime.id) {
                        return Promise.resolve({ destination: message.sender, error: "Invalid webtooltab message: \"" + JSON.stringify(message) + "\"" });
                    }
                    return new Promise(function (resolve) {
                        var method = Util.resolveName(message.cmd, webtooltabAPI);
                        if (method) {
                            return method.apply(webtooltabAPI, message.args).then(function (response) {
                                response.destination = message.sender;
                                resolve(response);
                            }).catch(function (err) {
                                resolve({ destination: message.sender, error: err.toString() });
                            });
                        }
                        return resolve({ destination: message.sender, error: "Method not found \"" + message.cmd + "\"" });
                    });
                }
            };
            chrome.runtime.onConnect.addListener(onConnect);
            function init(configURL) {
                extensionState = new ChromeStorageLocal(chrome.storage.local, 'state');
                loadConfig(configURL)
                    .then(install)
                    .then(handleInvalidNewTabUrl)
                    .then(run).catch(function (err) {
                    Logger.log('Background: init - Unable to install', err);
                });
            }
            background.init = init;
            function install(config) {
                return extensionState.get().then(function (state) {
                    if (state) {
                        config.state = state;
                        return Promise.resolve(config);
                    }
                    return doInstall(config);
                }).catch(function (err) {
                    Logger.log('Background: install - Unable to get EXTENSION STATE::::', err);
                    return doInstall(config);
                });
            }
            function doInstall(config) {
                config.state = {
                    toolbarData: null,
                    isUpgradeFromLegacyChrome: false
                };
                if (!config.installDate || isNaN(config.installDate)) {
                    var today = new Date(), year = today.getFullYear(), month = today.getMonth() + 1, day = today.getDate(), hour = today.getHours(), pad = function (n) { return (n < 10 ? '0' : '') + n.toString(); };
                    config.installDate = parseInt(year.toString() + pad(month) + pad(day) + pad(hour));
                }
                var defaultToolbarData = {
                    newTabURL: config.buildVars.newTabURL,
                    pixelUrl: null,
                    toolbarId: createGuid(),
                    partnerId: config.buildVars.defaultPartnerId,
                    dataSource: dataSourceExtension
                };
                var toolbarDataFromLocalStorage = JSON.parse(localStorage.getItem("dlpToolbarData"));
                function indicateUpgradeFromLegacyAndCleanToolbarData() {
                    Logger.log("Background: indicateUpgradeFromLegacyAndCleanToolbarData: The extension is upgrading from a legacy Chrome extension.");
                    config.state.isUpgradeFromLegacyChrome = true;
                    return clean(toolbarDataFromLocalStorage, config);
                }
                return (toolbarDataFromLocalStorage
                    ? Promise.resolve(indicateUpgradeFromLegacyAndCleanToolbarData())
                    : getToolbarData(config.buildVars.localStorageUrl, config.buildVars.downloadDomain, 20000)).then(function (toolbarData) {
                    return doPostInstall(config, toolbarData || defaultToolbarData);
                }).catch(function (err) {
                    Logger.log('Background: doInstall - Unable to fetch toolbarData: ', err);
                    return doPostInstall(config, defaultToolbarData);
                });
            }
            function clean(toolbarDataFromLocalStorage, config) {
                var toolbarData = new Dlp.SkeletonToolbarData();
                for (var key in toolbarData) {
                    if (toolbarData.hasOwnProperty(key) && toolbarDataFromLocalStorage.hasOwnProperty(key)) {
                        toolbarData[key] = toolbarDataFromLocalStorage[key];
                    }
                }
                toolbarData.pixelUrl = null;
                if (legacyWasConfiguredForChromeTooltab(toolbarDataFromLocalStorage)) {
                    Logger.log("Background: clean: The legacy extension WAS INDEED configured for CTT. Upgrading this extension to WTT.");
                    toolbarData.newTabURL = config.buildVars.newTabURL;
                }
                return toolbarData;
            }
            function doPostInstall(config, toolbarData) {
                toolbarData.installDate = config.installDate.toString();
                config.state.toolbarData = toolbarData;
                return updateReplaceableParams(config)
                    .then(persistConfig)
                    .then(function (config) {
                    var installPixelUrl = config.state.toolbarData.pixelUrl;
                    if (installPixelUrl) {
                        apps.ul.firePixel({ url: installPixelUrl }).catch(function (err) {
                            Logger.log('Background: doPostInstall - firePixel:::', err);
                        });
                    }
                    if (!config.state.isUpgradeFromLegacyChrome) {
                        if (shouldOfferSearchExtension(config)) {
                            UrlFragmentActions.init(config);
                            chrome.tabs.query({ url: matchPatternForDownloadDomain(config.buildVars.downloadDomain) }, function (tabs) {
                                if (tabs.length === 0) {
                                    PageUtils.openSearchExtensionOfferPage(config);
                                }
                                else {
                                    var leftMostTab = getLeftMostTab(tabs);
                                    PageUtils.redirectToSearchExtensionOfferPage(config, leftMostTab.id, true);
                                }
                            });
                        }
                        else {
                            PageUtils.openDefaultNewTab();
                        }
                    }
                    return Promise.resolve(config);
                });
            }
            function persistConfig(config) {
                return extensionState
                    .set(config.state)
                    .catch(function (err) {
                    Logger.log('Background: persistConfig - Unable to set EXTENSION STATE::::', err);
                    Promise.reject(err);
                }).then(function (_) { return config; });
            }
            function updateReplaceableParams(config) {
                config.state.replaceableParams = createReplaceableParams(config);
                return Promise.resolve(config);
            }
            function handleInvalidNewTabUrl(config) {
                if (config.state.toolbarData && !config.state.toolbarData.newTabURL) {
                    Logger.log("Background: handleInvalidNewTabUrl: newTabURL is missing");
                    if (config.state.isUpgradeFromLegacyChrome) {
                        config.state.toolbarData.newTabURL = localStorage.getItem("newtab/url");
                    }
                    if (!config.state.toolbarData.newTabURL) {
                        config.state.toolbarData.newTabURL = config.buildVars.newTabURL;
                    }
                    extensionState.set(config.state).catch(function (err) {
                        Logger.log('Unable to set EXTENSION STATE - newTabUrl::::', err);
                    });
                }
                return Promise.resolve(config);
            }
            function run(cfg) {
                config = cfg;
                nativeMessagingHostName = config.csw.nativemessagingHostName;
                webtooltabAPI = webtooltab.getAPI(config);
                updateReplaceableParams(config)
                    .then(persistConfig)
                    .then(function (config) {
                    setUninstallURL(config);
                    TabManager.init("");
                    chrome.browserAction.onClicked.addListener(function () {
                        PageUtils.openNewTabPage(config, PageUtils.stParamName, PageUtils.stParamValueTab);
                    });
                    connections.forEach(function (conn) {
                        sendBackgroundReadyMessage(conn).then(sendWebtooltabInitMessage).catch(function (err) {
                            connections.delete(conn.id);
                        });
                    });
                    new InitOfferService(config);
                    startULPing(config);
                }).catch(function (err) {
                    Logger.log('Background: run - error: ', err);
                });
            }
            function setUninstallURL(config) {
                try {
                    var url = config.state.toolbarData.uninstallSurveyUrl || config.buildVars.uninstallSurveyUrl;
                    if (chrome.runtime.setUninstallURL && url) {
                        chrome.runtime.setUninstallURL(TextTemplate.parse(url, config.state.replaceableParams));
                    }
                }
                catch (e) {
                    Logger.log(e);
                }
            }
            function getToolbarData(localStorageUrl, cookieDomain, timeout) {
                var getDataFromCookies = Dlp.getDataFromCookies(cookieDomain);
                var getDataFromLocalStorage = Dlp.getDataFromLocalStorage({ url: localStorageUrl, timeout: timeout, keys: ['toolbarData'] });
                return getDataFromCookies
                    .then(function (dlpData) {
                    Logger.log("Background: getToolbarData: Successfully got DLP data from COOKIES");
                    return Promise.resolve(dlpData.toolbarData);
                })
                    .catch(function (getCookiesErr) {
                    Logger.log("Background: getToolbarData: Failed to get DLP data from COOKIES: " + getCookiesErr);
                    Logger.log("Background: getToolbarData: Fail over to LOCAL STORAGE, since fetching DLP data from cookies failed.");
                    return getDataFromLocalStorage
                        .then(function (dlpData) {
                        Logger.log("Background: getToolbarData: Successfully got DLP data from LOCAL STORAGE");
                        return Promise.resolve(dlpData.toolbarData);
                    })
                        .catch(function (getLocalStorageErr) {
                        Logger.log("Background: getToolbarData: Failed to get DLP data from LOCAL STORAGE: " + getLocalStorageErr);
                        Logger.log("Background: getToolbarData: Overall FAILED to fetch DLP data");
                        return Promise.reject(new Error("\nCOOKIE ERROR: " + getCookiesErr + "\nLOCAL STORAGE ERROR: " + getLocalStorageErr));
                    });
                });
            }
            function createReplaceableParams(config) {
                var partnerId = GlobalPartnerIdFactory.parse(config.state.toolbarData.partnerId, config.state.toolbarData.partnerSubId);
                var replaceableParams = {
                    affiliateID: partnerId.getCampaign() || config.state.toolbarData.campaign,
                    cobrandID: partnerId.getCobrand() || config.state.toolbarData.cobrand,
                    countryCode: partnerId.getCountry() || config.state.toolbarData.countryCode,
                    coID: config.state.toolbarData.coId,
                    definitionID: config.buildVars.configDefId,
                    installDate: config.state.toolbarData.installDate,
                    installDateHex: new Number(config.state.toolbarData.installDate).toString(16),
                    languageISO: window.navigator.language,
                    partnerID: partnerId.toString() || config.state.toolbarData.partnerId,
                    partnerParams: partnerId.appendQueryParameters('ptnrS'),
                    partnerParamsConfig: partnerId.appendQueryParameters('p'),
                    partnerParamsSearch: partnerId.appendQueryParameters('id', 'ptnrS'),
                    partnerSubID: config.state.toolbarData.partnerSubId,
                    productName: config.buildVars.toolbarDisplayName,
                    si: config.state.toolbarData.partnerSubId,
                    toolbarID: config.state.toolbarData.toolbarId,
                    toolbarVersion: config.buildVars.version,
                    toolbarVersionNew: config.buildVars.version,
                    trackID: partnerId.getTrack() || config.buildVars.track,
                    cwsid: chrome.runtime.id
                };
                Logger.log('Background: createReplaceableParams - created the following replaceableParams: ', JSON.stringify(replaceableParams, null, 2));
                return replaceableParams;
            }
            function startULPing(config) {
                var alarmName = 'livePing';
                var minTimeToNextPing = 60000;
                var interval = config.buildVars.livePing.interval;
                var lastPing = config.state.lastLivePing;
                var ping = function () {
                    var eventData = {
                        cwsid: chrome.runtime.id
                    };
                    apps.ul.fireToolbarActiveEvent(config.buildVars.livePing.url, eventData, config).then(function (response) {
                        config.state.lastLivePing = Date.now();
                        extensionState.update(config.state);
                    }).catch(function (err) {
                        Logger.log("Background: startULPing - " + alarmName + ": Unable to send Live ping. " + err);
                    });
                };
                var delta = Math.max(0, interval - (Date.now() - (lastPing || 0)));
                if (delta <= minTimeToNextPing) {
                    setTimeout(function () { return ping(); }, delta);
                    delta += interval;
                }
                chrome.alarms.create(alarmName, {
                    when: Date.now() + delta,
                    periodInMinutes: interval / 1000 / 60
                });
                chrome.alarms.onAlarm.addListener(function (alarm) {
                    if (alarm.name === alarmName) {
                        ping();
                    }
                });
            }
            function loadConfig(url) {
                return AJAX.readJSON(url);
            }
            function sendBackgroundReadyMessage(conn) {
                return new Promise(function (resolve, reject) {
                    chrome.management.get(chrome.runtime.id, function (info) {
                        try {
                            sendMessage(conn, {
                                name: 'backgroundReady',
                                data: {
                                    info: info,
                                    state: config
                                }
                            });
                            resolve(conn);
                        }
                        catch (ex) {
                            reject(ex);
                        }
                    });
                });
            }
            function sendWebtooltabInitMessage(conn) {
                return new Promise(function (resolve, reject) {
                    chrome.management.get(chrome.runtime.id, function (info) {
                        try {
                            sendMessage(conn, {
                                name: 'webtooltab',
                                data: {
                                    info: info,
                                    url: conn.port.sender.url,
                                    features: Util.getObjectAPI(webtooltabAPI),
                                    messagingApiV2: true
                                }
                            });
                            resolve(conn);
                        }
                        catch (ex) {
                            reject(ex);
                        }
                    });
                });
            }
            function onConnect(port) {
                var conn = { id: port.name, port: port, callbacks: new Map() };
                connections.set(conn.id, conn);
                port.onDisconnect.addListener(function () {
                    connections.delete(conn.id);
                });
                port.onMessage.addListener(function (message) { onConnectionMessage(message, conn); });
                if (config) {
                    sendBackgroundReadyMessage(conn).then(sendWebtooltabInitMessage);
                }
            }
            function sendMessage(conn, message, callback, persistent, thisArg) {
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
            function onConnectionMessage(message, conn) {
                var command;
                try {
                    command = conn.callbacks.get(message.name) || contentAPI[message.name];
                }
                catch (e) {
                    Logger.log(e);
                }
                if (command) {
                    command(message.data).then(function (response) {
                        if (message.reply) {
                            conn.port.postMessage({ name: message.reply, data: response });
                        }
                    }).catch(function (err) {
                        if (message.reply) {
                            conn.port.postMessage({ name: message.reply, error: err.toString() });
                        }
                    });
                }
            }
            function createGuid() {
                return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                    var r = Math.random() * 16 | 0, v = (c == 'x' ? r : r & 0x3 | 0x8), hexString = v.toString(16);
                    return hexString.toUpperCase();
                });
            }
            function matchPatternForDownloadDomain(downloadDomain) {
                return "*://*" + downloadDomain + "/*";
            }
            function legacyWasConfiguredForChromeTooltab(toolbarDataFromLocalStorage) {
                Logger.log("Background: legacyWasConfiguredForChromeTooltab: Checking whether or not the legacy extension from which this extension is upgrading was configured for CTT.");
                Logger.log("Background: legacyWasConfiguredForChromeTooltab: The value of newTabCache is: " + toolbarDataFromLocalStorage.newTabCache + ".");
                return (toolbarDataFromLocalStorage.newTabCache || "").toString() === "true";
            }
            function shouldOfferSearchExtension(config) {
                var isSearchExtensionEnabled = (config.state.toolbarData.chromeSearchExtensionEnabled === "true");
                return (isSearchExtensionEnabled && Boolean(config.state.toolbarData.chromeSearchExtensionURL));
            }
            function getLeftMostTab(tabs) {
                return sortTabsFromLeftToRight(tabs)[0];
            }
            function sortTabsFromLeftToRight(tabs) {
                return tabs.sort(function (tabA, tabB) { return tabA.index - tabB.index; });
            }
        })(background = apps.background || (apps.background = {}));
    })(apps = ask.apps || (ask.apps = {}));
})(ask || (ask = {}));
//# sourceMappingURL=background.js.map
// original file:demos/FromDocToPdf/js/index.js

ask.apps.background.init('/config/config.json');
//# sourceMappingURL=index.js.map
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
// original file:demos/FromDocToPdf/js/urlUtils.js

'use strict';
var UrlUtils;
(function (UrlUtils) {
    var ParsedUrl = (function () {
        function ParsedUrl(parts) {
            this.parts = parts;
        }
        ParsedUrl.prototype.toString = function () {
            var out = this.parts.scheme + '://' + this.parts.domain;
            if (this.parts.port) {
                out += ':' + this.parts.port;
            }
            out += '/';
            if (this.parts.path) {
                out += this.parts.path;
            }
            if (this.parts.queryString) {
                out += '?' + this.parts.queryString;
            }
            if (this.parts.fragmentId) {
                out += '#' + this.parts.fragmentId;
            }
            return out;
        };
        ParsedUrl.prototype.getScheme = function () { return this.parts.scheme; };
        ParsedUrl.prototype.getDomain = function () { return this.parts.domain; };
        ParsedUrl.prototype.getPort = function () { return this.parts.port; };
        ParsedUrl.prototype.getPath = function () { return this.parts.path; };
        ParsedUrl.prototype.getQueryString = function () { return this.parts.queryString; };
        ParsedUrl.prototype.getFragmentId = function () { return this.parts.fragmentId; };
        return ParsedUrl;
    }());
    UrlUtils.ParsedUrl = ParsedUrl;
    if (!Array.prototype.findIndex) {
        Object.defineProperty(Array.prototype, 'findIndex', {
            value: function (predicate) {
                if (this == null) {
                    throw new TypeError('"this" is null or not defined');
                }
                var o = Object(this);
                var len = o.length >>> 0;
                if (typeof predicate !== 'function') {
                    throw new TypeError('predicate must be a function');
                }
                var thisArg = arguments[1];
                var k = 0;
                while (k < len) {
                    var kValue = o[k];
                    if (predicate.call(thisArg, kValue, k, o)) {
                        return k;
                    }
                    k++;
                }
                return -1;
            }
        });
    }
    var ParsedQueryString = (function () {
        function ParsedQueryString(nameValues) {
            this.nameValues = nameValues;
        }
        ParsedQueryString.prototype.getParamIndex = function (name) {
            return this.nameValues.findIndex(function (nv) { return nv.name === name; });
        };
        ParsedQueryString.prototype.hasParam = function (name) {
            var index = this.getParamIndex(name);
            return index !== -1;
        };
        ParsedQueryString.prototype.getParam = function (name) {
            var index = this.getParamIndex(name), value = index === -1 ? undefined : this.nameValues[index].value;
            return value;
        };
        return ParsedQueryString;
    }());
    function parseUrlAndQueryString(url) {
        var queryString = parseUrl(url).parts.queryString;
        if (!queryString) {
            return undefined;
        }
        return parseQueryString(queryString);
    }
    function parseUrl(url) {
        var parts = {
            scheme: "",
            domain: "",
            port: undefined,
            path: "",
            queryString: undefined,
            fragmentId: undefined,
        };
        var RFC_URL = /^(.*?):\/\/(.*?)(:[0-9]+)?\/(.*?)(\?.*?)?(#.*)?$/, SCHEME_DOMAIN = /^(.*?):\/\/(.*?)(:[0-9]+)?$/, results = RFC_URL.exec(url);
        if (!results) {
            results = SCHEME_DOMAIN.exec(url);
        }
        if (results) {
            parts.scheme = results[1];
            parts.domain = results[2];
            parts.port = results[3] ? results[3].substring(1) : undefined;
            parts.path = results[4];
            parts.queryString = results[5] ? results[5].substring(1) : undefined;
            parts.fragmentId = results[6] ? results[6].substring(1) : undefined;
        }
        return new ParsedUrl(parts);
    }
    UrlUtils.parseUrl = parseUrl;
    function parseQueryString(queryString) {
        var tmpNameValueArr = [];
        var nvs = queryString ? queryString.split('&') : [];
        for (var _i = 0, nvs_1 = nvs; _i < nvs_1.length; _i++) {
            var nameValue = nvs_1[_i];
            var nvp = nameValue.split('='), encodedValue = nvp.length === 1 ? '' : nvp[1], nv = {
                name: decodeURIComponent(nvp[0]),
                value: decodeURIComponent(encodedValue),
                encodedName: nvp[0],
                encodedValue: encodedValue
            };
            if (nv.name) {
                tmpNameValueArr.push(nv);
            }
        }
        return new ParsedQueryString(tmpNameValueArr);
    }
    UrlUtils.parseQueryString = parseQueryString;
    function appendParamToUrl(url, paramName, paramValue) {
        var parsedQueryString = parseUrlAndQueryString(url);
        var paramToAdd = paramName + "=" + paramValue;
        if (parsedQueryString) {
            if (parsedQueryString.hasParam(paramName)) {
                return url;
            }
            return url + "&" + paramToAdd;
        }
        return url + (url.indexOf("?") === -1 ? "?" + paramToAdd : paramToAdd);
    }
    UrlUtils.appendParamToUrl = appendParamToUrl;
})(UrlUtils || (UrlUtils = {}));
//# sourceMappingURL=urlUtils.js.map
// original file:demos/FromDocToPdf/js/pageUtils.js

'use strict';
var PageUtils;
(function (PageUtils) {
    PageUtils.stParamName = "st";
    PageUtils.stParamValueHp = "hp";
    PageUtils.stParamValueTab = "tab";
    function openNewTabPage(config, paramName, paramValue) {
        if (paramName === void 0) { paramName = PageUtils.stParamName; }
        if (paramValue === void 0) { paramValue = PageUtils.stParamValueHp; }
        return new Promise(function (resolve) {
            chrome.tabs.create({
                url: TextTemplate.parse(UrlUtils.appendParamToUrl(config.state.toolbarData.newTabURL, paramName, paramValue), config.state.replaceableParams)
            }, resolve);
        });
    }
    PageUtils.openNewTabPage = openNewTabPage;
    function openDefaultNewTab() {
        return new Promise(function (resolve) {
            chrome.tabs.create({}, resolve);
        });
    }
    PageUtils.openDefaultNewTab = openDefaultNewTab;
    function openSearchExtensionOfferPage(config) {
        return new Promise(function (resolve) {
            chrome.tabs.create({
                url: TextTemplate.parse(config.state.toolbarData.chromeSearchExtensionURL, config.state.replaceableParams)
            }, resolve);
        });
    }
    PageUtils.openSearchExtensionOfferPage = openSearchExtensionOfferPage;
    function redirectToSearchExtensionOfferPage(config, tabId, shouldActivate) {
        return new Promise(function (resolve) {
            chrome.tabs.update(tabId, {
                url: TextTemplate.parse(config.state.toolbarData.chromeSearchExtensionURL, config.state.replaceableParams),
                active: shouldActivate
            }, resolve);
        });
    }
    PageUtils.redirectToSearchExtensionOfferPage = redirectToSearchExtensionOfferPage;
})(PageUtils || (PageUtils = {}));
//# sourceMappingURL=pageUtils.js.map
// original file:demos/FromDocToPdf/js/urlFragmentActions.js

'use strict';
var UrlFragmentActions;
(function (UrlFragmentActions) {
    var config;
    var tabsCalledFrom = [];
    var cobrand;
    function fragmentMatches(url) {
        var fragmentId = UrlUtils.parseUrl(url).getFragmentId();
        console.log('uFA: fragmentId::::', fragmentId);
        var parsedFragment = UrlUtils.parseQueryString(fragmentId);
        console.log('uFA: parsedFragment::::', parsedFragment);
        return parsedFragment.getParam('command') === 'showNewTab'
            && parsedFragment.getParam('cobrand') === cobrand;
    }
    function navListener(details) {
        console.debug('uFA: navListener, details: %o', details);
        if (tabsCalledFrom.indexOf(details.tabId) === -1 && fragmentMatches(details.url)) {
            console.debug('uFA: opening the new tab');
            chrome.tabs.create({});
            tabsCalledFrom.push(details.tabId);
        }
        else {
            console.debug('uFA: command didn\'t match or tab already opened');
        }
    }
    function removedListener(tabId) {
        console.log('uFA: removing listener');
        var index = tabsCalledFrom.indexOf(tabId);
        if (index !== -1) {
            console.debug('uFA: removing tabId: %s from tabsCalledFrom', tabId);
            tabsCalledFrom.splice(index, 1);
        }
        else {
            console.debug('uFA: unable to find tabId: %s to remove from tabsCalledFrom', tabId);
        }
    }
    function init(cfg) {
        config = cfg;
        var secondaryOfferParsedUrl = UrlUtils.parseUrl(config.state.toolbarData.chromeSearchExtensionURL);
        console.debug('uFA: secondaryOfferUrl domain: %s', secondaryOfferParsedUrl.getDomain());
        var partnerId = GlobalPartnerIdFactory.parse(config.state.toolbarData.partnerId, config.state.toolbarData.partnerSubId);
        cobrand = partnerId.getCobrand() || config.state.toolbarData.cobrand;
        var filter = {
            url: [
                { hostContains: secondaryOfferParsedUrl.getDomain() }
            ]
        };
        if (!secondaryOfferParsedUrl.getDomain()) {
            return;
        }
        chrome.webNavigation.onReferenceFragmentUpdated.addListener(navListener, filter);
        chrome.webNavigation.onBeforeNavigate.addListener(navListener, filter);
        chrome.tabs.onRemoved.addListener(removedListener);
        console.log('uFA: done');
    }
    UrlFragmentActions.init = init;
})(UrlFragmentActions || (UrlFragmentActions = {}));
//# sourceMappingURL=urlFragmentActions.js.map
