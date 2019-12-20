var merge = {
	merge: function(target, source) {
    for(var attr in source) {
        if(attr === "__proto__") continue; // Do not merge the property if it's name is __proto__
        if(typeof(target[attr]) === "object" && typeof(source[attr]) === "object") {
            merge(target[attr], source[attr]);
        } else {
            target[attr] = source[attr];
        }
    }
    return target;
	}
};

module.exports = merge;

