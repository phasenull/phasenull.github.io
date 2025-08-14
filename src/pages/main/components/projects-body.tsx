import { useGetAllProjects } from "@common/hooks"

export default function ProjectsBody() {
	const {error, data, isLoading, isFetching } = useGetAllProjects()
	if (isLoading || isFetching) return <a>loading state</a>
	if (!data || error) return <a>something went wrong: {error?.message} </a>
	return <h4 className="text-2xl text-center font-bold">database'e proje girmeye çok üşendim az bekleyin</h4>
	return (
		<div className="bg-white">
			<h4 className="text-2xl lg:text-4xl font-bold font-sans text-center">
				projects i'm proud to display
			</h4>
			{[...data.projects,...data.projects,...data.projects,...data.projects].map((project,index) => (
				<a key={project.id}>
					<br />
					Random Project-{index}
					{project.title}
					{project.description	}
				</a>
			))}
		</div>
	)
}
