chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
	if (request.type === "generate") {
		generateComment();
	} else if (request.type === "comment") {
		const { data } = request;
		console.log({ comment: data.response }, "adding comment");
		// addComment(data.response); // add comment
	}
	// sendResponse({ ...data, ...request });
});

// const addComment = (comment: string) => {
// 	const textarea = document.querySelector('textarea[aria-label*="comment"]');
// 	if (textarea) textarea.textContent = comment;
// };
const generateComment = () => {
	const genBtnExists = document.getElementById("gen-button") !== null;

	if (!genBtnExists) {

		const genBtn = document.createElement("img");
		genBtn.id = "gen-button";
		genBtn.title = "click to generate";
		genBtn.src = chrome.runtime.getURL("images/button/generate.png");
		genBtn.style.backgroundColor = "white"
		genBtn.height = 24;
		genBtn.width = 24;
		genBtn.addEventListener("click", async () => {
			console.log("generating response")
			const description = document
				.querySelector('meta[property="og:title"]')
				?.getAttribute("content");

			const comments: Array<string> = [];

			const allComments = Array.from(
				document.querySelectorAll(
					'div[class="x78zum5 xdt5ytf x1iyjqo2"] > div span[dir][style]:not(:has(> *))'
				)
			).filter((el) => !el.textContent!.startsWith("View all"));

			// const allAuthors = document.querySelectorAll(
			// 	'div[class="x78zum5 xdt5ytf x1iyjqo2"] > div span[dir]:not([style]):not(:has(> *))'
			// );

			for (let i = 0; i < allComments.length; i++) {
				comments.push(allComments[i]?.textContent || "");
			}

			// console.log({ description, comments, error: undefined });
			await chrome.runtime.sendMessage({
				type: "payload",
				description,
				comments,
				error: undefined,
			});
		});

		const textarea = document.querySelector('textarea[aria-label*="comment"]');
		if (textarea) {
			const parentCommentContainer = textarea.parentElement;
			if (parentCommentContainer) {
				parentCommentContainer.appendChild(genBtn);
			}
		}
	}

	// console.log({ description: "", comments: [], error: "Something went wrong" });
};
