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
import os from 'os';

import constants from './constants.js';

const isWin = os.platform() === 'win32';

/**
 * Get the meta data for the given file.
 *
 * @param {string} filepath  File path
 * @param {string} algorithm Hash algorithm to use
 * @returns {string|boolean} Generated hash of the given file or false when failed
 */
const generateHash = (filepath, algorithm) => {
  const quote = isWin ?
    '"' :
    '\'';
  if (!isWin) {
    filepath = filepath.replace(/'/gu, "'\\''"); // eslint-disable-line quotes
  }
  const command = `openssl dgst -${algorithm} ${quote}${filepath}${quote}`;

  try {
    const output = execSync(command, constants.EXEC_OPTIONS);

    return output.trim().split(' ').pop();
  }
  catch {
    console.error(`Failed to use algorithm "${algorithm}" with file "${filepath}"`);

    return false;
  }
};

export default generateHash;
