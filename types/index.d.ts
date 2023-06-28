/**
 * Checks that OpenSSL is available before getting a list of files and process them.
 *
 * @param {string} directory  Root directory in which images should be
 * @param {object} options    Options that are all boolean values and false by default
 * @param {string} options.database Possible database file to be used with SQLite
 * @param {string} options.algorithm Hash algorithm to use
 * @param {boolean} options.ignoreDotFiles Ignore files and directories that begin with a dot
 *
 * @returns {boolean} Processed or not
 */
export default function tozan(directory: string, options: {
    database: string;
    algorithm: string;
    ignoreDotFiles: boolean;
}): boolean;
export function openSSLVersion(command: string): string | boolean;
