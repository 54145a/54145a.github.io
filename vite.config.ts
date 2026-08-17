import { defineConfig } from "vite";
import preact from "@preact/preset-vite";

export default defineConfig({
	plugins: [preact()],
	build: {
		rollupOptions: {
			input: {
				encode: "index.html",
				decode: "decode.html",
			},
		},
	},
});
