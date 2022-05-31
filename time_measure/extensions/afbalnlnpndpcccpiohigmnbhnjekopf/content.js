var $wallDiv;
var hoverPosition;
var hoverDisabled;
var imgheight = 34;
var imgwidth = 34;
var imgoffset = 5;
var minsize = 150;
var modalwidth = 0.20;
var modalheight =  0.20;	

chrome.storage.sync.get("hoverPosition", function (obj) {
    hoverPosition = obj.hoverPosition;
});

chrome.storage.sync.get("hoverDisabled", function (obj) {
	hoverDisabled = obj.hoverDisabled;
});

chrome.storage.onChanged.addListener(function(changes, namespace) {
	for (key in changes) {
    	var storageChange = changes[key];
          
        if(key == "hoverPosition")
        	hoverPosition = storageChange.newValue;
            
        if(key == "hoverDisabled")
            hoverDisabled = storageChange.newValue;
	}
});

function isNumber(num) {
  return (typeof num == 'string' || typeof num == 'number') && !isNaN(num - 0) && num !== '';
};

function showButton(image, imgtype) {
			
			var pinterest = false;
			var imglink = "";
			
			if (imgtype == "default" && typeof image.context.currentSrc != 'undefined') {
  				var position = image.offset();
  				var imglink = image.context.currentSrc;
  				var imgalt = image.context.alt;
  			}
  			
  			if(imgtype == "pinterest"){
  				var position = image.offset();
  				var imglink = image[0].currentSrc;
  				var imgalt = image[0].alt;
  				var pinterest = true;
  			} 
  				
  			if(imgtype == "instagram"){
  				var position = image.offset();
  				var imglink = image.attr('src');
  				var imgalt = image.attr('alt');				
  			} 
  			
  			if(imgtype == "bg"){
  				var bg = image.css('background-image');
  				var position = image.offset();
  				var imgalt = "";
				var imglink = bg.replace(/^url\(['"]?/,'').replace(/['"]?\)$/,'');
  			}
  			
  			if (imgtype == "google") {
  				var position = image.offset();
  				var imglink = image.attr('src');
  				var imgalt = image.attr('alt');
  			}
  			
  			if (imgtype == "google_base64" && typeof image[0].href != 'undefined') {
  				var position = image.offset();
  				var imglink = image[0].href.split("imgurl=");
  				var imglink = imglink[1].split("&imgrefurl=");
  				var imglink = imglink[0];
  				var imgalt = "";
  				imgtype = "google";
  			}
  			
  			if (imgtype == "google_base64_shopping") {
  				var position = image.offset();
  				var imglink = image[0].href.split("imgurl=");
  				var imglink = imglink[1].split("&imgrefurl=");
  				var imglink = imglink[0];
  				var imgalt = "";
  				imgtype = "google";
  			}
  			
			var w = image.width();
			var h = image.height();
			
			$wallDiv.stop(true, true).hide();
			
			if(imgtype != "google" && ( w < minsize || h < minsize ))
				return false;
			
			var position = image.offset();
			
			if (document.domain.indexOf('ebay.') !== -1 && document.domain.indexOf('kleinanzeigen') == -1) {
				if(isNumber(parseInt(image.css('top')))) 
 					realtop = parseInt(image.css('top'));
 				else
 					realtop = 0;
 				
 				if(isNumber(parseInt(image.css('left')))) 
 					realleft = parseInt(image.css('left'));
 				else
 					realleft = 0;
				
				if( realtop <= 0 && ( hoverPosition == "tleft" || hoverPosition == "tright" ))
					realtop = realtop * -1;
				
				if( realtop >= 0 && ( hoverPosition == "bleft" || hoverPosition == "bright" ))
					realtop = realtop * -1;				
				
				if( realleft <= 0 && ( hoverPosition == "tleft" || hoverPosition == "bleft" ))
					realleft = realleft * -1;	
			
				position.top = realtop + position.top;
				position.left = realleft + position.left;
			}
			
			if( hoverPosition == "tleft" && !pinterest )
				$wallDiv.css({ "top": position.top + imgoffset, "left": position.left + imgoffset});
				
			if( hoverPosition == "bleft" || pinterest ){
				if(pinterest)
					$wallDiv.css({ "top": position.top + h - imgheight - imgoffset - 30 , "left": position.left + imgoffset });
				else
					$wallDiv.css({ "top": position.top + h - imgheight - imgoffset , "left": position.left + imgoffset });
			}	
			
			if( hoverPosition == "tright" && !pinterest)
				$wallDiv.css({ "top": position.top + imgoffset, "left": position.left + w - imgwidth - imgoffset });
				
			if( hoverPosition == "bright" && !pinterest )
				$wallDiv.css({ top: position.top + h - imgheight - imgoffset, left: position.left + w - imgwidth - imgoffset });
			
			if(!hoverDisabled){
				$wallDiv.fadeIn(50).show();
			}
				
				
			$wallDiv.unbind('click');
			$wallDiv.click(function() {

				stwSearchUrl = "https://www.shopthewall.com/wallit/search/&media=" + encodeURIComponent(imglink) + "&url=" + encodeURIComponent(window.location.href) + "&title=" + encodeURIComponent(document.title) + "&fullsize=true&is_video=false&description=" + encodeURIComponent(imgalt);
   				var width = $(window).width() - ( $(window).width() * modalwidth );
				var height =  $(window).height() - ( $(window).height() * modalheight );	
      			$.featherlight({
      				iframe: stwSearchUrl, 
      				iframeMaxWidth: width, 
      				iframeWidth: width,
      				iframeHeight: height,
      				closeIcon: 'Fenster schlie&szlig;en',
      				beforeOpen: function(event){
      					$wallDiv.stop(true, true).hide();
      					$('.featherlight').attr('style','display: block !important');
           
           				return true;		
        			}
      			});
      			
				$wallDiv.stop(true, true).hide();
				return false;
			});	
};


jQuery(document).ready(function() {
	
	chrome.runtime.sendMessage({
        			request: 'updateContextMenu',
        			currentUrl: document.domain
    });

	
	if (document.domain.indexOf('shopthewall.com') !== -1 ){
		$("#chromeextension").hide();
		return false;
   	}
   	
   		
	//create the preview button
   	$wallDiv = jQuery('<div/>', {
	   	id: 'wallit',
       	css: {
        	borderWidth: '0px',
           	position: 'absolute',
           	top: '0px',
           	left: '0px',
           	width: imgwidth+'px',
           	height: imgheight+'px',
           	"z-index": '2147483646 !important',
           	cursor: 'pointer',
           	"background-image": 'url('+chrome.extension.getURL("img/hover-icon.png")+'',
           	"background-size": '34px 34px',
       	}
    });
	
	//append the button to the body of the html document
   	$('body').append($wallDiv);
   	$wallDiv.hide();
	
	
	if (document.domain.indexOf('pinterest.com') !== -1 || document.domain.indexOf('pinterest.de') !== -1 ){
		
		$(document).on("mouseenter mouseleave", ".pinWrapper", function (e) { 
			
			event.stopPropagation();
			
			if(e.type == "mouseenter"){
				img = $(this).find("img");
				showButton(img, "pinterest");	
			}
		
			if(e.type == "mouseleave"){
				if(typeof e.toElement.className !== 'undefined' && (e.toElement.id == "wallit" || e.toElement.className.indexOf("navLinkOverlay") !== -1 || e.toElement.className.indexOf("pinRingWrapper") !== -1 || e.toElement.className.indexOf("pinImageActionButtonWrapper") !== -1 || e.toElement.className.indexOf("hoverMask") !== -1))
					return false;
				else
					$wallDiv.stop(true, true).delay(20000).fadeOut(500);
			}
			
		});
				
		$(document).on("mouseenter mouseleave", ".hoverMask", function (e) { 
			
			event.stopPropagation();
			
			if(e.type == "mouseenter"){
				img = $(this).next(".pinUiImage").find("img");
				showButton(img, "pinterest");	
			}
		
			if(e.type == "mouseleave"){
				if(typeof e.toElement.id !== 'undefined' && e.toElement.id == "wallit" || e.toElement.className.indexOf("navLinkOverlay") !== -1)
					return false;
				else
					$wallDiv.stop(true, true).delay(2000).fadeOut(500);
			}
			
		});

		$(document).on("mouseenter mouseleave", "img", function (e) { 
			
			event.stopPropagation();
			
			if(e.type == "mouseenter"){
				
				showButton($(this), "default");	
			}
		
			if(e.type == "mouseleave"){
				if(typeof e.toElement.id !== 'undefined' && e.toElement.id == "wallit" || e.toElement.className.indexOf("navLinkOverlay") !== -1)
					return false;
				else
					$wallDiv.stop(true, true).delay(2000).fadeOut(500);
			}
			
		});
		
		
		$(document).scroll(function (e) {
			$wallDiv.stop(true, true).delay(1000).fadeOut(500);
		});
		
		$(document).mouseup(function (e) {
			$wallDiv.stop(true, true).fadeOut(500);
		});
		
	} else if (document.domain.indexOf('instagram.com') !== -1){
    	
    	$(document).on("mouseenter mouseleave", "._havey article", function (e) {
    		
    		event.stopPropagation();
    		
    		if(e.type == "mouseenter" && e.target.id !== "wallit"){
				if($(this).children('div').find('._4rbun img').attr('src') !== 'undefined')
					showButton($(this).children('div').find('._4rbun img'), "instagram");
    			
    		}
			
			if(e.type == "mouseleave"){
				if(typeof e.toElement.id !== 'undefined' && typeof e.toElement.id == "wallit" || typeof e.toElement == "._haveye articlee")
					return false;
				else
					$wallDiv.stop(true, true).delay(10000).fadeOut(500);
			}
    		
    	});	
    	
    	$(document).on("mouseenter mouseleave", "._si7dy", function (e) {
    		
    		event.stopPropagation();
    		
    		if(e.type == "mouseenter" && e.target.id !== "wallit"){
				if($(e.currentTarget.parentNode).find('img').attr('src') !== 'undefined')
					showButton($(e.currentTarget.parentNode).find('img'), "instagram");
    			
    		}
			
			if(e.type == "mouseleave"){
				if(typeof e.toElement.id !== 'undefined' && typeof e.toElement.id == "wallit" || typeof e.toElement !== "._si7dy")
					return false;
				else
					$wallDiv.stop(true, true).delay(4000).fadeOut(500);
			}
    		
    	});	
    	
    	$(document).scroll(function (e) {
			$wallDiv.stop(true, true).delay(1000).fadeOut(500);
		});
		
		$(document).mouseup(function (e) {
			$wallDiv.stop(true, true).fadeOut(5000);
		});

	} else if (document.domain.indexOf('google.') !== -1){

		$('div#center_col').on("mouseenter mouseleave", "div", function (e) {
    		
    		event.stopPropagation();
    		
    		if(e.type == "mouseenter" && e.target.id !== "wallit" && e.target.id !== "rg_s" && e.target.id !== "ires" && e.currentTarget.id !== "ifbc" && e.currentTarget.id !== "ifbd" && e.currentTarget.id !== "ifb" && e.target.className.indexOf('prs') == -1 ){
    			
    			if($(e.currentTarget).find('img').attr('src').indexOf('base64') == -1){
					showButton($(e.currentTarget).find('img'), "google");
					return false;
				} else {
					showButton($(e.currentTarget).find('a'), "google_base64");
					return false;
				}
	
    		}
			
			if(e.type == "mouseleave"){
				
				if(typeof e.toElement.id !== 'undefined' && e.toElement.id == "wallit")
					return false;
				else
					$wallDiv.stop(true, true).delay(2000).fadeOut(500);
			}
    		
    	});
	
    	$(document).scroll(function (e) {
			$wallDiv.stop(true, true).delay(1000).fadeOut(500);
		});
		
		$(document).mouseup(function (e) {
			$wallDiv.stop(true, true).fadeOut(500);
		});

	} else if (document.domain.indexOf('polyvore.') !== -1){

		minsize = 134;
		
		$('div').on("mouseenter mouseleave", ".collection", function (e) {
    		
    		event.stopPropagation();
    		
    		if(e.type == "mouseenter" && e.target.id !== "wallit" ){
    			showButton($(e.currentTarget).find('img'), "default");	
    		}
			
			if(e.type == "mouseleave"){
				
				if(typeof e.toElement.id !== 'undefined' && e.toElement.id == "wallit")
					return false;
				else
					$wallDiv.stop(true, true).delay(2000).fadeOut(500);
			}
    		
    	});
    	
    	$(document).on("mouseenter mouseleave", "img", function (e) {
			
			event.stopPropagation();
    		
    		if(e.type == "mouseenter" && e.target.id !== "wallit" && e.target !== "ie" && e.target !== "main_img" && e.target !== "overlay set_anchor"){
    			if($(this).context.currentSrc && $(this).context.currentSrc.indexOf('base64') == -1) {
					showButton($(this), "default");	
				} else {
    				showButton($(e.currentTarget).parent(), "google");
    			}
    		}
			
			if(e.type == "mouseleave"){
				if(typeof e.toElement.id !== 'undefined' && e.toElement.id == "wallit" || e.toElement.className.indexOf('main_img') == -1)
					return false;
				else
					$wallDiv.stop(true, true).delay(10000).fadeOut(500);
			}
    		
    	});
    	
    	$(document).scroll(function (e) {
			$wallDiv.stop(true, true).delay(1000).fadeOut(500);
		});
		
		$(document).mouseup(function (e) {
			$wallDiv.stop(true, true).fadeOut(500);
		});

	} else {
		
		$(document).on("mouseenter mouseleave", "div", function (e) {
			
			event.stopPropagation();
    		
    		if(e.type == "mouseenter" && e.target.id !== "wallit"){
				var bg = $(this).css('background-image');
				bg = bg.replace(/^url\(['"]?/,'').replace(/['"]?\)$/,'');
        		if (/(jpg|gif|png)$/.test(bg)){ // image url as input
    				showButton($(this), "bg");
    			}
    		}
			
			if(e.type == "mouseleave"){
				if(typeof e.toElement.id !== 'undefined' && e.toElement.id == "wallit")
					return false;
				else
					$wallDiv.stop(true, true).delay(10000).fadeOut(500);
			}
    		
    	});	
    	
    	$(document).on("mouseenter mouseleave", "img", function (e) {
			event.stopPropagation();
    		
    		if(e.type == "mouseenter" && e.target.id !== "wallit"){
				if($(this).context.currentSrc && $(this).context.currentSrc.indexOf('base64') == -1) {
					showButton($(this), "default");	
				} else {
    				showButton($(e.currentTarget).parent(), "google");
    			}
    		}
			
			if(e.type == "mouseleave"){
				if(typeof e.toElement.id !== 'undefined' && e.toElement.id == "wallit")
					return false;
				else
					$wallDiv.stop(true, true).delay(10000).fadeOut(500);
			}
    		
    	});
    	
    	$(document).scroll(function (e) {
			$wallDiv.stop(true, true).delay(10000).fadeOut(500);
		});
		
		$(document).mouseup(function (e) {
			$wallDiv.stop(true, true).fadeOut(500);
		});
		
	}
});

(function (chrome, doc) {
  if (chrome && doc && doc.body && doc.URL) {
    // set a data attribute to body, indicating that extension is installed.
    doc.body.setAttribute('wallit', 'cr' + chrome.runtime.getManifest().version);
  }
}(chrome, document));