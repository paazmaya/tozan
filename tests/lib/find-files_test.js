/**
 * tozan
 * https://github.com/paazmaya/tozan
 * Index filesystem by creating metadata database
 *
 * Copyright (c) Juga Paazmaya <paazmaya@yahoo.com> (https://paazmaya.fi)
 * Licensed under the MIT license
 */

const path = require('path');

const tape = require('tape');

const findFiles = require('../../lib/find-files');

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
  test.equal(list.length, 6);
});

tape('findFiles::canAccessFile - cannot access file', (test) => {
  test.plan(1);

  const output = findFiles._canAccessFile('non existing thing');
  test.notOk(output);
});
