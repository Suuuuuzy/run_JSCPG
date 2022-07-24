var scoreDiv = document.createElement("div");
scoreDiv.setAttribute("class","ekescore");
var scoreStyle = scoreDiv.style;
scoreStyle.left=(window.innerWidth-36)+ "px";
scoreDiv.innerText="0";
document.body.appendChild(scoreDiv);
var popHtml;
var currentScore=0;
scoreDiv.onmouseover = function () {
	if (currentScore==0) {
		return;
	}
	scoreDiv.setAttribute("class","ekepop");
	scoreDiv.innerHTML = popHtml
	scoreStyle.left=(window.innerWidth-200)+ "px";
	scoreStyle.background="#CECECE";
}
scoreDiv.onmouseout = function() {
	scoreDiv.setAttribute("class","ekescore");
	scoreStyle.left=(window.innerWidth-36)+ "px";
	score();
}

var signalWords = ["invällare","ankare","ankarbarn","skäggbarn","musslor","apor","babb","zigenar","batik","[\\s>]PK",
"kramare","blatt","spökplump", "radikalfemi","feminaz","MENA"];

function score() {
	if (scoreDiv.getAttribute("class") == "ekepop") {
		return;
	}
	var html = document.body.innerHTML;

	var score = 0;
	popHtml = "";
	for (var i = 0;i<signalWords.length;i++) {
		var flag = 'g';
		if (signalWords[i].charAt(0) != signalWords[i].charAt(0).toUpperCase()) {
			flag+="i";
		} /*else {
			console.log("Case sensitive for: " + signalWords[i]);
		}*/
		var regexp = new RegExp(signalWords[i],flag);
		var tmp = html.match(regexp);
		if (tmp!=null) {
			score+=tmp.length;
			popHtml+=signalWords[i] + " scored " + tmp.length + "<BR>";
			
		} /*else {
			console.log("Score for: " + signalWords[i] + " is 0");
		}*/
	}
	scoreDiv.innerText=score;
	if (score>15) {
		scoreStyle.background="#B00";
	}else if (score>12) {
		scoreStyle.background="#C00";
		
	} else if (score>9) {
		scoreStyle.background="#D00";
		
	} else if (score>7) {
		scoreStyle.background="#F30";
		
	} else if (score>5) {
		scoreStyle.background="#F90";
	} else if (score>3) {
		scoreStyle.background="#DD0";
		
	} else if (score>1) {
		scoreStyle.background="#9C0";
		
	} else {
		scoreStyle.background="#0C0";
	}
	currentScore = score;
}

setInterval(score,1000);




function ekScrollHandler() {
	scoreStyle.top=document.body.scrollTop + "px";
	
	
}
document.onscroll = ekScrollHandler