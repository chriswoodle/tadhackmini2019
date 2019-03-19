import * as maps from '@google/maps';
import * as request from 'request';

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
if (!GOOGLE_MAPS_API_KEY) throw new Error('Missing process.env.GOOGLE_MAPS_API_KEY!');

export interface Location {
    lat: number;
    long: number;
}

const client = maps.createClient({ key: GOOGLE_MAPS_API_KEY });

export function geocodeAddress(address: string) {
    const request: maps.GeocodingRequest = { address };

    return new Promise<maps.LatLngLiteral[]>((resolve, reject) => {
        client.geocode(request, (error, response) => {
            if (error) {
                reject(error);
            }
            resolve(response.json.results.map(result => result.geometry.location));
        });
    });
}

export function addressFromPlaceID(response: Partial<maps.PlaceSearchResult>) {
    const placeRequest: maps.PlaceDetailsRequest = { placeid: response.place_id as string }

    return Promise.resolve()
        .then(() => {
            return new Promise<string>((resolve, reject) => {
                client.place(placeRequest, (error, response) => {
                    if (error) {
                        reject(error);
                    }

                    resolve(response.json.result.formatted_address);
                })
            })
        })

}

export function placeIDFromQuery(query: string,location: Location) {
    const request: maps.FindPlaceRequest = { input: query, inputtype: 'textquery', locationbias: `circle:5000@${location.lat},${location.long}` };

    return new Promise<Partial<maps.PlaceSearchResult>>((resolve, reject) => {
        client.findPlace(request, (error, response) => {
            if (error) {
                reject(error);
            }
            resolve(response.json.candidates[0]);
        });
    });
}


export function getAddressFromQuery(query: string, location: Location) {

    return Promise.resolve()
        .then(() => {
            return placeIDFromQuery(query, location);
        })
        .then((place_id) => {
            return addressFromPlaceID(place_id);
        })
        .then((place) => {
            return Promise.resolve(place);
        })
}

export type latLong = {
    lat: number;
    long: number;
};

export type nearbyPlace = {
    name: string;
    rating: number;
    address: string;
    isOpen: boolean;
}


export function getNearby(location: any, query:string) {

    const radiusInMeters: number = 5000;

    const queryableLatLong: maps.LatLngArray = [location.lat, location.long];

    const request: maps.PlacesNearbyRequest = { location: queryableLatLong, radius: radiusInMeters, keyword: query };

    return new Promise<nearbyPlace[]>((resolve, reject) => {
        client.placesNearby(request, (error, response) => {
            if (error) {
                reject(error);
            }

            let places = [] as nearbyPlace[];
            response.json.results.forEach((result) => {
                const place: nearbyPlace = {
                    address: result.vicinity as any,
                    rating: result.rating,
                    name: result.name,
                    isOpen: result.opening_hours.open_now
                };
                places.push(place);
                return place;
            })

            // resolve(response.json.results);
            resolve(places);
        })
    })
}

export function directionsFromCoords(origin: latLong, dest: maps.LatLngLiteral[], transportMode: maps.TravelMode) {
    // only use the first coords returned for destination
    const coordOrigin: maps.LatLng = [origin['lat'], origin['long']] as maps.LatLng
    const request: maps.DirectionsRequest = { origin: coordOrigin, destination: dest[0], mode: transportMode };

    return new Promise<maps.DirectionsResponse>((resolve, reject) => {
        client.directions(request, (error, response) => {
            if (error) {
                reject(error);
            }

            resolve(response.json);
        })
    })
}

export function directionsFromAddress(address: string, transportMode: maps.TravelMode, location: any) {
    return Promise.resolve()
        .then(() => {
            return geocodeAddress(address);
        })
        .then((coords) => {
            return directionsFromCoords(location, coords, transportMode);
        })
        .then((directions) => {
            return Promise.resolve(directions);
        })
}


export function directionsFromQuery(location: any, query: string, mode: string, loc: Location) {
    const transportMode: maps.TravelMode = mode as maps.TravelMode;

    return Promise.resolve()
        .then(() => {
            return getAddressFromQuery(query, loc);
        })
        .then((address) => {
            return directionsFromAddress(address, transportMode, location);
        })
        .then((directions) => {
            return Promise.resolve(directions);
        })
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

const HERE_MAPS_APP_ID = process.env.HERE_MAPS_APP_ID;
if (!HERE_MAPS_APP_ID) throw new Error('Missing process.env.HERE_MAPS_APP_ID!');

const HERE_MAPS_APP_CODE = process.env.HERE_MAPS_APP_CODE;
if (!HERE_MAPS_APP_CODE) throw new Error('Missing process.env.HERE_MAPS_APP_CODE!');

export function nearbyTransit(location:string) {

    return new Promise<any>((resolve, reject) => {


        var options = {
            method: 'GET',
            url: 'https://transit.api.here.com/v3/stations/by_geocoord.json',
            qs:
            {
                app_id: HERE_MAPS_APP_ID,
                app_code: HERE_MAPS_APP_CODE,
                center: location,
                radius: '10000'
            }
        };

        request(options, function (error, response, body) {
            if (error) throw new Error(error);

            let result: any;
            try {
                result = JSON.parse(body)
            }
            catch (e) {
                console.log(e);
                throw new Error(e);
            }

            console.log(result.Res.Stations);
            return resolve(result.Res.Stations);
        });
    })
}

export type Station = {
    address: string,
    stationName: string,
    distanceFromUser: string,
    connectingLines: any[]
}

export type StationSentence = {
    output: string
}

export function nearbyTransitFormatted(location:string) {
    return Promise.resolve()
        .then(() => {
            return nearbyTransit(location);
        })
        .then((stations)=> {
            const formattedStations:Station[] = [];
            stations.Stn.forEach( (elm: any) => {
                if(elm.street == undefined) {
                    elm.street = ""
                }
                if(elm.city == undefined) {
                    elm.city = ""
                }
                if(elm.state == undefined) {
                    elm.state = ""
                }
                formattedStations.push({
                    address: elm.number+" "+elm.street+" "+elm.city+" "+elm.state,
                    stationName: elm.name,
                    distanceFromUser: elm.distance+" meters away",
                    connectingLines: elm.Transports.Transport
                })
            })

            const sentences: StationSentence[] = [];

            formattedStations.forEach(station => {
                var connections: string = "";
                console.log(station.connectingLines)
                connections = station.connectingLines.map(item => item.dir).join(" \n")
                const stationSentence: StationSentence = {
                    output:"Station Name: "+station.stationName+" \nStation Address: "+station.address+" \nDistance: "+station.distanceFromUser+" \nConnecting Lines: "+connections
                }

                sentences.push(stationSentence);
                
            })

            return Promise.resolve(sentences);
        })
}
