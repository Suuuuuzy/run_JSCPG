var merge = require("./merge_function");
var clone ={
	clone: function(objectToBeCloned){
		return merge.merge({}, objectToBeCloned);
	}
}

module.exports = clone;

// var clone = function (objectToBeCloned){
// 	return merge.merge({}, objectToBeCloned);
// }

// var o1 = {a: 1, "__proto__": {b: 2}};
// var o2 = clone.clone(o1);
// console.log(o2);
