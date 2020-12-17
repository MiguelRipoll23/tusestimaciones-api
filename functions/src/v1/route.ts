import * as functions from 'firebase-functions';
import { badRequestJson } from '../utils/response-utils';
import { getRouteId, getStopsByRouteId } from '../utils/line-utils';

export const v1_route = functions.https.onRequest(async (req, res) => {
  const userStopId = req.query.stop_id;
  const userLineLabel = req.query.line;
  const userLineDestination = req.query.destination;

  // Check for required parameters
  if (typeof userStopId !== 'string') {
    badRequestJson(res);
    return;
  }

  // Check parameters type
  if (typeof userLineLabel !== 'string' || typeof userLineDestination !== 'string') {
    badRequestJson(res);
    return;
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

  // Route
  const routeId = getRouteId(stopId, userLineLabel);

  if (routeId === undefined) {
    functions.logger.error(`Route (${routeId}) not found.`);
  }

  // Stops
  const routeStops: any = getStopsByRouteId(userLineLabel, routeId);
  const results: string[] = [];

  for (const routeStop of routeStops) {
    results.push(routeStop[1]);
  }

  res.send(results);
});
