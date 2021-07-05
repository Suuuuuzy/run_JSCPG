// works!
// chrome.runtime.sendMessage({greeting: "hello"}, function(response) {
//   console.log('i am content');
//   console.log(response.farewell);
// });


chrome.runtime.sendMessage("cefodghgahhgomabocmlodpkldhkhipl", {regard:"thumbnails", issue:"getAll"}, function(msg){console.log(msg)})





// works!
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log('hw');
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    if (request.greeting == "hello from background"){
        sendResponse({farewell: "goodbye from content"});
        console.log(request.pic);
        var w=document.documentElement.clientWidth;
        var h=document.documentElement.clientHeight;
        // console.log(w.toString() + "px", h);
        if (request.pic){
            var element = document.getElementById("tanNabbing-overlay");
            if (element){
                element.parentNode.removeChild(element);
            }
            var element = document.getElementById("tanNabbing-overlay-img");
            if (element){
                element.parentNode.removeChild(element);
            }
            const newDiv = document.createElement("div"); 
            newDiv.id = 'tanNabbing-overlay';
            // newDiv.style.backgroundColor = "rgba(201, 76, 76, 0.3)";
            newDiv.style.width = w.toString() + "px";
            newDiv.style.height = h.toString() + "px";
            var pic_height = h.toString() + "px";
            newDiv.style.position = "fixed";
            newDiv.style.top = "0px";
            newDiv.style.left = "0px";
            newDiv.style.zIndex = "9999";
            newDiv.style.pointerEvents = "none";
            newDiv.style.backgroundImage = "url(" + request.pic + ")";
            newDiv.style.backgroundSize = "cover";
            document.body.appendChild(newDiv);

            // var x = document.createElement("IMG");
            // x.id = "tanNabbing-overlay-img";
            // x.src = request.pic;
            // // x.height = "50%";
            // newDiv.appendChild(x);
        }
    }
    else if(request.greeting == "stop overlay"){
        sendResponse({farewell: "stopped, goodbye from content"});
        var element = document.getElementById("tanNabbing-overlay");
        if (element){
            element.parentNode.removeChild(element);
        }
        var element = document.getElementById("tanNabbing-overlay-img");
        if (element){
            element.parentNode.removeChild(element);
        }
    }
});
