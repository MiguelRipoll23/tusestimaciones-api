import * as functions from 'firebase-functions';
import { badRequestJson } from '../utils/response-utils';
import { getDemoEstimations } from '../utils/stop-utils';

const fetch = require('node-fetch');
const convert = require('xml-js');

const URL_ESTIMATIONS = 'http://www.ayto-santander.es:9001/services/dinamica.asmx';

export const v1_estimations = functions.https.onRequest(async (req, res) => {
  const userStopId = req.query.stop_id;
  const userLineLabel = req.query.line;
  const userLineDestination = req.query.destination;

  // Check for required parameters
  if (typeof userStopId !== 'string') {
    badRequestJson(res);
    return;
  }

  // Check parameters type
  if (typeof userLineLabel === 'string' || typeof userLineDestination === 'string') {
    if (typeof userLineLabel !== 'string' || typeof userLineDestination !== 'string') {
      badRequestJson(res);
      return;
    }
  }

  // Validate parameters
  const stopId = parseInt(userStopId);

  if (isNaN(stopId)) {
    badRequestJson(res);
    return;
  }

  if (typeof userLineLabel === 'string' && userLineLabel.length > 3) {
    badRequestJson(res);
    return;
  }

  if (typeof userLineDestination === 'string' && userLineDestination.length > 50) {
    badRequestJson(res);
    return;
  }

  // Estimations
  let results: any[] = [];
  let estimations: any[] = [];

  if (stopId === 0) {
    estimations = getDemoEstimations(userLineLabel);
    results = [estimations];
    res.send(results);

    return;
  }

  let line = '*';

  if (typeof userLineLabel === 'string') {
    line = userLineLabel;
  }

  const body = '<?xml version="1.0" encoding="utf-8"?>' + 
    `<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
      <soap:Body>
        <GetPasoParada xmlns="http://tempuri.org/">
          <linea>${line}</linea>
          <parada>${stopId}</parada>
          <status>0</status>
        </GetPasoParada>
      </soap:Body>
    </soap:Envelope>`;

  const options = {
    'method': 'post',
    'headers': {
      'Content-Type': 'text/xml; charset=utf-8',
      'SOAPAction': 'http://tempuri.org/GetPasoParada'
    },
    'body': body
  }

  await fetch(URL_ESTIMATIONS, options)
    .then((response: { ok: boolean; status: string; text: () => string; }) => {
      if (!response.ok) {
        throw new Error('Status code (' + response.status + ')');
      }

      return response.text();
    })
    .then((text: string) => {
      return convert.xml2json(text, {compact: true, spaces: 0});
    })
    .then((json: string) => {
      const data = JSON.parse(json);
      const soapBody = data['soap:Envelope']['soap:Body'];

      let list = soapBody.GetPasoParadaResponse.GetPasoParadaResult.PasoParada;

      // Check if empty
      if (list === undefined) {
        functions.logger.info('Response from external service is empty.');
        return;
      }

      // Check if not a list
      if (!Array.isArray(list)) {
        list = [list];
      }

      for (let i = list.length - 1; i >= 0; i--) {
        const item = list[i];

        const itemLine = item.linea._text;
        const itemDestination = item.ruta._text;
        const itemMinutes1 = parseInt(item.e1.minutos._text);
        const itemMinutes2 = parseInt(item.e2.minutos._text);

        const estimationItem = [
          itemLine,
          itemDestination,
          itemMinutes1,
          itemMinutes2
        ]

        estimations.push(estimationItem);
      }

      // Order by remaining time
      estimations = estimations.sort((a, b) => {
        if (a[2] === null) {
          return 1;
        }
        else if (b[2] === null) {
          return -1;
        }
        else if (a[2] > b[2]) {
          return 1;
        }
        else if (a[2] < b[2]) {
          return -1;
        }

        return 0;
      });

      results = estimations;
    })
    .catch((error: any) => {
      functions.logger.error('Error while fetching estimations data.', error);
    });
  
  res.send(results);
});
