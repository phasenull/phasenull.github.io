import { useEffect } from "react";

function TechSwitcher(params) {
	function animate() {
		const techSwitcher = document.getElementById("tech-switcher");
		const techSwitcher_new = document.getElementById("tech-switcher-new");
		const techSwitcher_old = document.getElementById("tech-switcher-old");
		techSwitcher.classList.remove("-translate-y-[50%]")
		techSwitcher.classList.remove("duration-1000")
		techSwitcher_old.classList.remove("opacity-0")
		techSwitcher_old.classList.add("duration-0")
		techSwitcher_old.classList.remove("duration-1000")
		techSwitcher_new.classList.remove("duration-1000")
		techSwitcher_new.classList.remove("opacity-100")
		techSwitcher_new.classList.add("duration-0")
		techSwitcher_new.classList.add("opacity-0")
		techSwitcher.classList.add("duration-0")
		setTimeout(() => {
			techSwitcher.classList.remove("duration-0")
			techSwitcher.classList.add("duration-1000")
			techSwitcher_old.classList.add("opacity-0")
			techSwitcher_old.classList.add("duration-1000")
			techSwitcher_new.classList.remove("opacity-0")
			techSwitcher_new.classList.add("duration-1000")
			techSwitcher_new.classList.add("opacity-100")
			techSwitcher.classList.add("-translate-y-[50%]")
		}, 10);
	}
	useEffect(() => {
		if (window.is_ticking) return;
		window.is_ticking = true
		const techSwitcher_new = document.getElementById("tech-switcher-new");
		const techSwitcher_old = document.getElementById("tech-switcher-old");
		let i = 0;
		const tech = ['JavaScript <img class="inline h-6" src="/media/javascript.png" alt="img" />',
		'luau <img class="inline h-6" src="/media/luau.png" alt="img" />',
		'Python <img class="inline h-6" src="/media/Python.png" alt="img" />',
		'React <img class="inline h-6" src="/media/React.png" alt="img" />'
	
	]
		setInterval(() => {
			techSwitcher_old.innerHTML = tech[i];
			i = i + 1;
			if (!tech[i]) i = 0;
			const text = tech[i];
			techSwitcher_new.innerHTML = text;
			animate();
		}, 1000);
	}, []);
	return (
		<div className="inline ml-2 mr-28 text-primary-dark">
			<div id="tech-switcher" className="absolute transition-all duration-1000 absolute inline ">
				<p id="tech-switcher-old" className="transition-all duration-1000">
					JavaScript <img className="inline h-6" src="/media/javascript.png" alt="img" />
				</p>
				<p id="tech-switcher-new" className="transition-all duration-1000 opacity-0">
					luau
				</p>
			</div>
		</div>
	)
}
export default TechSwitcher;