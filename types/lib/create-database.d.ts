export function migrateDatabase(db: sqlite3.Database): boolean;
export default createDatabase;
/**
 * Create and initialise SQLite database and tables, which by default is in memory.
 *
 * @param {string} location Where shall the database be stored, defauts to ':memory:'
 * @param {string} structure Table structure as in CREATE TABLE
 * @returns {sqlite3.Database} Database instance
 * @see http://sqlite.org/lang_createtable.html
 */
declare function createDatabase(location: string, structure: string): sqlite3.Database;
