import React, { useState, useCallback, useMemo } from "react"
import type { Column, DataTableProps, RowData } from "./data-table.types"

export default function DataTable({
	data: initialData,
	columns,
	onSave,
	onDelete,
	primaryKey = "id",
	title = "Data Table",
	maxHeight = "600px",
	enableAdd = true,
	enableDelete = true,
	enableEdit = true,
	enableSort = true,
	enableBulkActions = true
}: DataTableProps) {
	const [data, setData] = useState<RowData[]>(initialData)
	const [sortColumn, setSortColumn] = useState<string>("")
	const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
	const [isLoading, setIsLoading] = useState(false)
	const [selectAll, setSelectAll] = useState(false)

	// Sort data
	const sortedData = useMemo(() => {
		if (!sortColumn || !enableSort) return data

		return [...data].sort((a, b) => {
			const aVal = a[sortColumn]
			const bVal = b[sortColumn]

			if (aVal == null && bVal == null) return 0
			if (aVal == null) return 1
			if (bVal == null) return -1

			const direction = sortDirection === "asc" ? 1 : -1

			if (typeof aVal === "number" && typeof bVal === "number") {
				return (aVal - bVal) * direction
			}

			return String(aVal).localeCompare(String(bVal)) * direction
		})
	}, [data, sortColumn, sortDirection, enableSort])

	// Get selected rows
	const selectedRows = useMemo(() => {
		return data.filter((row) => row._isSelected)
	}, [data])

	// Handle sort
	const handleSort = useCallback(
		(column: string) => {
			if (!enableSort) return

			if (sortColumn === column) {
				setSortDirection(sortDirection === "asc" ? "desc" : "asc")
			} else {
				setSortColumn(column)
				setSortDirection("asc")
			}
		},
		[sortColumn, sortDirection, enableSort]
	)

	// Handle cell edit
	const handleCellEdit = useCallback(
		(rowIndex: number, columnKey: string, value: any) => {
			if (!enableEdit) return

			setData((prevData) => {
				const newData = [...prevData]
				const actualIndex = data.findIndex((_, i) => i === rowIndex)

				if (actualIndex >= 0) {
					newData[actualIndex] = {
						...newData[actualIndex],
						[columnKey]: value,
						_isModified: !newData[actualIndex]._isNew
					}
				}

				return newData
			})
		},
		[data, enableEdit]
	)

	// Add new row
	const handleAddRow = useCallback(() => {
		if (!enableAdd) return

		const newRow: RowData = {
			_isNew: true,
			_isModified: false,
			_isSelected: false
		}

		// Initialize with default values
		columns.forEach((column) => {
			switch (column.type) {
				case "boolean":
					newRow[column.key] = false
					break
				case "number":
					newRow[column.key] = 0
					break
				case "select":
					newRow[column.key] = column.options?.[0] || ""
					break
				default:
					newRow[column.key] = ""
			}
		})

		setData((prevData) => [...prevData, newRow])
	}, [columns, enableAdd])

	// Delete selected rows
	const handleDeleteSelected = useCallback(async () => {
		if (!enableDelete || selectedRows.length === 0) return

		setIsLoading(true)
		try {
			if (onDelete) {
				await onDelete(selectedRows)
			}

			setData((prevData) => prevData.filter((row) => !row._isSelected))
			setSelectAll(false)
		} catch (error) {
			console.error("Failed to delete rows:", error)
		} finally {
			setIsLoading(false)
		}
	}, [selectedRows, enableDelete, onDelete])

	// Save changes
	const handleSave = useCallback(async () => {
		if (!onSave) return

		const modifiedOrNewRows = data.filter(
			(row) => row._isModified || row._isNew
		)
		if (modifiedOrNewRows.length === 0) return

		// Validate data
		const validationErrors: string[] = []
		modifiedOrNewRows.forEach((row, index) => {
			columns.forEach((column) => {
				if (column.required && !row[column.key]) {
					validationErrors.push(`Row ${index + 1}: ${column.label} is required`)
				}

				if (
					column.type === "email" &&
					row[column.key] &&
					!isValidEmail(row[column.key])
				) {
					validationErrors.push(`Row ${index + 1}: Invalid email format`)
				}

				if (
					column.type === "url" &&
					row[column.key] &&
					!isValidURL(row[column.key])
				) {
					validationErrors.push(`Row ${index + 1}: Invalid URL format`)
				}
			})
		})

		if (validationErrors.length > 0) {
			alert("Validation errors:\n" + validationErrors.join("\n"))
			return
		}

		setIsLoading(true)
		try {
			await onSave(data)

			// Reset modification flags
			setData((prevData) =>
				prevData.map((row) => ({
					...row,
					_isNew: false,
					_isModified: false
				}))
			)
		} catch (error) {
			console.error("Failed to save changes:", error)
			alert("Failed to save changes. Please try again.")
		} finally {
			setIsLoading(false)
		}
	}, [data, columns, onSave])

	// Discard changes
	const handleDiscardChanges = useCallback(() => {
		const hasChanges = data.some((row) => row._isModified || row._isNew)
		if (!hasChanges) return

		const confirmed = window.confirm(
			"Are you sure you want to discard all changes? This will remove all new rows and revert modifications."
		)

		if (confirmed) {
			// Reset to original data, removing new rows and reverting modifications
			setData(
				initialData.map((row) => ({
					...row,
					_isModified: false,
					_isSelected: false
				}))
			)
			setSelectAll(false)
		}
	}, [data, initialData])

	// Handle row selection
	const handleRowSelect = useCallback(
		(rowIndex: number, selected: boolean) => {
			if (!enableBulkActions) return

			setData((prevData) => {
				const newData = [...prevData]
				newData[rowIndex] = { ...newData[rowIndex], _isSelected: selected }
				return newData
			})
		},
		[enableBulkActions]
	)

	// Handle select all
	const handleSelectAll = useCallback(
		(selected: boolean) => {
			if (!enableBulkActions) return

			setSelectAll(selected)
			setData((prevData) =>
				prevData.map((row) => ({ ...row, _isSelected: selected }))
			)
		},
		[enableBulkActions]
	)

	// Validation helpers
	const isValidEmail = (email: string): boolean => {
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
	}

	const isValidURL = (url: string): boolean => {
		try {
			new URL(url)
			return true
		} catch {
			return false
		}
	}

	// Get modified/new rows count
	const modifiedCount = data.filter(
		(row) => row._isModified || row._isNew
	).length

	return (
		<div className="w-full bg-white rounded-lg shadow-lg">
			{/* Header */}
			<div className="p-4 border-b border-gray-200">
				<div className="flex justify-between items-center mb-4">
					<h2 className="text-xl font-semibold text-gray-800">{title}</h2>
					<div className="text-sm text-gray-500">
						{data.length} rows{" "}
						{modifiedCount > 0 && `(${modifiedCount} modified)`}
					</div>
				</div>

				{/* Action Buttons */}
				<div className="flex gap-2 flex-wrap">
					{enableAdd && (
						<button
							onClick={handleAddRow}
							disabled={isLoading}
							className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							+ Add New Row
						</button>
					)}

					{modifiedCount > 0 && (
						<button
							onClick={handleSave}
							disabled={isLoading}
							className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{isLoading ? "Saving..." : `Save Changes (${modifiedCount})`}
						</button>
					)}

					{modifiedCount > 0 && (
						<button
							onClick={handleDiscardChanges}
							disabled={isLoading}
							className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							Discard Changes
						</button>
					)}

					{enableDelete && selectedRows.length > 0 && (
						<button
							onClick={handleDeleteSelected}
							disabled={isLoading}
							className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{isLoading
								? "Deleting..."
								: `Delete Selected (${selectedRows.length})`}
						</button>
					)}
				</div>
			</div>

			{/* Table Container */}
			<div className="overflow-auto" style={{ maxHeight }}>
				<table className="w-full">
					<thead className="bg-gray-50 sticky top-0">
						<tr>
							{enableBulkActions && (
								<th className="p-3 text-left border-b border-gray-200">
									<input
										type="checkbox"
										checked={selectAll}
										onChange={(e) => handleSelectAll(e.target.checked)}
										className="rounded"
									/>
								</th>
							)}
							{columns.map((column) => (
								<th
									key={column.key}
									className={`p-3 text-left border-b border-gray-200 font-medium text-gray-700 ${
										column.sortable && enableSort
											? "cursor-pointer hover:bg-gray-100"
											: ""
									}`}
									style={{ width: column.width }}
									onClick={() => column.sortable && handleSort(column.key)}
								>
									<div className="flex items-center gap-1">
										{column.label}
										{column.required && <span className="text-red-500">*</span>}
										{column.sortable && enableSort && (
											<span className="text-xs text-gray-400">
												{sortColumn === column.key
													? sortDirection === "asc"
														? "↑"
														: "↓"
													: "↕"}
											</span>
										)}
									</div>
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{sortedData.map((row, rowIndex) => (
							<tr
								key={row[primaryKey] || `row-${rowIndex}`}
								className={`hover:bg-gray-50 ${
									row._isNew
										? "bg-green-50"
										: row._isModified
										? "bg-yellow-50"
										: ""
								} ${row._isSelected ? "bg-blue-50" : ""}`}
							>
								{enableBulkActions && (
									<td className="p-3 border-b border-gray-100">
										<input
											type="checkbox"
											checked={row._isSelected || false}
											onChange={(e) =>
												handleRowSelect(rowIndex, e.target.checked)
											}
											className="rounded"
										/>
									</td>
								)}
								{columns.map((column) => (
									<td key={column.key} className="p-3 border-b border-gray-100">
										<EditableCell
											value={row[column.key]}
											column={column}
											onSave={(value) =>
												handleCellEdit(rowIndex, column.key, value)
											}
											disabled={!enableEdit || !column.editable}
										/>
									</td>
								))}
							</tr>
						))}
						{data.length === 0 && (
							<tr>
								<td
									colSpan={columns.length + (enableBulkActions ? 1 : 0)}
									className="p-8 text-center text-gray-500"
								>
									No data available
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</div>
	)
}

// Editable Cell Component
interface EditableCellProps {
	value: any
	column: Column
	onSave: (value: any) => void
	disabled?: boolean
}

function EditableCell({
	value,
	column,
	onSave,
	disabled = false
}: EditableCellProps) {
	const [isEditing, setIsEditing] = useState(false)
	const [editValue, setEditValue] = useState(value)

	const handleSave = useCallback(() => {
		onSave(editValue)
		setIsEditing(false)
	}, [editValue, onSave])

	const handleCancel = useCallback(() => {
		setEditValue(value)
		setIsEditing(false)
	}, [value])

	const handleKeyPress = useCallback(
		(e: React.KeyboardEvent) => {
			if (e.key === "Enter" && !e.shiftKey) {
				e.preventDefault()
				handleSave()
			} else if (e.key === "Escape") {
				handleCancel()
			}
		},
		[handleSave, handleCancel]
	)

	if (disabled || !column.editable) {
		return (
			<span className="text-gray-600">{formatDisplayValue(value, column)}</span>
		)
	}

	if (!isEditing) {
		return (
			<div
				onClick={() => setIsEditing(true)}
				className="cursor-pointer hover:bg-gray-100 rounded px-2 py-1 min-h-[1.5rem]"
				title="Click to edit"
			>
				{formatDisplayValue(value, column)}
			</div>
		)
	}

	return (
		<div className="flex items-center gap-1">
			{renderEditor(editValue, setEditValue, column, handleKeyPress)}
			<button
				onClick={handleSave}
				className="px-1 py-0.5 text-xs bg-green-600 text-white rounded hover:bg-green-700"
				title="Save"
			>
				✓
			</button>
			<button
				onClick={handleCancel}
				className="px-1 py-0.5 text-xs bg-gray-600 text-white rounded hover:bg-gray-700"
				title="Cancel"
			>
				✗
			</button>
		</div>
	)
}

// Helper Functions
function formatDisplayValue(value: any, column: Column): React.ReactNode {
	if (value == null || value === "") return "-"

	switch (column.type) {
		case "boolean":
			return value ? "Yes" : "No"
		case "date":
			return new Date(value).toLocaleDateString()
		case "image":
			return (
				<div className="flex items-center gap-2">
					<img 
						src={value} 
						alt="preview" 
						className="h-8 w-8 object-cover rounded border"
						onError={(e) => {
							e.currentTarget.style.display = 'none';
						}}
					/>
					<span className="text-xs text-gray-500 max-w-[100px] truncate">
						{value}
					</span>
				</div>
			)
		default:
			return String(value)
	}
}

function renderEditor(
	value: any,
	setValue: (value: any) => void,
	column: Column,
	onKeyPress: (e: React.KeyboardEvent) => void
) {
	const baseClasses = "border border-gray-300 rounded px-2 py-1 text-sm min-w-0"

	switch (column.type) {
		case "boolean":
			return (
				<input
					type="checkbox"
					checked={Boolean(value)}
					onChange={(e) => setValue(e.target.checked)}
					className="rounded"
					autoFocus
				/>
			)

		case "select":
			return (
				<select
					value={value || ""}
					onChange={(e) => setValue(e.target.value)}
					className={baseClasses}
					autoFocus
				>
					{column.options?.map((option) => (
						<option key={option} value={option}>
							{option}
						</option>
					))}
				</select>
			)

		case "number":
			return (
				<input
					type="number"
					value={value || ""}
					onChange={(e) => setValue(Number(e.target.value) || 0)}
					onKeyDown={onKeyPress}
					className={baseClasses}
					autoFocus
				/>
			)

		case "date":
			return (
				<input
					type="date"
					value={value ? new Date(value).toISOString().split("T")[0] : ""}
					onChange={(e) => setValue(e.target.value)}
					className={baseClasses}
					autoFocus
				/>
			)
		case "image":
			return (
				<div className="flex flex-col gap-2">
					{value && (
						<img 
							src={value} 
							alt="preview" 
							className="h-20 w-20 object-cover rounded border"
							onError={(e) => {
								e.currentTarget.style.display = 'none';
							}}
						/>
					)}
					<input
						type="url"
						value={value || ""}
						onChange={(e) => setValue(e.target.value)}
						onKeyDown={onKeyPress}
						className={baseClasses}
						placeholder="Enter image URL"
						autoFocus
					/>
				</div>
			)

		case "text":
			return (
				<textarea
					value={value || ""}
					onChange={(e) => setValue(e.target.value)}
					onKeyDown={onKeyPress}
					className={`${baseClasses} min-h-[2.5rem] w-full resize-y`}
					rows={3}
					autoFocus
				/>
			)
		default:
			return (
				<input
					type={
						column.type === "email"
							? "email"
							: column.type === "url"
							? "url"
							: "text"
					}
					value={value || ""}
					onChange={(e) => setValue(e.target.value)}
					onKeyDown={onKeyPress}
					className={baseClasses}
					autoFocus
				/>
			)
	}
}
