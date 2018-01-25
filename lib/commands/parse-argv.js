import * as _ from 'lodash';
import yargs from 'yargs';

const YARGS_WRAP_WIDTH = 100;

function databaseArgv(commandYargs) {
  return commandYargs
    .describe('host', "The database's host.")
    .describe('port', "The database's port.")
    .describe('user', "The username used to connect to the database.")
    .describe('password', "The password used to connect to the database.")
    .describe('database', "The name of the database.")
    .demandOption([ 'host', 'port', 'user', 'password', 'database' ]);
}

function migrationsDirectoryArgv(commandYargs) {
  return commandYargs
    .describe('migrations-directory', "The directory that contains the migration files.")
    .demandOption([ 'migrations-directory' ]);
}

// let options = yargs
//   .command('down [timestamp]', ""
//     + "")
//   .command('all', "Runs all of the pending migrations.")
//   .command('list', "List out all the migrations")
//   })

export default function parseArgv() {
  return yargs
    .usage("Usage: $0 <command> [options...]\n\nTo see the available options for each command, run"
      + " '$0 <command> --help'.")
    .command(
      'up [timestamp]',
      "Runs an individual migration corresponding to the timestamp in the migration's file name."
        + " If no timestamp is provided, this command runs the next pending migration.",
      _.flow([ databaseArgv, migrationsDirectoryArgv ])
    )
    .command(
      'down [timestamp]',
      "Rolls back an individual migration corresponding to the timestamp in the migration's file"
        + " name. If no timestamp is provided, this command runs the next pending migration.",
      _.flow([ databaseArgv, migrationsDirectoryArgv ])
    )
    .command(
      'all',
      "Runs all of the pending migrations.",
      _.flow([ databaseArgv, migrationsDirectoryArgv ])
    )
    .command(
      'list',
      "Lists all of the completed and pending migrations.",
      _.flow([ databaseArgv, migrationsDirectoryArgv ])
    )
    .command(
      'generate <name>',
      'Create a new pair of SQL migration files using the provided migration name.'
    )
    .demandCommand(1, 'You must provide a command.')
    .wrap(YARGS_WRAP_WIDTH)
    .argv;
}
