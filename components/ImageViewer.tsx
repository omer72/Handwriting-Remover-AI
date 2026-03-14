
import React from 'react';
import { Spinner } from './Spinner';

interface ImageViewerProps {
  title: string;
  imageUrl: string | null;
  isLoading?: boolean;
}

export const ImageViewer: React.FC<ImageViewerProps> = ({ title, imageUrl, isLoading = false }) => {
  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl font-semibold mb-4 text-center">{title}</h2>
      <div className="w-full aspect-w-1 aspect-h-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden flex items-center justify-center border border-gray-200 dark:border-gray-700">
        {isLoading ? (
          <div className="flex flex-col items-center text-gray-500">
            <Spinner />
            <p className="mt-4">AI is working its magic...</p>
          </div>
        ) : imageUrl ? (
          <img src={imageUrl} alt={title} className="object-contain w-full h-full max-w-full max-h-[70vh]" />
        ) : (
          <div className="text-center text-gray-500 p-8">
            <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" /></svg>
            <p className="mt-2">The cleaned image will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
};
