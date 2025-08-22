import NavBar from "./components/navbar"
import Header from "./components/header"

import banner from "@assets/phasenull/banner.jpg"
import DashboardPanel from "./components/dashboard-panel"
import { useLocation } from "react-router"
import AdminLayout from "@pages/admin/admin-layout"
export default function Layout(props: { children: any }) {
	const {pathname} = useLocation()
	console.log(pathname)
	if (pathname.startsWith("/admin")) return <AdminLayout>{props.children}</AdminLayout>
	return (
		<div className="h-screen w-screen flex flex-col overflow-x-clip overflow-y-scroll">
			<img
				style={{ objectFit: "cover" }}
				className="h-144 lg:h-[40%] overflow-x-hidden scale-100 -z-10 absolute"
				src={banner}
			/>
			<Header />
			<NavBar />
			<div className="bg-white" id="page">{props.children}</div>
		</div>
	)
}
