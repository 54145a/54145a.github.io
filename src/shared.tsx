import type { VNode } from "preact";
import hydrate from "preact-iso/hydrate";

export function Nav() {
	const path = typeof location !== "undefined" ? location.pathname : "/";
	const links = [
		{ href: "index.html", label: "Home" },
		{ href: "encode.html", label: "Base64 Encode" },
		{ href: "decode.html", label: "Base64 Decode" },
	];
	return <nav style="text-align:center">
		{links.map((link, i) => <>
			{i > 0 && " | "}
			{path.includes(link.href) || (path === "/" && link.href === "index.html")
				? <strong>{link.label}</strong>
				: <a href={link.href}>{link.label}</a>
			}
		</>)}
	</nav>;
}

const REPO_URL = "https://github.com/54145a/54145a.github.io";

export function Footer() {
	return <footer style="text-align:center;margin-top:2rem">
		<a href={REPO_URL} target="_blank" rel="noopener noreferrer">View Source</a>
	</footer>;
}

export function App({ children }: { children: VNode }) {
	return <><Nav />{children}<Footer /></>;
}

export function mountApp(page: VNode) {
	if (typeof document === "undefined") return;
	hydrate(<App>{page}</App>, document.querySelector("#app")!);
}
