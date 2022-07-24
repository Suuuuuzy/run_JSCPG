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