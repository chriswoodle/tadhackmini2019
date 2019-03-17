import * as request from 'request';

const OPENFDA_API_KEY = process.env.OPENFDA_API_KEY;
if (!OPENFDA_API_KEY) throw new Error('Missing process.env.OPENFDA_API_KEY');

import * as debug from 'debug';
const log = debug('app:fda');

export function getGeneralDrugName(drugName: string) {
    return new Promise<any>((resolve, reject) => {
        const options = {
            method: 'GET',
            url: 'https://api.fda.gov/drug/ndc.json',
            qs: {
                search: `brand_name:${drugName}`,
                limit: '1',
                api_key: OPENFDA_API_KEY
            }
        };

        request(options, (error, response, body) => {
            if (error) throw new Error(error);
            try {
                const b = JSON.parse(body);
                log(b.results);
                return resolve(b);
            } catch (e) {
                console.warn(e);
            }
            log(body);
        });
    });
}