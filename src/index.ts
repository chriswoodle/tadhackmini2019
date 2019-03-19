import 'source-map-support/register'
import * as http from 'http';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as morgan from 'morgan';
import * as cors from 'cors';

import * as handler from './handler';

import * as debug from 'debug';

const log = debug('app:server');

const PORT = process.env.PORT || 3000;

log(`Server starting on port: ${PORT}`);

const app = express();
const server = http.createServer(app);
server.listen(PORT, () => {
    console.log('**ready**');
});

app.use(cors());

app.use(bodyParser.json());

app.use(morgan('tiny'));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post('/flowroute', (req, res) => {
    // Recieve sms from flowroute
    const message = req.body.data.attributes.body;
    const number = req.body.data.attributes.from;
    log('/flowroute', message, number);
    handler.sms(message, number, handler.SMSSourceType.Flowroute);
    res.send('ok');
});

app.post('/flowroute-mms', (req, res) => {
    console.log(req.body)
    console.log(req.body.included[0])
    console.log(req.body.included[0])
    const message = req.body.data.attributes.body;
    const number = req.body.data.attributes.from;
    const url = req.body.included[0].attributes.url;
    const imageUrl = url.substring(0, url.indexOf("?") + 1);
    log('/flowroute-mms', message, number, imageUrl);

    handler.mms(message, number, handler.SMSSourceType.Flowroute, imageUrl);
    res.send('ok');
});
/**
 * Sample: 
 * { status: 
   { updated_on: '2019-03-17T16:14:33.001105Z',
     code: 1500,
     description: 'Delivered to customer' },
  submit_timestamp: '2019-03-17T16:14:32.857000Z',
  errors: [],
  user_response: 
   { phone_number: '13218775974',
     iso_country_code: 'US',
     sender_id: '17192126202',
     mo_message: 'Hello from team zero' },
  sub_resource: 'mo_sms',
  reference_id: '65A631BBA6640704912112CEE9F238B8' }
   */
app.post('/telesign', (req, res) => {
    if (req.body.status.code == 1500) {
        console.log(req.body)
        const message = req.body.user_response.mo_message;
        const number = req.body.user_response.phone_number;
        log('/telesign', message, number);
        handler.sms(message, number, handler.SMSSourceType.TeleSign);
        res.send('ok');
    }
    if (req.body.status.code == 200) {
        log('/telesign', req.body.status.description);
    }
});

app.post('/telesign-voice', (req, res) => {
    console.log(req.body)

    // log('/telesign', message, number);

    res.send('ok');
});

app.post('/apidaze', (req, res) => {
    const message = req.body.text;
    const number = req.body.caller_id_number;
    log('/apidaze', message, number);
    handler.sms(message, number, handler.SMSSourceType.APIDaze);
    res.send('ok');
});

// Endpoints for IVR
app.get('/1', (req,res) => {
    handler.sms('What is the nearest pharmacy', '16318973828', handler.SMSSourceType.TeleSign);
    res.send('ok');
});

app.get('/2', (req,res) => {
    handler.sms('What is the nearest restaurant', '16318973828', handler.SMSSourceType.TeleSign);
    res.send('ok');
});

app.get('/3', (req,res) => {
    handler.sms('What is the nearest transit station', '16318973828', handler.SMSSourceType.TeleSign);
    res.send('ok');
});

app.get('/4', (req,res) => {
    handler.sms('What is the nearest restroom', '16318973828', handler.SMSSourceType.TeleSign);
    res.send('ok');
});

app.get('/5', (req,res) => {
    handler.sms('What is the nearest hotel', '16318973828', handler.SMSSourceType.TeleSign);
    res.send('ok');
});

app.get('/6', (req,res) => {
    handler.sms('What is the nearest gas station', '16318973828', handler.SMSSourceType.TeleSign);
    res.send('ok');
});

app.get('/7', (req,res) => {
    handler.sms('What is the nearest police station', '16318973828', handler.SMSSourceType.TeleSign);
    res.send('ok');
});

app.get('/other', (req,res) => {
    handler.sms('hello', '16318973828', handler.SMSSourceType.TeleSign);
    res.send('ok');
});


