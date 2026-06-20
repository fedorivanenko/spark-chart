import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
	root: new URL(".", import.meta.url).pathname,
	plugins: [react()],
	resolve: {
		alias: [
			{
				find: /^braille-charts\/styles\.css$/,
				replacement: new URL("../../src/styles/globals.css", import.meta.url)
					.pathname,
			},
			{
				find: /^braille-charts$/,
				replacement: new URL("../../src/index.ts", import.meta.url).pathname,
			},
		],
	},
});
