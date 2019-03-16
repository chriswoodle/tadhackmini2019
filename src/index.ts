import 'source-map-support/register'
import * as http from 'http';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as morgan from 'morgan';
import * as cors from 'cors';

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