const API_URL = "http://localhost"
async function GET_GROUP_DETAILS(group_id) {
	return fetch("https://groups.roproxy.com/v1/groups/" + group_id)
		.then(res => res.json())
		.then(json => json)
}
async function GET_MODEL_COUNT() {
	return fetch(API_URL+"/api/v1/systems").then(res => res.json()).then(json => json["value"])
}
async function GET_SALES() {
	return fetch(API_URL+"/api/v1/sales").then(res => res.json()).then(json => json["value"])
}
export { GET_GROUP_DETAILS , GET_MODEL_COUNT, GET_SALES,API_URL}
