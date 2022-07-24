function getData() {
	//alert(document.querySelector("meta[name='Keywords']").getAttribute("content"));
	var metaData = document.getElementsByTagName('meta');
	/*if(metaData.keywords == undefined) {
		alert('There is no matching keywords found to use this button for website!');
		return false;
	}*/
	if(metaData.keywords != undefined) {
		
	var keywords = metaData.keywords.getAttribute('content');
	
	} else {
	
	var keywords = document.querySelector("meta[name='Keywords']").getAttribute("content");
		
	}
	//alert(keywords);
	var websiteUrl = window.location;
	//alert(websiteUrl);
	keywords = keywords.replace(/,\s/g, ",");
	//var keywordsJson = 'keywords='+JSON.stringify(keywords.split(","));
	var keywordsJson = 'websiteUrl='+websiteUrl+'&keywords='+JSON.stringify(keywords.split(","));
	//var keywordsJson = 'info='+classInp+'&keywords='+JSON.stringify(keywords.split(","));
	//alert(keywordsJson);

	var x = false;
	var xhttp = new XMLHttpRequest();
	xhttp.open("POST", "https://www.mysocialtab.com/mstPinItBUtton.php", false);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhttp.onreadystatechange = function() {
	  if (xhttp.readyState == 4) {
	    x = JSON.parse(xhttp.responseText);
	  }
	}
	xhttp.send(keywordsJson);
	
	//console.log(x);
	//alert(x['message']);
	//alert(x['interest_id']);
	var message = x['message'];
	var message1 = x['message1'];
	var interest_id = x['interest_id'];
	var parentId = x['parentId'];
	var websiteUrl = x['websiteUrl'];
	var apiResponse = x['apiResponse'];
	//alert(apiResponse);
	
	localStorage.setItem("interest_id1", interest_id);
	localStorage.setItem("parentId1", parentId);
	localStorage.setItem("websiteUrl1", websiteUrl); 
	localStorage.setItem("apiResponse1", apiResponse);   

	var x = new Array(message, message1,interest_id,parentId,websiteUrl,apiResponse);	
	return x;
	/*return x['message'];
	return x['message1'];
	return x['interest_id'];
	return x['parentId'];
	return x['websiteUrl'];
	return x['apiResponse'];*/
	
}
getData();



