import avatar from "@assets/phasenull/avatar.jpg"
import { personal_info } from "../../../common/constants"
import { EmailButton, SocialButtons } from "./contact-stack"
import turkiye_flag_svg from "@assets/phasenull/Flag_of_Turkey.svg"
import ExternalLink from "@common/external-link"
import { FaClock } from "react-icons/fa6"
export default function Header() {
	const floored_age = Math.floor(
		(Date.now() - personal_info.birthdate.getTime()) /
			(365 * 24 * 60 * 60 * 1000)
	)
	return (
		<header className="relative rounded-3xl border border-slate-200 bg-white p-5 sm:p-8 lg:rounded-[2.5rem] lg:p-10">
			<div className="flex gap-10">
				<img
					src={avatar}
					alt="phasenull's avatar"
					className="hidden size-52 shrink-0 rounded-full border-[6px] border-white object-cover lg:block"
				/>

				<div className="min-w-0 flex-1">
					<div className="flex items-center gap-3.5 lg:block">
						<img
							src={avatar}
							alt=""
							className="size-16 shrink-0 rounded-full border-[3px] border-white object-cover ring-1 ring-slate-900/5 sm:size-20 lg:hidden"
						/>
						<div className="min-w-0">
							<div className="flex flex-wrap items-center gap-x-2 gap-y-1 lg:items-end lg:gap-3">
								<h1 className="text-[1.75rem] font-black leading-tight tracking-tight text-slate-900 sm:text-4xl lg:text-6xl">
									phasenull<span className="text-slime-500">.dev</span>
								</h1>
								<span className="rounded-full bg-grape-blob/10 px-2 py-0.5 text-xs font-bold text-grape-blob sm:px-3 sm:text-sm lg:mb-1.5">
									{personal_info.pronouns}
								</span>
							</div>
							<p className="text-sm font-bold text-slate-400 sm:text-base lg:mt-1 lg:text-lg">Roblox & fullstack developer</p>
						</div>
					</div>

					<p className="mt-4 text-[15px] leading-relaxed text-slate-600 lg:text-lg">
						yet another {floored_age} year old Roblox and fullstack dev located in
						Türkiye <FlagTR />. Currently majoring in computer engineering (
						{getEducationTitle()}). I do fullstack web as more of a hobby, my main
						focus is Roblox development nowadays.
						<br />
						yea, i like TypeScript and prefer{" "}
						<ExternalLink href="https://roblox-ts.com/">roblox-ts</ExternalLink> (with{" "}
						<ExternalLink href="https://github.com/typetorch">TypeTorch</ExternalLink>)
						over luau. feel free to say hi 💚
					</p>

					<div className="mt-5 flex flex-col gap-3 lg:mt-6 lg:flex-row lg:items-center lg:justify-between lg:gap-4">
						<div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
							<EmailButton />
							<SocialButtons className="hidden lg:flex" />
						</div>
						<SocialButtons className="flex lg:hidden" />
						<p className="flex items-center gap-2 text-xs font-semibold text-slate-400 sm:text-sm">
							<FaClock />
							{personal_info.timezone}
						</p>
					</div>
				</div>
			</div>
		</header>
	)
}

function getEducationTitle() {
	const start_date = new Date(personal_info.education_start_date)
	let final_date = start_date
	final_date.setFullYear(
		start_date.getFullYear() + personal_info.education_failed_years
	)

	const year_in_ms = 365 * 24 * 60 * 60 * 1000
	const diff_years = (Date.now() - final_date.getTime()) / year_in_ms
	if (diff_years <= 0 && !personal_info.education_failed_years)
		return "high school student, not a college student yet"
	if (diff_years <= 1) return "freshman/1st year"
	if (diff_years <= 2) return "sophomore/2nd year"
	if (diff_years <= 3) return "junior/3rd year"
	if (diff_years <= 4) return "senior/4th year"
	return `hi, ${personal_info.call_me} from 2025 here. 
	hopefully i've graduated by now 🙏🙏🙏 Im probably unemployed so please hire me: ${personal_info.contact.email}`
}
function FlagTR() {
	return (
		<img
			className="mx-0.5 inline-block h-4 rounded-sm align-[-2px]"
			src={turkiye_flag_svg}
			alt="Türkiye flag"
		/>
	)
}
