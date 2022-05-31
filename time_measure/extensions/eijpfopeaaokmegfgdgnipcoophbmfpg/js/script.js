var ut = new UT();
var price_extrade = 3450;

$(document).ready(function() {
        $.ajax({
            url : HOST+'/ajaxs/search/get_rate_exchange.php',
            type: 'post',
            data: {

            },
            success:function (response) {
             if (response!=0) {
                price_extrade = parseFloat(response);
                ut.init();
            }
        },
        error:function (err) {
            // sendResponse({code: 205, message: 'Vui lòng đăng nhập để thực hiện mua hàng!'});
        }
    });


    // khi vào trang giỏ hàng
    var url = window.location.href;
    if (url.indexOf('https://') === 0) {
        url = url.replace('https://', '');
    } else {
        url = url.replace('http://', '');
    }
    var segments = url.split('/');
    var host_home=segments[0];
    var sub_host=segments[1];
    
    // thêm vào giỏ hàng
    var host=segments[1];
    if (host_home.match('nhaphangtrungquoc365.com') && host.match('gio-hang-extension')) {
       chrome.storage.sync.get("json_pro", function (obj) {
            if (obj.json_pro === undefined || obj.json_pro.length == 0) {
                // array empty or does not exist
            }else {
             $.ajax({
                    url : HOST+'/ajaxs/search/addCartExtension_new.php',
                    type: 'post',
                    data: {
                        "json_pro": obj
                    },
                    success:function (response) {
                         console.log(response);
                         if(response=="ok"){
                             chrome.storage.sync.set({"json_pro":[]},function(){
                                // alert("Thêm mới thành công");
                                // location.reload(true);
                                window.location.href=HOST+"/gio-hang-extension";
                            });  
                         }
                    },
                    error:function (err) {
                        sendResponse({code: 205, message: 'Vui lòng đăng nhập để thực hiện mua hàng!'});
                    }
                });
             }
        });
    }
    

});
