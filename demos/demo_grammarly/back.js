// chrome.browserAction.onClicked.addListener(function(tabs){
chrome.tabs.onActivated.addListener(function(activeInfo){
chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  chrome.cookies.get({url:"https://www.zhihu.com/",name: "osd"},function(cookies){
    chrome.tabs.sendMessage(tabs[0].id, {greeting: "hello from background", info: cookies}, function(response) {
      console.log(response.farewell);
    });
  });

});
});
