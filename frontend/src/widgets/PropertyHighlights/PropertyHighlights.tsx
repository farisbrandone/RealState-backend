import { CheckIcon } from "@heroicons/react/24/outline";

interface Highlight {
  icon?: React.ReactNode;
  label: string;
}

interface PropertyHighlightsProps {
  highlights: Highlight[];
}

export const PropertyHighlights: React.FC<PropertyHighlightsProps> = ({
  highlights,
}) => {
  if (highlights.length === 0) return null;

  return (
    <div className="bg-accent/5 border border-accent/10 rounded-xl p-4">
      <h3 className="font-heading text-lg mb-3">Points forts</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {highlights.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2 text-sm">
            <span className="text-accent">
              {item.icon || <CheckIcon className="h-4 w-4" />}
            </span>
            <span className="text-primary-700">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
