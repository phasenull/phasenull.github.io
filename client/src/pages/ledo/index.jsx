import LoadingScreen from '../../components/LoadingScreen';
import { IS_LOGGED_IN } from '../../util';
import {useEffect, useState} from 'react';
function LedoIndex() {
	useEffect(() => {
		document.title = "LEDO | ";
		const has_visited = document.cookie.includes("visited=true");
		console.log(has_visited);
		if (!has_visited) {
			document.cookie = "visited=true";
			document.location.href = "/ledo/get_started";
		} else {
			document.location.href = "/ledo/dashboard";
		}
	})
	return (<div>

	</div>);
}
export default LedoIndex;