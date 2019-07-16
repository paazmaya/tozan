/**
 * tozan
 * https://github.com/paazmaya/tozan
 * Index filesystem by creating metadata database
 *
 * Copyright (c) Juga Paazmaya <paazmaya@yahoo.com> (https://paazmaya.fi)
 * Licensed under the MIT license
 */

const Better3 = require('better-sqlite3');

const OPENSSL_VERSION = 'openssl version';
const DEFAULT_DATABASE = ':memory:';
const DEFAULT_SHA = '256';
const ALLOWED_SHA = ['256', '384', '512'];

// https://www.sqlite.org/withoutrowid.html
const CREATE_TABLE = `
  CREATE TABLE IF NOT EXISTS files (
    filepath TEXT PRIMARY KEY ON CONFLICT REPLACE,
    hash TEXT,
    filesize INTEGER,
    modified INTEGER
  ) WITHOUT ROWID
`;

/**
 * Migrate pre 3.0.0 database table, by first checking if it is needed.
 *
 * @param {sqlite3.Database} db Database instance
 * @returns {void}
 * @see https://www.sqlite.org/lang_altertable.html
 */
const migrateDatabase = (db) => {
  // https://www.sqlite.org/pragma.html#pragma_table_info
  const info = db.pragma('table_info(files)');

  const isLegacy = info.some((item) => item.name === 'sha256');
  if (isLegacy) {
    db.exec('ALTER TABLE files RENAME COLUMN sha256 TO hash');
  }
};

/**
 * Create and initialise SQLite database and tables, which by default is in memory.
 *
 * @param  {string} location Where shall the database be stored, defauts to ':memory:'
 * @returns {sqlite3.Database} Database instance
 * @see http://sqlite.org/lang_createtable.html
 */
const createDatabase = (location) => {
  location = location || DEFAULT_DATABASE;

  const opts = {
    memory: false
  };

  if (location === DEFAULT_DATABASE) {
    location = 'in-memory';
    opts.memory = true;
  }

  const db = new Better3(location, opts);

  // See if there is the table already with older column name
  migrateDatabase(db);

  // Create tables that are needed.
  db.exec(CREATE_TABLE);

  return db;
};


module.exports.DEFAULT_DATABASE = DEFAULT_DATABASE;
module.exports.DEFAULT_SHA = DEFAULT_SHA;
module.exports.ALLOWED_SHA = ALLOWED_SHA;
module.exports.OPENSSL_VERSION = OPENSSL_VERSION;

module.exports = createDatabase;
