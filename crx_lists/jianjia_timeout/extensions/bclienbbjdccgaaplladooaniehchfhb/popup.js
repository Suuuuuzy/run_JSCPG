function getCurrentTabUrl(callback) {	
	
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo,(tabs) => {
    var tab = tabs[0];

    var url = tab.url;

    console.assert(typeof url == 'string', 'tab.url should be a string');

    callback(url);
  });
}


function getMeta(inp) {
  chrome.tabs.executeScript(null, {
    code: 'var classInp = "'+inp+'";'
  }, function() {
    chrome.tabs.executeScript(null, {
      file: 'getMeta.js'
    });
  });
}

function getMetaNew() {
  chrome.tabs.executeScript(null, {
    file: 'getMetaNew.js'
  }, function(results) {
	  
	 //console.log(results[0][0]);
	 //console.log(results);
	 
	
	//alert(results[0][5]);
   //if(results[0] == 'error') {
   if(results[0][0] == 'no result') {
	   	   
	   var mst_ext = document.getElementById('container');
        var elem = document.getElementById(results[0][0]);
        elem.classList.remove("hide1");

    } else {
						
      var mst_ext = document.getElementById('container_mst_ext');
      for(var i=0; i<results[0][0].length; i++) {
        var elem = document.getElementById(results[0][0][i]);
        elem.classList.remove("hide");
      }
	   
    }
	
	 //getHtml(results[0][5]);
	 getHtml(JSON.stringify(results[0][5]));
 
	
	
  });
}


var onclickfunction = false;
function getHtml(json){
	
	//console.log(json);
	var html = '';	
    obj = JSON.parse(json);
	//console.log(json);	
	if(obj.length > 0){
		for(var i = 0; i < obj.length; i++) {
	    	var data= obj[i];
	    	//console.log(data.promo_id);
			html+='<div class="CoupenCodeWrap">';
			html+='<div class="deal-description-box">';
			html+='<h3>'+data.offer_name+'</h3>';
		    html+='<h3>'+data.coupon_title+'</h3>';
		    html+='<p>Expires: '+convertDate(data.coupon_expiry)+', <a href="'+data.link+'" target="_blank">view</a></p>';
			html+='</div>';
			if (data.coupon_code) {
			html+='<input type="hidden" value="'+data.coupon_code+'" id="myInput" class="myInput">';
			}
			if (data.coupon_code) {
		/*	html+='<button class="btn btn-deal-code deal-btn-position" id="btn_myfunction_'+i+'" onclick="return myFunction();" value="'+data.coupon_code+'" type="button">Copy Code</button>';*/
			html+='<button class="btn btn-deal-code deal-btn-position" id="btn_myfunction_'+i+'" value="'+data.coupon_code+'" type="button">Copy Code</button>';
			} else {
			html+='<a href="'+data.link+'" target="_blank" class="btn btn-deal-code deal-btn-position">Go to deal</a>';	
			}
			html+='</div>';
			
			onclickfunction = true;
		}
	}
 document.getElementById("json_html").innerHTML = html;
	
   if(onclickfunction){

		for(var j = 0; j < obj.length; j++) {	
			
			document.getElementById("btn_myfunction_"+j).addEventListener('click', myFunction);	
			
		}
	}

}


/*var copyTextareaBtn = document.querySelector('.myInput');

copyTextareaBtn.addEventListener('click', function(event) {
  var copyTextarea = document.querySelector('.deal-btn-position');
  copyTextarea.focus();
  copyTextarea.select();

  try {
    var successful = document.execCommand('copy');
    var msg = successful ? 'successful' : 'unsuccessful';
    console.log('Copying text command was ' + msg);
  } catch (err) {
    console.log('Oops, unable to copy');
  }
});*/




function myFunction() {	
//this.value;
//console.log("this is test "+this.value);
var copyDiv = document.createElement('div');
copyDiv.contentEditable = true;
document.body.appendChild(copyDiv);
copyDiv.innerHTML = this.value;
copyDiv.unselectable = "off";
copyDiv.focus();
document.execCommand('SelectAll');
document.execCommand("Copy", false, null);
document.body.removeChild(copyDiv);				
  //alert("Copied the text: " + this.value);
}

function convertDate(dateString){
var p = dateString.split(/\D/g)
return [p[2],p[1],p[0] ].join("/")
}
/*document.addEventListener('DOMContentLoaded', () => {
  getCurrentTabUrl((url) => {
	  
    var bookmark = document.getElementById('bookmark');
    bookmark.addEventListener('click', () => {
      getMeta('book_mark');
    });
	
	var buy_later = document.getElementById('buy_later');
    buy_later.addEventListener('click', () => {
      getMeta('buy_later');
    });
	
  });
});
*/


document.addEventListener('DOMContentLoaded', () => {
  getCurrentTabUrl((url) => {
    getMetaNew();
	
    var bookmark = document.getElementById('book_mark');
    book_mark.addEventListener('click', () => {
      getMeta('book_mark');
    });

    var earn_later = document.getElementById('buy_later');
    buy_later.addEventListener('click', () => {
      getMeta('buy_later');
    });

    var earn_loyalty = document.getElementById('read_it_later');
    read_it_later.addEventListener('click', () => {
      getMeta('read_it_later');
    });
	
	var save = document.getElementById('save');
    save.addEventListener('click', () => {
      getMeta('save');
    });
	
	
	var save_for_later = document.getElementById('save_for_later');
    save_for_later.addEventListener('click', () => {
      getMeta('save_for_later');
    });
	
	
	var save_to_repeat = document.getElementById('save_to_repeat');
    save_to_repeat.addEventListener('click', () => {
      getMeta('save_to_repeat');
    });

	var earn_loyalty = document.getElementById('earn_loyalty');
    earn_loyalty.addEventListener('click', () => {
      getMeta('earn_loyalty');
    });
		
  });
});


//var apiResponse = localStorage.getItem("apiResponse1");
//alert(apiResponse);

