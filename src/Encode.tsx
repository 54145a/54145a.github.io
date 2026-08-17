import { useState } from "preact/hooks";
import { fromUint8Array } from "js-base64";

const AVIF_CDN = "https://cdn.jsdelivr.net/npm/@jsquash/avif@2.1.1";

let avifReady: Promise<typeof import("https://cdn.jsdelivr.net/npm/@jsquash/avif@2.1.1/+esm")> | null = null;
async function getAvif() {
	if (!avifReady) {
		avifReady = import(`${AVIF_CDN}/+esm`);
	}
	return avifReady;
}

function fileToDataUrl(file: File): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => resolve(reader.result as string);
		reader.onerror = () => reject(reader.error);
		reader.readAsDataURL(file);
	});
}

async function fileToAvifBytes(file: File): Promise<ArrayBuffer> {
	const { encode } = await getAvif();
	const bitmap = await createImageBitmap(file);
	const canvas = document.createElement("canvas");
	canvas.width = bitmap.width;
	canvas.height = bitmap.height;
	const ctx = canvas.getContext("2d");
	if (!ctx) throw new TypeError();
	ctx.drawImage(bitmap, 0, 0);
	const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
	bitmap.close();
	return encode(imageData, { quality: 50 });
}

async function fileToShareUrl(file: File): Promise<string> {
	const bytes = new Uint8Array(await fileToAvifBytes(file));
	const url = new URL("decode.html", location.href);
	url.hash = `img=${fromUint8Array(bytes, true)}`;
	return url.toString();
}

type Encoded = { name: string; dataUrl: string; shareUrl: string | null };

function CopyButton({ text, label }: { text: string; label: string }) {
	const [copied, setCopied] = useState(false);
	return <button onClick={async () => {
		await navigator.clipboard.writeText(text);
		setCopied(true);
	}}>{copied ? "Copied" : label}</button>;
}

function FileEntry({ name, dataUrl, shareUrl }: { name: string; dataUrl: string; shareUrl: string | null }) {
	return <details>
		<summary>{name} <CopyButton text={dataUrl} label="Copy Base64" /></summary>
		{dataUrl.length > 500 ? <p>Too long to display</p> : <code>{dataUrl}</code>}
		{shareUrl && <>
			<p>Share URL (image only)</p>
			<code>{shareUrl}</code>
			<CopyButton text={shareUrl} label="Copy Share URL" />
		</>}
	</details>;
}

export function EncodePage() {
	const [entries, setEntries] = useState<Encoded[]>([]);

	async function handleInput(files: File[]) {
		const converted: Encoded[] = [];
		for (const file of files) {
			const dataUrl = await fileToDataUrl(file);
			let shareUrl: string | null = null;
			if (file.type.startsWith("image/")) {
				try { shareUrl = await fileToShareUrl(file); } catch {}
			}
			converted.push({ name: file.name, dataUrl, shareUrl });
		}
		setEntries(prev => [...prev, ...converted]);
	}

	return <div>
		<label>Paste file(s) <input id="pasteArea" placeholder="here" onPaste={e => {
			if (!e.clipboardData) throw new TypeError();
			if (e.clipboardData.files.length === 0) return;
			handleInput(Array.from(e.clipboardData.files));
		}} /> or <input type="file" id="uploadFile" onChange={e => handleInput(Array.from(e.currentTarget.files ?? []))} /></label>
		<div id="output">
			{entries.map(entry => <FileEntry key={entry.dataUrl} name={entry.name} dataUrl={entry.dataUrl} shareUrl={entry.shareUrl} />)}
		</div>
	</div>;
}
