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

const constants = require('./constants');

/**
 * Get the meta data for the given file.
 *
 * @param {string} filepath  File path
 * @param {string} algorithm Hash algorithm to use
 * @returns {string|boolean} Generated hash of the given file or false when failed
 */
const generateHash = (filepath, algorithm) => {
  const command = `openssl dgst -${algorithm} '${filepath}'`;

  try {
    const output = execSync(command, constants.EXEC_OPTIONS);

    return output.trim().split(' ').pop();
  }
  catch (error) {
    console.error(`Failed to use algorithm "${algorithm}" with file "${filepath}"`);

    return false;
  }
};

module.exports = generateHash;
