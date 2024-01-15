/**
 * tozan
 * https://github.com/paazmaya/tozan
 * Index filesystem by creating metadata database
 *
 * Copyright (c) Juga Paazmaya <paazmaya@yahoo.com> (https://paazmaya.fi)
 * Licensed under the MIT license
 */

import path from 'node:path';
import {
  fileURLToPath
} from 'url';

import tape from 'tape';

import findFiles from '../../lib/find-files.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

tape('findFiles - interface', (test) => {
  test.plan(2);

  test.equal(typeof findFiles, 'function', 'is a function');
  test.equal(findFiles.length, 2);
});

tape('findFiles - finds all test files', (test) => {
  test.plan(2);

  const options = {
    ignoreDotFiles: true
  };
  const list = findFiles(path.join('tests', 'fixtures'), options);
  test.equal(list.length, 3);
  test.ok(list.indexOf(path.join('tests', 'fixtures', '$data.exp')) !== -1);
});

tape('findFiles - finds all test files and a dot file', (test) => {
  test.plan(1);

  const options = {
    ignoreDotFiles: false
  };
  const list = findFiles(path.join('tests', 'fixtures'), options);
  test.equal(list.length, 4);
});

tape('findFiles - finds files under sub folder', (test) => {
  test.plan(1);

  const options = {
    ignoreDotFiles: false
  };
  const list = findFiles(__dirname, options);
  test.equal(list.length, 7);
});
