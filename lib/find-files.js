/**
 * tozan
 * https://github.com/paazmaya/tozan
 * Index filesystem by creating metadata database
 *
 * Copyright (c) Juga Paazmaya <paazmaya@yahoo.com> (https://paazmaya.fi)
 * Licensed under the MIT license
 */

import fs from 'node:fs';
import path from 'node:path';

import constants from './constants.js';
import canAccessFile from './can-access-file.js';

/**
 * List all files under the given directory.
 *
 * @param {string} directory  Root directory in which images should be
 * @param {object} options    Options that are all boolean values and false by default
 * @param {boolean} options.ignoreDotFiles Ignore files and directories that begin with a dot
 *
 * @returns {Array} List of files
 */
const findFiles = (directory, options) => {
  let items = fs.readdirSync(directory),
    files = [];

  if (options.ignoreDotFiles) {
    items = items.filter((item) => {
      return !constants.BEGIN_DOT.test(item);
    });
  }

  items = items
    .map((item) => path.join(directory, item))
    .filter((item) => canAccessFile(item));

  items.forEach((item) => {
    const stat = fs.statSync(item);
    if (stat.isDirectory()) {
      files = files.concat(findFiles(item, options));
    }
    else if (stat.isFile()) {
      files.push(item);
    }
  });

  return files;
};

export default findFiles;
