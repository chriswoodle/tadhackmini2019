import * as request from 'request';

import * as debug from 'debug';
const log = debug('app:sender');

const APIDAZE_API_KEY = process.env.APIDAZE_API_KEY;
if (!APIDAZE_API_KEY) throw new Error('Missing process.env.APIDAZE_API_KEY!');

const APIDAZE_FROM_NUMBER = process.env.APIDAZE_FROM_NUMBER;
if (!APIDAZE_FROM_NUMBER) throw new Error('Missing process.env.APIDAZE_FROM_NUMBER!');

export function sendApidazeSMS(message: string, number: string) {
    log(`APIDAZE sending "${message}" to "${number}"` )
    return new Promise((resolve,reject) => {
        const options = {
            method: 'POST',
            url: 'https://api4.apidaze.io/dbee8f26/sms/send',
            qs:
            {
                api_secret: APIDAZE_API_KEY,
                from: APIDAZE_FROM_NUMBER,
                to: number,
                body: message
            }
        };
    
        request(options, function (error, response, body) {
            if (error) throw new Error(error);
            return resolve(body)
        });
    })
   
}


