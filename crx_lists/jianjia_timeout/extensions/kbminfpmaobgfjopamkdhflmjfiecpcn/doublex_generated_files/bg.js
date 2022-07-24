// original file:/media/data2/jianjia/extension_data/unzipped_extensions/kbminfpmaobgfjopamkdhflmjfiecpcn/js/config.js

var site_using_https = false;
var site_name = "customer.ordertaobao.net/api/Fast";

// append css to page
var NewStyles = document.createElement("link");
    NewStyles.rel = "stylesheet";
    NewStyles.type = "text/css";
    NewStyles.href = chrome.extension.getURL('css/main.css');
document.head.appendChild(NewStyles);

var service_host = "https://" + site_name + "/";
var add_to_cart_url = service_host+'cart/adds';
var cart_url = service_host+'checkout.html';
var link_detail_cart = "https://customer.ordertaobao.net/Cart";
var add_to_favorite_url = service_host + "i/favoriteLink/saveLink";
var button_add_to_cart_url = service_host + "assets/images/add_on/icon-bkv1-small.png";

var translate_url = 'https://' + site_name + '/i/goodies_util/translate';
var isUsingSetting = false;
var translate_keyword_url = "";
var version_tool = "1.3";
var exchange_rate;
var link_store_review_guidelines = "#";
var exchange_rate_url = 'https://' + site_name + '/api/exchange';
var catalog_scalar_url = null;

// original file:/media/data2/jianjia/extension_data/unzipped_extensions/kbminfpmaobgfjopamkdhflmjfiecpcn/background.js

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







