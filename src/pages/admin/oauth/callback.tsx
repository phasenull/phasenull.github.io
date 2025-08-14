import { useGetAccessTokenFromOAuthCode } from "@common/oauth.hooks"
import { Navigate, useSearchParams } from "react-router"

export default function OAuthCallback() {
	const [params, setParams] = useSearchParams()
	const { data, isLoading, error, isError } = useGetAccessTokenFromOAuthCode(
		params.get("code"),
		params.get("state")
	)
	if (!(params.get("code") &&
		params.get("state"))) {
			return <div>invalid request</div>
		}
	console.log(params)
	if (isLoading) {
		return <div>Loading...</div>
	}
	if (!isError && !data?.success && data) {
		return <div>200 Error: {data?.message}</div>
	} else if (isError) {
		return <div>Error: {error.message}</div>
	}
   if (data?.success) {
      return <Navigate to={"/admin"}/>
   }
	return (
		<div>
			<h1>Something went wrong...</h1>
		</div>
	)
}
