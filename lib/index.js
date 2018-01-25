import * as _ from 'lodash';
import yargs from 'yargs';

import { generateMigrations } from './migrations/files';
import migrate from './commands/migrate';
import rollback from './commands/rollback';
import list from './commands/list';

// FIXME: This will eventually become the default behavior in Node.js. When that happens, the line
// below can be removed.
process.on('unhandledRejection', error => { throw error; });

let options = yargs
  .usage('trek <command> [options]')
  .command('migrate', "Run any migrations that haven't been run on the database")
  .command('rollback', "Rollback the latest migration")
  .command('list', "List out all the migrations")
  .command('generate <name>', "Create a new set of migration SQL files")
  .describe('host', "The database's host")
  .describe('port', "The database's port")
  .describe('user', "The username used to connect to the database")
  .describe('password', "The password used to connect to the database")
  .describe('database', "The name of the database")
  .describe('migrations-directory', "The directory that contains the migration files")
  .demandCommand(1, 'You must provide a command.')
  .demandOption([
    'host',
    'port',
    'user',
    'password',
    'database',
    'migrations-directory'
  ])
  .argv;

let command = options._[0];
let databaseOptions = _.pick(options, [ 'host', 'port', 'user', 'password', 'database' ]);

switch (command) {
  case "migrate":
    migrate(databaseOptions, options.migrationsDirectory);
    break;
  case "rollback":
    rollback(databaseOptions, options.migrationsDirectory);
    break;
  case "generate":
    generateMigrations(options.name, options.migrationsDirectory);
    break;
  case "list":
    list(databaseOptions, options.migrationsDirectory);
    break;
}
