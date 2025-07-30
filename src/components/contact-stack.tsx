import { personal_info } from "@common/constants"
import discord_svg from "@assets/social/discord.svg"
import youtube_img from "@assets/social/yt_logo_rgb_light.png"
import github_img from "@assets/social/GitHub_Logo.png"
import twitter_svg from "@assets/social/Twitter.svg"
import linkedin_img from "@assets/social/LI-Logo.png"
import roblox_img from "@assets/social/Roblox_Tilt_Black.png"
export default function ContactStack() {
	return (
		<div
			style={{ flex: 0.2 }}
			className="place-self-center place-items-center lg:place-items-end my-2 lg:justify-around lg:grid-cols-1 grid md:grid-cols-4 grid-cols-2 lg:space-y-4 lg:space-x-0 mt-2"
		>
			<SocialLinkWrapper href={`mailto:${personal_info.contact.email}`}>
				contact@phasenull.dev
			</SocialLinkWrapper>
			<SocialLinkWrapper href={personal_info.contact.roblox}>
				<SocialImageWrapper url={roblox_img} /> Roblox
			</SocialLinkWrapper>
			<SocialLinkWrapper>
				<SocialImageWrapper className="mr-1" url={discord_svg} />
				{personal_info.contact.discord}
			</SocialLinkWrapper>

			<SocialLinkWrapper href={personal_info.contact.github}>
				<SocialImageWrapper url={github_img} />
			</SocialLinkWrapper>
			<SocialLinkWrapper href={personal_info.contact.youtube}>
				<SocialImageWrapper url={youtube_img} />
			</SocialLinkWrapper>
			<SocialLinkWrapper href={personal_info.contact.cursed_platform}>
				<a className="absolute -top-4 -right-2 rotate-[15deg]">💩</a><SocialImageWrapper url={linkedin_img} />
			</SocialLinkWrapper>
			<SocialLinkWrapper href={personal_info.contact.twitter}>
				<SocialImageWrapper url={twitter_svg} /> Twitter
			</SocialLinkWrapper>
		</div>
	)
}
function SocialImageWrapper(props: { url: string; alt?: string,
	
	className?:string
 }) {
	return (
		<img
			style={{ objectFit: "contain" }}
			className={"h-6 inline-block"+ " " + props.className}
			alt={props.alt || "no alt text found"}
			src={props.url}
		/>
	)
}
function SocialLinkWrapper(props: {
	href?: string
	icon_url?: string
	children: any
}) {
	return (
		<a
			className="hover:scale-85 lg:hover:scale-105 font-bold scale-80 lg:scale-100 w-max self-end text-right hover:animate-shake transition-transform duration-150 flex"
			target="_blank"
			href={props.href}
		>
			{props.children}
		</a>
	)
}
