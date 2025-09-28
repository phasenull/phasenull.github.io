import React, { useState, useEffect } from "react"
import { FaSave, FaTimes, FaPlus, FaTrash } from "react-icons/fa"
import { mutateProjectUpdate, type IProject } from "@common/admin/project.hooks"
import { useGetAllStacks, type IStack } from "@common/admin/stack.hooks"

interface ProjectEditFormProps {
	project: IProject
	stacks: IStack[]
	relations: { stack_id: number; project_id: number }[]
	onUpdate: () => void
}

export default function ProjectEditForm({ project, stacks, relations, onUpdate }: ProjectEditFormProps) {
	const [formData, setFormData] = useState<Partial<IProject>>(project)
	const [selectedStackIds, setSelectedStackIds] = useState<number[]>(
		relations.map(r => r.stack_id)
	)
	const [isSaving, setIsSaving] = useState(false)
	
	const { data: allStacksData } = useGetAllStacks()
	const updateProjectMutation = mutateProjectUpdate()

	const availableStacks = allStacksData?.stacks || []

	const handleInputChange = (field: keyof IProject, value: any) => {
		setFormData(prev => ({
			...prev,
			[field]: value
		}))
	}

	const handleStackToggle = (stackId: number) => {
		setSelectedStackIds(prev => 
			prev.includes(stackId)
				? prev.filter(id => id !== stackId)
				: [...prev, stackId]
		)
	}

	const handleSave = async () => {
		try {
			setIsSaving(true)
			
			// Update project data
			const projectUpdate = {
				...formData,
				id: project.id,
				_isModified: true
			}

			await updateProjectMutation.mutateAsync(projectUpdate)
			
			// TODO: Handle stack relations update - this would need a separate API endpoint
			// or include relations in the project update
			
			onUpdate()
			alert("Project updated successfully!")
		} catch (error) {
			console.error("Failed to update project:", error)
			alert("Failed to update project. Please try again.")
		} finally {
			setIsSaving(false)
		}
	}

	const handleReset = () => {
		setFormData(project)
		setSelectedStackIds(relations.map(r => r.stack_id))
	}

	return (
		<div className="p-6">
			<div className="max-w-4xl mx-auto">
				{/* Form Actions */}
				<div className="flex justify-end gap-2 mb-6">
					<button
						onClick={handleReset}
						className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50"
						disabled={isSaving}
					>
						<FaTimes />
						Reset
					</button>
					<button
						onClick={handleSave}
						className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
						disabled={isSaving}
					>
						<FaSave />
						{isSaving ? "Saving..." : "Save Changes"}
					</button>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					{/* Basic Information */}
					<div className="space-y-4">
						<h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
							Basic Information
						</h3>
						
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Title *
							</label>
							<input
								type="text"
								value={formData.title || ""}
								onChange={(e) => handleInputChange("title", e.target.value)}
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
								placeholder="Project title..."
								required
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Description
							</label>
							<textarea
								value={formData.description || ""}
								onChange={(e) => handleInputChange("description", e.target.value)}
								rows={4}
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
								placeholder="Project description with tokenized content..."
							/>
							<p className="text-xs text-gray-500 mt-1">
								Use %{`{GHOSTLINK}%text|url%{GHOSTLINK}%`}, %{`{IMAGE}%alt|url%{IMAGE}%`}, etc. for rich content
							</p>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Start Date
								</label>
								<input
									type="date"
									value={formData.project_start_date?.split('T')[0] || ""}
									onChange={(e) => handleInputChange("project_start_date", e.target.value)}
									className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									End Date
								</label>
								<input
									type="date"
									value={formData.project_end_date?.split('T')[0] || ""}
									onChange={(e) => handleInputChange("project_end_date", e.target.value)}
									className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
								/>
							</div>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Thumbnail URL
							</label>
							<input
								type="url"
								value={formData.thumbnail_url || ""}
								onChange={(e) => handleInputChange("thumbnail_url", e.target.value)}
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
								placeholder="https://..."
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Disclaimer
							</label>
							<textarea
								value={formData.disclaimer || ""}
								onChange={(e) => handleInputChange("disclaimer", e.target.value)}
								rows={3}
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
								placeholder="Optional warning or disclaimer text..."
							/>
						</div>
					</div>

					{/* Links and Settings */}
					<div className="space-y-4">
						<h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
							Links & Settings
						</h3>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Project URL
							</label>
							<input
								type="url"
								value={formData.url || ""}
								onChange={(e) => handleInputChange("url", e.target.value)}
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
								placeholder="https://project-demo.com"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Repository URL
							</label>
							<input
								type="url"
								value={formData.repo_url || ""}
								onChange={(e) => handleInputChange("repo_url", e.target.value)}
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
								placeholder="https://github.com/..."
							/>
						</div>

						<div>
							<label className="flex items-center gap-2 text-sm font-medium text-gray-700">
								<input
									type="checkbox"
									checked={formData.is_visible || false}
									onChange={(e) => handleInputChange("is_visible", e.target.checked)}
									className="rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
								/>
								Visible on portfolio
							</label>
							<p className="text-xs text-gray-500 mt-1">
								Whether this project should be displayed on the public portfolio
							</p>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Organization ID
							</label>
							<input
								type="number"
								value={formData.org_id || ""}
								onChange={(e) => handleInputChange("org_id", parseInt(e.target.value) || null)}
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
								placeholder="Optional organization ID"
							/>
						</div>

						{/* Technology Stack */}
						<div>
							<h4 className="text-md font-semibold text-gray-700 mb-3">
								Technology Stack
							</h4>
							<div className="space-y-2 max-h-64 overflow-y-auto border border-gray-200 rounded-md p-3">
								{availableStacks.map((stack) => (
									<label key={stack.id} className="flex items-center gap-3">
										<input
											type="checkbox"
											checked={selectedStackIds.includes(stack.id)}
											onChange={() => handleStackToggle(stack.id)}
											className="rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
										/>
										<div className="flex items-center gap-2">
											{stack.image_url && (
												<img
													src={stack.image_url}
													alt={stack.key}
													className="w-4 h-4 object-contain"
												/>
											)}
											<span className="text-sm text-gray-700">{stack.key}</span>
											<span className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded">
												{stack.type}
											</span>
										</div>
									</label>
								))}
							</div>
							<p className="text-xs text-gray-500 mt-1">
								Select the technologies used in this project
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}