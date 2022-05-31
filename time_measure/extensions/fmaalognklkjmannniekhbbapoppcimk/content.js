let arrow = "html,body,";
let pointer = 'a,input[type="submit"],nim-dialog,button,input[type="image"],[type="*"],.button,label[for],select,button,[role="button"],.pointer,.off,.btn,.ui_rmenu_contacts';
let arrowX;
let arrowY;
let pointerX;
let pointerY;
let styleElemen;
let Off;
let arrowHref;
let pointerHref;
let fnClient = function (info) {
    try {
        getSet(document.elementFromPoint(e.clientX, e.clientY)),
            getSet(document.elementFromPoint(e.clientX + 10, e.clientY + 10)),
            getSet(document.elementFromPoint(e.clientX - 10, e.clientY - 10))
    } catch (info) { }
};
let openSet = function (infoVar) {
    let getReadyst = arrow + ".arrow { cursor: url(" + arrowHref + ") " + arrowX + " " + arrowY + ", default !important; } " + pointer + ".pointer { cursor: url(" + pointerHref + ") " + pointerX + " " + pointerY + ", pointer !important; }";

    "create" === infoVar ? styleElemen ? styleElemen.innerHTML = getReadyst : ((styleElemen = document.createElement("style")).rel = "stylesheet", styleElemen.innerHTML = getReadyst, document.head.appendChild(styleElemen)) : "remove" === infoVar && (styleElemen.innerHTML = "")
};
let getSet = function (get) {
    let getComputed = getComputedStyle(get).cursor;
    if ("pointer" === getComputed || "default" === getComputed || "auto" === getComputed) {
        let clList = get.classList;
        let ndName = get.nodeName;
        let stylArr = get.style.cursor;
        if (0 !== clList.length && "" === stylArr) {
            let getNode = ndName;
            for (let i of clList) {
                getNode += "." + clList[i];
                "arrow" === i ? arrow += getNode + "," : pointer += getNode + ",", openSet("create")
            }
        }
    }
};
let Launch = function () {
    chrome.storage.local.get(
        ["off",
            "onearr",
            "arrX",
            "arrY",
            "onepointer",
            "pointerX",
            "pointerY"],
        function (lot) {
            Off = lot.off,
                arrowHref = lot.onearr,
                arrowX = lot.arrX,
                arrowY = lot.arrY,
                pointerHref = lot.onepointer,
                pointerX = lot.pointerX,
                pointerY = lot.pointerY,
                void 0 !== arrowHref && "true" !== Off && (openSet("create"), document.addEventListener("mousemove", fnClient))
        })
};
let stop = function () {
    document.removeEventListener("mousemove", fnClient), openSet("remove")
};
chrome.storage.onChanged.addListener(function (item, floItem) {
    for (let key in item) floItem + "_" + key == "local_focus" ? "true" === item[key].newValue && Launch() : floItem + "_" + key == "local_off" && ("true" === item[key].newValue ? stop() : "false" === item[key].newValue && Launch())
}), "loading" === document.readyState ? document.addEventListener("DOMContentLoaded", Launch) : Launch();
