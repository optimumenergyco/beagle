import * as _ from 'lodash';
import path from 'path';

import { touchp } from './file';

function migrationName(directory, name, direction) {
  name = _.kebabCase(name);

  let timestamp = new Date()
    .toISOString()
    .replace(/\..+/, "")
    .replace(/\D/g, "");

  return path.join(directory, `${ timestamp }-${ name }-${ direction }.sql`);
}

export default async function generate({ name, migrationsDirectory }) {
  await touchp(migrationName(migrationsDirectory, name, "up"));
  await touchp(migrationName(migrationsDirectory, name, "down"));
}
