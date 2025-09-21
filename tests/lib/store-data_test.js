/**
 * tozan
 * https://github.com/paazmaya/tozan
 * Index filesystem by creating metadata database
 *
 * Copyright (c) Juga Paazmaya <paazmaya@yahoo.com> (https://paazmaya.fi)
 * Licensed under the MIT license
 */

import tape from 'tape';

import storeData from '../../lib/store-data.js';

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

tape('storeData - handles invalid input types', (test) => {
  test.plan(3);

  const db = {
    prepare: () => ({
      run: () => {}
    })
  };

  test.notOk(storeData(null, db), 'Handles null input');
  test.notOk(storeData('not-an-array', db), 'Handles string input');
  test.notOk(storeData({}, db), 'Handles object input');
});

tape('storeData - processes multiple files correctly', (test) => {
  test.plan(1);

  let runCount = 0;
  const list = ['item1', 'item2'];
  const db = {
    prepare: () => ({
      run: () => {
        runCount++;
      }
    })
  };

  storeData(list, db);
  test.equal(runCount, 2, 'run called for each item');
});

tape('storeData - handles missing database parameter', (test) => {
  test.plan(1);

  const list = [
    {
      filepath: 'test',
      hash: 'hash',
      filesize: 100,
      modified: 123
    }
  ];

  test.throws(() => storeData(list, null), 'Throws when database is null');
});

tape('storeData - handles items with different property orders', (test) => {
  test.plan(2);

  const list = [
    {
      modified: 123456,
      filesize: 100,
      filepath: 'file1.txt',
      hash: 'hash1'
    }
  ];

  const db = {
    prepare: function prepare() {
      test.ok(true, 'prepare called');

      return {
        run: function run(values) {
          test.ok(Array.isArray(values), 'Values array passed to run');
        }
      };
    }
  };

  storeData(list, db);
});
