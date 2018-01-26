import * as _ from 'lodash';

export function pendingMigrations(migrations, completedTimestamps) {
  return _.chain(migrations)
    .filter({ direction: 'up' })
    .reject(({ timestamp }) => _.includes(completedTimestamps, timestamp))
    .sortBy('timestamp')
    .value();
}

export function completedMigrations(migrations, completedTimestamps) {
  return _.chain(migrations)
    .filter({ direction: 'down' })
    .filter(({ timestamp }) => _.includes(completedTimestamps, timestamp))
    .sortBy('timestamp')
    .value();
}

export function nextPendingMigration(migrations, completedTimestamps) {
  return _.head(pendingMigrations(migrations, completedTimestamps));
}

export function lastCompletedMigration(migrations, completedTimestamps) {
  return _.last(completedMigrations(migrations, completedTimestamps));
}

export function findPendingMigration(migrations, completedTimestamps, timestamp) {
  return _.find(pendingMigrations(migrations, { timestamp }));
}

export function findCompletedMigration(migrations, completedTimestamps, timestamp) {
  return _.find(completedMigrations(migrations, { timestamp }));
}

export function hasNextPendingMigration(migrations, completedTimestamps) {
  return !_.isNil(nextPendingMigration(migrations, completedTimestamps));
}
