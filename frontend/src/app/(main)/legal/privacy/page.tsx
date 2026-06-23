export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-heading mb-8">
        Politique de Confidentialité
      </h1>
      <div className="prose prose-primary max-w-none">
        <h2>1. Collecte des données</h2>
        <p>
          Nous collectons les données que vous nous fournissez lors de votre
          inscription (nom, email, téléphone) ainsi que les données de
          navigation.
        </p>
        <h2>2. Utilisation des données</h2>
        <p>
          Vos données sont utilisées pour vous fournir nos services, améliorer
          votre expérience et vous contacter dans le cadre de votre utilisation
          de la plateforme.
        </p>
        <h2>3. Partage des données</h2>
        <p>
          Vos données ne sont jamais vendues à des tiers. Elles peuvent être
          partagées avec les agents ou propriétaires lorsque vous les contactez
          via la plateforme.
        </p>
        <h2>4. Cookies</h2>
        <p>
          Nous utilisons des cookies pour le bon fonctionnement du site et
          l'analyse d'audience.
        </p>
        <h2>5. Vos droits</h2>
        <p>
          Conformément aux réglementations en vigueur, vous disposez d'un droit
          d'accès, de rectification et de suppression de vos données.
        </p>
      </div>
    </div>
  );
}
