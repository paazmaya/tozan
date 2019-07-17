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

const constants = require('../../lib/constants');
const getMeta = require('../../lib/get-meta');

tape('getMeta - interface', (test) => {
  test.plan(2);

  test.equal(typeof getMeta, 'function', 'is a function');
  test.equal(getMeta.length, 2);
});

tape('getMeta - expected metadata default', (test) => {
  test.plan(3);

  const filepath = 'tests/fixtures/.dot-file';
  const meta = getMeta(filepath, constants.DEFAULT_SHA);

  test.equal(meta.filepath, filepath);
  test.equal(meta.filesize, 66);
  test.equal(meta.hash, 'e712b28bd056ac4c56a2bff25ef825e53ed2ec4d19e05de3a79060638fd80705');
});

tape('getMeta - expected metadata 512', (test) => {
  test.plan(3);

  const filepath = 'tests/fixtures/.dot-file';
  const meta = getMeta(filepath, '512');

  test.equal(meta.filepath, filepath);
  test.equal(meta.filesize, 66);
  test.equal(meta.hash, 'a8d21a919747f756be879f109cdc61f3d177d54abc548af122c42153fd51dc520d7e9105e1bea79aecdae978aa4dda0e799bf67f630f96ced2318fcdfa700bbf');
});

tape('getMeta - non existing file returns false', (test) => {
  test.plan(1);

  const filepath = 'not-here';
  const meta = getMeta(filepath, constants.DEFAULT_SHA);

  test.notOk(meta);
});
