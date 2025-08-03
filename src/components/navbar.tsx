import { Link, useLocation, type To } from "react-router"

const paths = {
	"/": "Projects",
	"/recent-activities": "Recent Activities"
}

export default function NavBar() {
	return (
		<div className="sticky top-0 lg:justify-end flex flex-row z-200 shadow-lg space-x-4 bg-white px-20 w-full py-5">
			{Object.entries(paths).map(([key, value]) => (
				<NavButton key={[key, value].join("-")} to={{ pathname: key }}>
					{value}
				</NavButton>
			))}
		</div>
	)
}

function NavButton(props: {
	to: { pathname: string; search?: string; hash?: string }
	children: any
}) {
	const path = useLocation()
	let append: string = ""
	if (path.pathname === props.to.pathname) {
		append = "underline bg-slate-200"
	}
	return (
		<Link to={props.to}>
			<div
				className={`hover:scale-105 transition-all duration-100 ${append} underline-offset-5 rounded-t-md px-2 py-1 font-bold text-slate-400`}
			>
            {props.children}
				{/* {JSON.stringify(props.to, undefined, 4)} */}
			</div>
		</Link>
	)
}
