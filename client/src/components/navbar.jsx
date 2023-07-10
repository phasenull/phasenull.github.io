import { Outlet, Link } from "react-router-dom"

const NavBar = () => {
	return (
		<>
			<div class="dark color-red">
				hello
			</div>
			
			<Outlet />
		</>
	)
}

export default NavBar
