import { FaExternalLinkAlt } from "react-icons/fa"
import { Link } from "react-router"

export default function ExternalLink({
	href,
	children
}: {
	href: string
	children: React.ReactNode
}) {
	return (
		<Link
			className="font-bold text-blue-400 text-xs  lg:text-[16px]"
			to={{ hash: `consent=${href}` }}
		>
			{children}
			<FaExternalLinkAlt className="inline-block mb-1 ml-1" size={8} />
		</Link>
	)
}
