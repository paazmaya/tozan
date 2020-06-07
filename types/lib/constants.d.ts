/**
 * tozan
 * https://github.com/paazmaya/tozan
 * Index filesystem by creating metadata database
 *
 * Copyright (c) Juga Paazmaya <paazmaya@yahoo.com> (https://paazmaya.fi)
 * Licensed under the MIT license
 */

export namespace EXEC_OPTIONS {
    export const encoding: string;
    export const cwd: any;
}
export const OPENSSL_VERSION: "openssl version";
export const DEFAULT_ALG: "sha1";
export const ITERATION_SIZE: 100;
export const DEFAULT_DATABASE: ":memory:";
export const CREATE_TABLE: "\n  CREATE TABLE IF NOT EXISTS files (\n    filepath TEXT PRIMARY KEY ON CONFLICT REPLACE,\n    hash TEXT,\n    filesize INTEGER,\n    modified INTEGER\n  ) WITHOUT ROWID\n";
export const ALTER_TABLE: 'ALTER TABLE files RENAME COLUMN sha256 TO hash';

export const INSERT_DATA: string;
