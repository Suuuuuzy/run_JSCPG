function assign(target) {
  var len = arguments.length, i = 0;
  while(++ i < len) {
    var val = arguments[i];
    extend(target, val);
  }
  return target;
}

function extend(target, obj) {
  for (var key in obj) {
    val = obj[key]
    target[key] = val;
  }
}

module.exports = assign;
