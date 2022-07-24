var serverid = localStorage["server_id"];
if(!serverid){
	serverid = "localhost";
}
var portid = localStorage["port_id"];
if(!portid){
	portid = "9000";
}
var playerid = localStorage["player_id"];
if(!playerid){
	playerid = "00:00:00:00:00:00";
}

document.write('<iframe id="squeezeframe" src="http://' + serverid + ':' + portid + '/status_header.html?player=' + playerid + '" width="100%" height="100%" frameborder="0"></iframe>');
document.write('<a href="http://' + serverid + ':' + portid + '" target="_blank">Open Squeezebox Server</a>');