import * as maps from '@google/maps';

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
if (!GOOGLE_MAPS_API_KEY) throw new Error('Missing process.env.GOOGLE_MAPS_API_KEY!');

export interface Location {
    lat: number;
    long: number;
}

const client = maps.createClient({ key: GOOGLE_MAPS_API_KEY });

export function geocodeAddress(address: string) {
    const request: maps.GeocodingRequest = { address };

    return new Promise<maps.GeocodingResult[]>((resolve, reject) => {
        client.geocode(request, (error, response) => {
            if (error) {
                reject(error);
            }
            resolve(response.json.results);
        });
    });
}

const GOOGLE_MAPS_URL_REGEX = /https:\/\/www\.google\.com\/maps\/place\/(-?\d+\.\d+)\+(-?\d+\.\d+)/;
// Regex to match text message google maps location sent on iphone using google maps keyboard
// Example: https://www.google.com/maps/place/28.523254+-81.462899/?entry=im

/**
 * matchGoogleMapsURL('https://www.google.com/maps/place/28.523254+-81.462899/?entry=im'); =>
 * { lat: '28.523254', long: '-81.462899' }
 */
export function matchGoogleMapsURL(message: string) {
    const matches = message.match(GOOGLE_MAPS_URL_REGEX);
    if (!matches) return false;
    const lat: string = matches[1];
    const long: string = matches[2];
    if (!lat || !long) return false;
    return {
        lat: parseFloat(lat), long: parseFloat(long)
    };
}
