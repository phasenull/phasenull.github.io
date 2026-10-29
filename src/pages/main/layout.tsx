import Header from "./components/header"

import banner from "@assets/phasenull/banner.jpg"
import { navbar_paths } from "@common/constants"
import AdminLayout from "@pages/admin/admin-layout"
import { useLocation } from "react-router"
const default_title = "phasenull — Roblox & Fullstack Developer"
export default function Layout(props: { children: any }) {
	const { pathname } = useLocation()
	const path_title = Object.values(navbar_paths).find(
		(_, i) => Object.keys(navbar_paths)[i] === pathname
	)
	if (pathname === "/") {
		const existing_metadata = document.querySelector('meta[name="description"]')
		document.title = default_title
		// closing a project puts the home description back (the worker sets the initial one)
		if (existing_metadata && existing_metadata.getAttribute("data-project")) {
			existing_metadata.removeAttribute("data-project")
			existing_metadata.setAttribute("content", existing_metadata.getAttribute("data-home") || "")
		}
		if (!existing_metadata) {
			const metadata = document.createElement("meta")
			metadata.name = "description"
			metadata.content =
				"Hi, I'm phasenull. I do Roblox and Fullstack development."
			document.head.appendChild(metadata)
		}
	} else if (!pathname.startsWith("/projects/")) {
		// project pages set their own title (projects-body.tsx)
		document.title = path_title ? `${path_title}` : default_title
	}
	if (pathname.startsWith("/admin"))
		return <AdminLayout>{props.children}</AdminLayout>
	return (
		<div id="main" className="relative flex min-h-screen flex-col overflow-x-clip">
			{/* full-width banner, only the content below is width-limited */}
			<div className="absolute inset-x-0 top-0 h-52 sm:h-[38rem]" aria-hidden>
				<img src={banner} alt="" className="size-full object-cover" />
				<div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-slime-50 sm:h-56" />
			</div>
			<div className="relative mx-auto w-full max-w-6xl flex-1 px-3 pb-16 pt-16 sm:px-6 sm:pb-24 sm:pt-36">
				<Header />
				<main id="page">{props.children}</main>
			</div>
		</div>
	)
}
