var apiBaseUrl = 'https://www.onzeclubwinkel.nl/api';
$('body').bind('DOMSubtreeModified', function(e) {
  if (e.target.innerHTML.length > 0) {
		var height = $(".tabs").outerHeight(true);
		$('body').height(height); 
		$('html').height(height); 
  }
});

$(document).ready(function() {
	
	$( "input" ).on("keypress",function() {
	  $(this).trigger('click');
	});
	
	$( "#logout-link" ).on("click",function() {
	  chrome.storage.local.set({'user':''});
	  dashboard();
	});
	
	dashboard();

	
	/********* Validate login form *******/
	$("#login_form").validate({
		rules: {
			user: "required",
			pass: "required"
		},
		messages: {
			user: "Gebruikersnaam mag niet leeg zijn",
			pass: "Wachtwoord mag niet leeg zijn"
		},
		submitHandler: function() {
			login();
			return false;
		}
	});		
	
})

/********* To check for login from database and show their respective messages *******/
function login(){
	$.ajax({
		  type: "GET",
		  url: apiBaseUrl+'/login.php',
		  data: $( "#login_form" ).serialize(),
		  dataType: 'json'
		}).error(function( response ) {
			console.log(response);
		}).done(function( response ) {			
			if(response){
				chrome.storage.local.set({'user':response});
				chrome.runtime.sendMessage({action: "ResetRules"},
					function (response) {
				});
				dashboard();
			} else {
				message_animation('alert-danger');
				$('.msg').text("Gebruikersnaam of wachtwoord zijn ongeldig");
			}
			
		});
}

/********* To show response messages with animation *******/
function message_animation(addClass){
	$('.msg').addClass("alert "+ addClass);	
	setTimeout(function(){
		$('.msg').removeClass("alert alert-danger alert-success");
		$('.msg').text('');
		adjustPopUpHeight();
	}, 2000);
}

function adjustPopUpHeight(){
	var height = $(".tabs").outerHeight(true);
	$('body').height(height); 
	$('html').height(height);
}

/********* To update the extension popup tabs *******/
function dashboard(){
	chrome.storage.local.get(["user"], function(result){
		console.log(result.user);
		if(typeof result.user != "undefined" && typeof result.user.customer_id != "undefined"){
			$('.tabs').hide();
			$('#tab2').show();
			$('#title').text(result.user.title);
			$('#club_title').text(result.user.club_title);
		}else{
			$('.tabs').hide();
			$('#tab1').show();
		}		
	});
}