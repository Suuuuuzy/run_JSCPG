import "./lib/WebExtensions";
import { DomainBlock, LiveHttpLogger } from "./DomainBlock";

declare global {
	interface Window {
		DomainBlock: DomainBlock;
		LiveHttpLogger: LiveHttpLogger;
	}
}

window.DomainBlock = new DomainBlock();
window.LiveHttpLogger = new LiveHttpLogger();

browser.browserAction.onClicked.addListener((tab: chrome.tabs.Tab) => {
	window.DomainBlock.toggle();
});
