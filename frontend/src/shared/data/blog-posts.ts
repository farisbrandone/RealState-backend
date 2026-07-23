export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: {
    name: string;
    avatar: string;
    bio: string;
  };
  category: string;
  tags: string[];
  date: string;
  readTime: string;
  featured?: boolean;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "les-tendances-du-marche-immobilier-en-2025",
    title: "Les tendances du marché immobilier en 2025 en Afrique francophone",
    excerpt:
      "Analyse des grandes tendances qui façonnent le marché immobilier dans les grandes villes africaines cette année.",
    content: `
      <p>Le marché immobilier en Afrique francophone connaît une transformation majeure en 2025. Urbanisation rapide, émergence de nouvelles classes moyennes et investissements étrangers redessinent le paysage. Voici les principales tendances à surveiller.</p>
      
      <h3>1. La flambée de la demande locative</h3>
      <p>Dans des villes comme Douala, Abidjan, Dakar et Yaoundé, la demande de logements locatifs explose. Les jeunes professionnels recherchent des appartements modernes, bien situés et sécurisés. Le taux d'occupation dans les quartiers centraux dépasse souvent 95 %.</p>
      <p>Les studios et deux-pièces sont particulièrement prisés, avec des rendements locatifs atteignant 7 à 9 % dans certaines zones.</p>
      
      <h3>2. L'envolée des prix du mètre carré</h3>
      <p>Le prix moyen du mètre carré a augmenté de 8 à 12 % dans les capitales économiques. Cette hausse est portée par la raréfaction du foncier en centre-ville et l'augmentation du coût des matériaux de construction. Les quartiers autrefois périphériques deviennent attractifs, offrant des prix encore abordables pour les primo-accédants.</p>
      
      <h3>3. La montée en puissance des programmes immobiliers neufs</h3>
      <p>Les gouvernements et promoteurs privés lancent des programmes de logements neufs pour répondre à la demande. Les normes de construction s'améliorent, intégrant des critères de qualité et parfois des certifications environnementales.</p>
      
      <h3>4. L'impact du digital</h3>
      <p>Les plateformes numériques comme LuxHorizon facilitent la recherche de biens et la mise en relation entre acheteurs, locataires et propriétaires. La visite virtuelle, la signature électronique et le paiement en ligne simplifient les transactions.</p>
      
      <p>Pour réussir votre projet immobilier en 2025, il est crucial de s'informer, de comparer les offres et de se faire accompagner par des professionnels locaux.</p>
    `,
    coverImage: "/images/tendances.png",
    author: {
      name: "Sophie Kamga",
      avatar: "/images/blog/sophie_kamga.png",
      bio: "Analyste immobilier senior, spécialiste du marché africain depuis 15 ans.",
    },
    category: "Marché",
    tags: ["marché", "tendances", "investissement", "Afrique"],
    date: "2025-01-15",
    readTime: "6 min",
    featured: true,
  },
  {
    slug: "investir-dans-limmobilier-locatif-en-afrique",
    title: "Investir dans l'immobilier locatif en Afrique : les clés du succès",
    excerpt:
      "Nos conseils pratiques pour réussir votre investissement locatif, de la sélection du bien à la gestion locative.",
    content: `
      <p>L'investissement locatif est une stratégie patrimoniale éprouvée. En Afrique, où la demande locative est forte, il offre des opportunités de rendement intéressantes. Voici les étapes clés pour réussir.</p>
      
      <h3>1. Choisir le bon emplacement</h3>
      <p>La localisation est primordiale. Privilégiez les quartiers proches des universités, des centres d'affaires, des hôpitaux et des transports en commun. À Douala, les quartiers Bonapriso, Akwa et Bali sont très demandés. À Abidjan, le Plateau et Cocody restent des valeurs sûres.</p>
      
      <h3>2. Calculer la rentabilité nette</h3>
      <p>Ne vous fiez pas uniquement au prix d'achat. La rentabilité nette doit prendre en compte :</p>
      <ul>
        <li>Les charges de copropriété (si applicable)</li>
        <li>La taxe foncière annuelle</li>
        <li>Les frais d'entretien et de réparation</li>
        <li>La vacance locative (prévoir 1 à 2 mois par an)</li>
        <li>Les honoraires éventuels d'un gestionnaire</li>
      </ul>
      <p>Visez un rendement net d'au moins 5 % pour un investissement serein.</p>
      
      <h3>3. Financer son acquisition</h3>
      <p>Les banques locales proposent des crédits immobiliers à des taux compétitifs, parfois autour de 5 à 7 %. Comparez les offres, négociez les frais de dossier et vérifiez les conditions d'assurance emprunteur.</p>
      
      <h3>4. La gestion locative</h3>
      <p>Vous pouvez gérer vous-même votre bien ou déléguer à une agence. Une agence prélève généralement 8 à 10 % des loyers, mais vous libère des contraintes quotidiennes (recherche de locataires, état des lieux, recouvrement).</p>
      
      <p>L'investissement locatif reste un excellent moyen de se constituer un patrimoine durable, à condition d'être bien préparé.</p>
    `,
    coverImage: "/images/investir.png",
    author: {
      name: "Jean-Paul Yomba",
      avatar: "/images/blog/jean_paul_yomba.png",
      bio: "Conseiller en gestion de patrimoine et investisseur immobilier.",
    },
    category: "Investissement",
    tags: ["investissement", "locatif", "rentabilité", "gestion"],
    date: "2025-01-10",
    readTime: "7 min",
  },
  {
    slug: "guide-acheter-un-bien-a-letranger",
    title:
      "Guide pratique : acheter un bien immobilier à l'étranger en tant qu'Africain",
    excerpt:
      "Les démarches administratives, fiscales et juridiques pour acheter sereinement un bien dans un autre pays.",
    content: `
      <p>Acheter un bien immobilier à l'étranger est un projet ambitieux qui offre des perspectives de diversification et de rendement. Que vous soyez Ivoirien souhaitant investir au Sénégal ou Camerounais visant la France, voici les étapes indispensables.</p>
      
      <h3>1. Maîtriser la législation locale</h3>
      <p>Chaque pays a ses propres règles concernant la propriété étrangère. Renseignez-vous sur :</p>
      <ul>
        <li>Les restrictions éventuelles pour les étrangers non-résidents</li>
        <li>Les taxes d'acquisition (droits de mutation, frais de notaire)</li>
        <li>Les taxes foncières annuelles</li>
        <li>La fiscalité sur les plus-values en cas de revente</li>
        <li>Les conventions fiscales entre votre pays de résidence et le pays d'achat</li>
      </ul>
      
      <h3>2. Faire appel à des professionnels locaux</h3>
      <p>Un notaire local est indispensable pour sécuriser la transaction. Il vérifiera la validité des titres de propriété, l'absence d'hypothèques et rédigera l'acte authentique. Un avocat spécialisé peut également vous conseiller sur les aspects fiscaux.</p>
      
      <h3>3. Visiter le bien et évaluer l'environnement</h3>
      <p>Ne signez jamais sans avoir visité le bien. Profitez-en pour évaluer :</p>
      <ul>
        <li>La qualité de la construction (fissures, humidité, plomberie, électricité)</li>
        <li>Les commodités (transports, commerces, écoles)</li>
        <li>Le voisinage et la sécurité du quartier</li>
      </ul>
      
      <h3>4. Financer l'achat</h3>
      <p>Le financement peut provenir de fonds propres, d'un crédit dans votre pays d'origine ou d'un crédit local. Comparez les taux de change et les frais bancaires pour optimiser votre opération.</p>
      
      <p>L'achat à l'étranger est une belle aventure patrimoniale, à condition d'être bien entouré et informé.</p>
    `,
    coverImage: "/images/etranger.png",
    author: {
      name: "Marie Diop",
      avatar: "/images/blog/marie_diop.png",
      bio: "Juriste en droit immobilier international, basée à Dakar.",
    },
    category: "Guide",
    tags: ["guide", "étranger", "achat", "juridique", "fiscalité"],
    date: "2025-01-05",
    readTime: "8 min",
  },
  {
    slug: "les-avantages-de-la-vente-entre-particuliers",
    title: "Les avantages et les précautions de la vente entre particuliers",
    excerpt:
      "Vendre son bien sans agence : économies potentielles et pièges à éviter.",
    content: `
      <p>La vente entre particuliers séduit de nombreux propriétaires souhaitant économiser les frais d'agence, souvent compris entre 5 % et 10 % du prix de vente. Mais cette démarche nécessite rigueur et préparation.</p>
      
      <h3>Les avantages</h3>
      <ul>
        <li><strong>Économie financière :</strong> pas de commission d'agence, soit plusieurs milliers d'euros ou de francs CFA économisés.</li>
        <li><strong>Maîtrise du processus :</strong> vous fixez le prix, organisez les visites, négociez directement avec l'acheteur.</li>
        <li><strong>Relation directe :</strong> le contact humain sans intermédiaire peut faciliter la transaction.</li>
      </ul>
      
      <h3>Les précautions indispensables</h3>
      <ul>
        <li><strong>Diagnostics obligatoires :</strong> selon le pays, vous devez fournir des diagnostics (plomb, amiante, gaz, électricité, performance énergétique).</li>
        <li><strong>Estimation réaliste :</strong> faites estimer votre bien par plusieurs sources pour éviter de le sous-évaluer ou de le surestimer.</li>
        <li><strong>Sécurisation juridique :</strong> faites appel à un notaire pour la rédaction du compromis et de l'acte définitif. C'est une obligation légale dans la plupart des pays.</li>
        <li><strong>Sélection des acheteurs :</strong> vérifiez la solvabilité des candidats, demandez une attestation de financement ou un accord de crédit.</li>
      </ul>
      
      <p>Vendre entre particuliers est tout à fait possible et peut être très rentable si l'on s'entoure des bons professionnels pour les aspects juridiques.</p>
    `,
    coverImage: "/images/blog/avantages.png",
    author: {
      name: "Alain Fotso",
      avatar: "/images/blog/alain_fotso.png",
      bio: "Agent immobilier indépendant et formateur en transaction.",
    },
    category: "Vente",
    tags: ["vente", "particulier", "économie", "juridique"],
    date: "2024-12-20",
    readTime: "5 min",
  },
  {
    slug: "comment-bien-estimer-son-bien-immobilier",
    title: "Comment bien estimer son bien immobilier en Afrique ?",
    excerpt:
      "Les méthodes d'estimation fiables pour connaître la vraie valeur de votre maison ou appartement.",
    content: `
      <p>Estimer correctement un bien immobilier est essentiel pour ne pas passer à côté d'une vente ou au contraire brader son patrimoine. Voici les principales méthodes utilisées par les professionnels.</p>
      
      <h3>1. La méthode par comparaison</h3>
      <p>Il s'agit de comparer votre bien avec des biens similaires vendus récemment dans le même quartier. Les critères à prendre en compte : surface habitable, nombre de pièces, état général, étage, présence d'un jardin ou d'une terrasse, exposition, etc.</p>
      <p>Consultez les annonces récentes sur LuxHorizon et d'autres plateformes, mais attention : le prix affiché n'est pas le prix de vente final. Les biens se vendent généralement 5 à 10 % en dessous du prix affiché.</p>
      
      <h3>2. La méthode par le revenu</h3>
      <p>Pour un bien locatif, on peut estimer sa valeur en fonction du loyer annuel net. Le taux de capitalisation (rapport loyer / prix) varie selon les villes et les types de biens, mais se situe souvent entre 5 % et 8 % en Afrique.</p>
      <p>Exemple : un appartement rapportant 1 200 000 FCFA de loyer annuel net, avec un taux de 6 %, aurait une valeur d'environ 20 000 000 FCFA.</p>
      
      <h3>3. La méthode par le coût de reconstruction</h3>
      <p>On estime le coût de reconstruction à neuf, puis on applique une décote liée à l'âge et à l'état du bien. Cette méthode est surtout utilisée pour les maisons individuelles.</p>
      
      <h3>4. Faire appel à un professionnel</h3>
      <p>Un agent immobilier ou un expert peut vous fournir une estimation plus précise, basée sur sa connaissance du marché local. L'estimation est généralement gratuite.</p>
    `,
    coverImage: "/images/blog/estimation.png",
    author: {
      name: "Sophie Kamga",
      avatar: "/images/blog/sophie_kamga.png",
      bio: "Analyste immobilier senior.",
    },
    category: "Guide",
    tags: ["estimation", "valeur", "conseils", "méthodes"],
    date: "2024-12-15",
    readTime: "6 min",
  },
  {
    slug: "les-erreurs-a-eviter-lors-de-lachat",
    title:
      "Les 7 erreurs à éviter absolument lors de l'achat d'un bien immobilier",
    excerpt:
      "Découvrez les pièges les plus courants qui peuvent transformer votre achat en cauchemar financier.",
    content: `
      <p>L'achat d'un bien immobilier est souvent le projet d'une vie. Pour éviter les mauvaises surprises, voici les erreurs les plus fréquentes et comment les contourner.</p>
      
      <h3>1. Ne pas vérifier les documents juridiques</h3>
      <p>Le titre foncier, le certificat de propriété, les permis de construire... Vérifiez tous les documents auprès du cadastre ou de la conservation foncière. Un bien sans titre clair peut cacher des litiges.</p>
      
      <h3>2. Sous-estimer les frais annexes</h3>
      <p>Outre le prix d'achat, prévoyez les frais de notaire (5 à 8 %), les droits d'enregistrement, les frais d'agence, les éventuels travaux de rénovation et les taxes foncières.</p>
      
      <h3>3. Négliger l'état du bien</h3>
      <p>Une visite superficielle ne suffit pas. Examinez la toiture, les murs (fissures, humidité), la plomberie, l'installation électrique. N'hésitez pas à faire appel à un expert en bâtiment.</p>
      
      <h3>4. Se précipiter</h3>
      <p>Ne cédez pas à la pression d'un vendeur ou d'un agent. Prenez le temps de comparer, de visiter plusieurs biens et de réfléchir.</p>
      
      <h3>5. Oublier l'environnement</h3>
      <p>Visitez le quartier à différentes heures, renseignez-vous sur les projets d'urbanisme, les nuisances sonores, la sécurité, les commodités.</p>
      
      <h3>6. Mal négocier le financement</h3>
      <p>Comparez les offres de crédit de plusieurs banques. Négociez le taux, les frais de dossier, la durée et l'assurance emprunteur.</p>
      
      <h3>7. Signer sans l'avis d'un notaire</h3>
      <p>Le notaire est votre meilleur allié pour sécuriser la transaction. Ne signez jamais un compromis ou un acte de vente sans son aval.</p>
    `,
    coverImage: "/images/blog/erreur.png",
    author: {
      name: "Jean-Paul Yomba",
      avatar: "/images/blog/jean_paul_yomba.png",
      bio: "Conseiller en gestion de patrimoine.",
    },
    category: "Achat",
    tags: ["achat", "erreurs", "conseils", "juridique"],
    date: "2024-12-01",
    readTime: "7 min",
  },
  {
    slug: "tout-savoir-sur-la-fiscalite-immobiliere-en-zone-cemac",
    title: "Fiscalité immobilière en zone CEMAC : ce qu'il faut savoir",
    excerpt:
      "Les impôts et taxes liés à l'achat, la détention et la vente de biens immobiliers dans les pays de la CEMAC.",
    content: `
      <p>La zone CEMAC (Cameroun, Congo, Gabon, Guinée équatoriale, RCA, Tchad) applique des règles fiscales relativement harmonisées en matière immobilière. Voici l'essentiel à connaître.</p>
      
      <h3>1. Les droits d'enregistrement</h3>
      <p>Lors de l'achat, des droits d'enregistrement sont perçus. Ils varient entre 5 % et 10 % du prix de vente selon le pays et la nature du bien (ancien, neuf, terrain).</p>
      
      <h3>2. La taxe foncière</h3>
      <p>Chaque année, le propriétaire doit s'acquitter de la taxe foncière, calculée sur la valeur locative cadastrale. Les taux diffèrent, mais restent généralement modérés (moins de 1 %).</p>
      
      <h3>3. Les plus-values immobilières</h3>
      <p>En cas de revente, la plus-value peut être taxée. Certains pays exonèrent la résidence principale sous conditions. Le taux d'imposition varie de 15 % à 30 %.</p>
      
      <h3>4. Les avantages fiscaux</h3>
      <p>Certains investissements (construction de logements sociaux, rénovation énergétique) peuvent bénéficier de réductions d'impôts. Renseignez-vous auprès d'un conseiller fiscal.</p>
      
      <p>La fiscalité est un élément clé de votre stratégie patrimoniale. N'hésitez pas à consulter un expert local.</p>
    `,
    coverImage: "/images/blog/fiscalite.png",
    author: {
      name: "Marie Diop",
      avatar: "/images/blog/marie_diop.png",
      bio: "Juriste fiscaliste, spécialiste de la zone CEMAC.",
    },
    category: "Fiscalité",
    tags: ["fiscalité", "CEMAC", "taxes", "impôts"],
    date: "2024-11-20",
    readTime: "5 min",
  },
  {
    slug: "la-construction-de-sa-maison-par-ou-commencer",
    title: "Construire sa maison en Afrique : par où commencer ?",
    excerpt:
      "Les étapes clés pour réussir votre projet de construction, du terrain à la remise des clés.",
    content: `
      <p>Faire construire sa maison est un rêve pour beaucoup de familles africaines. Pour que ce projet se déroule sans encombre, voici les grandes étapes à respecter.</p>
      
      <h3>1. Acheter un terrain viabilisé</h3>
      <p>Le choix du terrain est primordial. Assurez-vous qu'il soit accessible, borné, et surtout qu'il dispose d'un titre foncier clair. Vérifiez également la nature du sol (étude géotechnique).</p>
      
      <h3>2. Concevoir les plans</h3>
      <p>Faites appel à un architecte ou un dessinateur professionnel. Le plan doit respecter les règles d'urbanisme locales (hauteur, alignement, surface constructible).</p>
      
      <h3>3. Obtenir le permis de construire</h3>
      <p>Déposez votre dossier en mairie ou à la communauté urbaine. Le délai d'obtention peut varier de 1 à 3 mois.</p>
      
      <h3>4. Choisir les entreprises</h3>
      <p>Sélectionnez soigneusement les artisans et les corps de métier (maçonnerie, charpente, plomberie, électricité). Vérifiez leurs références et signez des devis détaillés.</p>
      
      <h3>5. Suivre le chantier</h3>
      <p>Un suivi régulier est indispensable. Vous pouvez déléguer cette mission à un maître d'œuvre ou un architecte.</p>
      
      <h3>6. Réceptionner les travaux</h3>
      <p>Avant de payer le solde, vérifiez la conformité des travaux avec le devis et signalez les éventuelles malfaçons.</p>
    `,
    coverImage: "/images/blog/construction.png",
    author: {
      name: "Alain Fotso",
      avatar: "/images/blog/alain_fotso.png",
      bio: "Ingénieur en génie civil et promoteur immobilier.",
    },
    category: "Construction",
    tags: ["construction", "maison", "guide", "étapes"],
    date: "2024-11-10",
    readTime: "6 min",
  },
];
