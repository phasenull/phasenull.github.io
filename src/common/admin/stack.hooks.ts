import { API_URL } from "@common/constants"
import { makeAPICall } from "@common/hooks"
import { useAuthStore } from "@common/oauth.store"
import type { RowData, Stack } from "@pages/admin/components/data-table.types"
import { useMutation, useQuery } from "@tanstack/react-query"
export interface IStack {
	id: number,
	key: string,
	description: string|null,
	created_at: string,
	url: string|null,
	type: 
		"library" | "framework" | "runtime" | "language" | "other" | "tool" | string & {},
	image_url: string|null
}
export function useGetStack(stack_id: string) {
	const access_token = useAuthStore((state) => state.access_token)
	return useQuery({
		queryKey: ["getStack", access_token, stack_id],
		queryFn: async () => {
			if (!access_token) throw new Error("Missing access token")
			return await makeAPICall(
				`${API_URL}/admin/stacks/${stack_id}`,
				{
					headers: {
						Authorization: `Bearer ${access_token}`
					}
				}
			)
		}
	})
}


export function mutateStackUpdate() {
	const access_token = useAuthStore((state) => state.access_token)
	return useMutation({
		mutationKey: ["updateStack", access_token],
		mutationFn: async (changes: RowData[]) => {
			return await makeAPICall(`${API_URL}/admin/stacks`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${access_token}`
				},
				body: JSON.stringify({ rows: changes })
			})  as { success: boolean; message: string }
		}
	})
}

export function useGetAllStacks() {
	const access_token = useAuthStore((state) => state.access_token)
	return useQuery({
		queryKey: ["getAllStacks", access_token],
		staleTime: Infinity,
		queryFn: async () => {
			if (!access_token) throw new Error("Missing access token")
			return await makeAPICall(`${API_URL}/admin/stacks`, {
				headers: {
					Authorization: `Bearer ${access_token}`
				}
			}) as {
				success: boolean
				stacks: any[]
			}
		}
	})
}

export function mutateStackDelete() {
	const access_token = useAuthStore((state) => state.access_token)
	return useMutation({
		mutationKey: ["deleteStack", access_token],
		mutationFn: async (stack_ids: number[]) => {
			return await makeAPICall(`${API_URL}/admin/stacks`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${access_token}`
				},
				body: JSON.stringify({ ids: stack_ids })
			}) as { success: boolean; message: string }
		}
	})
}

export function mutateStackCreate() {
	const access_token = useAuthStore((state) => state.access_token)
	return useMutation({
		mutationKey: ["createStack", access_token],
		mutationFn: async (changes: RowData[]) => {
			return await makeAPICall(`${API_URL}/admin/stacks`, {
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
