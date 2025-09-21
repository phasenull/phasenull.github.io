interface IState {
	name: string
	img: string
	type?: "library" | "runtime" | "language" | "tool" | "database" | "hidden"
}

export const navbar_paths = {
	"/": "Projects",
	"/career": "Career",
	"/pinboard": "Pinboard"
}

const API_URL_PROD = "https://api.phasenull.dev"
const API_URL_DEV = "http://localhost:8787"
export const ENV: "dev" | "production" =
	window.location.hostname === "localhost" ? "dev" : "production"
export const API_URL = (ENV as any) === "dev" ? API_URL_DEV : API_URL_PROD
export const HOST_URL = "https://phasenull.dev"
export const personal_info = {
	pronouns: "he/him",
	birthdate: new Date("2007/06/01"),
	contact: {
		email: "contact@phasenull.dev",
		discord: "https://discord.com/users/465101652018593803",
		twitter: "https://x.com/phasenull",
		youtube: "https://www.youtube.com/@phasenulldev",
		github: "https://github.com/phasenull",
		cursed_platform: "https://www.linkedin.com/in/phasenull",
		roblox: "https://www.roblox.com/users/409950512/profile"
	}
}
