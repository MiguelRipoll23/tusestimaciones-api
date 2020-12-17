import * as functions from 'firebase-functions';
import { badRequestJson } from '../utils/response-utils';
import { getRouteId, getStopsByRouteId } from '../utils/line-utils';
import { getLines } from '../utils/stop-utils';

export const v2_route = functions.https.onRequest(async (req, res) => {
 const userStopId = req.query.stop_id;
  const userLineLabel = req.query.line;
  const userLineDestination = req.query.destination;

  // Check required parameters
  if (userStopId === undefined) {
    badRequestJson(res);
    return;
  }

  if (userLineLabel === undefined || userLineDestination === undefined) {
    badRequestJson(res);
    return;
  }

  // Validate parameters
  let stopId = 0;

  if (typeof userStopId === 'string') {
    stopId = parseInt(userStopId);
  }
  else {
    badRequestJson(res);
    return;
  }

  if (typeof userLineLabel !== 'string') {
    badRequestJson(res);
    return;
  }

  if (userLineLabel.length > 3) {
    badRequestJson(res);
    return;
  }

  if (typeof userLineDestination !== 'string') {
    badRequestJson(res);
    return;
  }

  if (userLineDestination.length > 50) {
    badRequestJson(res);
    return;
  }

  // Route
  const routeId = getRouteId(stopId, userLineLabel);

  if (routeId === undefined) {
    functions.logger.error(`Route (${routeId}) not found.`);
  }
  else {
    functions.logger.info(`Route (${routeId}) found.`);
  }

  // Stops
  const results: any = getStopsByRouteId(userLineLabel, routeId);

  // Stop lines
  for (let i = results.length - 1; i >= 0; i--) {
    const lineStopId = getLines(results[i][0]);
    results[i].push(lineStopId);
  }

  res.send(results);
});
