# tozan

> Index filesystem by creating metadata database

[![Build Status](https://travis-ci.org/paazmaya/tozan.svg?branch=master)](https://travis-ci.org/paazmaya/tozan)
[![Windows build status](https://ci.appveyor.com/api/projects/status/bd4af4tkql7usxwq/branch/master?svg=true)](https://ci.appveyor.com/project/paazmaya/tozan/branch/master)
[![codecov](https://codecov.io/gh/paazmaya/tozan/branch/master/graph/badge.svg)](https://codecov.io/gh/paazmaya/tozan)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fpaazmaya%2Ftozan.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fpaazmaya%2Ftozan?ref=badge_shield)
[![Dependencies Status](https://david-dm.org/paazmaya/tozan/status.svg)](https://david-dm.org/paazmaya/tozan)

Go trough files under the given directory, generate SHA-256 has out of their content, and store the hash to a SQLite database.
In case the given file was already listed in the database, its entry will be updated.

Please note that the minimum supported version of [Node.js](https://nodejs.org/en/) is `8.11.1`, which is [the active Long Term Support (LTS) version](https://github.com/nodejs/Release#release-schedule).

## Background for the name

The name of the project (Tozan, 当山) is for honouring the legacy of a certain master from the Ryukyu archipelago who contributed to the martial arts that we today know as **karate** and **ryukyu kobujutsu**.

## Installation

Install via `npm`, as a global command line utility:

```sh
[sudo] npm install --global tozan
```

The `sha256` hash is calculated with [OpenSSL](https://www.openssl.org/), specifically with its [`openssl dgst`](https://wiki.openssl.org/index.php/Manual:Dgst(1)) command, hence it needs to be available in the `PATH`.

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
  -i, --ignore-dot-files  Ignore files and directories that begin with a dot

Version 1.0.0
```

For more information on the possible database file options, [see `sqlite3` documentation for the `filename` parameter](https://github.com/mapbox/node-sqlite3/wiki/API#new-sqlite3databasefilename-mode-callback).

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
