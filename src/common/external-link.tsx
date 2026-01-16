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
			<FaExternalLinkAlt className="inline-block mb-2 ml-1/2" size={6} />
		</Link>
	)
}
