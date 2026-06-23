import React from 'react';
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface LightboxProps {
  images: { id: string; url: string }[];
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  onSelect: (index: number) => void;
}

export const Lightbox: React.FC<LightboxProps> = ({
  images,
  currentIndex,
  onClose,
  onPrev,
  onNext,
  onSelect,
}) => {
  return (
    <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-full"
      >
        <XMarkIcon className="h-8 w-8" />
      </button>

      <button
        onClick={onPrev}
        className="absolute left-4 text-white p-2 hover:bg-white/10 rounded-full"
      >
        <ChevronLeftIcon className="h-8 w-8" />
      </button>

      <img
        src={images[currentIndex]?.url}
        alt=""
        className="max-h-[90vh] max-w-[90vw] object-contain"
      />

      <button
        onClick={onNext}
        className="absolute right-4 text-white p-2 hover:bg-white/10 rounded-full"
      >
        <ChevronRightIcon className="h-8 w-8" />
      </button>

      <div className="absolute bottom-4 flex gap-2">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => onSelect(idx)}
            className={`h-2 w-8 rounded-full ${idx === currentIndex ? 'bg-accent' : 'bg-white/50'}`}
          />
        ))}
      </div>
    </div>
  );
};
