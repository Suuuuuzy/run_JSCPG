function extend(target, obj) {
  Object.keys(obj).forEach(function (key) {
    val = obj[key];
    if (typeof val !== 'object') {
      target[key] = val;
    } else {
      extend(target, extend(target[key], val))
    }
  });
}

module.exports = extend;
