

    
	$("body").append("<style> .product__title--3V3PJt{ cursor:pointer; color:#57ad68; font-weight:bold !important; } </style>");

 
    function myfun(){
	   	var sku = $("dt:contains('SKU(s)')").next().text();
		    sku = sku.split(",")[0].trim();
			window.open("http://struggleville.net/?s="+sku);
	 }
	
	
	$(document).on("click",".product__title--3V3PJt",function(){
	     myfun();
	})		
	