import { h, Fragment } from "preact";
import prerender from "preact-iso/prerender";
import { readFileSync, writeFileSync } from "node:fs";
import { EncodePage } from "../src/Encode.tsx";
import { DecodePage } from "../src/Decode.tsx";
import { IndexPage } from "../src/IndexPage.tsx";

function Nav({ current }) {
	const links = [
		{ href: "index.html", label: "Home" },
		{ href: "encode.html", label: "Encode" },
		{ href: "decode.html", label: "Decode" },
	];
	return h("nav", null,
		...links.flatMap((link, i) => [
			i > 0 ? " | " : null,
			current === link.href
				? h("strong", null, link.label)
				: h("a", { href: link.href }, link.label),
		]).filter(Boolean),
	);
}

const pages = {
	"/index.html": {
		vnode: h(Fragment, null, h(Nav, { current: "index.html" }), h(IndexPage, null)),
		title: "54145a's Tools",
	},
	"/encode.html": {
		vnode: h(Fragment, null, h(Nav, { current: "encode.html" }), h(EncodePage, null)),
		title: "Base64 Converter — Encode",
	},
	"/decode.html": {
		vnode: h(Fragment, null, h(Nav, { current: "decode.html" }), h(DecodePage, null)),
		title: "Base64 Converter — Decode",
	},
};

for (const [path, { vnode, title }] of Object.entries(pages)) {
	const filePath = `docs${path}`;
	const html = readFileSync(filePath, "utf-8");
	const { html: ssrContent } = await prerender(vnode);
	const updated = html
		.replace('<div id="app">', `<div id="app">${ssrContent}`)
		.replace(/<title>.*?<\/title>/, `<title>${title}</title>`);
	writeFileSync(filePath, updated);
	console.log(`SSG: ${filePath} (${ssrContent.length} bytes)`);
}
