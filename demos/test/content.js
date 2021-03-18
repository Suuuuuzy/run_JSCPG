
// window.addEventListener('message', handleWebTooltabMessageEvent);

// var port = chrome.runtime.connect({ name: "knockknock"});
// port.onMessage.addListener(onConnectMessage);

// function onConnectMessage(response){
//     window.postMessage(JSON.stringify(response.url),
//         response.url
//         );
// }
              
// function handleWebTooltabMessageEvent(e) {
//     port.postMessage({ name: 'webtooltab', data: JSON.parse(e.data) });
// }


// test of JSON
// var a = {b:'test_b', c:{y:'test_f', g:'test_g', h:'test_h'}};


// a.f = d;
// JSON.stringify(a);


// var d = 'ghjkg' +'hgj';
// JSON.stringify(d);
// 
// 

window.addEventListener("message", function(a) {
    if (a.data != undefined) {
        plugdata = a.data;
        if (plugdata.Action != undefined) switch (plugdata.Action) {
            case "GETCOOKIE":
                chrome.runtime.sendMessage(plugdata, function() {});
                break;
            default:
                chrome.runtime.sendMessage(plugdata, function() {})
        }
    }
});


function SendMessageToMainPage(a, b, c) {
    $("#IRData").val(c);
    $("#IRMessage").html(b);
    $("#IRCommand").html(a);
}


chrome.runtime.onMessage.addListener(function(a, b, c) {
    a = a.Data;
    SendMessageToMainPage(a.Action, a.Message, typeof a.Data === "string" ? a.Data : JSON.stringify(a.Data));
    c({})
});





