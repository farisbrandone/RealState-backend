import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        // text-ink (jamais text-primary-900) : accent reste un or à peu près
        // constant entre les thèmes, alors que primary-900 bascule au blanc
        // en sombre — l'associer à accent rendrait le texte du bouton
        // invisible en mode sombre. ink ne bascule jamais, donc le texte
        // reste toujours foncé sur l'accent, dans les deux thèmes.
        primary: 'bg-accent text-ink hover:bg-accent-dark',
        secondary: 'bg-primary-100 text-primary-900 hover:bg-primary-200',
        outline: 'border border-primary-200 bg-transparent text-primary-900 hover:bg-primary-50',
        ghost: 'bg-transparent text-primary-900 hover:bg-primary-50',
      },
      size: {
        sm: 'h-9 px-3 text-sm',
        md: 'h-11 px-6 text-base',
        lg: 'h-12 px-8 text-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, children, ...props }, ref) => {
    return (
      <button className={buttonVariants({ variant, size, className })} ref={ref} {...props}>
        {children}
      </button>
    );
  },
);
Button.displayName = 'Button';
