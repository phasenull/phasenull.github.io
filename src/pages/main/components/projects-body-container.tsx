import { FaExternalLinkAlt } from "react-icons/fa"
import VideoWrapper from "./video-wrapper"
import { Link } from "react-router"

export default function ProjectsBodyContainer(props: { tokens: any[] }) {
	const { tokens } = props

	return (
		<div>
			{tokens.map((e, i) => {
				const previous_element = tokens[i - 1]
				switch (e.type) {
					case "text":
						return (
							<span
								className="text-xs text-slate-700 leading-1 lg:text-[16px]"
								key={i}
							>
								{e.text}
							</span>
						)
					case "ghostlink":
						return (
							<Link
								className="font-bold text-blue-400 text-xs  lg:text-[16px]"
								key={i}
								to={{hash: `consent=${e.url}`}}
							>
								{e.text}
								<FaExternalLinkAlt
									className="inline-block mb-1 ml-1"
									size={8}
								/>
							</Link>
						)
					case "br": {
						if (previous_element.type === "headline") return
						return <br key={i} />
					}
					case "image":
						return (
							<img
								key={i}
								src={e.url}
								alt={e.text}
								className="max-h-200 object-contain object-left w-full rounded-2xl"
							/>
						)
					case "headline":
						return (
							<h2 key={i} className="text-xl mt-2 font-bold">
								{e.text}
							</h2>
						)
					case "video":
						return (
							<VideoWrapper key={i} controls className="max-h-200 w-full rounded-2xl">
								<source src={e.url} type="video/mp4" />
								Your browser does not support the video tag.
							</VideoWrapper>
						)
				}
			})}
		</div>
	)
}
