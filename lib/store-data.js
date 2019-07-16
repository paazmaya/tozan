/**
 * tozan
 * https://github.com/paazmaya/tozan
 * Index filesystem by creating metadata database
 *
 * Copyright (c) Juga Paazmaya <paazmaya@yahoo.com> (https://paazmaya.fi)
 * Licensed under the MIT license
 */

const COLUMNS_IN_TABLE = 4;

// Database data insertation query phrase with placeholders
const questions = Array(COLUMNS_IN_TABLE).fill('?').join(', ');
const INSERT_DATA = `INSERT INTO files VALUES (${questions})`;

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

module.exports = storeData;
