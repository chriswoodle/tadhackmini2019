import * as request from 'request';

import * as debug from 'debug';
const log = debug('app:sender');

const APIDAZE_API_KEY = process.env.APIDAZE_API_KEY;
// if (!APIDAZE_API_KEY) throw new Error('Missing process.env.APIDAZE_API_KEY!');

const APIDAZE_FROM_NUMBER = process.env.APIDAZE_FROM_NUMBER;
// if (!APIDAZE_FROM_NUMBER) throw new Error('Missing process.env.APIDAZE_FROM_NUMBER!');

export function sendApidazeSMS(message: string, number: string) {
    log(`APIDAZE sending "${message}" to "${number}"`)
    return new Promise((resolve, reject) => {
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

const TELESIGN_API_KEY = process.env.TELESIGN_API_KEY;
if (!TELESIGN_API_KEY) throw new Error('Missing process.env.TELESIGN_API_KEY!');

export function sendTelesignSMS(message: string, number: string) {
    log(`telesign sending "${message}" to "${number}"`)
    return new Promise((resolve, reject) => {

        const options = {
            method: 'POST',
            url: 'https://rest-api.telesign.com/v1/messaging',
            headers:
            {
                authorization: `Basic ${TELESIGN_API_KEY}`,
                'content-type': 'application/x-www-form-urlencoded'
            },
            form:
            {
                message: message,
                message_type: 'ARN',
                phone_number: number
            }
        };

        request(options, function (error, response, body) {
            if (error) throw new Error(error);
            console.log(body);
            return resolve(body);
        });
    })
}

const FLOWROUTE_API_KEY = process.env.FLOWROUTE_API_KEY;
if (!FLOWROUTE_API_KEY) throw new Error('Missing process.env.FLOWROUTE_API_KEY!');
const FLOWROUTE_FROM_NUMBER = process.env.FLOWROUTE_FROM_NUMBER;
if (!FLOWROUTE_FROM_NUMBER) throw new Error('Missing process.env.FLOWROUTE_FROM_NUMBER!');

export function sendFlowrouteSMS(message: string, number: string) {
    log(`flowroute sending "${message}" to "${number}"`)
    return new Promise((resolve, reject) => {
        const options = {
            method: 'POST',
            url: 'https://api.flowroute.com/v2.1/messages',
            headers:
            {
                Authorization: `Basic ${FLOWROUTE_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: { to: number, from: FLOWROUTE_FROM_NUMBER, body: message },
            json: true
        };

        request(options, function (error, response, body) {
            if (error) throw new Error(error);
            console.log(body);
            return resolve(body);
        });

    })
}