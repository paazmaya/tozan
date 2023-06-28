export default storeData;
/**
 * Generate and store the metadata for all the files in the list
 *
 * @param {array} list List of file meta data objects
 * @param {sqlite3.Database} db Database instance
 * @returns {sqlite3.Database|boolean} Database instance or false
 */
declare function storeData(list: array, db: sqlite3.Database): sqlite3.Database | boolean;
