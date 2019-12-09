var cp = require("child_process");
var foo = function(put) {
  var cmd = {a: put.adc};
  args = [cmd.a];
  put1.get((args) => {
    cp.exec(args.join(' '), function(input){
      console.log(input);
    })
  });
}

exports.foo = foo;
