import { tokenizeProjectContent } from "@common/util"
import { Link } from "react-router"

export default function ProjectsBodyStackContainer(props: { stack: any }) {
	const { stack } = props
	return (
		<Link
			to={{hash: `consent=${stack.url}`}}
			key={stack.id}
			className="group relative bg-white rounded-xl justify-center flex text-sm text-slate-400"
		>
			<img
				src={stack.image_url}
				alt={stack.key}
				className="object-contain h-8 w-8 border-[1px] border-slate-200 rounded-xl overflow-clip"
			/>
			<span className="absolute lg:px-2 lg:py-2 bg-white border-1 self-center sm:top-10 sm:bottom-auto bottom-10 z-20 max-h-120 w-max max-w-60 hidden group-active:inline-block lg:group-hover:inline-block">
				<h6>
					{stack.key}
					<div className="bg-blue-400 inline rounded-xl px-2 ml-4 text-white">
						{stack.type}
					</div>
				</h6>
				<p className="font-normal text-[12px] lg:text-[16px]">
					{tokenizeProjectContent(stack.description).map((token, i) => {
						switch (token.type) {
							case "br":
								return <br key={i} />
								return
							case "text":
								return <span key={i}>{token.text}</span>
						}
					})}
				</p>
			</span>
		</Link>
	)
}
