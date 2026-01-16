import Header from "./components/header"
import NavBar from "./components/navbar"

import banner from "@assets/phasenull/banner.jpg"
import { navbar_paths } from "@common/constants"
import { clamp } from "@common/util"
import AdminLayout from "@pages/admin/admin-layout"
import { useEffect, useState } from "react"
import { useLocation } from "react-router"
const default_title = "phasenull - Fullstack Developer"
export default function Layout(props: { children: any }) {
	const { pathname } = useLocation()
	const path_title = Object.values(navbar_paths).find(
		(_, i) => Object.keys(navbar_paths)[i] === pathname
	)
	const [scroll_amount, set_scroll_amount] = useState(0)
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
	useEffect(() => {
		const root = document.getElementById("main")
		const eventHandler = () => {
			set_scroll_amount(root?.scrollTop || 0)
		}
		root?.addEventListener("scroll", eventHandler)
		return () => {
			root?.removeEventListener("scroll", eventHandler)
		}
	}, [])
	if (pathname.startsWith("/admin"))
		return <AdminLayout>{props.children}</AdminLayout>
	const default_h = 144 * 4
	return (
		<div
			id="main"
			className="h-screen w-screen flex flex-col overflow-x-hidden overflow-y-scroll"
		>
			<div>
				<img
					style={{
						objectFit: "cover",
						height: clamp(
							((scroll_amount / 50 + 100) / 100) * default_h,
							default_h,
							default_h*4
						)
					}}
					className="hidden lg:block h-144 lg:h-[40%] overflow-x-hidden scale-100 -z-10 absolute"
					src={banner}
				/>
			</div>
			<Header />
			<NavBar />
			<div className="bg-white" id="page">
				{props.children}
			</div>
		</div>
	)
}
