// original file:/media/data2/jianjia/extension_data/unzipped_extensions/lbapnbcemheenpjolcbdokfkcgljmdng/background.js

chrome.runtime.onMessage.addListener(
		function(request, sender, sendResponse) {
			if (request.text == "downloadFile") {
				var data = request.content;
				chrome.downloads.download({
					url: data.fileURL,
					filename: "Amazon_Invoice/"+data.orderId+".pdf",
					conflictAction: "overwrite"
				});
			}
		});
