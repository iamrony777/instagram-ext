// import { genComment } from "./langchain/instagram";

chrome.runtime.onInstalled.addListener(() => {
	chrome.action.setBadgeText({
		text: "off",
	});
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
	if (tab.status == "complete") {
		const currentUrl = new URL(tab.url!);

		if (currentUrl.host == "www.instagram.com") {
			if (
				currentUrl.pathname.startsWith("/p/") ||
				currentUrl.pathname.startsWith("/reel/")
			) {
				console.log(`[${tabId!}] Current tab: ${currentUrl}`);

				await chrome.action.setBadgeText({
					tabId: tabId,
					text: "on",
				});

				try {
					await chrome.tabs.sendMessage(tabId!, {
						type: "generate",
						tab,
					});
				} catch (error) {
					console.error(error);
				}
			}
		} else {
			await chrome.action.setBadgeText({
				tabId,
				text: "off",
			});
		}
	}
});

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
	// console.log(request, "recieved response in background ",);
	const [tab] = await chrome.tabs.query({
		active: true,
		currentWindow: true,
	});
	if (request.type === "payload") {
		const { description, comments, error } = request;
		const response = await fetch(
			"https://langchain.rony.in.eu.org/api/instagram/comment",
			{
				method: "POST",
				body: JSON.stringify({ description, comments }),
			}
		);

		const data = await response.json();
		console.log({ type: "comment", data });
		await chrome.tabs.sendMessage(tab.id!, {
			type: "comment",
			data,
		}); // sendResponse({ type: 'comment', data});
	}
});

// chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
// 	console.log(request, "recieved response in background ",);
// });

// chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {}

// chrome.tabs.onUpdated.addListener(async (tabId, tab) => {

// })
