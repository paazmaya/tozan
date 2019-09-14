/**
 * tozan
 * https://github.com/paazmaya/tozan
 * Index filesystem by creating metadata database
 *
 * Copyright (c) Juga Paazmaya <paazmaya@yahoo.com> (https://paazmaya.fi)
 * Licensed under the MIT license
 */

'use strict';

const path = require('path');

const tape = require('tape');

const constants = require('../../lib/constants');
const generateHash = require('../../lib/generate-hash');

tape('generateHash - interface', (test) => {
  test.plan(2);

  test.equal(typeof generateHash, 'function', 'is a function');
  test.equal(generateHash.length, 2);
});

tape('generateHash - expected default', (test) => {
  test.plan(1);

  const filepath = path.join('tests', 'fixtures', '.dot-file');
  const hash = generateHash(filepath, constants.DEFAULT_SHA);

  test.equal(hash, 'e712b28bd056ac4c56a2bff25ef825e53ed2ec4d19e05de3a79060638fd80705');
});

tape('generateHash - expected sha512', (test) => {
  test.plan(1);

  const filepath = 'tests/fixtures/.dot-file';
  const hash = generateHash(filepath, '512');

  test.equal(hash, 'a8d21a919747f756be879f109cdc61f3d177d54abc548af122c42153fd51dc520d7e9105e1bea79aecdae978aa4dda0e799bf67f630f96ced2318fcdfa700bbf');
});

/*
tape('generateHash - non existing file returns false', (test) => {
  test.plan(1);

  const filepath = 'not-here';
  const hash = generateHash(filepath, constants.DEFAULT_SHA);

  test.notOk(hash);
});
*/

// Non supported hash algorithm?
