/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{js,jsx,ts,tsx}"],
	theme: {
		extend: {
			colors: {
				primary: "#80ed99",
				"primary-dark": "#57cc99",
				secondary: "#38a3a5",
				"secondary-dark": "#35a3a3",
				"secondary-darkest": "#22577a",
			},
			animation: {
				rocket_shake: "shake 1s cubic-bezier(.36,.07,.19,.97) both infinite",
			},
			keyframes: {
				rocket_shake: {
					"20%, 90%": { transform: "translate(-1px, 0)" },
					"20%, 80%": { transform: "translate(2px, 0)" },
					"30%, 50%, 70%": { transform: "translate(-4px, 0)" },
					"40%, 60%": { transform: "translate(4px, 0)" },
				},
			},
		},
	},
	plugins: [
		require("tailwindcss-animation-delay"),
		// ...
	],
}
