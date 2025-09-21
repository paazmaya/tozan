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
import generateHash from '../../lib/generate-hash.js';

tape('generateHash - interface', (test) => {
  test.plan(2);

  test.equal(typeof generateHash, 'function', 'is a function');
  test.equal(generateHash.length, 2);
});

tape('generateHash - expected default', (test) => {
  test.plan(1);

  const filepath = path.join('tests', 'fixtures', '.dot-file');
  const hash = generateHash(filepath, constants.DEFAULT_ALG);

  test.equal(hash, '1f65f7b1de931871c52815db5e7011d106aaf1ff');
});

tape('generateHash - expected sha512', (test) => {
  test.plan(1);

  const filepath = 'tests/fixtures/.dot-file';
  const hash = generateHash(filepath, 'sha512');

  test.equal(hash, 'a8d21a919747f756be879f109cdc61f3d177d54abc548af122c42153fd51dc520d7e9105e1bea79aecdae978aa4dda0e799bf67f630f96ced2318fcdfa700bbf');
});

tape('generateHash - non existing file returns false', (test) => {
  test.plan(1);

  const filepath = 'not-here';
  const hash = generateHash(filepath, constants.DEFAULT_ALG);

  test.notOk(hash);
});

tape('generateHash - non supported hash algorithm returns false', (test) => {
  test.plan(1);

  const filepath = 'tests/fixtures/.dot-file';
  const hash = generateHash(filepath, 'hoplaa');

  test.notOk(hash);
});

tape('generateHash - difficult file name needs escaping $', (test) => {
  test.plan(1);

  const filepath = 'tests/fixtures/$data.exp';
  const hash = generateHash(filepath, 'md5');

  test.equal(hash, '1129a081e4cea80bfe8962f6db80bfa1');
});

tape('generateHash - difficult file name needs escaping, single quote', (test) => {
  test.plan(1);

  const filepath = "tests/fixtures/let's go.not"; // eslint-disable-line quotes
  const hash = generateHash(filepath, 'md5');

  test.equal(hash, '6e2aee8eaaf41d473adf69b85bf462cd');
});

tape('generateHash - handles Windows paths correctly', (test) => {
  test.plan(1);

  const filepath = path.join('tests', 'fixtures', '.dot-file');
  const hash = generateHash(filepath, 'md5');

  test.ok(hash, 'Handles path separators correctly');
});

tape('generateHash - handles empty algorithm gracefully', (test) => {
  test.plan(1);

  const filepath = 'tests/fixtures/.dot-file';
  const hash = generateHash(filepath, '');

  test.ok(hash, 'Returns hash when algorithm is empty (OpenSSL defaults to SHA256)');
});

tape('generateHash - handles undefined algorithm', (test) => {
  test.plan(1);

  const filepath = 'tests/fixtures/.dot-file';
  const hash = generateHash(filepath, null);

  test.ok(hash, 'Returns hash even for null algorithm (OpenSSL interprets as string)');
});

tape('generateHash - handles null filepath', (test) => {
  test.plan(1);

  const hash = generateHash(null, 'md5');

  test.notOk(hash, 'Returns false for null filepath');
});

tape('generateHash - handles empty filepath', (test) => {
  test.plan(1);

  const hash = generateHash('', 'md5');

  test.notOk(hash, 'Returns false for empty filepath');
});
