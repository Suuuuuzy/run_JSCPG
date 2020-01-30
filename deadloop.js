
function set(target, path, value, options) {
  var merge = Object.assign;
  if (!options && keys.length === 1) {
    result(target, keys[0], value, merge);
    return target;
  }
  result(target, path, value, merge);
}

function result(target, path, value, merge) {
  target[path] = value;
}
module.exports = set;
