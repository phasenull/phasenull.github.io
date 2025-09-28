import { API_URL } from "@common/constants";
import { makeAPICall } from "@common/hooks";
import { useAuthStore } from "@common/oauth.store";
import { useQuery } from "@tanstack/react-query";

export function useGetStack(stack_id:string) {
	const access_token = useAuthStore((state) => state.access_token)
	return useQuery({
		queryKey: ["getStack", access_token, stack_id],
		queryFn: async () => {
			if (!access_token) throw new Error("Missing access token")
			const response = await makeAPICall(`${API_URL}/admin/stacks/${stack_id}`, {
				headers: {
					Authorization: `Bearer ${access_token}`
				}
			})
			if (!response.ok) throw new Error("Failed to fetch stack")
			return response.json()
		}
	})
}
