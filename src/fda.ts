import * as request from 'request';

const OPENFDA_API_KEY = process.env.OPENFDA_API_KEY;
if (!OPENFDA_API_KEY) throw new Error('Missing process.env.OPENFDA_API_KEY');

export function getGeneralDrugName(drugName: string) {
    const options = {
        method: 'GET',
        url: 'https://api.fda.gov/drug/ndc.json',
        qs: {
            search: `brand_name:${drugName}`,
            limit: '1',
            api_key: OPENFDA_API_KEY
        }
    };

    return request(options, (error, response, body) => {
        if (error) throw new Error(error);

        console.log(body);
    });
}