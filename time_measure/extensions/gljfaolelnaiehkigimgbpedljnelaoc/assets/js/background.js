	var baseUrl = 'https://www.onzeclubwinkel.nl';
	var apiBaseUrl = baseUrl + '/api/redirect_all.php?url=all';
	var timeInterval = 30;
	
	//These make sure that our function is run every time the browser is opened.
	chrome.runtime.onInstalled.addListener(function() {
		chrome.storage.local.set({'redirectUrls':''});	
		initialize();		
	});
	
	chrome.runtime.onStartup.addListener(function() {
		initialize();
	});

	
	function initialize(){
		getRules();
		setInterval(function(){getRules()}, timeInterval * 1000);
	}
	
	function getRules(){	
		chrome.storage.local.get(["user"], function(result){
			if(typeof result.user != "undefined" && typeof result.user.customer_id != "undefined"){
				var customer_id = result.user.customer_id;
			} else{
				var customer_id = 52857;
			}
			$.getJSON(apiBaseUrl, function (response) {				
					var temp_rules = [];
					var redirectUrls = [];
					for (var i = 0; i < response.length; ++i) {
						var item = response[i];
						item.destination = item.destination.replace("{customer_id}",customer_id);						
						temp_rules.push(item);	
						if (/^(ht)tps?:\/\//i.test(item.value)) {
							if(item.value[item.value.length -1] == '/'){
								redirectUrls.push(item.value);
							} else {
								redirectUrls.push(item.value + '/');
							}
						} else if(item.value.indexOf('www') != -1 ){
							var tempurl = $.trim(item.value);
							tempurl = tempurl.replace("www","*://www");
							if(tempurl[tempurl.length -1] == '/'){
								redirectUrls.push(tempurl);
							} else {
								redirectUrls.push(tempurl + '/');
							}							 
						}					
					}					
					chrome.storage.local.set({'rules':temp_rules});
					chrome.storage.local.set({'redirectUrls':redirectUrls});
					resetRedirectUrls();				
				});			
							
		});
	}

	
	var form_data = {};
	
	function getRedirectUrl(currentUrl, result){
		 console.log('getRedirectUrl');
		 console.log(currentUrl);
		 for (var i = 0; i < result.rules.length; ++i) {
			if(result.rules[i].operator == "equals" && currentUrl == result.rules[i].value ){
				console.log('destination' + result.rules[i].destination);
				return result.rules[i].destination;						
			}
		}
		return currentUrl;
	}
	
	var rulesArray = [];
	
	function resetRedirectUrls(){
		chrome.webRequest.onBeforeRequest.removeListener(requestHandler);
		chrome.storage.local.get(["rules","redirectUrls"], function(result){
			rulesArray = result;
			console.log(rulesArray);
			chrome.webRequest.onBeforeRequest.addListener(
				requestHandler,
				{
					urls: result.redirectUrls,
					types: ["main_frame"]
				},
				["blocking"]
			);		
		});
		chrome.webRequest.handlerBehaviorChanged();
	}
	
	
	function requestHandler(details){
		return {
				redirectUrl: getRedirectUrl(details.url, rulesArray)
		};			
	}

	// Listen for message to start filling in the form
	chrome.runtime.onMessage.addListener(function(message, sender, send_response) {		
			console.log(message);
			if(typeof message.action != 'undefined' && message.action == "ResetRules"){
				getRules();
			}
			form_data = message;
			chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
				chrome.tabs.update(tabs[0].id, {url: tabs[0].url});
			});
	})
	
	// Listen for port messages
	chrome.runtime.onConnect.addListener(function(port) {
		var sender = port.sender
		port.onMessage.addListener(function(message) {
			console.log('start attaching');
			// get-form-data --- To send form data to script
			if (message.type == 'get-form-data') {
				port.postMessage({'data': form_data})
			}
		})
	})
	
	chrome.browserAction.onClicked.addListener(function(activeTab)
	{
		chrome.tabs.create({ url: baseUrl });
	});