export default generateHash;
/**
 * Get the meta data for the given file.
 *
 * @param {string} filepath  File path
 * @param {string} algorithm Hash algorithm to use
 * @returns {string|boolean} Generated hash of the given file or false when failed
 */
declare function generateHash(filepath: string, algorithm: string): string | boolean;
