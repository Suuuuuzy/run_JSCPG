var merge = function(target, source) {
    for(var attr in source) {
        if(typeof(target[attr]) === "object" && typeof(source[attr]) === "object") {
            merge(target[attr], source[attr]);
        } else {
            target[attr] = source[attr];
        }
    }
    return target;
};

// var dataFromAPI = JSON.parse('{"new": "property"}');
// var myObject = merge({foo: "bar"}, dataFromAPI)


var dataFromAPI = JSON.parse('{"new": "property", "__proto__": {"polluted": "true"}}');
var myObject =  merge({foo:"bar"}, dataFromAPI);
console.log(myObject)
console.log({}.polluted)

// let o1 = {}
// let o2 = JSON.parse('{"a": 1, "__proto__": {"b": 2}}')
// merge(o1, o2);
// console.log(o1.a, o1.b)

// o3 = {}
// console.log(o3.b)