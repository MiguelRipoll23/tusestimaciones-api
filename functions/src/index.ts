import * as functions from 'firebase-functions';
import express from 'express';

import { v2_estimations } from './v2/estimations';
import { v2_route } from './v2/route';

const cors = require('cors');
const app = express();

const corsOptions = {
  allowedHeaders: 'x-version'
}

app.use(cors(corsOptions));
app.options('*', cors(corsOptions))

app.get('/', (req, res) => {
  res.send('');
});

// V2
app.get('/v2/estimations', v2_estimations);
app.get('/v2/route', v2_route);

exports.api = functions.region('europe-west2').https.onRequest(app);