import { API_URL } from "@common/constants"
import { useAuthStore } from "@common/oauth.store"
import { useMutation } from "@tanstack/react-query"

export function mutateMediaUpload() {
	const access_token = useAuthStore((state) => state.access_token)
	return useMutation({
		mutationKey: ["mediaUpload", access_token],
		mutationFn: async (formData: FormData) => {
			const response = await fetch(`${API_URL}/admin/media/upload`, {
				method: "PUT",
				body: formData,
				headers: {
					Authorization: `Bearer ${access_token}`
				}
			})
			if (!response.ok) {
				throw new Error("Failed to upload media")
			}
			return await response.json() as {
				success: boolean
				message: string
				url: string
			}
		}
	})
}
