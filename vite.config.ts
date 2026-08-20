import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import { readFileSync } from "node:fs";
import { marked } from "marked";

function readme() {
	const html = marked.parse(readFileSync("54145a/README.md", "utf-8")) as string;
	return {
		name: "readme",
		transformIndexHtml: {
			order: "pre" as const,
			handler(content: string) {
				return content.replace('<span id="readme"></span>', html);
			},
		},
	};
}

export default defineConfig({
	base: "./",
	plugins: [preact(), readme()],
	build: {
		outDir: "docs",
		rollupOptions: {
			input: {
				index: "index.html",
			},
		},
	},
});
