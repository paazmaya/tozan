# tozan

> Index filesystem by creating metadata database

[![Build Status](https://travis-ci.org/paazmaya/tozan.svg?branch=master)](https://travis-ci.org/paazmaya/tozan)
[![Windows build status](https://ci.appveyor.com/api/projects/status/bd4af4tkql7usxwq/branch/master?svg=true)](https://ci.appveyor.com/project/paazmaya/tozan/branch/master)
[![CircleCI](https://circleci.com/gh/paazmaya/tozan.svg?style=svg)](https://circleci.com/gh/paazmaya/tozan)
[![codecov](https://codecov.io/gh/paazmaya/tozan/branch/master/graph/badge.svg)](https://codecov.io/gh/paazmaya/tozan)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fpaazmaya%2Ftozan.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fpaazmaya%2Ftozan?ref=badge_shield)
[![Dependencies Status](https://david-dm.org/paazmaya/tozan/status.svg)](https://david-dm.org/paazmaya/tozan)
[![Total alerts](https://img.shields.io/lgtm/alerts/g/paazmaya/tozan.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/paazmaya/tozan/alerts/)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=paazmaya_tozan&metric=code_smells)](https://sonarcloud.io/dashboard?id=paazmaya_tozan)

Go trough the files under a given directory, generate a hash of each of the files (which by default is SHA1), and store the hashes to a SQLite database (which by default is in memory).
In case the given file was already listed in the database, its entry will be updated.

Please note that the minimum supported version of [Node.js](https://nodejs.org/en/) is `10.13.0`, which is [the active Long Term Support (LTS) version](https://github.com/nodejs/Release#release-schedule).

## Background for the name

The name of the project (Tozan, 当山) is for honouring the legacy of a certain master from the Ryukyu archipelago, Japan, who contributed to the martial arts that we today know as **karate** and **ryukyu kobujutsu**.

## Installation

Install via `npm`, as a global command line utility:

```sh
[sudo] npm install --global tozan
```

Please note that while in Linux and with `sudo`, some of the dependencies might fail to install,
which can be fixed in some case by `sudo npm install --global --unsafe-perm tozan`.
See more details about the `unsafe-perm` option at [docs.npmjs.com](https://docs.npmjs.com/misc/config#unsafe-perm).

The SHA hash is calculated with [OpenSSL](https://www.openssl.org/), specifically with its [`openssl dgst`](https://wiki.openssl.org/index.php/Manual:Dgst(1)) command, hence it needs to be available in the `PATH`.

The existence of OpenSSL can be checked with the command `openssl version`, which should output something similar to (example in macOS):

```sh
LibreSSL 2.8.3
```

In case the installed OpenSSL does not support the default hashing algorithm (SHA-256),
the hash algorithm need to be defined via command line options.
The supported digest algorithms can be seen with the command `openssl list -digest-algorithms`.

## Command line options

Easiest way to see the supported options, is to execute with help output:

```sh
tozan --help
```

The most recent major version has the similar output to the following:

```sh
tozan [options] <directory>

  -h, --help              Help and usage instructions
  -V, --version           Version number
  -D, --database String   SQLite database to use - default: :memory:
  -H, --hash String       Hashing algorithm understood by OpenSSL - default: sha1
  -i, --ignore-dot-files  Ignore files and directories that begin with a dot

Version 4.0.0
```

For more information on the possible database file options, [see `sqlite3` documentation for the `filename` parameter](https://github.com/JoshuaWise/better-sqlite3/wiki/API#new-databasepath-options).

## Using programmatically

First install as a dependency:

```sh
npm install --save tozan
```

Use in a Node.js script:

```js
const tozan = require('tozan');

tozan('directory-for-scanning', {
  ignoreDotFiles: true, // Ignore files and directories that begin with a dot
  algorithm: 'sha512' // Hash algorithm to use
  database: 'tozan-meta.sqlite' // Possible database file to be used with SQLite
});
```

Clearest example of the usage is in [the command line interface](./bin/tozan.js).

## Speed comparison between hashing algorithms

These numbers are from running `time node bin/tozan.js --hash [algorithm] node_modules` with different algorithms.
At the time the `node_modules` folder contained total of 11410 files.

Algorithm     | Time
--------------|------------
`md4`         | 1m 11.409s
`md5`         | 1m 16.059s
`sha1`        | 1m 13.361s
`sha256`      | 1m 12.263s
`sha384`      | 1m 15.404s
`sha512`      | 1m 11.746s
`streebog512` | 1m 11.888s
`whirlpool`   | 1m 8.089s

Looks like the differences are not that big. Feel free to add and update the comparison with
more data and more alternatives.

## Contributing

First thing to do is to file [an issue](https://github.com/paazmaya/tozan/issues).
Then possibly open a Pull Request for solving the given issue.
[ESLint](http://eslint.org/) is used for linting the code, please use it by doing:

```sh
npm install
npm run lint
```

Unit tests are written with [`tape`](https://github.com/substack/tape) and can be executed with `npm test`.
Code coverage is inspected with [`nyc`](https://github.com/istanbuljs/nyc) and
can be executed with `npm run coverage` after running `npm test`.
Please make sure it is over 90% at all times.

## Version history

* `v5.1.2` (2021-02-16)
  - Start using GitHub Actions, since Travis has now stricter limitations on usage
  - Update Node.js version to 15 (and later to 16 when possible) at Circle CI
* `v5.1.1` (2020-08-24)
  - More utility methods in separate files for reuse elsewhere
  - `npm audit fix` and other security issue fixes on dependencies
* `v5.1.0` (2020-06-07)
  - Allow to specify table creation SQL phrase when used programmatically, see `lib/create-database.js` for `createDatabase()` methods second argument
* `v5.0.0` (2020-06-03)
  - Run tests also against Node.js version 14. Now versions 10 (Travis), 12 (AppVeyor), and 14 (CircleCI) of Node.js are covered
  - Minimum Node.js version lifted from `8.11.1` to `10.13.0`
* `v4.0.1` (2019-12-09)
  - Hashing algorithm was shown as `undefined` when used via command line, but was still functional
  - Updated dependencies :tophat:
  - Still had issues with escaping special file names and made it better...
* `v4.0.0` (2019-09-14)
  - For greater control, and possible performance benefits, user can now define the hashing algorithm #49
  - *Breaking change* due to the default hashing algorithm being now SHA1 for better compatibility with older OpenSSL installations
* `v3.2.0` (2019-09-13)
  - Inform user via `console.log()` about the database table column name migration when it is done
  - Code refactoring for better test coverage
  - Better handling of filenames that contain special characters, such as `$`
* `v3.1.0` (2019-05-29)
  - TypeScript types added
  - Dependencies up to date once again, now using `renovate` to help in that
* `v3.0.0` (2018-12-09)
  - Use [`npm-shrinkwrap.json`](https://docs.npmjs.com/files/shrinkwrap.json) for locking the working set of 3rd party dependencies
  - Allow choosing with [SHA hashing function](https://en.wikipedia.org/wiki/SHA-2) to use, one of `256`, `384`, or `512`. Defaults to `256` making it backward compatible
  - Database table column `sha256` is automatically renamed to `hash`
* `v2.1.0` (2018-08-09)
  - Switched from using `node-sqlite3` to `better-sqlite3` #9
* `v2.0.0` (2018-06-13)
  - Better safe guard against existing files which cannot be accessed
  - Minimum supported and tested Node.js version is now `v8.11.1`. Earlier versions might work, but are not tested
  - Update `sqlite3` to version `4.0.0`, among other minor dependency updates :tophat:
  - Started using `fossa.io` to check dependency licenses
* `v1.0.1` (2017-08-17)
  - Update `sqlite3` to version `3.1.9` which is the first to support Node.js v8
* `v1.0.0` (2017-06-28)
  - Drop `hasha` from dependencies and use [OpenSSL](https://www.openssl.org/) directly, but it needs to be in `PATH`
  - Safe guard against non existing files when getting meta information
  - Remove possible duplicates (due to symbolic linking) from the file list
  - Going to first major release as testing coverage is enough
* `v0.2.0` (2017-06-24)
  - Update database row if the file meta data was already stored
  - Show progress bar with percentage and file count
  - No more verbose command line option since the progress bar gives enough information
* `v0.1.1` (2017-06-24)
  - Was missing `README.md` from package and hence from [the npm page](https://www.npmjs.com/package/tozan)
  - Now prints the file name when verbose, as advertised
* `v0.1.0` (2017-06-24)
  - Gets the job simply done, hence first release

## License

Licensed under [the MIT license](LICENSE).

Copyright (c) [Juga Paazmaya](https://paazmaya.fi) <paazmaya@yahoo.com>

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fpaazmaya%2Ftozan.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fpaazmaya%2Ftozan?ref=badge_large)
