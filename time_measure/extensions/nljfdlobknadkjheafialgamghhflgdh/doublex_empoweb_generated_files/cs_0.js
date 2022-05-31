// original file:/media/data2/jianjia/extension_data/unzipped_extensions/nljfdlobknadkjheafialgamghhflgdh/content.js

var dataMatch = {
	gist: /^https?:(\/\/gist.github.com\/\w+\/\w+)(#.*)?/,
	// github: /^https?:(\/\/github.com\/[^\?\#]+)/,
	// ideone: /^(https?:\/\/ideone.com)\/(\w+)/
}

function siteFromHref(href){
	for (site in dataMatch){
		if (href.match(dataMatch[site])){
			return site;
		}
	}
	return false;
}

var dataUrl = {
	"gist": function(href){
		var parts = href.match(dataMatch["gist"]);
		var url = parts[1];
		var anchor = parts[2] || "";

		return [url,".js",anchor].join("");
	},
	// "github": function(href){
	// 	var parts = href.match(dataMatch["github"]);
	// 	var url = parts[1];

	// 	return url;
	// },
	// "ideone": function(href){
	// 	var parts = href.match(dataMatch["ideone"]);
	// 	var url = parts[1];
	// 	var body = parts[2] || "";

	// 	return [url,"/e.js/",body].join("");
	// }
}


function initLoadButton(index, elem){
	if(siteFromHref(elem.href)!==false){
		var button = $('<span class="expandy-load expandy-button">load</span>');
		button.click(initExpandy.bind(button,index,elem.href));

		$(elem).after(button);
	}
}

function initExpandy(index, href, ev){
	$(this).css("background-color","green");
	$(this).text("load");
	var site = siteFromHref(href);
	var url = dataUrl[site](href);
	$.ajax({
		url: url,
		dataType: "text"
	}).done(
		buildExpandy.bind(this,index,site,ev)
	).fail(
		initFail.bind(this)
	);
}

function initFail(response, status, message){
	$(this).css("background-color","red");
	$(this).text(response.status);
	$(this).attr("title",[status,":",message,". ","Click to try again"].join(""));
}

function unescapeData(rawData){
	var data = rawData;
	data = data.replace(/\\\\/g,"\\");
	data = data.replace(/\\n/g,"\n");
	data = data.replace(/\\"/g,"\"");
	data = data.replace(/\\\//g,"/");
	return data;
}

function hideButton(buttonShow, elemBody, ev){
	elemBody.hide();
	this.hide();
	buttonShow.show();
}

function showButton(buttonHide, elemBody, ev){
	elemBody.show();
	this.hide();
	buttonHide.show();
}

function buildExpandy(index, site, ev, rawData){
	var data; 
	var container;
	var id = 'expandy-'+index; 

	var container = $('<div class="expandy"></div>');

	if (ev.ctrlKey){
		$(this).after(container);
	}else{
		$(this).parent().after(container);
	}
	
	fillExpandy[site](container, rawData);

	var buttonHide = $('<span class="expandy-hide expandy-button">hide</span>');
	var buttonShow = $('<span class="expandy-show expandy-button">show</span>');
	buttonHide.click(hideButton.bind(buttonHide, buttonShow, container));
	buttonShow.click(showButton.bind(buttonShow, buttonHide, container));
	
	buttonShow.hide();

	$(this).before(buttonHide);
	$(this).before(buttonShow);
	$(this).remove();

	container.find("iframe").each(function(index,iframe){
		iframe = $(iframe);
		window.setTimeout((function(){
			var resizer = function(){
				if (!resizeIframeContent(iframe)){
					window.setTimeout(resizer,200);
				}
			}
			return resizer;
		})(), 200);
	})
}

fillExpandy = {
	"gist": function(container, rawData){
		var parts = rawData.split("\n");
		var rawCss = parts[0];
		var rawBody = parts[1];

		var css = unescapeData(rawCss.match(/^document.write\('(.*)'\);?$/)[1]);
		var dataBody = unescapeData(rawBody.match(/^document.write\('(.*)'\);?$/)[1]);
		
		var dataChildren = $(dataBody).find("div.gist-file");
		var body = dataChildren.each(function(){
			var content = $('<div class="gist"></div>').append($(this));
			content.find("table.lines, article").css("font-size","small");
			content.find(".file-data").css("max-height","600px");
			
			var iframe = $('<iframe scrolling="no" class="expandy-frame"></iframe>');
			container.append(iframe);

			iframe.contents().find("head").append(css);
			iframe.contents().find("body").append(content);
		});
		
		var dataChildren = $(dataBody).find("div.gist-file");
		var body = dataChildren.map(function(){
			return $('<div class="gist"></div>').append($(this)).get(0);
		});

	},

	// "github": function(container, rawData){
	// 	var $data = $("<div></div>").append(rawData);
	// 	var css = $data.find('link[type="text/css"]');

	// 	var body = $data.find("div.file-box");
	// 	$(body).find("div.actions").remove();
	// 	$(body).find(".blob-wrapper").css("max-height","600px");
	// 	$(body).find(".blob-wrapper").css("overflow","scroll");

	// 	var iframe = $('<iframe scrolling="no" class="expandy-frame"></iframe>');
	// 	container.append(iframe);

	// 	iframe.contents().find("head").append(css);
	// 	iframe.contents().find("body").append(body);
		
	// },

	// "ideone": function(container, rawData){
	// 	var body = unescapeData(rawData.match(/^document.write\('(.*)'\);?$/)[1]);
	// 	container.append(body);
	// }		
}

function resizeIframeContent(iframe){
	// var hBody = ;
	// var hFileBox = iframe.contents().find(".file-box").height();
	var oHeight = iframe.height();
	var iHeight = iframe.contents().find("body").height();

	var oWidth = iframe.width()-10;
	var iWidth = iframe.contents().find("body").width();
	if (oHeight !== iHeight && oWidth !== iWidth){
		iframe.height(iHeight);
		iframe.contents().find("body").width(oWidth);
		return true;
	}else{
		return false;
	}
}

$(function(){
	selectors = [
		'div.md a[href*="//gist.github.com"]',
		// 'div.md a[href*="//github.com"]',
		// 'div.md a[href*="//ideone.com"]'
	].join(",")
	$(selectors).map(initLoadButton);
	
});


