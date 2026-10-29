import { bindings, defineConfig } from "cf/config";

export default defineConfig({
	worker: {
		name: "phasenull-dev-frontend",
		compatibilityDate: "2025-08-21",
		entrypoint: "worker/index.ts",
		observability: {
			enabled: true,
		},
		assets: {
			notFoundHandling: "none",
			runWorkerFirst: [
				"/*",
				"!/assets/*",
				"!/og/*",
			],
		},
		env: {
			API_URL: bindings.text("https://api.phasenull.dev"),
			ASSETS: bindings.assets(),
		},
	},
});
