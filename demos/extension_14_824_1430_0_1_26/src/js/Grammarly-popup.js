!function(modules) {
    function __webpack_require__(moduleId) {
        if (installedModules[moduleId]) return installedModules[moduleId].exports;
        var module = installedModules[moduleId] = {
            i: moduleId,
            l: !1,
            exports: {}
        };
        return modules[moduleId].call(module.exports, module, module.exports, __webpack_require__), 
        module.l = !0, module.exports;
    }
    var installedModules = {};
    __webpack_require__.m = modules, __webpack_require__.c = installedModules, __webpack_require__.d = function(exports, name, getter) {
        __webpack_require__.o(exports, name) || Object.defineProperty(exports, name, {
            configurable: !1,
            enumerable: !0,
            get: getter
        });
    }, __webpack_require__.n = function(module) {
        var getter = module && module.__esModule ? function() {
            return module.default;
        } : function() {
            return module;
        };
        return __webpack_require__.d(getter, "a", getter), getter;
    }, __webpack_require__.o = function(object, property) {
        return Object.prototype.hasOwnProperty.call(object, property);
    }, __webpack_require__.p = "", __webpack_require__(__webpack_require__.s = 1127);
}([ , function(module, exports, __webpack_require__) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    });
    var logger_1 = __webpack_require__(154);
    exports.SimpleLogger = logger_1.SimpleLogger, exports.Logger = logger_1.Logger;
    var logWriter_1 = __webpack_require__(74);
    exports.FunctionLogWriter = logWriter_1.FunctionLogWriter, exports.ConsoleLogWriter = logWriter_1.ConsoleLogWriter;
    var logFilter_1 = __webpack_require__(75);
    exports.logLevelFilter = logFilter_1.logLevelFilter;
    var logConfig_1 = __webpack_require__(73);
    exports.LogConfig = logConfig_1.LogConfig;
    var common_1 = __webpack_require__(23);
    exports.LogLevel = common_1.LogLevel;
}, function(module, exports, __webpack_require__) {
    "use strict";
    function interval(cb, time) {
        var items = interval.items = interval.items || {}, item = items[cb];
        if (item || time) return item && !time ? (clearTimeout(item), void delete items[cb]) : void function() {
            function _cb() {
                timeout(), cb();
            }
            function timeout() {
                var tid = setTimeout(_cb, time);
                items[cb] = tid;
            }
            timeout();
        }();
    }
    function s4() {
        return (65536 * (1 + Math.random()) | 0).toString(16).substring(1);
    }
    function _f() {}
    function delay(ms) {
        return new Promise(function(resolve) {
            return setTimeout(resolve, ms);
        });
    }
    var __awaiter = this && this.__awaiter || function(thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function(resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value));
                } catch (e) {
                    reject(e);
                }
            }
            function rejected(value) {
                try {
                    step(generator.throw(value));
                } catch (e) {
                    reject(e);
                }
            }
            function step(result) {
                result.done ? resolve(result.value) : new P(function(resolve) {
                    resolve(result.value);
                }).then(fulfilled, rejected);
            }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }, __generator = this && this.__generator || function(thisArg, body) {
        function verb(n) {
            return function(v) {
                return step([ n, v ]);
            };
        }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            for (;_; ) try {
                if (f = 1, y && (t = y[2 & op[0] ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
                switch (y = 0, t && (op = [ 0, t.value ]), op[0]) {
                  case 0:
                  case 1:
                    t = op;
                    break;

                  case 4:
                    return _.label++, {
                        value: op[1],
                        done: !1
                    };

                  case 5:
                    _.label++, y = op[1], op = [ 0 ];
                    continue;

                  case 7:
                    op = _.ops.pop(), _.trys.pop();
                    continue;

                  default:
                    if (t = _.trys, !(t = t.length > 0 && t[t.length - 1]) && (6 === op[0] || 2 === op[0])) {
                        _ = 0;
                        continue;
                    }
                    if (3 === op[0] && (!t || op[1] > t[0] && op[1] < t[3])) {
                        _.label = op[1];
                        break;
                    }
                    if (6 === op[0] && _.label < t[1]) {
                        _.label = t[1], t = op;
                        break;
                    }
                    if (t && _.label < t[2]) {
                        _.label = t[2], _.ops.push(op);
                        break;
                    }
                    t[2] && _.ops.pop(), _.trys.pop();
                    continue;
                }
                op = body.call(thisArg, _);
            } catch (e) {
                op = [ 6, e ], y = 0;
            } finally {
                f = t = 0;
            }
            if (5 & op[0]) throw op[1];
            return {
                value: op[0] ? op[1] : void 0,
                done: !0
            };
        }
        var f, y, t, g, _ = {
            label: 0,
            sent: function() {
                if (1 & t[0]) throw t[1];
                return t[1];
            },
            trys: [],
            ops: []
        };
        return g = {
            next: verb(0),
            throw: verb(1),
            return: verb(2)
        }, "function" == typeof Symbol && (g[Symbol.iterator] = function() {
            return this;
        }), g;
    }, __read = this && this.__read || function(o, n) {
        var m = "function" == typeof Symbol && o[Symbol.iterator];
        if (!m) return o;
        var r, e, i = m.call(o), ar = [];
        try {
            for (;(void 0 === n || n-- > 0) && !(r = i.next()).done; ) ar.push(r.value);
        } catch (error) {
            e = {
                error: error
            };
        } finally {
            try {
                r && !r.done && (m = i.return) && m.call(i);
            } finally {
                if (e) throw e.error;
            }
        }
        return ar;
    }, __spread = this && this.__spread || function() {
        for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
        return ar;
    };
    Object.defineProperty(exports, "__esModule", {
        value: !0
    });
    var transform = __webpack_require__(115), nch = __webpack_require__(263), newConfig_1 = __webpack_require__(24), newConfig_2 = __webpack_require__(24);
    exports.isTestsMode = newConfig_2.isTestsMode, exports.getBrowser = newConfig_2.getBrowser, 
    exports.isBg = newConfig_2.isBg, exports.isBgOrPopup = newConfig_2.isBgOrPopup, 
    exports.isChrome = newConfig_2.isChrome, exports.isFF = newConfig_2.isFF, exports.isPopup = newConfig_2.isPopup, 
    exports.isSafari = newConfig_2.isSafari, exports.isEdge = newConfig_2.isEdge, exports.isWindows = newConfig_2.isWindows, 
    exports.chromeBgError = function() {
        return window.chrome && window.chrome.runtime && window.chrome.runtime.lastError;
    }, exports.isFunction = function(obj) {
        return !!(obj && obj.constructor && obj.call && obj.apply);
    }, exports.interval = interval, function(interval) {
        interval.items = {};
    }(interval = exports.interval || (exports.interval = {})), exports.cancelInterval = function(cb) {
        interval(cb);
    }, exports.guid = function() {
        return s4() + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + s4() + s4();
    }, exports.bytes = function(str) {
        for (var codePoint, next, result = 0, len = str.length, i = 0; i < len; i++) (codePoint = str.charCodeAt(i)) >= 55296 && codePoint < 57344 && codePoint < 56320 && i + 1 < len && (next = str.charCodeAt(i + 1)) >= 56320 && next < 57344 ? (result += 4, 
        i++) : result += codePoint < 128 ? 1 : codePoint < 2048 ? 2 : 3;
        return result;
    }, exports.chunks = function(s, len) {
        for (var curr = len, prev = 0, result = []; s[curr]; ) if (" " === s[curr++]) result.push(s.substring(prev, curr)), 
        prev = curr, curr += len; else {
            var currReverse = curr;
            do {
                if (" " === s.substring(currReverse - 1, currReverse)) {
                    result.push(s.substring(prev, currReverse)), prev = currReverse, curr = currReverse + len;
                    break;
                }
                currReverse--;
            } while (currReverse > prev);
        }
        return result.push(s.substr(prev)), result;
    }, exports._f = _f, exports._F = function() {
        return !0;
    }, exports.bgPageReload = function() {
        window.chrome && window.chrome.runtime && window.chrome.runtime.reload ? window.chrome.runtime.reload() : window.location.reload();
    }, exports.isGmail = function(doc) {
        if (doc.location) {
            var host = "mail.google.com" == doc.location.host, frames = doc.querySelector("iframe#js_frame") && doc.querySelector("iframe#sound_frame");
            return host || frames;
        }
    }, exports.isValidEmail = function(value) {
        return /^[-!#$%&\'*+\\./0-9=?A-Z^_`a-z{|}~]+@[-!#$%&\'*+\\/0-9=?A-Z^_`a-z{|}~]+\.[-!#$%&\'*+\\./0-9=?A-Z^_`a-z{|}~]+$/.test(value);
    }, exports.formatNumber = function(i) {
        return i.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }, exports.declension = function(value, arr) {
        return arr[1 == value ? 0 : 1];
    }, exports.stub = function(methods) {
        return transform(methods, function(result, m) {
            return result[m] = _f;
        });
    }, exports.memoize = function(func, resolver, ttl) {
        var cache = {};
        return function() {
            var key = "_memoize_" + (resolver ? resolver.apply(this, arguments) : arguments[0]);
            return window.hasOwnProperty.call(cache, key) ? cache[key] : (ttl && setTimeout(function() {
                delete cache[key];
            }, ttl), cache[key] = func.apply(this, arguments));
        };
    }, exports.syncWait = function(promise, methods) {
        return Object.keys(methods).reduce(function(obj, method) {
            return Object.assign({}, obj, (_a = {}, _a[method] = function() {
                for (var args = [], _i = 0; _i < arguments.length; _i++) args[_i] = arguments[_i];
                return promise.then(function() {
                    return methods[method].apply(methods, __spread(args));
                });
            }, _a));
            var _a;
        }, {});
    }, exports.promisify = function(method) {
        return new Promise(function(resolve) {
            return method(resolve);
        });
    }, exports.getRandomIntInclusive = function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }, exports.delay = delay;
    var months = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
    exports.formatDate = function(dateStr) {
        if (dateStr) {
            var date = new Date(dateStr);
            if ("Invalid Date" !== date.toString()) return months[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear();
        }
    }, exports.createClass = function(getPrototype) {
        var _class = function() {};
        return _class.prototype = getPrototype(), _class;
    }, exports.versionComparator = function(v1, v2) {
        function splitToArray(str) {
            return str.split(".").map(function(el) {
                return Number(el) || 0;
            });
        }
        void 0 === v1 && (v1 = ""), void 0 === v2 && (v2 = "");
        var v1arr = splitToArray(v1), v2arr = splitToArray(v2), postfix = Array(Math.abs(v1arr.length - v2arr.length)).fill(0);
        if (v1arr.length > v2arr.length ? v2arr.push.apply(v2arr, __spread(postfix)) : v1arr.push.apply(v1arr, __spread(postfix)), 
        v1arr.every(function(v, i) {
            return v === v2arr[i];
        })) return 0;
        for (var i = 0, len = v1arr.length; i < len; i++) {
            if (v1arr[i] > v2arr[i]) return 1;
            if (v1arr[i] < v2arr[i]) return -1;
        }
        return -1;
    }, exports.isBgAlive = function() {
        return __awaiter(this, void 0, void 0, function() {
            var e_1;
            return __generator(this, function(_a) {
                switch (_a.label) {
                  case 0:
                    if (!newConfig_1.isChrome() && !newConfig_1.isFF()) return [ 2, null ];
                    _a.label = 1;

                  case 1:
                    return _a.trys.push([ 1, 3, , 4 ]), [ 4, Promise.race([ new Promise(function(resolve) {
                        return window.chrome.runtime.sendMessage("ping", resolve);
                    }), delay(1e4).then(function(_) {
                        return "timeouted";
                    }) ]) ];

                  case 2:
                    return [ 2, _a.sent() ];

                  case 3:
                    return e_1 = _a.sent(), [ 2, "orphaned" ];

                  case 4:
                    return [ 2 ];
                }
            });
        });
    }, exports.asyncCall = function(cb, time) {
        void 0 === time && (time = 10), setTimeout(cb, time);
    }, exports.createChannel = function(_a) {
        var _b = (void 0 === _a ? {} : _a).buffered, buffered = void 0 === _b || _b, messageQueue = [], resolveQueue = [];
        return {
            take: function() {
                return messageQueue.length ? Promise.resolve(messageQueue.shift()) : new Promise(function(resolve) {
                    return resolveQueue.push(resolve);
                });
            },
            put: function(msg) {
                resolveQueue.length > 0 ? resolveQueue.shift()(msg) : buffered ? messageQueue.push(msg) : messageQueue[0] = msg;
            }
        };
    }, exports.normalizedHashCode = function(str, base) {
        if (void 0 === base && (base = 100), !str) return NaN;
        var algo = nch.createHash("superfasthash");
        return parseInt(algo.hash(str), 16) % base;
    }, exports.keyCode = function(event) {
        return event.which || event.charCode || event.keyCode || 0;
    }, exports.NBSP_RE = new RegExp(String.fromCharCode(160), "g");
    var nbsp = String.fromCharCode(160), reBr = /\n/g, reLastSpace = /\s$/g, reBrSpace = new RegExp("\n" + String.fromCharCode(32), "g");
    exports.br = function(val, last) {
        return val = val.replace(reBrSpace, "<br>" + nbsp).replace(reBr, "<br>"), last && (val = val.replace(reLastSpace, nbsp)), 
        val;
    }, exports.trimLeft = function(s) {
        return s.replace(/^\s+/, "");
    }, exports.trimRight = function(s) {
        return s.replace(/\s+$/, "");
    }, exports.SECOND = 1e3, exports.MINUTE = 60 * exports.SECOND, exports.HOUR = 60 * exports.MINUTE, 
    exports.DAY = 24 * exports.HOUR, exports.ESC_KEY = 27, exports.ENTER_KEY = 13, exports.pastDays = function(date) {
        return Math.round(Math.abs(+new Date() - +new Date(date)) / exports.DAY);
    }, exports.getNextPingDate = function() {
        var now = new Date();
        return now.getHours() > 2 && now.setDate(now.getDate() + 1), now.setHours(3), now.setMinutes(Math.floor(60 * Math.random())), 
        now.getTime();
    }, exports.escapeRegExp = function(str) {
        return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    };
}, function(module, exports, __webpack_require__) {
    "use strict";
    function hasClass(_el, cls) {
        return !(!_el || void 0 === _el.className) && _el.classList.contains(cls);
    }
    function removeClass(_el, cls) {
        if (_el && _el.classList) return _el.classList.remove(cls);
    }
    function addClass(_el, cls) {
        if (_el) {
            if (-1 === cls.indexOf(" ")) return _el.classList.add(cls);
            for (var classes = cls.split(" "), i = 0; i < classes.length; i++) _el.classList.add(classes[i]);
        }
    }
    function isContentEditable(el) {
        return "true" === el.contentEditable || "plaintext-only" === el.contentEditable;
    }
    function matchesSelector(el, sel) {
        if (!el) return !1;
        var method = el.matches || el.msMatchesSelector || el.matchesSelector || el.webkitMatchesSelector || el.mozMatchesSelector;
        return !!method && method.apply(el, [ sel ]);
    }
    function on(type, listener, useCapture) {
        var _this = this;
        return this.addEventListener(type, listener, useCapture), {
            off: function() {
                return off.apply(_this, [ type, listener, useCapture ]);
            }
        };
    }
    function off(type, listener, useCapture) {
        this.removeEventListener(type, listener, useCapture);
    }
    function maybeAddPx(name, value) {
        return "number" != typeof value || cssNumber[dasherize(name)] ? value : value + "px";
    }
    function camelize(str) {
        return str.replace(/-+(.)?/g, function(_, chr) {
            return chr ? chr.toUpperCase() : "";
        });
    }
    function dasherize(str) {
        return str.replace(/::/g, "/").replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2").replace(/([a-z\d])([A-Z])/g, "$1_$2").replace(/_/g, "-").toLowerCase();
    }
    function css(el, arg2, arg3) {
        if (arguments.length < 3) {
            var element_1 = el;
            if (!element_1) return;
            var computedStyle_1 = getComputedStyle(element_1, "");
            if ("string" == typeof arg2) return element_1.style[camelize(arg2)] || computedStyle_1.getPropertyValue(arg2);
            if (isArray(arg2)) {
                var props_1 = {};
                return each(arg2, function(val, _) {
                    props_1[camelize(val)] = element_1.style[camelize(val)] || computedStyle_1.getPropertyValue(val);
                }), props_1;
            }
        }
        var result = "";
        if (isString(arg2)) arg3 || 0 === arg3 ? result = dasherize(arg2) + ":" + maybeAddPx(arg2, arg3) : el.style.removeProperty(dasherize(arg2)); else {
            arg2 = arg2;
            for (var key in arg2) arg2[key] || 0 === arg2[key] ? result += dasherize(key) + ":" + maybeAddPx(key, arg2[key]) + ";" : el.style.removeProperty(dasherize(key));
        }
        return el.style.cssText += result;
    }
    function getParent(el, cls) {
        for (var e = el.parentNode; null !== e; ) {
            if (hasClass(e, cls)) return e;
            e = e.parentNode;
        }
        return !1;
    }
    function getParentByDepth(depth) {
        return void 0 === depth && (depth = 1), depth ? getParentByDepth.call(this.parentNode, --depth) : this;
    }
    function selectorAll(cls) {
        for (var classes = [], _i = 1; _i < arguments.length; _i++) classes[_i - 1] = arguments[_i];
        if (classes.length > 0) {
            var result_1 = [];
            return result_1.push(selectorAll(cls)), classes.forEach(function(c) {
                return result_1.push(selectorAll(c));
            }), result_1.join(", ");
        }
        return (cls = cls.split(", ").map(function(c) {
            return "." !== c[0] ? "." + c : c;
        }).join(", ").trim()) + ", " + cls + " *";
    }
    function addRange(doc, range) {
        var s = doc.getSelection();
        s.removeAllRanges(), s.addRange(range);
    }
    function closestEl(el, sel) {
        return null === el ? null : matchesSelector(el, sel) ? el : el.querySelector(sel) || closestEl(el.parentElement, sel);
    }
    Object.defineProperty(exports, "__esModule", {
        value: !0
    });
    var ReactDOM = __webpack_require__(20), stdlib_1 = __webpack_require__(4), DOMPurify = __webpack_require__(148), transform = __webpack_require__(115), each = __webpack_require__(93), isString = __webpack_require__(399), isArray = __webpack_require__(7), isObject = __webpack_require__(8), extend = __webpack_require__(38), events_1 = __webpack_require__(134);
    exports.listen = events_1.listen, exports.unlisten = events_1.unlisten, exports.IFRAME_STYLE_CLASS = "gr__style", 
    exports.createEl = function(html, doc) {
        var div = (doc || document).createElement("div");
        return div.innerHTML = DOMPurify.sanitize(html.trim()), div.firstElementChild;
    }, exports.renderReactWithParent = function(reactElement, p, id, type) {
        void 0 === type && (type = "div");
        var parent = p, react = parent[id] = parent[id] || {}, clickHandler = function(e) {
            e.stopPropagation(), e.stopImmediatePropagation();
        };
        react.el || (react.el = parent.ownerDocument.createElement(type), react.el.addEventListener("click", clickHandler), 
        parent.appendChild(react.el));
        var component = ReactDOM.render(reactElement, react.el);
        return null == react.remove && (react.remove = function() {
            delete parent[id], react.el.removeEventListener("click", clickHandler), parent.removeChild(react.el), 
            ReactDOM.unmountComponentAtNode(react.el);
        }), {
            component: component,
            remove: react.remove.bind(react),
            el: react.el
        };
    }, exports.inEl = function(el, target, deep) {
        void 0 === deep && (deep = 1e3);
        for (var cur = el; cur.parentNode && 0 < deep; ) {
            if ("string" != typeof target && target === cur) return !0;
            if (cur.id === target || cur === target) return !0;
            cur = cur.parentNode;
        }
        return !1;
    }, exports.hasClass = hasClass, exports.removeClass = removeClass, exports.addClass = addClass, 
    exports.toggleClass = function(el, flag, cls) {
        flag ? addClass(el, cls) : removeClass(el, cls);
    }, exports.getParentBySel = function(el, sel) {
        for (var e = el.parentNode; null !== e; ) {
            if (matchesSelector(e, sel)) return e;
            e = e.parentNode;
        }
        return !1;
    }, exports.parentIsContentEditable = function(el) {
        for (var e = el.parentNode; null !== e; ) {
            if (isContentEditable(e)) return e;
            e = e.parentNode;
        }
        return !1;
    }, exports.isContentEditable = isContentEditable, exports.matchesSelector = matchesSelector, 
    exports.isFocused = function(el) {
        return document.activeElement && "IFRAME" === document.activeElement.tagName ? el === el.ownerDocument.activeElement : (document.activeElement && document.activeElement.tagName, 
        el === document.activeElement);
    }, exports.on = on, exports.off = off, exports.once = function(event, cb) {
        var _this = this, done = function(e) {
            cb(e), off.call(_this, event, done);
        };
        on.call(this, event, done);
    }, exports.emit = function(event, data) {
        var e = document.createEvent("CustomEvent");
        e.initCustomEvent(event, !0, !0, data), this.dispatchEvent(e);
    }, exports.isVisible = function(el, getClientHeight) {
        void 0 === getClientHeight && (getClientHeight = function(el) {
            return el.clientHeight;
        });
        var style = getComputedStyle(el, void 0);
        return "none" !== style.getPropertyValue("display") && "hidden" !== style.getPropertyValue("visibility") && getClientHeight(el) > 0;
    }, exports.cs = function() {
        for (var keys = [], _i = 0; _i < arguments.length; _i++) keys[_i] = arguments[_i];
        return keys.reduce(function(res, cur) {
            return res.concat(isObject(cur) ? Object.keys(cur).filter(function(cls) {
                return cur[cls];
            }) : cur);
        }, []).filter(function(x) {
            return Boolean(x);
        }).join(" ");
    };
    var cssNumber = {
        "column-count": 1,
        columns: 1,
        "font-weight": 1,
        "line-height": 1,
        opacity: 1,
        "z-index": 1,
        zoom: 1
    };
    exports.maybeAddPx = maybeAddPx, exports.camelize = camelize, exports.camelizeAttrs = function(obj) {
        return transform(obj, function(result, value, key) {
            return result[camelize(key)] = value;
        });
    }, exports.dasherize = dasherize, exports.css = css, exports.setCustomCss = function(field, style) {
        if (style && field) {
            var originStyle = css(field, Object.keys(style));
            return css(field, style), function() {
                return css(field, originStyle);
            };
        }
    }, exports.getParentByTag = function(el, tag) {
        for (var e = el.parentNode; null !== e; ) {
            if (e.tagName === tag) return e;
            e = e.parentNode;
        }
        return null;
    }, exports.getParentByData = function(el, key, val) {
        for (var e = el.parentNode; null !== e; ) {
            if (e.dataset && e.dataset[key] && e.dataset[key] == val) return e;
            e = e.parentNode;
        }
    }, exports.resolveEl = function(el, cls) {
        return hasClass(el, cls) ? el : getParent(el, cls);
    }, exports.getParent = getParent, exports.parentHasClass = function(el, cls) {
        if (!el) return !1;
        for (var e = el; e.parentNode; ) {
            if (hasClass(e, cls)) return e;
            e = e.parentNode;
        }
        return !1;
    }, exports.getParentByDepth = getParentByDepth, exports.isParent = function(el, parent) {
        if (!el) return !1;
        for (var e = el; e.parentNode; ) {
            if (parent === e.parentNode) return e;
            e = e.parentNode;
        }
        return !1;
    }, exports.insertAfter = function(newElement, targetElement) {
        var parent = targetElement.parentNode;
        if (null === parent) throw new stdlib_1.AssertionError("Expected non-null parent");
        parent.lastChild === targetElement ? parent.appendChild(newElement) : parent.insertBefore(newElement, targetElement.nextSibling);
    }, exports.insertBefore = function(newElement, targetElement) {
        stdlib_1.assertNonNull(targetElement.parentNode, "parent node").insertBefore(newElement, targetElement);
    }, exports.elementInDocument = function(el, doc) {
        doc = doc || document;
        for (var element = el; element; ) {
            if (element === doc) return !0;
            element = element.parentNode;
        }
        return !1;
    }, exports.runKeyEvent = function(ee) {
        var evt, defaultView, e = extend({
            ctrl: !1,
            meta: !1,
            shift: !1,
            alt: !1
        }, ee);
        try {
            evt = e.el.ownerDocument.createEvent("KeyEvents"), defaultView = e.el.ownerDocument.defaultView, 
            evt.initKeyEvent(e.type, !0, !0, defaultView, e.ctrl, e.alt, e.shift, e.meta, 0, 0);
        } catch (err) {
            (evt = e.el.ownerDocument.createEvent("UIEvents")).initUIEvent.bind(evt)(void 0, !0, !0, window, 1), 
            evt.keyCode = 0, evt.which = 0, evt.charCode = 0, evt.ctrlKey = e.ctrl, evt.altKey = e.alt, 
            evt.shiftKey = e.shift, evt.metaKey = e.meta;
        }
        e.el.dispatchEvent(evt);
    }, exports.docHidden = function(doc) {
        return void 0 !== doc.hidden ? doc.hidden : void 0 !== doc.mozHidden ? doc.mozHidden : void 0 !== doc.webkitHidden ? doc.webkitHidden : void 0 !== doc.msHidden && doc.msHidden;
    }, exports.visibilityEvent = function(doc) {
        return void 0 !== doc.hidden ? "visibilitychange" : void 0 !== doc.mozHidden ? "mozvisibilitychange" : void 0 !== doc.webkitHidden ? "webkitvisibilitychange" : void 0 !== doc.msHidden && "msvisibilitychange";
    }, exports.transformProp = function(doc) {
        return void 0 === doc && (doc = document), void 0 !== doc.body.style.transform ? "transform" : void 0 !== doc.body.style.WebkitTransform ? "WebkitTransform" : void 0 !== doc.body.style.MozTransform ? "MozTransform" : void 0;
    }, exports.getDocSelection = function(doc) {
        return doc.getSelection() || {};
    }, exports.compStyle = function(el) {
        for (var props = [], _i = 1; _i < arguments.length; _i++) props[_i - 1] = arguments[_i];
        if (el) {
            var doc = el.ownerDocument;
            if (doc) {
                var win = doc.defaultView || window;
                if (win) {
                    var s = win.getComputedStyle(el, void 0);
                    if (s) return 1 === props.length ? s.getPropertyValue(props[0]) : props.reduce(function(result, prop) {
                        return Object.assign({}, result, (_a = {}, _a[prop] = s.getPropertyValue(prop), 
                        _a));
                        var _a;
                    }, {});
                }
            }
        }
    }, exports.classSelector = function(cls) {
        return cls.split(" ").map(function(c) {
            return "." !== c[0] ? "." + c : c;
        }).join("").trim();
    }, exports.selectorAll = selectorAll, exports.whichAnimationEndEvent = function() {
        var el = document.createElement("fakeelement"), transitions = {
            animation: "animationend",
            MozAnimation: "animationend",
            WebkitAnimation: "webkitAnimationEnd"
        };
        for (var t in transitions) if (void 0 !== el.style[t]) return transitions[t];
    }, exports.transitionEndEventName = function() {
        var el = document.createElement("fakeelement"), transitions = {
            transition: "transitionend",
            MozTransition: "transitionend",
            WebkitTransition: "webkitTransitionEnd"
        };
        for (var i in transitions) if (transitions.hasOwnProperty(i) && void 0 !== el.style[i]) return transitions[i];
    }, exports.addIframeCss = function(frameDoc, editorType) {
        if (void 0 !== window.GR_INLINE_STYLES) {
            var style = frameDoc.createElement("style");
            style.innerHTML = window.GR_INLINE_STYLES, style.classList.add(exports.IFRAME_STYLE_CLASS), 
            "ckeditor" === editorType && (style.dataset.ckeTemp = "1");
            try {
                frameDoc.querySelector("head").appendChild(style);
            } catch (e) {
                console.log("can't append style", e);
            }
        }
    }, exports.setGRAttributes = function(el, id) {
        el.setAttribute("data-gramm_id", id), el.setAttribute("data-gramm", "true");
    }, exports.emitDomEvent = function(key, data) {
        void 0 === data && (data = {});
        var e = document.createEvent("CustomEvent");
        e.initCustomEvent(key + "-gr", !0, !0, data), document.dispatchEvent(e);
    }, exports.addRange = addRange, exports.setDomRange = function(doc, data) {
        var range = doc.createRange();
        range.setStart(data.anchorNode, data.anchorOffset), range.setEnd(data.focusNode, data.focusOffset), 
        addRange(doc, range);
    }, exports.closestEl = closestEl;
}, function(module, exports, __webpack_require__) {
    "use strict";
    function optionalStringUnion(allowedValues, value) {
        return allowedValues.some(function(x) {
            return x === value;
        }) ? value : void 0;
    }
    function optionalIntString(val) {
        var parsed = parseInt(val, 10);
        return isNaN(parsed) ? void 0 : parsed;
    }
    var __extends = this && this.__extends || function() {
        var extendStatics = Object.setPrototypeOf || {
            __proto__: []
        } instanceof Array && function(d, b) {
            d.__proto__ = b;
        } || function(d, b) {
            for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return function(d, b) {
            function __() {
                this.constructor = d;
            }
            extendStatics(d, b), d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, 
            new __());
        };
    }();
    Object.defineProperty(exports, "__esModule", {
        value: !0
    });
    var assert_1 = __webpack_require__(151);
    exports.assert = assert_1.assert, exports.assertNonNull = assert_1.assertNonNull, 
    exports.AssertionError = assert_1.AssertionError;
    var promise_1 = __webpack_require__(63);
    exports.SafePromise = promise_1.SafePromise;
    var promise_2 = __webpack_require__(63), Arr = __webpack_require__(152);
    exports.Arr = Arr;
    var Obj = __webpack_require__(153);
    exports.Obj = Obj;
    var Global = function() {
        function Global(_getFallbackValue) {
            this._getFallbackValue = _getFallbackValue;
        }
        return Global.prototype.init = function(v) {
            if (void 0 !== this._value) throw new Error("Global value already initialized.");
            this._value = v;
        }, Global.prototype.get = function() {
            if (void 0 === this._value) {
                if (void 0 === this._getFallbackValue) throw new Error("Global value not initialized and no fallback value provided.");
                this._value = this._getFallbackValue();
            }
            return this._value;
        }, Global;
    }();
    exports.Global = Global, exports.optionalStringUnion = optionalStringUnion, exports.assertStringUnion = function(allowedValues, value, name) {
        var validated = optionalStringUnion(allowedValues, value);
        if (void 0 !== validated) return validated;
        throw new TypeError('Unrecognized string union value "' + value + '"' + (name ? " for " + name : ""));
    };
    var MatchingNotExhaustiveError = function(_super) {
        function MatchingNotExhaustiveError(actualValue) {
            return _super.call(this, "Matching not exhaustive" + (actualValue ? ": unexpected value " + actualValue : "")) || this;
        }
        return __extends(MatchingNotExhaustiveError, _super), MatchingNotExhaustiveError;
    }(Error);
    exports.MatchingNotExhaustiveError = MatchingNotExhaustiveError, exports.assertNever = function(x) {
        throw new MatchingNotExhaustiveError(x);
    }, exports.optionalIntString = optionalIntString, exports.assertIntString = function(val, name) {
        var opt = optionalIntString(val);
        if (void 0 !== opt) return opt;
        throw new Error("Expected a number string, got '" + val + "'" + (void 0 !== name ? " for " + name : ""));
    }, exports.try_ = function(run, handle) {
        try {
            return run();
        } catch (err) {
            return handle(err);
        }
    }, exports.noOp = function() {}, exports.throttle = function(timeMs, fn) {
        function runIndeterminate(afterMs) {
            return gate && (gate = !1, result = promise_2.SafePromise.createCompletionSource(), 
            setTimeout(function() {
                try {
                    result.resolve(fn());
                } catch (err) {
                    result.reject(err);
                } finally {
                    gate = !0;
                }
            }, afterMs)), result.promise;
        }
        var lastCallTs, result, gate = !0;
        return function() {
            var oldLastCallTs = lastCallTs;
            return lastCallTs = Date.now(), runIndeterminate(void 0 === oldLastCallTs || lastCallTs - oldLastCallTs >= timeMs ? 0 : timeMs - (lastCallTs - oldLastCallTs));
        };
    }, exports.lazy = function(factory) {
        var value, hasValue = !1;
        return {
            get: function() {
                return hasValue || (value = factory(), hasValue = !0), value;
            }
        };
    };
}, function(module, exports, __webpack_require__) {
    "use strict";
    module.exports = __webpack_require__(390);
}, , function(module, exports) {
    var isArray = Array.isArray;
    module.exports = isArray;
}, function(module, exports) {
    module.exports = function(value) {
        var type = typeof value;
        return null != value && ("object" == type || "function" == type);
    };
}, function(module, exports, __webpack_require__) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    });
    var call_1 = __webpack_require__(111);
    exports.call = call_1.call, exports.getLog = call_1.getLog, exports.logCall = call_1.logCall;
    var logger_1 = __webpack_require__(177);
    exports.felog = logger_1.felog;
}, function(module, exports, __webpack_require__) {
    "use strict";
    var __read = this && this.__read || function(o, n) {
        var m = "function" == typeof Symbol && o[Symbol.iterator];
        if (!m) return o;
        var r, e, i = m.call(o), ar = [];
        try {
            for (;(void 0 === n || n-- > 0) && !(r = i.next()).done; ) ar.push(r.value);
        } catch (error) {
            e = {
                error: error
            };
        } finally {
            try {
                r && !r.done && (m = i.return) && m.call(i);
            } finally {
                if (e) throw e.error;
            }
        }
        return ar;
    }, __spread = this && this.__spread || function() {
        for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
        return ar;
    };
    Object.defineProperty(exports, "__esModule", {
        value: !0
    });
    var Config = __webpack_require__(11), newConfig_1 = __webpack_require__(24);
    exports.isTestsMode = newConfig_1.isTestsMode, exports.getVersion = newConfig_1.getVersion, 
    exports.getUuid = newConfig_1.getUuid, exports.ENV = newConfig_1.ENV, exports.URLS = newConfig_1.URLS, 
    exports.GRAMMARLY_DOMAIN = newConfig_1.GRAMMARLY_DOMAIN, exports.appName = newConfig_1.appName, 
    exports.gnarAppName = newConfig_1.gnarAppName;
    exports.GNAR = Config.getGlobal().appConfig.gnar, exports.news = [ "The G logo gets out of the way when you're typing", "Switch between American, British, Australian, and Canadian English", "Quickly disable checking in certain types of text fields", "A fully redesigned and improved interface" ], 
    exports.userFields = [ "id", "email", "firstName", "anonymous", "type", "subscriptionFree", "experiments", "isTest", "premium", "settings", "registrationDate", "mimic", "groups", "extensionInstallDate", "fixed_errors" ], 
    exports.userFields.push("token"), exports.nextVerClass = "gr_ver_2", exports.grammarlyAttrs = [ "data-gramm_editor", "data-gramm", "data-gramm_id", "gramm_editor" ], 
    exports.restrictedAttrs = __spread(exports.grammarlyAttrs, [ "readonly", "disabled" ]), 
    exports.customFieldsRestrictedAttrs = [ "pm-container", [ "class", "ProseMirror" ], "data-synchrony", [ "data-gramm", "false" ], [ "data-enable-grammarly", "false" ], [ "class", "redactor-layer" ], [ "class", "redactor-editor" ], [ "class", "ck-editor__editable" ], [ "class", "redactor_box" ], [ "aria-label", "Search Facebook" ] ], 
    exports.allRestrictedAttrs = __spread(exports.restrictedAttrs, exports.customFieldsRestrictedAttrs), 
    exports.forceEnableAttr = {
        name: "data-enable-grammarly",
        value: "true"
    }, exports.restrictedParentAttrs = "[data-reactid]", exports.externalEvents = [ "changed-user", "changed-plan", "changed-dialect", "cleanup", "editor-fix", "enable-email-perception" ], 
    exports.development = "127.0.0.1:3117" === document.location.host;
}, function(module, exports, __webpack_require__) {
    "use strict";
    function __export(m) {
        for (var p in m) exports.hasOwnProperty(p) || (exports[p] = m[p]);
    }
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), __export(__webpack_require__(69)), __export(__webpack_require__(72)), __export(__webpack_require__(28)), 
    __export(__webpack_require__(71)), __export(__webpack_require__(76)), __export(__webpack_require__(70)), 
    __export(__webpack_require__(77));
    var mainConfig_1 = __webpack_require__(77), bundle_1 = __webpack_require__(28), stdlib_1 = __webpack_require__(4), log = __webpack_require__(1).Logger.create("config"), globalConfig = new stdlib_1.Global(function() {
        log.warn("Global config not initialized -- using fall back value.");
        var browser = stdlib_1.assertNonNull(bundle_1.TargetBrowser.detect(window), "runtime-detected browser type"), cfg = mainConfig_1.MainConfig.create(browser, bundle_1.TargetContext.detect(window, browser), mainConfig_1.ProcessEnv.fromBrowserify());
        return window.GR_CFG = cfg, cfg;
    });
    exports.getGlobal = function() {
        return globalConfig.get();
    }, exports.initGlobal = function(browser, context, env) {
        globalConfig.init(mainConfig_1.MainConfig.create(browser, context, env || mainConfig_1.ProcessEnv.fromBrowserify())), 
        window.GR_CFG = globalConfig.get();
    };
}, function(module, exports, __webpack_require__) {
    var freeGlobal = __webpack_require__(119), freeSelf = "object" == typeof self && self && self.Object === Object && self, root = freeGlobal || freeSelf || Function("return this")();
    module.exports = root;
}, , , function(module, exports, __webpack_require__) {
    "use strict";
    function currentUrl(_a) {
        var _this = this, tabs = _a.tabs;
        return stdlib_1.SafePromise.create(function(resolve) {
            return __awaiter(_this, void 0, void 0, function() {
                var retry, url;
                return __generator(this, function(_a) {
                    switch (_a.label) {
                      case 0:
                        return retry = setTimeout(function() {
                            return tabs.getActiveTabUrl().then(resolve);
                        }, 2e3), [ 4, tabs.getActiveTabUrl() ];

                      case 1:
                        return url = _a.sent(), clearTimeout(retry), resolve(url), [ 2 ];
                    }
                });
            });
        });
    }
    function getDomain(el) {
        var doc = el && el.ownerDocument || document, location = doc.location || doc.defaultView.location;
        return location ? stripDomain(location.hostname) : "";
    }
    function domainFromUrl(url) {
        if (util_1.isFF() && /^about:/.test(url)) return url;
        var location = document.createElement("a");
        return location.href = url, stripDomain(location.hostname);
    }
    function getUrl(el) {
        var doc = el && el.ownerDocument || document, location = doc.location || doc.defaultView.location;
        return location ? location.pathname + location.search : "";
    }
    var __awaiter = this && this.__awaiter || function(thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function(resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value));
                } catch (e) {
                    reject(e);
                }
            }
            function rejected(value) {
                try {
                    step(generator.throw(value));
                } catch (e) {
                    reject(e);
                }
            }
            function step(result) {
                result.done ? resolve(result.value) : new P(function(resolve) {
                    resolve(result.value);
                }).then(fulfilled, rejected);
            }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }, __generator = this && this.__generator || function(thisArg, body) {
        function verb(n) {
            return function(v) {
                return step([ n, v ]);
            };
        }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            for (;_; ) try {
                if (f = 1, y && (t = y[2 & op[0] ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
                switch (y = 0, t && (op = [ 0, t.value ]), op[0]) {
                  case 0:
                  case 1:
                    t = op;
                    break;

                  case 4:
                    return _.label++, {
                        value: op[1],
                        done: !1
                    };

                  case 5:
                    _.label++, y = op[1], op = [ 0 ];
                    continue;

                  case 7:
                    op = _.ops.pop(), _.trys.pop();
                    continue;

                  default:
                    if (t = _.trys, !(t = t.length > 0 && t[t.length - 1]) && (6 === op[0] || 2 === op[0])) {
                        _ = 0;
                        continue;
                    }
                    if (3 === op[0] && (!t || op[1] > t[0] && op[1] < t[3])) {
                        _.label = op[1];
                        break;
                    }
                    if (6 === op[0] && _.label < t[1]) {
                        _.label = t[1], t = op;
                        break;
                    }
                    if (t && _.label < t[2]) {
                        _.label = t[2], _.ops.push(op);
                        break;
                    }
                    t[2] && _.ops.pop(), _.trys.pop();
                    continue;
                }
                op = body.call(thisArg, _);
            } catch (e) {
                op = [ 6, e ], y = 0;
            } finally {
                f = t = 0;
            }
            if (5 & op[0]) throw op[1];
            return {
                value: op[0] ? op[1] : void 0,
                done: !0
            };
        }
        var f, y, t, g, _ = {
            label: 0,
            sent: function() {
                if (1 & t[0]) throw t[1];
                return t[1];
            },
            trys: [],
            ops: []
        };
        return g = {
            next: verb(0),
            throw: verb(1),
            return: verb(2)
        }, "function" == typeof Symbol && (g[Symbol.iterator] = function() {
            return this;
        }), g;
    };
    Object.defineProperty(exports, "__esModule", {
        value: !0
    });
    var util_1 = __webpack_require__(2), defaults_1 = __webpack_require__(91), stdlib_1 = __webpack_require__(4), stripDomain = function(domain) {
        return domain.replace("www.", "");
    };
    exports.currentUrl = currentUrl, exports.getDomain = getDomain, exports.promiseGetDomain = function(api) {
        return Promise.race([ currentUrl(api).then(domainFromUrl), util_1.delay(1e4).then(function() {
            throw new Error("Request to tabs.getCurrentTabUrl rejected by timeout");
        }) ]);
    }, exports.domainFromUrl = domainFromUrl, exports.isFacebookSite = function() {
        return defaults_1.FACEBOOK_SITES.includes(getDomain());
    }, exports.isGdocsSite = function() {
        return /\/document\//.test(getUrl()) && "docs.google.com" === getDomain();
    }, exports.isJiraSite = function() {
        return /\.atlassian\.net/.test(getDomain());
    }, exports.isBlackboardSite = function() {
        return /\.blackboard\.com/.test(getDomain());
    }, exports.getUrl = getUrl, exports.getFavicon = function() {
        for (var isAbsolute = new RegExp("^(?:[a-z]+:)?//", "i"), favicon = "", links = document.getElementsByTagName("link"), i = 0; i < links.length; i++) {
            var link = links[i], regexp = /(\"icon )|( icon\")|(\"icon\")|( icon )/i;
            -1 !== ('"' + link.getAttribute("rel") + '"').search(regexp) && (favicon = link.getAttribute("href"));
        }
        return favicon || (favicon = "favicon.ico"), isAbsolute.test(favicon) ? favicon : "/" !== favicon[0] ? "//" + document.location.host + document.location.pathname + favicon : "//" + document.location.host + favicon;
    };
}, function(module, exports, __webpack_require__) {
    "use strict";
    (function(process) {
        function on(type, callback) {
            if ("__bgerror" !== type) {
                var listeners = Listeners[type] = Listeners[type] || [];
                if (listeners.push(callback), 1 === listeners.length) try {
                    message.listen(type, function() {
                        for (var args = [], _i = 0; _i < arguments.length; _i++) args[_i] = arguments[_i];
                        try {
                            for (var listeners_1 = __values(listeners), listeners_1_1 = listeners_1.next(); !listeners_1_1.done; listeners_1_1 = listeners_1.next()) listeners_1_1.value.apply(void 0, __spread(args));
                        } catch (e_1_1) {
                            e_1 = {
                                error: e_1_1
                            };
                        } finally {
                            try {
                                listeners_1_1 && !listeners_1_1.done && (_a = listeners_1.return) && _a.call(listeners_1);
                            } finally {
                                if (e_1) throw e_1.error;
                            }
                        }
                        var e_1, _a;
                    });
                } catch (e) {
                    exports.emitError(e);
                }
            } else errorEmitter.on("__bgerror", callback);
        }
        function off(type, callback) {
            if ("__bgerror" !== type) {
                var listeners = Listeners[type];
                if (listeners) {
                    var i = listeners.indexOf(callback);
                    -1 !== i && listeners.splice(i, 1), 0 === listeners.length && delete Listeners[type];
                }
            } else errorEmitter.off("__bgerror", callback);
        }
        var __values = this && this.__values || function(o) {
            var m = "function" == typeof Symbol && o[Symbol.iterator], i = 0;
            return m ? m.call(o) : {
                next: function() {
                    return o && i >= o.length && (o = void 0), {
                        value: o && o[i++],
                        done: !o
                    };
                }
            };
        }, __read = this && this.__read || function(o, n) {
            var m = "function" == typeof Symbol && o[Symbol.iterator];
            if (!m) return o;
            var r, e, i = m.call(o), ar = [];
            try {
                for (;(void 0 === n || n-- > 0) && !(r = i.next()).done; ) ar.push(r.value);
            } catch (error) {
                e = {
                    error: error
                };
            } finally {
                try {
                    r && !r.done && (m = i.return) && m.call(i);
                } finally {
                    if (e) throw e.error;
                }
            }
            return ar;
        }, __spread = this && this.__spread || function() {
            for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
            return ar;
        };
        Object.defineProperty(exports, "__esModule", {
            value: !0
        });
        var throttle = __webpack_require__(172), emitter = __webpack_require__(17), util_1 = __webpack_require__(2), events_1 = __webpack_require__(134), extension_api_1 = __webpack_require__(90), message = (process && process.env, 
        extension_api_1.getGlobalExtensionApi()).message, errorEmitter = emitter({}), Listeners = {};
        exports.emitError = throttle(function(e) {
            return errorEmitter.emit("__bgerror", e);
        }, 1e3), util_1.isBg() && events_1.listen(document, "grammarly:offline", function() {
            return exports.emitError("proxy dead");
        }, void 0), exports.one = function(type, cb) {
            function _cb() {
                for (var data = [], _i = 0; _i < arguments.length; _i++) data[_i] = arguments[_i];
                off(type, _cb), cb.apply(this, data);
            }
            on(type, _cb);
        }, exports.on = on, exports.off = off, exports.emitTabs = function(type) {
            try {
                switch (message.kind) {
                  case "background-message-api":
                    message.broadcast(type, {});
                    break;

                  default:
                    throw new Error("emitTabs can be used only on background");
                }
            } catch (e) {
                exports.emitError(e);
            }
        }, exports.emitTo = function(tabId, type, content, _callback) {
            void 0 === content && (content = {});
            var callback = _callback || function() {};
            try {
                if (!tabId) throw TypeError("emitTo can't be used without destination point");
                switch (message.kind) {
                  case "background-message-api":
                    message.sendTo(tabId, type, content, callback);
                    break;

                  default:
                    throw new Error("emitTo can be used only on background");
                }
            } catch (e) {
                exports.emitError(e);
            }
        }, exports.emitFocusedTab = function(type, content) {
            try {
                message.toFocused(type, content);
            } catch (e) {
                exports.emitError(e);
            }
        }, exports.emitBackground = function(type, content, callback) {
            try {
                switch (message.kind) {
                  case "content-script-message-api":
                    message.broadcastBackground(type, content, callback);
                    break;

                  default:
                    throw new Error("emitBackground can be used only in content script");
                }
            } catch (e) {
                exports.emitError(e);
            }
        }, exports.promiseBackground = function(type, data, timeout) {
            void 0 === data && (data = {}), void 0 === timeout && (timeout = 1e4);
            var request = new Promise(function(resolve, reject) {
                try {
                    switch (message.kind) {
                      case "content-script-message-api":
                        message.broadcastBackground(type, data, resolve, reject);
                        break;

                      default:
                        throw new Error("promiseBackground can be used only on client scripts");
                    }
                } catch (e) {
                    reject(e), exports.emitError(e);
                }
            });
            return Promise.race([ request, util_1.delay(timeout).then(function() {
                throw new Error("Request to bg page (" + message + ") rejected by timeout");
            }) ]);
        };
    }).call(exports, __webpack_require__(60));
}, function(module, exports, __webpack_require__) {
    try {
        module.exports = __webpack_require__(281);
    } catch (e) {}
}, function(module, exports) {
    module.exports = function(value) {
        return null != value && "object" == typeof value;
    };
}, function(module, exports, __webpack_require__) {
    "use strict";
    (function(process) {
        function deferred() {
            var props = arguments.length <= 0 || void 0 === arguments[0] ? {} : arguments[0], def = _extends({}, props), promise = new Promise(function(resolve, reject) {
                def.resolve = resolve, def.reject = reject;
            });
            return def.promise = promise, def;
        }
        Object.defineProperty(exports, "__esModule", {
            value: !0
        });
        var _extends = Object.assign || function(target) {
            for (var i = 1; i < arguments.length; i++) {
                var source = arguments[i];
                for (var key in source) Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
            }
            return target;
        };
        exports.ident = function(v) {
            return v;
        }, exports.check = function(value, predicate, error) {
            if (!predicate(value)) throw new Error(error);
        }, exports.remove = function(array, item) {
            var index = array.indexOf(item);
            index >= 0 && array.splice(index, 1);
        }, exports.deferred = deferred, exports.arrayOfDeffered = function(length) {
            for (var arr = [], i = 0; i < length; i++) arr.push(deferred());
            return arr;
        }, exports.autoInc = function() {
            var seed = arguments.length <= 0 || void 0 === arguments[0] ? 0 : arguments[0];
            return function() {
                return ++seed;
            };
        }, exports.asap = function(action) {
            return Promise.resolve(1).then(function() {
                return action();
            });
        }, exports.warnDeprecated = function(msg) {
            isDev && console.warn("DEPRECATION WARNING", msg);
        };
        var sym = exports.sym = function(id) {
            return "@@redux-saga/" + id;
        }, TASK = exports.TASK = sym("TASK"), isDev = (exports.kTrue = function() {
            return !0;
        }, exports.noop = function() {}, exports.isDev = void 0 !== process && process.env && !1), is = exports.is = {
            undef: function(v) {
                return null === v || void 0 === v;
            },
            notUndef: function(v) {
                return null !== v && void 0 !== v;
            },
            func: function(f) {
                return "function" == typeof f;
            },
            array: Array.isArray,
            promise: function(p) {
                return p && is.func(p.then);
            },
            iterator: function(it) {
                return it && is.func(it.next) && is.func(it.throw);
            },
            task: function(it) {
                return it && it[TASK];
            }
        };
    }).call(exports, __webpack_require__(60));
}, function(module, exports, __webpack_require__) {
    "use strict";
    function checkDCE() {
        if ("undefined" != typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ && "function" == typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE) try {
            __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(checkDCE);
        } catch (err) {
            console.error(err);
        }
    }
    checkDCE(), module.exports = __webpack_require__(389);
}, function(module, exports, __webpack_require__) {
    var Symbol = __webpack_require__(32), getRawTag = __webpack_require__(207), objectToString = __webpack_require__(208), nullTag = "[object Null]", undefinedTag = "[object Undefined]", symToStringTag = Symbol ? Symbol.toStringTag : void 0;
    module.exports = function(value) {
        return null == value ? void 0 === value ? undefinedTag : nullTag : symToStringTag && symToStringTag in Object(value) ? getRawTag(value) : objectToString(value);
    };
}, , function(module, exports, __webpack_require__) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    });
    var LogLevel;
    !function(LogLevel) {
        LogLevel.TRACE = "TRACE", LogLevel.DEBUG = "DEBUG", LogLevel.INFO = "INFO", LogLevel.WARN = "WARN", 
        LogLevel.ERROR = "ERROR", LogLevel.FATAL = "FATAL";
    }(LogLevel = exports.LogLevel || (exports.LogLevel = {})), exports.getLogRank = function(level) {
        var map = new Map([ [ LogLevel.TRACE, 0 ], [ LogLevel.DEBUG, 1 ], [ LogLevel.INFO, 2 ], [ LogLevel.WARN, 3 ], [ LogLevel.ERROR, 4 ], [ LogLevel.FATAL, 5 ] ]);
        return map.has(level) ? map.get(level) : 0;
    };
}, function(module, exports, __webpack_require__) {
    "use strict";
    function isBg() {
        return "bg" === globalConfig.bundleInfo.context;
    }
    function isPopup() {
        return "popup" === globalConfig.bundleInfo.context;
    }
    Object.defineProperty(exports, "__esModule", {
        value: !0
    });
    var globalConfig = __webpack_require__(11).getGlobal();
    exports.isTestsMode = function() {
        return !!window.__extensionTestsMode;
    }, exports.getUuid = function() {
        return globalConfig.appConfig.extensionId;
    }, exports.isFF = function() {
        return "firefox" === globalConfig.bundleInfo.browser;
    }, exports.isChrome = function() {
        return "chrome" === globalConfig.bundleInfo.browser;
    }, exports.isSafari = function() {
        return "safari" === globalConfig.bundleInfo.browser;
    }, exports.isEdge = function() {
        return "edge" === globalConfig.bundleInfo.browser;
    }, exports.isWindows = function() {
        return globalConfig.systemInfo.os.isWindows;
    }, exports.isBg = isBg, exports.isPopup = isPopup, exports.isBgOrPopup = function() {
        return isBg() || isPopup();
    }, exports.getBrowser = function() {
        return globalConfig.bundleInfo.browser;
    }, exports.getVersion = function() {
        return globalConfig.buildInfo.version;
    }, exports.ENV = globalConfig.bundleInfo.env, exports.URLS = globalConfig.appConfig.url, 
    exports.appName = globalConfig.appConfig.felog.appName, exports.gnarAppName = globalConfig.appConfig.gnar.appName, 
    exports.GRAMMARLY_DOMAIN = globalConfig.appConfig.url.grammarlyDomain;
}, function(module, exports, __webpack_require__) {
    var baseIsNative = __webpack_require__(225), getValue = __webpack_require__(228);
    module.exports = function(object, key) {
        var value = getValue(object, key);
        return baseIsNative(value) ? value : void 0;
    };
}, function(module, exports, __webpack_require__) {
    var isFunction = __webpack_require__(42), isLength = __webpack_require__(78);
    module.exports = function(value) {
        return null != value && isLength(value.length) && !isFunction(value);
    };
}, , function(module, exports, __webpack_require__) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    });
    var stdlib_1 = __webpack_require__(4);
    !function(TargetBrowser) {
        TargetBrowser.create = function(x) {
            return stdlib_1.optionalStringUnion([ "chrome", "safari", "firefox", "edge" ], x);
        }, TargetBrowser.detect = function(win) {
            return win.chrome && /google/i.test(win.navigator.vendor) ? "chrome" : -1 !== win.navigator.userAgent.indexOf("Firefox") ? "firefox" : /^((?!chrome).)*safari/i.test(win.navigator.userAgent) ? "safari" : "Netscape" === win.navigator.appName && win.navigator.appVersion.indexOf("Edge") > -1 ? "edge" : void 0;
        };
    }(exports.TargetBrowser || (exports.TargetBrowser = {}));
    !function(TargetEnv) {
        TargetEnv.create = function(x) {
            return stdlib_1.optionalStringUnion([ "dev", "prod", "qa" ], x);
        };
    }(exports.TargetEnv || (exports.TargetEnv = {}));
    !function(TargetContext) {
        TargetContext.create = function(x) {
            return stdlib_1.optionalStringUnion([ "bg", "cs", "popup" ], x);
        }, TargetContext.detect = function(win, browser) {
            var isBg = !!win.IS_BG, isPopup = "safari" === browser ? function() {
                try {
                    return win.safari.extension.globalPage.contentWindow !== win;
                } catch (_) {
                    return !1;
                }
            }() : !!win.IS_POPUP;
            return isBg ? "bg" : isPopup ? "popup" : "cs";
        };
    }(exports.TargetContext || (exports.TargetContext = {}));
    !function(BundleInfo) {
        BundleInfo.create = function(browser, env, context) {
            return {
                browser: browser,
                env: env,
                context: context
            };
        };
    }(exports.BundleInfo || (exports.BundleInfo = {}));
}, , , function(module, exports, __webpack_require__) {
    var arrayLikeKeys = __webpack_require__(118), baseKeys = __webpack_require__(155), isArrayLike = __webpack_require__(26);
    module.exports = function(object) {
        return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
    };
}, function(module, exports, __webpack_require__) {
    var Symbol = __webpack_require__(12).Symbol;
    module.exports = Symbol;
}, function(module, exports, __webpack_require__) {
    (function(module) {
        var root = __webpack_require__(12), stubFalse = __webpack_require__(209), freeExports = "object" == typeof exports && exports && !exports.nodeType && exports, freeModule = freeExports && "object" == typeof module && module && !module.nodeType && module, Buffer = freeModule && freeModule.exports === freeExports ? root.Buffer : void 0, isBuffer = (Buffer ? Buffer.isBuffer : void 0) || stubFalse;
        module.exports = isBuffer;
    }).call(exports, __webpack_require__(48)(module));
}, function(module, exports) {
    module.exports = function(value, other) {
        return value === other || value !== value && other !== other;
    };
}, function(module, exports, __webpack_require__) {
    var assignValue = __webpack_require__(170), baseAssignValue = __webpack_require__(66);
    module.exports = function(source, props, object, customizer) {
        var isNew = !object;
        object || (object = {});
        for (var index = -1, length = props.length; ++index < length; ) {
            var key = props[index], newValue = customizer ? customizer(object[key], source[key], key, object, source) : void 0;
            void 0 === newValue && (newValue = source[key]), isNew ? baseAssignValue(object, key, newValue) : assignValue(object, key, newValue);
        }
        return object;
    };
}, function(module, exports) {
    var g;
    g = function() {
        return this;
    }();
    try {
        g = g || Function("return this")() || (0, eval)("this");
    } catch (e) {
        "object" == typeof window && (g = window);
    }
    module.exports = g;
}, , function(module, exports, __webpack_require__) {
    module.exports = __webpack_require__(285);
}, function(module, exports, __webpack_require__) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    });
    var LogLevel;
    !function(LogLevel) {
        LogLevel[LogLevel.INFO = 0] = "INFO", LogLevel[LogLevel.WARN = 1] = "WARN", LogLevel[LogLevel.ERROR = 2] = "ERROR";
    }(LogLevel = exports.LogLevel || (exports.LogLevel = {})), function(LogLevel) {
        LogLevel.toFelogString = function(l) {
            switch (l) {
              case LogLevel.INFO:
                return "INFO";

              case LogLevel.WARN:
                return "WARN";

              case LogLevel.ERROR:
                return "ERROR";

              default:
                throw new TypeError("Unrecognized log level " + l);
            }
        };
    }(LogLevel = exports.LogLevel || (exports.LogLevel = {})), exports.createEventPayload = function(event, appLevelData) {
        return {
            application: appLevelData.appName,
            version: appLevelData.appVersion,
            env: appLevelData.env,
            logger: event.logger,
            message: event.message,
            extra: event.extra,
            extra_usage: event.extra_usage,
            extra_performance: event.extra_performance,
            level: LogLevel.toFelogString(event.level),
            userId: appLevelData.context && appLevelData.context.userId,
            containerId: appLevelData.context && appLevelData.context.containerId
        };
    }, exports.felogRequestUrl = function(payload, baseUrl) {
        return baseUrl + "/log?json=" + encodeURIComponent(JSON.stringify(payload));
    }, exports.felogUsageRequestUrl = function(payload, baseUrl) {
        return baseUrl + "/log?json=" + encodeURIComponent(JSON.stringify(payload));
    };
}, , function(module, exports, __webpack_require__) {
    var baseIsTypedArray = __webpack_require__(210), baseUnary = __webpack_require__(181), nodeUtil = __webpack_require__(211), nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray, isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;
    module.exports = isTypedArray;
}, function(module, exports, __webpack_require__) {
    var baseGetTag = __webpack_require__(21), isObject = __webpack_require__(8), asyncTag = "[object AsyncFunction]", funcTag = "[object Function]", genTag = "[object GeneratorFunction]", proxyTag = "[object Proxy]";
    module.exports = function(value) {
        if (!isObject(value)) return !1;
        var tag = baseGetTag(value);
        return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
    };
}, function(module, exports, __webpack_require__) {
    var isSymbol = __webpack_require__(53), INFINITY = 1 / 0;
    module.exports = function(value) {
        if ("string" == typeof value || isSymbol(value)) return value;
        var result = value + "";
        return "0" == result && 1 / value == -INFINITY ? "-0" : result;
    };
}, function(module, exports, __webpack_require__) {
    var arrayLikeKeys = __webpack_require__(118), baseKeysIn = __webpack_require__(271), isArrayLike = __webpack_require__(26);
    module.exports = function(object) {
        return isArrayLike(object) ? arrayLikeKeys(object, !0) : baseKeysIn(object);
    };
}, , function(module, exports, __webpack_require__) {
    var baseIsArguments = __webpack_require__(206), isObjectLike = __webpack_require__(18), objectProto = Object.prototype, hasOwnProperty = objectProto.hasOwnProperty, propertyIsEnumerable = objectProto.propertyIsEnumerable, isArguments = baseIsArguments(function() {
        return arguments;
    }()) ? baseIsArguments : function(value) {
        return isObjectLike(value) && hasOwnProperty.call(value, "callee") && !propertyIsEnumerable.call(value, "callee");
    };
    module.exports = isArguments;
}, , function(module, exports) {
    module.exports = function(module) {
        return module.webpackPolyfill || (module.deprecate = function() {}, module.paths = [], 
        module.children || (module.children = []), Object.defineProperty(module, "loaded", {
            enumerable: !0,
            get: function() {
                return module.l;
            }
        }), Object.defineProperty(module, "id", {
            enumerable: !0,
            get: function() {
                return module.i;
            }
        }), module.webpackPolyfill = 1), module;
    };
}, function(module, exports, __webpack_require__) {
    function ListCache(entries) {
        var index = -1, length = null == entries ? 0 : entries.length;
        for (this.clear(); ++index < length; ) {
            var entry = entries[index];
            this.set(entry[0], entry[1]);
        }
    }
    var listCacheClear = __webpack_require__(215), listCacheDelete = __webpack_require__(216), listCacheGet = __webpack_require__(217), listCacheHas = __webpack_require__(218), listCacheSet = __webpack_require__(219);
    ListCache.prototype.clear = listCacheClear, ListCache.prototype.delete = listCacheDelete, 
    ListCache.prototype.get = listCacheGet, ListCache.prototype.has = listCacheHas, 
    ListCache.prototype.set = listCacheSet, module.exports = ListCache;
}, function(module, exports, __webpack_require__) {
    var eq = __webpack_require__(34);
    module.exports = function(array, key) {
        for (var length = array.length; length--; ) if (eq(array[length][0], key)) return length;
        return -1;
    };
}, function(module, exports, __webpack_require__) {
    var nativeCreate = __webpack_require__(25)(Object, "create");
    module.exports = nativeCreate;
}, function(module, exports, __webpack_require__) {
    var isKeyable = __webpack_require__(237);
    module.exports = function(map, key) {
        var data = map.__data__;
        return isKeyable(key) ? data["string" == typeof key ? "string" : "hash"] : data.map;
    };
}, function(module, exports, __webpack_require__) {
    var baseGetTag = __webpack_require__(21), isObjectLike = __webpack_require__(18), symbolTag = "[object Symbol]";
    module.exports = function(value) {
        return "symbol" == typeof value || isObjectLike(value) && baseGetTag(value) == symbolTag;
    };
}, function(module, exports) {
    module.exports = function(value) {
        return value;
    };
}, function(module, exports, __webpack_require__) {
    "use strict";
    function _defineProperty(obj, key, value) {
        return key in obj ? Object.defineProperty(obj, key, {
            value: value,
            enumerable: !0,
            configurable: !0,
            writable: !0
        }) : obj[key] = value, obj;
    }
    function getFnCallDesc(fn, args) {
        (0, _utils.check)(fn, _utils.is.notUndef, CALL_FUNCTION_ARG_ERROR);
        var context = null;
        if (_utils.is.array(fn)) {
            var _fn2 = _slicedToArray(fn, 2);
            context = _fn2[0], fn = _fn2[1];
        } else if (fn.fn) {
            var _fn3 = fn;
            context = _fn3.context, fn = _fn3.fn;
        }
        return (0, _utils.check)(fn, _utils.is.func, CALL_FUNCTION_ARG_ERROR), {
            context: context,
            fn: fn,
            args: args
        };
    }
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), exports.asEffect = exports.SELECT_ARG_ERROR = exports.INVALID_PATTERN = exports.CANCEL_ARG_ERROR = exports.JOIN_ARG_ERROR = exports.FORK_ARG_ERROR = exports.CALL_FUNCTION_ARG_ERROR = void 0;
    var _slicedToArray = function() {
        function sliceIterator(arr, i) {
            var _arr = [], _n = !0, _d = !1, _e = void 0;
            try {
                for (var _s, _i = arr[Symbol.iterator](); !(_n = (_s = _i.next()).done) && (_arr.push(_s.value), 
                !i || _arr.length !== i); _n = !0) ;
            } catch (err) {
                _d = !0, _e = err;
            } finally {
                try {
                    !_n && _i.return && _i.return();
                } finally {
                    if (_d) throw _e;
                }
            }
            return _arr;
        }
        return function(arr, i) {
            if (Array.isArray(arr)) return arr;
            if (Symbol.iterator in Object(arr)) return sliceIterator(arr, i);
            throw new TypeError("Invalid attempt to destructure non-iterable instance");
        };
    }();
    exports.matcher = function(pattern) {
        return ("*" === pattern ? matchers.wildcard : _utils.is.array(pattern) ? matchers.array : _utils.is.func(pattern) ? matchers.predicate : matchers.default)(pattern);
    }, exports.take = function(pattern) {
        if (arguments.length > 0 && _utils.is.undef(pattern)) throw new Error(INVALID_PATTERN);
        return effect(TAKE, _utils.is.undef(pattern) ? "*" : pattern);
    }, exports.put = function(action) {
        return effect(PUT, action);
    }, exports.race = function(effects) {
        return effect(RACE, effects);
    }, exports.call = function(fn) {
        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) args[_key - 1] = arguments[_key];
        return effect(CALL, getFnCallDesc(fn, args));
    }, exports.apply = function(context, fn) {
        var args = arguments.length <= 2 || void 0 === arguments[2] ? [] : arguments[2];
        return effect(CALL, getFnCallDesc({
            context: context,
            fn: fn
        }, args));
    }, exports.cps = function(fn) {
        for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) args[_key2 - 1] = arguments[_key2];
        return effect(CPS, getFnCallDesc(fn, args));
    }, exports.fork = function(fn) {
        for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) args[_key3 - 1] = arguments[_key3];
        return effect(FORK, getFnCallDesc(fn, args));
    }, exports.join = function(taskDesc) {
        if (!isForkedTask(taskDesc)) throw new Error(JOIN_ARG_ERROR);
        return effect(JOIN, taskDesc);
    }, exports.cancel = function(taskDesc) {
        if (!isForkedTask(taskDesc)) throw new Error(CANCEL_ARG_ERROR);
        return effect(CANCEL, taskDesc);
    }, exports.select = function(selector) {
        for (var _len4 = arguments.length, args = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) args[_key4 - 1] = arguments[_key4];
        return 0 === arguments.length ? selector = _utils.ident : (0, _utils.check)(selector, _utils.is.func, SELECT_ARG_ERROR), 
        effect(SELECT, {
            selector: selector,
            args: args
        });
    };
    var _utils = __webpack_require__(19), CALL_FUNCTION_ARG_ERROR = exports.CALL_FUNCTION_ARG_ERROR = "call/cps/fork first argument must be a function, an array [context, function] or an object {context, fn}", JOIN_ARG_ERROR = (exports.FORK_ARG_ERROR = "fork first argument must be a generator function or an iterator", 
    exports.JOIN_ARG_ERROR = "join argument must be a valid task (a result of a fork)"), CANCEL_ARG_ERROR = exports.CANCEL_ARG_ERROR = "cancel argument must be a valid task (a result of a fork)", INVALID_PATTERN = exports.INVALID_PATTERN = "Invalid pattern passed to `take` (HINT: check if you didn't mispell a constant)", SELECT_ARG_ERROR = exports.SELECT_ARG_ERROR = "select first argument must be a function", IO = (0, 
    _utils.sym)("IO"), TAKE = "TAKE", PUT = "PUT", RACE = "RACE", CALL = "CALL", CPS = "CPS", FORK = "FORK", JOIN = "JOIN", CANCEL = "CANCEL", SELECT = "SELECT", effect = function(type, payload) {
        var _ref;
        return _ref = {}, _defineProperty(_ref, IO, !0), _defineProperty(_ref, type, payload), 
        _ref;
    }, matchers = {
        wildcard: function() {
            return _utils.kTrue;
        },
        default: function(pattern) {
            return function(input) {
                return input.type === pattern;
            };
        },
        array: function(patterns) {
            return function(input) {
                return patterns.some(function(p) {
                    return p === input.type;
                });
            };
        },
        predicate: function(_predicate) {
            return function(input) {
                return _predicate(input);
            };
        }
    }, isForkedTask = function(task) {
        return task[_utils.TASK];
    };
    exports.asEffect = {
        take: function(effect) {
            return effect && effect[IO] && effect[TAKE];
        },
        put: function(effect) {
            return effect && effect[IO] && effect[PUT];
        },
        race: function(effect) {
            return effect && effect[IO] && effect[RACE];
        },
        call: function(effect) {
            return effect && effect[IO] && effect[CALL];
        },
        cps: function(effect) {
            return effect && effect[IO] && effect[CPS];
        },
        fork: function(effect) {
            return effect && effect[IO] && effect[FORK];
        },
        join: function(effect) {
            return effect && effect[IO] && effect[JOIN];
        },
        cancel: function(effect) {
            return effect && effect[IO] && effect[CANCEL];
        },
        select: function(effect) {
            return effect && effect[IO] && effect[SELECT];
        }
    };
}, function(module, exports, __webpack_require__) {
    "use strict";
    function SagaCancellationException(type, saga, origin) {
        var message = "SagaCancellationException; type: " + type + ", saga: " + saga + ", origin: " + origin;
        this.name = "SagaCancellationException", this.message = message, this.type = type, 
        this.saga = saga, this.origin = origin, this.stack = new Error().stack;
    }
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), exports.default = SagaCancellationException, (SagaCancellationException.prototype = Object.create(Error.prototype)).constructor = SagaCancellationException;
}, function(module, exports) {
    var objectProto = Object.prototype;
    module.exports = function(value) {
        var Ctor = value && value.constructor;
        return value === ("function" == typeof Ctor && Ctor.prototype || objectProto);
    };
}, function(module, exports, __webpack_require__) {
    function Stack(entries) {
        var data = this.__data__ = new ListCache(entries);
        this.size = data.size;
    }
    var ListCache = __webpack_require__(49), stackClear = __webpack_require__(220), stackDelete = __webpack_require__(221), stackGet = __webpack_require__(222), stackHas = __webpack_require__(223), stackSet = __webpack_require__(224);
    Stack.prototype.clear = stackClear, Stack.prototype.delete = stackDelete, Stack.prototype.get = stackGet, 
    Stack.prototype.has = stackHas, Stack.prototype.set = stackSet, module.exports = Stack;
}, function(module, exports, __webpack_require__) {
    var getPrototype = __webpack_require__(120)(Object.getPrototypeOf, Object);
    module.exports = getPrototype;
}, function(module, exports) {
    function defaultSetTimout() {
        throw new Error("setTimeout has not been defined");
    }
    function defaultClearTimeout() {
        throw new Error("clearTimeout has not been defined");
    }
    function runTimeout(fun) {
        if (cachedSetTimeout === setTimeout) return setTimeout(fun, 0);
        if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) return cachedSetTimeout = setTimeout, 
        setTimeout(fun, 0);
        try {
            return cachedSetTimeout(fun, 0);
        } catch (e) {
            try {
                return cachedSetTimeout.call(null, fun, 0);
            } catch (e) {
                return cachedSetTimeout.call(this, fun, 0);
            }
        }
    }
    function runClearTimeout(marker) {
        if (cachedClearTimeout === clearTimeout) return clearTimeout(marker);
        if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) return cachedClearTimeout = clearTimeout, 
        clearTimeout(marker);
        try {
            return cachedClearTimeout(marker);
        } catch (e) {
            try {
                return cachedClearTimeout.call(null, marker);
            } catch (e) {
                return cachedClearTimeout.call(this, marker);
            }
        }
    }
    function cleanUpNextTick() {
        draining && currentQueue && (draining = !1, currentQueue.length ? queue = currentQueue.concat(queue) : queueIndex = -1, 
        queue.length && drainQueue());
    }
    function drainQueue() {
        if (!draining) {
            var timeout = runTimeout(cleanUpNextTick);
            draining = !0;
            for (var len = queue.length; len; ) {
                for (currentQueue = queue, queue = []; ++queueIndex < len; ) currentQueue && currentQueue[queueIndex].run();
                queueIndex = -1, len = queue.length;
            }
            currentQueue = null, draining = !1, runClearTimeout(timeout);
        }
    }
    function Item(fun, array) {
        this.fun = fun, this.array = array;
    }
    function noop() {}
    var cachedSetTimeout, cachedClearTimeout, process = module.exports = {};
    !function() {
        try {
            cachedSetTimeout = "function" == typeof setTimeout ? setTimeout : defaultSetTimout;
        } catch (e) {
            cachedSetTimeout = defaultSetTimout;
        }
        try {
            cachedClearTimeout = "function" == typeof clearTimeout ? clearTimeout : defaultClearTimeout;
        } catch (e) {
            cachedClearTimeout = defaultClearTimeout;
        }
    }();
    var currentQueue, queue = [], draining = !1, queueIndex = -1;
    process.nextTick = function(fun) {
        var args = new Array(arguments.length - 1);
        if (arguments.length > 1) for (var i = 1; i < arguments.length; i++) args[i - 1] = arguments[i];
        queue.push(new Item(fun, args)), 1 !== queue.length || draining || runTimeout(drainQueue);
    }, Item.prototype.run = function() {
        this.fun.apply(null, this.array);
    }, process.title = "browser", process.browser = !0, process.env = {}, process.argv = [], 
    process.version = "", process.versions = {}, process.on = noop, process.addListener = noop, 
    process.once = noop, process.off = noop, process.removeListener = noop, process.removeAllListeners = noop, 
    process.emit = noop, process.binding = function(name) {
        throw new Error("process.binding is not supported");
    }, process.cwd = function() {
        return "/";
    }, process.chdir = function(dir) {
        throw new Error("process.chdir is not supported");
    }, process.umask = function() {
        return 0;
    };
}, function(module, exports, __webpack_require__) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), exports.ports = {
        bridge: "bridge",
        background: "message:to-priv",
        broadcast: "message:to-non-priv"
    };
}, function(module, exports, __webpack_require__) {
    var isObject = __webpack_require__(8), now = __webpack_require__(280), toNumber = __webpack_require__(189), FUNC_ERROR_TEXT = "Expected a function", nativeMax = Math.max, nativeMin = Math.min;
    module.exports = function(func, wait, options) {
        function invokeFunc(time) {
            var args = lastArgs, thisArg = lastThis;
            return lastArgs = lastThis = void 0, lastInvokeTime = time, result = func.apply(thisArg, args);
        }
        function leadingEdge(time) {
            return lastInvokeTime = time, timerId = setTimeout(timerExpired, wait), leading ? invokeFunc(time) : result;
        }
        function remainingWait(time) {
            var timeSinceLastInvoke = time - lastInvokeTime, result = wait - (time - lastCallTime);
            return maxing ? nativeMin(result, maxWait - timeSinceLastInvoke) : result;
        }
        function shouldInvoke(time) {
            var timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime;
            return void 0 === lastCallTime || timeSinceLastCall >= wait || timeSinceLastCall < 0 || maxing && timeSinceLastInvoke >= maxWait;
        }
        function timerExpired() {
            var time = now();
            if (shouldInvoke(time)) return trailingEdge(time);
            timerId = setTimeout(timerExpired, remainingWait(time));
        }
        function trailingEdge(time) {
            return timerId = void 0, trailing && lastArgs ? invokeFunc(time) : (lastArgs = lastThis = void 0, 
            result);
        }
        function debounced() {
            var time = now(), isInvoking = shouldInvoke(time);
            if (lastArgs = arguments, lastThis = this, lastCallTime = time, isInvoking) {
                if (void 0 === timerId) return leadingEdge(lastCallTime);
                if (maxing) return timerId = setTimeout(timerExpired, wait), invokeFunc(lastCallTime);
            }
            return void 0 === timerId && (timerId = setTimeout(timerExpired, wait)), result;
        }
        var lastArgs, lastThis, maxWait, result, timerId, lastCallTime, lastInvokeTime = 0, leading = !1, maxing = !1, trailing = !0;
        if ("function" != typeof func) throw new TypeError(FUNC_ERROR_TEXT);
        return wait = toNumber(wait) || 0, isObject(options) && (leading = !!options.leading, 
        maxWait = (maxing = "maxWait" in options) ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait, 
        trailing = "trailing" in options ? !!options.trailing : trailing), debounced.cancel = function() {
            void 0 !== timerId && clearTimeout(timerId), lastInvokeTime = 0, lastArgs = lastCallTime = lastThis = timerId = void 0;
        }, debounced.flush = function() {
            return void 0 === timerId ? result : trailingEdge(now());
        }, debounced;
    };
}, function(module, exports, __webpack_require__) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    });
    !function(SafePromise) {
        function create(run) {
            return new Promise(run);
        }
        SafePromise.create = create, SafePromise.createCompletionSource = function() {
            var res, rej;
            return {
                promise: new Promise(function(res_, rej_) {
                    res = res_, rej = rej_;
                }),
                resolve: function(v) {
                    res(v);
                },
                reject: function(err) {
                    rej(err);
                }
            };
        }, SafePromise.sync = function(run) {
            return create(function(r, _) {
                return r(run());
            });
        };
    }(exports.SafePromise || (exports.SafePromise = {}));
}, function(module, exports) {
    var MAX_SAFE_INTEGER = 9007199254740991, reIsUint = /^(?:0|[1-9]\d*)$/;
    module.exports = function(value, length) {
        return !!(length = null == length ? MAX_SAFE_INTEGER : length) && ("number" == typeof value || reIsUint.test(value)) && value > -1 && value % 1 == 0 && value < length;
    };
}, function(module, exports, __webpack_require__) {
    var baseMatches = __webpack_require__(213), baseMatchesProperty = __webpack_require__(251), identity = __webpack_require__(54), isArray = __webpack_require__(7), property = __webpack_require__(260);
    module.exports = function(value) {
        return "function" == typeof value ? value : null == value ? identity : "object" == typeof value ? isArray(value) ? baseMatchesProperty(value[0], value[1]) : baseMatches(value) : property(value);
    };
}, function(module, exports, __webpack_require__) {
    var defineProperty = __webpack_require__(130);
    module.exports = function(object, key, value) {
        "__proto__" == key && defineProperty ? defineProperty(object, key, {
            configurable: !0,
            enumerable: !0,
            value: value,
            writable: !0
        }) : object[key] = value;
    };
}, function(module, exports, __webpack_require__) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), exports.t = {
        SETTINGS_INITIAL: "settings/SETTINGS_INITIAL",
        TOGGLE_DEFS: "settings/TOGGLE_DEFS",
        TOGGLE_SITE: "settings/TOGGLE_SITE",
        TOGGLE_FIELD: "settings/TOGGLE_FIELD",
        TOGGLE_POPUP: "settings/TOGGLE_POPUP",
        TOGGLE_EMAIL_PERCEPTION: "settings/TOGGLE_EMAIL_PERCEPTION",
        DISABLE_ON_TAB: "settings/DISABLE_ON_TAB",
        DISABLE_REMINDER_NOTIFICATION: "settings/DISABLE_REMINDER_NOTIFICATION",
        SHOW_DISABLE_REMINDER: "settings/SHOW_DISABLE_REMINDER",
        SHOW_NEWS: "settings/SHOW_NEWS",
        SEEN_NEWS: "settings/SEEN_NEWS",
        SEEN_GDOCS_OPT_IN: "settings/SEEN_GDOCS_OPT_IN",
        SET_GDOCS_INITIAL_DISABLE: "setting/SET_GDOCS_INITIAL_DISABLE",
        SHOW_ONBOARDING: "settings/SHOW_ONBOARDING",
        SEEN_ONBOARDING: "settings/SEEN_ONBOARDING",
        SET_DAPI_PROP: "settings/SET_DAPI_PROP",
        CHANGE_WEAK_DIALECT: "settings/CHANGE_WEAK_DIALECT",
        CHANGE_STRONG_DIALECT: "settings/CHANGE_STRONG_DIALECT",
        SAVE_ANONYMOUS_PROPERTIES: "settings/SAVE_ANONYMOUS_PROPERTIES",
        ACTIVATE_EMAIL_PERCEPTION: "settings/ACTIVATE_EMAIL_PERCEPTION",
        SAVE_FEEDBACK_DATA: "settings/SAVE_FEEDBACK_DATA",
        SEEN_EMAIL_PERCEPTION_POPUP: "settings/EMAIL_PERCEPTION_POPUP_SEEN",
        EDGE_POPUP_HACK_FROM_GBUTTON: "settings/EDGE_POPUP_HACK_FROM_GBUTTON"
    }, exports.DAPI_ACTIONS = [ exports.t.CHANGE_WEAK_DIALECT, exports.t.CHANGE_STRONG_DIALECT ], 
    exports.CACHED_ACTIONS = [ exports.t.TOGGLE_DEFS, exports.t.TOGGLE_SITE, exports.t.TOGGLE_FIELD, exports.t.TOGGLE_EMAIL_PERCEPTION, exports.t.SEEN_NEWS, exports.t.SEEN_GDOCS_OPT_IN, exports.t.SET_GDOCS_INITIAL_DISABLE, exports.t.SHOW_ONBOARDING, exports.t.SEEN_ONBOARDING, exports.t.SEEN_EMAIL_PERCEPTION_POPUP, exports.t.SHOW_DISABLE_REMINDER, exports.t.DISABLE_REMINDER_NOTIFICATION, exports.t.EDGE_POPUP_HACK_FROM_GBUTTON ], 
    exports.setDapiProp = function(propKey, data) {
        return {
            type: exports.t.SET_DAPI_PROP,
            propKey: propKey,
            data: data
        };
    }, exports.changeWeakDialect = function(data) {
        return {
            type: exports.t.CHANGE_WEAK_DIALECT,
            data: data
        };
    }, exports.changeStrongDialect = function(data) {
        return {
            type: exports.t.CHANGE_STRONG_DIALECT,
            data: data
        };
    }, exports.initialSettings = function(data) {
        return {
            type: exports.t.SETTINGS_INITIAL,
            data: data
        };
    }, exports.toggleDefs = function(enabledDefs) {
        return {
            type: exports.t.TOGGLE_DEFS,
            enabledDefs: enabledDefs
        };
    }, exports.toggleSite = function(enabled, domain) {
        return {
            type: exports.t.TOGGLE_SITE,
            domain: domain,
            enabled: enabled
        };
    }, exports.toggleField = function(data, domain) {
        return {
            type: exports.t.TOGGLE_FIELD,
            domain: domain,
            data: data
        };
    }, exports.toggleEmailPerception = function(enabledEmailPerception) {
        return {
            type: exports.t.TOGGLE_EMAIL_PERCEPTION,
            enabledEmailPerception: enabledEmailPerception
        };
    }, exports.seenNews = function() {
        return {
            type: exports.t.SEEN_NEWS
        };
    }, exports.gdocsDisabledInitially = function() {
        return {
            type: exports.t.SET_GDOCS_INITIAL_DISABLE
        };
    }, exports.seenGdocsOptIn = function() {
        return {
            type: exports.t.SEEN_GDOCS_OPT_IN
        };
    }, exports.showOnboarding = function() {
        return {
            type: exports.t.SHOW_ONBOARDING
        };
    }, exports.seenOnboarding = function() {
        return {
            type: exports.t.SEEN_ONBOARDING
        };
    }, exports.showNews = function(showNews) {
        return {
            type: exports.t.SHOW_NEWS,
            showNews: showNews
        };
    }, exports.togglePopup = function(isPopupDisabled) {
        return {
            type: exports.t.TOGGLE_POPUP,
            isPopupDisabled: isPopupDisabled
        };
    }, exports.activateEmailPerception = function(activeEmailPerception) {
        return {
            type: exports.t.ACTIVATE_EMAIL_PERCEPTION,
            activeEmailPerception: activeEmailPerception
        };
    }, exports.saveAnonymousProps = function(props) {
        return {
            type: exports.t.SAVE_ANONYMOUS_PROPERTIES,
            props: props
        };
    }, exports.seenEmailPerceptionPopup = function(seenEmailPerceptionPopupDate) {
        return {
            type: exports.t.SEEN_EMAIL_PERCEPTION_POPUP,
            seenEmailPerceptionPopupDate: seenEmailPerceptionPopupDate
        };
    }, exports.saveFeedbackData = function(subject, docId) {
        return {
            type: exports.t.SAVE_FEEDBACK_DATA,
            subject: subject,
            docId: docId
        };
    }, exports.disableOnTab = function() {
        return {
            type: exports.t.DISABLE_ON_TAB
        };
    }, exports.showDisableReminder = function(domain) {
        return {
            type: exports.t.SHOW_DISABLE_REMINDER,
            domain: domain
        };
    }, exports.disableReminder = function(domain) {
        return {
            type: exports.t.DISABLE_REMINDER_NOTIFICATION,
            domain: domain
        };
    }, exports.showEdgePopupHackFromGButton = function() {
        return {
            type: exports.t.EDGE_POPUP_HACK_FROM_GBUTTON
        };
    };
}, , function(module, exports, __webpack_require__) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    });
    var stdlib_1 = __webpack_require__(4), url_1 = __webpack_require__(70), services_1 = __webpack_require__(71);
    !function(AppConfig) {
        var forgeExtensionId = "87677a2c52b84ad3a151a4a72f5bd3c4", grammarlyProdDomain = "grammarly.com", newsVersion = 0;
        AppConfig.create = function(browser, env, edgePopupUrl, emptyScriptUrl) {
            var felogUrl = "prod" === env ? "https://f-log-extension.grammarly.io" : "qa" === env || "dev" === env ? "https://127.0.0.1:8000" : stdlib_1.assertNever(env), sumoLogicUrl = "prod" === env ? "https://endpoint2.collection.us2.sumologic.com/receiver/v1/http/ZaVnC4dhaV1OF-4ic11yqpre0casnyvs_ZoaCHciEYdRyBkrfwP6DMlsWt8tSVU76RPqgGvAGjXGQk_UNuxPx-pYbToJapM_Fr0CUcgKaA8_IVl-lhSr5Q==" : "qa" === env || "dev" === env ? "https://127.0.0.1:8000" : stdlib_1.assertNever(env), gnarDomain = "prod" === env ? grammarlyProdDomain : "qa" === env || "dev" === env ? "qagr.io" : stdlib_1.assertNever(env);
            return {
                url: url_1.UrlConfig.create(grammarlyProdDomain, felogUrl, sumoLogicUrl, edgePopupUrl, emptyScriptUrl),
                gnar: services_1.GnarConfig.create(browser, gnarDomain),
                felog: services_1.FelogConfig.create(browser),
                sumologic: services_1.SumoLogicConfig.create(browser),
                extensionId: forgeExtensionId,
                newsVersion: newsVersion
            };
        };
    }(exports.AppConfig || (exports.AppConfig = {}));
}, function(module, exports, __webpack_require__) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    });
    !function(UrlConfig) {
        UrlConfig.create = function(grammarlyDomain, felogUrl, sumologicUrl, edgePopupUrl, emptyScriptUrl) {
            var funnel = "https://www." + grammarlyDomain, dapi = "https://data." + grammarlyDomain, editor = "https://app." + grammarlyDomain, auth = "https://auth." + grammarlyDomain + "/v3";
            return {
                app: editor,
                appPersonalDictionary: editor + "/profile/dictionary",
                capi: "wss://capi." + grammarlyDomain + "/freews",
                dapiMimic: dapi + "/api/mimic",
                dapiProps: dapi + "/api/props",
                editorDictionary: editor + "/profile/dictionary",
                dictionary: "https://capi." + grammarlyDomain + "/api/defs",
                docs: editor + "/docs",
                docsApi: "https://dox." + grammarlyDomain + "/documents",
                newDoc: editor + "/docs/new",
                userOrAnonymous: auth + "/user/oranonymous",
                authSignin: auth + "/api/login",
                authSignup: auth + "/api/signup",
                signin: funnel + "/signin",
                signup: funnel + "/signup",
                fbSignin: funnel + "/signin?fromExtensionFb=true",
                fbSignup: funnel + "/signup?fromExtensionFb=true",
                googleSignin: funnel + "/signin?fromExtensionGoogle=true",
                googleSignup: funnel + "/signup?fromExtensionGoogle=true",
                resetPassword: funnel + "/resetpassword",
                saveEmailFeedback: "https://emailfeedback." + grammarlyDomain + "/api/feedback/",
                newFelog: felogUrl,
                sumoLogic: sumologicUrl,
                welcomeC: funnel + "/extension-success",
                afterInstall: funnel + "/after_install_page",
                upgrade: funnel + "/upgrade",
                uninstall: funnel + "/extension-uninstall",
                terms: funnel + "/terms",
                policy: funnel + "/privacy-policy",
                pageConfigUrl: "https://d3cv4a9a9wh0bt.cloudfront.net/browserplugin/config.json",
                edgePopupUrl: edgePopupUrl,
                emptyScriptUrl: emptyScriptUrl,
                grammarlyDomain: grammarlyDomain
            };
        };
    }(exports.UrlConfig || (exports.UrlConfig = {}));
}, function(module, exports, __webpack_require__) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    });
    var stdlib_1 = __webpack_require__(4);
    !function(GnarConfig) {
        var gnarAppName = {
            chrome: "chromeExt",
            firefox: "firefoxExt",
            safari: "safariExt",
            edge: "edgeExt"
        };
        GnarConfig.create = function(browserType, domain) {
            return {
                appName: stdlib_1.assertNonNull(gnarAppName[browserType], "gnar app name"),
                url: "https://gnar." + domain,
                domain: "." + domain,
                sendEmailInfoTracking: !1
            };
        };
    }(exports.GnarConfig || (exports.GnarConfig = {}));
    !function(FelogConfig) {
        var felogAppName = {
            chrome: "extensionChrome",
            firefox: "extensionFirefox",
            safari: "extensionSafari",
            edge: "extensionEdge"
        };
        FelogConfig.create = function(browser) {
            return {
                appName: stdlib_1.assertNonNull(felogAppName[browser], "felog app name"),
                sendUsageMetrics: !1,
                sendPerfMetrics: !1
            };
        };
    }(exports.FelogConfig || (exports.FelogConfig = {}));
    !function(SumoLogicConfig) {
        var sumoLogicAppName = {
            chrome: "extensionChrome",
            firefox: "extensionFirefox",
            safari: "extensionSafari",
            edge: "extensionEdge"
        };
        SumoLogicConfig.create = function(browser) {
            return {
                appName: stdlib_1.assertNonNull(sumoLogicAppName[browser], "sumologic app name")
            };
        };
    }(exports.SumoLogicConfig || (exports.SumoLogicConfig = {}));
}, function(module, exports, __webpack_require__) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    });
    var stdlib_1 = __webpack_require__(4), log = __webpack_require__(1).Logger.create("config.build");
    !function(BuildInfo) {
        BuildInfo.create = function(major, minor, patch, browser, env, branch, commit) {
            var branch_ = void 0 !== branch && void 0 !== commit ? branch : "UNVERSIONED", manifestVersion = major + "." + minor + "." + patch;
            return {
                version: manifestVersion,
                fullVersion: manifestVersion + "-" + [ browser, [ "prod" !== env ? env : null, branch_ !== browser ? branch_ : null ].filter(function(x) {
                    return !!x;
                }).join(".") ].filter(function(x) {
                    return "" !== x;
                }).join("/"),
                commitHash: commit,
                gitBranch: branch
            };
        }, BuildInfo.getManifestVersion = function(browser, context, win) {
            try {
                switch (browser) {
                  case "safari":
                    switch (context) {
                      case "bg":
                      case "popup":
                        return win.safari.extension.displayVersion;

                      default:
                        return;
                    }

                  case "chrome":
                    return win.chrome.runtime.getManifest().version;

                  case "firefox":
                    return win.firefox.runtime.getManifest().version;

                  case "edge":
                    return win.edge.runtime.getManifest().version;

                  default:
                    return stdlib_1.assertNever(browser);
                }
            } catch (e) {
                return void log.error("Could not get extension version from manifest", e);
            }
        };
    }(exports.BuildInfo || (exports.BuildInfo = {}));
}, function(module, exports, __webpack_require__) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    });
    var logWriter_1 = __webpack_require__(74), common_1 = __webpack_require__(23), logFilter_1 = __webpack_require__(75);
    !function(LogConfig) {
        function updateGlobal(updates) {
            globalConfig = Object.assign({}, globalConfig, updates);
        }
        LogConfig.defaultConfig = {
            writer: new logWriter_1.ConsoleLogWriter({
                useColors: !1
            }),
            filterFn: function(_) {
                return !0;
            }
        };
        var globalConfig = LogConfig.defaultConfig;
        LogConfig.getGlobal = function() {
            return globalConfig;
        }, LogConfig.updateGlobal = updateGlobal, LogConfig.configure = function(options) {
            updateGlobal({
                writer: new logWriter_1.ConsoleLogWriter({
                    useColors: !options.edge
                }),
                filterFn: options.prodCs ? logFilter_1.logLevelFilter(common_1.LogLevel.WARN) : function(_) {
                    return !0;
                }
            });
        };
    }(exports.LogConfig || (exports.LogConfig = {}));
}, function(module, exports, __webpack_require__) {
    "use strict";
    var __read = this && this.__read || function(o, n) {
        var m = "function" == typeof Symbol && o[Symbol.iterator];
        if (!m) return o;
        var r, e, i = m.call(o), ar = [];
        try {
            for (;(void 0 === n || n-- > 0) && !(r = i.next()).done; ) ar.push(r.value);
        } catch (error) {
            e = {
                error: error
            };
        } finally {
            try {
                r && !r.done && (m = i.return) && m.call(i);
            } finally {
                if (e) throw e.error;
            }
        }
        return ar;
    }, __spread = this && this.__spread || function() {
        for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
        return ar;
    };
    Object.defineProperty(exports, "__esModule", {
        value: !0
    });
    var common_1 = __webpack_require__(23), FunctionLogWriter = function() {
        return function(write) {
            this.write = write;
        };
    }();
    exports.FunctionLogWriter = FunctionLogWriter;
    var ConsoleLogWriter = function() {
        function ConsoleLogWriter(_config) {
            void 0 === _config && (_config = {
                useColors: !0
            }), this._config = _config, this._writeColor = function(event) {
                var cfg = ConsoleLogWriter._outputConfigMap[event.level];
                cfg && cfg.writeFunc.apply(cfg, __spread([ "%c" + event.loggerName + "%c %c" + event.level + "%c %c" + event.message, "font-weight: bold; color: #00b", "", "color: " + cfg.foreground + "; background: " + cfg.background, "", "", "", event.data || event.exception, event.data && event.exception ].filter(function(x) {
                    return void 0 !== x;
                })));
            }, this._writeMonochrome = function(event) {
                var cfg = ConsoleLogWriter._outputConfigMap[event.level];
                cfg && cfg.writeFunc.apply(cfg, __spread([ event.loggerName + " [" + event.level + "] " + event.message, event.data || event.exception, event.data && event.exception ].filter(function(x) {
                    return void 0 !== x;
                })));
            }, this.write = this._config.useColors ? this._writeColor : this._writeMonochrome;
        }
        return ConsoleLogWriter._outputConfigMap = (_a = {}, _a[common_1.LogLevel.TRACE] = {
            writeFunc: console.log.bind(console),
            foreground: "#fff",
            background: "#bbb"
        }, _a[common_1.LogLevel.DEBUG] = {
            writeFunc: console.log.bind(console),
            foreground: "#fff",
            background: "#666"
        }, _a[common_1.LogLevel.INFO] = {
            writeFunc: console.info.bind(console),
            foreground: "#000",
            background: ""
        }, _a[common_1.LogLevel.WARN] = {
            writeFunc: console.warn.bind(console),
            foreground: "",
            background: ""
        }, _a[common_1.LogLevel.ERROR] = {
            writeFunc: console.error.bind(console),
            foreground: "",
            background: ""
        }, _a[common_1.LogLevel.FATAL] = {
            writeFunc: console.error.bind(console),
            foreground: "#fff",
            background: "#f00"
        }, _a), ConsoleLogWriter;
    }();
    exports.ConsoleLogWriter = ConsoleLogWriter;
    var _a;
}, function(module, exports, __webpack_require__) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    });
    var common_1 = __webpack_require__(23);
    exports.logLevelFilter = function(level) {
        return function(event) {
            return common_1.getLogRank(event.level) >= common_1.getLogRank(level);
        };
    };
}, function(module, exports, __webpack_require__) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    });
    var BrowserInfo, bundle_1 = __webpack_require__(28), stdlib_1 = __webpack_require__(4);
    !function(BrowserInfo) {
        BrowserInfo.create = function(targetBrowser, win) {
            return {
                type: bundle_1.TargetBrowser.detect(win) || "other",
                isWE: "firefox" === targetBrowser ? stdlib_1.try_(function() {
                    return !!firefox.runtime;
                }, function(_) {
                    return !1;
                }) : "chrome" === targetBrowser || "edge" === targetBrowser
            };
        };
    }(BrowserInfo = exports.BrowserInfo || (exports.BrowserInfo = {}));
    var OsInfo;
    !function(OsInfo) {
        OsInfo.create = function(win) {
            return {
                isWindows: -1 !== win.navigator.appVersion.indexOf("Win")
            };
        };
    }(OsInfo = exports.OsInfo || (exports.OsInfo = {}));
    !function(SystemInfo) {
        SystemInfo.create = function(targetBrowser, win) {
            return {
                browser: BrowserInfo.create(targetBrowser, win),
                os: OsInfo.create(win)
            };
        };
    }(exports.SystemInfo || (exports.SystemInfo = {}));
}, function(module, exports, __webpack_require__) {
    "use strict";
    var __read = this && this.__read || function(o, n) {
        var m = "function" == typeof Symbol && o[Symbol.iterator];
        if (!m) return o;
        var r, e, i = m.call(o), ar = [];
        try {
            for (;(void 0 === n || n-- > 0) && !(r = i.next()).done; ) ar.push(r.value);
        } catch (error) {
            e = {
                error: error
            };
        } finally {
            try {
                r && !r.done && (m = i.return) && m.call(i);
            } finally {
                if (e) throw e.error;
            }
        }
        return ar;
    };
    Object.defineProperty(exports, "__esModule", {
        value: !0
    });
    var app_1 = __webpack_require__(69), build_1 = __webpack_require__(72), system_1 = __webpack_require__(76), bundle_1 = __webpack_require__(28), stdlib_1 = __webpack_require__(4), log = __webpack_require__(1).Logger.create("config.mainConfig");
    !function(ProcessEnv) {
        function create(env, major_number, build_number, release_number, git_branch, git_commit, edge_popup_url, empty_script_url) {
            return {
                env: env,
                major_number: major_number,
                build_number: build_number,
                release_number: release_number,
                git_branch: git_branch,
                git_commit: git_commit,
                edge_popup_url: edge_popup_url,
                empty_script_url: empty_script_url
            };
        }
        ProcessEnv.create = create, ProcessEnv.fromBrowserify = function() {
            return create("prod", "14", "824", "1430", "UNVERSIONED", "1057d40944dd72e28f328226b4a179963cf67e65", "", "");
        };
    }(exports.ProcessEnv || (exports.ProcessEnv = {}));
    !function(MainConfig) {
        MainConfig.create = function(browser, context, processEnv) {
            var env_;
            if (processEnv.env) {
                var e = bundle_1.TargetEnv.create(processEnv.env);
                void 0 !== e ? env_ = e : (log.warn("*** process.env.ENV is invalid ('" + processEnv.env + "'), assuming 'prod' env"), 
                env_ = "prod");
            } else log.warn("*** process.env.ENV is not defined, assuming 'prod' env"), env_ = "prod";
            var finalVersion, env = stdlib_1.assertNonNull(env_, "ENV env var OR a fallback value"), processEnvVersion = [ processEnv.major_number, processEnv.build_number, processEnv.release_number ].map(stdlib_1.optionalIntString);
            if (3 === processEnvVersion.length && processEnvVersion.every(function(x) {
                return void 0 !== x;
            })) finalVersion = processEnvVersion; else {
                var manifestVersion = (build_1.BuildInfo.getManifestVersion(browser, context, window) || "").split(".").map(stdlib_1.optionalIntString);
                finalVersion = 3 === manifestVersion.length && manifestVersion.every(function(x) {
                    return void 0 !== x;
                }) ? manifestVersion : [ 0, 0, 0 ];
            }
            var _a = __read(finalVersion, 3), versionMajor = _a[0], versionMinor = _a[1], versionPatch = _a[2];
            return {
                buildInfo: build_1.BuildInfo.create(versionMajor, versionMinor, versionPatch, browser, env, processEnv.git_branch, processEnv.git_commit),
                bundleInfo: bundle_1.BundleInfo.create(browser, env, context),
                appConfig: app_1.AppConfig.create(browser, env, processEnv.edge_popup_url, processEnv.empty_script_url),
                systemInfo: system_1.SystemInfo.create(browser, window)
            };
        };
    }(exports.MainConfig || (exports.MainConfig = {}));
}, function(module, exports) {
    var MAX_SAFE_INTEGER = 9007199254740991;
    module.exports = function(value) {
        return "number" == typeof value && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
    };
}, function(module, exports, __webpack_require__) {
    var Map = __webpack_require__(25)(__webpack_require__(12), "Map");
    module.exports = Map;
}, function(module, exports, __webpack_require__) {
    function MapCache(entries) {
        var index = -1, length = null == entries ? 0 : entries.length;
        for (this.clear(); ++index < length; ) {
            var entry = entries[index];
            this.set(entry[0], entry[1]);
        }
    }
    var mapCacheClear = __webpack_require__(229), mapCacheDelete = __webpack_require__(236), mapCacheGet = __webpack_require__(238), mapCacheHas = __webpack_require__(239), mapCacheSet = __webpack_require__(240);
    MapCache.prototype.clear = mapCacheClear, MapCache.prototype.delete = mapCacheDelete, 
    MapCache.prototype.get = mapCacheGet, MapCache.prototype.has = mapCacheHas, MapCache.prototype.set = mapCacheSet, 
    module.exports = MapCache;
}, function(module, exports, __webpack_require__) {
    function baseIsEqual(value, other, bitmask, customizer, stack) {
        return value === other || (null == value || null == other || !isObjectLike(value) && !isObjectLike(other) ? value !== value && other !== other : baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack));
    }
    var baseIsEqualDeep = __webpack_require__(241), isObjectLike = __webpack_require__(18);
    module.exports = baseIsEqual;
}, function(module, exports, __webpack_require__) {
    var isArray = __webpack_require__(7), isKey = __webpack_require__(83), stringToPath = __webpack_require__(253), toString = __webpack_require__(162);
    module.exports = function(value, object) {
        return isArray(value) ? value : isKey(value, object) ? [ value ] : stringToPath(toString(value));
    };
}, function(module, exports, __webpack_require__) {
    var isArray = __webpack_require__(7), isSymbol = __webpack_require__(53), reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, reIsPlainProp = /^\w*$/;
    module.exports = function(value, object) {
        if (isArray(value)) return !1;
        var type = typeof value;
        return !("number" != type && "symbol" != type && "boolean" != type && null != value && !isSymbol(value)) || reIsPlainProp.test(value) || !reIsDeepProp.test(value) || null != object && value in Object(object);
    };
}, , function(module, exports, __webpack_require__) {
    "use strict";
    function _toConsumableArray(arr) {
        if (Array.isArray(arr)) {
            for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];
            return arr2;
        }
        return Array.from(arr);
    }
    function _defineProperty(obj, key, value) {
        return key in obj ? Object.defineProperty(obj, key, {
            value: value,
            enumerable: !0,
            configurable: !0,
            writable: !0
        }) : obj[key] = value, obj;
    }
    function proc(iterator) {
        function logError(level, message, error) {
            "undefined" == typeof window ? console.log("redux-saga " + level + ": " + message + "\n" + error.stack) : console[level].call(console, message, error);
        }
        function next(error, arg) {
            if (!iterator._isRunning) throw new Error("Trying to resume an already finished generator");
            try {
                var result = error ? iterator.throw(error) : iterator.next(arg);
                result.done ? end(result.value) : runEffect(result.value, parentEffectId, "", next);
            } catch (error) {
                end(error, !0), error instanceof _SagaCancellationException2.default ? _utils.isDev && logError("warn", name + ": uncaught", error) : logError("error", name + ": uncaught", error);
            }
        }
        function end(result, isError) {
            iterator._isRunning = !1, isError ? (iterator._error = result, deferredEnd.reject(result)) : (iterator._result = result, 
            deferredEnd.resolve(result)), unsubscribe();
        }
        function runEffect(effect, parentEffectId) {
            function currCb(err, res) {
                effectSettled || (effectSettled = !0, cb.cancel = _utils.noop, monitor(err ? monitorActions.effectRejected(effectId, err) : monitorActions.effectResolved(effectId, res)), 
                cb(err, res));
            }
            var label = arguments.length <= 2 || void 0 === arguments[2] ? "" : arguments[2], cb = arguments[3], effectId = nextEffectId();
            monitor(monitorActions.effectTriggered(effectId, parentEffectId, label, effect));
            var effectSettled = void 0;
            currCb.cancel = _utils.noop, cb.cancel = function(cancelError) {
                if (!effectSettled) {
                    effectSettled = !0;
                    try {
                        currCb.cancel(cancelError);
                    } catch (err) {}
                    currCb.cancel = _utils.noop, cb(cancelError), monitor(monitorActions.effectRejected(effectId, cancelError));
                }
            };
            var data = void 0;
            return _utils.is.promise(effect) ? resolvePromise(effect, currCb) : _utils.is.iterator(effect) ? resolveIterator(effect, effectId, name, currCb) : _utils.is.array(effect) ? runParallelEffect(effect, effectId, currCb) : _utils.is.notUndef(data = _io.asEffect.take(effect)) ? runTakeEffect(data, currCb) : _utils.is.notUndef(data = _io.asEffect.put(effect)) ? runPutEffect(data, currCb) : _utils.is.notUndef(data = _io.asEffect.race(effect)) ? runRaceEffect(data, effectId, currCb) : _utils.is.notUndef(data = _io.asEffect.call(effect)) ? runCallEffect(data, effectId, currCb) : _utils.is.notUndef(data = _io.asEffect.cps(effect)) ? runCPSEffect(data, currCb) : _utils.is.notUndef(data = _io.asEffect.fork(effect)) ? runForkEffect(data, effectId, currCb) : _utils.is.notUndef(data = _io.asEffect.join(effect)) ? runJoinEffect(data, currCb) : _utils.is.notUndef(data = _io.asEffect.cancel(effect)) ? runCancelEffect(data, currCb) : _utils.is.notUndef(data = _io.asEffect.select(effect)) ? runSelectEffect(data, currCb) : currCb(null, effect);
        }
        function resolvePromise(promise, cb) {
            var cancelPromise = promise[CANCEL];
            "function" == typeof cancelPromise && (cb.cancel = cancelPromise), promise.then(function(result) {
                return cb(null, result);
            }, function(error) {
                return cb(error);
            });
        }
        function resolveIterator(iterator, effectId, name, cb) {
            resolvePromise(proc(iterator, subscribe, dispatch, getState, monitor, effectId, name).done, cb);
        }
        function runTakeEffect(pattern, cb) {
            var def = {
                match: (0, _io.matcher)(pattern),
                pattern: pattern,
                resolve: function(input) {
                    return cb(null, input);
                }
            };
            deferredInputs.push(def), cb.cancel = function() {
                return (0, _utils.remove)(deferredInputs, def);
            };
        }
        function runPutEffect(action, cb) {
            (0, _utils.asap)(function() {
                return cb(null, dispatch(action));
            });
        }
        function runCallEffect(_ref2, effectId, cb) {
            var context = _ref2.context, fn = _ref2.fn, args = _ref2.args, result = void 0;
            try {
                result = fn.apply(context, args);
            } catch (error) {
                return cb(error);
            }
            return _utils.is.promise(result) ? resolvePromise(result, cb) : _utils.is.iterator(result) ? resolveIterator(result, effectId, fn.name, cb) : cb(null, result);
        }
        function runCPSEffect(_ref3, cb) {
            var context = _ref3.context, fn = _ref3.fn, args = _ref3.args;
            try {
                fn.apply(context, args.concat(cb));
            } catch (error) {
                return cb(error);
            }
        }
        function runForkEffect(_ref4, effectId, cb) {
            var context = _ref4.context, fn = _ref4.fn, args = _ref4.args, result = void 0, error = void 0;
            try {
                result = fn.apply(context, args);
            } catch (err) {
                error = error;
            }
            cb(null, proc(_utils.is.iterator(result) ? result : (error ? regeneratorRuntime.mark(function _callee() {
                return regeneratorRuntime.wrap(function(_context) {
                    for (;;) switch (_context.prev = _context.next) {
                      case 0:
                        throw error;

                      case 1:
                      case "end":
                        return _context.stop();
                    }
                }, _callee, this);
            }) : regeneratorRuntime.mark(function _callee2() {
                return regeneratorRuntime.wrap(function(_context2) {
                    for (;;) switch (_context2.prev = _context2.next) {
                      case 0:
                        return _context2.next = 2, result;

                      case 2:
                        return _context2.abrupt("return", _context2.sent);

                      case 3:
                      case "end":
                        return _context2.stop();
                    }
                }, _callee2, this);
            }))(), subscribe, dispatch, getState, monitor, effectId, fn.name, !0));
        }
        function runJoinEffect(task, cb) {
            resolvePromise(task.done, cb);
        }
        function runCancelEffect(task, cb) {
            task.done[CANCEL](new _SagaCancellationException2.default(MANUAL_CANCEL, name, name)), 
            cb();
        }
        function runParallelEffect(effects, effectId, cb) {
            function checkEffectEnd() {
                completedCount === results.length && (completed = !0, cb(null, results));
            }
            if (effects.length) {
                var completedCount = 0, completed = void 0, results = Array(effects.length), childCbs = effects.map(function(eff, idx) {
                    var chCbAtIdx = function(err, res) {
                        if (!completed) if (err) {
                            try {
                                cb.cancel(new _SagaCancellationException2.default(PARALLEL_AUTO_CANCEL, name, name));
                            } catch (err) {}
                            cb(err);
                        } else results[idx] = res, completedCount++, checkEffectEnd();
                    };
                    return chCbAtIdx.cancel = _utils.noop, chCbAtIdx;
                });
                cb.cancel = function(cancelError) {
                    completed || (completed = !0, childCbs.forEach(function(chCb) {
                        return chCb.cancel(cancelError);
                    }));
                }, effects.forEach(function(eff, idx) {
                    return runEffect(eff, effectId, idx, childCbs[idx]);
                });
            } else cb(null, []);
        }
        function runRaceEffect(effects, effectId, cb) {
            var completed = void 0, keys = Object.keys(effects), childCbs = {};
            keys.forEach(function(key) {
                var chCbAtKey = function(err, res) {
                    if (!completed) if (err) {
                        try {
                            cb.cancel(new _SagaCancellationException2.default(RACE_AUTO_CANCEL, name, name));
                        } catch (err) {}
                        cb(_defineProperty({}, key, err));
                    } else {
                        try {
                            cb.cancel(new _SagaCancellationException2.default(RACE_AUTO_CANCEL, name, name));
                        } catch (err) {}
                        completed = !0, cb(null, _defineProperty({}, key, res));
                    }
                };
                chCbAtKey.cancel = _utils.noop, childCbs[key] = chCbAtKey;
            }), cb.cancel = function(cancelError) {
                completed || (completed = !0, keys.forEach(function(key) {
                    return childCbs[key].cancel(cancelError);
                }));
            }, keys.forEach(function(key) {
                return runEffect(effects[key], effectId, key, childCbs[key]);
            });
        }
        function runSelectEffect(_ref5, cb) {
            var selector = _ref5.selector, args = _ref5.args;
            try {
                var state = selector.apply(void 0, [ getState() ].concat(_toConsumableArray(args)));
                cb(null, state);
            } catch (error) {
                cb(error);
            }
        }
        var subscribe = arguments.length <= 1 || void 0 === arguments[1] ? function() {
            return _utils.noop;
        } : arguments[1], dispatch = arguments.length <= 2 || void 0 === arguments[2] ? _utils.noop : arguments[2], getState = arguments.length <= 3 || void 0 === arguments[3] ? _utils.noop : arguments[3], monitor = arguments.length <= 4 || void 0 === arguments[4] ? _utils.noop : arguments[4], parentEffectId = arguments.length <= 5 || void 0 === arguments[5] ? 0 : arguments[5], name = arguments.length <= 6 || void 0 === arguments[6] ? "anonymous" : arguments[6], forked = arguments[7];
        (0, _utils.check)(iterator, _utils.is.iterator, NOT_ITERATOR_ERROR);
        var UNDEFINED_INPUT_ERROR = undefindInputError(name), deferredInputs = [], deferredEnd = (0, 
        _utils.deferred)(), unsubscribe = subscribe(function(input) {
            if (void 0 === input) throw UNDEFINED_INPUT_ERROR;
            for (var i = 0; i < deferredInputs.length; i++) {
                var def = deferredInputs[i];
                def.match(input) && (deferredInputs = [], def.resolve(input));
            }
        });
        next.cancel = _utils.noop;
        var task = function(id, name, iterator, done, forked) {
            var _ref6;
            return _ref6 = {}, _defineProperty(_ref6, _utils.TASK, !0), _defineProperty(_ref6, "id", id), 
            _defineProperty(_ref6, "name", name), _defineProperty(_ref6, "done", done), _defineProperty(_ref6, "forked", forked), 
            _defineProperty(_ref6, "cancel", function(error) {
                error instanceof _SagaCancellationException2.default || (error = new _SagaCancellationException2.default(MANUAL_CANCEL, name, error)), 
                done[CANCEL](error);
            }), _defineProperty(_ref6, "isRunning", function() {
                return iterator._isRunning;
            }), _defineProperty(_ref6, "result", function() {
                return iterator._result;
            }), _defineProperty(_ref6, "error", function() {
                return iterator._error;
            }), _ref6;
        }(parentEffectId, name, iterator, deferredEnd.promise, forked);
        return task.done[CANCEL] = function(_ref) {
            var type = _ref.type, origin = _ref.origin;
            next.cancel(new _SagaCancellationException2.default(type, name, origin));
        }, iterator._isRunning = !0, next(), task;
    }
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), exports.MANUAL_CANCEL = exports.RACE_AUTO_CANCEL = exports.PARALLEL_AUTO_CANCEL = exports.CANCEL = exports.undefindInputError = exports.NOT_ITERATOR_ERROR = void 0, 
    exports.default = proc;
    var _utils = __webpack_require__(19), _io = __webpack_require__(55), monitorActions = function(obj) {
        if (obj && obj.__esModule) return obj;
        var newObj = {};
        if (null != obj) for (var key in obj) Object.prototype.hasOwnProperty.call(obj, key) && (newObj[key] = obj[key]);
        return newObj.default = obj, newObj;
    }(__webpack_require__(86)), _SagaCancellationException2 = function(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }(__webpack_require__(56)), NOT_ITERATOR_ERROR = exports.NOT_ITERATOR_ERROR = "proc first argument (Saga function result) must be an iterator", undefindInputError = exports.undefindInputError = function(name) {
        return "\n  " + name + " saga was provided with an undefined input action\n  Hints :\n  - check that your Action Creator returns a non undefined value\n  - if the Saga was started using runSaga, check that your subscribe source provides the action to its listeners\n";
    }, CANCEL = exports.CANCEL = (0, _utils.sym)("@@redux-saga/cancelPromise"), PARALLEL_AUTO_CANCEL = exports.PARALLEL_AUTO_CANCEL = "PARALLEL_AUTO_CANCEL", RACE_AUTO_CANCEL = exports.RACE_AUTO_CANCEL = "RACE_AUTO_CANCEL", MANUAL_CANCEL = exports.MANUAL_CANCEL = "MANUAL_CANCEL", nextEffectId = (0, 
    _utils.autoInc)();
}, function(module, exports, __webpack_require__) {
    "use strict";
    function _defineProperty(obj, key, value) {
        return key in obj ? Object.defineProperty(obj, key, {
            value: value,
            enumerable: !0,
            configurable: !0,
            writable: !0
        }) : obj[key] = value, obj;
    }
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), exports.effectTriggered = function(effectId, parentEffectId, label, effect) {
        var _ref;
        return _ref = {}, _defineProperty(_ref, MONITOR_ACTION, !0), _defineProperty(_ref, "type", EFFECT_TRIGGERED), 
        _defineProperty(_ref, "effectId", effectId), _defineProperty(_ref, "parentEffectId", parentEffectId), 
        _defineProperty(_ref, "label", label), _defineProperty(_ref, "effect", effect), 
        _ref;
    }, exports.effectResolved = function(effectId, result) {
        var _ref2;
        return _ref2 = {}, _defineProperty(_ref2, MONITOR_ACTION, !0), _defineProperty(_ref2, "type", EFFECT_RESOLVED), 
        _defineProperty(_ref2, "effectId", effectId), _defineProperty(_ref2, "result", result), 
        _ref2;
    }, exports.effectRejected = function(effectId, error) {
        var _ref3;
        return _ref3 = {}, _defineProperty(_ref3, MONITOR_ACTION, !0), _defineProperty(_ref3, "type", EFFECT_REJECTED), 
        _defineProperty(_ref3, "effectId", effectId), _defineProperty(_ref3, "error", error), 
        _ref3;
    };
    var MONITOR_ACTION = exports.MONITOR_ACTION = "MONITOR_ACTION", EFFECT_TRIGGERED = exports.EFFECT_TRIGGERED = "EFFECT_TRIGGERED", EFFECT_RESOLVED = exports.EFFECT_RESOLVED = "EFFECT_RESOLVED", EFFECT_REJECTED = exports.EFFECT_REJECTED = "EFFECT_REJECTED";
}, function(module, exports, __webpack_require__) {
    "use strict";
    function getUTMQueryParam(name, value) {
        return name + "=" + encodeURIComponent(value);
    }
    function getUTMQuery(type, place) {
        return getUTMQueryParam("utm_medium", "internal") + "&" + getUTMQueryParam("utm_source", type) + "&" + getUTMQueryParam("utm_campaign", place);
    }
    function getSocialUTMQuery(type) {
        return getUTMQueryParam("utm_medium", "internal") + "&" + getUTMQueryParam("utm_source", type);
    }
    Object.defineProperty(exports, "__esModule", {
        value: !0
    });
    var newConfig_1 = __webpack_require__(24), util_1 = __webpack_require__(2);
    exports.getSignUpURL = function(type, place) {
        return newConfig_1.URLS.signup + "?" + getUTMQuery(type, place);
    }, exports.getSignInURL = function() {
        return newConfig_1.URLS.signin + "?" + getSocialUTMQuery("signinHook");
    }, exports.getFbSigninURL = function() {
        return newConfig_1.URLS.fbSignin + "&" + getSocialUTMQuery("signinHook");
    }, exports.getGoogleSigninURL = function() {
        return newConfig_1.URLS.googleSignin + "&" + getSocialUTMQuery("signinHook");
    }, exports.getFbSignupURL = function(type) {
        return newConfig_1.URLS.fbSignup + "&" + getSocialUTMQuery(type);
    }, exports.getGoogleSignupURL = function(type) {
        return newConfig_1.URLS.googleSignup + "&" + getSocialUTMQuery(type);
    }, exports.getResetPasswordURL = function() {
        return newConfig_1.URLS.resetPassword + "?" + getUTMQueryParam("utm_medium", "internal");
    }, exports.getTermsURL = function() {
        return newConfig_1.URLS.terms + "?" + getUTMQueryParam("utm_medium", "internal");
    }, exports.getPrivatePolicyURL = function() {
        return newConfig_1.URLS.policy + "?" + getUTMQueryParam("utm_medium", "internal");
    }, exports.getUpgradeURL = function(type, place) {
        return newConfig_1.URLS.upgrade + "?" + getUTMQuery(type, place);
    }, exports.getExtensionSuccessURL = function() {
        var browser = util_1.getBrowser();
        return newConfig_1.URLS.welcomeC + "?" + getUTMQueryParam("utm_medium", "store") + "&" + getUTMQueryParam("utm_source", browser);
    }, exports.getAfterInstallURL = function(isFunnel) {
        var browser = util_1.getBrowser(), url = newConfig_1.URLS.afterInstall + "/?extension_install=true", utmMediumVal = isFunnel ? "navigation" : "store", utmSourceParam = isFunnel ? "" : "&" + getUTMQueryParam("utm_source", browser);
        return url + "&" + getUTMQueryParam("utm_medium", utmMediumVal) + utmSourceParam;
    }, exports.getUninstallURL = function(domain) {
        var queryParams = getUTMQueryParam("utm_medium", "internal") + "&" + getUTMQueryParam("utm_campaign", "extensionUninstall");
        return domain ? newConfig_1.URLS.uninstall + "?domain=" + encodeURI(domain) + "&" + queryParams : newConfig_1.URLS.uninstall + "?" + queryParams;
    }, exports.addParamsToUpgradeURL = function(url, type, place) {
        return url + "&" + getUTMQuery(type, place);
    };
}, function(module, exports) {
    module.exports = function(array, iteratee) {
        for (var index = -1, length = null == array ? 0 : array.length; ++index < length && !1 !== iteratee(array[index], index, array); ) ;
        return array;
    };
}, function(module, exports, __webpack_require__) {
    var castPath = __webpack_require__(82), toKey = __webpack_require__(43);
    module.exports = function(object, path) {
        for (var index = 0, length = (path = castPath(path, object)).length; null != object && index < length; ) object = object[toKey(path[index++])];
        return index && index == length ? object : void 0;
    };
}, function(module, exports, __webpack_require__) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    });
    var stdlib_1 = __webpack_require__(4), log = __webpack_require__(1).Logger.create("extension-api");
    !function(m) {
        for (var p in m) exports.hasOwnProperty(p) || (exports[p] = m[p]);
    }(__webpack_require__(61)), exports.initGlobalExtensionApi = function(api) {
        window.extensionApi && log.warn("Extension Api init called more than once"), window.extensionApi = window.extensionApi || api;
    }, exports.getGlobalExtensionApi = function() {
        return stdlib_1.assertNonNull(window.extensionApi, "extension api was not initialized");
    };
}, function(module, exports, __webpack_require__) {
    "use strict";
    var __read = this && this.__read || function(o, n) {
        var m = "function" == typeof Symbol && o[Symbol.iterator];
        if (!m) return o;
        var r, e, i = m.call(o), ar = [];
        try {
            for (;(void 0 === n || n-- > 0) && !(r = i.next()).done; ) ar.push(r.value);
        } catch (error) {
            e = {
                error: error
            };
        } finally {
            try {
                r && !r.done && (m = i.return) && m.call(i);
            } finally {
                if (e) throw e.error;
            }
        }
        return ar;
    }, __spread = this && this.__spread || function() {
        for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
        return ar;
    };
    Object.defineProperty(exports, "__esModule", {
        value: !0
    });
    var merge = __webpack_require__(164), config_1 = __webpack_require__(10);
    exports.PROTOCOL_VERSION = "1.0", exports.SITES_TO_RELOAD = [ "inbox.google.com", "mail.google.com", "yahoo.com", "mail.live.com", "facebook.com", "tumblr.com", "stackoverflow.com", "wordpress.com", "wordpress.org", "blogspot.com" ], 
    exports.FACEBOOK_SITES = [ "facebook.com", "messenger.com", "work.fb.com", "business.facebook.com" ], 
    exports.HTML_GHOST_SITES = __spread([ "twitter.com" ], exports.FACEBOOK_SITES), 
    exports.CUSTOM_UNSUPPORTED_MESSAGES = {
        "drive.google.com": {
            title: "Google Drive",
            message: 'We hope to support Google Drive apps<br/> in the future, but for now please use your</br> <a class="openGrammarly" href="' + config_1.URLS.app + '">Grammarly Editor</a>.'
        },
        "docs.google.com": {
            title: "Google Drive",
            message: 'We hope to support Google Drive apps<br/> in the future, but for now please use your</br> <a class="openGrammarly" href="' + config_1.URLS.app + '">Grammarly Editor</a>.'
        },
        "chrome.google.com": {
            title: "Web Store"
        }
    };
    exports.PAGE_CONFIG_DEFAULT_INTERVAL = 18e5, exports.PAGE_CONFIG_UPDATE_INTERVALS = [ 6e5, exports.PAGE_CONFIG_DEFAULT_INTERVAL, 36e5, 108e5, 432e5, 864e5, 31536e6 ], 
    exports.OVERRIDE_PAGE_CONFIG = {}, exports.PAGE_CONFIG_INTERNAL = (_a = {
        version: {
            enabled: !1,
            servicePage: !0
        },
        extensions: {
            enabled: !1,
            servicePage: !0
        },
        settings: {
            enabled: !1,
            servicePage: !0
        },
        "com.safari.grammarlyspellcheckergrammarchecker": {
            enabled: !1,
            matchInclusions: !0,
            servicePage: !0
        }
    }, _a["app." + config_1.GRAMMARLY_DOMAIN] = {
        enabled: !1,
        grammarlyEditor: !0
    }, _a["linkedin.com"] = {
        pages: {
            "/messaging": {
                afterReplaceEvents: [ "input" ]
            }
        }
    }, _a["plus.google.com"] = {
        afterReplaceEvents: [ "keyup" ],
        minFieldHeight: 0,
        minFieldWidth: 0
    }, _a["facebook.com"] = {
        minFieldHeight: 0,
        pages: {
            "/marketplace": {
                afterReplaceEvents: [ "input" ]
            }
        }
    }, _a["mail.google.com"] = {
        fields: [ {
            name: "to"
        }, {
            name: "cc"
        }, {
            name: "bcc"
        }, {
            className: "vO"
        } ],
        subframes: !1
    }, _a["drive.google.com"] = {
        track: !0
    }, _a["docs.google.com"] = {
        track: !0
    }, _a["app.asana.com"] = {
        fields: [ {
            className: "task-row-text-input"
        } ]
    }, _a["tumblr.com"] = {
        fields: [ {
            attr: [ "aria-label", "Post title" ]
        }, {
            attr: [ "aria-label", "Type or paste a URL" ]
        } ]
    }, _a["chrome.google.com"] = {
        dontShowDisabledBadge: !0
    }, _a);
    var PAGE_CONFIG_DEFAULT = {
        "hootsuite.com": {
            enabled: !1
        },
        "chrome.google.com": {
            enabled: !1
        },
        "facebook.com": {
            enabled: !0,
            pages: {
                ".*/notes": {
                    enabled: !1
                }
            }
        },
        "onedrive.live.com": {
            enabled: !1
        },
        "docs.com": {
            enabled: !1
        },
        "sp.docs.com": {
            enabled: !1
        },
        "docs.google.com": {
            enabled: !1
        },
        "drive.google.com": {
            enabled: !1
        },
        "texteditor.nsspot.net": {
            enabled: !1
        },
        "jsbin.com": {
            enabled: !1
        },
        "jsfiddle.net": {
            enabled: !1
        },
        "quora.com": {
            enabled: !1
        },
        "paper.dropbox.com": {
            enabled: !1
        },
        "mail.live.com": {
            enabled: !1,
            matchInclusions: !0
        },
        "imperavi.com": {
            enabled: !1
        },
        "usecanvas.com": {
            enabled: !1
        }
    };
    exports.PAGE_CONFIG = {
        pageConfig: merge({}, PAGE_CONFIG_DEFAULT, exports.PAGE_CONFIG_INTERNAL)
    };
    var _a;
}, , function(module, exports, __webpack_require__) {
    module.exports = __webpack_require__(282);
}, function(module, exports, __webpack_require__) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    });
    var performanceMetrics_1 = __webpack_require__(174);
    exports.PerformanceMetrics = performanceMetrics_1.PerformanceMetrics;
}, function(module, exports, __webpack_require__) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), exports.t = {
        UPDATE_CONNECTION: "connection/UPDATE_CONNECTION",
        ONLINE_STATE: "connection/ONLINE_STATE"
    }, exports.updateConnection = function(data) {
        return {
            type: exports.t.UPDATE_CONNECTION,
            data: data
        };
    }, exports.onlineConnection = function(online) {
        return {
            type: exports.t.ONLINE_STATE,
            online: online
        };
    };
}, function(module, exports, __webpack_require__) {
    module.exports = __webpack_require__(145);
}, , function(module, exports, __webpack_require__) {
    "use strict";
    function isPopup(url) {
        if (!url) return !1;
        var browser = Config.getGlobal().bundleInfo.browser, re = "firefox" === browser ? /^moz-extension:\/\/.*\/src\/popup.html$/ : "edge" === browser ? /^ms-browser-extension:\/\/.*\/src\/popup.html$/ : "chrome" === browser ? chrome && chrome.runtime && chrome.runtime.id ? new RegExp(chrome.runtime.id + "/src/popup.html") : void 0 : stdlib_1.assertNever(browser);
        return void 0 !== re && re.test(url);
    }
    Object.defineProperty(exports, "__esModule", {
        value: !0
    });
    var helpers_1 = __webpack_require__(114), util_1 = __webpack_require__(2), Config = __webpack_require__(11), stdlib_1 = __webpack_require__(4), interface_1 = __webpack_require__(61), log = __webpack_require__(1).Logger.create("extension-api.message.bg");
    exports.SETTINGS_TAB_ID = "popup", exports.bgPreload = function() {
        var chromeCheck = (util_1.isChrome() || util_1.isFF()) && (!chrome.extension || !chrome.tabs || !chrome.runtime || !chrome.runtime.onConnect), edgeCheck = util_1.isEdge() && (!edge.extension || !edge.tabs || !edge.runtime || !edge.runtime.onConnect);
        if (chromeCheck || edgeCheck) {
            var timesFailed = window.localStorage.getItem("bgInitFail") || "0", bgInitFail = parseInt(timesFailed, 10);
            bgInitFail > 4 ? log.error("too many bgInitFail " + bgInitFail) : (window.localStorage.setItem("bgInitFail", (bgInitFail + 1).toString()), 
            document.location.reload());
        }
    };
    var GenericBackgroundMessageApiImpl = function() {
        function GenericBackgroundMessageApiImpl(onPortConnection, _getActiveTab, _getAllTabs) {
            var _this = this;
            this._getActiveTab = _getActiveTab, this._getAllTabs = _getAllTabs, this.kind = "background-message-api", 
            this._callbacks = {}, this._tabPorts = {
                popup: []
            }, this._messageHelper = new helpers_1.MessageHelperImpl(), this._sendMessageToPorts = function(id, msg) {
                var ports = _this._tabPorts[id];
                ports && ports.forEach(function(port) {
                    return port.postMessage(msg);
                });
            }, this.toFocused = function(type, content) {
                return _this._getActiveTab().then(function(_a) {
                    var id = _a.id, url = _a.url;
                    if (id) return isPopup(url) ? log.warn("toFocussed not allowed for popup when it open like regular tab " + type, content) : void _this._sendMessageToPorts(id.toString(), {
                        type: type,
                        content: content,
                        callid: util_1.guid()
                    });
                });
            }, this.broadcast = function(type, content) {
                if (content) {
                    var emitTabs = function(_a) {
                        var id = _a.id, url = _a.url;
                        id && url && -1 === url.indexOf("chrome-extension:") && _this._sendMessageToPorts(id.toString(), {
                            type: type,
                            callid: util_1.guid(),
                            content: content
                        });
                    };
                    _this._getAllTabs().then(function(tabs) {
                        return tabs.forEach(emitTabs);
                    }), _this._tabPorts.popup && _this._tabPorts.popup.length && _this._getActiveTab().then(function(_a) {
                        var url = _a.url, active = _a.active;
                        emitTabs({
                            id: exports.SETTINGS_TAB_ID,
                            url: url,
                            active: active
                        });
                    });
                }
            }, this._initPortListener = function(port) {
                if (port.name === interface_1.ports.bridge) port.onMessage(function(msg) {
                    "message.toFocussed" === msg.method && _this.toFocused(msg.params && msg.params.type, msg.params && msg.params.content);
                }); else if (port.name === interface_1.ports.broadcast) port.onMessage(function(message) {
                    return _this.broadcast(message.type, message.content);
                }); else if (port.name === interface_1.ports.background) {
                    var sender_1 = port.sender;
                    if (sender_1) {
                        if (sender_1.tab) {
                            var _a = sender_1.tab, id_1 = _a.id, url_1 = _a.url;
                            if (id_1) {
                                var ports_1 = _this._tabPorts[id_1];
                                void 0 === ports_1 && (ports_1 = _this._tabPorts[id_1] = []), ports_1.push(port);
                            }
                            url_1 && 0 === url_1.indexOf("http") && _this._messageHelper.fire("tab-connected", {
                                tab: id_1,
                                url: url_1
                            }), port.onDisconnect(function() {
                                if (id_1) {
                                    var ports = _this._tabPorts[id_1];
                                    ports && ports.splice(ports.indexOf(port), 1);
                                }
                            });
                        }
                        var url = sender_1.url ? sender_1.url : sender_1.tab ? sender_1.tab.url : "";
                        if (url && isPopup(url)) {
                            var pid_1 = exports.SETTINGS_TAB_ID;
                            _this._tabPorts[pid_1] = _this._tabPorts[pid_1] || [], _this._tabPorts[pid_1].push(port), 
                            port.onDisconnect(function() {
                                var ports = _this._tabPorts[pid_1];
                                ports.splice(ports.indexOf(port), 1);
                            });
                        }
                    }
                    port.onMessage(function(message) {
                        var processMessage = function(_a) {
                            var callid = _a.callid, content = _a.content, type = _a.type;
                            _this._callbacks[callid] && (_this._callbacks[callid](content), delete _this._callbacks[callid]);
                            _this._messageHelper.fire(type, content, function(content) {
                                return port.postMessage({
                                    content: content,
                                    callid: callid
                                });
                            }, sender_1 && sender_1.tab ? sender_1.tab.id : -1);
                        };
                        "tab-connected" === message.type ? _this._getActiveTab().then(function(_a) {
                            var url = _a.url;
                            message.content = {
                                tab: exports.SETTINGS_TAB_ID,
                                url: url
                            }, processMessage(message);
                        }) : processMessage(message);
                    });
                }
            }, onPortConnection(this._initPortListener);
        }
        return GenericBackgroundMessageApiImpl.prototype.sendTo = function(tabId, type, content, callback, error) {
            var ports = this._tabPorts[tabId];
            if (ports && ports.length) {
                var msg = {
                    type: type,
                    content: content
                };
                callback && "function" == typeof callback && (msg.callid = util_1.guid(), this._callbacks[msg.callid] = callback), 
                ports.forEach(function(port) {
                    return port.postMessage(msg);
                });
            } else error && error({
                message: "no ports on specified tabId"
            });
        }, GenericBackgroundMessageApiImpl.prototype.listen = function(type, callback) {
            this._messageHelper.listen(type, callback);
        }, GenericBackgroundMessageApiImpl;
    }();
    exports.GenericBackgroundMessageApiImpl = GenericBackgroundMessageApiImpl;
}, function(module, exports, __webpack_require__) {
    var baseFor = __webpack_require__(117), keys = __webpack_require__(31);
    module.exports = function(object, iteratee) {
        return object && baseFor(object, iteratee, keys);
    };
}, function(module, exports) {
    module.exports = function(set) {
        var index = -1, result = Array(set.size);
        return set.forEach(function(value) {
            result[++index] = value;
        }), result;
    };
}, function(module, exports) {
    module.exports = function(array, values) {
        for (var index = -1, length = values.length, offset = array.length; ++index < length; ) array[offset + index] = values[index];
        return array;
    };
}, function(module, exports, __webpack_require__) {
    var arrayFilter = __webpack_require__(182), stubArray = __webpack_require__(161), propertyIsEnumerable = Object.prototype.propertyIsEnumerable, nativeGetSymbols = Object.getOwnPropertySymbols, getSymbols = nativeGetSymbols ? function(object) {
        return null == object ? [] : (object = Object(object), arrayFilter(nativeGetSymbols(object), function(symbol) {
            return propertyIsEnumerable.call(object, symbol);
        }));
    } : stubArray;
    module.exports = getSymbols;
}, function(module, exports, __webpack_require__) {
    var DataView = __webpack_require__(247), Map = __webpack_require__(79), Promise = __webpack_require__(248), Set = __webpack_require__(183), WeakMap = __webpack_require__(249), baseGetTag = __webpack_require__(21), toSource = __webpack_require__(121), dataViewCtorString = toSource(DataView), mapCtorString = toSource(Map), promiseCtorString = toSource(Promise), setCtorString = toSource(Set), weakMapCtorString = toSource(WeakMap), getTag = baseGetTag;
    (DataView && "[object DataView]" != getTag(new DataView(new ArrayBuffer(1))) || Map && "[object Map]" != getTag(new Map()) || Promise && "[object Promise]" != getTag(Promise.resolve()) || Set && "[object Set]" != getTag(new Set()) || WeakMap && "[object WeakMap]" != getTag(new WeakMap())) && (getTag = function(value) {
        var result = baseGetTag(value), Ctor = "[object Object]" == result ? value.constructor : void 0, ctorString = Ctor ? toSource(Ctor) : "";
        if (ctorString) switch (ctorString) {
          case dataViewCtorString:
            return "[object DataView]";

          case mapCtorString:
            return "[object Map]";

          case promiseCtorString:
            return "[object Promise]";

          case setCtorString:
            return "[object Set]";

          case weakMapCtorString:
            return "[object WeakMap]";
        }
        return result;
    }), module.exports = getTag;
}, function(module, exports) {
    module.exports = function(array, iteratee) {
        for (var index = -1, length = null == array ? 0 : array.length, result = Array(length); ++index < length; ) result[index] = iteratee(array[index], index, array);
        return result;
    };
}, function(module, exports, __webpack_require__) {
    "use strict";
    var __awaiter = this && this.__awaiter || function(thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function(resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value));
                } catch (e) {
                    reject(e);
                }
            }
            function rejected(value) {
                try {
                    step(generator.throw(value));
                } catch (e) {
                    reject(e);
                }
            }
            function step(result) {
                result.done ? resolve(result.value) : new P(function(resolve) {
                    resolve(result.value);
                }).then(fulfilled, rejected);
            }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }, __generator = this && this.__generator || function(thisArg, body) {
        function verb(n) {
            return function(v) {
                return step([ n, v ]);
            };
        }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            for (;_; ) try {
                if (f = 1, y && (t = y[2 & op[0] ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
                switch (y = 0, t && (op = [ 0, t.value ]), op[0]) {
                  case 0:
                  case 1:
                    t = op;
                    break;

                  case 4:
                    return _.label++, {
                        value: op[1],
                        done: !1
                    };

                  case 5:
                    _.label++, y = op[1], op = [ 0 ];
                    continue;

                  case 7:
                    op = _.ops.pop(), _.trys.pop();
                    continue;

                  default:
                    if (t = _.trys, !(t = t.length > 0 && t[t.length - 1]) && (6 === op[0] || 2 === op[0])) {
                        _ = 0;
                        continue;
                    }
                    if (3 === op[0] && (!t || op[1] > t[0] && op[1] < t[3])) {
                        _.label = op[1];
                        break;
                    }
                    if (6 === op[0] && _.label < t[1]) {
                        _.label = t[1], t = op;
                        break;
                    }
                    if (t && _.label < t[2]) {
                        _.label = t[2], _.ops.push(op);
                        break;
                    }
                    t[2] && _.ops.pop(), _.trys.pop();
                    continue;
                }
                op = body.call(thisArg, _);
            } catch (e) {
                op = [ 6, e ], y = 0;
            } finally {
                f = t = 0;
            }
            if (5 & op[0]) throw op[1];
            return {
                value: op[0] ? op[1] : void 0,
                done: !0
            };
        }
        var f, y, t, g, _ = {
            label: 0,
            sent: function() {
                if (1 & t[0]) throw t[1];
                return t[1];
            },
            trys: [],
            ops: []
        };
        return g = {
            next: verb(0),
            throw: verb(1),
            return: verb(2)
        }, "function" == typeof Symbol && (g[Symbol.iterator] = function() {
            return this;
        }), g;
    }, __read = this && this.__read || function(o, n) {
        var m = "function" == typeof Symbol && o[Symbol.iterator];
        if (!m) return o;
        var r, e, i = m.call(o), ar = [];
        try {
            for (;(void 0 === n || n-- > 0) && !(r = i.next()).done; ) ar.push(r.value);
        } catch (error) {
            e = {
                error: error
            };
        } finally {
            try {
                r && !r.done && (m = i.return) && m.call(i);
            } finally {
                if (e) throw e.error;
            }
        }
        return ar;
    }, __spread = this && this.__spread || function() {
        for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
        return ar;
    };
    Object.defineProperty(exports, "__esModule", {
        value: !0
    });
    var stdlib_1 = __webpack_require__(4), storage_migration_1 = __webpack_require__(184), content_1 = __webpack_require__(127);
    exports.hacksForCompatibility = content_1.hacksForCompatibility;
    var bg_1 = __webpack_require__(98);
    exports.bgPreload = bg_1.bgPreload;
    !function(preferencesApi) {
        function getMigrationAwareMethod(apiName) {
            return function() {
                for (var args = [], _i = 0; _i < arguments.length; _i++) args[_i] = arguments[_i];
                return stdlib_1.assert(!0 === ensureMigrationCompletedCalled, "supposed to run data migration before accessing prefs with web-extensions API"), 
                migrationCompleted.then(function(completed) {
                    var instance = completed ? migration.migrationAwareDestination : preferencesApi.windowLocalStorage;
                    return instance[apiName].apply(instance, __spread(args));
                });
            };
        }
        preferencesApi.windowLocalStorage = {
            get: function(key) {
                return stdlib_1.SafePromise.sync(function() {
                    return window.localStorage.getItem(key);
                });
            },
            set: function(key, value) {
                return stdlib_1.SafePromise.sync(function() {
                    return window.localStorage.setItem(key, value);
                });
            },
            getAll: function() {
                return stdlib_1.SafePromise.sync(function() {
                    var all = {};
                    return Object.keys(window.localStorage).forEach(function(key) {
                        all[key] = window.localStorage.getItem(key);
                    }), all;
                });
            },
            remove: function(key) {
                return stdlib_1.SafePromise.sync(function() {
                    return window.localStorage.removeItem(key);
                });
            },
            removeAll: function() {
                return stdlib_1.SafePromise.sync(function() {
                    return window.localStorage.clear();
                });
            }
        }, preferencesApi.browserStorageLocal = {
            get: function(key) {
                return __awaiter(this, void 0, void 0, function() {
                    var valueObject;
                    return __generator(this, function(_a) {
                        switch (_a.label) {
                          case 0:
                            return [ 4, firefox.storage.local.get(key) ];

                          case 1:
                            return valueObject = _a.sent(), [ 2, valueObject.hasOwnProperty(key) ? valueObject[key] : null ];
                        }
                    });
                });
            },
            set: function(key, value) {
                return firefox.storage.local.set((_a = {}, _a[key] = value, _a));
                var _a;
            },
            getAll: function() {
                return firefox.storage.local.get(null);
            },
            remove: function(key) {
                return firefox.storage.local.remove(key);
            },
            removeAll: function() {
                return __awaiter(this, void 0, void 0, function() {
                    return __generator(this, function(_a) {
                        switch (_a.label) {
                          case 0:
                            return [ 4, firefox.storage.local.clear() ];

                          case 1:
                            return _a.sent(), [ 2 ];
                        }
                    });
                });
            }
        };
        var migration = new storage_migration_1.StorageMigration("firefoxLocalStorageToExtApi", preferencesApi.windowLocalStorage, preferencesApi.browserStorageLocal, [ "version" ]), migrationCompleted = Promise.resolve(!1), ensureMigrationCompletedCalled = !1;
        preferencesApi.ensureMigrationCompleted = function() {
            ensureMigrationCompletedCalled = !0;
            var migrationCompletedPcs = stdlib_1.SafePromise.createCompletionSource();
            return migrationCompleted = migrationCompletedPcs.promise, migration.ensureMigrationCompleted().then(function(x) {
                return migrationCompletedPcs.resolve(!0), Promise.resolve(x);
            }, function(err) {
                return migrationCompletedPcs.resolve(!1), Promise.reject(err);
            });
        }, preferencesApi.migrationAware = {
            get: getMigrationAwareMethod("get"),
            set: getMigrationAwareMethod("set"),
            getAll: getMigrationAwareMethod("getAll"),
            remove: getMigrationAwareMethod("remove"),
            removeAll: getMigrationAwareMethod("removeAll")
        };
    }(exports.preferencesApi || (exports.preferencesApi = {}));
}, function(module, exports, __webpack_require__) {
    var Uint8Array = __webpack_require__(123);
    module.exports = function(arrayBuffer) {
        var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
        return new Uint8Array(result).set(new Uint8Array(arrayBuffer)), result;
    };
}, function(module, exports, __webpack_require__) {
    var baseRest = __webpack_require__(108), isIterateeCall = __webpack_require__(188);
    module.exports = function(assigner) {
        return baseRest(function(object, sources) {
            var index = -1, length = sources.length, customizer = length > 1 ? sources[length - 1] : void 0, guard = length > 2 ? sources[2] : void 0;
            for (customizer = assigner.length > 3 && "function" == typeof customizer ? (length--, 
            customizer) : void 0, guard && isIterateeCall(sources[0], sources[1], guard) && (customizer = length < 3 ? void 0 : customizer, 
            length = 1), object = Object(object); ++index < length; ) {
                var source = sources[index];
                source && assigner(object, source, index, customizer);
            }
            return object;
        });
    };
}, function(module, exports, __webpack_require__) {
    var identity = __webpack_require__(54), overRest = __webpack_require__(185), setToString = __webpack_require__(187);
    module.exports = function(func, start) {
        return setToString(overRest(func, start, identity), func + "");
    };
}, function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    var __WEBPACK_IMPORTED_MODULE_0__baseGetTag_js__ = __webpack_require__(290), __WEBPACK_IMPORTED_MODULE_1__getPrototype_js__ = __webpack_require__(295), __WEBPACK_IMPORTED_MODULE_2__isObjectLike_js__ = __webpack_require__(297), objectTag = "[object Object]", funcProto = Function.prototype, objectProto = Object.prototype, funcToString = funcProto.toString, hasOwnProperty = objectProto.hasOwnProperty, objectCtorString = funcToString.call(Object);
    __webpack_exports__.a = function(value) {
        if (!Object(__WEBPACK_IMPORTED_MODULE_2__isObjectLike_js__.a)(value) || Object(__WEBPACK_IMPORTED_MODULE_0__baseGetTag_js__.a)(value) != objectTag) return !1;
        var proto = Object(__WEBPACK_IMPORTED_MODULE_1__getPrototype_js__.a)(value);
        if (null === proto) return !0;
        var Ctor = hasOwnProperty.call(proto, "constructor") && proto.constructor;
        return "function" == typeof Ctor && Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString;
    };
}, function(module, exports, __webpack_require__) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), exports.t = {
        SET_USER: "user/SET_USER",
        SET_SETTINGS: "user/SET_SETTINGS",
        SESSION_INVALIDATE: "user/SESSION_INVALIDATE",
        INC_FIXED: "user/INC_FIXED"
    }, exports.setUser = function(data) {
        return {
            type: exports.t.SET_USER,
            data: data
        };
    }, exports.setSettings = function(data) {
        return {
            type: exports.t.SET_SETTINGS,
            data: data
        };
    }, exports.sessionInvalidate = function(reason) {
        return {
            type: exports.t.SESSION_INVALIDATE,
            reason: reason
        };
    }, exports.incFixed = function() {
        return {
            type: exports.t.INC_FIXED
        };
    };
}, function(module, exports, __webpack_require__) {
    "use strict";
    function call(msg) {
        for (var data = [], _i = 1; _i < arguments.length; _i++) data[_i - 1] = arguments[_i];
        var fallback = function(e) {
            log.warn("tracking call " + msg + " failed, reason: ", e);
        };
        if (util_1.isBg()) util_1.asyncCall(function() {
            try {
                switch (logCall(msg, data), msg) {
                  case bgPageCallImpls.CALL_HANDLER_ID:
                    var method = data[0], args = data.slice(1);
                    (_a = bgPageCallImpls.methods)[method].apply(_a, __spread(args));
                    break;

                  default:
                    runMessage(msg, data);
                }
            } catch (e) {
                fallback(e);
            }
            var _a;
        }, 20); else {
            var timeout_1, preventTimeout_1 = function() {
                return clearInterval(timeout_1);
            }, errorHandle_1 = function(e) {
                preventTimeout_1(), fallback(e);
            };
            timeout_1 = window.setTimeout(function() {
                return errorHandle_1("timeout call through bg page");
            }, 1e4), message.emitBackground("tracking-call", {
                msg: msg,
                data: data
            }, preventTimeout_1);
        }
    }
    function runMessage(msg, data) {
        var args = msg.split("."), method = args.pop(), ctx = args.reduce(function(closure, part) {
            return part in closure ? closure[part] : {};
        }, tracker_1.tracker());
        if (!ctx || !method || !ctx[method]) return log.error("No method " + msg + " in tracker object");
        if ("gnar.track" === msg) {
            var _a = __read(data, 2), event_1 = _a[0], props = _a[1];
            ctx[method](__assign({
                eventName: config.gnarAppName + "/" + event_1
            }, props));
        } else ctx[method].apply(ctx, __spread(data));
    }
    function logCall(msg, data) {
        log.info(msg, data);
    }
    var __assign = this && this.__assign || Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) Object.prototype.hasOwnProperty.call(s, p) && (t[p] = s[p]);
        }
        return t;
    }, __read = this && this.__read || function(o, n) {
        var m = "function" == typeof Symbol && o[Symbol.iterator];
        if (!m) return o;
        var r, e, i = m.call(o), ar = [];
        try {
            for (;(void 0 === n || n-- > 0) && !(r = i.next()).done; ) ar.push(r.value);
        } catch (error) {
            e = {
                error: error
            };
        } finally {
            try {
                r && !r.done && (m = i.return) && m.call(i);
            } finally {
                if (e) throw e.error;
            }
        }
        return ar;
    }, __spread = this && this.__spread || function() {
        for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
        return ar;
    };
    Object.defineProperty(exports, "__esModule", {
        value: !0
    });
    var bgPageCallImpls, message = __webpack_require__(16), util_1 = __webpack_require__(2), tracker_1 = __webpack_require__(193), felogPixel_1 = __webpack_require__(135), config = __webpack_require__(10), felogClient_1 = __webpack_require__(318), sumoLogicClient_1 = __webpack_require__(319), log = __webpack_require__(1).Logger.create("lib.tracking.call");
    !function(bgPageCallImpls) {
        var felogClient = util_1.isBg() ? new felogClient_1.DefaultFelogClient(config.URLS.newFelog, config.appName, config.getVersion(), config.ENV, window.fetch.bind(window)) : void 0, sumoLogicClient = util_1.isBg() ? new sumoLogicClient_1.SumoLogicClient(config.URLS.sumoLogic, config.appName, config.getVersion(), config.ENV, window.fetch.bind(window)) : void 0;
        !function(methods) {
            methods.sendFelog = function(logger, message, level, extra) {
                if (!felogClient) throw Error("sendFelog unavailable");
                felogClient.sendEvent({
                    logger: logger,
                    message: message,
                    level: level,
                    extra: extra
                }).catch(function(_) {
                    return felogPixel_1.sendEventPixel(logger, message, level, extra, felogClient.getContext());
                });
            }, methods.sendSumoLogic = function(logger, message, level, extra) {
                if (!sumoLogicClient) throw Error("sumoLogicClient unavailable");
                sumoLogicClient.send({
                    logger: logger,
                    message: message,
                    level: level,
                    extra: extra
                }).catch(function(_) {
                    return felogPixel_1.sendEventPixel(logger, message, level, extra, sumoLogicClient.getContext());
                });
            }, methods.sendFelogManyEvents = function(events) {
                felogClient && felogClient.sendManyEvents(events);
            }, methods.sendFelogUsageEvent = function(logger, message, level, usage) {
                if (!felogClient) throw Error("felogClient unavailable");
                felogClient.sendUsageEvent(logger, message, level, usage).catch(function(_) {
                    return felogPixel_1.sendEventPixel(logger, message, level);
                });
            }, methods.setUserId = function(id) {
                felogClient && felogClient.setUserId(id), sumoLogicClient && sumoLogicClient.setUserId(id);
            }, methods.setContainerId = function(containerId) {
                felogClient && felogClient.setContainerId(containerId), sumoLogicClient && sumoLogicClient.setContainerId(containerId);
            }, methods.sendTimes = function(name, times) {
                felogClient && times.forEach(function(t) {
                    return felogClient.sendTimer(name, t);
                });
            };
        }(bgPageCallImpls.methods || (bgPageCallImpls.methods = {})), bgPageCallImpls.CALL_HANDLER_ID = "tracking/RPC";
    }(bgPageCallImpls || (bgPageCallImpls = {})), exports.callBgPage = Object.keys(bgPageCallImpls.methods).reduce(function(o, k) {
        return o[k] = function() {
            for (var args = [], _i = 0; _i < arguments.length; _i++) args[_i] = arguments[_i];
            return call.apply(void 0, __spread([ bgPageCallImpls.CALL_HANDLER_ID, k ], args));
        }, o;
    }, {});
    var trackingLog = [];
    exports.call = call, exports.runMessage = runMessage, exports.logCall = logCall, 
    exports.getLog = function() {
        var result = trackingLog.slice(0);
        return trackingLog.length = 0, result;
    };
}, , function(module, exports) {
    module.exports = {
        windows: "_1ouT8",
        setting_item: "_2IlHt",
        errors: "_3-ixu",
        descr: "_CTiB",
        thin_text: "_1vz60",
        footer: "Tln6a",
        gr_popup_settings: "Ibj3u",
        footer_btn: "_1bnc2",
        line: "_30_VR",
        short_border: "DD0ma",
        top: "dN7KM",
        show_news: "bHfOZ",
        news: "_2PVRv",
        news_content: "_13R5a",
        close_news: "_2VFKp",
        not_supported: "_36TEl",
        checkbox_check: "_2mg9_",
        site_switcher: "b519s",
        upgrade: "_B775",
        def_switcher: "_1TCaF",
        on: "_14lHG",
        off: "itLZ0",
        upgraded: "_1TX0f",
        content: "_3Lj-5",
        summary: "_1lsq2",
        since: "Fev9e",
        has_favicon: "_2Bnod",
        favicon: "_10wbB",
        domain: "CKnv8",
        no_fixes: "_26TnR",
        lblCount: "_1aYq2",
        upgrade_title: "_2hObZ",
        my_grammarly: "TF2eL",
        new_document: "_3Cq9r",
        unsupported_site: "_3e_0Y",
        unsupported_item: "_3qoTk",
        unsupported_title: "_2gN2r",
        domain_in_details: "_2uJz6",
        unsupported_temporary: "VBQiS",
        unsupported_permanently: "_1te7p",
        unsupported_grammarly: "_3N1eq",
        diamond: "_1dfOx",
        edge_diamond: "_5HVKh"
    };
}, function(module, exports, __webpack_require__) {
    "use strict";
    function getSafariActiveTab() {
        return safari.application.activeBrowserWindow && safari.application.activeBrowserWindow.activeTab;
    }
    var __values = this && this.__values || function(o) {
        var m = "function" == typeof Symbol && o[Symbol.iterator], i = 0;
        return m ? m.call(o) : {
            next: function() {
                return o && i >= o.length && (o = void 0), {
                    value: o && o[i++],
                    done: !o
                };
            }
        };
    };
    Object.defineProperty(exports, "__esModule", {
        value: !0
    });
    var config_1 = __webpack_require__(10), log = __webpack_require__(1).Logger.create("extension-api.message"), _f = function() {}, MessageHelperImpl = function() {
        return function() {
            var _this = this;
            this._listeners = {}, this._queue = {}, this.fire = function(type, content, callback, sender) {
                void 0 === callback && (callback = _f);
                var listeners = _this._listeners[type] || [];
                listeners.length ? listeners.forEach(function(fn) {
                    return fn(content, callback, sender);
                }) : (_this._queue[type] = _this._queue[type] || [], _this._queue[type].push({
                    content: content,
                    callback: callback,
                    sender: sender
                }));
            }, this.unlisten = function(type, cb) {
                var listeners = _this._listeners[type] || [], index = listeners.indexOf(cb);
                -1 !== index && (1 === listeners.length ? delete _this._listeners[type] : listeners.splice(index, 1));
            }, this.listenOnce = function(type, callback) {
                var listener = function(data, reply, sender) {
                    _this.unlisten(type, listener), callback && callback(data, reply, sender);
                };
                _this.listen(type, listener);
            }, this.listen = function(type, callback) {
                _this._listeners[type] = _this._listeners[type] || [], -1 === _this._listeners[type].indexOf(callback) && _this._listeners[type].push(callback);
                var queue = _this._queue[type] || [];
                if (queue.length) {
                    try {
                        for (var queue_1 = __values(queue), queue_1_1 = queue_1.next(); !queue_1_1.done; queue_1_1 = queue_1.next()) {
                            var item = queue_1_1.value;
                            try {
                                callback(item.content, item.callback, item.sender);
                            } catch (e) {
                                log.error("exception during proccesing buffered messages", e);
                            }
                        }
                    } catch (e_1_1) {
                        e_1 = {
                            error: e_1_1
                        };
                    } finally {
                        try {
                            queue_1_1 && !queue_1_1.done && (_a = queue_1.return) && _a.call(queue_1);
                        } finally {
                            if (e_1) throw e_1.error;
                        }
                    }
                    delete _this._queue[type];
                    var e_1, _a;
                }
            };
        };
    }();
    exports.MessageHelperImpl = MessageHelperImpl, exports.safariBridgeId = "forge-bridge" + config_1.getUuid(), 
    exports.getSafariActiveTab = getSafariActiveTab, exports.getSafariActiveTabUrl = function() {
        var activeTab = getSafariActiveTab();
        return activeTab && activeTab.url || "http://newtab";
    }, exports.emitter = function() {
        var callbacks = {}, messageBuffer = {};
        return {
            emit: function(type, data, callback) {
                var listeners = callbacks[type];
                listeners ? listeners.forEach(function(cb) {
                    return cb(data, callback);
                }) : (messageBuffer[type] || (messageBuffer[type] = []), messageBuffer[type].push({
                    data: data,
                    callback: callback
                }));
            },
            on: function(type, cb) {
                callbacks[type] || (callbacks[type] = []), callbacks[type].push(cb), messageBuffer[type] && messageBuffer[type].forEach(function(msg) {
                    return cb(msg.data, msg.callback);
                });
            }
        };
    };
}, function(module, exports, __webpack_require__) {
    var arrayEach = __webpack_require__(88), baseCreate = __webpack_require__(116), baseForOwn = __webpack_require__(99), baseIteratee = __webpack_require__(65), getPrototype = __webpack_require__(59), isArray = __webpack_require__(7), isBuffer = __webpack_require__(33), isFunction = __webpack_require__(42), isObject = __webpack_require__(8), isTypedArray = __webpack_require__(41);
    module.exports = function(object, iteratee, accumulator) {
        var isArr = isArray(object), isArrLike = isArr || isBuffer(object) || isTypedArray(object);
        if (iteratee = baseIteratee(iteratee, 4), null == accumulator) {
            var Ctor = object && object.constructor;
            accumulator = isArrLike ? isArr ? new Ctor() : [] : isObject(object) && isFunction(Ctor) ? baseCreate(getPrototype(object)) : {};
        }
        return (isArrLike ? arrayEach : baseForOwn)(object, function(value, index, object) {
            return iteratee(accumulator, value, index, object);
        }), accumulator;
    };
}, function(module, exports, __webpack_require__) {
    var isObject = __webpack_require__(8), objectCreate = Object.create, baseCreate = function() {
        function object() {}
        return function(proto) {
            if (!isObject(proto)) return {};
            if (objectCreate) return objectCreate(proto);
            object.prototype = proto;
            var result = new object();
            return object.prototype = void 0, result;
        };
    }();
    module.exports = baseCreate;
}, function(module, exports, __webpack_require__) {
    var baseFor = __webpack_require__(204)();
    module.exports = baseFor;
}, function(module, exports, __webpack_require__) {
    var baseTimes = __webpack_require__(205), isArguments = __webpack_require__(46), isArray = __webpack_require__(7), isBuffer = __webpack_require__(33), isIndex = __webpack_require__(64), isTypedArray = __webpack_require__(41), hasOwnProperty = Object.prototype.hasOwnProperty;
    module.exports = function(value, inherited) {
        var isArr = isArray(value), isArg = !isArr && isArguments(value), isBuff = !isArr && !isArg && isBuffer(value), isType = !isArr && !isArg && !isBuff && isTypedArray(value), skipIndexes = isArr || isArg || isBuff || isType, result = skipIndexes ? baseTimes(value.length, String) : [], length = result.length;
        for (var key in value) !inherited && !hasOwnProperty.call(value, key) || skipIndexes && ("length" == key || isBuff && ("offset" == key || "parent" == key) || isType && ("buffer" == key || "byteLength" == key || "byteOffset" == key) || isIndex(key, length)) || result.push(key);
        return result;
    };
}, function(module, exports, __webpack_require__) {
    (function(global) {
        var freeGlobal = "object" == typeof global && global && global.Object === Object && global;
        module.exports = freeGlobal;
    }).call(exports, __webpack_require__(36));
}, function(module, exports) {
    module.exports = function(func, transform) {
        return function(arg) {
            return func(transform(arg));
        };
    };
}, function(module, exports) {
    var funcToString = Function.prototype.toString;
    module.exports = function(func) {
        if (null != func) {
            try {
                return funcToString.call(func);
            } catch (e) {}
            try {
                return func + "";
            } catch (e) {}
        }
        return "";
    };
}, function(module, exports, __webpack_require__) {
    var SetCache = __webpack_require__(156), arraySome = __webpack_require__(244), cacheHas = __webpack_require__(157), COMPARE_PARTIAL_FLAG = 1, COMPARE_UNORDERED_FLAG = 2;
    module.exports = function(array, other, bitmask, customizer, equalFunc, stack) {
        var isPartial = bitmask & COMPARE_PARTIAL_FLAG, arrLength = array.length, othLength = other.length;
        if (arrLength != othLength && !(isPartial && othLength > arrLength)) return !1;
        var stacked = stack.get(array);
        if (stacked && stack.get(other)) return stacked == other;
        var index = -1, result = !0, seen = bitmask & COMPARE_UNORDERED_FLAG ? new SetCache() : void 0;
        for (stack.set(array, other), stack.set(other, array); ++index < arrLength; ) {
            var arrValue = array[index], othValue = other[index];
            if (customizer) var compared = isPartial ? customizer(othValue, arrValue, index, other, array, stack) : customizer(arrValue, othValue, index, array, other, stack);
            if (void 0 !== compared) {
                if (compared) continue;
                result = !1;
                break;
            }
            if (seen) {
                if (!arraySome(other, function(othValue, othIndex) {
                    if (!cacheHas(seen, othIndex) && (arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) return seen.push(othIndex);
                })) {
                    result = !1;
                    break;
                }
            } else if (arrValue !== othValue && !equalFunc(arrValue, othValue, bitmask, customizer, stack)) {
                result = !1;
                break;
            }
        }
        return stack.delete(array), stack.delete(other), result;
    };
}, function(module, exports, __webpack_require__) {
    var Uint8Array = __webpack_require__(12).Uint8Array;
    module.exports = Uint8Array;
}, function(module, exports, __webpack_require__) {
    var isObject = __webpack_require__(8);
    module.exports = function(value) {
        return value === value && !isObject(value);
    };
}, function(module, exports) {
    module.exports = function(key, srcValue) {
        return function(object) {
            return null != object && object[key] === srcValue && (void 0 !== srcValue || key in Object(object));
        };
    };
}, function(module, exports) {
    module.exports = {
        toU8IntArray: function(inputString) {
            for (var array = [], tempArrayOfChar = [], i = 0; i < inputString.length; i++) {
                var temp, charCode = inputString.charCodeAt(i);
                for (tempArrayOfChar.length = 0; (temp = 255 & charCode) || charCode; ) tempArrayOfChar.push(temp), 
                charCode >>>= 8;
                array = array.concat(tempArrayOfChar.reverse());
            }
            return array;
        },
        intToUnsignedHex: function(number) {
            for (var temp, hexArray = []; (temp = 65535 & number) || number; ) temp = temp.toString(16), 
            temp = "0000".slice(temp.length) + temp, hexArray.push(temp), number >>>= 16;
            return hexArray.reverse().join("");
        }
    };
}, function(module, exports, __webpack_require__) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    });
    var stdlib_1 = __webpack_require__(4), helpers_1 = __webpack_require__(114), util_1 = __webpack_require__(2), interface_1 = __webpack_require__(61), log = __webpack_require__(1).Logger.create("Messaging.extension-api.content"), GenericContentScriptMessageApiImpl = function() {
        function GenericContentScriptMessageApiImpl(createPortConnection) {
            var _this = this;
            this.kind = "content-script-message-api", this._callbacks = {}, this._messageHelper = new helpers_1.MessageHelperImpl(), 
            this._proxyPortsStorage = {}, this.broadcastBackground = function() {
                for (var args = [], _i = 0; _i < arguments.length; _i++) args[_i] = arguments[_i];
                return _this._emit(_this.backgroundPort, "bg").apply(null, args);
            }, this.broadcast = function() {
                for (var args = [], _i = 0; _i < arguments.length; _i++) args[_i] = arguments[_i];
                return _this._emit(_this.broadcastPort, "tabs").apply(null, args);
            }, this._onPortMessage = function(msg) {
                log.trace("portMessage", msg);
            }, this._checkHealth = function() {
                function clearCheckers() {
                    document.removeEventListener("grammarly:pong", alive), timeout && (clearTimeout(timeout), 
                    timeout = null), pingInterval && (clearInterval(pingInterval), pingInterval = null);
                }
                var pingInterval = null, timeout = null, sendPing = function() {
                    return document.dispatchEvent(new CustomEvent("grammarly:ping"));
                }, alive = function() {
                    clearCheckers();
                }, abortByTimeout = function() {
                    [ _this.port, _this.backgroundPort, _this.broadcastPort ].forEach(function(x) {
                        x && x.removeMessageListeners && x.removeMessageListeners();
                    }), _this.port = _this.backgroundPort = _this.broadcastPort = null, clearCheckers(), 
                    document.addEventListener("grammarly:proxyports", _this._onGrammarlyResetAfterTimeout), 
                    document.dispatchEvent(new CustomEvent("grammarly:offline"));
                };
                return function() {
                    clearCheckers(), document.addEventListener("grammarly:pong", alive), pingInterval = window.setInterval(sendPing, 500), 
                    timeout = window.setTimeout(abortByTimeout, 5e3);
                };
            }(), this._onGrammarlyResetAfterTimeout = function() {
                document.removeEventListener("grammarly:proxyports", _this._onGrammarlyResetAfterTimeout), 
                _this.port = _this._initProxyPort(interface_1.ports.bridge, _this._onPortMessage, _this._checkHealth, !0), 
                _this.backgroundPort = _this._initProxyPort(interface_1.ports.background, _this._onBgPortMessage, _this._checkHealth), 
                _this.broadcastPort = _this._initProxyPort(interface_1.ports.broadcast, null, _this._checkHealth);
            }, this._onBgPortMessage = function(_a) {
                var callid = _a.callid, content = _a.content, type = _a.type;
                _this._callbacks[callid] ? (_this._callbacks[callid](content), delete _this._callbacks[callid]) : _this._messageHelper.fire(type, content, function(content) {
                    if (!_this.backgroundPort) throw new Error("fail reply to bg page - connection lost");
                    _this.backgroundPort.postMessage({
                        content: content,
                        callid: callid
                    });
                });
            }, this._initProxyPort = function(name, onMessage, onDisconnect, isCheckHealth) {
                void 0 === isCheckHealth && (isCheckHealth = !1);
                var port = _this._proxyPort(name);
                return isCheckHealth && _this._checkHealth(), onMessage && port.onMessage(onMessage), 
                onDisconnect && port.onDisconnect(onDisconnect), port;
            }, this._emit = function(port, name) {
                return function(type, content, callback, error) {
                    var callid = util_1.guid();
                    callback && "function" == typeof callback && (_this._callbacks[callid] = callback);
                    try {
                        if (!port) throw new Error("lost connection to " + name + " port");
                        port.postMessage({
                            type: type,
                            callid: callid,
                            content: content
                        });
                    } catch (e) {
                        if (!error) throw e;
                        error(e);
                    }
                };
            }, this._proxyPort = function(name) {
                _this._proxyPortsStorage[name] = {};
                var process = function(type, e) {
                    var data = e.detail;
                    if (data.name === name) {
                        var cb = _this._proxyPortsStorage[name][type];
                        cb && cb(data.msg);
                    }
                }, successProccess = function(e) {
                    return process("success", e);
                }, errorProccess = function(e) {
                    return process("error", e);
                };
                return document.addEventListener("grammarly:message", successProccess), document.addEventListener("grammarly:error", errorProccess), 
                {
                    postMessage: function(data) {
                        void 0 === data && (data = {});
                        var detail = {
                            data: data,
                            name: name
                        };
                        return document.dispatchEvent(new CustomEvent("grammarly:action", {
                            detail: detail
                        }));
                    },
                    onMessage: function(cb) {
                        _this._proxyPortsStorage[name].success = cb;
                    },
                    onDisconnect: function(cb) {
                        _this._proxyPortsStorage[name].error = cb;
                    },
                    removeMessageListeners: function() {
                        document.removeEventListener("grammarly:message", successProccess), document.removeEventListener("grammarly:error", errorProccess);
                    }
                };
            }, this.port = createPortConnection(interface_1.ports.bridge), this.port.onMessage(this._onPortMessage), 
            this.port.onDisconnect(function() {
                _this.port = null, _this.port = _this._initProxyPort(interface_1.ports.bridge, _this._onPortMessage, _this._checkHealth, !0);
            }), this.backgroundPort = createPortConnection(interface_1.ports.background), this.backgroundPort.onMessage(this._onBgPortMessage), 
            this.backgroundPort.onDisconnect(function() {
                _this.backgroundPort = null, _this.backgroundPort = _this._initProxyPort(interface_1.ports.background, _this._onBgPortMessage, _this._checkHealth);
            }), this.broadcastPort = createPortConnection(interface_1.ports.broadcast), this.broadcastPort.onDisconnect(function() {
                _this.broadcastPort = null, _this.broadcastPort = _this._initProxyPort(interface_1.ports.broadcast, null, _this._checkHealth);
            });
        }
        return GenericContentScriptMessageApiImpl.prototype.listen = function(type, callback) {
            this._messageHelper.listen(type, callback);
        }, GenericContentScriptMessageApiImpl.prototype.toFocused = function(type, content) {
            var _this = this;
            return stdlib_1.SafePromise.create(function(resolve) {
                if (!_this.port) throw new Error("lost connection to bg page");
                _this.port.postMessage({
                    method: "message.toFocussed",
                    params: {
                        type: type,
                        content: content
                    }
                }), resolve();
            });
        }, GenericContentScriptMessageApiImpl;
    }();
    exports.GenericContentScriptMessageApiImpl = GenericContentScriptMessageApiImpl, 
    exports.hacksForCompatibility = function() {
        window.addEventListener("update-window-size-gr", function(e) {
            var node = document.createElement("div");
            if (node.style.height = "1px", e.detail && e.detail.force) {
                var interval_1 = setInterval(function() {
                    document.body.appendChild(node), setTimeout(function() {
                        node.parentNode && node.parentNode.removeChild(node);
                    }, 10);
                }, 100);
                setTimeout(function() {
                    return clearInterval(interval_1);
                }, 405);
            }
        }, !1), window.addEventListener("close-popup-gr", function() {
            -1 !== window.navigator.userAgent.indexOf("Firefox") && window.close();
        }, !1);
    };
}, function(module, exports, __webpack_require__) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), exports.handleChromeError = function(onOk, handleErr) {
        chrome.runtime.lastError ? handleErr(chrome.runtime.lastError) : onOk();
    };
}, function(module, exports, __webpack_require__) {
    var baseAssignValue = __webpack_require__(66), eq = __webpack_require__(34);
    module.exports = function(object, key, value) {
        (void 0 === value || eq(object[key], value)) && (void 0 !== value || key in object) || baseAssignValue(object, key, value);
    };
}, function(module, exports, __webpack_require__) {
    var getNative = __webpack_require__(25), defineProperty = function() {
        try {
            var func = getNative(Object, "defineProperty");
            return func({}, "", {}), func;
        } catch (e) {}
    }();
    module.exports = defineProperty;
}, function(module, exports, __webpack_require__) {
    var isArrayLike = __webpack_require__(26), isObjectLike = __webpack_require__(18);
    module.exports = function(value) {
        return isObjectLike(value) && isArrayLike(value);
    };
}, , , function(module, exports, __webpack_require__) {
    "use strict";
    function listen(e, event, cb, unbind, bubble) {
        if (void 0 === bubble && (bubble = !1), null != e) {
            var el = e;
            if ("string" != typeof event) return each(event, function(value, key) {
                listen(el, key, value, unbind);
            });
            if (cb) {
                var listeners = el[lKey] || [];
                return el[lKey] = listeners, unbind ? (el[lKey] = listeners.filter(function(l) {
                    return !(l.event === event && l.cb === cb);
                }), el.removeEventListener(event, cb, bubble)) : (listeners.push({
                    event: event,
                    cb: cb
                }), el.addEventListener(event, cb, bubble)), {
                    el: el,
                    event: event,
                    cb: cb,
                    bubble: bubble
                };
            }
        }
    }
    function unlisten(e, event, cb, bubble) {
        var el = e;
        event || null == el[lKey] ? listen(el, event, cb, !0, bubble) : el[lKey].forEach(function(l) {
            return unlisten(el, l.event, l.cb, l.bubble);
        });
    }
    Object.defineProperty(exports, "__esModule", {
        value: !0
    });
    var each = __webpack_require__(93), util_1 = (__webpack_require__(38), __webpack_require__(2)), lKey = util_1.guid();
    exports.listen = listen, exports.unlisten = unlisten;
}, function(module, exports, __webpack_require__) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    });
    var config = __webpack_require__(24), log_1 = __webpack_require__(39);
    exports.sendEventPixel = function(logger, message, level, extra, context) {
        var img = document.createElement("img"), payload = log_1.createEventPayload({
            logger: logger,
            level: level,
            message: message,
            extra: extra
        }, {
            appName: config.appName,
            appVersion: config.getVersion(),
            env: config.ENV,
            context: context
        });
        return img.src = log_1.felogRequestUrl(payload, config.URLS.newFelog), Promise.resolve();
    };
}, function(module, exports, __webpack_require__) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    });
    var Config = __webpack_require__(11), log_1 = __webpack_require__(39), telemetry_1 = __webpack_require__(94), stdlib_1 = __webpack_require__(4), log = __webpack_require__(1).Logger.create("lib.tracking.telemetry"), CARD_EVENTS_PROBABILITY = .1, PROXY_EVENTS_PROBABILITY = .05, usageMetricsProbability = {
        chrome: .01,
        firefox: .1,
        safari: .1,
        edge: 1
    }, getUsageMetricsProbability = function(target) {
        return usageMetricsProbability[target];
    }, Telemetry = function() {
        function Telemetry(_sendFelog, _sendFelogUsage, _setUserId, _setContainerId, _sendFelogTimings, _sendUsageMetrics, _perfMetrics, _sendPerfMetrics, _sendFelogManyEvents, _getUsageMetricsProbability) {
            void 0 === _sendFelog && (_sendFelog = stdlib_1.noOp), void 0 === _sendFelogUsage && (_sendFelogUsage = stdlib_1.noOp), 
            void 0 === _setUserId && (_setUserId = stdlib_1.noOp), void 0 === _setContainerId && (_setContainerId = stdlib_1.noOp), 
            void 0 === _sendFelogTimings && (_sendFelogTimings = stdlib_1.noOp), void 0 === _sendUsageMetrics && (_sendUsageMetrics = !1), 
            void 0 === _perfMetrics && (_perfMetrics = telemetry_1.PerformanceMetrics.dummy), 
            void 0 === _sendPerfMetrics && (_sendPerfMetrics = !1), void 0 === _sendFelogManyEvents && (_sendFelogManyEvents = stdlib_1.noOp), 
            void 0 === _getUsageMetricsProbability && (_getUsageMetricsProbability = getUsageMetricsProbability);
            var _this = this;
            this._sendFelog = _sendFelog, this._sendFelogUsage = _sendFelogUsage, this._setUserId = _setUserId, 
            this._setContainerId = _setContainerId, this._sendFelogTimings = _sendFelogTimings, 
            this._sendUsageMetrics = _sendUsageMetrics, this._perfMetrics = _perfMetrics, this._sendPerfMetrics = _sendPerfMetrics, 
            this._sendFelogManyEvents = _sendFelogManyEvents, this._getUsageMetricsProbability = _getUsageMetricsProbability, 
            this._perfMetricsThrottleTimeMs = 6e4, this._prepareDataString = function(logger, message, extra) {
                var dataString;
                try {
                    dataString = JSON.stringify(extra);
                } catch (err) {
                    dataString = "Failed to stringify event properties: '" + err + "', '" + (err && err.message) + "'", 
                    log.warn(dataString, "for " + message + "@" + logger);
                }
                return dataString;
            }, this.pageLoadTimeout = function() {
                _this._send("cs.connection.failover.pageLoad.timeout", "content script init failed", log_1.LogLevel.ERROR);
            }, this.appLoadTimeout = function() {
                _this._send("cs.connection.failover.appLoad.timeout", "extension init timed out", log_1.LogLevel.ERROR);
            }, this.differentStateDomain = function(stateDomain) {
                _this._send("cs.state.differentDomain", "received state for different domain", log_1.LogLevel.INFO, {
                    stateDomain: stateDomain
                });
            }, this.restoredBgConnection = function(timeWithoutConnection) {
                _this._send("cs.connection.bg.restored", "bg page connection restored", log_1.LogLevel.INFO, {
                    timeWithoutConnection: timeWithoutConnection
                });
            }, this.initWithoutBgConnection = function() {
                _this._send("cs.connection.bg.disconnected", "no connection to bg page", log_1.LogLevel.INFO);
            }, this.fetchDefinitionsFail = function() {
                _this._send("cs.connection.api.definition.failed", "definitions fetch failed", log_1.LogLevel.WARN);
            }, this.infinityCheckResetFail = function(delay) {
                _this._send("cs.connection.infiniteCheck.failed", "infinite check reset failed", log_1.LogLevel.ERROR, {
                    delay: delay
                });
            }, this.tooLongPageConfigInit = function(initTime) {
                _this._send("cs.pageConfig.init.exceeded", "page config init timeout", log_1.LogLevel.WARN, {
                    initTime: initTime
                });
            }, this.tooLongUserUpdateTime = function(updateTime) {
                _this._send("bg.state.user.update.exceeded", "user state update took too long", log_1.LogLevel.WARN, {
                    updateTime: updateTime
                });
            }, this.lostBgPageConnection = function() {
                _this._send("cs.gbutton.bgСonnection.lost", "gbutton connection to bg page lost", log_1.LogLevel.INFO);
            }, this.restoreBgPageConnection = function(time) {
                _this._send("cs.gbutton.bgСonnection.restored", "gbutton connection to bg page restored", log_1.LogLevel.INFO, {
                    time: time
                });
            }, this.badCursorPosition = function() {
                _this._send("cs.editor.badCursorPosition", "incorrect cursor position in grammarly-editor", log_1.LogLevel.INFO);
            }, this.cursorJump = function() {
                _this._send("cs.editor.cursorJump", "cursor jump detected", log_1.LogLevel.WARN);
            }, this.signinOpen = function() {
                _this._send("cs.signin.open", "sign in dialog opened", log_1.LogLevel.INFO);
            }, this.signinClose = function(openTime) {
                _this._send("cs.signin.close", "sign in dialog closed", log_1.LogLevel.INFO, {
                    openTime: openTime
                });
            }, this.tabReloadClick = function() {
                _this._send("cs.gbutton.reload.click", "gbutton reload clicked", log_1.LogLevel.WARN);
            }, this.popupLoadError = function(message, name) {
                _this._send("cs.popup.load.error", "could not open pop-up editor", log_1.LogLevel.ERROR, {
                    message: message,
                    name: name
                });
            }, this.loginNoBgPageConnection = function(message) {
                _this._send("debug.cs.connection.signin.bg.timeout", "can not connect to bg page on login", log_1.LogLevel.INFO, {
                    message: message
                });
            }, this.pageConfigCDNError = function(message) {
                _this._send("cs.pageConfig.cdn.error", "could not read page config", log_1.LogLevel.ERROR, {
                    message: message
                });
            }, this.pageConfigLocalStorageError = function(message, name) {
                _this._send("cs.pageConfig.localStorage.error", "could not read page config from localStorage", log_1.LogLevel.INFO, {
                    message: message,
                    name: name
                });
            }, this.pageConfigUpdated = function(oldVersion, newVersion) {
                _this._send("cs.pageConfig.updated", "page config updated", log_1.LogLevel.INFO, {
                    oldVersion: oldVersion,
                    newVersion: newVersion
                });
            }, this.settingsPopupTimeout = function() {
                _this._send("settings.popup.init.timeout", "settings popup open timeout", log_1.LogLevel.WARN);
            }, this.settingsUsupportedShow = function(popupType) {
                _this._send("settings.popup.state.unsupported.show", "page unsupported message shown", log_1.LogLevel.INFO, {
                    popupType: popupType
                });
            }, this.settingsPopupToggled = function(isPopupDisabled) {
                _this._send("settings.popup.experiment.toggle", "settings popup disabled/enabled for experiment on /personalize page", log_1.LogLevel.INFO, {
                    isPopupDisabled: isPopupDisabled
                });
            }, this.socketBgError = function() {
                _this._send("bg.socket.error", "bg page socket error", log_1.LogLevel.WARN);
            }, this.capiNotAuthorizedLoop = function(authDegradation, cookiesDisabled) {
                _this._send("debug.socket.notAuthorizedLoop", "could not authenticate on capi and auth", log_1.LogLevel.INFO, {
                    authDegradation: authDegradation,
                    cookiesDisabled: cookiesDisabled
                });
            }, this.socketDisabledCookie = function() {
                _this._send("debug.socket.disabledCookies", "disabled cookies after failed authentication", log_1.LogLevel.INFO);
            }, this.socketBgRestored = function(tryCount) {
                _this._send("debug.bg.socket.restored", "capi session restored", log_1.LogLevel.INFO, {
                    tryCount: tryCount
                });
            }, this.socketBgReconnectFail = function(token, tryCount) {
                _this._send("bg.socket.reconnect.fail", "could not restore ws connection", log_1.LogLevel.WARN, {
                    token: token,
                    tryCount: tryCount
                });
            }, this.socketCsError = function() {
                _this._send("cs.socket.error", "content script socket error", log_1.LogLevel.WARN);
            }, this.soketCsErrorMsg = function(message) {
                _this._send("cs.socket.errorMsg", "capi error", log_1.LogLevel.WARN, {
                    message: message
                });
            }, this.gnarClientInitFail = function(message) {
                _this._send("gnar.bg.tracking.gnar.init.fail", "gnar init failed", log_1.LogLevel.WARN, {
                    message: message
                });
            }, this.bgTrackingInitFail = function() {
                _this._send("debug.tracking.init.fail", "bg page tracking library init failed", log_1.LogLevel.INFO);
            }, this.gnarSpecUndefinedInit = function() {
                _this._send("debug.tracking.gnar.spec.init.fail", "gnar spec was failed to init", log_1.LogLevel.INFO);
            }, this.dailyPing = function() {
                _this._send("debug.dailyPing", "daily ping", log_1.LogLevel.INFO);
            }, this.userUpgradeClick = function(placement) {
                _this._send("cs.ui.action.upgradeClick", "upgrade hook clicked", log_1.LogLevel.INFO, {
                    placement: placement
                });
            }, this.gButtonClick = function() {
                _this._send("cs.ui.gbutton.click", "gbutton clicked", log_1.LogLevel.INFO);
            }, this.checkingToggledInField = function(enabled) {
                _this._send("cs.ui.gbutton.toggleInField", "checking toggled in field", log_1.LogLevel.INFO, {
                    enabled: enabled
                });
            }, this.sessionInvalidated = function(reason, userChanged) {
                _this._send("bg.session.invalidated", "user session invalidated", log_1.LogLevel.INFO, {
                    reason: reason,
                    userChanged: userChanged
                });
            }, this.unexpectedAnonymous = function(data) {
                _this._send("debug.bg.session.unexpectedAnonymous", "user changed to anonymous", log_1.LogLevel.INFO, data);
            }, this.dapiPropInitialized = function(name, value) {
                _this._send("bg.settings.dapi.prop.init", "save property to the DAPI", log_1.LogLevel.INFO, {
                    name: name,
                    value: value
                });
            }, this.getDapiPropError = function(property, body) {
                _this._send("bg.connection.dapi.getProp.error", "could not get dapi property", log_1.LogLevel.WARN, {
                    property: property,
                    body: body
                });
            }, this.setDapiPropError = function(property, body) {
                _this._send("bg.connection.dapi.setProp.error", "could not set dapi property", log_1.LogLevel.WARN, {
                    property: property,
                    body: body
                });
            }, this.toggleExtensionDefs = function(enabled) {
                _this._send("bg.settings.definitions.toggle", "definitions toggled for domain", log_1.LogLevel.INFO, {
                    enabled: enabled
                });
            }, this.toggleEmailPerception = function(enabled, placement) {
                _this._send("bg.settings.emailPerception.toggle", "emailPerception toggled", log_1.LogLevel.INFO, {
                    enabled: enabled,
                    placement: placement
                });
            }, this.toggleExtension = function(enabled, placement) {
                _this._send("bg.settings.extension.toggle", "extension toggled for domain", log_1.LogLevel.INFO, {
                    enabled: enabled,
                    placement: placement
                });
            }, this.disableUntilNextVisit = function() {
                _this._send("cs.gbutton.disableUntilNextVisit", "extension temporary disabled on the current tab", log_1.LogLevel.INFO);
            }, this.disableButtonClick = function() {
                _this._send("cs.gbutton.disableButtonClick", "clicked on disable button in gButton", log_1.LogLevel.INFO);
            }, this.cookieOverflow = function(size, biggestCookie) {
                _this._send("debug.bg.state.cookie.overflow", "cookie is too big", log_1.LogLevel.INFO, {
                    size: size,
                    biggestCookie: biggestCookie
                });
            }, this.externalChangePlan = function() {
                _this._send("bg.api.external.changePlan", "plan changed from editor", log_1.LogLevel.INFO);
            }, this.externalChangeDialect = function() {
                _this._send("bg.api.external.changeDialect", "dialect changed from editor", log_1.LogLevel.INFO);
            }, this.externalChangeUser = function() {
                _this._send("bg.api.external.changeUsed", "user changed from editor", log_1.LogLevel.INFO);
            }, this.externalLogout = function() {
                _this._send("bg.api.external.logout", "user logged out form editor", log_1.LogLevel.INFO);
            }, this.externalEnableEmailPerception = function() {
                _this._send("bg.api.external.enableEmailPerception", "user enabled email perception feature on the funnel", log_1.LogLevel.INFO);
            }, this.bgPageStartFail = function(message, stack) {
                _this._send("bg.start.fail", "bg page start failed", log_1.LogLevel.ERROR, {
                    message: message,
                    stack: stack
                });
            }, this.bgPageInitTimeout = function(initTime) {
                _this._send("bg.state.start.timeout", "bg page init timeout", log_1.LogLevel.WARN, {
                    initTime: initTime
                });
            }, this.bgPageInitFail = function(initAttempts) {
                _this._send("bg.state.init.fail", "bg page init failed", log_1.LogLevel.ERROR, {
                    initAttempts: initAttempts
                });
            }, this.extensionUpdated = function(currentVersion, previousVersion) {
                _this._send("bg.state.updated", "extension updated", log_1.LogLevel.INFO, {
                    currentVersion: currentVersion,
                    previousVersion: previousVersion
                });
            }, this.extensionUpdateFail = function(previousVersion) {
                _this._send("bg.state.update.fail", "extension update failed", log_1.LogLevel.INFO, {
                    previousVersion: previousVersion
                });
            }, this.cannotGetInstallSource = function() {
                _this._send("bg.getSource.fail", "failed to get extension install source", log_1.LogLevel.WARN);
            }, this.extensionInstall = function(source) {
                _this._send("bg.state.install", "extension installed", log_1.LogLevel.INFO, {
                    source: source
                });
            }, this.chromeForcedToUpdate = function(newVersion) {
                _this._send("bg.chrome.forcedToUpdate", "chrome forced update", log_1.LogLevel.INFO, {
                    newVersion: newVersion
                });
            }, this.chromeContentScriptLoadError = function(message, type) {
                _this._send("bg.chrome.cs.load.error", "content script execution error", log_1.LogLevel.WARN, {
                    message: message,
                    type: type
                });
            }, this.reloadNotificationShow = function() {
                _this._send("bg.ui.notification.tabsReload.show", "extension reload notification shown", log_1.LogLevel.WARN);
            }, this.reloadNotificationClick = function() {
                _this._send("bg.ui.notification.tabsReload.click", "reload notification clicked", log_1.LogLevel.INFO);
            }, this.fetchUserFail = function(reason, body, statusCode) {
                _this._send("bg.user.fetch.fail", "failed to update user", log_1.LogLevel.WARN, {
                    body: body,
                    statusCode: statusCode,
                    reason: reason
                });
            }, this.fetchMimicFail = function(body, statusCode) {
                _this._send("bg.user.mimic.fail", "mimic request failed", log_1.LogLevel.WARN, {
                    body: body,
                    statusCode: statusCode
                });
            }, this.fetchCookieFail = function() {
                _this._send("bg.cookie.fail", "could not get grauth from cookie", log_1.LogLevel.WARN);
            }, this.fetchSettingsFail = function(body, statusCode) {
                _this._send("bg.user.settings.fail", "could not get settings from auth", log_1.LogLevel.WARN, {
                    body: body,
                    statusCode: statusCode
                });
            }, this.frequentCookieChanges = function(canceled) {
                _this._send("debug.cookie.onChange.error", "cookie change too frequent", log_1.LogLevel.INFO, {
                    canceled: canceled
                });
            }, this.initializePropFromDapi = function(name) {
                _this._send("bg.state.dapi.prop.initialize", "set property from dapi", log_1.LogLevel.INFO, {
                    name: name
                });
            }, this.emailPerceptionPopupShow = function() {
                _this._send("cs.emailPerception.popup.show", "show email perception popup on gmail/inbox domain", log_1.LogLevel.INFO);
            }, this.emailPerceptionPopupCancel = function() {
                _this._send("cs.emailPerception.popup.cancel", "user canceled email perception popup on gmail/inbox", log_1.LogLevel.INFO);
            }, this.onboardingPopupShow = function() {
                _this._send("cs.onboarding.popup.show", "show onboarding popup to user after first time extension install", log_1.LogLevel.INFO);
            }, this.onboardingPopupCancel = function() {
                _this._send("cs.onboarding.popup.cancel", "user canceled onboarding popup", log_1.LogLevel.INFO);
            }, this.onboardingTutorialShow = function() {
                _this._send("cs.onboarding.tutorial.show", "opened onboarding dialog after popup", log_1.LogLevel.INFO);
            }, this.onboardingVideoLoaded = function() {
                _this._send("cs.onboarding.tutorial.video.loaded", "load video data for onboarding tutorial", log_1.LogLevel.INFO);
            }, this.saveEmailFeedbackError = function(body) {
                _this._send("bg.emailfeedback.save.error", "failed to save email feedback", log_1.LogLevel.INFO, {
                    body: body
                });
            }, this.incognitoInit = function() {
                _this._send("bg.incognito.init", "extension initialized in incognito mode", log_1.LogLevel.INFO);
            }, this.disabledCookiesInit = function() {
                _this._send("bg.cookie.disabled", "extension initialized with disabled cookies", log_1.LogLevel.INFO);
            }, this.proxyInit = function() {
                _this._sendWithProbability(PROXY_EVENTS_PROBABILITY, "proxy.init", "proxy script initialized", log_1.LogLevel.INFO);
            }, this.proxyPortDisconnected = function(portName, errorMessage) {
                _this._sendWithProbability(PROXY_EVENTS_PROBABILITY, "proxy.disconnect", "proxy port disconnected", log_1.LogLevel.INFO, {
                    port: portName,
                    error: errorMessage
                });
            }, this.unhandledBgPageException = function(e) {
                _this._send("bg.unhandledException", "unhandled exception on background page", log_1.LogLevel.ERROR, {
                    message: e.error ? e.error.message : e.message
                });
            }, this.unhandledBgPageRejection = function(e) {
                _this._send("bg.unhandledRejection", "unhandled promise rejection on background page", log_1.LogLevel.ERROR, {
                    message: null != e.reason ? "string" == typeof e.reason ? e.reason : e.reason.message : void 0
                });
            }, this.storageMigrationSucceeded = function() {
                _this._send("bg.storageMigration.success", "storage migration succeeded", log_1.LogLevel.INFO, {});
            }, this.storageMigrationFailed = function(e) {
                _this._send("bg.storageMigration.failure", "storage migration failed", log_1.LogLevel.ERROR, {
                    message: e && e.message
                });
            }, this.cardShowAction = function() {
                _this._sendWithProbability(CARD_EVENTS_PROBABILITY, "cs.editor.card.show", "show card action", log_1.LogLevel.INFO);
            }, this.cardHideAction = function() {
                _this._sendWithProbability(CARD_EVENTS_PROBABILITY, "cs.editor.card.hide", "hide card action", log_1.LogLevel.INFO);
            }, this.cardReplacementAction = function() {
                _this._sendWithProbability(CARD_EVENTS_PROBABILITY, "cs.editor.card.replacement", "click on the replacement in the card", log_1.LogLevel.INFO);
            }, this.cardAddToDictAction = function() {
                _this._sendWithProbability(CARD_EVENTS_PROBABILITY, "cs.editor.card.addToDict", "click add to dictionary button in the card", log_1.LogLevel.INFO);
            }, this.cardIgnoreAction = function() {
                _this._sendWithProbability(CARD_EVENTS_PROBABILITY, "cs.editor.card.ignore", "click ignore button in the card", log_1.LogLevel.INFO);
            }, this.synonymCardShowAction = function(notFoundCard) {
                _this._sendWithProbability(CARD_EVENTS_PROBABILITY, "cs.editor.synonym.show", "show synonymous card action", log_1.LogLevel.INFO, {
                    notFoundCard: notFoundCard
                });
            }, this.synonymCardHideAction = function(notFoundCard) {
                _this._sendWithProbability(CARD_EVENTS_PROBABILITY, "cs.editor.synonym.hide", "hide synonymous card action", log_1.LogLevel.INFO, {
                    notFoundCard: notFoundCard
                });
            }, this.synonymReplacementAction = function() {
                _this._sendWithProbability(CARD_EVENTS_PROBABILITY, "cs.editor.synonym.replacement", "click on the replacement in the synonym", log_1.LogLevel.INFO);
            }, this.dictCardShowAction = function() {
                _this._sendWithProbability(CARD_EVENTS_PROBABILITY, "cs.editor.dict.show", "show dictionary card action", log_1.LogLevel.INFO);
            }, this.dictCardHideAction = function() {
                _this._sendWithProbability(CARD_EVENTS_PROBABILITY, "cs.editor.dict.hide", "hide dictionary card action", log_1.LogLevel.INFO);
            }, this.couldNotParseTransform = function(transformHTML, fallbackParseSuccessful) {
                _this._send("cs.cards.transforms.parse.error", "Could not parse transform in inline cards", log_1.LogLevel.WARN, {
                    transformHTML: transformHTML,
                    fallbackParseSuccessful: fallbackParseSuccessful
                });
            }, this.disabledTabLoad = function(domain, accountType) {
                _this._sendUsage("usage.loadOnDisabledTab", "tab load event with disabled extension", log_1.LogLevel.INFO, {
                    domain: domain,
                    accountType: accountType
                });
            }, this.disabledTabByUserLoad = function(domain, accountType) {
                _this._sendUsage("usage.loadOnDisabledByUserTab", "tab load event with disabled by user extension", log_1.LogLevel.INFO, {
                    domain: domain,
                    accountType: accountType
                });
            }, this.initSession = function(domain, accountType, fieldType, fieldSupported) {
                _this._sendUsage("usage.session.init", "init in the field", log_1.LogLevel.INFO, {
                    domain: domain,
                    accountType: accountType,
                    fieldType: fieldType,
                    fieldSupported: fieldSupported
                });
            }, this.cardFirstInteraction = function(domain, accountType, fieldType) {
                _this._sendUsage("usage.card.interaction", "interaction with card in the field", log_1.LogLevel.INFO, {
                    domain: domain,
                    accountType: accountType,
                    fieldType: fieldType
                });
            }, this.gDocsSomethingWentWrongNotification = function() {
                return _this._send("cs.gdocs.notifications.somethingWentWrong", "GDocs something went wrong notification shown", log_1.LogLevel.INFO);
            }, this.performance = {
                pageFieldsWatch: this._createMetric("cs.pageFields.watch"),
                grammarlyEditorInput: this._createMetric("cs.grammarlyEditor.input")
            };
        }
        return Telemetry.prototype._send = function(logger, message, level, extra) {
            var dataString = this._prepareDataString(logger, message, extra);
            try {
                this._sendFelog(logger, message, level, null != extra ? {
                    json: dataString
                } : void 0);
            } catch (err) {
                log.warn("Failed to send felog for " + message + "@" + logger + ": '" + (err && err.message) + "'", err);
            }
        }, Telemetry.prototype._sendMany = function(logger, events) {
            try {
                this._sendFelogManyEvents(events);
            } catch (err) {
                log.warn("Failed to send performance data for " + logger + ": '" + (err && err.message) + "'", err);
            }
        }, Telemetry.prototype._sendUsage = function(logger, message, level, usage) {
            if (this._sendUsageMetrics && this._getUsageMetricsProbability(Config.getGlobal().bundleInfo.browser) > Math.random()) try {
                this._sendFelogUsage(logger, message, level, usage);
            } catch (err) {
                log.warn("Failed to send usage felog for " + message + "@" + logger + ": '" + (err && err.message) + "'", err);
            }
        }, Telemetry.prototype._sendTimings = function(logger, timings) {
            try {
                this._sendFelogTimings(logger, timings);
            } catch (err) {
                log.warn("Failed to send felog timings for " + logger + ": '" + (err && err.message) + "'", err);
            }
        }, Telemetry.prototype._sendWithProbability = function(probability, logger, message, level, extra) {
            probability > Math.random() && this._send(logger, message, level, extra);
        }, Telemetry.prototype._createMetric = function(name) {
            var _this = this;
            if (this._sendPerfMetrics) {
                var flush_1 = stdlib_1.throttle(this._perfMetricsThrottleTimeMs, function() {
                    _this._sendMany(name, _this._perfMetrics.flushMeasures(name).map(function(x) {
                        return {
                            logger: name,
                            level: log_1.LogLevel.INFO,
                            message: "",
                            extra_performance: parseFloat(x.toFixed(4))
                        };
                    }));
                });
                return {
                    startMeasure: function() {
                        log.debug("startMeasure: " + name);
                        var r = _this._perfMetrics.startMeasure(name);
                        return {
                            endMeasure: function() {
                                r.endMeasure(), flush_1();
                            }
                        };
                    },
                    measure: function(fn) {
                        log.debug("measure: " + name);
                        var r = _this._perfMetrics.measure(name, fn);
                        return flush_1(), r;
                    }
                };
            }
            return {
                startMeasure: function() {
                    return {
                        endMeasure: stdlib_1.noOp
                    };
                },
                measure: function(fn) {
                    return fn();
                }
            };
        }, Telemetry.prototype.setUserId = function(id) {
            this._setUserId(id);
        }, Telemetry.prototype.setContainerId = function(id) {
            this._setContainerId(id);
        }, Telemetry.prototype.notificationShown = function(type) {
            this._send("cs.notification.show", "show notification on the page", log_1.LogLevel.INFO, {
                type: type
            });
        }, Telemetry.prototype.notificationHide = function(type) {
            this._send("cs.notification.hide", "hide notification on the page", log_1.LogLevel.INFO, {
                type: type
            });
        }, Telemetry;
    }();
    exports.Telemetry = Telemetry;
}, function(module, exports, __webpack_require__) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    });
    var repeat = exports.repeat = function(str, times) {
        return new Array(times + 1).join(str);
    }, pad = exports.pad = function(num, maxLength) {
        return repeat("0", maxLength - num.toString().length) + num;
    };
    exports.formatTime = function(time) {
        return pad(time.getHours(), 2) + ":" + pad(time.getMinutes(), 2) + ":" + pad(time.getSeconds(), 2) + "." + pad(time.getMilliseconds(), 3);
    }, exports.timer = "undefined" != typeof performance && null !== performance && "function" == typeof performance.now ? performance : Date;
}, function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    Object.defineProperty(__webpack_exports__, "__esModule", {
        value: !0
    });
    var __WEBPACK_IMPORTED_MODULE_0__createStore__ = __webpack_require__(139), __WEBPACK_IMPORTED_MODULE_1__combineReducers__ = __webpack_require__(301), __WEBPACK_IMPORTED_MODULE_2__bindActionCreators__ = __webpack_require__(302), __WEBPACK_IMPORTED_MODULE_3__applyMiddleware__ = __webpack_require__(303), __WEBPACK_IMPORTED_MODULE_4__compose__ = __webpack_require__(142);
    __webpack_require__(141);
    __webpack_require__.d(__webpack_exports__, "createStore", function() {
        return __WEBPACK_IMPORTED_MODULE_0__createStore__.b;
    }), __webpack_require__.d(__webpack_exports__, "combineReducers", function() {
        return __WEBPACK_IMPORTED_MODULE_1__combineReducers__.a;
    }), __webpack_require__.d(__webpack_exports__, "bindActionCreators", function() {
        return __WEBPACK_IMPORTED_MODULE_2__bindActionCreators__.a;
    }), __webpack_require__.d(__webpack_exports__, "applyMiddleware", function() {
        return __WEBPACK_IMPORTED_MODULE_3__applyMiddleware__.a;
    }), __webpack_require__.d(__webpack_exports__, "compose", function() {
        return __WEBPACK_IMPORTED_MODULE_4__compose__.a;
    });
}, function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    function createStore(reducer, preloadedState, enhancer) {
        function ensureCanMutateNextListeners() {
            nextListeners === currentListeners && (nextListeners = currentListeners.slice());
        }
        function getState() {
            return currentState;
        }
        function subscribe(listener) {
            if ("function" != typeof listener) throw new Error("Expected listener to be a function.");
            var isSubscribed = !0;
            return ensureCanMutateNextListeners(), nextListeners.push(listener), function() {
                if (isSubscribed) {
                    isSubscribed = !1, ensureCanMutateNextListeners();
                    var index = nextListeners.indexOf(listener);
                    nextListeners.splice(index, 1);
                }
            };
        }
        function dispatch(action) {
            if (!Object(__WEBPACK_IMPORTED_MODULE_0_lodash_es_isPlainObject__.a)(action)) throw new Error("Actions must be plain objects. Use custom middleware for async actions.");
            if (void 0 === action.type) throw new Error('Actions may not have an undefined "type" property. Have you misspelled a constant?');
            if (isDispatching) throw new Error("Reducers may not dispatch actions.");
            try {
                isDispatching = !0, currentState = currentReducer(currentState, action);
            } finally {
                isDispatching = !1;
            }
            for (var listeners = currentListeners = nextListeners, i = 0; i < listeners.length; i++) (0, 
            listeners[i])();
            return action;
        }
        var _ref2;
        if ("function" == typeof preloadedState && void 0 === enhancer && (enhancer = preloadedState, 
        preloadedState = void 0), void 0 !== enhancer) {
            if ("function" != typeof enhancer) throw new Error("Expected the enhancer to be a function.");
            return enhancer(createStore)(reducer, preloadedState);
        }
        if ("function" != typeof reducer) throw new Error("Expected the reducer to be a function.");
        var currentReducer = reducer, currentState = preloadedState, currentListeners = [], nextListeners = currentListeners, isDispatching = !1;
        return dispatch({
            type: ActionTypes.INIT
        }), _ref2 = {
            dispatch: dispatch,
            subscribe: subscribe,
            getState: getState,
            replaceReducer: function(nextReducer) {
                if ("function" != typeof nextReducer) throw new Error("Expected the nextReducer to be a function.");
                currentReducer = nextReducer, dispatch({
                    type: ActionTypes.INIT
                });
            }
        }, _ref2[__WEBPACK_IMPORTED_MODULE_1_symbol_observable___default.a] = function() {
            var _ref, outerSubscribe = subscribe;
            return _ref = {
                subscribe: function(observer) {
                    function observeState() {
                        observer.next && observer.next(getState());
                    }
                    if ("object" != typeof observer) throw new TypeError("Expected the observer to be an object.");
                    return observeState(), {
                        unsubscribe: outerSubscribe(observeState)
                    };
                }
            }, _ref[__WEBPACK_IMPORTED_MODULE_1_symbol_observable___default.a] = function() {
                return this;
            }, _ref;
        }, _ref2;
    }
    __webpack_require__.d(__webpack_exports__, "a", function() {
        return ActionTypes;
    }), __webpack_exports__.b = createStore;
    var __WEBPACK_IMPORTED_MODULE_0_lodash_es_isPlainObject__ = __webpack_require__(109), __WEBPACK_IMPORTED_MODULE_1_symbol_observable__ = __webpack_require__(298), __WEBPACK_IMPORTED_MODULE_1_symbol_observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_symbol_observable__), ActionTypes = {
        INIT: "@@redux/INIT"
    };
}, function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    var Symbol = __webpack_require__(291).a.Symbol;
    __webpack_exports__.a = Symbol;
}, function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
}, function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    __webpack_exports__.a = function() {
        for (var _len = arguments.length, funcs = Array(_len), _key = 0; _key < _len; _key++) funcs[_key] = arguments[_key];
        return 0 === funcs.length ? function(arg) {
            return arg;
        } : 1 === funcs.length ? funcs[0] : funcs.reduce(function(a, b) {
            return function() {
                return a(b.apply(void 0, arguments));
            };
        });
    };
}, function(module, exports, __webpack_require__) {
    "use strict";
    function _interopRequireWildcard(obj) {
        if (obj && obj.__esModule) return obj;
        var newObj = {};
        if (null != obj) for (var key in obj) Object.prototype.hasOwnProperty.call(obj, key) && (newObj[key] = obj[key]);
        return newObj.default = obj, newObj;
    }
    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), exports.utils = exports.effects = exports.takeLatest = exports.takeEvery = exports.storeIO = exports.runSaga = exports.isCancelError = exports.SagaCancellationException = void 0;
    var _runSaga = __webpack_require__(305);
    Object.defineProperty(exports, "runSaga", {
        enumerable: !0,
        get: function() {
            return _runSaga.runSaga;
        }
    }), Object.defineProperty(exports, "storeIO", {
        enumerable: !0,
        get: function() {
            return _runSaga.storeIO;
        }
    });
    var _sagaHelpers = __webpack_require__(306);
    Object.defineProperty(exports, "takeEvery", {
        enumerable: !0,
        get: function() {
            return _sagaHelpers.takeEvery;
        }
    }), Object.defineProperty(exports, "takeLatest", {
        enumerable: !0,
        get: function() {
            return _sagaHelpers.takeLatest;
        }
    });
    var _middleware2 = _interopRequireDefault(__webpack_require__(307)), _SagaCancellationException3 = _interopRequireDefault(__webpack_require__(56)), effects = _interopRequireWildcard(__webpack_require__(145)), utils = _interopRequireWildcard(__webpack_require__(308));
    exports.default = _middleware2.default;
    var SagaCancellationException = exports.SagaCancellationException = _SagaCancellationException3.default;
    exports.isCancelError = function(error) {
        return error instanceof SagaCancellationException;
    };
    exports.effects = effects, exports.utils = utils;
}, function(module, exports, __webpack_require__) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), exports.default = function() {
        var cbs = [];
        return {
            subscribe: function(cb) {
                return cbs.push(cb), function() {
                    return (0, _utils.remove)(cbs, cb);
                };
            },
            emit: function(item) {
                cbs.slice().forEach(function(cb) {
                    return cb(item);
                });
            }
        };
    };
    var _utils = __webpack_require__(19);
}, function(module, exports, __webpack_require__) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), exports.select = exports.cancel = exports.join = exports.fork = exports.cps = exports.apply = exports.call = exports.race = exports.put = exports.take = void 0;
    var _io = __webpack_require__(55);
    exports.take = _io.take, exports.put = _io.put, exports.race = _io.race, exports.call = _io.call, 
    exports.apply = _io.apply, exports.cps = _io.cps, exports.fork = _io.fork, exports.join = _io.join, 
    exports.cancel = _io.cancel, exports.select = _io.select;
}, function(module, exports, __webpack_require__) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    });
    var userActions = __webpack_require__(110), settingsActions = __webpack_require__(67), connectionActions = __webpack_require__(95);
    exports.pureActions = Object.assign({}, userActions, connectionActions, settingsActions);
}, function(module, exports, __webpack_require__) {
    "use strict";
    function makeEmptyFunction(arg) {
        return function() {
            return arg;
        };
    }
    var emptyFunction = function() {};
    emptyFunction.thatReturns = makeEmptyFunction, emptyFunction.thatReturnsFalse = makeEmptyFunction(!1), 
    emptyFunction.thatReturnsTrue = makeEmptyFunction(!0), emptyFunction.thatReturnsNull = makeEmptyFunction(null), 
    emptyFunction.thatReturnsThis = function() {
        return this;
    }, emptyFunction.thatReturnsArgument = function(arg) {
        return arg;
    }, module.exports = emptyFunction;
}, function(module, exports, __webpack_require__) {
    var __WEBPACK_AMD_DEFINE_RESULT__;
    !function(factory) {
        "use strict";
        var root = "undefined" == typeof window ? null : window;
        void 0 !== (__WEBPACK_AMD_DEFINE_RESULT__ = function() {
            return factory(root);
        }.call(exports, __webpack_require__, exports, module)) && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__);
    }(function factory(window) {
        "use strict";
        var DOMPurify = function(window) {
            return factory(window);
        };
        if (DOMPurify.version = "0.9.0", DOMPurify.removed = [], !window || !window.document || 9 !== window.document.nodeType) return DOMPurify.isSupported = !1, 
        DOMPurify;
        var document = window.document, originalDocument = document, DocumentFragment = window.DocumentFragment, HTMLTemplateElement = window.HTMLTemplateElement, Node = window.Node, NodeFilter = window.NodeFilter, NamedNodeMap = window.NamedNodeMap || window.MozNamedAttrMap, Text = window.Text, Comment = window.Comment, DOMParser = window.DOMParser, XMLHttpRequest = window.XMLHttpRequest, encodeURI = window.encodeURI, useXHR = !1, useDOMParser = !1;
        if ("function" == typeof HTMLTemplateElement) {
            var template = document.createElement("template");
            template.content && template.content.ownerDocument && (document = template.content.ownerDocument);
        }
        var implementation = document.implementation, createNodeIterator = document.createNodeIterator, getElementsByTagName = document.getElementsByTagName, createDocumentFragment = document.createDocumentFragment, importNode = originalDocument.importNode, hooks = {};
        DOMPurify.isSupported = void 0 !== implementation.createHTMLDocument && 9 !== document.documentMode;
        var _addToSet = function(set, array) {
            for (var l = array.length; l--; ) "string" == typeof array[l] && (array[l] = array[l].toLowerCase()), 
            set[array[l]] = !0;
            return set;
        }, _cloneObj = function(object) {
            var property, newObject = {};
            for (property in object) object.hasOwnProperty(property) && (newObject[property] = object[property]);
            return newObject;
        }, ALLOWED_TAGS = null, DEFAULT_ALLOWED_TAGS = _addToSet({}, [ "a", "abbr", "acronym", "address", "area", "article", "aside", "audio", "b", "bdi", "bdo", "big", "blink", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "content", "data", "datalist", "dd", "decorator", "del", "details", "dfn", "dir", "div", "dl", "dt", "element", "em", "fieldset", "figcaption", "figure", "font", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "img", "input", "ins", "kbd", "label", "legend", "li", "main", "map", "mark", "marquee", "menu", "menuitem", "meter", "nav", "nobr", "ol", "optgroup", "option", "output", "p", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "section", "select", "shadow", "small", "source", "spacer", "span", "strike", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "tr", "track", "tt", "u", "ul", "var", "video", "wbr", "svg", "altglyph", "altglyphdef", "altglyphitem", "animatecolor", "animatemotion", "animatetransform", "circle", "clippath", "defs", "desc", "ellipse", "filter", "font", "g", "glyph", "glyphref", "hkern", "image", "line", "lineargradient", "marker", "mask", "metadata", "mpath", "path", "pattern", "polygon", "polyline", "radialgradient", "rect", "stop", "switch", "symbol", "text", "textpath", "title", "tref", "tspan", "view", "vkern", "feBlend", "feColorMatrix", "feComponentTransfer", "feComposite", "feConvolveMatrix", "feDiffuseLighting", "feDisplacementMap", "feFlood", "feFuncA", "feFuncB", "feFuncG", "feFuncR", "feGaussianBlur", "feMerge", "feMergeNode", "feMorphology", "feOffset", "feSpecularLighting", "feTile", "feTurbulence", "math", "menclose", "merror", "mfenced", "mfrac", "mglyph", "mi", "mlabeledtr", "mmuliscripts", "mn", "mo", "mover", "mpadded", "mphantom", "mroot", "mrow", "ms", "mpspace", "msqrt", "mystyle", "msub", "msup", "msubsup", "mtable", "mtd", "mtext", "mtr", "munder", "munderover", "#text" ]), ALLOWED_ATTR = null, DEFAULT_ALLOWED_ATTR = _addToSet({}, [ "accept", "action", "align", "alt", "autocomplete", "background", "bgcolor", "border", "cellpadding", "cellspacing", "checked", "cite", "class", "clear", "color", "cols", "colspan", "coords", "datetime", "default", "dir", "disabled", "download", "enctype", "face", "for", "headers", "height", "hidden", "high", "href", "hreflang", "id", "ismap", "label", "lang", "list", "loop", "low", "max", "maxlength", "media", "method", "min", "multiple", "name", "noshade", "novalidate", "nowrap", "open", "optimum", "pattern", "placeholder", "poster", "preload", "pubdate", "radiogroup", "readonly", "rel", "required", "rev", "reversed", "role", "rows", "rowspan", "spellcheck", "scope", "selected", "shape", "size", "span", "srclang", "start", "src", "step", "style", "summary", "tabindex", "title", "type", "usemap", "valign", "value", "width", "xmlns", "accent-height", "accumulate", "additivive", "alignment-baseline", "ascent", "attributename", "attributetype", "azimuth", "basefrequency", "baseline-shift", "begin", "bias", "by", "clip", "clip-path", "clip-rule", "color", "color-interpolation", "color-interpolation-filters", "color-profile", "color-rendering", "cx", "cy", "d", "dx", "dy", "diffuseconstant", "direction", "display", "divisor", "dur", "edgemode", "elevation", "end", "fill", "fill-opacity", "fill-rule", "filter", "flood-color", "flood-opacity", "font-family", "font-size", "font-size-adjust", "font-stretch", "font-style", "font-variant", "font-weight", "fx", "fy", "g1", "g2", "glyph-name", "glyphref", "gradientunits", "gradienttransform", "image-rendering", "in", "in2", "k", "k1", "k2", "k3", "k4", "kerning", "keypoints", "keysplines", "keytimes", "lengthadjust", "letter-spacing", "kernelmatrix", "kernelunitlength", "lighting-color", "local", "marker-end", "marker-mid", "marker-start", "markerheight", "markerunits", "markerwidth", "maskcontentunits", "maskunits", "max", "mask", "mode", "min", "numoctaves", "offset", "operator", "opacity", "order", "orient", "orientation", "origin", "overflow", "paint-order", "path", "pathlength", "patterncontentunits", "patterntransform", "patternunits", "points", "preservealpha", "r", "rx", "ry", "radius", "refx", "refy", "repeatcount", "repeatdur", "restart", "result", "rotate", "scale", "seed", "shape-rendering", "specularconstant", "specularexponent", "spreadmethod", "stddeviation", "stitchtiles", "stop-color", "stop-opacity", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke", "stroke-width", "surfacescale", "targetx", "targety", "transform", "text-anchor", "text-decoration", "text-rendering", "textlength", "u1", "u2", "unicode", "values", "viewbox", "visibility", "vert-adv-y", "vert-origin-x", "vert-origin-y", "word-spacing", "wrap", "writing-mode", "xchannelselector", "ychannelselector", "x", "x1", "x2", "y", "y1", "y2", "z", "zoomandpan", "accent", "accentunder", "bevelled", "close", "columnsalign", "columnlines", "columnspan", "denomalign", "depth", "display", "displaystyle", "fence", "frame", "largeop", "length", "linethickness", "lspace", "lquote", "mathbackground", "mathcolor", "mathsize", "mathvariant", "maxsize", "minsize", "movablelimits", "notation", "numalign", "open", "rowalign", "rowlines", "rowspacing", "rowspan", "rspace", "rquote", "scriptlevel", "scriptminsize", "scriptsizemultiplier", "selection", "separator", "separators", "stretchy", "subscriptshift", "supscriptshift", "symmetric", "voffset", "xlink:href", "xml:id", "xlink:title", "xml:space", "xmlns:xlink" ]), FORBID_TAGS = null, FORBID_ATTR = null, ALLOW_ARIA_ATTR = !0, ALLOW_DATA_ATTR = !0, ALLOW_UNKNOWN_PROTOCOLS = !1, SAFE_FOR_JQUERY = !1, SAFE_FOR_TEMPLATES = !1, MUSTACHE_EXPR = /\{\{[\s\S]*|[\s\S]*\}\}/gm, ERB_EXPR = /<%[\s\S]*|[\s\S]*%>/gm, WHOLE_DOCUMENT = !1, SET_CONFIG = !1, FORCE_BODY = !1, RETURN_DOM = !1, RETURN_DOM_FRAGMENT = !1, RETURN_DOM_IMPORT = !1, SANITIZE_DOM = !0, KEEP_CONTENT = !0, FORBID_CONTENTS = _addToSet({}, [ "audio", "head", "math", "script", "style", "template", "svg", "video" ]), DATA_URI_TAGS = _addToSet({}, [ "audio", "video", "img", "source", "image" ]), URI_SAFE_ATTRIBUTES = _addToSet({}, [ "alt", "class", "for", "id", "label", "name", "pattern", "placeholder", "summary", "title", "value", "style", "xmlns" ]), CONFIG = null, formElement = document.createElement("form"), _parseConfig = function(cfg) {
            "object" != typeof cfg && (cfg = {}), ALLOWED_TAGS = "ALLOWED_TAGS" in cfg ? _addToSet({}, cfg.ALLOWED_TAGS) : DEFAULT_ALLOWED_TAGS, 
            ALLOWED_ATTR = "ALLOWED_ATTR" in cfg ? _addToSet({}, cfg.ALLOWED_ATTR) : DEFAULT_ALLOWED_ATTR, 
            FORBID_TAGS = "FORBID_TAGS" in cfg ? _addToSet({}, cfg.FORBID_TAGS) : {}, FORBID_ATTR = "FORBID_ATTR" in cfg ? _addToSet({}, cfg.FORBID_ATTR) : {}, 
            ALLOW_ARIA_ATTR = !1 !== cfg.ALLOW_ARIA_ATTR, ALLOW_DATA_ATTR = !1 !== cfg.ALLOW_DATA_ATTR, 
            ALLOW_UNKNOWN_PROTOCOLS = cfg.ALLOW_UNKNOWN_PROTOCOLS || !1, SAFE_FOR_JQUERY = cfg.SAFE_FOR_JQUERY || !1, 
            SAFE_FOR_TEMPLATES = cfg.SAFE_FOR_TEMPLATES || !1, WHOLE_DOCUMENT = cfg.WHOLE_DOCUMENT || !1, 
            RETURN_DOM = cfg.RETURN_DOM || !1, RETURN_DOM_FRAGMENT = cfg.RETURN_DOM_FRAGMENT || !1, 
            RETURN_DOM_IMPORT = cfg.RETURN_DOM_IMPORT || !1, FORCE_BODY = cfg.FORCE_BODY || !1, 
            SANITIZE_DOM = !1 !== cfg.SANITIZE_DOM, KEEP_CONTENT = !1 !== cfg.KEEP_CONTENT, 
            SAFE_FOR_TEMPLATES && (ALLOW_DATA_ATTR = !1), RETURN_DOM_FRAGMENT && (RETURN_DOM = !0), 
            cfg.ADD_TAGS && (ALLOWED_TAGS === DEFAULT_ALLOWED_TAGS && (ALLOWED_TAGS = _cloneObj(ALLOWED_TAGS)), 
            _addToSet(ALLOWED_TAGS, cfg.ADD_TAGS)), cfg.ADD_ATTR && (ALLOWED_ATTR === DEFAULT_ALLOWED_ATTR && (ALLOWED_ATTR = _cloneObj(ALLOWED_ATTR)), 
            _addToSet(ALLOWED_ATTR, cfg.ADD_ATTR)), cfg.ADD_URI_SAFE_ATTR && _addToSet(URI_SAFE_ATTRIBUTES, cfg.ADD_URI_SAFE_ATTR), 
            KEEP_CONTENT && (ALLOWED_TAGS["#text"] = !0), Object && "freeze" in Object && Object.freeze(cfg), 
            CONFIG = cfg;
        }, _forceRemove = function(node) {
            DOMPurify.removed.push({
                element: node
            });
            try {
                node.parentNode.removeChild(node);
            } catch (e) {
                node.outerHTML = "";
            }
        }, _removeAttribute = function(name, node) {
            DOMPurify.removed.push({
                attribute: node.getAttributeNode(name),
                from: node
            }), node.removeAttribute(name);
        }, _initDocument = function(dirty) {
            var doc, body;
            if (FORCE_BODY && (dirty = "<remove></remove>" + dirty), useXHR) {
                try {
                    dirty = encodeURI(dirty);
                } catch (e) {}
                var xhr = new XMLHttpRequest();
                xhr.responseType = "document", xhr.open("GET", "data:text/html;charset=utf-8," + dirty, !1), 
                xhr.send(null), doc = xhr.response;
            }
            if (useDOMParser) try {
                doc = new DOMParser().parseFromString(dirty, "text/html");
            } catch (e) {}
            return doc && doc.documentElement || ((body = (doc = implementation.createHTMLDocument("")).body).parentNode.removeChild(body.parentNode.firstElementChild), 
            body.outerHTML = dirty), getElementsByTagName.call(doc, WHOLE_DOCUMENT ? "html" : "body")[0];
        };
        DOMPurify.isSupported && function() {
            var doc = _initDocument('<svg><g onload="this.parentNode.remove()"></g></svg>');
            doc.querySelector("svg") || (useXHR = !0), (doc = _initDocument('<svg><p><style><img src="</style><img src=x onerror=alert(1)//">')).querySelector("svg img") && (useDOMParser = !0);
        }();
        var _createIterator = function(root) {
            return createNodeIterator.call(root.ownerDocument || root, root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_COMMENT | NodeFilter.SHOW_TEXT, function() {
                return NodeFilter.FILTER_ACCEPT;
            }, !1);
        }, _isClobbered = function(elm) {
            return !(elm instanceof Text || elm instanceof Comment) && !("string" == typeof elm.nodeName && "string" == typeof elm.textContent && "function" == typeof elm.removeChild && elm.attributes instanceof NamedNodeMap && "function" == typeof elm.removeAttribute && "function" == typeof elm.setAttribute);
        }, _isNode = function(obj) {
            return "object" == typeof Node ? obj instanceof Node : obj && "object" == typeof obj && "number" == typeof obj.nodeType && "string" == typeof obj.nodeName;
        }, _sanitizeElements = function(currentNode) {
            var tagName, content;
            if (_executeHook("beforeSanitizeElements", currentNode, null), _isClobbered(currentNode)) return _forceRemove(currentNode), 
            !0;
            if (tagName = currentNode.nodeName.toLowerCase(), _executeHook("uponSanitizeElement", currentNode, {
                tagName: tagName,
                allowedTags: ALLOWED_TAGS
            }), !ALLOWED_TAGS[tagName] || FORBID_TAGS[tagName]) {
                if (KEEP_CONTENT && !FORBID_CONTENTS[tagName] && "function" == typeof currentNode.insertAdjacentHTML) try {
                    currentNode.insertAdjacentHTML("AfterEnd", currentNode.innerHTML);
                } catch (e) {}
                return _forceRemove(currentNode), !0;
            }
            return !SAFE_FOR_JQUERY || currentNode.firstElementChild || currentNode.content && currentNode.content.firstElementChild || !/</g.test(currentNode.textContent) || (DOMPurify.removed.push({
                element: currentNode.cloneNode()
            }), currentNode.innerHTML = currentNode.textContent.replace(/</g, "&lt;")), SAFE_FOR_TEMPLATES && 3 === currentNode.nodeType && (content = (content = (content = currentNode.textContent).replace(MUSTACHE_EXPR, " ")).replace(ERB_EXPR, " "), 
            currentNode.textContent !== content && (DOMPurify.removed.push({
                element: currentNode.cloneNode()
            }), currentNode.textContent = content)), _executeHook("afterSanitizeElements", currentNode, null), 
            !1;
        }, DATA_ATTR = /^data-[\-\w.\u00B7-\uFFFF]/, ARIA_ATTR = /^aria-[\-\w]+$/, IS_ALLOWED_URI = /^(?:(?:(?:f|ht)tps?|mailto|tel):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i, IS_SCRIPT_OR_DATA = /^(?:\w+script|data):/i, ATTR_WHITESPACE = /[\x00-\x20\xA0\u1680\u180E\u2000-\u2029\u205f\u3000]/g, _sanitizeAttributes = function(currentNode) {
            var attr, name, value, lcName, idAttr, attributes, hookEvent, l;
            if (_executeHook("beforeSanitizeAttributes", currentNode, null), attributes = currentNode.attributes) {
                for (hookEvent = {
                    attrName: "",
                    attrValue: "",
                    keepAttr: !0,
                    allowedAttributes: ALLOWED_ATTR
                }, l = attributes.length; l--; ) {
                    if (attr = attributes[l], name = attr.name, value = attr.value.trim(), lcName = name.toLowerCase(), 
                    hookEvent.attrName = lcName, hookEvent.attrValue = value, hookEvent.keepAttr = !0, 
                    _executeHook("uponSanitizeAttribute", currentNode, hookEvent), value = hookEvent.attrValue, 
                    "name" === lcName && "IMG" === currentNode.nodeName && attributes.id) idAttr = attributes.id, 
                    attributes = Array.prototype.slice.apply(attributes), _removeAttribute("id", currentNode), 
                    _removeAttribute(name, currentNode), attributes.indexOf(idAttr) > l && currentNode.setAttribute("id", idAttr.value); else {
                        if ("INPUT" === currentNode.nodeName && "type" === lcName && "file" === value && (ALLOWED_ATTR[lcName] || !FORBID_ATTR[lcName])) continue;
                        "id" === name && currentNode.setAttribute(name, ""), _removeAttribute(name, currentNode);
                    }
                    if (hookEvent.keepAttr && (!SANITIZE_DOM || "id" !== lcName && "name" !== lcName || !(value in window || value in document || value in formElement))) {
                        if (SAFE_FOR_TEMPLATES && (value = (value = value.replace(MUSTACHE_EXPR, " ")).replace(ERB_EXPR, " ")), 
                        ALLOW_DATA_ATTR && DATA_ATTR.test(lcName)) ; else if (ALLOW_ARIA_ATTR && ARIA_ATTR.test(lcName)) ; else {
                            if (!ALLOWED_ATTR[lcName] || FORBID_ATTR[lcName]) continue;
                            if (URI_SAFE_ATTRIBUTES[lcName]) ; else if (IS_ALLOWED_URI.test(value.replace(ATTR_WHITESPACE, ""))) ; else if ("src" !== lcName && "xlink:href" !== lcName || 0 !== value.indexOf("data:") || !DATA_URI_TAGS[currentNode.nodeName.toLowerCase()]) {
                                if (ALLOW_UNKNOWN_PROTOCOLS && !IS_SCRIPT_OR_DATA.test(value.replace(ATTR_WHITESPACE, ""))) ; else if (value) continue;
                            } else ;
                        }
                        try {
                            currentNode.setAttribute(name, value), DOMPurify.removed.pop();
                        } catch (e) {}
                    }
                }
                _executeHook("afterSanitizeAttributes", currentNode, null);
            }
        }, _sanitizeShadowDOM = function(fragment) {
            var shadowNode, shadowIterator = _createIterator(fragment);
            for (_executeHook("beforeSanitizeShadowDOM", fragment, null); shadowNode = shadowIterator.nextNode(); ) _executeHook("uponSanitizeShadowNode", shadowNode, null), 
            _sanitizeElements(shadowNode) || (shadowNode.content instanceof DocumentFragment && _sanitizeShadowDOM(shadowNode.content), 
            _sanitizeAttributes(shadowNode));
            _executeHook("afterSanitizeShadowDOM", fragment, null);
        }, _executeHook = function(entryPoint, currentNode, data) {
            hooks[entryPoint] && hooks[entryPoint].forEach(function(hook) {
                hook.call(DOMPurify, currentNode, data, CONFIG);
            });
        };
        return DOMPurify.sanitize = function(dirty, cfg) {
            var body, importedNode, currentNode, oldNode, nodeIterator, returnNode;
            if (dirty || (dirty = "\x3c!--\x3e"), "string" != typeof dirty && !_isNode(dirty)) {
                if ("function" != typeof dirty.toString) throw new TypeError("toString is not a function");
                dirty = dirty.toString();
            }
            if (!DOMPurify.isSupported) {
                if ("object" == typeof window.toStaticHTML || "function" == typeof window.toStaticHTML) {
                    if ("string" == typeof dirty) return window.toStaticHTML(dirty);
                    if (_isNode(dirty)) return window.toStaticHTML(dirty.outerHTML);
                }
                return dirty;
            }
            if (SET_CONFIG || _parseConfig(cfg), DOMPurify.removed = [], dirty instanceof Node) 1 === (importedNode = (body = _initDocument("\x3c!--\x3e")).ownerDocument.importNode(dirty, !0)).nodeType && "BODY" === importedNode.nodeName ? body = importedNode : body.appendChild(importedNode); else {
                if (!RETURN_DOM && !WHOLE_DOCUMENT && -1 === dirty.indexOf("<")) return dirty;
                if (!(body = _initDocument(dirty))) return RETURN_DOM ? null : "";
            }
            for (FORCE_BODY && _forceRemove(body.firstChild), nodeIterator = _createIterator(body); currentNode = nodeIterator.nextNode(); ) 3 === currentNode.nodeType && currentNode === oldNode || _sanitizeElements(currentNode) || (currentNode.content instanceof DocumentFragment && _sanitizeShadowDOM(currentNode.content), 
            _sanitizeAttributes(currentNode), oldNode = currentNode);
            if (RETURN_DOM) {
                if (RETURN_DOM_FRAGMENT) for (returnNode = createDocumentFragment.call(body.ownerDocument); body.firstChild; ) returnNode.appendChild(body.firstChild); else returnNode = body;
                return RETURN_DOM_IMPORT && (returnNode = importNode.call(originalDocument, returnNode, !0)), 
                returnNode;
            }
            return WHOLE_DOCUMENT ? body.outerHTML : body.innerHTML;
        }, DOMPurify.setConfig = function(cfg) {
            _parseConfig(cfg), SET_CONFIG = !0;
        }, DOMPurify.clearConfig = function() {
            CONFIG = null, SET_CONFIG = !1;
        }, DOMPurify.addHook = function(entryPoint, hookFunction) {
            "function" == typeof hookFunction && (hooks[entryPoint] = hooks[entryPoint] || [], 
            hooks[entryPoint].push(hookFunction));
        }, DOMPurify.removeHook = function(entryPoint) {
            hooks[entryPoint] && hooks[entryPoint].pop();
        }, DOMPurify.removeHooks = function(entryPoint) {
            hooks[entryPoint] && (hooks[entryPoint] = []);
        }, DOMPurify.removeAllHooks = function() {
            hooks = {};
        }, DOMPurify;
    });
}, function(module, exports, __webpack_require__) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    });
    var ErrorLike;
    !function(ErrorLike) {
        ErrorLike.isErrorLike = function(error) {
            var errorLike = error;
            return errorLike && (void 0 !== errorLike.message && void 0 !== errorLike.name || void 0 !== errorLike.stack);
        };
    }(ErrorLike = exports.ErrorLike || (exports.ErrorLike = {}));
    !function(EventProps) {
        function fromAnyInternal(obj, refs, searchNonEnumerable) {
            if (!obj) return {};
            var res = {};
            return (searchNonEnumerable ? Object.getOwnPropertyNames : Object.keys)(obj).forEach(function(key) {
                var v = obj[key];
                if (null === v || void 0 === v || "number" == typeof v || "string" == typeof v || "boolean" == typeof v) res[key] = v; else if ("object" == typeof v) if (v instanceof Boolean || v instanceof Number || v instanceof String || v instanceof Date || v instanceof RegExp) res[key] = v.toString(); else if (-1 === refs.indexOf(v)) {
                    refs.push(v);
                    var newObj = fromAnyInternal(v, refs, ErrorLike.isErrorLike(v));
                    Object.keys(newObj).length > 0 && (res[key] = newObj);
                }
            }), res;
        }
        EventProps.fromAny = function(obj) {
            return fromAnyInternal(obj, [ obj ], ErrorLike.isErrorLike(obj));
        };
    }(exports.EventProps || (exports.EventProps = {}));
    var nameRegexp = /^(?!\.[\w])[\w.]*\w$/;
    exports.validateName = function(name) {
        if ("" === name) throw new Error("Empty name");
        if (!nameRegexp.test(name)) throw new Error("Invalid name: " + name + ". Should be hierarchical dot separated string and may contain only word characters)");
    };
}, , function(module, exports, __webpack_require__) {
    "use strict";
    var __extends = this && this.__extends || function() {
        var extendStatics = Object.setPrototypeOf || {
            __proto__: []
        } instanceof Array && function(d, b) {
            d.__proto__ = b;
        } || function(d, b) {
            for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return function(d, b) {
            function __() {
                this.constructor = d;
            }
            extendStatics(d, b), d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, 
            new __());
        };
    }();
    Object.defineProperty(exports, "__esModule", {
        value: !0
    });
    var AssertionError = function(_super) {
        function AssertionError(msg) {
            return _super.call(this, "Assertion failed: " + (msg ? "string" == typeof msg ? msg : msg() : "(unnamed)")) || this;
        }
        return __extends(AssertionError, _super), AssertionError;
    }(Error);
    exports.AssertionError = AssertionError, exports.assert = function(cond, msg) {
        if (!cond) throw new AssertionError(msg);
    }, exports.assertNonNull = function(value, name) {
        if (null == value) throw new AssertionError(function() {
            return name ? "Expected " + name + " to be non-null" : "Expected non-null";
        });
        return value;
    };
}, function(module, exports, __webpack_require__) {
    "use strict";
    var __read = this && this.__read || function(o, n) {
        var m = "function" == typeof Symbol && o[Symbol.iterator];
        if (!m) return o;
        var r, e, i = m.call(o), ar = [];
        try {
            for (;(void 0 === n || n-- > 0) && !(r = i.next()).done; ) ar.push(r.value);
        } catch (error) {
            e = {
                error: error
            };
        } finally {
            try {
                r && !r.done && (m = i.return) && m.call(i);
            } finally {
                if (e) throw e.error;
            }
        }
        return ar;
    }, __spread = this && this.__spread || function() {
        for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
        return ar;
    };
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), exports.flatMap = function(f, xs) {
        return (_a = []).concat.apply(_a, __spread(xs.map(f)));
        var _a;
    }, exports.scan = function(f, seed, xs) {
        for (var r = [ seed ], acc = seed, i = 0; i < xs.length; i++) acc = f(acc, xs[i]), 
        r.push(acc);
        return r;
    }, exports.maximum = function(xs) {
        return xs.reduce(function(max, x) {
            return x > max ? x : max;
        }, xs[0]);
    }, exports.maximumBy = function(xs, f) {
        return 0 === xs.length ? void 0 : xs.reduce(function(acc, x) {
            var y = f(x);
            return y > acc[1] ? [ x, y ] : acc;
        }, [ xs[0], f(xs[0]) ])[0];
    }, exports.reverse = function(xs) {
        return xs.slice().reverse();
    }, exports.partition = function(f, xs) {
        for (var ys = [], zs = [], j = 0, k = 0, i = 0; i < xs.length; i++) f(xs[i]) ? ys[j++] = xs[i] : zs[k++] = xs[i];
        return [ ys, zs ];
    }, exports.chunkBySize = function(size, xs) {
        if (size < 1) throw new Error("Invalid chunk size, expected > 0");
        if (0 === xs.length) return [ [] ];
        for (var result = [], x = 0; x < Math.ceil(xs.length / size); x++) result.push(xs.slice(x * size, (x + 1) * size));
        return result;
    }, exports.unfold = function(f, seed) {
        for (var r = [], res = f(seed); void 0 !== res; ) r.push(res[0]), res = f(res[1]);
        return r;
    }, exports.range = function(arg1, arg2) {
        return void 0 !== arg2 ? Array.from(Array(arg2 - arg1), function(_, i) {
            return i + arg1;
        }) : Array.from(Array(arg1), function(_, i) {
            return i;
        });
    }, exports.groupBy = function(xs, eq) {
        if (void 0 === eq && (eq = function(a, b) {
            return a === b;
        }), 0 === xs.length) return [];
        for (var acc = [ [ xs[0] ] ], i = 1; i < xs.length; i += 1) {
            var a = acc[acc.length - 1][0], b = xs[i];
            eq(a, b) ? acc[acc.length - 1].push(b) : acc.push([ b ]);
        }
        return acc;
    };
}, function(module, exports, __webpack_require__) {
    "use strict";
    var __values = this && this.__values || function(o) {
        var m = "function" == typeof Symbol && o[Symbol.iterator], i = 0;
        return m ? m.call(o) : {
            next: function() {
                return o && i >= o.length && (o = void 0), {
                    value: o && o[i++],
                    done: !o
                };
            }
        };
    }, __read = this && this.__read || function(o, n) {
        var m = "function" == typeof Symbol && o[Symbol.iterator];
        if (!m) return o;
        var r, e, i = m.call(o), ar = [];
        try {
            for (;(void 0 === n || n-- > 0) && !(r = i.next()).done; ) ar.push(r.value);
        } catch (error) {
            e = {
                error: error
            };
        } finally {
            try {
                r && !r.done && (m = i.return) && m.call(i);
            } finally {
                if (e) throw e.error;
            }
        }
        return ar;
    };
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), exports.map = function(f, o) {
        var r = {};
        return Object.keys(o).forEach(function(k) {
            return r[k] = f(k, o[k]);
        }), r;
    }, exports.filter = function(f, o) {
        var r = {};
        return Object.keys(o).forEach(function(k) {
            f(k, o[k]) && (r[k] = o[k]);
        }), r;
    }, exports.values = function(o) {
        return Object.keys(o).map(function(k) {
            return o[k];
        });
    }, exports.pairs = function(o) {
        return Object.keys(o).map(function(k) {
            return [ k, o[k] ];
        });
    }, exports.create = function(kvs) {
        var r = {};
        try {
            for (var kvs_1 = __values(kvs), kvs_1_1 = kvs_1.next(); !kvs_1_1.done; kvs_1_1 = kvs_1.next()) {
                var _a = __read(kvs_1_1.value, 2), k = _a[0], v = _a[1];
                r[k] = v;
            }
        } catch (e_1_1) {
            e_1 = {
                error: e_1_1
            };
        } finally {
            try {
                kvs_1_1 && !kvs_1_1.done && (_b = kvs_1.return) && _b.call(kvs_1);
            } finally {
                if (e_1) throw e_1.error;
            }
        }
        return r;
        var e_1, _b;
    };
}, function(module, exports, __webpack_require__) {
    "use strict";
    var __extends = this && this.__extends || function() {
        var extendStatics = Object.setPrototypeOf || {
            __proto__: []
        } instanceof Array && function(d, b) {
            d.__proto__ = b;
        } || function(d, b) {
            for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return function(d, b) {
            function __() {
                this.constructor = d;
            }
            extendStatics(d, b), d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, 
            new __());
        };
    }(), __assign = this && this.__assign || Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) Object.prototype.hasOwnProperty.call(s, p) && (t[p] = s[p]);
        }
        return t;
    };
    Object.defineProperty(exports, "__esModule", {
        value: !0
    });
    var common_1 = __webpack_require__(23), logConfig_1 = __webpack_require__(73), SimpleLogger = function(_super) {
        function SimpleLogger(name, _config) {
            var _this = _super.call(this, name) || this;
            return _this._config = _config, _this;
        }
        return __extends(SimpleLogger, _super), SimpleLogger.prototype.handleEvent = function(event) {
            this._config.filterFn(event) && this._config.writer.write(event);
        }, SimpleLogger;
    }(function() {
        function AbstractLogger(name) {
            this.name = name, this._isError = function(error) {
                var errorLike = error;
                return errorLike && (void 0 !== errorLike.message && void 0 !== errorLike.name || void 0 !== errorLike.stack);
            };
        }
        return AbstractLogger.prototype.trace = function(message, exceptionOrData, data) {
            this._logMessage(common_1.LogLevel.TRACE, message, exceptionOrData, data);
        }, AbstractLogger.prototype.debug = function(message, exceptionOrData, data) {
            this._logMessage(common_1.LogLevel.DEBUG, message, exceptionOrData, data);
        }, AbstractLogger.prototype.info = function(message, exceptionOrData, data) {
            this._logMessage(common_1.LogLevel.INFO, message, exceptionOrData, data);
        }, AbstractLogger.prototype.warn = function(message, exceptionOrData, data) {
            this._logMessage(common_1.LogLevel.WARN, message, exceptionOrData, data);
        }, AbstractLogger.prototype.error = function(message, exceptionOrData, data) {
            this._logMessage(common_1.LogLevel.ERROR, message, exceptionOrData, data);
        }, AbstractLogger.prototype.fatal = function(message, exceptionOrData, data) {
            this._logMessage(common_1.LogLevel.FATAL, message, exceptionOrData, data);
        }, AbstractLogger.prototype._logMessage = function(logLevel, message, exceptionOrData, data) {
            var event = {
                level: logLevel,
                loggerName: this.name,
                message: message,
                timestamp: new Date()
            };
            exceptionOrData && (this._isError(exceptionOrData) ? event.exception = exceptionOrData : event.data = exceptionOrData), 
            event.data = event.data || data, this.handleEvent(event);
        }, AbstractLogger;
    }());
    exports.SimpleLogger = SimpleLogger;
    !function(Logger) {
        Logger.create = function(name, config) {
            return new SimpleLogger(name, __assign({}, logConfig_1.LogConfig.getGlobal(), config || {}));
        };
    }(exports.Logger || (exports.Logger = {}));
}, function(module, exports, __webpack_require__) {
    var isPrototype = __webpack_require__(57), nativeKeys = __webpack_require__(212), hasOwnProperty = Object.prototype.hasOwnProperty;
    module.exports = function(object) {
        if (!isPrototype(object)) return nativeKeys(object);
        var result = [];
        for (var key in Object(object)) hasOwnProperty.call(object, key) && "constructor" != key && result.push(key);
        return result;
    };
}, function(module, exports, __webpack_require__) {
    function SetCache(values) {
        var index = -1, length = null == values ? 0 : values.length;
        for (this.__data__ = new MapCache(); ++index < length; ) this.add(values[index]);
    }
    var MapCache = __webpack_require__(80), setCacheAdd = __webpack_require__(242), setCacheHas = __webpack_require__(243);
    SetCache.prototype.add = SetCache.prototype.push = setCacheAdd, SetCache.prototype.has = setCacheHas, 
    module.exports = SetCache;
}, function(module, exports) {
    module.exports = function(cache, key) {
        return cache.has(key);
    };
}, function(module, exports) {
    module.exports = function(map) {
        var index = -1, result = Array(map.size);
        return map.forEach(function(value, key) {
            result[++index] = [ key, value ];
        }), result;
    };
}, function(module, exports, __webpack_require__) {
    var baseGetAllKeys = __webpack_require__(160), getSymbols = __webpack_require__(102), keys = __webpack_require__(31);
    module.exports = function(object) {
        return baseGetAllKeys(object, keys, getSymbols);
    };
}, function(module, exports, __webpack_require__) {
    var arrayPush = __webpack_require__(101), isArray = __webpack_require__(7);
    module.exports = function(object, keysFunc, symbolsFunc) {
        var result = keysFunc(object);
        return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
    };
}, function(module, exports) {
    module.exports = function() {
        return [];
    };
}, function(module, exports, __webpack_require__) {
    var baseToString = __webpack_require__(256);
    module.exports = function(value) {
        return null == value ? "" : baseToString(value);
    };
}, function(module, exports, __webpack_require__) {
    var baseIsEqual = __webpack_require__(81);
    module.exports = function(value, other) {
        return baseIsEqual(value, other);
    };
}, function(module, exports, __webpack_require__) {
    var baseMerge = __webpack_require__(268), merge = __webpack_require__(107)(function(object, source, srcIndex) {
        baseMerge(object, source, srcIndex);
    });
    module.exports = merge;
}, function(module, exports, __webpack_require__) {
    (function(module) {
        var root = __webpack_require__(12), freeExports = "object" == typeof exports && exports && !exports.nodeType && exports, freeModule = freeExports && "object" == typeof module && module && !module.nodeType && module, Buffer = freeModule && freeModule.exports === freeExports ? root.Buffer : void 0, allocUnsafe = Buffer ? Buffer.allocUnsafe : void 0;
        module.exports = function(buffer, isDeep) {
            if (isDeep) return buffer.slice();
            var length = buffer.length, result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);
            return buffer.copy(result), result;
        };
    }).call(exports, __webpack_require__(48)(module));
}, function(module, exports, __webpack_require__) {
    var cloneArrayBuffer = __webpack_require__(106);
    module.exports = function(typedArray, isDeep) {
        var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
        return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
    };
}, function(module, exports) {
    module.exports = function(source, array) {
        var index = -1, length = source.length;
        for (array || (array = Array(length)); ++index < length; ) array[index] = source[index];
        return array;
    };
}, function(module, exports, __webpack_require__) {
    var baseCreate = __webpack_require__(116), getPrototype = __webpack_require__(59), isPrototype = __webpack_require__(57);
    module.exports = function(object) {
        return "function" != typeof object.constructor || isPrototype(object) ? {} : baseCreate(getPrototype(object));
    };
}, function(module, exports, __webpack_require__) {
    var baseGetTag = __webpack_require__(21), getPrototype = __webpack_require__(59), isObjectLike = __webpack_require__(18), objectTag = "[object Object]", funcProto = Function.prototype, objectProto = Object.prototype, funcToString = funcProto.toString, hasOwnProperty = objectProto.hasOwnProperty, objectCtorString = funcToString.call(Object);
    module.exports = function(value) {
        if (!isObjectLike(value) || baseGetTag(value) != objectTag) return !1;
        var proto = getPrototype(value);
        if (null === proto) return !0;
        var Ctor = hasOwnProperty.call(proto, "constructor") && proto.constructor;
        return "function" == typeof Ctor && Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString;
    };
}, function(module, exports, __webpack_require__) {
    var baseAssignValue = __webpack_require__(66), eq = __webpack_require__(34), hasOwnProperty = Object.prototype.hasOwnProperty;
    module.exports = function(object, key, value) {
        var objValue = object[key];
        hasOwnProperty.call(object, key) && eq(objValue, value) && (void 0 !== value || key in object) || baseAssignValue(object, key, value);
    };
}, , function(module, exports, __webpack_require__) {
    var debounce = __webpack_require__(62), isObject = __webpack_require__(8), FUNC_ERROR_TEXT = "Expected a function";
    module.exports = function(func, wait, options) {
        var leading = !0, trailing = !0;
        if ("function" != typeof func) throw new TypeError(FUNC_ERROR_TEXT);
        return isObject(options) && (leading = "leading" in options ? !!options.leading : leading, 
        trailing = "trailing" in options ? !!options.trailing : trailing), debounce(func, wait, {
            leading: leading,
            maxWait: wait,
            trailing: trailing
        });
    };
}, function(module, exports, __webpack_require__) {
    var baseForOwn = __webpack_require__(99), baseEach = __webpack_require__(283)(baseForOwn);
    module.exports = baseEach;
}, function(module, exports, __webpack_require__) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    });
    var logger_1 = __webpack_require__(1), stdlib_1 = __webpack_require__(4), PerformanceMetricsImpl = function() {
        function PerformanceMetricsImpl(_perf) {
            this._perf = _perf, this._log = logger_1.Logger.create("cs.telemetry.PerformanceMetricsImpl");
        }
        return PerformanceMetricsImpl.prototype.flushMeasures = function(name) {
            try {
                var measures = this._perf.getEntriesByName(name, "measure");
                return this._perf.clearMeasures(name), measures.map(function(x) {
                    return x.duration;
                });
            } catch (err) {
                return this._log.warn("failed to retrieve perf measurements", err), [];
            }
        }, PerformanceMetricsImpl.prototype.startMeasure = function(name) {
            var _this = this, salt = Math.random(), startName = "__" + name + "_" + salt + "-start", endName = "__" + name + "_" + salt + "-end";
            try {
                this._perf.mark(startName);
            } catch (err) {
                return this._log.warn("could not start measure – ignoring measurement", err), {
                    endMeasure: stdlib_1.noOp
                };
            }
            var endMeasureCalled = !1;
            return {
                endMeasure: function() {
                    if (!endMeasureCalled) {
                        endMeasureCalled = !0;
                        try {
                            _this._perf.mark(endName), _this._perf.measure(name, startName, endName);
                        } catch (err) {
                            _this._log.warn("could not complete measure", err);
                        }
                    }
                }
            };
        }, PerformanceMetricsImpl.prototype.measure = function(name, fn) {
            var startName = "__" + name + "-start", endName = "__" + name + "-end";
            try {
                this._perf.mark(startName);
            } catch (err) {
                return this._log.warn("could not start measure – ignoring measurement", err), fn();
            }
            try {
                return fn();
            } finally {
                try {
                    this._perf.mark(endName), this._perf.measure(name, startName, endName);
                } catch (err) {
                    this._log.warn("could not complete measure", err);
                }
            }
        }, PerformanceMetricsImpl;
    }();
    exports.PerformanceMetricsImpl = PerformanceMetricsImpl;
    !function(PerformanceMetrics) {
        PerformanceMetrics.dummy = {
            flushMeasures: function(_) {
                return [];
            },
            measure: function(_, fn) {
                return fn();
            },
            startMeasure: function(_) {
                return {
                    endMeasure: function() {}
                };
            }
        }, PerformanceMetrics.create = function(p) {
            return void 0 !== p ? new PerformanceMetricsImpl(p) : PerformanceMetrics.dummy;
        };
    }(exports.PerformanceMetrics || (exports.PerformanceMetrics = {}));
}, function(module, exports, __webpack_require__) {
    "use strict";
    function createLogger() {
        var options = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}, loggerOptions = _extends({}, _defaults2.default, options), logger = loggerOptions.logger, transformer = loggerOptions.transformer, stateTransformer = loggerOptions.stateTransformer, errorTransformer = loggerOptions.errorTransformer, predicate = loggerOptions.predicate, logErrors = loggerOptions.logErrors, diffPredicate = loggerOptions.diffPredicate;
        if (void 0 === logger) return function() {
            return function(next) {
                return function(action) {
                    return next(action);
                };
            };
        };
        if (transformer && console.error("Option 'transformer' is deprecated, use 'stateTransformer' instead!"), 
        options.getState && options.dispatch) return console.error("[redux-logger] redux-logger not installed. Make sure to pass logger instance as middleware:\n\n// Logger with default options\nimport { logger } from 'redux-logger'\nconst store = createStore(\n  reducer,\n  applyMiddleware(logger)\n)\n\n\n// Or you can create your own logger with custom options http://bit.ly/redux-logger-options\nimport createLogger from 'redux-logger'\n\nconst logger = createLogger({\n  // ...options\n});\n\nconst store = createStore(\n  reducer,\n  applyMiddleware(logger)\n)\n"), 
        function() {
            return function(next) {
                return function(action) {
                    return next(action);
                };
            };
        };
        var logBuffer = [];
        return function(_ref) {
            var getState = _ref.getState;
            return function(next) {
                return function(action) {
                    if ("function" == typeof predicate && !predicate(getState, action)) return next(action);
                    var logEntry = {};
                    logBuffer.push(logEntry), logEntry.started = _helpers.timer.now(), logEntry.startedTime = new Date(), 
                    logEntry.prevState = stateTransformer(getState()), logEntry.action = action;
                    var returnedValue = void 0;
                    if (logErrors) try {
                        returnedValue = next(action);
                    } catch (e) {
                        logEntry.error = errorTransformer(e);
                    } else returnedValue = next(action);
                    logEntry.took = _helpers.timer.now() - logEntry.started, logEntry.nextState = stateTransformer(getState());
                    var diff = loggerOptions.diff && "function" == typeof diffPredicate ? diffPredicate(getState, action) : loggerOptions.diff;
                    if ((0, _core.printBuffer)(logBuffer, _extends({}, loggerOptions, {
                        diff: diff
                    })), logBuffer.length = 0, logEntry.error) throw logEntry.error;
                    return returnedValue;
                };
            };
        };
    }
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), exports.logger = exports.defaults = void 0;
    var _extends = Object.assign || function(target) {
        for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i];
            for (var key in source) Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
        }
        return target;
    }, _core = __webpack_require__(286), _helpers = __webpack_require__(137), _defaults2 = function(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }(__webpack_require__(289)), defaultLogger = createLogger();
    exports.defaults = _defaults2.default, exports.logger = defaultLogger, exports.default = createLogger, 
    module.exports = exports.default;
}, function(module, exports, __webpack_require__) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    });
    var actions_1 = __webpack_require__(110);
    exports.defaultUser = {
        anonymous: !0,
        premium: !1
    }, exports.userReducer = function(state, _a) {
        void 0 === state && (state = exports.defaultUser);
        var type = _a.type, _b = _a.data, data = void 0 === _b ? {} : _b;
        switch (type) {
          case actions_1.t.SET_USER:
            return data;

          case actions_1.t.SET_SETTINGS:
            return Object.assign({}, state, {
                settings: data
            });

          case actions_1.t.INC_FIXED:
            var fixed_errors = state.fixed_errors + 1;
            return Object.assign({}, state, {
                fixed_errors: fixed_errors
            });

          default:
            return state;
        }
    };
}, function(module, exports, __webpack_require__) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    });
    var Config = __webpack_require__(11), call_1 = __webpack_require__(111), telemetry_1 = __webpack_require__(136), telemetry_2 = __webpack_require__(94), newConfig_1 = __webpack_require__(24), log = __webpack_require__(1).Logger.create("lib.tracking.logger");
    exports.felog = new telemetry_1.Telemetry(call_1.callBgPage.sendFelog.bind(call_1.callBgPage), call_1.callBgPage.sendFelogUsageEvent.bind(call_1.callBgPage), call_1.callBgPage.setUserId.bind(call_1.callBgPage), call_1.callBgPage.setContainerId.bind(call_1.callBgPage), call_1.callBgPage.sendTimes.bind(call_1.callBgPage), Config.getGlobal().appConfig.felog.sendUsageMetrics, telemetry_2.PerformanceMetrics.create(window.performance), Config.getGlobal().appConfig.felog.sendPerfMetrics, call_1.callBgPage.sendFelogManyEvents.bind(call_1.callBgPage)), 
    newConfig_1.isBg() && (log.info("Installing unhandled error loggers..."), window.addEventListener("error", function(e) {
        return exports.felog.unhandledBgPageException(e);
    }), window.addEventListener("unhandledrejection", function(e) {
        return exports.felog.unhandledBgPageRejection(e);
    }));
}, , , function(module, exports, __webpack_require__) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    });
    var message = __webpack_require__(16);
    exports.gnar = new Proxy({}, {
        get: function(_, method) {
            return function() {
                for (var props = [], _i = 0; _i < arguments.length; _i++) props[_i] = arguments[_i];
                return message.emitBackground("gnar-track", {
                    method: method,
                    props: props
                });
            };
        }
    }), exports.fire = function(msg) {
        for (var data = [], _i = 1; _i < arguments.length; _i++) data[_i - 1] = arguments[_i];
        message.emitBackground("tracking-fire", {
            msg: msg,
            data: data
        });
    };
}, function(module, exports) {
    module.exports = function(func) {
        return function(value) {
            return func(value);
        };
    };
}, function(module, exports) {
    module.exports = function(array, predicate) {
        for (var index = -1, length = null == array ? 0 : array.length, resIndex = 0, result = []; ++index < length; ) {
            var value = array[index];
            predicate(value, index, array) && (result[resIndex++] = value);
        }
        return result;
    };
}, function(module, exports, __webpack_require__) {
    var Set = __webpack_require__(25)(__webpack_require__(12), "Set");
    module.exports = Set;
}, function(module, exports, __webpack_require__) {
    "use strict";
    function createMigrationAwareApi(api, preserveValue) {
        return {
            get: api.get.bind(api),
            set: api.set.bind(api),
            getAll: api.getAll.bind(api),
            remove: api.remove.bind(api),
            removeAll: function() {
                return __awaiter(this, void 0, void 0, function() {
                    var all;
                    return __generator(this, function(_a) {
                        switch (_a.label) {
                          case 0:
                            return [ 4, api.getAll() ];

                          case 1:
                            return all = _a.sent(), [ 4, api.removeAll() ];

                          case 2:
                            return _a.sent(), [ 4, Promise.all(Object.keys(all).filter(preserveValue).map(function(k) {
                                return api.set(k, all[k]);
                            })) ];

                          case 3:
                            return _a.sent(), [ 2 ];
                        }
                    });
                });
            }
        };
    }
    var __awaiter = this && this.__awaiter || function(thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function(resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value));
                } catch (e) {
                    reject(e);
                }
            }
            function rejected(value) {
                try {
                    step(generator.throw(value));
                } catch (e) {
                    reject(e);
                }
            }
            function step(result) {
                result.done ? resolve(result.value) : new P(function(resolve) {
                    resolve(result.value);
                }).then(fulfilled, rejected);
            }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }, __generator = this && this.__generator || function(thisArg, body) {
        function verb(n) {
            return function(v) {
                return step([ n, v ]);
            };
        }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            for (;_; ) try {
                if (f = 1, y && (t = y[2 & op[0] ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
                switch (y = 0, t && (op = [ 0, t.value ]), op[0]) {
                  case 0:
                  case 1:
                    t = op;
                    break;

                  case 4:
                    return _.label++, {
                        value: op[1],
                        done: !1
                    };

                  case 5:
                    _.label++, y = op[1], op = [ 0 ];
                    continue;

                  case 7:
                    op = _.ops.pop(), _.trys.pop();
                    continue;

                  default:
                    if (t = _.trys, !(t = t.length > 0 && t[t.length - 1]) && (6 === op[0] || 2 === op[0])) {
                        _ = 0;
                        continue;
                    }
                    if (3 === op[0] && (!t || op[1] > t[0] && op[1] < t[3])) {
                        _.label = op[1];
                        break;
                    }
                    if (6 === op[0] && _.label < t[1]) {
                        _.label = t[1], t = op;
                        break;
                    }
                    if (t && _.label < t[2]) {
                        _.label = t[2], _.ops.push(op);
                        break;
                    }
                    t[2] && _.ops.pop(), _.trys.pop();
                    continue;
                }
                op = body.call(thisArg, _);
            } catch (e) {
                op = [ 6, e ], y = 0;
            } finally {
                f = t = 0;
            }
            if (5 & op[0]) throw op[1];
            return {
                value: op[0] ? op[1] : void 0,
                done: !0
            };
        }
        var f, y, t, g, _ = {
            label: 0,
            sent: function() {
                if (1 & t[0]) throw t[1];
                return t[1];
            },
            trys: [],
            ops: []
        };
        return g = {
            next: verb(0),
            throw: verb(1),
            return: verb(2)
        }, "function" == typeof Symbol && (g[Symbol.iterator] = function() {
            return this;
        }), g;
    };
    Object.defineProperty(exports, "__esModule", {
        value: !0
    });
    var StorageMigrationResult, stdlib_1 = __webpack_require__(4), isEqual = __webpack_require__(163);
    !function(StorageMigrationResult) {
        StorageMigrationResult[StorageMigrationResult.success = 0] = "success", StorageMigrationResult[StorageMigrationResult.successWithEmpty = 1] = "successWithEmpty", 
        StorageMigrationResult[StorageMigrationResult.alreadyMigrated = 2] = "alreadyMigrated";
    }(StorageMigrationResult = exports.StorageMigrationResult || (exports.StorageMigrationResult = {}));
    var InternalStorageMigrationResult;
    !function(InternalStorageMigrationResult) {
        InternalStorageMigrationResult[InternalStorageMigrationResult.nonEmptyMigration = 0] = "nonEmptyMigration", 
        InternalStorageMigrationResult[InternalStorageMigrationResult.emptyMigration = 1] = "emptyMigration";
    }(InternalStorageMigrationResult || (InternalStorageMigrationResult = {})), exports.createMigrationAwareApi = createMigrationAwareApi;
    var StorageMigration = function() {
        function StorageMigration(_name, _source, _destination, _destValuesToKeep) {
            void 0 === _destValuesToKeep && (_destValuesToKeep = []);
            var _this = this;
            this._name = _name, this._source = _source, this._destination = _destination, this._destValuesToKeep = _destValuesToKeep, 
            this._migrationFlagSuccessfulValue = "ok", this._migrationFlagUniqueKey = "104ccd8c-9919-9ae4-931f-782fb197486c", 
            this._migrationFlagKey = "__migration-" + this._migrationFlagUniqueKey + ":(" + this._name + ")", 
            this._migrationInProgress = !1, this.migrationAwareDestination = createMigrationAwareApi(this._destination, function(k) {
                return k === _this._migrationFlagKey;
            });
        }
        return StorageMigration.prototype._getMigrated = function() {
            var _this = this;
            return this._destination.get(this._migrationFlagKey).then(function(x) {
                return x === _this._migrationFlagSuccessfulValue;
            });
        }, StorageMigration.prototype._setMigrated = function() {
            return __awaiter(this, void 0, void 0, function() {
                var actualStatus;
                return __generator(this, function(_a) {
                    switch (_a.label) {
                      case 0:
                        return [ 4, this._destination.set(this._migrationFlagKey, this._migrationFlagSuccessfulValue) ];

                      case 1:
                        return _a.sent(), [ 4, this._destination.get(this._migrationFlagKey) ];

                      case 2:
                        if ((actualStatus = _a.sent()) !== this._migrationFlagSuccessfulValue) throw new Error("Could not verify status write, actual value: " + actualStatus);
                        return [ 2 ];
                    }
                });
            });
        }, StorageMigration.prototype._runMigration = function() {
            return __awaiter(this, void 0, void 0, function() {
                var payload_1, sourceIsEmpty, _a, _b, err_1, _this = this;
                return __generator(this, function(_c) {
                    switch (_c.label) {
                      case 0:
                        stdlib_1.assert(!this._migrationInProgress, "migration already in progress"), this._migrationInProgress = !0, 
                        _c.label = 1;

                      case 1:
                        return _c.trys.push([ 1, 7, , 8 ]), [ 4, this._source.getAll() ];

                      case 2:
                        return payload_1 = _c.sent(), sourceIsEmpty = 0 === Object.keys(payload_1).length, 
                        [ 4, Promise.all(this._destValuesToKeep.map(function(k) {
                            return _this._destination.get(k).then(function(v) {
                                null != v && (payload_1[k] = v);
                            });
                        })) ];

                      case 3:
                        return _c.sent(), [ 4, this._destination.removeAll() ];

                      case 4:
                        return _c.sent(), [ 4, Promise.all(Object.keys(payload_1).filter(function(k) {
                            return null != payload_1[k];
                        }).map(function(k) {
                            return _this._destination.set(k, payload_1[k]);
                        })) ];

                      case 5:
                        return _c.sent(), _a = isEqual, _b = [ payload_1 ], [ 4, this._destination.getAll() ];

                      case 6:
                        if (!_a.apply(void 0, _b.concat([ _c.sent() ]))) throw new Error("Could not verify write");
                        return this._migrationInProgress = !1, [ 2, sourceIsEmpty ? InternalStorageMigrationResult.emptyMigration : InternalStorageMigrationResult.nonEmptyMigration ];

                      case 7:
                        throw err_1 = _c.sent(), this._migrationInProgress = !1, err_1;

                      case 8:
                        return [ 2 ];
                    }
                });
            });
        }, StorageMigration.prototype.ensureMigrationCompleted = function() {
            return __awaiter(this, void 0, void 0, function() {
                var internalMigrationResult, _1;
                return __generator(this, function(_a) {
                    switch (_a.label) {
                      case 0:
                        return [ 4, this._getMigrated() ];

                      case 1:
                        return _a.sent() ? [ 2, StorageMigrationResult.alreadyMigrated ] : [ 3, 2 ];

                      case 2:
                        return [ 4, this._runMigration() ];

                      case 3:
                        return internalMigrationResult = _a.sent(), [ 4, this._setMigrated() ];

                      case 4:
                        switch (_a.sent(), internalMigrationResult) {
                          case InternalStorageMigrationResult.nonEmptyMigration:
                            return [ 2, StorageMigrationResult.success ];

                          case InternalStorageMigrationResult.emptyMigration:
                            return [ 2, StorageMigrationResult.successWithEmpty ];

                          default:
                            throw _1 = internalMigrationResult, new Error("Match not exhaustive: " + internalMigrationResult);
                        }
                        _a.label = 5;

                      case 5:
                        return [ 2 ];
                    }
                });
            });
        }, StorageMigration;
    }();
    exports.StorageMigration = StorageMigration;
}, function(module, exports, __webpack_require__) {
    var apply = __webpack_require__(186), nativeMax = Math.max;
    module.exports = function(func, start, transform) {
        return start = nativeMax(void 0 === start ? func.length - 1 : start, 0), function() {
            for (var args = arguments, index = -1, length = nativeMax(args.length - start, 0), array = Array(length); ++index < length; ) array[index] = args[start + index];
            index = -1;
            for (var otherArgs = Array(start + 1); ++index < start; ) otherArgs[index] = args[index];
            return otherArgs[start] = transform(array), apply(func, this, otherArgs);
        };
    };
}, function(module, exports) {
    module.exports = function(func, thisArg, args) {
        switch (args.length) {
          case 0:
            return func.call(thisArg);

          case 1:
            return func.call(thisArg, args[0]);

          case 2:
            return func.call(thisArg, args[0], args[1]);

          case 3:
            return func.call(thisArg, args[0], args[1], args[2]);
        }
        return func.apply(thisArg, args);
    };
}, function(module, exports, __webpack_require__) {
    var baseSetToString = __webpack_require__(273), setToString = __webpack_require__(275)(baseSetToString);
    module.exports = setToString;
}, function(module, exports, __webpack_require__) {
    var eq = __webpack_require__(34), isArrayLike = __webpack_require__(26), isIndex = __webpack_require__(64), isObject = __webpack_require__(8);
    module.exports = function(value, index, object) {
        if (!isObject(object)) return !1;
        var type = typeof index;
        return !!("number" == type ? isArrayLike(object) && isIndex(index, object.length) : "string" == type && index in object) && eq(object[index], value);
    };
}, function(module, exports, __webpack_require__) {
    var isObject = __webpack_require__(8), isSymbol = __webpack_require__(53), NAN = NaN, reTrim = /^\s+|\s+$/g, reIsBadHex = /^[-+]0x[0-9a-f]+$/i, reIsBinary = /^0b[01]+$/i, reIsOctal = /^0o[0-7]+$/i, freeParseInt = parseInt;
    module.exports = function(value) {
        if ("number" == typeof value) return value;
        if (isSymbol(value)) return NAN;
        if (isObject(value)) {
            var other = "function" == typeof value.valueOf ? value.valueOf() : value;
            value = isObject(other) ? other + "" : other;
        }
        if ("string" != typeof value) return 0 === value ? value : +value;
        value = value.replace(reTrim, "");
        var isBinary = reIsBinary.test(value);
        return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
    };
}, function(module, exports, __webpack_require__) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), exports.t = {
        SET_ACTIVE_TAB: "tabs/SET_ACTIVE_TAB"
    }, exports.setActiveTab = function(data) {
        return {
            type: exports.t.SET_ACTIVE_TAB,
            data: data
        };
    };
}, , function(module, exports, __webpack_require__) {
    "use strict";
    var validateFormat = function(format) {};
    module.exports = function(condition, format, a, b, c, d, e, f) {
        if (validateFormat(format), !condition) {
            var error;
            if (void 0 === format) error = new Error("Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings."); else {
                var args = [ a, b, c, d, e, f ], argIndex = 0;
                (error = new Error(format.replace(/%s/g, function() {
                    return args[argIndex++];
                }))).name = "Invariant Violation";
            }
            throw error.framesToPop = 1, error;
        }
    };
}, function(module, exports, __webpack_require__) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), exports.tracker = function() {
        return window.tracker = window.tracker || {}, window.tracker;
    };
}, function(module, exports, __webpack_require__) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    });
    var tslib_1 = __webpack_require__(195), utils_1 = __webpack_require__(149), AbstractMetricsStorage = function() {
        function AbstractMetricsStorage(name, timersSink, countersSink) {
            this.name = name, this.timersSink = timersSink, this.countersSink = countersSink, 
            utils_1.validateName(name);
        }
        return AbstractMetricsStorage.prototype.getMetric = function(name) {
            return this._createChild(name);
        }, AbstractMetricsStorage.prototype.getTimer = function(name) {
            return this._createChild(name);
        }, AbstractMetricsStorage.prototype.getCounter = function(name) {
            return this._createChild(name);
        }, Object.defineProperty(AbstractMetricsStorage.prototype, "parent", {
            get: function() {
                var dot = this.name.lastIndexOf("."), name = this.name.substring(0, -1 === dot ? 0 : dot);
                return "" === name ? void 0 : new AbstractMetricsStorage(name, this.timersSink, this.countersSink);
            },
            enumerable: !0,
            configurable: !0
        }), Object.defineProperty(AbstractMetricsStorage.prototype, "root", {
            get: function() {
                var dot = this.name.indexOf("."), name = this.name.substring(0, -1 === dot ? 0 : dot);
                return "" === name ? this : new AbstractMetricsStorage(name, this.timersSink, this.countersSink);
            },
            enumerable: !0,
            configurable: !0
        }), AbstractMetricsStorage.prototype._createName = function(name) {
            return this.name + "." + name;
        }, AbstractMetricsStorage.prototype.start = function() {
            var start = Date.now(), self = this;
            return {
                stop: function() {
                    self.recordTime(Date.now() - start);
                }
            };
        }, AbstractMetricsStorage.prototype.recordTime = function(time) {
            this.timersSink(this.name, time);
        }, AbstractMetricsStorage.prototype.timing = function(fn) {
            var tn = this.start();
            try {
                return fn();
            } finally {
                try {
                    tn.stop();
                } catch (e) {}
            }
        }, AbstractMetricsStorage.prototype.increment = function(step) {
            void 0 === step && (step = 1), this.countersSink(this.name, step);
        }, AbstractMetricsStorage.prototype.decrement = function(step) {
            void 0 === step && (step = 1), this.increment(-step);
        }, AbstractMetricsStorage.prototype._createChild = function(name) {
            return new AbstractMetricsStorage(this._createName(name), this.timersSink, this.countersSink);
        }, AbstractMetricsStorage;
    }();
    exports.AbstractMetricsStorage = AbstractMetricsStorage;
    var MetricsPrinter = function(_super) {
        function MetricsPrinter(fn) {
            return _super.call(this, "MP", function(name, value) {
                return fn("TIMER: " + name + " = " + value);
            }, function(name, value) {
                return fn("COUNTER: " + name + " = " + value);
            }) || this;
        }
        return tslib_1.__extends(MetricsPrinter, _super), MetricsPrinter;
    }(AbstractMetricsStorage);
    exports.MetricsPrinter = MetricsPrinter;
    var DEFAULT_SEND_TIMEOUT_MS = 7500, MAX_SEND_ATTEMPTS = 3, MetricsStorage = function(_super) {
        function MetricsStorage(name, baseUrl, _fetch, _sendTimeout) {
            void 0 === _sendTimeout && (_sendTimeout = DEFAULT_SEND_TIMEOUT_MS);
            var _this = _super.call(this, name, function(n, v) {
                return _this._reportTimer(n, v);
            }, function(n, v) {
                return _this._reportCounter(n, v);
            }) || this;
            return _this._fetch = _fetch, _this._sendTimeout = _sendTimeout, _this._countersBuffer = {}, 
            _this._timersBuffer = new Array(), _this._sendTimer = void 0, _this._sendData = function() {
                var data = [ _this._timersBuffer.join("&"), Object.keys(_this._countersBuffer).map(function(key) {
                    return key + "=" + _this._countersBuffer[key];
                }).join("&") ].filter(function(s) {
                    return s.length;
                }).join("&"), url = _this._baseUrl + data;
                _this._timersBuffer.length = 0, _this._countersBuffer = {}, _this._sendTimer = void 0;
                var attempt = 0, send = function() {
                    _this._fetch(url, {
                        mode: "no-cors",
                        cache: "no-cache"
                    }).catch(function(error) {
                        attempt++ < MAX_SEND_ATTEMPTS ? setTimeout(send, 5e3 * attempt) : console.error("Cannot send timesereies data", error, url);
                    });
                };
                send();
            }, _this._baseUrl = baseUrl + "/ts?", _this;
        }
        return tslib_1.__extends(MetricsStorage, _super), MetricsStorage.createRoot = function(name, baseUrl, fetch) {
            return new MetricsStorage(name, baseUrl, fetch);
        }, MetricsStorage.prototype._reportTimer = function(name, value) {
            this._timersBuffer.push("t." + name + "=" + value), this._startSending();
        }, MetricsStorage.prototype._reportCounter = function(name, value) {
            var key = "c." + name;
            this._countersBuffer[key] = (this._countersBuffer[key] || 0) + value, this._startSending();
        }, MetricsStorage.prototype._startSending = function() {
            this._sendTimer || (this._sendTimer = setTimeout(this._sendData, this._sendTimeout));
        }, MetricsStorage;
    }(AbstractMetricsStorage);
    exports.MetricsStorage = MetricsStorage;
    var MetricsConfig = function() {
        function MetricsConfig() {}
        return MetricsConfig.getRootMetric = function() {
            return MetricsConfig._metricsRoot || (console.warn("[WARNING] Using default timeseries implementation."), 
            MetricsConfig._metricsRoot = new MetricsPrinter(console.log)), MetricsConfig._metricsRoot;
        }, MetricsConfig.configure = function(root) {
            MetricsConfig._metricsRoot = root;
        }, MetricsConfig;
    }();
    exports.MetricsConfig = MetricsConfig;
}, function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    function __values(o) {
        var m = "function" == typeof Symbol && o[Symbol.iterator], i = 0;
        return m ? m.call(o) : {
            next: function() {
                return o && i >= o.length && (o = void 0), {
                    value: o && o[i++],
                    done: !o
                };
            }
        };
    }
    function __read(o, n) {
        var m = "function" == typeof Symbol && o[Symbol.iterator];
        if (!m) return o;
        var r, e, i = m.call(o), ar = [];
        try {
            for (;(void 0 === n || n-- > 0) && !(r = i.next()).done; ) ar.push(r.value);
        } catch (error) {
            e = {
                error: error
            };
        } finally {
            try {
                r && !r.done && (m = i.return) && m.call(i);
            } finally {
                if (e) throw e.error;
            }
        }
        return ar;
    }
    function __asyncValues(o) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator];
        return m ? m.call(o) : "function" == typeof __values ? __values(o) : o[Symbol.iterator]();
    }
    Object.defineProperty(__webpack_exports__, "__esModule", {
        value: !0
    }), __webpack_exports__.__extends = function(d, b) {
        function __() {
            this.constructor = d;
        }
        extendStatics(d, b), d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, 
        new __());
    }, __webpack_require__.d(__webpack_exports__, "__assign", function() {
        return __assign;
    }), __webpack_exports__.__rest = function(s, e) {
        var t = {};
        for (var p in s) Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0 && (t[p] = s[p]);
        if (null != s && "function" == typeof Object.getOwnPropertySymbols) for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) e.indexOf(p[i]) < 0 && (t[p[i]] = s[p[i]]);
        return t;
    }, __webpack_exports__.__decorate = function(decorators, target, key, desc) {
        var d, c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc;
        if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    }, __webpack_exports__.__param = function(paramIndex, decorator) {
        return function(target, key) {
            decorator(target, key, paramIndex);
        };
    }, __webpack_exports__.__metadata = function(metadataKey, metadataValue) {
        if ("object" == typeof Reflect && "function" == typeof Reflect.metadata) return Reflect.metadata(metadataKey, metadataValue);
    }, __webpack_exports__.__awaiter = function(thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function(resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value));
                } catch (e) {
                    reject(e);
                }
            }
            function rejected(value) {
                try {
                    step(generator.throw(value));
                } catch (e) {
                    reject(e);
                }
            }
            function step(result) {
                result.done ? resolve(result.value) : new P(function(resolve) {
                    resolve(result.value);
                }).then(fulfilled, rejected);
            }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }, __webpack_exports__.__generator = function(thisArg, body) {
        function verb(n) {
            return function(v) {
                return step([ n, v ]);
            };
        }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            for (;_; ) try {
                if (f = 1, y && (t = y[2 & op[0] ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
                switch (y = 0, t && (op = [ 0, t.value ]), op[0]) {
                  case 0:
                  case 1:
                    t = op;
                    break;

                  case 4:
                    return _.label++, {
                        value: op[1],
                        done: !1
                    };

                  case 5:
                    _.label++, y = op[1], op = [ 0 ];
                    continue;

                  case 7:
                    op = _.ops.pop(), _.trys.pop();
                    continue;

                  default:
                    if (t = _.trys, !(t = t.length > 0 && t[t.length - 1]) && (6 === op[0] || 2 === op[0])) {
                        _ = 0;
                        continue;
                    }
                    if (3 === op[0] && (!t || op[1] > t[0] && op[1] < t[3])) {
                        _.label = op[1];
                        break;
                    }
                    if (6 === op[0] && _.label < t[1]) {
                        _.label = t[1], t = op;
                        break;
                    }
                    if (t && _.label < t[2]) {
                        _.label = t[2], _.ops.push(op);
                        break;
                    }
                    t[2] && _.ops.pop(), _.trys.pop();
                    continue;
                }
                op = body.call(thisArg, _);
            } catch (e) {
                op = [ 6, e ], y = 0;
            } finally {
                f = t = 0;
            }
            if (5 & op[0]) throw op[1];
            return {
                value: op[0] ? op[1] : void 0,
                done: !0
            };
        }
        var f, y, t, g, _ = {
            label: 0,
            sent: function() {
                if (1 & t[0]) throw t[1];
                return t[1];
            },
            trys: [],
            ops: []
        };
        return g = {
            next: verb(0),
            throw: verb(1),
            return: verb(2)
        }, "function" == typeof Symbol && (g[Symbol.iterator] = function() {
            return this;
        }), g;
    }, __webpack_exports__.__exportStar = function(m, exports) {
        for (var p in m) exports.hasOwnProperty(p) || (exports[p] = m[p]);
    }, __webpack_exports__.__values = __values, __webpack_exports__.__read = __read, 
    __webpack_exports__.__spread = function() {
        for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
        return ar;
    }, __webpack_exports__.__asyncGenerator = function(thisArg, _arguments, generator) {
        function verb(n) {
            return function(v) {
                return new Promise(function(a, b) {
                    q.push([ n, v, a, b ]), next();
                });
            };
        }
        function next() {
            !c && q.length && resume((c = q.shift())[0], c[1]);
        }
        function resume(n, v) {
            try {
                step(g[n](v));
            } catch (e) {
                settle(c[3], e);
            }
        }
        function step(r) {
            r.done ? settle(c[2], r) : "yield" === r.value[0] ? settle(c[2], {
                value: r.value[1],
                done: !1
            }) : Promise.resolve(r.value[1]).then("delegate" === r.value[0] ? delegate : fulfill, reject);
        }
        function delegate(r) {
            step(r.done ? r : {
                value: [ "yield", r.value ],
                done: !1
            });
        }
        function fulfill(value) {
            resume("next", value);
        }
        function reject(value) {
            resume("throw", value);
        }
        function settle(f, v) {
            c = void 0, f(v), next();
        }
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var c, i, g = generator.apply(thisArg, _arguments || []), q = [];
        return i = {
            next: verb("next"),
            throw: verb("throw"),
            return: verb("return")
        }, i[Symbol.asyncIterator] = function() {
            return this;
        }, i;
    }, __webpack_exports__.__asyncDelegator = function(o) {
        function verb(n, f) {
            return function(v) {
                return {
                    value: [ "delegate", (o[n] || f).call(o, v) ],
                    done: !1
                };
            };
        }
        var i = {
            next: verb("next"),
            throw: verb("throw", function(e) {
                throw e;
            }),
            return: verb("return", function(v) {
                return {
                    value: v,
                    done: !0
                };
            })
        };
        return o = __asyncValues(o), i[Symbol.iterator] = function() {
            return this;
        }, i;
    }, __webpack_exports__.__asyncValues = __asyncValues;
    var extendStatics = Object.setPrototypeOf || {
        __proto__: []
    } instanceof Array && function(d, b) {
        d.__proto__ = b;
    } || function(d, b) {
        for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
    }, __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) Object.prototype.hasOwnProperty.call(s, p) && (t[p] = s[p]);
        }
        return t;
    };
}, , , , , , , function(module, exports, __webpack_require__) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    });
    try {
        window.firefox = browser;
    } catch (e) {
        window.firefox = window.browser;
    }
    window.edge = window.browser, window.chrome = window.chrome, exports.default = void 0;
}, function(module, exports, __webpack_require__) {
    "use strict";
    var __rest = this && this.__rest || function(s, e) {
        var t = {};
        for (var p in s) Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0 && (t[p] = s[p]);
        if (null != s && "function" == typeof Object.getOwnPropertySymbols) for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) e.indexOf(p[i]) < 0 && (t[p[i]] = s[p[i]]);
        return t;
    };
    Object.defineProperty(exports, "__esModule", {
        value: !0
    });
    var bg_1 = __webpack_require__(98), content_1 = __webpack_require__(127), chrome_1 = __webpack_require__(267), chrome_util_1 = __webpack_require__(128), web_extensions_1 = __webpack_require__(105), util_1 = __webpack_require__(2), Config = __webpack_require__(11), stdlib_1 = __webpack_require__(4), ChromeContentScriptPort = function() {
        function ChromeContentScriptPort(name) {
            this.port = chrome.runtime.connect({
                name: name
            });
        }
        return ChromeContentScriptPort.prototype.onMessage = function(cb) {
            this.port.onMessage.addListener(cb);
        }, ChromeContentScriptPort.prototype.onDisconnect = function(cb) {
            this.port.onDisconnect.addListener(cb);
        }, ChromeContentScriptPort.prototype.postMessage = function(data) {
            this.port.postMessage(data);
        }, ChromeContentScriptPort;
    }(), ChromeBackgroundPort = function() {
        function ChromeBackgroundPort(_port) {
            this._port = _port, this.sender = {};
            var sender = _port.sender, name = _port.name;
            this.name = name, sender && (this.sender.url = sender.url, sender.tab && sender.tab.url && sender.tab.id && (this.sender.tab = {
                url: sender.tab.url,
                id: sender.tab.id,
                active: sender.tab.active
            }));
        }
        return ChromeBackgroundPort.prototype.onMessage = function(cb) {
            this._port.onMessage.addListener(cb);
        }, ChromeBackgroundPort.prototype.onDisconnect = function(cb) {
            this._port.onDisconnect.addListener(cb);
        }, ChromeBackgroundPort.prototype.postMessage = function(data) {
            this._port.postMessage(data);
        }, ChromeBackgroundPort;
    }(), ChromeApi = function() {
        return function() {
            this.tabs = new chrome_1.ChromeTabsApiImpl(), this.notification = {
                kind: "web-extension",
                create: function(options) {
                    return stdlib_1.SafePromise.create(function(resolve, reject) {
                        var onClicked = options.onClicked, onButtonClicked = options.onButtonClicked, opts = __rest(options, [ "onClicked", "onButtonClicked" ]), cn = chrome.notifications, id = util_1.guid();
                        cn.create(id, Object.assign({
                            type: "basic"
                        }, opts), function() {
                            chrome_util_1.handleChromeError(function() {
                                void 0 !== onClicked && cn.onClicked.addListener(onClicked), void 0 !== onButtonClicked && cn.onButtonClicked.addListener(onButtonClicked), 
                                resolve(id);
                            }, reject);
                        });
                    });
                },
                clear: function(id) {
                    return stdlib_1.SafePromise.create(function(resolve, reject) {
                        chrome.notifications.clear(id, function(wasCleared) {
                            chrome_util_1.handleChromeError(function() {
                                return resolve(wasCleared);
                            }, reject);
                        });
                    });
                }
            }, this.cookies = {
                kind: "web-extension",
                get: function(details) {
                    return stdlib_1.SafePromise.create(function(resolve, reject) {
                        return chrome.cookies.get(details, function(cookie) {
                            return chrome_util_1.handleChromeError(function() {
                                return resolve(cookie);
                            }, reject);
                        });
                    });
                },
                remove: function(details) {
                    return new Promise(function(resolve, reject) {
                        return chrome.cookies.remove(details, function() {
                            return chrome_util_1.handleChromeError(function() {
                                return resolve(null);
                            }, reject);
                        });
                    });
                },
                getAll: function(details) {
                    return stdlib_1.SafePromise.create(function(resolve, reject) {
                        return chrome.cookies.getAll(details, function(cookie) {
                            return chrome_util_1.handleChromeError(function() {
                                return resolve(cookie);
                            }, reject);
                        });
                    });
                },
                set: function(details) {
                    return stdlib_1.SafePromise.create(function(resolve, reject) {
                        return chrome.cookies.set(details, function(cookie) {
                            return chrome_util_1.handleChromeError(function() {
                                return resolve(cookie);
                            }, reject);
                        });
                    });
                },
                watch: function(details, cb) {
                    chrome.cookies.onChanged.addListener(function(changeInfo) {
                        var cookie = changeInfo.cookie, cause = changeInfo.cause;
                        !cookie || !cookie.name || details.path && details.path !== cookie.path || details.name !== cookie.name || details.domain && -1 === cookie.domain.indexOf(details.domain) || ("explicit" === cause && cb(cookie), 
                        "expired_overwrite" === cause && cb());
                    });
                }
            }, this.preferences = web_extensions_1.preferencesApi.windowLocalStorage, this.button = {
                kind: "web-extension",
                setBadge: function(text) {
                    chrome.browserAction.setBadgeText({
                        text: text
                    });
                },
                setIconByName: function(name) {
                    var postfix = name ? "-" + name : "";
                    chrome.browserAction.setIcon({
                        path: {
                            "16": "./src/icon/icon16" + postfix + ".png",
                            "32": "./src/icon/icon32" + postfix + ".png"
                        }
                    });
                },
                setBadgeBackgroundColor: function(color) {
                    chrome.browserAction.setBadgeBackgroundColor({
                        color: color
                    });
                }
            }, this.management = {
                uninstallSelf: function() {
                    chrome.management.uninstallSelf();
                }
            }, this.message = "bg" === Config.getGlobal().bundleInfo.context ? new bg_1.GenericBackgroundMessageApiImpl(function(cb) {
                return chrome.runtime.onConnect.addListener(function(port) {
                    return cb(new ChromeBackgroundPort(port));
                });
            }, this.tabs.getActiveTab.bind(this.tabs), this.tabs.getAllTabs.bind(this.tabs)) : new content_1.GenericContentScriptMessageApiImpl(function(name) {
                return new ChromeContentScriptPort(name);
            });
        };
    }();
    exports.createApi = function() {
        return new ChromeApi();
    };
}, function(module, exports) {
    module.exports = function(fromRight) {
        return function(object, iteratee, keysFunc) {
            for (var index = -1, iterable = Object(object), props = keysFunc(object), length = props.length; length--; ) {
                var key = props[fromRight ? length : ++index];
                if (!1 === iteratee(iterable[key], key, iterable)) break;
            }
            return object;
        };
    };
}, function(module, exports) {
    module.exports = function(n, iteratee) {
        for (var index = -1, result = Array(n); ++index < n; ) result[index] = iteratee(index);
        return result;
    };
}, function(module, exports, __webpack_require__) {
    var baseGetTag = __webpack_require__(21), isObjectLike = __webpack_require__(18), argsTag = "[object Arguments]";
    module.exports = function(value) {
        return isObjectLike(value) && baseGetTag(value) == argsTag;
    };
}, function(module, exports, __webpack_require__) {
    var Symbol = __webpack_require__(32), objectProto = Object.prototype, hasOwnProperty = objectProto.hasOwnProperty, nativeObjectToString = objectProto.toString, symToStringTag = Symbol ? Symbol.toStringTag : void 0;
    module.exports = function(value) {
        var isOwn = hasOwnProperty.call(value, symToStringTag), tag = value[symToStringTag];
        try {
            value[symToStringTag] = void 0;
            var unmasked = !0;
        } catch (e) {}
        var result = nativeObjectToString.call(value);
        return unmasked && (isOwn ? value[symToStringTag] = tag : delete value[symToStringTag]), 
        result;
    };
}, function(module, exports) {
    var nativeObjectToString = Object.prototype.toString;
    module.exports = function(value) {
        return nativeObjectToString.call(value);
    };
}, function(module, exports) {
    module.exports = function() {
        return !1;
    };
}, function(module, exports, __webpack_require__) {
    var baseGetTag = __webpack_require__(21), isLength = __webpack_require__(78), isObjectLike = __webpack_require__(18), typedArrayTags = {};
    typedArrayTags["[object Float32Array]"] = typedArrayTags["[object Float64Array]"] = typedArrayTags["[object Int8Array]"] = typedArrayTags["[object Int16Array]"] = typedArrayTags["[object Int32Array]"] = typedArrayTags["[object Uint8Array]"] = typedArrayTags["[object Uint8ClampedArray]"] = typedArrayTags["[object Uint16Array]"] = typedArrayTags["[object Uint32Array]"] = !0, 
    typedArrayTags["[object Arguments]"] = typedArrayTags["[object Array]"] = typedArrayTags["[object ArrayBuffer]"] = typedArrayTags["[object Boolean]"] = typedArrayTags["[object DataView]"] = typedArrayTags["[object Date]"] = typedArrayTags["[object Error]"] = typedArrayTags["[object Function]"] = typedArrayTags["[object Map]"] = typedArrayTags["[object Number]"] = typedArrayTags["[object Object]"] = typedArrayTags["[object RegExp]"] = typedArrayTags["[object Set]"] = typedArrayTags["[object String]"] = typedArrayTags["[object WeakMap]"] = !1, 
    module.exports = function(value) {
        return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
    };
}, function(module, exports, __webpack_require__) {
    (function(module) {
        var freeGlobal = __webpack_require__(119), freeExports = "object" == typeof exports && exports && !exports.nodeType && exports, freeModule = freeExports && "object" == typeof module && module && !module.nodeType && module, freeProcess = freeModule && freeModule.exports === freeExports && freeGlobal.process, nodeUtil = function() {
            try {
                return freeProcess && freeProcess.binding && freeProcess.binding("util");
            } catch (e) {}
        }();
        module.exports = nodeUtil;
    }).call(exports, __webpack_require__(48)(module));
}, function(module, exports, __webpack_require__) {
    var nativeKeys = __webpack_require__(120)(Object.keys, Object);
    module.exports = nativeKeys;
}, function(module, exports, __webpack_require__) {
    var baseIsMatch = __webpack_require__(214), getMatchData = __webpack_require__(250), matchesStrictComparable = __webpack_require__(125);
    module.exports = function(source) {
        var matchData = getMatchData(source);
        return 1 == matchData.length && matchData[0][2] ? matchesStrictComparable(matchData[0][0], matchData[0][1]) : function(object) {
            return object === source || baseIsMatch(object, source, matchData);
        };
    };
}, function(module, exports, __webpack_require__) {
    var Stack = __webpack_require__(58), baseIsEqual = __webpack_require__(81), COMPARE_PARTIAL_FLAG = 1, COMPARE_UNORDERED_FLAG = 2;
    module.exports = function(object, source, matchData, customizer) {
        var index = matchData.length, length = index, noCustomizer = !customizer;
        if (null == object) return !length;
        for (object = Object(object); index--; ) {
            var data = matchData[index];
            if (noCustomizer && data[2] ? data[1] !== object[data[0]] : !(data[0] in object)) return !1;
        }
        for (;++index < length; ) {
            var key = (data = matchData[index])[0], objValue = object[key], srcValue = data[1];
            if (noCustomizer && data[2]) {
                if (void 0 === objValue && !(key in object)) return !1;
            } else {
                var stack = new Stack();
                if (customizer) var result = customizer(objValue, srcValue, key, object, source, stack);
                if (!(void 0 === result ? baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG, customizer, stack) : result)) return !1;
            }
        }
        return !0;
    };
}, function(module, exports) {
    module.exports = function() {
        this.__data__ = [], this.size = 0;
    };
}, function(module, exports, __webpack_require__) {
    var assocIndexOf = __webpack_require__(50), splice = Array.prototype.splice;
    module.exports = function(key) {
        var data = this.__data__, index = assocIndexOf(data, key);
        return !(index < 0 || (index == data.length - 1 ? data.pop() : splice.call(data, index, 1), 
        --this.size, 0));
    };
}, function(module, exports, __webpack_require__) {
    var assocIndexOf = __webpack_require__(50);
    module.exports = function(key) {
        var data = this.__data__, index = assocIndexOf(data, key);
        return index < 0 ? void 0 : data[index][1];
    };
}, function(module, exports, __webpack_require__) {
    var assocIndexOf = __webpack_require__(50);
    module.exports = function(key) {
        return assocIndexOf(this.__data__, key) > -1;
    };
}, function(module, exports, __webpack_require__) {
    var assocIndexOf = __webpack_require__(50);
    module.exports = function(key, value) {
        var data = this.__data__, index = assocIndexOf(data, key);
        return index < 0 ? (++this.size, data.push([ key, value ])) : data[index][1] = value, 
        this;
    };
}, function(module, exports, __webpack_require__) {
    var ListCache = __webpack_require__(49);
    module.exports = function() {
        this.__data__ = new ListCache(), this.size = 0;
    };
}, function(module, exports) {
    module.exports = function(key) {
        var data = this.__data__, result = data.delete(key);
        return this.size = data.size, result;
    };
}, function(module, exports) {
    module.exports = function(key) {
        return this.__data__.get(key);
    };
}, function(module, exports) {
    module.exports = function(key) {
        return this.__data__.has(key);
    };
}, function(module, exports, __webpack_require__) {
    var ListCache = __webpack_require__(49), Map = __webpack_require__(79), MapCache = __webpack_require__(80), LARGE_ARRAY_SIZE = 200;
    module.exports = function(key, value) {
        var data = this.__data__;
        if (data instanceof ListCache) {
            var pairs = data.__data__;
            if (!Map || pairs.length < LARGE_ARRAY_SIZE - 1) return pairs.push([ key, value ]), 
            this.size = ++data.size, this;
            data = this.__data__ = new MapCache(pairs);
        }
        return data.set(key, value), this.size = data.size, this;
    };
}, function(module, exports, __webpack_require__) {
    var isFunction = __webpack_require__(42), isMasked = __webpack_require__(226), isObject = __webpack_require__(8), toSource = __webpack_require__(121), reRegExpChar = /[\\^$.*+?()[\]{}|]/g, reIsHostCtor = /^\[object .+?Constructor\]$/, funcProto = Function.prototype, objectProto = Object.prototype, funcToString = funcProto.toString, hasOwnProperty = objectProto.hasOwnProperty, reIsNative = RegExp("^" + funcToString.call(hasOwnProperty).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$");
    module.exports = function(value) {
        return !(!isObject(value) || isMasked(value)) && (isFunction(value) ? reIsNative : reIsHostCtor).test(toSource(value));
    };
}, function(module, exports, __webpack_require__) {
    var coreJsData = __webpack_require__(227), maskSrcKey = function() {
        var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || "");
        return uid ? "Symbol(src)_1." + uid : "";
    }();
    module.exports = function(func) {
        return !!maskSrcKey && maskSrcKey in func;
    };
}, function(module, exports, __webpack_require__) {
    var coreJsData = __webpack_require__(12)["__core-js_shared__"];
    module.exports = coreJsData;
}, function(module, exports) {
    module.exports = function(object, key) {
        return null == object ? void 0 : object[key];
    };
}, function(module, exports, __webpack_require__) {
    var Hash = __webpack_require__(230), ListCache = __webpack_require__(49), Map = __webpack_require__(79);
    module.exports = function() {
        this.size = 0, this.__data__ = {
            hash: new Hash(),
            map: new (Map || ListCache)(),
            string: new Hash()
        };
    };
}, function(module, exports, __webpack_require__) {
    function Hash(entries) {
        var index = -1, length = null == entries ? 0 : entries.length;
        for (this.clear(); ++index < length; ) {
            var entry = entries[index];
            this.set(entry[0], entry[1]);
        }
    }
    var hashClear = __webpack_require__(231), hashDelete = __webpack_require__(232), hashGet = __webpack_require__(233), hashHas = __webpack_require__(234), hashSet = __webpack_require__(235);
    Hash.prototype.clear = hashClear, Hash.prototype.delete = hashDelete, Hash.prototype.get = hashGet, 
    Hash.prototype.has = hashHas, Hash.prototype.set = hashSet, module.exports = Hash;
}, function(module, exports, __webpack_require__) {
    var nativeCreate = __webpack_require__(51);
    module.exports = function() {
        this.__data__ = nativeCreate ? nativeCreate(null) : {}, this.size = 0;
    };
}, function(module, exports) {
    module.exports = function(key) {
        var result = this.has(key) && delete this.__data__[key];
        return this.size -= result ? 1 : 0, result;
    };
}, function(module, exports, __webpack_require__) {
    var nativeCreate = __webpack_require__(51), HASH_UNDEFINED = "__lodash_hash_undefined__", hasOwnProperty = Object.prototype.hasOwnProperty;
    module.exports = function(key) {
        var data = this.__data__;
        if (nativeCreate) {
            var result = data[key];
            return result === HASH_UNDEFINED ? void 0 : result;
        }
        return hasOwnProperty.call(data, key) ? data[key] : void 0;
    };
}, function(module, exports, __webpack_require__) {
    var nativeCreate = __webpack_require__(51), hasOwnProperty = Object.prototype.hasOwnProperty;
    module.exports = function(key) {
        var data = this.__data__;
        return nativeCreate ? void 0 !== data[key] : hasOwnProperty.call(data, key);
    };
}, function(module, exports, __webpack_require__) {
    var nativeCreate = __webpack_require__(51), HASH_UNDEFINED = "__lodash_hash_undefined__";
    module.exports = function(key, value) {
        var data = this.__data__;
        return this.size += this.has(key) ? 0 : 1, data[key] = nativeCreate && void 0 === value ? HASH_UNDEFINED : value, 
        this;
    };
}, function(module, exports, __webpack_require__) {
    var getMapData = __webpack_require__(52);
    module.exports = function(key) {
        var result = getMapData(this, key).delete(key);
        return this.size -= result ? 1 : 0, result;
    };
}, function(module, exports) {
    module.exports = function(value) {
        var type = typeof value;
        return "string" == type || "number" == type || "symbol" == type || "boolean" == type ? "__proto__" !== value : null === value;
    };
}, function(module, exports, __webpack_require__) {
    var getMapData = __webpack_require__(52);
    module.exports = function(key) {
        return getMapData(this, key).get(key);
    };
}, function(module, exports, __webpack_require__) {
    var getMapData = __webpack_require__(52);
    module.exports = function(key) {
        return getMapData(this, key).has(key);
    };
}, function(module, exports, __webpack_require__) {
    var getMapData = __webpack_require__(52);
    module.exports = function(key, value) {
        var data = getMapData(this, key), size = data.size;
        return data.set(key, value), this.size += data.size == size ? 0 : 1, this;
    };
}, function(module, exports, __webpack_require__) {
    var Stack = __webpack_require__(58), equalArrays = __webpack_require__(122), equalByTag = __webpack_require__(245), equalObjects = __webpack_require__(246), getTag = __webpack_require__(103), isArray = __webpack_require__(7), isBuffer = __webpack_require__(33), isTypedArray = __webpack_require__(41), COMPARE_PARTIAL_FLAG = 1, argsTag = "[object Arguments]", arrayTag = "[object Array]", objectTag = "[object Object]", hasOwnProperty = Object.prototype.hasOwnProperty;
    module.exports = function(object, other, bitmask, customizer, equalFunc, stack) {
        var objIsArr = isArray(object), othIsArr = isArray(other), objTag = objIsArr ? arrayTag : getTag(object), othTag = othIsArr ? arrayTag : getTag(other), objIsObj = (objTag = objTag == argsTag ? objectTag : objTag) == objectTag, othIsObj = (othTag = othTag == argsTag ? objectTag : othTag) == objectTag, isSameTag = objTag == othTag;
        if (isSameTag && isBuffer(object)) {
            if (!isBuffer(other)) return !1;
            objIsArr = !0, objIsObj = !1;
        }
        if (isSameTag && !objIsObj) return stack || (stack = new Stack()), objIsArr || isTypedArray(object) ? equalArrays(object, other, bitmask, customizer, equalFunc, stack) : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
        if (!(bitmask & COMPARE_PARTIAL_FLAG)) {
            var objIsWrapped = objIsObj && hasOwnProperty.call(object, "__wrapped__"), othIsWrapped = othIsObj && hasOwnProperty.call(other, "__wrapped__");
            if (objIsWrapped || othIsWrapped) {
                var objUnwrapped = objIsWrapped ? object.value() : object, othUnwrapped = othIsWrapped ? other.value() : other;
                return stack || (stack = new Stack()), equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
            }
        }
        return !!isSameTag && (stack || (stack = new Stack()), equalObjects(object, other, bitmask, customizer, equalFunc, stack));
    };
}, function(module, exports) {
    var HASH_UNDEFINED = "__lodash_hash_undefined__";
    module.exports = function(value) {
        return this.__data__.set(value, HASH_UNDEFINED), this;
    };
}, function(module, exports) {
    module.exports = function(value) {
        return this.__data__.has(value);
    };
}, function(module, exports) {
    module.exports = function(array, predicate) {
        for (var index = -1, length = null == array ? 0 : array.length; ++index < length; ) if (predicate(array[index], index, array)) return !0;
        return !1;
    };
}, function(module, exports, __webpack_require__) {
    var Symbol = __webpack_require__(32), Uint8Array = __webpack_require__(123), eq = __webpack_require__(34), equalArrays = __webpack_require__(122), mapToArray = __webpack_require__(158), setToArray = __webpack_require__(100), COMPARE_PARTIAL_FLAG = 1, COMPARE_UNORDERED_FLAG = 2, boolTag = "[object Boolean]", dateTag = "[object Date]", errorTag = "[object Error]", mapTag = "[object Map]", numberTag = "[object Number]", regexpTag = "[object RegExp]", setTag = "[object Set]", stringTag = "[object String]", symbolTag = "[object Symbol]", arrayBufferTag = "[object ArrayBuffer]", dataViewTag = "[object DataView]", symbolProto = Symbol ? Symbol.prototype : void 0, symbolValueOf = symbolProto ? symbolProto.valueOf : void 0;
    module.exports = function(object, other, tag, bitmask, customizer, equalFunc, stack) {
        switch (tag) {
          case dataViewTag:
            if (object.byteLength != other.byteLength || object.byteOffset != other.byteOffset) return !1;
            object = object.buffer, other = other.buffer;

          case arrayBufferTag:
            return !(object.byteLength != other.byteLength || !equalFunc(new Uint8Array(object), new Uint8Array(other)));

          case boolTag:
          case dateTag:
          case numberTag:
            return eq(+object, +other);

          case errorTag:
            return object.name == other.name && object.message == other.message;

          case regexpTag:
          case stringTag:
            return object == other + "";

          case mapTag:
            var convert = mapToArray;

          case setTag:
            var isPartial = bitmask & COMPARE_PARTIAL_FLAG;
            if (convert || (convert = setToArray), object.size != other.size && !isPartial) return !1;
            var stacked = stack.get(object);
            if (stacked) return stacked == other;
            bitmask |= COMPARE_UNORDERED_FLAG, stack.set(object, other);
            var result = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
            return stack.delete(object), result;

          case symbolTag:
            if (symbolValueOf) return symbolValueOf.call(object) == symbolValueOf.call(other);
        }
        return !1;
    };
}, function(module, exports, __webpack_require__) {
    var getAllKeys = __webpack_require__(159), COMPARE_PARTIAL_FLAG = 1, hasOwnProperty = Object.prototype.hasOwnProperty;
    module.exports = function(object, other, bitmask, customizer, equalFunc, stack) {
        var isPartial = bitmask & COMPARE_PARTIAL_FLAG, objProps = getAllKeys(object), objLength = objProps.length;
        if (objLength != getAllKeys(other).length && !isPartial) return !1;
        for (var index = objLength; index--; ) {
            var key = objProps[index];
            if (!(isPartial ? key in other : hasOwnProperty.call(other, key))) return !1;
        }
        var stacked = stack.get(object);
        if (stacked && stack.get(other)) return stacked == other;
        var result = !0;
        stack.set(object, other), stack.set(other, object);
        for (var skipCtor = isPartial; ++index < objLength; ) {
            var objValue = object[key = objProps[index]], othValue = other[key];
            if (customizer) var compared = isPartial ? customizer(othValue, objValue, key, other, object, stack) : customizer(objValue, othValue, key, object, other, stack);
            if (!(void 0 === compared ? objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack) : compared)) {
                result = !1;
                break;
            }
            skipCtor || (skipCtor = "constructor" == key);
        }
        if (result && !skipCtor) {
            var objCtor = object.constructor, othCtor = other.constructor;
            objCtor != othCtor && "constructor" in object && "constructor" in other && !("function" == typeof objCtor && objCtor instanceof objCtor && "function" == typeof othCtor && othCtor instanceof othCtor) && (result = !1);
        }
        return stack.delete(object), stack.delete(other), result;
    };
}, function(module, exports, __webpack_require__) {
    var DataView = __webpack_require__(25)(__webpack_require__(12), "DataView");
    module.exports = DataView;
}, function(module, exports, __webpack_require__) {
    var Promise = __webpack_require__(25)(__webpack_require__(12), "Promise");
    module.exports = Promise;
}, function(module, exports, __webpack_require__) {
    var WeakMap = __webpack_require__(25)(__webpack_require__(12), "WeakMap");
    module.exports = WeakMap;
}, function(module, exports, __webpack_require__) {
    var isStrictComparable = __webpack_require__(124), keys = __webpack_require__(31);
    module.exports = function(object) {
        for (var result = keys(object), length = result.length; length--; ) {
            var key = result[length], value = object[key];
            result[length] = [ key, value, isStrictComparable(value) ];
        }
        return result;
    };
}, function(module, exports, __webpack_require__) {
    var baseIsEqual = __webpack_require__(81), get = __webpack_require__(252), hasIn = __webpack_require__(257), isKey = __webpack_require__(83), isStrictComparable = __webpack_require__(124), matchesStrictComparable = __webpack_require__(125), toKey = __webpack_require__(43), COMPARE_PARTIAL_FLAG = 1, COMPARE_UNORDERED_FLAG = 2;
    module.exports = function(path, srcValue) {
        return isKey(path) && isStrictComparable(srcValue) ? matchesStrictComparable(toKey(path), srcValue) : function(object) {
            var objValue = get(object, path);
            return void 0 === objValue && objValue === srcValue ? hasIn(object, path) : baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG);
        };
    };
}, function(module, exports, __webpack_require__) {
    var baseGet = __webpack_require__(89);
    module.exports = function(object, path, defaultValue) {
        var result = null == object ? void 0 : baseGet(object, path);
        return void 0 === result ? defaultValue : result;
    };
}, function(module, exports, __webpack_require__) {
    var reLeadingDot = /^\./, rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g, reEscapeChar = /\\(\\)?/g, stringToPath = __webpack_require__(254)(function(string) {
        var result = [];
        return reLeadingDot.test(string) && result.push(""), string.replace(rePropName, function(match, number, quote, string) {
            result.push(quote ? string.replace(reEscapeChar, "$1") : number || match);
        }), result;
    });
    module.exports = stringToPath;
}, function(module, exports, __webpack_require__) {
    var memoize = __webpack_require__(255), MAX_MEMOIZE_SIZE = 500;
    module.exports = function(func) {
        var result = memoize(func, function(key) {
            return cache.size === MAX_MEMOIZE_SIZE && cache.clear(), key;
        }), cache = result.cache;
        return result;
    };
}, function(module, exports, __webpack_require__) {
    function memoize(func, resolver) {
        if ("function" != typeof func || null != resolver && "function" != typeof resolver) throw new TypeError(FUNC_ERROR_TEXT);
        var memoized = function() {
            var args = arguments, key = resolver ? resolver.apply(this, args) : args[0], cache = memoized.cache;
            if (cache.has(key)) return cache.get(key);
            var result = func.apply(this, args);
            return memoized.cache = cache.set(key, result) || cache, result;
        };
        return memoized.cache = new (memoize.Cache || MapCache)(), memoized;
    }
    var MapCache = __webpack_require__(80), FUNC_ERROR_TEXT = "Expected a function";
    memoize.Cache = MapCache, module.exports = memoize;
}, function(module, exports, __webpack_require__) {
    function baseToString(value) {
        if ("string" == typeof value) return value;
        if (isArray(value)) return arrayMap(value, baseToString) + "";
        if (isSymbol(value)) return symbolToString ? symbolToString.call(value) : "";
        var result = value + "";
        return "0" == result && 1 / value == -INFINITY ? "-0" : result;
    }
    var Symbol = __webpack_require__(32), arrayMap = __webpack_require__(104), isArray = __webpack_require__(7), isSymbol = __webpack_require__(53), INFINITY = 1 / 0, symbolProto = Symbol ? Symbol.prototype : void 0, symbolToString = symbolProto ? symbolProto.toString : void 0;
    module.exports = baseToString;
}, function(module, exports, __webpack_require__) {
    var baseHasIn = __webpack_require__(258), hasPath = __webpack_require__(259);
    module.exports = function(object, path) {
        return null != object && hasPath(object, path, baseHasIn);
    };
}, function(module, exports) {
    module.exports = function(object, key) {
        return null != object && key in Object(object);
    };
}, function(module, exports, __webpack_require__) {
    var castPath = __webpack_require__(82), isArguments = __webpack_require__(46), isArray = __webpack_require__(7), isIndex = __webpack_require__(64), isLength = __webpack_require__(78), toKey = __webpack_require__(43);
    module.exports = function(object, path, hasFunc) {
        for (var index = -1, length = (path = castPath(path, object)).length, result = !1; ++index < length; ) {
            var key = toKey(path[index]);
            if (!(result = null != object && hasFunc(object, key))) break;
            object = object[key];
        }
        return result || ++index != length ? result : !!(length = null == object ? 0 : object.length) && isLength(length) && isIndex(key, length) && (isArray(object) || isArguments(object));
    };
}, function(module, exports, __webpack_require__) {
    var baseProperty = __webpack_require__(261), basePropertyDeep = __webpack_require__(262), isKey = __webpack_require__(83), toKey = __webpack_require__(43);
    module.exports = function(path) {
        return isKey(path) ? baseProperty(toKey(path)) : basePropertyDeep(path);
    };
}, function(module, exports) {
    module.exports = function(key) {
        return function(object) {
            return null == object ? void 0 : object[key];
        };
    };
}, function(module, exports, __webpack_require__) {
    var baseGet = __webpack_require__(89);
    module.exports = function(path) {
        return function(object) {
            return baseGet(object, path);
        };
    };
}, function(module, exports, __webpack_require__) {
    __webpack_require__(264);
    var algorithms = {
        superfasthash: __webpack_require__(265),
        murmurhash3: __webpack_require__(266)
    };
    module.exports = {
        createHash: function(algorithm) {
            algorithm = algorithm.replace(/![a-zA-z0-9]/g, "").toLowerCase();
            try {
                return algorithms[algorithm];
            } catch (e) {
                throw new Error(e);
            }
        }
    };
}, function(module, exports, __webpack_require__) {
    (function(process) {
        function normalizeArray(parts, allowAboveRoot) {
            for (var up = 0, i = parts.length - 1; i >= 0; i--) {
                var last = parts[i];
                "." === last ? parts.splice(i, 1) : ".." === last ? (parts.splice(i, 1), up++) : up && (parts.splice(i, 1), 
                up--);
            }
            if (allowAboveRoot) for (;up--; up) parts.unshift("..");
            return parts;
        }
        function filter(xs, f) {
            if (xs.filter) return xs.filter(f);
            for (var res = [], i = 0; i < xs.length; i++) f(xs[i], i, xs) && res.push(xs[i]);
            return res;
        }
        var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/, splitPath = function(filename) {
            return splitPathRe.exec(filename).slice(1);
        };
        exports.resolve = function() {
            for (var resolvedPath = "", resolvedAbsolute = !1, i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
                var path = i >= 0 ? arguments[i] : process.cwd();
                if ("string" != typeof path) throw new TypeError("Arguments to path.resolve must be strings");
                path && (resolvedPath = path + "/" + resolvedPath, resolvedAbsolute = "/" === path.charAt(0));
            }
            return resolvedPath = normalizeArray(filter(resolvedPath.split("/"), function(p) {
                return !!p;
            }), !resolvedAbsolute).join("/"), (resolvedAbsolute ? "/" : "") + resolvedPath || ".";
        }, exports.normalize = function(path) {
            var isAbsolute = exports.isAbsolute(path), trailingSlash = "/" === substr(path, -1);
            return (path = normalizeArray(filter(path.split("/"), function(p) {
                return !!p;
            }), !isAbsolute).join("/")) || isAbsolute || (path = "."), path && trailingSlash && (path += "/"), 
            (isAbsolute ? "/" : "") + path;
        }, exports.isAbsolute = function(path) {
            return "/" === path.charAt(0);
        }, exports.join = function() {
            var paths = Array.prototype.slice.call(arguments, 0);
            return exports.normalize(filter(paths, function(p, index) {
                if ("string" != typeof p) throw new TypeError("Arguments to path.join must be strings");
                return p;
            }).join("/"));
        }, exports.relative = function(from, to) {
            function trim(arr) {
                for (var start = 0; start < arr.length && "" === arr[start]; start++) ;
                for (var end = arr.length - 1; end >= 0 && "" === arr[end]; end--) ;
                return start > end ? [] : arr.slice(start, end - start + 1);
            }
            from = exports.resolve(from).substr(1), to = exports.resolve(to).substr(1);
            for (var fromParts = trim(from.split("/")), toParts = trim(to.split("/")), length = Math.min(fromParts.length, toParts.length), samePartsLength = length, i = 0; i < length; i++) if (fromParts[i] !== toParts[i]) {
                samePartsLength = i;
                break;
            }
            for (var outputParts = [], i = samePartsLength; i < fromParts.length; i++) outputParts.push("..");
            return (outputParts = outputParts.concat(toParts.slice(samePartsLength))).join("/");
        }, exports.sep = "/", exports.delimiter = ":", exports.dirname = function(path) {
            var result = splitPath(path), root = result[0], dir = result[1];
            return root || dir ? (dir && (dir = dir.substr(0, dir.length - 1)), root + dir) : ".";
        }, exports.basename = function(path, ext) {
            var f = splitPath(path)[2];
            return ext && f.substr(-1 * ext.length) === ext && (f = f.substr(0, f.length - ext.length)), 
            f;
        }, exports.extname = function(path) {
            return splitPath(path)[3];
        };
        var substr = "b" === "ab".substr(-1) ? function(str, start, len) {
            return str.substr(start, len);
        } : function(str, start, len) {
            return start < 0 && (start = str.length + start), str.substr(start, len);
        };
    }).call(exports, __webpack_require__(60));
}, function(module, exports, __webpack_require__) {
    "use strict";
    function getU16Int(u8IntArray, index) {
        return u8IntArray[index] << 8 | u8IntArray[index + 1];
    }
    var util = __webpack_require__(126);
    module.exports = {
        hash: function(inputString) {
            var rem, u8IntArray = util.toU8IntArray(inputString + ""), hash = 0;
            if (!inputString) return hash.toString(16);
            var len = u8IntArray.length, pointer = 0;
            rem = 3 & len, len >>>= 2;
            for (var i = 0; i < len; i++) hash = (hash += getU16Int(u8IntArray, pointer)) << 16 ^ getU16Int(u8IntArray, pointer + 2) << 11 ^ hash, 
            pointer += 4, hash += hash >> 11;
            switch (rem) {
              case 3:
                hash += getU16Int(u8IntArray, pointer), hash ^= hash << 16, hash ^= u8IntArray[pointer + 2] << 18, 
                hash += hash >> 11;
                break;

              case 2:
                hash += getU16Int(u8IntArray, pointer), hash ^= hash << 11, hash += hash >> 17;
                break;

              case 1:
                hash += u8IntArray[pointer], hash ^= hash << 10, hash += hash >> 1;
            }
            return hash ^= hash << 3, hash += hash >> 5, hash ^= hash << 4, hash += hash >> 17, 
            hash ^= hash << 25, hash += hash >> 6, util.intToUnsignedHex(hash);
        }
    };
}, function(module, exports, __webpack_require__) {
    "use strict";
    function _x86Multiply(m, n) {
        return (65535 & m) * n + (((m >>> 16) * n & 65535) << 16);
    }
    function _x86Rotl(m, n) {
        return m << n | m >>> 32 - n;
    }
    function _x86Fmix(h) {
        return h ^= h >>> 16, h = _x86Multiply(h, 2246822507), h ^= h >>> 13, h = _x86Multiply(h, 3266489909), 
        h ^= h >>> 16;
    }
    function _x64Add(m, n) {
        m = [ m[0] >>> 16, 65535 & m[0], m[1] >>> 16, 65535 & m[1] ], n = [ n[0] >>> 16, 65535 & n[0], n[1] >>> 16, 65535 & n[1] ];
        var o = [ 0, 0, 0, 0 ];
        return o[3] += m[3] + n[3], o[2] += o[3] >>> 16, o[3] &= 65535, o[2] += m[2] + n[2], 
        o[1] += o[2] >>> 16, o[2] &= 65535, o[1] += m[1] + n[1], o[0] += o[1] >>> 16, o[1] &= 65535, 
        o[0] += m[0] + n[0], o[0] &= 65535, [ o[0] << 16 | o[1], o[2] << 16 | o[3] ];
    }
    function _x64Multiply(m, n) {
        m = [ m[0] >>> 16, 65535 & m[0], m[1] >>> 16, 65535 & m[1] ], n = [ n[0] >>> 16, 65535 & n[0], n[1] >>> 16, 65535 & n[1] ];
        var o = [ 0, 0, 0, 0 ];
        return o[3] += m[3] * n[3], o[2] += o[3] >>> 16, o[3] &= 65535, o[2] += m[2] * n[3], 
        o[1] += o[2] >>> 16, o[2] &= 65535, o[2] += m[3] * n[2], o[1] += o[2] >>> 16, o[2] &= 65535, 
        o[1] += m[1] * n[3], o[0] += o[1] >>> 16, o[1] &= 65535, o[1] += m[2] * n[2], o[0] += o[1] >>> 16, 
        o[1] &= 65535, o[1] += m[3] * n[1], o[0] += o[1] >>> 16, o[1] &= 65535, o[0] += m[0] * n[3] + m[1] * n[2] + m[2] * n[1] + m[3] * n[0], 
        o[0] &= 65535, [ o[0] << 16 | o[1], o[2] << 16 | o[3] ];
    }
    function _x64Rotl(m, n) {
        return 32 === (n %= 64) ? [ m[1], m[0] ] : n < 32 ? [ m[0] << n | m[1] >>> 32 - n, m[1] << n | m[0] >>> 32 - n ] : (n -= 32, 
        [ m[1] << n | m[0] >>> 32 - n, m[0] << n | m[1] >>> 32 - n ]);
    }
    function _x64LeftShift(m, n) {
        return 0 === (n %= 64) ? m : n < 32 ? [ m[0] << n | m[1] >>> 32 - n, m[1] << n ] : [ m[1] << n - 32, 0 ];
    }
    function _x64Xor(m, n) {
        return [ m[0] ^ n[0], m[1] ^ n[1] ];
    }
    function _x64Fmix(h) {
        return h = _x64Xor(h, [ 0, h[0] >>> 1 ]), h = _x64Multiply(h, [ 4283543511, 3981806797 ]), 
        h = _x64Xor(h, [ 0, h[0] >>> 1 ]), h = _x64Multiply(h, [ 3301882366, 444984403 ]), 
        h = _x64Xor(h, [ 0, h[0] >>> 1 ]);
    }
    var util = __webpack_require__(126), x64Hash128 = function(key, seed) {
        key = "" + key || "";
        var u8IntArray = util.toU8IntArray(key);
        key = {
            charCodeAt: function(index) {
                return u8IntArray[index];
            },
            length: u8IntArray.length
        }, seed = seed || 0;
        for (var remainder = key.length % 16, bytes = key.length - remainder, h1 = [ 0, seed ], h2 = [ 0, seed ], k1 = [ 0, 0 ], k2 = [ 0, 0 ], c1 = [ 2277735313, 289559509 ], c2 = [ 1291169091, 658871167 ], i = 0; i < bytes; i += 16) k1 = [ 255 & key.charCodeAt(i + 4) | (255 & key.charCodeAt(i + 5)) << 8 | (255 & key.charCodeAt(i + 6)) << 16 | (255 & key.charCodeAt(i + 7)) << 24, 255 & key.charCodeAt(i) | (255 & key.charCodeAt(i + 1)) << 8 | (255 & key.charCodeAt(i + 2)) << 16 | (255 & key.charCodeAt(i + 3)) << 24 ], 
        k2 = [ 255 & key.charCodeAt(i + 12) | (255 & key.charCodeAt(i + 13)) << 8 | (255 & key.charCodeAt(i + 14)) << 16 | (255 & key.charCodeAt(i + 15)) << 24, 255 & key.charCodeAt(i + 8) | (255 & key.charCodeAt(i + 9)) << 8 | (255 & key.charCodeAt(i + 10)) << 16 | (255 & key.charCodeAt(i + 11)) << 24 ], 
        h1 = _x64Add(_x64Multiply(h1 = _x64Add(h1 = _x64Rotl(h1 = _x64Xor(h1, k1 = _x64Multiply(k1 = _x64Rotl(k1 = _x64Multiply(k1, c1), 31), c2)), 27), h2), [ 0, 5 ]), [ 0, 1390208809 ]), 
        h2 = _x64Add(_x64Multiply(h2 = _x64Add(h2 = _x64Rotl(h2 = _x64Xor(h2, k2 = _x64Multiply(k2 = _x64Rotl(k2 = _x64Multiply(k2, c2), 33), c1)), 31), h1), [ 0, 5 ]), [ 0, 944331445 ]);
        switch (k1 = [ 0, 0 ], k2 = [ 0, 0 ], remainder) {
          case 15:
            k2 = _x64Xor(k2, _x64LeftShift([ 0, key.charCodeAt(i + 14) ], 48));

          case 14:
            k2 = _x64Xor(k2, _x64LeftShift([ 0, key.charCodeAt(i + 13) ], 40));

          case 13:
            k2 = _x64Xor(k2, _x64LeftShift([ 0, key.charCodeAt(i + 12) ], 32));

          case 12:
            k2 = _x64Xor(k2, _x64LeftShift([ 0, key.charCodeAt(i + 11) ], 24));

          case 11:
            k2 = _x64Xor(k2, _x64LeftShift([ 0, key.charCodeAt(i + 10) ], 16));

          case 10:
            k2 = _x64Xor(k2, _x64LeftShift([ 0, key.charCodeAt(i + 9) ], 8));

          case 9:
            h2 = _x64Xor(h2, k2 = _x64Multiply(k2 = _x64Rotl(k2 = _x64Multiply(k2 = _x64Xor(k2, [ 0, key.charCodeAt(i + 8) ]), c2), 33), c1));

          case 8:
            k1 = _x64Xor(k1, _x64LeftShift([ 0, key.charCodeAt(i + 7) ], 56));

          case 7:
            k1 = _x64Xor(k1, _x64LeftShift([ 0, key.charCodeAt(i + 6) ], 48));

          case 6:
            k1 = _x64Xor(k1, _x64LeftShift([ 0, key.charCodeAt(i + 5) ], 40));

          case 5:
            k1 = _x64Xor(k1, _x64LeftShift([ 0, key.charCodeAt(i + 4) ], 32));

          case 4:
            k1 = _x64Xor(k1, _x64LeftShift([ 0, key.charCodeAt(i + 3) ], 24));

          case 3:
            k1 = _x64Xor(k1, _x64LeftShift([ 0, key.charCodeAt(i + 2) ], 16));

          case 2:
            k1 = _x64Xor(k1, _x64LeftShift([ 0, key.charCodeAt(i + 1) ], 8));

          case 1:
            h1 = _x64Xor(h1, k1 = _x64Multiply(k1 = _x64Rotl(k1 = _x64Multiply(k1 = _x64Xor(k1, [ 0, key.charCodeAt(i) ]), c1), 31), c2));
        }
        return h1 = _x64Xor(h1, [ 0, key.length ]), h2 = _x64Xor(h2, [ 0, key.length ]), 
        h1 = _x64Add(h1, h2), h2 = _x64Add(h2, h1), h1 = _x64Fmix(h1), h2 = _x64Fmix(h2), 
        h1 = _x64Add(h1, h2), h2 = _x64Add(h2, h1), ("00000000" + (h1[0] >>> 0).toString(16)).slice(-8) + ("00000000" + (h1[1] >>> 0).toString(16)).slice(-8) + ("00000000" + (h2[0] >>> 0).toString(16)).slice(-8) + ("00000000" + (h2[1] >>> 0).toString(16)).slice(-8);
    };
    module.exports = {
        x86Hash32: function(key, seed) {
            key = "" + key || "";
            var u8IntArray = util.toU8IntArray(key);
            key = {
                charCodeAt: function(index) {
                    return u8IntArray[index];
                },
                length: u8IntArray.length
            }, seed = seed || 0;
            for (var remainder = key.length % 4, bytes = key.length - remainder, h1 = seed, k1 = 0, c1 = 3432918353, c2 = 461845907, i = 0; i < bytes; i += 4) h1 = _x86Multiply(h1 = _x86Rotl(h1 ^= k1 = _x86Multiply(k1 = _x86Rotl(k1 = _x86Multiply(k1 = 255 & key.charCodeAt(i) | (255 & key.charCodeAt(i + 1)) << 8 | (255 & key.charCodeAt(i + 2)) << 16 | (255 & key.charCodeAt(i + 3)) << 24, c1), 15), c2), 13), 5) + 3864292196;
            switch (k1 = 0, remainder) {
              case 3:
                k1 ^= (255 & key.charCodeAt(i + 2)) << 16;

              case 2:
                k1 ^= (255 & key.charCodeAt(i + 1)) << 8;

              case 1:
                h1 ^= k1 = _x86Multiply(k1 = _x86Rotl(k1 = _x86Multiply(k1 ^= 255 & key.charCodeAt(i), c1), 15), c2);
            }
            return h1 ^= key.length, ((h1 = _x86Fmix(h1)) >>> 0).toString(16);
        },
        x86Hash128: function(key, seed) {
            key = "" + key || "";
            var u8IntArray = util.toU8IntArray(key);
            key = {
                charCodeAt: function(index) {
                    return u8IntArray[index];
                },
                length: u8IntArray.length
            }, seed = seed || 0;
            for (var remainder = key.length % 16, bytes = key.length - remainder, h1 = seed, h2 = seed, h3 = seed, h4 = seed, k1 = 0, k2 = 0, k3 = 0, k4 = 0, c1 = 597399067, c2 = 2869860233, c3 = 951274213, c4 = 2716044179, i = 0; i < bytes; i += 16) k1 = 255 & key.charCodeAt(i) | (255 & key.charCodeAt(i + 1)) << 8 | (255 & key.charCodeAt(i + 2)) << 16 | (255 & key.charCodeAt(i + 3)) << 24, 
            k2 = 255 & key.charCodeAt(i + 4) | (255 & key.charCodeAt(i + 5)) << 8 | (255 & key.charCodeAt(i + 6)) << 16 | (255 & key.charCodeAt(i + 7)) << 24, 
            k3 = 255 & key.charCodeAt(i + 8) | (255 & key.charCodeAt(i + 9)) << 8 | (255 & key.charCodeAt(i + 10)) << 16 | (255 & key.charCodeAt(i + 11)) << 24, 
            k4 = 255 & key.charCodeAt(i + 12) | (255 & key.charCodeAt(i + 13)) << 8 | (255 & key.charCodeAt(i + 14)) << 16 | (255 & key.charCodeAt(i + 15)) << 24, 
            h1 = _x86Rotl(h1 ^= k1 = _x86Multiply(k1 = _x86Rotl(k1 = _x86Multiply(k1, c1), 15), c2), 19), 
            h1 = _x86Multiply(h1 += h2, 5) + 1444728091, h2 = _x86Rotl(h2 ^= k2 = _x86Multiply(k2 = _x86Rotl(k2 = _x86Multiply(k2, c2), 16), c3), 17), 
            h2 = _x86Multiply(h2 += h3, 5) + 197830471, h3 = _x86Rotl(h3 ^= k3 = _x86Multiply(k3 = _x86Rotl(k3 = _x86Multiply(k3, c3), 17), c4), 15), 
            h3 = _x86Multiply(h3 += h4, 5) + 2530024501, h4 = _x86Rotl(h4 ^= k4 = _x86Multiply(k4 = _x86Rotl(k4 = _x86Multiply(k4, c4), 18), c1), 13), 
            h4 = _x86Multiply(h4 += h1, 5) + 850148119;
            switch (k1 = 0, k2 = 0, k3 = 0, k4 = 0, remainder) {
              case 15:
                k4 ^= key.charCodeAt(i + 14) << 16;

              case 14:
                k4 ^= key.charCodeAt(i + 13) << 8;

              case 13:
                h4 ^= k4 = _x86Multiply(k4 = _x86Rotl(k4 = _x86Multiply(k4 ^= key.charCodeAt(i + 12), c4), 18), c1);

              case 12:
                k3 ^= key.charCodeAt(i + 11) << 24;

              case 11:
                k3 ^= key.charCodeAt(i + 10) << 16;

              case 10:
                k3 ^= key.charCodeAt(i + 9) << 8;

              case 9:
                h3 ^= k3 = _x86Multiply(k3 = _x86Rotl(k3 = _x86Multiply(k3 ^= key.charCodeAt(i + 8), c3), 17), c4);

              case 8:
                k2 ^= key.charCodeAt(i + 7) << 24;

              case 7:
                k2 ^= key.charCodeAt(i + 6) << 16;

              case 6:
                k2 ^= key.charCodeAt(i + 5) << 8;

              case 5:
                h2 ^= k2 = _x86Multiply(k2 = _x86Rotl(k2 = _x86Multiply(k2 ^= key.charCodeAt(i + 4), c2), 16), c3);

              case 4:
                k1 ^= key.charCodeAt(i + 3) << 24;

              case 3:
                k1 ^= key.charCodeAt(i + 2) << 16;

              case 2:
                k1 ^= key.charCodeAt(i + 1) << 8;

              case 1:
                h1 ^= k1 = _x86Multiply(k1 = _x86Rotl(k1 = _x86Multiply(k1 ^= key.charCodeAt(i), c1), 15), c2);
            }
            return h1 ^= key.length, h2 ^= key.length, h3 ^= key.length, h4 ^= key.length, h1 += h2, 
            h1 += h3, h1 += h4, h2 += h1, h3 += h1, h4 += h1, h1 = _x86Fmix(h1), h2 = _x86Fmix(h2), 
            h3 = _x86Fmix(h3), h4 = _x86Fmix(h4), h1 += h2, h1 += h3, h1 += h4, h2 += h1, h3 += h1, 
            h4 += h1, ("00000000" + (h1 >>> 0).toString(16)).slice(-8) + ("00000000" + (h2 >>> 0).toString(16)).slice(-8) + ("00000000" + (h3 >>> 0).toString(16)).slice(-8) + ("00000000" + (h4 >>> 0).toString(16)).slice(-8);
        },
        x64Hash64: function(key, seed) {
            return x64Hash128(key, seed).slice(8);
        },
        x64Hash128: x64Hash128,
        hash: function(key, seed) {
            return x64Hash128(key, seed);
        }
    };
}, function(module, exports, __webpack_require__) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    });
    var chrome_util_1 = __webpack_require__(128), stdlib_1 = __webpack_require__(4), ChromeTabsApiImpl = function() {
        function ChromeTabsApiImpl() {
            this.kind = "web-extension";
        }
        return ChromeTabsApiImpl.prototype.open = function(url, activateOnOpen) {
            return stdlib_1.SafePromise.create(function(resolve, reject) {
                chrome.tabs.create({
                    url: url,
                    active: activateOnOpen
                }, function(tab) {
                    chrome_util_1.handleChromeError(function() {
                        return resolve(tab);
                    }, reject);
                });
            });
        }, ChromeTabsApiImpl.prototype.updateCurrent = function(url) {
            return stdlib_1.SafePromise.create(function(resolve, reject) {
                chrome.tabs.update({
                    url: url
                }, function(tab) {
                    chrome_util_1.handleChromeError(function() {
                        return resolve(tab);
                    }, reject);
                });
            });
        }, ChromeTabsApiImpl.prototype.getActiveTab = function() {
            return stdlib_1.SafePromise.create(function(resolve, reject) {
                var ct = chrome.tabs;
                ct.query({
                    active: !0,
                    lastFocusedWindow: !0
                }, function(tabs) {
                    chrome_util_1.handleChromeError(function() {
                        tabs && tabs.length ? resolve(tabs[0]) : ct.query({
                            active: !0
                        }, function(tabs) {
                            chrome_util_1.handleChromeError(function() {
                                resolve(tabs[0]);
                            }, reject);
                        });
                    }, reject);
                });
            });
        }, ChromeTabsApiImpl.prototype.getAllTabs = function() {
            return stdlib_1.SafePromise.create(function(resolve, reject) {
                return chrome.tabs.query({}, function(tabs) {
                    return chrome_util_1.handleChromeError(function() {
                        return resolve(tabs);
                    }, reject);
                });
            });
        }, ChromeTabsApiImpl.prototype.getActiveTabUrl = function() {
            var _this = this;
            return stdlib_1.SafePromise.create(function(resolve, reject) {
                return _this.getActiveTab().then(function(tab) {
                    return chrome_util_1.handleChromeError(function() {
                        return resolve(tab && tab.url);
                    }, reject);
                });
            });
        }, ChromeTabsApiImpl.prototype.onActiveTabChange = function(listener, error) {
            var _this = this, resolveWithCheck = function(tab) {
                chrome_util_1.handleChromeError(function() {
                    tab && listener(tab);
                }, error);
            };
            chrome.tabs.onActivated.addListener(function(activeTab) {
                return chrome.tabs.get(activeTab.tabId, function(tab) {
                    return resolveWithCheck(tab);
                });
            }), chrome.tabs.onUpdated.addListener(function(tabId, reason) {
                _this.getActiveTab().then(function(tab) {
                    tab && tab.id === tabId && (reason.url || reason.favIconUrl || "complete" === reason.status) && chrome.tabs.get(tabId, function(active) {
                        return resolveWithCheck(active);
                    });
                });
            }), chrome.windows.onFocusChanged.addListener(function(windowId) {
                return chrome.tabs.query({
                    active: !0,
                    windowId: windowId,
                    lastFocusedWindow: !0
                }, function(tabs) {
                    return resolveWithCheck(tabs[0]);
                });
            }), this.getActiveTab().then(function(tab) {
                return resolveWithCheck(tab);
            });
        }, ChromeTabsApiImpl.prototype.reload = function(tabId) {
            return stdlib_1.SafePromise.create(function(resolve, reject) {
                var cb = function() {
                    return chrome_util_1.handleChromeError(function() {
                        return resolve();
                    }, reject);
                };
                tabId ? chrome.tabs.reload(tabId, {}, cb) : chrome.tabs.reload(cb);
            });
        }, ChromeTabsApiImpl;
    }();
    exports.ChromeTabsApiImpl = ChromeTabsApiImpl;
}, function(module, exports, __webpack_require__) {
    function baseMerge(object, source, srcIndex, customizer, stack) {
        object !== source && baseFor(source, function(srcValue, key) {
            if (isObject(srcValue)) stack || (stack = new Stack()), baseMergeDeep(object, source, key, srcIndex, baseMerge, customizer, stack); else {
                var newValue = customizer ? customizer(object[key], srcValue, key + "", object, source, stack) : void 0;
                void 0 === newValue && (newValue = srcValue), assignMergeValue(object, key, newValue);
            }
        }, keysIn);
    }
    var Stack = __webpack_require__(58), assignMergeValue = __webpack_require__(129), baseFor = __webpack_require__(117), baseMergeDeep = __webpack_require__(269), isObject = __webpack_require__(8), keysIn = __webpack_require__(44);
    module.exports = baseMerge;
}, function(module, exports, __webpack_require__) {
    var assignMergeValue = __webpack_require__(129), cloneBuffer = __webpack_require__(165), cloneTypedArray = __webpack_require__(166), copyArray = __webpack_require__(167), initCloneObject = __webpack_require__(168), isArguments = __webpack_require__(46), isArray = __webpack_require__(7), isArrayLikeObject = __webpack_require__(131), isBuffer = __webpack_require__(33), isFunction = __webpack_require__(42), isObject = __webpack_require__(8), isPlainObject = __webpack_require__(169), isTypedArray = __webpack_require__(41), toPlainObject = __webpack_require__(270);
    module.exports = function(object, source, key, srcIndex, mergeFunc, customizer, stack) {
        var objValue = object[key], srcValue = source[key], stacked = stack.get(srcValue);
        if (stacked) assignMergeValue(object, key, stacked); else {
            var newValue = customizer ? customizer(objValue, srcValue, key + "", object, source, stack) : void 0, isCommon = void 0 === newValue;
            if (isCommon) {
                var isArr = isArray(srcValue), isBuff = !isArr && isBuffer(srcValue), isTyped = !isArr && !isBuff && isTypedArray(srcValue);
                newValue = srcValue, isArr || isBuff || isTyped ? isArray(objValue) ? newValue = objValue : isArrayLikeObject(objValue) ? newValue = copyArray(objValue) : isBuff ? (isCommon = !1, 
                newValue = cloneBuffer(srcValue, !0)) : isTyped ? (isCommon = !1, newValue = cloneTypedArray(srcValue, !0)) : newValue = [] : isPlainObject(srcValue) || isArguments(srcValue) ? (newValue = objValue, 
                isArguments(objValue) ? newValue = toPlainObject(objValue) : (!isObject(objValue) || srcIndex && isFunction(objValue)) && (newValue = initCloneObject(srcValue))) : isCommon = !1;
            }
            isCommon && (stack.set(srcValue, newValue), mergeFunc(newValue, srcValue, srcIndex, customizer, stack), 
            stack.delete(srcValue)), assignMergeValue(object, key, newValue);
        }
    };
}, function(module, exports, __webpack_require__) {
    var copyObject = __webpack_require__(35), keysIn = __webpack_require__(44);
    module.exports = function(value) {
        return copyObject(value, keysIn(value));
    };
}, function(module, exports, __webpack_require__) {
    var isObject = __webpack_require__(8), isPrototype = __webpack_require__(57), nativeKeysIn = __webpack_require__(272), hasOwnProperty = Object.prototype.hasOwnProperty;
    module.exports = function(object) {
        if (!isObject(object)) return nativeKeysIn(object);
        var isProto = isPrototype(object), result = [];
        for (var key in object) ("constructor" != key || !isProto && hasOwnProperty.call(object, key)) && result.push(key);
        return result;
    };
}, function(module, exports) {
    module.exports = function(object) {
        var result = [];
        if (null != object) for (var key in Object(object)) result.push(key);
        return result;
    };
}, function(module, exports, __webpack_require__) {
    var constant = __webpack_require__(274), defineProperty = __webpack_require__(130), identity = __webpack_require__(54), baseSetToString = defineProperty ? function(func, string) {
        return defineProperty(func, "toString", {
            configurable: !0,
            enumerable: !1,
            value: constant(string),
            writable: !0
        });
    } : identity;
    module.exports = baseSetToString;
}, function(module, exports) {
    module.exports = function(value) {
        return function() {
            return value;
        };
    };
}, function(module, exports) {
    var HOT_COUNT = 800, HOT_SPAN = 16, nativeNow = Date.now;
    module.exports = function(func) {
        var count = 0, lastCalled = 0;
        return function() {
            var stamp = nativeNow(), remaining = HOT_SPAN - (stamp - lastCalled);
            if (lastCalled = stamp, remaining > 0) {
                if (++count >= HOT_COUNT) return arguments[0];
            } else count = 0;
            return func.apply(void 0, arguments);
        };
    };
}, , , , , function(module, exports, __webpack_require__) {
    var root = __webpack_require__(12);
    module.exports = function() {
        return root.Date.now();
    };
}, function(module, exports) {
    try {
        module.exports = function(obj) {
            function processTopic(topic) {
                return topic.join ? topic.join(" ") : topic;
            }
            var topics = {};
            return obj = obj || {}, obj.emit = function(topic, data) {
                topic = processTopic(topic);
                var listeners = topics[topic];
                if (listeners) for (var _listeners = listeners.concat(), i = 0; i < _listeners.length; i++) _listeners[i](data);
            }, obj.emitArgs = function(topic) {
                topic = processTopic(topic);
                var listeners = topics[topic], args = [].slice.call(arguments, 1);
                if (listeners) for (var _listeners = listeners.concat(), i = 0; i < _listeners.length; i++) _listeners[i].apply(null, args);
            }, obj.on = function(topic, cb) {
                return topic = processTopic(topic), topics[topic] = topics[topic] || [], topics[topic].push(cb), 
                {
                    un: function() {
                        obj.un(topic, cb);
                    }
                };
            }, obj.off = obj.un = function(topic, cb) {
                topic = processTopic(topic);
                var listeners = topics[topic];
                if (listeners) {
                    var index = listeners.indexOf(cb);
                    index > -1 && (listeners.splice(index, 1), listeners.length > 0 || delete topics[topic]);
                }
            }, obj.one = function(topic, cb) {
                var listener = obj.on(topic, function() {
                    listener.un(), cb.apply(null, arguments);
                });
            }, obj.delegate = function(delegateTo, topic, delegateTopic) {
                topic = processTopic(topic), obj.on(topic, function(data) {
                    delegateTo.emit(delegateTopic || topic, data);
                });
            }, obj;
        };
    } catch (e) {}
}, function(module, exports, __webpack_require__) {
    var arrayEach = __webpack_require__(88), baseEach = __webpack_require__(173), castFunction = __webpack_require__(284), isArray = __webpack_require__(7);
    module.exports = function(collection, iteratee) {
        return (isArray(collection) ? arrayEach : baseEach)(collection, castFunction(iteratee));
    };
}, function(module, exports, __webpack_require__) {
    var isArrayLike = __webpack_require__(26);
    module.exports = function(eachFunc, fromRight) {
        return function(collection, iteratee) {
            if (null == collection) return collection;
            if (!isArrayLike(collection)) return eachFunc(collection, iteratee);
            for (var length = collection.length, index = fromRight ? length : -1, iterable = Object(collection); (fromRight ? index-- : ++index < length) && !1 !== iteratee(iterable[index], index, iterable); ) ;
            return collection;
        };
    };
}, function(module, exports, __webpack_require__) {
    var identity = __webpack_require__(54);
    module.exports = function(value) {
        return "function" == typeof value ? value : identity;
    };
}, function(module, exports, __webpack_require__) {
    var copyObject = __webpack_require__(35), createAssigner = __webpack_require__(107), keysIn = __webpack_require__(44), assignIn = createAssigner(function(object, source) {
        copyObject(source, keysIn(source), object);
    });
    module.exports = assignIn;
}, function(module, exports, __webpack_require__) {
    "use strict";
    function _toConsumableArray(arr) {
        if (Array.isArray(arr)) {
            for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];
            return arr2;
        }
        return Array.from(arr);
    }
    function getLogLevel(level, action, payload, type) {
        switch (void 0 === level ? "undefined" : _typeof(level)) {
          case "object":
            return "function" == typeof level[type] ? level[type].apply(level, _toConsumableArray(payload)) : level[type];

          case "function":
            return level(action);

          default:
            return level;
        }
    }
    function defaultTitleFormatter(options) {
        var timestamp = options.timestamp, duration = options.duration;
        return function(action, time, took) {
            var parts = [ "action" ];
            return parts.push("%c" + String(action.type)), timestamp && parts.push("%c@ " + time), 
            duration && parts.push("%c(in " + took.toFixed(2) + " ms)"), parts.join(" ");
        };
    }
    Object.defineProperty(exports, "__esModule", {
        value: !0
    });
    var _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj) {
        return typeof obj;
    } : function(obj) {
        return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
    exports.printBuffer = function(buffer, options) {
        var logger = options.logger, actionTransformer = options.actionTransformer, _options$titleFormatt = options.titleFormatter, titleFormatter = void 0 === _options$titleFormatt ? defaultTitleFormatter(options) : _options$titleFormatt, collapsed = options.collapsed, colors = options.colors, level = options.level, diff = options.diff;
        buffer.forEach(function(logEntry, key) {
            var started = logEntry.started, startedTime = logEntry.startedTime, action = logEntry.action, prevState = logEntry.prevState, error = logEntry.error, took = logEntry.took, nextState = logEntry.nextState, nextEntry = buffer[key + 1];
            nextEntry && (nextState = nextEntry.prevState, took = nextEntry.started - started);
            var formattedAction = actionTransformer(action), isCollapsed = "function" == typeof collapsed ? collapsed(function() {
                return nextState;
            }, action, logEntry) : collapsed, formattedTime = (0, _helpers.formatTime)(startedTime), titleCSS = colors.title ? "color: " + colors.title(formattedAction) + ";" : "", headerCSS = [ "color: gray; font-weight: lighter;" ];
            headerCSS.push(titleCSS), options.timestamp && headerCSS.push("color: gray; font-weight: lighter;"), 
            options.duration && headerCSS.push("color: gray; font-weight: lighter;");
            var title = titleFormatter(formattedAction, formattedTime, took);
            try {
                isCollapsed ? colors.title ? logger.groupCollapsed.apply(logger, [ "%c " + title ].concat(headerCSS)) : logger.groupCollapsed(title) : colors.title ? logger.group.apply(logger, [ "%c " + title ].concat(headerCSS)) : logger.group(title);
            } catch (e) {
                logger.log(title);
            }
            var prevStateLevel = getLogLevel(level, formattedAction, [ prevState ], "prevState"), actionLevel = getLogLevel(level, formattedAction, [ formattedAction ], "action"), errorLevel = getLogLevel(level, formattedAction, [ error, prevState ], "error"), nextStateLevel = getLogLevel(level, formattedAction, [ nextState ], "nextState");
            prevStateLevel && (colors.prevState ? logger[prevStateLevel]("%c prev state", "color: " + colors.prevState(prevState) + "; font-weight: bold", prevState) : logger[prevStateLevel]("prev state", prevState)), 
            actionLevel && (colors.action ? logger[actionLevel]("%c action    ", "color: " + colors.action(formattedAction) + "; font-weight: bold", formattedAction) : logger[actionLevel]("action    ", formattedAction)), 
            error && errorLevel && (colors.error ? logger[errorLevel]("%c error     ", "color: " + colors.error(error, prevState) + "; font-weight: bold;", error) : logger[errorLevel]("error     ", error)), 
            nextStateLevel && (colors.nextState ? logger[nextStateLevel]("%c next state", "color: " + colors.nextState(nextState) + "; font-weight: bold", nextState) : logger[nextStateLevel]("next state", nextState)), 
            diff && (0, _diff2.default)(prevState, nextState, logger, isCollapsed);
            try {
                logger.groupEnd();
            } catch (e) {
                logger.log("—— log end ——");
            }
        });
    };
    var _helpers = __webpack_require__(137), _diff2 = function(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }(__webpack_require__(287));
}, function(module, exports, __webpack_require__) {
    "use strict";
    function _toConsumableArray(arr) {
        if (Array.isArray(arr)) {
            for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];
            return arr2;
        }
        return Array.from(arr);
    }
    function style(kind) {
        return "color: " + dictionary[kind].color + "; font-weight: bold";
    }
    function render(diff) {
        var kind = diff.kind, path = diff.path, lhs = diff.lhs, rhs = diff.rhs, index = diff.index, item = diff.item;
        switch (kind) {
          case "E":
            return [ path.join("."), lhs, "→", rhs ];

          case "N":
            return [ path.join("."), rhs ];

          case "D":
            return [ path.join(".") ];

          case "A":
            return [ path.join(".") + "[" + index + "]", item ];

          default:
            return [];
        }
    }
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), exports.default = function(prevState, newState, logger, isCollapsed) {
        var diff = (0, _deepDiff2.default)(prevState, newState);
        try {
            isCollapsed ? logger.groupCollapsed("diff") : logger.group("diff");
        } catch (e) {
            logger.log("diff");
        }
        diff ? diff.forEach(function(elem) {
            var kind = elem.kind, output = render(elem);
            logger.log.apply(logger, [ "%c " + dictionary[kind].text, style(kind) ].concat(_toConsumableArray(output)));
        }) : logger.log("—— no diff ——");
        try {
            logger.groupEnd();
        } catch (e) {
            logger.log("—— diff end —— ");
        }
    };
    var _deepDiff2 = function(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }(__webpack_require__(288)), dictionary = {
        E: {
            color: "#2196F3",
            text: "CHANGED:"
        },
        N: {
            color: "#4CAF50",
            text: "ADDED:"
        },
        D: {
            color: "#F44336",
            text: "DELETED:"
        },
        A: {
            color: "#2196F3",
            text: "ARRAY:"
        }
    };
    module.exports = exports.default;
}, function(module, exports, __webpack_require__) {
    (function(global) {
        var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;
        !function(root, factory) {
            "use strict";
            __WEBPACK_AMD_DEFINE_ARRAY__ = [], void 0 !== (__WEBPACK_AMD_DEFINE_RESULT__ = function() {
                return factory();
            }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__);
        }(0, function(undefined) {
            "use strict";
            function inherits(ctor, superCtor) {
                ctor.super_ = superCtor, ctor.prototype = Object.create(superCtor.prototype, {
                    constructor: {
                        value: ctor,
                        enumerable: !1,
                        writable: !0,
                        configurable: !0
                    }
                });
            }
            function Diff(kind, path) {
                Object.defineProperty(this, "kind", {
                    value: kind,
                    enumerable: !0
                }), path && path.length && Object.defineProperty(this, "path", {
                    value: path,
                    enumerable: !0
                });
            }
            function DiffEdit(path, origin, value) {
                DiffEdit.super_.call(this, "E", path), Object.defineProperty(this, "lhs", {
                    value: origin,
                    enumerable: !0
                }), Object.defineProperty(this, "rhs", {
                    value: value,
                    enumerable: !0
                });
            }
            function DiffNew(path, value) {
                DiffNew.super_.call(this, "N", path), Object.defineProperty(this, "rhs", {
                    value: value,
                    enumerable: !0
                });
            }
            function DiffDeleted(path, value) {
                DiffDeleted.super_.call(this, "D", path), Object.defineProperty(this, "lhs", {
                    value: value,
                    enumerable: !0
                });
            }
            function DiffArray(path, index, item) {
                DiffArray.super_.call(this, "A", path), Object.defineProperty(this, "index", {
                    value: index,
                    enumerable: !0
                }), Object.defineProperty(this, "item", {
                    value: item,
                    enumerable: !0
                });
            }
            function arrayRemove(arr, from, to) {
                var rest = arr.slice((to || from) + 1 || arr.length);
                return arr.length = from < 0 ? arr.length + from : from, arr.push.apply(arr, rest), 
                arr;
            }
            function realTypeOf(subject) {
                var type = typeof subject;
                return "object" !== type ? type : subject === Math ? "math" : null === subject ? "null" : Array.isArray(subject) ? "array" : "[object Date]" === Object.prototype.toString.call(subject) ? "date" : void 0 !== subject.toString && /^\/.*\//.test(subject.toString()) ? "regexp" : "object";
            }
            function deepDiff(lhs, rhs, changes, prefilter, path, key, stack) {
                var currentPath = (path = path || []).slice(0);
                if (void 0 !== key) {
                    if (prefilter) {
                        if ("function" == typeof prefilter && prefilter(currentPath, key)) return;
                        if ("object" == typeof prefilter) {
                            if (prefilter.prefilter && prefilter.prefilter(currentPath, key)) return;
                            if (prefilter.normalize) {
                                var alt = prefilter.normalize(currentPath, key, lhs, rhs);
                                alt && (lhs = alt[0], rhs = alt[1]);
                            }
                        }
                    }
                    currentPath.push(key);
                }
                "regexp" === realTypeOf(lhs) && "regexp" === realTypeOf(rhs) && (lhs = lhs.toString(), 
                rhs = rhs.toString());
                var ltype = typeof lhs, rtype = typeof rhs;
                if ("undefined" === ltype) "undefined" !== rtype && changes(new DiffNew(currentPath, rhs)); else if ("undefined" === rtype) changes(new DiffDeleted(currentPath, lhs)); else if (realTypeOf(lhs) !== realTypeOf(rhs)) changes(new DiffEdit(currentPath, lhs, rhs)); else if ("[object Date]" === Object.prototype.toString.call(lhs) && "[object Date]" === Object.prototype.toString.call(rhs) && lhs - rhs != 0) changes(new DiffEdit(currentPath, lhs, rhs)); else if ("object" === ltype && null !== lhs && null !== rhs) {
                    if ((stack = stack || []).indexOf(lhs) < 0) {
                        if (stack.push(lhs), Array.isArray(lhs)) {
                            var i;
                            lhs.length;
                            for (i = 0; i < lhs.length; i++) i >= rhs.length ? changes(new DiffArray(currentPath, i, new DiffDeleted(undefined, lhs[i]))) : deepDiff(lhs[i], rhs[i], changes, prefilter, currentPath, i, stack);
                            for (;i < rhs.length; ) changes(new DiffArray(currentPath, i, new DiffNew(undefined, rhs[i++])));
                        } else {
                            var akeys = Object.keys(lhs), pkeys = Object.keys(rhs);
                            akeys.forEach(function(k, i) {
                                var other = pkeys.indexOf(k);
                                other >= 0 ? (deepDiff(lhs[k], rhs[k], changes, prefilter, currentPath, k, stack), 
                                pkeys = arrayRemove(pkeys, other)) : deepDiff(lhs[k], undefined, changes, prefilter, currentPath, k, stack);
                            }), pkeys.forEach(function(k) {
                                deepDiff(undefined, rhs[k], changes, prefilter, currentPath, k, stack);
                            });
                        }
                        stack.length = stack.length - 1;
                    }
                } else lhs !== rhs && ("number" === ltype && isNaN(lhs) && isNaN(rhs) || changes(new DiffEdit(currentPath, lhs, rhs)));
            }
            function accumulateDiff(lhs, rhs, prefilter, accum) {
                return accum = accum || [], deepDiff(lhs, rhs, function(diff) {
                    diff && accum.push(diff);
                }, prefilter), accum.length ? accum : undefined;
            }
            function applyArrayChange(arr, index, change) {
                if (change.path && change.path.length) {
                    var i, it = arr[index], u = change.path.length - 1;
                    for (i = 0; i < u; i++) it = it[change.path[i]];
                    switch (change.kind) {
                      case "A":
                        applyArrayChange(it[change.path[i]], change.index, change.item);
                        break;

                      case "D":
                        delete it[change.path[i]];
                        break;

                      case "E":
                      case "N":
                        it[change.path[i]] = change.rhs;
                    }
                } else switch (change.kind) {
                  case "A":
                    applyArrayChange(arr[index], change.index, change.item);
                    break;

                  case "D":
                    arr = arrayRemove(arr, index);
                    break;

                  case "E":
                  case "N":
                    arr[index] = change.rhs;
                }
                return arr;
            }
            function applyChange(target, source, change) {
                if (target && source && change && change.kind) {
                    for (var it = target, i = -1, last = change.path ? change.path.length - 1 : 0; ++i < last; ) void 0 === it[change.path[i]] && (it[change.path[i]] = "number" == typeof change.path[i] ? [] : {}), 
                    it = it[change.path[i]];
                    switch (change.kind) {
                      case "A":
                        applyArrayChange(change.path ? it[change.path[i]] : it, change.index, change.item);
                        break;

                      case "D":
                        delete it[change.path[i]];
                        break;

                      case "E":
                      case "N":
                        it[change.path[i]] = change.rhs;
                    }
                }
            }
            function revertArrayChange(arr, index, change) {
                if (change.path && change.path.length) {
                    var i, it = arr[index], u = change.path.length - 1;
                    for (i = 0; i < u; i++) it = it[change.path[i]];
                    switch (change.kind) {
                      case "A":
                        revertArrayChange(it[change.path[i]], change.index, change.item);
                        break;

                      case "D":
                      case "E":
                        it[change.path[i]] = change.lhs;
                        break;

                      case "N":
                        delete it[change.path[i]];
                    }
                } else switch (change.kind) {
                  case "A":
                    revertArrayChange(arr[index], change.index, change.item);
                    break;

                  case "D":
                  case "E":
                    arr[index] = change.lhs;
                    break;

                  case "N":
                    arr = arrayRemove(arr, index);
                }
                return arr;
            }
            var $scope, conflict, conflictResolution = [];
            return $scope = "object" == typeof global && global ? global : "undefined" != typeof window ? window : {}, 
            (conflict = $scope.DeepDiff) && conflictResolution.push(function() {
                void 0 !== conflict && $scope.DeepDiff === accumulateDiff && ($scope.DeepDiff = conflict, 
                conflict = undefined);
            }), inherits(DiffEdit, Diff), inherits(DiffNew, Diff), inherits(DiffDeleted, Diff), 
            inherits(DiffArray, Diff), Object.defineProperties(accumulateDiff, {
                diff: {
                    value: accumulateDiff,
                    enumerable: !0
                },
                observableDiff: {
                    value: deepDiff,
                    enumerable: !0
                },
                applyDiff: {
                    value: function(target, source, filter) {
                        target && source && deepDiff(target, source, function(change) {
                            filter && !filter(target, source, change) || applyChange(target, source, change);
                        });
                    },
                    enumerable: !0
                },
                applyChange: {
                    value: applyChange,
                    enumerable: !0
                },
                revertChange: {
                    value: function(target, source, change) {
                        if (target && source && change && change.kind) {
                            var i, u, it = target;
                            for (u = change.path.length - 1, i = 0; i < u; i++) void 0 === it[change.path[i]] && (it[change.path[i]] = {}), 
                            it = it[change.path[i]];
                            switch (change.kind) {
                              case "A":
                                revertArrayChange(it[change.path[i]], change.index, change.item);
                                break;

                              case "D":
                              case "E":
                                it[change.path[i]] = change.lhs;
                                break;

                              case "N":
                                delete it[change.path[i]];
                            }
                        }
                    },
                    enumerable: !0
                },
                isConflict: {
                    value: function() {
                        return void 0 !== conflict;
                    },
                    enumerable: !0
                },
                noConflict: {
                    value: function() {
                        return conflictResolution && (conflictResolution.forEach(function(it) {
                            it();
                        }), conflictResolution = null), accumulateDiff;
                    },
                    enumerable: !0
                }
            }), accumulateDiff;
        });
    }).call(exports, __webpack_require__(36));
}, function(module, exports, __webpack_require__) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), exports.default = {
        level: "log",
        logger: console,
        logErrors: !0,
        collapsed: void 0,
        predicate: void 0,
        duration: !1,
        timestamp: !0,
        stateTransformer: function(state) {
            return state;
        },
        actionTransformer: function(action) {
            return action;
        },
        errorTransformer: function(error) {
            return error;
        },
        colors: {
            title: function() {
                return "inherit";
            },
            prevState: function() {
                return "#9E9E9E";
            },
            action: function() {
                return "#03A9F4";
            },
            nextState: function() {
                return "#4CAF50";
            },
            error: function() {
                return "#F20404";
            }
        },
        diff: !1,
        diffPredicate: void 0,
        transformer: void 0
    }, module.exports = exports.default;
}, function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    var __WEBPACK_IMPORTED_MODULE_0__Symbol_js__ = __webpack_require__(140), __WEBPACK_IMPORTED_MODULE_1__getRawTag_js__ = __webpack_require__(293), __WEBPACK_IMPORTED_MODULE_2__objectToString_js__ = __webpack_require__(294), nullTag = "[object Null]", undefinedTag = "[object Undefined]", symToStringTag = __WEBPACK_IMPORTED_MODULE_0__Symbol_js__.a ? __WEBPACK_IMPORTED_MODULE_0__Symbol_js__.a.toStringTag : void 0;
    __webpack_exports__.a = function(value) {
        return null == value ? void 0 === value ? undefinedTag : nullTag : symToStringTag && symToStringTag in Object(value) ? Object(__WEBPACK_IMPORTED_MODULE_1__getRawTag_js__.a)(value) : Object(__WEBPACK_IMPORTED_MODULE_2__objectToString_js__.a)(value);
    };
}, function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    var __WEBPACK_IMPORTED_MODULE_0__freeGlobal_js__ = __webpack_require__(292), freeSelf = "object" == typeof self && self && self.Object === Object && self, root = __WEBPACK_IMPORTED_MODULE_0__freeGlobal_js__.a || freeSelf || Function("return this")();
    __webpack_exports__.a = root;
}, function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    (function(global) {
        var freeGlobal = "object" == typeof global && global && global.Object === Object && global;
        __webpack_exports__.a = freeGlobal;
    }).call(__webpack_exports__, __webpack_require__(36));
}, function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    var __WEBPACK_IMPORTED_MODULE_0__Symbol_js__ = __webpack_require__(140), objectProto = Object.prototype, hasOwnProperty = objectProto.hasOwnProperty, nativeObjectToString = objectProto.toString, symToStringTag = __WEBPACK_IMPORTED_MODULE_0__Symbol_js__.a ? __WEBPACK_IMPORTED_MODULE_0__Symbol_js__.a.toStringTag : void 0;
    __webpack_exports__.a = function(value) {
        var isOwn = hasOwnProperty.call(value, symToStringTag), tag = value[symToStringTag];
        try {
            value[symToStringTag] = void 0;
            var unmasked = !0;
        } catch (e) {}
        var result = nativeObjectToString.call(value);
        return unmasked && (isOwn ? value[symToStringTag] = tag : delete value[symToStringTag]), 
        result;
    };
}, function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    var nativeObjectToString = Object.prototype.toString;
    __webpack_exports__.a = function(value) {
        return nativeObjectToString.call(value);
    };
}, function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    var __WEBPACK_IMPORTED_MODULE_0__overArg_js__ = __webpack_require__(296), getPrototype = Object(__WEBPACK_IMPORTED_MODULE_0__overArg_js__.a)(Object.getPrototypeOf, Object);
    __webpack_exports__.a = getPrototype;
}, function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    __webpack_exports__.a = function(func, transform) {
        return function(arg) {
            return func(transform(arg));
        };
    };
}, function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    __webpack_exports__.a = function(value) {
        return null != value && "object" == typeof value;
    };
}, function(module, exports, __webpack_require__) {
    module.exports = __webpack_require__(299);
}, function(module, exports, __webpack_require__) {
    "use strict";
    (function(global, module) {
        Object.defineProperty(exports, "__esModule", {
            value: !0
        });
        var root, _ponyfill2 = function(obj) {
            return obj && obj.__esModule ? obj : {
                default: obj
            };
        }(__webpack_require__(300));
        root = "undefined" != typeof self ? self : "undefined" != typeof window ? window : void 0 !== global ? global : module;
        var result = (0, _ponyfill2.default)(root);
        exports.default = result;
    }).call(exports, __webpack_require__(36), __webpack_require__(48)(module));
}, function(module, exports, __webpack_require__) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), exports.default = function(root) {
        var result, _Symbol = root.Symbol;
        return "function" == typeof _Symbol ? _Symbol.observable ? result = _Symbol.observable : (result = _Symbol("observable"), 
        _Symbol.observable = result) : result = "@@observable", result;
    };
}, function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    function getUndefinedStateErrorMessage(key, action) {
        var actionType = action && action.type;
        return "Given action " + (actionType && '"' + actionType.toString() + '"' || "an action") + ', reducer "' + key + '" returned undefined. To ignore an action, you must explicitly return the previous state. If you want this reducer to hold no value, you can return null instead of undefined.';
    }
    function assertReducerShape(reducers) {
        Object.keys(reducers).forEach(function(key) {
            var reducer = reducers[key];
            if (void 0 === reducer(void 0, {
                type: __WEBPACK_IMPORTED_MODULE_0__createStore__.a.INIT
            })) throw new Error('Reducer "' + key + "\" returned undefined during initialization. If the state passed to the reducer is undefined, you must explicitly return the initial state. The initial state may not be undefined. If you don't want to set a value for this reducer, you can use null instead of undefined.");
            if (void 0 === reducer(void 0, {
                type: "@@redux/PROBE_UNKNOWN_ACTION_" + Math.random().toString(36).substring(7).split("").join(".")
            })) throw new Error('Reducer "' + key + "\" returned undefined when probed with a random type. Don't try to handle " + __WEBPACK_IMPORTED_MODULE_0__createStore__.a.INIT + ' or other actions in "redux/*" namespace. They are considered private. Instead, you must return the current state for any unknown actions, unless it is undefined, in which case you must return the initial state, regardless of the action type. The initial state may not be undefined, but can be null.');
        });
    }
    __webpack_exports__.a = function(reducers) {
        for (var reducerKeys = Object.keys(reducers), finalReducers = {}, i = 0; i < reducerKeys.length; i++) {
            var key = reducerKeys[i];
            "function" == typeof reducers[key] && (finalReducers[key] = reducers[key]);
        }
        var finalReducerKeys = Object.keys(finalReducers), shapeAssertionError = void 0;
        try {
            assertReducerShape(finalReducers);
        } catch (e) {
            shapeAssertionError = e;
        }
        return function() {
            var state = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}, action = arguments[1];
            if (shapeAssertionError) throw shapeAssertionError;
            for (var hasChanged = !1, nextState = {}, _i = 0; _i < finalReducerKeys.length; _i++) {
                var _key = finalReducerKeys[_i], reducer = finalReducers[_key], previousStateForKey = state[_key], nextStateForKey = reducer(previousStateForKey, action);
                if (void 0 === nextStateForKey) {
                    var errorMessage = getUndefinedStateErrorMessage(_key, action);
                    throw new Error(errorMessage);
                }
                nextState[_key] = nextStateForKey, hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
            }
            return hasChanged ? nextState : state;
        };
    };
    var __WEBPACK_IMPORTED_MODULE_0__createStore__ = __webpack_require__(139);
    __webpack_require__(109), __webpack_require__(141);
}, function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    function bindActionCreator(actionCreator, dispatch) {
        return function() {
            return dispatch(actionCreator.apply(void 0, arguments));
        };
    }
    __webpack_exports__.a = function(actionCreators, dispatch) {
        if ("function" == typeof actionCreators) return bindActionCreator(actionCreators, dispatch);
        if ("object" != typeof actionCreators || null === actionCreators) throw new Error("bindActionCreators expected an object or a function, instead received " + (null === actionCreators ? "null" : typeof actionCreators) + '. Did you write "import ActionCreators from" instead of "import * as ActionCreators from"?');
        for (var keys = Object.keys(actionCreators), boundActionCreators = {}, i = 0; i < keys.length; i++) {
            var key = keys[i], actionCreator = actionCreators[key];
            "function" == typeof actionCreator && (boundActionCreators[key] = bindActionCreator(actionCreator, dispatch));
        }
        return boundActionCreators;
    };
}, function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    __webpack_exports__.a = function() {
        for (var _len = arguments.length, middlewares = Array(_len), _key = 0; _key < _len; _key++) middlewares[_key] = arguments[_key];
        return function(createStore) {
            return function(reducer, preloadedState, enhancer) {
                var store = createStore(reducer, preloadedState, enhancer), _dispatch = store.dispatch, chain = [], middlewareAPI = {
                    getState: store.getState,
                    dispatch: function(action) {
                        return _dispatch(action);
                    }
                };
                return chain = middlewares.map(function(middleware) {
                    return middleware(middlewareAPI);
                }), _dispatch = __WEBPACK_IMPORTED_MODULE_0__compose__.a.apply(void 0, chain)(store.dispatch), 
                _extends({}, store, {
                    dispatch: _dispatch
                });
            };
        };
    };
    var __WEBPACK_IMPORTED_MODULE_0__compose__ = __webpack_require__(142), _extends = Object.assign || function(target) {
        for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i];
            for (var key in source) Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
        }
        return target;
    };
}, function(module, exports, __webpack_require__) {
    "use strict";
    function configureStore(sagaMiddleware) {
        var reducer = redux_1.combineReducers({
            user: reducer_3.userReducer,
            tabs: reducer_4.tabsReducer,
            settings: reducer_2.settingsReducer,
            connection: reducer_1.connectionReducer
        }), logger = createLogger({
            level: "debug",
            colors: {
                title: function() {
                    return "green";
                }
            }
        });
        return redux_1.createStore(reducer, {}, redux_1.applyMiddleware(sagaMiddleware, logger));
    }
    var __generator = this && this.__generator || function(thisArg, body) {
        function verb(n) {
            return function(v) {
                return step([ n, v ]);
            };
        }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            for (;_; ) try {
                if (f = 1, y && (t = y[2 & op[0] ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
                switch (y = 0, t && (op = [ 0, t.value ]), op[0]) {
                  case 0:
                  case 1:
                    t = op;
                    break;

                  case 4:
                    return _.label++, {
                        value: op[1],
                        done: !1
                    };

                  case 5:
                    _.label++, y = op[1], op = [ 0 ];
                    continue;

                  case 7:
                    op = _.ops.pop(), _.trys.pop();
                    continue;

                  default:
                    if (t = _.trys, !(t = t.length > 0 && t[t.length - 1]) && (6 === op[0] || 2 === op[0])) {
                        _ = 0;
                        continue;
                    }
                    if (3 === op[0] && (!t || op[1] > t[0] && op[1] < t[3])) {
                        _.label = op[1];
                        break;
                    }
                    if (6 === op[0] && _.label < t[1]) {
                        _.label = t[1], t = op;
                        break;
                    }
                    if (t && _.label < t[2]) {
                        _.label = t[2], _.ops.push(op);
                        break;
                    }
                    t[2] && _.ops.pop(), _.trys.pop();
                    continue;
                }
                op = body.call(thisArg, _);
            } catch (e) {
                op = [ 6, e ], y = 0;
            } finally {
                f = t = 0;
            }
            if (5 & op[0]) throw op[1];
            return {
                value: op[0] ? op[1] : void 0,
                done: !0
            };
        }
        var f, y, t, g, _ = {
            label: 0,
            sent: function() {
                if (1 & t[0]) throw t[1];
                return t[1];
            },
            trys: [],
            ops: []
        };
        return g = {
            next: verb(0),
            throw: verb(1),
            return: verb(2)
        }, "function" == typeof Symbol && (g[Symbol.iterator] = function() {
            return this;
        }), g;
    }, __read = this && this.__read || function(o, n) {
        var m = "function" == typeof Symbol && o[Symbol.iterator];
        if (!m) return o;
        var r, e, i = m.call(o), ar = [];
        try {
            for (;(void 0 === n || n-- > 0) && !(r = i.next()).done; ) ar.push(r.value);
        } catch (error) {
            e = {
                error: error
            };
        } finally {
            try {
                r && !r.done && (m = i.return) && m.call(i);
            } finally {
                if (e) throw e.error;
            }
        }
        return ar;
    }, __spread = this && this.__spread || function() {
        for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
        return ar;
    };
    Object.defineProperty(exports, "__esModule", {
        value: !0
    });
    var createLogger = __webpack_require__(175), redux_1 = __webpack_require__(138), redux_saga_1 = __webpack_require__(143), reducer_1 = __webpack_require__(310), reducer_2 = __webpack_require__(311), reducer_3 = __webpack_require__(176), reducer_4 = __webpack_require__(312), config_1 = __webpack_require__(10), actions_1 = __webpack_require__(146), actions_2 = __webpack_require__(146);
    exports.pureActions = actions_2.pureActions;
    var effects_1 = __webpack_require__(96), AuthSagaRunners = function() {
        return function(_store, _userSagas) {
            var _this = this;
            this._store = _store, this._userSagas = _userSagas, this.refreshUser = function() {
                for (var args = [], _i = 0; _i < arguments.length; _i++) args[_i] = arguments[_i];
                return (_a = _this._store).runSaga.apply(_a, __spread([ _this._userSagas.externalUpdateUser.bind(_this._userSagas) ], args)).done;
                var _a;
            }, this.signin = function(data) {
                var _a = data.form, reqData = {
                    email_login: {
                        email: _a.email,
                        password: _a.password
                    }
                };
                return _this._store.runSaga(_this._userSagas.authRequest.bind(_this._userSagas), config_1.URLS.authSignin, reqData, data.placement, "signin").done;
            }, this.signup = function(data) {
                var _a = data.form, reqData = {
                    email_signup: {
                        name: _a.name,
                        email: _a.email,
                        password: _a.password
                    }
                };
                return _this._store.runSaga(_this._userSagas.authRequest.bind(_this._userSagas), config_1.URLS.authSignup, reqData, data.placement, "signup").done;
            };
        };
    }();
    exports.AuthSagaRunners = AuthSagaRunners;
    var TabsSagaRunner = function() {
        return function(_store, _tabsSagas) {
            var _this = this;
            this._store = _store, this._tabsSagas = _tabsSagas, this.sendStateToTabs = function() {
                return _this._store.runSaga(_this._tabsSagas.sendStateToTabs.bind(_this._tabsSagas));
            };
        };
    }();
    exports.TabsSagaRunner = TabsSagaRunner;
    var StoreControllerImpl = function() {
        function StoreControllerImpl(_userSagas, _settingsSagas, _tabsSagas, _connectionSagas, _pageConfig) {
            var _this = this;
            this._userSagas = _userSagas, this._settingsSagas = _settingsSagas, this._tabsSagas = _tabsSagas, 
            this._connectionSagas = _connectionSagas, this._pageConfig = _pageConfig;
            var sagaMiddleware = redux_saga_1.default(_userSagas.start.bind(_userSagas), _settingsSagas.start.bind(_settingsSagas), _connectionSagas.start.bind(_connectionSagas));
            this.store = configureStore(sagaMiddleware), this.runSaga = sagaMiddleware.run, 
            this.initStore = function() {
                return sagaMiddleware.run(_this._startupFlow.bind(_this)).done.then(function() {
                    _this.store.subscribe(function() {
                        return sagaMiddleware.run(_tabsSagas.sendStateToTabs.bind(_tabsSagas));
                    });
                });
            }, this.actions = redux_1.bindActionCreators(actions_1.pureActions, this.store.dispatch);
        }
        return StoreControllerImpl.prototype._startupFlow = function() {
            return __generator(this, function(_a) {
                switch (_a.label) {
                  case 0:
                    return [ 4, [ effects_1.call([ this._settingsSagas, this._settingsSagas.setInitialSettings ]), effects_1.call([ this._pageConfig, this._pageConfig.init ]), effects_1.call([ this._userSagas, this._userSagas.updateUser ], {
                        failoverFromCache: !0
                    }) ] ];

                  case 1:
                    return _a.sent(), [ 4, effects_1.fork([ this._connectionSagas, this._connectionSagas.monitorIsIncognito ]) ];

                  case 2:
                    return _a.sent(), [ 4, effects_1.call([ this._tabsSagas, this._tabsSagas.start ]) ];

                  case 3:
                    return _a.sent(), [ 2 ];
                }
            });
        }, StoreControllerImpl;
    }();
    exports.StoreControllerImpl = StoreControllerImpl;
}, function(module, exports, __webpack_require__) {
    "use strict";
    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), exports.NOT_ITERATOR_ERROR = void 0, exports.storeIO = function(store) {
        if ((0, _utils.warnDeprecated)("storeIO is deprecated, to run Saga dynamically, use 'run' method of the middleware"), 
        store[IO]) return store[IO];
        var storeEmitter = (0, _emitter2.default)(), _dispatch = store.dispatch;
        return store.dispatch = function(action) {
            var result = _dispatch(action);
            return storeEmitter.emit(action), result;
        }, store[IO] = {
            subscribe: storeEmitter.subscribe,
            dispatch: store.dispatch,
            getState: store.getState
        }, store[IO];
    }, exports.runSaga = function(iterator, _ref) {
        var subscribe = _ref.subscribe, dispatch = _ref.dispatch, getState = _ref.getState, monitor = arguments.length <= 2 || void 0 === arguments[2] ? _utils.noop : arguments[2];
        return (0, _utils.check)(iterator, _utils.is.iterator, NOT_ITERATOR_ERROR), (0, 
        _proc2.default)(iterator, subscribe, dispatch, getState, monitor);
    };
    var _utils = __webpack_require__(19), _proc2 = _interopRequireDefault(__webpack_require__(85)), _emitter2 = _interopRequireDefault(__webpack_require__(144)), NOT_ITERATOR_ERROR = exports.NOT_ITERATOR_ERROR = "runSaga must be called on an iterator", IO = (0, 
    _utils.sym)("IO");
}, function(module, exports, __webpack_require__) {
    "use strict";
    function fsmIterator(fsm, nextState) {
        function next(arg, error) {
            if (aborted) return done;
            if (error) {
                if (aborted = !0, !(error instanceof _SagaCancellationException2.default)) throw error;
                return done;
            }
            updateState && updateState(arg);
            var _fsm$nextState = _slicedToArray(fsm[nextState], 3), output = _fsm$nextState[0], transition = _fsm$nextState[1], _updateState = _fsm$nextState[2];
            return updateState = _updateState, nextState = resume(transition, arg), resume(output, arg);
        }
        var aborted = void 0, updateState = void 0, iterator = {
            name: arguments.length <= 2 || void 0 === arguments[2] ? "iterator" : arguments[2],
            next: next,
            throw: function(error) {
                return next(null, error);
            }
        };
        return "undefined" != typeof Symbol && (iterator[Symbol.iterator] = function() {
            return iterator;
        }), iterator;
    }
    Object.defineProperty(exports, "__esModule", {
        value: !0
    });
    var _slicedToArray = function() {
        function sliceIterator(arr, i) {
            var _arr = [], _n = !0, _d = !1, _e = void 0;
            try {
                for (var _s, _i = arr[Symbol.iterator](); !(_n = (_s = _i.next()).done) && (_arr.push(_s.value), 
                !i || _arr.length !== i); _n = !0) ;
            } catch (err) {
                _d = !0, _e = err;
            } finally {
                try {
                    !_n && _i.return && _i.return();
                } finally {
                    if (_d) throw _e;
                }
            }
            return _arr;
        }
        return function(arr, i) {
            if (Array.isArray(arr)) return arr;
            if (Symbol.iterator in Object(arr)) return sliceIterator(arr, i);
            throw new TypeError("Invalid attempt to destructure non-iterable instance");
        };
    }();
    exports.takeEvery = function(pattern, worker) {
        for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) args[_key - 2] = arguments[_key];
        return fsmIterator({
            take: [ {
                done: !1,
                value: (0, _io.take)(pattern)
            }, "fork" ],
            fork: [ function(action) {
                return {
                    done: !1,
                    value: _io.fork.apply(void 0, [ worker ].concat(args, [ action ]))
                };
            }, "take" ]
        }, "take", "takeEvery(" + pattern + ", " + worker.name + ")");
    }, exports.takeLatest = function(pattern, worker) {
        for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) args[_key2 - 2] = arguments[_key2];
        var currentTask = void 0, currentAction = void 0;
        return fsmIterator({
            take: [ {
                done: !1,
                value: (0, _io.take)(pattern)
            }, function() {
                return currentTask ? "cancel" : "fork";
            }, function(action) {
                return currentAction = action;
            } ],
            cancel: [ function() {
                return {
                    done: !1,
                    value: (0, _io.cancel)(currentTask)
                };
            }, "fork" ],
            fork: [ function() {
                return {
                    done: !1,
                    value: _io.fork.apply(void 0, [ worker ].concat(args, [ currentAction ]))
                };
            }, "take", function(task) {
                return currentTask = task;
            } ]
        }, "take", "takeLatest(" + pattern + ", " + worker.name + ")");
    };
    var _utils = __webpack_require__(19), _io = __webpack_require__(55), _SagaCancellationException2 = function(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }(__webpack_require__(56)), resume = function(fnOrValue, arg) {
        return _utils.is.func(fnOrValue) ? fnOrValue(arg) : fnOrValue;
    }, done = {
        done: !0
    };
}, function(module, exports, __webpack_require__) {
    "use strict";
    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), exports.GET_STATE_DEPRECATED_WARNING = exports.RUN_SAGA_DYNAMIC_ERROR = exports.sagaArgError = void 0, 
    exports.default = function() {
        function sagaMiddleware(_ref) {
            function runSaga(saga) {
                for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) args[_key2 - 1] = arguments[_key2];
                return (0, _proc2.default)(saga.apply(void 0, [ getStateDeprecated ].concat(args)), sagaEmitter.subscribe, dispatch, getState, monitor, 0, saga.name);
            }
            var getState = _ref.getState, dispatch = _ref.dispatch, sagaEmitter = (0, _emitter2.default)(), monitor = _utils.isDev ? function(action) {
                return (0, _utils.asap)(function() {
                    return dispatch(action);
                });
            } : void 0, getStateDeprecated = function() {
                return (0, _utils.warnDeprecated)(GET_STATE_DEPRECATED_WARNING), getState();
            };
            return runSagaDynamically = runSaga, sagas.forEach(runSaga), function(next) {
                return function(action) {
                    var result = next(action);
                    return action[_monitorActions.MONITOR_ACTION] || sagaEmitter.emit(action), result;
                };
            };
        }
        for (var _len = arguments.length, sagas = Array(_len), _key = 0; _key < _len; _key++) sagas[_key] = arguments[_key];
        var runSagaDynamically = void 0;
        return sagas.forEach(function(saga, idx) {
            return (0, _utils.check)(saga, _utils.is.func, sagaArgError("createSagaMiddleware", idx, saga));
        }), sagaMiddleware.run = function(saga) {
            for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) args[_key3 - 1] = arguments[_key3];
            if (!runSagaDynamically) throw new Error(RUN_SAGA_DYNAMIC_ERROR);
            (0, _utils.check)(saga, _utils.is.func, sagaArgError("sagaMiddleware.run", 0, saga));
            var task = runSagaDynamically.apply(void 0, [ saga ].concat(args));
            return task.done.catch(function(err) {
                if (!(err instanceof _SagaCancellationException2.default)) throw err;
            }), task;
        }, sagaMiddleware;
    };
    var _utils = __webpack_require__(19), _proc2 = _interopRequireDefault(__webpack_require__(85)), _emitter2 = _interopRequireDefault(__webpack_require__(144)), _monitorActions = __webpack_require__(86), _SagaCancellationException2 = _interopRequireDefault(__webpack_require__(56)), sagaArgError = exports.sagaArgError = function(fn, pos, saga) {
        return "\n  " + fn + " can only be called on Generator functions\n  Argument " + saga + " at position " + pos + " is not function!\n";
    }, RUN_SAGA_DYNAMIC_ERROR = exports.RUN_SAGA_DYNAMIC_ERROR = "Before running a Saga dynamically using middleware.run, you must mount the Saga middleware on the Store using applyMiddleware", GET_STATE_DEPRECATED_WARNING = exports.GET_STATE_DEPRECATED_WARNING = "\n  Using the 'getState' param of Sagas to access the state is deprecated since 0.9.1\n  To access the Store's state use 'yield select()' instead\n  For more infos see http://yelouafi.github.io/redux-saga/docs/api/index.html#selectselector-args\n";
}, function(module, exports, __webpack_require__) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), exports.monitorActions = exports.createMockTask = exports.MANUAL_CANCEL = exports.PARALLEL_AUTO_CANCEL = exports.RACE_AUTO_CANCEL = exports.CANCEL = exports.asap = exports.arrayOfDeffered = exports.deferred = exports.asEffect = exports.is = exports.noop = exports.TASK = void 0;
    var _utils = __webpack_require__(19), _io = __webpack_require__(55), _proc = __webpack_require__(85), _testUtils = __webpack_require__(309), monitorActions = function(obj) {
        if (obj && obj.__esModule) return obj;
        var newObj = {};
        if (null != obj) for (var key in obj) Object.prototype.hasOwnProperty.call(obj, key) && (newObj[key] = obj[key]);
        return newObj.default = obj, newObj;
    }(__webpack_require__(86));
    exports.TASK = _utils.TASK, exports.noop = _utils.noop, exports.is = _utils.is, 
    exports.asEffect = _io.asEffect, exports.deferred = _utils.deferred, exports.arrayOfDeffered = _utils.arrayOfDeffered, 
    exports.asap = _utils.asap, exports.CANCEL = _proc.CANCEL, exports.RACE_AUTO_CANCEL = _proc.RACE_AUTO_CANCEL, 
    exports.PARALLEL_AUTO_CANCEL = _proc.PARALLEL_AUTO_CANCEL, exports.MANUAL_CANCEL = _proc.MANUAL_CANCEL, 
    exports.createMockTask = _testUtils.createMockTask, exports.monitorActions = monitorActions;
}, function(module, exports, __webpack_require__) {
    "use strict";
    function _defineProperty(obj, key, value) {
        return key in obj ? Object.defineProperty(obj, key, {
            value: value,
            enumerable: !0,
            configurable: !0,
            writable: !0
        }) : obj[key] = value, obj;
    }
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), exports.createMockTask = function() {
        var _ref, running = !0, _result = void 0, _error = void 0;
        return _ref = {}, _defineProperty(_ref, _utils.TASK, !0), _defineProperty(_ref, "isRunning", function() {
            return running;
        }), _defineProperty(_ref, "result", function() {
            return _result;
        }), _defineProperty(_ref, "error", function() {
            return _error;
        }), _defineProperty(_ref, "setRunning", function(b) {
            return running = b;
        }), _defineProperty(_ref, "setResult", function(r) {
            return _result = r;
        }), _defineProperty(_ref, "setError", function(e) {
            return _error = e;
        }), _ref;
    };
    var _utils = __webpack_require__(19);
}, function(module, exports, __webpack_require__) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    });
    var actions_1 = __webpack_require__(95);
    exports.defaultConnection = {
        networkOffline: !window.navigator.onLine,
        cookiesDisabled: !1 === navigator.cookieEnabled,
        online: !0
    }, exports.connectionReducer = function(state, _a) {
        void 0 === state && (state = exports.defaultConnection);
        var type = _a.type, data = _a.data, online = _a.online;
        switch (type) {
          case actions_1.t.ONLINE_STATE:
            return Object.assign({}, state, {
                online: online
            });

          case actions_1.t.UPDATE_CONNECTION:
            return Object.assign({}, state, data);

          default:
            return state;
        }
    };
}, function(module, exports, __webpack_require__) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    });
    var Config = __webpack_require__(11), actions_1 = __webpack_require__(67), newsVersion = Config.getGlobal().appConfig.newsVersion;
    exports.settingsReducer = function(settings, _a) {
        void 0 === settings && (settings = {});
        var type = _a.type, _b = _a.data, data = void 0 === _b ? {} : _b, domain = _a.domain, enabledDefs = _a.enabledDefs, enabled = _a.enabled, showNews = _a.showNews, isPopupDisabled = _a.isPopupDisabled, activeEmailPerception = _a.activeEmailPerception, enabledEmailPerception = _a.enabledEmailPerception, seenEmailPerceptionPopupDate = _a.seenEmailPerceptionPopupDate, propKey = _a.propKey, domainSetting = settings[domain] || {};
        switch (type) {
          case actions_1.t.SETTINGS_INITIAL:
            return Object.assign({}, settings, data);

          case actions_1.t.TOGGLE_DEFS:
            return Object.assign({}, settings, {
                common: Object.assign({}, settings.common, {
                    enabledDefs: enabledDefs
                })
            });

          case actions_1.t.TOGGLE_SITE:
            return Object.assign({}, settings, (_c = {}, _c[domain] = Object.assign({}, domainSetting, {
                enabled: enabled,
                disabledDate: !0 === enabled ? null : Date.now()
            }), _c));

          case actions_1.t.TOGGLE_FIELD:
            return Object.assign({}, settings, (_d = {}, _d[domain] = Object.assign({}, settings[domain], {
                disabledFields: Object.assign({}, domainSetting.disabledFields, data)
            }), _d));

          case actions_1.t.ACTIVATE_EMAIL_PERCEPTION:
            return Object.assign({}, settings, {
                common: Object.assign({}, settings.common, {
                    activeEmailPerception: activeEmailPerception
                })
            });

          case actions_1.t.TOGGLE_EMAIL_PERCEPTION:
            return Object.assign({}, settings, {
                common: Object.assign({}, settings.common, {
                    enabledEmailPerception: enabledEmailPerception
                })
            });

          case actions_1.t.SHOW_NEWS:
            return Object.assign({}, settings, {
                common: Object.assign({}, settings.common, {
                    showNews: showNews
                })
            });

          case actions_1.t.SHOW_ONBOARDING:
            return Object.assign({}, settings, {
                common: Object.assign({}, settings.common, {
                    showOnboarding: !0
                })
            });

          case actions_1.t.SEEN_ONBOARDING:
            return Object.assign({}, settings, {
                common: Object.assign({}, settings.common, {
                    showOnboarding: !1
                })
            });

          case actions_1.t.SEEN_GDOCS_OPT_IN:
            return Object.assign({}, settings, {
                common: Object.assign({}, settings.common, {
                    seenGdocsOptIn: !0
                })
            });

          case actions_1.t.SET_GDOCS_INITIAL_DISABLE:
            return Object.assign({}, settings, {
                common: Object.assign({}, settings.common, {
                    gdocsWasInitiallyDisabled: !0
                })
            });

          case actions_1.t.SEEN_EMAIL_PERCEPTION_POPUP:
            return Object.assign({}, settings, {
                common: Object.assign({}, settings.common, {
                    seenEmailPerceptionPopupDate: seenEmailPerceptionPopupDate
                })
            });

          case actions_1.t.SEEN_NEWS:
            return Object.assign({}, settings, {
                common: Object.assign({}, settings.common, {
                    seenNewsVersion: newsVersion
                })
            });

          case actions_1.t.TOGGLE_POPUP:
            return Object.assign({}, settings, {
                common: Object.assign({}, settings.common, {
                    isPopupDisabled: isPopupDisabled
                })
            });

          case actions_1.t.SET_DAPI_PROP:
            return Object.assign({}, settings, {
                common: Object.assign({}, settings.common, (_e = {}, _e[propKey] = data, _e))
            });

          case actions_1.t.DISABLE_REMINDER_NOTIFICATION:
            return Object.assign({}, settings, (_f = {}, _f[domain] = Object.assign({}, domainSetting, {
                disableReminderNotification: !0
            }), _f));

          case actions_1.t.SHOW_DISABLE_REMINDER:
            return Object.assign({}, settings, (_g = {}, _g[domain] = Object.assign({}, domainSetting, {
                disabledDate: Date.now()
            }), _g));

          case actions_1.t.EDGE_POPUP_HACK_FROM_GBUTTON:
            return Object.assign({}, settings, {
                common: Object.assign({}, settings.common, {
                    showEdgePopupFromGButton: !0
                })
            });

          default:
            return settings;
        }
        var _c, _d, _e, _f, _g;
    };
}, function(module, exports, __webpack_require__) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    });
    var actions_1 = __webpack_require__(190);
    exports.tabsReducer = function(state, _a) {
        void 0 === state && (state = {});
        var type = _a.type, data = _a.data;
        switch (type) {
          case actions_1.t.SET_ACTIVE_TAB:
            return Object.assign({}, state, {
                active: data
            });

          default:
            return state;
        }
    };
}, , , , function(module, exports, __webpack_require__) {
    "use strict";
    function toObject(val) {
        if (null === val || void 0 === val) throw new TypeError("Object.assign cannot be called with null or undefined");
        return Object(val);
    }
    var getOwnPropertySymbols = Object.getOwnPropertySymbols, hasOwnProperty = Object.prototype.hasOwnProperty, propIsEnumerable = Object.prototype.propertyIsEnumerable;
    module.exports = function() {
        try {
            if (!Object.assign) return !1;
            var test1 = new String("abc");
            if (test1[5] = "de", "5" === Object.getOwnPropertyNames(test1)[0]) return !1;
            for (var test2 = {}, i = 0; i < 10; i++) test2["_" + String.fromCharCode(i)] = i;
            if ("0123456789" !== Object.getOwnPropertyNames(test2).map(function(n) {
                return test2[n];
            }).join("")) return !1;
            var test3 = {};
            return "abcdefghijklmnopqrst".split("").forEach(function(letter) {
                test3[letter] = letter;
            }), "abcdefghijklmnopqrst" === Object.keys(Object.assign({}, test3)).join("");
        } catch (err) {
            return !1;
        }
    }() ? Object.assign : function(target, source) {
        for (var from, symbols, to = toObject(target), s = 1; s < arguments.length; s++) {
            from = Object(arguments[s]);
            for (var key in from) hasOwnProperty.call(from, key) && (to[key] = from[key]);
            if (getOwnPropertySymbols) {
                symbols = getOwnPropertySymbols(from);
                for (var i = 0; i < symbols.length; i++) propIsEnumerable.call(from, symbols[i]) && (to[symbols[i]] = from[symbols[i]]);
            }
        }
        return to;
    };
}, function(module, exports, __webpack_require__) {
    "use strict";
    var emptyObject = {};
    module.exports = emptyObject;
}, function(module, exports, __webpack_require__) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    });
    var timeseries_impl_1 = __webpack_require__(194), log_1 = __webpack_require__(39), util_1 = __webpack_require__(2), DefaultFelogClient = function() {
        function DefaultFelogClient(_baseUrl, _appName, _appVersion, _env, _fetch) {
            this._baseUrl = _baseUrl, this._appName = _appName, this._appVersion = _appVersion, 
            this._env = _env, this._fetch = _fetch, this._context = {
                userId: void 0,
                containerId: void 0
            }, this._metrics = timeseries_impl_1.MetricsStorage.createRoot(this._env + "." + this._appName, this._baseUrl, this._fetch);
        }
        return DefaultFelogClient.prototype.setUserId = function(userId) {
            this._context = Object.assign({}, this._context, {
                userId: userId
            });
        }, DefaultFelogClient.prototype.setContainerId = function(containerId) {
            this._context = Object.assign({}, this._context, {
                containerId: containerId
            });
        }, DefaultFelogClient.prototype.getContext = function() {
            return this._context;
        }, DefaultFelogClient.prototype.sendEvent = function(e) {
            var payload = log_1.createEventPayload(e, {
                appName: this._appName,
                appVersion: this._appVersion,
                env: this._env,
                context: this.getContext()
            });
            return this._fetch(log_1.felogRequestUrl(payload, this._baseUrl), {
                mode: "no-cors",
                method: "get",
                cache: "no-cache"
            }).then(function(_) {}).catch(function(_) {});
        }, DefaultFelogClient.prototype.sendManyEvents = function(events) {
            var _this = this, payloadEvents = events.map(function(event) {
                return log_1.createEventPayload({
                    logger: event.logger,
                    message: event.message,
                    level: event.level,
                    extra: event.extra,
                    extra_performance: event.extra_performance
                }, {
                    appName: _this._appName,
                    appVersion: _this._appVersion,
                    env: _this._env,
                    context: _this.getContext()
                });
            });
            return this._fetch(this._baseUrl + "/log", {
                mode: "cors",
                headers: {
                    "Content-Type": "application/json"
                },
                method: "post",
                cache: "no-cache",
                body: JSON.stringify(payloadEvents)
            }).then(function(_) {}).catch(function(_) {});
        }, DefaultFelogClient.prototype.sendUsageEvent = function(logger, message, level, usageData) {
            var usage = {
                domain: usageData.domain,
                accountType: usageData.accountType,
                fieldType: usageData.fieldType,
                fieldSupported: usageData.fieldSupported
            };
            if (this._context.containerId || this._context.userId) {
                var str = (this._context.containerId || this._context.userId) + usageData.domain;
                usage.groupInfo = util_1.normalizedHashCode(str, 1e9);
            }
            var payload = log_1.createEventPayload({
                logger: logger,
                message: message,
                level: level,
                extra_usage: usageData
            }, {
                appName: this._appName,
                appVersion: this._appVersion,
                env: this._env
            });
            return this._fetch(log_1.felogUsageRequestUrl(payload, this._baseUrl), {
                mode: "no-cors",
                method: "get",
                cache: "no-cache"
            }).then(function(_) {}).catch(function(_) {});
        }, DefaultFelogClient.prototype.sendCounter = function(name, delta) {
            this._metrics.getCounter(name).increment(delta);
        }, DefaultFelogClient.prototype.sendTimer = function(name, time) {
            this._metrics.getTimer(name).recordTime(time);
        }, DefaultFelogClient;
    }();
    exports.DefaultFelogClient = DefaultFelogClient;
}, function(module, exports, __webpack_require__) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    });
    var log_1 = __webpack_require__(39), SumoLogicClient = function() {
        function SumoLogicClient(_baseUrl, _appName, _appVersion, _env, _fetch) {
            this._baseUrl = _baseUrl, this._appName = _appName, this._appVersion = _appVersion, 
            this._env = _env, this._fetch = _fetch, this._context = {
                userId: void 0,
                containerId: void 0
            };
        }
        return SumoLogicClient.prototype.setUserId = function(userId) {
            this._context = Object.assign({}, this._context, {
                userId: userId
            });
        }, SumoLogicClient.prototype.setContainerId = function(containerId) {
            this._context = Object.assign({}, this._context, {
                containerId: containerId
            });
        }, SumoLogicClient.prototype.getContext = function() {
            return this._context;
        }, SumoLogicClient.prototype.send = function(e) {
            var payload = log_1.createEventPayload(e, {
                appName: this._appName,
                appVersion: this._appVersion,
                env: this._env,
                context: this.getContext()
            });
            return this._fetch(this._baseUrl, {
                mode: "no-cors",
                method: "post",
                headers: {
                    "Content-Type": "application/json"
                },
                cache: "no-cache",
                body: JSON.stringify(payload)
            });
        }, SumoLogicClient;
    }();
    exports.SumoLogicClient = SumoLogicClient;
}, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , function(module, exports) {
    module.exports = {
        btnContainer: "_3OtCp",
        container: "_3fy5R",
        header: "Pm-Zw",
        bold: "E4GF8",
        button: "_2Fer5",
        large: "E0JDH",
        optIn: "_2wWfa",
        note: "_3ZIq2"
    };
}, , , , , , , , , , , , , , , , , , function(module, exports, __webpack_require__) {
    __webpack_require__(370);
}, function(module, exports) {}, function(module, exports, __webpack_require__) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    });
    var createLogger = __webpack_require__(175), redux_1 = __webpack_require__(138), message = __webpack_require__(16), store_1 = __webpack_require__(304), helpers_1 = __webpack_require__(372), util_1 = __webpack_require__(2), logger = createLogger({
        level: "debug",
        collapsed: function() {
            return !0;
        },
        predicate: function() {
            return !1;
        }
    }), SYNC = "store/SYNC", initialState = {
        page: {},
        connection: {}
    };
    exports.createMirrorStore = function(onUpdate, extraActions, reducer) {
        void 0 === extraActions && (extraActions = {});
        var store = redux_1.createStore(function(state, action) {
            void 0 === state && (state = initialState);
            var domain = (state.page || state.config || {}).domain;
            return action.sync && message.emitBackground("dispatch", Object.assign({}, action, {
                domain: domain
            })), action.type === SYNC ? Object.assign({}, state, action.data) : reducer ? reducer(state, action) : state;
        }, {}, redux_1.applyMiddleware(logger)), actions = helpers_1.bindActions(Object.assign({}, store_1.pureActions, extraActions), store.dispatch);
        return message.on("state", function(data) {
            util_1.asyncCall(function() {
                return store.dispatch({
                    type: SYNC,
                    data: data
                });
            }, 0);
        }), helpers_1.observeStore(store, onUpdate), {
            store: store,
            actions: actions
        };
    };
}, function(module, exports, __webpack_require__) {
    "use strict";
    var __read = this && this.__read || function(o, n) {
        var m = "function" == typeof Symbol && o[Symbol.iterator];
        if (!m) return o;
        var r, e, i = m.call(o), ar = [];
        try {
            for (;(void 0 === n || n-- > 0) && !(r = i.next()).done; ) ar.push(r.value);
        } catch (error) {
            e = {
                error: error
            };
        } finally {
            try {
                r && !r.done && (m = i.return) && m.call(i);
            } finally {
                if (e) throw e.error;
            }
        }
        return ar;
    }, __spread = this && this.__spread || function() {
        for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
        return ar;
    };
    Object.defineProperty(exports, "__esModule", {
        value: !0
    });
    var isEqual = __webpack_require__(163), isEmpty = __webpack_require__(373), util_1 = __webpack_require__(2);
    exports.observeStore = function(store, onChange) {
        function handleChange() {
            var nextState = store.getState();
            isEmpty(nextState) || isEqual(currentState, nextState) || (currentState = nextState, 
            onChange(nextState));
        }
        var currentState;
        return util_1.asyncCall(handleChange), store.subscribe(handleChange);
    }, exports.bindActions = function(pureActions, dispatch) {
        return Object.keys(pureActions).filter(function(action) {
            return pureActions[action];
        }).reduce(function(obj, action) {
            return Object.assign(obj, (_a = {}, _a[action] = function() {
                for (var args = [], _i = 0; _i < arguments.length; _i++) args[_i] = arguments[_i];
                var res = pureActions[action].apply(pureActions, __spread(args)), sync = void 0 === res.sync || res.sync;
                return dispatch(Object.assign({}, res, {
                    sync: sync
                }));
            }, _a));
            var _a;
        }, {});
    };
}, function(module, exports, __webpack_require__) {
    var baseKeys = __webpack_require__(155), getTag = __webpack_require__(103), isArguments = __webpack_require__(46), isArray = __webpack_require__(7), isArrayLike = __webpack_require__(26), isBuffer = __webpack_require__(33), isPrototype = __webpack_require__(57), isTypedArray = __webpack_require__(41), mapTag = "[object Map]", setTag = "[object Set]", hasOwnProperty = Object.prototype.hasOwnProperty;
    module.exports = function(value) {
        if (null == value) return !0;
        if (isArrayLike(value) && (isArray(value) || "string" == typeof value || "function" == typeof value.splice || isBuffer(value) || isTypedArray(value) || isArguments(value))) return !value.length;
        var tag = getTag(value);
        if (tag == mapTag || tag == setTag) return !value.size;
        if (isPrototype(value)) return !baseKeys(value).length;
        for (var key in value) if (hasOwnProperty.call(value, key)) return !1;
        return !0;
    };
}, , , , , , , , , , , , , , , , function(module, exports, __webpack_require__) {
    "use strict";
    function w(a) {
        for (var b = arguments.length - 1, c = "Minified React error #" + a + "; visit http://facebook.github.io/react/docs/error-decoder.html?invariant=" + a, d = 0; d < b; d++) c += "&args[]=" + encodeURIComponent(arguments[d + 1]);
        throw b = Error(c + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings."), 
        b.name = "Invariant Violation", b.framesToPop = 1, b;
    }
    function ja(a) {
        switch (a) {
          case "svg":
            return "http://www.w3.org/2000/svg";

          case "math":
            return "http://www.w3.org/1998/Math/MathML";

          default:
            return "http://www.w3.org/1999/xhtml";
        }
    }
    function pa() {
        if (la) for (var a in oa) {
            var b = oa[a], c = la.indexOf(a);
            if (-1 < c || w("96", a), !qa.plugins[c]) {
                b.extractEvents || w("97", a), qa.plugins[c] = b, c = b.eventTypes;
                for (var d in c) {
                    var e = void 0, f = c[d], g = b, h = d;
                    qa.eventNameDispatchConfigs.hasOwnProperty(h) && w("99", h), qa.eventNameDispatchConfigs[h] = f;
                    var k = f.phasedRegistrationNames;
                    if (k) {
                        for (e in k) k.hasOwnProperty(e) && ra(k[e], g, h);
                        e = !0;
                    } else f.registrationName ? (ra(f.registrationName, g, h), e = !0) : e = !1;
                    e || w("98", d, a);
                }
            }
        }
    }
    function ra(a, b, c) {
        qa.registrationNameModules[a] && w("100", a), qa.registrationNameModules[a] = b, 
        qa.registrationNameDependencies[a] = b.eventTypes[c].dependencies;
    }
    function ua(a, b) {
        return (a & b) === b;
    }
    function La(a) {
        for (var b; b = a._renderedComponent; ) a = b;
        return a;
    }
    function Ma(a, b) {
        (a = La(a))._hostNode = b, b[Ha] = a;
    }
    function Na(a, b) {
        if (!(a._flags & Fa.hasCachedChildNodes)) {
            var c = a._renderedChildren;
            b = b.firstChild;
            var d;
            a: for (d in c) if (c.hasOwnProperty(d)) {
                var e = c[d], f = La(e)._domID;
                if (0 !== f) {
                    for (;null !== b; b = b.nextSibling) {
                        var g = b, h = f;
                        if (g.nodeType === Aa && g.getAttribute(Ea) === "" + h || g.nodeType === Ba && g.nodeValue === " react-text: " + h + " " || g.nodeType === Ba && g.nodeValue === " react-empty: " + h + " ") {
                            Ma(e, b);
                            continue a;
                        }
                    }
                    w("32", f);
                }
            }
            a._flags |= Fa.hasCachedChildNodes;
        }
    }
    function Oa(a) {
        if (a[Ha]) return a[Ha];
        for (var b = []; !a[Ha]; ) {
            if (b.push(a), !a.parentNode) return null;
            a = a.parentNode;
        }
        var c = a[Ha];
        if (c.tag === ya || c.tag === za) return c;
        for (;a && (c = a[Ha]); a = b.pop()) {
            var d = c;
            b.length && Na(c, a);
        }
        return d;
    }
    function Ra(a) {
        if ("function" == typeof a.getName) return a.getName();
        if ("number" == typeof a.tag) {
            if ("string" == typeof (a = a.type)) return a;
            if ("function" == typeof a) return a.displayName || a.name;
        }
        return null;
    }
    function Za(a) {
        var b = a;
        if (a.alternate) for (;b.return; ) b = b.return; else {
            if ((b.effectTag & Xa) !== Wa) return 1;
            for (;b.return; ) if (((b = b.return).effectTag & Xa) !== Wa) return 1;
        }
        return b.tag === Ta ? 2 : 3;
    }
    function $a(a) {
        2 !== Za(a) && w("188");
    }
    function ab(a) {
        var b = a.alternate;
        if (!b) return 3 === (b = Za(a)) && w("188"), 1 === b ? null : a;
        for (var c = a, d = b; ;) {
            var e = c.return, f = e ? e.alternate : null;
            if (!e || !f) break;
            if (e.child === f.child) {
                for (var g = e.child; g; ) {
                    if (g === c) return $a(e), a;
                    if (g === d) return $a(e), b;
                    g = g.sibling;
                }
                w("188");
            }
            if (c.return !== d.return) c = e, d = f; else {
                g = !1;
                for (var h = e.child; h; ) {
                    if (h === c) {
                        g = !0, c = e, d = f;
                        break;
                    }
                    if (h === d) {
                        g = !0, d = e, c = f;
                        break;
                    }
                    h = h.sibling;
                }
                if (!g) {
                    for (h = f.child; h; ) {
                        if (h === c) {
                            g = !0, c = f, d = e;
                            break;
                        }
                        if (h === d) {
                            g = !0, d = f, c = e;
                            break;
                        }
                        h = h.sibling;
                    }
                    g || w("189");
                }
            }
            c.alternate !== d && w("190");
        }
        return c.tag !== Ta && w("188"), c.stateNode.current === c ? a : b;
    }
    function cb(a, b, c, d, e, f, g, h, k) {
        K._hasCaughtError = !1, K._caughtError = null;
        var p = Array.prototype.slice.call(arguments, 3);
        try {
            b.apply(c, p);
        } catch (x) {
            K._caughtError = x, K._hasCaughtError = !0;
        }
    }
    function db() {
        if (K._hasRethrowError) {
            var a = K._rethrowError;
            throw K._rethrowError = null, K._hasRethrowError = !1, a;
        }
    }
    function gb(a, b, c, d) {
        b = a.type || "unknown-event", a.currentTarget = hb.getNodeFromInstance(d), eb.invokeGuardedCallbackAndCatchFirstError(b, c, void 0, a), 
        a.currentTarget = null;
    }
    function mb(a) {
        if (a = ib.getInstanceFromNode(a)) if ("number" == typeof a.tag) {
            jb && "function" == typeof jb.restoreControlledState || w("194");
            var b = ib.getFiberCurrentPropsFromNode(a.stateNode);
            jb.restoreControlledState(a.stateNode, a.type, b);
        } else "function" != typeof a.restoreControlledState && w("195"), a.restoreControlledState();
    }
    function ob(a, b, c, d, e, f) {
        return a(b, c, d, e, f);
    }
    function pb(a, b) {
        return a(b);
    }
    function qb(a, b) {
        return pb(a, b);
    }
    function ub(a) {
        return (a = a.target || a.srcElement || window).correspondingUseElement && (a = a.correspondingUseElement), 
        a.nodeType === tb ? a.parentNode : a;
    }
    function xb(a) {
        var b = a.targetInst;
        do {
            if (!b) {
                a.ancestors.push(b);
                break;
            }
            var c = b;
            if ("number" == typeof c.tag) {
                for (;c.return; ) c = c.return;
                c = c.tag !== vb ? null : c.stateNode.containerInfo;
            } else {
                for (;c._hostParent; ) c = c._hostParent;
                c = G.getNodeFromInstance(c).parentNode;
            }
            if (!c) break;
            a.ancestors.push(b), b = G.getClosestInstanceFromNode(c);
        } while (b);
        for (c = 0; c < a.ancestors.length; c++) b = a.ancestors[c], yb._handleTopLevel(a.topLevelType, b, a.nativeEvent, ub(a.nativeEvent));
    }
    function Cb(a, b) {
        return null == b && w("30"), null == a ? b : Array.isArray(a) ? Array.isArray(b) ? (a.push.apply(a, b), 
        a) : (a.push(b), a) : Array.isArray(b) ? [ a ].concat(b) : [ a, b ];
    }
    function Db(a, b, c) {
        Array.isArray(a) ? a.forEach(b, c) : a && b.call(c, a);
    }
    function Fb(a, b) {
        a && (ib.executeDispatchesInOrder(a, b), a.isPersistent() || a.constructor.release(a));
    }
    function Gb(a) {
        return Fb(a, !0);
    }
    function Hb(a) {
        return Fb(a, !1);
    }
    function Ib(a, b, c) {
        switch (a) {
          case "onClick":
          case "onClickCapture":
          case "onDoubleClick":
          case "onDoubleClickCapture":
          case "onMouseDown":
          case "onMouseDownCapture":
          case "onMouseMove":
          case "onMouseMoveCapture":
          case "onMouseUp":
          case "onMouseUpCapture":
            return !(!c.disabled || "button" !== b && "input" !== b && "select" !== b && "textarea" !== b);

          default:
            return !1;
        }
    }
    function Lb(a, b) {
        if (!l.canUseDOM || b && !("addEventListener" in document)) return !1;
        var c = (b = "on" + a) in document;
        return c || ((c = document.createElement("div")).setAttribute(b, "return;"), c = "function" == typeof c[b]), 
        !c && Kb && "wheel" === a && (c = document.implementation.hasFeature("Events.wheel", "3.0")), 
        c;
    }
    function Mb(a, b) {
        var c = {};
        return c[a.toLowerCase()] = b.toLowerCase(), c["Webkit" + a] = "webkit" + b, c["Moz" + a] = "moz" + b, 
        c["ms" + a] = "MS" + b, c["O" + a] = "o" + b.toLowerCase(), c;
    }
    function Qb(a) {
        if (Ob[a]) return Ob[a];
        if (!Nb[a]) return a;
        var c, b = Nb[a];
        for (c in b) if (b.hasOwnProperty(c) && c in Pb) return Ob[a] = b[c];
        return "";
    }
    function Vb(a) {
        return Object.prototype.hasOwnProperty.call(a, Ub) || (a[Ub] = Tb++, Sb[a[Ub]] = {}), 
        Sb[a[Ub]];
    }
    function fc(a) {
        return !!ec.hasOwnProperty(a) || !dc.hasOwnProperty(a) && (cc.test(a) ? ec[a] = !0 : (dc[a] = !0, 
        !1));
    }
    function jc() {
        return null;
    }
    function rc(a) {
        var b = "";
        return aa.Children.forEach(a, function(a) {
            null == a || "string" != typeof a && "number" != typeof a || (b += a);
        }), b;
    }
    function tc(a, b, c) {
        if (a = a.options, b) {
            b = {};
            for (var d = 0; d < c.length; d++) b["$" + c[d]] = !0;
            for (c = 0; c < a.length; c++) d = b.hasOwnProperty("$" + a[c].value), a[c].selected !== d && (a[c].selected = d);
        } else {
            for (c = "" + c, b = null, d = 0; d < a.length; d++) {
                if (a[d].value === c) return void (a[d].selected = !0);
                null !== b || a[d].disabled || (b = a[d]);
            }
            null !== b && (b.selected = !0);
        }
    }
    function yc(a, b) {
        b && (xc[a] && (null != b.children || null != b.dangerouslySetInnerHTML) && w("137", a, ""), 
        null != b.dangerouslySetInnerHTML && (null != b.children && w("60"), "object" == typeof b.dangerouslySetInnerHTML && "__html" in b.dangerouslySetInnerHTML || w("61")), 
        null != b.style && "object" != typeof b.style && w("62", ""));
    }
    function zc(a) {
        var b = a.type;
        return (a = a.nodeName) && "input" === a.toLowerCase() && ("checkbox" === b || "radio" === b);
    }
    function Ac(a) {
        var b = zc(a) ? "checked" : "value", c = Object.getOwnPropertyDescriptor(a.constructor.prototype, b), d = "" + a[b];
        if (!a.hasOwnProperty(b) && "function" == typeof c.get && "function" == typeof c.set) return Object.defineProperty(a, b, {
            enumerable: c.enumerable,
            configurable: !0,
            get: function() {
                return c.get.call(this);
            },
            set: function(a) {
                d = "" + a, c.set.call(this, a);
            }
        }), {
            getValue: function() {
                return d;
            },
            setValue: function(a) {
                d = "" + a;
            },
            stopTracking: function() {
                a._valueTracker = null, delete a[b];
            }
        };
    }
    function Cc(a, b) {
        if (-1 === a.indexOf("-")) return "string" == typeof b.is;
        switch (a) {
          case "annotation-xml":
          case "color-profile":
          case "font-face":
          case "font-face-src":
          case "font-face-uri":
          case "font-face-format":
          case "font-face-name":
          case "missing-glyph":
            return !1;

          default:
            return !0;
        }
    }
    function Ic(a, b) {
        if (b) {
            var c = a.firstChild;
            if (c && c === a.lastChild && c.nodeType === Hc) return void (c.nodeValue = b);
        }
        a.textContent = b;
    }
    function Rc(a, b) {
        Nc(b, a.nodeType === Lc || a.nodeType === Mc ? a : a.ownerDocument);
    }
    function od(a, b) {
        return a !== id && a !== hd || b !== id && b !== hd ? a === gd && b !== gd ? -255 : a !== gd && b === gd ? 255 : a - b : 0;
    }
    function pd() {
        return {
            first: null,
            last: null,
            hasForceUpdate: !1,
            callbackList: null
        };
    }
    function qd(a, b, c, d) {
        null !== c ? c.next = b : (b.next = a.first, a.first = b), null !== d ? b.next = d : a.last = b;
    }
    function rd(a, b) {
        b = b.priorityLevel;
        var c = null;
        if (null !== a.last && 0 >= od(a.last.priorityLevel, b)) c = a.last; else for (a = a.first; null !== a && 0 >= od(a.priorityLevel, b); ) c = a, 
        a = a.next;
        return c;
    }
    function sd(a, b) {
        var c = a.alternate, d = a.updateQueue;
        null === d && (d = a.updateQueue = pd()), null !== c ? null === (a = c.updateQueue) && (a = c.updateQueue = pd()) : a = null;
        var e = md = d;
        c = nd = a !== d ? a : null;
        var f = rd(e, b), g = null !== f ? f.next : e.first;
        return null === c ? (qd(e, b, f, g), null) : (d = rd(c, b), a = null !== d ? d.next : c.first, 
        qd(e, b, f, g), g === a && null !== g || f === d && null !== f ? (null === d && (c.first = b), 
        null === a && (c.last = null), null) : (b = {
            priorityLevel: b.priorityLevel,
            partialState: b.partialState,
            callback: b.callback,
            isReplace: b.isReplace,
            isForced: b.isForced,
            isTopLevelUnmount: b.isTopLevelUnmount,
            next: null
        }, qd(c, b, d, a), b));
    }
    function td(a, b, c, d) {
        return "function" == typeof (a = a.partialState) ? a.call(b, c, d) : a;
    }
    function Md(a, b, c) {
        (a = a.stateNode).__reactInternalMemoizedUnmaskedChildContext = b, a.__reactInternalMemoizedMaskedChildContext = c;
    }
    function Nd(a) {
        return a.tag === zd && null != a.type.childContextTypes;
    }
    function Od(a, b) {
        var c = a.stateNode, d = a.type.childContextTypes;
        if ("function" != typeof c.getChildContext) return b;
        c = c.getChildContext();
        for (var e in c) e in d || w("108", Ra(a) || "Unknown", e);
        return n({}, b, c);
    }
    function be(a, b, c) {
        this.tag = a, this.key = b, this.stateNode = this.type = null, this.sibling = this.child = this.return = null, 
        this.index = 0, this.memoizedState = this.updateQueue = this.memoizedProps = this.pendingProps = this.ref = null, 
        this.internalContextTag = c, this.effectTag = ae, this.lastEffect = this.firstEffect = this.nextEffect = null, 
        this.pendingWorkPriority = Zd, this.alternate = null;
    }
    function ce(a, b, c) {
        var d = void 0;
        return "function" == typeof a ? (d = a.prototype && a.prototype.isReactComponent ? new be(Rd, b, c) : new be(Qd, b, c), 
        d.type = a) : "string" == typeof a ? (d = new be(Td, b, c), d.type = a) : "object" == typeof a && null !== a && "number" == typeof a.tag ? d = a : w("130", null == a ? a : typeof a, ""), 
        d;
    }
    function Le(a) {
        return null === a || void 0 === a ? null : "function" == typeof (a = Je && a[Je] || a["@@iterator"]) ? a : null;
    }
    function Me(a, b) {
        var c = b.ref;
        if (null !== c && "function" != typeof c) {
            if (b._owner) {
                var d = void 0;
                (b = b._owner) && ("number" == typeof b.tag ? (b.tag !== Ae && w("110"), d = b.stateNode) : d = b.getPublicInstance()), 
                d || w("147", c);
                var e = "" + c;
                return null !== a && null !== a.ref && a.ref._stringRef === e ? a.ref : (a = function(a) {
                    var b = d.refs === da ? d.refs = {} : d.refs;
                    null === a ? delete b[e] : b[e] = a;
                }, a._stringRef = e, a);
            }
            "string" != typeof c && w("148"), b._owner || w("149", c);
        }
        return c;
    }
    function Ne(a, b) {
        "textarea" !== a.type && w("31", "[object Object]" === Object.prototype.toString.call(b) ? "object with keys {" + Object.keys(b).join(", ") + "}" : b, "");
    }
    function Oe(a, b) {
        function c(c, d) {
            if (b) {
                if (!a) {
                    if (null === d.alternate) return;
                    d = d.alternate;
                }
                var m = c.lastEffect;
                null !== m ? (m.nextEffect = d, c.lastEffect = d) : c.firstEffect = c.lastEffect = d, 
                d.nextEffect = null, d.effectTag = Ie;
            }
        }
        function d(a, d) {
            if (!b) return null;
            for (;null !== d; ) c(a, d), d = d.sibling;
            return null;
        }
        function e(a, b) {
            for (a = new Map(); null !== b; ) null !== b.key ? a.set(b.key, b) : a.set(b.index, b), 
            b = b.sibling;
            return a;
        }
        function f(b, c) {
            return a ? (b = re(b, c), b.index = 0, b.sibling = null, b) : (b.pendingWorkPriority = c, 
            b.effectTag = Ge, b.index = 0, b.sibling = null, b);
        }
        function g(a, c, d) {
            return a.index = d, b ? null !== (d = a.alternate) ? (d = d.index) < c ? (a.effectTag = He, 
            c) : d : (a.effectTag = He, c) : c;
        }
        function h(a) {
            return b && null === a.alternate && (a.effectTag = He), a;
        }
        function k(a, b, c, d) {
            return null === b || b.tag !== Be ? (c = ue(c, a.internalContextTag, d), c.return = a, 
            c) : (b = f(b, d), b.pendingProps = c, b.return = a, b);
        }
        function p(a, b, c, d) {
            return null === b || b.type !== c.type ? (d = se(c, a.internalContextTag, d), d.ref = Me(b, c), 
            d.return = a, d) : (d = f(b, d), d.ref = Me(b, c), d.pendingProps = c.props, d.return = a, 
            d);
        }
        function x(a, b, c, d) {
            return null === b || b.tag !== De ? (c = ve(c, a.internalContextTag, d), c.return = a, 
            c) : (b = f(b, d), b.pendingProps = c, b.return = a, b);
        }
        function S(a, b, c, d) {
            return null === b || b.tag !== Ee ? (b = we(c, a.internalContextTag, d), b.type = c.value, 
            b.return = a, b) : (b = f(b, d), b.type = c.value, b.return = a, b);
        }
        function D(a, b, c, d) {
            return null === b || b.tag !== Ce || b.stateNode.containerInfo !== c.containerInfo || b.stateNode.implementation !== c.implementation ? (c = xe(c, a.internalContextTag, d), 
            c.return = a, c) : (b = f(b, d), b.pendingProps = c.children || [], b.return = a, 
            b);
        }
        function y(a, b, c, d) {
            return null === b || b.tag !== Fe ? (c = te(c, a.internalContextTag, d), c.return = a, 
            c) : (b = f(b, d), b.pendingProps = c, b.return = a, b);
        }
        function B(a, b, c) {
            if ("string" == typeof b || "number" == typeof b) return b = ue("" + b, a.internalContextTag, c), 
            b.return = a, b;
            if ("object" == typeof b && null !== b) {
                switch (b.$$typeof) {
                  case Ke:
                    return c = se(b, a.internalContextTag, c), c.ref = Me(null, b), c.return = a, c;

                  case oe:
                    return b = ve(b, a.internalContextTag, c), b.return = a, b;

                  case pe:
                    return c = we(b, a.internalContextTag, c), c.type = b.value, c.return = a, c;

                  case qe:
                    return b = xe(b, a.internalContextTag, c), b.return = a, b;
                }
                if (ye(b) || Le(b)) return b = te(b, a.internalContextTag, c), b.return = a, b;
                Ne(a, b);
            }
            return null;
        }
        function H(a, b, c, d) {
            var e = null !== b ? b.key : null;
            if ("string" == typeof c || "number" == typeof c) return null !== e ? null : k(a, b, "" + c, d);
            if ("object" == typeof c && null !== c) {
                switch (c.$$typeof) {
                  case Ke:
                    return c.key === e ? p(a, b, c, d) : null;

                  case oe:
                    return c.key === e ? x(a, b, c, d) : null;

                  case pe:
                    return null === e ? S(a, b, c, d) : null;

                  case qe:
                    return c.key === e ? D(a, b, c, d) : null;
                }
                if (ye(c) || Le(c)) return null !== e ? null : y(a, b, c, d);
                Ne(a, c);
            }
            return null;
        }
        function C(a, b, c, d, e) {
            if ("string" == typeof d || "number" == typeof d) return a = a.get(c) || null, k(b, a, "" + d, e);
            if ("object" == typeof d && null !== d) {
                switch (d.$$typeof) {
                  case Ke:
                    return a = a.get(null === d.key ? c : d.key) || null, p(b, a, d, e);

                  case oe:
                    return a = a.get(null === d.key ? c : d.key) || null, x(b, a, d, e);

                  case pe:
                    return a = a.get(c) || null, S(b, a, d, e);

                  case qe:
                    return a = a.get(null === d.key ? c : d.key) || null, D(b, a, d, e);
                }
                if (ye(d) || Le(d)) return a = a.get(c) || null, y(b, a, d, e);
                Ne(b, d);
            }
            return null;
        }
        function Ca(a, f, h, k) {
            for (var m = null, t = null, q = f, r = f = 0, p = null; null !== q && r < h.length; r++) {
                q.index > r ? (p = q, q = null) : p = q.sibling;
                var v = H(a, q, h[r], k);
                if (null === v) {
                    null === q && (q = p);
                    break;
                }
                b && q && null === v.alternate && c(a, q), f = g(v, f, r), null === t ? m = v : t.sibling = v, 
                t = v, q = p;
            }
            if (r === h.length) return d(a, q), m;
            if (null === q) {
                for (;r < h.length; r++) (q = B(a, h[r], k)) && (f = g(q, f, r), null === t ? m = q : t.sibling = q, 
                t = q);
                return m;
            }
            for (q = e(a, q); r < h.length; r++) (p = C(q, a, r, h[r], k)) && (b && null !== p.alternate && q.delete(null === p.key ? r : p.key), 
            f = g(p, f, r), null === t ? m = p : t.sibling = p, t = p);
            return b && q.forEach(function(b) {
                return c(a, b);
            }), m;
        }
        function r(a, f, h, r) {
            var m = Le(h);
            "function" != typeof m && w("150"), null == (h = m.call(h)) && w("151");
            for (var t = m = null, q = f, k = f = 0, p = null, v = h.next(); null !== q && !v.done; k++, 
            v = h.next()) {
                q.index > k ? (p = q, q = null) : p = q.sibling;
                var V = H(a, q, v.value, r);
                if (null === V) {
                    q || (q = p);
                    break;
                }
                b && q && null === V.alternate && c(a, q), f = g(V, f, k), null === t ? m = V : t.sibling = V, 
                t = V, q = p;
            }
            if (v.done) return d(a, q), m;
            if (null === q) {
                for (;!v.done; k++, v = h.next()) null !== (v = B(a, v.value, r)) && (f = g(v, f, k), 
                null === t ? m = v : t.sibling = v, t = v);
                return m;
            }
            for (q = e(a, q); !v.done; k++, v = h.next()) null !== (v = C(q, a, k, v.value, r)) && (b && null !== v.alternate && q.delete(null === v.key ? k : v.key), 
            f = g(v, f, k), null === t ? m = v : t.sibling = v, t = v);
            return b && q.forEach(function(b) {
                return c(a, b);
            }), m;
        }
        return function(a, b, e, g) {
            var m = "object" == typeof e && null !== e;
            if (m) switch (e.$$typeof) {
              case Ke:
                a: {
                    var C = e.key;
                    for (m = b; null !== m; ) {
                        if (m.key === C) {
                            if (m.type === e.type) {
                                d(a, m.sibling), (b = f(m, g)).ref = Me(m, e), b.pendingProps = e.props, b.return = a, 
                                a = b;
                                break a;
                            }
                            d(a, m);
                            break;
                        }
                        c(a, m), m = m.sibling;
                    }
                    (g = se(e, a.internalContextTag, g)).ref = Me(b, e), g.return = a, a = g;
                }
                return h(a);

              case oe:
                a: {
                    for (m = e.key; null !== b; ) {
                        if (b.key === m) {
                            if (b.tag === De) {
                                d(a, b.sibling), (b = f(b, g)).pendingProps = e, b.return = a, a = b;
                                break a;
                            }
                            d(a, b);
                            break;
                        }
                        c(a, b), b = b.sibling;
                    }
                    (e = ve(e, a.internalContextTag, g)).return = a, a = e;
                }
                return h(a);

              case pe:
                a: {
                    if (null !== b) {
                        if (b.tag === Ee) {
                            d(a, b.sibling), (b = f(b, g)).type = e.value, b.return = a, a = b;
                            break a;
                        }
                        d(a, b);
                    }
                    (b = we(e, a.internalContextTag, g)).type = e.value, b.return = a, a = b;
                }
                return h(a);

              case qe:
                a: {
                    for (m = e.key; null !== b; ) {
                        if (b.key === m) {
                            if (b.tag === Ce && b.stateNode.containerInfo === e.containerInfo && b.stateNode.implementation === e.implementation) {
                                d(a, b.sibling), (b = f(b, g)).pendingProps = e.children || [], b.return = a, a = b;
                                break a;
                            }
                            d(a, b);
                            break;
                        }
                        c(a, b), b = b.sibling;
                    }
                    (e = xe(e, a.internalContextTag, g)).return = a, a = e;
                }
                return h(a);
            }
            if ("string" == typeof e || "number" == typeof e) return e = "" + e, null !== b && b.tag === Be ? (d(a, b.sibling), 
            b = f(b, g), b.pendingProps = e, b.return = a, a = b) : (d(a, b), e = ue(e, a.internalContextTag, g), 
            e.return = a, a = e), h(a);
            if (ye(e)) return Ca(a, b, e, g);
            if (Le(e)) return r(a, b, e, g);
            if (m && Ne(a, e), void 0 === e) switch (a.tag) {
              case Ae:
              case ze:
                w("152", (e = a.type).displayName || e.name || "Component");
            }
            return d(a, b);
        };
    }
    function ef(a, b, c, d) {
        function e(a, b) {
            b.updater = f, a.stateNode = b, Pa.set(b, a);
        }
        var f = {
            isMounted: df,
            enqueueSetState: function(c, d, e) {
                c = Pa.get(c);
                var f = b(c, !1);
                Ze(c, d, void 0 === e ? null : e, f), a(c, f);
            },
            enqueueReplaceState: function(c, d, e) {
                c = Pa.get(c);
                var f = b(c, !1);
                $e(c, d, void 0 === e ? null : e, f), a(c, f);
            },
            enqueueForceUpdate: function(c, d) {
                c = Pa.get(c);
                var e = b(c, !1);
                af(c, void 0 === d ? null : d, e), a(c, e);
            }
        };
        return {
            adoptClassInstance: e,
            constructClassInstance: function(a, b) {
                var c = a.type, d = Xe(a), f = Ye(a), g = f ? We(a, d) : da;
                return b = new c(b, g), e(a, b), f && Ve(a, d, g), b;
            },
            mountClassInstance: function(a, b) {
                var c = a.alternate, d = a.stateNode, e = d.state || null, g = a.pendingProps;
                g || w("158");
                var h = Xe(a);
                d.props = g, d.state = e, d.refs = da, d.context = We(a, h), ed.enableAsyncSubtreeAPI && null != a.type && null != a.type.prototype && !0 === a.type.prototype.unstable_isAsyncReactComponent && (a.internalContextTag |= Ue), 
                "function" == typeof d.componentWillMount && (h = d.state, d.componentWillMount(), 
                h !== d.state && f.enqueueReplaceState(d, d.state, null), null !== (h = a.updateQueue) && (d.state = bf(c, a, h, d, e, g, b))), 
                "function" == typeof d.componentDidMount && (a.effectTag |= Te);
            },
            updateClassInstance: function(a, b, e) {
                var g = b.stateNode;
                g.props = b.memoizedProps, g.state = b.memoizedState;
                var h = b.memoizedProps, k = b.pendingProps;
                k || null == (k = h) && w("159");
                var D = g.context, y = Xe(b);
                if (y = We(b, y), "function" != typeof g.componentWillReceiveProps || h === k && D === y || (D = g.state, 
                g.componentWillReceiveProps(k, y), g.state !== D && f.enqueueReplaceState(g, g.state, null)), 
                D = b.memoizedState, e = null !== b.updateQueue ? bf(a, b, b.updateQueue, g, D, k, e) : D, 
                !(h !== k || D !== e || cf() || null !== b.updateQueue && b.updateQueue.hasForceUpdate)) return "function" != typeof g.componentDidUpdate || h === a.memoizedProps && D === a.memoizedState || (b.effectTag |= Te), 
                !1;
                var B = k;
                if (null === h || null !== b.updateQueue && b.updateQueue.hasForceUpdate) B = !0; else {
                    var H = b.stateNode, C = b.type;
                    B = "function" == typeof H.shouldComponentUpdate ? H.shouldComponentUpdate(B, e, y) : !C.prototype || !C.prototype.isPureReactComponent || (!ea(h, B) || !ea(D, e));
                }
                return B ? ("function" == typeof g.componentWillUpdate && g.componentWillUpdate(k, e, y), 
                "function" == typeof g.componentDidUpdate && (b.effectTag |= Te)) : ("function" != typeof g.componentDidUpdate || h === a.memoizedProps && D === a.memoizedState || (b.effectTag |= Te), 
                c(b, k), d(b, e)), g.props = k, g.state = e, g.context = y, B;
            }
        };
    }
    function Lf(a, b, c, d, e) {
        function f(a, b, c) {
            g(a, b, c, b.pendingWorkPriority);
        }
        function g(a, b, c, d) {
            b.child = null === a ? ff(b, b.child, c, d) : a.child === b.child ? gf(b, b.child, c, d) : hf(b, b.child, c, d);
        }
        function h(a, b) {
            var c = b.ref;
            null === c || a && a.ref === c || (b.effectTag |= Jf);
        }
        function k(a, b, c, d) {
            if (h(a, b), !c) return d && qf(b, !1), x(a, b);
            c = b.stateNode, Kf.current = b;
            var e = c.render();
            return b.effectTag |= Ff, f(a, b, e), b.memoizedState = c.state, b.memoizedProps = c.props, 
            d && qf(b, !0), b.child;
        }
        function p(a) {
            var b = a.stateNode;
            b.pendingContext ? pf(a, b.pendingContext, b.pendingContext !== b.context) : b.context && pf(a, b.context, !1), 
            C(a, b.containerInfo);
        }
        function x(a, b) {
            return jf(a, b), b.child;
        }
        function S(a, b) {
            switch (b.tag) {
              case uf:
                p(b);
                break;

              case tf:
                of(b);
                break;

              case yf:
                C(b, b.stateNode.containerInfo);
            }
            return null;
        }
        var D = a.shouldSetTextContent, y = a.useSyncScheduling, B = a.shouldDeprioritizeSubtree, H = b.pushHostContext, C = b.pushHostContainer, Ca = c.enterHydrationState, r = c.resetHydrationState, m = c.tryToClaimNextHydratableInstance, t = (a = ef(d, e, function(a, b) {
            a.memoizedProps = b;
        }, function(a, b) {
            a.memoizedState = b;
        })).adoptClassInstance, v = a.constructClassInstance, V = a.mountClassInstance, ld = a.updateClassInstance;
        return {
            beginWork: function(a, b, c) {
                if (b.pendingWorkPriority === Df || b.pendingWorkPriority > c) return S(0, b);
                switch (b.tag) {
                  case rf:
                    null !== a && w("155");
                    var d = b.type, e = b.pendingProps, g = mf(b);
                    return g = lf(b, g), d = d(e, g), b.effectTag |= Ff, "object" == typeof d && null !== d && "function" == typeof d.render ? (b.tag = tf, 
                    e = of(b), t(b, d), V(b, c), b = k(a, b, !0, e)) : (b.tag = sf, f(a, b, d), b.memoizedProps = e, 
                    b = b.child), b;

                  case sf:
                    a: {
                        if (e = b.type, c = b.pendingProps, d = b.memoizedProps, nf()) null === c && (c = d); else if (null === c || d === c) {
                            b = x(a, b);
                            break a;
                        }
                        d = mf(b), e = e(c, d = lf(b, d)), b.effectTag |= Ff, f(a, b, e), b.memoizedProps = c, 
                        b = b.child;
                    }
                    return b;

                  case tf:
                    return e = of(b), d = void 0, null === a ? b.stateNode ? w("153") : (v(b, b.pendingProps), 
                    V(b, c), d = !0) : d = ld(a, b, c), k(a, b, d, e);

                  case uf:
                    return p(b), null !== (d = b.updateQueue) ? (e = b.memoizedState, d = kf(a, b, d, null, e, null, c), 
                    e === d ? (r(), b = x(a, b)) : (e = d.element, null !== a && null !== a.child || !Ca(b) ? (r(), 
                    f(a, b, e)) : (b.effectTag |= Gf, b.child = ff(b, b.child, e, c)), b.memoizedState = d, 
                    b = b.child)) : (r(), b = x(a, b)), b;

                  case wf:
                    H(b), null === a && m(b), e = b.type;
                    var q = b.memoizedProps;
                    return null === (d = b.pendingProps) && null === (d = q) && w("154"), g = null !== a ? a.memoizedProps : null, 
                    nf() || null !== d && q !== d ? (q = d.children, D(e, d) ? q = null : g && D(e, g) && (b.effectTag |= Hf), 
                    h(a, b), c !== Ef && !y && B(e, d) ? (b.pendingWorkPriority = Ef, b = null) : (f(a, b, q), 
                    b.memoizedProps = d, b = b.child)) : b = x(a, b), b;

                  case xf:
                    return null === a && m(b), null === (a = b.pendingProps) && (a = b.memoizedProps), 
                    b.memoizedProps = a, null;

                  case Af:
                    b.tag = zf;

                  case zf:
                    return c = b.pendingProps, nf() ? null === c && null === (c = a && a.memoizedProps) && w("154") : null !== c && b.memoizedProps !== c || (c = b.memoizedProps), 
                    e = c.children, d = b.pendingWorkPriority, b.stateNode = null === a ? ff(b, b.stateNode, e, d) : a.child === b.child ? gf(b, b.stateNode, e, d) : hf(b, b.stateNode, e, d), 
                    b.memoizedProps = c, b.stateNode;

                  case Bf:
                    return null;

                  case yf:
                    a: {
                        if (C(b, b.stateNode.containerInfo), c = b.pendingWorkPriority, e = b.pendingProps, 
                        nf()) null === e && null == (e = a && a.memoizedProps) && w("154"); else if (null === e || b.memoizedProps === e) {
                            b = x(a, b);
                            break a;
                        }
                        null === a ? b.child = hf(b, b.child, e, c) : f(a, b, e), b.memoizedProps = e, b = b.child;
                    }
                    return b;

                  case Cf:
                    a: {
                        if (c = b.pendingProps, nf()) null === c && (c = b.memoizedProps); else if (null === c || b.memoizedProps === c) {
                            b = x(a, b);
                            break a;
                        }
                        f(a, b, c), b.memoizedProps = c, b = b.child;
                    }
                    return b;

                  default:
                    w("156");
                }
            },
            beginFailedWork: function(a, b, c) {
                switch (b.tag) {
                  case tf:
                    of(b);
                    break;

                  case uf:
                    p(b);
                    break;

                  default:
                    w("157");
                }
                return b.effectTag |= If, null === a ? b.child = null : b.child !== a.child && (b.child = a.child), 
                b.pendingWorkPriority === Df || b.pendingWorkPriority > c ? S(0, b) : (b.firstEffect = null, 
                b.lastEffect = null, g(a, b, null, c), b.tag === tf && (a = b.stateNode, b.memoizedProps = a.props, 
                b.memoizedState = a.state), b.child);
            }
        };
    }
    function eg(a, b, c) {
        var d = a.createInstance, e = a.createTextInstance, f = a.appendInitialChild, g = a.finalizeInitialChildren, h = a.prepareUpdate, k = b.getRootHostContainer, p = b.popHostContext, x = b.getHostContext, S = b.popHostContainer, D = c.prepareToHydrateHostInstance, y = c.prepareToHydrateHostTextInstance, B = c.popHydrationState;
        return {
            completeWork: function(a, b, c) {
                var r = b.pendingProps;
                switch (null === r ? r = b.memoizedProps : b.pendingWorkPriority === dg && c !== dg || (b.pendingProps = null), 
                b.tag) {
                  case Qf:
                    return null;

                  case Rf:
                    return Nf(b), null;

                  case Sf:
                    return S(b), Of(b), (r = b.stateNode).pendingContext && (r.context = r.pendingContext, 
                    r.pendingContext = null), null !== a && null !== a.child || (B(b), b.effectTag &= ~ag), 
                    null;

                  case Tf:
                    p(b), c = k();
                    var m = b.type;
                    if (null !== a && null != b.stateNode) {
                        var t = a.memoizedProps, C = b.stateNode, V = x();
                        r = h(C, m, t, r, c, V), (b.updateQueue = r) && (b.effectTag |= cg), a.ref !== b.ref && (b.effectTag |= bg);
                    } else {
                        if (!r) return null === b.stateNode && w("166"), null;
                        if (a = x(), B(b)) D(b, c, a) && (b.effectTag |= cg); else {
                            a = d(m, r, c, a, b);
                            a: for (t = b.child; null !== t; ) {
                                if (t.tag === Tf || t.tag === Uf) f(a, t.stateNode); else if (t.tag !== Vf && null !== t.child) {
                                    t = t.child;
                                    continue;
                                }
                                if (t === b) break a;
                                for (;null === t.sibling; ) {
                                    if (null === t.return || t.return === b) break a;
                                    t = t.return;
                                }
                                t = t.sibling;
                            }
                            g(a, m, r, c) && (b.effectTag |= cg), b.stateNode = a;
                        }
                        null !== b.ref && (b.effectTag |= bg);
                    }
                    return null;

                  case Uf:
                    if (a && null != b.stateNode) a.memoizedProps !== r && (b.effectTag |= cg); else {
                        if ("string" != typeof r) return null === b.stateNode && w("166"), null;
                        a = k(), c = x(), B(b) ? y(b) && (b.effectTag |= cg) : b.stateNode = e(r, a, c, b);
                    }
                    return null;

                  case Wf:
                    (r = b.memoizedProps) || w("165"), b.tag = Xf, c = [];
                    a: for ((m = b.stateNode) && (m.return = b); null !== m; ) {
                        if (m.tag === Tf || m.tag === Uf || m.tag === Vf) w("164"); else if (m.tag === Yf) c.push(m.type); else if (null !== m.child) {
                            m.child.return = m, m = m.child;
                            continue;
                        }
                        for (;null === m.sibling; ) {
                            if (null === m.return || m.return === b) break a;
                            m = m.return;
                        }
                        m.sibling.return = m.return, m = m.sibling;
                    }
                    return m = r.handler, r = m(r.props, c), b.child = Mf(b, null !== a ? a.child : null, r, b.pendingWorkPriority), 
                    b.child;

                  case Xf:
                    return b.tag = Wf, null;

                  case Yf:
                  case Zf:
                    return null;

                  case Vf:
                    return b.effectTag |= cg, S(b), null;

                  case Pf:
                    w("167");

                  default:
                    w("156");
                }
            }
        };
    }
    function hg(a) {
        return function(b) {
            try {
                return a(b);
            } catch (c) {}
        };
    }
    function vg(a, b) {
        function c(a) {
            var c = a.ref;
            if (null !== c) try {
                c(null);
            } catch (t) {
                b(a, t);
            }
        }
        function d(a) {
            return a.tag === lg || a.tag === kg || a.tag === ng;
        }
        function e(a) {
            for (var b = a; ;) if (g(b), null !== b.child && b.tag !== ng) b.child.return = b, 
            b = b.child; else {
                if (b === a) break;
                for (;null === b.sibling; ) {
                    if (null === b.return || b.return === a) return;
                    b = b.return;
                }
                b.sibling.return = b.return, b = b.sibling;
            }
        }
        function f(a) {
            for (var b = a, c = !1, d = void 0, f = void 0; ;) {
                if (!c) {
                    c = b.return;
                    a: for (;;) {
                        switch (null === c && w("160"), c.tag) {
                          case lg:
                            d = c.stateNode, f = !1;
                            break a;

                          case kg:
                          case ng:
                            d = c.stateNode.containerInfo, f = !0;
                            break a;
                        }
                        c = c.return;
                    }
                    c = !0;
                }
                if (b.tag === lg || b.tag === mg) e(b), f ? C(d, b.stateNode) : H(d, b.stateNode); else if (b.tag === ng ? d = b.stateNode.containerInfo : g(b), 
                null !== b.child) {
                    b.child.return = b, b = b.child;
                    continue;
                }
                if (b === a) break;
                for (;null === b.sibling; ) {
                    if (null === b.return || b.return === a) return;
                    (b = b.return).tag === ng && (c = !1);
                }
                b.sibling.return = b.return, b = b.sibling;
            }
        }
        function g(a) {
            switch ("function" == typeof qg && qg(a), a.tag) {
              case jg:
                c(a);
                var d = a.stateNode;
                if ("function" == typeof d.componentWillUnmount) try {
                    d.props = a.memoizedProps, d.state = a.memoizedState, d.componentWillUnmount();
                } catch (t) {
                    b(a, t);
                }
                break;

              case lg:
                c(a);
                break;

              case og:
                e(a.stateNode);
                break;

              case ng:
                f(a);
            }
        }
        var h = a.commitMount, k = a.commitUpdate, p = a.resetTextContent, x = a.commitTextUpdate, S = a.appendChild, D = a.appendChildToContainer, y = a.insertBefore, B = a.insertInContainerBefore, H = a.removeChild, C = a.removeChildFromContainer, Ca = a.getPublicInstance;
        return {
            commitPlacement: function(a) {
                a: {
                    for (var b = a.return; null !== b; ) {
                        if (d(b)) {
                            var c = b;
                            break a;
                        }
                        b = b.return;
                    }
                    w("160"), c = void 0;
                }
                var e = b = void 0;
                switch (c.tag) {
                  case lg:
                    b = c.stateNode, e = !1;
                    break;

                  case kg:
                  case ng:
                    b = c.stateNode.containerInfo, e = !0;
                    break;

                  default:
                    w("161");
                }
                c.effectTag & ug && (p(b), c.effectTag &= ~ug);
                a: b: for (c = a; ;) {
                    for (;null === c.sibling; ) {
                        if (null === c.return || d(c.return)) {
                            c = null;
                            break a;
                        }
                        c = c.return;
                    }
                    for (c.sibling.return = c.return, c = c.sibling; c.tag !== lg && c.tag !== mg; ) {
                        if (c.effectTag & rg) continue b;
                        if (null === c.child || c.tag === ng) continue b;
                        c.child.return = c, c = c.child;
                    }
                    if (!(c.effectTag & rg)) {
                        c = c.stateNode;
                        break a;
                    }
                }
                for (var f = a; ;) {
                    if (f.tag === lg || f.tag === mg) c ? e ? B(b, f.stateNode, c) : y(b, f.stateNode, c) : e ? D(b, f.stateNode) : S(b, f.stateNode); else if (f.tag !== ng && null !== f.child) {
                        f.child.return = f, f = f.child;
                        continue;
                    }
                    if (f === a) break;
                    for (;null === f.sibling; ) {
                        if (null === f.return || f.return === a) return;
                        f = f.return;
                    }
                    f.sibling.return = f.return, f = f.sibling;
                }
            },
            commitDeletion: function(a) {
                f(a), a.return = null, a.child = null, a.alternate && (a.alternate.child = null, 
                a.alternate.return = null);
            },
            commitWork: function(a, b) {
                switch (b.tag) {
                  case jg:
                    break;

                  case lg:
                    var c = b.stateNode;
                    if (null != c) {
                        var d = b.memoizedProps;
                        a = null !== a ? a.memoizedProps : d;
                        var e = b.type, f = b.updateQueue;
                        b.updateQueue = null, null !== f && k(c, f, e, a, d, b);
                    }
                    break;

                  case mg:
                    null === b.stateNode && w("162"), c = b.memoizedProps, x(b.stateNode, null !== a ? a.memoizedProps : c, c);
                    break;

                  case kg:
                  case ng:
                    break;

                  default:
                    w("163");
                }
            },
            commitLifeCycles: function(a, b) {
                switch (b.tag) {
                  case jg:
                    var c = b.stateNode;
                    if (b.effectTag & sg) if (null === a) c.props = b.memoizedProps, c.state = b.memoizedState, 
                    c.componentDidMount(); else {
                        var d = a.memoizedProps;
                        a = a.memoizedState, c.props = b.memoizedProps, c.state = b.memoizedState, c.componentDidUpdate(d, a);
                    }
                    b.effectTag & tg && null !== b.updateQueue && pg(b, b.updateQueue, c);
                    break;

                  case kg:
                    null !== (a = b.updateQueue) && pg(b, a, b.child && b.child.stateNode);
                    break;

                  case lg:
                    c = b.stateNode, null === a && b.effectTag & sg && h(c, b.type, b.memoizedProps, b);
                    break;

                  case mg:
                  case ng:
                    break;

                  default:
                    w("163");
                }
            },
            commitAttachRef: function(a) {
                var b = a.ref;
                if (null !== b) {
                    var c = a.stateNode;
                    switch (a.tag) {
                      case lg:
                        b(Ca(c));
                        break;

                      default:
                        b(c);
                    }
                }
            },
            commitDetachRef: function(a) {
                null !== (a = a.ref) && a(null);
            }
        };
    }
    function Ag(a) {
        function b(a) {
            return a === zg && w("174"), a;
        }
        var c = a.getChildHostContext, d = a.getRootHostContext, e = wg(zg), f = wg(zg), g = wg(zg);
        return {
            getHostContext: function() {
                return b(e.current);
            },
            getRootHostContainer: function() {
                return b(g.current);
            },
            popHostContainer: function(a) {
                xg(e, a), xg(f, a), xg(g, a);
            },
            popHostContext: function(a) {
                f.current === a && (xg(e, a), xg(f, a));
            },
            pushHostContainer: function(a, b) {
                yg(g, b, a), b = d(b), yg(f, a, a), yg(e, b, a);
            },
            pushHostContext: function(a) {
                var d = b(g.current), h = b(e.current);
                h !== (d = c(h, a.type, d)) && (yg(f, a, a), yg(e, d, a));
            },
            resetHostContainer: function() {
                e.current = zg, g.current = zg;
            }
        };
    }
    function Hg(a) {
        function b(a, b) {
            var c = Gg();
            c.stateNode = b, c.return = a, c.effectTag = Eg, null !== a.lastEffect ? (a.lastEffect.nextEffect = c, 
            a.lastEffect = c) : a.firstEffect = a.lastEffect = c;
        }
        function c(a, b) {
            switch (a.tag) {
              case Bg:
                return f(b, a.type, a.pendingProps);

              case Cg:
                return g(b, a.pendingProps);

              default:
                return !1;
            }
        }
        function d(a) {
            for (a = a.return; null !== a && a.tag !== Bg && a.tag !== Dg; ) a = a.return;
            y = a;
        }
        var e = a.shouldSetTextContent, f = a.canHydrateInstance, g = a.canHydrateTextInstance, h = a.getNextHydratableSibling, k = a.getFirstHydratableChild, p = a.hydrateInstance, x = a.hydrateTextInstance, S = a.didNotHydrateInstance, D = a.didNotFindHydratableInstance;
        if (a = a.didNotFindHydratableTextInstance, !(f && g && h && k && p && x && S && D && a)) return {
            enterHydrationState: function() {
                return !1;
            },
            resetHydrationState: function() {},
            tryToClaimNextHydratableInstance: function() {},
            prepareToHydrateHostInstance: function() {
                w("175");
            },
            prepareToHydrateHostTextInstance: function() {
                w("176");
            },
            popHydrationState: function() {
                return !1;
            }
        };
        var y = null, B = null, H = !1;
        return {
            enterHydrationState: function(a) {
                return B = k(a.stateNode.containerInfo), y = a, H = !0;
            },
            resetHydrationState: function() {
                B = y = null, H = !1;
            },
            tryToClaimNextHydratableInstance: function(a) {
                if (H) {
                    var d = B;
                    if (d) {
                        if (!c(a, d)) {
                            if (!(d = h(d)) || !c(a, d)) return a.effectTag |= Fg, H = !1, void (y = a);
                            b(y, B);
                        }
                        a.stateNode = d, y = a, B = k(d);
                    } else a.effectTag |= Fg, H = !1, y = a;
                }
            },
            prepareToHydrateHostInstance: function(a, b, c) {
                return b = p(a.stateNode, a.type, a.memoizedProps, b, c, a), a.updateQueue = b, 
                null !== b;
            },
            prepareToHydrateHostTextInstance: function(a) {
                return x(a.stateNode, a.memoizedProps, a);
            },
            popHydrationState: function(a) {
                if (a !== y) return !1;
                if (!H) return d(a), H = !0, !1;
                var c = a.type;
                if (a.tag !== Bg || "head" !== c && "body" !== c && !e(c, a.memoizedProps)) for (c = B; c; ) b(a, c), 
                c = h(c);
                return d(a), B = y ? h(a.stateNode) : null, !0;
            }
        };
    }
    function hh(a) {
        function b() {
            for (;null !== ma && ma.current.pendingWorkPriority === T; ) {
                ma.isScheduled = !1;
                var a = ma.nextScheduledRoot;
                if (ma.nextScheduledRoot = null, ma === zb) return zb = ma = null, z = T, null;
                ma = a;
            }
            a = ma;
            for (var b = null, c = T; null !== a; ) a.current.pendingWorkPriority !== T && (c === T || c > a.current.pendingWorkPriority) && (c = a.current.pendingWorkPriority, 
            b = a), a = a.nextScheduledRoot;
            null !== b ? (z = c, Jg(), gh(), t(), I = Lg(b.current, c), b !== nc && (oc = 0, 
            nc = b)) : (z = T, nc = I = null);
        }
        function c(c) {
            Hd = !0, na = null;
            var d = c.stateNode;
            if (d.current === c && w("177"), z !== Og && z !== U || oc++, Kg.current = null, 
            c.effectTag > Tg) if (null !== c.lastEffect) {
                c.lastEffect.nextEffect = c;
                var e = c.firstEffect;
            } else e = c; else e = c.firstEffect;
            for (Ui(), u = e; null !== u; ) {
                var f = !1, g = void 0;
                try {
                    for (;null !== u; ) {
                        var h = u.effectTag;
                        if (h & Yg && a.resetTextContent(u.stateNode), h & ah) {
                            var k = u.alternate;
                            null !== k && Ph(k);
                        }
                        switch (h & ~(Zg | $g | Yg | ah | Tg)) {
                          case Ug:
                            q(u), u.effectTag &= ~Ug;
                            break;

                          case Wg:
                            q(u), u.effectTag &= ~Ug, vf(u.alternate, u);
                            break;

                          case Vg:
                            vf(u.alternate, u);
                            break;

                          case Xg:
                            Id = !0, Mh(u), Id = !1;
                        }
                        u = u.nextEffect;
                    }
                } catch (Jd) {
                    f = !0, g = Jd;
                }
                f && (null === u && w("178"), x(u, g), null !== u && (u = u.nextEffect));
            }
            for (Vi(), d.current = c, u = e; null !== u; ) {
                d = !1, e = void 0;
                try {
                    for (;null !== u; ) {
                        var Gd = u.effectTag;
                        if (Gd & (Vg | Zg) && Nh(u.alternate, u), Gd & ah && Oh(u), Gd & $g) switch (f = u, 
                        g = void 0, null !== P && (g = P.get(f), P.delete(f), null == g && null !== f.alternate && (f = f.alternate, 
                        g = P.get(f), P.delete(f))), null == g && w("184"), f.tag) {
                          case eh:
                            f.stateNode.componentDidCatch(g.error, {
                                componentStack: g.componentStack
                            });
                            break;

                          case bh:
                            null === Ja && (Ja = g.error);
                            break;

                          default:
                            w("157");
                        }
                        var m = u.nextEffect;
                        u.nextEffect = null, u = m;
                    }
                } catch (Jd) {
                    d = !0, e = Jd;
                }
                d && (null === u && w("178"), x(u, e), null !== u && (u = u.nextEffect));
            }
            Hd = !1, "function" == typeof Ng && Ng(c.stateNode), va && (va.forEach(H), va = null), 
            b();
        }
        function d(a) {
            for (;;) {
                var b = Lh(a.alternate, a, z), c = a.return, d = a.sibling, e = a;
                if (!(e.pendingWorkPriority !== T && e.pendingWorkPriority > z)) {
                    for (var f = fh(e), g = e.child; null !== g; ) f = Mg(f, g.pendingWorkPriority), 
                    g = g.sibling;
                    e.pendingWorkPriority = f;
                }
                if (null !== b) return b;
                if (null !== c && (null === c.firstEffect && (c.firstEffect = a.firstEffect), null !== a.lastEffect && (null !== c.lastEffect && (c.lastEffect.nextEffect = a.firstEffect), 
                c.lastEffect = a.lastEffect), a.effectTag > Tg && (null !== c.lastEffect ? c.lastEffect.nextEffect = a : c.firstEffect = a, 
                c.lastEffect = a)), null !== d) return d;
                if (null === c) {
                    na = a;
                    break;
                }
                a = c;
            }
            return null;
        }
        function e(a) {
            var b = V(a.alternate, a, z);
            return null === b && (b = d(a)), Kg.current = null, b;
        }
        function f(a) {
            var b = ld(a.alternate, a, z);
            return null === b && (b = d(a)), Kg.current = null, b;
        }
        function g(a) {
            p(Rg, a);
        }
        function h() {
            if (null !== P && 0 < P.size && z === U) for (;null !== I; ) {
                var a = I;
                if (null === (I = null !== P && (P.has(a) || null !== a.alternate && P.has(a.alternate)) ? f(I) : e(I)) && (null === na && w("179"), 
                O = U, c(na), O = z, null === P || 0 === P.size || z !== U)) break;
            }
        }
        function k(a, d) {
            if (null !== na ? (O = U, c(na), h()) : null === I && b(), !(z === T || z > a)) {
                O = z;
                a: for (;;) {
                    if (z <= U) for (;null !== I && !(null === (I = e(I)) && (null === na && w("179"), 
                    O = U, c(na), O = z, h(), z === T || z > a || z > U)); ) ; else if (null !== d) for (;null !== I && !Ab; ) if (1 < d.timeRemaining()) {
                        if (null === (I = e(I))) if (null === na && w("179"), 1 < d.timeRemaining()) {
                            if (O = U, c(na), O = z, h(), z === T || z > a || z < Pg) break;
                        } else Ab = !0;
                    } else Ab = !0;
                    switch (z) {
                      case Og:
                      case U:
                        if (z <= a) continue a;
                        break a;

                      case Pg:
                      case Qg:
                      case Rg:
                        if (null === d) break a;
                        if (!Ab && z <= a) continue a;
                        break a;

                      case T:
                        break a;

                      default:
                        w("181");
                    }
                }
            }
        }
        function p(a, b) {
            Da && w("182"), Da = !0;
            var c = O, d = !1, e = null;
            try {
                k(a, b);
            } catch (Kd) {
                d = !0, e = Kd;
            }
            for (;d; ) {
                if (Ya) {
                    Ja = e;
                    break;
                }
                var h = I;
                if (null === h) Ya = !0; else {
                    var p = x(h, e);
                    if (null === p && w("183"), !Ya) {
                        try {
                            d = p, e = a, p = b;
                            for (var q = d; null !== h; ) {
                                switch (h.tag) {
                                  case eh:
                                    Ig(h);
                                    break;

                                  case ch:
                                    m(h);
                                    break;

                                  case bh:
                                    r(h);
                                    break;

                                  case dh:
                                    r(h);
                                }
                                if (h === q || h.alternate === q) break;
                                h = h.return;
                            }
                            I = f(d), k(e, p);
                        } catch (Kd) {
                            d = !0, e = Kd;
                            continue;
                        }
                        break;
                    }
                }
            }
            if (O = c, null !== b && (Bb = !1), z > U && !Bb && ($f(g), Bb = !0), a = Ja, Ya = Ab = Da = !1, 
            nc = Ka = P = Ja = null, oc = 0, null !== a) throw a;
        }
        function x(a, b) {
            var c = Kg.current = null, d = !1, e = !1, f = null;
            if (a.tag === bh) c = a, S(a) && (Ya = !0); else for (var g = a.return; null !== g && null === c; ) {
                if (g.tag === eh ? "function" == typeof g.stateNode.componentDidCatch && (d = !0, 
                f = Ra(g), c = g, e = !0) : g.tag === bh && (c = g), S(g)) {
                    if (Id || null !== va && (va.has(g) || null !== g.alternate && va.has(g.alternate))) return null;
                    c = null, e = !1;
                }
                g = g.return;
            }
            if (null !== c) {
                null === Ka && (Ka = new Set()), Ka.add(c);
                var h = "";
                g = a;
                do {
                    a: switch (g.tag) {
                      case fe:
                      case ge:
                      case he:
                      case ie:
                        var k = g._debugOwner, m = g._debugSource, p = Ra(g), q = null;
                        k && (q = Ra(k)), k = m, p = "\n    in " + (p || "Unknown") + (k ? " (at " + k.fileName.replace(/^.*[\\\/]/, "") + ":" + k.lineNumber + ")" : q ? " (created by " + q + ")" : "");
                        break a;

                      default:
                        p = "";
                    }
                    h += p, g = g.return;
                } while (g);
                g = h, a = Ra(a), null === P && (P = new Map()), b = {
                    componentName: a,
                    componentStack: g,
                    error: b,
                    errorBoundary: d ? c.stateNode : null,
                    errorBoundaryFound: d,
                    errorBoundaryName: f,
                    willRetry: e
                }, P.set(c, b);
                try {
                    console.error(b.error);
                } catch (Wi) {
                    console.error(Wi);
                }
                return Hd ? (null === va && (va = new Set()), va.add(c)) : H(c), c;
            }
            return null === Ja && (Ja = b), null;
        }
        function S(a) {
            return null !== Ka && (Ka.has(a) || null !== a.alternate && Ka.has(a.alternate));
        }
        function D(a, b) {
            return y(a, b, !1);
        }
        function y(a, b) {
            oc > Xi && (Ya = !0, w("185")), !Da && b <= z && (I = null);
            for (var c = !0; null !== a && c; ) {
                if (c = !1, (a.pendingWorkPriority === T || a.pendingWorkPriority > b) && (c = !0, 
                a.pendingWorkPriority = b), null !== a.alternate && (a.alternate.pendingWorkPriority === T || a.alternate.pendingWorkPriority > b) && (c = !0, 
                a.alternate.pendingWorkPriority = b), null === a.return) {
                    if (a.tag !== bh) break;
                    var d = a.stateNode;
                    if (b === T || d.isScheduled || (d.isScheduled = !0, zb ? zb.nextScheduledRoot = d : ma = d, 
                    zb = d), !Da) switch (b) {
                      case Og:
                        pc ? p(Og, null) : p(U, null);
                        break;

                      case U:
                        W || w("186");
                        break;

                      default:
                        Bb || ($f(g), Bb = !0);
                    }
                }
                a = a.return;
            }
        }
        function B(a, b) {
            var c = O;
            return c === T && (c = !Yi || a.internalContextTag & Sg || b ? Qg : Og), c === Og && (Da || W) ? U : c;
        }
        function H(a) {
            y(a, U, !0);
        }
        var C = Ag(a), Ca = Hg(a), r = C.popHostContainer, m = C.popHostContext, t = C.resetHostContainer, v = Lf(a, C, Ca, D, B), V = v.beginWork, ld = v.beginFailedWork, Lh = eg(a, C, Ca).completeWork, q = (C = vg(a, x)).commitPlacement, Mh = C.commitDeletion, vf = C.commitWork, Nh = C.commitLifeCycles, Oh = C.commitAttachRef, Ph = C.commitDetachRef, $f = a.scheduleDeferredCallback, Yi = a.useSyncScheduling, Ui = a.prepareForCommit, Vi = a.resetAfterCommit, O = T, Da = !1, Ab = !1, W = !1, pc = !1, I = null, z = T, u = null, na = null, ma = null, zb = null, Bb = !1, P = null, Ka = null, va = null, Ja = null, Ya = !1, Hd = !1, Id = !1, Xi = 1e3, oc = 0, nc = null;
        return {
            scheduleUpdate: D,
            getPriorityContext: B,
            batchedUpdates: function(a, b) {
                var c = W;
                W = !0;
                try {
                    return a(b);
                } finally {
                    W = c, Da || W || p(U, null);
                }
            },
            unbatchedUpdates: function(a) {
                var b = pc, c = W;
                pc = W, W = !1;
                try {
                    return a();
                } finally {
                    W = c, pc = b;
                }
            },
            flushSync: function(a) {
                var b = W, c = O;
                W = !0, O = Og;
                try {
                    return a();
                } finally {
                    W = b, O = c, Da && w("187"), p(U, null);
                }
            },
            deferredUpdates: function(a) {
                var b = O;
                O = Qg;
                try {
                    return a();
                } finally {
                    O = b;
                }
            }
        };
    }
    function ih() {
        w("196");
    }
    function jh(a) {
        return a ? "number" == typeof (a = Pa.get(a)).tag ? ih(a) : a._processChildContext(a._context) : da;
    }
    function sh(a) {
        for (;a && a.firstChild; ) a = a.firstChild;
        return a;
    }
    function th(a, b) {
        var c = sh(a);
        a = 0;
        for (var d; c; ) {
            if (c.nodeType === rh) {
                if (d = a + c.textContent.length, a <= b && d >= b) return {
                    node: c,
                    offset: b - a
                };
                a = d;
            }
            a: {
                for (;c; ) {
                    if (c.nextSibling) {
                        c = c.nextSibling;
                        break a;
                    }
                    c = c.parentNode;
                }
                c = void 0;
            }
            c = sh(c);
        }
    }
    function vh() {
        return !uh && l.canUseDOM && (uh = "textContent" in document.documentElement ? "textContent" : "innerText"), 
        uh;
    }
    function Bh() {
        w("211");
    }
    function Ch() {
        w("212");
    }
    function Dh(a) {
        if (null == a) return null;
        if (a.nodeType === Ah) return a;
        var b = Pa.get(a);
        if (b) return "number" == typeof b.tag ? Bh(b) : Ch(b);
        "function" == typeof a.render ? w("188") : w("213", Object.keys(a));
    }
    function Fh(a) {
        if (void 0 !== a._hostParent) return a._hostParent;
        if ("number" == typeof a.tag) {
            do {
                a = a.return;
            } while (a && a.tag !== Eh);
            if (a) return a;
        }
        return null;
    }
    function Gh(a, b) {
        for (var c = 0, d = a; d; d = Fh(d)) c++;
        d = 0;
        for (var e = b; e; e = Fh(e)) d++;
        for (;0 < c - d; ) a = Fh(a), c--;
        for (;0 < d - c; ) b = Fh(b), d--;
        for (;c--; ) {
            if (a === b || a === b.alternate) return a;
            a = Fh(a), b = Fh(b);
        }
        return null;
    }
    function Jh(a, b, c) {
        (b = Ih(a, c.dispatchConfig.phasedRegistrationNames[b])) && (c._dispatchListeners = Cb(c._dispatchListeners, b), 
        c._dispatchInstances = Cb(c._dispatchInstances, a));
    }
    function Kh(a) {
        a && a.dispatchConfig.phasedRegistrationNames && Hh.traverseTwoPhase(a._targetInst, Jh, a);
    }
    function Qh(a) {
        if (a && a.dispatchConfig.phasedRegistrationNames) {
            var b = a._targetInst;
            b = b ? Hh.getParentInstance(b) : null, Hh.traverseTwoPhase(b, Jh, a);
        }
    }
    function Rh(a, b, c) {
        a && c && c.dispatchConfig.registrationName && (b = Ih(a, c.dispatchConfig.registrationName)) && (c._dispatchListeners = Cb(c._dispatchListeners, b), 
        c._dispatchInstances = Cb(c._dispatchInstances, a));
    }
    function Sh(a) {
        a && a.dispatchConfig.registrationName && Rh(a._targetInst, null, a);
    }
    function Y(a, b, c, d) {
        this.dispatchConfig = a, this._targetInst = b, this.nativeEvent = c, a = this.constructor.Interface;
        for (var e in a) a.hasOwnProperty(e) && ((b = a[e]) ? this[e] = b(c) : "target" === e ? this.target = d : this[e] = c[e]);
        return this.isDefaultPrevented = (null != c.defaultPrevented ? c.defaultPrevented : !1 === c.returnValue) ? ca.thatReturnsTrue : ca.thatReturnsFalse, 
        this.isPropagationStopped = ca.thatReturnsFalse, this;
    }
    function Zh(a, b, c, d) {
        if (this.eventPool.length) {
            var e = this.eventPool.pop();
            return this.call(e, a, b, c, d), e;
        }
        return new this(a, b, c, d);
    }
    function $h(a) {
        a instanceof this || w("223"), a.destructor(), 10 > this.eventPool.length && this.eventPool.push(a);
    }
    function Yh(a) {
        a.eventPool = [], a.getPooled = Zh, a.release = $h;
    }
    function ai(a, b, c, d) {
        return Y.call(this, a, b, c, d);
    }
    function bi(a, b, c, d) {
        return Y.call(this, a, b, c, d);
    }
    function mi(a, b) {
        switch (a) {
          case "topKeyUp":
            return -1 !== ci.indexOf(b.keyCode);

          case "topKeyDown":
            return 229 !== b.keyCode;

          case "topKeyPress":
          case "topMouseDown":
          case "topBlur":
            return !0;

          default:
            return !1;
        }
    }
    function ni(a) {
        return "object" == typeof (a = a.detail) && "data" in a ? a.data : null;
    }
    function pi(a, b) {
        switch (a) {
          case "topCompositionEnd":
            return ni(b);

          case "topKeyPress":
            return 32 !== b.which ? null : (li = !0, ji);

          case "topTextInput":
            return (a = b.data) === ji && li ? null : a;

          default:
            return null;
        }
    }
    function qi(a, b) {
        if (oi) return "topCompositionEnd" === a || !di && mi(a, b) ? (a = Vh.getData(), 
        Vh.reset(), oi = !1, a) : null;
        switch (a) {
          case "topPaste":
            return null;

          case "topKeyPress":
            if (!(b.ctrlKey || b.altKey || b.metaKey) || b.ctrlKey && b.altKey) {
                if (b.char && 1 < b.char.length) return b.char;
                if (b.which) return String.fromCharCode(b.which);
            }
            return null;

          case "topCompositionEnd":
            return ii ? null : b.data;

          default:
            return null;
        }
    }
    function ti(a) {
        var b = a && a.nodeName && a.nodeName.toLowerCase();
        return "input" === b ? !!si[a.type] : "textarea" === b;
    }
    function vi(a, b, c) {
        return a = Y.getPooled(ui.change, a, b, c), a.type = "change", nb.enqueueStateRestore(c), 
        Th.accumulateTwoPhaseDispatches(a), a;
    }
    function yi(a) {
        Jb.enqueueEvents(a), Jb.processEventQueue(!1);
    }
    function zi(a) {
        var b = G.getNodeFromInstance(a);
        if (Bc.updateValueIfChanged(b)) return a;
    }
    function Ai(a, b) {
        if ("topChange" === a) return b;
    }
    function Ci() {
        wi && (wi.detachEvent("onpropertychange", Di), xi = wi = null);
    }
    function Di(a) {
        "value" === a.propertyName && zi(xi) && (a = vi(xi, a, ub(a)), sb.batchedUpdates(yi, a));
    }
    function Ei(a, b, c) {
        "topFocus" === a ? (Ci(), wi = b, xi = c, wi.attachEvent("onpropertychange", Di)) : "topBlur" === a && Ci();
    }
    function Fi(a) {
        if ("topSelectionChange" === a || "topKeyUp" === a || "topKeyDown" === a) return zi(xi);
    }
    function Gi(a, b) {
        if ("topClick" === a) return zi(b);
    }
    function Hi(a, b) {
        if ("topInput" === a || "topChange" === a) return zi(b);
    }
    function Ji(a, b, c, d) {
        return Y.call(this, a, b, c, d);
    }
    function Li(a) {
        var b = this.nativeEvent;
        return b.getModifierState ? b.getModifierState(a) : !!(a = Ki[a]) && !!b[a];
    }
    function Mi() {
        return Li;
    }
    function Ni(a, b, c, d) {
        return Y.call(this, a, b, c, d);
    }
    function cj(a, b) {
        if (aj || null == Ti || Ti !== ia()) return null;
        var c = Ti;
        return "selectionStart" in c && zh.hasSelectionCapabilities(c) ? c = {
            start: c.selectionStart,
            end: c.selectionEnd
        } : window.getSelection ? (c = window.getSelection(), c = {
            anchorNode: c.anchorNode,
            anchorOffset: c.anchorOffset,
            focusNode: c.focusNode,
            focusOffset: c.focusOffset
        }) : c = void 0, $i && ea($i, c) ? null : ($i = c, a = Y.getPooled(Si.select, Zi, a, b), 
        a.type = "select", a.target = Ti, Th.accumulateTwoPhaseDispatches(a), a);
    }
    function ej(a, b, c, d) {
        return Y.call(this, a, b, c, d);
    }
    function fj(a, b, c, d) {
        return Y.call(this, a, b, c, d);
    }
    function gj(a, b, c, d) {
        return Y.call(this, a, b, c, d);
    }
    function hj(a) {
        var b = a.keyCode;
        return "charCode" in a ? 0 === (a = a.charCode) && 13 === b && (a = 13) : a = b, 
        32 <= a || 13 === a ? a : 0;
    }
    function kj(a, b, c, d) {
        return Y.call(this, a, b, c, d);
    }
    function lj(a, b, c, d) {
        return Y.call(this, a, b, c, d);
    }
    function mj(a, b, c, d) {
        return Y.call(this, a, b, c, d);
    }
    function nj(a, b, c, d) {
        return Y.call(this, a, b, c, d);
    }
    function oj(a, b, c, d) {
        return Y.call(this, a, b, c, d);
    }
    function Bj(a) {
        return a[1].toUpperCase();
    }
    function ak(a) {
        return !(!a || a.nodeType !== Dj && a.nodeType !== Gj && a.nodeType !== Hj && (a.nodeType !== Fj || " react-mount-point-unstable " !== a.nodeValue));
    }
    function bk(a) {
        return !(!(a = a ? a.nodeType === Gj ? a.documentElement : a.firstChild : null) || a.nodeType !== Dj || !a.hasAttribute(Ij));
    }
    function ck(a, b, c, d, e) {
        ak(c) || w("200");
        var f = c._reactRootContainer;
        if (f) Xj.updateContainer(b, f, a, e); else {
            if (!d && !bk(c)) for (d = void 0; d = c.lastChild; ) c.removeChild(d);
            var g = Xj.createContainer(c);
            f = c._reactRootContainer = g, Xj.unbatchedUpdates(function() {
                Xj.updateContainer(b, g, a, e);
            });
        }
        return Xj.getPublicRootInstance(f);
    }
    function dk(a, b) {
        var c = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : null;
        return ak(b) || w("200"), ne.createPortal(a, b, null, c);
    }
    var aa = __webpack_require__(5);
    __webpack_require__(192);
    var l = __webpack_require__(391), n = __webpack_require__(316), ba = __webpack_require__(392), ca = __webpack_require__(147), da = __webpack_require__(317), ea = __webpack_require__(393), fa = __webpack_require__(394), ha = __webpack_require__(397), ia = __webpack_require__(398);
    aa || w("227");
    var fb, Kb, ka = {
        Namespaces: {
            html: "http://www.w3.org/1999/xhtml",
            mathml: "http://www.w3.org/1998/Math/MathML",
            svg: "http://www.w3.org/2000/svg"
        },
        getIntrinsicNamespace: ja,
        getChildNamespace: function(a, b) {
            return null == a || "http://www.w3.org/1999/xhtml" === a ? ja(b) : "http://www.w3.org/2000/svg" === a && "foreignObject" === b ? "http://www.w3.org/1999/xhtml" : a;
        }
    }, la = null, oa = {}, qa = {
        plugins: [],
        eventNameDispatchConfigs: {},
        registrationNameModules: {},
        registrationNameDependencies: {},
        possibleRegistrationNames: null,
        injectEventPluginOrder: function(a) {
            la && w("101"), la = Array.prototype.slice.call(a), pa();
        },
        injectEventPluginsByName: function(a) {
            var c, b = !1;
            for (c in a) if (a.hasOwnProperty(c)) {
                var d = a[c];
                oa.hasOwnProperty(c) && oa[c] === d || (oa[c] && w("102", c), oa[c] = d, b = !0);
            }
            b && pa();
        }
    }, sa = qa, ta = {
        children: !0,
        dangerouslySetInnerHTML: !0,
        autoFocus: !0,
        defaultValue: !0,
        defaultChecked: !0,
        innerHTML: !0,
        suppressContentEditableWarning: !0,
        style: !0
    }, wa = {
        MUST_USE_PROPERTY: 1,
        HAS_BOOLEAN_VALUE: 4,
        HAS_NUMERIC_VALUE: 8,
        HAS_POSITIVE_NUMERIC_VALUE: 24,
        HAS_OVERLOADED_BOOLEAN_VALUE: 32,
        HAS_STRING_BOOLEAN_VALUE: 64,
        injectDOMPropertyConfig: function(a) {
            var b = wa, c = a.Properties || {}, d = a.DOMAttributeNamespaces || {}, e = a.DOMAttributeNames || {};
            a = a.DOMMutationMethods || {};
            for (var f in c) {
                xa.properties.hasOwnProperty(f) && w("48", f);
                var g = f.toLowerCase(), h = c[f];
                1 >= (g = {
                    attributeName: g,
                    attributeNamespace: null,
                    propertyName: f,
                    mutationMethod: null,
                    mustUseProperty: ua(h, b.MUST_USE_PROPERTY),
                    hasBooleanValue: ua(h, b.HAS_BOOLEAN_VALUE),
                    hasNumericValue: ua(h, b.HAS_NUMERIC_VALUE),
                    hasPositiveNumericValue: ua(h, b.HAS_POSITIVE_NUMERIC_VALUE),
                    hasOverloadedBooleanValue: ua(h, b.HAS_OVERLOADED_BOOLEAN_VALUE),
                    hasStringBooleanValue: ua(h, b.HAS_STRING_BOOLEAN_VALUE)
                }).hasBooleanValue + g.hasNumericValue + g.hasOverloadedBooleanValue || w("50", f), 
                e.hasOwnProperty(f) && (g.attributeName = e[f]), d.hasOwnProperty(f) && (g.attributeNamespace = d[f]), 
                a.hasOwnProperty(f) && (g.mutationMethod = a[f]), xa.properties[f] = g;
            }
        }
    }, xa = {
        ID_ATTRIBUTE_NAME: "data-reactid",
        ROOT_ATTRIBUTE_NAME: "data-reactroot",
        ATTRIBUTE_NAME_START_CHAR: ":A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD",
        ATTRIBUTE_NAME_CHAR: ":A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040",
        properties: {},
        shouldSetAttribute: function(a, b) {
            if (xa.isReservedProp(a) || !("o" !== a[0] && "O" !== a[0] || "n" !== a[1] && "N" !== a[1])) return !1;
            if (null === b) return !0;
            switch (typeof b) {
              case "boolean":
                return xa.shouldAttributeAcceptBooleanValue(a);

              case "undefined":
              case "number":
              case "string":
              case "object":
                return !0;

              default:
                return !1;
            }
        },
        getPropertyInfo: function(a) {
            return xa.properties.hasOwnProperty(a) ? xa.properties[a] : null;
        },
        shouldAttributeAcceptBooleanValue: function(a) {
            if (xa.isReservedProp(a)) return !0;
            var b = xa.getPropertyInfo(a);
            return b ? b.hasBooleanValue || b.hasStringBooleanValue || b.hasOverloadedBooleanValue : "data-" === (a = a.toLowerCase().slice(0, 5)) || "aria-" === a;
        },
        isReservedProp: function(a) {
            return ta.hasOwnProperty(a);
        },
        injection: wa
    }, A = xa, E = {
        IndeterminateComponent: 0,
        FunctionalComponent: 1,
        ClassComponent: 2,
        HostRoot: 3,
        HostPortal: 4,
        HostComponent: 5,
        HostText: 6,
        CoroutineComponent: 7,
        CoroutineHandlerPhase: 8,
        YieldComponent: 9,
        Fragment: 10
    }, F = {
        ELEMENT_NODE: 1,
        TEXT_NODE: 3,
        COMMENT_NODE: 8,
        DOCUMENT_NODE: 9,
        DOCUMENT_FRAGMENT_NODE: 11
    }, ya = E.HostComponent, za = E.HostText, Aa = F.ELEMENT_NODE, Ba = F.COMMENT_NODE, Ea = A.ID_ATTRIBUTE_NAME, Fa = {
        hasCachedChildNodes: 1
    }, Ga = Math.random().toString(36).slice(2), Ha = "__reactInternalInstance$" + Ga, Ia = "__reactEventHandlers$" + Ga, G = {
        getClosestInstanceFromNode: Oa,
        getInstanceFromNode: function(a) {
            var b = a[Ha];
            return b ? b.tag === ya || b.tag === za ? b : b._hostNode === a ? b : null : null != (b = Oa(a)) && b._hostNode === a ? b : null;
        },
        getNodeFromInstance: function(a) {
            if (a.tag === ya || a.tag === za) return a.stateNode;
            if (void 0 === a._hostNode && w("33"), a._hostNode) return a._hostNode;
            for (var b = []; !a._hostNode; ) b.push(a), a._hostParent || w("34"), a = a._hostParent;
            for (;b.length; a = b.pop()) Na(a, a._hostNode);
            return a._hostNode;
        },
        precacheChildNodes: Na,
        precacheNode: Ma,
        uncacheNode: function(a) {
            var b = a._hostNode;
            b && (delete b[Ha], a._hostNode = null);
        },
        precacheFiberNode: function(a, b) {
            b[Ha] = a;
        },
        getFiberCurrentPropsFromNode: function(a) {
            return a[Ia] || null;
        },
        updateFiberProps: function(a, b) {
            a[Ia] = b;
        }
    }, Pa = {
        remove: function(a) {
            a._reactInternalFiber = void 0;
        },
        get: function(a) {
            return a._reactInternalFiber;
        },
        has: function(a) {
            return void 0 !== a._reactInternalFiber;
        },
        set: function(a, b) {
            a._reactInternalFiber = b;
        }
    }, Qa = {
        ReactCurrentOwner: aa.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner
    }, J = {
        NoEffect: 0,
        PerformedWork: 1,
        Placement: 2,
        Update: 4,
        PlacementAndUpdate: 6,
        Deletion: 8,
        ContentReset: 16,
        Callback: 32,
        Err: 64,
        Ref: 128
    }, Sa = E.HostComponent, Ta = E.HostRoot, Ua = E.HostPortal, Va = E.HostText, Wa = J.NoEffect, Xa = J.Placement, bb = {
        isFiberMounted: function(a) {
            return 2 === Za(a);
        },
        isMounted: function(a) {
            return !!(a = Pa.get(a)) && 2 === Za(a);
        },
        findCurrentFiberUsingSlowPath: ab,
        findCurrentHostFiber: function(a) {
            if (!(a = ab(a))) return null;
            for (var b = a; ;) {
                if (b.tag === Sa || b.tag === Va) return b;
                if (b.child) b.child.return = b, b = b.child; else {
                    if (b === a) break;
                    for (;!b.sibling; ) {
                        if (!b.return || b.return === a) return null;
                        b = b.return;
                    }
                    b.sibling.return = b.return, b = b.sibling;
                }
            }
            return null;
        },
        findCurrentHostFiberWithNoPortals: function(a) {
            if (!(a = ab(a))) return null;
            for (var b = a; ;) {
                if (b.tag === Sa || b.tag === Va) return b;
                if (b.child && b.tag !== Ua) b.child.return = b, b = b.child; else {
                    if (b === a) break;
                    for (;!b.sibling; ) {
                        if (!b.return || b.return === a) return null;
                        b = b.return;
                    }
                    b.sibling.return = b.return, b = b.sibling;
                }
            }
            return null;
        }
    }, K = {
        _caughtError: null,
        _hasCaughtError: !1,
        _rethrowError: null,
        _hasRethrowError: !1,
        injection: {
            injectErrorUtils: function(a) {
                "function" != typeof a.invokeGuardedCallback && w("197"), cb = a.invokeGuardedCallback;
            }
        },
        invokeGuardedCallback: function(a, b, c, d, e, f, g, h, k) {
            cb.apply(K, arguments);
        },
        invokeGuardedCallbackAndCatchFirstError: function(a, b, c, d, e, f, g, h, k) {
            if (K.invokeGuardedCallback.apply(this, arguments), K.hasCaughtError()) {
                var p = K.clearCaughtError();
                K._hasRethrowError || (K._hasRethrowError = !0, K._rethrowError = p);
            }
        },
        rethrowCaughtError: function() {
            return db.apply(K, arguments);
        },
        hasCaughtError: function() {
            return K._hasCaughtError;
        },
        clearCaughtError: function() {
            if (K._hasCaughtError) {
                var a = K._caughtError;
                return K._caughtError = null, K._hasCaughtError = !1, a;
            }
            w("198");
        }
    }, eb = K, hb = {
        isEndish: function(a) {
            return "topMouseUp" === a || "topTouchEnd" === a || "topTouchCancel" === a;
        },
        isMoveish: function(a) {
            return "topMouseMove" === a || "topTouchMove" === a;
        },
        isStartish: function(a) {
            return "topMouseDown" === a || "topTouchStart" === a;
        },
        executeDirectDispatch: function(a) {
            var b = a._dispatchListeners, c = a._dispatchInstances;
            return Array.isArray(b) && w("103"), a.currentTarget = b ? hb.getNodeFromInstance(c) : null, 
            b = b ? b(a) : null, a.currentTarget = null, a._dispatchListeners = null, a._dispatchInstances = null, 
            b;
        },
        executeDispatchesInOrder: function(a, b) {
            var c = a._dispatchListeners, d = a._dispatchInstances;
            if (Array.isArray(c)) for (var e = 0; e < c.length && !a.isPropagationStopped(); e++) gb(a, b, c[e], d[e]); else c && gb(a, b, c, d);
            a._dispatchListeners = null, a._dispatchInstances = null;
        },
        executeDispatchesInOrderStopAtTrue: function(a) {
            a: {
                var b = a._dispatchListeners, c = a._dispatchInstances;
                if (Array.isArray(b)) {
                    for (var d = 0; d < b.length && !a.isPropagationStopped(); d++) if (b[d](a, c[d])) {
                        b = c[d];
                        break a;
                    }
                } else if (b && b(a, c)) {
                    b = c;
                    break a;
                }
                b = null;
            }
            return a._dispatchInstances = null, a._dispatchListeners = null, b;
        },
        hasDispatches: function(a) {
            return !!a._dispatchListeners;
        },
        getFiberCurrentPropsFromNode: function(a) {
            return fb.getFiberCurrentPropsFromNode(a);
        },
        getInstanceFromNode: function(a) {
            return fb.getInstanceFromNode(a);
        },
        getNodeFromInstance: function(a) {
            return fb.getNodeFromInstance(a);
        },
        injection: {
            injectComponentTree: function(a) {
                fb = a;
            }
        }
    }, ib = hb, jb = null, kb = null, lb = null, nb = {
        injection: {
            injectFiberControlledHostComponent: function(a) {
                jb = a;
            }
        },
        enqueueStateRestore: function(a) {
            kb ? lb ? lb.push(a) : lb = [ a ] : kb = a;
        },
        restoreStateIfNeeded: function() {
            if (kb) {
                var a = kb, b = lb;
                if (lb = kb = null, mb(a), b) for (a = 0; a < b.length; a++) mb(b[a]);
            }
        }
    }, rb = !1, sb = {
        batchedUpdates: function(a, b) {
            if (rb) return ob(qb, a, b);
            rb = !0;
            try {
                return ob(qb, a, b);
            } finally {
                rb = !1, nb.restoreStateIfNeeded();
            }
        },
        injection: {
            injectStackBatchedUpdates: function(a) {
                ob = a;
            },
            injectFiberBatchedUpdates: function(a) {
                pb = a;
            }
        }
    }, tb = F.TEXT_NODE, vb = E.HostRoot, wb = [], yb = {
        _enabled: !0,
        _handleTopLevel: null,
        setHandleTopLevel: function(a) {
            yb._handleTopLevel = a;
        },
        setEnabled: function(a) {
            yb._enabled = !!a;
        },
        isEnabled: function() {
            return yb._enabled;
        },
        trapBubbledEvent: function(a, b, c) {
            return c ? ba.listen(c, b, yb.dispatchEvent.bind(null, a)) : null;
        },
        trapCapturedEvent: function(a, b, c) {
            return c ? ba.capture(c, b, yb.dispatchEvent.bind(null, a)) : null;
        },
        dispatchEvent: function(a, b) {
            if (yb._enabled) {
                var c = ub(b);
                if (null === (c = G.getClosestInstanceFromNode(c)) || "number" != typeof c.tag || bb.isFiberMounted(c) || (c = null), 
                wb.length) {
                    var d = wb.pop();
                    d.topLevelType = a, d.nativeEvent = b, d.targetInst = c, a = d;
                } else a = {
                    topLevelType: a,
                    nativeEvent: b,
                    targetInst: c,
                    ancestors: []
                };
                try {
                    sb.batchedUpdates(xb, a);
                } finally {
                    a.topLevelType = null, a.nativeEvent = null, a.targetInst = null, a.ancestors.length = 0, 
                    10 > wb.length && wb.push(a);
                }
            }
        }
    }, L = yb, Eb = null, Jb = {
        injection: {
            injectEventPluginOrder: sa.injectEventPluginOrder,
            injectEventPluginsByName: sa.injectEventPluginsByName
        },
        getListener: function(a, b) {
            if ("number" == typeof a.tag) {
                var c = a.stateNode;
                if (!c) return null;
                var d = ib.getFiberCurrentPropsFromNode(c);
                if (!d) return null;
                if (c = d[b], Ib(b, a.type, d)) return null;
            } else {
                if ("string" == typeof (d = a._currentElement) || "number" == typeof d || !a._rootNodeID) return null;
                if (a = d.props, c = a[b], Ib(b, d.type, a)) return null;
            }
            return c && "function" != typeof c && w("231", b, typeof c), c;
        },
        extractEvents: function(a, b, c, d) {
            for (var e, f = sa.plugins, g = 0; g < f.length; g++) {
                var h = f[g];
                h && (h = h.extractEvents(a, b, c, d)) && (e = Cb(e, h));
            }
            return e;
        },
        enqueueEvents: function(a) {
            a && (Eb = Cb(Eb, a));
        },
        processEventQueue: function(a) {
            var b = Eb;
            Eb = null, a ? Db(b, Gb) : Db(b, Hb), Eb && w("95"), eb.rethrowCaughtError();
        }
    };
    l.canUseDOM && (Kb = document.implementation && document.implementation.hasFeature && !0 !== document.implementation.hasFeature("", ""));
    var Nb = {
        animationend: Mb("Animation", "AnimationEnd"),
        animationiteration: Mb("Animation", "AnimationIteration"),
        animationstart: Mb("Animation", "AnimationStart"),
        transitionend: Mb("Transition", "TransitionEnd")
    }, Ob = {}, Pb = {};
    l.canUseDOM && (Pb = document.createElement("div").style, "AnimationEvent" in window || (delete Nb.animationend.animation, 
    delete Nb.animationiteration.animation, delete Nb.animationstart.animation), "TransitionEvent" in window || delete Nb.transitionend.transition);
    var Rb = {
        topAbort: "abort",
        topAnimationEnd: Qb("animationend") || "animationend",
        topAnimationIteration: Qb("animationiteration") || "animationiteration",
        topAnimationStart: Qb("animationstart") || "animationstart",
        topBlur: "blur",
        topCancel: "cancel",
        topCanPlay: "canplay",
        topCanPlayThrough: "canplaythrough",
        topChange: "change",
        topClick: "click",
        topClose: "close",
        topCompositionEnd: "compositionend",
        topCompositionStart: "compositionstart",
        topCompositionUpdate: "compositionupdate",
        topContextMenu: "contextmenu",
        topCopy: "copy",
        topCut: "cut",
        topDoubleClick: "dblclick",
        topDrag: "drag",
        topDragEnd: "dragend",
        topDragEnter: "dragenter",
        topDragExit: "dragexit",
        topDragLeave: "dragleave",
        topDragOver: "dragover",
        topDragStart: "dragstart",
        topDrop: "drop",
        topDurationChange: "durationchange",
        topEmptied: "emptied",
        topEncrypted: "encrypted",
        topEnded: "ended",
        topError: "error",
        topFocus: "focus",
        topInput: "input",
        topKeyDown: "keydown",
        topKeyPress: "keypress",
        topKeyUp: "keyup",
        topLoadedData: "loadeddata",
        topLoad: "load",
        topLoadedMetadata: "loadedmetadata",
        topLoadStart: "loadstart",
        topMouseDown: "mousedown",
        topMouseMove: "mousemove",
        topMouseOut: "mouseout",
        topMouseOver: "mouseover",
        topMouseUp: "mouseup",
        topPaste: "paste",
        topPause: "pause",
        topPlay: "play",
        topPlaying: "playing",
        topProgress: "progress",
        topRateChange: "ratechange",
        topScroll: "scroll",
        topSeeked: "seeked",
        topSeeking: "seeking",
        topSelectionChange: "selectionchange",
        topStalled: "stalled",
        topSuspend: "suspend",
        topTextInput: "textInput",
        topTimeUpdate: "timeupdate",
        topToggle: "toggle",
        topTouchCancel: "touchcancel",
        topTouchEnd: "touchend",
        topTouchMove: "touchmove",
        topTouchStart: "touchstart",
        topTransitionEnd: Qb("transitionend") || "transitionend",
        topVolumeChange: "volumechange",
        topWaiting: "waiting",
        topWheel: "wheel"
    }, Sb = {}, Tb = 0, Ub = "_reactListenersID" + ("" + Math.random()).slice(2), M = n({}, {
        handleTopLevel: function(a, b, c, d) {
            a = Jb.extractEvents(a, b, c, d), Jb.enqueueEvents(a), Jb.processEventQueue(!1);
        }
    }, {
        setEnabled: function(a) {
            L && L.setEnabled(a);
        },
        isEnabled: function() {
            return !(!L || !L.isEnabled());
        },
        listenTo: function(a, b) {
            var c = Vb(b);
            a = sa.registrationNameDependencies[a];
            for (var d = 0; d < a.length; d++) {
                var e = a[d];
                c.hasOwnProperty(e) && c[e] || ("topWheel" === e ? Lb("wheel") ? L.trapBubbledEvent("topWheel", "wheel", b) : Lb("mousewheel") ? L.trapBubbledEvent("topWheel", "mousewheel", b) : L.trapBubbledEvent("topWheel", "DOMMouseScroll", b) : "topScroll" === e ? L.trapCapturedEvent("topScroll", "scroll", b) : "topFocus" === e || "topBlur" === e ? (L.trapCapturedEvent("topFocus", "focus", b), 
                L.trapCapturedEvent("topBlur", "blur", b), c.topBlur = !0, c.topFocus = !0) : "topCancel" === e ? (Lb("cancel", !0) && L.trapCapturedEvent("topCancel", "cancel", b), 
                c.topCancel = !0) : "topClose" === e ? (Lb("close", !0) && L.trapCapturedEvent("topClose", "close", b), 
                c.topClose = !0) : Rb.hasOwnProperty(e) && L.trapBubbledEvent(e, Rb[e], b), c[e] = !0);
            }
        },
        isListeningToAllDependencies: function(a, b) {
            b = Vb(b), a = sa.registrationNameDependencies[a];
            for (var c = 0; c < a.length; c++) {
                var d = a[c];
                if (!b.hasOwnProperty(d) || !b[d]) return !1;
            }
            return !0;
        },
        trapBubbledEvent: function(a, b, c) {
            return L.trapBubbledEvent(a, b, c);
        },
        trapCapturedEvent: function(a, b, c) {
            return L.trapCapturedEvent(a, b, c);
        }
    }), Wb = {
        animationIterationCount: !0,
        borderImageOutset: !0,
        borderImageSlice: !0,
        borderImageWidth: !0,
        boxFlex: !0,
        boxFlexGroup: !0,
        boxOrdinalGroup: !0,
        columnCount: !0,
        columns: !0,
        flex: !0,
        flexGrow: !0,
        flexPositive: !0,
        flexShrink: !0,
        flexNegative: !0,
        flexOrder: !0,
        gridRow: !0,
        gridRowEnd: !0,
        gridRowSpan: !0,
        gridRowStart: !0,
        gridColumn: !0,
        gridColumnEnd: !0,
        gridColumnSpan: !0,
        gridColumnStart: !0,
        fontWeight: !0,
        lineClamp: !0,
        lineHeight: !0,
        opacity: !0,
        order: !0,
        orphans: !0,
        tabSize: !0,
        widows: !0,
        zIndex: !0,
        zoom: !0,
        fillOpacity: !0,
        floodOpacity: !0,
        stopOpacity: !0,
        strokeDasharray: !0,
        strokeDashoffset: !0,
        strokeMiterlimit: !0,
        strokeOpacity: !0,
        strokeWidth: !0
    }, Xb = [ "Webkit", "ms", "Moz", "O" ];
    Object.keys(Wb).forEach(function(a) {
        Xb.forEach(function(b) {
            b = b + a.charAt(0).toUpperCase() + a.substring(1), Wb[b] = Wb[a];
        });
    });
    var Yb = {
        isUnitlessNumber: Wb,
        shorthandPropertyExpansions: {
            background: {
                backgroundAttachment: !0,
                backgroundColor: !0,
                backgroundImage: !0,
                backgroundPositionX: !0,
                backgroundPositionY: !0,
                backgroundRepeat: !0
            },
            backgroundPosition: {
                backgroundPositionX: !0,
                backgroundPositionY: !0
            },
            border: {
                borderWidth: !0,
                borderStyle: !0,
                borderColor: !0
            },
            borderBottom: {
                borderBottomWidth: !0,
                borderBottomStyle: !0,
                borderBottomColor: !0
            },
            borderLeft: {
                borderLeftWidth: !0,
                borderLeftStyle: !0,
                borderLeftColor: !0
            },
            borderRight: {
                borderRightWidth: !0,
                borderRightStyle: !0,
                borderRightColor: !0
            },
            borderTop: {
                borderTopWidth: !0,
                borderTopStyle: !0,
                borderTopColor: !0
            },
            font: {
                fontStyle: !0,
                fontVariant: !0,
                fontWeight: !0,
                fontSize: !0,
                lineHeight: !0,
                fontFamily: !0
            },
            outline: {
                outlineWidth: !0,
                outlineStyle: !0,
                outlineColor: !0
            }
        }
    }, Zb = Yb.isUnitlessNumber, $b = !1;
    if (l.canUseDOM) {
        var ac = document.createElement("div").style;
        try {
            ac.font = "";
        } catch (a) {
            $b = !0;
        }
    }
    var Ec, bc = {
        createDangerousStringForStyles: function() {},
        setValueForStyles: function(a, b) {
            a = a.style;
            for (var c in b) if (b.hasOwnProperty(c)) {
                var d = 0 === c.indexOf("--"), e = c, f = b[c];
                if (e = null == f || "boolean" == typeof f || "" === f ? "" : d || "number" != typeof f || 0 === f || Zb.hasOwnProperty(e) && Zb[e] ? ("" + f).trim() : f + "px", 
                "float" === c && (c = "cssFloat"), d) a.setProperty(c, e); else if (e) a[c] = e; else if (d = $b && Yb.shorthandPropertyExpansions[c]) for (var g in d) a[g] = ""; else a[c] = "";
            }
        }
    }, cc = new RegExp("^[" + A.ATTRIBUTE_NAME_START_CHAR + "][" + A.ATTRIBUTE_NAME_CHAR + "]*$"), dc = {}, ec = {}, gc = {
        setAttributeForID: function(a, b) {
            a.setAttribute(A.ID_ATTRIBUTE_NAME, b);
        },
        setAttributeForRoot: function(a) {
            a.setAttribute(A.ROOT_ATTRIBUTE_NAME, "");
        },
        getValueForProperty: function() {},
        getValueForAttribute: function() {},
        setValueForProperty: function(a, b, c) {
            var d = A.getPropertyInfo(b);
            if (d && A.shouldSetAttribute(b, c)) {
                var e = d.mutationMethod;
                e ? e(a, c) : null == c || d.hasBooleanValue && !c || d.hasNumericValue && isNaN(c) || d.hasPositiveNumericValue && 1 > c || d.hasOverloadedBooleanValue && !1 === c ? gc.deleteValueForProperty(a, b) : d.mustUseProperty ? a[d.propertyName] = c : (b = d.attributeName, 
                (e = d.attributeNamespace) ? a.setAttributeNS(e, b, "" + c) : d.hasBooleanValue || d.hasOverloadedBooleanValue && !0 === c ? a.setAttribute(b, "") : a.setAttribute(b, "" + c));
            } else gc.setValueForAttribute(a, b, A.shouldSetAttribute(b, c) ? c : null);
        },
        setValueForAttribute: function(a, b, c) {
            fc(b) && (null == c ? a.removeAttribute(b) : a.setAttribute(b, "" + c));
        },
        deleteValueForAttribute: function(a, b) {
            a.removeAttribute(b);
        },
        deleteValueForProperty: function(a, b) {
            var c = A.getPropertyInfo(b);
            c ? (b = c.mutationMethod) ? b(a, void 0) : c.mustUseProperty ? a[c.propertyName] = !c.hasBooleanValue && "" : a.removeAttribute(c.attributeName) : a.removeAttribute(b);
        }
    }, hc = gc, ic = Qa.ReactDebugCurrentFrame, kc = {
        current: null,
        phase: null,
        resetCurrentFiber: function() {
            ic.getCurrentStack = null, kc.current = null, kc.phase = null;
        },
        setCurrentFiber: function(a, b) {
            ic.getCurrentStack = jc, kc.current = a, kc.phase = b;
        },
        getCurrentFiberOwnerName: function() {
            return null;
        },
        getCurrentFiberStackAddendum: jc
    }, lc = kc, mc = {
        getHostProps: function(a, b) {
            var c = b.value, d = b.checked;
            return n({
                type: void 0,
                step: void 0,
                min: void 0,
                max: void 0
            }, b, {
                defaultChecked: void 0,
                defaultValue: void 0,
                value: null != c ? c : a._wrapperState.initialValue,
                checked: null != d ? d : a._wrapperState.initialChecked
            });
        },
        initWrapperState: function(a, b) {
            var c = b.defaultValue;
            a._wrapperState = {
                initialChecked: null != b.checked ? b.checked : b.defaultChecked,
                initialValue: null != b.value ? b.value : c,
                controlled: "checkbox" === b.type || "radio" === b.type ? null != b.checked : null != b.value
            };
        },
        updateWrapper: function(a, b) {
            var c = b.checked;
            null != c && hc.setValueForProperty(a, "checked", c || !1), null != (c = b.value) ? 0 === c && "" === a.value ? a.value = "0" : "number" === b.type ? (c != (b = parseFloat(a.value) || 0) || c == b && a.value != c) && (a.value = "" + c) : a.value !== "" + c && (a.value = "" + c) : (null == b.value && null != b.defaultValue && a.defaultValue !== "" + b.defaultValue && (a.defaultValue = "" + b.defaultValue), 
            null == b.checked && null != b.defaultChecked && (a.defaultChecked = !!b.defaultChecked));
        },
        postMountWrapper: function(a, b) {
            switch (b.type) {
              case "submit":
              case "reset":
                break;

              case "color":
              case "date":
              case "datetime":
              case "datetime-local":
              case "month":
              case "time":
              case "week":
                a.value = "", a.value = a.defaultValue;
                break;

              default:
                a.value = a.value;
            }
            "" !== (b = a.name) && (a.name = ""), a.defaultChecked = !a.defaultChecked, a.defaultChecked = !a.defaultChecked, 
            "" !== b && (a.name = b);
        },
        restoreControlledState: function(a, b) {
            mc.updateWrapper(a, b);
            var c = b.name;
            if ("radio" === b.type && null != c) {
                for (b = a; b.parentNode; ) b = b.parentNode;
                for (c = b.querySelectorAll("input[name=" + JSON.stringify("" + c) + '][type="radio"]'), 
                b = 0; b < c.length; b++) {
                    var d = c[b];
                    if (d !== a && d.form === a.form) {
                        var e = G.getFiberCurrentPropsFromNode(d);
                        e || w("90"), mc.updateWrapper(d, e);
                    }
                }
            }
        }
    }, qc = mc, sc = {
        validateProps: function() {},
        postMountWrapper: function(a, b) {
            null != b.value && a.setAttribute("value", b.value);
        },
        getHostProps: function(a, b) {
            return a = n({
                children: void 0
            }, b), (b = rc(b.children)) && (a.children = b), a;
        }
    }, uc = {
        getHostProps: function(a, b) {
            return n({}, b, {
                value: void 0
            });
        },
        initWrapperState: function(a, b) {
            var c = b.value;
            a._wrapperState = {
                initialValue: null != c ? c : b.defaultValue,
                wasMultiple: !!b.multiple
            };
        },
        postMountWrapper: function(a, b) {
            a.multiple = !!b.multiple;
            var c = b.value;
            null != c ? tc(a, !!b.multiple, c) : null != b.defaultValue && tc(a, !!b.multiple, b.defaultValue);
        },
        postUpdateWrapper: function(a, b) {
            a._wrapperState.initialValue = void 0;
            var c = a._wrapperState.wasMultiple;
            a._wrapperState.wasMultiple = !!b.multiple;
            var d = b.value;
            null != d ? tc(a, !!b.multiple, d) : c !== !!b.multiple && (null != b.defaultValue ? tc(a, !!b.multiple, b.defaultValue) : tc(a, !!b.multiple, b.multiple ? [] : ""));
        },
        restoreControlledState: function(a, b) {
            var c = b.value;
            null != c && tc(a, !!b.multiple, c);
        }
    }, vc = {
        getHostProps: function(a, b) {
            return null != b.dangerouslySetInnerHTML && w("91"), n({}, b, {
                value: void 0,
                defaultValue: void 0,
                children: "" + a._wrapperState.initialValue
            });
        },
        initWrapperState: function(a, b) {
            var c = b.value, d = c;
            null == c && (c = b.defaultValue, null != (b = b.children) && (null != c && w("92"), 
            Array.isArray(b) && (1 >= b.length || w("93"), b = b[0]), c = "" + b), null == c && (c = ""), 
            d = c), a._wrapperState = {
                initialValue: "" + d
            };
        },
        updateWrapper: function(a, b) {
            var c = b.value;
            null != c && ((c = "" + c) !== a.value && (a.value = c), null == b.defaultValue && (a.defaultValue = c)), 
            null != b.defaultValue && (a.defaultValue = b.defaultValue);
        },
        postMountWrapper: function(a) {
            var b = a.textContent;
            b === a._wrapperState.initialValue && (a.value = b);
        },
        restoreControlledState: function(a, b) {
            vc.updateWrapper(a, b);
        }
    }, wc = vc, xc = n({
        menuitem: !0
    }, {
        area: !0,
        base: !0,
        br: !0,
        col: !0,
        embed: !0,
        hr: !0,
        img: !0,
        input: !0,
        keygen: !0,
        link: !0,
        meta: !0,
        param: !0,
        source: !0,
        track: !0,
        wbr: !0
    }), Bc = {
        _getTrackerFromNode: function(a) {
            return a._valueTracker;
        },
        track: function(a) {
            a._valueTracker || (a._valueTracker = Ac(a));
        },
        updateValueIfChanged: function(a) {
            if (!a) return !1;
            var b = a._valueTracker;
            if (!b) return !0;
            var c = b.getValue(), d = "";
            return a && (d = zc(a) ? a.checked ? "true" : "false" : a.value), (a = d) !== c && (b.setValue(a), 
            !0);
        },
        stopTracking: function(a) {
            (a = a._valueTracker) && a.stopTracking();
        }
    }, Dc = ka.Namespaces, Fc = function(a) {
        return "undefined" != typeof MSApp && MSApp.execUnsafeLocalFunction ? function(b, c, d, e) {
            MSApp.execUnsafeLocalFunction(function() {
                return a(b, c);
            });
        } : a;
    }(function(a, b) {
        if (a.namespaceURI !== Dc.svg || "innerHTML" in a) a.innerHTML = b; else for (Ec = Ec || document.createElement("div"), 
        Ec.innerHTML = "<svg>" + b + "</svg>", b = Ec.firstChild; b.firstChild; ) a.appendChild(b.firstChild);
    }), Gc = /["'&<>]/, Hc = F.TEXT_NODE;
    l.canUseDOM && ("textContent" in document.documentElement || (Ic = function(a, b) {
        if (a.nodeType === Hc) a.nodeValue = b; else {
            if ("boolean" == typeof b || "number" == typeof b) b = "" + b; else {
                b = "" + b;
                var c = Gc.exec(b);
                if (c) {
                    var e, d = "", f = 0;
                    for (e = c.index; e < b.length; e++) {
                        switch (b.charCodeAt(e)) {
                          case 34:
                            c = "&quot;";
                            break;

                          case 38:
                            c = "&amp;";
                            break;

                          case 39:
                            c = "&#x27;";
                            break;

                          case 60:
                            c = "&lt;";
                            break;

                          case 62:
                            c = "&gt;";
                            break;

                          default:
                            continue;
                        }
                        f !== e && (d += b.substring(f, e)), f = e + 1, d += c;
                    }
                    b = f !== e ? d + b.substring(f, e) : d;
                }
            }
            Fc(a, b);
        }
    }));
    var Jc = Ic, Lc = (lc.getCurrentFiberOwnerName, F.DOCUMENT_NODE), Mc = F.DOCUMENT_FRAGMENT_NODE, Nc = M.listenTo, Oc = sa.registrationNameModules, Pc = ka.Namespaces.html, Qc = ka.getIntrinsicNamespace, Sc = {
        topAbort: "abort",
        topCanPlay: "canplay",
        topCanPlayThrough: "canplaythrough",
        topDurationChange: "durationchange",
        topEmptied: "emptied",
        topEncrypted: "encrypted",
        topEnded: "ended",
        topError: "error",
        topLoadedData: "loadeddata",
        topLoadedMetadata: "loadedmetadata",
        topLoadStart: "loadstart",
        topPause: "pause",
        topPlay: "play",
        topPlaying: "playing",
        topProgress: "progress",
        topRateChange: "ratechange",
        topSeeked: "seeked",
        topSeeking: "seeking",
        topStalled: "stalled",
        topSuspend: "suspend",
        topTimeUpdate: "timeupdate",
        topVolumeChange: "volumechange",
        topWaiting: "waiting"
    }, N = {
        createElement: function(a, b, c, d) {
            return c = c.nodeType === Lc ? c : c.ownerDocument, d === Pc && (d = Qc(a)), d === Pc ? "script" === a ? (a = c.createElement("div"), 
            a.innerHTML = "<script><\/script>", a = a.removeChild(a.firstChild)) : a = "string" == typeof b.is ? c.createElement(a, {
                is: b.is
            }) : c.createElement(a) : a = c.createElementNS(d, a), a;
        },
        createTextNode: function(a, b) {
            return (b.nodeType === Lc ? b : b.ownerDocument).createTextNode(a);
        },
        setInitialProperties: function(a, b, c, d) {
            var e = Cc(b, c);
            switch (b) {
              case "iframe":
              case "object":
                M.trapBubbledEvent("topLoad", "load", a);
                var f = c;
                break;

              case "video":
              case "audio":
                for (f in Sc) Sc.hasOwnProperty(f) && M.trapBubbledEvent(f, Sc[f], a);
                f = c;
                break;

              case "source":
                M.trapBubbledEvent("topError", "error", a), f = c;
                break;

              case "img":
              case "image":
                M.trapBubbledEvent("topError", "error", a), M.trapBubbledEvent("topLoad", "load", a), 
                f = c;
                break;

              case "form":
                M.trapBubbledEvent("topReset", "reset", a), M.trapBubbledEvent("topSubmit", "submit", a), 
                f = c;
                break;

              case "details":
                M.trapBubbledEvent("topToggle", "toggle", a), f = c;
                break;

              case "input":
                qc.initWrapperState(a, c), f = qc.getHostProps(a, c), M.trapBubbledEvent("topInvalid", "invalid", a), 
                Rc(d, "onChange");
                break;

              case "option":
                sc.validateProps(a, c), f = sc.getHostProps(a, c);
                break;

              case "select":
                uc.initWrapperState(a, c), f = uc.getHostProps(a, c), M.trapBubbledEvent("topInvalid", "invalid", a), 
                Rc(d, "onChange");
                break;

              case "textarea":
                wc.initWrapperState(a, c), f = wc.getHostProps(a, c), M.trapBubbledEvent("topInvalid", "invalid", a), 
                Rc(d, "onChange");
                break;

              default:
                f = c;
            }
            yc(b, f);
            var h, g = f;
            for (h in g) if (g.hasOwnProperty(h)) {
                var k = g[h];
                "style" === h ? bc.setValueForStyles(a, k) : "dangerouslySetInnerHTML" === h ? null != (k = k ? k.__html : void 0) && Fc(a, k) : "children" === h ? "string" == typeof k ? Jc(a, k) : "number" == typeof k && Jc(a, "" + k) : "suppressContentEditableWarning" !== h && (Oc.hasOwnProperty(h) ? null != k && Rc(d, h) : e ? hc.setValueForAttribute(a, h, k) : null != k && hc.setValueForProperty(a, h, k));
            }
            switch (b) {
              case "input":
                Bc.track(a), qc.postMountWrapper(a, c);
                break;

              case "textarea":
                Bc.track(a), wc.postMountWrapper(a, c);
                break;

              case "option":
                sc.postMountWrapper(a, c);
                break;

              case "select":
                uc.postMountWrapper(a, c);
                break;

              default:
                "function" == typeof f.onClick && (a.onclick = ca);
            }
        },
        diffProperties: function(a, b, c, d, e) {
            var f = null;
            switch (b) {
              case "input":
                c = qc.getHostProps(a, c), d = qc.getHostProps(a, d), f = [];
                break;

              case "option":
                c = sc.getHostProps(a, c), d = sc.getHostProps(a, d), f = [];
                break;

              case "select":
                c = uc.getHostProps(a, c), d = uc.getHostProps(a, d), f = [];
                break;

              case "textarea":
                c = wc.getHostProps(a, c), d = wc.getHostProps(a, d), f = [];
                break;

              default:
                "function" != typeof c.onClick && "function" == typeof d.onClick && (a.onclick = ca);
            }
            yc(b, d);
            var g, h;
            a = null;
            for (g in c) if (!d.hasOwnProperty(g) && c.hasOwnProperty(g) && null != c[g]) if ("style" === g) for (h in b = c[g]) b.hasOwnProperty(h) && (a || (a = {}), 
            a[h] = ""); else "dangerouslySetInnerHTML" !== g && "children" !== g && "suppressContentEditableWarning" !== g && (Oc.hasOwnProperty(g) ? f || (f = []) : (f = f || []).push(g, null));
            for (g in d) {
                var k = d[g];
                if (b = null != c ? c[g] : void 0, d.hasOwnProperty(g) && k !== b && (null != k || null != b)) if ("style" === g) if (b) {
                    for (h in b) !b.hasOwnProperty(h) || k && k.hasOwnProperty(h) || (a || (a = {}), 
                    a[h] = "");
                    for (h in k) k.hasOwnProperty(h) && b[h] !== k[h] && (a || (a = {}), a[h] = k[h]);
                } else a || (f || (f = []), f.push(g, a)), a = k; else "dangerouslySetInnerHTML" === g ? (k = k ? k.__html : void 0, 
                b = b ? b.__html : void 0, null != k && b !== k && (f = f || []).push(g, "" + k)) : "children" === g ? b === k || "string" != typeof k && "number" != typeof k || (f = f || []).push(g, "" + k) : "suppressContentEditableWarning" !== g && (Oc.hasOwnProperty(g) ? (null != k && Rc(e, g), 
                f || b === k || (f = [])) : (f = f || []).push(g, k));
            }
            return a && (f = f || []).push("style", a), f;
        },
        updateProperties: function(a, b, c, d, e) {
            Cc(c, d), d = Cc(c, e);
            for (var f = 0; f < b.length; f += 2) {
                var g = b[f], h = b[f + 1];
                "style" === g ? bc.setValueForStyles(a, h) : "dangerouslySetInnerHTML" === g ? Fc(a, h) : "children" === g ? Jc(a, h) : d ? null != h ? hc.setValueForAttribute(a, g, h) : hc.deleteValueForAttribute(a, g) : null != h ? hc.setValueForProperty(a, g, h) : hc.deleteValueForProperty(a, g);
            }
            switch (c) {
              case "input":
                qc.updateWrapper(a, e), Bc.updateValueIfChanged(a);
                break;

              case "textarea":
                wc.updateWrapper(a, e);
                break;

              case "select":
                uc.postUpdateWrapper(a, e);
            }
        },
        diffHydratedProperties: function(a, b, c, d, e) {
            switch (b) {
              case "iframe":
              case "object":
                M.trapBubbledEvent("topLoad", "load", a);
                break;

              case "video":
              case "audio":
                for (var f in Sc) Sc.hasOwnProperty(f) && M.trapBubbledEvent(f, Sc[f], a);
                break;

              case "source":
                M.trapBubbledEvent("topError", "error", a);
                break;

              case "img":
              case "image":
                M.trapBubbledEvent("topError", "error", a), M.trapBubbledEvent("topLoad", "load", a);
                break;

              case "form":
                M.trapBubbledEvent("topReset", "reset", a), M.trapBubbledEvent("topSubmit", "submit", a);
                break;

              case "details":
                M.trapBubbledEvent("topToggle", "toggle", a);
                break;

              case "input":
                qc.initWrapperState(a, c), M.trapBubbledEvent("topInvalid", "invalid", a), Rc(e, "onChange");
                break;

              case "option":
                sc.validateProps(a, c);
                break;

              case "select":
                uc.initWrapperState(a, c), M.trapBubbledEvent("topInvalid", "invalid", a), Rc(e, "onChange");
                break;

              case "textarea":
                wc.initWrapperState(a, c), M.trapBubbledEvent("topInvalid", "invalid", a), Rc(e, "onChange");
            }
            yc(b, c), d = null;
            for (var g in c) c.hasOwnProperty(g) && (f = c[g], "children" === g ? "string" == typeof f ? a.textContent !== f && (d = [ "children", f ]) : "number" == typeof f && a.textContent !== "" + f && (d = [ "children", "" + f ]) : Oc.hasOwnProperty(g) && null != f && Rc(e, g));
            switch (b) {
              case "input":
                Bc.track(a), qc.postMountWrapper(a, c);
                break;

              case "textarea":
                Bc.track(a), wc.postMountWrapper(a, c);
                break;

              case "select":
              case "option":
                break;

              default:
                "function" == typeof c.onClick && (a.onclick = ca);
            }
            return d;
        },
        diffHydratedText: function(a, b) {
            return a.nodeValue !== b;
        },
        warnForDeletedHydratableElement: function() {},
        warnForDeletedHydratableText: function() {},
        warnForInsertedHydratedElement: function() {},
        warnForInsertedHydratedText: function() {},
        restoreControlledState: function(a, b, c) {
            switch (b) {
              case "input":
                qc.restoreControlledState(a, c);
                break;

              case "textarea":
                wc.restoreControlledState(a, c);
                break;

              case "select":
                uc.restoreControlledState(a, c);
            }
        }
    }, Tc = void 0;
    if (l.canUseDOM) if ("function" != typeof requestIdleCallback) {
        var Uc = null, Vc = null, Wc = !1, Xc = !1, Yc = 0, Zc = 33, $c = 33, ad = {
            timeRemaining: "object" == typeof performance && "function" == typeof performance.now ? function() {
                return Yc - performance.now();
            } : function() {
                return Yc - Date.now();
            }
        }, bd = "__reactIdleCallback$" + Math.random().toString(36).slice(2);
        window.addEventListener("message", function(a) {
            a.source === window && a.data === bd && (Wc = !1, a = Vc, Vc = null, null !== a && a(ad));
        }, !1);
        var cd = function(a) {
            Xc = !1;
            var b = a - Yc + $c;
            b < $c && Zc < $c ? (8 > b && (b = 8), $c = b < Zc ? Zc : b) : Zc = b, Yc = a + $c, 
            Wc || (Wc = !0, window.postMessage(bd, "*")), b = Uc, Uc = null, null !== b && b(a);
        };
        Tc = function(a) {
            return Vc = a, Xc || (Xc = !0, requestAnimationFrame(cd)), 0;
        };
    } else Tc = requestIdleCallback; else Tc = function(a) {
        return setTimeout(function() {
            a({
                timeRemaining: function() {
                    return 1 / 0;
                }
            });
        }), 0;
    };
    var je, ke, dd = {
        rIC: Tc
    }, ed = {
        enableAsyncSubtreeAPI: !0
    }, Q = {
        NoWork: 0,
        SynchronousPriority: 1,
        TaskPriority: 2,
        HighPriority: 3,
        LowPriority: 4,
        OffscreenPriority: 5
    }, fd = J.Callback, gd = Q.NoWork, hd = Q.SynchronousPriority, id = Q.TaskPriority, jd = E.ClassComponent, kd = E.HostRoot, md = void 0, nd = void 0, ud = {
        addUpdate: function(a, b, c, d) {
            sd(a, {
                priorityLevel: d,
                partialState: b,
                callback: c,
                isReplace: !1,
                isForced: !1,
                isTopLevelUnmount: !1,
                next: null
            });
        },
        addReplaceUpdate: function(a, b, c, d) {
            sd(a, {
                priorityLevel: d,
                partialState: b,
                callback: c,
                isReplace: !0,
                isForced: !1,
                isTopLevelUnmount: !1,
                next: null
            });
        },
        addForceUpdate: function(a, b, c) {
            sd(a, {
                priorityLevel: c,
                partialState: null,
                callback: b,
                isReplace: !1,
                isForced: !0,
                isTopLevelUnmount: !1,
                next: null
            });
        },
        getUpdatePriority: function(a) {
            var b = a.updateQueue;
            return null === b || a.tag !== jd && a.tag !== kd ? gd : null !== b.first ? b.first.priorityLevel : gd;
        },
        addTopLevelUpdate: function(a, b, c, d) {
            var e = null === b.element;
            a = sd(a, b = {
                priorityLevel: d,
                partialState: b,
                callback: c,
                isReplace: !1,
                isForced: !1,
                isTopLevelUnmount: e,
                next: null
            }), e && (e = md, c = nd, null !== e && null !== b.next && (b.next = null, e.last = b), 
            null !== c && null !== a && null !== a.next && (a.next = null, c.last = b));
        },
        beginUpdateQueue: function(a, b, c, d, e, f, g) {
            null !== a && a.updateQueue === c && (c = b.updateQueue = {
                first: c.first,
                last: c.last,
                callbackList: null,
                hasForceUpdate: !1
            }), a = c.callbackList;
            for (var h = c.hasForceUpdate, k = !0, p = c.first; null !== p && 0 >= od(p.priorityLevel, g); ) {
                c.first = p.next, null === c.first && (c.last = null);
                var x;
                p.isReplace ? (e = td(p, d, e, f), k = !0) : (x = td(p, d, e, f)) && (e = k ? n({}, e, x) : n(e, x), 
                k = !1), p.isForced && (h = !0), null === p.callback || p.isTopLevelUnmount && null !== p.next || ((a = null !== a ? a : []).push(p.callback), 
                b.effectTag |= fd), p = p.next;
            }
            return c.callbackList = a, c.hasForceUpdate = h, null !== c.first || null !== a || h || (b.updateQueue = null), 
            e;
        },
        commitCallbacks: function(a, b, c) {
            if (null !== (a = b.callbackList)) for (b.callbackList = null, b = 0; b < a.length; b++) {
                var d = a[b];
                "function" != typeof d && w("191", d), d.call(c);
            }
        }
    }, vd = [], wd = -1, xd = {
        createCursor: function(a) {
            return {
                current: a
            };
        },
        isEmpty: function() {
            return -1 === wd;
        },
        pop: function(a) {
            0 > wd || (a.current = vd[wd], vd[wd] = null, wd--);
        },
        push: function(a, b) {
            vd[++wd] = a.current, a.current = b;
        },
        reset: function() {
            for (;-1 < wd; ) vd[wd] = null, wd--;
        }
    }, yd = bb.isFiberMounted, zd = E.ClassComponent, Ad = E.HostRoot, Bd = xd.createCursor, Cd = xd.pop, Dd = xd.push, Ed = Bd(da), Fd = Bd(!1), Ld = da, R = {
        getUnmaskedContext: function(a) {
            return Nd(a) ? Ld : Ed.current;
        },
        cacheContext: Md,
        getMaskedContext: function(a, b) {
            var c = a.type.contextTypes;
            if (!c) return da;
            var d = a.stateNode;
            if (d && d.__reactInternalMemoizedUnmaskedChildContext === b) return d.__reactInternalMemoizedMaskedChildContext;
            var f, e = {};
            for (f in c) e[f] = b[f];
            return d && Md(a, b, e), e;
        },
        hasContextChanged: function() {
            return Fd.current;
        },
        isContextConsumer: function(a) {
            return a.tag === zd && null != a.type.contextTypes;
        },
        isContextProvider: Nd,
        popContextProvider: function(a) {
            Nd(a) && (Cd(Fd, a), Cd(Ed, a));
        },
        popTopLevelContextObject: function(a) {
            Cd(Fd, a), Cd(Ed, a);
        },
        pushTopLevelContextObject: function(a, b, c) {
            null != Ed.cursor && w("168"), Dd(Ed, b, a), Dd(Fd, c, a);
        },
        processChildContext: Od,
        pushContextProvider: function(a) {
            if (!Nd(a)) return !1;
            var b = a.stateNode;
            return b = b && b.__reactInternalMemoizedMergedChildContext || da, Ld = Ed.current, 
            Dd(Ed, b, a), Dd(Fd, Fd.current, a), !0;
        },
        invalidateContextProvider: function(a, b) {
            var c = a.stateNode;
            if (c || w("169"), b) {
                var d = Od(a, Ld);
                c.__reactInternalMemoizedMergedChildContext = d, Cd(Fd, a), Cd(Ed, a), Dd(Ed, d, a);
            } else Cd(Fd, a);
            Dd(Fd, b, a);
        },
        resetContext: function() {
            Ld = da, Ed.current = da, Fd.current = !1;
        },
        findCurrentUnmaskedContext: function(a) {
            for (yd(a) && a.tag === zd ? void 0 : w("170"); a.tag !== Ad; ) {
                if (Nd(a)) return a.stateNode.__reactInternalMemoizedMergedChildContext;
                (a = a.return) || w("171");
            }
            return a.stateNode.context;
        }
    }, Pd = {
        NoContext: 0,
        AsyncUpdates: 1
    }, Qd = E.IndeterminateComponent, Rd = E.ClassComponent, Sd = E.HostRoot, Td = E.HostComponent, Ud = E.HostText, Vd = E.HostPortal, Wd = E.CoroutineComponent, Xd = E.YieldComponent, Yd = E.Fragment, Zd = Q.NoWork, $d = Pd.NoContext, ae = J.NoEffect, de = {
        createWorkInProgress: function(a, b) {
            var c = a.alternate;
            return null === c ? (c = new be(a.tag, a.key, a.internalContextTag), c.type = a.type, 
            c.stateNode = a.stateNode, c.alternate = a, a.alternate = c) : (c.effectTag = ae, 
            c.nextEffect = null, c.firstEffect = null, c.lastEffect = null), c.pendingWorkPriority = b, 
            c.child = a.child, c.memoizedProps = a.memoizedProps, c.memoizedState = a.memoizedState, 
            c.updateQueue = a.updateQueue, c.sibling = a.sibling, c.index = a.index, c.ref = a.ref, 
            c;
        },
        createHostRootFiber: function() {
            return new be(Sd, null, $d);
        },
        createFiberFromElement: function(a, b, c) {
            return b = ce(a.type, a.key, b), b.pendingProps = a.props, b.pendingWorkPriority = c, 
            b;
        },
        createFiberFromFragment: function(a, b, c) {
            return b = new be(Yd, null, b), b.pendingProps = a, b.pendingWorkPriority = c, b;
        },
        createFiberFromText: function(a, b, c) {
            return b = new be(Ud, null, b), b.pendingProps = a, b.pendingWorkPriority = c, b;
        },
        createFiberFromElementType: ce,
        createFiberFromHostInstanceForDeletion: function() {
            var a = new be(Td, null, $d);
            return a.type = "DELETED", a;
        },
        createFiberFromCoroutine: function(a, b, c) {
            return b = new be(Wd, a.key, b), b.type = a.handler, b.pendingProps = a, b.pendingWorkPriority = c, 
            b;
        },
        createFiberFromYield: function(a, b) {
            return new be(Xd, null, b);
        },
        createFiberFromPortal: function(a, b, c) {
            return b = new be(Vd, a.key, b), b.pendingProps = a.children || [], b.pendingWorkPriority = c, 
            b.stateNode = {
                containerInfo: a.containerInfo,
                implementation: a.implementation
            }, b;
        },
        largerPriority: function(a, b) {
            return a !== Zd && (b === Zd || b > a) ? a : b;
        }
    }, ee = de.createHostRootFiber, fe = E.IndeterminateComponent, ge = E.FunctionalComponent, he = E.ClassComponent, ie = E.HostComponent;
    "function" == typeof Symbol && Symbol.for ? (je = Symbol.for("react.coroutine"), 
    ke = Symbol.for("react.yield")) : (je = 60104, ke = 60105);
    var le = {
        createCoroutine: function(a, b, c) {
            var d = 3 < arguments.length && void 0 !== arguments[3] ? arguments[3] : null;
            return {
                $$typeof: je,
                key: null == d ? null : "" + d,
                children: a,
                handler: b,
                props: c
            };
        },
        createYield: function(a) {
            return {
                $$typeof: ke,
                value: a
            };
        },
        isCoroutine: function(a) {
            return "object" == typeof a && null !== a && a.$$typeof === je;
        },
        isYield: function(a) {
            return "object" == typeof a && null !== a && a.$$typeof === ke;
        },
        REACT_YIELD_TYPE: ke,
        REACT_COROUTINE_TYPE: je
    }, me = "function" == typeof Symbol && Symbol.for && Symbol.for("react.portal") || 60106, ne = {
        createPortal: function(a, b, c) {
            var d = 3 < arguments.length && void 0 !== arguments[3] ? arguments[3] : null;
            return {
                $$typeof: me,
                key: null == d ? null : "" + d,
                children: a,
                containerInfo: b,
                implementation: c
            };
        },
        isPortal: function(a) {
            return "object" == typeof a && null !== a && a.$$typeof === me;
        },
        REACT_PORTAL_TYPE: me
    }, oe = le.REACT_COROUTINE_TYPE, pe = le.REACT_YIELD_TYPE, qe = ne.REACT_PORTAL_TYPE, re = de.createWorkInProgress, se = de.createFiberFromElement, te = de.createFiberFromFragment, ue = de.createFiberFromText, ve = de.createFiberFromCoroutine, we = de.createFiberFromYield, xe = de.createFiberFromPortal, ye = Array.isArray, ze = E.FunctionalComponent, Ae = E.ClassComponent, Be = E.HostText, Ce = E.HostPortal, De = E.CoroutineComponent, Ee = E.YieldComponent, Fe = E.Fragment, Ge = J.NoEffect, He = J.Placement, Ie = J.Deletion, Je = "function" == typeof Symbol && Symbol.iterator, Ke = "function" == typeof Symbol && Symbol.for && Symbol.for("react.element") || 60103, Se = {
        reconcileChildFibers: Oe(!0, !0),
        reconcileChildFibersInPlace: Oe(!1, !0),
        mountChildFibersInPlace: Oe(!1, !1),
        cloneChildFibers: function(a, b) {
            if (null !== a && b.child !== a.child && w("153"), null !== b.child) {
                a = b.child;
                var c = re(a, a.pendingWorkPriority);
                for (c.pendingProps = a.pendingProps, b.child = c, c.return = b; null !== a.sibling; ) a = a.sibling, 
                c = c.sibling = re(a, a.pendingWorkPriority), c.pendingProps = a.pendingProps, c.return = b;
                c.sibling = null;
            }
        }
    }, Te = J.Update, Ue = Pd.AsyncUpdates, Ve = R.cacheContext, We = R.getMaskedContext, Xe = R.getUnmaskedContext, Ye = R.isContextConsumer, Ze = ud.addUpdate, $e = ud.addReplaceUpdate, af = ud.addForceUpdate, bf = ud.beginUpdateQueue, cf = R.hasContextChanged, df = bb.isMounted, ff = Se.mountChildFibersInPlace, gf = Se.reconcileChildFibers, hf = Se.reconcileChildFibersInPlace, jf = Se.cloneChildFibers, kf = ud.beginUpdateQueue, lf = R.getMaskedContext, mf = R.getUnmaskedContext, nf = R.hasContextChanged, of = R.pushContextProvider, pf = R.pushTopLevelContextObject, qf = R.invalidateContextProvider, rf = E.IndeterminateComponent, sf = E.FunctionalComponent, tf = E.ClassComponent, uf = E.HostRoot, wf = E.HostComponent, xf = E.HostText, yf = E.HostPortal, zf = E.CoroutineComponent, Af = E.CoroutineHandlerPhase, Bf = E.YieldComponent, Cf = E.Fragment, Df = Q.NoWork, Ef = Q.OffscreenPriority, Ff = J.PerformedWork, Gf = J.Placement, Hf = J.ContentReset, If = J.Err, Jf = J.Ref, Kf = Qa.ReactCurrentOwner, Mf = Se.reconcileChildFibers, Nf = R.popContextProvider, Of = R.popTopLevelContextObject, Pf = E.IndeterminateComponent, Qf = E.FunctionalComponent, Rf = E.ClassComponent, Sf = E.HostRoot, Tf = E.HostComponent, Uf = E.HostText, Vf = E.HostPortal, Wf = E.CoroutineComponent, Xf = E.CoroutineHandlerPhase, Yf = E.YieldComponent, Zf = E.Fragment, ag = J.Placement, bg = J.Ref, cg = J.Update, dg = Q.OffscreenPriority, fg = null, gg = null, ig = {
        injectInternals: function(a) {
            if ("undefined" == typeof __REACT_DEVTOOLS_GLOBAL_HOOK__) return !1;
            var b = __REACT_DEVTOOLS_GLOBAL_HOOK__;
            if (!b.supportsFiber) return !0;
            try {
                var c = b.inject(a);
                fg = hg(function(a) {
                    return b.onCommitFiberRoot(c, a);
                }), gg = hg(function(a) {
                    return b.onCommitFiberUnmount(c, a);
                });
            } catch (d) {}
            return !0;
        },
        onCommitRoot: function(a) {
            "function" == typeof fg && fg(a);
        },
        onCommitUnmount: function(a) {
            "function" == typeof gg && gg(a);
        }
    }, jg = E.ClassComponent, kg = E.HostRoot, lg = E.HostComponent, mg = E.HostText, ng = E.HostPortal, og = E.CoroutineComponent, pg = ud.commitCallbacks, qg = ig.onCommitUnmount, rg = J.Placement, sg = J.Update, tg = J.Callback, ug = J.ContentReset, wg = xd.createCursor, xg = xd.pop, yg = xd.push, zg = {}, Bg = E.HostComponent, Cg = E.HostText, Dg = E.HostRoot, Eg = J.Deletion, Fg = J.Placement, Gg = de.createFiberFromHostInstanceForDeletion, Ig = R.popContextProvider, Jg = xd.reset, Kg = Qa.ReactCurrentOwner, Lg = de.createWorkInProgress, Mg = de.largerPriority, Ng = ig.onCommitRoot, T = Q.NoWork, Og = Q.SynchronousPriority, U = Q.TaskPriority, Pg = Q.HighPriority, Qg = Q.LowPriority, Rg = Q.OffscreenPriority, Sg = Pd.AsyncUpdates, Tg = J.PerformedWork, Ug = J.Placement, Vg = J.Update, Wg = J.PlacementAndUpdate, Xg = J.Deletion, Yg = J.ContentReset, Zg = J.Callback, $g = J.Err, ah = J.Ref, bh = E.HostRoot, ch = E.HostComponent, dh = E.HostPortal, eh = E.ClassComponent, fh = ud.getUpdatePriority, gh = R.resetContext;
    jh._injectFiber = function(a) {
        ih = a;
    };
    var kh = ud.addTopLevelUpdate, lh = R.findCurrentUnmaskedContext, mh = R.isContextProvider, nh = R.processChildContext, oh = E.HostComponent, ph = bb.findCurrentHostFiber, qh = bb.findCurrentHostFiberWithNoPortals;
    jh._injectFiber(function(a) {
        var b = lh(a);
        return mh(a) ? nh(a, b, !1) : b;
    });
    var rh = F.TEXT_NODE, uh = null, wh = {
        getOffsets: function(a) {
            var b = window.getSelection && window.getSelection();
            if (!b || 0 === b.rangeCount) return null;
            var c = b.anchorNode, d = b.anchorOffset, e = b.focusNode, f = b.focusOffset, g = b.getRangeAt(0);
            try {
                g.startContainer.nodeType, g.endContainer.nodeType;
            } catch (k) {
                return null;
            }
            b = b.anchorNode === b.focusNode && b.anchorOffset === b.focusOffset ? 0 : g.toString().length;
            var h = g.cloneRange();
            return h.selectNodeContents(a), h.setEnd(g.startContainer, g.startOffset), a = h.startContainer === h.endContainer && h.startOffset === h.endOffset ? 0 : h.toString().length, 
            g = a + b, (b = document.createRange()).setStart(c, d), b.setEnd(e, f), c = b.collapsed, 
            {
                start: c ? g : a,
                end: c ? a : g
            };
        },
        setOffsets: function(a, b) {
            if (window.getSelection) {
                var c = window.getSelection(), d = a[vh()].length, e = Math.min(b.start, d);
                if (b = void 0 === b.end ? e : Math.min(b.end, d), !c.extend && e > b && (d = b, 
                b = e, e = d), d = th(a, e), a = th(a, b), d && a) {
                    var f = document.createRange();
                    f.setStart(d.node, d.offset), c.removeAllRanges(), e > b ? (c.addRange(f), c.extend(a.node, a.offset)) : (f.setEnd(a.node, a.offset), 
                    c.addRange(f));
                }
            }
        }
    }, xh = F.ELEMENT_NODE, yh = {
        hasSelectionCapabilities: function(a) {
            var b = a && a.nodeName && a.nodeName.toLowerCase();
            return b && ("input" === b && "text" === a.type || "textarea" === b || "true" === a.contentEditable);
        },
        getSelectionInformation: function() {
            var a = ia();
            return {
                focusedElem: a,
                selectionRange: yh.hasSelectionCapabilities(a) ? yh.getSelection(a) : null
            };
        },
        restoreSelection: function(a) {
            var b = ia(), c = a.focusedElem;
            if (a = a.selectionRange, b !== c && fa(document.documentElement, c)) {
                for (yh.hasSelectionCapabilities(c) && yh.setSelection(c, a), b = [], a = c; a = a.parentNode; ) a.nodeType === xh && b.push({
                    element: a,
                    left: a.scrollLeft,
                    top: a.scrollTop
                });
                for (ha(c), c = 0; c < b.length; c++) a = b[c], a.element.scrollLeft = a.left, a.element.scrollTop = a.top;
            }
        },
        getSelection: function(a) {
            return ("selectionStart" in a ? {
                start: a.selectionStart,
                end: a.selectionEnd
            } : wh.getOffsets(a)) || {
                start: 0,
                end: 0
            };
        },
        setSelection: function(a, b) {
            var c = b.start, d = b.end;
            void 0 === d && (d = c), "selectionStart" in a ? (a.selectionStart = c, a.selectionEnd = Math.min(d, a.value.length)) : wh.setOffsets(a, b);
        }
    }, zh = yh, Ah = F.ELEMENT_NODE;
    Dh._injectFiber = function(a) {
        Bh = a;
    }, Dh._injectStack = function(a) {
        Ch = a;
    };
    var Eh = E.HostComponent, Hh = {
        isAncestor: function(a, b) {
            for (;b; ) {
                if (a === b || a === b.alternate) return !0;
                b = Fh(b);
            }
            return !1;
        },
        getLowestCommonAncestor: Gh,
        getParentInstance: function(a) {
            return Fh(a);
        },
        traverseTwoPhase: function(a, b, c) {
            for (var d = []; a; ) d.push(a), a = Fh(a);
            for (a = d.length; 0 < a--; ) b(d[a], "captured", c);
            for (a = 0; a < d.length; a++) b(d[a], "bubbled", c);
        },
        traverseEnterLeave: function(a, b, c, d, e) {
            for (var f = a && b ? Gh(a, b) : null, g = []; a && a !== f; ) g.push(a), a = Fh(a);
            for (a = []; b && b !== f; ) a.push(b), b = Fh(b);
            for (b = 0; b < g.length; b++) c(g[b], "bubbled", d);
            for (b = a.length; 0 < b--; ) c(a[b], "captured", e);
        }
    }, Ih = Jb.getListener, Th = {
        accumulateTwoPhaseDispatches: function(a) {
            Db(a, Kh);
        },
        accumulateTwoPhaseDispatchesSkipTarget: function(a) {
            Db(a, Qh);
        },
        accumulateDirectDispatches: function(a) {
            Db(a, Sh);
        },
        accumulateEnterLeaveDispatches: function(a, b, c, d) {
            Hh.traverseEnterLeave(c, d, Rh, a, b);
        }
    }, X = {
        _root: null,
        _startText: null,
        _fallbackText: null
    }, Uh = {
        initialize: function(a) {
            return X._root = a, X._startText = Uh.getText(), !0;
        },
        reset: function() {
            X._root = null, X._startText = null, X._fallbackText = null;
        },
        getData: function() {
            if (X._fallbackText) return X._fallbackText;
            var a, d, b = X._startText, c = b.length, e = Uh.getText(), f = e.length;
            for (a = 0; a < c && b[a] === e[a]; a++) ;
            var g = c - a;
            for (d = 1; d <= g && b[c - d] === e[f - d]; d++) ;
            return X._fallbackText = e.slice(a, 1 < d ? 1 - d : void 0), X._fallbackText;
        },
        getText: function() {
            return "value" in X._root ? X._root.value : X._root[vh()];
        }
    }, Vh = Uh, Wh = "dispatchConfig _targetInst nativeEvent isDefaultPrevented isPropagationStopped _dispatchListeners _dispatchInstances".split(" "), Xh = {
        type: null,
        target: null,
        currentTarget: ca.thatReturnsNull,
        eventPhase: null,
        bubbles: null,
        cancelable: null,
        timeStamp: function(a) {
            return a.timeStamp || Date.now();
        },
        defaultPrevented: null,
        isTrusted: null
    };
    n(Y.prototype, {
        preventDefault: function() {
            this.defaultPrevented = !0;
            var a = this.nativeEvent;
            a && (a.preventDefault ? a.preventDefault() : "unknown" != typeof a.returnValue && (a.returnValue = !1), 
            this.isDefaultPrevented = ca.thatReturnsTrue);
        },
        stopPropagation: function() {
            var a = this.nativeEvent;
            a && (a.stopPropagation ? a.stopPropagation() : "unknown" != typeof a.cancelBubble && (a.cancelBubble = !0), 
            this.isPropagationStopped = ca.thatReturnsTrue);
        },
        persist: function() {
            this.isPersistent = ca.thatReturnsTrue;
        },
        isPersistent: ca.thatReturnsFalse,
        destructor: function() {
            var b, a = this.constructor.Interface;
            for (b in a) this[b] = null;
            for (a = 0; a < Wh.length; a++) this[Wh[a]] = null;
        }
    }), Y.Interface = Xh, Y.augmentClass = function(a, b) {
        function c() {}
        c.prototype = this.prototype;
        var d = new c();
        n(d, a.prototype), a.prototype = d, a.prototype.constructor = a, a.Interface = n({}, this.Interface, b), 
        a.augmentClass = this.augmentClass, Yh(a);
    }, Yh(Y), Y.augmentClass(ai, {
        data: null
    }), Y.augmentClass(bi, {
        data: null
    });
    var ci = [ 9, 13, 27, 32 ], di = l.canUseDOM && "CompositionEvent" in window, ei = null;
    l.canUseDOM && "documentMode" in document && (ei = document.documentMode);
    var fi;
    if (fi = l.canUseDOM && "TextEvent" in window && !ei) {
        var gi = window.opera;
        fi = !("object" == typeof gi && "function" == typeof gi.version && 12 >= parseInt(gi.version(), 10));
    }
    var hi = fi, ii = l.canUseDOM && (!di || ei && 8 < ei && 11 >= ei), ji = String.fromCharCode(32), ki = {
        beforeInput: {
            phasedRegistrationNames: {
                bubbled: "onBeforeInput",
                captured: "onBeforeInputCapture"
            },
            dependencies: [ "topCompositionEnd", "topKeyPress", "topTextInput", "topPaste" ]
        },
        compositionEnd: {
            phasedRegistrationNames: {
                bubbled: "onCompositionEnd",
                captured: "onCompositionEndCapture"
            },
            dependencies: "topBlur topCompositionEnd topKeyDown topKeyPress topKeyUp topMouseDown".split(" ")
        },
        compositionStart: {
            phasedRegistrationNames: {
                bubbled: "onCompositionStart",
                captured: "onCompositionStartCapture"
            },
            dependencies: "topBlur topCompositionStart topKeyDown topKeyPress topKeyUp topMouseDown".split(" ")
        },
        compositionUpdate: {
            phasedRegistrationNames: {
                bubbled: "onCompositionUpdate",
                captured: "onCompositionUpdateCapture"
            },
            dependencies: "topBlur topCompositionUpdate topKeyDown topKeyPress topKeyUp topMouseDown".split(" ")
        }
    }, li = !1, oi = !1, ri = {
        eventTypes: ki,
        extractEvents: function(a, b, c, d) {
            var e;
            if (di) b: {
                switch (a) {
                  case "topCompositionStart":
                    var f = ki.compositionStart;
                    break b;

                  case "topCompositionEnd":
                    f = ki.compositionEnd;
                    break b;

                  case "topCompositionUpdate":
                    f = ki.compositionUpdate;
                    break b;
                }
                f = void 0;
            } else oi ? mi(a, c) && (f = ki.compositionEnd) : "topKeyDown" === a && 229 === c.keyCode && (f = ki.compositionStart);
            return f ? (ii && (oi || f !== ki.compositionStart ? f === ki.compositionEnd && oi && (e = Vh.getData()) : oi = Vh.initialize(d)), 
            f = ai.getPooled(f, b, c, d), e ? f.data = e : null !== (e = ni(c)) && (f.data = e), 
            Th.accumulateTwoPhaseDispatches(f), e = f) : e = null, (a = hi ? pi(a, c) : qi(a, c)) ? (b = bi.getPooled(ki.beforeInput, b, c, d), 
            b.data = a, Th.accumulateTwoPhaseDispatches(b)) : b = null, [ e, b ];
        }
    }, si = {
        color: !0,
        date: !0,
        datetime: !0,
        "datetime-local": !0,
        email: !0,
        month: !0,
        number: !0,
        password: !0,
        range: !0,
        search: !0,
        tel: !0,
        text: !0,
        time: !0,
        url: !0,
        week: !0
    }, ui = {
        change: {
            phasedRegistrationNames: {
                bubbled: "onChange",
                captured: "onChangeCapture"
            },
            dependencies: "topBlur topChange topClick topFocus topInput topKeyDown topKeyUp topSelectionChange".split(" ")
        }
    }, wi = null, xi = null, Bi = !1;
    l.canUseDOM && (Bi = Lb("input") && (!document.documentMode || 9 < document.documentMode));
    var Ii = {
        eventTypes: ui,
        _isInputEventSupported: Bi,
        extractEvents: function(a, b, c, d) {
            var e = b ? G.getNodeFromInstance(b) : window, f = e.nodeName && e.nodeName.toLowerCase();
            if ("select" === f || "input" === f && "file" === e.type) var g = Ai; else if (ti(e)) if (Bi) g = Hi; else {
                g = Fi;
                var h = Ei;
            } else !(f = e.nodeName) || "input" !== f.toLowerCase() || "checkbox" !== e.type && "radio" !== e.type || (g = Gi);
            if (g && (g = g(a, b))) return vi(g, c, d);
            h && h(a, e, b), "topBlur" === a && null != b && (a = b._wrapperState || e._wrapperState) && a.controlled && "number" === e.type && (a = "" + e.value, 
            e.getAttribute("value") !== a && e.setAttribute("value", a));
        }
    };
    Y.augmentClass(Ji, {
        view: function(a) {
            return a.view ? a.view : (a = ub(a)).window === a ? a : (a = a.ownerDocument) ? a.defaultView || a.parentWindow : window;
        },
        detail: function(a) {
            return a.detail || 0;
        }
    });
    var Ki = {
        Alt: "altKey",
        Control: "ctrlKey",
        Meta: "metaKey",
        Shift: "shiftKey"
    };
    Ji.augmentClass(Ni, {
        screenX: null,
        screenY: null,
        clientX: null,
        clientY: null,
        pageX: null,
        pageY: null,
        ctrlKey: null,
        shiftKey: null,
        altKey: null,
        metaKey: null,
        getModifierState: Mi,
        button: null,
        buttons: null,
        relatedTarget: function(a) {
            return a.relatedTarget || (a.fromElement === a.srcElement ? a.toElement : a.fromElement);
        }
    });
    var Oi = {
        mouseEnter: {
            registrationName: "onMouseEnter",
            dependencies: [ "topMouseOut", "topMouseOver" ]
        },
        mouseLeave: {
            registrationName: "onMouseLeave",
            dependencies: [ "topMouseOut", "topMouseOver" ]
        }
    }, Pi = {
        eventTypes: Oi,
        extractEvents: function(a, b, c, d) {
            if ("topMouseOver" === a && (c.relatedTarget || c.fromElement) || "topMouseOut" !== a && "topMouseOver" !== a) return null;
            var e = d.window === d ? d : (e = d.ownerDocument) ? e.defaultView || e.parentWindow : window;
            if ("topMouseOut" === a ? (a = b, b = (b = c.relatedTarget || c.toElement) ? G.getClosestInstanceFromNode(b) : null) : a = null, 
            a === b) return null;
            var f = null == a ? e : G.getNodeFromInstance(a);
            e = null == b ? e : G.getNodeFromInstance(b);
            var g = Ni.getPooled(Oi.mouseLeave, a, c, d);
            return g.type = "mouseleave", g.target = f, g.relatedTarget = e, c = Ni.getPooled(Oi.mouseEnter, b, c, d), 
            c.type = "mouseenter", c.target = e, c.relatedTarget = f, Th.accumulateEnterLeaveDispatches(g, c, a, b), 
            [ g, c ];
        }
    }, Qi = F.DOCUMENT_NODE, Ri = l.canUseDOM && "documentMode" in document && 11 >= document.documentMode, Si = {
        select: {
            phasedRegistrationNames: {
                bubbled: "onSelect",
                captured: "onSelectCapture"
            },
            dependencies: "topBlur topContextMenu topFocus topKeyDown topKeyUp topMouseDown topMouseUp topSelectionChange".split(" ")
        }
    }, Ti = null, Zi = null, $i = null, aj = !1, bj = M.isListeningToAllDependencies, dj = {
        eventTypes: Si,
        extractEvents: function(a, b, c, d) {
            var e = d.window === d ? d.document : d.nodeType === Qi ? d : d.ownerDocument;
            if (!e || !bj("onSelect", e)) return null;
            switch (e = b ? G.getNodeFromInstance(b) : window, a) {
              case "topFocus":
                (ti(e) || "true" === e.contentEditable) && (Ti = e, Zi = b, $i = null);
                break;

              case "topBlur":
                $i = Zi = Ti = null;
                break;

              case "topMouseDown":
                aj = !0;
                break;

              case "topContextMenu":
              case "topMouseUp":
                return aj = !1, cj(c, d);

              case "topSelectionChange":
                if (Ri) break;

              case "topKeyDown":
              case "topKeyUp":
                return cj(c, d);
            }
            return null;
        }
    };
    Y.augmentClass(ej, {
        animationName: null,
        elapsedTime: null,
        pseudoElement: null
    }), Y.augmentClass(fj, {
        clipboardData: function(a) {
            return "clipboardData" in a ? a.clipboardData : window.clipboardData;
        }
    }), Ji.augmentClass(gj, {
        relatedTarget: null
    });
    var ij = {
        Esc: "Escape",
        Spacebar: " ",
        Left: "ArrowLeft",
        Up: "ArrowUp",
        Right: "ArrowRight",
        Down: "ArrowDown",
        Del: "Delete",
        Win: "OS",
        Menu: "ContextMenu",
        Apps: "ContextMenu",
        Scroll: "ScrollLock",
        MozPrintableKey: "Unidentified"
    }, jj = {
        8: "Backspace",
        9: "Tab",
        12: "Clear",
        13: "Enter",
        16: "Shift",
        17: "Control",
        18: "Alt",
        19: "Pause",
        20: "CapsLock",
        27: "Escape",
        32: " ",
        33: "PageUp",
        34: "PageDown",
        35: "End",
        36: "Home",
        37: "ArrowLeft",
        38: "ArrowUp",
        39: "ArrowRight",
        40: "ArrowDown",
        45: "Insert",
        46: "Delete",
        112: "F1",
        113: "F2",
        114: "F3",
        115: "F4",
        116: "F5",
        117: "F6",
        118: "F7",
        119: "F8",
        120: "F9",
        121: "F10",
        122: "F11",
        123: "F12",
        144: "NumLock",
        145: "ScrollLock",
        224: "Meta"
    };
    Ji.augmentClass(kj, {
        key: function(a) {
            if (a.key) {
                var b = ij[a.key] || a.key;
                if ("Unidentified" !== b) return b;
            }
            return "keypress" === a.type ? 13 === (a = hj(a)) ? "Enter" : String.fromCharCode(a) : "keydown" === a.type || "keyup" === a.type ? jj[a.keyCode] || "Unidentified" : "";
        },
        location: null,
        ctrlKey: null,
        shiftKey: null,
        altKey: null,
        metaKey: null,
        repeat: null,
        locale: null,
        getModifierState: Mi,
        charCode: function(a) {
            return "keypress" === a.type ? hj(a) : 0;
        },
        keyCode: function(a) {
            return "keydown" === a.type || "keyup" === a.type ? a.keyCode : 0;
        },
        which: function(a) {
            return "keypress" === a.type ? hj(a) : "keydown" === a.type || "keyup" === a.type ? a.keyCode : 0;
        }
    }), Ni.augmentClass(lj, {
        dataTransfer: null
    }), Ji.augmentClass(mj, {
        touches: null,
        targetTouches: null,
        changedTouches: null,
        altKey: null,
        metaKey: null,
        ctrlKey: null,
        shiftKey: null,
        getModifierState: Mi
    }), Y.augmentClass(nj, {
        propertyName: null,
        elapsedTime: null,
        pseudoElement: null
    }), Ni.augmentClass(oj, {
        deltaX: function(a) {
            return "deltaX" in a ? a.deltaX : "wheelDeltaX" in a ? -a.wheelDeltaX : 0;
        },
        deltaY: function(a) {
            return "deltaY" in a ? a.deltaY : "wheelDeltaY" in a ? -a.wheelDeltaY : "wheelDelta" in a ? -a.wheelDelta : 0;
        },
        deltaZ: null,
        deltaMode: null
    });
    var pj = {}, qj = {};
    "abort animationEnd animationIteration animationStart blur cancel canPlay canPlayThrough click close contextMenu copy cut doubleClick drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error focus input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing progress rateChange reset scroll seeked seeking stalled submit suspend timeUpdate toggle touchCancel touchEnd touchMove touchStart transitionEnd volumeChange waiting wheel".split(" ").forEach(function(a) {
        var b = a[0].toUpperCase() + a.slice(1), c = "on" + b;
        c = {
            phasedRegistrationNames: {
                bubbled: c,
                captured: c + "Capture"
            },
            dependencies: [ b = "top" + b ]
        }, pj[a] = c, qj[b] = c;
    });
    var rj = {
        eventTypes: pj,
        extractEvents: function(a, b, c, d) {
            var e = qj[a];
            if (!e) return null;
            switch (a) {
              case "topAbort":
              case "topCancel":
              case "topCanPlay":
              case "topCanPlayThrough":
              case "topClose":
              case "topDurationChange":
              case "topEmptied":
              case "topEncrypted":
              case "topEnded":
              case "topError":
              case "topInput":
              case "topInvalid":
              case "topLoad":
              case "topLoadedData":
              case "topLoadedMetadata":
              case "topLoadStart":
              case "topPause":
              case "topPlay":
              case "topPlaying":
              case "topProgress":
              case "topRateChange":
              case "topReset":
              case "topSeeked":
              case "topSeeking":
              case "topStalled":
              case "topSubmit":
              case "topSuspend":
              case "topTimeUpdate":
              case "topToggle":
              case "topVolumeChange":
              case "topWaiting":
                var f = Y;
                break;

              case "topKeyPress":
                if (0 === hj(c)) return null;

              case "topKeyDown":
              case "topKeyUp":
                f = kj;
                break;

              case "topBlur":
              case "topFocus":
                f = gj;
                break;

              case "topClick":
                if (2 === c.button) return null;

              case "topDoubleClick":
              case "topMouseDown":
              case "topMouseMove":
              case "topMouseUp":
              case "topMouseOut":
              case "topMouseOver":
              case "topContextMenu":
                f = Ni;
                break;

              case "topDrag":
              case "topDragEnd":
              case "topDragEnter":
              case "topDragExit":
              case "topDragLeave":
              case "topDragOver":
              case "topDragStart":
              case "topDrop":
                f = lj;
                break;

              case "topTouchCancel":
              case "topTouchEnd":
              case "topTouchMove":
              case "topTouchStart":
                f = mj;
                break;

              case "topAnimationEnd":
              case "topAnimationIteration":
              case "topAnimationStart":
                f = ej;
                break;

              case "topTransitionEnd":
                f = nj;
                break;

              case "topScroll":
                f = Ji;
                break;

              case "topWheel":
                f = oj;
                break;

              case "topCopy":
              case "topCut":
              case "topPaste":
                f = fj;
            }
            return f || w("86", a), a = f.getPooled(e, b, c, d), Th.accumulateTwoPhaseDispatches(a), 
            a;
        }
    };
    L.setHandleTopLevel(M.handleTopLevel), Jb.injection.injectEventPluginOrder("ResponderEventPlugin SimpleEventPlugin TapEventPlugin EnterLeaveEventPlugin ChangeEventPlugin SelectEventPlugin BeforeInputEventPlugin".split(" ")), 
    ib.injection.injectComponentTree(G), Jb.injection.injectEventPluginsByName({
        SimpleEventPlugin: rj,
        EnterLeaveEventPlugin: Pi,
        ChangeEventPlugin: Ii,
        SelectEventPlugin: dj,
        BeforeInputEventPlugin: ri
    });
    var sj = A.injection.MUST_USE_PROPERTY, Z = A.injection.HAS_BOOLEAN_VALUE, tj = A.injection.HAS_NUMERIC_VALUE, uj = A.injection.HAS_POSITIVE_NUMERIC_VALUE, vj = A.injection.HAS_STRING_BOOLEAN_VALUE, wj = {
        Properties: {
            allowFullScreen: Z,
            allowTransparency: vj,
            async: Z,
            autoPlay: Z,
            capture: Z,
            checked: sj | Z,
            cols: uj,
            contentEditable: vj,
            controls: Z,
            default: Z,
            defer: Z,
            disabled: Z,
            download: A.injection.HAS_OVERLOADED_BOOLEAN_VALUE,
            draggable: vj,
            formNoValidate: Z,
            hidden: Z,
            loop: Z,
            multiple: sj | Z,
            muted: sj | Z,
            noValidate: Z,
            open: Z,
            playsInline: Z,
            readOnly: Z,
            required: Z,
            reversed: Z,
            rows: uj,
            rowSpan: tj,
            scoped: Z,
            seamless: Z,
            selected: sj | Z,
            size: uj,
            start: tj,
            span: uj,
            spellCheck: vj,
            style: 0,
            itemScope: Z,
            acceptCharset: 0,
            className: 0,
            htmlFor: 0,
            httpEquiv: 0,
            value: vj
        },
        DOMAttributeNames: {
            acceptCharset: "accept-charset",
            className: "class",
            htmlFor: "for",
            httpEquiv: "http-equiv"
        },
        DOMMutationMethods: {
            value: function(a, b) {
                if (null == b) return a.removeAttribute("value");
                "number" !== a.type || !1 === a.hasAttribute("value") ? a.setAttribute("value", "" + b) : a.validity && !a.validity.badInput && a.ownerDocument.activeElement !== a && a.setAttribute("value", "" + b);
            }
        }
    }, xj = A.injection.HAS_STRING_BOOLEAN_VALUE, yj = {
        xlink: "http://www.w3.org/1999/xlink",
        xml: "http://www.w3.org/XML/1998/namespace"
    }, zj = {
        Properties: {
            autoReverse: xj,
            externalResourcesRequired: xj,
            preserveAlpha: xj
        },
        DOMAttributeNames: {
            autoReverse: "autoReverse",
            externalResourcesRequired: "externalResourcesRequired",
            preserveAlpha: "preserveAlpha"
        },
        DOMAttributeNamespaces: {
            xlinkActuate: yj.xlink,
            xlinkArcrole: yj.xlink,
            xlinkHref: yj.xlink,
            xlinkRole: yj.xlink,
            xlinkShow: yj.xlink,
            xlinkTitle: yj.xlink,
            xlinkType: yj.xlink,
            xmlBase: yj.xml,
            xmlLang: yj.xml,
            xmlSpace: yj.xml
        }
    }, Aj = /[\-\:]([a-z])/g;
    "accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode x-height xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xmlns:xlink xml:lang xml:space".split(" ").forEach(function(a) {
        var b = a.replace(Aj, Bj);
        zj.Properties[b] = 0, zj.DOMAttributeNames[b] = a;
    }), A.injection.injectDOMPropertyConfig(wj), A.injection.injectDOMPropertyConfig(zj);
    var Cj = ig.injectInternals, Dj = F.ELEMENT_NODE, Ej = F.TEXT_NODE, Fj = F.COMMENT_NODE, Gj = F.DOCUMENT_NODE, Hj = F.DOCUMENT_FRAGMENT_NODE, Ij = A.ROOT_ATTRIBUTE_NAME, Jj = ka.getChildNamespace, Kj = N.createElement, Lj = N.createTextNode, Mj = N.setInitialProperties, Nj = N.diffProperties, Oj = N.updateProperties, Pj = N.diffHydratedProperties, Qj = N.diffHydratedText, Rj = N.warnForDeletedHydratableElement, Sj = N.warnForDeletedHydratableText, Tj = N.warnForInsertedHydratedElement, Uj = N.warnForInsertedHydratedText, Vj = G.precacheFiberNode, Wj = G.updateFiberProps;
    nb.injection.injectFiberControlledHostComponent(N), Dh._injectFiber(function(a) {
        return Xj.findHostInstance(a);
    });
    var Yj = null, Zj = null, Xj = function(a) {
        var b = a.getPublicInstance, c = (a = hh(a)).scheduleUpdate, d = a.getPriorityContext;
        return {
            createContainer: function(a) {
                var b = ee();
                return a = {
                    current: b,
                    containerInfo: a,
                    isScheduled: !1,
                    nextScheduledRoot: null,
                    context: null,
                    pendingContext: null
                }, b.stateNode = a;
            },
            updateContainer: function(a, b, g, h) {
                var e = b.current;
                g = jh(g), null === b.context ? b.context = g : b.pendingContext = g, b = h, h = d(e, ed.enableAsyncSubtreeAPI && null != a && null != a.type && null != a.type.prototype && !0 === a.type.prototype.unstable_isAsyncReactComponent), 
                kh(e, a = {
                    element: a
                }, void 0 === b ? null : b, h), c(e, h);
            },
            batchedUpdates: a.batchedUpdates,
            unbatchedUpdates: a.unbatchedUpdates,
            deferredUpdates: a.deferredUpdates,
            flushSync: a.flushSync,
            getPublicRootInstance: function(a) {
                if (!(a = a.current).child) return null;
                switch (a.child.tag) {
                  case oh:
                    return b(a.child.stateNode);

                  default:
                    return a.child.stateNode;
                }
            },
            findHostInstance: function(a) {
                return null === (a = ph(a)) ? null : a.stateNode;
            },
            findHostInstanceWithNoPortals: function(a) {
                return null === (a = qh(a)) ? null : a.stateNode;
            }
        };
    }({
        getRootHostContext: function(a) {
            if (a.nodeType === Gj) a = (a = a.documentElement) ? a.namespaceURI : Jj(null, ""); else {
                var b = a.nodeType === Fj ? a.parentNode : a;
                a = b.namespaceURI || null, b = b.tagName, a = Jj(a, b);
            }
            return a;
        },
        getChildHostContext: function(a, b) {
            return Jj(a, b);
        },
        getPublicInstance: function(a) {
            return a;
        },
        prepareForCommit: function() {
            Yj = M.isEnabled(), Zj = zh.getSelectionInformation(), M.setEnabled(!1);
        },
        resetAfterCommit: function() {
            zh.restoreSelection(Zj), Zj = null, M.setEnabled(Yj), Yj = null;
        },
        createInstance: function(a, b, c, d, e) {
            return a = Kj(a, b, c, d), Vj(e, a), Wj(a, b), a;
        },
        appendInitialChild: function(a, b) {
            a.appendChild(b);
        },
        finalizeInitialChildren: function(a, b, c, d) {
            Mj(a, b, c, d);
            a: {
                switch (b) {
                  case "button":
                  case "input":
                  case "select":
                  case "textarea":
                    a = !!c.autoFocus;
                    break a;
                }
                a = !1;
            }
            return a;
        },
        prepareUpdate: function(a, b, c, d, e) {
            return Nj(a, b, c, d, e);
        },
        commitMount: function(a) {
            a.focus();
        },
        commitUpdate: function(a, b, c, d, e) {
            Wj(a, e), Oj(a, b, c, d, e);
        },
        shouldSetTextContent: function(a, b) {
            return "textarea" === a || "string" == typeof b.children || "number" == typeof b.children || "object" == typeof b.dangerouslySetInnerHTML && null !== b.dangerouslySetInnerHTML && "string" == typeof b.dangerouslySetInnerHTML.__html;
        },
        resetTextContent: function(a) {
            a.textContent = "";
        },
        shouldDeprioritizeSubtree: function(a, b) {
            return !!b.hidden;
        },
        createTextInstance: function(a, b, c, d) {
            return a = Lj(a, b), Vj(d, a), a;
        },
        commitTextUpdate: function(a, b, c) {
            a.nodeValue = c;
        },
        appendChild: function(a, b) {
            a.appendChild(b);
        },
        appendChildToContainer: function(a, b) {
            a.nodeType === Fj ? a.parentNode.insertBefore(b, a) : a.appendChild(b);
        },
        insertBefore: function(a, b, c) {
            a.insertBefore(b, c);
        },
        insertInContainerBefore: function(a, b, c) {
            a.nodeType === Fj ? a.parentNode.insertBefore(b, c) : a.insertBefore(b, c);
        },
        removeChild: function(a, b) {
            a.removeChild(b);
        },
        removeChildFromContainer: function(a, b) {
            a.nodeType === Fj ? a.parentNode.removeChild(b) : a.removeChild(b);
        },
        canHydrateInstance: function(a, b) {
            return a.nodeType === Dj && b === a.nodeName.toLowerCase();
        },
        canHydrateTextInstance: function(a, b) {
            return "" !== b && a.nodeType === Ej;
        },
        getNextHydratableSibling: function(a) {
            for (a = a.nextSibling; a && a.nodeType !== Dj && a.nodeType !== Ej; ) a = a.nextSibling;
            return a;
        },
        getFirstHydratableChild: function(a) {
            for (a = a.firstChild; a && a.nodeType !== Dj && a.nodeType !== Ej; ) a = a.nextSibling;
            return a;
        },
        hydrateInstance: function(a, b, c, d, e, f) {
            return Vj(f, a), Wj(a, c), Pj(a, b, c, e, d);
        },
        hydrateTextInstance: function(a, b, c) {
            return Vj(c, a), Qj(a, b);
        },
        didNotHydrateInstance: function(a, b) {
            1 === b.nodeType ? Rj(a, b) : Sj(a, b);
        },
        didNotFindHydratableInstance: function(a, b, c) {
            Tj(a, b, c);
        },
        didNotFindHydratableTextInstance: function(a, b) {
            Uj(a, b);
        },
        scheduleDeferredCallback: dd.rIC,
        useSyncScheduling: !0
    });
    sb.injection.injectFiberBatchedUpdates(Xj.batchedUpdates);
    var ek = {
        createPortal: dk,
        hydrate: function(a, b, c) {
            return ck(null, a, b, !0, c);
        },
        render: function(a, b, c) {
            return ck(null, a, b, !1, c);
        },
        unstable_renderSubtreeIntoContainer: function(a, b, c, d) {
            return null != a && Pa.has(a) || w("38"), ck(a, b, c, !1, d);
        },
        unmountComponentAtNode: function(a) {
            return ak(a) || w("40"), !!a._reactRootContainer && (Xj.unbatchedUpdates(function() {
                ck(null, null, a, !1, function() {
                    a._reactRootContainer = null;
                });
            }), !0);
        },
        findDOMNode: Dh,
        unstable_createPortal: dk,
        unstable_batchedUpdates: sb.batchedUpdates,
        unstable_deferredUpdates: Xj.deferredUpdates,
        flushSync: Xj.flushSync,
        __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: {
            EventPluginHub: Jb,
            EventPluginRegistry: sa,
            EventPropagators: Th,
            ReactControlledComponent: nb,
            ReactDOMComponentTree: G,
            ReactDOMEventListener: L
        }
    };
    Cj({
        findFiberByHostInstance: G.getClosestInstanceFromNode,
        findHostInstanceByFiber: Xj.findHostInstance,
        bundleType: 0,
        version: "16.0.0",
        rendererPackageName: "react-dom"
    }), module.exports = ek;
}, function(module, exports, __webpack_require__) {
    "use strict";
    function t(a) {
        for (var b = arguments.length - 1, d = "Minified React error #" + a + "; visit http://facebook.github.io/react/docs/error-decoder.html?invariant=" + a, e = 0; e < b; e++) d += "&args[]=" + encodeURIComponent(arguments[e + 1]);
        throw b = Error(d + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings."), 
        b.name = "Invariant Violation", b.framesToPop = 1, b;
    }
    function v(a, b, d) {
        this.props = a, this.context = b, this.refs = p, this.updater = d || u;
    }
    function w(a, b, d) {
        this.props = a, this.context = b, this.refs = p, this.updater = d || u;
    }
    function x() {}
    function z(a, b, d) {
        this.props = a, this.context = b, this.refs = p, this.updater = d || u;
    }
    function G(a, b, d, e, c, g, k) {
        return {
            $$typeof: E,
            type: a,
            key: b,
            ref: d,
            props: k,
            _owner: g
        };
    }
    function escape(a) {
        var b = {
            "=": "=0",
            ":": "=2"
        };
        return "$" + ("" + a).replace(/[=:]/g, function(a) {
            return b[a];
        });
    }
    function L(a, b, d, e) {
        if (K.length) {
            var c = K.pop();
            return c.result = a, c.keyPrefix = b, c.func = d, c.context = e, c.count = 0, c;
        }
        return {
            result: a,
            keyPrefix: b,
            func: d,
            context: e,
            count: 0
        };
    }
    function M(a) {
        a.result = null, a.keyPrefix = null, a.func = null, a.context = null, a.count = 0, 
        10 > K.length && K.push(a);
    }
    function N(a, b, d, e) {
        var c = typeof a;
        if ("undefined" !== c && "boolean" !== c || (a = null), null === a || "string" === c || "number" === c || "object" === c && a.$$typeof === I) return d(e, a, "" === b ? "." + O(a, 0) : b), 
        1;
        var g = 0;
        if (b = "" === b ? "." : b + ":", Array.isArray(a)) for (var k = 0; k < a.length; k++) {
            var m = b + O(c = a[k], k);
            g += N(c, m, d, e);
        } else if ("function" == typeof (m = H && a[H] || a["@@iterator"])) for (a = m.call(a), 
        k = 0; !(c = a.next()).done; ) c = c.value, m = b + O(c, k++), g += N(c, m, d, e); else "object" === c && (d = "" + a, 
        t("31", "[object Object]" === d ? "object with keys {" + Object.keys(a).join(", ") + "}" : d, ""));
        return g;
    }
    function O(a, b) {
        return "object" == typeof a && null !== a && null != a.key ? escape(a.key) : b.toString(36);
    }
    function P(a, b) {
        a.func.call(a.context, b, a.count++);
    }
    function Q(a, b, d) {
        var e = a.result, c = a.keyPrefix;
        a = a.func.call(a.context, b, a.count++), Array.isArray(a) ? R(a, e, d, r.thatReturnsArgument) : null != a && (G.isValidElement(a) && (a = G.cloneAndReplaceKey(a, c + (!a.key || b && b.key === a.key ? "" : ("" + a.key).replace(J, "$&/") + "/") + d)), 
        e.push(a));
    }
    function R(a, b, d, e, c) {
        var g = "";
        null != d && (g = ("" + d).replace(J, "$&/") + "/"), b = L(b, g, e, c), null == a || N(a, "", Q, b), 
        M(b);
    }
    var f = __webpack_require__(316), p = __webpack_require__(317);
    __webpack_require__(192);
    var r = __webpack_require__(147), u = {
        isMounted: function() {
            return !1;
        },
        enqueueForceUpdate: function() {},
        enqueueReplaceState: function() {},
        enqueueSetState: function() {}
    };
    v.prototype.isReactComponent = {}, v.prototype.setState = function(a, b) {
        "object" != typeof a && "function" != typeof a && null != a && t("85"), this.updater.enqueueSetState(this, a, b, "setState");
    }, v.prototype.forceUpdate = function(a) {
        this.updater.enqueueForceUpdate(this, a, "forceUpdate");
    }, x.prototype = v.prototype;
    var y = w.prototype = new x();
    y.constructor = w, f(y, v.prototype), y.isPureReactComponent = !0;
    var A = z.prototype = new x();
    A.constructor = z, f(A, v.prototype), A.unstable_isAsyncReactComponent = !0, A.render = function() {
        return this.props.children;
    };
    var B = {
        Component: v,
        PureComponent: w,
        AsyncComponent: z
    }, C = {
        current: null
    }, D = Object.prototype.hasOwnProperty, E = "function" == typeof Symbol && Symbol.for && Symbol.for("react.element") || 60103, F = {
        key: !0,
        ref: !0,
        __self: !0,
        __source: !0
    };
    G.createElement = function(a, b, d) {
        var e, c = {}, g = null, k = null, m = null, q = null;
        if (null != b) for (e in void 0 !== b.ref && (k = b.ref), void 0 !== b.key && (g = "" + b.key), 
        m = void 0 === b.__self ? null : b.__self, q = void 0 === b.__source ? null : b.__source, 
        b) D.call(b, e) && !F.hasOwnProperty(e) && (c[e] = b[e]);
        var l = arguments.length - 2;
        if (1 === l) c.children = d; else if (1 < l) {
            for (var h = Array(l), n = 0; n < l; n++) h[n] = arguments[n + 2];
            c.children = h;
        }
        if (a && a.defaultProps) for (e in l = a.defaultProps) void 0 === c[e] && (c[e] = l[e]);
        return G(a, g, k, m, q, C.current, c);
    }, G.createFactory = function(a) {
        var b = G.createElement.bind(null, a);
        return b.type = a, b;
    }, G.cloneAndReplaceKey = function(a, b) {
        return G(a.type, b, a.ref, a._self, a._source, a._owner, a.props);
    }, G.cloneElement = function(a, b, d) {
        var e = f({}, a.props), c = a.key, g = a.ref, k = a._self, m = a._source, q = a._owner;
        if (null != b) {
            if (void 0 !== b.ref && (g = b.ref, q = C.current), void 0 !== b.key && (c = "" + b.key), 
            a.type && a.type.defaultProps) var l = a.type.defaultProps;
            for (h in b) D.call(b, h) && !F.hasOwnProperty(h) && (e[h] = void 0 === b[h] && void 0 !== l ? l[h] : b[h]);
        }
        var h = arguments.length - 2;
        if (1 === h) e.children = d; else if (1 < h) {
            l = Array(h);
            for (var n = 0; n < h; n++) l[n] = arguments[n + 2];
            e.children = l;
        }
        return G(a.type, c, g, k, m, q, e);
    }, G.isValidElement = function(a) {
        return "object" == typeof a && null !== a && a.$$typeof === E;
    };
    var H = "function" == typeof Symbol && Symbol.iterator, I = "function" == typeof Symbol && Symbol.for && Symbol.for("react.element") || 60103, J = /\/+/g, K = [], S = {
        forEach: function(a, b, d) {
            if (null == a) return a;
            b = L(null, null, b, d), null == a || N(a, "", P, b), M(b);
        },
        map: function(a, b, d) {
            if (null == a) return a;
            var e = [];
            return R(a, e, null, b, d), e;
        },
        count: function(a) {
            return null == a ? 0 : N(a, "", r.thatReturnsNull, null);
        },
        toArray: function(a) {
            var b = [];
            return R(a, b, null, r.thatReturnsArgument), b;
        }
    };
    module.exports = {
        Children: {
            map: S.map,
            forEach: S.forEach,
            count: S.count,
            toArray: S.toArray,
            only: function(a) {
                return G.isValidElement(a) || t("143"), a;
            }
        },
        Component: B.Component,
        PureComponent: B.PureComponent,
        unstable_AsyncComponent: B.AsyncComponent,
        createElement: G.createElement,
        cloneElement: G.cloneElement,
        isValidElement: G.isValidElement,
        createFactory: G.createFactory,
        version: "16.0.0",
        __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: {
            ReactCurrentOwner: C,
            assign: f
        }
    };
}, function(module, exports, __webpack_require__) {
    "use strict";
    var canUseDOM = !("undefined" == typeof window || !window.document || !window.document.createElement), ExecutionEnvironment = {
        canUseDOM: canUseDOM,
        canUseWorkers: "undefined" != typeof Worker,
        canUseEventListeners: canUseDOM && !(!window.addEventListener && !window.attachEvent),
        canUseViewport: canUseDOM && !!window.screen,
        isInWorker: !canUseDOM
    };
    module.exports = ExecutionEnvironment;
}, function(module, exports, __webpack_require__) {
    "use strict";
    var emptyFunction = __webpack_require__(147), EventListener = {
        listen: function(target, eventType, callback) {
            return target.addEventListener ? (target.addEventListener(eventType, callback, !1), 
            {
                remove: function() {
                    target.removeEventListener(eventType, callback, !1);
                }
            }) : target.attachEvent ? (target.attachEvent("on" + eventType, callback), {
                remove: function() {
                    target.detachEvent("on" + eventType, callback);
                }
            }) : void 0;
        },
        capture: function(target, eventType, callback) {
            return target.addEventListener ? (target.addEventListener(eventType, callback, !0), 
            {
                remove: function() {
                    target.removeEventListener(eventType, callback, !0);
                }
            }) : {
                remove: emptyFunction
            };
        },
        registerDefault: function() {}
    };
    module.exports = EventListener;
}, function(module, exports, __webpack_require__) {
    "use strict";
    function is(x, y) {
        return x === y ? 0 !== x || 0 !== y || 1 / x == 1 / y : x !== x && y !== y;
    }
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    module.exports = function(objA, objB) {
        if (is(objA, objB)) return !0;
        if ("object" != typeof objA || null === objA || "object" != typeof objB || null === objB) return !1;
        var keysA = Object.keys(objA), keysB = Object.keys(objB);
        if (keysA.length !== keysB.length) return !1;
        for (var i = 0; i < keysA.length; i++) if (!hasOwnProperty.call(objB, keysA[i]) || !is(objA[keysA[i]], objB[keysA[i]])) return !1;
        return !0;
    };
}, function(module, exports, __webpack_require__) {
    "use strict";
    function containsNode(outerNode, innerNode) {
        return !(!outerNode || !innerNode) && (outerNode === innerNode || !isTextNode(outerNode) && (isTextNode(innerNode) ? containsNode(outerNode, innerNode.parentNode) : "contains" in outerNode ? outerNode.contains(innerNode) : !!outerNode.compareDocumentPosition && !!(16 & outerNode.compareDocumentPosition(innerNode))));
    }
    var isTextNode = __webpack_require__(395);
    module.exports = containsNode;
}, function(module, exports, __webpack_require__) {
    "use strict";
    var isNode = __webpack_require__(396);
    module.exports = function(object) {
        return isNode(object) && 3 == object.nodeType;
    };
}, function(module, exports, __webpack_require__) {
    "use strict";
    module.exports = function(object) {
        var defaultView = (object ? object.ownerDocument || object : document).defaultView || window;
        return !(!object || !("function" == typeof defaultView.Node ? object instanceof defaultView.Node : "object" == typeof object && "number" == typeof object.nodeType && "string" == typeof object.nodeName));
    };
}, function(module, exports, __webpack_require__) {
    "use strict";
    module.exports = function(node) {
        try {
            node.focus();
        } catch (e) {}
    };
}, function(module, exports, __webpack_require__) {
    "use strict";
    module.exports = function(doc) {
        if (void 0 === (doc = doc || ("undefined" != typeof document ? document : void 0))) return null;
        try {
            return doc.activeElement || doc.body;
        } catch (e) {
            return doc.body;
        }
    };
}, function(module, exports, __webpack_require__) {
    var baseGetTag = __webpack_require__(21), isArray = __webpack_require__(7), isObjectLike = __webpack_require__(18), stringTag = "[object String]";
    module.exports = function(value) {
        return "string" == typeof value || !isArray(value) && isObjectLike(value) && baseGetTag(value) == stringTag;
    };
}, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , function(module, exports, __webpack_require__) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    });
    var React = __webpack_require__(5), dom_1 = __webpack_require__(3), styl = __webpack_require__(351);
    exports.OptInContentComponent = function(_a) {
        var onClick = _a.onClick, isLargeButton = _a.isLargeButton;
        return React.createElement("div", {
            className: styl.container
        }, React.createElement("div", {
            className: styl.header
        }, "Grammarly now has ", React.createElement("span", {
            className: styl.bold
        }, "beta"), " support", React.createElement("br", null), "for Google Docs!"), React.createElement("div", {
            className: styl.btnContainer
        }, React.createElement("div", {
            className: dom_1.cs(styl.button, isLargeButton && styl.large),
            onClick: onClick
        }, "Turn it on")), React.createElement("div", {
            className: styl.note
        }, "This beta feature does not currently support Grammarly Premium corrections or the popup Grammarly Editor"));
    };
}, , , , , function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    __webpack_exports__.a = function(message) {
        "undefined" != typeof console && "function" == typeof console.error && console.error(message);
        try {
            throw new Error(message);
        } catch (e) {}
    };
}, function(module, exports, __webpack_require__) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    });
    var React = __webpack_require__(5), dom_1 = __webpack_require__(3), config_1 = __webpack_require__(10), util_1 = __webpack_require__(2), style = __webpack_require__(1146);
    exports.Header = function() {
        return React.createElement("div", {
            className: style.header
        }, React.createElement("a", {
            target: "_blank",
            href: config_1.URLS.app,
            className: dom_1.cs(style.logo, style[util_1.getBrowser()])
        }));
    };
}, function(module, exports) {
    module.exports = {
        select_checkbox: "_2-SG_",
        checkbox: "_3KfmN",
        checkbox_check: "_1SBFw",
        checkbox_check_round: "_1SrxK"
    };
}, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , function(module, exports, __webpack_require__) {
    module.exports = __webpack_require__(1133)();
}, function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    __webpack_require__.d(__webpack_exports__, "b", function() {
        return subscriptionShape;
    }), __webpack_require__.d(__webpack_exports__, "a", function() {
        return storeShape;
    });
    var __WEBPACK_IMPORTED_MODULE_0_prop_types__ = __webpack_require__(606), __WEBPACK_IMPORTED_MODULE_0_prop_types___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_prop_types__), subscriptionShape = __WEBPACK_IMPORTED_MODULE_0_prop_types___default.a.shape({
        trySubscribe: __WEBPACK_IMPORTED_MODULE_0_prop_types___default.a.func.isRequired,
        tryUnsubscribe: __WEBPACK_IMPORTED_MODULE_0_prop_types___default.a.func.isRequired,
        notifyNestedSubs: __WEBPACK_IMPORTED_MODULE_0_prop_types___default.a.func.isRequired,
        isSubscribed: __WEBPACK_IMPORTED_MODULE_0_prop_types___default.a.func.isRequired
    }), storeShape = __WEBPACK_IMPORTED_MODULE_0_prop_types___default.a.shape({
        subscribe: __WEBPACK_IMPORTED_MODULE_0_prop_types___default.a.func.isRequired,
        dispatch: __WEBPACK_IMPORTED_MODULE_0_prop_types___default.a.func.isRequired,
        getState: __WEBPACK_IMPORTED_MODULE_0_prop_types___default.a.func.isRequired
    });
}, function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }
    function _possibleConstructorReturn(self, call) {
        if (!self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        return !call || "object" != typeof call && "function" != typeof call ? self : call;
    }
    function _inherits(subClass, superClass) {
        if ("function" != typeof superClass && null !== superClass) throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
                value: subClass,
                enumerable: !1,
                writable: !0,
                configurable: !0
            }
        }), superClass && (Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass);
    }
    function _objectWithoutProperties(obj, keys) {
        var target = {};
        for (var i in obj) keys.indexOf(i) >= 0 || Object.prototype.hasOwnProperty.call(obj, i) && (target[i] = obj[i]);
        return target;
    }
    function noop() {}
    function makeSelectorStateful(sourceSelector, store) {
        var selector = {
            run: function(props) {
                try {
                    var nextProps = sourceSelector(store.getState(), props);
                    (nextProps !== selector.props || selector.error) && (selector.shouldComponentUpdate = !0, 
                    selector.props = nextProps, selector.error = null);
                } catch (error) {
                    selector.shouldComponentUpdate = !0, selector.error = error;
                }
            }
        };
        return selector;
    }
    __webpack_exports__.a = function(selectorFactory) {
        var _contextTypes, _childContextTypes, _ref = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}, _ref$getDisplayName = _ref.getDisplayName, getDisplayName = void 0 === _ref$getDisplayName ? function(name) {
            return "ConnectAdvanced(" + name + ")";
        } : _ref$getDisplayName, _ref$methodName = _ref.methodName, methodName = void 0 === _ref$methodName ? "connectAdvanced" : _ref$methodName, _ref$renderCountProp = _ref.renderCountProp, renderCountProp = void 0 === _ref$renderCountProp ? void 0 : _ref$renderCountProp, _ref$shouldHandleStat = _ref.shouldHandleStateChanges, shouldHandleStateChanges = void 0 === _ref$shouldHandleStat || _ref$shouldHandleStat, _ref$storeKey = _ref.storeKey, storeKey = void 0 === _ref$storeKey ? "store" : _ref$storeKey, _ref$withRef = _ref.withRef, withRef = void 0 !== _ref$withRef && _ref$withRef, connectOptions = _objectWithoutProperties(_ref, [ "getDisplayName", "methodName", "renderCountProp", "shouldHandleStateChanges", "storeKey", "withRef" ]), subscriptionKey = storeKey + "Subscription", version = hotReloadingVersion++, contextTypes = (_contextTypes = {}, 
        _contextTypes[storeKey] = __WEBPACK_IMPORTED_MODULE_4__utils_PropTypes__.a, _contextTypes[subscriptionKey] = __WEBPACK_IMPORTED_MODULE_4__utils_PropTypes__.b, 
        _contextTypes), childContextTypes = (_childContextTypes = {}, _childContextTypes[subscriptionKey] = __WEBPACK_IMPORTED_MODULE_4__utils_PropTypes__.b, 
        _childContextTypes);
        return function(WrappedComponent) {
            __WEBPACK_IMPORTED_MODULE_1_invariant___default()("function" == typeof WrappedComponent, "You must pass a component to the function returned by connect. Instead received " + JSON.stringify(WrappedComponent));
            var wrappedComponentName = WrappedComponent.displayName || WrappedComponent.name || "Component", displayName = getDisplayName(wrappedComponentName), selectorFactoryOptions = _extends({}, connectOptions, {
                getDisplayName: getDisplayName,
                methodName: methodName,
                renderCountProp: renderCountProp,
                shouldHandleStateChanges: shouldHandleStateChanges,
                storeKey: storeKey,
                withRef: withRef,
                displayName: displayName,
                wrappedComponentName: wrappedComponentName,
                WrappedComponent: WrappedComponent
            }), Connect = function(_Component) {
                function Connect(props, context) {
                    _classCallCheck(this, Connect);
                    var _this = _possibleConstructorReturn(this, _Component.call(this, props, context));
                    return _this.version = version, _this.state = {}, _this.renderCount = 0, _this.store = props[storeKey] || context[storeKey], 
                    _this.propsMode = Boolean(props[storeKey]), _this.setWrappedInstance = _this.setWrappedInstance.bind(_this), 
                    __WEBPACK_IMPORTED_MODULE_1_invariant___default()(_this.store, 'Could not find "' + storeKey + '" in either the context or props of "' + displayName + '". Either wrap the root component in a <Provider>, or explicitly pass "' + storeKey + '" as a prop to "' + displayName + '".'), 
                    _this.initSelector(), _this.initSubscription(), _this;
                }
                return _inherits(Connect, _Component), Connect.prototype.getChildContext = function() {
                    var _ref2, subscription = this.propsMode ? null : this.subscription;
                    return _ref2 = {}, _ref2[subscriptionKey] = subscription || this.context[subscriptionKey], 
                    _ref2;
                }, Connect.prototype.componentDidMount = function() {
                    shouldHandleStateChanges && (this.subscription.trySubscribe(), this.selector.run(this.props), 
                    this.selector.shouldComponentUpdate && this.forceUpdate());
                }, Connect.prototype.componentWillReceiveProps = function(nextProps) {
                    this.selector.run(nextProps);
                }, Connect.prototype.shouldComponentUpdate = function() {
                    return this.selector.shouldComponentUpdate;
                }, Connect.prototype.componentWillUnmount = function() {
                    this.subscription && this.subscription.tryUnsubscribe(), this.subscription = null, 
                    this.notifyNestedSubs = noop, this.store = null, this.selector.run = noop, this.selector.shouldComponentUpdate = !1;
                }, Connect.prototype.getWrappedInstance = function() {
                    return __WEBPACK_IMPORTED_MODULE_1_invariant___default()(withRef, "To access the wrapped instance, you need to specify { withRef: true } in the options argument of the " + methodName + "() call."), 
                    this.wrappedInstance;
                }, Connect.prototype.setWrappedInstance = function(ref) {
                    this.wrappedInstance = ref;
                }, Connect.prototype.initSelector = function() {
                    var sourceSelector = selectorFactory(this.store.dispatch, selectorFactoryOptions);
                    this.selector = makeSelectorStateful(sourceSelector, this.store), this.selector.run(this.props);
                }, Connect.prototype.initSubscription = function() {
                    if (shouldHandleStateChanges) {
                        var parentSub = (this.propsMode ? this.props : this.context)[subscriptionKey];
                        this.subscription = new __WEBPACK_IMPORTED_MODULE_3__utils_Subscription__.a(this.store, parentSub, this.onStateChange.bind(this)), 
                        this.notifyNestedSubs = this.subscription.notifyNestedSubs.bind(this.subscription);
                    }
                }, Connect.prototype.onStateChange = function() {
                    this.selector.run(this.props), this.selector.shouldComponentUpdate ? (this.componentDidUpdate = this.notifyNestedSubsOnComponentDidUpdate, 
                    this.setState(dummyState)) : this.notifyNestedSubs();
                }, Connect.prototype.notifyNestedSubsOnComponentDidUpdate = function() {
                    this.componentDidUpdate = void 0, this.notifyNestedSubs();
                }, Connect.prototype.isSubscribed = function() {
                    return Boolean(this.subscription) && this.subscription.isSubscribed();
                }, Connect.prototype.addExtraProps = function(props) {
                    if (!(withRef || renderCountProp || this.propsMode && this.subscription)) return props;
                    var withExtras = _extends({}, props);
                    return withRef && (withExtras.ref = this.setWrappedInstance), renderCountProp && (withExtras[renderCountProp] = this.renderCount++), 
                    this.propsMode && this.subscription && (withExtras[subscriptionKey] = this.subscription), 
                    withExtras;
                }, Connect.prototype.render = function() {
                    var selector = this.selector;
                    if (selector.shouldComponentUpdate = !1, selector.error) throw selector.error;
                    return Object(__WEBPACK_IMPORTED_MODULE_2_react__.createElement)(WrappedComponent, this.addExtraProps(selector.props));
                }, Connect;
            }(__WEBPACK_IMPORTED_MODULE_2_react__.Component);
            return Connect.WrappedComponent = WrappedComponent, Connect.displayName = displayName, 
            Connect.childContextTypes = childContextTypes, Connect.contextTypes = contextTypes, 
            Connect.propTypes = contextTypes, __WEBPACK_IMPORTED_MODULE_0_hoist_non_react_statics___default()(Connect, WrappedComponent);
        };
    };
    var __WEBPACK_IMPORTED_MODULE_0_hoist_non_react_statics__ = __webpack_require__(1135), __WEBPACK_IMPORTED_MODULE_0_hoist_non_react_statics___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_hoist_non_react_statics__), __WEBPACK_IMPORTED_MODULE_1_invariant__ = __webpack_require__(1136), __WEBPACK_IMPORTED_MODULE_1_invariant___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_invariant__), __WEBPACK_IMPORTED_MODULE_2_react__ = __webpack_require__(5), __WEBPACK_IMPORTED_MODULE_3__utils_Subscription__ = (__webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_react__), 
    __webpack_require__(1137)), __WEBPACK_IMPORTED_MODULE_4__utils_PropTypes__ = __webpack_require__(607), _extends = Object.assign || function(target) {
        for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i];
            for (var key in source) Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
        }
        return target;
    }, hotReloadingVersion = 0, dummyState = {};
}, function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    function getDependsOnOwnProps(mapToProps) {
        return null !== mapToProps.dependsOnOwnProps && void 0 !== mapToProps.dependsOnOwnProps ? Boolean(mapToProps.dependsOnOwnProps) : 1 !== mapToProps.length;
    }
    __webpack_exports__.a = function(getConstant) {
        return function(dispatch, options) {
            function constantSelector() {
                return constant;
            }
            var constant = getConstant(dispatch, options);
            return constantSelector.dependsOnOwnProps = !1, constantSelector;
        };
    }, __webpack_exports__.b = function(mapToProps, methodName) {
        return function(dispatch, _ref) {
            _ref.displayName;
            var proxy = function(stateOrDispatch, ownProps) {
                return proxy.dependsOnOwnProps ? proxy.mapToProps(stateOrDispatch, ownProps) : proxy.mapToProps(stateOrDispatch);
            };
            return proxy.dependsOnOwnProps = !0, proxy.mapToProps = function(stateOrDispatch, ownProps) {
                proxy.mapToProps = mapToProps, proxy.dependsOnOwnProps = getDependsOnOwnProps(mapToProps);
                var props = proxy(stateOrDispatch, ownProps);
                return "function" == typeof props && (proxy.mapToProps = props, proxy.dependsOnOwnProps = getDependsOnOwnProps(props), 
                props = proxy(stateOrDispatch, ownProps)), props;
            }, proxy;
        };
    };
    __webpack_require__(610);
}, function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    __webpack_require__(109), __webpack_require__(435);
}, function(module, exports, __webpack_require__) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    });
    var React = __webpack_require__(5), dom_1 = __webpack_require__(3), config_1 = __webpack_require__(10), style = __webpack_require__(113);
    exports.Footer = function(_a) {
        var openUrl = _a.openUrl;
        return React.createElement("div", {
            className: style.footer
        }, React.createElement("span", {
            onClick: function() {
                return openUrl(config_1.URLS.newDoc);
            },
            className: dom_1.cs(style.new_document, style.footer_btn)
        }, "New Document"), React.createElement("a", {
            href: config_1.URLS.app,
            target: "_blank",
            className: dom_1.cs(style.my_grammarly, style.footer_btn)
        }, "My Grammarly"));
    };
}, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , function(module, exports, __webpack_require__) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), __webpack_require__(202), __webpack_require__(1).LogConfig.configure({
        edge: !1,
        prodCs: !1
    }), __webpack_require__(11).initGlobal("chrome", "popup");
    var chrome_1 = __webpack_require__(203), extension_api_1 = __webpack_require__(90);
    __webpack_require__(105).hacksForCompatibility(), extension_api_1.initGlobalExtensionApi(chrome_1.createApi()), 
    __webpack_require__(1128);
}, function(module, exports, __webpack_require__) {
    window.IS_POPUP = document.querySelector(".popup"), window.IS_POPUP && __webpack_require__(1129);
}, function(module, exports, __webpack_require__) {
    "use strict";
    function init() {
        return __awaiter(this, void 0, void 0, function() {
            var isInitialized, _a, store, actions;
            return __generator(this, function(_b) {
                return isInitialized = !1, dom_1.addClass(document.documentElement, util_1.getBrowser()), 
                util_1.isWindows() && dom_1.addClass(document.documentElement, "windows"), _a = store_mirror_1.createMirrorStore(function(_) {
                    isInitialized || (isInitialized = !0, show(store, actions));
                }), store = _a.store, actions = _a.actions, message.emitBackground("tab-connected", {
                    tab: "popup"
                }), util_1.asyncCall(function() {
                    return !isInitialized && tracking_1.felog.settingsPopupTimeout();
                }, 2e3), [ 2 ];
            });
        });
    }
    function track(state, actions) {
        var config = state.config, user = state.user, settings = state.settings, enabled = config.enabled;
        tracking_2.gnar.toolbarButtonClick("browser", enabled ? "supported" : "unsupported"), 
        user.anonymous || enabled && settings.showNews && actions.seenNews();
    }
    function show(store, actions) {
        log.warn("RENDER FROM", {
            store: store,
            actions: actions
        }), main_view_1.renderMainView(store, actions), util_1.isSafari() ? document.addEventListener("popup-open", function() {
            track(store.getState(), actions), message.emitBackground("tab-connected", {
                tab: "popup"
            });
        }) : track(store.getState(), actions);
    }
    var __awaiter = this && this.__awaiter || function(thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function(resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value));
                } catch (e) {
                    reject(e);
                }
            }
            function rejected(value) {
                try {
                    step(generator.throw(value));
                } catch (e) {
                    reject(e);
                }
            }
            function step(result) {
                result.done ? resolve(result.value) : new P(function(resolve) {
                    resolve(result.value);
                }).then(fulfilled, rejected);
            }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }, __generator = this && this.__generator || function(thisArg, body) {
        function verb(n) {
            return function(v) {
                return step([ n, v ]);
            };
        }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            for (;_; ) try {
                if (f = 1, y && (t = y[2 & op[0] ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
                switch (y = 0, t && (op = [ 0, t.value ]), op[0]) {
                  case 0:
                  case 1:
                    t = op;
                    break;

                  case 4:
                    return _.label++, {
                        value: op[1],
                        done: !1
                    };

                  case 5:
                    _.label++, y = op[1], op = [ 0 ];
                    continue;

                  case 7:
                    op = _.ops.pop(), _.trys.pop();
                    continue;

                  default:
                    if (t = _.trys, !(t = t.length > 0 && t[t.length - 1]) && (6 === op[0] || 2 === op[0])) {
                        _ = 0;
                        continue;
                    }
                    if (3 === op[0] && (!t || op[1] > t[0] && op[1] < t[3])) {
                        _.label = op[1];
                        break;
                    }
                    if (6 === op[0] && _.label < t[1]) {
                        _.label = t[1], t = op;
                        break;
                    }
                    if (t && _.label < t[2]) {
                        _.label = t[2], _.ops.push(op);
                        break;
                    }
                    t[2] && _.ops.pop(), _.trys.pop();
                    continue;
                }
                op = body.call(thisArg, _);
            } catch (e) {
                op = [ 6, e ], y = 0;
            } finally {
                f = t = 0;
            }
            if (5 & op[0]) throw op[1];
            return {
                value: op[0] ? op[1] : void 0,
                done: !0
            };
        }
        var f, y, t, g, _ = {
            label: 0,
            sent: function() {
                if (1 & t[0]) throw t[1];
                return t[1];
            },
            trys: [],
            ops: []
        };
        return g = {
            next: verb(0),
            throw: verb(1),
            return: verb(2)
        }, "function" == typeof Symbol && (g[Symbol.iterator] = function() {
            return this;
        }), g;
    };
    Object.defineProperty(exports, "__esModule", {
        value: !0
    });
    var dom_1 = __webpack_require__(3), message = __webpack_require__(16), tracking_1 = __webpack_require__(9), tracking_2 = __webpack_require__(180), store_mirror_1 = __webpack_require__(371), util_1 = __webpack_require__(2), main_view_1 = __webpack_require__(1130), logger_1 = __webpack_require__(1), log = (__webpack_require__(369), 
    logger_1.Logger.create("universal.popup"));
    init().catch(function(e) {
        return log.trace("EROROR: POPUP INIT", e.message);
    }), exports.init = init, exports.track = track;
}, function(module, exports, __webpack_require__) {
    "use strict";
    function closePopup() {
        dom_1.emitDomEvent("close-popup");
    }
    function updatePopupSize(_a) {
        var force = (void 0 === _a ? {} : _a).force;
        dom_1.emitDomEvent("update-window-size", {
            force: force
        });
    }
    function reloadTab(id) {
        message.emitBackground("reload-tab", id), closePopup();
    }
    function openUrl(url) {
        message.emitBackground("open-url", url), closePopup();
    }
    var __extends = this && this.__extends || function() {
        var extendStatics = Object.setPrototypeOf || {
            __proto__: []
        } instanceof Array && function(d, b) {
            d.__proto__ = b;
        } || function(d, b) {
            for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return function(d, b) {
            function __() {
                this.constructor = d;
            }
            extendStatics(d, b), d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, 
            new __());
        };
    }(), __assign = this && this.__assign || Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) Object.prototype.hasOwnProperty.call(s, p) && (t[p] = s[p]);
        }
        return t;
    }, __read = this && this.__read || function(o, n) {
        var m = "function" == typeof Symbol && o[Symbol.iterator];
        if (!m) return o;
        var r, e, i = m.call(o), ar = [];
        try {
            for (;(void 0 === n || n-- > 0) && !(r = i.next()).done; ) ar.push(r.value);
        } catch (error) {
            e = {
                error: error
            };
        } finally {
            try {
                r && !r.done && (m = i.return) && m.call(i);
            } finally {
                if (e) throw e.error;
            }
        }
        return ar;
    };
    Object.defineProperty(exports, "__esModule", {
        value: !0
    });
    var React = __webpack_require__(5), react_dom_1 = __webpack_require__(20), react_redux_1 = __webpack_require__(1131), dom_1 = __webpack_require__(3), message = __webpack_require__(16), tracking_1 = __webpack_require__(9), tracking_2 = __webpack_require__(180), signin_1 = __webpack_require__(1145), settings_1 = __webpack_require__(1148), unsupported_1 = __webpack_require__(1158), MainView = function(_super) {
        function MainView() {
            return null !== _super && _super.apply(this, arguments) || this;
        }
        return __extends(MainView, _super), MainView.prototype.componentDidUpdate = function() {
            this.props.resize();
        }, MainView.prototype.componentDidMount = function() {
            var _this = this;
            this.props.resize({
                force: !0
            }), dom_1.on.call(react_dom_1.findDOMNode(this), "click", function(e) {
                var target = e.target, el = "A" === target.nodeName ? target : target.parentNode && "A" === target.parentNode.nodeName ? target.parentNode : null;
                el && (e.preventDefault(), _this.processHrefClick(el));
            });
        }, MainView.prototype.componentWillMount = function() {
            dom_1.on.call(document, "popup-open", this.props.resize);
        }, MainView.prototype.processHrefClick = function(_a) {
            var href = _a.href, f = _a.dataset.fire;
            if (f) {
                var _b = __read(f.split(", "), 2), event_1 = _b[0], param = _b[1];
                "hook-clicked" === event_1 && (tracking_2.gnar.getPremiumButtonClick("settingsToolbar"), 
                tracking_1.felog.userUpgradeClick("settingsToolbar")), "login-attempt" === event_1 && ("settings_toolbar_sign_up" === param && tracking_2.gnar.signUpButtonClick(), 
                "settings_toolbar_sign_in" === param && tracking_2.gnar.signInButtonClick());
            }
            href && openUrl(href);
        }, MainView.prototype.render = function() {
            var props = this.props, anonymous = props.user.anonymous, config = props.config, enabled = config.enabled, servicePage = config.servicePage, component = anonymous ? React.createElement(signin_1.SigninComponent, null) : enabled || servicePage ? React.createElement(settings_1.SettingsComponent, __assign({}, props)) : React.createElement(unsupported_1.UnsupportedComponent, __assign({}, props));
            return React.createElement("div", null, component);
        }, MainView;
    }(React.Component);
    exports.MainView = MainView, exports.renderMainView = function(store, actions) {
        var View = react_redux_1.connect(function(state) {
            return state;
        }, function(_dispatch, _ownProps) {
            return {
                actions: actions
            };
        })(MainView);
        react_dom_1.render(React.createElement(react_redux_1.Provider, {
            store: store
        }, React.createElement(View, {
            close: closePopup,
            resize: updatePopupSize,
            openUrl: openUrl,
            reloadTab: reloadTab
        })), document.querySelector(".popup"));
    };
}, function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    Object.defineProperty(__webpack_exports__, "__esModule", {
        value: !0
    });
    var __WEBPACK_IMPORTED_MODULE_0__components_Provider__ = __webpack_require__(1132), __WEBPACK_IMPORTED_MODULE_1__components_connectAdvanced__ = __webpack_require__(608), __WEBPACK_IMPORTED_MODULE_2__connect_connect__ = __webpack_require__(1138);
    __webpack_require__.d(__webpack_exports__, "Provider", function() {
        return __WEBPACK_IMPORTED_MODULE_0__components_Provider__.b;
    }), __webpack_require__.d(__webpack_exports__, "createProvider", function() {
        return __WEBPACK_IMPORTED_MODULE_0__components_Provider__.a;
    }), __webpack_require__.d(__webpack_exports__, "connectAdvanced", function() {
        return __WEBPACK_IMPORTED_MODULE_1__components_connectAdvanced__.a;
    }), __webpack_require__.d(__webpack_exports__, "connect", function() {
        return __WEBPACK_IMPORTED_MODULE_2__connect_connect__.a;
    });
}, function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }
    function _possibleConstructorReturn(self, call) {
        if (!self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        return !call || "object" != typeof call && "function" != typeof call ? self : call;
    }
    function _inherits(subClass, superClass) {
        if ("function" != typeof superClass && null !== superClass) throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
                value: subClass,
                enumerable: !1,
                writable: !0,
                configurable: !0
            }
        }), superClass && (Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass);
    }
    function createProvider() {
        var _Provider$childContex, storeKey = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "store", subscriptionKey = arguments[1] || storeKey + "Subscription", Provider = function(_Component) {
            function Provider(props, context) {
                _classCallCheck(this, Provider);
                var _this = _possibleConstructorReturn(this, _Component.call(this, props, context));
                return _this[storeKey] = props.store, _this;
            }
            return _inherits(Provider, _Component), Provider.prototype.getChildContext = function() {
                var _ref;
                return _ref = {}, _ref[storeKey] = this[storeKey], _ref[subscriptionKey] = null, 
                _ref;
            }, Provider.prototype.render = function() {
                return __WEBPACK_IMPORTED_MODULE_0_react__.Children.only(this.props.children);
            }, Provider;
        }(__WEBPACK_IMPORTED_MODULE_0_react__.Component);
        return Provider.propTypes = {
            store: __WEBPACK_IMPORTED_MODULE_2__utils_PropTypes__.a.isRequired,
            children: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.element.isRequired
        }, Provider.childContextTypes = (_Provider$childContex = {}, _Provider$childContex[storeKey] = __WEBPACK_IMPORTED_MODULE_2__utils_PropTypes__.a.isRequired, 
        _Provider$childContex[subscriptionKey] = __WEBPACK_IMPORTED_MODULE_2__utils_PropTypes__.b, 
        _Provider$childContex), Provider;
    }
    __webpack_exports__.a = createProvider;
    var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(5), __WEBPACK_IMPORTED_MODULE_1_prop_types__ = (__webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__), 
    __webpack_require__(606)), __WEBPACK_IMPORTED_MODULE_1_prop_types___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_prop_types__), __WEBPACK_IMPORTED_MODULE_2__utils_PropTypes__ = __webpack_require__(607);
    __webpack_require__(435);
    __webpack_exports__.b = createProvider();
}, function(module, exports, __webpack_require__) {
    "use strict";
    var emptyFunction = __webpack_require__(147), invariant = __webpack_require__(192), ReactPropTypesSecret = __webpack_require__(1134);
    module.exports = function() {
        function shim(props, propName, componentName, location, propFullName, secret) {
            secret !== ReactPropTypesSecret && invariant(!1, "Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types");
        }
        function getShim() {
            return shim;
        }
        shim.isRequired = shim;
        var ReactPropTypes = {
            array: shim,
            bool: shim,
            func: shim,
            number: shim,
            object: shim,
            string: shim,
            symbol: shim,
            any: shim,
            arrayOf: getShim,
            element: shim,
            instanceOf: getShim,
            node: shim,
            objectOf: getShim,
            oneOf: getShim,
            oneOfType: getShim,
            shape: getShim,
            exact: getShim
        };
        return ReactPropTypes.checkPropTypes = emptyFunction, ReactPropTypes.PropTypes = ReactPropTypes, 
        ReactPropTypes;
    };
}, function(module, exports, __webpack_require__) {
    "use strict";
    module.exports = "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED";
}, function(module, exports, __webpack_require__) {
    "use strict";
    var REACT_STATICS = {
        childContextTypes: !0,
        contextTypes: !0,
        defaultProps: !0,
        displayName: !0,
        getDefaultProps: !0,
        mixins: !0,
        propTypes: !0,
        type: !0
    }, KNOWN_STATICS = {
        name: !0,
        length: !0,
        prototype: !0,
        caller: !0,
        callee: !0,
        arguments: !0,
        arity: !0
    }, defineProperty = Object.defineProperty, getOwnPropertyNames = Object.getOwnPropertyNames, getOwnPropertySymbols = Object.getOwnPropertySymbols, getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor, getPrototypeOf = Object.getPrototypeOf, objectPrototype = getPrototypeOf && getPrototypeOf(Object);
    module.exports = function hoistNonReactStatics(targetComponent, sourceComponent, blacklist) {
        if ("string" != typeof sourceComponent) {
            if (objectPrototype) {
                var inheritedComponent = getPrototypeOf(sourceComponent);
                inheritedComponent && inheritedComponent !== objectPrototype && hoistNonReactStatics(targetComponent, inheritedComponent, blacklist);
            }
            var keys = getOwnPropertyNames(sourceComponent);
            getOwnPropertySymbols && (keys = keys.concat(getOwnPropertySymbols(sourceComponent)));
            for (var i = 0; i < keys.length; ++i) {
                var key = keys[i];
                if (!(REACT_STATICS[key] || KNOWN_STATICS[key] || blacklist && blacklist[key])) {
                    var descriptor = getOwnPropertyDescriptor(sourceComponent, key);
                    try {
                        defineProperty(targetComponent, key, descriptor);
                    } catch (e) {}
                }
            }
            return targetComponent;
        }
        return targetComponent;
    };
}, function(module, exports, __webpack_require__) {
    "use strict";
    module.exports = function(condition, format, a, b, c, d, e, f) {
        if (!condition) {
            var error;
            if (void 0 === format) error = new Error("Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings."); else {
                var args = [ a, b, c, d, e, f ], argIndex = 0;
                (error = new Error(format.replace(/%s/g, function() {
                    return args[argIndex++];
                }))).name = "Invariant Violation";
            }
            throw error.framesToPop = 1, error;
        }
    };
}, function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }
    function createListenerCollection() {
        var current = [], next = [];
        return {
            clear: function() {
                next = CLEARED, current = CLEARED;
            },
            notify: function() {
                for (var listeners = current = next, i = 0; i < listeners.length; i++) listeners[i]();
            },
            get: function() {
                return next;
            },
            subscribe: function(listener) {
                var isSubscribed = !0;
                return next === current && (next = current.slice()), next.push(listener), function() {
                    isSubscribed && current !== CLEARED && (isSubscribed = !1, next === current && (next = current.slice()), 
                    next.splice(next.indexOf(listener), 1));
                };
            }
        };
    }
    __webpack_require__.d(__webpack_exports__, "a", function() {
        return Subscription;
    });
    var CLEARED = null, nullListeners = {
        notify: function() {}
    }, Subscription = function() {
        function Subscription(store, parentSub, onStateChange) {
            _classCallCheck(this, Subscription), this.store = store, this.parentSub = parentSub, 
            this.onStateChange = onStateChange, this.unsubscribe = null, this.listeners = nullListeners;
        }
        return Subscription.prototype.addNestedSub = function(listener) {
            return this.trySubscribe(), this.listeners.subscribe(listener);
        }, Subscription.prototype.notifyNestedSubs = function() {
            this.listeners.notify();
        }, Subscription.prototype.isSubscribed = function() {
            return Boolean(this.unsubscribe);
        }, Subscription.prototype.trySubscribe = function() {
            this.unsubscribe || (this.unsubscribe = this.parentSub ? this.parentSub.addNestedSub(this.onStateChange) : this.store.subscribe(this.onStateChange), 
            this.listeners = createListenerCollection());
        }, Subscription.prototype.tryUnsubscribe = function() {
            this.unsubscribe && (this.unsubscribe(), this.unsubscribe = null, this.listeners.clear(), 
            this.listeners = nullListeners);
        }, Subscription;
    }();
}, function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    function _objectWithoutProperties(obj, keys) {
        var target = {};
        for (var i in obj) keys.indexOf(i) >= 0 || Object.prototype.hasOwnProperty.call(obj, i) && (target[i] = obj[i]);
        return target;
    }
    function match(arg, factories, name) {
        for (var i = factories.length - 1; i >= 0; i--) {
            var result = factories[i](arg);
            if (result) return result;
        }
        return function(dispatch, options) {
            throw new Error("Invalid value of type " + typeof arg + " for " + name + " argument when connecting component " + options.wrappedComponentName + ".");
        };
    }
    function strictEqual(a, b) {
        return a === b;
    }
    var __WEBPACK_IMPORTED_MODULE_0__components_connectAdvanced__ = __webpack_require__(608), __WEBPACK_IMPORTED_MODULE_1__utils_shallowEqual__ = __webpack_require__(1139), __WEBPACK_IMPORTED_MODULE_2__mapDispatchToProps__ = __webpack_require__(1140), __WEBPACK_IMPORTED_MODULE_3__mapStateToProps__ = __webpack_require__(1141), __WEBPACK_IMPORTED_MODULE_4__mergeProps__ = __webpack_require__(1142), __WEBPACK_IMPORTED_MODULE_5__selectorFactory__ = __webpack_require__(1143), _extends = Object.assign || function(target) {
        for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i];
            for (var key in source) Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
        }
        return target;
    };
    __webpack_exports__.a = function() {
        var _ref = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}, _ref$connectHOC = _ref.connectHOC, connectHOC = void 0 === _ref$connectHOC ? __WEBPACK_IMPORTED_MODULE_0__components_connectAdvanced__.a : _ref$connectHOC, _ref$mapStateToPropsF = _ref.mapStateToPropsFactories, mapStateToPropsFactories = void 0 === _ref$mapStateToPropsF ? __WEBPACK_IMPORTED_MODULE_3__mapStateToProps__.a : _ref$mapStateToPropsF, _ref$mapDispatchToPro = _ref.mapDispatchToPropsFactories, mapDispatchToPropsFactories = void 0 === _ref$mapDispatchToPro ? __WEBPACK_IMPORTED_MODULE_2__mapDispatchToProps__.a : _ref$mapDispatchToPro, _ref$mergePropsFactor = _ref.mergePropsFactories, mergePropsFactories = void 0 === _ref$mergePropsFactor ? __WEBPACK_IMPORTED_MODULE_4__mergeProps__.a : _ref$mergePropsFactor, _ref$selectorFactory = _ref.selectorFactory, selectorFactory = void 0 === _ref$selectorFactory ? __WEBPACK_IMPORTED_MODULE_5__selectorFactory__.a : _ref$selectorFactory;
        return function(mapStateToProps, mapDispatchToProps, mergeProps) {
            var _ref2 = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : {}, _ref2$pure = _ref2.pure, pure = void 0 === _ref2$pure || _ref2$pure, _ref2$areStatesEqual = _ref2.areStatesEqual, areStatesEqual = void 0 === _ref2$areStatesEqual ? strictEqual : _ref2$areStatesEqual, _ref2$areOwnPropsEqua = _ref2.areOwnPropsEqual, areOwnPropsEqual = void 0 === _ref2$areOwnPropsEqua ? __WEBPACK_IMPORTED_MODULE_1__utils_shallowEqual__.a : _ref2$areOwnPropsEqua, _ref2$areStatePropsEq = _ref2.areStatePropsEqual, areStatePropsEqual = void 0 === _ref2$areStatePropsEq ? __WEBPACK_IMPORTED_MODULE_1__utils_shallowEqual__.a : _ref2$areStatePropsEq, _ref2$areMergedPropsE = _ref2.areMergedPropsEqual, areMergedPropsEqual = void 0 === _ref2$areMergedPropsE ? __WEBPACK_IMPORTED_MODULE_1__utils_shallowEqual__.a : _ref2$areMergedPropsE, extraOptions = _objectWithoutProperties(_ref2, [ "pure", "areStatesEqual", "areOwnPropsEqual", "areStatePropsEqual", "areMergedPropsEqual" ]), initMapStateToProps = match(mapStateToProps, mapStateToPropsFactories, "mapStateToProps"), initMapDispatchToProps = match(mapDispatchToProps, mapDispatchToPropsFactories, "mapDispatchToProps"), initMergeProps = match(mergeProps, mergePropsFactories, "mergeProps");
            return connectHOC(selectorFactory, _extends({
                methodName: "connect",
                getDisplayName: function(name) {
                    return "Connect(" + name + ")";
                },
                shouldHandleStateChanges: Boolean(mapStateToProps),
                initMapStateToProps: initMapStateToProps,
                initMapDispatchToProps: initMapDispatchToProps,
                initMergeProps: initMergeProps,
                pure: pure,
                areStatesEqual: areStatesEqual,
                areOwnPropsEqual: areOwnPropsEqual,
                areStatePropsEqual: areStatePropsEqual,
                areMergedPropsEqual: areMergedPropsEqual
            }, extraOptions));
        };
    }();
}, function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    function is(x, y) {
        return x === y ? 0 !== x || 0 !== y || 1 / x == 1 / y : x !== x && y !== y;
    }
    __webpack_exports__.a = function(objA, objB) {
        if (is(objA, objB)) return !0;
        if ("object" != typeof objA || null === objA || "object" != typeof objB || null === objB) return !1;
        var keysA = Object.keys(objA), keysB = Object.keys(objB);
        if (keysA.length !== keysB.length) return !1;
        for (var i = 0; i < keysA.length; i++) if (!hasOwn.call(objB, keysA[i]) || !is(objA[keysA[i]], objB[keysA[i]])) return !1;
        return !0;
    };
    var hasOwn = Object.prototype.hasOwnProperty;
}, function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    var __WEBPACK_IMPORTED_MODULE_0_redux__ = __webpack_require__(138), __WEBPACK_IMPORTED_MODULE_1__wrapMapToProps__ = __webpack_require__(609);
    __webpack_exports__.a = [ function(mapDispatchToProps) {
        return "function" == typeof mapDispatchToProps ? Object(__WEBPACK_IMPORTED_MODULE_1__wrapMapToProps__.b)(mapDispatchToProps, "mapDispatchToProps") : void 0;
    }, function(mapDispatchToProps) {
        return mapDispatchToProps ? void 0 : Object(__WEBPACK_IMPORTED_MODULE_1__wrapMapToProps__.a)(function(dispatch) {
            return {
                dispatch: dispatch
            };
        });
    }, function(mapDispatchToProps) {
        return mapDispatchToProps && "object" == typeof mapDispatchToProps ? Object(__WEBPACK_IMPORTED_MODULE_1__wrapMapToProps__.a)(function(dispatch) {
            return Object(__WEBPACK_IMPORTED_MODULE_0_redux__.bindActionCreators)(mapDispatchToProps, dispatch);
        }) : void 0;
    } ];
}, function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    var __WEBPACK_IMPORTED_MODULE_0__wrapMapToProps__ = __webpack_require__(609);
    __webpack_exports__.a = [ function(mapStateToProps) {
        return "function" == typeof mapStateToProps ? Object(__WEBPACK_IMPORTED_MODULE_0__wrapMapToProps__.b)(mapStateToProps, "mapStateToProps") : void 0;
    }, function(mapStateToProps) {
        return mapStateToProps ? void 0 : Object(__WEBPACK_IMPORTED_MODULE_0__wrapMapToProps__.a)(function() {
            return {};
        });
    } ];
}, function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    function defaultMergeProps(stateProps, dispatchProps, ownProps) {
        return _extends({}, ownProps, stateProps, dispatchProps);
    }
    function wrapMergePropsFunc(mergeProps) {
        return function(dispatch, _ref) {
            _ref.displayName;
            var pure = _ref.pure, areMergedPropsEqual = _ref.areMergedPropsEqual, hasRunOnce = !1, mergedProps = void 0;
            return function(stateProps, dispatchProps, ownProps) {
                var nextMergedProps = mergeProps(stateProps, dispatchProps, ownProps);
                return hasRunOnce ? pure && areMergedPropsEqual(nextMergedProps, mergedProps) || (mergedProps = nextMergedProps) : (hasRunOnce = !0, 
                mergedProps = nextMergedProps), mergedProps;
            };
        };
    }
    __webpack_require__(610);
    var _extends = Object.assign || function(target) {
        for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i];
            for (var key in source) Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
        }
        return target;
    };
    __webpack_exports__.a = [ function(mergeProps) {
        return "function" == typeof mergeProps ? wrapMergePropsFunc(mergeProps) : void 0;
    }, function(mergeProps) {
        return mergeProps ? void 0 : function() {
            return defaultMergeProps;
        };
    } ];
}, function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    function _objectWithoutProperties(obj, keys) {
        var target = {};
        for (var i in obj) keys.indexOf(i) >= 0 || Object.prototype.hasOwnProperty.call(obj, i) && (target[i] = obj[i]);
        return target;
    }
    function impureFinalPropsSelectorFactory(mapStateToProps, mapDispatchToProps, mergeProps, dispatch) {
        return function(state, ownProps) {
            return mergeProps(mapStateToProps(state, ownProps), mapDispatchToProps(dispatch, ownProps), ownProps);
        };
    }
    function pureFinalPropsSelectorFactory(mapStateToProps, mapDispatchToProps, mergeProps, dispatch, _ref) {
        function handleFirstCall(firstState, firstOwnProps) {
            return state = firstState, ownProps = firstOwnProps, stateProps = mapStateToProps(state, ownProps), 
            dispatchProps = mapDispatchToProps(dispatch, ownProps), mergedProps = mergeProps(stateProps, dispatchProps, ownProps), 
            hasRunAtLeastOnce = !0, mergedProps;
        }
        function handleNewPropsAndNewState() {
            return stateProps = mapStateToProps(state, ownProps), mapDispatchToProps.dependsOnOwnProps && (dispatchProps = mapDispatchToProps(dispatch, ownProps)), 
            mergedProps = mergeProps(stateProps, dispatchProps, ownProps);
        }
        function handleNewProps() {
            return mapStateToProps.dependsOnOwnProps && (stateProps = mapStateToProps(state, ownProps)), 
            mapDispatchToProps.dependsOnOwnProps && (dispatchProps = mapDispatchToProps(dispatch, ownProps)), 
            mergedProps = mergeProps(stateProps, dispatchProps, ownProps);
        }
        function handleNewState() {
            var nextStateProps = mapStateToProps(state, ownProps), statePropsChanged = !areStatePropsEqual(nextStateProps, stateProps);
            return stateProps = nextStateProps, statePropsChanged && (mergedProps = mergeProps(stateProps, dispatchProps, ownProps)), 
            mergedProps;
        }
        function handleSubsequentCalls(nextState, nextOwnProps) {
            var propsChanged = !areOwnPropsEqual(nextOwnProps, ownProps), stateChanged = !areStatesEqual(nextState, state);
            return state = nextState, ownProps = nextOwnProps, propsChanged && stateChanged ? handleNewPropsAndNewState() : propsChanged ? handleNewProps() : stateChanged ? handleNewState() : mergedProps;
        }
        var areStatesEqual = _ref.areStatesEqual, areOwnPropsEqual = _ref.areOwnPropsEqual, areStatePropsEqual = _ref.areStatePropsEqual, hasRunAtLeastOnce = !1, state = void 0, ownProps = void 0, stateProps = void 0, dispatchProps = void 0, mergedProps = void 0;
        return function(nextState, nextOwnProps) {
            return hasRunAtLeastOnce ? handleSubsequentCalls(nextState, nextOwnProps) : handleFirstCall(nextState, nextOwnProps);
        };
    }
    __webpack_exports__.a = function(dispatch, _ref2) {
        var initMapStateToProps = _ref2.initMapStateToProps, initMapDispatchToProps = _ref2.initMapDispatchToProps, initMergeProps = _ref2.initMergeProps, options = _objectWithoutProperties(_ref2, [ "initMapStateToProps", "initMapDispatchToProps", "initMergeProps" ]), mapStateToProps = initMapStateToProps(dispatch, options), mapDispatchToProps = initMapDispatchToProps(dispatch, options), mergeProps = initMergeProps(dispatch, options);
        return (options.pure ? pureFinalPropsSelectorFactory : impureFinalPropsSelectorFactory)(mapStateToProps, mapDispatchToProps, mergeProps, dispatch, options);
    };
    __webpack_require__(1144);
}, function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    __webpack_require__(435);
}, function(module, exports, __webpack_require__) {
    "use strict";
    var __extends = this && this.__extends || function() {
        var extendStatics = Object.setPrototypeOf || {
            __proto__: []
        } instanceof Array && function(d, b) {
            d.__proto__ = b;
        } || function(d, b) {
            for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return function(d, b) {
            function __() {
                this.constructor = d;
            }
            extendStatics(d, b), d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, 
            new __());
        };
    }();
    Object.defineProperty(exports, "__esModule", {
        value: !0
    });
    var React = __webpack_require__(5), dom_1 = __webpack_require__(3), url_1 = __webpack_require__(87), header_1 = __webpack_require__(436), style = __webpack_require__(1147), SigninComponent = function(_super) {
        function SigninComponent() {
            return null !== _super && _super.apply(this, arguments) || this;
        }
        return __extends(SigninComponent, _super), SigninComponent.prototype.render = function() {
            return React.createElement("div", {
                className: style.signin
            }, React.createElement(header_1.Header, null), React.createElement("div", {
                className: style.content
            }, React.createElement("div", {
                className: style.banner
            }, "Grammarly is active, but", React.createElement("br", null), "key features are missing"), React.createElement("div", {
                className: style.descr
            }, React.createElement("div", {
                className: style.descr_title
            }, "Sign up now to unlock the following:"), React.createElement("ul", null, React.createElement("li", null, "Enable/disable on preferred websites"), React.createElement("li", null, "Store your personal dictionary"), React.createElement("li", null, "Save and access your work from any computer"), React.createElement("li", null, "Get weekly writing statistics and tips"))), React.createElement("div", {
                className: style.buttons
            }, React.createElement("a", {
                href: url_1.getSignUpURL("signupHook", "toolbarMenu"),
                "data-fire": "login-attempt, settings_toolbar_sign_up",
                target: "__blank",
                className: dom_1.cs(style.button, style.auth_button),
                role: "button"
            }, React.createElement("span", {
                className: style.sign_up
            }, "Sign Up"), React.createElement("span", {
                className: style.free
            }, "It's free")))), React.createElement("div", {
                className: style.footer
            }, React.createElement("div", {
                className: style.login_text
            }, "Already have an account?", " ", React.createElement("a", {
                href: url_1.getSignInURL(),
                "data-fire": "login-attempt, settings_toolbar_sign_in",
                target: "__blank",
                className: style.signin_link
            }, "Log in"))));
        }, SigninComponent;
    }(React.Component);
    exports.SigninComponent = SigninComponent;
}, function(module, exports) {
    module.exports = {
        header: "_2Yqtj",
        logo: "_3Dkhr",
        chrome: "_1vf40",
        safari: "_2UKts",
        firefox: "_4jHPl",
        edge: "_1n9ln"
    };
}, function(module, exports) {
    module.exports = {
        signin: "LPW1J",
        banner: "_3scAt",
        descr: "_2Hmle",
        descr_title: "_3I7xV",
        buttons: "_2NbJ4",
        button: "_1ZRNT",
        auth_button: "MIF9G",
        sign_up: "O93h_",
        free: "_1DVz-",
        footer: "_3Z8CX",
        signin_link: "_3f4Ye"
    };
}, function(module, exports, __webpack_require__) {
    "use strict";
    var __extends = this && this.__extends || function() {
        var extendStatics = Object.setPrototypeOf || {
            __proto__: []
        } instanceof Array && function(d, b) {
            d.__proto__ = b;
        } || function(d, b) {
            for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return function(d, b) {
            function __() {
                this.constructor = d;
            }
            extendStatics(d, b), d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, 
            new __());
        };
    }();
    Object.defineProperty(exports, "__esModule", {
        value: !0
    });
    var React = __webpack_require__(5), dom_1 = __webpack_require__(3), header_1 = __webpack_require__(436), footer_1 = __webpack_require__(611), news_1 = __webpack_require__(1149), settings_content_1 = __webpack_require__(1151), location_1 = __webpack_require__(15), style = __webpack_require__(113), tracking_1 = __webpack_require__(180), content_1 = __webpack_require__(430), SettingsComponent = function(_super) {
        function SettingsComponent() {
            return null !== _super && _super.apply(this, arguments) || this;
        }
        return __extends(SettingsComponent, _super), SettingsComponent.prototype.render = function() {
            var _a = this.props, user = _a.user, settings = _a.settings, config = _a.config, activeTab = _a.activeTab, actions = _a.actions, openUrl = _a.openUrl, reloadTab = _a.reloadTab, cls = dom_1.cs(style.gr_popup_settings, user.premium ? style.upgraded : style.free, (_b = {}, 
            _b[style.not_supported] = !config.enabled, _b[style.no_fixes] = !user.fixed_errors || isNaN(user.fixed_errors), 
            _b[style.show_news] = settings.showNews && config.enabled, _b[style.has_favicon] = !!activeTab.favIconUrl, 
            _b)), content = location_1.isGdocsSite() && user.experiments && user.experiments.googleDocsOffice && !settings.enabled ? [ React.createElement(content_1.OptInContentComponent, {
                key: "opt-in",
                onClick: function() {
                    actions.toggleSite(!0, config.domain), tracking_1.gnar.checkingToggleClick("toolbar", "on"), 
                    reloadTab(activeTab.id);
                }
            }) ] : [ React.createElement(news_1.News, {
                key: "news",
                showNews: actions.showNews
            }), React.createElement(settings_content_1.SettingsContent, {
                key: "content",
                actions: actions,
                activeTab: activeTab,
                config: config,
                settings: settings,
                user: user
            }) ];
            return React.createElement("div", {
                className: cls
            }, React.createElement("div", {
                className: style.content
            }, React.createElement(header_1.Header, null), content, React.createElement(footer_1.Footer, {
                openUrl: openUrl
            })));
            var _b;
        }, SettingsComponent;
    }(React.Component);
    exports.SettingsComponent = SettingsComponent;
}, function(module, exports, __webpack_require__) {
    "use strict";
    var __extends = this && this.__extends || function() {
        var extendStatics = Object.setPrototypeOf || {
            __proto__: []
        } instanceof Array && function(d, b) {
            d.__proto__ = b;
        } || function(d, b) {
            for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return function(d, b) {
            function __() {
                this.constructor = d;
            }
            extendStatics(d, b), d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, 
            new __());
        };
    }();
    Object.defineProperty(exports, "__esModule", {
        value: !0
    });
    var React = __webpack_require__(5), spark_md5_1 = __webpack_require__(1150), dom_1 = __webpack_require__(3), config_1 = __webpack_require__(10), style = __webpack_require__(113), News = function(_super) {
        function News() {
            var _this = null !== _super && _super.apply(this, arguments) || this;
            return _this.closeNews = function() {
                _this.props.showNews(!1);
            }, _this;
        }
        return __extends(News, _super), News.prototype.render = function() {
            return React.createElement("div", {
                className: dom_1.cs(style.line, style.news)
            }, React.createElement("div", {
                onClick: this.closeNews,
                className: style.close_news
            }), React.createElement("div", {
                className: style.news_content
            }, React.createElement("h2", null, "What's new in this update:"), React.createElement("ul", null, config_1.news.map(function(value) {
                return React.createElement("li", {
                    key: spark_md5_1.hash(value)
                }, value);
            }))));
        }, News;
    }(React.Component);
    exports.News = News;
}, function(module, exports, __webpack_require__) {
    !function(factory) {
        module.exports = factory();
    }(function(undefined) {
        "use strict";
        function cmn(q, a, b, x, s, t) {
            return a = add32(add32(a, q), add32(x, t)), add32(a << s | a >>> 32 - s, b);
        }
        function ff(a, b, c, d, x, s, t) {
            return cmn(b & c | ~b & d, a, b, x, s, t);
        }
        function gg(a, b, c, d, x, s, t) {
            return cmn(b & d | c & ~d, a, b, x, s, t);
        }
        function hh(a, b, c, d, x, s, t) {
            return cmn(b ^ c ^ d, a, b, x, s, t);
        }
        function ii(a, b, c, d, x, s, t) {
            return cmn(c ^ (b | ~d), a, b, x, s, t);
        }
        function md5cycle(x, k) {
            var a = x[0], b = x[1], c = x[2], d = x[3];
            b = ii(b = ii(b = ii(b = ii(b = hh(b = hh(b = hh(b = hh(b = gg(b = gg(b = gg(b = gg(b = ff(b = ff(b = ff(b = ff(b, c = ff(c, d = ff(d, a = ff(a, b, c, d, k[0], 7, -680876936), b, c, k[1], 12, -389564586), a, b, k[2], 17, 606105819), d, a, k[3], 22, -1044525330), c = ff(c, d = ff(d, a = ff(a, b, c, d, k[4], 7, -176418897), b, c, k[5], 12, 1200080426), a, b, k[6], 17, -1473231341), d, a, k[7], 22, -45705983), c = ff(c, d = ff(d, a = ff(a, b, c, d, k[8], 7, 1770035416), b, c, k[9], 12, -1958414417), a, b, k[10], 17, -42063), d, a, k[11], 22, -1990404162), c = ff(c, d = ff(d, a = ff(a, b, c, d, k[12], 7, 1804603682), b, c, k[13], 12, -40341101), a, b, k[14], 17, -1502002290), d, a, k[15], 22, 1236535329), c = gg(c, d = gg(d, a = gg(a, b, c, d, k[1], 5, -165796510), b, c, k[6], 9, -1069501632), a, b, k[11], 14, 643717713), d, a, k[0], 20, -373897302), c = gg(c, d = gg(d, a = gg(a, b, c, d, k[5], 5, -701558691), b, c, k[10], 9, 38016083), a, b, k[15], 14, -660478335), d, a, k[4], 20, -405537848), c = gg(c, d = gg(d, a = gg(a, b, c, d, k[9], 5, 568446438), b, c, k[14], 9, -1019803690), a, b, k[3], 14, -187363961), d, a, k[8], 20, 1163531501), c = gg(c, d = gg(d, a = gg(a, b, c, d, k[13], 5, -1444681467), b, c, k[2], 9, -51403784), a, b, k[7], 14, 1735328473), d, a, k[12], 20, -1926607734), c = hh(c, d = hh(d, a = hh(a, b, c, d, k[5], 4, -378558), b, c, k[8], 11, -2022574463), a, b, k[11], 16, 1839030562), d, a, k[14], 23, -35309556), c = hh(c, d = hh(d, a = hh(a, b, c, d, k[1], 4, -1530992060), b, c, k[4], 11, 1272893353), a, b, k[7], 16, -155497632), d, a, k[10], 23, -1094730640), c = hh(c, d = hh(d, a = hh(a, b, c, d, k[13], 4, 681279174), b, c, k[0], 11, -358537222), a, b, k[3], 16, -722521979), d, a, k[6], 23, 76029189), c = hh(c, d = hh(d, a = hh(a, b, c, d, k[9], 4, -640364487), b, c, k[12], 11, -421815835), a, b, k[15], 16, 530742520), d, a, k[2], 23, -995338651), c = ii(c, d = ii(d, a = ii(a, b, c, d, k[0], 6, -198630844), b, c, k[7], 10, 1126891415), a, b, k[14], 15, -1416354905), d, a, k[5], 21, -57434055), c = ii(c, d = ii(d, a = ii(a, b, c, d, k[12], 6, 1700485571), b, c, k[3], 10, -1894986606), a, b, k[10], 15, -1051523), d, a, k[1], 21, -2054922799), c = ii(c, d = ii(d, a = ii(a, b, c, d, k[8], 6, 1873313359), b, c, k[15], 10, -30611744), a, b, k[6], 15, -1560198380), d, a, k[13], 21, 1309151649), c = ii(c, d = ii(d, a = ii(a, b, c, d, k[4], 6, -145523070), b, c, k[11], 10, -1120210379), a, b, k[2], 15, 718787259), d, a, k[9], 21, -343485551), 
            x[0] = add32(a, x[0]), x[1] = add32(b, x[1]), x[2] = add32(c, x[2]), x[3] = add32(d, x[3]);
        }
        function md5blk(s) {
            var i, md5blks = [];
            for (i = 0; i < 64; i += 4) md5blks[i >> 2] = s.charCodeAt(i) + (s.charCodeAt(i + 1) << 8) + (s.charCodeAt(i + 2) << 16) + (s.charCodeAt(i + 3) << 24);
            return md5blks;
        }
        function md5blk_array(a) {
            var i, md5blks = [];
            for (i = 0; i < 64; i += 4) md5blks[i >> 2] = a[i] + (a[i + 1] << 8) + (a[i + 2] << 16) + (a[i + 3] << 24);
            return md5blks;
        }
        function md51(s) {
            var i, length, tail, tmp, lo, hi, n = s.length, state = [ 1732584193, -271733879, -1732584194, 271733878 ];
            for (i = 64; i <= n; i += 64) md5cycle(state, md5blk(s.substring(i - 64, i)));
            for (length = (s = s.substring(i - 64)).length, tail = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], 
            i = 0; i < length; i += 1) tail[i >> 2] |= s.charCodeAt(i) << (i % 4 << 3);
            if (tail[i >> 2] |= 128 << (i % 4 << 3), i > 55) for (md5cycle(state, tail), i = 0; i < 16; i += 1) tail[i] = 0;
            return tmp = 8 * n, tmp = tmp.toString(16).match(/(.*?)(.{0,8})$/), lo = parseInt(tmp[2], 16), 
            hi = parseInt(tmp[1], 16) || 0, tail[14] = lo, tail[15] = hi, md5cycle(state, tail), 
            state;
        }
        function md51_array(a) {
            var i, length, tail, tmp, lo, hi, n = a.length, state = [ 1732584193, -271733879, -1732584194, 271733878 ];
            for (i = 64; i <= n; i += 64) md5cycle(state, md5blk_array(a.subarray(i - 64, i)));
            for (length = (a = i - 64 < n ? a.subarray(i - 64) : new Uint8Array(0)).length, 
            tail = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], i = 0; i < length; i += 1) tail[i >> 2] |= a[i] << (i % 4 << 3);
            if (tail[i >> 2] |= 128 << (i % 4 << 3), i > 55) for (md5cycle(state, tail), i = 0; i < 16; i += 1) tail[i] = 0;
            return tmp = 8 * n, tmp = tmp.toString(16).match(/(.*?)(.{0,8})$/), lo = parseInt(tmp[2], 16), 
            hi = parseInt(tmp[1], 16) || 0, tail[14] = lo, tail[15] = hi, md5cycle(state, tail), 
            state;
        }
        function rhex(n) {
            var j, s = "";
            for (j = 0; j < 4; j += 1) s += hex_chr[n >> 8 * j + 4 & 15] + hex_chr[n >> 8 * j & 15];
            return s;
        }
        function hex(x) {
            var i;
            for (i = 0; i < x.length; i += 1) x[i] = rhex(x[i]);
            return x.join("");
        }
        function toUtf8(str) {
            return /[\u0080-\uFFFF]/.test(str) && (str = unescape(encodeURIComponent(str))), 
            str;
        }
        function utf8Str2ArrayBuffer(str, returnUInt8Array) {
            var i, length = str.length, buff = new ArrayBuffer(length), arr = new Uint8Array(buff);
            for (i = 0; i < length; i++) arr[i] = str.charCodeAt(i);
            return returnUInt8Array ? arr : buff;
        }
        function arrayBuffer2Utf8Str(buff) {
            return String.fromCharCode.apply(null, new Uint8Array(buff));
        }
        function concatenateArrayBuffers(first, second, returnUInt8Array) {
            var result = new Uint8Array(first.byteLength + second.byteLength);
            return result.set(new Uint8Array(first)), result.set(new Uint8Array(second), first.byteLength), 
            returnUInt8Array ? result : result.buffer;
        }
        function SparkMD5() {
            this.reset();
        }
        var add32 = function(a, b) {
            return a + b & 4294967295;
        }, hex_chr = [ "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f" ];
        return "5d41402abc4b2a76b9719d911017c592" !== hex(md51("hello")) && (add32 = function(x, y) {
            var lsw = (65535 & x) + (65535 & y);
            return (x >> 16) + (y >> 16) + (lsw >> 16) << 16 | 65535 & lsw;
        }), SparkMD5.prototype.append = function(str) {
            return this.appendBinary(toUtf8(str)), this;
        }, SparkMD5.prototype.appendBinary = function(contents) {
            this._buff += contents, this._length += contents.length;
            var i, length = this._buff.length;
            for (i = 64; i <= length; i += 64) md5cycle(this._hash, md5blk(this._buff.substring(i - 64, i)));
            return this._buff = this._buff.substring(i - 64), this;
        }, SparkMD5.prototype.end = function(raw) {
            var i, ret, buff = this._buff, length = buff.length, tail = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
            for (i = 0; i < length; i += 1) tail[i >> 2] |= buff.charCodeAt(i) << (i % 4 << 3);
            return this._finish(tail, length), ret = raw ? this._hash : hex(this._hash), this.reset(), 
            ret;
        }, SparkMD5.prototype.reset = function() {
            return this._buff = "", this._length = 0, this._hash = [ 1732584193, -271733879, -1732584194, 271733878 ], 
            this;
        }, SparkMD5.prototype.getState = function() {
            return {
                buff: this._buff,
                length: this._length,
                hash: this._hash
            };
        }, SparkMD5.prototype.setState = function(state) {
            return this._buff = state.buff, this._length = state.length, this._hash = state.hash, 
            this;
        }, SparkMD5.prototype.destroy = function() {
            delete this._hash, delete this._buff, delete this._length;
        }, SparkMD5.prototype._finish = function(tail, length) {
            var tmp, lo, hi, i = length;
            if (tail[i >> 2] |= 128 << (i % 4 << 3), i > 55) for (md5cycle(this._hash, tail), 
            i = 0; i < 16; i += 1) tail[i] = 0;
            tmp = (tmp = 8 * this._length).toString(16).match(/(.*?)(.{0,8})$/), lo = parseInt(tmp[2], 16), 
            hi = parseInt(tmp[1], 16) || 0, tail[14] = lo, tail[15] = hi, md5cycle(this._hash, tail);
        }, SparkMD5.hash = function(str, raw) {
            return SparkMD5.hashBinary(toUtf8(str), raw);
        }, SparkMD5.hashBinary = function(content, raw) {
            var hash = md51(content);
            return raw ? hash : hex(hash);
        }, SparkMD5.ArrayBuffer = function() {
            this.reset();
        }, SparkMD5.ArrayBuffer.prototype.append = function(arr) {
            var i, buff = concatenateArrayBuffers(this._buff.buffer, arr, !0), length = buff.length;
            for (this._length += arr.byteLength, i = 64; i <= length; i += 64) md5cycle(this._hash, md5blk_array(buff.subarray(i - 64, i)));
            return this._buff = i - 64 < length ? buff.subarray(i - 64) : new Uint8Array(0), 
            this;
        }, SparkMD5.ArrayBuffer.prototype.end = function(raw) {
            var i, ret, buff = this._buff, length = buff.length, tail = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
            for (i = 0; i < length; i += 1) tail[i >> 2] |= buff[i] << (i % 4 << 3);
            return this._finish(tail, length), ret = raw ? this._hash : hex(this._hash), this.reset(), 
            ret;
        }, SparkMD5.ArrayBuffer.prototype.reset = function() {
            return this._buff = new Uint8Array(0), this._length = 0, this._hash = [ 1732584193, -271733879, -1732584194, 271733878 ], 
            this;
        }, SparkMD5.ArrayBuffer.prototype.getState = function() {
            var state = SparkMD5.prototype.getState.call(this);
            return state.buff = arrayBuffer2Utf8Str(state.buff), state;
        }, SparkMD5.ArrayBuffer.prototype.setState = function(state) {
            return state.buff = utf8Str2ArrayBuffer(state.buff, !0), SparkMD5.prototype.setState.call(this, state);
        }, SparkMD5.ArrayBuffer.prototype.destroy = SparkMD5.prototype.destroy, SparkMD5.ArrayBuffer.prototype._finish = SparkMD5.prototype._finish, 
        SparkMD5.ArrayBuffer.hash = function(arr, raw) {
            var hash = md51_array(new Uint8Array(arr));
            return raw ? hash : hex(hash);
        }, SparkMD5;
    });
}, function(module, exports, __webpack_require__) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    });
    var React = __webpack_require__(5), summary_1 = __webpack_require__(1152), dialect_line_1 = __webpack_require__(1153), defs_switcher_1 = __webpack_require__(1155), email_perception_switcher_1 = __webpack_require__(1156), site_switcher_1 = __webpack_require__(1157);
    exports.SettingsContent = function(props) {
        var actions = props.actions, activeTab = props.activeTab, config = props.config, settings = props.settings, user = props.user;
        return React.createElement("div", null, settings.activeEmailPerception && React.createElement(email_perception_switcher_1.EmailPerceptionSwitcher, {
            enabledEmailPerception: settings.enabledEmailPerception,
            toggleEmailPerception: actions.toggleEmailPerception
        }), React.createElement(site_switcher_1.SiteSwitcher, {
            domain: config.domain,
            toggleSite: actions.toggleSite,
            enabledInConfig: config.enabled,
            enabledInSettings: settings.enabled,
            favicon: activeTab.favIconUrl
        }), React.createElement(defs_switcher_1.DefsSwitcher, {
            enabledDefs: settings.enabledDefs,
            toggleDefs: actions.toggleDefs
        }), React.createElement(dialect_line_1.DialectLine, {
            changeStrongDialect: actions.changeStrongDialect,
            dialectStrong: settings.dialectStrong,
            dialectWeak: settings.dialectWeak
        }), React.createElement(summary_1.Summary, {
            user: user
        }));
    };
}, function(module, exports, __webpack_require__) {
    "use strict";
    var __extends = this && this.__extends || function() {
        var extendStatics = Object.setPrototypeOf || {
            __proto__: []
        } instanceof Array && function(d, b) {
            d.__proto__ = b;
        } || function(d, b) {
            for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return function(d, b) {
            function __() {
                this.constructor = d;
            }
            extendStatics(d, b), d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, 
            new __());
        };
    }();
    Object.defineProperty(exports, "__esModule", {
        value: !0
    });
    var React = __webpack_require__(5), dom_1 = __webpack_require__(3), url_1 = __webpack_require__(87), util_1 = __webpack_require__(2), style = __webpack_require__(113), Summary = function(_super) {
        function Summary() {
            return null !== _super && _super.apply(this, arguments) || this;
        }
        return __extends(Summary, _super), Summary.prototype.render = function() {
            var _a = this.props.user, premium = _a.premium, registrationDate = _a.registrationDate, fixedErrors = _a.fixed_errors, errorTypeLbl = premium ? "critical and advanced" : "critical", fixed = !fixedErrors || isNaN(fixedErrors) ? 0 : fixedErrors, fixedFormated = "0" === util_1.formatNumber(fixed) ? "No" : util_1.formatNumber(fixed), lbl = util_1.declension(fixed, [ "fix", "fixes" ]), date = util_1.formatDate(registrationDate), dateStr = date ? "since " + date : "";
            return React.createElement("div", {
                className: dom_1.cs(style.line, style.summary)
            }, React.createElement("div", {
                className: style.errors
            }, React.createElement("span", {
                className: dom_1.cs(style.count, style.lblCount)
            }, fixedFormated), React.createElement("span", {
                className: style.descr
            }, errorTypeLbl, " ", React.createElement("span", {
                className: style.errorsLbl
            }, lbl), " ", React.createElement("span", {
                className: style.since
            }, dateStr))), React.createElement("div", {
                className: style.upgrade
            }, React.createElement("a", {
                href: url_1.getUpgradeURL("upHook", "settingsToolbar"),
                "data-fire": "hook-clicked, settings_toolbar",
                target: "_blank",
                className: style.upgrade_title
            }, "Go Premium to enable advanced fixes")));
        }, Summary;
    }(React.Component);
    exports.Summary = Summary;
}, function(module, exports, __webpack_require__) {
    "use strict";
    var __extends = this && this.__extends || function() {
        var extendStatics = Object.setPrototypeOf || {
            __proto__: []
        } instanceof Array && function(d, b) {
            d.__proto__ = b;
        } || function(d, b) {
            for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return function(d, b) {
            function __() {
                this.constructor = d;
            }
            extendStatics(d, b), d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, 
            new __());
        };
    }();
    Object.defineProperty(exports, "__esModule", {
        value: !0
    });
    var React = __webpack_require__(5), style = __webpack_require__(1154), dom_1 = __webpack_require__(3), tracking_1 = __webpack_require__(180), DialectLine = function(_super) {
        function DialectLine() {
            var _this = null !== _super && _super.apply(this, arguments) || this;
            return _this.onDialectChange = function(e) {
                var _a = _this.props, changeStrongDialect = _a.changeStrongDialect, dialectWeak = _a.dialectWeak, dialectStrong = e.target.value;
                changeStrongDialect(dialectStrong);
                var trackingVal = dialectStrong + "English";
                tracking_1.gnar.languageSettingUpdate(trackingVal, "user", dialectWeak && dialectStrong === dialectWeak);
            }, _this;
        }
        return __extends(DialectLine, _super), DialectLine.prototype.render = function() {
            var dialect = this.props.dialectStrong || this.props.dialectWeak || "american", dialectSwitcherCls = dom_1.cs(style.line, style.dialect_switcher);
            return React.createElement("div", {
                className: dialectSwitcherCls
            }, React.createElement("span", null, "I write in"), React.createElement("div", {
                className: style.selectWrap
            }, React.createElement("select", {
                className: style.select,
                onChange: this.onDialectChange,
                value: dialect
            }, React.createElement("option", {
                value: "american"
            }, "American English"), React.createElement("option", {
                value: "british"
            }, "British English"), React.createElement("option", {
                value: "australian"
            }, "Australian English"), React.createElement("option", {
                value: "canadian"
            }, "Canadian English"))));
        }, DialectLine;
    }(React.Component);
    exports.DialectLine = DialectLine;
}, function(module, exports) {
    module.exports = {
        line: "_3WsyC",
        dialect_switcher: "fvLLo",
        select: "_283PU",
        selectWrap: "Dwiig"
    };
}, function(module, exports, __webpack_require__) {
    "use strict";
    var __extends = this && this.__extends || function() {
        var extendStatics = Object.setPrototypeOf || {
            __proto__: []
        } instanceof Array && function(d, b) {
            d.__proto__ = b;
        } || function(d, b) {
            for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return function(d, b) {
            function __() {
                this.constructor = d;
            }
            extendStatics(d, b), d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, 
            new __());
        };
    }();
    Object.defineProperty(exports, "__esModule", {
        value: !0
    });
    var React = __webpack_require__(5), dom_1 = __webpack_require__(3), tracking_1 = __webpack_require__(9), tracking_2 = __webpack_require__(180), checkboxStyle = __webpack_require__(437), style = __webpack_require__(113), DefsSwitcher = function(_super) {
        function DefsSwitcher() {
            var _this = null !== _super && _super.apply(this, arguments) || this;
            return _this.onEnableDefsClick = function(e) {
                var toggleDefs = _this.props.toggleDefs, enabled = e.target.checked;
                toggleDefs(enabled), tracking_2.gnar.definitionToggleClick(enabled ? "on" : "off"), 
                tracking_1.felog.toggleExtensionDefs(enabled);
            }, _this;
        }
        return __extends(DefsSwitcher, _super), DefsSwitcher.prototype.render = function() {
            var enabledDefs = this.props.enabledDefs, defsSwitcherCls = dom_1.cs(style.def_switcher, style.line, style.setting_item, enabledDefs ? style.on : style.off);
            return React.createElement("div", {
                className: defsSwitcherCls
            }, React.createElement("label", {
                className: checkboxStyle.select_checkbox
            }, "Show Definitions and Synonyms ", React.createElement("br", null), "via Double Clicks (All Sites)", React.createElement("input", {
                className: checkboxStyle.checkbox,
                onChange: this.onEnableDefsClick,
                checked: enabledDefs,
                type: "checkbox"
            }), React.createElement("div", {
                className: checkboxStyle.checkbox_check
            }, React.createElement("div", {
                className: checkboxStyle.checkbox_check_round
            }))), React.createElement("div", {
                className: style.short_border
            }));
        }, DefsSwitcher;
    }(React.Component);
    exports.DefsSwitcher = DefsSwitcher;
}, function(module, exports, __webpack_require__) {
    "use strict";
    var __extends = this && this.__extends || function() {
        var extendStatics = Object.setPrototypeOf || {
            __proto__: []
        } instanceof Array && function(d, b) {
            d.__proto__ = b;
        } || function(d, b) {
            for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return function(d, b) {
            function __() {
                this.constructor = d;
            }
            extendStatics(d, b), d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, 
            new __());
        };
    }();
    Object.defineProperty(exports, "__esModule", {
        value: !0
    });
    var React = __webpack_require__(5), dom_1 = __webpack_require__(3), tracking_1 = __webpack_require__(180), checkboxStyle = __webpack_require__(437), style = __webpack_require__(113), EmailPerceptionSwitcher = function(_super) {
        function EmailPerceptionSwitcher() {
            var _this = null !== _super && _super.apply(this, arguments) || this;
            return _this.onEnableClick = function(e) {
                var toggleEmailPerception = _this.props.toggleEmailPerception, enabled = e.target.checked;
                toggleEmailPerception(enabled), tracking_1.fire("toggle-email-perception", {
                    enabled: enabled,
                    placement: "toolbar"
                });
            }, _this;
        }
        return __extends(EmailPerceptionSwitcher, _super), EmailPerceptionSwitcher.prototype.render = function() {
            var enabledEmailPerception = this.props.enabledEmailPerception, cls = dom_1.cs(style.def_switcher, style.line, style.setting_item, enabledEmailPerception ? style.on : style.off);
            return React.createElement("div", {
                className: cls
            }, React.createElement("label", {
                className: checkboxStyle.select_checkbox
            }, "Poll Email Recipients About the", React.createElement("br", null), " Quality of Your Emails", React.createElement("input", {
                className: checkboxStyle.checkbox,
                onChange: this.onEnableClick,
                checked: enabledEmailPerception,
                type: "checkbox"
            }), React.createElement("div", {
                className: checkboxStyle.checkbox_check
            }, React.createElement("div", {
                className: checkboxStyle.checkbox_check_round
            }))), React.createElement("div", {
                className: style.short_border
            }));
        }, EmailPerceptionSwitcher;
    }(React.Component);
    exports.EmailPerceptionSwitcher = EmailPerceptionSwitcher;
}, function(module, exports, __webpack_require__) {
    "use strict";
    var __extends = this && this.__extends || function() {
        var extendStatics = Object.setPrototypeOf || {
            __proto__: []
        } instanceof Array && function(d, b) {
            d.__proto__ = b;
        } || function(d, b) {
            for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return function(d, b) {
            function __() {
                this.constructor = d;
            }
            extendStatics(d, b), d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, 
            new __());
        };
    }();
    Object.defineProperty(exports, "__esModule", {
        value: !0
    });
    var React = __webpack_require__(5), dom_1 = __webpack_require__(3), tracking_1 = __webpack_require__(9), tracking_2 = __webpack_require__(180), style = __webpack_require__(113), checkboxStyle = __webpack_require__(437), SiteSwitcher = function(_super) {
        function SiteSwitcher() {
            var _this = null !== _super && _super.apply(this, arguments) || this;
            return _this.onEnableGrammarClick = function(e) {
                var _a = _this.props, toggleSite = _a.toggleSite, domain = _a.domain, enabled = e.target.checked;
                toggleSite(enabled, domain), tracking_2.gnar.checkingToggleClick("toolbar", enabled ? "on" : "off"), 
                tracking_1.felog.toggleExtension(enabled, "toolbar");
            }, _this;
        }
        return __extends(SiteSwitcher, _super), SiteSwitcher.prototype.render = function() {
            var _a = this.props, enabledInConfig = _a.enabledInConfig, enabledInSettings = _a.enabledInSettings, favicon = _a.favicon, domain = _a.domain, enabled = enabledInSettings && enabledInConfig, disableLabel = enabledInConfig ? "Check Grammar and Spelling" : "Checking is not supported", siteSwitcherCls = dom_1.cs(style.site_switcher, style.line, style.setting_item, enabled ? style.on : style.off);
            return React.createElement("div", {
                className: siteSwitcherCls
            }, React.createElement("label", {
                className: checkboxStyle.select_checkbox
            }, disableLabel, React.createElement("br", null), " ", React.createElement("span", {
                className: style.domain
            }, React.createElement("span", {
                className: style.thin_text
            }, "on"), " ", React.createElement("span", {
                className: style.favicon
            }, React.createElement("img", {
                width: "16px",
                height: "16px",
                src: favicon
            })), domain), React.createElement("input", {
                className: checkboxStyle.checkbox,
                onChange: this.onEnableGrammarClick,
                checked: enabled,
                type: "checkbox"
            }), React.createElement("div", {
                className: dom_1.cs(checkboxStyle.checkbox_check, style.checkbox_check)
            }, React.createElement("div", {
                className: checkboxStyle.checkbox_check_round
            }))), React.createElement("div", {
                className: style.short_border
            }));
        }, SiteSwitcher;
    }(React.Component);
    exports.SiteSwitcher = SiteSwitcher;
}, function(module, exports, __webpack_require__) {
    "use strict";
    function getUnsupportedComponent(_a) {
        var type, component, domain = _a.domain, favIconUrl = _a.favIconUrl, temporary = _a.temporary, grammarlyEditor = _a.grammarlyEditor, domainCustomMessage = defaults_1.CUSTOM_UNSUPPORTED_MESSAGES[domain];
        return grammarlyEditor ? (type = "grammarly_editor", component = React.createElement(components_1.GrammarlyUnsupportedComponent, null)) : domainCustomMessage && domainCustomMessage.message ? (type = "custom_message", 
        component = React.createElement(components_1.CustomUnsupportedComponent, {
            customMessage: domainCustomMessage,
            favicon: favIconUrl,
            domain: domain
        })) : temporary ? (type = "temporary", component = React.createElement(components_1.TemporaryUnsupportedComponent, {
            favicon: favIconUrl,
            domain: domain
        })) : (type = "default", component = React.createElement(components_1.DefaultUnsupportedComponent, {
            favicon: favIconUrl,
            domain: domain,
            customTitle: domainCustomMessage && domainCustomMessage.title
        })), tracking_1.felog.settingsUsupportedShow(type), component;
    }
    var __extends = this && this.__extends || function() {
        var extendStatics = Object.setPrototypeOf || {
            __proto__: []
        } instanceof Array && function(d, b) {
            d.__proto__ = b;
        } || function(d, b) {
            for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return function(d, b) {
            function __() {
                this.constructor = d;
            }
            extendStatics(d, b), d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, 
            new __());
        };
    }();
    Object.defineProperty(exports, "__esModule", {
        value: !0
    });
    var React = __webpack_require__(5), tracking_1 = __webpack_require__(9), dom_1 = __webpack_require__(3), defaults_1 = __webpack_require__(91), header_1 = __webpack_require__(436), footer_1 = __webpack_require__(611), components_1 = __webpack_require__(1159), style = __webpack_require__(113);
    exports.getUnsupportedComponent = getUnsupportedComponent;
    var UnsupportedComponent = function(_super) {
        function UnsupportedComponent() {
            return null !== _super && _super.apply(this, arguments) || this;
        }
        return __extends(UnsupportedComponent, _super), UnsupportedComponent.prototype.render = function() {
            var _a = this.props, _b = _a.config, domain = _b.domain, temporary = _b.temporary, grammarlyEditor = _b.grammarlyEditor, favIconUrl = _a.activeTab.favIconUrl, cls = dom_1.cs(style.gr_popup_settings, (_c = {}, 
            _c[style.has_favicon] = Boolean(favIconUrl), _c)), component = getUnsupportedComponent({
                domain: domain,
                favIconUrl: favIconUrl,
                temporary: temporary,
                grammarlyEditor: grammarlyEditor
            });
            return React.createElement("div", {
                className: cls
            }, React.createElement("div", {
                className: dom_1.cs(style.content, style.unsupported_site)
            }, React.createElement(header_1.Header, null), component, React.createElement(footer_1.Footer, {
                openUrl: this.props.openUrl
            })));
            var _c;
        }, UnsupportedComponent;
    }(React.Component);
    exports.UnsupportedComponent = UnsupportedComponent;
}, function(module, exports, __webpack_require__) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    });
    var React = __webpack_require__(5), dom_1 = __webpack_require__(3), util_1 = __webpack_require__(2), style = __webpack_require__(113), baseStyle = function(pref) {
        return void 0 === pref && (pref = ""), dom_1.cs(style.line, style.unsupported_item, pref);
    };
    exports.DefaultUnsupportedComponent = function(_a) {
        var favicon = _a.favicon, domain = _a.domain, customTitle = _a.customTitle, title = customTitle ? React.createElement("span", null, " ", customTitle, " Not Supported") : React.createElement("span", null, " ", React.createElement("span", {
            className: style.domain
        }, domain), " is Not Supported");
        return React.createElement("div", {
            className: baseStyle()
        }, React.createElement("span", {
            className: style.unsupported_title
        }, React.createElement("span", {
            className: style.favicon
        }, React.createElement("img", {
            width: "16px",
            height: "16px",
            src: favicon
        })), title), React.createElement("br", null), React.createElement("span", null, "For technical reasons, we currently do not check your text on this version of ", React.createElement("span", {
            className: dom_1.cs(style.domain, style.domain_in_details)
        }, domain)));
    }, exports.CustomUnsupportedComponent = function(_a) {
        var favicon = _a.favicon, domain = _a.domain, customMessage = _a.customMessage, message = customMessage.message, _b = customMessage.title, title = void 0 === _b ? domain : _b;
        return React.createElement("div", {
            className: baseStyle(style.unsupported_permanently)
        }, React.createElement("span", {
            className: style.unsupported_title
        }, React.createElement("span", {
            className: style.favicon
        }, React.createElement("img", {
            width: "16px",
            height: "16px",
            src: favicon
        })), " ", title, " Not Supported"), React.createElement("br", null), React.createElement("span", {
            dangerouslySetInnerHTML: {
                __html: message
            }
        }));
    }, exports.TemporaryUnsupportedComponent = function(_a) {
        var favicon = _a.favicon, domain = _a.domain;
        return React.createElement("div", {
            className: baseStyle(style.unsupported_temporary)
        }, React.createElement("span", {
            className: style.unsupported_title
        }, "Checking Down on", " ", React.createElement("span", {
            className: style.favicon
        }, React.createElement("img", {
            width: "16px",
            height: "16px",
            src: favicon
        })), " ", React.createElement("span", {
            className: style.domain
        }, domain)), React.createElement("br", null), React.createElement("span", null, "There appears to be a temporary glitch affecting Grammarly's performance on ", React.createElement("span", {
            className: dom_1.cs(style.domain, style.domain_in_details)
        }, domain), ". Functionality should return soon."));
    }, exports.GrammarlyUnsupportedComponent = function() {
        return React.createElement("div", {
            className: baseStyle(style.unsupported_grammarly)
        }, "edge" === util_1.getBrowser() ? React.createElement("span", {
            className: style.edge_diamond
        }) : React.createElement("span", {
            className: style.diamond
        }), React.createElement("span", {
            className: style.unsupported_title
        }, "You Can't Improve on Perfection"), React.createElement("br", null), React.createElement("span", null, "Naturally, Grammarly's browser extension is disabled while you use the Grammarly Editor."));
    };
} ]);