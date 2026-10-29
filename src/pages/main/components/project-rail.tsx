import { useEffect, useState } from "react"
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6"
import type { Project } from "./project-media"

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches

function scrollToElement(element: HTMLElement | null) {
	element?.scrollIntoView({ behavior: reducedMotion() ? "auto" : "smooth", block: "center" })
}

// index of the last card whose top has passed 40% of the viewport, -1 while still on the intro
function useActiveIndex(ids: number[]) {
	const [active, setActive] = useState(-1)
	useEffect(() => {
		let frame = 0
		const update = () => {
			frame = 0
			const line = window.innerHeight * 0.4
			let index = -1
			ids.forEach((id, i) => {
				const top = document.getElementById(`project-${id}`)?.getBoundingClientRect().top
				if (top !== undefined && top <= line) index = i
			})
			setActive(index)
		}
		const onScroll = () => {
			if (!frame) frame = requestAnimationFrame(update)
		}
		update()
		window.addEventListener("scroll", onScroll, { passive: true })
		window.addEventListener("resize", onScroll)
		return () => {
			cancelAnimationFrame(frame)
			window.removeEventListener("scroll", onScroll)
			window.removeEventListener("resize", onScroll)
		}
	}, [ids.join(",")])
	return active
}

// outlines the project card a dot points at while the dot is hovered or focused
function highlight(key: string, on: boolean) {
	const card = key === "intro" ? null : document.getElementById(key)
	if (on) card?.setAttribute("data-rail-target", "")
	else card?.removeAttribute("data-rail-target")
}

// one dot per project, in a column just right of the project grid (its parent must be `relative`);
// only shown where there is room for it beside the cards (xl+)
export default function ProjectRail({ projects }: { projects: Project[] }) {
	const active = useActiveIndex(projects.map((p) => p.id))
	const items = [{ key: "intro", label: "About me", ongoing: false }, ...projects.map((p) => ({ key: `project-${p.id}`, label: p.title, ongoing: p.project_end_date === null }))]
	const current = active + 1
	const step = 22
	return (
		<div className="absolute inset-y-0 left-full ml-5 hidden xl:block">
			<nav
				aria-label="Projects"
				className="sticky top-[calc(50vh-12rem)] z-40"
			>
				<div className="relative flex flex-col items-center rounded-full border border-slate-200 bg-white px-2 py-3">
					{/* track + fill */}
					<div className="absolute left-1/2 top-3 w-0.5 -translate-x-1/2 rounded-full bg-slate-200" style={{ height: (items.length - 1) * step }} />
					<div
						className="absolute left-1/2 top-3 w-0.5 -translate-x-1/2 rounded-full bg-gradient-to-b from-slime-400 to-sky-blob transition-[height] duration-300"
						style={{ height: current * step }}
					/>
					{items.map((item, i) => (
						<button
							key={item.key}
							type="button"
							onClick={(e) => {
								if (i === 0) window.scrollTo({ top: 0, behavior: reducedMotion() ? "auto" : "smooth" })
								else scrollToElement(document.getElementById(item.key))
								// a mouse click shouldn't leave the dot focused (and its label stuck open)
								if (e.detail > 0) e.currentTarget.blur()
								highlight(item.key, false)
							}}
							onMouseEnter={() => highlight(item.key, true)}
							onMouseLeave={() => highlight(item.key, false)}
							onFocus={() => highlight(item.key, true)}
							onBlur={() => highlight(item.key, false)}
							aria-label={`Go to ${item.label}`}
							aria-current={i === current ? "true" : undefined}
							className="group relative grid place-items-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-slime-400"
							style={{ height: step, width: step }}
						>
							<span
								className={`rounded-full transition-all duration-200 ${
									i === current
										? "size-3.5 bg-slime-400  "
										: i < current
										? "size-2 bg-slime-400"
										: item.ongoing
										? "size-2 bg-sky-blob/60 group-hover:bg-sky-blob"
										: "size-2 bg-slate-300 group-hover:bg-slate-500"
								}`}
							/>
							<span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-xl bg-slime-400 px-3 py-1.5 text-xs font-extrabold text-slate-900 group-hover:block group-focus-visible:block">
								{item.label}
							</span>
						</button>
					))}
				</div>
				<p className="mt-2 text-center text-[11px] font-extrabold text-slate-400">
					{Math.max(active + 1, 0)}/{projects.length}
				</p>
			</nav>
		</div>
	)
}

// thin page progress bar at the top, all screen sizes
export function ScrollProgress() {
	const [progress, setProgress] = useState(0)
	useEffect(() => {
		let frame = 0
		const update = () => {
			frame = 0
			const max = document.documentElement.scrollHeight - window.innerHeight
			setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0)
		}
		const onScroll = () => {
			if (!frame) frame = requestAnimationFrame(update)
		}
		update()
		window.addEventListener("scroll", onScroll, { passive: true })
		window.addEventListener("resize", onScroll)
		return () => {
			cancelAnimationFrame(frame)
			window.removeEventListener("scroll", onScroll)
			window.removeEventListener("resize", onScroll)
		}
	}, [])
	return (
		<div className="pointer-events-none fixed inset-x-0 top-0 z-50 h-1" aria-hidden>
			<div
				className="h-full origin-left bg-gradient-to-r from-slime-400 via-sky-blob to-grape-blob"
				style={{ transform: `scaleX(${progress})` }}
			/>
		</div>
	)
}

// phones and narrow windows: there is no room beside the cards, so a small bar floats at the bottom
// while the project list is on screen: current project, mini progress dots and prev / next buttons
export function MobileProjectNav({ projects, gridId }: { projects: Project[]; gridId: string }) {
	const active = useActiveIndex(projects.map((p) => p.id))
	const [visible, setVisible] = useState(false)
	useEffect(() => {
		let frame = 0
		const update = () => {
			frame = 0
			const rect = document.getElementById(gridId)?.getBoundingClientRect()
			// hide once the end of the list comes up, so the bar never covers the end-of-list links
			setVisible(!!rect && rect.top < window.innerHeight * 0.6 && rect.bottom > window.innerHeight - 80)
		}
		const onScroll = () => {
			if (!frame) frame = requestAnimationFrame(update)
		}
		update()
		window.addEventListener("scroll", onScroll, { passive: true })
		window.addEventListener("resize", onScroll)
		return () => {
			cancelAnimationFrame(frame)
			window.removeEventListener("scroll", onScroll)
			window.removeEventListener("resize", onScroll)
		}
	}, [gridId])

	const current = Math.max(active, 0)
	const goTo = (index: number) => {
		const project = projects[Math.min(Math.max(index, 0), projects.length - 1)]
		document
			.getElementById(`project-${project.id}`)
			?.scrollIntoView({ behavior: reducedMotion() ? "auto" : "smooth", block: "start" })
	}
	const title = active < 0 ? "Projects" : projects[current]?.title

	return (
		<nav
			aria-label="Project navigation"
			aria-hidden={!visible}
			className={`fixed inset-x-0 bottom-0 z-40 flex justify-center px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] transition duration-200 xl:hidden ${
				visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
			}`}
		>
			<div className="flex w-full max-w-md items-center gap-1 rounded-2xl border border-slate-200 bg-white p-1.5">
				<button
					type="button"
					onClick={() => goTo(active - 1)}
					disabled={active <= 0}
					tabIndex={visible ? 0 : -1}
					aria-label="Previous project"
					className="grid size-11 shrink-0 place-items-center rounded-xl text-slate-700 transition hover:bg-slime-50 disabled:opacity-30"
				>
					<FaChevronLeft size={16} />
				</button>
				<div className="min-w-0 flex-1 text-center">
					<p className="truncate text-sm font-extrabold text-slate-900">
						<span className="mr-1.5 text-slime-600">
							{active < 0 ? 0 : current + 1}/{projects.length}
						</span>
						{title}
					</p>
					<div className="mt-1 flex justify-center gap-1" aria-hidden>
						{projects.map((p, i) => (
							<span
								key={p.id}
								className={`h-1 rounded-full transition-all ${
									i === current && active >= 0 ? "w-4 bg-slime-400" : i < current ? "w-1 bg-slime-400" : "w-1 bg-slate-300"
								}`}
							/>
						))}
					</div>
				</div>
				<button
					type="button"
					onClick={() => goTo(active + 1)}
					disabled={active >= projects.length - 1}
					tabIndex={visible ? 0 : -1}
					aria-label="Next project"
					className="grid size-11 shrink-0 place-items-center rounded-xl text-slate-700 transition hover:bg-slime-50 disabled:opacity-30"
				>
					<FaChevronRight size={16} />
				</button>
			</div>
		</nav>
	)
}
