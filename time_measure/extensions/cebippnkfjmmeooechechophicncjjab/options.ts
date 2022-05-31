import "./lib/WebExtensions";
import "./DomainBlock";

document.addEventListener('DOMContentLoaded', () => {
	new DomainBlockOptions();
	new LiveHttpOptions();
});

class DomainBlockOptions {
	private FormDomain: HTMLTextAreaElement;

	constructor() {
		this.FormDomain = <HTMLTextAreaElement>document.getElementById("domain");

		const ButtonSave = <HTMLButtonElement>document.getElementById("save");
		ButtonSave.addEventListener('click', () => { this.saveclick(); });

		const ButtonClear = <HTMLButtonElement>document.getElementById("clear");
		ButtonClear.addEventListener('click', () => { this.saveclick(); });

		browser.runtime.getBackgroundPage((backgroundWindow) => {
			if (!backgroundWindow) return;
			this.FormDomain.value = backgroundWindow.DomainBlock.getList().join("\n");
		});


	}

	public saveclick() {
		let domaintext = this.FormDomain.value;
		let domainlist = domaintext.split("\n");
		browser.runtime.getBackgroundPage((backgroundWindow) => {
			if (!backgroundWindow) return;
			backgroundWindow.DomainBlock.reset();
			backgroundWindow.DomainBlock.append(domainlist);
			backgroundWindow.DomainBlock.save();
			backgroundWindow.DomainBlock.enable();
		});
	}
}

class LiveHttpOptions {

	constructor() {
		const FormDomain = <HTMLTextAreaElement>document.getElementById("domain");
		browser.runtime.getBackgroundPage((backgroundWindow) => {
			if (!backgroundWindow) return;
			backgroundWindow.LiveHttpLogger.addTarget(window);
			backgroundWindow.LiveHttpLogger.enable();
		});
		window.addEventListener("beforeunload", () => {
			browser.runtime.getBackgroundPage((backgroundWindow) => {
				if (!backgroundWindow) return;
				backgroundWindow.LiveHttpLogger.removeTarget(window);
			});
		});
		const LiveList = <HTMLDivElement>document.getElementById("live");
		window.addEventListener("message", (ev: MessageEvent) => {
			let log: string = ev.data;
			const div = document.createElement("div");
			div.classList.add("url");
			const add = document.createElement("button");
			add.appendChild(document.createTextNode("Add"));
			add.addEventListener("click", () => {
				const url = new URL(log);
				FormDomain.value = url.hostname + "\n" + FormDomain.value;
			}, false);
			div.appendChild(add);
			div.appendChild(document.createTextNode(log));
			LiveList.appendChild(div);
		}, false);

		const Clear = <HTMLButtonElement>document.getElementById("clear");
		Clear.addEventListener("click", () => {
			while (LiveList.firstChild) LiveList.removeChild(LiveList.firstChild);
		}, false);
	}

}