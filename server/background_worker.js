const GROUP_ID = 8015542
const API_URL = `https://economy.roblox.com/v2/groups/${GROUP_ID}/transactions?limit=100&transactionType=Sale&cursor=`
const fetch = require("node-fetch")
async function fetch_page(cursor) {
	const request = await fetch(`${API_URL}${cursor}`, {
		headers: {
			cookie: process.env.COOKIE,
		},
	})
		.then((res) => {
			const json = res.json()
			if (!json) {return}
			if (json.errors) {
				console.log("Background Worker Error:", json.errors)
				return
			}
			console.log(json.data.length)
			return json
		})
		.catch((err) => {
			console.log("Background Worker Error:", err)
		})
}
async function step() {
	console.log("background worker step", process.env.COOKIE.slice(0, 40))
	fetch("https://phasenull-api.onrender.com/api/v1/sales").then((res) => {
		console.log("sales api is", res.status == 200?"up":"down")
	})
	// let next_cursor = " "
	// const data = []
	// while (next_cursor) {
		// const page = await fetch_page(next_cursor)
		// data.concat(page.data)
		// if (page.nextPageCursor) {
			// next_cursor = page.nextPageCursor
		// } else {
			// next_cursor = false
		// }
	// }
	// console.log("Sales", data.length)
}
function background_worker(params) {
	console.log("background worker started!")
	setInterval(() => {
		step().then(() => {
			console.log("background worker step done")
		})
	}, 10 * 1000)
}
module.exports = background_worker
