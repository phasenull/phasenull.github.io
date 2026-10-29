import { tokenizeProjectContent } from "@common/util"
import { useEffect } from "react"
import { FaArrowUpRightFromSquare, FaTriangleExclamation, FaXmark } from "react-icons/fa6"
import { Link, useNavigate } from "react-router"
import ImageCarousel from "./image-carousel"
import ProjectsBodyContainer from "./projects-body-container"
import ProjectsBodyStackContainer from "./projects-body-stack-container"
import { BlobCover, getProjectLinks, getProjectMedia, type Project, type Stack } from "./project-media"
import { formatRange, OngoingBadge } from "./project-card"
import YouTubeEmbed from "./youtube-embed"

export default function ProjectModal({ project, stacks }: { project: Project; stacks: Stack[] }) {
	const navigate = useNavigate()
	const close = () => navigate("/")
	const { images, youtube_id } = getProjectMedia(project)
	const links = getProjectLinks(project)
	// the header shows the project's real media; the description then skips its own copies of it
	const has_media = !!youtube_id || images.length > 0

	useEffect(() => {
		const onKeyDown = (e: KeyboardEvent) => {
			// the link dialog and the image lightbox handle their own Escape
			if (e.key !== "Escape" || location.hash.startsWith("#consent=") || document.querySelector("[data-lightbox]")) return
			close()
		}
		document.addEventListener("keydown", onKeyDown)
		const overflow = document.body.style.overflow
		document.body.style.overflow = "hidden"
		return () => {
			document.removeEventListener("keydown", onKeyDown)
			document.body.style.overflow = overflow
		}
	}, [])

	return (
		<div
			className="fixed inset-0 z-[100] overflow-y-auto bg-slate-900/60"
			onClick={close}
			role="dialog"
			aria-modal="true"
			aria-label={project.title}
		>
			<div className="mx-auto my-0 min-h-full max-w-4xl sm:my-12 sm:min-h-0 sm:px-4">
				<article className="relative overflow-hidden bg-white sm:rounded-[2rem]" onClick={(e) => e.stopPropagation()}>
					{youtube_id ? (
						// the video fills the top of the popup edge to edge
						<YouTubeEmbed id={youtube_id} title={project.title} flush />
					) : images.length ? (
						<div className="bg-slate-100 p-3 pt-14 sm:p-5 sm:pt-16">
							<ImageCarousel urls={images} alt={project.title} />
						</div>
					) : (
						<BlobCover project={{ ...project, title: "" }} className="h-16 sm:h-32" />
					)}
					<button
						type="button"
						onClick={close}
						aria-label="Close"
						className="absolute right-3 top-3 z-10 grid size-9 place-items-center rounded-full bg-white text-slate-700 ring-1 ring-slate-900/10 transition hover:bg-slate-50 sm:right-4 sm:top-4 sm:size-10"
					>
						<FaXmark size={18} />
					</button>

					<div className="px-4 pb-8 pt-4 sm:px-10 sm:pb-10 sm:pt-6">
						<div className="flex flex-wrap items-center gap-2">
							<p className="text-xs font-extrabold uppercase tracking-wider text-slate-400">{formatRange(project)}</p>
							{project.project_end_date === null ? <OngoingBadge /> : null}
						</div>
						<h2 className="mt-1 text-2xl font-black tracking-tight text-slate-900 sm:text-4xl">{project.title}</h2>

						{links.length ? (
							<div className="mt-4 flex flex-wrap gap-2 sm:mt-5 sm:gap-2.5">
								{links.map(({ url, label, icon: Icon, className }) => (
									<Link
										key={url}
										to={{ hash: `consent=${url}` }}
										className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-extrabold transition hover:-translate-y-0.5 sm:rounded-2xl sm:px-4 sm:py-2.5 sm:text-sm ${className}`}
									>
										<Icon size={16} />
										{label}
										<FaArrowUpRightFromSquare className="opacity-60" size={10} />
									</Link>
								))}
							</div>
						) : null}

						{project.disclaimer ? (
							<div className="mt-5 flex items-start gap-3 rounded-2xl bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800 ring-1 ring-amber-200">
								<FaTriangleExclamation className="mt-0.5 shrink-0 text-amber-500" />
								<span>{project.disclaimer}</span>
							</div>
						) : null}

						{stacks.length ? (
							<div className="mt-5 flex flex-wrap gap-2">
								{stacks.map((stack) => (
									<ProjectsBodyStackContainer stack={stack} key={stack.id} />
								))}
							</div>
						) : null}

						<div className="mt-5 sm:mt-6">
							<ProjectsBodyContainer
								tokens={tokenizeProjectContent(project.description || "")}
								hideMedia={has_media}
							/>
						</div>
					</div>
				</article>
			</div>
		</div>
	)
}
