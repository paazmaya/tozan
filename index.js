/**
 * tozan
 * https://github.com/paazmaya/tozan
 * Index filesystem by creating metadata database
 *
 * Copyright (c) Juga Paazmaya <paazmaya@yahoo.com> (https://paazmaya.fi)
 * Licensed under the MIT license
 */

const fs = require('fs'),
  {
    execSync
  } = require('child_process');

const Progress = require('progress');

const createDatabase = require('./lib/create-database');
const storeData = require('./lib/store-data');
const findFiles = require('./lib/find-files');


const OPENSSL_VERSION = 'openssl version';
const EXEC_OPTIONS = {
  encoding: 'utf8',
  cwd: process.cwd()
};
const DEFAULT_DATABASE = ':memory:';
const DEFAULT_SHA = '256';
const ALLOWED_SHA = ['256', '384', '512'];
const ITERATION_SIZE = 100;


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
module.exports._storeData = storeData;
module.exports._getMeta = getMeta;
module.exports._processFiles = processFiles;
module.exports._unique = unique;
module.exports._openSSLVersion = openSSLVersion;
