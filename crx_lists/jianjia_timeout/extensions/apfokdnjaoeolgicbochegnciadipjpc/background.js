'use strict'

console.log("Background script is running!");

chrome.browserAction.onClicked.addListener(buttonClick);

function buttonClick(tab){
    // Every time someone clicks this extensions logo, it sends a message to the content script
    console.log("Clicking extension!");



    chrome.tabs.sendMessage(tab.id, "click");
}













