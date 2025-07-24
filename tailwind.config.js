/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{js,jsx,ts,tsx}"],
	theme: {
		extend: {
			colors: {
				primary: "#80ed99",
				"primary-dark": "#57cc99",
				secondary: "#5cc9cc",
				"secondary-dark": "#38a3a5",
				"secondary-darkest": "#22577a",
			},
			animation: {
				shake: "shake 0.15s linear both infinite",
				"shakerotation": "shakerotation 0.15s linear both infinite",
			},
			keyframes: {
				shake: {
					"0%, 33%": { transform: "translate(-0.5px)" },
					"33%, 66%": { transform: "translate(0.5px)" },
					"66%, 100%": { transform: "translate(-0.5px)" },
				},
				"shakerotation": {
					"0%, 33%": { transform: "rotate(3deg)" },
					"33%, 66%": { transform: "rotate(-3deg)" },
					"66%, 100%": { transform: "rotate(3deg)" },
				},
			},
		},
	},
}