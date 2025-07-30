/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{js,jsx,ts,tsx}"],
	mode: "jit",

	darkMode: false,
	theme: {
		extend: {
			colors: {
				primary: "#80ed99",
				"primary-dark": "#57cc99",
				secondary: "#5cc9cc",
				"secondary-dark": "#38a3a5",
				"secondary-darkest": "#22577a"
			},
			animation: {
				shake: "shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97)"
			},
			keyframes: {
				shake: {
					"10%, 90%": {
						transform: "translate3d(-1px, 0, 0)"
					},
					"20%, 80%": {
						transform: "translate3d(2px, 0, 0)"
					},
					"30%, 50%, 70%": {
						transform: "translate3d(-4px, 0, 0)"
					},
					"40%, 60%": {
						transform: "translate3d(4px, 0, 0)"
					}
				}
			}
		}
	}
}
