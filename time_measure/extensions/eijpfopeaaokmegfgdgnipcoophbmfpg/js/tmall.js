var TMall = function() {
    this.SIZE_TEXT = '尺码';
    this.COLOR_TEXT = '颜色分类';
    this.COLOR_TEXT_2 = '颜色';

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