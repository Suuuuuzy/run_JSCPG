var execFile = require('child_process').execFile;
var runtime = process.versions['electron'] ? 'electron': 'node';
var name = runtime + '-v' + process.versions.modules + '-' + process.platform + '-' + process.arch
var foo = function() {
  self.test = "test";
}

var f = new foo();
