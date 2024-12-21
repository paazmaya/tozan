# tozan

> Index filesystem by creating metadata database

[![Windows build status](https://ci.appveyor.com/api/projects/status/bd4af4tkql7usxwq/branch/master?svg=true)](https://ci.appveyor.com/project/paazmaya/tozan/branch/master)
[![CircleCI](https://circleci.com/gh/paazmaya/tozan.svg?style=svg)](https://circleci.com/gh/paazmaya/tozan)
[![Node.js v22 CI](https://github.com/paazmaya/tozan/actions/workflows/linting-and-unit-testing.yml/badge.svg)](https://github.com/paazmaya/tozan/actions/workflows/linting-and-unit-testing.yml)
[![codecov](https://codecov.io/gh/paazmaya/tozan/branch/master/graph/badge.svg)](https://codecov.io/gh/paazmaya/tozan)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fpaazmaya%2Ftozan.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fpaazmaya%2Ftozan?ref=badge_shield)
[![DeepSource](https://deepsource.io/gh/paazmaya/tozan.svg/?label=active+issues&show_trend=true&token=5S_Ijf0eG_jzMUpAb3Dwn7CU)](https://deepsource.io/gh/paazmaya/tozan/?ref=repository-badge)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=paazmaya_tozan&metric=code_smells)](https://sonarcloud.io/dashboard?id=paazmaya_tozan)
[![OpenSSF Scorecard](htt‌ps://api.securityscorecards.dev/projects/github.com/paazmaya/tozan/badge)](htt‌ps://securityscorecards.dev/viewer/?uri=github.com/paazmaya/tozan)

Go trough the files under a given directory, generate a hash of each of the files (which by default is SHA1), and store the hashes to a SQLite database (which by default is in memory).
In case the given file was already listed in the database, its entry will be updated.

Please note that the minimum supported version of [Node.js](https://nodejs.org/en/) is `22.11.0`, which is [the active Long Term Support (LTS) version](https://github.com/nodejs/Release#release-schedule).

## Background for the project name

The name of the project (Tozan, 当山) is for honouring the legacy of a certain master from the Ryukyu archipelago, Japan, who contributed to the martial arts that we today know as **karate** and **ryukyu kobujutsu**.

[Read more about why these martial arts are important for me at `karatejukka.fi`.](https://karatejukka.fi)

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

Version 6.0.0
```

For more information on the possible database file options, [see `sqlite3` documentation for the `filename` parameter](https://github.com/JoshuaWise/better-sqlite3/wiki/API#new-databasepath-options).

## Using programmatically

First install as a dependency:

```sh
npm install --save tozan
```

Use in a Node.js script:

```js
import tozan from 'tozan';

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

[Changes happening across different versions and upcoming changes are tracked in the `CHANGELOG.md` file.](CHANGELOG.md)

## License

Licensed under [the MIT license](LICENSE).

Copyright (c) [Juga Paazmaya](https://paazmaya.fi) <paazmaya@yahoo.com>

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fpaazmaya%2Ftozan.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fpaazmaya%2Ftozan?ref=badge_large)
