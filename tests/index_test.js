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
const tozan = require('../index');

tape('a function with two parameters is exported', (test) => {
  test.plan(2);

  test.equal(typeof tozan, 'function', 'is a function');
  test.equal(tozan.length, 2, 'has two parameters');
});

tape('index - wrong hash option blocks usage', (test) => {
  test.plan(1);

  const output = tozan('.', {
    hash: 128
  });

  test.notOk(output);
});

tape('storeData - interface', (test) => {
  test.plan(2);

  test.equal(typeof tozan._storeData, 'function', 'is a function');
  test.equal(tozan._storeData.length, 2);
});

tape('storeData - empty list not processed', (test) => {
  test.plan(1);

  const list = [];
  const db = {};

  const output = tozan._storeData(list, db);
  test.notOk(output);
});

tape('storeData - calls all database methods once with one file', (test) => {
  test.plan(3);

  const list = [''];
  const db = {
    prepare: function prepare() {
      test.ok('prepare was called');

      return {
        run: function run() {
          test.ok('run was called');
        }
      };
    }
  };

  const output = tozan._storeData(list, db);
  test.equal(output, db, 'The same db instance returned');
});

tape('getMeta - interface', (test) => {
  test.plan(2);

  test.equal(typeof tozan._getMeta, 'function', 'is a function');
  test.equal(tozan._getMeta.length, 2);
});

tape('getMeta - expected metadata default', (test) => {
  test.plan(3);

  const filepath = path.join(__dirname, 'fixtures', '.dot-file');
  const meta = tozan._getMeta(filepath, tozan.DEFAULT_SHA);

  test.equal(meta.filepath, filepath);
  test.equal(meta.filesize, 66);
  test.equal(meta.hash, 'e712b28bd056ac4c56a2bff25ef825e53ed2ec4d19e05de3a79060638fd80705');
});

tape('getMeta - expected metadata 512', (test) => {
  test.plan(3);

  const filepath = path.join(__dirname, 'fixtures', '.dot-file');
  const meta = tozan._getMeta(filepath, '512');

  test.equal(meta.filepath, filepath);
  test.equal(meta.filesize, 66);
  test.equal(meta.hash, 'a8d21a919747f756be879f109cdc61f3d177d54abc548af122c42153fd51dc520d7e9105e1bea79aecdae978aa4dda0e799bf67f630f96ced2318fcdfa700bbf');
});

tape('getMeta - non existing file returns false', (test) => {
  test.plan(1);

  const filepath = 'not-here';
  const meta = tozan._getMeta(filepath, tozan.DEFAULT_SHA);

  test.notOk(meta);
});

tape('processFiles - interface', (test) => {
  test.plan(2);

  test.equal(typeof tozan._processFiles, 'function', 'is a function');
  test.equal(tozan._processFiles.length, 2);
});

tape('unique - interface', (test) => {
  test.plan(2);

  test.equal(typeof tozan._unique, 'function', 'is a function');
  test.equal(tozan._unique.length, 1);
});

tape('unique - gets rid of a duplicate', (test) => {
  test.plan(1);

  const input = ['a', 'b', 'b', 'c'];
  const output = tozan._unique(input);
  test.deepEqual(output, ['a', 'b', 'c']);
});

tape('openSSLVersion - interface', (test) => {
  test.plan(2);

  test.equal(typeof tozan._openSSLVersion, 'function', 'is a function');
  test.equal(tozan._openSSLVersion.length, 1);
});

tape('openSSLVersion - gets version', (test) => {
  test.plan(1);

  const version = tozan._openSSLVersion(tozan.OPENSSL_VERSION);

  test.equal(version.search(/(LibreSSL|OpenSSL)/u), 0, 'has version string');
});

tape('openSSLVersion - false when no version', (test) => {
  test.plan(1);

  const version = tozan._openSSLVersion('nothing-to-be-found-here');

  test.notOk(version, 'has no version');
});
