import { useGetSessions } from "@common/admin.hooks"
import ProfileBanner from "./components/profile-banner"

export default function ListSessionsPage() {
	const { data, isLoading, isError } = useGetSessions()
	return (
		<div>
			<h1>List of Sessions</h1>
			{isLoading && <p>Loading...</p>}
			{isError && <p>Error loading sessions</p>}
			{data && (
				<ul className="space-y-4 justify-center flex flex-col">
					{data.pages
						.reduce((acc, page) => [...acc, ...(page || [])], [])
						.map((session) => (
							<li
								className="flex p-4 flex-row space-x-4 items-center bg-slate-100 w-max self-center"
								key={session.id}
							>
								{/* <pre>{JSON.stringify(session,undefined,4)}</pre> */}
								<div className="flex-col justify-between h-full flex">
									<ProfileBanner data={session.data} />
									<span>
										<p>ID: {session.id}</p>
										<p>At: {session.created_at}</p>
										<p>IP: {session.ip}</p>
									</span>
								</div>
								<pre className="resize select-all w-80 max-w-240 min-w-80 min-h-20 overflow-scroll bg-slate-200">
									{JSON.stringify(session.data, undefined, 4)}
								</pre>
							</li>
						))}
				</ul>
			)}
		</div>
	)
}
