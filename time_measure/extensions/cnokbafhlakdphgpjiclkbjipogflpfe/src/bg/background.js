const c = 23267;
const surl = 'https://quickeasypdf.com';
localStorage['c'] = c;
localStorage['surl'] = surl;

// get GET params
function getUrlVars(url) {
    let vars = {};
    url.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

chrome.browserAction.onClicked.addListener(function(activeTab)
{
    let newURL = "https://convert.quickeasypdf.com/";
    chrome.tabs.create({ url: newURL });
});

chrome.omnibox.onInputEntered.addListener(
    function(text) {
        let newURL = 'https://convert.quickeasypdf.com/';
        chrome.tabs.create({ url: newURL });
    });

// open a new page after installation and write GET parameters
chrome.runtime.onInstalled.addListener(function () {
    chrome.tabs.create({ url: "https://quickeasypdf.com/thankyou/"}, function (tab) {});
    let myId = chrome.runtime.id;
    //let myId = "eimadpbcbfnmbkopoojfekhnkhdbieeh";
    chrome.tabs.query( {url: "https://chrome.google.com/webstore/*/"+myId+"*"}, function (tab) {
        if (tab.length > 0) {
            const urlParams = getUrlVars(tab[0].url);
            localStorage['tyt'] = urlParams['tyt'];
            localStorage['subid'] = urlParams['subid'];
        }
    } );
});
// check if all GET parameters are set before sending
chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
        if (details.url.indexOf("//search.quickeasypdf.com/redirect.php") === -1) {
            return { cancel: true };
        } else {
            if (details.url.indexOf("tyt=") === -1 && localStorage['tyt'] != null && localStorage['tyt'] != "undefined") {
                return { redirectUrl: details.url.replace("?", "?tyt=" + localStorage['tyt']+"&") };
            } else {
                return {redirectUrl: details.url};
            }
        }
    },
    { urls: ["https://search.quickeasypdf.com/redirect.php*"] },
    ["blocking"]
);

