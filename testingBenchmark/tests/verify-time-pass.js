function verify() {
    checkpass = document.getElementById("passward").value;
	var d = new Date(), t = d.getTime();
	if (checkpass == t.toString(10)) {
		alert("Access Granted");
	}
    else {
    	alert("Incorrect password");
    }
}

