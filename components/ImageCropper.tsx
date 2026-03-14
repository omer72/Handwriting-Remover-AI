import React, { useState, useRef } from 'react';
import ReactCrop, {
  centerCrop,
  type Crop,
  type PixelCrop,
} from 'react-image-crop';
import { Button } from './Button';
import { getCroppedImg } from '../utils/imageUtils';

interface ImageCropperProps {
  imageUrl: string;
  mimeType: string;
  onCropComplete: (croppedImage: string) => void;
  onCancel: () => void;
}

export const ImageCropper: React.FC<ImageCropperProps> = ({ imageUrl, mimeType, onCropComplete, onCancel }) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget;
    const initialCrop = centerCrop(
        {
          unit: '%',
          width: 90,
          height: 90,
        },
        width,
        height
    );
    setCrop(initialCrop);
  }
  
  const handleCropImage = async () => {
    if (completedCrop && imgRef.current) {
        try {
            const croppedImage = await getCroppedImg(
                imgRef.current,
                completedCrop,
                mimeType,
            );
             onCropComplete(croppedImage);
        } catch (e) {
            console.error(e);
        }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-4xl max-h-[90vh] flex flex-col">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Crop Your Document</h2>
        <div className="flex-grow overflow-auto flex justify-center items-center">
            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onComplete={(c) => setCompletedCrop(c)}
            >
              <img
                ref={imgRef}
                alt="Crop me"
                src={imageUrl}
                onLoad={onImageLoad}
                style={{ maxHeight: '70vh', objectFit: 'contain' }}
              />
            </ReactCrop>
        </div>
        <div className="mt-6 flex justify-end gap-4">
          <Button onClick={onCancel} variant="secondary">
            Cancel
          </Button>
          <Button 
            onClick={handleCropImage}
            disabled={!completedCrop?.width || !completedCrop?.height}
          >
            Crop &amp; Continue
          </Button>
        </div>
      </div>
    </div>
  );
};
