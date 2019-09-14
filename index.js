/**
 * tozan
 * https://github.com/paazmaya/tozan
 * Index filesystem by creating metadata database
 *
 * Copyright (c) Juga Paazmaya <paazmaya@yahoo.com> (https://paazmaya.fi)
 * Licensed under the MIT license
 */

const {
  execSync
} = require('child_process');

const constants = require('./lib/constants');

const findFiles = require('./lib/find-files');
const processFiles = require('./lib/process-files');

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
  try {
    return execSync(command, constants.EXEC_OPTIONS);
  }
  catch (error) {
    console.error('Looks like "openssl" is not available, hence cannot continue.');

    return false;
  }
};

/**
 * Checks that OpenSSL is available before getting a list of files and process them.
 *
 * @param {string} directory  Root directory in which images should be
 * @param {object} options    Options that are all boolean values and false by default
 * @param {string} options.database Possible database file to be used with SQLite
 * @param {string} options.algorithm Hash algorithm to use
 * @param {boolean} options.ignoreDotFiles Ignore files and directories that begin with a dot
 *
 * @returns {boolean} Processed or not
 */
module.exports = function tozan(directory, options) {

  const version = openSSLVersion(constants.OPENSSL_VERSION);
  if (!version) {
    return false;
  }

  console.log(`Using "${version.trim()}" for ${options.hash} hashing`);

  const files = unique(findFiles(directory, options));
  processFiles(files, options);

  return true;
};

// For unit testing only.
module.exports._unique = unique;
module.exports._openSSLVersion = openSSLVersion;
