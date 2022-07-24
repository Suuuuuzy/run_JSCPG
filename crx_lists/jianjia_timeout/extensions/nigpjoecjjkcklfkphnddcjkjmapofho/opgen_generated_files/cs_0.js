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





// original file:/Users/jianjia/Documents/tmp/EOPG/run_JSCPG_merge/crx_lists/jianjia_timeout/extensions/nigpjoecjjkcklfkphnddcjkjmapofho/content.js

start();

function start() {
    const buttons = [
        {
            label: "uLaw Email Read",
            textColor: "white",
            borderRad: 1,
            color: "#850510",
            hoverColor: "#471a1e",
            hoverFColor: "orange",
            className: "tag"
        },
        {
            label: "uLaw Email Sent",
            textColor: "white",
            borderRad: 1,
            color: "#850510",
            hoverColor: "#471a1e",
            hoverFColor: "orange",
            className: "tag"
        },
        {
            label: "uLaw Email Comp",
            textColor: "white",
            borderRad: 1,
            color: "#850510",
            hoverColor: "#471a1e",
            hoverFColor: "orange",
            className: "ulaw0"
        },
    ];

    /*region info
   * textRegion: where you type in gmail
   * containerRegion: the container
   * buttonRegion: where buttons are injected
   * watcherRegion: close child of container region
   * watcherRegion2: for default Gmail view
   * replayAll: reply button reference
   * send: send button reference
   * from: from e-mail address
   * to: to e-mail address
   * title: title/subject of e-mail
   */
    const regions = {
        textRegion: ".Am.aO9.Al.editable.LW-avf",
        containerRegion: ".nH.ar4",
        buttonRegion: ".amn",
        watcherRegion: ".BltHke.nH.oy8Mbf",
        watcherRegion2: ".AO",
        splitViewRegion: ".ae4.Zs",
        replyAll: "span.ams.bkI",
        reply: "span.ams.bkH",
        send: ".T-I.J-J5-Ji.v7",
        from: "span.gD",
        to: "span.g2",
        title: ".hP",
        new_send: ".btC",
        new_send_end: ".gU.az5",
        newMessageRegion: ".nH.VL .no",
        newMessage: ".nH.nn",
        replayForwardComposeRegion: ".ip.adB",
        emailComposeRegion: ".gO.aQY",
        emailComposeEmail: ".oL.aDm.az9",
        emailComposeEmailx: ".vN.vP.a3q",
        emailComposeTitleRegion: ".bAs",
        emailComposeTitle: ".aoT",
        emailComposeTitlex: ".aoD.az6",
    };
    /* 
    New message:
    watch class "no"
    look for class "nH nn" check for length > 0
    look for class "gU az5" insert before td
    .ip.adB
    */

    function composeClicked(button) {
        console.log ("compose button");
        let a1 = $(regions.newMessageRegion);
        let a2 = a1.find(regions.newMessage);

        $(regions.newMessageRegion).find(regions.newMessage).each(function () {
           let a;
           a = $(this).find(regions.emailComposeEmail + " span");
           if (a.length !== 0) {
               console.log ("comp email string found");
               let x = {};
               x.compTo = a.attr( "email");
               console.log("to:" + x.compTo);
               chrome.storage.sync.set({"timeDocketTitle": 'Email Composed'}, function() {
               });
               chrome.storage.sync.set({"timeDocketEmail": x.compTo}, function() {
               });
           } else {
               //console.log ("comp not found");
           }
           a = $(this).find(regions.emailComposeTitleRegion);
           if (a.length !== 0) {
               console.log ("comp title string found");
           } else {
               //console.log ("comp not found");
           }
           a = $(this).find(regions.emailComposeTitle);
           if (a.length !== 0) {
            let sub = a.val();
            console.log ("comp title found " + sub);
            chrome.storage.sync.set({"timeDocketDescription": sub}, function() {
            });
           } else {
               //console.log ("comp not found");
           }
        });
    }
    function buttonClicked(button) {
        //button click action
        if (
            $(regions.watcherRegion).length !== 0 &&
            $(regions.splitViewRegion).length !== 0
        ) {
            buttonClickedHelper(button, regions.watcherRegion);
        } else if ($(regions.watcherRegion2).length !== 0) {
            buttonClickedHelper(button, regions.watcherRegion2);
        }
    }

    function buttonClickedHelper(button, watcherRegion) {
        $(watcherRegion).each(function () {
            let x = {};

            if ($(this).css("display") !== "none") {
                let a;
                a = $(this).find(regions.from);
                if (a.length !== 0) {
                    x.from = a.attr( "email");
                    console.log("from:" + x.from);
                } else {
                    console.log ("from not found");
                }
                a = $(this).find(regions.to);
                if (a.length !== 0) {
                    x.to = a.attr( "email");
                    console.log("to:" + x.to);
                } else {
                    console.log ("to not found");
                }
                a = $(this).find(regions.title);
                if (button.label == "uLaw Email Sent")
                {
                  chrome.storage.sync.set({"timeDocketTitle": 'Email Responded'}, function() {
                  });
                } else {
                  chrome.storage.sync.set({"timeDocketTitle": 'Email Correspondence'}, function() {
                  });
                }
                if (a.length !== 0) {
                    x.title = a.text();
                    console.log("title:" + x.title);
                    chrome.storage.sync.set({"timeDocketDescription": x.title}, function() {
                    });
                } else {
                    console.log ("title not found");
                    chrome.storage.sync.set({"timeDocketDescription": ''}, function() {
                    });
                }

                if (Object.keys(x).length !== 0) {
                    let j = JSON.stringify(x);
                    console.log("Store Email"+x.from);
                    console.log("buttonname "+button.label);
                    if (button.label == "uLaw Email Sent")
                    {
                      chrome.storage.sync.set({"timeDocketEmail": x.to}, function() {
                      });
                    } else {
                      chrome.storage.sync.set({"timeDocketEmail": x.from}, function() {
                      });
                    }
                    console.log ("json is " + j);
                    chrome.runtime.sendMessage({text: j}, function(response) {
                        console.log("Response: ", response);
                    });                
                }
            }
        });
    }

    //adds a single button
    function addButton(button,fn) {
        let newButton = document.createElement("button");
        newButton.innerHTML = button.label;
        newButton.onclick = () => fn(button);
        newButton.className = button.className;
        newButton.style.color = button.textColor;
        newButton.style.title = button.label;
        newButton.style.cursor = "pointer";
        //newButton.style.borderRadius = button.borderRad;
        newButton.style.borderRadius = "4px";
        newButton.style.marginRight = "1rem";
        newButton.style.padding = "8px 3px 8px 3px";
        newButton.style.width = "8rem";
        newButton.style.background = button.color;
        $(newButton).hover(
            function () {
                $(this).css("background-color", button.hoverColor);
                $(this).css("color", button.hoverFColor);
            },
            function () {
                $(this).css("background-color", button.color);
                $(this).css("color", button.textColor);
            }
        );
        return newButton;
    }
    function composeButtons() {
        $(regions.newMessage).each(function () {
            composeButtonHelper(this);
        });
    }

    function composeButtonHelper(obj) {
            let button = buttons[2];
            if ($(obj).find("." + button.className).length === 0) {
                let x = $(obj).find(regions.new_send);
                if (x.length !== 0) {
                    x = x.find(regions.new_send_end);
                    let container = document.createElement("td");

                    let newButton = addButton(buttons[2],composeClicked);
                    container.append(newButton);
                    x.before(container);
                }
            }
    }

    //initialize buttons
    function initButtons() {
        //if in multi-pane view
        if (
            $(regions.watcherRegion).length !== 0 &&
            $(regions.splitViewRegion).length !== 0
        ) {
            initButtonHelper(regions.watcherRegion);
            //if in single-pane view
        } else if ($(regions.watcherRegion2).length !== 0) {
            initButtonHelper(regions.watcherRegion2);
        }
    }

    function initButtonHelper(watcherRegion) {
        // console.log("watcher region:" + watcherRegion);
        $(watcherRegion).each(function () {
            if ($(this).css.display !== "none" && $(this).find(".tag").length === 0) {
                let x = $(this).find(regions.buttonRegion);

                if (x[x.length - 1] !== undefined) {
                    let container = document.createElement("div");

                    if ($(this).find(regions.replyAll).length !== 0) {
                        $(this).find(regions.replyAll)[0].innerHTML = "All";
                    }

                    for (let i = 0; i < buttons.length; i++) {
                        if (buttons[i].className === "tag") {
                           let newButton = addButton(buttons[i],buttonClicked);
                           container.append(newButton);
                        }
                    }

                    x[x.length - 1].appendChild(container);
                }
            }
        });
    }

    //look for changes in DOM element
    function startObserver(region, fn) {
        let inter = setInterval(function () {
            let panel = $(region);

            if (panel.length > 0) {
                var mutationObserver = new MutationObserver(function (mutations) {
                    mutations.forEach(() => fn(mutationObserver));
                });

                mutationObserver.observe(panel[0], {
                    attributes: true,
                    characterData: true,
                    childList: true,
                    subtree: true,
                    attributeOldValue: true,
                    characterDataOldValue: true
                });

                clearInterval(inter);
            }
        }, 300);
    }
    //look for changes in DOM element
    function startObserver2(region, fn) {
        let inter = setInterval(function () {
            let panel = $(region);

            if (panel.length > 0) {
                var mutationObserver = new MutationObserver(function (mutations) {
                    mutations.forEach(() => fn(mutationObserver));
                });

                mutationObserver.observe(panel[0], {
                    attributes: false,
                    characterData: false,
                    childList: true,
                    subtree: false,
                    attributeOldValue: false,
                    characterDataOldValue: false
                });

                clearInterval(inter);
            }
        }, 300);
    }

    try {
        startObserver(regions.containerRegion, initButtons);
    } catch (e) {
        console.log("Failed to Initialize");
        console.error();
    }

    try {
        startObserver2(regions.newMessageRegion, composeButtons);
    } catch (e) {
        console.log("Failed to Initialize test regions");
        console.error();
    }

}

