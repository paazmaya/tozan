/**
 * tozan
 * https://github.com/paazmaya/tozan
 * Index filesystem by creating metadata database
 *
 * Copyright (c) Juga Paazmaya <paazmaya@yahoo.com> (https://paazmaya.fi)
 * Licensed under the MIT license
 */

//const constants = require('./constants');

/**
 * Find matching files and validate hashes
 *
 * @param {array} list List of file meta data objects
 * @param {sqlite3.Database} db Database instance
 * @returns {sqlite3.Database|boolean} Database instance or false
 */
const findData = (list, db) => {
  if (!(list instanceof Array) || list.length === 0) {
    return false;
  }

  const statement = db.prepare(`
    SELECT * FROM files WHERE filepath = ?
  `);

  list.forEach((item) => {
    const rows = statement.all(item.filepath);
    if (rows.length > 1) {
      console.log(`File "${item.filepath}" had several (${rows.length}) matches in database`);
    }
    else if (rows.length === 0) {
      console.log(`File "${item.filepath}" did not exists in database`);
    }
  });

  return db;
};

module.exports = findData;
