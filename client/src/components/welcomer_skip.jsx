function WelcomerSkip(prop) {
	return (
		<button id="welcomer" className="overflow-clip group text-2xl select-none bg-secondary py-10 px-20 text-primary font-bold rounded-full text-center transition-all hover:scale-105
		hover:bg-gradient-to-r hover:from-[#57cc99] to-blue-500">
			{/* <img alt="rocket" className="h-20 hidden group-hover:inline-block" src="https://tr.rbxcdn.com/14b2a81ff16cea41af8dd289cd28635c/352/352/Avatar/Png" /> */}
			<div className="z-5 transition-transform duration-0 out group-hover:duration-500 group-hover:-translate-y-32 -translate-x-32 group-hover:-translate-x-5">
				<img className="z-5 absolute right-1/2 h-40 translate-y-[70%] hidden group-hover:block rotate-45 transition ease-in-out" src="https://static.vecteezy.com/system/resources/previews/013/743/608/original/cartoon-rocket-launch-png.png" alt="" />
			</div>
			<p className="z-1">
				GET STARTED
				<p className="text-secondary-dark animate-pulse group-hover:animate-bounce z-1"> NOW</p>
			</p>
		</button>
	);
}
export default WelcomerSkip;