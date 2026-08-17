/** @jsxImportSource preact */
import type { JSX } from "preact";
import { renderToString } from "preact-render-to-string";
import { readFileSync, writeFileSync } from "node:fs";
import { EncodePage } from "../src/Encode";
import { DecodePage } from "../src/Decode";
import { IndexPage } from "../src/IndexPage";

function Nav({ current }: { current: string }) {
	const links = [
		{ href: "index.html", label: "Home" },
		{ href: "encode.html", label: "Encode" },
		{ href: "decode.html", label: "Decode" },
	];
	return <nav>
		{links.map((link, i) => <>
			{i > 0 && " | "}
			{current === link.href
				? <strong>{link.label}</strong>
				: <a href={link.href}>{link.label}</a>
			}
		</>)}
	</nav>;
}

const pages: Record<string, { component: JSX.Element; title: string }> = {
	"/index.html": {
		component: <><Nav current="index.html" /><IndexPage /></>,
		title: "54145a's Tools",
	},
	"/encode.html": {
		component: <><Nav current="encode.html" /><EncodePage /></>,
		title: "Base64 Converter — Encode",
	},
	"/decode.html": {
		component: <><Nav current="decode.html" /><DecodePage /></>,
		title: "Base64 Converter — Decode",
	},
};

for (const [path, { component, title }] of Object.entries(pages)) {
	const filePath = `docs${path}`;
	const html = readFileSync(filePath, "utf-8");
	const ssrContent = renderToString(component);
	const updated = html
		.replace('<div id="app">', `<div id="app">${ssrContent}`)
		.replace(/<title>.*?<\/title>/, `<title>${title}</title>`);
	writeFileSync(filePath, updated);
	console.log(`SSG: ${filePath} (${ssrContent.length} bytes)`);
}
