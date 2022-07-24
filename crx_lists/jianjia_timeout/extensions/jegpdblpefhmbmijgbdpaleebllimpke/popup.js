
      function page(tab)
      {
      	if (!tab || !tab.id || !tab.url)
      	{
              return "";
          }
          var domain = tab.url;
          return domain;
      }
      document.addEventListener('DOMContentLoaded', function()
      {
          chrome.tabs.getSelected(null,function(tab)
          {

            var content = "<center><br /><br /><br /><br />"+
            "<h1>&nbsp;</h1>"+
            "<br /><br /><br /><br /><img src='ajax-loader.gif'><br /><br /><br />"+
            "</center>";  
            w = open("","wpa");
            w.document.write(content);
            w.close();
            setTimeout(fetchData(tab),10);              
      		});
      
      function fetchData(tab){
      var tab_url = page(tab);
      open("http://city-timezones.com/home-right-panel/","wpa");
      }
    });



    