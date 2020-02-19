var exec = require("child_process").exec;
function exp(input) {
  this.opt = input;

  exp.prototype.getinfo = function(){
    exec(this.opt.addtional.join(' '));
  }
}

module.exports = function (input) {
  return new exp(input);
}
