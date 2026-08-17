/** @jsxImportSource preact */
import type { JSX } from "preact";
import { renderToString } from "preact-render-to-string";
import { readFileSync, writeFileSync } from "node:fs";
import { EncodePage } from "../src/Encode";
import { DecodePage } from "../src/Decode";

function Nav({ isEncode }: { isEncode: boolean }) {
	return <nav>
		<span>{isEncode ? "Encode" : "Decode"}</span>
		{" → "}
		<a href={isEncode ? "decode.html" : "index.html"}>
			{isEncode ? "Decode" : "Encode"}
		</a>
	</nav>;
}

const pages: Record<string, { component: JSX.Element; title: string }> = {
	"/index.html": {
		component: <><Nav isEncode={true} /><EncodePage /></>,
		title: "Base64 Converter — Encode",
	},
	"/decode.html": {
		component: <><Nav isEncode={false} /><DecodePage /></>,
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
