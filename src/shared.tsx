import type { VNode } from "preact";
import hydrate from "preact-iso/hydrate";

export function Nav() {
	const path = typeof location !== "undefined" ? location.pathname : "/";
	const links = [
		{ href: "index.html", label: "Home" },
		{ href: "encode.html", label: "Encode" },
		{ href: "decode.html", label: "Decode" },
	];
	return <nav>
		{links.map((link, i) => <>
			{i > 0 && " | "}
			{path.includes(link.href) || (path === "/" && link.href === "index.html")
				? <strong>{link.label}</strong>
				: <a href={link.href}>{link.label}</a>
			}
		</>)}
	</nav>;
}

export function App({ children }: { children: VNode }) {
	return <><Nav />{children}</>;
}

export function mountApp(page: VNode) {
	if (typeof document === "undefined") return;
	hydrate(<App>{page}</App>, document.querySelector("#app")!);
}
