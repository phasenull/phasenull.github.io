import { Outlet } from "react-router-dom"
import { Fragment } from "react"
import {BiArrowBack} from "react-icons/bi"
const LedoLayout = () => {
	let is_on = true
	function toggle_ui(params) {
		if (is_on) {
			document.getElementById("navbar-buttons").classList.add("-translate-x-[100%]")
			setTimeout(() => {
				is_on = false
				document.getElementById("navbar-buttons").classList.add("absolute")
			}, 300)
			document.getElementById("profile").classList.add("rounded-r-xl")
		}
		else {
			document.getElementById("navbar-buttons").classList.remove("absolute")
			document.getElementById("navbar-buttons").classList.remove("-translate-x-[100%]")
			setTimeout(() => {
				is_on = true
			}, 300)
			document.getElementById("profile").classList.remove("rounded-r-xl")
		}
	}
	return (
		<Fragment>
			<div className=" absolute h-16 z-[2000]">
				<div className="grid grid-rows-1 grid-flow-row md:grid-flow-col justify-start items-center rounded-r-xl overflow-hidden">
					<div id="profile" className="z-[1000] transition-color duration-300 flex items-center bg-primary-dark hover:bg-secondary-darkest w-full">
						<button className="group shadow h-16 w-full md:px-4 hover:animate-shakerotation">
							<img className="transition-transform duration-250 group-hover:scale-110 relative h-12 mx-auto my-auto rounded-full shadow-2xl" src="/media/LEDO.png" alt="" />
						</button>
					</div>
					<div id="navbar-buttons" className="transform-all duration-300 z-[999] bg-primary rounded-r-xl">
						<button className="navbar-button h-16 shadow hover:bg-primary-dark">
							<p className="relative font-bold text-white text-2xl mx-2">SIGN UP</p>
						</button>
						<button className="h-16 shadow navbar-button hover:bg-primary-dark">
							<p className="relative font-bold text-white text-2xl mx-2">SIGN IN</p>
						</button>
						<button id="toggle-navbar" className="group hover:bg-green-400 transform-all duration-300 h-16 w-10 text-center bg-none" onClick={toggle_ui}>
							<div className="group-hover:animate-shakerotation">
								<BiArrowBack className="mx-auto group-hover:scale-[150%] scale-[120%] text-secondary-darkest"/>
							</div>
						</button>
					</div>
					{/* TODO relative left */}
				</div>
			</div>
			<Outlet />
		</Fragment>
	)
}

export default LedoLayout
