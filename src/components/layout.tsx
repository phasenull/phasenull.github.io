import { Fragment } from "react/jsx-runtime"
import NavBar from "./navbar"
import Header from "./header"

import banner from "../assets/phasenull/banner.jpg"
import DashboardPanel from "@components/dashboard-panel"
export default function Layout(props: { children: any }) {
	return (
		<div className="h-screen w-screen flex flex-col overflow-x-clip overflow-y-scroll">
         <NavBar />
			<img
				style={{ objectFit: "cover" }}
				className="top-18 h-144 lg:h-80 overflow-x-hidden scale-100 -z-10 absolute"
				src={banner}
			/>
			<Header />
			<div className="bg-white">
			{props.children}
			</div>
		</div>
	)
}
