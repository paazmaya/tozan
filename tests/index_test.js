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

tape('createDatabase - interface', (test) => {
  test.plan(2);

  test.equal(typeof tozan._createDatabase, 'function', 'is a function');
  test.equal(tozan._createDatabase.length, 1);
});

tape('createDatabase - uses memory by default', (test) => {
  test.plan(1);

  const db = tozan._createDatabase();
  test.ok(db.memory);
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

tape('findFiles - interface', (test) => {
  test.plan(2);

  test.equal(typeof tozan._findFiles, 'function', 'is a function');
  test.equal(tozan._findFiles.length, 2);
});

tape('findFiles - finds all test files', (test) => {
  test.plan(2);

  const options = {
    ignoreDotFiles: true
  };
  const list = tozan._findFiles(path.join(__dirname, 'fixtures'), options);
  test.equal(list.length, 2);
  test.ok(list.indexOf(path.join(__dirname, 'fixtures', '$data.exp')) !== -1);
});

tape('findFiles - finds all test files and a dot file', (test) => {
  test.plan(1);

  const options = {
    ignoreDotFiles: false
  };
  const list = tozan._findFiles(path.join(__dirname, 'fixtures'), options);
  test.equal(list.length, 3);
});

tape('findFiles - finds files under sub folder', (test) => {
  test.plan(1);

  const options = {
    ignoreDotFiles: false
  };
  const list = tozan._findFiles(__dirname, options);
  test.equal(list.length, 5);
});

tape('getMeta - interface', (test) => {
  test.plan(2);

  test.equal(typeof tozan._getMeta, 'function', 'is a function');
  test.equal(tozan._getMeta.length, 1);
});

tape('getMeta - expected metadata', (test) => {
  test.plan(3);

  const filepath = path.join(__dirname, 'fixtures', '.dot-file');
  const meta = tozan._getMeta(filepath);

  test.equal(meta.filepath, filepath);
  test.equal(meta.filesize, 66);
  test.equal(meta.sha256, 'e712b28bd056ac4c56a2bff25ef825e53ed2ec4d19e05de3a79060638fd80705');
});

tape('getMeta - non existing file returns false', (test) => {
  test.plan(1);

  const filepath = 'not-here';
  const meta = tozan._getMeta(filepath);

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

  test.equal(version.search(/(LibreSSL|OpenSSL)/), 0, 'has version string');
});

tape('openSSLVersion - false when no version', (test) => {
  test.plan(1);

  const version = tozan._openSSLVersion('nothing-to-be-found-here');

  test.notOk(version, 'has no version');
});
