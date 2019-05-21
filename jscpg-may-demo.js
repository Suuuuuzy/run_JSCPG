var child_process = require('child_process');
var process = require('process');
function Helper(){
    this.username = "user";
    this.greet = function(){
        // var commandline = 'echo "Hello, ' + this.username + '!"';
        var commandline = this.username;
        var res = child_process.execSync(commandline);
        console.log(res.toString());
    }
}
var myHelper = new Helper();
var myHelper2 = myHelper;
var myName = process.argv[2];
if (myName) myHelper2.username = myName;
//myHelper2.username = process.argv[2];
myHelper.greet();
