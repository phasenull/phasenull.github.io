import { useGetAllProjects } from "@common/hooks"
import DataTable from "../components/data-table"
import { getColumnTypeFromKey } from "../components/data-table.column-helper"
import {
	mutateStackCreate,
	mutateStackDelete,
	mutateStackUpdate,
	useGetAllStacks
} from "@common/admin/stack.hooks"

export default function StacksIndex() {
	const { data, isLoading, isError, refetch, error } = useGetAllStacks()
	const { mutateAsync: deleteStacksAsync } = mutateStackDelete()
	const { mutateAsync: createStackAsync } = mutateStackCreate()
	const { mutateAsync: updateStackAsync } = mutateStackUpdate()
	if (isError) return <div>Error loading stacks: {error.message}</div>
	if (isLoading) return <div>Loading...</div>
	return (
		<div className="p-6">
			{isLoading && <p>Loading...</p>}
			{isError && <p>Error loading projects</p>}
			<DataTable
				maxHeight="70vh"
				data={data?.stacks || []}
				columns={Object.keys(data?.stacks[0] || {}).map((key) => ({
					key,
					label: key,
					type: getColumnTypeFromKey(key),
					editable:
						key !== "id" && key !== "created_at" && key !== "updated_at",
					sortable: true
				}))}
				enableAdd={true}
				enableEdit={true}
				enableSort={true}
				enableDelete={true}
				enableBulkActions={true}
				onDelete={async (rows) => {
					console.log("Delete rows:", rows)
					await deleteStacksAsync(rows.map((row) => row.id))
				}}
				onSave={async (rows) => {
					console.log(
						"New rows:",
						rows.filter((r) => r._isNew)
					)
					console.log(
						"Modified rows:",
						rows.filter((r) => r._isModified)
					)
					if (rows.some((r) => r._isNew)) {
						await createStackAsync(rows.filter((r) => r._isNew))
					}
					if (rows.some((r) => r._isModified)) {
						await updateStackAsync(rows.filter((r) => r._isModified))
					}
					refetch()
					// Call your API to save the updated rows
				}}
				title="Edit Stacks"
			/>
		</div>
	)
}
