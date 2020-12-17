import routeLines from '../json/routes-lines.min.json';
import routeStops from '../json/routes-stops.min.json';

export const getRouteId = (stopId: number, lineLabel: string) => {
  if ((stopId in routeLines) === false) {
    return null;
  }

  const stopRoutes = routeLines[stopId];

  if ((lineLabel in stopRoutes) === false) {
    return null;
  }

  return stopRoutes[lineLabel];
};

export const getRoutesByLineLabel = (lineLabel: string) => {
  if ((lineLabel in routeStops) === false) {
    return null;
  }

  return routeStops[lineLabel];
}

export const getStopsByRouteId = (lineLabel: string, routeId: string) => {
  if (routeId === null) {
    return [];
  }

  if ((lineLabel in routeStops) === false) {
    return [];
  }

  const routesLine = routeStops[lineLabel];

  if ((routeId in routesLine) === false) {
    return [];
  }

  return routesLine[routeId];
}

export const getNextStops = (stopId: number, lineLabel: string) => {
  const results: any = [];

  let found = false;

  if (stopId === 0) {
    return [
      [-2, 'NOMBRE PARADA 1'],
      [-1, 'NOMBRE PARADA 2'],
      [0, 'NOMBRE PARADA 3'],
      [1, 'NOMBRE PARADA 4'],
    ];
  }

  const routeId = getRouteId(stopId, lineLabel);

  if (routeId === null) {
    return results;
  }

  const stops = getStopsByRouteId(lineLabel, routeId);

  if (stops === null) {
    return results;
  }

  for (const route of stops) {
    if (found) {
      results.push(route);

      if (results.length === 5) {
        break;
      }
    }
    else if (route[0] === stopId) {
      found = true;
    }
  }

  return results;
};