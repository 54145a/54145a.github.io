import { prerender } from "preact-iso";
import { locationStub } from "preact-iso/prerender";
import { toStatic } from "hoofd/preact";
import { readFileSync, writeFileSync } from "node:fs";
import { App } from "./src/App";

const routes = [
	{ path: "/", file: "index.html" },
	{ path: "/encode.html", file: "encode.html" },
	{ path: "/d.htm", file: "d.htm" },
];

const template = readFileSync("docs/index.html", "utf-8");

for (const { path, file } of routes) {
	locationStub(path);
	const { html } = await prerender(<App />);
	const { title, metas } = toStatic();
	const desc = (metas ?? []).filter((m): m is { name: string; content: string } => "name" in m && m.name === "description").map(m => m.content).join() ?? "";
	const out = template
		.replace('<div id="app">', `<div id="app">${html}`)
		.replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
		.replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${desc}" />`);
	writeFileSync(`docs/${file}`, out);
	console.log(`SSG: docs/${file} (${html.length} bytes)`);
}
