import { useGetSelf } from "@common/admin.hooks"
import { useAuthStore } from "@common/oauth.store"
import { GoSignOut } from "react-icons/go"

export default function AdminProfile() {
	const { isLoading, data, error } = useGetSelf()
	const clearAuth = useAuthStore((state) => state.clearAuth)
	if (isLoading) return <div>Loading...</div>
	if (error) return <div>Error: {error.message}</div>
	if (!data) return <div>No data found</div>

	return (
		<div className="flex  flex-1 absolute left-0 h-full flex-row justify-center">
			<div className="z-20 flex-row space-x-2 flex self-center p-2 h-full w-full backdrop-blur-[4px]">
				<img
					src={data.profile_image_url}
					className="h-12 self-center rounded-[8px]"
					alt={"profile image"}
				/>
				<div className="self-center">
					<p className="text-3xl  text-slate-600 font-bold">{data.username}</p>
					<p className="text-1xl  text-slate-400 font-bold">@{data.name}</p>
				</div>
			</div>
			<div className="z-20 group self-center">
				<GoSignOut size={24} className="text-slate-400 group-hover:scale-105 ml-4" strokeWidth={2} />
			</div>
			<img
				className="h-full absolute left-0 z-10"
				src={data.profile_banner_url}
				alt={"profile banner"}
			/>
		</div>
	)
}
