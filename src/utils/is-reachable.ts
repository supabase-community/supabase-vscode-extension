import * as http from 'http';

export const isReachable = (
  url: string
): Promise<{ status: string; data: http.IncomingMessage | NodeJS.ErrnoException }> => {
  return new Promise((resolve, reject) => {
    http
      .get(url, function (res) {
        resolve({ status: 'success', data: res });
      })
      .on('error', function (e) {
        reject({ status: 'failure', data: e });
      });
  });
};
