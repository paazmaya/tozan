/**
 * tozan
 * https://github.com/paazmaya/tozan
 * Index filesystem by creating metadata database
 *
 * Copyright (c) Juga Paazmaya <paazmaya@yahoo.com> (https://paazmaya.fi)
 * Licensed under the MIT license
 */

const constants = require('./constants');

/**
 * Find matching files and validate hashes
 *
 * @param {array} list List of file meta data objects
 * @param {sqlite3.Database} db Database instance
 * @returns {object} Validation information
 */
const findData = (list, db) => {
  if (!(list instanceof Array) || list.length === 0) {
    return false;
  }

  // There always should be just one as it is unique
  const statement = db.prepare(`
    SELECT * FROM files WHERE filepath = ? LIMIT 1
  `);

  const output = {};

  list.forEach((item) => {
    const row = statement.get(item.filepath);
    if (!row) {
      console.log(`File "${item.filepath}" did not exists in database`);
      output[item.filepath] = constants.VERIFY.NOT_FOUND;
    }
    else if (row.hash === item.hash) {
      output[item.filepath] = constants.VERIFY.PASS;
    }
    else {
      console.log(`File "${item.filepath}" does not match the one in database`);
      output[item.filepath] = constants.VERIFY.FAIL;
    }
  });

  return output;
};

module.exports = findData;
