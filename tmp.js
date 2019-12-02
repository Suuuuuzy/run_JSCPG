var cp = require("child_process");

function foo(options) {
  this.option = options;

  foo.prototype.worker = function() {
    console.log(this.option);
    cp.exec(this.option);
  }
}

module.exports = function(input){
  cp.spawn('rm ' + input);
}
