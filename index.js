/**
 * tozan
 * https://github.com/paazmaya/tozan
 * Index filesystem by creating metadata database
 *
 * Copyright (c) Juga Paazmaya <paazmaya@yahoo.com> (https://paazmaya.fi)
 * Licensed under the MIT license
 */

import {
  execSync
} from 'node:child_process';

import arrayUniq from 'array-uniq';

import constants from './lib/constants.js';

import findFiles from './lib/find-files.js';
import processFiles from './lib/process-files.js';

/**
 * What is the version of OpenSSL binary?
 * Used for checking its existence.
 * Exposed for unit testing only.
 *
 * @param {string} command Command for checking version
 * @returns {string|boolean} Version or false
 */
export const openSSLVersion = (command) => {
  try {
    return execSync(command, constants.EXEC_OPTIONS);
  }
  catch {
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
export default function tozan(directory, options) {

  const version = openSSLVersion(constants.OPENSSL_VERSION);
  if (!version) {
    return false;
  }

  console.log(`Using "${version.trim()}" for ${options.algorithm} hashing`);

  const files = arrayUniq(findFiles(directory, options));
  processFiles(files, options);

  return true;
}
