import avatar from "@assets/phasenull/avatar.jpg"
import { ENV, personal_info } from "../../../common/constants"
import ContactStack from "./contact-stack"
import turkiye_flag_svg from "@assets/phasenull/Flag_of_Turkey.svg"
import NavBar from "./navbar"
import { Fragment } from "react/jsx-runtime"
export default function Header() {
	const floored_age = Math.floor(
		(Date.now() - personal_info.birthdate.getTime()) /
			(365 * 24 * 60 * 60 * 1000)
	)
	return (
		<div className="self-center lg:gap-x-4 lg:w-[80%] bg-white lg:mt-10 pt-5 px-10 flex-col lg:flex-row flex rounded-t-[40px] relative lg:justify-between">
			<img
				src={avatar}
				className="lg:flex-1/5 hidden lg:block justify-center rounded-full self-center aspect-square max-w-[80%] max-h-16 lg:max-h-64 lg:w-full lg:h-full lg:max-w-64"
			/>
			<div className="flex-col lg:flex-3/5 flex space-y-4">
				<div className="space-x-3 flex-row lg:items-end text-center flex">
					<img
						src={avatar}
						className="lg:flex-1/5 block lg:hidden justify-center rounded-full self-center aspect-square max-w-[80%] max-h-16 lg:max-h-64 lg:w-full lg:h-full lg:max-w-64"
					/>
					<a className="font-bold flex flex-col lg:flex-row text-center lg:text-left text-4xl text-slate-800 lg:text-6xl">
						phasenull.dev
						<br />
						<a className="text-lg lg:hidden font-bold lg:text-2xl  text-slate-300">
							{personal_info.pronouns}
						</a>
					</a>
					<a className="text-lg hidden lg:inline font-bold lg:text-2xl  text-slate-300">
						{personal_info.pronouns}
					</a>
				</div>
				<h1 className="text-sm lg:text-lg h-max ">
					yet another {floored_age} year old self-taught software dev located in
					Türkiye <FlagTR />
					{ENV === "dev" ? (
						<Fragment>
							<br />
							<br />
							quick disclaimer: if you're seeing this text it means this is a
							development version of this site.
							<br />
							expect things not to work. [27/09/2025]
							<br />
						</Fragment>
					) : null}
				</h1>
			</div>
			<ContactStack />
		</div>
	)
}
function FlagTR() {
	return (
		<img
			className="h-4 lg:h-5 mx-1 rounded-md inline-block"
			src={turkiye_flag_svg}
		></img>
	)
}
