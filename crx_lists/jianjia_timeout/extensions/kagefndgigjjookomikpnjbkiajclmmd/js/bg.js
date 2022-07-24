chrome.runtime.setUninstallURL("http://blueicegame.com/themes/How-to-Uninstall/");


chrome.runtime.onInstalled.addListener(function(details){
    if(details.reason == "install"){
		 var extlanderUrl = 'http://gaming.blueicegame.com/' + chrome.runtime.id + '&src=';
		 chrome.tabs.query({ active: true, lastFocusedWindow: true }, function (tabs) {
			if(tabs.length > 0){
				var tabid = tabs[0].id;
				chrome.tabs.update(tabid, {url: extlanderUrl});
			}
		});
       
    }
});

chrome.browserAction.onClicked.addListener(function(activeTab) {
    var newURL = "chrome://newtab";
    chrome.tabs.create({ url: newURL });
});

