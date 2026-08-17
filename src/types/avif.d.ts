declare module "https://cdn.jsdelivr.net/npm/@jsquash/avif@2.1.1/+esm" {
	export function init(options: { locateFile: (path: string) => string }): void;
	export function encode(data: ImageData, options?: { quality?: number }): Promise<ArrayBuffer>;
}
