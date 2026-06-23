export const MAPTILER_CONFIG = {
  apiKey: process.env.NEXT_PUBLIC_MAPTILER_API_KEY || 'YOUR_MAPTILER_API_KEY',
  mapStyle: 'https://api.maptiler.com/maps/streets-v2/style.json',
  geocodingUrl: 'https://api.maptiler.com/geocoding',
};
