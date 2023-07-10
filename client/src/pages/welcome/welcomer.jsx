/* eslint-disable no-unused-vars */
import { Outlet } from "react-router-dom"
import WelcomerSkip from "../../components/welcomer_skip"
import { GET_GROUP_DETAILS, GET_MODEL_COUNT, GET_SALES } from "../../util"
import { useEffect, useState } from "react"
import IndexPaginator from "../../components/index_paginator"
import Warning from "../../components/warning"

function Welcomer(prop) {
	useEffect(() => {
		document.title = "phasenull.dev";
	}, [])
	return (
		<div className="h-screen pt-24">
			<div className="mx-auto max-w-7xl px-6 lg:px-8 select-none">
				<p className="text-center text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r drop-shadow-xl from-green-600 to-green-600 pb-3">
					Hello!
				</p>
				<p className="text-center text-4xl text-white font-bold drop-shadow-xl">
					Welcome to phasenull's landing page!
				</p>
				<div className="pt-20">
					<p className="text-center text-2xl font-bold text-primary-dark drop-shadow-xl">
						First, lets find out what you're here for.
					</p>
					<IndexPaginator />
				</div>
			</div>
		</div>
	)
}

export default Welcomer