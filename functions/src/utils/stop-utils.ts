import lines from '../json/lines.min.json';
import routeLines from '../json/routes-lines.min.json';

export const getLines = (stopId: number) => {
  if (stopId === 0) {
    return lines;
  }

  return Object.keys(routeLines[stopId]);
};

export const getDemoEstimations = (userLine: any) => {
  const results: any = [];

  for (const line of lines) {
    const item: any = [];

    item.push(line);
    item.push('DESTINO DE LA LÍNEA');
    item.push(Math.floor(Math.random() * (25 - 0 + 1)) + 0);
    item.push(Math.floor(Math.random() * (60 - 35 + 1)) + 35);

    results.push(item);

    if (userLine !== undefined) {
      break;
    }
  }

  return results;
};