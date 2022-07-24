var extensionSettings;
var emoteListCache;
var host;
var nodeTestRegEx;
var blacklistedTags;
var emoteList;
var lastTitle;
var addedLinks;
var mutationObserver;
var twitchChannel;
var waiting = 0;
var channelIDs;

function initialize(changes = null, areaName = "sync") {
	if (areaName == "sync") {
		if (mutationObserver) {
			mutationObserver.disconnect();
		}
		chrome.storage.local.get({
			emoteListCache: {}
		}, function(settings) {
			emoteListCache = settings.emoteListCache;
		});
		chrome.storage.sync.get({
			enableTwitchEmotes: true,
			subscriberEmotesChannels: [],
			enableOnTwitch: false,
			enableBTTVEmotes: true,
			BTTVChannels: [],
			enableFFZEmotes: true,
			FFZChannels: [],
			enableEmoteBlacklist: false,
			removeBlacklistedEmotes: false,
			emoteBlacklist: [],
			hostnameListType: "blacklist",
			hostnameList: []
		}, function(settings) {
			extensionSettings = settings;
			start();
		});
	}
}
$(document).ready(initialize);
chrome.storage.onChanged.addListener(initialize);

function start() {
	host = window.location.hostname;
	lastTitle = document.title;
	addedLinks = [];
	emoteList = {};
	urlList = [];
	channelIDs = {};
	if (extensionSettings.hostnameList.indexOf(host) == -1 && extensionSettings.hostnameList.indexOf(host.replace("www.", "")) == -1) {
		if (extensionSettings.hostnameListType == "whitelist") {
			return;
		}
	} else {
		if (extensionSettings.hostnameListType == "blacklist") {
			return;
		}
	}
	nodeTestRegEx = /\w+?/gi;
	blacklistedTags = ["TITLE", "STYLE", "SCRIPT", "NOSCRIPT", "LINK", "TEMPLATE", "INPUT", "IFRAME"];
	if (extensionSettings.enableTwitchEmotes) {
		if (((host == "www.twitch.tv" || host == "clips.twitch.tv") && extensionSettings.enableOnTwitch) || (host != "www.twitch.tv" && host != "clips.twitch.tv")) {
			urlList.push(["https://api.twitchemotes.com/api/v4/channels/0", 1, "Twitch Global Emote"]);
			$.each(extensionSettings.subscriberEmotesChannels, function(index, value) {
				urlList.push([value, 5, "Subscriber Emote - " + value]);
			});
		}
	}
	if (extensionSettings.enableBTTVEmotes) {
		urlList.push(["https://api.betterttv.net/3/cached/emotes/global", 3, "BetterTTV Global Emote"]);
		$.each(extensionSettings.BTTVChannels, function(index, value) {
			urlList.push([value, 6, "BetterTTV Emote - " + value]);
		});
	}
	if (extensionSettings.enableFFZEmotes) {
		urlList.push(["https://api.frankerfacez.com/v1/set/global", 4, "FrankerFaceZ Global Emote"]);
		$.each(extensionSettings.FFZChannels, function(index, value) {
			urlList.push(["https://api.frankerfacez.com/v1/room/" + value, 4, "FrankerFaceZ Emote - " + value]);
		});
	}
	twitchChannel = getCurrentTwitchChannel();
	if (twitchChannel) {
		urlList = urlList.concat(addChannelEmotes(twitchChannel, true));
	}
	if (host == "www.twitch.tv") {
		var titleChangeObserver = new MutationObserver(function(mutations) {
			if (lastTitle != mutations[0].target.innerHTML) {
				lastTitle = mutations[0].target.innerHTML;
				twitchChannel = getCurrentTwitchChannel();
				if (twitchChannel) {
					addChannelEmotes(twitchChannel);
				}
			}
		});
		titleChangeObserver.observe(document.querySelector("title"), {attributes: false, childList: true, characterData: true, subtree: true});
	}
	var currentTimestamp = Math.floor(Date.now() / 1000);
	var deletedFromCache = 0;
	for (var url in emoteListCache) {
		if (emoteListCache[url]["expiry"] - currentTimestamp <= 0) {
			delete emoteListCache[url];
			deletedFromCache++;
		}
	}
	if (deletedFromCache > 0) {
		chrome.storage.local.set({
			emoteListCache: emoteListCache
		});
	}
	waiting += urlList.length;
	$.each(urlList, function(index, value) {
		addEmotes(value[0], value[1], value[2]);
	});
	mutationObserver = new MutationObserver(function(mutations) {
		mutations.forEach(function(mutation) {
			for (var i = 0; i < mutation.addedNodes.length; i++) {
				var currentNode = $(mutation.addedNodes[i]);
				if (host == "clips.twitch.tv") {
					try {
						twitchChannel = getCurrentTwitchChannel();
						if (twitchChannel) {
							addChannelEmotes(twitchChannel);
						}
					} catch { }
				}
				if (extensionSettings.enableEmoteBlacklist && extensionSettings.removeBlacklistedEmotes) {
					if (currentNode.hasClass("chat-line__message") && extensionSettings.emoteBlacklist.length > 0) {
						var emoteBlacklist = [];
						$.each(extensionSettings.emoteBlacklist, function(index, value) {
							var escapedValue = escapeRegEx(value);
							if (escapedValue) {
								emoteBlacklist.push(escapedValue);
							}
						});
						var blacklistRegEx = new RegExp(emoteBlacklist.join("|"), "g");
						currentNode.find(".chat-line__message--emote").each(function() {
							if ($(this).attr("alt").match(blacklistRegEx)) {
								currentNode.hide();
								return;
							}
						});
						currentNode.find("span[data-a-target='chat-message-text']").each(function() {
							if ($(this).html().match(blacklistRegEx)) {
								currentNode.hide();
								return;
							}
						});
					}
				}
				currentNode.find("*").contents().filter(function() {
					return (this.nodeType == 3 && this.textContent.match(nodeTestRegEx));
				}).each(function() {
					replacePhrasesWithEmotes(this);
				});
			}
		});
	});
	mutationObserver.observe(document.body, {attributes: false, childList: true, characterData: true, subtree: true});
}

function escapeRegEx(string) {
	return string.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

function addSubscriberEmotesForChannel(channelName, extra, direct, tries) {
	if (!(channelName in channelIDs)) {
		channelIDs[channelName] = 0;
		$.ajax({
			url: "https://cors-anywhere.herokuapp.com/https://twitchemotes.com/search/channel?query=" + channelName,
			type: "GET",
			timeout: 15000,
			headers: {"X-Requested-With": "null"},
			success: function(response, textStatus, request) {
				channelIDs[channelName] = request.getResponseHeader("x-final-url").split("/")[4];
				addEmotes("https://api.twitchemotes.com/api/v4/channels/" + channelIDs[channelName], 1, extra, direct, tries);
			}
		});
	} else {
	addEmotes("https://api.twitchemotes.com/api/v4/channels/" + channelIDs[channelName], 1, extra, direct, tries);
	}
}

function addBTTVEmotesForChannel(channelName, extra, direct, tries) {
	if (!(channelName in channelIDs)) {
		channelIDs[channelName] = 0;
		$.ajax({
			url: "https://cors-anywhere.herokuapp.com/https://twitchemotes.com/search/channel?query=" + channelName,
			type: "GET",
			timeout: 15000,
			headers: {"X-Requested-With": "null"},
			success: function(response, textStatus, request) {
				channelIDs[channelName] = request.getResponseHeader("x-final-url").split("/")[4];
				addEmotes("https://api.betterttv.net/3/cached/users/twitch/" + channelIDs[channelName], 2, extra, direct, tries);
			}
		});
	} else {
		addEmotes("https://api.betterttv.net/3/cached/users/twitch/" + channelIDs[channelName], 2, extra, direct, tries);
	}
}

function addEmotes(url, parseMode, extra, direct = false, tries = 3, ignoreAdded = true) {
	if (parseMode == 6) {
		addBTTVEmotesForChannel(url, extra, direct, tries);
		return;
	}
	if (parseMode == 5) {
		addSubscriberEmotesForChannel(url, extra, direct, tries);
		return;
	}
	if (ignoreAdded) {
		if (addedLinks.indexOf(url) == -1) {
			addedLinks.push(url);
		} else {
			waiting--;
			return;
		}
	}
	var headers = {};
	var newURL = url;
	if (parseMode == 1 || parseMode == 2 || parseMode == 3) {
		headers = {"X-Requested-With": "null"};
		newURL = "https://cors-anywhere.herokuapp.com/" + url;
	}
	var currentTimestamp = Math.floor(Date.now() / 1000);
	if (url in emoteListCache) {
		if (emoteListCache[url]["expiry"] - currentTimestamp > 0) {
			processEmotes(emoteListCache[url]["emoteList"], direct);
			return;
		}
	}
	$.ajax({
		url: newURL,
		type: "GET",
		timeout: 15000,
		headers: headers,
		success: function(response) {
			var emoteList = {};
			switch (parseMode) {
				case 1:
					$.each(response["emotes"], function(index, data) {
						emoteList[data["code"]] = ["https://static-cdn.jtvnw.net/emoticons/v1/" + data["id"] + "/1.0", extra];
					});
					break;
				case 2:
					$.each(response["sharedEmotes"], function(index, data) {
						emoteList[data["code"]] = ["https://cdn.betterttv.net/emote/" + data["id"] + "/1x", extra];
					});
					break;
				case 3:
					$.each(response, function(index, data) {
						emoteList[data["code"]] = ["https://cdn.betterttv.net/emote/" + data["id"] + "/1x", extra];
					});
					break;
				case 4:
					$.each(response["sets"], function(setID, setData) {
						$.each(setData["emoticons"], function(index, data) {
							emoteList[data["name"]] = ["https://cdn.frankerfacez.com/emoticon/" + data["id"] + "/1", extra];
						});
					});
					break;
				default:
					break;
			}
			emoteListCache[url] = {expiry: currentTimestamp + 3600, emoteList: emoteList};
			chrome.storage.local.set({
				emoteListCache: emoteListCache
			});
			processEmotes(emoteList, direct);
		},
		error: function() {
			if (--tries > 0) {
				addEmotes(url, parseMode, extra, direct, tries, false);
			} else {
				if (--waiting == 0) {
					startReplaceLoop();
				}
			}
		}
	});
}

function processEmotes(emotes, direct) {
	for (var emoteName in emotes) {
		if (extensionSettings.enableEmoteBlacklist) {
			var index = extensionSettings.emoteBlacklist.indexOf(emoteName);
			if (index > -1) {
				continue;
			}
		}
		var emoteRegex = "(?<=\\s|^)" + escapeRegEx(emoteName) + "(?=\\s|$)";
		if (emoteName in emoteList) {
			emoteList[emoteName][0] = emoteList[emoteName][0].replace("\" alt=", "&#10;" + emotes[emoteName][1] + "\" alt=")
		} else {
			emoteList[emoteName] = ["<img style=\"max-height: 32px;\" title=\"" + emoteName + "&#10;" + emotes[emoteName][1] + "\" alt=\"" + emoteName + "\" src=\"" + emotes[emoteName][0] + "\"\\>", new RegExp(emoteRegex, "g")];
		}
	}
	if (direct) {
		startReplaceLoop();
	} else if (--waiting == 0) {
		startReplaceLoop();
	}
}

function getCurrentTwitchChannel() {
	var twitchChannel = "";
	if (host == "www.twitch.tv") {
		var urlSplit = window.location.href.split("/")
		if (urlSplit.length > 4 && (urlSplit[4].startsWith("videos") || urlSplit[4].startsWith("clip") || urlSplit[4].startsWith("events") || urlSplit[4].startsWith("followers") || urlSplit[4].startsWith("following"))) {
			twitchChannel = urlSplit[3];
		} else if (urlSplit.length > 3) {
			if (urlSplit[3] == "popout") {
				twitchChannel = urlSplit[4];
			} else if (urlSplit[3] == "videos") {
				if (document.documentElement.innerHTML.indexOf("<title>Twitch</title>") == -1) {
					try {
						twitchChannel = new RegExp("<title>(.*?) - ", "g").exec(document.documentElement.innerHTML)[1].toLowerCase();
					} catch { }
				}
			} else {
				if (document.documentElement.innerHTML.indexOf("<title>Twitch</title>") == -1) {
					twitchChannel = urlSplit[3];
				}
			}
		}
	} else if (host == "clips.twitch.tv") {
		try {
			twitchChannel = new RegExp(escapeRegEx("<span class=\"tw-font-size-4\">") + "(.*?)" + escapeRegEx("</span>"), "g").exec(document.documentElement.innerHTML)[1].toLowerCase();
		} catch { }
	}
	twitchChannel = twitchChannel.trim();
	if (twitchChannel && twitchChannel.indexOf(" ") == -1) {
		return twitchChannel;
	}
}

function addChannelEmotes(channel, returns = false) {
	urlList = [];
	if (extensionSettings.enableTwitchEmotes) {
		if (((host == "www.twitch.tv" || host == "clips.twitch.tv") && extensionSettings.enableOnTwitch) || (host != "www.twitch.tv" && host != "clips.twitch.tv")) {
			if (extensionSettings.subscriberEmotesChannels.indexOf(channel) == -1) {
				urlList.push([channel, 5, "Subscriber Emote - " + channel]);
			}
		}
	}
	if (extensionSettings.enableBTTVEmotes) {
		if (extensionSettings.BTTVChannels.indexOf(channel) == -1) {
			urlList.push([channel, 6, "BetterTTV Emote - " + channel]);
		}
	}
	if (extensionSettings.enableFFZEmotes) {
		if (extensionSettings.FFZChannels.indexOf(channel) == -1) {
			urlList.push(["https://api.frankerfacez.com/v1/room/" + channel, 4, "FrankerFaceZ Emote - " + channel]);
		}
	}
	if (returns) {
		return urlList;
	} else {
		waiting += urlList.length;
		$.each(urlList, function(index, value) {
			addEmotes(value[0], value[1], value[2]);
		});
	}
}

function startReplaceLoop() {
	$("body *").filter(function() {
		return (blacklistedTags.indexOf($(this).prop("tagName")) == -1);
	}).each(function() {
		$(this).contents().filter(function() {
			return (this.nodeType == 3 && this.textContent.match(nodeTestRegEx));
		}).each(function() {
			replacePhrasesWithEmotes(this);
		});
	});
}

function replacePhrasesWithEmotes(element) {
	var elementContent = element.textContent;
	for (var emoteName in emoteList) {
		elementContent = elementContent.replace(emoteList[emoteName][1], emoteList[emoteName][0]);
	}
	if (element.textContent != elementContent) {
		$(element).replaceWith(elementContent);
		var scrollElements = [];
		if (host == "www.twitch.tv") {
			if (!$(".chat-scroll-footer__placeholder").find(".tw-overflow-hidden").is(":visible")) {
				scrollElements.push($(".chat-list").find(".simplebar-scroll-content"));
			}
			if (!$(".video-chat__sync-button").is(":visible")) {
				scrollElements.push($(".video-chat__message-list-wrapper"));
			}
		} else if (host == "clips.twitch.tv") {
			if (!$(".tw-core-button--small").is(":visible")) {
				scrollElements.push($(".clips-chat").find(".simplebar-scroll-content"));
			}
		}
		for (var i = 0; i < scrollElements.length; i++) {
			if (scrollElements[i].length > 0) {
				$(scrollElements[i]).scrollTop(scrollElements[i][0].scrollHeight + 100);
			}
		}
	}
}