import type { VNode } from "preact";
import { render } from "preact";

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

export async function renderPage(page: VNode) {
	if (typeof document === "undefined") return;
	const { querySelector } = await import("@keupoz/strict-queryselector");
	render(<App>{page}</App>, querySelector("div#app"));
}
