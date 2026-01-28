import { FaExternalLinkAlt } from "react-icons/fa"
import VideoWrapper from "./video-wrapper"
import { Link } from "react-router"
import { cleanURL } from "@common/util"
import ImageCarousel from "./image-carousel"

export default function ProjectsBodyContainer(props: { tokens: any[] }) {
	const { tokens } = props

	// Separate tokens into text content and media content
	const mediaTypes = ["image", "image_carousel", "video"]
	const hasMedia = tokens.some((t) => mediaTypes.includes(t.type))

	const renderToken = (e: any, i: number, previous_element?: any) => {
		switch (e.type) {
			case "text":
				return (
					<span
						className="text-xs text-slate-700 lg:text-[16px]"
						key={i}
					>
						{e.text}
					</span>
				)
			case "ghostlink":
				return (
					<Link
						className="font-bold text-blue-400 text-xs lg:text-[16px]"
						key={i}
						to={{ hash: `consent=${e.url}` }}
					>
						{e.text}
						<FaExternalLinkAlt
							className="inline-block mb-1 ml-1"
							size={8}
						/>
					</Link>
				)
			case "br": {
				if (previous_element?.type === "headline") return null
				return <br key={i} />
			}
			case "image":
				return (
					<img
						key={i}
						src={cleanURL(e.url)}
						alt={e.text}
						className="max-h-96 object-contain w-full rounded-2xl"
					/>
				)
			case "image_carousel":
				return (
					<ImageCarousel
						key={i}
						urls={e.url.split(",")}
						alt={e.text}
					/>
				)
			case "headline":
				return (
					<p key={i} className="text-xl text-slate-500 mt-2 font-bold">
						{e.text}
					</p>
				)
			case "video":
				return (
					<VideoWrapper
						key={i}
						controls
						className="max-h-96 w-full rounded-2xl"
					>
						<source src={cleanURL(e.url)} type="video/mp4" />
						Your browser does not support the video tag.
					</VideoWrapper>
				)
			default:
				return null
		}
	}
	const leading = "leading-3"
	if (!hasMedia) {
		// No media - render all tokens normally
		return (
			<div className={`${leading}`}>
				{tokens.map((e, i) => renderToken(e, i, tokens[i - 1]))}
			</div>
		)
	}

	// Has media - split into text (left) and media (right) on desktop
	return (
		<div className="flex flex-col lg:flex-row lg:gap-6">
			{/* Text content - left side on desktop */}
			<div className={`${leading} lg:flex-1`}>
				{tokens.map((e, i) => {
					if (mediaTypes.includes(e.type)) return null
					return renderToken(e, i, tokens[i - 1])
				})}
			</div>
			{/* Media content - right side on desktop */}
			<div className="lg:w-1/2 lg:flex-shrink-0 mt-4 lg:mt-0">
				{tokens.map((e, i) => {
					if (!mediaTypes.includes(e.type)) return null
					return renderToken(e, i, tokens[i - 1])
				})}
			</div>
		</div>
	)
}
