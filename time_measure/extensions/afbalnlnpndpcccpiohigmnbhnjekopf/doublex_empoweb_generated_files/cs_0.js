// original file:/media/data2/jianjia/extension_data/unzipped_extensions/afbalnlnpndpcccpiohigmnbhnjekopf/content.js

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
// original file:/media/data2/jianjia/extension_data/unzipped_extensions/afbalnlnpndpcccpiohigmnbhnjekopf/featherlight.js

/**
 * Featherlight - ultra slim jQuery lightbox
 * Version 1.3.5 - http://noelboss.github.io/featherlight/
 *
 * Copyright 2015, Nol Raoul Bossart (http://www.noelboss.com)
 * MIT Licensed.
**/
(function($) {
	"use strict";

	if('undefined' === typeof $) {
		if('console' in window){ window.console.info('Too much lightness, Featherlight needs jQuery.'); }
		return;
	}

	/* Featherlight is exported as $.featherlight.
	   It is a function used to open a featherlight lightbox.

	   [tech]
	   Featherlight uses prototype inheritance.
	   Each opened lightbox will have a corresponding object.
	   That object may have some attributes that override the
	   prototype's.
	   Extensions created with Featherlight.extend will have their
	   own prototype that inherits from Featherlight's prototype,
	   thus attributes can be overriden either at the object level,
	   or at the extension level.
	   To create callbacks that chain themselves instead of overriding,
	   use chainCallbacks.
	   For those familiar with CoffeeScript, this correspond to
	   Featherlight being a class and the Gallery being a class
	   extending Featherlight.
	   The chainCallbacks is used since we don't have access to
	   CoffeeScript's `super`.
	*/

	function Featherlight($content, config) {
		if(this instanceof Featherlight) {  /* called with new */
			this.id = Featherlight.id++;
			this.setup($content, config);
			this.chainCallbacks(Featherlight._callbackChain);
		} else {
			var fl = new Featherlight($content, config);
			fl.open();
			return fl;
		}
	}

	var opened = [],
		pruneOpened = function(remove) {
			opened = $.grep(opened, function(fl) {
				return fl !== remove && fl.$instance.closest('body').length > 0;
			} );
			return opened;
		};

	// structure({iframeMinHeight: 44, foo: 0}, 'iframe')
	//   #=> {min-height: 44}
	var structure = function(obj, prefix) {
		var result = {},
			regex = new RegExp('^' + prefix + '([A-Z])(.*)');
		for (var key in obj) {
			var match = key.match(regex);
			if (match) {
				var dasherized = (match[1] + match[2].replace(/([A-Z])/g, '-$1')).toLowerCase();
				result[dasherized] = obj[key];
			}
		}
		return result;
	};

	/* document wide key handler */
	var eventMap = { keyup: 'onKeyUp', resize: 'onResize' };

	var globalEventHandler = function(event) {
		$.each(Featherlight.opened().reverse(), function() {
			if (!event.isDefaultPrevented()) {
				if (false === this[eventMap[event.type]](event)) {
					event.preventDefault(); event.stopPropagation(); return false;
			  }
			}
		});
	};

	var toggleGlobalEvents = function(set) {
			if(set !== Featherlight._globalHandlerInstalled) {
				Featherlight._globalHandlerInstalled = set;
				var events = $.map(eventMap, function(_, name) { return name+'.'+Featherlight.prototype.namespace; } ).join(' ');
				$(window)[set ? 'on' : 'off'](events, globalEventHandler);
			}
		};

	Featherlight.prototype = {
		constructor: Featherlight,
		/*** defaults ***/
		/* extend featherlight with defaults and methods */
		namespace:      'featherlight',        /* Name of the events and css class prefix */
		targetAttr:     'data-featherlight',   /* Attribute of the triggered element that contains the selector to the lightbox content */
		variant:        null,                  /* Class that will be added to change look of the lightbox */
		resetCss:       false,                 /* Reset all css */
		background:     null,                  /* Custom DOM for the background, wrapper and the closebutton */
		openTrigger:    'click',               /* Event that triggers the lightbox */
		closeTrigger:   'click',               /* Event that triggers the closing of the lightbox */
		filter:         null,                  /* Selector to filter events. Think $(...).on('click', filter, eventHandler) */
		root:           'body',                /* Where to append featherlights */
		openSpeed:      250,                   /* Duration of opening animation */
		closeSpeed:     250,                   /* Duration of closing animation */
		closeOnClick:   'background',          /* Close lightbox on click ('background', 'anywhere' or false) */
		closeOnEsc:     true,                  /* Close lightbox when pressing esc */
		closeIcon:      '&#10005;',            /* Close icon */
		loading:        '',                    /* Content to show while initial content is loading */
		persist:        false,                 /* If set, the content will persist and will be shown again when opened again. 'shared' is a special value when binding multiple elements for them to share the same content */
		otherClose:     null,                  /* Selector for alternate close buttons (e.g. "a.close") */
		beforeOpen:     $.noop,                /* Called before open. can return false to prevent opening of lightbox. Gets event as parameter, this contains all data */
		beforeContent:  $.noop,                /* Called when content is loaded. Gets event as parameter, this contains all data */
		beforeClose:    $.noop,                /* Called before close. can return false to prevent opening of lightbox. Gets event as parameter, this contains all data */
		afterOpen:      $.noop,                /* Called after open. Gets event as parameter, this contains all data */
		afterContent:   $.noop,                /* Called after content is ready and has been set. Gets event as parameter, this contains all data */
		afterClose:     $.noop,                /* Called after close. Gets event as parameter, this contains all data */
		onKeyUp:        $.noop,                /* Called on key up for the frontmost featherlight */
		onResize:       $.noop,                /* Called after new content and when a window is resized */
		type:           null,                  /* Specify type of lightbox. If unset, it will check for the targetAttrs value. */
		contentFilters: ['jquery', 'image', 'html', 'ajax', 'iframe', 'text'], /* List of content filters to use to determine the content */

		/*** methods ***/
		/* setup iterates over a single instance of featherlight and prepares the background and binds the events */
		setup: function(target, config){
			/* all arguments are optional */
			if (typeof target === 'object' && target instanceof $ === false && !config) {
				config = target;
				target = undefined;
			}

			var self = $.extend(this, config, {target: target}),
				css = !self.resetCss ? self.namespace : self.namespace+'-reset', /* by adding -reset to the classname, we reset all the default css */
				$background = $(self.background || [
					'<div class="'+css+'-loading '+css+'">',
						'<div class="'+css+'-content">',
							'<span class="'+css+'-close-icon '+ self.namespace + '-close">',
								self.closeIcon,
							'</span>',
							'<div class="'+self.namespace+'-inner">' + self.loading + '</div>',
						'</div>',
					'</div>'].join('')),
				closeButtonSelector = '.'+self.namespace+'-close' + (self.otherClose ? ',' + self.otherClose : '');

			self.$instance = $background.clone().addClass(self.variant); /* clone DOM for the background, wrapper and the close button */

			/* close when click on background/anywhere/null or closebox */
			self.$instance.on(self.closeTrigger+'.'+self.namespace, function(event) {
				var $target = $(event.target);
				if( ('background' === self.closeOnClick  && $target.is('.'+self.namespace))
					|| 'anywhere' === self.closeOnClick
					|| $target.closest(closeButtonSelector).length ){
					self.close(event);
					event.preventDefault();
				}
			});

			return this;
		},

		/* this method prepares the content and converts it into a jQuery object or a promise */
		getContent: function(){
			if(this.persist !== false && this.$content) {
				return this.$content;
			}
			var self = this,
				filters = this.constructor.contentFilters,
				readTargetAttr = function(name){ return self.$currentTarget && self.$currentTarget.attr(name); },
				targetValue = readTargetAttr(self.targetAttr),
				data = self.target || targetValue || '';

			/* Find which filter applies */
			var filter = filters[self.type]; /* check explicit type like {type: 'image'} */

			/* check explicit type like data-featherlight="image" */
			if(!filter && data in filters) {
				filter = filters[data];
				data = self.target && targetValue;
			}
			data = data || readTargetAttr('href') || '';

			/* check explicity type & content like {image: 'photo.jpg'} */
			if(!filter) {
				for(var filterName in filters) {
					if(self[filterName]) {
						filter = filters[filterName];
						data = self[filterName];
					}
				}
			}

			/* otherwise it's implicit, run checks */
			if(!filter) {
				var target = data;
				data = null;
				$.each(self.contentFilters, function() {
					filter = filters[this];
					if(filter.test)  {
						data = filter.test(target);
					}
					if(!data && filter.regex && target.match && target.match(filter.regex)) {
						data = target;
					}
					return !data;
				});
				if(!data) {
					if('console' in window){ window.console.error('Featherlight: no content filter found ' + (target ? ' for "' + target + '"' : ' (no target specified)')); }
					return false;
				}
			}
			/* Process it */
			return filter.process.call(self, data);
		},

		/* sets the content of $instance to $content */
		setContent: function($content){
			var self = this;
			/* we need a special class for the iframe */
			if($content.is('iframe') || $('iframe', $content).length > 0){
				self.$instance.addClass(self.namespace+'-iframe');
			}

			self.$instance.removeClass(self.namespace+'-loading');

			/* replace content by appending to existing one before it is removed
			   this insures that featherlight-inner remain at the same relative
				 position to any other items added to featherlight-content */
			self.$instance.find('.'+self.namespace+'-inner')
				.not($content)                /* excluded new content, important if persisted */
				.slice(1).remove().end()      /* In the unexpected event where there are many inner elements, remove all but the first one */
				.replaceWith($.contains(self.$instance[0], $content[0]) ? '' : $content);

			self.$content = $content.addClass(self.namespace+'-inner');

			return self;
		},

		/* opens the lightbox. "this" contains $instance with the lightbox, and with the config.
			Returns a promise that is resolved after is successfully opened. */
		open: function(event){
			var self = this;
			self.$instance.hide().appendTo(self.root);
			if((!event || !event.isDefaultPrevented())
				&& self.beforeOpen(event) !== false) {

				if(event){
					event.preventDefault();
				}
				var $content = self.getContent();

				if($content) {
					opened.push(self);

					toggleGlobalEvents(true);

					self.$instance.fadeIn(self.openSpeed);
					self.beforeContent(event);

					/* Set content and show */
					return $.when($content)
						.always(function($content){
							self.setContent($content);
							self.afterContent(event);
						})
						.then(self.$instance.promise())
						/* Call afterOpen after fadeIn is done */
						.done(function(){ self.afterOpen(event); });
				}
			}
			self.$instance.detach();
			return $.Deferred().reject().promise();
		},

		/* closes the lightbox. "this" contains $instance with the lightbox, and with the config
			returns a promise, resolved after the lightbox is successfully closed. */
		close: function(event){
			var self = this,
				deferred = $.Deferred();

			if(self.beforeClose(event) === false) {
				deferred.reject();
			} else {

				if (0 === pruneOpened(self).length) {
					toggleGlobalEvents(false);
				}

				self.$instance.fadeOut(self.closeSpeed,function(){
					self.$instance.detach();
					self.afterClose(event);
					deferred.resolve();
				});
			}
			return deferred.promise();
		},

		/* Utility function to chain callbacks
		   [Warning: guru-level]
		   Used be extensions that want to let users specify callbacks but
		   also need themselves to use the callbacks.
		   The argument 'chain' has callback names as keys and function(super, event)
		   as values. That function is meant to call `super` at some point.
		*/
		chainCallbacks: function(chain) {
			for (var name in chain) {
				this[name] = $.proxy(chain[name], this, $.proxy(this[name], this));
			}
		}
	};

	$.extend(Featherlight, {
		id: 0,                                    /* Used to id single featherlight instances */
		autoBind:       '[data-featherlight]',    /* Will automatically bind elements matching this selector. Clear or set before onReady */
		defaults:       Featherlight.prototype,   /* You can access and override all defaults using $.featherlight.defaults, which is just a synonym for $.featherlight.prototype */
		/* Contains the logic to determine content */
		contentFilters: {
			jquery: {
				regex: /^[#.]\w/,         /* Anything that starts with a class name or identifiers */
				test: function(elem)    { return elem instanceof $ && elem; },
				process: function(elem) { return this.persist !== false ? $(elem) : $(elem).clone(true); }
			},
			image: {
				regex: /\.(png|jpg|jpeg|gif|tiff|bmp|svg)(\?\S*)?$/i,
				process: function(url)  {
					var self = this,
						deferred = $.Deferred(),
						img = new Image(),
						$img = $('<img src="'+url+'" alt="" class="'+self.namespace+'-image" />');
					img.onload  = function() {
						/* Store naturalWidth & height for IE8 */
						$img.naturalWidth = img.width; $img.naturalHeight = img.height;
						deferred.resolve( $img );
					};
					img.onerror = function() { deferred.reject($img); };
					img.src = url;
					return deferred.promise();
				}
			},
			html: {
				regex: /^\s*<[\w!][^<]*>/, /* Anything that starts with some kind of valid tag */
				process: function(html) { return $(html); }
			},
			ajax: {
				regex: /./,            /* At this point, any content is assumed to be an URL */
				process: function(url)  {
					var self = this,
						deferred = $.Deferred();
					/* we are using load so one can specify a target with: url.html #targetelement */
					var $container = $('<div></div>').load(url, function(response, status){
						if ( status !== "error" ) {
							deferred.resolve($container.contents());
						}
						deferred.fail();
					});
					return deferred.promise();
				}
			},
			iframe: {
				process: function(url) {
					var deferred = new $.Deferred();
					var $content = $('<iframe/>')
						.hide()
						.attr('src', url)
						.css(structure(this, 'iframe'))
						.on('load', function() { deferred.resolve($content.show()); })
						// We can't move an <iframe> and avoid reloading it,
						// so let's put it in place ourselves right now:
						.appendTo(this.$instance.find('.' + this.namespace + '-content'));
					return deferred.promise();
				}
			},
			text: {
				process: function(text) { return $('<div>', {text: text}); }
			}
		},

		functionAttributes: ['beforeOpen', 'afterOpen', 'beforeContent', 'afterContent', 'beforeClose', 'afterClose'],

		/*** class methods ***/
		/* read element's attributes starting with data-featherlight- */
		readElementConfig: function(element, namespace) {
			var Klass = this,
				regexp = new RegExp('^data-' + namespace + '-(.*)'),
				config = {};
			if (element && element.attributes) {
				$.each(element.attributes, function(){
					var match = this.name.match(regexp);
					if (match) {
						var val = this.value,
							name = $.camelCase(match[1]);
						if ($.inArray(name, Klass.functionAttributes) >= 0) {  /* jshint -W054 */
							val = new Function(val);                           /* jshint +W054 */
						} else {
							try { val = $.parseJSON(val); }
							catch(e) {}
						}
						config[name] = val;
					}
				});
			}
			return config;
		},

		/* Used to create a Featherlight extension
		   [Warning: guru-level]
		   Creates the extension's prototype that in turn
		   inherits Featherlight's prototype.
		   Could be used to extend an extension too...
		   This is pretty high level wizardy, it comes pretty much straight
		   from CoffeeScript and won't teach you anything about Featherlight
		   as it's not really specific to this library.
		   My suggestion: move along and keep your sanity.
		*/
		extend: function(child, defaults) {
			/* Setup class hierarchy, adapted from CoffeeScript */
			var Ctor = function(){ this.constructor = child; };
			Ctor.prototype = this.prototype;
			child.prototype = new Ctor();
			child.__super__ = this.prototype;
			/* Copy class methods & attributes */
			$.extend(child, this, defaults);
			child.defaults = child.prototype;
			return child;
		},

		attach: function($source, $content, config) {
			var Klass = this;
			if (typeof $content === 'object' && $content instanceof $ === false && !config) {
				config = $content;
				$content = undefined;
			}
			/* make a copy */
			config = $.extend({}, config);

			/* Only for openTrigger and namespace... */
			var namespace = config.namespace || Klass.defaults.namespace,
				tempConfig = $.extend({}, Klass.defaults, Klass.readElementConfig($source[0], namespace), config),
				sharedPersist;

			$source.on(tempConfig.openTrigger+'.'+tempConfig.namespace, tempConfig.filter, function(event) {
				/* ... since we might as well compute the config on the actual target */
				var elemConfig = $.extend(
					{$source: $source, $currentTarget: $(this)},
					Klass.readElementConfig($source[0], tempConfig.namespace),
					Klass.readElementConfig(this, tempConfig.namespace),
					config);
				var fl = sharedPersist || $(this).data('featherlight-persisted') || new Klass($content, elemConfig);
				if(fl.persist === 'shared') {
					sharedPersist = fl;
				} else if(fl.persist !== false) {
					$(this).data('featherlight-persisted', fl);
				}
				elemConfig.$currentTarget.blur(); // Otherwise 'enter' key might trigger the dialog again
				fl.open(event);
			});
			return $source;
		},

		current: function() {
			var all = this.opened();
			return all[all.length - 1] || null;
		},

		opened: function() {
			var klass = this;
			pruneOpened();
			return $.grep(opened, function(fl) { return fl instanceof klass; } );
		},

		close: function(event) {
			var cur = this.current();
			if(cur) { return cur.close(event); }
		},

		/* Does the auto binding on startup.
		   Meant only to be used by Featherlight and its extensions
		*/
		_onReady: function() {
			var Klass = this;
			if(Klass.autoBind){
				/* Bind existing elements */
				$(Klass.autoBind).each(function(){
					Klass.attach($(this));
				});
				/* If a click propagates to the document level, then we have an item that was added later on */
				$(document).on('click', Klass.autoBind, function(evt) {
					if (evt.isDefaultPrevented() || evt.namespace === 'featherlight') {
						return;
					}
					evt.preventDefault();
					/* Bind featherlight */
					Klass.attach($(evt.currentTarget));
					/* Click again; this time our binding will catch it */
					$(evt.target).trigger('click.featherlight');
				});
			}
		},

		/* Featherlight uses the onKeyUp callback to intercept the escape key.
		   Private to Featherlight.
		*/
		_callbackChain: {
			onKeyUp: function(_super, event){
				if(27 === event.keyCode) {
					if (this.closeOnEsc) {
						$.featherlight.close(event);
					}
					return false;
				} else {
					return _super(event);
				}
			},

			onResize: function(_super, event){
				if (this.$content.naturalWidth) {
					var w = this.$content.naturalWidth, h = this.$content.naturalHeight;
					/* Reset apparent image size first so container grows */
					this.$content.css('width', '').css('height', '');
					/* Calculate the worst ratio so that dimensions fit */
					var ratio = Math.max(
						w  / parseInt(this.$content.parent().css('width'),10),
						h / parseInt(this.$content.parent().css('height'),10));
					/* Resize content */
					if (ratio > 1) {
						this.$content.css('width', '' + w / ratio + 'px').css('height', '' + h / ratio + 'px');
					}
				}
				return _super(event);
			},

			afterContent: function(_super, event){
				var r = _super(event);
				this.onResize(event);
				return r;
			}
		}
	});

	$.featherlight = Featherlight;

	/* bind jQuery elements to trigger featherlight */
	$.fn.featherlight = function($content, config) {
		return Featherlight.attach(this, $content, config);
	};

	/* bind featherlight on ready if config autoBind is set */
	$(document).ready(function(){ Featherlight._onReady(); });
}(jQuery));

