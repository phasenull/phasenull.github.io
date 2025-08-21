import { personal_info } from "@common/constants"
import { useGetAllProjects } from "@common/hooks"
import { tokenizeProjectContent } from "@common/util"
import { FaExternalLinkAlt } from "react-icons/fa"
import { Link } from "react-router"

export default function ProjectsBody() {
	const { error, data, isLoading, isFetching } = useGetAllProjects()
	if (isLoading || isFetching) return <a>loading state</a>
	if (!data || error) return <a>something went wrong: {error?.message} </a>
	// return <h4 className="text-2xl text-center font-bold">database'e proje girmeye çok üşendim az bekleyin</h4>
	return (
		<div className="bg-white flex flex-col justify-center">
			<h4 className="text-2xl text-slate-600 mt-10 lg:text-4xl font-bold font-sans text-center">
				projects i'm proud to display
				<p className="text-sm lg:text-xl text-slate-300">
					for other projects, please visit my{" "}
					<a
						target="_blank"
						href={personal_info.contact.github}
						className="font-bold text-blue-400"
					>
						GitHub
					</a>
				</p>
			</h4>
			{data.projects.map((project, index) => {
				const tokens = tokenizeProjectContent(project.description)
				return (
					<div
						className="bg-blue-50 shadow-md w-[90%] mt-10 border-slate-300 border-1 rounded-xl justify-center lg:max-w-300 px-4 py-2 lg:px-10 lg:py-5 self-center flex flex-col"
						key={project.id}
					>
						<h1 className="text-2xl text-slate-400 lg:text-3xl font-bold text-center my-10">
							{project.title}
							<p className="text-center text-sm text-slate-300">
								{/* format date as June 2024 */}
								{new Date(project.project_start_date).toLocaleString(
									"default",
									{
										month: "long",
										year: "numeric"
									}
								)}
								{" - "}
								{new Date(project.project_end_date).toLocaleString("default", {
									month: "long",
									year: "numeric"
								})}
							</p>
							<div className="flex mt-4 overflow-visible flex-wrap space-x-4 justify-center">
								{data.relations
									.filter((e) => e.project_id === project.id)
									.map((e) => data.stacks.find((s) => s.id === e.stack_id))
									.filter((stack) => !!stack)
									.sort((a, b) => a.type.localeCompare(b.type))
									.map((stack) => {
										if (!stack || !stack.image_url) return
										return (
											<a
												href={stack.url}
												target="_blank"
												key={stack.id}
												className="group relative bg-white rounded-xl justify-center flex text-sm text-slate-400"
											>
												<img
													src={stack.image_url}
													alt={stack.key}
													className="object-contain h-8 w-8 border-[1px] border-slate-200 rounded-xl overflow-clip"
												/>
												<span className="absolute lg:px-2 lg:py-2 bg-white border-1 self-center  top-10 z-20 max-h-60 w-max max-w-60 hidden group-active:inline-block lg:group-hover:inline-block">
													<h6>
														{stack.key}
														<div className="bg-blue-400 inline rounded-xl px-2 ml-4 text-white">
															{stack.type}
														</div>
													</h6>
													<p className="font-normal text-[12px] lg:text-[16px]">
														{tokenizeProjectContent(stack.description).map((token,i)=>{
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
											</a>
										)
									})}
							</div>
						</h1>
						{/* <pre>
					
						{JSON.stringify(
							tokenizeProjectContent(project.description),
							undefined,
							4
						)}
					</pre> */}
						<div>
							{tokens.map((e, i) => {
								const previous_element = tokens[i - 1]
								console.log(e)
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
											<a
												target="_blank"
												className="font-bold text-blue-400 text-xs  lg:text-[16px]"
												key={i}
												href={e.url}
											>
												{e.text}
												<FaExternalLinkAlt className="inline-block mb-1 ml-1" size={8} />
											</a>
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
												className="max-w-full"
											/>
										)
									case "headline":
										return (
											<h2 key={i} className="text-xl mt-2 font-bold">
												{e.text}
											</h2>
										)
								}
							})}
						</div>
					</div>
				)
			})}
		</div>
	)
}
