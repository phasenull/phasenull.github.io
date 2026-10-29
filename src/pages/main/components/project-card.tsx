import { Link } from "react-router"
import { FaArrowRight, FaArrowUpRightFromSquare } from "react-icons/fa6"
import { cleanURL } from "@common/util"
import { slugify } from "@common/slug"
import { BlobCover, getProjectLinks, getProjectMedia, getProjectSummary, type Project, type Stack } from "./project-media"

export function formatMonth(date: string) {
	return new Date(date).toLocaleString("en-US", { month: "short", year: "numeric" })
}
export function formatRange(project: Project) {
	if (project.project_end_date === project.project_start_date) return formatMonth(project.project_start_date)
	return `${formatMonth(project.project_start_date)} – ${
		project.project_end_date === null ? "Present" : formatMonth(project.project_end_date)
	}`
}
export function projectPath(project: Project) {
	return `/projects/${project.id}/${slugify(project.title)}`
}

export function OngoingBadge({ className = "" }: { className?: string }) {
	return (
		<span className={`inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-xs font-extrabold text-slime-700 ring-1 ring-slate-900/10 ${className}`}>
			<span className="relative flex size-2">
				<span className="relative inline-flex size-2 rounded-full bg-slime-500" />
			</span>
			In progress
		</span>
	)
}

// small dark label shown on hover/focus of its parent (which needs `group/tip relative`)
function Tip({ children, className = "" }: { children: React.ReactNode; className?: string }) {
	return (
		<span
			role="tooltip"
			className={`pointer-events-none absolute z-30 hidden rounded-lg bg-slime-400 px-2.5 py-1.5 text-xs font-extrabold text-slate-900 group-hover/tip:block group-focus-visible/tip:block ${className}`}
		>
			{children}
		</span>
	)
}

// cards show this many stack icons, the rest go in a "+N" bubble (the popup lists all of them)
const MAX_CARD_STACKS = 4

// the whole card opens the project; links, the note and stack icons sit above that so they work on their own
export default function ProjectCard({ project, stacks }: { project: Project; stacks: Stack[] }) {
	const { cover } = getProjectMedia(project)
	const summary = getProjectSummary(project)
	const links = getProjectLinks(project)
	return (
		<article
			id={`project-${project.id}`}
			className="group relative flex scroll-mt-4 flex-col rounded-3xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:border-slate-300 sm:rounded-[2rem]"
		>
			<div className="relative aspect-[2/1] overflow-hidden rounded-t-[calc(1.5rem-1px)] bg-slate-100 sm:aspect-video sm:rounded-t-[calc(2rem-1px)]">
				{cover ? (
					<img
						src={cover}
						alt=""
						loading="lazy"
						className="size-full object-cover transition duration-500 group-hover:scale-105"
					/>
				) : (
					<BlobCover project={project} className="size-full transition duration-500 group-hover:scale-105" />
				)}
				<div className="absolute left-3 top-3 flex gap-2">
					{project.project_end_date === null ? <OngoingBadge /> : null}
				</div>
			</div>


			<div className="flex flex-1 flex-col p-4 sm:p-6">
				<div className="flex items-start justify-between gap-3">
					<p className="shrink-0 text-[11px] font-extrabold uppercase tracking-wider text-slate-400 sm:text-xs">{formatRange(project)}</p>
					{project.disclaimer ? (
						<p className="text-right text-[11px] font-bold leading-snug text-amber-600 sm:text-xs">{project.disclaimer}</p>
					) : null}
				</div>
				<h3 className="mt-0.5 text-xl font-black tracking-tight text-slate-900 transition group-hover:text-slime-600 sm:mt-1 sm:text-2xl">
					{/* stretched link: covers the whole card */}
					<Link to={projectPath(project)} className="after:absolute after:inset-0 after:z-10 after:rounded-[inherit] focus:outline-none focus-visible:underline">
						{project.title}
					</Link>
				</h3>
				{summary ? <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-slate-500 sm:mt-2 sm:line-clamp-3 sm:text-[15px]">{summary}</p> : null}

				<div className="mt-auto flex items-center justify-between gap-3 pt-4 sm:pt-5">
					<div className="flex items-center gap-1.5">
						{links.map(({ url, label, icon: Icon, className }) => (
							<Link
								key={url}
								to={{ hash: `consent=${url}` }}
								aria-label={label}
								className={`group/tip relative z-20 grid size-8 place-items-center rounded-xl transition hover:-translate-y-0.5 sm:size-9 ${className}`}
							>
								<Icon className="size-3.5 sm:size-4" />
								<Tip className="bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap">
									{label}
									<FaArrowUpRightFromSquare className="mb-0.5 ml-1.5 inline-block opacity-70" size={9} />
								</Tip>
							</Link>
						))}
						{links.length && stacks.length ? <span className="mx-1 h-5 w-px bg-slate-200" aria-hidden /> : null}
						<div className="flex -space-x-1.5">
							{stacks.slice(0, MAX_CARD_STACKS).map((stack) => (
								<Link
									key={stack.id}
									to={{ hash: `consent=${stack.url}` }}
									aria-label={stack.key}
									className="group/tip relative z-20 rounded-full transition hover:z-30 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-slime-400"
								>
									<img
										src={cleanURL(stack.image_url || undefined)}
										alt=""
										className="size-7 rounded-full border-2 border-white bg-white p-0.5 ring-1 ring-slate-200 sm:size-8"
									/>
									<Tip className="bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap">
										{stack.key}
										{stack.type ? <span className="ml-1.5 font-semibold text-slime-800">{stack.type}</span> : null}
										<FaArrowUpRightFromSquare className="mb-0.5 ml-1.5 inline-block opacity-70" size={9} />
									</Tip>
								</Link>
							))}
							{stacks.length > MAX_CARD_STACKS ? (
								<span tabIndex={0} className="group/tip relative z-20 grid size-7 place-items-center rounded-full border-2 border-white bg-slate-100 text-[11px] font-extrabold text-slate-600 ring-1 ring-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-slime-400 sm:size-8">
									+{stacks.length - MAX_CARD_STACKS}
									<Tip className="bottom-full right-0 mb-2 whitespace-nowrap">
										{stacks.slice(MAX_CARD_STACKS).map((st) => st.key).join(", ")}
									</Tip>
								</span>
							) : null}
						</div>
					</div>
					<span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-slime-100 px-3 py-1.5 text-xs font-extrabold text-slime-700 transition group-hover:bg-slime-400 group-hover:text-slate-900 sm:gap-2 sm:px-4 sm:py-2 sm:text-sm">
						View project
						<FaArrowRight className="transition group-hover:translate-x-0.5" size={12} />
					</span>
				</div>
			</div>
		</article>
	)
}
