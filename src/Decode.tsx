import { render } from "preact";
import { useEffect, useMemo, useState } from "preact/hooks";
import { querySelector } from "@keupoz/strict-queryselector";
import { decode as base64Decode, fromUint8Array, toUint8Array } from "js-base64";
import mime from "mime";

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

type Decoded =
	| { kind: "text"; text: string }
	| { kind: "file"; mime: string; bytes: Uint8Array<ArrayBuffer> };

function defaultName(mimeType: string): string {
	return `decoded.${mime.getExtension(mimeType) ?? "bin"}`;
}

function FileResult({ decoded, onDownload }: { decoded: Decoded & { kind: "file" }; onDownload: (fileName: string) => void }) {
	const [fileName, setFileName] = useState(() => defaultName(decoded.mime));
	const [asText, setAsText] = useState(false);
	const url = useMemo(
		() => URL.createObjectURL(new Blob([decoded.bytes], { type: decoded.mime })),
		[decoded],
	);
	useEffect(() => () => URL.revokeObjectURL(url), [url]);
	const text = new TextDecoder().decode(decoded.bytes);
	const dataUrl = `data:${decoded.mime};base64,${fromUint8Array(decoded.bytes, false)}`;
	return <div>
		{decoded.mime.startsWith("image/") && <img src={url} alt={decoded.mime} />}
		<input value={fileName} onInput={e => setFileName(e.currentTarget.value)} placeholder="File name" />
		<button onClick={() => onDownload(fileName)}>Download</button>
		<button onClick={() => setAsText(t => !t)}>{asText ? "Show data URL" : "Decode as text"}</button>
		<textarea readOnly value={asText ? text : dataUrl} />
	</div>;
}

function DecodeResult({ decoded, onDownload }: { decoded: Decoded; onDownload: (fileName: string) => void }) {
	if (decoded.kind === "text") {
		return <div><textarea readOnly value={decoded.text} /></div>;
	}
	return <FileResult key={decoded.mime} decoded={decoded} onDownload={onDownload} />;
}

function App() {
	const [decoded, setDecoded] = useState<Decoded | null>(null);
	const [input, setInput] = useState("");
	const [error, setError] = useState<string | null>(null);

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

	function handleDownload(fileName: string) {
		try {
			const trimmed = input.trim();
			const { mime, bytes } = trimmed.startsWith("data:")
				? dataUrlDecode(trimmed)
				: { mime: "text/plain", bytes: new TextEncoder().encode(base64ToText(trimmed)) };
			const url = URL.createObjectURL(new Blob([bytes], { type: mime }));
			const a = document.createElement("a");
			a.href = url;
			a.download = fileName;
			a.click();
			URL.revokeObjectURL(url);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Decode failed");
		}
	}

	useEffect(() => {
		function applyShareHash() {
			const hash = location.hash;
			if (hash.startsWith("#img=")) {
				const img = hash.slice("#img=".length);
				const dataUrl = `data:image/avif;base64url,${img}`;
				setInput(dataUrl);
				try {
					setDecoded({ kind: "file", ...dataUrlDecode(dataUrl) });
					setError(null);
				} catch (err) {
					setError(err instanceof Error ? err.message : "Decode failed");
				}
			}
		}
		applyShareHash();
		addEventListener("hashchange", applyShareHash);
		return () => removeEventListener("hashchange", applyShareHash);
	}, []);

	return <div>
		<textarea placeholder="Paste base64, data URL, or share link" value={input} onInput={e => setInput(e.currentTarget.value)} />
		<button onClick={handleDecode}>Decode</button>
		{error && <p>{error}</p>}
		{decoded && <DecodeResult decoded={decoded} onDownload={handleDownload} />}
	</div>;
}

const app = querySelector("div#app");
render(<App />, app);
