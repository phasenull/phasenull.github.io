import avatar from "@assets/phasenull/avatar.jpg"
import { ENV, personal_info } from "../../../common/constants"
import ContactStack from "./contact-stack"
import turkiye_flag_svg from "@assets/phasenull/Flag_of_Turkey.svg"
import NavBar from "./navbar"
import { Fragment } from "react/jsx-runtime"
import { cleanURL } from "@common/util"
import { Link } from "react-router"
import ExternalLink from "@common/external-link"
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
						<p className="text-lg lg:hidden font-bold lg:text-2xl  text-slate-300">
							{personal_info.pronouns}
						</p>
					</a>
					<a className="text-lg hidden lg:inline font-bold lg:text-2xl  text-slate-300">
						{personal_info.pronouns}
					</a>
				</div>
				<h1 className="text-sm lg:text-lg h-max ">
					yet another {floored_age} year old self-taught software dev located in
					Türkiye <FlagTR />, i deploy SlopJS to production for fun (im unemployed
					so yeah). Currently studying computer engineering ({getEducationTitle()}) somewhere on <ExternalLink href="https://en.wikipedia.org/wiki/Earth">Earth</ExternalLink>
				</h1>
			</div>
			<ContactStack />
		</div>
	)
}
function getYearFromDate(date: Date) {
	// after september
	const current_year = new Date().getFullYear()
	if (date.getMonth() >= 8) return current_year - date.getFullYear() + 1
	return current_year - date.getFullYear()
}
function getEducationTitle() {
	const start_year = new Date(personal_info.education_start_date)
	const year = getYearFromDate(start_year)
	console.log("year",year)
	if (year <= 0) return "high school student, not a college student yet"
	if (year <= 1) return "freshman/1st year"
	if (year <= 2) return "sophomore/2nd year"
	if (year <= 3) return "junior/3rd year"
	if (year <= 4) return "senior/4th year"
	return `hi, ${personal_info.call_me} from 2025 here. 
	hopefully i've graduated by now 🙏🙏🙏 Im probably unemployed so please hire me: ${personal_info.contact.email}`
}
function FlagTR() {
	return (
		<img
			className="h-4 lg:h-5 mx-1 rounded-md inline-block"
			src={turkiye_flag_svg}
		></img>
	)
}
