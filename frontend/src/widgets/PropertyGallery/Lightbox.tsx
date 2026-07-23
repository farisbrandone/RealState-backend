import React, { useEffect, useRef } from "react";
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

interface LightboxProps {
  images: { id: string; url: string }[];
  currentIndex: number;
  altBase?: string;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  onSelect: (index: number) => void;
}

const SWIPE_THRESHOLD_PX = 50;

export const Lightbox: React.FC<LightboxProps> = ({
  images,
  currentIndex,
  altBase = "Photo",
  onClose,
  onPrev,
  onNext,
  onSelect,
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const touchStartX = useRef<number | null>(null);

  // Focus initial sur le bouton de fermeture, verrouillage du scroll de
  // fond, et restauration du focus à l'élément qui a ouvert la Lightbox.
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Clavier : Échap ferme, flèches naviguent, Tab reste piégé dans la modale.
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        onPrev();
        return;
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        onNext();
        return;
      }
      if (e.key === "Tab" && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], [tabindex]:not([tabindex="-1"])',
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose, onPrev, onNext]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > SWIPE_THRESHOLD_PX) {
      if (delta > 0) onPrev();
      else onNext();
    }
    touchStartX.current = null;
  };

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label="Galerie photo"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <button
        ref={closeButtonRef}
        type="button"
        onClick={onClose}
        aria-label="Fermer la galerie"
        className="absolute top-4 right-4 rounded-full p-2 text-white hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white"
      >
        <XMarkIcon className="h-8 w-8" />
      </button>

      {images.length > 1 && (
        <button
          type="button"
          onClick={onPrev}
          aria-label="Photo précédente"
          className="absolute left-4 rounded-full p-2 text-white hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white"
        >
          <ChevronLeftIcon className="h-8 w-8" />
        </button>
      )}

      <img
        src={images[currentIndex]?.url}
        alt={`${altBase} — image ${currentIndex + 1} sur ${images.length}`}
        className="max-h-[90vh] max-w-[90vw] object-contain"
      />

      {images.length > 1 && (
        <button
          type="button"
          onClick={onNext}
          aria-label="Photo suivante"
          className="absolute right-4 rounded-full p-2 text-white hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white"
        >
          <ChevronRightIcon className="h-8 w-8" />
        </button>
      )}

      <p className="absolute top-4 left-4 text-sm text-white/80" aria-live="polite">
        {currentIndex + 1} / {images.length}
      </p>

      {images.length > 1 && (
        <div className="absolute bottom-4 flex gap-2">
          {images.map((image, idx) => (
            <button
              key={image.id}
              type="button"
              onClick={() => onSelect(idx)}
              aria-label={`Aller à la photo ${idx + 1}`}
              aria-current={idx === currentIndex}
              className={`h-2 w-8 rounded-full focus-visible:ring-2 focus-visible:ring-white ${
                idx === currentIndex ? "bg-accent" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
