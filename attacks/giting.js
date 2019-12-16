var Test = require("giting");
var injection_command = ";touch Song;";
test = new Test({"workDir": "./"});
repo = {"organization": "./", "name": "./", "branch": injection_command}
test.pull(repo, function(){});
