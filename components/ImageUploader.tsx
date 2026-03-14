
import React, { useState, useCallback, useRef } from 'react';
import { UploadIcon } from './Icons';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageUpload(e.target.files[0]);
    }
  };

  const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement>, dragging: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(dragging);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    handleDrag(e, false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onImageUpload(e.dataTransfer.files[0]);
    }
  }, [handleDrag, onImageUpload]);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const dragClass = isDragging 
    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/50' 
    : 'border-gray-300 dark:border-gray-600';

  return (
    <div className="w-full max-w-3xl mx-auto my-8">
      <div
        className={`relative block w-full rounded-lg border-2 border-dashed p-12 text-center transition-colors duration-200 ${dragClass} hover:border-indigo-500 dark:hover:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 cursor-pointer`}
        onDragEnter={(e) => handleDrag(e, true)}
        onDragLeave={(e) => handleDrag(e, false)}
        onDragOver={(e) => handleDrag(e, true)}
        onDrop={handleDrop}
        onClick={handleClick}
        tabIndex={0}
        onKeyPress={(e) => e.key === 'Enter' && handleClick()}
      >
        <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
        <span className="mt-2 block text-lg font-semibold text-gray-900 dark:text-gray-100">
          Upload a document image
        </span>
        <span className="mt-1 block text-sm text-gray-500 dark:text-gray-400">
          Drag and drop, or click to select a file
        </span>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="image/png, image/jpeg, image/webp"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
};
