# Beagle

Beagle is a simple, lightweight and friendly database migration tool.

## Why Beagle?

You might be wondering why we decided to create Beagle. Aren't there already a bunch of other
migration tools out there?

We set out to build Beagle to solve a few problems we felt weren't addressed by other tools:

* **Platform agnostic:** Many migration tools are designed to work with a specific programming
  language or framework. We feel like this is overly limiting. Beagle is written in JavaScript, but
  it can be used with any other platform or framework.
* **Plain SQL:** Other tools layer an ORM on top of the migrations platform. This usually results in
  a limited set of supported migration features that work for all databases, which is a bummer when
  you want to use a feature specific to your database. Beagle uses plain SQL files for its
  migrations, so you can use any database features you'd like.
* **Independent migrations:** Some migration tools only keep track of the *latest* migration. Let's
  say Karen creates a migration, and then a little later Juan adds a migration. If Juan's migration
  gets pushed to production and run first, in some systems Karen's migration will never run. Beagle
  keeps track of individual migrations, allowing you to merge at will.

## Current Gotchas

Beagle is a new project and is still under active development. There are currently a few caveats to
using it. In the future, these will be addressed.

* The only database currently supported is Postgres.
* Installation is only available via `yarn` or `npm`.
* Beagle doesn't include commands to create or drop a database. For now, we suggest you use the
  Postgres `createdb` and `dropdb` commands.
* There's currently no way to run a specific migration. Migrations must be run in order.

## Installation

Install Beagle using your favorite JavaScript package manager.

Yarn:

``` shell
yarn add @optimumenergyco/beagle
```

NPM:

``` shell
npm install --save @optimumenergyco/beagle
```

## The Commands

Beagle ships with a simple CLI.

* `beagle --help`: List out all of the available Beagle commands.
* `beagle <command> --help`: Get detailed instructions for a command.
* `beagle up`: Run the next pending migration.
* `beagle down`: Roll back the last completed migration.
* `beagle all`: Run all of the pending migrations.
* `beagle list`: List the pending and completed migrations.
* `beagle generate <name>`: Create a new timestamped migration file using the provided name.

### Database Configuration

Beagle supports two ways to configure the database connection.

Any commands that require a database connection can be configured with the following flags:

* `--host`: The database's host.
* `--port`: The database's port.
* `--user`: The username used to connect to the database.
* `--password`: The password used to connect to the database.
* `--database`: The name of the database.

Optionally, these parameters can be configured using environment variables.

* `BEAGLE_HOST`
* `BEAGLE_PORT`
* `BEAGLE_USER`
* `BEAGLE_PASSWORD`
* `BEAGLE_DATABASE`

## Example

Let's say you'd like to create a new table for your potatoes. Start by calling `generate` to create
your files.

``` shell
beagle generate create-potatoes
```

This creates two files:

* `20180819000000-create-potatoes-up.sql`
* `20180819000000-create-potatoes-down.sql`

You decide your `up` file will create a `potatoes` table and your `down` file will drop it.

`20180819000000-create-potatoes-up.sql`:

``` sql
CREATE TABLE potatoes (name NOT NULL);
```

`20180819000000-create-potatoes-down.sql`:

``` sql
DROP TABLE potatoes;
```

If you run `beagle list`, you'll see your migration under "Pending Migrations":

```
Completed Migrations:

N/A

Pending Migrations:

20180819000000-create-potatoes-up.sql
```

To run your migration, call `beagle up`. Afterwards, `beagle list` will show your migration under
"Completed Migrations":

```
Completed Migrations:

20180819000000-create-potatoes-up.sql

Pending Migrations:

N/A
```

## Deployment

Deployments of Beagle must be done *manually*. If we were to include our NPM credentials in
CodeShip, anyone could submit a pull request calling `console.log(process.env)` and have access.

To deploy Beagle:

``` shell
yarn version <version>
yarn publish --access=public
```

To push up the tags to GitHub:

``` shell
git push --tags origin master
git push origin master
```

## License

Beagle is licensed under the [MIT license](/license.md).
