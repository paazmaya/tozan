/**
 * tozan
 * https://github.com/paazmaya/tozan
 * Index filesystem by creating metadata database
 *
 * Copyright (c) Juga Paazmaya <paazmaya@yahoo.com> (https://paazmaya.fi)
 * Licensed under the MIT license
 */



const tape = require('tape');
const Better3 = require('better-sqlite3');

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

tape('createDatabase::migrateDatabase - updates legacy table', (test) => {
  test.plan(3);

  const db = new Better3('memories', {
    memory: true
  });
  db.exec(`
    CREATE TABLE IF NOT EXISTS files (
      filepath TEXT PRIMARY KEY ON CONFLICT REPLACE,
      sha256 TEXT,
      filesize INTEGER,
      modified INTEGER
    ) WITHOUT ROWID
  `);

  const output = createDatabase._migrateDatabase(db);
  test.ok(output, 'Database table was migrated according to method');

  const info = db.pragma('table_info(files)');
  const isLegacy = info.some((item) => item.name === 'sha256');
  const isModern = info.some((item) => item.name === 'hash');
  db.close();

  test.notOk(isLegacy, 'Legacy column name not found');
  test.ok(isModern, 'Migrated column name found');
});
