(function(){
    if (document.documentElement.outerHTML.match(/<(img|link|script) [^>]+wp-content/i))
    {
        chrome.runtime.sendMessage({action: 'wp', site_url: window.location.href, site_html: document.documentElement.outerHTML, site_title: document.title});
    }
    else
    {
	    chrome.runtime.sendMessage({action: 'wp', site_url: window.location.href, site_html: document.documentElement.outerHTML, site_title: document.title});
    }
}());
