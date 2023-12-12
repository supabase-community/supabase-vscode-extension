import * as cp from 'child_process';
import * as util from 'util';

export function execShell(cmd: string) {
  return new Promise<string | cp.ExecException>((resolve, reject) => {
    cp.exec(cmd, (err, out) => {
      if (err) {
        return reject(err);
      }
      return resolve(out);
    });
  });
}

export const exec = util.promisify(cp.exec);
