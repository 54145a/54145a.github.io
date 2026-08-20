import { useTitle, useMeta } from "hoofd/preact";

export function IndexPage() {
	useTitle("145a's Tools");
	useMeta({ name: "description", content: "Online tools for Base64 encoding, decoding, and shareable links." });
	return <div>
		<h1>Tools</h1>
		<ul>
			<li><a href="encode.html">Base64 Converter</a> — Encode files to Base64 / Share URL</li>
			<li><a href="d.htm">Base64 Decoder</a> — Decode Base64 / data URLs</li>
		</ul>
	</div>;
}
