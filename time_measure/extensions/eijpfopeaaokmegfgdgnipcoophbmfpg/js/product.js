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
            alert ('Không lấy được tên sản phẩm');
            return false;
        }

        if (this.imageUrl === '') {
            alert ('Không lấy được link ảnh của sản phẩm');
            return false;
        }

        if (this.price === '') {
            alert ('Không lấy được giá của sản phẩm');
            return false;
        }

        if (this.quantity === '') {
            alert ('Không lấy được số lượng sản phẩm');
            return false;
        }


        // if (this.shopId == '') {
        //     alert ('Không lấy được tên shop');
        //     return false;
        // }


        // if (this.color == '') {
        //     alert ('Chưa chọn màu sắc');
        //     return false;
        // }

        // if (this.size == '') {
        //     alert ('Chưa chọn size');
        //     return false;
        // }

        return true;
    }
}