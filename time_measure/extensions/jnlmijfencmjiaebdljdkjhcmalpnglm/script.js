$(document).ready( function() {
	var posts, counter=0;
	var string = ["NSA", "surveillance", "PRISM", "government","US intelligence", "White House","intelligence","spying", "FBI"];
	var len = string.length;
	posts = document.getElementsByClassName('title');
	for(i=1; i<posts.length; i=i+2){
		counter=0;
		thread = posts[i].textContent;
		for(j=0; j<len; j++) {
			if(thread.toLowerCase().indexOf(string[j].toLowerCase()) != -1)
				counter++;
		}
		if(counter>0) {
		//posts[i-1].setAttribute("style", "display:none");
		$(posts[i]).parent().attr("style", "display:none");
		$(posts[i]).parent().next().attr("style", "display:none");
	}
	else
	$(posts[i]).parent().attr("style", "float:top");	
	}
});