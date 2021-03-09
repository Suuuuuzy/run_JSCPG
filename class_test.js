var cp = require("child_process");
class foo {
  constructor (input){
    this.src = input;
  }

  vul (input) {
    var src = input + '/cmd';
    cp.exec(src);
  }
}

module.exports = {
  foo: foo
}
