import { FILTER_CLASS } from "../util"

function WelcomerSkip(prop) {
	const {href} = prop
	function remove_classes(element,filter) {
		if (!filter | !element) {alert("invalid input");return}
		let new_class = element.classList
		filter.forEach((e)=>{
			new_class = FILTER_CLASS(new_class, e)
		})
		new_class = new_class.join(" ")
		element.classList = new_class
	}
	function play_enter_animation() {
		const rocket = document.getElementById("rocket")
		remove_classes(rocket,["translate"])
		rocket.classList.add("-translate-y-52","duration-[0.75s]","ease-linear")
		rocket.classList.add("-translate-x-12")
		rocket.classList.add("rotate-[0deg]")
	}
	function clicked() {
		//wait 1 seconds
		if (is_clicked) {return}
		is_clicked = true
		const rocket = document.getElementById("rocket")
		remove_classes(rocket,["translate","group-hover","hidden"])
		const img = rocket.children[0]
		remove_classes(img,["translate","hidden"])
		const huge = rocket.parentElement
		const planets = document.getElementById("planets")
		remove_classes(planets,["hidden","group-hover"])
		planets.classList.add("flex")
		const planets_img = planets.children[0]
		remove_classes(planets_img,["hidden","group-hover"])
		planets_img.classList.add("opacity-100")
		remove_classes(huge,["hover"])
		huge.classList.add("scale-105")
		huge.classList.add("bg-secondary-darkest")
		rocket.classList.add("-translate-y-4")
		rocket.classList.add("-translate-x-24")
		const get_started_text = document.getElementById("get_started_text")
		get_started_text.classList.add("translate-y-32","ease-in","duration-300")
		play_enter_animation()
		
		setTimeout(() => {
			window.location.href = href || "/"
		},500)
	}
	let is_clicked = false
	return (
		<button id="welcomer" onClick={clicked} className="hover:scale-105 shadow-2xl bg-cover overflow-hidden group
		text-2xl select-none bg-secondary h-32 px-20 text-primary font-bold rounded-full text-center 
		transition-all duration-500 hover:bg-secondary-darkest">
			<div id = "planets" className="absolute w-full hidden group-hover:flex -translate-y-14 translate-x-40">
				<img className="z-1 w-2/3 transition-opacity duration-1000 ease-out opacity-0 select-none group-hover:opacity-100" src="https://www.pinclipart.com/picdir/big/561-5617080_galaxy-space-cosmic-cosmos-nebula-universe-stars-outer.png" alt="" />
			</div>
			<div id = "rocket" className="z-1 transition-all duration-0 out group-hover:duration-1000 rotate-[30deg] group-hover:-translate-y-4 -translate-x-64 translate-y-32 group-hover:-translate-x-24">
				<img className="group-hover:animate-shake z-1 absolute h-40 hidden group-hover:block select-none left-5" src="/media/rocket.gif" alt="" />
			</div>
			<div id = "get_started_text" className="z-[6] relative group-hover:text-white transition-transform duration-1000 in-out">
				GET STARTED
				<div id = "now_text" className="text-secondary-darkest animate-pulse group-hover:animate-bounce z-6 group-hover:text-secondary"> NOW</div>
			</div>
		</button>
	);
}
export default WelcomerSkip;