import yargs from 'yargs';

yargs
  .usage('trek <command> [options]')
  .command('migrate', "Run any migrations that haven't been run on the database")
  .command('rollback', "Roll back the latest migration")
  .describe('host', "The database's host")
  .describe('port', "The database's port")
  .describe('user', "The username used to connect to the database")
  .describe('password', "The password used to connect to the database")
  .describe('name', "The name of the database")
  .describe('migrations', "The directory that contains the migration files")
  .demandOption([
    'host',
    'port',
    'user',
    'password',
    'name',
    'migrations'
  ])
  .argv;
