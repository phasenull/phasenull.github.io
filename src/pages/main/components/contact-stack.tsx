import { personal_info } from "@common/constants"
import discord_svg from "@assets/social/discord.svg"
import youtube_img from "@assets/social/youtube.svg"
import github_img from "@assets/social/github.svg"
import twitter_svg from "@assets/social/Twitter.svg"
import linkedin_img from "@assets/social/linkedin.svg"
import roblox_img from "@assets/social/Roblox_Tilt_Black.png"
export default function ContactStack() {
	return (
		<>
			<SocialLinkWrapper className="lg:hidden mt-4 self-center text-center inline-block select-all">
				{personal_info.contact.email}
			</SocialLinkWrapper>
			<div
				style={{ flex: 0.2 }}
				className=" place-items-center  lg:place-items-end my-2 lg:grid-cols-1 lg:grid justify-evenly flex flex-wrap lg:space-y-4 lg:space-x-0"
			>
				<SocialLinkWrapper className="hidden lg:inline-block select-all">
					{personal_info.contact.email}
				</SocialLinkWrapper>
				<SocialLinkWrapper href={personal_info.contact.github}>
					<SocialImageWrapper className="h-8" url={github_img} />
				</SocialLinkWrapper>
				<SocialLinkWrapper href={personal_info.contact.youtube}>
					<SocialImageWrapper className="h-8" url={youtube_img} />
				</SocialLinkWrapper>
				<SocialLinkWrapper href={personal_info.contact.cursed_platform}>
					<a className="absolute -top-4 -right-2 rotate-[15deg]">💩</a>
					<SocialImageWrapper url={linkedin_img} />
				</SocialLinkWrapper>
				<SocialLinkWrapper href={personal_info.contact.twitter}>
					<SocialImageWrapper className="h-7" url={twitter_svg} />
				</SocialLinkWrapper>
				<SocialLinkWrapper href={personal_info.contact.roblox}>
					<SocialImageWrapper className="h-8" url={roblox_img} />
				</SocialLinkWrapper>
				<SocialLinkWrapper href={personal_info.contact.discord}>
					<SocialImageWrapper url={discord_svg} />
				</SocialLinkWrapper>
			</div>

		</>
	)
}
function SocialImageWrapper(props: {
	url: string
	alt?: string
	className?: string
}) {
	return (
		<img
			style={{ objectFit: "contain" }}
			className={"h-6 inline-block" + " " + props.className}
			alt={props.alt || "no alt text found"}
			src={props.url}
		/>
	)
}
function SocialLinkWrapper(props: {
	href?: string
	icon_url?: string
	children: any
	className?: string
}) {
	return (
		<a
			className={`hover:scale-85  lg:hover:scale-105 font-bold scale-80 lg:scale-100 w-max text-right transition-transform duration-150 flex lg:self-end ${props.className} `}
			target="_blank"
			href={props.href}
		>
			{props.children}
		</a>
	)
}
