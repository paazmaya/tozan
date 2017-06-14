/**
 * tozan
 * https://github.com/paazmaya/tozan
 * Index filesystem by creating metadata database, focusing on media files
 *
 * Copyright (c) Juga Paazmaya <paazmaya@yahoo.com> (https://paazmaya.fi)
 * Licensed under the MIT license
 */

const sqlite3 = require('sqlite3');

/**
 * Create and initialise SQLite database and tables, which by default is in memory.
 *
 * @param  {string} location Where shall the database be stored, defauts to ':memory:'
 * @returns {sqlite3.Database} Database instance
 * @see http://sqlite.org/lang_createtable.html
 */
const createDatabase = (location) => {
  location = location || ':memory:';
  const db = new sqlite3.Database(location, (error) => {
    if (error) {
      console.error('Database opening/creation failed');
      console.error(error);
      process.exit(1);
    }
  });

  // Create tables that are needed. Alphaletically ordered keys after primary key and sha256
  db.serialize(() => {
    // https://www.sqlite.org/withoutrowid.html
    db.run(`
      CREATE TABLE IF NOT EXISTS files (
        filepath TEXT PRIMARY KEY,
        sha256 TEXT,
        filesize REAL,
        timestamp REAL
      ) WITHOUT ROWID
    `);
  });

  return db;
};

/**
 * @param {string} directory  Root directory in which images should be
 * @param {object} options    Options that are all boolean values and false by default
 * @param {boolean} options.verbose Print out which file is being processed
 * @param {boolean} options.dryRun  Do not touch files, just show what would happen
 * @param {string} options.database Possible database file to be used with SQLite
 *
 * @returns {void}
 */
module.exports = function (directory, options) {
  const db = createDatabase(options.database);
};
