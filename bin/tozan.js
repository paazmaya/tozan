#!/usr/bin/env node

/**
 * tozan
 * https://github.com/paazmaya/tozan
 * Index filesystem by creating metadata database
 *
 * Copyright (c) Juga Paazmaya <paazmaya@yahoo.com> (https://paazmaya.fi)
 * Licensed under the MIT license
 */

import fs from 'node:fs';
import path from 'node:path';

import optionator from 'optionator';

import tozan from '../index.js';
import constants from '../lib/constants.js';

let pkg;

try {
  const packageJson = fs.readFileSync(new URL('../package.json', import.meta.url), 'utf8');

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
      description: 'Version number',
      example: '-V'
    },
    {
      option: 'database',
      alias: 'D',
      type: 'String',
      default: constants.DEFAULT_DATABASE,
      description: 'SQLite database to use'
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

const directory = path.resolve(opts._[0]);

try {
  fs.accessSync(directory);
}
catch {
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
  database: typeof opts.database === 'string' ?
    opts.database :
    null
});
