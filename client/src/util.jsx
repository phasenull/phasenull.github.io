const API_URL = "http://192.168.1.47"
const VERSION = "v0.0.1-alpha"
async function GET_GROUP_DETAILS(group_id) {
	return fetch("https://groups.roproxy.com/v1/groups/" + group_id)
		.then((res) => res.json())
		.then((json) => json)
}
async function GET_MODEL_COUNT() {
	return fetch(API_URL + "/api/v1/systems")
		.then((res) => res.json())
		.then((json) => json["value"])
}

async function GET_SALES() {
	return fetch(API_URL + "/api/v1/sales")
		.then((res) => res.json())
		.then((json) => json["value"])
}
function GET_VERSION() {
	return VERSION
}
function FILTER_CLASS(class_list, filter) {
	const new_class = []
	class_list.forEach((c) => {
		if (!c.includes(filter)) {
			new_class.push(c)
		}
	})
	return new_class
}

function GET_DATE() {
	const date = new Date().toString()
	return date
}
export { GET_GROUP_DETAILS, GET_MODEL_COUNT, GET_SALES, API_URL, FILTER_CLASS , GET_VERSION, GET_DATE}
