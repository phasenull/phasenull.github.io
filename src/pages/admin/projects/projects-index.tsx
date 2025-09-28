import React from "react"
import { useNavigate } from "react-router"
import { FaEdit, FaTrash } from "react-icons/fa"
import DataTable from "../components/data-table"
import type { Column, ActionButton, RowData } from "../components/data-table.types"
import { useGetProjects, mutateProjectDelete, type IProject } from "@common/admin/project.hooks"

export default function ProjectsIndexPage() {
	const navigate = useNavigate()
	const { data, isLoading, error, refetch } = useGetProjects()
	const deleteProjectMutation = mutateProjectDelete()

	const handleEdit = (project: RowData) => {
		navigate(`/admin/projects/edit/${project.id}`)
	}

	const handleDelete = async (project: RowData) => {
		const confirmed = window.confirm(
			`Are you sure you want to delete the project "${project.title}"? This action cannot be undone.`
		)
		
		if (confirmed) {
			try {
				await deleteProjectMutation.mutateAsync([project.id])
				refetch() // Refresh the data
			} catch (error) {
				console.error("Failed to delete project:", error)
				alert("Failed to delete project. Please try again.")
			}
		}
	}

	const columns: Column[] = [
		{
			key: "id",
			label: "ID",
			type: "number",
			sortable: true,
			editable: false,
			width: "80px"
		},
		{
			key: "title",
			label: "Title",
			type: "text",
			sortable: false,
			editable: false,
			required: true,
			width: "200px"
		},
		{
			key: "description",
			label: "Description",
			type: "text",
			sortable: false,
			editable: false,
			// width: "100px",
		},
		{
			key: "project_start_date",
			label: "Start Date",
			type: "date",
			sortable: true,
			editable: false,
			width: "120px"
		},
		{
			key: "project_end_date",
			label: "End Date",
			type: "date",
			sortable: true,
			editable: false,
			width: "120px"
		},
		{
			key: "url",
			label: "URL",
			type: "url",
			sortable: false,
			editable: false,
			width: "150px"
		},
		{
			key: "repo_url",
			label: "Repository",
			type: "url",
			sortable: false,
			editable: false,
			width: "150px"
		},
		{
			key: "is_visible",
			label: "Visible",
			type: "boolean",
			sortable: true,
			editable: false,
			width: "80px"
		},
		{
			key: "created_at",
			label: "Created",
			type: "date",
			sortable: true,
			editable: false,
			width: "120px"
		}
	]

	const actionButtons: ActionButton[] = [
		{
			label: "",
			onClick: handleEdit,
			className: "bg-orange-400 text-white hover:bg-orange-700 px-3 h-8 text-center justify-center rounded-md text-sm",
			icon: <FaEdit />
		},
		{
			label: "",
			onClick: handleDelete,
			className: "bg-red-600 text-white hover:bg-red-700 px-3 h-8 text-center justify-center rounded-md text-sm",
			icon: <FaTrash />
		}
	]

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-64">
				<div className="text-lg text-gray-600">Loading projects...</div>
			</div>
		)
	}

	if (error) {
		return (
			<div className="flex items-center justify-center h-64">
				<div className="text-lg text-red-600">
					Error loading projects: {error.message}
				</div>
			</div>
		)
	}

	if (!data?.projects) {
		return (
			<div className="flex items-center justify-center h-64">
				<div className="text-lg text-gray-600">No projects found</div>
			</div>
		)
	}

	return (
		<div className="p-6">

			<DataTable
				data={data.projects.map((p: IProject) => ({ ...p,description: p.description?.slice(0,100) }))}
				columns={columns}
				actionButtons={actionButtons}
				title="Portfolio Projects"
				primaryKey="id"
				enableAdd={false}
				enableEdit={false}
				enableDelete={false}
				enableBulkActions={false}
				maxHeight="700px"
			/>
		</div>
	)
}