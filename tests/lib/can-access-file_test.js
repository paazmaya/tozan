/**
 * tozan
 * https://github.com/paazmaya/tozan
 * Index filesystem by creating metadata database
 *
 * Copyright (c) Juga Paazmaya <paazmaya@yahoo.com> (https://paazmaya.fi)
 * Licensed under the MIT license
 */

import tape from 'tape';

import canAccessFile from '../../lib/can-access-file.js';

tape('canAccessFile - interface', (test) => {
  test.plan(2);

  test.equal(typeof canAccessFile, 'function', 'is a function');
  test.equal(canAccessFile.length, 1);
});

tape('canAccessFile - file does not exist', (test) => {
  test.plan(1);

  const filepath = 'i am not here';
  const actual = canAccessFile(filepath);
  test.notOk(actual);
});

tape('canAccessFile - file is here', (test) => {
  test.plan(1);

  const filepath = 'tests/index_test.js';
  const actual = canAccessFile(filepath);
  test.ok(actual);
});
