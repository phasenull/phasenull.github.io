import banner from "@assets/phasenull/banner.jpg"
import NavBar from "./components/admin-navbar"
import { useAuthStore } from "@common/oauth.store"
import { Navigate, useLocation } from "react-router"
export default function AdminLayout(props: { children: any }) {
	const access_token = useAuthStore((state) => state.user)
	const { pathname } = useLocation()
	if (pathname.startsWith("/admin/oauth")) {
		return props.children
	} else if (!access_token) {
		return <Navigate to={"/admin/oauth/authorize"} />
	}
	document.title = "Admin Page"
	return (
		<div className="h-screen w-screen flex flex-col overflow-x-clip overflow-y-scroll">
			<NavBar />
			<div className="bg-white" id="page">
				{props.children}
			</div>
		</div>
	)
}
