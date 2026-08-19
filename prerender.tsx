import { prerender } from "preact-iso";
import { locationStub } from "preact-iso/prerender";
import { readFileSync, writeFileSync } from "node:fs";
import { App } from "./src/App";

const routes = [
	{ path: "/", file: "index.html", title: "145a's Tools", desc: "Online tools for Base64 encoding, decoding, and shareable links." },
	{ path: "/encode.html", file: "encode.html", title: "Base64 Converter — Encode", desc: "Encode files to Base64 data URLs and generate shareable image links." },
	{ path: "/d.htm", file: "d.htm", title: "Base64 Converter — Decode", desc: "Decode Base64 strings, data URLs, and shared image links back to files." },
];

const template = readFileSync("docs/index.html", "utf-8");

for (const { path, file, title, desc } of routes) {
	locationStub(path);
	const { html } = await prerender(<App />);
	const out = template
		.replace('<div id="app">', `<div id="app">${html}`)
		.replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
		.replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${desc}" />`);
	writeFileSync(`docs/${file}`, out);
	console.log(`SSG: docs/${file} (${html.length} bytes)`);
}
