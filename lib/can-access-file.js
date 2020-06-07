/**
 * tozan
 * https://github.com/paazmaya/tozan
 * Index filesystem by creating metadata database
 *
 * Copyright (c) Juga Paazmaya <paazmaya@yahoo.com> (https://paazmaya.fi)
 * Licensed under the MIT license
 */

const fs = require('fs');

/**
 * Is the given file accessible?
 *
 * @param  {string} item File path which is being evaluated
 * @return {boolean} True when file can be accessed
 */
const canAccessFile = (item) => {
  try {
    fs.accessSync(item);

    return true;
  }
  catch (error) {
    console.error(`File "${item}" could not be accessed`);

    return false;
  }
};

module.exports = canAccessFile;
