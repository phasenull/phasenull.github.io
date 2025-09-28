import React, { useState, useCallback, useMemo } from "react"
import { mutateMediaUpload } from "@common/admin/media.hooks"
import type {
	Column,
	DataTableProps,
	RowData,
	ActionButton
} from "./data-table.types"
import { FaPlus } from "react-icons/fa"

export default function DataTable({
	data: initialData,
	height,
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
	enableBulkActions = true,
	actionButtons = [],
	children
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

		// Generate a unique temporary ID for the new row
		const tempId = `temp_${Date.now()}_${Math.random()
			.toString(36)
			.substr(2, 9)}`
		console.log("Adding new row with temp ID:", tempId)
		const newRow: RowData = {
			[primaryKey]: tempId,
			_isNew: true,
			_isModified: false,
			_isSelected: false
		}

		// Initialize with default values
		columns.forEach((column) => {
			// Skip the primary key column to avoid overwriting the temp ID
			if (column.key === primaryKey) return

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

		setData((prevData) => [newRow, ...prevData])
	}, [columns, enableAdd, primaryKey])

	// Delete selected rows
	const handleDeleteSelected = useCallback(async () => {
		if (!enableDelete || selectedRows.length === 0) return

		// Show confirmation dialog
		const confirmed = window.confirm(
			`Are you sure you want to delete ${selectedRows.length} selected row${
				selectedRows.length === 1 ? "" : "s"
			}? This action cannot be undone.`
		)

		if (!confirmed) return

		setIsLoading(true)
		try {
			if (onDelete) {
				await onDelete(selectedRows)
			}

			setData((prevData) => prevData.filter((row) => !row._isSelected))
			setSelectAll(false)
		} catch (error) {
			console.error("Failed to delete rows:", error)
			alert("Failed to delete rows. Please try again.")
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
		(rowPrimaryKey: any, selected: boolean) => {
			if (!enableBulkActions) return

			setData((prevData) => {
				return prevData.map((row) =>
					row[primaryKey] === rowPrimaryKey
						? { ...row, _isSelected: selected }
						: row
				)
			})
		},
		[enableBulkActions, primaryKey]
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
		<div className={`w-full bg-white rounded-lg shadow-lg `}>
			{/* Header */}
			<div className="p-4 border-b border-gray-200">
				<div className="flex justify-between items-center mb-4">
					<div className="flex items-center gap-4">
						<h2 className="text-xl font-semibold text-gray-800">{title}</h2>
					</div>
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
							className="px-4 flex-row flex items-center gap-2 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							<FaPlus />
							Add New Row
						</button>
					)}
					{children && <div className="flex items-center ">{children}</div>}

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
			<div
				className="overflow-auto"
				style={{ maxHeight, height: height || "auto" }}
			>
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
														? "↓"
														: "↑"
													: "↕"}
											</span>
										)}
									</div>
								</th>
							))}
							{actionButtons && actionButtons.length > 0 && (
								<th className="p-3 text-left border-b border-gray-200 font-medium text-gray-700">
									Actions
								</th>
							)}
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
												handleRowSelect(row[primaryKey], e.target.checked)
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
											primaryKey={primaryKey}
											row={row}
										/>
									</td>
								))}
								{actionButtons && actionButtons.length > 0 && (
									<td className="p-3 border-b border-gray-100">
										<div className="flex gap-2">
											{actionButtons.map((button, buttonIndex) => (
												<button
													key={buttonIndex}
													onClick={() => button.onClick(row)}
													disabled={
														button.disabled ? button.disabled(row) : false
													}
													className={`rounded-md ${
														button.className ||
														"bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
													}`}
												>
													{button.icon}
													{/* {button.icon && <span className="mr-1"></span>} */}
													{/* {button.label} */}
												</button>
											))}
										</div>
									</td>
								)}
							</tr>
						))}
						{data.length === 0 && (
							<tr>
								<td
									colSpan={
										columns.length +
										(enableBulkActions ? 1 : 0) +
										(actionButtons && actionButtons.length > 0 ? 1 : 0)
									}
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
	primaryKey: string
	row: RowData
}

function EditableCell({
	value,
	column,
	onSave,
	disabled = false,
	primaryKey,
	row
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
			<span className="text-gray-600">
				{formatDisplayValue(value, column, primaryKey, row)}
			</span>
		)
	}

	if (!isEditing) {
		return (
			<div
				onClick={() => setIsEditing(true)}
				className="cursor-pointer hover:bg-gray-100 rounded px-2 py-1 min-h-[1.5rem]"
				title="Click to edit"
			>
				{formatDisplayValue(value, column, primaryKey, row)}
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
function formatDisplayValue(
	value: any,
	column: Column,
	primaryKey: string,
	row: RowData
): React.ReactNode {
	// Special handling for primary key columns with temp IDs
	if (
		column.key === primaryKey &&
		typeof value === "string" &&
		value.startsWith("temp_")
	) {
		return (
			<span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
				NEW
			</span>
		)
	}

	if (value == null || value === "") return "-"

	switch (column.type) {
		case "boolean":
			return value ? "Yes" : "No"
		case "date":
			return new Date(value).toLocaleDateString()
		case "file":
			return (
				<div className="flex items-center gap-2">
					<span className="text-blue-600 text-xs">📁</span>
					{value ? (
						<a
							href={value}
							target="_blank"
							rel="noopener noreferrer"
							className="text-blue-600 hover:text-blue-800 text-xs max-w-[100px] truncate underline"
						>
							{new URL(value).pathname.split("/").pop() || "file"}
						</a>
					) : (
						<span className="text-gray-500 text-xs">No file</span>
					)}
				</div>
			)
		case "image":
			return (
				<div className="flex items-center gap-2">
					<img
						src={value}
						alt="preview"
						className="h-8 w-8 object-cover rounded border"
						onError={(e) => {
							e.currentTarget.style.display = "none"
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

// File Upload Editor Component
interface FileUploadEditorProps {
	value: string
	setValue: (value: string) => void
}

function FileUploadEditor({ value, setValue }: FileUploadEditorProps) {
	const [isUploading, setIsUploading] = useState(false)
	const { mutateAsync } = mutateMediaUpload()
	const handleFileChange = useCallback(
		async (e: React.ChangeEvent<HTMLInputElement>) => {
			const file = e.target.files?.[0]
			if (!file) return

			setIsUploading(true)
			try {
				const new_formData = new FormData()
				new_formData.append("file", file)

				// Create mutation with the specific FormData
				const result = await mutateAsync(new_formData)
				setValue(result.url)
			} catch (error) {
				console.error("Failed to upload file:", error)
				alert("Failed to upload file. Please try again.")
			} finally {
				setIsUploading(false)
			}
		},
		[setValue]
	)

	const baseClasses = "border border-gray-300 rounded px-2 py-1 text-sm min-w-0"

	return (
		<div className="flex flex-col gap-2 min-w-[200px]">
			{value && (
				<div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
					<span className="text-blue-600 text-xs">📁</span>
					<a
						href={value}
						target="_blank"
						rel="noopener noreferrer"
						className="text-blue-600 hover:text-blue-800 text-xs truncate underline"
					>
						{new URL(value).pathname.split("/").pop() || "current file"}
					</a>
				</div>
			)}
			<div className="flex gap-2">
				<input
					type="file"
					onChange={handleFileChange}
					disabled={isUploading}
					className={`${baseClasses} file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100`}
				/>
				{isUploading && (
					<span className="text-xs text-gray-500 self-center">
						Uploading...
					</span>
				)}
			</div>
			<input
				type="url"
				value={value || ""}
				onChange={(e) => setValue(e.target.value)}
				placeholder="Or enter URL directly"
				className={`${baseClasses} text-xs`}
			/>
		</div>
	)
}

// Image Upload Editor Component
interface ImageUploadEditorProps {
	value: string
	setValue: (value: string) => void
	onKeyPress: (e: React.KeyboardEvent) => void
}

function ImageUploadEditor({
	value,
	setValue,
	onKeyPress
}: ImageUploadEditorProps) {
	const [isUploading, setIsUploading] = useState(false)
	const baseClasses = "border border-gray-300 rounded px-2 py-1 text-sm min-w-0"
	const { mutateAsync } = mutateMediaUpload()
	const handleFileChange = useCallback(
		async (e: React.ChangeEvent<HTMLInputElement>) => {
			const file = e.target.files?.[0]
			if (!file) return

			setIsUploading(true)
			try {
				const formData = new FormData()
				formData.append("file", file)

				// Create mutation with the specific FormData
				const result = await mutateAsync(formData)
				setValue(result.url)
			} catch (error) {
				console.error("Failed to upload image:", error)
				alert("Failed to upload image. Please try again.")
			} finally {
				setIsUploading(false)
			}
		},
		[setValue]
	)

	return (
		<div className="flex flex-col gap-2">
			{value && (
				<img
					src={value}
					alt="preview"
					className="h-20 w-20 object-cover rounded border"
					onError={(e) => {
						e.currentTarget.style.display = "none"
					}}
				/>
			)}
			<div className="flex gap-2">
				<input
					type="file"
					accept="image/*"
					onChange={handleFileChange}
					disabled={isUploading}
					className={`${baseClasses} file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-green-50 file:text-green-700 hover:file:bg-green-100`}
				/>
				{isUploading && (
					<span className="text-xs text-gray-500 self-center">
						Uploading...
					</span>
				)}
			</div>
			<input
				type="url"
				value={value || ""}
				onChange={(e) => setValue(e.target.value)}
				onKeyDown={onKeyPress}
				className={baseClasses}
				placeholder="Or enter image URL"
				autoFocus
			/>
		</div>
	)
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
		case "file":
			return <FileUploadEditor value={value} setValue={setValue} />

		case "image":
			return (
				<ImageUploadEditor
					value={value}
					setValue={setValue}
					onKeyPress={onKeyPress}
				/>
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
