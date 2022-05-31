var Alibar = function() {
    this.SIZE_TEXT = '尺码';
    this.COLOR_TEXT = '颜色分类';

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

                // price: trường hợp giá khác nhau tùy theo thuộc tính
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
                // nếu trường hợp giá lấy theo khung số lượng
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
            //    alert('Số lượng sản phẩm ít nhất là ' + minQuantity);
            //    return null;
            //}

        } else {
            alert('Xin hãy chọn số lượng sản phẩm');
            return null;
        }
    }


    this.translate = function() {

    }



}

// có khuyến mãi hay không
// 1688 có 2 loại:
// giá theo số lượng =>cần tính tổng số lượng rồi áp theo khoảng giá
// giá theo thuộc tính =>lấy giá theo từng sản phẩm