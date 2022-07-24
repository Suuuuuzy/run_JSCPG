function book_mark() {
	var obj = document.createElement('div');
	obj.id = 'full-page';
	obj.style['width'] = screen.width+'px';
	obj.style['height'] = screen.height+'px';
	obj.style['z-index'] = '99999';
	obj.style['padding-top'] = '70px';
	obj.style['background'] = 'rgba(0,0,0,0.8)';

	obj.style['transform'] = 'translate(0%, -1%)';
	obj.style['transition'] = 'opacity .5s, top .5s';

	obj.style['top'] = 0;
	obj.style['bottom'] = 0;
	obj.style['left'] = 0;
	obj.style['right'] = 0;

	obj.style['position'] = 'fixed';
	var topElem = document.createElement('div');
	topElem.style['text-align'] = 'center';
	topElem.style['background'] = '#eee';
	topElem.style['overflow'] = 'hidden';
	topElem.style['padding-top'] = '10px';
	topElem.style['width'] = '90.8%';
	topElem.style['margin'] = 'auto';

	var span1 = document.createElement("span");
	span1.style['float'] = 'left';
	span1.style['margin-left'] = '2%';
	span1.style['margin-bottom'] = '10px';
	span1.style['font-size'] = '17px';
	span1.style['font-weight'] = 'bold';
	var text1 = document.createTextNode("Choose an image");
	span1.appendChild(text1);
	var span2 = document.createElement("span");
	span2.style['float'] = 'right';
	span2.style['margin-right'] = '2%';
	span2.style['margin-bottom'] = '10px';
	span2.style['font-size'] = '17px';
	span2.style['font-weight'] = 'bold';
	span2.style['cursor'] = 'pointer';
	span2.addEventListener('click', function(){
		var elem = document.getElementById('mysocial-tab');
    	elem.parentNode.removeChild(elem);

		var elemMst = document.getElementById('mysocial-tab-div');
    	elemMst.parentNode.removeChild(elemMst);
		
		var elem = document.getElementById('full-page');
		return elem.parentNode.removeChild(elem);
	}, false);
	var text2 = document.createTextNode("X");
	span2.appendChild(text2);
	topElem.appendChild(span1);
	topElem.appendChild(span2);
	obj.appendChild(topElem);
	var innerElem = document.createElement('div');
	innerElem.style['overflow-y'] = 'auto';
	innerElem.style['height'] = '400px';
	innerElem.style['width'] = '90.8%';
	innerElem.style['background'] = '#e8e6e6';
	innerElem.style['text-align'] = 'center';
	innerElem.style['margin'] = 'auto';
	obj.style['z-index'] = '99999';

	var x = document.images.length;
	for(i=0; i < x; ++i) {
		if((document.images[i].width >= 150 || document.images[i].height >= 150)) {		
			var ahref = document.createElement("a");
			ahref.setAttribute('href',"javascript:void(0);");		
			ahref.setAttribute('style',"margin:2px; display:inline-block;");				
			var elem = document.getElementsByClassName('book_mark')[0];	
			var client_id = elem.getAttribute('client_id');
			var client_secret = elem.getAttribute('client_secret');
			var title = elem.getAttribute('title');
			var description = elem.getAttribute('description');
			var interestId = elem.getAttribute('interestId');
			var categoryId = elem.getAttribute('categoryId');
			var activityId = elem.getAttribute('activityId');
			var store_name = elem.getAttribute('store_name');
			var storeName = elem.getAttribute('storeName');
			var sub_category = elem.getAttribute('sub_category');
			var brandID = elem.getAttribute('brandID');
			var imag = document.images[i].src;
			
			 currnetUrl='&client_id='+client_id+'&client_secret='+client_secret+'&image='+imag+'&title='+title+'&description='+description+'&interestId='+interestId+'&categoryId='+categoryId+'&activityId='+activityId+'&store_name='+store_name+'&storeName='+storeName+'&brandID='+brandID+'&sub_category='+sub_category;
			 
			var baseurl=document.URL;
			
			ahref.setAttribute('onClick',"bookMarkOnClick('"+baseurl+"', '"+currnetUrl+"')");
				
			var img = document.createElement("img");
			img.src = document.images[i].src;
			img.width = 300;
			ahref.appendChild(img);
			innerElem.appendChild(ahref);
			
		}
	}
	obj.appendChild(innerElem);
	document.body.append(obj);
}

function bookMarkOnClick(baseurl, currnetUrl) {	
	var iMyWidth;
	var iMyHeight;
	  //half the screen width minus half the new window width (plus 5 pixel borders).
	iMyWidth = (window.screen.width / 2) - (300 + 10);
	  //half the screen height minus half the new window height (plus title and status bars).
	iMyHeight = (window.screen.height / 2) - (300 + 50);
		
		
	var elem = document.getElementById('full-page');
	elem.parentNode.removeChild(elem);
	
	
	window.open("http://www.mysocialtab.com/widgetDemo?url="+baseurl+currnetUrl+"&widgetId=book_mark",'windowname1',"status=no, height=600,width=600,resizable=yes,left=" + iMyWidth + ",top=" + iMyHeight + ",screenX=" + iMyWidth + ",screenY=" + iMyHeight + ",toolbar=no,menubar=no,scrollbars=no,location=no,directories=no");
}

book_mark();