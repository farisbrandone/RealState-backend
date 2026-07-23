// Épouse la structure réelle de PropertyCard (image 4/3, prix, titre 2
// lignes, badges, ligne caractéristiques) plutôt qu'un unique bloc gris —
// l'utilisateur perçoit la forme du contenu à venir pendant le chargement.
export const PropertyCardSkeleton: React.FC = () => (
  <div className="flex h-full flex-col overflow-hidden rounded-xl bg-surface shadow-card animate-pulse">
    <div className="aspect-[4/3] w-full bg-primary-100" />
    <div className="flex flex-1 flex-col p-4">
      <div className="mb-3 h-5 w-24 rounded bg-primary-100" />
      <div className="mb-2 h-4 w-full rounded bg-primary-100" />
      <div className="mb-3 h-4 w-2/3 rounded bg-primary-100" />
      <div className="mb-2 flex gap-2">
        <div className="h-5 w-16 rounded-full bg-primary-100" />
        <div className="h-5 w-20 rounded-full bg-primary-100" />
      </div>
      <div className="mt-auto flex gap-4 border-t border-primary-100 pt-3">
        <div className="h-4 w-10 rounded bg-primary-100" />
        <div className="h-4 w-10 rounded bg-primary-100" />
        <div className="h-4 w-14 rounded bg-primary-100" />
      </div>
    </div>
  </div>
);
