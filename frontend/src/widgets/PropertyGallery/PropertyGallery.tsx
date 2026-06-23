'use client';

import { useState } from 'react';
import { Lightbox } from './Lightbox';

interface Media {
  id: string;
  url: string;
  isMain: boolean;
}

interface PropertyGalleryProps {
  images: Media[];
}

export const PropertyGallery: React.FC<PropertyGalleryProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const sorted = [...images].sort((a, b) => (a.isMain ? -1 : 0));

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setIsOpen(true);
  };

  const closeLightbox = () => setIsOpen(false);

  const goTo = (index: number) => setCurrentIndex(index);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 rounded-xl overflow-hidden">
        <div className="cursor-pointer h-80 md:h-full" onClick={() => openLightbox(0)}>
          <img
            src={sorted[0]?.url || '/images/property-placeholder.jpg'}
            alt="Photo principale"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          {sorted.slice(1, 5).map((media, idx) => (
            <div
              key={media.id}
              className="cursor-pointer h-40 md:h-auto"
              onClick={() => openLightbox(idx + 1)}
            >
              <img
                src={media.url}
                alt={`Photo ${idx + 2}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {isOpen && (
        <Lightbox
          images={sorted}
          currentIndex={currentIndex}
          onClose={closeLightbox}
          onPrev={() => goTo((currentIndex - 1 + sorted.length) % sorted.length)}
          onNext={() => goTo((currentIndex + 1) % sorted.length)}
          onSelect={goTo}
        />
      )}
    </div>
  );
};
