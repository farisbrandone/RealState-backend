import { PropertyDetail } from '@/features/property-details/types';

export interface PropertyFormValues {
  title: string;
  description: string;
  address: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
    coordinates?: { latitude: number; longitude: number };
    additionalInfo?: string;
  };
  features: PropertyDetail['features'];
  listing: {
    type: 'sale' | 'rent';
    price: { amount: number; currency: string };
    monthlyRent?: { amount: number; currency: string };
    charges?: { amount: number; currency: string };
    availabilityDate?: string;
  };
  media?: File[];
}
