/* eslint-disable no-unused-vars */
import { Outlet } from "react-router-dom"
import WelcomerSkip from "../components/welcomer_skip"
import { GET_GROUP_DETAILS, GET_MODEL_COUNT, GET_SALES } from "../util"
import { useEffect, useState, Component } from "react"
import { render } from "@testing-library/react"
const stats = [
	{ id: 1, name: "systems", value: await GET_MODEL_COUNT() },
	{ id: 2, name: "amazing members", value: "?" },
	{ id: 3, name: "sales", value: await GET_SALES() },
]

class RobloxWelcomer extends Component {
	constructor(props){
		super(props)
		this.state = {
			group_data: {}
		}
	}
	UNSAFE_componentWillMount(){
		const {group_id} = this.props
        GET_GROUP_DETAILS(group_id).then(res => {
				this.setState({group_data: res.data})
		})
    }
	render() {
		return (this.props.group_data && <div>
			<div className="h-screen pt-24">
				<div className="mx-auto max-w-7xl px-6 lg:px-8 select-none">
					<p className="text-center text-6xl font-extrabold bg-clip-text text-transparent drop-shadow-xl bg-green-600 pb-3">
						Hello!
					</p>
					<p className="text-center text-base text-white drop-shadow-2xl text-4xl font-bold pb-5">
						Here, in
						<a href={"https://roblox.com/groups/" + this.state.group_data.group_id} target="_blank" rel="noreferrer" className="font-extrabold inline text-green-500 transition-color duration-300 hover:text-blue-400 inline">
							{" " + (this.state.group_data.name)}
						</a> we have
					</p>
					<dl className="pt-6 grid grid-cols-1 gap-x-8 gap-y-16 text-center sm:grid-cols-3 shadow-2xl py-4 mx-20 rounded-full px-10 bg-white">
						{stats.map((stat) => (
							<div key={stat.id} className="mx-auto max-w-xs flex-col gap-y-4">
								<dd className="text-3xl font-semibold tracking-wide drop-shadow-lg text-gray-300 sm:text-5xl ease-in-out delay-150 opacity-1">{(stat.id === 2 && this.state.group_data.memberCount) || stat.value}</dd>
								<dt className="text-base leading-7 text-gray-400 text-2xl py-4">{stat.name}</dt>
							</div>
						))}
					</dl>
				</div>
				<div className="py-[5%]">
					<p className="text-center">
						<a href="/home">
							<WelcomerSkip />
						</a>
					</p>
				</div>
			</div>
		</div>)
	}
}

export default RobloxWelcomer
