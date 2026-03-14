import type { PixelCrop } from 'react-image-crop';

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export const getMimeType = (base64Data: string): string | null => {
  const match = base64Data.match(/^data:(.*?);base64,/);
  return match ? match[1] : null;
}

export const getCroppedImg = (
    image: HTMLImageElement,
    crop: PixelCrop,
    mimeType: string,
): Promise<string> => {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = Math.floor(crop.width * scaleX);
    canvas.height = Math.floor(crop.height * scaleY);

    const ctx = canvas.getContext('2d');
    if (!ctx) {
        return Promise.reject(new Error('Could not get canvas context.'));
    }

    ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        canvas.width,
        canvas.height
    );

    return Promise.resolve(canvas.toDataURL(mimeType));
};
