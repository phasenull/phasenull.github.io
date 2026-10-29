import { FaExternalLinkAlt } from "react-icons/fa"
import { Link } from "react-router"

// external links go through the #consent= dialog (url-consent.tsx) instead of opening directly
export default function ExternalLink({
	href,
	children,
	className = ""
}: {
	href: string
	children: React.ReactNode
	className?: string
}) {
	return (
		<Link
			className={`font-bold text-blue-400 transition-colors hover:text-blue-500 ${className}`}
			to={{ hash: `consent=${href}` }}
		>
			{children}
			<FaExternalLinkAlt className="mb-1 ml-1 inline-block" size={8} />
		</Link>
	)
}
