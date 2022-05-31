let theme_id = "incubus";
let newTabURL = "https://home.newtabgallery.com/" + theme_id;

chrome.tabs.query({currentWindow: true, active: true}, function(tabs) {
  chrome.tabs.create({url: newTabURL});
  chrome.tabs.remove(tabs[0].id);
});
