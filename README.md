<div align="center">


# Handwriting Remover AI

Remove handwritten content from document images using Google's Gemini AI.

Upload a document image, crop the area you want to clean, and the app will remove all handwriting — notes, signatures, markings, and filled-in answers — while preserving the original printed content.

[Live Demo](https://omer72.github.io/Handwriting-Remover-AI/)

</div>

## Features

- Drag-and-drop or click-to-upload image input (PNG, JPEG, WebP)
- Built-in image cropping before processing
- Side-by-side comparison of original and cleaned documents
- One-click download of the cleaned image
- Dark/light mode support

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   ```
   npm install
   ```
2. Create a `.env.local` file and set your Gemini API key:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```
3. Run the app:
   ```
   npm run dev
   ```
4. Open http://localhost:3000

## Tech Stack

- React 19 + TypeScript
- Google Gemini 2.5 Flash API (`@google/genai`)
- Tailwind CSS
- Vite
- Deployed to GitHub Pages

## Created by

[Omer Etrog](mailto:omer72@gmail.com)
