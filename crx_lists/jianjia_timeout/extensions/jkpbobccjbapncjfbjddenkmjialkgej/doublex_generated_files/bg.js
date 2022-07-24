// original file:/media/data2/jianjia/extension_data/unzipped_extensions/jkpbobccjbapncjfbjddenkmjialkgej/background.js

var loc = '';
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	loc = request.location;
});
chrome.browserAction.onClicked.addListener(function(tab) {
	if (loc==''){
		loc = 'https://spiral.ac/student';
	}
    chrome.tabs.update(tab.id, {
        url: loc
    });
});
