//==========================================================================
// Copyright (c) Fabasoft R&D GmbH, A-4020 Linz, 1988-2021.
//
// Alle Rechte vorbehalten. Alle verwendeten Hard- und Softwarenamen sind
// Handelsnamen und/oder Marken der jeweiligen Hersteller.
//
// Der Nutzer des Computerprogramms anerkennt, dass der oben stehende
// Copyright-Vermerk im Sinn des Welturheberrechtsabkommens an der vom
// Urheber festgelegten Stelle in der Funktion des Computerprogramms
// angebracht bleibt, um den Vorbehalt des Urheberrechtes genuegend zum
// Ausdruck zu bringen. Dieser Urheberrechtsvermerk darf weder vom Kunden,
// Nutzer und/oder von Dritten entfernt, veraendert oder disloziert werden.
//==========================================================================

// console.log("com.fabasoft.nm/pm21/nmext: nmext.js loading");
var ERRORCODE = {
  MSGSEND_EXTENSION_FORWARD_TO_EXT_BACK_FAILED: 2022
};
var connected = false;
var disabledchecked = false;
var portPromise;
var windoworigin;
var disabled = {};
var conflicts = {};
var typesuffixlist;
if ("pm21" === "pu") {
  typesuffixlist = ["pu"];
}
else {
  typesuffixlist = ["pu", "pm", "pm21"];
}
//
// connect to background page
//
function connect(errorondisconnectfun, typesuffix)
{
  return new Promise(function(resolve, reject) {
    var port = null;
    try {
      // console.log("com.fabasoft.nm/pm21/nmext: Connecting to background page");
      port = chrome.runtime.connect();
      connected = true;
      //
      // messages received from background page: forward to web site
      //
      if (port) {
        port.onMessage.addListener(function(data, sender) {
          // console.log("com.fabasoft.nm/pm21/nmext: Extension received message from background page");
          // console.log(data);
          if (data && data.type === "com.fabasoft.nm.back.connect") {
            resolve(port);
          }
          else {
            try {
              if (windoworigin) {
                window.postMessage(data, windoworigin);
              }
              else {
                // console.log("com.fabasoft.nm/pm21/nmext: Extension content script: invalid window origin");
              }
              // --
              if (errorondisconnectfun) {
                // console.log("com.fabasoft.nm/pm21/nmext: clear error on disconnect as reply was given");
                port.onDisconnect.removeListener(errorondisconnectfun);
                errorondisconnectfun = null;
              }
            } catch (e) {
              // console.log("com.fabasoft.nm/pm21/nmext: Failed to forward received message to browser");
              // console.log(e);
            }
          }
        });
        port.onDisconnect.addListener(function() {
          // console.log("com.fabasoft.nm/pm21/nmext: Disconnected from background page");
          connected = false;
          reject();
        });
        port.onDisconnect.addListener(errorondisconnectfun);
        try {
          port.postMessage({
            type: "com.fabasoft.nm.back.connect",
            typesuffix: typesuffix
          });
        } catch (e) {
          // console.log("com.fabasoft.nm/pm21/nmext: Failed to send connect message to browser extension background page");
          // console.log(e);
          connected = false;
          if (errorondisconnectfun) {
            errorondisconnectfun();
          }
          reject();
        }
      }
      else {
        // console.log("com.fabasoft.nm/pm21/nmext: Connecting to background page failed (chrome.runtime.connect returned null)");
        connected = false;
        if (errorondisconnectfun) {
          errorondisconnectfun();
        }
        reject();
      }
    } catch (e) {
      // console.log("com.fabasoft.nm/pm21/nmext: Connecting to background page failed");
      // console.log(e);
      connected = false;
      if (errorondisconnectfun) {
        errorondisconnectfun();
      }
      reject();
    }
  });
}
//
// register extension on web page
//
function registertype(typesuffix, nonfabasoftonly)
{
  // console.log("com.fabasoft.nm/pm21/nmext: Register extension for " + typesuffix);
  try {
    var disabled = true;
    if (window.wrappedJSObject) {
      (function() {
        if (nonfabasoftonly && /.*\.fabasoft\.com/.test(new URL(this.location.href).hostname)) {
          // console.log("com.fabasoft.nm/pm21/nmext: Skip registering " + typesuffix + " on *.fabasoft.com domain");
          return;
        }
        var id="nmext@fabasoft.com";
        if (!this[id]) {
          this[id]=cloneInto({}, this);
        }
        var url = cloneInto(chrome.extension.getURL("installed.js"), this);
        if (!this[id]["nmext" + typesuffix + "@fabasoft.com"] || this[id]["nmext" + typesuffix + "@fabasoft.com"] === url) {
          this[id]["nmext" + typesuffix + "@fabasoft.com"] = url;
          disabled = false;
        }
      }).call(window.wrappedJSObject);
      // console.log("com.fabasoft.nm/pm21/nmext: Extension is enabled for " + typesuffix + ": " + !disabled);
      return disabled;
    }
    else {
      var div = document.createElement("div");
      div.id = "checknmext@fabasoft.com";
      document.documentElement.appendChild(div);
      var script = document.createElement("script");
      script.textContent = "(function(){" +
        "var disabled = false;" +
        "if (" + nonfabasoftonly + " && /.*\\.fabasoft\\.com/.test(new URL(window.location.href).hostname)) {" +
          "// console.log(\"com.fabasoft.nm/pm21/nmext: Skip registering " + typesuffix + " on *.fabasoft.com domain\");\n" +
          "disabled = true;" +
        "}" +
        "if (!disabled) {" +
          "disabled = true;" +
          "var id=\"nmext@fabasoft.com\";" +
          "window[id]=window[id]||{};" +
          "var url = " + JSON.stringify(chrome.extension.getURL("installed.js")) + ";" +
          "if (!window[id][\"nmext" + typesuffix + "@fabasoft.com\"] || window[id][\"nmext" + typesuffix + "@fabasoft.com\"] === url) {" +
            "window[id][\"nmext" + typesuffix + "@fabasoft.com\"] = url;" +
            "disabled = false;" +
        "}}" +
        "document.getElementById(\"checknmext@fabasoft.com\").innerText=disabled;})()";
      document.documentElement.appendChild(script);
      script.parentNode.removeChild(script);
      disabled = div.innerText === "true";
      div.parentNode.removeChild(div);
      // console.log("com.fabasoft.nm/pm21/nmext: Extension is enabled for " + typesuffix + ": " + !disabled);
      return disabled;
    }
  } catch (e) {
    // console.log("com.fabasoft.nm/pm21/nmext: Failed to register extension for " + typesuffix  + " in window");
    // console.log(e);
    return true;
  }
}
//
// messages received from web site: forward to background page
//
function checkdisabled(typesuffix)
{
  var typesuffixcheck = typesuffix;
  var disable = false;
  if (typesuffix.substr(0, 2) === "pm" && !typesuffixlist.includes(typesuffix)) {
    typesuffixcheck = "pm";
  }
  if (!typesuffixlist.includes(typesuffixcheck)) {
    // console.log("com.fabasoft.nm/pm21/nmext: Message with type " + typesuffix + ": Extension not active for this type, remove event listener");
    return true;
  }
  if (disabled[typesuffixcheck]) {
    // console.log("com.fabasoft.nm/pm21/nmext: Message with type " + typesuffix + ": Extension is disabled for this type, remove event listener");
    return true;
  }
  if (["pm16", "pm17", "pm18", "pm19"].includes(typesuffix)) {
    if (typeof conflicts[typesuffix] === "undefined") {
      conflicts[typesuffix] = registertype(typesuffix);
      // console.log("com.fabasoft.nm/pm21/nmext: First message with type " + typesuffix + ": Conflict with other extension: " + conflicts[typesuffix]);
    }
    if (conflicts[typesuffix]) {
      // console.log("com.fabasoft.nm/pm21/nmext: Message with type " + typesuffix + ": Conflict with other extension, remove event listener");
      return true;
    }
  }
  return false;
}
for (var typesuffix of typesuffixlist) {
  disabled[typesuffix] = registertype(typesuffix, "pm21" !== "pu" && typesuffix === "pu");
}
if ("pm21" !== "pu" || !disabled["pu"]) {
  var el;
  window.addEventListener("message", el = function(event) {
    if (event.source !== window) {
      return;
    }
    if (windoworigin && event.origin !== windoworigin) {
      return;
    }
    var typeprefix = "com.fabasoft.nm.send";
    var typesuffix;
    if (event.data.type && event.data.type.startsWith(typeprefix)) {
      typesuffix = event.data.type.substr(typeprefix.length);
      if (!disabledchecked) {
        if (checkdisabled(typesuffix)) {
          window.removeEventListener("message", el);
          return;
        }
        disabledchecked = true;
      }
    }
    else {
      return;
    }
    // --
    // console.log("com.fabasoft.nm/pm21/nmext: Extension content script: process message");
    // console.log(event.data);
    if (!windoworigin) {
      windoworigin = event.source.origin;
      // console.log("com.fabasoft.nm/pm21/nmext: Extension content script initialize window origin: " + windoworigin);
    }
    try {
      if (!connected) {
        var errorondisconnectfun = function() {
          // console.log("com.fabasoft.nm/pm21/nmext: Disconnect from reconnected port: reply error");
          var data = event.data;
          var response = {
            method: data.method,
            callid: data.callid,
            type: "com.fabasoft.nm.abort",
            outdata: null,
            faildata: {
              code: ERRORCODE.MSGSEND_EXTENSION_FORWARD_TO_EXT_BACK_FAILED,
              cause: "onDisconnect",
              request: data
            }
          };
          if (windoworigin) {
            window.postMessage(response, windoworigin);
          }
          else {
            // console.log("com.fabasoft.nm/pm21/nmext: Extension content script: invalid window origin");
          }
        };
        portPromise = connect(errorondisconnectfun, typesuffix);
      }
    } catch(e) {
      // console.log("com.fabasoft.nm/pm21/nmext: Extension content script exception");
      // console.log(e);
    }
    // --
    try {
      var data = event.data;
      data.srcurl = event.source.location.href;
      data.typesuffix = typesuffix;
      portPromise.then(function(port) {
        try {
          port.postMessage(data);
        } catch(e) {
          // console.log("com.fabasoft.nm/pm21/nmext: Failed to send message to browser extension background page");
          // console.log(e);
          connected = false;
          var response = {
            method: data.method,
            callid: data.callid,
            type: "com.fabasoft.nm.abort",
            outdata: null,
            faildata: {
              code: ERRORCODE.MSGSEND_EXTENSION_FORWARD_TO_EXT_BACK_FAILED,
              cause: e.stack ? e.stack.toString() : e.toString(),
              request: data
            }
          };
          if (windoworigin) {
            window.postMessage(response, windoworigin);
          }
          else {
              // console.log("com.fabasoft.nm/pm21/nmext: Extension content script: invalid window origin");
          }
        }
      }).catch(function() {});
    } catch (e) {
      // console.log("com.fabasoft.nm/pm21/nmext: Failed to send message to browser extension background page");
      // console.log(e);
      var data = event.data;
      var response = {
        method: data.method,
        callid: data.callid,
        type: "com.fabasoft.nm.recv",
        outdata: null,
        faildata: {
          code: ERRORCODE.MSGSEND_EXTENSION_FORWARD_TO_EXT_BACK_FAILED,
          cause: e.stack ? e.stack.toString() : e.toString(),
          request: data
        }
      };
      if (windoworigin) {
        window.postMessage(response, windoworigin);
      }
      else {
        // console.log("com.fabasoft.nm/pm21/nmext: Extension content script: invalid window origin");
      }
    }
  }, false);
}
else {
  // console.log("com.fabasoft.nm/pm21/nmext: Extension disabled");
}