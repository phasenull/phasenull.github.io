import { HOST_URL } from "@common/constants"
import { GoSignIn } from "react-icons/go"
import { Link, useLocation, type To } from "react-router"

const paths = {
	// "/client-area":"Client Area",
	"/": "Projects",
	"/recent-activities": "Recent Activities"
}

export default function NavBar() {
	return (
		<div
			id="navbar"
			className="sticky top-0 flex items-center flex-row z-200 shadow-lg space-x-4 bg-white justify-center px-4 lg:px-20 w-full py-5"
		>
			{Object.entries(paths).map(([key, value]) => (
				<NavButton key={[key, value].join("-")} to={{ pathname: key }}>
					{value}
				</NavButton>
			))}
			
			<a
				href={`${HOST_URL}/download-a-copy`}
				target="_blank"
				style={{color:"oklch(69.6% 0.17 162.48)"}}  key={"download-a-copy"}
				className={`hover:scale-105 text-center transition-all duration-100 underline-offset-5 rounded-md px-2 py-1 font-bold text-slate-400`}
			>
				Download a Copy
				{/* {JSON.stringify(props.to, undefined, 4)} */}
			</a>
			<Link
				className="lg:block hidden absolute hover:scale-105 transition-all duration-100 text-slate-400 left-0 ml-4"
				key={"admin"}
				to={{ pathname: "/admin" }}
				target="_blank"
			>
				<GoSignIn size={24} strokeWidth={2} />
			</Link>
		</div>
	)
}

function NavButton(props: {
	to: { pathname: string; search?: string; hash?: string }
	children: any
	style?:React.CSSProperties
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
				style={props.style
					
				}
				className={`hover:scale-105 text-center transition-all duration-100 underline-offset-5 rounded-md px-2 py-1 font-bold text-slate-400 ${append} ${props.className} `}
			>
				{props.children}
				{/* {JSON.stringify(props.to, undefined, 4)} */}
			</div>
		</Link>
	)
}
