import { useLocation } from "preact-iso";

export function Nav() {
	const { path } = useLocation();
	const links = [
		{ href: "index.html", label: "Home" },
		{ href: "encode.html", label: "Base64 Encode" },
		{ href: "d.htm", label: "Base64 Decode" },
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

const REPO_URL = "https://github.com/54145a/54145a.github.io";

export function Footer() {
	return <footer>
		<a href={REPO_URL} target="_blank" rel="noopener noreferrer">View Source</a>
	</footer>;
}
