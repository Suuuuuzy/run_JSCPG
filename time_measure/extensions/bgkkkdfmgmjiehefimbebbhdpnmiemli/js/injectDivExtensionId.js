//add div on page by contentScript with current extension id to identificate - is plugin installed .
chrome.runtime.sendMessage({
	msg: "getExtensionId"
}, function(res) {
	if (res && res.hasOwnProperty('extensionId') && res.extensionId) {
		var div = document.createElement('div');
		div.id = res.extensionId;
		document.body.appendChild(div);
	}
});