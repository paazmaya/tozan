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

const sqlite3 = require('sqlite3'),
  hasha = require('hasha');

const BEGIN_DOT = /^\./;
const DEFAULT_DATABASE = ':memory:';
const ITERATION_SIZE = 100;

// https://www.sqlite.org/withoutrowid.html
const CREATE_TABLE = `
  CREATE TABLE IF NOT EXISTS files (
    filepath TEXT PRIMARY KEY ON CONFLICT REPLACE,
    sha256 TEXT,
    filesize REAL,
    modified REAL
  ) WITHOUT ROWID
`;
const COLUMNS_IN_TABLE = 4;

// Database data insertation query phrase
const questions = Array(COLUMNS_IN_TABLE).fill('?').join(', ');
const INSERT_DATA = `INSERT INTO files VALUES (${questions})`;

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

  // Create tables that are needed.
  db.serialize(() => {
    db.run(CREATE_TABLE);
  });

  return db;
};


/**
 * Generate and store the metadata for all the files in the list
 *
 * @param {array} list List of file meta data objects
 * @param {sqlite3.Database} db Database instance
 * @returns {sqlite3.Database|boolean} Database instance or false
 */
const storeData = (list, db) => {
  if (!(list instanceof Array) || list.length === 0) {
    return false;
  }

  const statement = db.prepare(INSERT_DATA);

  list.forEach((item) => {
    const values = Object.keys(item).map((key) => item[key]);
    statement.run(values);
  });
  statement.finalize();

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
const findFiles = (directory, options) => {
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
      files = files.concat(findFiles(item, options));
    }
    else if (stat.isFile()) {
      files.push(item);
    }
  });

  return files;
};

/**
 * Get the meta data for the given file.
 *
 * @param {string} filepath File path
 * @returns {object} Meta data of the given file
 * @see https://nodejs.org/docs/latest-v6.x/api/fs.html#fs_class_fs_stats
 */
const getMeta = (filepath) => {
  const sha256 = hasha.fromFileSync(filepath, {
    algorithm: 'sha256'
  });
  const stat = fs.statSync(filepath);

  return {
    filepath: filepath,
    sha256: sha256,
    filesize: stat.size, // File size in bytes
    modified: stat.mtime.getTime() // Milliseconds elapsed since 1 January 1970 00:00:00 UTC
  };
};

/**
 * @param {array} files List of file paths
 * @param {object} options Options that are all boolean values and false by default
 * @param {boolean} options.verbose Print out which file is being processed
 * @param {string} options.database Possible database file to be used with SQLite
 *
 * @returns {void}
 */
const processFiles = (files, options) => {
  const db = createDatabase(options.database);

  // Handle files in chunks.
  const iterations = Math.ceil(files.length / ITERATION_SIZE);
  if (options.verbose) {
    console.log(`Going to do ${iterations} iterations over ${files.length} files`);
  }

  for (let i = 1; i <= iterations; ++i) {
    const list = files.splice(0, ITERATION_SIZE);
    if (options.verbose) {
      console.log(`Iteration ${i} has ${list.length} files`);
    }
    const data = list.map((item) => {
      if (options.verbose) {
        console.log(`Reading "${item}"`);
      }

      return getMeta(item);
    });
    storeData(data, db);
  }

};

/**
 * @param {string} directory  Root directory in which images should be
 * @param {object} options    Options that are all boolean values and false by default
 * @param {boolean} options.verbose Print out which file is being processed
 * @param {string} options.database Possible database file to be used with SQLite
 * @param {boolean} options.ignoreDotFiles Ignore files and directories that begin with a dot
 *
 * @returns {void}
 */
module.exports = function (directory, options) {
  const files = findFiles(directory, options);
  processFiles(files, options);
};

module.exports.DEFAULT_DATABASE = DEFAULT_DATABASE;
