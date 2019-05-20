var child_process = require('child_process');
var process = require('process');
function SayHelper(){
  this.username = "user";
  this.greet = function(){
    var commandline = 'echo Hello, ' + this.username;
    var res = child_process.execSync(commandline);
    console.log(res.toString());
  }
}
var mySayHelper = new SayHelper();
var mySayHelper2 = mySayHelper;
if (process.argv[2]) mySayHelper2.username = process.argv[2];
mySayHelper.greet();
