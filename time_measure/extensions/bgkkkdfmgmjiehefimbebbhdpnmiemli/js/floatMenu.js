let wrapper = document.querySelector('.wrapper'),
    list = document.querySelector('.list'),
    listAll = document.querySelectorAll('.list > li'),
    scrollRight = document.querySelector('.scroller-right'),
    scrollLeft = document.querySelector('.scroller-left'),
    fluidContainer = document.querySelector('.container-fluid'),
    first = 0,
    capacity = 2,

    widthOflist = function () {
        var itemsWidth = 0;
        listAll.forEach(function (item) {
            itemsWidth += item.offsetWidth;
        });
        return itemsWidth;
    },
    widthOfElementInList = function () {
        return 40 + Math.ceil(widthOflist() / (listAll.length));
    },

    capacityChange = function () {
        capacity = Math.ceil((list.offsetWidth) / widthOfElementInList());
        renderList();

    },

    scrollerHide = function () {

        listAll[listAll.length - 1].style.display == 'none' ? scrollRight.style.display = 'inline-block' : scrollRight.style.display = 'none';
        first > 0 ? scrollLeft.style.display = 'inline-block' : scrollLeft.style.display = 'none';
    },

    renderList = function () {
        let c = 0,
            cap = capacity;
        for (i = 0; i < listAll.length; i++) {
            if (i >= first && c < cap) {
                listAll[i].style.display = "table-cell";
                c++;
            } else {
                listAll[i].style.display = "none";

            };

        };
        scrollerHide();
    };


window.onresize = function (e) {
    capacityChange();

}

capacityChange();
renderList();

scrollLeft.addEventListener('click', function () {
    first -= 1;
    renderList();
});
scrollRight.addEventListener('click', function () {
    first += 1;
    renderList();
});
