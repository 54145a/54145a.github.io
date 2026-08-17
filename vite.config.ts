import { defineConfig } from "vite";
import preact from "@preact/preset-vite";

export default defineConfig({
	base: "./",
	plugins: [preact()],
	build: {
		outDir: "docs",
		rollupOptions: {
			input: {
				encode: "index.html",
				decode: "decode.html",
			},
		},
	},
});
