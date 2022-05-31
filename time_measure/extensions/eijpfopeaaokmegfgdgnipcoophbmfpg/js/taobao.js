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