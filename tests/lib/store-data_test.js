/**
 * tozan
 * https://github.com/paazmaya/tozan
 * Index filesystem by creating metadata database
 *
 * Copyright (c) Juga Paazmaya <paazmaya@yahoo.com> (https://paazmaya.fi)
 * Licensed under the MIT license
 */

const tape = require('tape');

const storeData = require('../../lib/store-data');

tape('storeData - interface', (test) => {
  test.plan(2);

  test.equal(typeof storeData, 'function', 'is a function');
  test.equal(storeData.length, 2);
});

tape('storeData - empty list not processed', (test) => {
  test.plan(1);

  const list = [];
  const db = {};

  const output = storeData(list, db);
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

  const output = storeData(list, db);
  test.equal(output, db, 'The same db instance returned');
});
