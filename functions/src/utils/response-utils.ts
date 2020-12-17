import * as functions from 'firebase-functions';

export function badRequestJson(res: functions.Response<any>) {
  const response = {
    'error': 'Bad request'
  };

  res.status(400).json(response);
};

export function serviceUnavailableJson(res: functions.Response<any>) {
  const response = {
    'error': 'Service unavailable'
  };

  res.status(503).json(response);
};

export function internalServerErrorJson(res:  functions.Response<any>) {
  const response = {
    'error': 'Internal server error'
  };

  res.status(500).json(response);
};
