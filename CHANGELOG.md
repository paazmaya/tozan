# Version history for tozan

This changelog covers the version history and possible upcoming changes.
It follows the guidance from https://keepachangelog.com/en/1.0.0/.

## `v8.0.0` (2024-12-21)

- Minimum supported Node.js version lifted from `18.12.0` to `22.11.0`
- Most notable dependency, `better-sqlite3` has been upgraded from `8.4.0` to `11.7.0` 

## `v7.0.1` (2023-06-28)

- Another try with wildcard exports

## `v7.0.0` (2023-06-28)

- Minimum supported Node.js version lifted from `16.13.0` to `18.12.0`
- Typescript type dictionaries were not generated properly
- Expose additional methods from the `lib` directory again

## `v6.1.0` (2023-06-05)

- Start testing against Node.js v18
- Update dependencies, most notably [major version of `better-sqlite3`](https://github.com/WiseLibs/better-sqlite3/releases/tag/v8.0.0)
- Testing with [Deepsource](https://app.deepsource.com/gh/paazmaya/tozan/)

## `v6.0.0` (2021-11-24)

- Converted to EcmaScript Modules from CommonJS, as in `import` instead of `require`
- Minimum supported Node.js version lifted from `10.13.0` to `16.13.0`
- Stop using Travis CI for testing, as there are three others also in use (Appveyor, CircleCI, and GitHub Actions)

## `v5.1.3` (2021-05-23)
- Update dependencies to keep them up to date

## `v5.1.2` (2021-02-16)
- Start using GitHub Actions, since Travis has now stricter limitations on usage
- Update Node.js version to 15 (and later to 16 when possible) at Circle CI

## `v5.1.1` (2020-08-24)
- More utility methods in separate files for reuse elsewhere
- `npm audit fix` and other security issue fixes on dependencies

## `v5.1.0` (2020-06-07)
- Allow to specify table creation SQL phrase when used programmatically, see `lib/create-database.js` for `createDatabase()` methods second argument

## `v5.0.0` (2020-06-03)
- Run tests also against Node.js version 14. Now versions 10 (Travis), 12 (AppVeyor), and 14 (CircleCI) of Node.js are covered
- Minimum Node.js version lifted from `8.11.1` to `10.13.0`

## `v4.0.1` (2019-12-09)
- Hashing algorithm was shown as `undefined` when used via command line, but was still functional
- Updated dependencies :tophat:
- Still had issues with escaping special file names and made it better...

## `v4.0.0` (2019-09-14)
- For greater control, and possible performance benefits, user can now define the hashing algorithm #49
- *Breaking change* due to the default hashing algorithm being now SHA1 for better compatibility with older OpenSSL installations

## `v3.2.0` (2019-09-13)
- Inform user via `console.log()` about the database table column name migration when it is done
- Code refactoring for better test coverage
- Better handling of filenames that contain special characters, such as `$`

## `v3.1.0` (2019-05-29)
- TypeScript types added
- Dependencies up to date once again, now using `renovate` to help in that

## `v3.0.0` (2018-12-09)
- Use [`npm-shrinkwrap.json`](https://docs.npmjs.com/files/shrinkwrap.json) for locking the working set of 3rd party dependencies
- Allow choosing with [SHA hashing function](https://en.wikipedia.org/wiki/SHA-2) to use, one of `256`, `384`, or `512`. Defaults to `256` making it backward compatible
- Database table column `sha256` is automatically renamed to `hash`

## `v2.1.0` (2018-08-09)
- Switched from using `node-sqlite3` to `better-sqlite3` #9

## `v2.0.0` (2018-06-13)
- Better safe guard against existing files which cannot be accessed
- Minimum supported and tested Node.js version is now `v8.11.1`. Earlier versions might work, but are not tested
- Update `sqlite3` to version `4.0.0`, among other minor dependency updates :tophat:
- Started using `fossa.io` to check dependency licenses

## `v1.0.1` (2017-08-17)
- Update `sqlite3` to version `3.1.9` which is the first to support Node.js v8

## `v1.0.0` (2017-06-28)
- Drop `hasha` from dependencies and use [OpenSSL](https://www.openssl.org/) directly, but it needs to be in `PATH`
- Safe guard against non existing files when getting meta information
- Remove possible duplicates (due to symbolic linking) from the file list
- Going to first major release as testing coverage is enough

## `v0.2.0` (2017-06-24)
- Update database row if the file meta data was already stored
- Show progress bar with percentage and file count
- No more verbose command line option since the progress bar gives enough information

## `v0.1.1` (2017-06-24)
- Was missing `README.md` from package and hence from [the npm page](https://www.npmjs.com/package/tozan)
- Now prints the file name when verbose, as advertised

## `v0.1.0` (2017-06-24)
- Gets the job simply done, hence first release
