import { useInfiniteQuery, useQuery } from "@tanstack/react-query"
import { useAuthStore } from "../oauth.store"
import { API_URL, ENV } from "../constants"
import { makeAPICall } from "../hooks"

export function useGetSelf() {
	const access_token = useAuthStore((state) => state.access_token)
	return useQuery({
		queryKey: ["getSelf", access_token],
		queryFn: async () => {
			if (!access_token) throw new Error("Missing access token")
			const response = await makeAPICall(`${API_URL}/admin/whoami`, {
				headers: {
					Authorization: `Bearer ${access_token}`
				}
			})
			if (!response.success) throw new Error(response.message)
			return response?.user as {
				profile_image_url: string
				profile_banner_url: string
				description: string
				verified: boolean
				name: string
				verified_type: string
				protected: boolean
				is_identity_verified: boolean
				username: string
				created_at: string
				url: string
				id: string
			}
		},
		staleTime: Infinity
	})
}

export function useGetSessions() {
	const access_token = useAuthStore((state) => state.access_token)
	return useInfiniteQuery({
		queryKey: ["getSessions", access_token],
		queryFn: async ({ pageParam = 1 }) => {
			if (!access_token) throw new Error("Missing access token")
			const response = await makeAPICall(
				`${API_URL}/admin/list-sessions?page=${pageParam}`,
				{
					headers: {
						Authorization: `Bearer ${access_token}`
					}
				}
			)
			if (!response.success) throw new Error(response.message)
			return response.sessions as Array<{
				id: string
				user_id: string
				ip: string
				user_agent: string
				created_at: string
				data:any
			}>
		},
		initialPageParam: 1,
		getNextPageParam: (lastPage, allPages) => {
			return (lastPage||[]).length > 0 ? (allPages||[]).length + 1 : undefined
		}
	})
}

export function useGetAuthorizeLink() {
	return useQuery({
		queryKey: ["getAuthorizeLink"],
		queryFn: async () => {
			const response = await makeAPICall(
				`${API_URL}/oauth/authorize?dev=${ENV === "dev" ? "1" : ""}`
			)
			if (!response.success) throw new Error(response.message)
			return response.url as string
		},
		staleTime: 15 * 1000
	})
}


export function useGetUsage() {
	const access_token = useAuthStore((state) => state.access_token)
	return useQuery({
		queryKey: ["getUsage", access_token],
		queryFn: async () => {
			if (!access_token) throw new Error("Missing access token")
			const response = await makeAPICall(`${API_URL}/admin/usage`, {
				headers: {
					Authorization: `Bearer ${access_token}`
				}
			})
			if (!response.success) throw new Error(response.message)
			return response.usage as {
				total_requests: number
				remaining_requests: number
				reset_at: string
			}
		}
	})
}