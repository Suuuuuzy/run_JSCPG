// this background script is used to invoke desktopCapture API
// to capture screen-MediaStream.

const session = ['screen', 'window', 'tab', 'audio'];

function getSourceID({tab, url}, callback) {
  // as related in https://code.google.com/p/chromium/issues/detail?id=413602 and https://code.google.com/p/chromium/issues/detail?id=425344 :
  // a frame/iframe requesting screen sharing from a different origin than the parent window
  // will receive the InvalidStateError when using the getUserMedia function.
  // the solution its to change the tab.url property to the same as of the requesting iframe. Its works without iframe as well.
  // requires Chrome 40+
  tab.url = url;
  chrome.desktopCapture.chooseDesktopMedia(session, tab, function(sourceId) {
    // "sourceId" will be empty if permission is denied
    if (!sourceId || !sourceId.length) {
      callback({ error: 'permissionDenied' });
      return;
    }

    callback({ sourceId });
  });
}

chrome.runtime.onMessageExternal.addListener(function (message, sender, callback) {
  switch (message.type) {
    case 'getSourceId':
      getSourceID(sender, callback);
      return true;
    break;
    case 'isInstalled':
      callback(true);
    break;
    case 'apiVersion':
      callback(2);
    break;
    default:
      callback({ error: 'unsupportedMessage', type: message.type });
  }
});
