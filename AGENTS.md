# AGENTS.md

Preact + Vite SPA that converts files (upload or paste) to base64 data URLs and renders them in the output with a per-file Copy button.

## Commands

- Install with `pnpm install` only. Vite 8+ uses Rolldown as its default engine, no override/alias needed.
- `pnpm dev` / `pnpm build` / `pnpm preview` / `pnpm check` are the only scripts. No lint, test, or format tooling exists.
- Type checking: `pnpm check` runs `tsc --noEmit` (TypeScript 7, the native compiler). App code lives in `src` as `.tsx`/`.ts` with Preact; `tsconfig.json` sets `strict` + `jsx: react-jsx` + `jsxImportSource: preact`.

## Architecture

- SPA with `preact-iso` router (`LocationProvider` + `Router` + `Route` in `src/App.tsx`).
- Single entry: `index.html` → `src/index.tsx` → `src/App.tsx`. Routes: `/`, `/encode.html`, `/decode.html`.
- SSG: `prerender.tsx` uses `locationStub()` + `prerender()` loop to generate `docs/index.html`, `docs/encode.html`, `docs/decode.html` from the single build output.
- Build output goes to `docs/` (served by GitHub Pages). `public/CNAME` is copied to `docs/` automatically.
- Simple.css via CDN `<link>` in `index.html`. Rolldown cannot resolve CSS-only npm packages as JS imports.

## Conventions

- 4-space indentation, semicolons; Preact with hooks, no other framework. UI strings are Chinese; keep them that way.
- `src/shared.tsx` exports `Nav`, `Footer`. Page components (`IndexPage`, `Encode`, `Decode`) are pure components — no side effects, no `mountApp` calls.
- Route paths use `.html` extensions to match GitHub Pages static file serving.
