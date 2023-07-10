import { Outlet } from "react-router-dom"
import { BiLinkExternal } from "react-icons/bi"
function PortfolioContainer(props) {
	return (
	<div tag = {props.tag} type= {props.type} className="h-60 w-full max-h-96 overflow-hidden bg-white drop-shadow-2xl rounded-2xl grid grid-rows-2 grid-flow-col sm:grid-rows-1">
		{props.children}
		<a className="absolute bottom-0 mr-2 mb-2 p-1 rounded-xl bg-primary opacity-30 right-0 font-bold text-sm select-none text-secondary-darkest hover:bg-primary-dark hover:opacity-100" href={"?filter="+props.tag}>
			#{props.tag}
		</a>
		{props.href && <a className="absolute right-0 m-3 group hover:scale-105" href={props.href} target="_blank" rel="noreferrer">
			<BiLinkExternal className="text-secondary-darkest text-2xl group-hover:animate-shakerotation" />
		</a>}
	</div>
	)
}
export default PortfolioContainer