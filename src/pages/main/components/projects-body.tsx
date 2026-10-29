import { personal_info } from "@common/constants"
import { useGetAllProjects } from "@common/hooks"
import { cleanURL, tokenizeProjectContent } from "@common/util"
import { useEffect } from "react"
import { FaGithub } from "react-icons/fa6"
import ProjectCard from "./project-card"
import ProjectModal from "./project-modal"
import ProjectRail, { MobileProjectNav, ScrollProgress } from "./project-rail"
import type { Project } from "./project-media"

export default function ProjectsBody(props: { id?: string; tag?: string }) {
	const { id } = props
	const { error, data, isLoading, isFetching, refetch } = useGetAllProjects()
	const selected = id ? data?.projects.find((p) => p.id === parseInt(id)) : undefined

	useEffect(() => {
		if (!selected) return
		// change metadata
		const metaDescription = document.querySelector('meta[name="description"]')
		function getDescriptionContent() {
			const tokens = tokenizeProjectContent(selected!.description || "")
			let descriptionText = ""
			tokens.forEach((token) => {
				if (["text", "link", "headline", "ghostlink"].includes(token.type)) {
					descriptionText += (token as any).text
				}
				if (token.type === "br") {
					descriptionText += " "
				}
			})
			return descriptionText || `A project by ${personal_info.call_me}`
		}
		document.title = `${selected.title} — phasenull`
		if (metaDescription) {
			if (!metaDescription.getAttribute("data-project"))
				metaDescription.setAttribute("data-home", metaDescription.getAttribute("content") || "")
			metaDescription.setAttribute("data-project", "1")
			metaDescription.setAttribute("content", getDescriptionContent())
		} else {
			const meta = document.createElement("meta")
			meta.name = "description"
			meta.content = getDescriptionContent()
			document.head.appendChild(meta)
		}
	}, [selected?.id])

	const stacksFor = (project: Project) =>
		data
			? data.relations
					.filter((e) => e.project_id === project.id)
					.map((e) => data.stacks.find((s) => s.id === e.stack_id))
					.filter((stack) => !!stack && !!stack.image_url)
					.sort((a, b) => (a!.type || "").localeCompare(b!.type || ""))
					.map((stack) => stack!)
			: []

	const projects = data
		? [...data.projects].sort((a, b) => {
				if (a.project_end_date === null) return -1
				if (b.project_end_date === null) return 1
				const dateA = new Date(a.project_end_date)
				const dateB = new Date(b.project_end_date)
				return dateB.getTime() - dateA.getTime()
		  })
		: []
	const visible = projects

	return (
		<section className="mt-10 sm:mt-24 ultrawide:-mx-[calc((min(1720px,100vw-10rem)-100%)/2)]">
			<div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-5">
				<div>
					<h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-5xl">
						some of my{" "}
						<span className="relative inline-block">
							<span className="relative z-10">projects</span>
							<span className="absolute inset-x-0 bottom-0.5 -z-0 h-3 -rotate-1 rounded-full bg-slime-300/70 sm:bottom-1 sm:h-5" />
						</span>
					</h2>
					<p className="mt-1.5 text-sm font-semibold text-slate-500 sm:mt-3 sm:text-lg">
						for other projects, please visit my{" "}
						<a
							target="_blank"
							rel="noopener noreferrer"
							href={cleanURL(personal_info.contact.github)}
							className="inline-flex items-center gap-1.5 font-extrabold text-slate-900 underline decoration-slime-400 decoration-4 underline-offset-4 hover:decoration-sky-blob"
						>
							<FaGithub />
							GitHub
						</a>
					</p>
				</div>
			</div>

			<div className="mt-6 sm:mt-10">
				{isLoading || (isFetching && !data) ? (
					<div className="grid gap-4 sm:grid-cols-2 sm:gap-6 ultrawide:grid-cols-3">
						{[0, 1, 2, 3].map((i) => (
							<div key={i} className="animate-pulse overflow-hidden rounded-[2rem] border border-slate-200 bg-white">
								<div className="aspect-video bg-slime-100" />
								<div className="space-y-3 p-6">
									<div className="h-3 w-24 rounded bg-slate-100" />
									<div className="h-6 w-1/2 rounded bg-slate-100" />
									<div className="h-12 rounded bg-slate-100" />
								</div>
							</div>
						))}
					</div>
				) : !data || error ? (
					<div className="rounded-[2rem] border border-slate-200 bg-white p-8 text-center">
						<p className="text-xl font-black text-slate-900">Couldn't load projects 😵</p>
						<p className="mt-1 text-sm text-slate-500">{error?.message}</p>
						<button
							onClick={() => refetch()}
							className="mt-5 rounded-2xl bg-slime-400 px-5 py-2.5 text-sm font-extrabold text-slate-900 hover:-translate-y-0.5"
						>
							Try again
						</button>
					</div>
				) : (
					<>
						<div className="relative">
							<div id="project-grid" className="grid gap-4 sm:grid-cols-2 sm:gap-6 ultrawide:grid-cols-3">
								{visible.map((project) => (
									<ProjectCard key={project.id} project={project} stacks={stacksFor(project)} />
								))}
							</div>
							<ProjectRail projects={visible} />
						</div>
						<MobileProjectNav projects={visible} gridId="project-grid" />
						{/* a visible end to the list */}
						<div className="mt-14 flex flex-col items-center gap-4 text-center">
							<div className="flex items-center gap-3 text-slate-300" aria-hidden>
								<span className="h-0.5 w-16 rounded-full bg-gradient-to-r from-transparent to-slime-300" />
								<span className="size-2.5 rounded-full bg-slime-400" />
								<span className="h-0.5 w-16 rounded-full bg-gradient-to-l from-transparent to-slime-300" />
							</div>
							<p className="text-base font-black text-slate-800 sm:text-lg">
								that's all {visible.length} project{visible.length === 1 ? "" : "s"}
							</p>
							<a
								target="_blank"
								rel="noopener noreferrer"
								href={cleanURL(personal_info.contact.github)}
								className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-2.5 text-sm font-extrabold text-white transition hover:-translate-y-0.5"
							>
								<FaGithub size={16} />
								more on my GitHub
							</a>
						</div>
					</>
				)}
			<ScrollProgress />
			</div>

			{selected ? <ProjectModal key={selected.id} project={selected} stacks={stacksFor(selected)} /> : null}
		</section>
	)
}
