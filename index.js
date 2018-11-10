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

const Better3 = require('better-sqlite3'),
  Progress = require('progress');

const OPENSSL_VERSION = 'openssl version';
const EXEC_OPTIONS = {
  encoding: 'utf8',
  cwd: process.cwd()
};
const BEGIN_DOT = /^\./u;
const DEFAULT_DATABASE = ':memory:';
const DEFAULT_SHA = '256';
const ALLOWED_SHA = ['256', '384', '512'];
const ITERATION_SIZE = 100;

// https://www.sqlite.org/withoutrowid.html
const CREATE_TABLE = `
  CREATE TABLE IF NOT EXISTS files (
    filepath TEXT PRIMARY KEY ON CONFLICT REPLACE,
    hash TEXT,
    filesize INTEGER,
    modified INTEGER
  ) WITHOUT ROWID
`;
const COLUMNS_IN_TABLE = 4;

// Database data insertation query phrase with placeholders
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

  const opts = {
    memory: false
  };

  if (location === DEFAULT_DATABASE) {
    location = 'in-memory';
    opts.memory = true;
  }

  const db = new Better3(location, opts);

  // Create tables that are needed.
  db.exec(CREATE_TABLE);

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
  }).filter((item) => {
    try {
      fs.accessSync(item);

      return true;
    }
    catch (error) {
      console.error(`File "${item}" could not be accessed`);

      return false;
    }
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
 * @param {string} filepath  File path
 * @param {string} hash      SHA bit depth to use
 * @returns {object|boolean} Meta data of the given file or false when it could not
 * @see https://nodejs.org/docs/latest-v6.x/api/fs.html#fs_class_fs_stats
 */
const getMeta = (filepath, hash) => {
  let stat;

  try {
    stat = fs.statSync(filepath);
  }
  catch (error) {
    console.error(`Could not access the file "${filepath}"`);
    console.error(error.message);

    return false;
  }

  const command = `openssl dgst -sha${hash} "${filepath}"`;
  const output = execSync(command, EXEC_OPTIONS);
  const sha = output.trim().split(' ').pop();

  return {
    filepath: filepath,
    hash: sha,
    filesize: stat.size, // File size in bytes
    modified: stat.mtime.getTime() // Milliseconds elapsed since 1 January 1970 00:00:00 UTC
  };
};

/**
 * @param {array} files List of file paths
 * @param {object} options Options that are all boolean values and false by default
 * @param {string} options.database Possible database file to be used with SQLite
 * @param {string} options.hash SHA bit depth to use
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

        return getMeta(item, options.hash);
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
 * @param {string} options.hash SHA bit depth to use
 * @param {boolean} options.ignoreDotFiles Ignore files and directories that begin with a dot
 *
 * @returns {boolean} Processed or not
 */
module.exports = function tozan(directory, options) {

  const version = openSSLVersion(OPENSSL_VERSION);
  if (!version) {
    return false;
  }

  if (ALLOWED_SHA.indexOf(options.hash) === -1) {
    return false;
  }

  console.log(`Using "${version.trim()}" for SHA-${options.hash} hashing`);

  const files = unique(findFiles(directory, options));
  processFiles(files, options);

  return true;
};

module.exports.DEFAULT_DATABASE = DEFAULT_DATABASE;
module.exports.DEFAULT_SHA = DEFAULT_SHA;
module.exports.ALLOWED_SHA = ALLOWED_SHA;
module.exports.OPENSSL_VERSION = OPENSSL_VERSION;

// For unit testing only.
module.exports._createDatabase = createDatabase;
module.exports._storeData = storeData;
module.exports._findFiles = findFiles;
module.exports._getMeta = getMeta;
module.exports._processFiles = processFiles;
module.exports._unique = unique;
module.exports._openSSLVersion = openSSLVersion;
