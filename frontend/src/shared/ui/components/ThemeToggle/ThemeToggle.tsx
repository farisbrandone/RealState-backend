"use client";

import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";
import { useTheme } from "@/features/theme/hooks/useTheme";

interface ThemeToggleProps {
  className?: string;
  iconClassName?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className = "",
  iconClassName = "text-primary-600",
}) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "Activer le thème clair" : "Activer le thème sombre"}
      title={theme === "dark" ? "Thème clair" : "Thème sombre"}
      className={`inline-flex items-center justify-center rounded-lg p-2 transition-colors focus-visible:ring-2 focus-visible:ring-accent ${className}`}
    >
      {theme === "dark" ? (
        <SunIcon className={`h-5 w-5 ${iconClassName}`} />
      ) : (
        <MoonIcon className={`h-5 w-5 ${iconClassName}`} />
      )}
    </button>
  );
};
