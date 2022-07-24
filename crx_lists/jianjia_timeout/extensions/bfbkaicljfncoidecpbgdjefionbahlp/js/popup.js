// note: this is a contained, NEW page that reloads every time the popup opens

// document.addEventListener(
//   "DOMContentLoaded",
//   function() {
//     document.querySelector("button").addEventListener("click", onclick, false);
//     function onclick() {
//       let msg = {
//         text: "hello"
//       };
//       // query for current active tab open
//       chrome.tabs.query({ currentWindow: true, active: true }, function(tabs) {
//         chrome.tabs.sendMessage(tabs[0].id, msg);
//       });
//     }
//   },
//   false
// );

// alert("popup javascript here");
