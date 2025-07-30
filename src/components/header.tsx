import avatar from "../assets/phasenull/avatar.jpg"
import { personal_info } from "../common/constants"
import AnimatedStackComponent from "./animated-stack"
import ContactStack from "./contact-stack"
import turkiye_flag_svg from "@assets/phasenull/Flag_of_Turkey.svg"
export default function Header() {
	const floored_age =
		Math.floor(
			((Date.now() - personal_info.birthdate.getTime()) /
				(365 * 24 * 60 * 60 * 1000)) *
				10
		) / 10
	return (
		<div className="w-[90%] self-center lg:w-[80%] bg-white lg:mt-10 mt-5 px-5 pt-1 flex-col lg:flex-row flex rounded-t-[40px] relative lg:justify-between">
			<img
				style={{flex:0.2}}
				src={avatar}
				className="m-5 justify-center rounded-full self-center aspect-square max-w-[80%] lg:max-h-48 lg:max-w-48"
			/>
			<div style={{flex:0.6}}
			 className="flex-col flex space-y-4">
				<h1 className="font-bold text-center lg:text-left text-4xl lg:text-6xl">phasenull.dev</h1>
				<p className="text-sm lg:text-lg h-16">
					yet another {floored_age} year old self-taught software dev located in Türkiye <FlagTR/>, im flexible about the stack but i mostly do{" "}
					<AnimatedStackComponent />
				</p>
			</div>
			<ContactStack/>
		</div>
	)
}
function FlagTR() {
	return <img className="h-4 lg:h-5 mx-1 rounded-md inline-block" src={turkiye_flag_svg}></img>
}
