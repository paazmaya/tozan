/**
 * tozan
 * https://github.com/paazmaya/tozan
 * Index filesystem by creating metadata database
 *
 * Copyright (c) Juga Paazmaya <paazmaya@yahoo.com> (https://paazmaya.fi)
 * Licensed under the MIT license
 */

import Better3 from 'better-sqlite3';

import constants from './constants.js';

/**
 * Migrate pre 3.0.0 database table, by first checking if it is needed.
 * Exposed only for testing purposes.
 *
 * @param {sqlite3.Database} db Database instance
 * @returns {boolean} True when migration was needed
 * @see https://www.sqlite.org/lang_altertable.html
 */
export const migrateDatabase = (db) => {
  // https://www.sqlite.org/pragma.html#pragma_table_info
  const info = db.pragma('table_info(files)');

  const isLegacy = info.some((item) => item.name === 'sha256');
  if (isLegacy) {
    db.exec(constants.ALTER_TABLE);
  }

  return isLegacy;
};

/**
 * Create and initialise SQLite database and tables, which by default is in memory.
 *
 * @param {string} location Where shall the database be stored, defauts to ':memory:'
 * @param {string} structure Table structure as in CREATE TABLE
 * @returns {sqlite3.Database} Database instance
 * @see http://sqlite.org/lang_createtable.html
 */
const createDatabase = (location, structure) => {
  location = location || constants.DEFAULT_DATABASE;
  structure = structure || constants.CREATE_TABLE;

  const db = new Better3(location);

  // See if there is the table already with older column name
  if (migrateDatabase(db)) {
    console.log('Database table column name migrated from "sha256" to "hash"');
  }

  // Create tables that are needed.
  db.exec(structure);

  return db;
};

export default createDatabase;
