var cp = require('child_process');
var callback = function() {
  var req = "req";
  this.foo = function() {
    return req;
  }
  this.v = 123;
}

callback.prototype = {
  func_key: function() {
    var c = this.v;
    cp.exec(c);
    return c;
  },
  func_key_2: function() {
    var d = "123";
    return d;
  }
}

exports.callback = callback;
