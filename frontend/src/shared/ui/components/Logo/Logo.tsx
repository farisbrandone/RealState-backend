// src/shared/ui/components/Logo/Logo.tsx
import React from "react";

interface LogoProps {
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className = "" }) => (
  <svg
    viewBox="0 0 160 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path d="M8 32L20 16L32 32H8Z" fill="#D4AF37" />
    <rect x="36" y="28" width="4" height="4" fill="#D4AF37" />
    <text
      x="48"
      y="31"
      fill="#D4AF37"
      font-family="Playfair Display, serif"
      font-size="20"
      font-weight="bold"
    >
      LuxHorizon
    </text>
  </svg>
);
