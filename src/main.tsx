import { render } from "preact";
import { useEffect, useState } from "preact/hooks";
import { querySelector } from "@keupoz/strict-queryselector";
import { decode as base64Decode, fromUint8Array, toUint8Array } from "js-base64";
import { encode as encodeAvif } from "@jsquash/avif";

type Mode = "base64" | "base64url";

function fileToDataUrl(file: File): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => resolve(reader.result as string);
		reader.onerror = () => reject(reader.error);
		reader.readAsDataURL(file);
	});
}

async function fileToAvifBytes(file: File): Promise<ArrayBuffer> {
	const bitmap = await createImageBitmap(file);
	const canvas = document.createElement("canvas");
	canvas.width = bitmap.width;
	canvas.height = bitmap.height;
	const ctx = canvas.getContext("2d");
	if (!ctx) throw new TypeError();
	ctx.drawImage(bitmap, 0, 0);
	const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
	bitmap.close();
	return encodeAvif(imageData, { quality: 50 });
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
	return base64Decode(input);
}

function dataUrlDecode(input: string): { mime: string; bytes: Uint8Array<ArrayBuffer> } {
	const comma = input.indexOf(",");
	if (comma === -1) throw new Error("Invalid data URL");
	const header = input.slice(0, comma);
	if (!header.includes(";base64")) throw new Error("Invalid data URL");
	const mime = header.slice("data:".length).split(";")[0];
	return { mime, bytes: toUint8Array(input.slice(comma + 1)) as Uint8Array<ArrayBuffer> };
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
	const [mode, setMode] = useState<Mode>("base64");
	const [entries, setEntries] = useState<Encoded[]>([]);
	const [decoded, setDecoded] = useState<Decoded | null>(null);
	const [input, setInput] = useState("");
	const [error, setError] = useState<string | null>(null);

	async function fileToEncodeResult(file: File): Promise<string> {
		if (mode === "base64") {
			return fileToDataUrl(file);
		}
		let payload: Uint8Array<ArrayBuffer>;
		if (file.type.startsWith("image/")) {
			payload = new Uint8Array(await fileToAvifBytes(file));
		} else {
			payload = new Uint8Array(await file.arrayBuffer());
		}
		return `${location.origin}${location.pathname}?img=${fromUint8Array(payload, true)}`;
	}

	async function handleInput(files: File[]) {
		const converted: Encoded[] = [];
		for (const file of files) {
			converted.push({ name: file.name, encodeResult: await fileToEncodeResult(file) });
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

	useEffect(() => {
		const img = new URLSearchParams(location.search).get("img");
		if (img) {
			const dataUrl = `data:image/avif;base64url,${img}`;
			setInput(dataUrl);
			try {
				setDecoded({ kind: "file", ...dataUrlDecode(dataUrl) });
				setError(null);
			} catch (err) {
				setError(err instanceof Error ? err.message : "Decode failed");
			}
		}
	}, []);

	return <>
		<label>
			Mode{" "}
			<select value={mode} onChange={e => setMode(e.currentTarget.value as Mode)}>
				<option value="base64">Base64</option>
				<option value="base64url">Base64 URL</option>
			</select>
		</label>
		<label>Paste file(s) <input id="pasteArea" placeholder="here" onPaste={e => {
			if (!e.clipboardData) throw new TypeError();
			if (e.clipboardData.files.length === 0) return;
			handleInput(Array.from(e.clipboardData.files));
		}} /> or <input type="file" id="uploadFile" onChange={e => handleInput(Array.from(e.currentTarget.files ?? []))} /></label>
		<div id="output">
			{entries.map(entry => <FileEntry key={entry.encodeResult} name={entry.name} result={entry.encodeResult} />)}
		</div>
		<textarea placeholder="Paste base64, data URL, or share link" value={input} onInput={e => setInput(e.currentTarget.value)} />
		<button onClick={handleDecode}>Decode</button>
		{error && <p>{error}</p>}
		{decoded && <DecodeResult decoded={decoded} />}
	</>;
}

const app = querySelector("div#app");
render(<App />, app);
