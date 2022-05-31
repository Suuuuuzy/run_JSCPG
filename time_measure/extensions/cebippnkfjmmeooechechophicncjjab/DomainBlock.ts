import "./lib/WebExtensions";

export class DomainBlock {
	public constructor() {
		this.list = [];
		this.load(() => {
			this.enable();
		});
	}

	private lastClick: number = 0;
	public toggle() {
		if (this.isEnable()) {
			this.disable();
		} else {
			this.enable();
		}
		if (this.lastClick + 1000 > (new Date()).getTime()) {
			browser.tabs.create({
				url: browser.runtime.getURL("options.html")
			});
		}
		this.lastClick = (new Date()).getTime();
	}

	private list: string[];
	public getList(): string[] {
		return this.list.concat();
	}

	public reset() {
		this.list = [];
	}

	public append(domains: string[]) {
		let alllist: string[] = this.list.concat(domains);
		let newlist: string[] = [];
		for (let i = 0; i < alllist.length; i++) {
			if (alllist[i] === "") continue;
			let j = 0;
			for (j = 0; j < newlist.length; j++) {
				if (alllist[i] === newlist[j]) break;
			}
			if (j == newlist.length) newlist.push(alllist[i]);
		}
		this.list = newlist;
	}

	public remove(domains: string[]) {
		let newlist: string[] = [];
		for (let i = 0; i < this.list.length; i++) {
			let j = 0;
			for (j = 0; j < domains.length; j++) {
				if (this.list[i] === domains[j]) break;
			}
			if (j == domains.length) newlist.push(this.list[i]);
		}
		this.list = newlist;
	}

	public load(callback: Function) {
		browser.storage.local.get(["domain"],
			(config) => {
				let domainlist = [];
				if (typeof config["domain"] === "object" && typeof config["domain"].length === "number" && typeof config["domain"].join === "function") {
					domainlist = config["domain"];
				}
				this.list = domainlist;
				callback();
			}
		);
	}


	private callbackval = { cancel: true };
	private blockingFunc = (details: chrome.webRequest.WebRequestBodyDetails) => {
		return this.callbackval;
	};

	public isEnable(): boolean {
		return browser.webRequest.onBeforeRequest.hasListener(this.blockingFunc);
	}

	public disable() {
		if (this.isEnable()) {
			browser.webRequest.onBeforeRequest.removeListener(this.blockingFunc);
			browser.browserAction.setBadgeText({ text: "OFF" });
		}
	}

	public enable() {
		this.disable();

		let filter: chrome.webRequest.RequestFilter = {
			urls: ["http://demo.demo.demo.demo/"],
			// types: ["main_frame", "sub_frame", "stylesheet", "script", "image", "object", "xmlhttprequest", "xbl", "xslt", "ping", "beacon", "xml_dtd", "font", "media", "websocket", "csp_report", "imageset", "web_manifest", "other"]
		};

		for (let i = 0; i < this.list.length; i++) {
			var turl = this.list[i];
			if (turl.indexOf("/") < 0) {
				turl = turl + "/";
			}
			filter.urls.push("http://*." + turl + "*");
			filter.urls.push("https://*." + turl + "*");
		}

		browser.webRequest.onBeforeRequest.addListener(
			this.blockingFunc,
			filter,
			["blocking"]
		);
		browser.browserAction.setBadgeText({ text: "ON" });
	}

	public save() {
		browser.storage.local.set({ "domain": this.list });
	}
}

export class LiveHttpLogger {
	public constructor() {
		this.disable();
	}

	private liveLoggerTargetList: Window[] = [];
	public addTarget(target: Window) {
		this.removeTarget(target);
		this.liveLoggerTargetList.push(target);
	}
	public removeTarget(target: Window) {
		let wins: Window[] = [];
		for (const l of this.liveLoggerTargetList) {
			if (target != l) wins.push(l);
		}
		this.liveLoggerTargetList = wins;
		if (this.liveLoggerTargetList.length == 0) {
			this.disable();
		}
	}

	private liveLoggerFunc = (details: chrome.webRequest.WebRequestHeadersDetails) => {
		const copy = this.liveLoggerTargetList.concat();
		for (const target of copy) {
			try {
				target.postMessage(details.url, "*");
			} catch (e) {
				this.removeTarget(target);
			}
		}
		if (copy.length == 0) {
			this.disable();
		}
	};


	public isEnable(): boolean {
		return browser.webRequest.onSendHeaders.hasListener(this.liveLoggerFunc);
	}

	public disable() {
		if (this.isEnable()) {
			browser.webRequest.onBeforeRequest.removeListener(this.liveLoggerFunc);
		}
		browser.browserAction.setBadgeBackgroundColor({ color: "#0000FF" });
	}

	public enable() {
		if (!this.isEnable()) {
			browser.webRequest.onSendHeaders.addListener(
				this.liveLoggerFunc,
				{
					urls: ["<all_urls>"]
				},
				["requestHeaders"]
			);
		}
		browser.browserAction.setBadgeBackgroundColor({ color: "#AA0000" });
	}
}