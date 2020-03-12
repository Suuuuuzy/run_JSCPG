var cp = require("child_process");
function expolit(string){
  cp.exec(string);
}

module.exports = expolit;
