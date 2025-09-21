/**
 * tozan
 * https://github.com/paazmaya/tozan
 * Index filesystem by creating metadata database
 *
 * Copyright (c) Juga Paazmaya <paazmaya@yahoo.com> (https://paazmaya.fi)
 * Licensed under the MIT license
 */

import tape from 'tape';
import Better3 from 'better-sqlite3';

import constants from '../../lib/constants.js';
import createDatabase, {
  migrateDatabase
} from '../../lib/create-database.js';

tape('createDatabase - interface', (test) => {
  test.plan(2);

  test.equal(typeof createDatabase, 'function', 'is a function');
  test.equal(createDatabase.length, 2);
});

tape('createDatabase - uses memory by default', (test) => {
  test.plan(1);

  const db = createDatabase();
  test.ok(db.memory);
});

tape('createDatabase::migrateDatabase - updates legacy table', (test) => {
  test.plan(3);

  const db = new Better3(constants.DEFAULT_DATABASE);
  db.exec(`
    CREATE TABLE IF NOT EXISTS files (
      filepath TEXT PRIMARY KEY ON CONFLICT REPLACE,
      sha256 TEXT,
      filesize INTEGER,
      modified INTEGER
    ) WITHOUT ROWID
  `);

  const output = migrateDatabase(db);
  test.ok(output, 'Database table was migrated according to method');

  const info = db.pragma('table_info(files)');
  const isLegacy = info.some((item) => item.name === 'sha256');
  const isModern = info.some((item) => item.name === 'hash');
  db.close();

  test.notOk(isLegacy, 'Legacy column name not found');
  test.ok(isModern, 'Migrated column name found');
});

tape('createDatabase - creates file database when path provided', (test) => {
  test.plan(1);

  const dbPath = './test-database.db';
  const db = createDatabase(dbPath);

  test.ok(db, 'Creates file-based database');
  db.close();
});

tape('createDatabase - handles different options', (test) => {
  test.plan(2);

  const db1 = createDatabase();
  test.ok(db1.memory, 'Creates memory database by default');
  db1.close();

  const db2 = createDatabase(constants.DEFAULT_DATABASE);
  test.ok(db2.memory, 'Creates memory database when explicitly set');
  db2.close();
});

tape('createDatabase - creates table structure', (test) => {
  test.plan(1);

  const db = createDatabase();
  const info = db.pragma('table_info(files)');

  test.ok(info.length > 0, 'Table structure created');
  db.close();
});
