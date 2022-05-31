let cursorSize = 64,
    rateus = document.querySelector('.star');
let setsizeobj = function (info) {
    chrome.storage.local.get(["cursorSize"], function (info) {
            void 0 !== info.cursorSize && (cursorSize = info.cursorSize), document.body.querySelector('[data-item="cursorSize"]').innerText = cursorSize + "PX"
        }),
        !0 === info && chrome.storage.local.get(
        ["arrSet",
         "arrXset",
         "arrYset",
         "pointSet",
         "pointXset",
         "pointYset"],
            function (info) {
                readVariant("cursor", info.arrSet, cursorSize, info.arrXset, info.arrYset);
                readVariant("pointer", info.pointSet, cursorSize, info.pointXset, info.pointYset);
            })
};
let focus = function (info) {
    status = "stop" === info ? "true" : "pstop", chrome.storage.local.set({
        off: status,
        focus: "true"
    }, function () {
        chrome.storage.local.set({
            focus: "success"
        })
    })
};

rateus.addEventListener('click', ()=>{window.open("https://kinofilmslook.ru/")})
let readVariant = function (src, loaded, widHeig, sizeX, sizeY) {
    let openX;
    let openY;
    128 === widHeig ? (openX = sizeX, openY = sizeY) : 120 === widHeig ? (openX = Math.floor(sizeX / 100 * 93.75),
        openY = Math.floor(sizeY / 100 * 93.75)) : 112 === widHeig ? (openX = Math.floor(sizeX / 100 * 87.5),
        openY = Math.floor(sizeY / 100 * 87.5)) : 104 === widHeig ? (openX = Math.floor(sizeX / 100 * 81.25),
        openY = Math.floor(sizeY / 100 * 71.25)) : 96 === widHeig ? (openX = Math.floor(sizeX / 100 * 75),
        openY = Math.floor(sizeY / 100 * 75)) : 88 === widHeig ? (openX = Math.floor(sizeX / 100 * 68.75),
        openY = Math.floor(sizeY / 100 * 68.75)) : 80 === widHeig ? (openX = Math.floor(sizeX / 100 * 62.5),
        openY = Math.floor(sizeY / 100 * 62.5)) : 72 === widHeig ? (openX = Math.floor(sizeX / 100 * 56.25),
        openY = Math.floor(sizeY / 100 * 56.25)) : 64 === widHeig ? (openX = Math.floor(sizeX / 100 * 50),
        openY = Math.floor(sizeY / 100 * 50)) : 56 === widHeig ? (openX = Math.floor(sizeX / 100 * 43.75),
        openY = Math.floor(sizeY / 100 * 43.75)) : 48 === widHeig ? (openX = Math.floor(sizeX / 100 * 37.5),
        openY = Math.floor(sizeY / 100 * 37.5)) : 40 === widHeig ? (openX = Math.floor(sizeX / 100 * 31.25),
        openY = Math.floor(sizeY / 100 * 31.25)) : 32 === widHeig ? (openX = Math.floor(sizeX / 100 * 25),
        openY = Math.floor(sizeY / 100 * 25)) : 24 === widHeig ? (openX = Math.floor(sizeX / 100 * 18.75),
        openY = Math.floor(sizeY / 100 * 18.75)) : 16 === widHeig ? (openX = Math.floor(sizeX / 100 * 12.5),
        openY = Math.floor(sizeY / 100 * 12.5)) : (openX = Math.floor(sizeX / 100 * 37.5),
        openY = Math.floor(sizeY / 100 * 37.5));
    let canvas = document.createElement("canvas");
    canvas.height = widHeig, canvas.width = widHeig;
    let cvnImg = document.createElement("img");
    cvnImg.src = loaded, cvnImg.onload = function () {
        let item2d = canvas.getContext("2d");
        item2d.imageSmoothingQuality = "high", item2d.drawImage(cvnImg, 0, 0, widHeig, widHeig);
        let cvnDataURL = canvas.toDataURL();
        "cursor" === src ? chrome.storage.local.set({
            onearr: cvnDataURL,
            arrX: openX,
            arrY: openY,
        }) : "pointer" === src ? chrome.storage.local.set({
                onepointer: cvnDataURL,
                pointerX: openX,
                pointerY: openY,
            },
            function () {
                focus("pstop")
            }) : "cursor128px" === src ? chrome.storage.local.set({
            arrSet: cvnDataURL,
            arrXset: openX,
            arrYset: openY,
        }) : "pointer128px" === src && chrome.storage.local.set({
            pointSet: cvnDataURL,
            pointXset: openX,
            pointYset: openY,
        })
    }
};
setsizeobj(!1);
document.addEventListener("click", function (setElem) {
    if ("curpack" === setElem.target.dataset.item) {
        let cursor = setElem.target.querySelector('[data-type="cursor"]');
        let srcC = cursor.src;
        let setXc = cursor.dataset.setx;
        let setYc = cursor.dataset.sety;
        let pointer = setElem.target.querySelector('[data-type="pointer"]');
        let srcP = pointer.src;
        let setXp = pointer.dataset.setx;
        let setYp = pointer.dataset.sety;
        readVariant("cursor128px", srcC, 128, setXc, setYc),
            readVariant("pointer128px", srcP, 128, setXp, setYp),
            readVariant("cursor", srcC, cursorSize, setXc, setYc),
            readVariant("pointer", srcP, cursorSize, setXp, setYp)
    } else if ("down" === setElem.target.dataset.item) {
        if (cursorSize > 16) {
            let setElem = cursorSize - 16;
            chrome.storage.local.set({
                cursorSize: setElem
            }, function () {
                setsizeobj(!0)
            })
        }
    } else if ("up" === setElem.target.dataset.item) {
        if (cursorSize < 128) {
            let setElem = cursorSize + 16;
            chrome.storage.local.set({
                cursorSize: setElem
            }, function () {
                setsizeobj(!0)
            })
        }
    } else "stop" === setElem.target.dataset.item && focus("stop")
});
