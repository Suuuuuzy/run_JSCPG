function hashCode(str) {
	var hash = 0;
	for (var i = 0; i < str.length; i++) {
		var char = str.charCodeAt(i);
		hash = ((hash<<5)-hash)+char;
	}
	return hash;
}

msg = "hello world";
hashCode(msg);
