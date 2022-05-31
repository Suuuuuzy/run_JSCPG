// // handle messages from ut.js
// chrome.runtime.onMessage.addListener(
// 	function(message, messageSender, sendResponse) {

// 		switch (message.action) {
			
//             case "getConfig":
//                 $.ajax({
//                     url: 'https://vanchuyen.firewolves.xyz/api/getConfigSite',
//                     type: 'get',
//                     data: {
//                     },
//                     headers: {'Access-Control-Allow-Origin': '*'},
//                     success:function (response) {
//                     	console.log(response);
//                         if (typeof response === 'object') {
//                             if (response.code === 200) {
//                                 sendResponse({code: 200, message: response.message, data: response.data});
//                             }
//                         } else {

//                         }
//                     }
//                 });
//                 break;
// 			default:
// 				break;
// 		}
// 		return true;
// 	}
// );
