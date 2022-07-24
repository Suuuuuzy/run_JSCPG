let getStorage = function(key) {
	return new Promise((resolve, reject)=> {
		if(chrome.storage){
			let keys = key;
			if(typeof key === "string")
				keys = [key]
			chrome.storage.local.get(keys, function(values) {
				if(typeof key === "string")
					return resolve(values[key]);
				return resolve(values);
			});
			return;
		}
		setTimeout(function(){
			resolve(null);
		}, 50);
	});
}

window.addEventListener("message", function(event) {
	// We only accept messages from ourselves
	if (event.source != window)
		return;

	if (event.data.type && (event.data.type === "RM")) {
		console.log("Content script received message: " + event.data.action);
		let extId = chrome.runtime.id;
		if(event.data.action === "getVersionAction"){
			window.postMessage({'type': 'RM-getVersion', 'extId': extId}, "*");
			return;
		}

		if(event.data.action === "getCounter") {
			getStorage("searchCount").then((val)=> {
				if(!val)
					val = 0;
				window.postMessage({type: "searchCount", value: val},  "*");
			});
			return;
		}

		chrome.runtime.sendMessage({
			from:    'content',
			subject:  event.data.action
		});
	}
});
