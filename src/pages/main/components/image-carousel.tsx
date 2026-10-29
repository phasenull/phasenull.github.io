import { cleanURL } from "@common/util"
import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import {
	FaArrowUpRightFromSquare,
	FaChevronLeft,
	FaChevronRight,
	FaExpand,
	FaXmark
} from "react-icons/fa6"

interface ImageCarouselProps {
	urls: string[]
	alt?: string
}

export default function ImageCarousel({ urls, alt }: ImageCarouselProps) {
	// same-site paths are safe as is; anything else must pass the host allow-list
	const images = urls
		.map((url) => url.trim())
		.map((url) => (url.startsWith("/") && !url.startsWith("//") ? url : cleanURL(url)))
		.filter(Boolean) as string[]
	const [index, setIndex] = useState(0)
	const [fullscreen, setFullscreen] = useState(false)
	const trigger = useRef<HTMLButtonElement>(null)
	if (images.length === 0) return null
	const many = images.length > 1
	const go = (step: number) => setIndex((i) => (i + step + images.length) % images.length)
	const label = alt?.trim() || "Screenshot"

	return (
		<div className="w-full">
			<div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
				<button
					ref={trigger}
					type="button"
					onClick={() => setFullscreen(true)}
					aria-label={`View ${label} ${index + 1} of ${images.length} in full screen`}
					className="block w-full cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-slime-400"
				>
					<img
						src={images[index]}
						alt={`${label} ${index + 1}`}
						className="aspect-video w-full object-contain"
					/>
				</button>

				<span className="pointer-events-none absolute right-2.5 top-2.5 grid size-8 place-items-center rounded-lg bg-white/90 text-slate-700 opacity-0 ring-1 ring-slate-900/10 transition group-hover:opacity-100">
					<FaExpand size={13} />
				</span>
				{many ? (
					<>
						<span className="pointer-events-none absolute bottom-2.5 left-2.5 rounded-lg bg-slate-900/70 px-2 py-0.5 text-xs font-extrabold text-white">
							{index + 1} / {images.length}
						</span>
						<NavButton side="left" onClick={() => go(-1)} />
						<NavButton side="right" onClick={() => go(1)} />
					</>
				) : null}
			</div>

			{many ? (
				<div className="mt-2 flex gap-2 overflow-x-auto pb-1">
					{images.map((url, i) => (
						<button
							key={url + i}
							type="button"
							onClick={() => setIndex(i)}
							aria-label={`Show ${label} ${i + 1}`}
							aria-current={i === index}
							className={`h-12 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition sm:h-14 sm:w-24 ${
								i === index ? "border-slime-400" : "border-transparent opacity-60 hover:opacity-100"
							}`}
						>
							<img src={url} alt="" loading="lazy" className="size-full object-cover" />
						</button>
					))}
				</div>
			) : null}

			{fullscreen ? (
				<Lightbox
					images={images}
					label={label}
					index={index}
					setIndex={setIndex}
					onClose={() => {
						setFullscreen(false)
						trigger.current?.focus()
					}}
				/>
			) : null}
		</div>
	)
}

function NavButton({ side, onClick }: { side: "left" | "right"; onClick: () => void }) {
	const Icon = side === "left" ? FaChevronLeft : FaChevronRight
	return (
		<button
			type="button"
			onClick={onClick}
			aria-label={side === "left" ? "Previous image" : "Next image"}
			className={`absolute top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-slate-700 ring-1 ring-slate-900/10 transition hover:bg-white ${
				side === "left" ? "left-2.5" : "right-2.5"
			}`}
		>
			<Icon size={14} />
		</button>
	)
}

// full-height click strip on each side of the full screen viewer, so it is easy to hit
function SideButton({ side, onClick }: { side: "left" | "right"; onClick: () => void }) {
	const Icon = side === "left" ? FaChevronLeft : FaChevronRight
	return (
		<button
			type="button"
			onClick={(e) => {
				e.stopPropagation()
				onClick()
			}}
			aria-label={side === "left" ? "Previous image" : "Next image"}
			className={`group/side absolute inset-y-0 hidden w-28 place-items-center transition hover:bg-white/5 focus:outline-none sm:grid ${
				side === "left" ? "left-0" : "right-0"
			}`}
		>
			<span className="grid size-14 place-items-center rounded-full bg-white/10 transition group-hover/side:bg-white/25 group-focus-visible/side:ring-2 group-focus-visible/side:ring-slime-400">
				<Icon size={22} />
			</span>
		</button>
	)
}

function Lightbox({
	images,
	label,
	index,
	setIndex,
	onClose
}: {
	images: string[]
	label: string
	index: number
	setIndex: (update: (i: number) => number) => void
	onClose: () => void
}) {
	const many = images.length > 1
	const close_button = useRef<HTMLButtonElement>(null)
	const swipe_start = useRef<number | null>(null)
	// a swipe ends with a click on the backdrop; that click must not close the viewer
	const just_swiped = useRef(false)
	const go = (step: number) => setIndex((i) => (i + step + images.length) % images.length)

	useEffect(() => {
		close_button.current?.focus()
		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose()
			else if (e.key === "ArrowLeft") go(-1)
			else if (e.key === "ArrowRight") go(1)
			else if (e.key === "Home") setIndex(() => 0)
			else if (e.key === "End") setIndex(() => images.length - 1)
			else return
			e.preventDefault()
		}
		document.addEventListener("keydown", onKeyDown)
		const overflow = document.body.style.overflow
		document.body.style.overflow = "hidden"
		return () => {
			document.removeEventListener("keydown", onKeyDown)
			document.body.style.overflow = overflow
		}
	}, [])

	// preload the neighbours so flipping through is instant
	useEffect(() => {
		if (!many) return
		for (const step of [-1, 1]) new Image().src = images[(index + step + images.length) % images.length]
	}, [index])

	return createPortal(
		<div
			data-lightbox
			role="dialog"
			aria-modal="true"
			aria-label={`${label}, image ${index + 1} of ${images.length}`}
			className="fixed inset-0 z-[150] flex flex-col bg-slate-950 text-white"
			onClick={() => {
				if (just_swiped.current) just_swiped.current = false
				else onClose()
			}}
		>
			{/* top bar */}
			<div className="flex items-center gap-3 px-3 py-3 sm:px-5" onClick={(e) => e.stopPropagation()}>
				<p className="min-w-0 flex-1 truncate text-sm font-extrabold sm:text-base">
					{label}
					{many ? (
						<span className="ml-2 rounded-lg bg-white/10 px-2 py-0.5 text-xs font-extrabold text-white/80">
							{index + 1} / {images.length}
						</span>
					) : null}
				</p>
				<a
					href={images[index]}
					target="_blank"
					rel="noopener noreferrer"
					className="hidden h-12 items-center gap-2 rounded-xl px-4 text-sm font-bold text-white/80 transition hover:bg-white/10 hover:text-white sm:inline-flex"
				>
					Open original
					<FaArrowUpRightFromSquare size={11} />
				</a>
				<button
					ref={close_button}
					type="button"
					onClick={onClose}
					aria-label="Close"
					className="grid size-12 place-items-center rounded-xl bg-white/10 transition hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-slime-400"
				>
					<FaXmark size={22} />
				</button>
			</div>

			{/* image + side navigation */}
			<div
				className="relative flex min-h-0 flex-1 items-center justify-center px-3 sm:px-32"
				onPointerDown={(e) => (swipe_start.current = e.clientX)}
				onPointerUp={(e) => {
					if (swipe_start.current === null) return
					const delta = e.clientX - swipe_start.current
					swipe_start.current = null
					if (many && Math.abs(delta) > 50) {
						just_swiped.current = true
						go(delta < 0 ? 1 : -1)
					}
				}}
			>
				<img
					key={images[index]}
					src={images[index]}
					alt={`${label} ${index + 1}`}
					draggable={false}
					onClick={(e) => e.stopPropagation()}
					className="max-h-full max-w-full select-none rounded-xl object-contain"
				/>
				{many ? (
					<>
						<SideButton side="left" onClick={() => go(-1)} />
						<SideButton side="right" onClick={() => go(1)} />
					</>
				) : null}
			</div>

			{/* thumbnails */}
			{many ? (
				<div className="flex justify-center px-3 py-3 sm:py-4" onClick={(e) => e.stopPropagation()}>
					<div className="flex max-w-full gap-2 overflow-x-auto">
						{images.map((url, i) => (
							<button
								key={url + i}
								type="button"
								onClick={() => setIndex(() => i)}
								aria-label={`Show image ${i + 1}`}
								aria-current={i === index}
								className={`h-12 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition sm:h-16 sm:w-28 ${
									i === index ? "border-slime-400" : "border-transparent opacity-50 hover:opacity-100"
								}`}
							>
								<img src={url} alt="" className="size-full object-cover" />
							</button>
						))}
					</div>
				</div>
			) : (
				<div className="h-4" />
			)}
		</div>,
		document.body
	)
}
