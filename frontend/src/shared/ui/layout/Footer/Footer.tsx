export const Footer = () => {
  return (
    // bg-ink reste toujours sombre (voir globals.css) : le texte clair
    // ci-dessous reste lisible en clair comme en sombre, sans exception.
    <footer className="bg-ink text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="font-heading text-lg mb-4">LuxHorizon</h3>
          <p className="text-white/60 text-sm">Votre partenaire immobilier de confiance.</p>
        </div>
        <div>
          <h4 className="font-medium mb-4">Liens utiles</h4>
          <ul className="space-y-2 text-sm text-white/60">
            <li>
              <a href="#" className="hover:text-accent">
                À propos
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-accent">
                Contact
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-accent">
                CGV
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-medium mb-4">Suivez-nous</h4>
          <div className="flex space-x-4">{/* Insérez des icônes réseaux sociaux Heroicons */}</div>
        </div>
      </div>
      <div className="mt-8 border-t border-white/10 pt-8 text-center text-sm text-white/50">
        &copy; 2025 LuxHorizon. Tous droits réservés.
      </div>
    </footer>
  );
};
