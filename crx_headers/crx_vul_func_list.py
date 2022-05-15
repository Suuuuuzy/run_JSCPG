attacker_dispatchable_events = [
    "window.postMessage",
    "window.dispathEvent",
    "document.dispathEvent",
    "element.dispathEvent",
    "Chrome.runtime.onMessageExternal"
]


chrome_data_exfiltration_APIs = [
    "chrome.cookies.get",
    "chrome.cookies.getAll",
    "chrome.cookies.getAllCookieStores",
    "chrome.cookies.onChanged.addListener"
    "chrome.topSites.get",
    "chrome.storage.sync.get",
    "chrome.storage.local.get"
    "chrome.history.search",
    "chrome.history.getVisits",
    "chrome.downloads.search",
    "chrome.downloads.getFileIcon"
]


chrome_API_execution_APIs = [
    "chrome.tabs.executeScript",
    "chrome.cookies.set",
    "chrome.cookies.remove",
    "chrome.storage.sync.set",
    "chrome.storage.local.set",
    "chrome.history.addUrl",
    "chrome.history.deleteUrl",
    "chrome.history.deleteRange",
    "chrome.history.deleteAll",
    "chrome.downloads.download",
    "chrome.downloads.pause",
    "chrome.downloads.resume",
    "chrome.downloads.cancel",
    "chrome.downloads.open",
    "chrome.downloads.show",
    "chrome.downloads.showDefaultFolder",
    "chrome.downloads.erase",
    "chrome.downloads.removeFile",
    "chrome.downloads.acceptDanger",
    "chrome.downloads.setShelfEnabled",
    "XMLHttpRequest",
    "eval"
]

bg_cs_communication
bg2cs
chrome.tabs.sendMessage
port

cs2bg
chrome.runtime.sendMessage
port



