/**
 * tozan
 * https://github.com/paazmaya/tozan
 * Index filesystem by creating metadata database
 *
 * Copyright (c) Juga Paazmaya <paazmaya@yahoo.com> (https://paazmaya.fi)
 * Licensed under the MIT license
 */

const fs = require('fs'),
  path = require('path');

const sqlite3 = require('sqlite3');

const BEGIN_DOT = /^\./;
const DEFAULT_DATABASE = ':memory:';

/**
 * Create and initialise SQLite database and tables, which by default is in memory.
 *
 * @param  {string} location Where shall the database be stored, defauts to ':memory:'
 * @returns {sqlite3.Database} Database instance
 * @see http://sqlite.org/lang_createtable.html
 */
const createDatabase = (location) => {
  location = location || DEFAULT_DATABASE;
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
 * List all files under the given directory.
 *
 * @param {string} directory  Root directory in which images should be
 * @param {object} options    Options that are all boolean values and false by default
 * @param {boolean} options.ignoreDotFiles Ignore files and directories that begin with a dot
 *
 * @returns {Array} List of files
 */
const readFiles = (directory, options) => {
  let items = fs.readdirSync(directory);

  if (options.ignoreDotFiles) {
    items = items.filter((item) => {
      return !BEGIN_DOT.test(item);
    });
  }

  items = items.map((item) => {
    return path.join(directory, item);
  });

  let files = [];

  items.forEach((item) => {
    const stat = fs.statSync(item);
    if (stat.isDirectory()) {
      files = files.concat(readFiles(item, options));
    }
    else if (stat.isFile()) {
      files.push(item);
    }
  });

  return files;
};

/**
 * @param {string} directory  Root directory in which images should be
 * @param {object} options    Options that are all boolean values and false by default
 * @param {boolean} options.verbose Print out which file is being processed
 * @param {boolean} options.dryRun  Do not touch files, just show what would happen
 * @param {string} options.database Possible database file to be used with SQLite
 * @param {boolean} options.ignoreDotFiles Ignore files and directories that begin with a dot
 *
 * @returns {void}
 */
module.exports = function (directory, options) {
  const db = createDatabase(options.database);

  const files = readFiles(directory, options);

  console.dir(files);
};

module.exports.DEFAULT_DATABASE = DEFAULT_DATABASE;
