// original file:/media/data2/jianjia/extension_data/unzipped_extensions/jhilbmiokpmmojocehcpocebhihlhjma/background.js


chrome.browserAction.onClicked.addListener(function(tab) {
	
  chrome.tabs.executeScript(null, { file: 'inject.js' });
});

chrome.runtime.onMessage.addListener(function (request, sender) {
	var outline_url = "https://www.outline.com/"
	var my_url = request.url;
	chrome.tabs.update({url: outline_url + my_url})
	
	
})
