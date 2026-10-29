import { cleanURL, tokenizeProjectContent } from "@common/util"
import type { useGetAllProjects } from "@common/hooks"
import type { IconType } from "react-icons"
import { FaCode, FaGithub, FaGlobe, FaNpm, FaYoutube } from "react-icons/fa6"
import { SiRoblox } from "react-icons/si"

type ProjectsData = NonNullable<ReturnType<typeof useGetAllProjects>["data"]>
export type Project = ProjectsData["projects"][number]
export type Stack = ProjectsData["stacks"][number]

const YOUTUBE_ID = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/

// everything visual a project has: images from its description, its thumbnail and a linked YouTube video
export function getProjectMedia(project: Project) {
	const tokens = tokenizeProjectContent(project.description || "") as any[]
	const images: string[] = []
	let youtube_id: string | undefined
	for (const token of tokens) {
		if (token.type === "image") images.push(token.url)
		if (token.type === "image_carousel") images.push(...token.url.split(","))
		if (token.type === "ghostlink" && !youtube_id) youtube_id = token.url.match(YOUTUBE_ID)?.[1]
	}
	const clean_images = images.map((url) => cleanURL(url.trim())).filter(Boolean) as string[]
	const thumbnail = cleanURL(project.thumbnail_url || undefined)
	// the id is validated by the regex, so building the thumbnail url ourselves is safe
	const youtube_thumbnail = youtube_id ? `https://img.youtube.com/vi/${youtube_id}/hqdefault.jpg` : undefined
	return {
		images: clean_images,
		youtube_id,
		cover: clean_images[0] || youtube_thumbnail || thumbnail,
		youtube_url: youtube_id ? `https://www.youtube.com/watch?v=${youtube_id}` : undefined
	}
}

export type ProjectLink = { url: string; label: string; icon: IconType; className: string }

// the project's outbound links (game, source, package, demo video), labelled by where they point
export function getProjectLinks(project: Project): ProjectLink[] {
	const links: ProjectLink[] = []
	const add = (url: string, kind: "url" | "repo") => {
		let host = ""
		try {
			host = new URL(url).hostname
		} catch {
			return
		}
		if (host.endsWith("roblox.com")) links.push({ url, label: "Play on Roblox", icon: SiRoblox, className: "bg-[#335fff] text-white" })
		else if (host.endsWith("npmjs.com")) links.push({ url, label: "npm", icon: FaNpm, className: "bg-[#cb3837] text-white" })
		else if (host.endsWith("github.com"))
			links.push({ url, label: kind === "repo" ? "Source code" : "GitHub", icon: FaGithub, className: "bg-slate-900 text-white" })
		else if (kind === "repo") links.push({ url, label: "Source code", icon: FaCode, className: "bg-slate-900 text-white" })
		else links.push({ url, label: "Website", icon: FaGlobe, className: "bg-slime-400 text-slate-900" })
	}
	if (project.url) add(project.url, "url")
	if (project.repo_url && project.repo_url !== project.url) add(project.repo_url, "repo")
	const { youtube_url } = getProjectMedia(project)
	if (youtube_url) links.push({ url: youtube_url, label: "Watch demo", icon: FaYoutube, className: "bg-[#ff0033] text-white" })
	return links
}

// first paragraph of the description as plain text, for the card preview
export function getProjectSummary(project: Project) {
	const tokens = tokenizeProjectContent(project.description || "") as any[]
	let summary = ""
	for (const token of tokens) {
		if (token.type === "br") {
			if (summary.endsWith("\n")) break
			summary += "\n"
			continue
		}
		if (["headline", "image", "image_carousel", "video"].includes(token.type)) break
		if (token.type === "text" && /^\s*-\s/.test(token.text) && summary) break
		summary += token.text
	}
	return summary.replace(/\s+/g, " ").trim()
}

const PALETTES = [
	["#3ee68b", "#3d8be6"],
	["#8b5cf6", "#3d8be6"],
	["#3ee68b", "#8b5cf6"],
	["#f59e0b", "#ec4899"],
	["#3d8be6", "#22d3ee"],
	["#ec4899", "#8b5cf6"]
]

// colourful blob cover in the banner's style, for projects without an image
export function BlobCover({ project, className = "" }: { project: Project; className?: string }) {
	const [from, to] = PALETTES[project.id % PALETTES.length]
	return (
		<div className={`relative overflow-hidden ${className}`} style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}>
			<svg className="absolute inset-0 size-full" viewBox="0 0 400 225" preserveAspectRatio="xMidYMid slice" aria-hidden>
				<path d="M-20 160 C 40 110, 110 210, 170 150 S 260 60, 320 120 S 420 200, 430 140 L 430 260 L -20 260 Z" fill="white" opacity="0.12" />
				<path d="M250 -30 C 300 20, 230 70, 290 110 S 400 90, 420 30 L 420 -30 Z" fill="white" opacity="0.16" />
				<circle cx="70" cy="50" r="38" fill="white" opacity="0.1" />
			</svg>
			<div className="absolute inset-0 grid place-items-center p-6">
				<span className="text-center text-2xl font-black tracking-tight text-white sm:text-4xl">
					{project.title}
				</span>
			</div>
		</div>
	)
}
