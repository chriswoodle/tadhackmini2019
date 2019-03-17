import 'source-map-support/register'
import * as http from 'http';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as morgan from 'morgan';
import * as cors from 'cors';

import * as maps from './maps';
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
    maps.geocodeAddress('1600 Amphitheatre Parkway, Mountain View, CA').then(response => {
        log(response);
    });
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
    console.log(req.body.included)
    console.log(req.body.included[0])
    console.log(req.body.included[0])

    res.send('ok');
});

app.post('/telesign', (req, res) => {
    console.log(req.body)
    // log('/telesign', message, number);

    res.send('ok');
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