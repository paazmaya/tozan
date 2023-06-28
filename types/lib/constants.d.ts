declare namespace _default {
    export { ALTER_TABLE };
    export { BEGIN_DOT };
    export { CREATE_TABLE };
    export { DEFAULT_ALG };
    export { DEFAULT_DATABASE };
    export { EXEC_OPTIONS };
    export { INSERT_DATA };
    export { ITERATION_SIZE };
    export { OPENSSL_VERSION };
}
export default _default;
declare const ALTER_TABLE: "ALTER TABLE files RENAME COLUMN sha256 TO hash";
declare const BEGIN_DOT: RegExp;
declare const CREATE_TABLE: "\n  CREATE TABLE IF NOT EXISTS files (\n    filepath TEXT PRIMARY KEY ON CONFLICT REPLACE,\n    hash TEXT,\n    filesize INTEGER,\n    modified INTEGER\n  ) WITHOUT ROWID\n";
declare const DEFAULT_ALG: "sha1";
declare const DEFAULT_DATABASE: ":memory:";
declare namespace EXEC_OPTIONS {
    let encoding: string;
    let cwd: string;
}
declare const INSERT_DATA: string;
declare const ITERATION_SIZE: 100;
declare const OPENSSL_VERSION: "openssl version";
