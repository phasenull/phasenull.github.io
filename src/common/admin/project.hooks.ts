import { API_URL } from "@common/constants"
import { makeAPICall } from "@common/hooks"
import { useAuthStore } from "@common/oauth.store"
import { useMutation, useQuery } from "@tanstack/react-query"
import type { RowData } from "@pages/admin/components/data-table.types"
import type { IStack } from "./stack.hooks"
export interface IProject {
	id: number,
	created_at: string,
	title: string | null,
	description: string | null,
	project_start_date: string | null,
	project_end_date: string | null,
	thumbnail_url: string | null,
	org_id: number | null,
	disclaimer: string | null,
	url: string | null,
	repo_url: string | null,
	is_visible: boolean,
}
export function useGetProjects() {
	const access_token = useAuthStore((state) => state.access_token)
	return useQuery({
		queryKey: ["getProjects", access_token],
		queryFn: async () => {
			if (!access_token) throw new Error("Missing access token")
			return await makeAPICall(`${API_URL}/admin/projects`, {
				headers: {
					Authorization: `Bearer ${access_token}`
				}
			}) as { success: boolean; projects: IProject[]}
		},
		staleTime: Infinity
	})
}


export function useGetProjectDetails<T extends number>(project_id:T) {
	const access_token = useAuthStore((state) => state.access_token)
	return useQuery({
		queryKey: ["getProjectDetails", access_token,project_id],
		queryFn: async () => {
			if (!access_token) throw new Error("Missing access token")
			if (!project_id) throw new Error("Missing project id")
			if (isNaN(Number(project_id))) throw new Error("Invalid project id")
			return await makeAPICall(`${API_URL}/admin/projects/${project_id}`, {
				headers: {
					Authorization: `Bearer ${access_token}`
				}
			}) as { success: boolean; project: IProject & { id: T }, stacks: IStack[], relations: {stack_id:number,project_id:T}[]}
		},
		staleTime: Infinity
	})
}

export function mutateProjectUpdate() {
	const access_token = useAuthStore((state) => state.access_token)
	return useMutation({
		mutationKey: ["updateProject", access_token],
		mutationFn: async (changes: RowData[]) => {
			return await makeAPICall(`${API_URL}/admin/projects`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${access_token}`
				},
				body: JSON.stringify({ rows: changes })
			}) as { success: boolean; message: string }
		}
	})
}

export function mutateProjectDelete() {
	const access_token = useAuthStore((state) => state.access_token)
	return useMutation({
		mutationKey: ["deleteProject", access_token],
		mutationFn: async (project_ids: number[]) => {
			return await makeAPICall(`${API_URL}/admin/projects`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${access_token}`
				},
				body: JSON.stringify({ ids: project_ids })
			}) as { success: boolean; message: string }
		}
	})
}

export function mutateProjectCreate() {
	const access_token = useAuthStore((state) => state.access_token)
	return useMutation({
		mutationKey: ["createProject", access_token],
		mutationFn: async (changes: RowData[]) => {
			return await makeAPICall(`${API_URL}/admin/projects`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${access_token}`
				},
				body: JSON.stringify({ rows: changes })
			}) as { success: boolean; message: string }
		}
	})
}