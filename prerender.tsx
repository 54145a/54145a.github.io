import { prerender } from "preact-iso";
import { locationStub } from "preact-iso/prerender";
import { readFileSync, writeFileSync } from "node:fs";
import { App } from "./src/App";

const routes = [
	{ path: "/", file: "index.html", title: "145a's Tools" },
	{ path: "/encode.html", file: "encode.html", title: "Base64 Converter — Encode" },
	{ path: "/d.htm", file: "d.htm", title: "Base64 Converter — Decode" },
];

const template = readFileSync("docs/index.html", "utf-8");

for (const { path, file, title } of routes) {
	locationStub(path);
	const { html } = await prerender(<App />);
	const out = template
		.replace('<div id="app">', `<div id="app">${html}`)
		.replace(/<title>.*?<\/title>/, `<title>${title}</title>`);
	writeFileSync(`docs/${file}`, out);
	console.log(`SSG: docs/${file} (${html.length} bytes)`);
}
