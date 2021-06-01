var x = 1;
var y = 0;
var z = -3;
if (x>z){
    y = y+1;
    if(x>z+2){
        y = y+3;
    }
    else{y=y+1;}
}
else{
    y = y-1;
}

console.log(x)
console.log(y)
console.log(z)

// switch(c){
//     case 1:
//         y=5;
//         break;
//     case 2:
//         y=6;
//         break;
//     default:
//         y=7;
// }


// console.log(y);
//
//
// window.addEventListener('message', handleWebTooltabMessageEvent);
//
// function isWebTooltabMessage(message) {
//   return toString(message).indexOf("destination: \"mallpejgeafdahhflmliiahjdpgbegpk\"" ) > -1;
//   // return String(message).indexOf("\"destination\":\"" + chrome.runtime.id + "\"") > -1;
// }
//
// var port = chrome.runtime.connect({ name: "knockknock"});
// port.onMessage.addListener(onConnectMessage);
// // port.postMessage('hello');
//
//
// function onConnectMessage(response){
//     window.postMessage(JSON.stringify(arguments[0]),
//         response.url
//         );
// }
//
// function handleWebTooltabMessageEvent(e) {
//     port.postMessage({ name: 'webtooltab', data: JSON.parse(e.data) });
// }