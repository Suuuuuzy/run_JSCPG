var cp = require("child_process");
var s1 = `123`;
var s2 = `${s1} balabala`;
cp.exec(s2);
