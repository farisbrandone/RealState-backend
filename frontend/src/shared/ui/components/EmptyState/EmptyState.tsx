import { ReactNode } from "react";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

// Traitement partagé pour tous les états vides : icône dans un cercle teinté
// accent plutôt qu'une icône plate grise — lit comme une intention de design,
// pas comme un simple "rien à afficher".
export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className = "",
}) => (
  <div className={`flex flex-col items-center justify-center text-center p-8 ${className}`}>
    <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-accent/10 text-accent">
      {icon}
    </div>
    <h3 className="text-xl font-heading mb-2 text-primary-900">{title}</h3>
    {description && <p className="mb-4 max-w-sm text-primary-500">{description}</p>}
    {action}
  </div>
);
