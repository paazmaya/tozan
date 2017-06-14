# tozan

> Index filesystem by creating metadata database, focusing on media files

[![Build Status](https://travis-ci.org/paazmaya/tozan.svg?branch=master)](https://travis-ci.org/paazmaya/tozan)
[![Windows build status](https://ci.appveyor.com/api/projects/status/-/branch/master?svg=true)](https://ci.appveyor.com/project/paazmaya/tozan/branch/master)
[![codecov](https://codecov.io/gh/paazmaya/tozan/branch/master/graph/badge.svg)](https://codecov.io/gh/paazmaya/tozan)

Go trough files under the given directory, generate SHA-256 has out of their content, and store the hash to a SQLite database.

Please note that the minimum supported version of [Node.js](https://nodejs.org/en/) is `6.9.5` (LTS).


## Installation

```sh
[sudo] npm install --global tozan
```

## Command line options

```sh
tozan --help
```

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

* `v0.1.0` (2017-06)
  - Gets the job simply done, hence first release

## License

Licensed under [the MIT license](LICENSE).

Copyright (c) [Juga Paazmaya](https://paazmaya.fi) <paazmaya@yahoo.com>
