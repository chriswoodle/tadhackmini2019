import { createClient, GoogleMapsClient } from '@google/maps';

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
if (!GOOGLE_MAPS_API_KEY) throw new Error('Missing process.env.GOOGLE_MAPS_API_KEY!');

const client = createClient({ key: GOOGLE_MAPS_API_KEY });

export function geocodeAddress(address: string): Promise<google.maps.GeocoderResult[]> {
    const request: google.maps.GeocoderRequest = { address };

    return new Promise<google.maps.GeocoderResult[]>((resolve, reject) => {
        client.geocode(request, (error, response) => {
            if (error) {
                reject(error);
            }
            resolve(response.json.results);
        });
    });
}