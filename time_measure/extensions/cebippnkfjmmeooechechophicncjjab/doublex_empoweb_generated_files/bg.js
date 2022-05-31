// original file:/media/data2/jianjia/extension_data/unzipped_extensions/cebippnkfjmmeooechechophicncjjab/background.js

/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/background.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/DomainBlock.ts":
/*!****************************!*\
  !*** ./src/DomainBlock.ts ***!
  \****************************/
/*! exports provided: DomainBlock, LiveHttpLogger */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DomainBlock", function() { return DomainBlock; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LiveHttpLogger", function() { return LiveHttpLogger; });
/* harmony import */ var _lib_WebExtensions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lib/WebExtensions */ "./src/lib/WebExtensions.ts");
/* harmony import */ var _lib_WebExtensions__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_lib_WebExtensions__WEBPACK_IMPORTED_MODULE_0__);

var DomainBlock = /** @class */ (function () {
    function DomainBlock() {
        var _this = this;
        this.lastClick = 0;
        this.callbackval = { cancel: true };
        this.blockingFunc = function (details) {
            return _this.callbackval;
        };
        this.list = [];
        this.load(function () {
            _this.enable();
        });
    }
    DomainBlock.prototype.toggle = function () {
        if (this.isEnable()) {
            this.disable();
        }
        else {
            this.enable();
        }
        if (this.lastClick + 1000 > (new Date()).getTime()) {
            browser.tabs.create({
                url: browser.runtime.getURL("options.html")
            });
        }
        this.lastClick = (new Date()).getTime();
    };
    DomainBlock.prototype.getList = function () {
        return this.list.concat();
    };
    DomainBlock.prototype.reset = function () {
        this.list = [];
    };
    DomainBlock.prototype.append = function (domains) {
        var alllist = this.list.concat(domains);
        var newlist = [];
        for (var i = 0; i < alllist.length; i++) {
            if (alllist[i] === "")
                continue;
            var j = 0;
            for (j = 0; j < newlist.length; j++) {
                if (alllist[i] === newlist[j])
                    break;
            }
            if (j == newlist.length)
                newlist.push(alllist[i]);
        }
        this.list = newlist;
    };
    DomainBlock.prototype.remove = function (domains) {
        var newlist = [];
        for (var i = 0; i < this.list.length; i++) {
            var j = 0;
            for (j = 0; j < domains.length; j++) {
                if (this.list[i] === domains[j])
                    break;
            }
            if (j == domains.length)
                newlist.push(this.list[i]);
        }
        this.list = newlist;
    };
    DomainBlock.prototype.load = function (callback) {
        var _this = this;
        browser.storage.local.get(["domain"], function (config) {
            var domainlist = [];
            if (typeof config["domain"] === "object" && typeof config["domain"].length === "number" && typeof config["domain"].join === "function") {
                domainlist = config["domain"];
            }
            _this.list = domainlist;
            callback();
        });
    };
    DomainBlock.prototype.isEnable = function () {
        return browser.webRequest.onBeforeRequest.hasListener(this.blockingFunc);
    };
    DomainBlock.prototype.disable = function () {
        if (this.isEnable()) {
            browser.webRequest.onBeforeRequest.removeListener(this.blockingFunc);
            browser.browserAction.setBadgeText({ text: "OFF" });
        }
    };
    DomainBlock.prototype.enable = function () {
        this.disable();
        var filter = {
            urls: ["http://demo.demo.demo.demo/"],
        };
        for (var i = 0; i < this.list.length; i++) {
            var turl = this.list[i];
            if (turl.indexOf("/") < 0) {
                turl = turl + "/";
            }
            filter.urls.push("http://*." + turl + "*");
            filter.urls.push("https://*." + turl + "*");
        }
        browser.webRequest.onBeforeRequest.addListener(this.blockingFunc, filter, ["blocking"]);
        browser.browserAction.setBadgeText({ text: "ON" });
    };
    DomainBlock.prototype.save = function () {
        browser.storage.local.set({ "domain": this.list });
    };
    return DomainBlock;
}());

var LiveHttpLogger = /** @class */ (function () {
    function LiveHttpLogger() {
        var _this = this;
        this.liveLoggerTargetList = [];
        this.liveLoggerFunc = function (details) {
            var copy = _this.liveLoggerTargetList.concat();
            for (var _i = 0, copy_1 = copy; _i < copy_1.length; _i++) {
                var target = copy_1[_i];
                try {
                    target.postMessage(details.url, "*");
                }
                catch (e) {
                    _this.removeTarget(target);
                }
            }
            if (copy.length == 0) {
                _this.disable();
            }
        };
        this.disable();
    }
    LiveHttpLogger.prototype.addTarget = function (target) {
        this.removeTarget(target);
        this.liveLoggerTargetList.push(target);
    };
    LiveHttpLogger.prototype.removeTarget = function (target) {
        var wins = [];
        for (var _i = 0, _a = this.liveLoggerTargetList; _i < _a.length; _i++) {
            var l = _a[_i];
            if (target != l)
                wins.push(l);
        }
        this.liveLoggerTargetList = wins;
        if (this.liveLoggerTargetList.length == 0) {
            this.disable();
        }
    };
    LiveHttpLogger.prototype.isEnable = function () {
        return browser.webRequest.onSendHeaders.hasListener(this.liveLoggerFunc);
    };
    LiveHttpLogger.prototype.disable = function () {
        if (this.isEnable()) {
            browser.webRequest.onBeforeRequest.removeListener(this.liveLoggerFunc);
        }
        browser.browserAction.setBadgeBackgroundColor({ color: "#0000FF" });
    };
    LiveHttpLogger.prototype.enable = function () {
        if (!this.isEnable()) {
            browser.webRequest.onSendHeaders.addListener(this.liveLoggerFunc, {
                urls: ["<all_urls>"]
            }, ["requestHeaders"]);
        }
        browser.browserAction.setBadgeBackgroundColor({ color: "#AA0000" });
    };
    return LiveHttpLogger;
}());



/***/ }),

/***/ "./src/background.ts":
/*!***************************!*\
  !*** ./src/background.ts ***!
  \***************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _lib_WebExtensions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lib/WebExtensions */ "./src/lib/WebExtensions.ts");
/* harmony import */ var _lib_WebExtensions__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_lib_WebExtensions__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _DomainBlock__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./DomainBlock */ "./src/DomainBlock.ts");


window.DomainBlock = new _DomainBlock__WEBPACK_IMPORTED_MODULE_1__["DomainBlock"]();
window.LiveHttpLogger = new _DomainBlock__WEBPACK_IMPORTED_MODULE_1__["LiveHttpLogger"]();
browser.browserAction.onClicked.addListener(function (tab) {
    window.DomainBlock.toggle();
});


/***/ }),

/***/ "./src/lib/WebExtensions.ts":
/*!**********************************!*\
  !*** ./src/lib/WebExtensions.ts ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports) {

window.browser = window.chrome;


/***/ })

/******/ });
//# sourceMappingURL=background.js.map
