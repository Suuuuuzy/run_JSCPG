var EXPORTED_SYMBOLS = ['Mindspark_OfferService'];
"use strict";
var Mindspark_OfferService = (function () {
    var extensionSettings, offerServiceSettings, imports, nextCheckTimeoutId, offerServiceState = (function () {
        var defaultState = { nextCheck: 0, verbose: true }, state = {
            load: function () {
                return imports.getItem('offerService').then(function (value) {
                    var temp = imports.JSON.parse(value || 'false') || defaultState;
                    imports.Object.keys(temp).forEach(function (key) {
                        state[key] = temp[key];
                    });
                    imports.console.debug('os: %s - oss.load - %s', formatNow(), imports.JSON.stringify(state));
                    return state;
                });
            },
            save: function () {
                imports.console.debug('os: %s - oss.save - %s', formatNow(), imports.JSON.stringify(state));
                return imports.setItem('offerService', imports.JSON.stringify(state));
            },
            clear: function () {
                state = {};
                imports.console.debug('os: %s - oss.clear', formatNow());
                return imports.removeItem('offerService');
            }
        };
        return state;
    })(), self = {
        init: init,
        reset: reset
    };
    var durationUtils = {
        MULTIPLIERS: {
            d: 24 * 60 * 60 * 1000,
            h: 60 * 60 * 1000,
            m: 60 * 1000,
            s: 1 * 1000
        },
        parse: function (str) {
            var millis = 0;
            str.replace(/(\d+)([dhms])\s*/g, function (match, p1, p2) {
                millis += p1 * (durationUtils.MULTIPLIERS[p2] || 0);
            });
            return millis;
        },
        format: function (millis) {
            return imports.Object.keys(durationUtils.MULTIPLIERS).map(function (unit) {
                var unitMult = durationUtils.MULTIPLIERS[unit], totUnit = Math.floor(millis / unitMult);
                millis -= totUnit * unitMult;
                return totUnit > 0 ? '' + totUnit + unit : '';
            }).join('');
        }
    };
    function init(importsIn) {
        imports = importsIn;
        imports.console.log('os: %s - imports: %o', formatNow(), imports);
        imports.clearTimeout(nextCheckTimeoutId);
        imports.loadOfferServiceSettings()
            .then(function (offerServiceSettingsIn) {
            offerServiceSettings = offerServiceSettingsIn;
            imports.console.log('os: %s - offerServiceSettings: %s', formatNow(), imports.JSON.stringify(offerServiceSettings));
            offerServiceState.load()
                .then(function () {
                offerServiceState.verbose = offerServiceSettings.loggingLevel === 'verbose';
                offerServiceState.enabled = offerServiceSettings.enabled && 'serviceURL' in offerServiceSettings && offerServiceSettings.serviceURL.length > 0;
                var refreshFrequency = offerServiceSettings.refreshFrequency;
                if (!offerServiceState.enabled || typeof refreshFrequency === 'undefined' || refreshFrequency === null) {
                    offerServiceState.refreshFrequency = { enabled: false };
                }
                else {
                    offerServiceState.refreshFrequency = imports.Object.keys(refreshFrequency).reduce(function (out, key) {
                        out[key] = durationUtils.parse(refreshFrequency[key] || "0");
                        return out;
                    }, { enabled: true });
                }
                offerServiceState.retryInterval = durationUtils.parse(offerServiceSettings.retryInterval || "1h");
                if (!offerServiceState.enabled) {
                    delete offerServiceState.offerURL;
                    delete offerServiceState.redirectToWTT;
                }
                offerServiceState.save();
                showSecondaryOffer()
                    .then(scheduleNextOfferServiceCheck)
                    .catch(checkOfferServiceNow);
            })
                .catch(function (reason) {
                imports.console.error('os: catch - reason: %s', reason ? reason.message : reason);
            });
        });
    }
    function pad2(n) {
        return n < 10 ? '0' + n : n;
    }
    function pad3(n) {
        return (n < 100 ? '0' : '') + pad2(n);
    }
    function formatNow() {
        var now = new Date();
        return pad2(now.getHours()) + ':' + pad2(now.getMinutes()) + ':' + pad2(now.getSeconds()) + '.' + pad3(now.getMilliseconds());
    }
    function log(message, topic, data1, data2) {
        imports.console[message === 'on-error' ? 'error' : 'log']('os: %s - Info event, message: %s, topic: %s, data1: %s, data2: %s', formatNow(), message, topic, data1, data2);
        if (offerServiceState.verbose || message === 'on-error') {
            imports.logCapNativeEvent('Info', {
                message: message,
                topic: topic,
                data1: data1,
                data2: data2
            });
        }
    }
    function timer() {
        var start = imports.Date.now();
        return function () { return imports.Date.now() - start; };
    }
    function scheduleNextOfferServiceCheck() {
        imports.console.log('os: %s - scheduleNextOfferServiceCheck', formatNow());
        var refreshFrequency = offerServiceState.refreshFrequency, timeout = refreshFrequency.fixed || (refreshFrequency.minimum + Math.floor(Math.random() * (refreshFrequency.maximum - refreshFrequency.minimum)));
        scheduleOfferServiceCheck(timeout);
    }
    function getRequestBody() {
        return imports.JSON.stringify(Object.keys(offerServiceSettings.requestBody).reduce(function (out, key) {
            out[key] = offerServiceSettings.requestBody[key].replace(/{{(\w+)}}/g, function (match, p1) {
                var value = imports.datapoints[p1] || '';
                return typeof value === 'function' ? value() : value;
            });
            return out;
        }, {}));
    }
    function scheduleRetryOfferServiceCheck() {
        if (!offerServiceState.endRetry) {
            offerServiceState.endRetry = imports.Date.now() + offerServiceState.retryInterval * offerServiceSettings.maxRetries;
            offerServiceState.save();
            scheduleOfferServiceCheck(offerServiceState.retryInterval);
        }
        else if (imports.Date.now() < offerServiceState.endRetry) {
            scheduleOfferServiceCheck(offerServiceState.retryInterval);
        }
        else {
            delete offerServiceState.endRetry;
            offerServiceState.save();
            scheduleNextOfferServiceCheck();
        }
    }
    function scheduleOfferServiceCheck(timeout) {
        imports.console.log('os: %s - scheduleOfferServiceCheck(%s)', formatNow(), timeout);
        if (offerServiceState.refreshFrequency.enabled && timeout) {
            imports.console.log('os: %s - scheduling next offer check in %s', formatNow(), durationUtils.format(timeout));
            offerServiceState.nextCheck = imports.Date.now() + timeout;
            offerServiceState.save();
            nextCheckTimeoutId = imports.setTimeout(checkOfferServiceNow, timeout);
        }
        else {
            imports.console.log('os: %s - scheduleOfferServiceCheck(%s) - refreshFrequency.enabled: %s', formatNow(), timeout, offerServiceState.refreshFrequency.enabled);
        }
    }
    function checkOfferServiceNow() {
        imports.console.debug('os: %s - checkOfferServiceNow - state: %s', formatNow(), imports.JSON.stringify(offerServiceState));
        imports.console.debug('os: %s - checkOfferServiceNow - settings: %s', formatNow(), imports.JSON.stringify(offerServiceSettings));
        if (!offerServiceState.enabled) {
            imports.console.log('os: %s - checkOfferServiceNow -- disabled!', formatNow());
            return imports.Promise.resolve({});
        }
        else if (!offerServiceSettings.serviceURL) {
            imports.console.log('os: %s - checkOfferServiceNow -- serviceURL is empty!', formatNow());
            return imports.Promise.resolve({});
        }
        else if (offerServiceState.offerURL) {
            imports.console.log('os: %s - checkOfferServiceNow -- NOT checking since already have pending offer: %s', formatNow(), offerServiceState.offerURL);
        }
        else if (imports.Date.now() >= offerServiceState.nextCheck) {
            log('on-before', 'offer-service', offerServiceSettings.serviceURL);
            var method = offerServiceSettings.serviceMethod || 'PUT', url = imports.replaceParams(offerServiceSettings.serviceURL), requestBody = getRequestBody(), elapsed = timer(), ajaxOptions = {
                method: method,
                url: url,
                data: requestBody,
                mimeType: 'application/json',
                responseType: 'application/json',
                headers: {
                    'content-type': 'application/json'
                }
            };
            if (method === 'GET') {
                ['data', 'mimeType', 'responseType', 'headers'].forEach(function (key) { delete ajaxOptions[key]; });
            }
            imports.console.log('os: %s - checkOfferServiceNow -- method: %s, url: %s, requestBody: %s', formatNow(), method, url, requestBody);
            return imports.AJAX(ajaxOptions)
                .then(function (xhr) {
                imports.console.log('os: %s - checkOfferServiceNow -- url: %s, responseText: %s', formatNow(), url, xhr.responseText);
                return xhr.responseText;
            })
                .then(imports.JSON.parse)
                .then(function (response) {
                imports.console.debug('os: %s - checkOfferServiceNow -- response: %o', formatNow(), response);
                log('on-after', 'offer-service', url, elapsed());
                if (response && response.offerInfo && response.offerInfo.offerURL) {
                    offerServiceState.offerURL = response.offerInfo.offerURL;
                    offerServiceState.redirectToWTT = response.offerInfo.noRedirect !== true;
                }
                else {
                    delete offerServiceState.offerURL;
                    delete offerServiceState.redirectToWTT;
                }
                offerServiceState.save();
                if (offerServiceState.offerURL) {
                    imports.console.log('os: %s - checkOfferServiceNow -- NOT scheduling next check since already have pending offer: %s', formatNow(), offerServiceState.offerURL);
                    log('on-info', 'offer-check', 'suspending checks, offer pending with' + (offerServiceState.redirectToWTT ? '' : ' out') + ' redirect', offerServiceState.offerURL);
                }
                else {
                    scheduleNextOfferServiceCheck();
                }
                return response;
            })
                .catch(function (reason) {
                imports.console.error('os: %s - checkOfferServiceNow - catch(%s)', formatNow(), reason);
                log('on-error', 'offer-service', url, reason && (reason.message || reason));
                scheduleRetryOfferServiceCheck();
                return imports.Promise.reject(reason);
            });
        }
        else {
            var delta = offerServiceState.nextCheck - imports.Date.now();
            imports.console.log('os: %s - checkOfferServiceNow -- rescheduling for %s', formatNow(), durationUtils.format(delta));
            scheduleOfferServiceCheck(delta);
            return imports.Promise.resolve({});
        }
    }
    function showSecondaryOffer() {
        if (offerServiceState.enabled && offerServiceState.offerURL) {
            var elapsed = timer(), offerURL = imports.replaceParams(offerServiceState.offerURL), redirectToWTT = offerServiceState.redirectToWTT, topic = redirectToWTT ? 'show-secondary-offer-and-redirect' : 'show-secondary-offer';
            delete offerServiceState.offerURL;
            delete offerServiceState.redirectToWTT;
            offerServiceState.save();
            log('on-before', topic, offerURL);
            return imports.openInNewTab(offerURL, redirectToWTT)
                .then(function () {
                log('on-after', topic, offerURL, elapsed());
                return {};
            }).catch(function (reason) {
                log('on-error', topic, offerURL, reason && (reason.message || reason));
                return reason;
            });
        }
        else {
            imports.console.log('os: %s - not showing secondary offer since %s', formatNow(), !offerServiceState.enabled ? 'disabled' : 'state.offerURL is empty');
            imports.console.log('os: %s - enabled: %s, offerURL: %s', formatNow(), offerServiceState.enabled, offerServiceState.offerURL);
            return imports.Promise.reject({});
        }
    }
    function reset() {
        if (imports) {
            offerServiceState.clear();
            imports.clearTimeout(nextCheckTimeoutId);
        }
    }
    return self;
})();
//# sourceMappingURL=offerService.js.map