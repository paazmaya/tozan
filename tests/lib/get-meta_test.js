/**
 * tozan
 * https://github.com/paazmaya/tozan
 * Index filesystem by creating metadata database
 *
 * Copyright (c) Juga Paazmaya <paazmaya@yahoo.com> (https://paazmaya.fi)
 * Licensed under the MIT license
 */

import path from 'node:path';

import tape from 'tape';

import constants from '../../lib/constants.js';
import getMeta from '../../lib/get-meta.js';

tape('getMeta - interface', (test) => {
  test.plan(2);

  test.equal(typeof getMeta, 'function', 'is a function');
  test.equal(getMeta.length, 2);
});

tape('getMeta - expected metadata default', (test) => {
  test.plan(4);

  const filepath = path.join('tests', 'fixtures', '.dot-file');
  const meta = getMeta(filepath, constants.DEFAULT_ALG);

  test.equal(meta.filepath, filepath);
  test.equal(meta.filesize, 66);
  test.equal(meta.hash.length, 40);
  test.equal(String(meta.modified).length, 13);
});

tape('getMeta - expected metadata 512', (test) => {
  test.plan(4);

  const filepath = 'tests/fixtures/.dot-file';
  const meta = getMeta(filepath, 'sha512');

  test.equal(meta.filepath, filepath);
  test.equal(meta.filesize, 66);
  test.equal(meta.hash.length, 128);
  test.equal(typeof meta.modified, 'number');
});

tape('getMeta - non existing file returns false', (test) => {
  test.plan(1);

  const filepath = 'not-here';
  const meta = getMeta(filepath, constants.DEFAULT_ALG);

  test.notOk(meta);
});
