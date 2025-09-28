import React, { useState } from "react"
import { useParams, useNavigate } from "react-router"
import { FaArrowLeft, FaEye, FaEdit, FaSave, FaTimes } from "react-icons/fa"
import { useGetProjectDetails } from "@common/admin/project.hooks"
import ProjectEditForm from "./components/project-edit-form"
import ProjectPreview from "./components/project-preview"

export default function ProjectEditPage() {
	const { id } = useParams<{ id: string }>()
	const navigate = useNavigate()
	const [mode, setMode] = useState<"edit" | "preview">("edit")
	
	const projectId = parseInt(id || "0", 10)
	const { data, isLoading, error, refetch } = useGetProjectDetails(projectId)

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-64">
				<div className="text-lg text-gray-600">Loading project...</div>
			</div>
		)
	}

	if (error || !data?.project) {
		return (
			<div className="flex items-center justify-center h-64">
				<div className="text-lg text-red-600">
					Error loading project: {error?.message || "Project not found"}
				</div>
			</div>
		)
	}

	return (
		<div className="p-6 max-w-7xl mx-auto">
			{/* Header */}
			<div className="mb-6 border-b border-gray-200 pb-4">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-4">
						<button
							onClick={() => navigate("/admin/projects")}
							className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-700"
						>
							<FaArrowLeft />
							Back to Projects
						</button>
						<div>
							<h1 className="text-2xl font-bold text-gray-800">
								Edit Project: {data.project.title || "Untitled"}
							</h1>
							<p className="text-gray-600">Project ID: {data.project.id}</p>
						</div>
					</div>

					{/* Mode Toggle */}
					<div className="flex bg-gray-100 rounded-lg p-1">
						<button
							onClick={() => setMode("edit")}
							className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
								mode === "edit"
									? "bg-white text-orange-400 shadow-sm"
									: "text-gray-600 hover:text-gray-800"
							}`}
						>
							<FaEdit />
							Edit Mode
						</button>
						<button
							onClick={() => setMode("preview")}
							className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
								mode === "preview"
									? "bg-white text-green-600 shadow-sm"
									: "text-gray-600 hover:text-gray-800"
							}`}
						>
							<FaEye />
							Preview Mode
						</button>
					</div>
				</div>
			</div>

			{/* Content */}
			<div className="bg-white rounded-lg shadow-lg">
				{mode === "edit" ? (
					<ProjectEditForm 
						project={data.project}
						stacks={data.stacks}
						relations={data.relations}
						onUpdate={refetch}
					/>
				) : (
					<ProjectPreview 
						project={data.project}
						stacks={data.stacks}
						relations={data.relations}
					/>
				)}
			</div>
		</div>
	)
}