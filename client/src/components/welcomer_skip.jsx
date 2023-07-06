function WelcomerSkip(prop) {
	return (
		<button id="welcomer" className="overflow-hidden group text-2xl select-none bg-secondary py-10 px-20 text-primary font-bold rounded-full text-center transition-all duration-500 hover:scale-105 hover:bg-secondary-darkest">
			<div className="absolute w-full hidden group-hover:block -translate-y-14 translate-x-40">
				<img className="z-1 w-2/3 object-cover opacity-0 transition duration-500 group-hover:opacity-100" src="https://www.pinclipart.com/picdir/big/561-5617080_galaxy-space-cosmic-cosmos-nebula-universe-stars-outer.png" alt="" />
			</div>
			<div className="z-1 transition-transform duration-0 out group-hover:duration-1000 group-hover:-translate-y-4 -translate-x-64 translate-y-32 group-hover:-translate-x-24">
				<img className="z-1 absolute h-40 hidden group-hover:block rotate-45" src="https://static.vecteezy.com/system/resources/previews/013/743/608/original/cartoon-rocket-launch-png.png" alt="" />
			</div>
			<div className="z-[6] relative group-hover:text-white">
				GET STARTED
				<div className="text-secondary-darkest animate-pulse group-hover:animate-bounce z-6 group-hover:text-secondary"> NOW</div>
			</div>
		</button>
	);
}
export default WelcomerSkip;