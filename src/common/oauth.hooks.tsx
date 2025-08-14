import { useQuery } from "@tanstack/react-query"
import { makeAPICall } from "./hooks"
import type { ITwitterUser } from "./types"
import { useAuthStore } from "./oauth.store"
import { API_URL } from "./constants"

export function useGetAccessTokenFromOAuthCode(code: string|null, state: string|null) {
   const setAuth = useAuthStore((state) => state.setAuth)
	return useQuery({
		queryKey: ["getAccessToken", state, code],
		queryFn: async () => {
         if (!code || !state) throw new Error("Missing code or state")
         const oauth_data = await makeAPICall(`${API_URL}/oauth/callback?${new URLSearchParams({ code, state })}`,{method:"POST"})
         console.log(oauth_data)
         if (oauth_data.success && oauth_data.user && oauth_data.access_token) {
            setAuth({
               access_token: oauth_data.access_token,
               user: oauth_data.user
            })
         }
         return oauth_data as {
            success: true
            access_token: string
            user:ITwitterUser
         } | {
            success:false,
            message:string
         }
      },
      enabled: !!code && !!state,
      staleTime:0
	})
}
