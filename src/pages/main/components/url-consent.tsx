import { createPortal } from "react-dom"
import { FaExternalLinkAlt } from "react-icons/fa"
import { Link, useLocation } from "react-router"

export default function UrlConsent() {
	const { hash } = useLocation()
	let consent_url
	if (hash.startsWith("#consent=")) {
		consent_url = hash.replace("#consent=", "")
		// window.location.hash = ""
	}
	if (!consent_url) return
	return createPortal(
		<div className="h-screen w-screen absolute top-0 z-200 flex items-center justify-center overflow-hidden">
			<div className="bg-white p-6 max-w-[90%] rounded-lg z-300">
				<p className="text-[15px]">
					Would you like to visit this url in a new page? <br />
					<span className="font-semibold">{consent_url}</span>
				</p>
				<div className="flex justify-center space-x-10 mt-4">
					<a
						href={consent_url}
						target="_blank"
						onClick={() => (window.location.hash = "")}
						className="hover:scale-105 bg-emerald-400 text-white px-4 py-2 rounded-lg"
					>
						Yes <FaExternalLinkAlt className="inline-block mb-1 ml-1" size={14} />
					</a>
					<Link
						to={{ hash: "" }}
						className="hover:scale-105 bg-slate-400 text-white px-4 py-2 rounded-lg"
					>
						Stay Here
					</Link>
				</div>
			</div>
			<div className="opacity-40 bg-black h-screen z-200 w-screen absolute"></div>
		</div>,
		document.getElementById("root")!
	)

	{
		/* // ask user consent for stack redirect */
	}
}
