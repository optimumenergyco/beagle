import * as _ from 'lodash';
import { connect } from './database-connect';

import {
  isSetUp,
  setUp,
  completedTimestamps,
  migrateUp,
  migrateDown
} from './database-queries';

export default class DatabaseClient {

  constructor(connectionOptions) {
    this.connectionOptions = connectionOptions;
  }

  async isSetUp() {
    return await connect(this.connectionOptions, isSetUp);
  }

  async setUp() {
    return await connect(this.connectionOptions, setUp);
  }

  async completedTimestamps() {
    return await connect(this.connectionOptions, completedTimestamps);
  }

  async migrateUp(migration) {
    return await connect(this.connectionOptions, _.partialRight(migrateUp, migration));
  }

  async migrateDown(migration) {
    return await connect(this.connectionOptions, _.partialRight(migrateDown, migration));
  }
}
