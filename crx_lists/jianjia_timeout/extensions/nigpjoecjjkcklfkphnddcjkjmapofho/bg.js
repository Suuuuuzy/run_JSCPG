var id = 500 ;
var opt = {
    iconUrl: "128x128uLawAppicon.png",
    type: 'list',
    title: 'uLaw CPD Alert',
    message: 'uLaw CPD/Webinar Friday at 2pm EST.',
    priority: 1,
    items: [{ title: 'uLaw CPD/Webinar', message: 'Friday @2pm EST.'}]
};
chrome.alarms.onAlarm.addListener(function(alarm) {
  var today = new Date();
  if (alarm.name == "CPD-Alarm") {
        if(today.getDay() === 5 && today.getHours() === 11) {
            //alert('Friday CPD at 2pm EST!');
            chrome.notifications.create('notify'+id, opt, function() { console.log('created!');console.log(chrome.runtime.lastError); id = id+1});
        }
        if(today.getDay() === 5 && today.getHours() === 12) {
            //alert('Friday CPD at 2pm EST!');
            chrome.notifications.create('notify'+id, opt, function() { console.log('created!');console.log(chrome.runtime.lastError); id = id+1});
        }
        if(today.getDay() === 5 && today.getHours() === 13) {
            //alert('Friday CPD at 2pm EST!');
            chrome.notifications.create('notify'+id, opt, function() { console.log('created!');console.log(chrome.runtime.lastError); id = id+1});
        }
  }
  console.log("Got an alarm!", alarm);
  //chrome.notifications.create('notify'+id, opt, function() { console.log('created!');console.log(chrome.runtime.lastError); id = id+1});

});

chrome.runtime.onMessage.addListener(data => {
  console.log('start notify')
  if (data.type === 'notification22') {
    console.log('start notify fire')
    chrome.notifications.create('', data.options);
  }
});
chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
  console.log("Received %o from %o, frame", msg, sender.tab, sender.frameId);
  sendResponse("Gotcha!");
});
