//function getData() {
//	var elem = document.getElementById('mysocial-tab');
//	if(elem !== null)
//    	elem.parentNode.removeChild(elem);
//
//	var elemMst = document.getElementById('mysocial-tab-div');
//	if(elemMst !== null)
//    	elemMst.parentNode.removeChild(elemMst);
//
//    var elemDiv = document.getElementById('full-page');
//
//    if(elemDiv !== null)
//		elemDiv.parentNode.removeChild(elemDiv);
//	var metaData = document.getElementsByTagName('meta');
//	
//	if(metaData.keywords==undefined){
//		alert('There is no matching keywords!');
//		return false;
//	}
//	var keywords = metaData.keywords.getAttribute('content');
//	alert(keywords);
//	
//	keywords = keywords.replace(/,\s/g, ",");
//	var keywordsJson = 'info='+classInp+'&keywords='+JSON.stringify(keywords.split(","));
//	//alert(keywordsJson);
//	var x = false;
//	var xhttp = new XMLHttpRequest();
//	/*xhttp.open("POST", "http://localhost/mst.php", false);*/
//	xhttp.open("POST", "https://www.mysocialtab.com/mstPinItBUtton.php", false);
//	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
//	xhttp.onreadystatechange = function() {
//	  if (xhttp.readyState == 4) {
//	    x = JSON.parse(xhttp.responseText);
//	  }
//	}
//	xhttp.send(keywordsJson);
//	
//	console.log(x);
//	
//	//alert(x['message']);
//	//alert(x['parentId']);
//	//alert(x['interest_id']);
//	if(x['message'] == 'success') {
//		var client_id = '5ML7qZh9b3R49QoC5Jnx79gSK4jpli6q4SyuRPE3Sv72lwErf2ZnbffWjzlESs5WkDrct5fmAnoWT2o8';
//		var client_secret = 'Jb4KSf5cRC0zpbRzJ6ClJO2KwZn0aXQT8UE09Jd1meALpsk9zWujLw3hwrhHo8Aw3fxdYLelZP6pirzR';
//		var div = document.createElement("div");
//		div.setAttribute('id', 'mysocial-tab-div');
//		div.setAttribute('class', classInp);
//		div.setAttribute('client_id', client_id);
//		div.setAttribute('client_secret', client_secret);
//		div.setAttribute('title', '');
//		div.setAttribute('description', '');
//		div.setAttribute('interestId', x['parentId']);
//		div.setAttribute('categoryId', x['interest_id']);
//		div.setAttribute('activityId', '1128');
//		div.setAttribute('store_name', '');
//		div.setAttribute('storeName', '');
//		div.setAttribute('sub_category', '');
//		div.setAttribute('brandID', '');
//		div.style['display'] = 'none';
//		document.getElementsByTagName('body')[0].appendChild(div);
//		loadScript(classInp);
//	} else {
//		alert('There is no matching keywords found to use this button for website!');
//	}
//	
//}
//
//function loadScript(scriptName) {
//	var scriptEl = document.createElement('script');
//	scriptEl.id = 'mysocial-tab';
//    scriptEl.src = chrome.extension.getURL('includes/' + scriptName + '.js');
//    scriptEl.addEventListener('load', () => {console.log('sript loaded')}, false);
//    document.head.appendChild(scriptEl);
//}
//
//getData();








function getData() {
	var elem = document.getElementById('mysocial-tab');
	if(elem !== null)
    	elem.parentNode.removeChild(elem);

	var elemMst = document.getElementById('mysocial-tab-div');
	if(elemMst !== null)
    	elemMst.parentNode.removeChild(elemMst);

    var elemDiv = document.getElementById('full-page');
    if(elemDiv !== null)
		elemDiv.parentNode.removeChild(elemDiv);
		
	var interest_id = localStorage.getItem("interest_id1");
	var parentId = localStorage.getItem("parentId1");
	var websiteUrl = localStorage.getItem("websiteUrl1");
	
	//alert(interest_id);
	//alert(parentId);
	//alert(websiteUrl);

	var client_id = '5ML7qZh9b3R49QoC5Jnx79gSK4jpli6q4SyuRPE3Sv72lwErf2ZnbffWjzlESs5WkDrct5fmAnoWT2o8';
	var client_secret = 'Jb4KSf5cRC0zpbRzJ6ClJO2KwZn0aXQT8UE09Jd1meALpsk9zWujLw3hwrhHo8Aw3fxdYLelZP6pirzR';
	var div = document.createElement("div");
	div.setAttribute('id', 'mysocial-tab-div');
	div.setAttribute('class', classInp);
	div.setAttribute('client_id', client_id);
	div.setAttribute('client_secret', client_secret);
	div.setAttribute('title', '');
	div.setAttribute('description', '');
	div.setAttribute('interestId', parentId);
	div.setAttribute('categoryId', interest_id);
	//div.setAttribute('activityId', reason_id);
	div.setAttribute('activityId', '');
	div.setAttribute('store_name', websiteUrl);
	div.setAttribute('storeName', '');
	div.setAttribute('sub_category', '');
	div.setAttribute('brandID', '');
	div.style['display'] = 'none';
	document.getElementsByTagName('body')[0].appendChild(div);
	loadScript(classInp);
/*} else {
		alert('There is no matching keywords found to use this button for website!');
	}*/
}
function loadScript(scriptName) {
	var scriptEl = document.createElement('script');
	scriptEl.id = 'mysocial-tab';
    scriptEl.src = chrome.extension.getURL('includes/' + scriptName + '.js');
    scriptEl.addEventListener('load', () => {console.log('sript loaded')}, false);
    document.head.appendChild(scriptEl);
}

getData();
