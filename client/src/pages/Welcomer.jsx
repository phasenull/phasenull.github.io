/* eslint-disable no-unused-vars */
import { Outlet } from "react-router-dom"
import WelcomerSkip from "../components/welcomer_skip"
import { GET_GROUP_DETAILS, GET_MODEL_COUNT, GET_SALES } from "../util"
import { useEffect, useState } from "react"
const stats = [
	{ id: 1, name: "systems", value: await GET_MODEL_COUNT() },
	{ id: 2, name: "amazing members", value: "?" },
	{ id: 3, name: "sales", value: await GET_SALES() },
]

function Welcomer(prop) {
	useEffect(() => {
		async function get() {
		}
		get()
	}, [])
	return (
		<div className="h-screen pt-24">
			<div className="mx-auto max-w-7xl px-6 lg:px-8 select-none">
				<p className="text-center text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r drop-shadow-xl from-green-600 to-green-600 pb-3">
					Hello!
				</p>
				<p className="text-center text-4xl text-white text-extrabold">
					Welcome to phasenull's landing page!
				</p>
			</div>
		</div>
	)
}

export default Welcomer