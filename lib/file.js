import fs from 'fs';
import makeDirectory from 'mkdirp';
import { dirname } from 'path';

export function touch(path) {
  return new Promise((resolve, reject) => {
    fs.open(path, 'a+', (error) => {
      if (error) {
        return reject(error);
      }
      resolve();
    });
  });
}

export function mkdirp(path) {
  return new Promise((resolve, reject) => {
    makeDirectory(path, (error) => {
      if (error) {
        return reject(error);
      }
      resolve();
    });
  });
}

export async function touchp(path) {
  await mkdirp(dirname(path));
  await touch(path);
}
