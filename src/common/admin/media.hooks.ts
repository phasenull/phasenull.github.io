import { API_URL } from "@common/constants"
import { makeAPICall } from "@common/hooks"
import { useAuthStore } from "@common/oauth.store"
import { useMutation } from "@tanstack/react-query"

export function mutateMediaUpload() {
	const access_token = useAuthStore((state) => state.access_token)
	return useMutation({
		mutationKey: ["mediaUpload", access_token],
		mutationFn: async (formData: FormData) => {
			return (await makeAPICall(`${API_URL}/admin/media/upload`, {
				method: "PUT",
				body: formData,
				headers: {
					Authorization: `Bearer ${access_token}`
				}
			})) as {
				success: boolean
				message: string
				url: string
			}
		}
	})
}
