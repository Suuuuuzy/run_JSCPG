$(window).on('load', function(){
	var currentbg = $.cookie('currentbg');
	var randombg = $.cookie('randombg');
	if(randombg === undefined)
	{
		$.cookie('randombg', 'true', { expires: 365 });
		$("#randomizebutton").attr("checked","checked");
	}
	else if(randombg === "true")
	{
		$("#randomizebutton").attr("checked","checked");
	}
	else if(randombg === "false")
	{
		$("#randomizebutton").attr("checked",false);
	}
		
	var $menustatus = $.cookie('menustatus');
	var $url = "";
	
	if(randombg === "false")
	{
		if(currentbg)
		{
            $url = $("li[data-id='" + currentbg +"']").children('img').attr('src');
			$("#background").css('background-image','url('+$url+')');
			$.cookie('currentbg', currentbg, { expires: 7 });
		}
		else
		{
			
            $url = $("li[data-id='1']").children('img').attr('src');

			$("#background").css('background-image','url('+$url+')');
			$.cookie('currentbg', '1', { expires: 7 });
		}		
	}
	else
	{
		var numberimages = $("#bg-images").data('number');
		var randomimage = getRandomInt(1,numberimages);
		
        $url = $("li[data-id='" + randomimage +"']").children('img').attr('src');
		$("#background").css('background-image','url('+$url+')');
	}

	if($menustatus)
	{
		if($menustatus == 'closed')
		{
				
				$(".toggler").trigger('click');
		}
		
	}
	else
	{
		$.cookie('menustatus', 'closed', { expires: 7 });				
	}
		
});

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

$(document).on('click','#randomizebutton',function(e) {

	if($(this).is(':checked'))
	{
		$.cookie('randombg', 'true', { expires: 365 });
		toastr.success('Background settings updated');
	}
	else
	{
		$.cookie('randombg', 'false', { expires: 365 });
		//toastr.success('Background settings updated');
	}
});


$(document).on('click','.bg',function(e) {

    var $iid = $(this).data('id');
	var $url = $(this).children('img').attr("src");
	
	$("#background").css('background-image','url('+$url+')');
	$.cookie('currentbg', $iid, { expires: 365 });
	//toastr.success('Wallpaper updated');
	
	if($.cookie('randombg') === "true")
	{
		$.cookie('randombg', "false", { expires: 365 });
		$("#randomizebutton").attr("checked",false);
		//toastr.info('Wallpaper background disabled!');		
	}

});

$(document).ready(function(e) {

	
$( "#searchform" ).submit(function( event ) {

	var searchterm = $('#q').val();
	window.open('https://google.com/search?q='+searchterm,'_blank');	
	event.preventDefault();
});

$("#search").focus();	


$(".toggler").on( "click",function(e) {
	
	$(this).toggleClass('open');
	if($(this).hasClass('open'))
	{
		$("#links ul").removeClass('hidden');
		$.cookie('menustatus', 'open', { expires: 7 });
	}
	else
	{
		$("#links ul").addClass('hidden');
		$.cookie('menustatus', 'closed', { expires: 7 });
	}
	
});
	

	
	$("#menu").click(function(e) {
        $("#links ul").toggleClass('hidden');
    });

$("#bg-opener").click(function() {
$("#bg-container").addClass('opened');
$("#overlay").addClass('opened');
	
	
});
	


$("#bg-closer").click(function() {
    $("#bg-container").removeClass('opened');
	$("#overlay").removeClass('opened');
});
	

	
$("#overlay").click(function() {
	
	$("#bg-closer").trigger('click');
});		

    
});

function removeOverlay(){
    if(document.getElementsByClassName('keep-settings-assist') != null && document.getElementsByClassName('keep-settings-assist').length > 0){
        document.getElementsByClassName('keep-settings-assist')[0].remove();
    }
    removeAssist();
}
function removeAssist(){
    if(document.getElementsByClassName('assist-overlay') != null && document.getElementsByClassName('assist-overlay').length > 0){
        document.getElementsByClassName('assist-overlay')[0].remove();
    }
}

function assistNT()
{
    var firstLoad = localStorage.getItem("assistNT");
    if(!firstLoad){
        var style = document.createElement('link');
        style.href = 'css/assistNT.css';
        style.rel = 'stylesheet';
        document.head.appendChild(style);
        var instructions = document.createElement('div');
        instructions.className = 'assist-instructions';
        instructions.innerHTML = 'Click "<b>Keep it</b>" to keep this Chrome Extension New Tab with Web Search.';
        var installed = document.createElement('div');
        installed.className = 'assist-extension-installed';
        installed.innerText = 'Extension Successfully Installed!';
        var checkbox = document.createElement('img');
        checkbox.className = 'assist-checkbox';
        checkbox.src = 'images/checkbox.png';
        var background = document.createElement('div');
        background.className = 'assist-background-area';
        background.appendChild(checkbox);
        background.appendChild(installed);
        background.appendChild(instructions);
        var arrow = document.createElement('img');
        arrow.className = 'assist-green-arrow';
        arrow.src = 'images/green-arrow-isolated.gif';
        var overlay = document.createElement('div');
        overlay.className = 'assist-overlay';
        if(navigator.userAgent.match(/Mac/i)) overlay.style = 'right: 50%;top: 120px;margin-right:-100px;';
        else overlay.style = 'right: 50%; top: 120px; margin-right:-240px;';
        overlay.appendChild(arrow);
        overlay.appendChild(background);
        var backdrop = document.createElement('div');
        backdrop.className = 'assist-backdrop';
        var keepsettingsassist = document.createElement('div');
        keepsettingsassist.className = 'keep-settings-assist';
        keepsettingsassist.appendChild(backdrop);
        keepsettingsassist.appendChild(overlay);
        keepsettingsassist.onclick = removeOverlay;
        document.body.appendChild(keepsettingsassist);
        localStorage.setItem("assistNT", true);
        setTimeout(removeAssist,30000);
        setTimeout(removeOverlay,31000);
    }
}

 

assistNT();
if(navigator.userAgent.match(/Mac/i) != null)
      {
        document.getElementById('extlinks').style.display = 'none';
		document.getElementById('extlinks2').style.display = 'none';
      }


