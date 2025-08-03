import { useGetActivities } from "@common/hooks"
import { createPortal } from "react-dom"
import { Link } from "react-router"

export default function RecentActivitiesPage() {
	const { data, isLoading, isFetching } = useGetActivities()
	if (isFetching || isLoading) return <div>loading state</div>
	return (
		<div className="justify-center flex flex-col space-y-5 pt-20">
			{data?.activities.map((activity, index) => (
				<ActivityContainer
					key={[activity.content, activity.platform].join("-")}
					activity={activity}
				/>
			))}
		</div>
	)
}

function ActivityContainer(props: {
	activity: {
		platform: "linkedin" | "discord"
		content: string
		media: {
			url: string
			type: "image" | "video"
		}[]
	}
}) {
	return (
		<div className="w-[90%] lg:w-120 self-center shadow-md border-slate-300 border-1 p-4 rounded-xl">
			<h4 className="font-semibold">Shared on {props.activity.platform}</h4>
			<p>{props.activity.content}</p>
			<div
				style={{ scrollbarWidth: "none" }}
				className="flex flex-row mt-2 overflow-x-scroll overflow-y-hidden space-x-4"
			>
				{props.activity.media.map((media, index) => {
					const media_type = media.type
					switch (media_type) {
						case "image":
							return (
								<Link to={{hash:`#img-${media.url}`}}>
									<img
										onClick={(e) => {}}
										style={{ objectFit: "contain" }}
										className="w-max h-60 hover:scale-105 transition-transform duration-150"
										src={media.url}
									/>
								</Link>
							)
						case "video":
							return <a>videos are not supported at the moment.</a>
					}
				})}
			</div>
		</div>
	)
}
