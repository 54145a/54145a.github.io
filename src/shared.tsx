import type { VNode } from "preact";
import { render } from "preact";
import { querySelector } from "@keupoz/strict-queryselector";

function Nav() {
	const isEncode = location.pathname.includes("index") || location.pathname === "/";
	return <nav>
		<span>{isEncode ? "Encode" : "Decode"}</span>
		{" → "}
		<a href={isEncode ? "decode.html" : "index.html"}>
			{isEncode ? "Decode" : "Encode"}
		</a>
	</nav>;
}

export function renderPage(page: VNode) {
	render(<><Nav />{page}</>, querySelector("div#app"));
}
