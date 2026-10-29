import { cleanURL, tokenizeProjectContent } from "@common/util"
import { Link } from "react-router"

export default function ProjectsBodyStackContainer(props: { stack: any }) {
	const { stack } = props
	return (
		<Link
			to={{ hash: `consent=${stack.url}` }}
			key={stack.id}
			className="group relative inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 py-1 pl-1 pr-3 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-white"
		>
			<img
				src={cleanURL(stack.image_url)}
				alt=""
				className="size-6 rounded-full bg-white object-contain p-0.5"
			/>
			{stack.key}
			<span className="pointer-events-none absolute bottom-full left-0 z-20 mb-2 hidden w-72 rounded-xl border border-slate-200 bg-white p-3 text-left text-xs font-normal leading-relaxed text-slate-500 group-hover:block">
				<span className="mb-1 flex items-center gap-2 text-sm font-semibold text-slate-800">
					{stack.key}
					{stack.type ? (
						<span className="rounded-full bg-slime-50 px-2 py-0.5 text-[11px] font-semibold text-slime-700">
							{stack.type}
						</span>
					) : null}
				</span>
				{tokenizeProjectContent(stack.description || "").map((token, i) => {
					switch (token.type) {
						case "br":
							return <br key={i} />
						case "text":
							return <span key={i}>{token.text}</span>
					}
				})}
			</span>
		</Link>
	)
}
