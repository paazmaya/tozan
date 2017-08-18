/**
 * tozan
 * https://github.com/paazmaya/tozan
 * Index filesystem by creating metadata database
 *
 * Copyright (c) Juga Paazmaya <paazmaya@yahoo.com> (https://paazmaya.fi)
 * Licensed under the MIT license
 */

const fs = require('fs'),
  path = require('path'),
  execSync = require('child_process').execSync;

const sqlite3 = require('sqlite3'),
  Progress = require('progress');

const OPENSSL_VERSION = 'openssl version';
const EXEC_OPTIONS = {
  encoding: 'utf8',
  cwd: process.cwd()
};
const BEGIN_DOT = /^\./;
const DEFAULT_DATABASE = ':memory:';
const ITERATION_SIZE = 100;

// https://www.sqlite.org/withoutrowid.html
const CREATE_TABLE = `
  CREATE TABLE IF NOT EXISTS files (
    filepath TEXT PRIMARY KEY ON CONFLICT REPLACE,
    sha256 TEXT,
    filesize INTEGER,
    modified INTEGER
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
 * @returns {object|boolean} Meta data of the given file or false when it could not
 * @see https://nodejs.org/docs/latest-v6.x/api/fs.html#fs_class_fs_stats
 */
const getMeta = (filepath) => {
  let stat;

  try {
    stat = fs.statSync(filepath);
  }
  catch (error) {
    console.error(`Could not stat a file "${filepath}"`);
    console.error(error.message);

    return false;
  }

  const command = `openssl dgst -sha256 "${filepath}"`;
  const output = execSync(command, EXEC_OPTIONS);
  const sha256 = output.trim().split(' ').pop();

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
 * @param {string} options.database Possible database file to be used with SQLite
 *
 * @returns {void}
 */
const processFiles = (files, options) => {
  const db = createDatabase(options.database);

  // Handle files in chunks.
  const iterations = Math.ceil(files.length / ITERATION_SIZE);

  // Show command line progress.
  const bar = new Progress(`Processing ${files.length} files [:bar] :percent`, {
    total: files.length,
    complete: '#',
    incomplete: '-'
  });

  for (let i = 1; i <= iterations; ++i) {
    const list = files.splice(0, ITERATION_SIZE);
    const data = list
      .map((item) => {
        bar.tick();
        bar.render();

        return getMeta(item);
      })
      .filter((item) => {
        // Take out those items that have returned false from getMeta
        return item;
      });

    storeData(data, db);
  }

  db.close();
};

/**
 * Get rid of duplicates in the list.
 *
 * @param {array} list List of things to get only unique ones
 * @returns {array} Unique items in the list
 */
const unique = (list) => {
  const filtered = [];

  list.forEach((item) => {
    if (filtered.indexOf(item) === -1) {
      filtered.push(item);
    }
  });

  return filtered;
};

/**
 * What is the version of OpenSSL binary?
 * Used for checking its existance.
 *
 * @param {string} command Command for checking version
 * @returns {string|boolean} Version or false
 */
const openSSLVersion = (command) => {
  let version;
  try {
    version = execSync(command, EXEC_OPTIONS);
  }
  catch (error) {
    console.error('Looks like "openssl" is not available, hence cannot continue.');

    return false;
  }

  return version;
};

/**
 * Checks that OpenSSL is available before getting a list of files and process them.
 *
 * @param {string} directory  Root directory in which images should be
 * @param {object} options    Options that are all boolean values and false by default
 * @param {string} options.database Possible database file to be used with SQLite
 * @param {boolean} options.ignoreDotFiles Ignore files and directories that begin with a dot
 *
 * @returns {boolean} Processed or not
 */
module.exports = function tozan(directory, options) {

  const version = openSSLVersion(OPENSSL_VERSION);
  if (!version) {
    return false;
  }

  console.log(`Using "${version.trim()}" for SHA-256 hashing`);

  const files = unique(findFiles(directory, options));
  processFiles(files, options);

  return true;
};

module.exports.DEFAULT_DATABASE = DEFAULT_DATABASE;
module.exports.OPENSSL_VERSION = OPENSSL_VERSION;

// For unit testing only.
module.exports._createDatabase = createDatabase;
module.exports._storeData = storeData;
module.exports._findFiles = findFiles;
module.exports._getMeta = getMeta;
module.exports._processFiles = processFiles;
module.exports._unique = unique;
module.exports._openSSLVersion = openSSLVersion;
