/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { Outlet } from "react-router-dom"
import WelcomerSkip from "../../components/welcomer_skip"
import { GET_GROUP_DETAILS, GET_MODEL_COUNT, GET_SALES } from "../../util"
import { useEffect, useState, Component } from "react"
import { render } from "@testing-library/react"
import { GoLink } from "react-icons/go"
import ExternalLink from "../../components/external_link"
import LoadingScreen from "../../components/LoadingScreen"
function RobloxWelcomer(props) {
	const { group_id } = props
	const [group_data, setGroupData] = useState([])
	const [stats, setStats] = useState([])
	async function get_stats() {
		const new_stats = [
			{ id: 1, name: "systems for sale", value: await GET_MODEL_COUNT().then(res => res) },
			{ id: 2, name: "amazing members", value: group_data.memberCount },
			{ id: 3, name: "total sales", value: await GET_SALES().then(res => res) },
		]
		return new_stats
	}
	useEffect(() => {
		if (!group_id || group_data.memberCount) return
		document.title = "LEDO | Get Started"
		GET_GROUP_DETAILS(group_id).then(res => setGroupData(res))
	}, [])
	useEffect(() => {
		if (!group_data.memberCount || stats[1]) return
		get_stats().then((res) => setStats(res))
	}, [group_data])
	return <div className="h-screen pt-4 md:pt-24">
		<LoadingScreen
			sx={
				{
					color: '#fff',
					zIndex: (theme) => theme.zIndex.drawer + 1
				}
			}
			open={!(group_data.memberCount && stats[1])}>
			<p className="mx-5">
				Please Wait...
			</p>
		</LoadingScreen>
		<div className="mx-auto max-w-7xl px-6 lg:px-8 select-none">
			<p className="text-center text-6xl font-extrabold bg-clip-text text-transparent drop-shadow-xl bg-green-600 pb-3">
				Hello!
			</p>
			<p className="text-center text-base text-white drop-shadow-2xl text-4xl font-bold pb-5">
				Here, in <ExternalLink href={"https://roblox.com/groups/" + group_data.id}>
					{(group_data.name || "")}
				</ExternalLink> we have
			</p>
			<dl className="overflow-hidden grid md:h-24 h-72 md:grid-cols-3 w-max gap-y-0 md:gap-y-16 text-center grid-cols-1 shadow-2xl mx-auto rounded-full bg-white">
				{stats.map((stat) => (
					<div key={stat.id} className="w-full h-full flex-col shadow pt-2">
						<p className="text-5xl mx-10 md:mx-16 font-semibold tracking-wide drop-shadow-lg text-gray-300 ease-in-out delay-150 opacity-1">
							{stat.value}
						</p>
						<dt className="text-base leading-7 text-gray-400 text-2xl">{stat.name}</dt>
					</div>
				))}
			</dl>
		</div>
		<div className="py-[5%]">
			<p className="text-center">
				<WelcomerSkip href="./welcome" />
			</p>
		</div>
	</div >

}

export default RobloxWelcomer
