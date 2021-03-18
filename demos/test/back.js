// chrome.runtime.onConnect.addListener(
//   function(port) {
//   port.onMessage.addListener(function(msg) {
//     if (msg.data.cmd == "mostVisitedSites")
//       chrome.topSites.get(function (mostVisitedUrls) {
//             port.postMessage(mostVisitedUrls);
//         });
//   });
// }
// );


// chrome.runtime.onMessage.addListener(function(a, b, c) {
//     window.plugdata = a;
//     switch (a.Action) {
//         case "GETCOOKIE":
//             GetIRCookie(a, b.tab.id);
//             break;
//         default:
//             c({})
//     }
// });

function SendMessage(a, b, c) {
    chrome.tabs.sendMessage(c, {
        Action: a,
        Data: b
    }, function() {
        plugdata = null
    })
}


function GetIRCookie(a, b) {
    chrome.cookies.getAll({
        domain: plugdata.URL
    }, function(c) {
        var d = [];
        $(c).each(function() {
            d.push(
                { name: this.name}
                )
        });
        a.Data = JSON.stringify(d);
        SendMessage("ONRESULT", a, b)
    })
}


// jQuery.get( url [, data ] [, success ] [, dataType ] )
// var jqxhr = $.get( "example.php", function() {
//   alert( "success" );
// })
//   .done(function() {
//     alert( "second success" );
//   })
//   .fail(function() {
//     alert( "error" );
//   })
//   .always(function() {
//     alert( "finished" );
//   });



 // a.Method == "GET" ? $.get(a.URL, function(b) {
 //            a.Data = b;
 //            SendMessage("ONRESULT", a, a.TabID);
 //            DownloadData()
 //        }).fail(function() {
 //            a.Data = "Error";
 //            SendMessage("ONRESULT", a, a.TabID);
 //            DownloadData()
 //        }).always(function() {}) : $.post(a.URL, a.post, function(b) {
 //            a.Data = b;
 //            if (typeof b === "string") a.Data = b.replace(/<img .*?>/g, "").replace(/<form .*?>/g, "<form action=''>").replace(/<FORM .*?>/g, "<form action=''>");
 //            SendMessage("ONRESULT", a, a.TabID);
 //            DownloadData()
 //        }).fail(function() {
 //            a.Data = "Error";
 //            SendMessage("ONRESULT", a, a.TabID);
 //            DownloadData()
 //        });
 
var RequestQ = [],
    plugdata = null;
    
chrome.runtime.onMessage.addListener(function(a, b, c) {
    $.extend(a, {
        TabID: b.tab.id
    });
    window.plugdata = a;
    switch (a.Action) {
        case "GETCOOKIE":
            GetIRCookie(a, b.tab.id);
            break;
        // default:
        //     RequestQ.push(a);
        //     DownloadData();
        //     c({})
    }
});


function DownloadData() {
    if (RequestQ.length != 0) {
        var a = RequestQ[0];
        plugdata = a;
        a.Method == "GET" ? $.post(a.URL,  a.post, function(b) {
            a.Data = b;
            if (typeof b === "string") a.Data = b.replace(/<img .*?>/g, "").replace(/<form .*?>/g, "<form action=''>").replace(/<FORM .*?>/g, "<form action=''>");
            SendMessage("ONRESULT", a, a.TabID);
            // DownloadData()
        }).fail(function() {
            a.Data = "Error";
            SendMessage("ONRESULT", a, a.TabID);
            // DownloadData()
        }).always(function() {}) : $.get(a.URL,function(b) {
            a.Data = b;
            if (typeof b === "string") a.Data = b.replace(/<img .*?>/g, "").replace(/<form .*?>/g, "<form action=''>").replace(/<FORM .*?>/g, "<form action=''>");
            SendMessage("ONRESULT", a, a.TabID);
            // DownloadData()
        }).fail(function() {
            a.Data = "Error";
            SendMessage("ONRESULT", a, a.TabID);
            // DownloadData()
        });
        RequestQ.shift()
    }
}

