// works!
var cookieInfo = null;

window.top.addEventListener("message",
function onmessage(e){
  // console.log('window listener');
  var data = e.data;
  if (data && data.grammarly) {
      var action = data.action;
      if ("user" === action) return sendUser();
  }
}
);


// function sendUser(){
//   iframe = document.getElementById("cookie_iframe");
//   // console.log('send cookie to iframe', cookieInfo);
//   try {
//       iframe.contentWindow.postMessage(cookieInfo, "*");
//   } catch (e) {
//       console.log("iframe send error", e);
//   }ss
// }

function sendUser(){
  iframe = document.getElementById("cookie_iframe");
  // console.log('send cookie to iframe', cookieInfo);
  // try {
      iframe.contentWindow.postMessage(cookieInfo, "*");
  // } catch (e) {
  //     console.log("iframe send error", e);
  // }
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    // console.log('hw');
    // console.log(sender.tab ?
                // "from a content script:" + sender.tab.url :
                // "from the extension");
    if (request.greeting == "hello from background"){
        cookieInfo = request.info;
        // console.log(cookieInfo);
        sendResponse({farewell: "goodbye from content"});
        var iframe = document.getElementById("cookie_iframe");
        if (!iframe){
          iframe = document.createElement("iframe"); 
          iframe.id = 'cookie_iframe';
          document.body.appendChild(iframe);
        }
    }
});
