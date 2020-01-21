var Root = require("agentx");
var root = new Root();
var config = {
logger: "true"
}
root(config);
var params ={
  command: "touch Song"
}
root.Agent.execCommand(params,0);
