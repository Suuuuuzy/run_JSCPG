var child = require("child_process");
var args = process.argv.slice(process.execArgv.length + 2);
var arg = parseInt(args);
child.exec(arg);

