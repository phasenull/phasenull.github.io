import { GoLink } from "react-icons/go"

function ExternalLink(props) {
	const { href } = props
	return <a href={href} target="_blank" rel="noreferrer" className="group font-extrabold text-green-500 transition-color duration-300 hover:text-blue-400 inline flex-none shrink-0">
		{props.children}<GoLink className="inline-block text-blue-400 group-hover:animate-shake flex-none shrink-0" />	
	</a>

}

export default ExternalLink