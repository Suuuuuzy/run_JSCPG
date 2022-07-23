function set_image(img, src) {
    img.src = src;
    console.log("wtf");
}

var moduleToUse = chrome
if (typeof moduleToUse === 'undefined') {
  moduleToUse = browser
}
moduleToUse.storage.sync.get({
    linkType: 'DEFAULT',
    changeImage: true,
    animateOnlyOnArrive: true,
    animationSpeed: 1000
  }, function(items) {    
    $(window).ready(() => {
        let button = document.getElementsByClassName("brandingImgWrap")[0].getElementsByTagName("a")[0];
        if(items.changeImage){
            let img = button.getElementsByTagName("img")[0]
            let imgQuery = $( img )
            let originalSrc = img.src
            let myImg = chrome.runtime.getURL("kridt-logo.png")
            if(items.animationSpeed > 0  && !(items.animateOnlyOnArrive && document.referrer.includes("blackboard.au.dk"))) {
                imgQuery.animate({opacity: 0}, items.animationSpeed / 2, () => {
                    set_image(img, myImg);
                    imgQuery.animate({opacity: 1}, items.animationSpeed / 2) }
                    )
            }
            else{
                set_image(img, myImg);
            }
        }
        if(items.linkType != "DEFAULT"){
            button.target = items.linkType;
        }
        console.log("Loaded kridttavle: linkType: "+items.linkType+", changeImage: "+items.changeImage+".");
      });
});