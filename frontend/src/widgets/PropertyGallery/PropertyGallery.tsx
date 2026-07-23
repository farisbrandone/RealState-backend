"use client";

import { useState } from "react";
import { Lightbox } from "./Lightbox";
import { getMediaUrl } from "@/shared/lib/media/media-url";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PlayIcon,
} from "@heroicons/react/24/outline";

interface Media {
  id: string;
  url: string;
  type: "image" | "video";
  isMain: boolean;
  order: number;
  createdAt: string;
}

interface PropertyGalleryProps {
  images: Media[];
  title?: string;
}

export const PropertyGallery: React.FC<PropertyGalleryProps> = ({ images, title = "Photo" }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  // URL résolue une seule fois ici : Lightbox et les miniatures n'ont plus à
  // connaître la logique de construction d'URL média.
  const sorted = [...images]
    .sort((a, b) => (a.isMain ? -1 : b.isMain ? 1 : 0))
    .map((m) => ({
      ...m,
      url: getMediaUrl(m.url) || "/images/property-placeholder.jpg",
    }));

  if (sorted.length === 0) {
    return (
      <div className="aspect-[16/9] bg-primary-100 rounded-xl flex items-center justify-center text-primary-400">
        <span>Aucune image disponible</span>
      </div>
    );
  }

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setIsOpen(true);
  };

  const closeLightbox = () => setIsOpen(false);

  const goTo = (index: number) => setCurrentIndex(index);
  const goNext = () => setCurrentIndex((prev) => (prev + 1) % sorted.length);
  const goPrev = () =>
    setCurrentIndex((prev) => (prev - 1 + sorted.length) % sorted.length);

  return (
    <div className="space-y-2">
      {/* Image principale */}
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl">
        <button
          type="button"
          onClick={() => openLightbox(currentIndex)}
          aria-label={`Agrandir la photo ${currentIndex + 1} sur ${sorted.length}`}
          className="absolute inset-0 h-full w-full cursor-pointer text-left"
        >
          <img
            src={sorted[currentIndex]?.url}
            alt={`${title} — photo ${currentIndex + 1}`}
            className="h-full w-full object-cover"
          />
        </button>

        {/* Compteur */}
        <div className="pointer-events-none absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full">
          {currentIndex + 1} / {sorted.length}
        </div>

        {/* Flèches navigation rapide */}
        {sorted.length > 1 && (
          <>
            <button
              type="button"
              onClick={goPrev}
              aria-label="Photo précédente"
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-sm text-white p-2 rounded-full hover:bg-black/70 transition-colors focus-visible:ring-2 focus-visible:ring-white"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label="Photo suivante"
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-sm text-white p-2 rounded-full hover:bg-black/70 transition-colors focus-visible:ring-2 focus-visible:ring-white"
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </>
        )}

        {/* Badge vidéo si présence */}
        {sorted.some((m) => m.type === "video") && (
          <div className="pointer-events-none absolute top-3 right-3 bg-accent text-ink text-xs px-2 py-1 rounded-full flex items-center gap-1">
            <PlayIcon className="h-3 w-3" />
            Vidéo
          </div>
        )}
      </div>

      {/* Miniatures */}
      {sorted.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {sorted.map((media, idx) => (
            <button
              key={media.id}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Voir la photo ${idx + 1}`}
              aria-current={idx === currentIndex}
              className={`relative w-20 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all focus-visible:ring-2 focus-visible:ring-accent ${
                idx === currentIndex
                  ? "border-accent"
                  : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <img
                src={media.url}
                alt=""
                className="w-full h-full object-cover"
              />
              {media.type === "video" && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <PlayIcon className="h-4 w-4 text-white" />
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {isOpen && (
        <Lightbox
          images={sorted}
          currentIndex={currentIndex}
          altBase={title}
          onClose={closeLightbox}
          onPrev={goPrev}
          onNext={goNext}
          onSelect={goTo}
        />
      )}
    </div>
  );
};
