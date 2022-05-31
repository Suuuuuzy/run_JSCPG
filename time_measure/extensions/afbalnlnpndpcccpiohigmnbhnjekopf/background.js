var currentPage;

(function (window, chrome, args) {
  var $ = window['P'] = {
    'window': window,
    'args': args,
    'chrome': chrome,
    'v': {
      'ver': chrome.runtime.getManifest().version,
      'sessionStart': new Date().getTime()
    },
    'functions': (function () {
      return {
        // xmlhttprequest
        xhr: function (url, callback) {
          var xhr = new XMLHttpRequest();
          xhr.open("GET", url, true);
          if (callback) {
            xhr.onreadystatechange = function() {
              if (xhr.readyState == 4) {
                callback(xhr.responseText);
              }
            };
          }
          xhr.send();
        },
        // log
        log: function (str) {
          var url = $.args.stwurls.log + '?type=extension&xv=cr' + $.v.ver + str;
          $.functions.xhr(url);
        },

        // communicate with content.js
        send: function (obj) {
          $.chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            if (tabs.length) {
              $.chrome.tabs.sendMessage(tabs[0].id, obj, function() {});
            }
          });
        },
        // toolbar button
        grid: function () {
        
          var logMsg, wallmarklet;
          logMsg = '&event=click&xm=g';
          wallmarklet = "(function(d){var e=d.createElement('script');";
          /*
          if (extraGridParam) {
            wallmarklet = wallmarklet + "e.setAttribute('" + extraGridParam + "',true);";
            logMsg = logMsg + '&extraGridParam=' + extraGridParam;
          } */
          wallmarklet = wallmarklet + "e.setAttribute('WallMethod','extension');e.setAttribute('extensionVer','cr" + $.v.ver + "');e.setAttribute('src','" + $.args.stwurls.assets + $.args.path.wallmarklet + "?r='+Math.random()*99999999);d.body.appendChild(e)}(document));";
          
          
          $.chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          		$.chrome.tabs.executeScript(null, { code: wallmarklet });
          });
               
        },
        // actions we are prepared to take when asked by content.js
        act: {
          // log something that happened in content
          logAction: function (request) {
            if (request.logAction) {
              $.functions.log(request.logAction);
            }
          },
          // pop the grid -- r.extraParam may be used to add one boolean parameter to the call to wallmarklet.js
          popGrid: function (request) {          	
            if (request.extraParam && typeof request.extraParam === 'string') {
              $.functions.grid(request.extraParam);
            } else {
              $.functions.grid();
            }
          },
          // set uninstall URL
          uninstallUrl: function (request) {
            
            var uninstallUrl = request.uninstallUrl + '?xv=cr' + $.v.ver;
            $.chrome.runtime.setUninstallURL(uninstallUrl);
            $.functions.setLocal({'uninstallUrl': uninstallUrl});
          },
          // bounce message to content script
          bounceMsg: function (request) {
            $.functions.send(request);
          }
        },
        
        // start
        init: function () {

          // toolbar button click
          $.chrome.browserAction.onClicked.addListener(function(info, tab) {
			$.functions.grid();
          });
          //context menu
          $.chrome.contextMenus.removeAll();
		  var cmid;
          
          // ID to manage the context menu entry
		  //var cmid;
		  var cm_clickHandler = function(info, tab) {

          		mediaURL = info.srcUrl;
          		tabURL = tab.url;
          		var googlePage = false;
          		var base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;

          		if (info.pageUrl.indexOf('google') !== -1 || base64regex.test(info.srcUrl)){
          			mediaURL = info.linkUrl.split("imgurl=");
          			mediaURL = mediaURL[1].split("&imgrefurl=");
  					mediaURL = decodeURIComponent(mediaURL[0]);
  					
  					googlePage = true;
  					
          		}
          		
          		stwSearchUrl = "https://www.shopthewall.com/wallit/search/";
      			stwSearchUrl += "&media=" + encodeURIComponent(mediaURL) + "&url=" + encodeURIComponent(tabURL) + "&title=" + encodeURIComponent(tab.title);
      			stwSearchUrl += "&is_video=false&fullsize=true&description=";
   				
   				var code = 
        			"var stwSearchUrl = unescape('" + escape(stwSearchUrl) + "');" +
      				"var imgs = document.getElementsByTagName('img');" +
      				"var srcUrl = unescape('" + escape(mediaURL) + "');" +
      				"var opened=0;" +
      				"var width = $(window).width() - ( $(window).width() * 0.20 );" +
      				"var width = 1325;" +
					"var height =  $(window).height() - ( $(window).height() * 0.20 );" +	
      				"for (var i in imgs) {" + 
      				"	var img = imgs[i];" +
      				"	if (img.src == srcUrl && opened == '0') {" +
      				" 		stwSearchUrl += img.alt;" +
					"		$.featherlight({" +
      				"			iframe: stwSearchUrl," + 
      				"			iframeMaxWidth: width, " +
      				"			iframeWidth: width," +
      				"			iframeHeight: height," +
      				"			closeIcon: 'Fenster schlie&szlig;en'" +
      				"		});" +
      				"		opened=1;" +
      				"	}" +
      				"}";
      				
      			if(googlePage){
      				var code = 
        				"var stwSearchUrl = unescape('" + escape(stwSearchUrl) + "');" +
      					"var imgs = document.getElementsByTagName('img');" +
      					"var srcUrl = unescape('" + escape(mediaURL) + "');" +
      					"var width = $(window).width() - ( $(window).width() * 0.20 );" +
      					"var width = 1325;" +
						"var height =  $(window).height() - ( $(window).height() * 0.20 );" +	
      					"$.featherlight({" +
      					"	iframe: stwSearchUrl," + 
      					"	iframeMaxWidth: width, " +
      					"	iframeWidth: width," +
      					"	iframeHeight: height," +
      					"	closeIcon: 'Fenster schlie&szlig;en'" +
      					"});";
      						     				
      			}
      			
  				chrome.tabs.executeScript(tab.id, {"allFrames": true, "code": code});    		
		  };
		  
		  
		  $.chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
		  	
		  		if (document.domain.indexOf('shopthewall.com/wallit') !== -1) 
					return false;
		  	
		  		if( msg.currentUrl.indexOf('shopthewall.com') !== -1 )
        			var status = false;
        	  	else
        			var status = true;	
    	  		
    	  		
    	  	  	var options = {
                	title: "Wall It!",
                	contexts: ['image'],
                	enabled: status,
                	onclick: cm_clickHandler
              	};	
		  	
		  		if (msg.request === 'updateContextMenu') {
    	  			if(cmid == null) {
              			cmid = $.chrome.contextMenus.create(options);
              		} else {
            			if (cmid != null) {
            				$.chrome.contextMenus.update(cmid, options);
              			}else {
              				cmid = $.chrome.contextMenus.create(options);
              			}
              		}
    			  }	   
			});
          
          
          
          /*
		  $.chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
        	if(request === "createMenu") {
                        if(sender.tab.url.indexOf('shopthewall.com') !== -1) {
                        	           var options = {
                        	           	"title": "Wall It!", 
    									"enabled": false,
    									"contexts": ["image"],
                        	           	                
            							};
            							console.dir("false");
            							$.chrome.contextMenus.removeAll();
            							$.v.contextMenu;
                            			chrome.contextMenus.update($.v.contextMenu, options);
                        } else {
                        	var options = {
                        	           	"title": "Wall It!", 
    									"enabled": true,
    									"contexts": ["image"],
                        	           	                
            							};
            							console.dir("true");
            							$.chrome.contextMenus.removeAll();
            							$.v.contextMenu;
                        				chrome.contextMenus.update($.v.contextMenu, options);
                        }
                
          	}
		  });*/
          
          
          			
          			var windowTopTab=[];
					var curWin = 1;
					var curUrl = "";
          
          			
          	/*
          			chrome.windows.onFocusChanged.addListener(function(windowId) { 
          				curWin = windowId; 
          				/* fetchCurUrl(); */
  /*        				chrome.tabs.get(windowTopTab[curWin], function(tab){
    						curUrl = tab;
    						console.dir(tab);
  						});
          				checkContextCallback(curUrl);  
          			});
*/
          
          			chrome.tabs.onActivated.addListener(function(activeInfo) {
    					chrome.tabs.get(activeInfo.tabId, function (tab) {
        					checkContextCallback(tab.url);
        				});
					});

					chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, updatedTab) {
    					chrome.tabs.query({'active': true}, function (activeTabs) {
        					var activeTab = activeTabs[0];

        					if (activeTab == updatedTab) {
            					checkContextCallback(activeTab.url);
            				}
    					});
					});
					
					
					function checkContextCallback(newUrl) {
							
    					chrome.runtime.sendMessage({
        					request: 'updateContextMenu',
        					currentUrl: newUrl
    					});
					}
					
					function fetchCurUrl(){
  						if(!windowTopTab[curWin]) return;
  						chrome.tabs.get(windowTopTab[curWin], function(tab){
    						curUrl = tab;
  						});
					}
					
					
          
          // listen for incoming messages from content script
          $.chrome.runtime.onMessage.addListener(function(request) {
            for (var k in request) {
              if (typeof $.functions.act[k] === 'function') {
                $.functions.act[k](request);
                break;
              }
            }
          });
        }
      };
    }())
  };
  // get everything in local storage and then init
  $.chrome.storage.local.get(null, function(data) {
    for (var i in data) {
      $.v[i] = data[i];
    }
    $.functions.init();    	
  });
}(window, chrome, {
  'stwurls': {
    'about': 'https://shopthewall.com/wallit/about/',
    'log': 'https://shopthewall.com.com/wallit/log/',
    'assets': 'https://www.shopthewall.com/wallit/ext/'
  },
  'path': {
    'wallmarklet': 'wallmarklet2.js',
    'uninstall': 'browser-button/'
  }
}));