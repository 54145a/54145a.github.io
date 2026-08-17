import type { VNode } from "preact";
import { render } from "preact";

export function Nav() {
	const isEncode = typeof location !== "undefined"
		? (location.pathname.includes("index") || location.pathname === "/")
		: true;
	return <nav>
		<span>{isEncode ? "Encode" : "Decode"}</span>
		{" → "}
		<a href={isEncode ? "decode.html" : "index.html"}>
			{isEncode ? "Decode" : "Encode"}
		</a>
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
