

interface IState {
   name: string
   img: string
   type?: "library" | "runtime" | "language" | "tool" | "database" | "hidden"
}
export const stack: IState[] = [
	{ name: "luau", img: "", type: "language" },
	{ name: "TypeScript", img: "", type: "language" },
	{ name: "JavaScript", img: "", type: "language" },
	{ name: "Python", img: "", type: "language" },
	{ name: "roblox-ts", img: "", type: "tool" },
	{ name: "React Native (via Expo)", img: "" },
	{ name: "NodeJS", img: "", type: "runtime" },
	{ name: "BunJS", img: "", type: "runtime" },
	{ name: "NestJS", img: "", type: "library" },
	{ name: "ExpressJS", img: "", type: "library" },
	{ name: "ReactJS", img: "", type: "library" },
	{ name: "ElysiaJS", img: "", type: "library" },
	{ name: "HonoJS", img: "", type: "library" },
	{ name: "DiscordJS", img: "", type: "library" },
	{ name: "clear this interval", img: "", type: "hidden" },
]
const API_URL_PROD = "https://api.phasenull.dev"
const API_URL_DEV = "http://localhost:8787"
export const API_URL = process.env.NODE_ENV === "dev" ? API_URL_DEV : API_URL_PROD
export const personal_info = {
   birthdate: new Date("2007/06/01"),
   contact: {
      email:"contact@phasenull.dev",
      discord:"phasenull",
      twitter:"https://x.com/phasenull",
      youtube:"https://www.youtube.com/@phasenulldev",
      github:"https://github.com/phasenull",
      cursed_platform:"https://www.linkedin.com/in/phasenull",
      roblox:"https://www.roblox.com/users/409950512/profile",
   }
}