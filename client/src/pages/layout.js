import { Outlet } from "react-router-dom"
const Layout = () => {
	return (
		<div className= "bg-gradient-to-r from-green-100 bg-green-300 no-scrollbar h-screen">
			<Outlet />
		</div>
	)
}

export default Layout
