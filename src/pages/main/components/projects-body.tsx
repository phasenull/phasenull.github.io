import { useGetAllProjects } from "@common/hooks"
import { tokenizeProjectContent } from "@common/util"
import { Link } from "react-router"

export default function ProjectsBody() {
	const { error, data, isLoading, isFetching } = useGetAllProjects()
	if (isLoading || isFetching) return <a>loading state</a>
	if (!data || error) return <a>something went wrong: {error?.message} </a>
	// return <h4 className="text-2xl text-center font-bold">database'e proje girmeye çok üşendim az bekleyin</h4>
	return (
		<div className="bg-white space-y-40">
			<h4 className="text-2xl lg:text-4xl font-bold font-sans text-center">
				projects i'm proud to display
			</h4>
			{data.projects.map((project, index) => (
				<div
					className="justify-center flex flex-col bg-blue-50"
					key={project.id}
				>
					<h1 className="text-2xl lg:text-3xl font-bold text-center my-10">
						{project.title}
					</h1>
					{/* <pre>
					
						{JSON.stringify(
							tokenizeProjectContent(project.description),
							undefined,
							4
						)}
					</pre> */}
					<p className="lg:w-200 self-center ">
						{tokenizeProjectContent(project.description).map((e, i) => {
							switch (e.type) {
								case "text":
									return <span key={i}>{e.text}</span>
								case "ghostlink":
									return (
										<a
											target="_blank"
											className="font-bold text-blue-400"
											key={i}
											href={e.url}
										>
											{e.text}
										</a>
									)
								case "br": {
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
										<h2 key={i} className="text-xl font-bold">
											{e.text}
										</h2>
									)
							}
						})}
					</p>
				</div>
			))}
		</div>
	)
}
