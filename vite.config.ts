import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import { cloudflare } from "@cloudflare/vite-plugin"
import { resolve } from "path"
// https://vite.dev/config/
export default defineConfig(({ command }) => ({
	plugins: [
		react(),
		tailwindcss(),
		// builds the worker (worker/index.ts, configured in cloudflare.config.ts) next to the site for `cf build` / `cf deploy`;
		// the dev server stays a plain Vite SPA
		...(command === "build" ? [cloudflare()] : [])
	],
	resolve: {
		alias: {
      '@components': resolve(__dirname, 'src/components'),
      '@assets': resolve(__dirname, 'src/assets'),
      '@common': resolve(__dirname, 'src/common'),
      '@pages': resolve(__dirname, 'src/pages'),
		}
	}
}))
