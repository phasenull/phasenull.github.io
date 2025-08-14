import { useGetSelf } from "@common/admin.hooks"
import AdminProfile from "./components/admin-profile"

export default function AdminPage() {
	const { data, isLoading, error } = useGetSelf()
	if (isLoading) return <div>Loading...</div>
	if (error) return <div>Error: {error.message}</div>
	return (
		<pre>
			Admin Page! User: {JSON.stringify(data,undefined,4)}
		</pre>
	)
}
