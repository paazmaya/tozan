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

const createDatabase = require('../../lib/create-database');

tape('createDatabase - interface', (test) => {
  test.plan(2);

  test.equal(typeof createDatabase, 'function', 'is a function');
  test.equal(createDatabase.length, 1);
});

tape('createDatabase - uses memory by default', (test) => {
  test.plan(1);

  const db = createDatabase();
  test.ok(db.memory);
});
