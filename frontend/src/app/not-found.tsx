import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-6xl font-heading text-accent mb-4">404</h1>
        <h2 className="text-2xl font-heading mb-6">Page introuvable</h2>
        <p className="text-primary-500 mb-8">
          La page que vous recherchez n’existe pas ou a été déplacée.
        </p>
        <Link href="/" className="bg-accent text-white px-6 py-3 rounded-lg hover:bg-accent-dark">
          Retour à l’accueil
        </Link>
      </div>
    </div>
  );
}
