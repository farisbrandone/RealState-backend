"use client";

import { useState } from "react";
import { HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";

interface FavoriteButtonProps {
  isFavorite: boolean;
  onToggle: () => void;
  className?: string;
  iconClassName?: string;
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  isFavorite,
  onToggle,
  className = "",
  iconClassName = "h-5 w-5",
}) => {
  const [bursting, setBursting] = useState(false);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        onToggle();
        // Ne pulse qu'à l'ajout (pas au retrait) — confirme un geste positif
        // sans faire "clignoter" l'icône quand on retire un favori.
        if (!isFavorite) {
          setBursting(true);
          setTimeout(() => setBursting(false), 400);
        }
      }}
      aria-label={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
      aria-pressed={isFavorite}
      className={className}
    >
      {isFavorite ? (
        <HeartSolid
          className={`${iconClassName} text-red-500 ${bursting ? "animate-heart-burst" : ""}`}
        />
      ) : (
        <HeartIcon className={`${iconClassName} text-primary-600`} />
      )}
    </button>
  );
};
