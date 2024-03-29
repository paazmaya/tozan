/**
 * tozan
 * https://github.com/paazmaya/tozan
 * Index filesystem by creating metadata database
 *
 * Copyright (c) Juga Paazmaya <paazmaya@yahoo.com> (https://paazmaya.fi)
 * Licensed under the MIT license
 */

const EXEC_OPTIONS = {
  encoding: 'utf8',
  cwd: process.cwd()
};

const OPENSSL_VERSION = 'openssl version';
const DEFAULT_ALG = 'sha1';

const ITERATION_SIZE = 100;

const DEFAULT_DATABASE = ':memory:';

// https://www.sqlite.org/withoutrowid.html
const CREATE_TABLE = `
  CREATE TABLE IF NOT EXISTS files (
    filepath TEXT PRIMARY KEY ON CONFLICT REPLACE,
    hash TEXT,
    filesize INTEGER,
    modified INTEGER
  ) WITHOUT ROWID
`;

// Update legacy table structure from before 3.0.0
const ALTER_TABLE = 'ALTER TABLE files RENAME COLUMN sha256 TO hash';

// Database data insertation query phrase with placeholders
const COLUMNS_IN_TABLE = 4;
const questions = Array(COLUMNS_IN_TABLE).fill('?').join(', ');
const INSERT_DATA = `INSERT INTO files VALUES (${questions})`;

// Match anything that begins with a dot, such as a filename
const BEGIN_DOT = /^\./u;

export default {
  ALTER_TABLE,
  BEGIN_DOT,
  CREATE_TABLE,
  DEFAULT_ALG,
  DEFAULT_DATABASE,
  EXEC_OPTIONS,
  INSERT_DATA,
  ITERATION_SIZE,
  OPENSSL_VERSION
};
