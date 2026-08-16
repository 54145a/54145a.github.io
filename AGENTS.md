# AGENTS.md

Tiny vanilla-JS Vite SPA that converts files (upload or paste) to base64 data URLs and renders them in the output with a per-file Copy button.

## Commands

- Install with `pnpm install` only. `vite` is a plain devDependency — Vite 8+ uses Rolldown as its default engine, no override/alias needed.
- `pnpm dev` / `pnpm build` / `pnpm preview` / `pnpm typecheck` are the only scripts. No lint, test, or format tooling exists.
- Type checking: `pnpm typecheck` runs `tsc --noEmit -p jsconfig.json` (TypeScript 7, the native compiler). `jsconfig.json` enables `checkJs: true` + `strict`; code stays `.js` with JSDoc annotations — never convert to `.ts`. `dist`/`node_modules` are excluded from `jsconfig.json`, or tsc would type-check the built bundle and fail.

## Conventions

- 4-space indentation, semicolons; no framework — plain DOM APIs and `FileReader`.
- `main.js` deliberately throws `TypeError` on failed DOM lookups/guards (assertion style); keep that pattern when adding elements.
- Entry: `index.html` -> `/src/main.js`. UI strings are Chinese; keep them that way.

## Planned refactor (not yet implemented)

Large refactor preserving the base app; during any work, `pnpm typecheck` + `pnpm build` must stay green:

- Switch all UI strings to English.
- Add an output option to generate a plain Base64 string in addition to the Base64 data URL.
- Add a decode feature: restore the original file from a Base64 (or Base64 URL) string.
- Introduce workbox caching (service worker) to reduce server load.
- Use tabs for indentation where possible.
- Keep CSS usage minimal; keep code comments to the few truly necessary ones — readability comes from self-evident naming.