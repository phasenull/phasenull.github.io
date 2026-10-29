import { createPortal } from "react-dom"
import { useEffect } from "react"
import { FaArrowUpRightFromSquare } from "react-icons/fa6"
import { useLocation, useNavigate } from "react-router"
import { parseHttpURL } from "@common/util"

export default function UrlConsent() {
	const { hash, pathname, search } = useLocation()
	const navigate = useNavigate()
	let consent_url: URL | undefined
	if (hash.startsWith("#consent=")) {
		// the hash is attacker controllable, only offer plain http(s) links
		consent_url = parseHttpURL(hash.replace("#consent=", ""))
	}
	const close = () => navigate({ pathname, search, hash: "" }, { replace: true })
	useEffect(() => {
		if (!consent_url) return
		const onKeyDown = (e: KeyboardEvent) => e.key === "Escape" && close()
		document.addEventListener("keydown", onKeyDown)
		return () => document.removeEventListener("keydown", onKeyDown)
	}, [consent_url?.href])
	if (!consent_url) return
	return createPortal(
		<div
			className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/40 p-4"
			onClick={close}
			role="dialog"
			aria-modal="true"
		>
			<div
				className="w-full max-w-md rounded-2xl bg-white p-6"
				onClick={(e) => e.stopPropagation()}
			>
				<p className="text-sm font-medium text-slate-500">You're leaving phasenull.dev</p>
				<p className="mt-1 text-lg font-bold text-slate-900">{consent_url.hostname}</p>
				<p className="mt-2 break-all rounded-lg bg-slate-50 px-3 py-2 font-mono text-xs text-slate-500">
					{consent_url.href}
				</p>
				<div className="mt-5 flex justify-end gap-2">
					<button
						type="button"
						onClick={close}
						className="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
					>
						Stay here
					</button>
					<a
						href={consent_url.href}
						target="_blank"
						rel="noopener noreferrer"
						onClick={close}
						autoFocus
						className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
					>
						Open link
						<FaArrowUpRightFromSquare size={11} />
					</a>
				</div>
			</div>
		</div>,
		document.body
	)
}
