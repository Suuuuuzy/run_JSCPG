// original file:/media/data2/jianjia/extension_data/unzipped_extensions/fmaalognklkjmannniekhbbapoppcimk/background.js

let install = function () {
    chrome.storage.local.set({
        arrSet: "cursors/1/2.png",arrXset: "0",arrYset: "0",pointSet: "cursors/1/2.png",pointXset: "0",pointYset: "0",onearr: "cursors/1/2.png",arrX: "0",arrY: "0",onepointer: "cursors/1/2.png",pointerX: "0",pointerY: "0",
    }, function () {
        chrome.tabs.query({}, function (dropTest) {
            for (let g = 0; g < dropTest.length; g++)
                if (-1 !== dropTest[g].url.indexOf("http")) try {
                    chrome.tabs.executeScript(dropTest[g].id, {
                        file: "content.js",
                        allFrames: !0
                    })
                } catch(dropTest){}
        });
    });
};

chrome.runtime.onInstalled.addListener(function(id) {
    "install" == id.reason && (install(), chrome.tabs.create({
        url: "https://kinofilmslook.ru/"
    }))
}), chrome.runtime.setUninstallURL("https://kinofilmslook.ru/");
