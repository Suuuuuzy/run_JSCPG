// original file:/media/data2/jianjia/extension_data/unzipped_extensions/eijpfopeaaokmegfgdgnipcoophbmfpg/js/config.js

var HOST = "https://nhaphangtrungquoc365.com";
var ADDON_VERSION = "1.0";

// original file:/media/data2/jianjia/extension_data/unzipped_extensions/eijpfopeaaokmegfgdgnipcoophbmfpg/js/product.js

var Product = function(sku, url, name, imageUrl, price, quantity, color, size, shopId, web, shopLink) {
    this.sku = sku ? sku : '';
    this.url = url ? url: '';
    this.name = name ? name : '';
    this.imageUrl = imageUrl ? imageUrl : '';
    this.price = price ? price : '';
    this.quantity = quantity ? quantity : '';
    this.color = color ? color : '';
    this.size = size ? size : '';
    this.shopId = shopId ? shopId : '';
    this.web = web ? web : '';
    this.shopLink = shopLink ? shopLink : '';

    this.isValidated = function () {
        if (this.name === '') {
            alert ('Khng ly c tn sn phm');
            return false;
        }

        if (this.imageUrl === '') {
            alert ('Khng ly c link nh ca sn phm');
            return false;
        }

        if (this.price === '') {
            alert ('Khng ly c gi ca sn phm');
            return false;
        }

        if (this.quantity === '') {
            alert ('Khng ly c s lng sn phm');
            return false;
        }


        // if (this.shopId == '') {
        //     alert ('Khng ly c tn shop');
        //     return false;
        // }


        // if (this.color == '') {
        //     alert ('Cha chn mu sc');
        //     return false;
        // }

        // if (this.size == '') {
        //     alert ('Cha chn size');
        //     return false;
        // }

        return true;
    }
}
// original file:/media/data2/jianjia/extension_data/unzipped_extensions/eijpfopeaaokmegfgdgnipcoophbmfpg/js/taobao.js

var TaoBao = function() {
    this.propertiesDataValue = [];
    this.getPrice = function() {
        return parseFloat($('#J_StrPrice em.tb-rmb-num')
            .text());
    }
    this.getPromotePrice = function() {
        return parseFloat($('#J_PromoPriceNum')
            .text());
    }
    this.getName = function() {
        return $('#J_Title .tb-main-title')
            .data('title');
    }
    this.getQuantity = function() {
        return $('#J_IptAmount')
            .val();
    }
    this.getUrl = function() {
        return location.href;
    }
    this.getImageUrl = function() {
        var image = $('#J_ImgBooth');
        return image.attr('src');
    }
    this.getColor = function() {
        var selectedElement = $('.J_Prop_Color .J_TSaleProp .tb-selected');
        this.propertiesDataValue.push(selectedElement.data('value'));
        return selectedElement.find('span')
            .text();
    }
    this.getSize = function() {
        var selectedElement = $('.J_Prop_measurement .J_TSaleProp .tb-selected');
        this.propertiesDataValue.push(selectedElement.data('value'));
        return selectedElement.find('span')
            .text();
    }
    this.getSKU = function() {
        var scripts = document.getElementsByTagName("script");
        propertiesDataValue = this.propertiesDataValue.join(';');
        for (var i = 0; i < scripts.length; i++) {
            var script = scripts[i];
            //if (script.innerHTML.match(/TShop\.Setup/)) {
            if (script.innerHTML.match(/Hub\.config\.set/)) {
                var innerHTML = script.innerHTML.replace(/\s/g, "");
                var skuMapString = innerHTML.substr(innerHTML.indexOf('skuMap') + 7);
                skuMapString = skuMapString.substr(0, skuMapString.indexOf('}}') + 2);
                skuMapJson = JSON.parse(skuMapString);
                var skuId = '';
                for (var key in skuMapJson) {
                    if (key == propertiesDataValue) {
                        skuId = skuMapJson[key].skuId;
                        break;
                    }
                }
                return skuId;
            }
        }
        return '';
    }
    this.getShopId = function() {
        //.tb-shop-name a
        var shopId = '';
        var anchor = $('.tb-shop-name a');
        var anchor1 = $('a.shop-name-link');

        if (anchor.length > 0) {
            var href = anchor.attr('href');
            shopId = href.split(".")[0];
            if (shopId.indexOf('//') >= 0) {
                shopId = shopId.substr(shopId.indexOf('//') + 2);
            }
        }
        if (anchor1.length > 0) {
            var href = anchor1.attr('href');
            shopId = href.split(".")[0];
            if (shopId.indexOf('//') >= 0) {
                shopId = shopId.substr(shopId.indexOf('//') + 2);
            }
        }
        return shopId;
    }

    this.getShopLink = function() {
        //.tb-shop-name a
        var shopId = '';
        var anchor = $('.tb-shop-name a');
        if (anchor.length > 0) {
            var href = anchor.attr('href');
            return href;
        }
        return shopId;
    }
    this.getProduct = function() {
        var name = this.getName(),
            url = this.getUrl(),
            imageUrl = this.getImageUrl(),
            price = this.getPrice(),
            quantity = this.getQuantity(),
            color = this.getColor(),
            size = this.getSize(),
            sku = this.getSKU(),
            shopId = this.getShopId(),
            web = 'taobao',
            shopLink = this.getShopLink();
        if (this.getPromotePrice()) {
            price = this.getPromotePrice();
        }
        var product = new Product(sku, url, name, imageUrl, price, quantity, color, size, shopId, web, shopLink);
        return product;
    }
    this.translate = function() {
    }
}
// original file:/media/data2/jianjia/extension_data/unzipped_extensions/eijpfopeaaokmegfgdgnipcoophbmfpg/js/tmall.js

var TMall = function() {
    this.SIZE_TEXT = '';
    this.COLOR_TEXT = '';
    this.COLOR_TEXT_2 = '';

    this.color = '';
    this.size = '';
    this.propertiesDataValue = [];

    this.getPrice = function() {
        return $('#J_StrPriceModBox .tm-price').text();
    }

    this.getPromotePrice = function() {
        return parseFloat($('#J_PromoPrice .tm-price').text());
    }

    this.getName = function() {
        return $('.tb-detail-hd h1').html().trim();
    }

    this.getQuantity = function() {
        return parseInt($('#J_Amount .mui-amount-input').val());
    }

    this.getUrl = function() {
        return location.href;
    }

    this.getImageUrl = function() {
        var image = $('#J_ImgBooth');
        return image.attr('src');
    }

    this.getColor = function() {
        return this.color;
    }

    this.getSize = function() {
        return this.size;
    }

    this.getProperties = function() {
        var salePropUl = $('.J_TSaleProp'),
            self = this;

        this.propertiesDataValue = [];
        salePropUl.each(function() {
            self.propertiesDataValue.push($(this).find('.tb-selected').data('value'));
            var property = $(this).data('property');
            if (property == self.SIZE_TEXT) {
                self.size = $(this).find('.tb-selected').find('span').text();
            } else if (property == self.COLOR_TEXT || property == self.COLOR_TEXT_2) {
                self.color = $(this).find('.tb-selected').find('span').text();
            }
        })
    }

    this.getSKU = function() {
        var scripts = document.getElementsByTagName("script");
            propertiesDataValue = this.propertiesDataValue.join(';');
        for (var i = 0; i < scripts.length; i++) {
            var script = scripts[i];
            if (script.innerHTML.match(/TShop\.Setup/)) {
                var innerHTML = script.innerHTML.replace(/\s/g, ""),
                    skuString = innerHTML.substr(innerHTML.indexOf(propertiesDataValue), 60),
                    skuId = skuString.substr(skuString.indexOf('skuId') + 8, 13);
                    return skuId;
            }
        }

        return '';
    }

    this.getShopId = function() {
        //.slogo-shopname
        var shopId = '';
        var anchor = $('.hd-shop-name a');
         var anchor2 = $('#shopExtra a');
        if (anchor.length > 0) {
            var href = anchor.attr('href');
            shopId = href.split(".")[0];
            if (shopId.indexOf('//') >= 0) {
                shopId = shopId.substr(shopId.indexOf('//') + 2);
            }
        }
         if (anchor2.length > 0) {
            var href = anchor2.attr('href');
            shopId = href.split(".")[0];
            if (shopId.indexOf('//') >= 0) {
                shopId = shopId.substr(shopId.indexOf('//') + 2);
            }
        }

        return shopId;
    }

    this.getShopLink = function() {
        //.slogo-shopname
        var shopId = '';
        var anchor = $('.slogo-shopname');

        if (anchor.length > 0) {
            var href = anchor.attr('href');
            return href;
        }

        return shopId;
    }

    this.getProduct = function() {
        this.getProperties();

        var name = this.getName(),
            url = this.getUrl(),
            imageUrl = this.getImageUrl(),
            price = this.getPrice(),
            quantity = this.getQuantity(),
            color = this.getColor(),
            size = this.getSize(),
            sku = this.getSKU(),
            shopId = this.getShopId(),
            web = 'tmall',
            shopLink = this.getShopLink();

        if (this.getPromotePrice()) {
            price = this.getPromotePrice();
        }
        var product = new Product(sku, url, name, imageUrl, price, quantity, color, size, shopId, web,shopLink);
        return product;
    }

    this.translate = function() {

    }

}
// original file:/media/data2/jianjia/extension_data/unzipped_extensions/eijpfopeaaokmegfgdgnipcoophbmfpg/js/alibar.js

var Alibar = function() {
    this.SIZE_TEXT = '';
    this.COLOR_TEXT = '';

    this.image = '';
    this.color = '';
    this.size = '';
    this.hasSize = false;

    this.getPrice = function(priceRanges, quantity) {

        if (typeof priceRanges.length !== 'undefined') {
            for (var i = 0; i < priceRanges.length; i++) {
                if (quantity >= parseInt(priceRanges[i].begin) && (!priceRanges[i].end || quantity <= parseInt(priceRanges[i].end))) {
                    return parseFloat(priceRanges[i].price);
                }
            }

            return priceRanges[0].price;
        } else {
            return 0;
        }
    }

    this.getPromotePrice = function() {

    }

    this.getName = function() {
        return $('#mod-detail-title .d-title').text();
    }

    this.getUrl = function() {
        return location.href;
    }

    this.getImageUrl = function() {
        var image =  $('.box-img img');
        return image.attr('src');
    }

    this.getColor = function() {
        return this.color;
    }

    this.getSize = function() {
        return this.size;
    }

    this.getProperties = function() {
        var objLeadingDiv = $('.obj-leading');
        if (objLeadingDiv.length > 0) {
            // var color = objLeadingDiv.find('a.selected').attr('title');
            var color = objLeadingDiv.find('a.selected .vertical-img-title').text();
            this.color = color ? color : '';
            var imgs =  objLeadingDiv.find('a.selected').parent().data('imgs');
            if (typeof(imgs) != 'undefined' && typeof(imgs.preview) != 'undefined') {
                this.image = imgs.preview;
            }
            this.hasSize = true;
        }
    }

    this.getOfferId = function() {
        var scripts = document.getElementsByTagName("script");
        for (var i = 0; i < scripts.length; i++) {
            var script = scripts[i];
            if (script.innerHTML.match(/var iDetailConfig/)) {
                var innerHTML = script.innerHTML.replace(/\s/g, ""),
                    offerIdString = innerHTML.substr(innerHTML.indexOf("offerid") + 10),
                    offerId = offerIdString.substr(0, offerIdString.indexOf(',') - 1);
                return offerId;
            }
        }
    }

    this.getSKU = function() {

    }

    this.getPriceTable = function() {
        var priceRanges = [],
            priceTable = $('.mod-detail-price');


        if (priceTable.find('table.has-discount').length) {
            // var range = {'begin': 1, 'end': '', 'price': 0};
            // var begin = $('.mod-detail-price .amount .value').text();
            // if (isNaN(begin.charAt(0))) {
            //     begin = begin.substr(1);
            // }
            // range.begin = parseInt(begin);
            // range.price = parseFloat($('.price-discount-sku .value').text());
            // priceRanges.push(range);
            priceTable.find('tr.price td').each(function(index) {
                var range = $(this).data('range');
                if (range) {
                    priceRanges.push(range);
                }
            });
            if (priceRanges.length === 0) {
                var range = {'begin': 1, 'end': '', 'price': 0};
                var begin = priceTable.find('.amount .value').text();
                if (isNaN(begin.charAt(0))) {
                    begin = begin.substr(1);
                }
                range.begin = parseInt(begin);
                range.price = parseFloat(priceTable.find('.price .value').text());
                // console.log(range.price);
                priceRanges.push(range);
            }

        } else if (priceTable.find('table').length) {
            priceTable.find('tr.price td').each(function(index) {
                var range = $(this).data('range');
                if (range) {
                    priceRanges.push(range);
                }
            });
            if (priceRanges.length === 0) {
                var range = {'begin': 1, 'end': '', 'price': 0};
                var begin = priceTable.find('.amount .value').text();
                if (isNaN(begin.charAt(0))) {
                    begin = begin.substr(1);
                }
                range.begin = parseInt(begin);
                range.price = parseFloat(priceTable.find('.price .value').text());
                // console.log(range.price);
                priceRanges.push(range);
            }
            // console.log("true1");
            // console.log(priceRanges);
        } 
        // else {
        //     var range = {'begin': 0, 'end': '', 'price': 0};
        //     if ($('.mod-detail-info-minimum .obj-amount').length) {
        //         range.begin = parseInt($('.mod-detail-info-minimum .obj-amount').text());
        //     } else {
        //         range.begin = 1;
        //     }

        //     if ($('.price-now').length) {
        //         range.price = parseFloat($('.price-now').html());
        //     } else {
        //         range.price = 0;
        //     }
        //     priceRanges.push(range);
        //      console.log("true2");
        // }

        if (priceRanges.length === 0) {
            priceRanges.push({'begin': 1, 'end': '', 'price': 0});
        }
        return priceRanges;
    }

    this.getAmountInputs = function () {
        var self = this,
            result = {
                totalQuantity: 0,
                isGetPriceRangeQuantity:1,
                inputs: []
            },
            amountInputs = $('.obj-sku .amount-input');

        if (amountInputs.length === 0) {
            amountInputs = $('.obj-amount .amount-input');
        }
        amountInputs.each(function() {

            var amountInputsValue = $(this).val();

            if (amountInputsValue > 0) {
                result.totalQuantity += parseInt(amountInputsValue);
                var images = $(this).parents('tr').find('td.name span.image').data('imgs');
                var image = '';
                if (typeof(images) !== 'undefined' && typeof(images.preview) !== 'undefined') {
                    image = images.preview;
                } else {
                    image = '';
                }

                // price: trng hp gi khc nhau ty theo thuc tnh
                var new_price=0;
                if($(this).parents('tr').find('td.price .value').length>0){
                    new_price = $(this).parents('tr').find('td.price .value').text();
                   result.isGetPriceRangeQuantity=0;
                }
                // end price
                var skuConfig = $(this).parents('tr').data('sku-config');
                var sku = '';
                if (skuConfig && typeof(skuConfig.skuName) !== 'undefined') {
                    sku = skuConfig.skuName;
                }
                if (sku === '') {
                    sku = $(this).parents('tr').find('td.name span.image').data('title');
                }
                result.inputs.push({image: image,price:new_price, sku: sku, quantity: parseInt(amountInputsValue) });

            }
        });
        // console.log(result);
        return result;
    }

    this.getShopId = function() {
        //.shop-info .base-info a
        //.companyName-box .logo a
        var shopId = '';
        var anchor = $('.companyName-box .logo a');
        if (anchor.length === 0) {
            anchor = $('.shop-info .base-info a');
        }

        if (anchor.length > 0) {
            var href = anchor.attr('href');
            shopId = href.split(".")[0].split("https://")[1];
        }

        return shopId;
    }

    this.getShopLink = function() {
        //.shop-info .base-info a
        //.companyName-box .logo a
        var shopId = '';
        var anchor = $('.companyName-box .logo a');
        if (anchor.length === 0) {
            anchor = $('.shop-info .base-info a');
        }

        if (anchor.length > 0) {
            var href = anchor.attr('href');
            return href;
        }

        return shopId;
    }

    this.getProducts = function() {
        this.getProperties();
        var amountInputs = this.getAmountInputs();
        var priceRanges =0;
        var  priceRangeQuantity=0;
        if (amountInputs.inputs.length) {
           if(amountInputs.isGetPriceRangeQuantity==1){
                // nu trng hp gi ly theo khung s lng
                priceRanges = this.getPriceTable();
                priceRangeQuantity = this.getPrice(priceRanges, amountInputs.totalQuantity);
            }
            // var minQuantity = parseInt(priceRanges[0].begin);
            // for (var i = 1; i < priceRanges.length; i++) {
            //     if (parseInt(priceRanges[i].begin) < minQuantity) {
            //         minQuantity = parseInt(priceRanges[i].begin);
            //     }
            // }
            //if (amountInputs.totalQuantity >= minQuantity) {
               
                var price='',
                    url = this.getUrl(),
                    name = this.getName(),
                    color = this.getColor(),
                    size = '',
                    imageUrl = '',
                    offerId = this.getOfferId(),
                    shopId = this.getShopId(),
                    shopLink = this.getShopLink(),
                    products = [];

                for (var i = 0; i < amountInputs.inputs.length; i++) {
                    var sku = offerId;
                    if (this.hasSize) {
                        sku += ':' + color + ';' + amountInputs.inputs[i].sku;
                        size = amountInputs.inputs[i].sku;
                    } else {
                        sku += ':' + amountInputs.inputs[i].sku;
                        color = amountInputs.inputs[i].sku;
                    }

                    if (amountInputs.inputs[i].image != '') {
                        imageUrl = amountInputs.inputs[i].image;
                    } else {
                        imageUrl = this.image;
                    }
                    if (imageUrl == '') {
                        imageUrl = this.getImageUrl();
                    }

                    if(amountInputs.isGetPriceRangeQuantity==1){
                        price=priceRangeQuantity;
                    }else {
                        if (amountInputs.inputs[i].price != '') {
                            price = amountInputs.inputs[i].price;
                        } 
                    }

                    var quantity = amountInputs.inputs[i].quantity;
                    var product = new Product(sku, url, name, imageUrl, price, quantity, color, size, shopId, '1688', shopLink);
                    products.push(product);

                }
                return products;
            //} else {
            //    alert('S lng sn phm t nht l ' + minQuantity);
            //    return null;
            //}

        } else {
            alert('Xin hy chn s lng sn phm');
            return null;
        }
    }


    this.translate = function() {

    }



}

// c khuyn mi hay khng
// 1688 c 2 loi:
// gi theo s lng =>cn tnh tng s lng ri p theo khong gi
// gi theo thuc tnh =>ly gi theo tng sn phm
// original file:/media/data2/jianjia/extension_data/unzipped_extensions/eijpfopeaaokmegfgdgnipcoophbmfpg/js/ut.js

var UT = function() {

    // this.formTemplate = '<div id="order88" class="ut-wrapper" >' +
    //     '<div class="ut-info">' +
    //     '<div class="ut-hotline">' +
    //     '<p>Gi ban: <span class="currency-item" id="price-product">0 </span>VN' +
    //     '</br>Ti gia: <span class="currency-item" id="exchange-rate"></span> VN/ </p>' +
    //     '</div>' +
    //     '</div>' +
    //     '<div class="ut-cart">' +
    //     '<div>' +
    //     '<span id="order88_cart_size"></span>' +
    //     '<span id="order88_cart_size2"></span>' +
    //     '</div>' +
    //     '</div>' +
    //     '<div class="order88-buttons">' +
    //     '<button id="ut-addToCart" type="button">Thm vo gi</button>' +
    //     '<a id="ut-goToCart" target="_blank" href="'+HOST+'/user/cart">Vo gi hng</a>' +
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
                
                '<span class="txt_rate_exchange">T gia: <span class="currency-item" id="exchange-rate">'+formatCurrency(price_extrade)+'</span> VN/ </span></p>' +
                '</li>'+
                '<li>'+
                '<input type="text" id="note-cart-item-qc" placeholder="Ghi ch..." style=" border: 1px solid #fff; font-size: 15px; border-radius: 5px; padding: 5px;">' +
                '</li>'+
                '<li>'+
                
                '<button id="ut-addToCart" type="button"><span class="ut-cart"></span> Thm vo gi</button>' +
                '</li>'+
                '<li>'+
                '<a id="ut-goToCart" target="_blank" href="'+HOST+'/gio-hang-extension">Vo gi hng</a>' +
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
                // ln u thit lp mng pro
                 chrome.storage.sync.set({"json_pro": items},function(data){
                    console.log("ln u");
                    console.log(items);
                    
                });
            }else {
                // ln sau gn cc item mi vo
                for (var i = 0; i < obj_json_pro.length; i++) {
                    items.push(obj_json_pro[i]);
                }
                chrome.storage.sync.set({"json_pro": items},function(data){
                    console.log("ln sau");
                    console.log(items);
                    
                });
            }
         });


       $('body')
                    .append('<div id="myModalPopup" class="modal-popup" style="display:block;">' +
                        '<div class="modal-content-popup">' +
                        '<p>Thm mi sn phm thnh cng!</p>'+
                         '<p style="font-size:24px;margin-bottom:15px">Tng tin hng: '+formatCurrency(total_cny*price_extrade)+' VN'+
                         '</p>'+
                         '<div style="text-align:center">'+
                        '<a class="btn btn-primary btn_popup" target="_blank" href="'+HOST+'/gio-hang-extension">Vo gi hng</a>  ' +
                        '<a class="btn btn-success btn_popup" onclick="dissmissModalQc()">Tip tc mua hng</a>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '<script type="text/javascript">function dissmissModalQc() {document.getElementById("myModalPopup").remove();}</script>');
        }

}
function formatCurrency($number = 0) {
    return numeral($number).format('0,0');
}
// original file:/media/data2/jianjia/extension_data/unzipped_extensions/eijpfopeaaokmegfgdgnipcoophbmfpg/js/script.js

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
            // sendResponse({code: 205, message: 'Vui lng ng nhp  thc hin mua hng!'});
        }
    });


    // khi vo trang gi hng
    var url = window.location.href;
    if (url.indexOf('https://') === 0) {
        url = url.replace('https://', '');
    } else {
        url = url.replace('http://', '');
    }
    var segments = url.split('/');
    var host_home=segments[0];
    var sub_host=segments[1];
    
    // thm vo gi hng
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
                                // alert("Thm mi thnh cng");
                                // location.reload(true);
                                window.location.href=HOST+"/gio-hang-extension";
                            });  
                         }
                    },
                    error:function (err) {
                        sendResponse({code: 205, message: 'Vui lng ng nhp  thc hin mua hng!'});
                    }
                });
             }
        });
    }
    

});

// original file:/media/data2/jianjia/extension_data/unzipped_extensions/eijpfopeaaokmegfgdgnipcoophbmfpg/js/numeral.js

/*! @preserve
 * numeral.js
 * version : 2.0.6
 * author : Adam Draper
 * license : MIT
 * http://adamwdraper.github.com/Numeral-js/
 */

(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        global.numeral = factory();
    }
}(this, function () {
    /************************************
        Variables
    ************************************/

    var numeral,
        _,
        VERSION = '2.0.6',
        formats = {},
        locales = {},
        defaults = {
            currentLocale: 'en',
            zeroFormat: null,
            nullFormat: null,
            defaultFormat: '0,0',
            scalePercentBy100: true
        },
        options = {
            currentLocale: defaults.currentLocale,
            zeroFormat: defaults.zeroFormat,
            nullFormat: defaults.nullFormat,
            defaultFormat: defaults.defaultFormat,
            scalePercentBy100: defaults.scalePercentBy100
        };


    /************************************
        Constructors
    ************************************/

    // Numeral prototype object
    function Numeral(input, number) {
        this._input = input;

        this._value = number;
    }

    numeral = function(input) {
        var value,
            kind,
            unformatFunction,
            regexp;

        if (numeral.isNumeral(input)) {
            value = input.value();
        } else if (input === 0 || typeof input === 'undefined') {
            value = 0;
        } else if (input === null || _.isNaN(input)) {
            value = null;
        } else if (typeof input === 'string') {
            if (options.zeroFormat && input === options.zeroFormat) {
                value = 0;
            } else if (options.nullFormat && input === options.nullFormat || !input.replace(/[^0-9]+/g, '').length) {
                value = null;
            } else {
                for (kind in formats) {
                    regexp = typeof formats[kind].regexps.unformat === 'function' ? formats[kind].regexps.unformat() : formats[kind].regexps.unformat;

                    if (regexp && input.match(regexp)) {
                        unformatFunction = formats[kind].unformat;

                        break;
                    }
                }

                unformatFunction = unformatFunction || numeral._.stringToNumber;

                value = unformatFunction(input);
            }
        } else {
            value = Number(input)|| null;
        }

        return new Numeral(input, value);
    };

    // version number
    numeral.version = VERSION;

    // compare numeral object
    numeral.isNumeral = function(obj) {
        return obj instanceof Numeral;
    };

    // helper functions
    numeral._ = _ = {
        // formats numbers separators, decimals places, signs, abbreviations
        numberToFormat: function(value, format, roundingFunction) {
            var locale = locales[numeral.options.currentLocale],
                negP = false,
                optDec = false,
                leadingCount = 0,
                abbr = '',
                trillion = 1000000000000,
                billion = 1000000000,
                million = 1000000,
                thousand = 1000,
                decimal = '',
                neg = false,
                abbrForce, // force abbreviation
                abs,
                min,
                max,
                power,
                int,
                precision,
                signed,
                thousands,
                output;

            // make sure we never format a null value
            value = value || 0;

            abs = Math.abs(value);

            // see if we should use parentheses for negative number or if we should prefix with a sign
            // if both are present we default to parentheses
            if (numeral._.includes(format, '(')) {
                negP = true;
                format = format.replace(/[\(|\)]/g, '');
            } else if (numeral._.includes(format, '+') || numeral._.includes(format, '-')) {
                signed = numeral._.includes(format, '+') ? format.indexOf('+') : value < 0 ? format.indexOf('-') : -1;
                format = format.replace(/[\+|\-]/g, '');
            }

            // see if abbreviation is wanted
            if (numeral._.includes(format, 'a')) {
                abbrForce = format.match(/a(k|m|b|t)?/);

                abbrForce = abbrForce ? abbrForce[1] : false;

                // check for space before abbreviation
                if (numeral._.includes(format, ' a')) {
                    abbr = ' ';
                }

                format = format.replace(new RegExp(abbr + 'a[kmbt]?'), '');

                if (abs >= trillion && !abbrForce || abbrForce === 't') {
                    // trillion
                    abbr += locale.abbreviations.trillion;
                    value = value / trillion;
                } else if (abs < trillion && abs >= billion && !abbrForce || abbrForce === 'b') {
                    // billion
                    abbr += locale.abbreviations.billion;
                    value = value / billion;
                } else if (abs < billion && abs >= million && !abbrForce || abbrForce === 'm') {
                    // million
                    abbr += locale.abbreviations.million;
                    value = value / million;
                } else if (abs < million && abs >= thousand && !abbrForce || abbrForce === 'k') {
                    // thousand
                    abbr += locale.abbreviations.thousand;
                    value = value / thousand;
                }
            }

            // check for optional decimals
            if (numeral._.includes(format, '[.]')) {
                optDec = true;
                format = format.replace('[.]', '.');
            }

            // break number and format
            int = value.toString().split('.')[0];
            precision = format.split('.')[1];
            thousands = format.indexOf(',');
            leadingCount = (format.split('.')[0].split(',')[0].match(/0/g) || []).length;

            if (precision) {
                if (numeral._.includes(precision, '[')) {
                    precision = precision.replace(']', '');
                    precision = precision.split('[');
                    decimal = numeral._.toFixed(value, (precision[0].length + precision[1].length), roundingFunction, precision[1].length);
                } else {
                    decimal = numeral._.toFixed(value, precision.length, roundingFunction);
                }

                int = decimal.split('.')[0];

                if (numeral._.includes(decimal, '.')) {
                    decimal = locale.delimiters.decimal + decimal.split('.')[1];
                } else {
                    decimal = '';
                }

                if (optDec && Number(decimal.slice(1)) === 0) {
                    decimal = '';
                }
            } else {
                int = numeral._.toFixed(value, 0, roundingFunction);
            }

            // check abbreviation again after rounding
            if (abbr && !abbrForce && Number(int) >= 1000 && abbr !== locale.abbreviations.trillion) {
                int = String(Number(int) / 1000);

                switch (abbr) {
                    case locale.abbreviations.thousand:
                        abbr = locale.abbreviations.million;
                        break;
                    case locale.abbreviations.million:
                        abbr = locale.abbreviations.billion;
                        break;
                    case locale.abbreviations.billion:
                        abbr = locale.abbreviations.trillion;
                        break;
                }
            }


            // format number
            if (numeral._.includes(int, '-')) {
                int = int.slice(1);
                neg = true;
            }

            if (int.length < leadingCount) {
                for (var i = leadingCount - int.length; i > 0; i--) {
                    int = '0' + int;
                }
            }

            if (thousands > -1) {
                int = int.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1' + locale.delimiters.thousands);
            }

            if (format.indexOf('.') === 0) {
                int = '';
            }

            output = int + decimal + (abbr ? abbr : '');

            if (negP) {
                output = (negP && neg ? '(' : '') + output + (negP && neg ? ')' : '');
            } else {
                if (signed >= 0) {
                    output = signed === 0 ? (neg ? '-' : '+') + output : output + (neg ? '-' : '+');
                } else if (neg) {
                    output = '-' + output;
                }
            }

            return output;
        },
        // unformats numbers separators, decimals places, signs, abbreviations
        stringToNumber: function(string) {
            var locale = locales[options.currentLocale],
                stringOriginal = string,
                abbreviations = {
                    thousand: 3,
                    million: 6,
                    billion: 9,
                    trillion: 12
                },
                abbreviation,
                value,
                i,
                regexp;

            if (options.zeroFormat && string === options.zeroFormat) {
                value = 0;
            } else if (options.nullFormat && string === options.nullFormat || !string.replace(/[^0-9]+/g, '').length) {
                value = null;
            } else {
                value = 1;

                if (locale.delimiters.decimal !== '.') {
                    string = string.replace(/\./g, '').replace(locale.delimiters.decimal, '.');
                }

                for (abbreviation in abbreviations) {
                    regexp = new RegExp('[^a-zA-Z]' + locale.abbreviations[abbreviation] + '(?:\\)|(\\' + locale.currency.symbol + ')?(?:\\))?)?$');

                    if (stringOriginal.match(regexp)) {
                        value *= Math.pow(10, abbreviations[abbreviation]);
                        break;
                    }
                }

                // check for negative number
                value *= (string.split('-').length + Math.min(string.split('(').length - 1, string.split(')').length - 1)) % 2 ? 1 : -1;

                // remove non numbers
                string = string.replace(/[^0-9\.]+/g, '');

                value *= Number(string);
            }

            return value;
        },
        isNaN: function(value) {
            return typeof value === 'number' && isNaN(value);
        },
        includes: function(string, search) {
            return string.indexOf(search) !== -1;
        },
        insert: function(string, subString, start) {
            return string.slice(0, start) + subString + string.slice(start);
        },
        reduce: function(array, callback /*, initialValue*/) {
            if (this === null) {
                throw new TypeError('Array.prototype.reduce called on null or undefined');
            }

            if (typeof callback !== 'function') {
                throw new TypeError(callback + ' is not a function');
            }

            var t = Object(array),
                len = t.length >>> 0,
                k = 0,
                value;

            if (arguments.length === 3) {
                value = arguments[2];
            } else {
                while (k < len && !(k in t)) {
                    k++;
                }

                if (k >= len) {
                    throw new TypeError('Reduce of empty array with no initial value');
                }

                value = t[k++];
            }
            for (; k < len; k++) {
                if (k in t) {
                    value = callback(value, t[k], k, t);
                }
            }
            return value;
        },
        /**
         * Computes the multiplier necessary to make x >= 1,
         * effectively eliminating miscalculations caused by
         * finite precision.
         */
        multiplier: function (x) {
            var parts = x.toString().split('.');

            return parts.length < 2 ? 1 : Math.pow(10, parts[1].length);
        },
        /**
         * Given a variable number of arguments, returns the maximum
         * multiplier that must be used to normalize an operation involving
         * all of them.
         */
        correctionFactor: function () {
            var args = Array.prototype.slice.call(arguments);

            return args.reduce(function(accum, next) {
                var mn = _.multiplier(next);
                return accum > mn ? accum : mn;
            }, 1);
        },
        /**
         * Implementation of toFixed() that treats floats more like decimals
         *
         * Fixes binary rounding issues (eg. (0.615).toFixed(2) === '0.61') that present
         * problems for accounting- and finance-related software.
         */
        toFixed: function(value, maxDecimals, roundingFunction, optionals) {
            var splitValue = value.toString().split('.'),
                minDecimals = maxDecimals - (optionals || 0),
                boundedPrecision,
                optionalsRegExp,
                power,
                output;

            // Use the smallest precision value possible to avoid errors from floating point representation
            if (splitValue.length === 2) {
              boundedPrecision = Math.min(Math.max(splitValue[1].length, minDecimals), maxDecimals);
            } else {
              boundedPrecision = minDecimals;
            }

            power = Math.pow(10, boundedPrecision);

            // Multiply up by precision, round accurately, then divide and use native toFixed():
            output = (roundingFunction(value + 'e+' + boundedPrecision) / power).toFixed(boundedPrecision);

            if (optionals > maxDecimals - boundedPrecision) {
                optionalsRegExp = new RegExp('\\.?0{1,' + (optionals - (maxDecimals - boundedPrecision)) + '}$');
                output = output.replace(optionalsRegExp, '');
            }

            return output;
        }
    };

    // avaliable options
    numeral.options = options;

    // avaliable formats
    numeral.formats = formats;

    // avaliable formats
    numeral.locales = locales;

    // This function sets the current locale.  If
    // no arguments are passed in, it will simply return the current global
    // locale key.
    numeral.locale = function(key) {
        if (key) {
            options.currentLocale = key.toLowerCase();
        }

        return options.currentLocale;
    };

    // This function provides access to the loaded locale data.  If
    // no arguments are passed in, it will simply return the current
    // global locale object.
    numeral.localeData = function(key) {
        if (!key) {
            return locales[options.currentLocale];
        }

        key = key.toLowerCase();

        if (!locales[key]) {
            throw new Error('Unknown locale : ' + key);
        }

        return locales[key];
    };

    numeral.reset = function() {
        for (var property in defaults) {
            options[property] = defaults[property];
        }
    };

    numeral.zeroFormat = function(format) {
        options.zeroFormat = typeof(format) === 'string' ? format : null;
    };

    numeral.nullFormat = function (format) {
        options.nullFormat = typeof(format) === 'string' ? format : null;
    };

    numeral.defaultFormat = function(format) {
        options.defaultFormat = typeof(format) === 'string' ? format : '0.0';
    };

    numeral.register = function(type, name, format) {
        name = name.toLowerCase();

        if (this[type + 's'][name]) {
            throw new TypeError(name + ' ' + type + ' already registered.');
        }

        this[type + 's'][name] = format;

        return format;
    };


    numeral.validate = function(val, culture) {
        var _decimalSep,
            _thousandSep,
            _currSymbol,
            _valArray,
            _abbrObj,
            _thousandRegEx,
            localeData,
            temp;

        //coerce val to string
        if (typeof val !== 'string') {
            val += '';

            if (console.warn) {
                console.warn('Numeral.js: Value is not string. It has been co-erced to: ', val);
            }
        }

        //trim whitespaces from either sides
        val = val.trim();

        //if val is just digits return true
        if (!!val.match(/^\d+$/)) {
            return true;
        }

        //if val is empty return false
        if (val === '') {
            return false;
        }

        //get the decimal and thousands separator from numeral.localeData
        try {
            //check if the culture is understood by numeral. if not, default it to current locale
            localeData = numeral.localeData(culture);
        } catch (e) {
            localeData = numeral.localeData(numeral.locale());
        }

        //setup the delimiters and currency symbol based on culture/locale
        _currSymbol = localeData.currency.symbol;
        _abbrObj = localeData.abbreviations;
        _decimalSep = localeData.delimiters.decimal;
        if (localeData.delimiters.thousands === '.') {
            _thousandSep = '\\.';
        } else {
            _thousandSep = localeData.delimiters.thousands;
        }

        // validating currency symbol
        temp = val.match(/^[^\d]+/);
        if (temp !== null) {
            val = val.substr(1);
            if (temp[0] !== _currSymbol) {
                return false;
            }
        }

        //validating abbreviation symbol
        temp = val.match(/[^\d]+$/);
        if (temp !== null) {
            val = val.slice(0, -1);
            if (temp[0] !== _abbrObj.thousand && temp[0] !== _abbrObj.million && temp[0] !== _abbrObj.billion && temp[0] !== _abbrObj.trillion) {
                return false;
            }
        }

        _thousandRegEx = new RegExp(_thousandSep + '{2}');

        if (!val.match(/[^\d.,]/g)) {
            _valArray = val.split(_decimalSep);
            if (_valArray.length > 2) {
                return false;
            } else {
                if (_valArray.length < 2) {
                    return ( !! _valArray[0].match(/^\d+.*\d$/) && !_valArray[0].match(_thousandRegEx));
                } else {
                    if (_valArray[0].length === 1) {
                        return ( !! _valArray[0].match(/^\d+$/) && !_valArray[0].match(_thousandRegEx) && !! _valArray[1].match(/^\d+$/));
                    } else {
                        return ( !! _valArray[0].match(/^\d+.*\d$/) && !_valArray[0].match(_thousandRegEx) && !! _valArray[1].match(/^\d+$/));
                    }
                }
            }
        }

        return false;
    };


    /************************************
        Numeral Prototype
    ************************************/

    numeral.fn = Numeral.prototype = {
        clone: function() {
            return numeral(this);
        },
        format: function(inputString, roundingFunction) {
            var value = this._value,
                format = inputString || options.defaultFormat,
                kind,
                output,
                formatFunction;

            // make sure we have a roundingFunction
            roundingFunction = roundingFunction || Math.round;

            // format based on value
            if (value === 0 && options.zeroFormat !== null) {
                output = options.zeroFormat;
            } else if (value === null && options.nullFormat !== null) {
                output = options.nullFormat;
            } else {
                for (kind in formats) {
                    if (format.match(formats[kind].regexps.format)) {
                        formatFunction = formats[kind].format;

                        break;
                    }
                }

                formatFunction = formatFunction || numeral._.numberToFormat;

                output = formatFunction(value, format, roundingFunction);
            }

            return output;
        },
        value: function() {
            return this._value;
        },
        input: function() {
            return this._input;
        },
        set: function(value) {
            this._value = Number(value);

            return this;
        },
        add: function(value) {
            var corrFactor = _.correctionFactor.call(null, this._value, value);

            function cback(accum, curr, currI, O) {
                return accum + Math.round(corrFactor * curr);
            }

            this._value = _.reduce([this._value, value], cback, 0) / corrFactor;

            return this;
        },
        subtract: function(value) {
            var corrFactor = _.correctionFactor.call(null, this._value, value);

            function cback(accum, curr, currI, O) {
                return accum - Math.round(corrFactor * curr);
            }

            this._value = _.reduce([value], cback, Math.round(this._value * corrFactor)) / corrFactor;

            return this;
        },
        multiply: function(value) {
            function cback(accum, curr, currI, O) {
                var corrFactor = _.correctionFactor(accum, curr);
                return Math.round(accum * corrFactor) * Math.round(curr * corrFactor) / Math.round(corrFactor * corrFactor);
            }

            this._value = _.reduce([this._value, value], cback, 1);

            return this;
        },
        divide: function(value) {
            function cback(accum, curr, currI, O) {
                var corrFactor = _.correctionFactor(accum, curr);
                return Math.round(accum * corrFactor) / Math.round(curr * corrFactor);
            }

            this._value = _.reduce([this._value, value], cback);

            return this;
        },
        difference: function(value) {
            return Math.abs(numeral(this._value).subtract(value).value());
        }
    };

    /************************************
        Default Locale && Format
    ************************************/

    numeral.register('locale', 'en', {
        delimiters: {
            thousands: ',',
            decimal: '.'
        },
        abbreviations: {
            thousand: 'k',
            million: 'm',
            billion: 'b',
            trillion: 't'
        },
        ordinal: function(number) {
            var b = number % 10;
            return (~~(number % 100 / 10) === 1) ? 'th' :
                (b === 1) ? 'st' :
                (b === 2) ? 'nd' :
                (b === 3) ? 'rd' : 'th';
        },
        currency: {
            symbol: '$'
        }
    });

    

(function() {
        numeral.register('format', 'bps', {
            regexps: {
                format: /(BPS)/,
                unformat: /(BPS)/
            },
            format: function(value, format, roundingFunction) {
                var space = numeral._.includes(format, ' BPS') ? ' ' : '',
                    output;

                value = value * 10000;

                // check for space before BPS
                format = format.replace(/\s?BPS/, '');

                output = numeral._.numberToFormat(value, format, roundingFunction);

                if (numeral._.includes(output, ')')) {
                    output = output.split('');

                    output.splice(-1, 0, space + 'BPS');

                    output = output.join('');
                } else {
                    output = output + space + 'BPS';
                }

                return output;
            },
            unformat: function(string) {
                return +(numeral._.stringToNumber(string) * 0.0001).toFixed(15);
            }
        });
})();


(function() {
        var decimal = {
            base: 1000,
            suffixes: ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
        },
        binary = {
            base: 1024,
            suffixes: ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']
        };

    var allSuffixes =  decimal.suffixes.concat(binary.suffixes.filter(function (item) {
            return decimal.suffixes.indexOf(item) < 0;
        }));
        var unformatRegex = allSuffixes.join('|');
        // Allow support for BPS (http://www.investopedia.com/terms/b/basispoint.asp)
        unformatRegex = '(' + unformatRegex.replace('B', 'B(?!PS)') + ')';

    numeral.register('format', 'bytes', {
        regexps: {
            format: /([0\s]i?b)/,
            unformat: new RegExp(unformatRegex)
        },
        format: function(value, format, roundingFunction) {
            var output,
                bytes = numeral._.includes(format, 'ib') ? binary : decimal,
                suffix = numeral._.includes(format, ' b') || numeral._.includes(format, ' ib') ? ' ' : '',
                power,
                min,
                max;

            // check for space before
            format = format.replace(/\s?i?b/, '');

            for (power = 0; power <= bytes.suffixes.length; power++) {
                min = Math.pow(bytes.base, power);
                max = Math.pow(bytes.base, power + 1);

                if (value === null || value === 0 || value >= min && value < max) {
                    suffix += bytes.suffixes[power];

                    if (min > 0) {
                        value = value / min;
                    }

                    break;
                }
            }

            output = numeral._.numberToFormat(value, format, roundingFunction);

            return output + suffix;
        },
        unformat: function(string) {
            var value = numeral._.stringToNumber(string),
                power,
                bytesMultiplier;

            if (value) {
                for (power = decimal.suffixes.length - 1; power >= 0; power--) {
                    if (numeral._.includes(string, decimal.suffixes[power])) {
                        bytesMultiplier = Math.pow(decimal.base, power);

                        break;
                    }

                    if (numeral._.includes(string, binary.suffixes[power])) {
                        bytesMultiplier = Math.pow(binary.base, power);

                        break;
                    }
                }

                value *= (bytesMultiplier || 1);
            }

            return value;
        }
    });
})();


(function() {
        numeral.register('format', 'currency', {
        regexps: {
            format: /(\$)/
        },
        format: function(value, format, roundingFunction) {
            var locale = numeral.locales[numeral.options.currentLocale],
                symbols = {
                    before: format.match(/^([\+|\-|\(|\s|\$]*)/)[0],
                    after: format.match(/([\+|\-|\)|\s|\$]*)$/)[0]
                },
                output,
                symbol,
                i;

            // strip format of spaces and $
            format = format.replace(/\s?\$\s?/, '');

            // format the number
            output = numeral._.numberToFormat(value, format, roundingFunction);

            // update the before and after based on value
            if (value >= 0) {
                symbols.before = symbols.before.replace(/[\-\(]/, '');
                symbols.after = symbols.after.replace(/[\-\)]/, '');
            } else if (value < 0 && (!numeral._.includes(symbols.before, '-') && !numeral._.includes(symbols.before, '('))) {
                symbols.before = '-' + symbols.before;
            }

            // loop through each before symbol
            for (i = 0; i < symbols.before.length; i++) {
                symbol = symbols.before[i];

                switch (symbol) {
                    case '$':
                        output = numeral._.insert(output, locale.currency.symbol, i);
                        break;
                    case ' ':
                        output = numeral._.insert(output, ' ', i + locale.currency.symbol.length - 1);
                        break;
                }
            }

            // loop through each after symbol
            for (i = symbols.after.length - 1; i >= 0; i--) {
                symbol = symbols.after[i];

                switch (symbol) {
                    case '$':
                        output = i === symbols.after.length - 1 ? output + locale.currency.symbol : numeral._.insert(output, locale.currency.symbol, -(symbols.after.length - (1 + i)));
                        break;
                    case ' ':
                        output = i === symbols.after.length - 1 ? output + ' ' : numeral._.insert(output, ' ', -(symbols.after.length - (1 + i) + locale.currency.symbol.length - 1));
                        break;
                }
            }


            return output;
        }
    });
})();


(function() {
        numeral.register('format', 'exponential', {
        regexps: {
            format: /(e\+|e-)/,
            unformat: /(e\+|e-)/
        },
        format: function(value, format, roundingFunction) {
            var output,
                exponential = typeof value === 'number' && !numeral._.isNaN(value) ? value.toExponential() : '0e+0',
                parts = exponential.split('e');

            format = format.replace(/e[\+|\-]{1}0/, '');

            output = numeral._.numberToFormat(Number(parts[0]), format, roundingFunction);

            return output + 'e' + parts[1];
        },
        unformat: function(string) {
            var parts = numeral._.includes(string, 'e+') ? string.split('e+') : string.split('e-'),
                value = Number(parts[0]),
                power = Number(parts[1]);

            power = numeral._.includes(string, 'e-') ? power *= -1 : power;

            function cback(accum, curr, currI, O) {
                var corrFactor = numeral._.correctionFactor(accum, curr),
                    num = (accum * corrFactor) * (curr * corrFactor) / (corrFactor * corrFactor);
                return num;
            }

            return numeral._.reduce([value, Math.pow(10, power)], cback, 1);
        }
    });
})();


(function() {
        numeral.register('format', 'ordinal', {
        regexps: {
            format: /(o)/
        },
        format: function(value, format, roundingFunction) {
            var locale = numeral.locales[numeral.options.currentLocale],
                output,
                ordinal = numeral._.includes(format, ' o') ? ' ' : '';

            // check for space before
            format = format.replace(/\s?o/, '');

            ordinal += locale.ordinal(value);

            output = numeral._.numberToFormat(value, format, roundingFunction);

            return output + ordinal;
        }
    });
})();


(function() {
        numeral.register('format', 'percentage', {
        regexps: {
            format: /(%)/,
            unformat: /(%)/
        },
        format: function(value, format, roundingFunction) {
            var space = numeral._.includes(format, ' %') ? ' ' : '',
                output;

            if (numeral.options.scalePercentBy100) {
                value = value * 100;
            }

            // check for space before %
            format = format.replace(/\s?\%/, '');

            output = numeral._.numberToFormat(value, format, roundingFunction);

            if (numeral._.includes(output, ')')) {
                output = output.split('');

                output.splice(-1, 0, space + '%');

                output = output.join('');
            } else {
                output = output + space + '%';
            }

            return output;
        },
        unformat: function(string) {
            var number = numeral._.stringToNumber(string);
            if (numeral.options.scalePercentBy100) {
                return number * 0.01;
            }
            return number;
        }
    });
})();


(function() {
        numeral.register('format', 'time', {
        regexps: {
            format: /(:)/,
            unformat: /(:)/
        },
        format: function(value, format, roundingFunction) {
            var hours = Math.floor(value / 60 / 60),
                minutes = Math.floor((value - (hours * 60 * 60)) / 60),
                seconds = Math.round(value - (hours * 60 * 60) - (minutes * 60));

            return hours + ':' + (minutes < 10 ? '0' + minutes : minutes) + ':' + (seconds < 10 ? '0' + seconds : seconds);
        },
        unformat: function(string) {
            var timeArray = string.split(':'),
                seconds = 0;

            // turn hours and minutes into seconds and add them all up
            if (timeArray.length === 3) {
                // hours
                seconds = seconds + (Number(timeArray[0]) * 60 * 60);
                // minutes
                seconds = seconds + (Number(timeArray[1]) * 60);
                // seconds
                seconds = seconds + Number(timeArray[2]);
            } else if (timeArray.length === 2) {
                // minutes
                seconds = seconds + (Number(timeArray[0]) * 60);
                // seconds
                seconds = seconds + Number(timeArray[1]);
            }
            return Number(seconds);
        }
    });
})();

return numeral;
}));

