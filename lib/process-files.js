/**
 * tozan
 * https://github.com/paazmaya/tozan
 * Index filesystem by creating metadata database
 *
 * Copyright (c) Juga Paazmaya <paazmaya@yahoo.com> (https://paazmaya.fi)
 * Licensed under the MIT license
 */

import Progress from 'progress';

import constants from './constants.js';
import createDatabase from './create-database.js';
import storeData from './store-data.js';
import getMeta from './get-meta.js';

/**
 * @param {array} list List of file paths for this iteration
 * @param {Progress} bar Instance of Progress bar
 * @param {string} algorithm Hash algorithm to use
 *
 * @returns {Array}
 */
const createList = (list, bar, algorithm) => {
  return list
    .map((item) => {
      bar.tick();
      bar.render();

      return getMeta(item, algorithm);
    })
    // Take out those items that have returned false from getMeta
    .filter((item) => item);
};

/**
 * @param {array} files List of file paths
 * @param {object} options Options that are all boolean values and false by default
 * @param {string} options.database Possible database file to be used with SQLite
 * @param {string} options.algorithm Hash algorithm to use
 *
 * @returns {void}
 */
const processFiles = (files, options) => {
  const db = createDatabase(options.database);

  // Handle files in chunks.
  const iterations = Math.ceil(files.length / constants.ITERATION_SIZE);

  // Show command line progress.
  const bar = new Progress(`Processing ${files.length} files [:bar] :percent`, {
    total: files.length,
    complete: '#',
    incomplete: '-'
  });

  for (let i = 1; i <= iterations; ++i) {
    const data = createList(
      files.splice(0, constants.ITERATION_SIZE),
      bar,
      options.algorithm
    );

    storeData(data, db);
  }

  db.close();
};

export default processFiles;
