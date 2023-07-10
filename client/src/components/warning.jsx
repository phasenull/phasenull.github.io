import { useEffect, useState, Component, Fragment } from "react"
import { Outlet } from "react-router-dom";
import ReactDOM from "react-dom";
function Warning(props) {
	const { title } = props;
	const { text } = props;
	function close() {
		document.getElementById("warning").classList.add("hidden")
	}
	useEffect(() => {
		document.getElementById("root").appendChild(document.getElementById("warning"))
		document.getElementById("warning").classList.add("hidden")
	}, []);
	return (
		<div id="warning" className="z-[998] fixed top-0 h-screen w-screen grid justify-center content-center">
			<div className="grid text-white bg-secondary-darkest drop-shadow-2xl rounded-xl max-w-screen-sm mx-40">
				<p className="px-20 mt-3 text-center text-2xl font-bold ">
					{title || "Example Warning"}
				</p>
				<div className="bg-white h-[3px] my-1 mx-10 drop-shadow-xl">

				</div>
				<p className = "text-xl px-10">
					{text || "Looks like someone forgot to add a warning message!"}
				</p>
				<button onClick={close} className="text-sm font-bold justify-self-center relative text-secondary-darkest bg-primary-dark transition-all duration-100 hover:bg-secondary hover:scale-105 rounded-2xl h-10 w-[30%] min-w-[96px] max-w-[300px] m-10">
					OK
				</button>
			</div>
		</div>
	)
}
export default Warning