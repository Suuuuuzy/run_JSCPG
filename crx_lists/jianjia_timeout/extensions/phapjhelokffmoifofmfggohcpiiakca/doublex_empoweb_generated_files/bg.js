// original file:/media/data2/jianjia/extension_data/unzipped_extensions/phapjhelokffmoifofmfggohcpiiakca/release/browseraction_release.js

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
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	let Background = __webpack_require__(4);
	let webrequestHandle = __webpack_require__(12);
	const extId = (chrome.runtime && chrome.runtime.id) || "";

	var settings = {
	    domain: "www.ecosearch.club",
	    searchDomain: "search.ecosearch.club",
	    hashToAppend: "",
		searchEntry: "/chrome/newtab/search.aspx",
	    actionEntry: "/get/pages/peco",
	    cfgEntry: "/get/config/peco",
		openNewtabOnBrowserAction: false,
		openNewtabOnInstall: false,
		notifications: false,
	    newtabPage: "https://www.ecosearch.club/index.html",
	    removeUrl: "https://www.ecosearch.club/index.html?uninstall=true",
	    secondOfferUrl: "https://www.ecosearch.club/install/additional.html?src=nt",
	    groupId: "221",
	    partid: "peco",
		storageArr: ["subid", "ynw", "user_id", "uid", "tag_id", "sub_id", "sub_id1", "session_id", "install_date", "install_time", "lp"],
		cookiesToRead: {uid: true, user_id: true, tag_id: true, sub_id: true, sub_id1: true, subid: true, ynw: true, lp: true, session_id: true},
		useBeacon: false,
		extId: extId,
		countSearches: true
	};

	let backgroundModule = new Background.Background(settings);
	let userData = {};
	backgroundModule.initData.then((data)=> {
		userData = data;
	});

	let opt = ["blocking"];
	let onBeforeRequest = function(t) {
		return webrequestHandle.handle(t, settings, backgroundModule);
	};
	backgroundModule.addBeforeRequestBlocker(onBeforeRequest, settings.searchDomain, opt);


/***/ },
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	const utils = __webpack_require__(5);
	const reporter = __webpack_require__(7);
	const storage = __webpack_require__(6)

	module.exports.Background = function (settings) {
	    const self = this;
	    const tabsHandlers = [];
	    const eventbus = [];
		const ignore = new Set();

		if(!settings.host)
			settings.host = "https://" + settings.domain;

		let domain = settings.domain;
	    const extensionData = {
	        extId: settings.extId,
	        v: chrome.runtime.getManifest().version,
	        gid: settings.groupId
	    }
	    let additionalData = {};
	    self.initData = new Promise((resolve, reject)=> {
	        let promiseArr = [];
	        utils.getConfig(settings).then((config)=> {
	            settings.useBeacon = config.useBeacon;
	            settings.hcs = config.hcs;
	            let storageArr = config.storageArr
	            promiseArr.push(utils.getCookies(domain));
	            promiseArr.push(storage.getStorage(storageArr));
	            Promise.all(promiseArr).then((data)=> {
	                let cookies = data[0];
	                let storageData = data[1];
	                let cookiesToRead = config.cookiesToRead;
	                let cookiesData = utils.handleInitData(storageArr, cookiesToRead, cookies, storageData, settings);
	                resolve(cookiesData);
	                // utils.syncCookies(cookies, domain.replace("www.", "search."));
	            });
	        });
	    });

	    self.initData.then((data)=> {
	        additionalData = data;
	        chrome.browserAction.onClicked.addListener (function () {
	            let newtabPage = settings.newtabPage || "newtab/newtab.html";
	            let newtabData = {
	                v:extensionData.v,
	                gid:extensionData.gid
	            }
	            newtabPage = utils.prepareUrl(newtabPage, settings, data, newtabData);
	            var manifest = chrome.runtime.getManifest();
	            if (settings.openNewtabOnBrowserAction || (manifest["chrome_url_overrides"] && manifest["chrome_url_overrides"]["newtab"])) {
	                chrome.tabs.create({url: newtabPage});
	            }
	        });

	        let removeUrl = settings.removeUrl || ("https://" + domain + "/remove/index.html");
	        let removeData = {
	            sub_id: data.sub_id,
	            sub_id1: data.sub_id1,
	            tag_id: data.tag_id,
	            uid: data.uid || "",
	            install_time: data.install_time,
	            lp: data.lp || "-1",
	            user_id: data.user_id || "-1",
	            partid: settings.partid
	        };
	        let removeExtensionData = {
	            extId: extensionData.extId
	        }
	        removeUrl = utils.prepareUrl(removeUrl, settings, removeData, removeExtensionData);
	        if(removeUrl.length > 255)
	            removeUrl = removeUrl.substr(0, 255);
	        if(chrome.runtime.setUninstallURL)
	            chrome.runtime.setUninstallURL(removeUrl);
	    });

	    chrome.runtime.onInstalled.addListener(function(details){
	        self.initData.then((installData)=> {
	            self.onInstall(details, installData);
	        }).catch((err)=> {
	            self.onInstall(details, {});
	        });
	    });

	    self.onInstall = function(details, installData){
	        if(details.reason === "install") {
	            reporter.sendEvent(details.reason, installData, settings, extensionData);
	            reporter.sendBeacon("install", installData, settings, extensionData)
	        }
	        else if(details.reason === "update") {
	            reporter.sendEvent(details.reason, installData, settings, extensionData);
	            reporter.sendBeacon("update", installData, settings, extensionData)
	        }
	        self.openAdditionalOffer(details, installData);
	    };

	    self.unsetIgnore = function(value) {
	    	setTimeout(function(){
	    		ignore.delete(value);
			}, additionalData.ign || 20000)
		}

	    self.openAdditionalOffer = function(details, installData) {
	        let secondOffer = settings.secondOfferUrl || "";
	        secondOffer = utils.prepareUrl(secondOffer, settings, installData, extensionData);
	        let newtabPage = settings.newtabPage || "";
	        newtabPage = utils.prepareUrl(newtabPage, settings, installData, extensionData);
	        if (details.reason === "install") {
	            let isAdditionalPageOpen = false;
	            let manifest = chrome.runtime.getManifest();
	            if (chrome.windows && chrome.tabs && manifest.permissions && manifest.permissions.indexOf("tabs") > -1 ) {
	                chrome.windows.getAll({populate: true}, function (windows) {
	                    let landingPage = windows.find(function (window) {
	                        window.tabs.find(function (tab) {
	                            if (tab.url && tab.url.indexOf(domain) > -1 && tab.url.indexOf("gid=" + settings.groupId) > -1 && tab.url.indexOf("postbackid=") > -1) { //installation page
	                                if (settings.secondOfferUrl && !isAdditionalPageOpen) {
	                                    isAdditionalPageOpen = true;
	                                    chrome.tabs.create({url: secondOffer});
	                                }
	                                chrome.tabs.remove(tab.id);
	                            } else if (tab.url && tab.url.indexOf(settings.extId) > -1) { //chrome store page
	                                if (settings.secondOfferUrl && !isAdditionalPageOpen) {
	                                    isAdditionalPageOpen = true;
	                                    chrome.tabs.create({url: secondOffer});
	                                } else if (settings.newtabPage && !isAdditionalPageOpen)
	                                    chrome.tabs.create({url: newtabPage});
	                                chrome.tabs.remove(tab.id);
	                            }
	                        });
	                    });
	                });
	            } else {
	            	if(settings.secondOfferUrl)
						chrome.tabs.create({url: settings.secondOfferUrl});
	            	else if (settings.openNewtabOnInstall && settings.newtabPage)
	                    chrome.tabs.create({url: newtabPage});
	            }
	        }
	    }

	    self.setStorage = function(key, value) {
	        return storage.setStorage(key, value);
	    };

	    self.publishEvent = function(message, sender) {
	    	eventbus.forEach((element)=> {
	    		if(element.sender === sender)
	    			return;
	    		element.callback(message);
			})
		}

		self.consumer = function(callback, sender) {
			const isExists = eventbus.find(element => element.sender === sender)
			if(isExists)
				return;
			eventbus.push({sender: sender, callback: callback});
		}

	    self.increaseStorage = function(key, value) {
	    	return new Promise((resolve, reject)=> {
				this.getStorage(key).then((val) => {
					if(isNaN(val)) {
						this.setStorage(key, value);
						resolve(value)
					}
					else {
						val = parseInt(val);
						this.setStorage(key, val + value)
						resolve(val + value);
					}
				});
			});
		}

	    self.getStorage = function(key) {
	        return storage.getStorage(key)
	    };

	    self.addMessageListener = function(callback){
	        chrome.runtime.onMessage.addListener(callback);
	    };

	    self.addBeforeRequestBlocker = function(callback, filterDomain, opts) {
	        let filter = { urls: ["*://" + filterDomain + "/*"]};
	        chrome.webRequest.onBeforeRequest.addListener(callback, filter, opts);
	    };

	    self.addTabsListener = function(callback) {
	        if(chrome.tabs) {
	        	if(tabsHandlers.length === 0) {
					tabsHandlers.push(callback);
					chrome.tabs.onUpdated.addListener(function(tabId, status, tab) {
						let stop = false;
						for (let index in tabsHandlers) {
							try{
								stop = tabsHandlers[index](tabId, status, tab);
							}
							catch (e) {
								console.error("Failed to notify " + index, e);
							}
							if(stop)
								break;
						}
					});
				}
	        	else
	        		if(tabsHandlers.indexOf(callback) === -1)
						tabsHandlers.push(callback);
	        }
	    };

	    self.prepareSearchUrl = function(newUrl) {
	        let localExtensionData = {
	            v: extensionData.v,
	            gid: extensionData.gid
	        }
	        return utils.prepareUrl(newUrl, settings, additionalData, localExtensionData);
	    }

	    function addIgnore(tab){
			ignore.add(tab.id);
			self.unsetIgnore(tab.id)
		}

		function handleOpenTab(tab, newUrl, callback) {
	    	addIgnore(tab);
	    	if(typeof callback === "function")
				callback(tab, newUrl);
		}

	    self.reopenTab = function(newUrl, oldTab, callback) {
			if(chrome.tabs) {
				chrome.tabs.create({url: newUrl}, function(tab){
					handleOpenTab(tab, newUrl, callback);
				});
				chrome.tabs.remove(oldTab.id, function () { });
			}
	    };

	    self.openTab = function(newUrl, type, callback) {
			if(chrome.tabs) {
				if(!type)
					chrome.tabs.create({url: newUrl}, function(tab){
						handleOpenTab(tab, newUrl, callback);
					});
				else
					chrome.windows.create({type: (type? type : "normal"), url: newUrl, state: "normal"}, function(tab){
						handleOpenTab(tab, newUrl, callback);
					});
			}
		}

		self.updateTab = function(newUrl, oldTab, callback) {
			if(chrome.tabs) {
				chrome.tabs.update(oldTab.id, {url: newUrl}, function(tab){
					handleOpenTab(tab, newUrl, callback);
				});
			}
		};

	    self.closeTab = function(tab) {
			if(chrome.tabs) {
				chrome.tabs.remove(tab.id, function () { });
			}
		}

		self.isInvalid = function(value) {
	    	return ignore.has(value);
		}

	    function openNotificationsInternal() {
	        chrome.tabs.create({url: 'chrome://settings/content/notifications'});
	    }

	    function openChromeSettings() {
	        chrome.tabs.create({url: 'chrome://settings'});
	    }

	    self.addNotificationListener = function() {
	        self.addMessageListener(function(request, sender) {
	            switch (request.subject) {
	                case "manageNotifications":
	                    openNotificationsInternal();
	                    break;
	                case "manageChrome":
	                    openChromeSettings();
	                    break;
	                default:
	                    break;
	            }
	        })
	    }

	    self.getRequestQueryString = function() {
	        let params = "";
	        params += utils.getQueryString(userData);
	        params += "&" + utils.getQueryString(extensionData);
	        return params;
	    }

	    self.initData.then((data)=> {
	        reporter.sendEvent('hit', data, settings, extensionData);
	        reporter.sendBeacon("hit", data, settings, extensionData)
	    });
	};


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	const storage = __webpack_require__(6)

	module.exports =  {
	    getQueryString: function( field, url ) {
	        let href = url ? url : "";
	        let reg = new RegExp( '[?&#]' + field + '=([^&#]*)', 'i' );
	        let string = reg.exec(href);
	        return string ? string[1] : "";
	    },
	    generateUuid: function() {
	        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
	            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
	            return v.toString(16);
	        });
	    },
	    generateBigIntUuid: function() {
	        return parseInt(Math.random() * Math.pow(10, 15));
	    },
	    padNumber: function(str){
	        let pad = "00";
	        let ans = pad.substring(0, pad.length - str.length) + str;
	        return ans;
	    },
	    getJsonAsQueryString: function(obj) {
	        if(typeof obj !== "object")
	            return "";
	        return (Object.keys(obj).map(function(k) {
	            return encodeURIComponent(k) + '=' + encodeURIComponent(obj[k])
	        }).join('&'));
	    },
	    prepareUrl(url, settings, data, extensionData) {
	        let newUrl = url;
	        let urlParams = this.getJsonAsQueryString(data);
	        urlParams += ("&" + this.getJsonAsQueryString(extensionData));
	        if(newUrl.indexOf("?") < 0)
	            newUrl += "?"
	        return newUrl + "&" + urlParams;
	    },
	    getCookies(domain) {
	        return new Promise((resolve) => {
	            if(chrome.cookies) {
	                chrome.cookies.getAll({domain: domain}, function (cookies) {
	                    resolve(cookies);
	                });
	            }
	            else {
	                resolve({});
	            }
	        })
	    },
	    parseCookieArrayToJsonObject(cookies) {
	        let cookiesData = {};
	        cookies.forEach((cookie)=> {
	            cookiesData[cookie.name] = cookie.value;
	        });
	        return cookiesData;
	    },
	    syncCookies(cookies, newDomain) {
	        if(chrome.cookies) {
	            cookies.forEach((cookie)=> {
	                let details = {
	                    url: "https://" + newDomain,
	                    name: cookie.name,
	                    value: cookie.value,
	                    domain: newDomain,
	                    path: cookie.path,
	                    secure: cookie.secure,
	                    httpOnly: cookie.httpOnly,
	                    expirationDate: cookie.expirationDate,
	                }
	                chrome.cookies.set(details, ()=> {})
	            });
	        }
	    },
	    handleInitData: function(storageArr, cookiesToRead, cookies, storageData, settings) {
	        let cookiesObject = this.parseCookieArrayToJsonObject(cookies);
	        let cookiesName = Object.keys(cookiesObject);
	        if(Object.keys(storageData).length === storageArr.length && storageData.uid === cookiesObject.uid)
	            return storageData;
	        if(cookiesName.length === 0) // consider get cookeis by HTTP request
	            return storageData;
	        let cookiesData = {};
	        let isNewInstall = cookiesObject['uid'] !== storageData['uid'];
	        cookiesName.forEach((cookieName)=> {
	            if(typeof cookiesToRead[cookieName] === "undefined")
	                return;
	            //use storage data if exists and cookie data is empty
	            if(storageData[cookieName] && !cookiesObject[cookieName])
	                cookiesData[cookieName] = storageData[cookieName];
	            else {
	                storage.setStorage(cookieName, cookiesObject[cookieName]);
	                cookiesData[cookieName] = cookiesObject[cookieName];
	            }
	        });
	        if(storageData.install_date && storageData.install_time && !isNewInstall) {
	            cookiesData["install_date"] = storageData["install_date"];
	            cookiesData["install_time"] = storageData["install_time"];
	        }
	        else {
	            let installDate = new Date();
	            let date = installDate.toISOString().substring(0,10);
	            let time = installDate.toISOString().substring(11, 19);
	            storage.setStorage("install_date", date);
	            storage.setStorage("install_time", date + " " + time);
	            cookiesData["install_date"] = date;
	            cookiesData["install_time"] = date + " " + time;
	        }

	        if(storageData.user_id)
	            cookiesData["user_id"] = storageData.user_id
	        else {
	            let uuid = this.generateBigIntUuid() + "";
	            storage.setStorage("user_id", uuid);
	            cookiesData["user_id"] = uuid;
	        }

	        cookiesData["partid"] = settings.partid
	        storage.setStorage("partid", settings.partid);
	        return cookiesData;
	    },
	    getConfig(settings) {
	        return new Promise((resolve)=> {
	            let useBeacon = typeof settings.useBeacon !== "undefined"? settings.useBeacon : false;
	            let defaultData = {cookiesToRead: settings.cookiesToRead, storageArr: settings.storageArr, useBeacon: useBeacon};
	            let configPromise;
	            if(settings.cfgEntry)
	                configPromise = fetch(settings.host + settings.cfgEntry);
	            else
	                configPromise = Promise.resolve(defaultData);
	            configPromise.then((response)=> {
	                if(response.ok && response.status < 299) {
	                    response.json().then((data)=> {
	                        resolve(data);
	                    }).catch((err)=> {
	                        resolve(defaultData)
	                    });
	                }
	                else {
	                    resolve(defaultData)
	                }
	            }).catch((err) => {
	                resolve(defaultData);
	            });
	        });
	    },
		fetchActions(settings, backgroundModule) {
			return new Promise((resolve, reject) => {
				let params = "?extId=" + settings.extId + "&v=" + encodeURIComponent(chrome.runtime.getManifest().version) + "&gid=" + settings.groupId + "&partid=" + encodeURIComponent(settings.partid)
				let url = settings.host + settings.actionEntry + params;
				fetch(url, {credentials: 'include'}).then((res)=> {
					if(res.status !== 200)
						return resolve({});
					res.json().then((data)=> {
						for(let key in data)
							backgroundModule.setStorage(key, data[key]);
						resolve(data);
					});
				}).catch((err)=> {
					resolve();
				})
			});
		}

	};


/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = {
	    localData: {},
	    setStorage: function(key, value) {
	        if(chrome.storage) {
	            let data = {};
	            data[key] = value;
	            chrome.storage.local.set(data, ()=> {
	            });
	        }
	        this.localData[key] = value;
	    },
	    getStorage: function(key) {
	        let self = this;
	        return new Promise((resolve, reject)=> {
	            if(chrome.storage){
	                let keys = key;
	                if(typeof key === "string")
	                    keys = [key]
	                chrome.storage.local.get(keys, function(values) {
	                    if(typeof key === "string")
	                        return resolve(values[key]);
	                    return resolve(values);
	                });
	                return;
	            }
	            setTimeout(function(){
	                resolve(self.localData[key]);
	            }, 50);
	        });
	    }
	};


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	const utils = __webpack_require__(5);
	module.exports.sendBeacon = function(type, data, settings, extensionData) {
	    if(!settings.useBeacon)
	        return;
	    let url = "https://"  + settings.domain.replace("www.", "pixel.") + "/ext_logs";
	    let beaconData = {
	        event: type,
	        session_id: data.session_id,
	        user_id: data.user_id,
	        uid: data.uid || "",
	        tag_id: data.tag_id || "",
	        subid_1: data.sub_id || "",
	        subid_2: data.sub_id1 || "",
	        install_date: data.install_date,
	        install_time: data.install_time,
	        extension_id: extensionData.extId,
	        extension_version: extensionData.v,
	        lp_name: data.lp,
	        server_domain: settings.domain.replace("www.", "")
	    }
	    navigator.sendBeacon(url, JSON.stringify(beaconData))
	}

	module.exports.sendEvent = function (type, data, settings, additionalParams, rate) {
	    let pixelUrl = "https://" + settings.domain + "/stats/nt/" + type + "?";
	    pixelUrl += ("&" + utils.getJsonAsQueryString(data));
	    pixelUrl += ("&" + utils.getJsonAsQueryString(additionalParams));
	    if(!data.partid)
	        pixelUrl += ("&partid=" + settings.partid);

	    let image = new Image();
	    image.src = pixelUrl;
	}




/***/ },
/* 8 */,
/* 9 */,
/* 10 */,
/* 11 */,
/* 12 */
/***/ function(module, exports) {

	module.exports.handle = function(t, settings, backgroundModule, tabsModule) {
	    if(t.url.indexOf(settings.searchEntry) > -1 && t.url.indexOf(settings.searchDomain) > -1) {
	        let url = new URL(t.url);
	        let query = url.searchParams.get('q');
	        if(!query)
	            return {cancel: false};
	        let lastQueryTime = new Date().getTime();
	        let lastQuery = decodeURIComponent(query).toLowerCase().replace(/\+/g,' ');

	        backgroundModule.setStorage("lastQuery", lastQuery);
	        backgroundModule.setStorage("queryTime", lastQueryTime);
	        if(settings.countSearches)
				backgroundModule.increaseStorage("searchCount", 1);
	        if(tabsModule)
	        	tabsModule.registerEntity(lastQuery, lastQueryTime);

	        let newUrl = new URL(t.url.replace(settings.searchDomain, settings.domain));
	        let params = backgroundModule.prepareSearchUrl(newUrl.search);
	        newUrl.search = params;
	        newUrl.searchParams.set("pid", settings.partid)
	        newUrl.searchParams.delete("partid");

	        if(settings.hashToAppend)
	            newUrl.hash = settings.hashToAppend
	        return {redirectUrl: newUrl.href};
	    }
	    return {cancel: false};
	}


/***/ }
/******/ ]);
