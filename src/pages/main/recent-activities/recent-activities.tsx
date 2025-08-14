import {
	useGetActivities,
	type IActivity,
	type IActivityMedia
} from "@common/hooks"
import React, { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { Link, useLocation, useSearchParams, useNavigate } from "react-router"
import { Fragment } from "react/jsx-runtime"
import arrow_right from "@assets/arrow_right.svg"
import arrow_left from "@assets/arrow_left.svg"
import { BiLink } from "react-icons/bi"
import { HOST_URL } from "@common/constants"
export default function RecentActivitiesPage() {
	const { data, isLoading, isFetching } = useGetActivities()
	const { hash } = useLocation()
	const focus_index = hash.includes("focus=") && hash.indexOf("focus=")
	const focus_media_id =
		focus_index && parseInt(hash.slice(focus_index + "focus=".length))
	const focus_media = data?.media_list?.find((e) => e.id === focus_media_id)
	console.log("hash focus found, displaying media:", focus_media_id)
	const other_media = data?.media_list?.filter(
		(e) => e.activity_id === focus_media?.activity_id
	)
	const focus_activity_id = parseInt(hash.slice(1))
	const focus_activity = data?.activity_list.find(
		(e) => e.id === focus_activity_id
	)

	let total_media, current_index, previous_media, next_media
	if (focus_media && other_media) {
		total_media = other_media?.length
		current_index = other_media?.findIndex((e) => e.id === focus_media_id)

		previous_media = other_media![current_index! - 1]
		next_media = other_media![current_index! + 1]
	}
	const navigate = useNavigate()
	useEffect(() => {
		if (focus_activity) {
			const element = document.getElementById(`activity-${focus_activity.id}`)
			if (!element) {
				console.error("found activity in data, but not on dom")
				return
			}
			element.scrollIntoView({ behavior: "smooth" })
		}
	}, [hash, data])
	if (isFetching || isLoading) return <div>loading state</div>
	const common_button_css =
		" transition-colors h-max duration-500 max-w-30  hover:opacity-50 h-80 select-none"
	return (
		<Fragment>
			{createPortal(
				<React.Fragment>
					<Link
						to={{ hash: "" }}
						className={`flex ${
							focus_media ? "" : "hidden"
						} cursor-default select-none opacity-30 top-0 bg-black z-[300] items-center h-screen w-screen justify-center absolute`}
					/>
					<div
						key="focus-portal"
						className={`flex ${
							focus_media ? "scale-100 " : "scale-0 opacity-0"
						} transition-transform w-screen top-0 z-[300] pointer-events-none items-center h-screen justify-center absolute`}
					>
						<Link
							className={`h-max left-10 absolute ${
								previous_media ? "pointer-events-auto" : "pointer-events-none"
							}`}
							to={{ hash: `focus=${previous_media?.id}` }}
						>
							<img
								color="gray"
								src={arrow_left}
								className={`${
									previous_media ? "color-slate-200" : "opacity-0"
								} ${common_button_css}`}
							></img>
						</Link>
						<div className="max-w-[80%] mx-2 h-max absolute items-center justify-center pointer-events-auto flex z-[301]">
							<img
								className=" h-max object-scale-down max-h-screen"
								src={focus_media?.url}
							/>
						</div>
						<Link
							className={`h-max absolute right-10 ${
								next_media ? "pointer-events-auto" : "pointer-events-none"
							}`}
							to={{ hash: `focus=${next_media?.id}` }}
						>
							<img
								color="gray"
								src={arrow_right}
								className={`${
									next_media ? "color-slate-200" : "opacity-0"
								} ${common_button_css}`}
							></img>
						</Link>
					</div>
				</React.Fragment>,
				document.body
			)}
			<div className="justify-center flex flex-col mb-20 space-y-5 pt-20">
				{data?.activity_list.map((activity, index) => (
					<ActivityContainer
						key={[activity.id, activity.platform].join("-")}
						activity={activity}
						media_list={data.media_list.filter(
							(e) => e.activity_id === activity.id
						)}
					/>
				))}
			</div>
		</Fragment>
	)
}

function ActivityContainer(props: {
	activity: IActivity
	media_list: IActivityMedia[]
}) {
	const { activity, media_list } = props
	return (
		<div
			id={`activity-${activity.id}`}
			className="w-[90%] overflow-hidden pt-4 lg:w-120 self-center shadow-md border-slate-300 border-1 rounded-xl"
		>
			<h4 className="font-semibold flex-row flex justify-between px-4 ">
				<p>
					Shared on{" "}
					<a
						href={activity.url!}
						target="_blank"
						className="underline text-blue-400"
					>
						{activity.platform}
					</a>
				</p>
				<div className="flex flex-row space-x-4">
					<p className="text-slate-400">
						{new Date(activity.created_at).toLocaleString("tr")}
					</p>
					<Link
						className="group"
						to={{ hash: `${activity.id}` }}
						onClick={() =>
							navigator.clipboard.writeText(
								`${HOST_URL}/recent-activities#${activity.id}`
							)
						}
					>
						<BiLink className="scale-150 group-hover:scale-170 duration-100 transition-transform inline" />
					</Link>
				</div>
			</h4>
			<p className="px-4 ">{activity.content}</p>
			{/* <p className="px-4 font-semibold text-slate-400">{media_list.length} medias</p> */}
			<div
				style={{ scrollbarWidth: "none" }}
				className={`bg-slate-100 mt-4 ${
					media_list.length > 1
						? "flex flex-row  h-40"
						: "justify-center items-center flex h-max max-h-80"
				} overflow-x-scroll overflow-y-hidden space-x-4`}
			>
				{media_list.map((media, index) => {
					const media_type = media.type
					switch (media_type) {
						case "image":
							return <ActivityImageComponent media={media} />
						case "video":
							return <video src={media.url} controls></video>
							return <a>videos are not supported at the moment.</a>
					}
				})}
			</div>
		</div>
	)
}

function ActivityImageComponent(props: {
	media: {
		id: number
		url: string
	}
}) {
	const { media } = props
	return (
		<Link key={[media.id].join()} to={{ hash: `focus=${media.id}` }}>
			<img
				onClick={(e) => {}}
				style={{ objectFit: "contain" }}
				className="w-max rounded-lg h-full max-h-80 hover:scale-105 transition-transform duration-150"
				src={media.url}
			/>
		</Link>
	)
}
