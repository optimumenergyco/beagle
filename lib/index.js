import * as _ from 'lodash';

import { generateMigrations } from './migrations/files';
import parseArgv from './commands/parse-argv';
import migrate from './commands/migrate';
import rollback from './commands/rollback';
import list from './commands/list';

// FIXME: This will eventually become the default behavior in Node.js. When that happens, the line
// below can be removed.
process.on('unhandledRejection', error => { throw error; });

let options = parseArgv();
let command = options._[0];
let databaseOptions = _.pick(options, [ 'host', 'port', 'user', 'password', 'database' ]);
let { name, migrationsDirectory } = options;

switch (command) {
  case "up":
    migrate(databaseOptions, migrationsDirectory);
    break;
  case "down":
    rollback(databaseOptions, migrationsDirectory);
    break;
  case "generate":
    generateMigrations(name, migrationsDirectory);
    break;
  case "list":
    list(databaseOptions, migrationsDirectory);
    break;
}
