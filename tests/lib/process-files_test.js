/**
 * tozan
 * https://github.com/paazmaya/tozan
 * Index filesystem by creating metadata database
 *
 * Copyright (c) Juga Paazmaya <paazmaya@yahoo.com> (https://paazmaya.fi)
 * Licensed under the MIT license
 */

'use strict';

const tape = require('tape');

const processFiles = require('../../lib/process-files');

tape('processFiles - interface', (test) => {
  test.plan(2);

  test.equal(typeof processFiles, 'function', 'is a function');
  test.equal(processFiles.length, 2);
});
