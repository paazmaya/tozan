/**
 * tozan
 * https://github.com/paazmaya/tozan
 * Index filesystem by creating metadata database
 *
 * Copyright (c) Juga Paazmaya <paazmaya@yahoo.com> (https://paazmaya.fi)
 * Licensed under the MIT license
 */

import tape from 'tape';

import processFiles from '../../lib/process-files.js';

tape('processFiles - interface', (test) => {
  test.plan(2);

  test.equal(typeof processFiles, 'function', 'is a function');
  test.equal(processFiles.length, 2);
});

tape('processFiles - handles empty file list', (test) => {
  test.plan(1);

  const files = [];
  const options = {
    database: ':memory:',
    algorithm: 'sha1'
  };

  test.doesNotThrow(() => {
    processFiles(files, options);
  }, 'Handles empty file list gracefully');
});

tape('processFiles - handles invalid options', (test) => {
  test.plan(1);

  const files = [];
  const options = null;

  test.throws(() => {
    processFiles(files, options);
  }, 'Throws on invalid options');
});
