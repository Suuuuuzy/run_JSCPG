// original file:/media/data2/jianjia/extension_data/unzipped_extensions/imfkmjlnknagabfaknpdhcnfmhbnnlje/background.js

let theme_id = "incubus";
let newTabURL = "https://home.newtabgallery.com/" + theme_id;
let startPageURL = "https://newtabgallery.com/welcome/?theme_id=" + theme_id;

chrome.runtime.setUninstallURL("https://newtabgallery.com/uninstall/?theme_id" + theme_id);

chrome.runtime.onInstalled.addListener(function(details){
  if (details.reason == "install") {
    chrome.tabs.create({"url": newTabURL});
    chrome.tabs.create({"url": startPageURL});
  }
});

chrome.browserAction.onClicked.addListener(function() {
  chrome.tabs.create({url: chrome.extension.getURL("newtab.html")});
});

