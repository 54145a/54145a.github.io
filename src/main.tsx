import { render } from "preact";
import { useState } from "preact/hooks";
import { querySelector } from "@keupoz/strict-queryselector";

function fileToDataUrl(file: File): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => resolve(reader.result as string);
		reader.onerror = () => reject(reader.error);
		reader.readAsDataURL(file);
	});
}

type Encoded = { name: string; encodeResult: string };

function FileEntry({ name, result }: { name: string; result: string }) {
	const [copied, setCopied] = useState(false);
	return <details>
		<summary>{name}<button onClick={async () => {
			await navigator.clipboard.writeText(result);
			setCopied(true);
		}}>{copied ? "Copied" : "Copy"}</button></summary>
		<code>{result}</code>
	</details>;
}

type Decoded =
	| { kind: "text"; text: string }
	| { kind: "file"; mime: string; bytes: Uint8Array<ArrayBuffer> };

function base64ToText(input: string): string {
	return atob(input);
}

function dataUrlDecode(input: string): { mime: string; bytes: Uint8Array<ArrayBuffer> } {
	const comma = input.indexOf(",");
	if (comma === -1) throw new Error("Invalid data URL");
	const header = input.slice(0, comma);
	if (!header.includes(";base64")) throw new Error("Invalid data URL");
	const mime = header.slice("data:".length).split(";")[0];
	const binaryString = atob(input.slice(comma + 1));
	const bytes = new Uint8Array(binaryString.length);
	for (let i = 0; i < binaryString.length; i++) {
		bytes[i] = binaryString.charCodeAt(i);
	}
	return { mime, bytes };
}

function DecodeResult({ decoded }: { decoded: Decoded }) {
	if (decoded.kind === "text") {
		return <pre>{decoded.text}</pre>;
	}
	const url = URL.createObjectURL(new Blob([decoded.bytes], { type: decoded.mime }));
	if (decoded.mime.startsWith("image/")) {
		return <img src={url} alt={decoded.mime} />;
	}
	return <a href={url} download>Download</a>;
}

function App() {
	const [entries, setEntries] = useState<Encoded[]>([]);
	const [decoded, setDecoded] = useState<Decoded | null>(null);
	const [input, setInput] = useState("");
	const [error, setError] = useState<string | null>(null);

	async function handleInput(files: File[]) {
		const converted: Encoded[] = [];
		for (const file of files) {
			converted.push({ name: file.name, encodeResult: await fileToDataUrl(file) });
		}
		setEntries(prev => [...prev, ...converted]);
	}

	function handleDecode() {
		const trimmed = input.trim();
		try {
			if (trimmed.startsWith("data:")) {
				setDecoded({ kind: "file", ...dataUrlDecode(trimmed) });
			} else {
				setDecoded({ kind: "text", text: base64ToText(trimmed) });
			}
			setError(null);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Decode failed");
			setDecoded(null);
		}
	}

	return <>
		<label>Paste file(s) <input id="pasteArea" placeholder="here" onPaste={e => {
			if (!e.clipboardData) throw new TypeError();
			if (e.clipboardData.files.length === 0) return;
			handleInput(Array.from(e.clipboardData.files));
		}} /> or <input type="file" id="uploadFile" onChange={e => handleInput(Array.from(e.currentTarget.files ?? []))} /></label>
		<div id="output">
			{entries.map(entry => <FileEntry key={entry.encodeResult} name={entry.name} result={entry.encodeResult} />)}
		</div>
		<textarea placeholder="Paste base64 or data URL here" value={input} onInput={e => setInput(e.currentTarget.value)} />
		<button onClick={handleDecode}>Decode</button>
		{error && <p>{error}</p>}
		{decoded && <DecodeResult decoded={decoded} />}
	</>;
}

const app = querySelector("div#app");
render(<App />, app);
