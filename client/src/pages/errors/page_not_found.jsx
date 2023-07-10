import { Fragment } from "react";
import { TbError404 } from "react-icons/tb"
import { GoHome } from "react-icons/go";
function PageNotFound(params) {
	function return_to_home() {
		window.location.href = "/"
	}
	document.title = "Page Not Found | how did you get lost in my portfolio?"
	return <Fragment>
		<div className="grid place-items-center h-screen text-center text-primary-dark bg-none">
			<div>
				<h1 className="select-none font-extrabold text-6xl">
					<TbError404 className="inline" size={200} />
					<p className="text-secondary-dark inline">|
					</p> Page Not Found
				</h1>
				<button className="group mt-20 bg-primary-dark text-secondary-dark h-32 w-32 rounded-full transition-all duration-250 hover:bg-secondary hover:text-white hover:scale-105" onClick={return_to_home}><GoHome className="inline h-20 w-20 group-hover:animate-shakerotation"/></button>
			</div>
		</div>
	</Fragment>
}
export default PageNotFound;