#!/usr/bin/env node

/**
 * tozan
 * https://github.com/paazmaya/tozan
 * Index filesystem by creating metadata database
 *
 * Copyright (c) Juga Paazmaya <paazmaya@yahoo.com> (https://paazmaya.fi)
 * Licensed under the MIT license
 */

const fs = require('fs'),
  path = require('path');

const optionator = require('optionator');

const tozan = require('../index');
const constants = require('../lib/constants');

let pkg;

try {
  const packageJson = fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8');

  pkg = JSON.parse(packageJson);
}
catch (error) {
  console.error('Could not read/parse "package.json", quite strange...');
  console.error(error);
  process.exit(1);
}

const optsParser = optionator({
  prepend: `${pkg.name} [options] <directory>`,
  append: `Version ${pkg.version}`,
  options: [
    {
      option: 'help',
      alias: 'h',
      type: 'Boolean',
      description: 'Help and usage instructions'
    },
    {
      option: 'version',
      alias: 'V',
      type: 'Boolean',
      description: 'Version number'
    },
    {
      option: 'database',
      alias: 'D',
      type: 'String',
      default: constants.DEFAULT_DATABASE,
      description: 'SQLite database to use'
    },
    {
      option: 'check-integrity',
      alias: 'C',
      type: 'Boolean',
      description: 'Use database to check integrity of the files'
    },
    {
      option: 'hash',
      alias: 'H',
      type: 'String',
      default: constants.DEFAULT_ALG,
      description: 'Hashing algorithm understood by OpenSSL'
    },
    {
      option: 'ignore-dot-files',
      alias: 'i',
      type: 'Boolean',
      description: 'Ignore files and directories that begin with a dot'
    }
  ]
});

let opts;

try {
  opts = optsParser.parse(process.argv);
}
catch (error) {
  console.error(error.message);
  console.log(optsParser.generateHelp());
  process.exit(1);
}

if (opts.version) {
  console.log(pkg.version);
  process.exit(0);
}

if (opts.help) {
  console.log(optsParser.generateHelp());
  process.exit(0);
}

if (opts._.length !== 1) {
  console.error('Directory was not specified');
  console.log(optsParser.generateHelp());
  process.exit(1);
}

if (opts.checkIntegrity && opts.database === constants.DEFAULT_ALG) {
  console.error('Checking integrity was requested but without database file');
  process.exit(1);
}

const directory = path.resolve(opts._[0]);

try {
  fs.accessSync(directory);
}
catch (error) {
  console.error(`Directory "${directory}" does not exist`);
  process.exit(1);
}

// Fire away
tozan(directory, {
  ignoreDotFiles: typeof opts.ignoreDotFiles === 'boolean' ?
    opts.ignoreDotFiles :
    false,
  algorithm: typeof opts.hash === 'string' ?
    opts.hash :
    null,
  checkIntegrity: typeof opts.checkIntegrity === 'boolean' ?
    opts.checkIntegrity :
    false,
  database: typeof opts.database === 'string' ?
    opts.database :
    null
});
