/**
 * tozan
 * https://github.com/paazmaya/tozan
 * Index filesystem by creating metadata database
 *
 * Copyright (c) Juga Paazmaya <paazmaya@yahoo.com> (https://paazmaya.fi)
 * Licensed under the MIT license
 */

import {
  execFileSync
} from 'node:child_process';

import constants from './constants.js';

/**
 * Get the meta data for the given file.
 *
 * @param {string} filepath  File path
 * @param {string} algorithm Hash algorithm to use
 * @returns {string|boolean} Generated hash of the given file or false when failed
 */
const generateHash = (filepath, algorithm) => {
  if (!filepath || typeof filepath !== 'string') {
    return false;
  }

  const args = ['dgst'];
  if (algorithm !== undefined && algorithm !== '') {
    args.push(`-${algorithm}`);
  }
  args.push(filepath);

  try {
    const output = execFileSync('openssl', args, constants.EXEC_OPTIONS);

    return output.trim().split(' ').pop();
  }
  catch {
    console.error(`Failed to use algorithm "${algorithm}" with file "${filepath}"`);

    return false;
  }
};

export default generateHash;
