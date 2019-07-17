/**
 * tozan
 * https://github.com/paazmaya/tozan
 * Index filesystem by creating metadata database
 *
 * Copyright (c) Juga Paazmaya <paazmaya@yahoo.com> (https://paazmaya.fi)
 * Licensed under the MIT license
 */

const Better3 = require('better-sqlite3');

const constants = require('./constants');

/**
 * Migrate pre 3.0.0 database table, by first checking if it is needed.
 *
 * @param {sqlite3.Database} db Database instance
 * @returns {boolean} True when migration was needed
 * @see https://www.sqlite.org/lang_altertable.html
 */
const migrateDatabase = (db) => {
  // https://www.sqlite.org/pragma.html#pragma_table_info
  const info = db.pragma('table_info(files)');

  const isLegacy = info.some((item) => item.name === 'sha256');
  if (isLegacy) {
    db.exec('ALTER TABLE files RENAME COLUMN sha256 TO hash');
  }

  return isLegacy;
};

/**
 * Create and initialise SQLite database and tables, which by default is in memory.
 *
 * @param  {string} location Where shall the database be stored, defauts to ':memory:'
 * @returns {sqlite3.Database} Database instance
 * @see http://sqlite.org/lang_createtable.html
 */
const createDatabase = (location) => {
  location = location || constants.DEFAULT_DATABASE;

  const opts = {
    memory: false
  };

  if (location === constants.DEFAULT_DATABASE) {
    location = 'in-memory';
    opts.memory = true;
  }

  const db = new Better3(location, opts);

  // See if there is the table already with older column name
  if (migrateDatabase(db)) {
    console.log('Database table column name migrated from "sha256" to "hash"');
  }

  // Create tables that are needed.
  db.exec(constants.CREATE_TABLE);

  return db;
};

module.exports = createDatabase;

// For testing purposes
module.exports._migrateDatabase = migrateDatabase;
