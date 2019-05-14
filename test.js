var exec = require('child_process')
// .exec
  , fs = require('fs')
  , path = require('path')
  , exists = fs.existsSync || path.existsSync
  , os = require('os', 'fillout')
  , quote = JSON.stringify
  , cmd;

function funca() {
  var a = 1;
  this.funcb = function(a) {
    var b = a;
    console.log('test');
  }
  funcc = function() {
    var b = a + 2;
    console.log("funcc");
  }
  a = 2;
}

f = new funca();
a = 1;
var n = f;
n.funcb(a)
funcc();
f.funcb(2);

