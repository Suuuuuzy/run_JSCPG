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
var ERRORCODE = {
  COMMON_FAILED: 1010,
  COMMON_TIMEOUT: 1011,
  MSGSEND_EXTENSION_NMHOST_DISCONNECTED: 2020,
  MSGSEND_EXTENSION_FORWARD_TO_NMHOST_FAILED: 2021
};
//
// browser action communication
//
var extensionAction = {
  extensionActionSerial: 0,
  msgBoard: {},
  getExtensionActionMsgID: function()
  {
    return "ea.pm21-" + (this.extensionActionSerial++);
  },
  extensionActionOnPortDisconnect: function()
  {
    for (var callid in this.msgBoard) {
      this.msgBoard[callid].rejected({
        faildata: {
          code: ERRORCODE.MSGSEND_EXTENSION_NMHOST_DISCONNECTED
        }
      });
    }
    this.msgBoard = {};
  },
  perform: function(method, indata) {
    var typesuffix = window.localStorage.getItem("lasttypesuffix");
    if (!typesuffix) {
      typesuffix = "pm21";
    }
    if (!nativeports[typesuffix]) {
      nativeports[typesuffix] = {};
    }
    var nativeport = nativeports[typesuffix];
    if (!nativeport.connected) {
      nativeports[typesuffix].port = connect(typesuffix);
    }
    if (nativeport.connected) {
      return new Promise(function(resolve, rejected) {
        var callid = this.getExtensionActionMsgID();
        var msg = {
          resolve: resolve,
          rejected: rejected
        };
        this.msgBoard[callid] = msg;
        var data = {
          method: method,
          callid: callid,
          type: "com.fabasoft.nm.ea",
          srcurl: "about://nmext",
          indata: indata
        }
        try {
          nativeport.port.postMessage(data);
        } catch(e) {
          var result = {
            faildata: {
              code: ERRORCODE.MSGSEND_EXTENSION_FORWARD_TO_NMHOST_FAILED,
              cause: e.stack ? e.stack.toString() : e.toString(),
            }
          };
          rejected(result);
        }
      }.bind(this));
    }
    else {
      var result = {
        faildata: {
          code: ERRORCODE.MSGSEND_EXTENSION_FORWARD_TO_NMHOST_FAILED
        }
      };
      return Promise.reject(result);
    }
  },
  performWithTimeout(method, indata, timeout) {
    return new Promise(function(resolve, reject) {
      this.perform(method, indata).then(function(data) {
        resolve(data);
      }).catch(function(error) {
        reject(error);
      });
      var timeoutid = window.setTimeout(function() {
        reject({
          faildata: {
            code: ERRORCODE.COMMON_TIMEOUT
          }
        });
      }, timeout);
    }.bind(this));
  }
};
//
// browser action button
//
chrome.browserAction.onClicked.addListener(function(activeTab)
{
  extensionAction.performWithTimeout("GetCurrentDomainHref", null, 3000).then(function(data) {
    return data.outdata.href;
  }).catch(function(error) {
    return "https://fabasoft.com/support";
  }).then(function(href) {
    chrome.tabs.create({url: href});
  });
});
//
// connect to native host
//
function connect(typesuffix)
{
  // console.log("com.fabasoft.nm/pm21/nmextback: CONNECT NATIVE: com.fabasoft.nmhost" + typesuffix);
  try {
    var port = chrome.runtime.connectNative("com.fabasoft.nmhost" + typesuffix);
    nativeports[typesuffix].connected = true;
    if (port) {
      //
      // messages received from native messaging host: forward to content script
      //
      port.onMessage.addListener(function(message) {
        try {
          if (!message.srcid && message.type && message.type == "com.fabasoft.nm.broadcast") {
            // console.log("com.fabasoft.nm/pm21/nmextback: Broadcast message from from native (forward as callback message)");
            // console.log(message);
            message.type = "com.fabasoft.nm.callback";
            for (var id in contentports) {
              if (message.srcids && message.srcids.indexOf(String(id)) != -1) {
                try {
                  if (contentports[id].typesuffix === typesuffix) {
                    // console.log("com.fabasoft.nm/pm21/nmextback: Broadcast message from from native: Execute on tab " + id);
                    contentports[id].port.postMessage(message);
                  }
                  else {
                    // console.log("com.fabasoft.nm/pm21/nmextback: Broadcast message from from native: Other typesuffix: Skip executing on tab " + id);
                  }
                } catch(e) {
                  // console.log("com.fabasoft.nm/pm21/nmextback: Broadcast message from from native: Failed to execute on tab " + id);
                  // console.log(e);
                }
              }
              else {
                // console.log("com.fabasoft.nm/pm21/nmextback: Broadcast message from from native: Skip execution on tab " + id);
              }
            }
          }
          else if (message.srcid && message.type && message.type == "com.fabasoft.nm.callback") {
            // console.log("com.fabasoft.nm/pm21/nmextback: Callback message from from native (src id: " + message.srcid + ")");
            // console.log(message);
            if (message.method == "Login") {
              fork(message, false);
            }
            else {
              contentports[message.srcid].port.postMessage(message);
            }
          }
          else if (message.fork && message.outdata) {
            fork(message, true);
          }
          else if (message.callid && message.callid.startsWith("ea")) {
            var msg = extensionAction.msgBoard[message.callid];
            if (msg) {
              if (message.faildata) {
                msg.rejected(message);
              }
              else {
                msg.resolve(message);
              }
              delete extensionAction.msgBoard[message.callid];
            }
          }
          else {
            // console.log("com.fabasoft.nm/pm21/nmextback: Message from native (src id: " + message.srcid + ")");
            // console.log(message);
            nativeports[typesuffix].replied = true;
            message.type = "com.fabasoft.nm.recv";
            contentports[message.srcid].port.postMessage(message);
          }
        } catch (e) {
          // console.log("com.fabasoft.nm/pm21/nmextback: Failed to forward received message to browser extension"
          //   + (message && message.srcid?" (src id: " + message.srcid + ")" : ""));
          // console.log(e);
        }
      });
      port.onDisconnect.addListener(function() {
        // if (chrome.runtime.lastError && chrome.runtime.lastError.message) {
        //   console.log("com.fabasoft.nm/pm21/nmextback: Native host disconnect: " + chrome.runtime.lastError.message);
        // }
        // else {
        //   console.log("com.fabasoft.nm/pm21/nmextback: Native host disconnect");
        // }
        nativeports[typesuffix].connected = false;
        extensionAction.extensionActionOnPortDisconnect();
        if (nativeports[typesuffix].errorondisconnectfun) {
          nativeports[typesuffix].errorondisconnectfun();
        }
      });
      return port;
    }
    else {
      // console.log("com.fabasoft.nm/pm21/nmextback: Connecting to native host failed (chrome.runtime.connectNative returned null)");
      nativeports[typesuffix].connected = false;
      throw new Error("chrome.runtime.connectNative did not return port object");
    }
  } catch (e) {
    // console.log("com.fabasoft.nm/pm21/nmextback: Connecting to native host failed");
    // console.log(e);
    nativeports[typesuffix].connected = false;
    throw e;
  }
}
var nativeports = {};
var contentports = {};
var nextcontentportid = 0;
//
// messages received from content script: forward to native messaging host
//
chrome.runtime.onConnect.addListener(function(contentport) {
  var contentportid = contentport.sender.tab.id + "#" + nextcontentportid++;
  var released = false;
  // console.log("com.fabasoft.nm/pm21/nmextback: Content script connected: " + contentportid);
  // if (contentports[contentportid]) {
  //   console.log("com.fabasoft.nm/pm21/nmextback: Content script already connected: " + contentportid);
  // }
  if (!contentports[contentportid]) {
    contentports[contentportid] = {};
  }
  contentports[contentportid].port = contentport;
  contentport.onMessage.addListener(function(data, sender) {
    // console.log("com.fabasoft.nm/pm21/nmextback: Received request; Content script: " + contentportid);
    // console.log(data);
    if (data && data.type === "com.fabasoft.nm.back.connect") {
      try {  
        contentports[contentportid].typesuffix = data.typesuffix;
        contentport.postMessage({
          type: "com.fabasoft.nm.back.connect"
        });
      } catch(e) {
        // console.log("com.fabasoft.nm/pm21/nmextback: Failed to forward connect signal to content script (src id: " + contentportid + ")");
        // console.log(e);
        if (!released) {
          delete contentports[contentportid];
          released = true;
        }
      }
      return;
    }
    var typesuffix = data.typesuffix;
    try {
      var newport = false;
      if (!nativeports[typesuffix]) {
        nativeports[typesuffix] = {};
      }
      var nativeport = nativeports[typesuffix];
      if (!nativeport.connected) {
        if (data.method == "Init") {
          nativeport.replied = false;
        }
        nativeport.port = connect(typesuffix);
        nativeport.aborted = false;
        newport = true;
      }
      if (!nativeport.replied || newport) {
        nativeport.errorondisconnectfun = function() {
          if (nativeport.replied) {
            if (!nativeport.aborted) {
              nativeport.aborted = true;
              // console.log("com.fabasoft.nm/pm21/nmextback: Native host " + typesuffix + " disconnect from connected port with already having successful replies: reply abort error");
              var response = {
                type: "com.fabasoft.nm.abort",
                outdata: null,
                faildata: {
                  code: ERRORCODE.MSGSEND_EXTENSION_NMHOST_DISCONNECTED,
                  detail: {
                    aborted: true
                  }
                },
              };
              for (var cpid in contentports) {
                try {
                  if (contentports[cpid].typesuffix === typesuffix) {
                    contentports[cpid].port.postMessage(response);
                  }
                } catch(e) {
                  // console.log("com.fabasoft.nm/pm21/nmextback: Failed to forward abort message to browser extension (src id: " + cpid + ")");
                  // console.log(e);
                }
              }
            }
            else {
              // console.log("com.fabasoft.nm/pm21/nmextback: Native host disconnect from reconnected port: ignore additional abort disconnect");
            }
          }
          else {
            // console.log("com.fabasoft.nm/pm21/nmextback: Native host disconnect from reconnected port: reply error");
            var response = {
              method: data.method,
              callid: data.callid,
              type: "com.fabasoft.nm.recv",
              outdata: null,
              faildata: {
                code: ERRORCODE.MSGSEND_EXTENSION_NMHOST_DISCONNECTED,
                request: data
              }
            };
            try {
              contentport.postMessage(response);
            } catch(e) {
              // console.log("com.fabasoft.nm/pm21/nmextback: Failed to forward message to browser extension (src id: " + contentportid + ")");
              // console.log(e);
            }
          }
        };
      }
      data.srcid = contentportid.toString();
      if (data.method == "Init") {
        data.alltabids = [];
        for (var id in contentports) {
          if (contentports[id].typesuffix === typesuffix) {
            data.alltabids.push(id.toString());
          }
        }
        window.localStorage.setItem("lasttypesuffix", typesuffix);
        postMessageWithCookies(data, contentport, contentportid, typesuffix);
      }
      else if (data.method == "UpdateLoginToken") {
        postMessageWithCookies(data, contentport, contentportid, typesuffix);
      }
      else {
        nativeports[typesuffix].port.postMessage(data);
      }
    } catch (e) {
      // console.log("com.fabasoft.nm/pm21/nmextback: Failed to send message to native host");
      // console.log(e);
      nativeports[typesuffix].connected = false;
      var response = {
        method: data.method,
        callid: data.callid,
        type: "com.fabasoft.nm.recv",
        outdata: null,
        faildata: {
          code: ERRORCODE.MSGSEND_EXTENSION_FORWARD_TO_NMHOST_FAILED,
          cause: e.stack ? e.stack.toString() : e.toString(),
          request: data
        }
      };
      try {
        contentport.postMessage(response);
      } catch(e) {
        // console.log("com.fabasoft.nm/pm21/nmextback: Failed to forward message to browser extension (src id: " + contentportid + ")");
        // console.log(e);
      }
    }
  });
  contentport.onDisconnect.addListener(function() {
    // console.log("com.fabasoft.nm/pm21/nmextback: Content script disconnected: " + contentportid);
    if (!released) {
      delete contentports[contentportid];
      released = true;
    }
  });
  try {  
    contentport.postMessage({
      type: "com.fabasoft.nm.back.connect"
    });
  } catch(e) {
    // console.log("com.fabasoft.nm/pm21/nmextback: Failed to forward connect signal to content script (src id: " + contentportid + ")");
    // console.log(e);
    if (!released) {
      delete contentports[contentportid];
      released = true;
    }
  }
});
//
// post message with cookies
//
function postMessageWithCookies(data, contentport, contentportid, typesuffix)
{
  function handleError(e, connection)
  {
    // console.log("com.fabasoft.nm/pm21/nmextback: Failed to send message to native host (with cookies)");
    // console.log(e);
    if (connection) {
      nativeports[typesuffix].connected = false;
    }
    if (data.indata && data.indata.cookies) {
      delete data.indata.cookies;
    }
    var response = {
      method: data.method,
      callid: data.callid,
      type: "com.fabasoft.nm.recv",
      outdata: null,
      faildata: {
        code: connection ? ERRORCODE.MSGSEND_EXTENSION_FORWARD_TO_NMHOST_FAILED : ERRORCODE.COMMON_FAILED,
        cause: e.stack ? e.stack.toString() : e.toString(),
        request: data
      }
    };
    try {
      contentport.postMessage(response);
    } catch(e) {
      // console.log("com.fabasoft.nm/pm21/nmextback: Failed to forward message to browser extension (src id: " + contentportid + ")");
      // console.log(e);
    }
  }
  try {
    chrome.cookies.getAllCookieStores(function(stores) {
      var tabid = Number(contentportid.split("#")[0]);
      try {
        var storeid = null;
        for (var i = 0;i < stores.length; i++) {
          for (var j = 0;j < stores[i].tabIds.length; j++) {
            if (stores[i].tabIds[j] === tabid) {
              storeid = stores[i].id;
              break;
            }
          }
          if (storeid) {
            break;
          }
        }
        chrome.cookies.getAll({url:data.srcurl, storeId:storeid}, function(cookies) {
          try {
            var cookievalues = {};
            if (cookies) {
              for (var i = 0;i < cookies.length; i++) {
                var cookie = cookies[i];
                cookievalues[cookie.name] = cookie.value;
              }
            }
            if (data.indata.cookies) {
              for (var c of data.indata.cookies.split(";")) {
                var cv = c.split("=");
                cookievalues[cv[0]] = cv[1];
              }
            }
            var cookiestr = "";
            for (var c in cookievalues) {
              if (cookiestr) {
                cookiestr += ";";
              }
              cookiestr += c + "=" + cookievalues[c];
            }
            data.indata.cookies = cookiestr;
            // console.log("Cookies from url [" + data.srcurl + "] and store [" + storeid + "] for message: " + cookiestr);
          } catch(e) {
            handleError(e);
          }
          try {
            nativeports[typesuffix].port.postMessage(data);
          } catch(e) {
            handleError(e, true);
          }
        });
      } catch(e) {
        handleError(e);
      }
    });
  } catch(e) {
    handleError(e);
  }
}
//
// fork received login token
//
function fork(message, replyerror)
{
  if (message.outdata) {
    var url = message.outdata.domainhref;
    if (url) {
      var directSetCookie = false;
      var setCookiePromise;
      if (false) {
        setCookiePromise = browser.tabs.get(Number(message.srcid.split("#")[0])).then(function(tab) {
          directSetCookie = tab.incognito;
          if (directSetCookie) {
            return browser.cookies.set({
              url: url,
              name: "FSC",
              value: message.outdata.token,
              storeId: tab.cookieStoreId,
              secure: true,
              httpOnly: true
            });
          }
        }).then(function() {
          if (directSetCookie) {
            message.outdata = null;
            try {
              if (!message.type) {
                message.type = "com.fabasoft.nm.recv";
              }
              contentports[message.srcid].port.postMessage(message);
            } catch(e) {
              // console.log("com.fabasoft.nm/pm21/nmextback: Failed to forward received message to browser extension"
              //   + (message && message.srcid?" (src id: " + message.srcid + ")" : ""));
              // console.log(e);
            }
          }
        }).catch(function(e) {
          if (replyerror) {
            var response = {
              method: message.method,
              callid: message.callid,
              type: "com.fabasoft.nm.recv",
              outdata: null,
              faildata: {
                code: ERRORCODE.COMMON_FAILED
              }
            };
            try {
              contentports[message.srcid].port.postMessage(response);
            } catch(e) {
              // console.log("com.fabasoft.nm/pm21/nmextback: Failed to forward error message to browser extension (src id: " + message.srcid + ")");
              // console.log(e);
            }
          }
        });
      }
      else {
        setCookiePromise = Promise.resolve();
      }
      setCookiePromise.then(function() {
        // console.log("com.fabasoft.nm/pm21/nmextback: SKIP FORK REQUEST: " + directSetCookie);
        if (directSetCookie) {
          return;
        }
        if (!url.endsWith("/")) {
          url += "/";
        }
        url += "login/fork";
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("POST", url, true);
        xmlhttp.onload = function msgsend_xmlhttp_fork_onload() {
          if (xmlhttp.readyState == 4 &&
            xmlhttp.status >= 200 && xmlhttp.status < 300) {
            message.outdata = null;
            try {
              if (!message.type) {
                message.type = "com.fabasoft.nm.recv";
              }
              contentports[message.srcid].port.postMessage(message);
            } catch(e) {
              // console.log("com.fabasoft.nm/pm21/nmextback: Failed to forward received message to browser extension"
              //   + (message && message.srcid?" (src id: " + message.srcid + ")" : ""));
              // console.log(e);
            }
          }
          else {
            xmlhttp.onerror();
          }
        };
        xmlhttp.onerror = function msgsend_xmlhttp_fork_onerror() {
          if (replyerror) {
            var response = {
              method: message.method,
              callid: message.callid,
              type: "com.fabasoft.nm.recv",
              outdata: null,
              faildata: {
                code: ERRORCODE.COMMON_FAILED
              }
            };
            try {
              contentports[message.srcid].port.postMessage(response);
            } catch(e) {
              // console.log("com.fabasoft.nm/pm21/nmextback: Failed to forward error message to browser extension (src id: " + message.srcid + ")");
              // console.log(e);
            }
          }
        };
        xmlhttp.send(message.outdata.token);
      });
    }
  }
}