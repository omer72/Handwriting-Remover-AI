import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { ImageViewer } from './components/ImageViewer';
import { Button } from './components/Button';
import { removeHandwritingFromImage } from './services/geminiService';
import { DownloadIcon, MagicWandIcon } from './components/Icons';
import { fileToBase64, getMimeType } from './utils/imageUtils';
import { ImageCropper } from './components/ImageCropper';

const App: React.FC = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isCropping, setIsCropping] = useState<boolean>(false);

  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [originalMimeType, setOriginalMimeType] = useState<string | null>(null);
  const [cleanedImage, setCleanedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = useCallback((file: File) => {
    setError(null);
    setCleanedImage(null);
    setOriginalImage(null);
    setOriginalMimeType(file.type);
    fileToBase64(file)
      .then(base64 => {
        setUploadedImage(base64);
        setIsCropping(true);
      })
      .catch(() => setError('Could not read the selected file.'));
  }, []);

  const startHandwritingRemoval = useCallback(async (image: string, mimeType: string) => {
    setIsLoading(true);
    setError(null);
    setCleanedImage(null);

    try {
      const result = await removeHandwritingFromImage(image, mimeType);
      setCleanedImage(result);
    } catch (err) {
      console.error(err);
      setError('Failed to process the image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleCropComplete = useCallback(async (croppedImage: string) => {
    const mimeType = getMimeType(croppedImage);
    setOriginalImage(croppedImage);
    setIsCropping(false);
    setUploadedImage(null);

    if (mimeType) {
        setOriginalMimeType(mimeType);
        await startHandwritingRemoval(croppedImage, mimeType);
    } else {
        setError('Could not determine image type after cropping.');
    }
  }, [startHandwritingRemoval]);

  const handleCropCancel = useCallback(() => {
    setIsCropping(false);
    setUploadedImage(null);
    setOriginalMimeType(null);
  }, []);

  const handleReset = () => {
    setOriginalImage(null);
    setCleanedImage(null);
    setError(null);
    setUploadedImage(null);
    setOriginalMimeType(null);
    setIsCropping(false);
  };

  const handleRemoveHandwriting = useCallback(async () => {
    if (originalImage && originalMimeType) {
      await startHandwritingRemoval(originalImage, originalMimeType);
    } else {
      setError('Please upload and crop an image first.');
    }
  }, [originalImage, originalMimeType, startHandwritingRemoval]);

  const handleDownload = () => {
    if (!cleanedImage) return;
    const link = document.createElement('a');
    link.href = cleanedImage;
    const fileExtension = getMimeType(cleanedImage)?.split('/')[1] || 'png';
    link.download = `cleaned-image.${fileExtension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-gray-200 flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8 flex flex-col items-center">
        {isCropping && uploadedImage && originalMimeType && (
            <ImageCropper
                imageUrl={uploadedImage}
                mimeType={originalMimeType}
                onCropComplete={handleCropComplete}
                onCancel={handleCropCancel}
            />
        )}
        <div className="w-full max-w-6xl">
          {!originalImage && !isCropping && <ImageUploader onImageUpload={handleImageUpload} />}
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md relative my-4 text-center" role="alert">
              <strong className="font-bold">Error:</strong>
              <span className="block sm:inline ml-2">{error}</span>
            </div>
          )}

          {originalImage && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full mt-4">
              <ImageViewer title="Original Document" imageUrl={originalImage} />
              <ImageViewer title="Cleaned Document" imageUrl={cleanedImage} isLoading={isLoading} />
            </div>
          )}
          
          {originalImage && (
            <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4 w-full">
              <Button onClick={handleRemoveHandwriting} disabled={isLoading || !originalImage}>
                <MagicWandIcon className="w-5 h-5 mr-2"/>
                {isLoading ? 'Processing...' : 'Remove Handwriting'}
              </Button>
              <Button onClick={handleDownload} disabled={!cleanedImage || isLoading} variant="secondary">
                <DownloadIcon className="w-5 h-5 mr-2" />
                Download Cleaned Image
              </Button>
               <Button onClick={handleReset} disabled={isLoading} variant="danger">
                Upload New Image
              </Button>
            </div>
          )}
        </div>
      </main>
      <footer className="text-center p-4 text-gray-500 text-sm">
        Powered by Gemini API
      </footer>
    </div>
  );
};

export default App;