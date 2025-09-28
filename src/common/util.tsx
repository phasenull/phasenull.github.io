// thanks chatgpt for writing this tokenizer 🙏🙏🙏

import { HOST_NAME, HOST_URL } from "./constants"

export function tokenizeProjectContent(paragraph: string) {
	const tokens = []
	let currentIndex = 0

	// Merge regex into one master regex
	const combinedRegex =
		/%\{(GHOSTLINK|IMAGE|VIDEO|HEADLINE)\}%([^|]+)\|([^%]+)%\{\1\}%/g

	let lastIndex = 0

	// Function to tokenize plain text and newlines
	function tokenizePlainText(text: string) {
		const parts = text.split(/\n/)
		for (let i = 0; i < parts.length; i++) {
			if (parts[i]) {
				tokens.push({ type: "text", text: parts[i] })
			}
			if (i < parts.length - 1) {
				tokens.push({ type: "br" }) // represent \n as a separate token
			}
		}
	}

	let match
	while ((match = combinedRegex.exec(paragraph)) !== null) {
		const [fullMatch, tagType, label, url] = match

		// Tokenize text before the match, including newlines
		if (match.index > lastIndex) {
			const plainText = paragraph.slice(lastIndex, match.index)
			tokenizePlainText(plainText)
		}

		// Push the matched tag token
		tokens.push({
			type: tagType.toLowerCase(), // 'ghostlink', 'image', 'video'
			text: label,
			url: url
		})

		lastIndex = combinedRegex.lastIndex
	}

	// Tokenize remaining text
	if (lastIndex < paragraph?.length) {
		tokenizePlainText(paragraph.slice(lastIndex))
	}

	return tokens as (
		| { type: "text" | "headline"; text: string }
		| { type: "ghostlink" | "image" | "video"; text: string; url: string }
		| { type: "br" }
	)[]
}


export function cleanURL(url_string?: string) {
	if (!url_string) return

	const url = new URL(url_string);
	const host = url.hostname
	// console.log("cleanURL: host:", host)
	if (!["phasenull.dev","pbs.twimg.com",`cdn.${HOST_NAME}`,"video.twimg.com",`www.${HOST_NAME}`,`${HOST_NAME}`,"www.youtube.com","www.github.com","github.com","x.com","www.linkedin.com","www.roblox.com","discord.com"].includes(host)) {
		console.warn("cleanURL: url is not whitelisted, returning null for url:", url_string)
		return
	}
	return url_string
}