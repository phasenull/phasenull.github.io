import Header from "./components/header"
import NavBar from "./components/navbar"

import banner from "@assets/phasenull/banner.jpg"
import { navbar_paths } from "@common/constants"
import AdminLayout from "@pages/admin/admin-layout"
import { useLocation } from "react-router"
const default_title = "phasenull - Fullstack Developer"
export default function Layout(props: { children: any }) {
	const { pathname } = useLocation()
	const path_title = Object.values(navbar_paths).find(
		(_, i) => Object.keys(navbar_paths)[i] === pathname
	)
	if (pathname === "/") {
		const existing_metadata = document.querySelector('meta[name="description"]')
		if (!existing_metadata) {
			document.title = default_title
			const metadata = document.createElement("meta")
			metadata.name = "description"
			metadata.content =
				"Hi, I'm phasenull. I do Roblox and Fullstack development."
			document.head.appendChild(metadata)
		}
	} else {
		document.title = path_title ? `${path_title}` : default_title
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
