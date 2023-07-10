import {useEffect} from 'react';
function LedoIndex() {
	useEffect(() => {
		document.title = "LEDO | %username%";
		const has_visited = document.cookie.includes("visited=true");
		console.log(has_visited);
		if (!has_visited) {
			document.cookie = "visited=true";
			document.location.href = "/ledo/get_started";
		}
	})
	return <div>ledo</div>;
}
export default LedoIndex;