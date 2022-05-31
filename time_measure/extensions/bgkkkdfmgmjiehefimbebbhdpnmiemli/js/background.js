var extensionId;

chrome.browserAction.onClicked.addListener(function(tab) {
	//open extension's main page 
	var url = chrome.runtime.getURL('../../redirect.html');
	chrome.tabs.create({
		url
	});
});
chrome.management.getSelf(function(extensionInfo) {
	extensionId = extensionInfo.id;
});
//disable this extension
function disableExtension() {
	//our extension id extensionId
	if (extensionId)
		chrome.management.setEnabled(extensionId, false, function() {});
}
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if (request.msg == "getDisabled") {
		disableExtension();
		sendResponse({
			disabled: true
		});
		return true;
	}

	if (request.msg == "getExtensionId") {
		sendResponse({
			extensionId: extensionId
		});
	}
});

/**
 * Add your Analytics tracking ID here.
 */
let trackingId = 'UA-87955952-6';
/**
 * Below is a modified version of the Google Analytics asynchronous tracking
 * code snippet.  It has been modified to pull the HTTPS version of ga.js
 * instead of the default HTTP version.  It is recommended that you use this
 * snippet instead of the standard tracking snippet provided when setting up
 * a Google Analytics account.
 */

function sendAnalytics(params) {
    // Return a new promise.
    return new Promise(function (resolve, reject) {
        let url = 'https://www.google-analytics.com/collect',
            paramsString = '?v=1&tid=' + params.tid + '&cid=' + params.cid + '&t=event&ec=extension&ea=install&el=NewGA' + params.dr + params.cd1 + params.cd2 + 
        params.cn + params.cs + params.cm  + params.ck + params.cc;
        // Do the usual XHR stuff
        var req = new XMLHttpRequest();
        req.onload = function () {
            // This is called even on 404 etc
            // so check the status
            if (req.status == 200) {
                console.log('Extension registred!');
                // Resolve the promise with the response text
                resolve(req.responseURL);
            } else {
                console.log('Registration error!');
                // Otherwise reject with the status text
                // which will hopefully be a meaningful error
                reject(Error(req.statusText));
            }
        };
        // Handle network errors
        req.onerror = function () {
            reject(Error("Network Error"));
        };

        //console.log(url+paramsString);
        req.open('GET', url + paramsString);


        // Make the request
        req.send();
    });
}

//validate param is it existsing 
function checkParam(source, name) {
	return source.hasOwnProperty(name) ? source[name] : "";
}

// take params from landing page and convert it to Google analytics type object fieldsObject
// https://developers.google.com/analytics/devguides/collection/analyticsjs/tracker-object-reference?hl=ru#set
function setGAParams(params) {
    if (params) {
        var ga_params = {};
        ga_params.referrer = checkParam(params, "url");
        ga_params.gaClientId = checkParam(params, "gaClientId");
        ga_params.clientDateId = new Date(checkParam(params, "clientDateId"));
        ga_params.utm_campaign = checkParam(params, "utm_campaign");
        ga_params.utm_source = checkParam(params, "utm_source");
        ga_params.utm_medium = checkParam(params, "utm_medium");
        ga_params.utm_term = checkParam(params, "utm_term");
        ga_params.utm_content = checkParam(params, "utm_content");
        localStorage.setItem("GAParams", JSON.stringify(ga_params));
    }
}


// get Google analytics ready extra fieldsObject from landing page
function getGAParams() {
	var ga_params = localStorage.getItem("GAParams");
	return ga_params ? JSON.parse(ga_params) : false;
}

//convert Google analytics params to Measurement Protocol type names
function convertGAParamsToMP(params) {
    let convertedParams = {};

    convertedParams["tid"] = trackingId;
    convertedParams["cid"] = localStorage.getItem("ga:clientId");
    if (params) {
        convertedParams["dr"] = '&dr='+ params.referrer;
        convertedParams["cd1"] = '&cd1=' + params.gaClientId;
        convertedParams["cd2"] = '&cd2=' + params.clientDateId;
        convertedParams["cn"] = '&cn=' + params.utm_campaign;
        convertedParams["cs"] = '&cs=' + params.utm_source;
        convertedParams["cm"] = '&cm=' + params.utm_medium;
        convertedParams["ck"] = '&ck=' + params.utm_term;
        convertedParams["cc"] = '&cc=' + params.utm_content;
    } else {
        convertedParams["dr"] = '';
        convertedParams["cd1"] = '';
        convertedParams["cd2"] = new Date(Date.now());
        convertedParams["cn"] = '&cn=none';
        convertedParams["cs"] = '&cs=direct';
        convertedParams["cm"] = '&cm=none';
        convertedParams["ck"] = '&ck=none';
        convertedParams["cc"] = '&cc=none';
    }
    return convertedParams;

}

function sendDataToUninstall(data) {
	var url = "https://extensionmatrix.com:3000/uninstallData/" + data["cid"],
		xhr = new XMLHttpRequest();


	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	xhr.send(JSON.stringify(data));
	xhr.onload = function() {
		if (xhr.status == 200) {
			console.log('good');
		}
	}
}


//first run logic - if it extension first run then send install event to google analytics using js/Background/analytics.js
var isFirstRun = localStorage.getItem('install');
if (isFirstRun !== "1") {
	//waiting for params from landing page 
	//if it was installed from landing page use fieldsObject
	//else so there wiil not be any extra fieldsObject for Google analytics events
	setTimeout(function (arguments) {
        var extraGAParams = getGAParams(),
            userId = "";
        if (extraGAParams) {
            console.log('Params recieved!');
            clientId = extraGAParams.gaClientId;
        } else {
            console.log('Params generated!');
            clientId = 'm' + Math.floor((Math.random() * 1000000000) + 1) + '.' + Math.round(Date.now() / 1000);
        }
        localStorage.setItem("ga:clientId", clientId);
        localStorage.setItem('install', "1");
        
        sendAnalytics(convertGAParamsToMP(getGAParams())).then(console.log);
        chrome.runtime.setUninstallURL("https://extensionmatrix.com:3000/extensionDeleted/" + clientId, function () {});
        sendDataToUninstall(convertGAParamsToMP(getGAParams()));
    }, 4000);
};

chrome.runtime.onMessageExternal.addListener(function(request, sender, sendResponse) {

	if (request.msg == "setGAParams") {
		setGAParams(request.params);

		sendResponse({
			status: true
		});
	}
});