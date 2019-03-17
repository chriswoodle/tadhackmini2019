import * as path from 'path';
import * as maps from './maps';
import * as child from './child';
import * as sender from './sender';

export enum SMSSourceType {
    APIDaze = 'apidaze',
    TeleSign = 'telesign',
    Flowroute = 'flowroute'
}

enum ClassificationMessageTypes {
    FindNearest = '1',
    Navigate = '2',
    Medicine = '3',
    Translate = '4',
    WhatIsThisImahe = '5',
    News = '6',
    Help = '7',
    Hello = '8',
    Stop = '9',
}

interface Location {
    lat: number;
    long: number;
}

interface Cache {
    [number: string]: {
        location?: Location
    }
}

// Cache of current sessions, keyed by phone number
const cache: Cache = {};

export function sms(message: string, number: string, sourceType: SMSSourceType) {
    return Promise.resolve()
        .then(() => {
            // First, classify the inbound message
            return child.exec(path.resolve(__dirname, '../scripts'), 'python3', 'get_translation.py', 'hola', 'English', process.env.GOOGLE_TRANSLATE_KEY as any)
        })
        .then(() => {

        })
        .then(() => {
            if (!cache[number]) {
                // new session
                cache[number] = {};
            }
        })
        .then(() => {
            // existing session
            const location = maps.matchGoogleMapsURL(message)
            if (location) {
                console.log(location);
                return Promise.resolve();
            }
        })
        .then(() => {
            return Promise.resolve('Ok, got your message');
        })
        .then((message: string) => {
            // Route message back to reciever number
            switch (sourceType) {
                case SMSSourceType.APIDaze:
                    return sender.sendApidazeSMS(message, number).then(()=> {
                        return Promise.resolve();
                    })
                    break;
                case SMSSourceType.Flowroute:
                    return Promise.resolve();
                    break;
                case SMSSourceType.TeleSign:
                    return Promise.resolve();
                    break;
                default:
                    return Promise.resolve();
            }
        }) 
        .then(() => {
            return Promise.resolve('complete');
        })
}

