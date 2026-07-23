import { Card } from "@/shared/ui/components/Card/Card";
import { ArrowTopRightOnSquareIcon, CubeIcon, MapIcon } from "@heroicons/react/24/outline";

interface PropertyVirtualTourProps {
  virtualTourUrl?: string | null;
  floorPlanUrl?: string | null;
  title: string;
}

// Visite virtuelle : lien embed (Matterport, Kuula, YouTube 360…) plutôt
// qu'un moteur 3D maison — la quasi-totalité des visites pro sont déjà
// hébergées ainsi, et un iframe couvre le besoin sans réinventer l'outil.
// Plan du bien : affichage statique de l'image fournie par l'agence — pas
// de zones cliquables pièce par pièce dans cette première version.
export const PropertyVirtualTour: React.FC<PropertyVirtualTourProps> = ({
  virtualTourUrl,
  floorPlanUrl,
  title,
}) => {
  if (!virtualTourUrl && !floorPlanUrl) return null;

  return (
    <div className="space-y-8">
      {virtualTourUrl && (
        <Card>
          <h2 className="mb-4 flex items-center gap-2 text-xl font-heading">
            <CubeIcon className="h-5 w-5 text-accent" />
            Visite virtuelle
          </h2>
          <div className="aspect-video w-full overflow-hidden rounded-lg bg-primary-100">
            <iframe
              src={virtualTourUrl}
              title={`Visite virtuelle — ${title}`}
              className="h-full w-full border-0"
              allow="xr-spatial-tracking; gyroscope; accelerometer"
              allowFullScreen
            />
          </div>
          <a
            href={virtualTourUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1 text-sm text-accent-dark hover:underline"
          >
            Ouvrir dans un nouvel onglet
            <ArrowTopRightOnSquareIcon className="h-3.5 w-3.5" />
          </a>
        </Card>
      )}

      {floorPlanUrl && (
        <Card>
          <h2 className="mb-4 flex items-center gap-2 text-xl font-heading">
            <MapIcon className="h-5 w-5 text-accent" />
            Plan du bien
          </h2>
          <a href={floorPlanUrl} target="_blank" rel="noopener noreferrer">
            <img
              src={floorPlanUrl}
              alt={`Plan du bien — ${title}`}
              className="w-full rounded-lg border border-primary-100 object-contain"
            />
          </a>
        </Card>
      )}
    </div>
  );
};
