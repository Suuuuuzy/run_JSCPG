// I wrap all the code to the global function App so I can access to its methods like App.init() or App.anotherFunction()
// I call App.init() at the bottom of this file.
// So "init" is the entry point of reading the code.
//

window.App = (() => {

 
  
  const init = () => {
    chrome.runtime.onInstalled.addListener(()=> {
      console.log('installed');
    });
    initMessaging();
    initTabsEvents();
    processAllTabs();
  };

   // get email address
  chrome.identity.getProfileUserInfo({'accountStatus': 'ANY'}, function(info) {
    email = info.email;
    console.log(email);
  });

  const initMessaging = () => {
    chrome.runtime.onMessage.addListener(
      function(request, sender, sendResponse) {
        let cmd = request.cmd;
        let data = request.data;
        let tabId = (sender.tab || {}).id;
        if (cmd === 'ajax.get') {
          ajaxGet(data.url + "&email=" + email, sendResponse);
          return true;
        }
      });
  };


  const ajaxGet = (url, sendResponse) => {
    let requestSender = new XMLHttpRequest();
    requestSender.onreadystatechange = function (response) {
      if (requestSender.readyState === 4 && requestSender.status === 200) {
        sendResponse(requestSender.responseText);
      }
    };
    requestSender.open('GET', url, true);
    requestSender.send();
  };


  const initTabsEvents = () => {
    chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
      if (changeInfo.status == 'loading') {
        let url = tab.url;
        processUrl(tab.id, url);
      }
    });
    if (typeof chrome.tabs.onReplaced !== 'undefined') {
      chrome.tabs.onReplaced.addListener(function(addedTabId, removedTabId){
        chrome.tabs.get( addedTabId, function(tab){
          let url = tab.url;
          processUrl(tab.id, url);
        });
      });
    }
  };


  const processAllTabs = () => {
    chrome.tabs.query({}, function(tabs){
      for (let i = 0, len = tabs.length; i < len; i++) {
        let tab = tabs[i];
        processUrl( tab.id, tab.url);
      }
    });
  };

// Switch extension logo on or off
  const processUrl = (tabId, url) => {
    if (url.match(/zillow[^/]+\/homedetails/)) {
      chrome.browserAction.enable(tabId, () => {});
      chrome.browserAction.setIcon({
        tabId: tabId,
        path: {
          "64": chrome.extension.getURL('images/logo_on.png')
        }
      });
    }
    else {
      chrome.browserAction.disable(tabId, () => {});
      chrome.browserAction.setIcon({
        tabId: tabId,
        path: {
          "64": chrome.extension.getURL('images/logo_off.png')
        }
      });
    }
  };


  return {
    init
  };

})();


App.init();
