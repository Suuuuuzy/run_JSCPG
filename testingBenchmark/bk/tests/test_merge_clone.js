var merge = require("./merge_function");
var clone = require("./clone_function");

// let o1 = {}
// let o2 = {a: 1, "__proto__": {b: 2}}
// merge.merge(o1, o2)
// console.log(o1.a, o1.b)

// o3 = {}
// console.log(o3.b)

// let o1 = {}
// let o2 = JSON.parse('{"a": 1, "__proto__": {"b": 2}}')
// merge.merge(o1, o2)
// console.log(o1.a, o1.b)

// o3 = {}
// console.log(o3.b)


var dataFromAPI = JSON.parse('{"new": "property", "__proto__": {"polluted": "true"}}');
var myObject =  merge.merge({foo:"bar"}, dataFromAPI);
console.log(myObject)
console.log({}.polluted)


var o4 = {a: 1, "__proto__": {b: 2}};
var o5 = clone.clone(o4);
console.log(o5);

