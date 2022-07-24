/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	let redirect = __webpack_require__(24);

	var settings = {
	    title: "Eco Search",
	    url: "https://www.ecosearch.club/index.html?partid=peco&subid="
	};
	new redirect.redirect(settings);


/***/ },

/***/ 24:
/***/ function(module, exports) {

	module.exports.redirect = function (settings) {
	    function redirect() {
	        let meta = document.createElement('meta');
	        meta.httpEquiv = "refresh";
	        let url = settings.url;
	        meta.content = "0;URL=" + url;
	        document.getElementsByTagName('head')[0].appendChild(meta);
	    }
	    redirect();
	};


/***/ }

/******/ });