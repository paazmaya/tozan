export default processFiles;
/**
 * @param {array} files List of file paths
 * @param {object} options Options that are all boolean values and false by default
 * @param {string} options.database Possible database file to be used with SQLite
 * @param {string} options.algorithm Hash algorithm to use
 *
 * @returns {void}
 */
declare function processFiles(files: array, options: {
    database: string;
    algorithm: string;
}): void;
