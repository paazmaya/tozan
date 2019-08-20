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

const constants = require('./constants');

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

  const command = `openssl dgst -sha${hash} '${filepath}'`;
  const output = execSync(command, constants.EXEC_OPTIONS);
  const sha = output.trim().split(' ').pop();

  return {
    filepath: filepath,
    hash: sha,
    filesize: stat.size, // File size in bytes
    modified: stat.mtime.getTime() // Milliseconds elapsed since 1 January 1970 00:00:00 UTC
  };
};

module.exports = getMeta;