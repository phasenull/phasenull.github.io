import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import LoadingScreen from "../../../components/LoadingScreen";
import { IS_LOGGED_IN } from "../../../util";
function DashboardLayout(props) {
	const { children } = props;
	const [is_logged_in, set_is_logged_in] = useState(undefined);
	if (window.location.pathname === "/ledo/dashboard/auth") { return <Outlet />}
	else {
		IS_LOGGED_IN().then(data => set_is_logged_in(data))
		if (!is_logged_in) {
			document.location.href = "/ledo/dashboard/auth";
		}
	}
	return (
		<div className="flex flex-col min-h-screen">
			dashboard layout
			<LoadingScreen
				sx={
					{
						color: '#fff',
						zIndex: (theme) => theme.zIndex.drawer + 1
					}
				}
				open={!is_logged_in}>
				<p className="mx-5">
					Please Wait...
				</p>
			</LoadingScreen>
			<Outlet />
		</div>
	);
}

export default DashboardLayout;