chrome.runtime.onInstalled.addListener(function() {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
        chrome.declarativeContent.onPageChanged.addRules([{
            conditions: [
                new chrome.declarativeContent.PageStateMatcher({
                    pageUrl: {
                        urlMatches: 'https://shibboleth2.id.ubc.ca/idp/Authn/UserPassword'
                    },
                })
            ],
            actions: [new chrome.declarativeContent.ShowPageAction()]
        }]);
    });
});



chrome.pageAction.onClicked.addListener(function(tab) {


    chrome.cookies.getAll({
        domain: "shibboleth2.id.ubc.ca"
    }, function(cookies) {

        for (var i = 0; i < cookies.length; i++) {
            console.log("deleting " + cookies[i].name);
            chrome.cookies.remove({
                url: "http://shibboleth2.id.ubc.ca" + cookies[i].path,
                name: cookies[i].name
            });
        }
        alert("Shibboleth2 cookies cleared! Wow! Now try going back and clicking the login button again.")
    });
});