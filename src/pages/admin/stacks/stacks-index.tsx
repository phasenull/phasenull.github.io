import { useGetAllProjects } from "@common/hooks"
import DataTable from "../components/data-table"
import { getColumnTypeFromKey } from "../components/data-table.column-helper"

export default function StacksIndex() {
	const { data, isLoading, isError } = useGetAllProjects()
	if (isError) return <div>Error loading projects</div>
	if (isLoading) return <div>Loading...</div>
	return (
		<div>
			<h1>Stacks Index Page</h1>
			{isLoading && <p>Loading...</p>}
			{isError && <p>Error loading projects</p>}
			<DataTable
				data={data?.stacks || []}
				columns={Object.keys(data?.stacks[0] || {}).map((key) => ({
					key,
					label: key,
					type: getColumnTypeFromKey(key),
					editable: true,
					sortable: true
				}))}
			/>
		</div>
	)
}
