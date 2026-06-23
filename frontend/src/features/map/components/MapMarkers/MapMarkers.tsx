'use client';

import { Marker, Popup } from 'react-map-gl/maplibre';
import { PropertyMapItem } from '../../types';
import { useMapStore } from '../../stores/map.store';
import { formatPrice } from '@/shared/lib/formatters/currency.formatter';

interface MapMarkersProps {
  properties: PropertyMapItem[];
}

export const MapMarkers: React.FC<MapMarkersProps> = ({ properties }) => {
  const selectedId = useMapStore(s => s.selectedPropertyId);
  const setSelectedId = useMapStore(s => s.setSelectedPropertyId);

  return (
    <>
      {properties.map(property => (
        <Marker
          key={property.id}
          longitude={property.location.geoPoint.longitude}
          latitude={property.location.geoPoint.latitude}
          onClick={e => {
            e.originalEvent.stopPropagation();
            setSelectedId(property.id);
          }}
        >
          <div className="bg-accent text-primary-900 px-2 py-1 rounded-full text-xs font-bold shadow-md cursor-pointer hover:scale-110 transition-transform">
            {formatPrice(property.price)} {property.currency}
          </div>
        </Marker>
      ))}

      {selectedId && (
        <Popup
          longitude={properties.find(p => p.id === selectedId)?.location.geoPoint.longitude || 0}
          latitude={properties.find(p => p.id === selectedId)?.location.geoPoint.latitude || 0}
          onClose={() => setSelectedId(null)}
          closeButton={true}
          closeOnClick={false}
          anchor="top"
        >
          <div className="p-2 max-w-xs">{properties.find(p => p.id === selectedId)?.title}</div>
        </Popup>
      )}
    </>
  );
};
