export interface GeoPoint {
  latitude: number;
  longitude: number;
}

export interface PropertyMapItem {
  id: string;
  title: string;
  price: number;
  currency: string;
  location: {
    address: string;
    city: string;
    geoPoint: GeoPoint;
  };
  images: string[];
  propertyType: string;
  transactionType: string;
}
