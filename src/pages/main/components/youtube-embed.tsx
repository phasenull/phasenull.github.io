import { useState } from "react"
import { FaPlay } from "react-icons/fa6"

// thumbnail with a play button; the YouTube player (and its scripts) only load once it is pressed
// `flush` drops the rounded corners, for when the player fills its container edge to edge
export default function YouTubeEmbed({ id, title, flush = false }: { id: string; title: string; flush?: boolean }) {
	const corners = flush ? "" : "rounded-2xl"
	const [playing, setPlaying] = useState(false)
	if (!/^[\w-]{11}$/.test(id)) return null
	if (playing)
		return (
			<iframe
				className={`block aspect-video w-full bg-black ${corners}`}
				src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
				title={title}
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
				referrerPolicy="strict-origin-when-cross-origin"
				allowFullScreen
			/>
		)
	return (
		<button
			type="button"
			onClick={() => setPlaying(true)}
			aria-label={`Play video: ${title}`}
			className={`group relative block aspect-video w-full overflow-hidden bg-black ${corners}`}
		>
			<img
				src={`https://img.youtube.com/vi/${id}/hqdefault.jpg`}
				alt=""
				className="size-full object-cover opacity-90 transition group-hover:opacity-100"
			/>
			<span className="absolute inset-0 grid place-items-center">
				<span className="grid size-16 place-items-center rounded-2xl bg-[#ff0033] text-white transition group-hover:scale-105 sm:size-20">
					<FaPlay className="ml-1 size-6 sm:size-8" />
				</span>
			</span>
		</button>
	)
}
