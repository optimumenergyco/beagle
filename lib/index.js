import * as _ from 'lodash';
import yargs from 'yargs';

import migrate from './migrate';

let options = yargs
  .usage('trek <command> [options]')
  .command('migrate', "Run any migrations that haven't been run on the database")
  .command('rollback', "Roll back the latest migration")
  .describe('host', "The database's host")
  .describe('port', "The database's port")
  .describe('user', "The username used to connect to the database")
  .describe('password', "The password used to connect to the database")
  .describe('database', "The name of the database")
  .describe('migrations', "The directory that contains the migration files")
  .demandCommand(1, 'You must provide a command.')
  .demandOption([
    'host',
    'port',
    'user',
    'password',
    'database',
    'migrations'
  ])
  .argv;

let command = options._[0];
let databaseOptions = _.pick(options, [ 'host', 'port', 'user', 'password', 'database' ]);

switch (command) {
  case "migrate":
    migrate(databaseOptions);
    break;
}
