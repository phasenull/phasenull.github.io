import { useGetSelf } from "@common/admin.hooks"
import { useAuthStore } from "@common/oauth.store"
import { GoSignOut } from "react-icons/go"

export default function ProfileBanner(props: {
	data: {
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
}) {
   const { data } = props
	return (
		<div style={{backgroundImage: `url(${data.profile_banner_url})`,backgroundSize: 'cover'}} className="flex h-20 w-60 flex-row justify-center">
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
		</div>
	)
}
