import { BsPersonWorkspace } from "react-icons/bs";
import Warning from "./warning"
function IndexPaginator(params) {
	function redirect_to(url) {
		window.location.href = url;
	}
	const ledo_info = "Ledo is a Roblox group I've started for fun, I sell Roblox Systems / Scripts / Codes there. I've also added a section here since LEDO might need a website for future projects. But for now you can just see what items we have."
	return (
		<div className="pt-5 flex justify-center grid gap-5">
			<Warning title = "What is LEDO?" text = {ledo_info} />
			<div className="relative">
				<button onClick={() => {redirect_to("/portfolio")}} className="w-full group bg-primary-dark rounded-2xl shadow-xl transition-all duration-300 hover:scale-105 hover:bg-secondary">
					<p className="mx-16 my-10 text-2xl font-bold text-secondary-dark group-hover:text-white">
						My portfolio <BsPersonWorkspace className="absolute right-[10%] top-[40%] group-hover:animate-shakerotation" />
					</p>
				</button>
			</div>
			{/* <div className="relative">
				<button onClick={() => {redirect_to("/ledo")}} className="w-full group bg-primary-dark rounded-2xl shadow-xl transition-all duration-300 hover:scale-105 hover:bg-secondary">
					<p className="mx-20 my-10 text-2xl font-bold text-secondary-dark group-hover:text-white xsm:invisible">
						LEDO
					</p>
					<LuNetwork className="absolute right-[10%] top-[40%] text-2xl font-bold text-secondary-dark group-hover:text-white group-hover:animate-shakerotation" />
				</button>
				<AiOutlineQuestionCircle onClick={info_about_ledo} className="absolute -right-10 bottom-[40%] text-secondary-darkest hover:text-white hover:font-2xl hover:scale-200 hover:animate-shake" size={30} />
			</div> */}
		</div>
	)
}
export default IndexPaginator;