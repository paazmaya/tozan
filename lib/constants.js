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
const DEFAULT_SHA = '256';
const ALLOWED_SHA = ['256', '384', '512'];

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

// Database data insertation query phrase with placeholders
const COLUMNS_IN_TABLE = 4;
const questions = Array(COLUMNS_IN_TABLE).fill('?').join(', ');
const INSERT_DATA = `INSERT INTO files VALUES (${questions})`;

module.exports = {
  EXEC_OPTIONS,
  OPENSSL_VERSION,
  DEFAULT_SHA,
  ALLOWED_SHA,
  ITERATION_SIZE,
  DEFAULT_DATABASE,
  CREATE_TABLE,
  INSERT_DATA
};