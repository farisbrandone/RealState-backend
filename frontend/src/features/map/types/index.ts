export interface GeoPoint {
  lat: number;
  lon: number;
}

export interface PropertyMapItem {
  id: string;
  title: string;
  price: number;
  currency: string;
  location: {
    address: string;
    city: string;
    country: string;
    neighborhood?: string;
    geoPoint: GeoPoint;
  };
  images: string[];
  propertyType: string;
  transactionType: string;
}
