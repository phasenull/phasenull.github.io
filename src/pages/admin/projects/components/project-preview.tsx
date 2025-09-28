import React from "react"
import { TiWarning } from "react-icons/ti"
import { tokenizeProjectContent } from "@common/util"
import { type IProject } from "@common/admin/project.hooks"
import { type IStack } from "@common/admin/stack.hooks"
import ProjectsBodyContainer from "@pages/main/components/projects-body-container"
import ProjectsBodyStackContainer from "@pages/main/components/projects-body-stack-container"

interface ProjectPreviewProps {
	project: IProject
	stacks: IStack[]
	relations: { stack_id: number; project_id: number }[]
}

export default function ProjectPreview({ project, stacks, relations }: ProjectPreviewProps) {
	const tokens = tokenizeProjectContent(project.description || "")
	
	const projectStacks = relations
		.map(r => stacks.find(s => s.id === r.stack_id))
		.filter((stack): stack is IStack => !!stack && !!stack.image_url)
		.sort((a, b) => a.type.localeCompare(b.type))

	return (
		<div className="p-6">
			<div className="max-w-4xl mx-auto">
				<div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
					<h3 className="text-lg font-semibold text-yellow-800 mb-2">
						🔍 Preview Mode
					</h3>
					<p className="text-yellow-700">
						This is how your project will appear on the public portfolio page. 
						{!project.is_visible && (
							<span className="font-semibold"> Note: This project is currently hidden from the public view.</span>
						)}
					</p>
				</div>

				{/* Project Preview - matches the style from projects-body.tsx */}
				<div className="bg-blue-50 shadow-md border border-slate-300 rounded-xl px-4 py-4 lg:px-10 lg:py-10 flex flex-col">
					<h1 className="text-2xl relative text-center text-slate-500 lg:text-3xl font-bold">
						{project.title || "Untitled Project"}
						
						{project.disclaimer && (
							<span className="absolute right-10 top-0 self-end flex flex-row items-center group">
								<TiWarning
									className="absolute top-0 left-0 mb-1 ml-1 text-rose-600"
									size={30}
								/>
								<div className="absolute text-[12px] lg:text-[16px] p-2 w-min-1200 font-normal bg-white border-slate-400 border-1 w-max max-w-[240px] text-slate-400 text-sm top-0 right-5 group-active:block sm:group-hover:block hidden">
									{project.disclaimer}
								</div>
							</span>
						)}
						
						<p className="text-center text-sm text-slate-400">
							{project.project_start_date ? (
								new Date(project.project_start_date).toLocaleString("default", {
									month: "long",
									year: "numeric"
								})
							) : "No start date"}
							
							{project.project_end_date && project.project_end_date !== project.project_start_date ? (
								" - " + (
									project.project_end_date === null
										? "ONGOING"
										: new Date(project.project_end_date).toLocaleString("default", {
											month: "long",
											year: "numeric"
										})
								)
							) : project.project_end_date === null && project.project_start_date ? (
								" - ONGOING"
							) : null}
						</p>
						
						{/* Technology Stack */}
						<div className="flex mt-4 overflow-visible flex-wrap space-x-4 justify-center">
							{projectStacks.map((stack) => (
								<ProjectsBodyStackContainer
									stack={stack}
									key={stack.id}
								/>
							))}
						</div>
					</h1>

					{/* Project Description Content */}
					<ProjectsBodyContainer tokens={tokens} />

					{/* Additional Preview Info */}
					<div className="mt-6 pt-4 border-t border-slate-300">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
							{project.url && (
								<div>
									<strong className="text-slate-600">Project URL:</strong>
									<br />
									<a 
										href={project.url} 
										target="_blank" 
										rel="noopener noreferrer"
										className="text-blue-600 hover:text-blue-800 underline break-all"
									>
										{project.url}
									</a>
								</div>
							)}
							
							{project.repo_url && (
								<div>
									<strong className="text-slate-600">Repository:</strong>
									<br />
									<a 
										href={project.repo_url} 
										target="_blank" 
										rel="noopener noreferrer"
										className="text-blue-600 hover:text-blue-800 underline break-all"
									>
										{project.repo_url}
									</a>
								</div>
							)}
						</div>

						{project.thumbnail_url && (
							<div className="mt-4">
								<strong className="text-slate-600">Thumbnail:</strong>
								<div className="mt-2">
									<img 
										src={project.thumbnail_url} 
										alt="Project thumbnail"
										className="max-w-xs h-auto rounded border border-slate-300"
										onError={(e) => {
											e.currentTarget.style.display = "none"
										}}
									/>
								</div>
							</div>
						)}
					</div>
				</div>

				{/* Project Status & Info */}
				<div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
					<h3 className="text-lg font-semibold text-gray-800 mb-3">Project Information</h3>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
						<div>
							<strong className="text-gray-600">Project ID:</strong>
							<br />
							{project.id}
						</div>
						<div>
							<strong className="text-gray-600">Created:</strong>
							<br />
							{new Date(project.created_at).toLocaleDateString()}
						</div>
						<div>
							<strong className="text-gray-600">Visibility:</strong>
							<br />
							<span className={`px-2 py-1 rounded text-xs font-medium ${
								project.is_visible 
									? "bg-green-100 text-green-800" 
									: "bg-red-100 text-red-800"
							}`}>
								{project.is_visible ? "Public" : "Hidden"}
							</span>
						</div>
						{project.org_id && (
							<div>
								<strong className="text-gray-600">Organization ID:</strong>
								<br />
								{project.org_id}
							</div>
						)}
					</div>

					{projectStacks.length > 0 && (
						<div className="mt-4">
							<strong className="text-gray-600">Technologies ({projectStacks.length}):</strong>
							<div className="mt-2 flex flex-wrap gap-2">
								{projectStacks.map((stack) => (
									<span 
										key={stack.id} 
										className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded font-medium flex items-center gap-1"
									>
										{stack.image_url && (
											<img 
												src={stack.image_url} 
												alt={stack.key}
												className="w-3 h-3 object-contain"
											/>
										)}
										{stack.key}
									</span>
								))}
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}