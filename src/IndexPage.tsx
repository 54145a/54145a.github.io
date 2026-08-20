import { useEffect, useState } from "preact/hooks";

const REPO_API = "https://api.github.com/repos/54145a/54145a/readme";

export function IndexPage() {
	const [html, setHtml] = useState("");

	useEffect(() => {
		fetch(REPO_API, { headers: { Accept: "application/vnd.github.html+json" } })
			.then(r => r.ok ? r.text() : "")
			.then(setHtml)
			.catch(() => {});
	}, []);

	return <div>
		<h1>Tools</h1>
		<ul>
			<li><a href="encode.html">Base64 Converter</a> — Encode files to Base64 / Share URL</li>
			<li><a href="d.htm">Base64 Decoder</a> — Decode Base64 / data URLs</li>
		</ul>
		{html && <div dangerouslySetInnerHTML={{ __html: html }} />}
	</div>;
}
