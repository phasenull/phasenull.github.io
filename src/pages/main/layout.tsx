import NavBar from "./components/navbar"
import Header from "./components/header"

import banner from "@assets/phasenull/banner.jpg"
import DashboardPanel from "./components/dashboard-panel"
import { useLocation } from "react-router"
import AdminLayout from "@pages/admin/admin-layout"
import { navbar_paths } from "@common/constants"
export default function Layout(props: { children: any }) {
	const { pathname } = useLocation()
	console.log(pathname)
	const path_title = Object.values(navbar_paths).find(
		(_, i) => Object.keys(navbar_paths)[i] === pathname
	)
	if (pathname === "/") {
		document.title = "phasenull.dev - yet another fullstack developer"
	} else {
		document.title = path_title
			? `phasenull.dev - ${path_title}`
			: "phasenull.dev - yet another fullstack developer"
	}
	if (pathname.startsWith("/admin"))
		return <AdminLayout>{props.children}</AdminLayout>
	return (
		<div className="h-screen w-screen flex flex-col overflow-x-clip overflow-y-scroll">
			<img
				style={{ objectFit: "cover" }}
				className="hidden lg:block h-144 lg:h-[40%] overflow-x-hidden scale-100 -z-10 absolute"
				src={banner}
			/>
			<Header />
			<NavBar />
			<div className="bg-white" id="page">
				{props.children}
			</div>
		</div>
	)
}
