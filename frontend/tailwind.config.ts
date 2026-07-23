import type { Config } from 'tailwindcss';

// Chaque couleur pointe vers une variable CSS "R G B" (voir src/styles/globals.css)
// définie pour :root et re-définie sous .dark — même nom de classe partout
// dans l'app (bg-primary-100, text-primary-900, bg-surface...), mais qui
// bascule automatiquement selon le thème actif. <alpha-value> préserve les
// modificateurs d'opacité déjà utilisés (bg-accent/10, ring-accent/40...).
function themedColor(cssVar: string) {
  return `rgb(var(${cssVar}) / <alpha-value>)`;
}

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}', './app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: themedColor('--color-primary-50'),
          100: themedColor('--color-primary-100'),
          200: themedColor('--color-primary-200'),
          300: themedColor('--color-primary-300'),
          400: themedColor('--color-primary-400'),
          500: themedColor('--color-primary-500'),
          600: themedColor('--color-primary-600'),
          700: themedColor('--color-primary-700'),
          800: themedColor('--color-primary-800'),
          900: themedColor('--color-primary-900'),
        },
        accent: {
          DEFAULT: themedColor('--color-accent'),
          light: themedColor('--color-accent-light'),
          dark: themedColor('--color-accent-dark'),
        },
        surface: themedColor('--color-surface'),
        background: themedColor('--color-background'),
        // Bandeau de marque toujours sombre — ne bascule jamais avec le thème
        // (voir le commentaire dans globals.css). À utiliser avec du texte
        // blanc/clair non themé (text-white, text-white/70), jamais avec
        // text-primary-*, qui lui bascule et perdrait tout contraste dessus.
        ink: {
          DEFAULT: themedColor('--color-ink'),
          elevated: themedColor('--color-ink-elevated'),
        },
      },
      fontFamily: {
        // Variables injectées par next/font/google dans src/app/layout.tsx.
        heading: ['var(--font-playfair)', 'serif'],
        body: ['var(--font-inter)', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        card: '0 0 0 1px rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.06)',
      },
      borderRadius: {
        xl: '12px',
      },
    },
  },
  plugins: [],
};
export default config;
