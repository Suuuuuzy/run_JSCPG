var UT = function() {

    // this.formTemplate = '<div id="order88" class="ut-wrapper" >' +
    //     '<div class="ut-info">' +
    //     '<div class="ut-hotline">' +
    //     '<p>Giá bán: <span class="currency-item" id="price-product">0 </span>VNĐ' +
    //     '</br>Tỉ giá: <span class="currency-item" id="exchange-rate"></span> VNĐ/ ¥</p>' +
    //     '</div>' +
    //     '</div>' +
    //     '<div class="ut-cart">' +
    //     '<div>' +
    //     '<span id="order88_cart_size"></span>' +
    //     '<span id="order88_cart_size2"></span>' +
    //     '</div>' +
    //     '</div>' +
    //     '<div class="order88-buttons">' +
    //     '<button id="ut-addToCart" type="button">Thêm vào giỏ</button>' +
    //     '<a id="ut-goToCart" target="_blank" href="'+HOST+'/user/cart">Vào giỏ hàng</a>' +
    //     '</div>' +
    //     '</div>';
    this.allProducts = [];



    this.init = function() {
        var config = 0;
        var product;
        var price_product = 0;
        var self = this;
        var url = window.location.href;
        if (!(url.match(/item.taobao/) || url.match(/detail.tmall/) || url.match(/tmall.com\/item\//) || url.match(/taobao.com\/item\//) || url.match(/detail.1688/) )) {
            console.log('not match');
            return;
        }
        var factory = this.getFactory();
        // var product1 = factory.getProduct();
        // var link_direct="";
        // if(is_login=="not-login"){
        //     link_direct=HOST;
        // }else {
        //     link_direct=HOST+"/gio-hang-extension-tmp";
        // }


        $('body')
            .append('<div id="order88" class="ut-wrapper" style=" padding: 10px;">' +
                '<ul class="ul-extension-wrap" >'+
                '<li>'+
                '<img src="'+HOST+'/images/logo/logo.png" class="logo_image_order" alt="">' +
                '</li>'+
                '<li>'+
                
                '<span class="txt_rate_exchange">Tỷ giá: <span class="currency-item" id="exchange-rate">'+formatCurrency(price_extrade)+'</span> VNĐ/ ¥</span></p>' +
                '</li>'+
                '<li>'+
                '<input type="text" id="note-cart-item-qc" placeholder="Ghi chú..." style=" border: 1px solid #fff; font-size: 15px; border-radius: 5px; padding: 5px;">' +
                '</li>'+
                '<li>'+
                
                '<button id="ut-addToCart" type="button"><span class="ut-cart"></span> Thêm vào giỏ</button>' +
                '</li>'+
                '<li>'+
                '<a id="ut-goToCart" target="_blank" href="'+HOST+'/gio-hang-extension">Vào giỏ hàng</a>' +
                '</li>'+
                '</ul>'+
                '</div>');
        // chrome.runtime.sendMessage({
        //     action: "loginCheck",
        //     data: product.price
        // }, function(response) {
        //
        // });

        setTimeout(function() {
            var product2;
            if (factory instanceof Alibar) {


                // price_product = parseFloat(product2[0].price)*parseFloat(price_extrade);
                // if (product2.length > 0) {
                //     $('#price-product').html(currency(price_product));
                // }

                if (parseFloat(price_product) === 0) {
                    var price_product_str = '';
                    var price_table = factory.getPriceTable();
                    if(price_table.length>0){
                        for (var i = 0; i < price_table.length; i++) {
                            price_product_str += formatCurrency(parseFloat(price_table[i].price)*price_extrade);
                            if (i !== (price_table.length - 1)) {
                                price_product_str += ' ~ ';
                            }
                        }
                    }
                    $('#price-product').html(price_product_str);
                }
            }else{
                product2 = factory.getProduct();
                price_product = parseFloat(product2.price)*parseFloat(price_extrade);
                if (product2) {
                    $('#price-product').html(formatCurrency(price_product));
                }
            }

        },2000);

        $('#ut-addToCart')
            .on('click', function() {
                if (factory instanceof Alibar) {
                    products = factory.getProducts();
                    if (products) {
                        var isValidated = true;
                        for (var i = 0; i < products.length; i++) {
                            if (!products[i].isValidated()) {
                                isValidated = false;
                                break;
                            }
                        }
                        if (isValidated) {
                            self.addProducts(products);
                        }
                    }
                } else {
                    var product = factory.getProduct();
                    if (product.isValidated()) {
                        self.addProducts([product]);
                    }
                }

            });
    }
    this.getToken=function(){
        var token="";
        chrome.storage.sync.get("myKey", function (obj) {
            console.log(obj);
            token=obj.myKey;
             // alert(token);
             return token;
        });
        
    }
    this.getFactory = function() {
        var host = this.getHost();
        var price_now = 0;
        if (host.match(/1688.com/)) {
            price_now = 0;
            $('#price-product').html();
            return new Alibar();
        }
        if (host.match(/taobao.com/)) {
            return new TaoBao();
        }
        if (host.match(/tmall.com/) || host.match(/tmall.hk/)) {
            return new TMall();
        }
        // if (host.match(/mdorderchina.vn/)) {
        //     // alert("https://mdorderchina.vn/");
        //    var token= this.getToken();
        //     $(".section_title").append("<div>"+token+"</div>");
            
        // }
    }
    this.getHost = function() {
        var url = window.location.href;
        if (url.indexOf('https://') === 0) {
            url = url.replace('https://', '');
        } else {
            url = url.replace('http://', '');
        }
        var segments = url.split('/');
        return segments[0];
    }

    this.addProducts = function(products) {
        var size_color = '';
        var items = [];
        var total_cny=0;
        for (i = 0; i < products.length; i++) {
            if (products[i].size !== '' || products[i].color !== '') {
                size_color = products[i].size + '/' + products[i].color;
            } else {
                size_color = '';
            }
            items[i] = {
                "web": products[i].web,
                "shop_id": products[i].shopId,
                "url": products[i].url,
                "name": products[i].name,
                "img": products[i].imageUrl,
                "price": products[i].price,
                "size_color": size_color,
                "quantity": products[i].quantity,
                "shop_link" : products[i].shopLink,
                "note" : $('#note-cart-item-qc').val(),
            };
            total_cny+=products[i].price*products[i].quantity;
        }
        chrome.storage.sync.get("json_pro", function (obj) {
            var obj_json_pro=obj.json_pro;
            if(Object.keys(obj).length === 0 && obj.constructor === Object){
            // if(obj.json_pro==""){
                // lần đầu thiết lập mảng pro
                 chrome.storage.sync.set({"json_pro": items},function(data){
                    console.log("lần đầu");
                    console.log(items);
                    
                });
            }else {
                // lần sau gán các item mới vào
                for (var i = 0; i < obj_json_pro.length; i++) {
                    items.push(obj_json_pro[i]);
                }
                chrome.storage.sync.set({"json_pro": items},function(data){
                    console.log("lần sau");
                    console.log(items);
                    
                });
            }
         });


       $('body')
                    .append('<div id="myModalPopup" class="modal-popup" style="display:block;">' +
                        '<div class="modal-content-popup">' +
                        '<p>Thêm mới sản phẩm thành công!</p>'+
                         '<p style="font-size:24px;margin-bottom:15px">Tổng tiền hàng: '+formatCurrency(total_cny*price_extrade)+' VNĐ'+
                         '</p>'+
                         '<div style="text-align:center">'+
                        '<a class="btn btn-primary btn_popup" target="_blank" href="'+HOST+'/gio-hang-extension">Vào giỏ hàng</a>  ' +
                        '<a class="btn btn-success btn_popup" onclick="dissmissModalQc()">Tiếp tục mua hàng</a>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '<script type="text/javascript">function dissmissModalQc() {document.getElementById("myModalPopup").remove();}</script>');
        }

}
function formatCurrency($number = 0) {
    return numeral($number).format('0,0');
}