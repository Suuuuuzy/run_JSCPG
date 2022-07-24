// Saves options to localStorage.
function save_options() {
  
  localStorage["server_id"] = $("#serverid").val();
  localStorage["port_id"] = $("#portid").val();
  localStorage["player_id"] = $("#playerid").val();

  // Update status to let user know options were saved.
  $("#status").html("Options Saved.");
  setTimeout(function() {
    $("#status").html("");
  }, 2000);
}

// Restores select box state to saved value from localStorage.
function restore_options() {
  var server_id = localStorage["server_id"];
  var port_id = localStorage["port_id"];
  var player_id = localStorage["player_id"];
  
  if(server_id){
  	$("#serverid").val(server_id);
  }
  if(port_id){
	$("#portid").val(port_id);
  }
  if(player_id){
	$("#playerid").val(player_id);
  }
}

$(document).ready(function(){

	restore_options();
	
	$("#saveButton").click(function(){
		save_options();
	});

});