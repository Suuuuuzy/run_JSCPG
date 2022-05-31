var dump = "";

chrome.runtime.onMessage.addListener(function(request, sender) {
  if (request.action == "getSource") {
    dump += request.source + "\n\n";
  }
});

function onWindowLoad() {
  var message = document.querySelector('#message');
  chrome.tabs.executeScript(null, {
    file: "scripts/getsource.js",
    allFrames: true,
    runAt: "document_start"
  }, function() {
    if (chrome.runtime.lastError) {
      message.innerText = 'There was an error injecting script : \n' + chrome.runtime.lastError.message;
    }
    else{
      try{
        setTimeout(function(){
          var link = document.createElement('a');
          link.download = 'adsource.txt';
          var blob = new Blob([dump], {type: 'text/plain'});
          link.href = window.URL.createObjectURL(blob);
          link.click();

          chrome.tabs.captureVisibleTab(null, {format : "png"}, function(data) {
                  var content = document.createElement("canvas");
                  var image = new Image();
                  image.onload = function() {
                    var canvas = content;
                    canvas.width = image.width;
                    canvas.height = image.height;
                    var context = canvas.getContext("2d");
                    context.drawImage(image, 0, 0);

                    // save the image
                    var link = document.createElement('a');
                    link.download = "adscreenshot.png";
                    link.href = content.toDataURL();
                    link.click();
                    data = '';
                  };
                  image.src = data;
              });

          message.innerText = "A file and image have been downloaded, please attach them in an email to support alongside as much information you can provide";
        }, 1000);
      }
      catch(e){
        message.innerText = "Please take a screenshot and copy the below into a text file then attach them in an email to support alongside as much information you can provide \n\n" + dump;
      }
    }
  });
}

window.onload = onWindowLoad;
