import { HOST_URL, navbar_paths } from "@common/constants"
import { FaExternalLinkAlt } from "react-icons/fa"
import { GoSignIn } from "react-icons/go"
import { Link, useLocation, type To } from "react-router"

export default function NavBar() {
	return (
		<div
			id="navbar"
			className="sticky top-0 flex items-center flex-row z-100 shadow-lg space-x-4 bg-white justify-center px-4 lg:px-20 w-full py-5"
		>
			{Object.entries(navbar_paths).map(([key, value]) => (
				<NavButton key={[key, value].join("-")} to={{ pathname: key }}>
					{value}
				</NavButton>
			))}
			
			<a
				href={`${HOST_URL}/download-a-copy`}
				target="_blank"
				style={{color:"oklch(69.6% 0.17 162.48)"}}  key={"download-a-copy"}
				className={`hover:scale-105 text-center transition-all duration-100 underline-offset-5 rounded-md px-2 py-1 font-bold text-slate-500`}
			>
				Get Resume <FaExternalLinkAlt className="inline-block mb-1" size={8} />
				{/* {JSON.stringify(props.to, undefined, 4)} */}
			</a>
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
				className={`hover:scale-105 text-center transition-all duration-100 underline-offset-5 rounded-md px-2 py-1 font-bold text-slate-500 ${append} ${props.className} `}
			>
				{props.children}
				{/* {JSON.stringify(props.to, undefined, 4)} */}
			</div>
		</Link>
	)
}
