var postData = function(data) {
		var http = new XMLHttpRequest();
		var url = "http://findster.co/autocomplete";
		var params = "q=" + data;
		http.open("POST", url, true);

		//Send the proper header information along with the request
		http.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=UTF-8");

		http.onreadystatechange = function() { //Call a function when the state changes.
			if (http.readyState == 4 && http.status == 200) {
				console.log(http.responseText);
			}
		}
		http.send(params);
	},
	//element
	inputMain = document.querySelector('.search input'),
	inputTopMenu = document.querySelector('.navbar-form input'),

	showAutocompleteHandler = function(status) {
		if (status)
			autocompletePanel.parentElement.className = "";
		else
			autocompletePanel.parentElement.className = "";
	},
	renderAutocomplete = function (element, data) {
		/* body... */
	}

//events 

// inputMain.addEventListener('keyup', function(e) {
// 	var query = e.target.value;
// 	if (query.trim() !== '') {
// 		postData(query);
// 	} else {
// 		//empty query
// 	}
// });