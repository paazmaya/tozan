/**
 * tozan
 * https://github.com/paazmaya/tozan
 * Index filesystem by creating metadata database
 *
 * Copyright (c) Juga Paazmaya <paazmaya@yahoo.com> (https://paazmaya.fi)
 * Licensed under the MIT license
 */

'use strict';

const fs = require('fs'),
  path = require('path');

const tape = require('tape'),
  tozan = require('../index');

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
  test.plan(4);

  const list = [''];
  const db = {
    prepare: function () {
      test.ok('prepare was called');

      return {
        run: function () {
          test.ok('run was called');
        },
        finalize: function () {
          test.ok('finalize was called');
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
  test.plan(1);

  const options = {
    ignoreDotFiles: true
  };
  const list = tozan._findFiles(__dirname, options);
  test.equal(list.length, 2);
});

tape('findFiles - finds all test files and a dot file', (test) => {
  test.plan(1);

  const options = {
    ignoreDotFiles: false
  };
  const list = tozan._findFiles(__dirname, options);
  test.equal(list.length, 3);
});

tape('getMeta - interface', (test) => {
  test.plan(2);

  test.equal(typeof tozan._getMeta, 'function', 'is a function');
  test.equal(tozan._getMeta.length, 1);
});

tape('processFiles - interface', (test) => {
  test.plan(2);

  test.equal(typeof tozan._processFiles, 'function', 'is a function');
  test.equal(tozan._processFiles.length, 2);
});
