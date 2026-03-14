# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Handwriting Remover AI — a React web app that removes handwritten content from document images using Google's Gemini 2.5 Flash API. Users upload an image, crop it, and the app sends it to Gemini which returns a cleaned version with handwriting removed.

## Commands

- `npm install` — install dependencies
- `npm run dev` — start dev server on port 3000
- `npm run build` — production build to `dist/`
- `npm run preview` — preview production build

No test framework or linter is configured.

## Architecture

Flat structure — no `src/` directory. All source files are at the project root level.

- `App.tsx` — main component, orchestrates the full workflow: upload → crop → API call → display result
- `index.tsx` — React entry point, mounts App to `#root`
- `services/geminiService.ts` — Gemini API integration using `@google/genai`. Sends image + prompt, expects an image response back
- `utils/imageUtils.ts` — base64 conversion, MIME type extraction, canvas-based image cropping
- `components/` — UI components (Header, ImageUploader, ImageCropper, ImageViewer, Button, Icons, Spinner)

## Key Technical Details

- **API key injection**: Vite `define` replaces `process.env.API_KEY` and `process.env.GEMINI_API_KEY` at build time. The key comes from `GEMINI_API_KEY` env var (loaded via `loadEnv` from `.env.local` or environment)
- **Styling**: Tailwind CSS loaded via CDN in `index.html` (`cdn.tailwindcss.com`), not as a build dependency
- **Import maps**: `index.html` contains import maps pointing to `aistudiocdn.com` — these are overridden by Vite during build but exist for direct browser usage
- **Path alias**: `@/` resolves to the project root (configured in both `vite.config.ts` and `tsconfig.json`)
- **Base path**: `base: '/Handwriting-Remover-AI/'` in Vite config for GitHub Pages deployment

## Deployment

Auto-deploys to GitHub Pages via `.github/workflows/deploy.yml` on push to `main`. The `GEMINI_API_KEY` must be set as a GitHub repository secret. Note: the key is embedded in the client-side bundle.
