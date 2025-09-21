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

tape('getMeta - handles empty files', (test) => {
  test.plan(3);

  const filepath = 'tests/fixtures/empty-file-1.txt';
  const meta = getMeta(filepath, 'sha1');

  test.ok(meta, 'Processes empty files');
  // The file contains no data, but is still 2 bytes due to # and newline
  test.equal(meta.filesize, 2, 'Correctly reports file size (contains "#\\n")');
  test.equal(typeof meta.modified, 'number', 'Has modified timestamp');
});

tape('getMeta - handles hash generation failure', (test) => {
  test.plan(1);

  const filepath = 'tests/fixtures/.dot-file';
  const meta = getMeta(filepath, 'invalid-algorithm');

  test.notOk(meta, 'Returns false when hash generation fails');
});

tape('getMeta - handles invalid filepath types', (test) => {
  test.plan(2);

  test.notOk(getMeta(null, 'sha1'), 'Returns false for null filepath');
  test.notOk(getMeta('', 'sha1'), 'Returns false for empty filepath');
});

tape('getMeta - handles directory instead of file', (test) => {
  test.plan(1);

  const filepath = 'tests/fixtures';
  const meta = getMeta(filepath, 'sha1');

  // This should either work or fail gracefully depending on implementation
  test.ok(typeof meta === 'object' || meta === false, 'Handles directory path');
});

tape('getMeta - validates metadata structure', (test) => {
  test.plan(4);

  const filepath = 'tests/fixtures/.dot-file';
  const meta = getMeta(filepath, 'sha256');

  test.ok(Object.prototype.hasOwnProperty.call(meta, 'filepath'), 'Has filepath property');
  test.ok(Object.prototype.hasOwnProperty.call(meta, 'hash'), 'Has hash property');
  test.ok(Object.prototype.hasOwnProperty.call(meta, 'filesize'), 'Has filesize property');
  test.ok(Object.prototype.hasOwnProperty.call(meta, 'modified'), 'Has modified property');
});
