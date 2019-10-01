var argc = process.argv.slice(2);
var child = require("child_process")
argc = parseInt(argc);
child.exec("touch " + argc);
