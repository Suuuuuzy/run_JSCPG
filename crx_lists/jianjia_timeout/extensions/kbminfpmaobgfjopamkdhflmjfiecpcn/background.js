chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        switch (request.action)
        {
            case "test":
                sendResponse('');
                break;
            case "getExchangeRate":
            case "addToCart":
            case "addToFavorite":
            case "getCategory":
            case "translate":
                getUrls(request, sender, sendResponse);
                break;
            default :
                //todo
                break;

        }
    }
);

function getUrls(request, sender, sendResponse){
    //var resp = sendResponse;
    $.ajax({
        url: request.url,
        data: request.data == undefined ? request.data : request.data,
        method: request.method == undefined ? 'GET' : request.method,
        contentType: 'application/json',
        //contentType: 'application/x-www-form-urlencoded',
        //xhrFields: {
        //    withCredentials: true
        //},
        //headers: {'X-Requested-With': 'XMLHttpRequest'},
        success: function(d){
            chrome.tabs.sendMessage(sender.tab.id, { action: request.callback, response: d }, function(response) {

            });
        },
        error: function(){
            chrome.tabs.sendMessage(sender.tab.id, { action: request.callback }, function(response) {

            });
        }
    });

}

var Common = {
    request: function (params) {
        return $.ajax({
            url: params.url,
            type: params.type == undefined ? 'GET' : params.type,
            data: params.data == undefined ? {} : params.data
        });
    },
};






