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


dispatchable_events = [
    "window.postMessage",
    "chrome.runtime.sendMessage",
    "window.dispathEvent",
    "document.dispathEvent",
    "element.dispathEvent"
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

crx_source = [
        # chrome extension built-in get sensitive data APIs
        'chrome_topSites_get_source',
        'chrome_cookies_get_source',
        'chrome_cookies_getAll_source',
        'chrome_cookies_getAllCookieStores_source',
        # 'chrome_cookies_onChanged_addListener_source'
        'chrome_storage_sync_get_source',
        'chrome_storage_local_get_source'
        'chrome_history_search_source',
        'chrome_history_getVisits_source',
        'chrome_downloads_search_source',
        'chrome_downloads_getFileIcon_source'
        # jQuery source
        'jQuery_get_source',
        'jQuery_post_source'
]
