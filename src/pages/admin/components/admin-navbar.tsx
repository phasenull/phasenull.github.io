import { GoSignIn } from "react-icons/go"
import { Link, useLocation, type To } from "react-router"
import AdminProfile from "./admin-profile"

const paths = {
	"/admin": "Dash",
	"/admin/status": "Status",
	"/admin/stacks": "Stacks",
	"/admin/projects": "Projects",
	// "/admin/manage-activities":"Activities",
	"/admin/list-sessions": "List Sessions"
	// "/recent-activities": "Recent Activities",
}

export default function NavBar() {
	return (
		<div
			id="navbar"
			className="sticky top-0 flex items-center flex-col lg:flex-row z-200 shadow-lg space-x-4 bg-white justify-center px-4 lg:px-20 w-full py-5"
		>
			<AdminProfile />
			<div className="flex flex-row">
				{Object.entries(paths).map(([key, value]) => (
					<NavButton key={[key, value].join("-")} to={{ pathname: key }}>
						{value}
					</NavButton>
				))}
			</div>
		</div>
	)
}

function NavButton(props: {
	to: { pathname: string; search?: string; hash?: string }
	children: any
	className?: string
}) {
	const path = useLocation()
	let append: string = ""
	if (path.pathname === props.to.pathname) {
		append = "underline bg-slate-200"
	}
	return (
		<Link to={props.to}>
			<div
				className={`hover:scale-105 transition-all duration-100 ${append} underline-offset-5 rounded-md px-2 py-1 font-bold text-slate-400 ${props.className} `}
			>
				{props.children}
				{/* {JSON.stringify(props.to, undefined, 4)} */}
			</div>
		</Link>
	)
}
