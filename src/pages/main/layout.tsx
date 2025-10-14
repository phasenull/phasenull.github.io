import Header from "./components/header"
import NavBar from "./components/navbar"

import banner from "@assets/phasenull/banner.jpg"
import { navbar_paths } from "@common/constants"
import AdminLayout from "@pages/admin/admin-layout"
import { useLocation } from "react-router"
const default_title = "phasenull - yet another fullstack developer"
export default function Layout(props: { children: any }) {
	const { pathname } = useLocation()
	const path_title = Object.values(navbar_paths).find(
		(_, i) => Object.keys(navbar_paths)[i] === pathname
	)
	if (pathname === "/") {
		document.title = default_title
	} else {
		document.title = path_title
			? `${path_title}`
			: default_title
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
