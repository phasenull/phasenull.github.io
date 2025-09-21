import { personal_info } from "@common/constants"
import { useGetAllProjects } from "@common/hooks"
import { tokenizeProjectContent } from "@common/util"
import { FaExternalLinkAlt } from "react-icons/fa"
import { Link } from "react-router"
import ProjectsBodyContainer from "./projects-body-container"
import ProjectsBodyStackContainer from "./projects-body-stack-container"

export default function ProjectsBody() {
	const { error, data, isLoading, isFetching } = useGetAllProjects()
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
						className="bg-blue-50 shadow-md w-[90%] mt-10 border-slate-300 border-1 rounded-xl justify-center lg:max-w-200 px-4 py-4 lg:px-10 lg:py-10 self-center flex flex-col"
						key={project.id}
					>
						<h1 className="text-2xl text-slate-500 lg:text-3xl font-bold text-center my-10">
							{project.title}
							<p className="text-center text-sm text-slate-400">
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
											<ProjectsBodyStackContainer stack={stack} key={stack.id} />
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
						<ProjectsBodyContainer tokens={tokens} />
					</div>
				)
			})}
		</div>
	)
}
