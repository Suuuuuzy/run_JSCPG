function refreshMenu() {
  chrome.contextMenus.removeAll();

  var imageMenu = chrome.contextMenus.create({
    "title": "Wall It!", 
    "contexts": ["image"], "onclick": function (info, tab) {
      var pinUrl = "https://www.shopthewall.com/wallit/search";
      pinUrl += "?media=" + escape(info.srcUrl) + "&url=" + escape(tab.url) + "&alt=alt&title=foo"; //+ escape(tab.title);
      pinUrl += "&is_video=false&";
      window.open(pinUrl,"pin"+(new Date).getTime(),"status=no,resizable=no,scrollbars=yes,personalbar=no,directories=no,location=no,toolbar=no,menubar=no,width=635,height=290,left=0,top=0");
    }
  });
}

refreshMenu();