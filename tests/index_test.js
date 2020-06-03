/**
 * tozan
 * https://github.com/paazmaya/tozan
 * Index filesystem by creating metadata database
 *
 * Copyright (c) Juga Paazmaya <paazmaya@yahoo.com> (https://paazmaya.fi)
 * Licensed under the MIT license
 */

const tape = require('tape');

const tozan = require('../index');
const constants = require('../lib/constants');

tape('a function with two parameters is exported', (test) => {
  test.plan(2);

  test.equal(typeof tozan, 'function', 'is a function');
  test.equal(tozan.length, 2, 'has two parameters');
});

tape('openSSLVersion - interface', (test) => {
  test.plan(2);

  test.equal(typeof tozan._openSSLVersion, 'function', 'is a function');
  test.equal(tozan._openSSLVersion.length, 1);
});

tape('openSSLVersion - gets version', (test) => {
  test.plan(1);

  const version = tozan._openSSLVersion(constants.OPENSSL_VERSION);

  test.equal(version.search(/(LibreSSL|OpenSSL)/u), 0, 'has version string');
});

tape('openSSLVersion - false when no version', (test) => {
  test.plan(1);

  const version = tozan._openSSLVersion('nothing-to-be-found-here');

  test.notOk(version, 'has no version');
});
