import sys
import os
from src.core.logger import loggers
from src.core.helpers import generate_extension_files
import json

dispatchable_events = [
    "window.postMessage",
    "chrome.runtime.sendMessage",
    "window.dispathEvent",
    "document.dispathEvent",
    "element.dispathEvent"
]

attack_entries = [
    "window.addEventListener",
    "chrome.runtime.onMessageExternal.addListener"
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
    "chrome.downloads.setShelfEnabled",
    "chrome.downloads.acceptDanger",
    "chrome.downloads.setShelfEnabled",
    "XMLHttpRequest",
    "eval"
]

def crx_src_sink_filter(extension_dir):
    loggers.crx_src_sink_logger.info('==========='+extension_dir+'===========')
    generated_extension_dir = generate_extension_files(extension_dir, header=False)
    content = ''
    for file in os.listdir(generated_extension_dir):
        # print(file)
        file = os.path.join(generated_extension_dir, file)
        with open(file) as f:
            content+=f.read()

    attack = False
    exfiltration_APIs = False
    execution_APIs = False
    global suspicous_list

    loggers.crx_src_sink_logger.info('$attack_entries$')
    for item in attack_entries:
        if item in content:
            if not attack:
                attack = True
            loggers.crx_src_sink_logger.info(item)

    loggers.crx_src_sink_logger.info('$chrome_data_exfiltration_APIs$')
    for item in chrome_data_exfiltration_APIs:
        if item in content:
            if not exfiltration_APIs:
                exfiltration_APIs = True
            loggers.crx_src_sink_logger.info(item)

    loggers.crx_src_sink_logger.info('$chrome_API_execution_APIs$')
    for item in chrome_API_execution_APIs:
        if item in content:
            if not execution_APIs:
                execution_APIs = True
            loggers.crx_src_sink_logger.info(item)

    if attack and exfiltration_APIs and execution_APIs:
        suspicous_list.append(extension_dir)
        with open('crx_lists/suspicous_list.list', "w") as f:
            json.dump(suspicous_list, f)

suspicous_list = []
list_file = sys.argv[1]
with open(list_file) as f:
    content = f.read()
    files = content.split('\n')
with open('crx_src_sink.log') as f:
    filtered = f.read()
for file in files:
    if file in filtered:
        continue
    crx_src_sink_filter(file)
# content = open(extension_dir)





