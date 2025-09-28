import { API_URL } from "@common/constants"
import { makeAPICall } from "@common/hooks"
import { useAuthStore } from "@common/oauth.store"
import { useQuery } from "@tanstack/react-query"
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
			}) as { success: boolean; project: IProject & { id: T }, stacks: IStack[], relations: {stack_id:number,project_id:T}}
		},
		staleTime: Infinity
	})
}