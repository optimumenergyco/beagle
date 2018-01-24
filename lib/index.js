import * as _ from 'lodash';
import yargs from 'yargs';

import generate from './generate';
import migrate from './migrate';

let options = yargs
  .usage('trek <command> [options]')
  .command('migrate', "Run any migrations that haven't been run on the database")
  .command('rollback', "Roll back the latest migration")
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
    migrate(databaseOptions);
    break;
  case "generate":
    generate(_.pick(options, [ 'name', 'migrationsDirectory' ]));
    break;
}
