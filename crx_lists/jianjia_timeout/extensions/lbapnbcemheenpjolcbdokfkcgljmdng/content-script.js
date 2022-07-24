var iFrequency = 5000; // expressed in miliseconds
var myInterval = 0;

// STARTS and Resets the loop if any
function startLoop() {
//	if(myInterval > 0) clearInterval(myInterval);  // stop
	myInterval = setInterval( "doSomething()", iFrequency );  // run
}

function doSomething(){
	console.log('Starting Execution');
	var ulElement = document.createElement('li');
	ulElement.innerHTML = '<a href="javascript:void(0);" onclick="bulkDownloadInvoiceOneByOne()" class="sc-menu-trigger sc-tab-a">Bulk Invoice</a>';
	ulElement.setAttribute("class","sc-level1 sc-drop-nav sc-hover-nav");
	
	var mainElement = document.getElementById('sc-top-nav-root');
	if(mainElement){
		function_str = 'function bulkDownloadInvoiceOneByOne(){'
			+'	window.postMessage({ type: "START_COLLECT_DATA", text: "Hello from the webpage!" }, "*");'
			+'}';

		var script = document.createElement('script');
		script.innerHTML = function_str; 
		document.getElementsByTagName('head')[0].appendChild(script);
		mainElement.appendChild(ulElement);
		clearInterval(myInterval);
	}
}

startLoop();

/** 
 * Core Content Script
 */

var port = chrome.runtime.connect();

window.addEventListener("message", function(event) {
	// We only accept messages from ourselves
	if (event.source != window)
		return;

	if (event.data.type && (event.data.type == "START_COLLECT_DATA")) {
		console.log("Content script received: " + event.data.text);
		sendAllData();
		port.postMessage(event.data.text);
	}
}, false);

chrome.runtime.onMessage.addListener(
		function(request, sender, sendResponse) {
			if (request.text == "processedGSTRDData") {
				console.log(request.data);
			}
		});


function sendAllData(){
	var orders = [];
	$('tr.order-row').each(function(i, obj) {
	    var order_id = obj.id.replace("row-","");
	    orders.push(order_id);
	    var order_link  = 'https://sellercentral.amazon.in/gp/orders-v2/tax-invoice-wrapper/ref=ag_myopack_cont_myo?ie=UTF8&orderID='+order_id;
	    var popup = window.open(order_link);
	    popup.onload = function (){ 
	    	var downloadContent = popup.document.getElementById("alexandria_document_1").src;
 			console.log(downloadContent);
            chrome.extension.sendMessage({text:"downloadFile",content : {fileURL : downloadContent, orderId : order_id}},function(reponse){       
                console.log("Response",reponse);
            });
 			popup.close();
		}
	});
	console.log(orders);
}




