import { personal_info } from "@common/constants"
import { cleanURL } from "@common/util"
import { useRef, useState } from "react"
import type { IconType } from "react-icons"
import {
	FaCheck,
	FaDiscord,
	FaEnvelope,
	FaGithub,
	FaRegCopy,
	FaTwitter,
	FaYoutube
} from "react-icons/fa6"
import { SiRoblox } from "react-icons/si"

const socials: { label: string; href: string; icon: IconType; className: string }[] = [
	{ label: "GitHub", href: personal_info.contact.github, icon: FaGithub, className: "bg-slate-900 " },
	{ label: "YouTube", href: personal_info.contact.youtube, icon: FaYoutube, className: "bg-[#ff0033] " },
	{ label: "Twitter", href: personal_info.contact.twitter, icon: FaTwitter, className: "bg-[#1d9bf0]" },
	{ label: "Roblox", href: personal_info.contact.roblox, icon: SiRoblox, className: "bg-[#335fff] " },
	{ label: "Discord", href: personal_info.contact.discord, icon: FaDiscord, className: "bg-[#5865f2] " }
]

export function SocialButtons({ className = "" }: { className?: string }) {
	return (
		<div className={`flex-wrap items-center gap-2 sm:gap-2.5 ${className}`}>
			{socials.map(({ label, href, icon: Icon, className }) => (
				<a
					key={label}
					href={cleanURL(href)}
					target="_blank"
					rel="noopener noreferrer"
					aria-label={label}
					title={label}
					className={`grid size-9 place-items-center rounded-xl text-white sm:size-11 sm:rounded-2xl transition hover:-translate-y-1 ${className}`}
				>
					<Icon className="size-4 sm:size-5" />
				</a>
			))}
		</div>
	)
}

// the Clipboard API only exists on https (and localhost); fall back to a hidden textarea elsewhere
async function copyText(text: string) {
	try {
		if (navigator.clipboard && window.isSecureContext) {
			await navigator.clipboard.writeText(text)
			return true
		}
	} catch {}
	const area = document.createElement("textarea")
	area.value = text
	area.setAttribute("readonly", "")
	area.style.position = "fixed"
	area.style.opacity = "0"
	document.body.appendChild(area)
	area.select()
	let ok = false
	try {
		ok = document.execCommand("copy")
	} catch {}
	area.remove()
	return ok
}

export function EmailButton() {
	const email = personal_info.contact.email
	const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle")
	const timer = useRef<ReturnType<typeof setTimeout>>(undefined)
	const copy = async () => {
		setStatus((await copyText(email)) ? "copied" : "failed")
		clearTimeout(timer.current)
		timer.current = setTimeout(() => setStatus("idle"), 1600)
	}
	return (
		<div className="flex h-9 items-center rounded-xl bg-slime-400 text-xs font-bold sm:h-11 sm:rounded-2xl sm:text-sm">
			<a
				href={`mailto:${email}`}
				className="flex h-full items-center gap-2 rounded-l-xl pl-3 pr-2.5 text-slate-900 transition hover:bg-slime-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-slate-900 sm:rounded-l-2xl sm:pl-4 sm:pr-3"
			>
				<FaEnvelope />
				{email}
			</a>
			<button
				type="button"
				onClick={copy}
				aria-label="Copy email address"
				className="relative grid h-full w-9 place-items-center rounded-r-xl border-l border-slime-600/20 text-slate-900 transition hover:bg-slime-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-slate-900 sm:w-11 sm:rounded-r-2xl"
			>
				{status === "copied" ? <FaCheck /> : <FaRegCopy />}
				{status !== "idle" ? (
					<span
						role="status"
						className={`pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg px-2.5 py-1.5 text-xs font-extrabold ${
							status === "copied" ? "bg-slime-400 text-slate-900" : "bg-amber-100 text-amber-900"
						}`}
					>
						{status === "copied" ? "Copied!" : "Couldn't copy"}
					</span>
				) : null}
			</button>
		</div>
	)
}
