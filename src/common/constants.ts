
interface IState {
	name: string
	img: string
	type?: "library" | "runtime" | "language" | "tool" | "database" | "hidden"
}

export const navbar_paths = {
	"/": "Projects",
	// "/career": "Career",
	// "/pinboard": "Pinboard"
}


const API_URL_PROD = "https://api.phasenull.dev"
const API_URL_DEV = "http://localhost:8787"
export const ENV: "dev" | "production" = "production"
	// window.location.hostname === "localhost" ? "dev" : "production"
export const API_URL = (ENV as any) === "dev" ? API_URL_DEV : API_URL_PROD
export const HOST_URL = "https://phasenull.dev"
export const HOST_NAME = new URL(HOST_URL).hostname
export const personal_info = {
	timezone: "Europe/Istanbul (UTC+3)",
	pronouns: "he/him",
	birthdate: new Date("2007/06/01"),
	education_start_date: new Date("2025/09/01"),
	education_failed_years: 0, // shout out to burak https://github.com/astudentinearth
	call_me: "phase",
	contact: {
		email: "contact@phasenull.dev",
		discord: "https://discord.com/users/465101652018593803",
		twitter: "https://x.com/phasenull",
		youtube: "https://www.youtube.com/@phasenulldev",
		github: "https://github.com/phasenull",
		// cursed_platform: "https://www.linkedin.com/in/phasenull",
		roblox: "https://www.roblox.com/users/409950512/profile"
	}
}
