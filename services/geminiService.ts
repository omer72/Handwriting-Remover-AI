import { GoogleGenAI, Modality } from "@google/genai";

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const PROMPT = `
You are given an image of a document. Your task is to edit the image by removing only handwritten content, including notes, signatures, markings, and filled-in answers.

You must preserve all original machine-printed content exactly as it appears, including printed text, lines, tables, borders, spacing, and layout. Do not modify, delete, distort, or obscure any printed or structural elements of the document.

Where handwritten content is removed, seamlessly restore the background so the document looks natural and uninterrupted. The final result should appear as if the handwriting was never present.

Output only the final edited image. Do not include explanations, captions, or any additional text.
`;

export async function removeHandwritingFromImage(base64ImageData: string, mimeType: string): Promise<string> {
    const imageDataWithoutPrefix = base64ImageData.split(',')[1];
    if (!imageDataWithoutPrefix) {
        throw new Error("Invalid base64 image data format.");
    }

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    {
                        inlineData: {
                            data: imageDataWithoutPrefix,
                            mimeType: mimeType,
                        },
                    },
                    {
                        text: PROMPT,
                    },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });
        
        if (response.candidates && response.candidates[0].content.parts[0].inlineData) {
            const newImageData = response.candidates[0].content.parts[0].inlineData;
            const newMimeType = newImageData.mimeType;
            return `data:${newMimeType};base64,${newImageData.data}`;
        } else {
            throw new Error("API did not return an image.");
        }
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to communicate with the AI model.");
    }
}
