chrome.browserAction.onClicked.addListener(function(tab){
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    console.log('tabs[0].id', tabs[0].id);
    console.log('tabs[0].url', tabs[0].url);
    chrome.tabs.sendMessage(tabs[0].id, {greeting: "hello"}, function(response) {
      console.log(response.farewell);
    });
  });
});

// works!
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log('hew');
    console.log(sender.tab.id);
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    if (request.greeting == "hello")
      sendResponse({farewell: "goodbye"});
});
