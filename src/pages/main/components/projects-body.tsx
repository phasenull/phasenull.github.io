import { personal_info } from "@common/constants"
import { useGetAllProjects } from "@common/hooks"
import { cleanURL, tokenizeProjectContent } from "@common/util"
import { FaExternalLinkAlt } from "react-icons/fa"
import { Link } from "react-router"
import ProjectsBodyContainer from "./projects-body-container"
import ProjectsBodyStackContainer from "./projects-body-stack-container"
import { CiWarning } from "react-icons/ci"
import { TiWarning } from "react-icons/ti"
import { useEffect } from "react"

export default function ProjectsBody(props: { id?: string; tag?: string }) {
	const { id, tag } = props
	const { error, data, isLoading, isFetching } = useGetAllProjects()

	useEffect(() => {
		if (id) {
			const project = data?.projects.find((p) => p.id === parseInt(id))
			if (project) {
				const bounding_box = document
					.getElementById(`project-${project.id}`)?.scrollIntoView({ behavior: "smooth",block: "start" })
			}
			// focus on that project
		}
	}, [data])
	if (isLoading || isFetching) return <a>loading state</a>
	if (!data || error) return <a>something went wrong: {error?.message} </a>
	// return <h4 className="text-2xl text-center font-bold">database'e proje girmeye çok üşendim az bekleyin</h4>
	return (
		<div className="bg-white flex flex-col justify-center pb-60">
			<h4 className="text-2xl text-slate-600 mt-10 lg:text-4xl font-bold font-sans text-center">
				projects i'm proud to display
				<p className="text-sm lg:text-xl text-slate-300">
					for other projects, please visit my{" "}
					<a
						target="_blank"
						href={cleanURL(personal_info.contact.github)}
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
						className="bg-blue-50 shadow-md w-[90%] border-slate-300 border-1 mt-10 rounded-xl justify-center lg:max-w-200 px-4 py-4 lg:px-10 lg:py-10 self-center flex flex-col"
						key={project.id}
						id={`project-${project.id}`}
					>
						<p className="text-2xl relative text-center text-slate-500 lg:text-3xl font-bold">
							{project.title}
							{project.disclaimer ? (
								<span className="absolute right-10 top-0 self-end flex flex-row items-center group">
									<TiWarning
										className="absolute top-0 left-0 mb-1 ml-1 text-rose-600"
										size={30}
									/>
									<div className="absolute text-[12px] lg:text-[16px] p-2 w-min-1200 font-normal bg-white border-slate-400 border-1 w-max max-w-[240px] text-slate-400 text-sm top-0 right-5 group-active:block sm:group-hover:block hidden">
										{project.disclaimer}
									</div>
								</span>
							) : null}
							<p className="text-center text-sm text-slate-400">
								{/* format date as June 2024 */}
								{new Date(project.project_start_date).toLocaleString(
									"default",
									{
										month: "long",
										year: "numeric"
									}
								)}
								{project.project_end_date === project.project_start_date
									? null
									: " - " +
									  (project.project_end_date === null
											? "ONGOING"
											: new Date(project.project_end_date).toLocaleString(
													"default",
													{
														month: "long",
														year: "numeric"
													}
											  ))}
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
											<ProjectsBodyStackContainer
												stack={stack}
												key={stack.id}
											/>
										)
									})}
							</div>
						</p>
						{/* <pre>
					
						{JSON.stringify(
							tokenizeProjectContent(project.description),
							undefined,
							4
						)}
					</pre> */}
						<ProjectsBodyContainer tokens={tokens} />
					</div>
				)
			})}
		</div>
	)
}
